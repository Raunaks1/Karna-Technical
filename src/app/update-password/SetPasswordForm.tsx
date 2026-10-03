"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SetPasswordForm({ linkError }: { linkError: string | null }) {
  const router = useRouter();
  const [checking, setChecking] = useState(!linkError);
  const [hasSession, setHasSession] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (linkError) {
      return;
    }

    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data }) => {
        setHasSession(Boolean(data.user));
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [linkError]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError("Your password could not be set. The link may have expired — ask the owner to re-invite you.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    await supabase.auth.signOut();
    router.refresh();
  }

  if (linkError || (!checking && !hasSession)) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-red-950/40">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">This link isn&apos;t valid</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {linkError === "expired"
            ? "The invite link has expired or was already used. Ask the workspace owner to send you a fresh invite."
            : "Open the invite link from your email to set your password. If you already set it, sign in below."}
        </p>
        <Link
          href="/login"
          className="mt-7 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="flex w-full max-w-md items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white p-9 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-[#11151d] dark:text-slate-400">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Verifying your invite...
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Password set</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your account is ready. Sign in with your email and new password.
        </p>
        <Link
          href="/login"
          className="mt-7 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white transition hover:bg-primary-hover"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30";

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-red-950/40">
          <KeyRound className="h-6 w-6" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Set a new password</p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight">Choose your password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Set a password to activate your account or finish resetting it.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          New password
          <div className="relative mt-2">
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className={inputClass}
              required
              minLength={8}
              maxLength={72}
            />
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Confirm password
          <input
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat the new password"
            autoComplete="new-password"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
            required
            minLength={8}
            maxLength={72}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/15 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {loading ? "Setting password..." : "Set password"}
        </button>
      </form>
    </div>
  );
}
