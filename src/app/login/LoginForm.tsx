"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("The email or password is not recognized.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-primary dark:bg-red-950/40">
          <KeyRound className="h-6 w-6" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Authorized access</p>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Sign in with an owner or HR administrator account to manage employee records.
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
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/15 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Signing in..." : "Sign in securely"}
        </button>
        <div className="text-center">
          <Link href="/forgot-password" className="text-xs font-bold text-slate-500 transition hover:text-primary dark:text-slate-400">
            Forgot password?
          </Link>
        </div>
      </form>

      <div className="mt-7 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:bg-white/5 dark:text-slate-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>Accounts are invite-only. Public visitors and employees cannot access this workspace.</span>
      </div>

      <Link
        href="/"
        className="mt-7 block text-center text-xs font-semibold text-slate-500 transition hover:text-primary dark:text-slate-400"
      >
        Return to public website
      </Link>
    </div>
  );
}
