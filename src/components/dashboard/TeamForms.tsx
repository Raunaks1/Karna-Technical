"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, KeyRound, LoaderCircle, UserPlus, X } from "lucide-react";
import { inviteMember, resetMemberPassword } from "@/app/dashboard/team/actions";
import type { InviteMemberFormState, ResetMemberPasswordFormState } from "@/lib/validation";

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
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
      {pending ? "Inviting..." : "Invite member"}
    </button>
  );
}

function ResetSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
      {pending ? "Saving..." : "Set password"}
    </button>
  );
}

export function InviteMemberForm() {
  const [state, formAction] = useActionState(inviteMember, {} as InviteMemberFormState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
          {state.success}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Full name
          <input name="fullName" placeholder="e.g. Priya Nair" className={inputClass} required maxLength={120} />
          <FieldError message={state.fieldErrors?.fullName} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Work email
          <input name="email" type="email" placeholder="name@company.com" autoComplete="off" className={inputClass} required maxLength={160} />
          <FieldError message={state.fieldErrors?.email} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Temporary password
          <div className="relative mt-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="!mt-0 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
              required
              minLength={8}
              maxLength={72}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FieldError message={state.fieldErrors?.password} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Role
          <select name="role" defaultValue="hr" className={inputClass} required>
            <option value="hr">HR administrator</option>
            <option value="owner">Owner</option>
          </select>
          <FieldError message={state.fieldErrors?.role} />
        </label>
      </div>
      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        The login details are emailed to the new member. They must change the temporary
        password when they first sign in.
      </p>
      <div className="flex justify-end">
        <InviteSubmitButton />
      </div>
    </form>
  );
}

export function ResetPasswordDialog({ userId, memberName }: { userId: string; memberName: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(resetMemberPassword, {} as ResetMemberPasswordFormState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
      >
        Reset password
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/60"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#11151d]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  Owner action
                </p>
                <h3 className="mt-2 font-heading text-lg font-extrabold">Reset password</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Set a new temporary password for{" "}
              <span className="font-bold text-slate-800 dark:text-white">{memberName}</span>.
            </p>

            {state.success ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {state.success}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form action={formAction} className="mt-5 space-y-4">
                <input type="hidden" name="userId" value={userId} />
                {state.error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    {state.error}
                  </div>
                )}
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  New temporary password
                  <div className="relative mt-2">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="!mt-0 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
                      required
                      minLength={8}
                      maxLength={72}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <FieldError message={state.fieldErrors?.password} />
                </label>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <ResetSubmitButton />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
