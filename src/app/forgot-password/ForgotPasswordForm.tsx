"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, LoaderCircle, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@/lib/validation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsed = forgotPasswordSchema.safeParse({ email });

    if (!parsed.success) {
      setError(parsed.error.flatten().fieldErrors.email?.[0] ?? "Enter a valid email address.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });

    setLoading(false);

    if (resetError) {
      console.error("Password reset failed:", resetError.message);
      const detail = resetError.message.toLowerCase();

      if (detail.includes("redirect")) {
        setError(
          "The reset link could not be sent because this app address is not allowlisted in Supabase. Ask the workspace owner to add /auth/confirm to Redirect URLs under Authentication → URL Configuration.",
        );
      } else if (detail.includes("rate limit") || detail.includes("too many") || detail.includes("after a while")) {
        setError("Too many reset attempts. Wait a few minutes and try again.");
      } else {
        setError("The reset link could not be sent. Please try again.");
      }

      return;
    }

    // Same message either way — never reveal whether the email is registered.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Check your inbox</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          If an owner or HR account exists for <span className="font-bold">{email}</span>, a
          password-reset link is on its way. It expires in 24 hours — also check spam.
        </p>
        <div className="mt-7 space-y-3">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Use a different email
          </button>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-red-950/40">
          <KeyRound className="h-6 w-6" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Account recovery</p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight">Forgot password?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter your work email and we&apos;ll send you a link to set a new password.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Work email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/15 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-primary dark:text-slate-400"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
