"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const SUPPORTED_TYPES = ["invite", "recovery", "magiclink", "signup"] as const;

function ConfirmHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function run() {
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const code = searchParams.get("code");

      try {
        // Format 1: direct token link (?token_hash=…&type=…).
        if (
          token_hash &&
          type &&
          (SUPPORTED_TYPES as readonly string[]).includes(type)
        ) {
          const { error } = await supabase.auth.verifyOtp({
            type: type as (typeof SUPPORTED_TYPES)[number],
            token_hash,
          });

          if (error) {
            throw error;
          }

          router.replace("/update-password");
          return;
        }

        // Format 2: PKCE code (?code=…) from Supabase's own verify endpoint.
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }

          router.replace("/update-password");
          return;
        }

        // Format 3: session delivered in the URL hash (#access_token=…).
        // The browser client picks it up automatically on init — just wait
        // a beat, then check for a session.
        await new Promise((resolve) => setTimeout(resolve, 800));
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          router.replace("/update-password");
          return;
        }

        throw new Error("No valid session or token found.");
      } catch {
        setFailed(true);
        router.replace("/update-password?error=expired");
      }
    }

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed) {
    return (
      <div className="flex w-full max-w-md items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-9 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-[#11151d] dark:text-slate-400">
        <KeyRound className="h-5 w-5" />
        Redirecting...
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-9 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-[#11151d] dark:text-slate-400">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      Verifying your link...
    </div>
  );
}

/**
 * Verifies Supabase email links (invite + recovery) and forwards to the
 * set-password page. Accepts every link shape Supabase can produce, so the
 * default email templates work with no panel edits:
 *  - ?token_hash=…&type=… (custom template pointing here directly)
 *  - ?code=… (PKCE handoff from Supabase's verify endpoint)
 *  - #access_token=… (hash session from Supabase's verify endpoint)
 */
export default function AuthConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4 py-12 dark:bg-[#0b0e14]">
      <Suspense
        fallback={
          <div className="flex w-full max-w-md items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-9 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-[#11151d] dark:text-slate-400">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Verifying your link...
          </div>
        }
      >
        <ConfirmHandler />
      </Suspense>
    </div>
  );
}
