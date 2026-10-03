import Link from "next/link";
import { AlertCircle, ArrowLeft, Database, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-5 py-10 dark:bg-[#0b0e14]">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-100/60 blur-3xl dark:bg-red-950/20" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-slate-200/70 blur-3xl dark:bg-white/5" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Karna Technical
        </Link>
        {isSupabaseConfigured ? (
          <LoginForm />
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-[#11151d] sm:p-9">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Database className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Setup required</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight">Connect the secure workspace</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Add the Supabase environment variables and run the included database migration before signing in.
            </p>
            <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-sm dark:bg-white/5">
              <p className="flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Required variables
              </p>
              <code className="block text-xs text-slate-600 dark:text-slate-300">NEXT_PUBLIC_SUPABASE_URL</code>
              <code className="block text-xs text-slate-600 dark:text-slate-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>The dashboard fails closed until authentication and the private database are connected.</span>
            </div>
            <Link
              href="/"
              className="mt-7 block text-center text-xs font-semibold text-slate-500 transition hover:text-primary dark:text-slate-400"
            >
              Return to public website
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
