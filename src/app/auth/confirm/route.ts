import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUPPORTED_TYPES = ["invite", "recovery", "magiclink", "signup"] as const;

type FailReason = "rejected" | "invalid" | "missing";

function expiredRedirect(request: NextRequest, reason: FailReason) {
  const errorRedirect = request.nextUrl.clone();
  errorRedirect.pathname = "/update-password";
  errorRedirect.search = "";
  errorRedirect.searchParams.set("error", "expired");
  errorRedirect.searchParams.set("reason", reason);
  return NextResponse.redirect(errorRedirect);
}

/**
 * Supabase rejects links at its hosted /verify step for two very different
 * reasons, but both arrive as ?error=…&error_description=…:
 *  - the token expired or was already used (incl. mail-app prefetch burns)
 *  - the redirect was genuinely denied (URL not allowlisted)
 * Map expiry/reuse to "invalid" so the UI doesn't blame URL configuration.
 */
function classifyUpstreamError(error: string, description: string | null, code: string | null): FailReason {
  const haystack = `${error} ${code ?? ""} ${description ?? ""}`.toLowerCase();

  if (
    haystack.includes("expir") ||
    haystack.includes("already") ||
    haystack.includes("used") ||
    haystack.includes("consumed") ||
    haystack.includes("invalid") ||
    haystack.includes("not found")
  ) {
    return "invalid";
  }

  return "rejected";
}

function safeNextPath(value: string | null) {
  // Only allow same-origin paths — never follow an off-site `next` value.
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/update-password";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Supabase's hosted /verify step appends these when IT rejects the link
  // (e.g. redirect URL not allowlisted in Auth → URL Configuration).
  const upstreamError = searchParams.get("error");
  const upstreamCode = searchParams.get("error_code");
  const upstreamDescription = searchParams.get("error_description");
  // Older email templates use `token=` instead of `token_hash=`.
  const token_hash = searchParams.get("token_hash") ?? searchParams.get("token");
  const type = searchParams.get("type");
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  // Never leak single-use tokens into the destination URL.
  redirectTo.search = "";

  if (upstreamError) {
    // Log the real cause for Vercel Runtime Logs / dev terminal.
    // Never includes tokens — only Supabase's error summary.
    console.error("auth/confirm rejected upstream", {
      error: upstreamError,
      code: upstreamCode,
      description: upstreamDescription,
    });
    return expiredRedirect(
      request,
      classifyUpstreamError(upstreamError, upstreamDescription, upstreamCode),
    );
  }

  const supabase = await createClient();

  // Format 1: direct token link (?token_hash=…&type=…).
  if (token_hash && type && (SUPPORTED_TYPES as readonly string[]).includes(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }

    console.error("auth/confirm verifyOtp failed", { type, message: error.message });
    return expiredRedirect(request, "invalid");
  }

  // Format 2: PKCE code (?code=…) from Supabase's verify endpoint.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }

    console.error("auth/confirm exchangeCodeForSession failed", { message: error.message });
    return expiredRedirect(request, "invalid");
  }

  console.error("auth/confirm missing credentials", {
    hasToken: Boolean(token_hash),
    hasType: Boolean(type),
    hasCode: Boolean(code),
  });
  return expiredRedirect(request, "missing");
}
