import ForgotPasswordForm from "./ForgotPasswordForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Forgot password · Karna Technical",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-5 py-10 dark:bg-[#0b0e14]">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-100/60 blur-3xl dark:bg-red-950/20" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-slate-200/70 blur-3xl dark:bg-white/5" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
