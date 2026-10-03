"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Plus } from "lucide-react";
import type { LocationFormState } from "@/lib/validation";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30";

function FieldError({ name, state }: { name: string; state?: LocationFormState }) {
  const message = state?.fieldErrors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs font-medium text-primary">{message}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      {pending ? "Adding..." : "Add location"}
    </button>
  );
}

type LocationAction = (
  state: LocationFormState,
  formData: FormData,
) => Promise<LocationFormState>;

export default function LocationForm({ action }: { action: LocationAction }) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Network</p>
        <h2 className="mt-2 font-heading text-lg font-extrabold">Add a location</h2>
      </div>

      {state.error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Location name
          <input name="name" placeholder="e.g. Corporate office" className={inputClass} required />
          <FieldError name="name" state={state} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          City
          <input name="city" placeholder="e.g. Jabalpur" className={inputClass} required />
          <FieldError name="city" state={state} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          State
          <input name="state" placeholder="e.g. Madhya Pradesh" className={inputClass} required />
          <FieldError name="state" state={state} />
        </label>
      </div>

      <div className="mt-5 flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
