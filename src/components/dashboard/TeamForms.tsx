"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, Copy, KeyRound, LoaderCircle, Mail, Send, Sparkles } from "lucide-react";
import { inviteMember, resendMemberInvite, sendMemberPasswordResetLink } from "@/app/dashboard/team/actions";
import type { InviteMemberFormState } from "@/lib/validation";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30";

function FieldError({ message }: { message?: string[] }) {
  if (!message?.[0]) {
    return null;
  }

  return <p className="mt-1.5 text-xs font-medium text-primary">{message[0]}</p>;
}

function InviteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/15 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      {pending ? "Sending invite..." : "Send Invitation Link"}
    </button>
  );
}

export function InviteMemberForm() {
  const [state, formAction] = useActionState(inviteMember, {} as InviteMemberFormState);
  const [copied, setCopied] = useState(false);

  async function handleCopy(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard write failure
    }
  }

  return (
    <div className="space-y-6">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
              <Check className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                {state.success}
              </p>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                The member can click the magic link in their inbox to set up their password directly.
              </p>
            </div>
          </div>

          {state.inviteLink && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-white/80 p-2.5 dark:bg-black/30">
              <div className="min-w-0 flex-1 truncate font-mono text-xs text-slate-600 dark:text-slate-300">
                {state.inviteLink}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(state.inviteLink!)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          )}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-3">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Full name
            <input
              name="fullName"
              placeholder="e.g. Priya Nair"
              className={inputClass}
              required
              maxLength={120}
            />
            <FieldError message={state.fieldErrors?.fullName} />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Work email
            <input
              name="email"
              type="email"
              placeholder="priya@karnatechnical.com"
              autoComplete="off"
              className={inputClass}
              required
              maxLength={160}
            />
            <FieldError message={state.fieldErrors?.email} />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Role permission
            <select name="role" defaultValue="hr" className={inputClass} required>
              <option value="hr">HR Administrator (Manpower & Review)</option>
              <option value="owner">Workspace Owner (Full Access)</option>
              <option value="marketing">Marketing Executive (View only · Feedback access)</option>
            </select>
            <FieldError message={state.fieldErrors?.role} />
          </label>
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Zero-friction onboarding:</strong> An email with a secure, one-click magic link is sent. No manual temporary passwords.
            </span>
          </div>

          <div className="shrink-0">
            <InviteSubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}

function ResendSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      title="Resend invitation email"
    >
      {pending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Mail className="h-3.5 w-3.5 text-blue-500" />
      )}
      {pending ? "Sending..." : "Resend Invite"}
    </button>
  );
}

export function ResendInviteButton({ userId }: { userId: string }) {
  return (
    <form action={resendMemberInvite}>
      <input type="hidden" name="userId" value={userId} />
      <ResendSubmitButton />
    </form>
  );
}

function ResetLinkSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
      title="Send password reset link via email"
    >
      {pending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <KeyRound className="h-3.5 w-3.5 text-amber-500" />
      )}
      {pending ? "Sending..." : "Send Reset Link"}
    </button>
  );
}

export function SendResetLinkButton({ userId }: { userId: string }) {
  return (
    <form action={sendMemberPasswordResetLink}>
      <input type="hidden" name="userId" value={userId} />
      <ResetLinkSubmitButton />
    </form>
  );
}
