"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, LoaderCircle, Save } from "lucide-react";
import type {
  ProfileNameFormState,
  ProfilePasswordFormState,
} from "@/lib/validation";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30";

function FieldError({ message }: { message?: string[] }) {
  if (!message?.[0]) {
    return null;
  }

  return <p className="mt-1.5 text-xs font-medium text-primary">{message[0]}</p>;
}

function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
        {success}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  return null;
}

type ProfileNameAction = (
  state: ProfileNameFormState,
  formData: FormData,
) => Promise<ProfileNameFormState>;

type ProfilePasswordAction = (
  state: ProfilePasswordFormState,
  formData: FormData,
) => Promise<ProfilePasswordFormState>;

function NameSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? "Saving..." : "Save name"}
    </button>
  );
}

function PasswordSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? "Updating..." : "Update password"}
    </button>
  );
}

export function ProfileNameForm({
  currentName,
  action,
}: {
  currentName: string;
  action: ProfileNameAction;
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage error={state.error} success={state.success} />
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Full name
        <input
          name="fullName"
          defaultValue={currentName}
          placeholder="e.g. Aarav Sharma"
          className={inputClass}
          required
          maxLength={120}
        />
        <FieldError message={state.fieldErrors?.fullName} />
      </label>
      <div className="flex justify-end">
        <NameSubmitButton />
      </div>
    </form>
  );
}

export function PasswordForm({ action }: { action: ProfilePasswordAction }) {
  const [state, formAction] = useActionState(action, {});
  const [showPasswords, setShowPasswords] = useState(false);
  const inputType = showPasswords ? "text" : "password";
  const ToggleIcon = showPasswords ? EyeOff : Eye;

  return (
    <form action={formAction} className="space-y-5">
      <FormMessage error={state.error} success={state.success} />
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          New password
          <div className="relative mt-2">
            <input
              name="newPassword"
              type={inputType}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="!mt-0 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
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
              <ToggleIcon className="h-4 w-4" />
            </button>
          </div>
          <FieldError message={state.fieldErrors?.newPassword} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Confirm password
          <input
            name="confirmPassword"
            type={inputType}
            placeholder="Repeat the new password"
            autoComplete="new-password"
            className={inputClass}
            required
            minLength={8}
            maxLength={72}
          />
          <FieldError message={state.fieldErrors?.confirmPassword} />
        </label>
      </div>
      <div className="flex justify-end">
        <PasswordSubmitButton />
      </div>
    </form>
  );
}
