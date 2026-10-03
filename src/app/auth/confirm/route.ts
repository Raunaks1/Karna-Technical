import { type EmailOtpType } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const SUPPORTED_TYPES: EmailOtpType[] = ["invite", "recovery"];

/**
 * Handles Supabase email links (invite + recovery). Verifies the one-time
 * token, establishes a session via cookies, then sends the user to the
 * set-password page. Invalid/expired links land there with an error flag.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));

  if (!token_hash || !type || !SUPPORTED_TYPES.includes(type)) {
    return redirectTo("/update-password?error=invalid");
  }

  const response = NextResponse.redirect(new URL("/update-password", request.url));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return redirectTo("/update-password?error=invalid");
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({ type, token_hash });

  if (error) {
    return redirectTo("/update-password?error=expired");
  }

  return response;
}
