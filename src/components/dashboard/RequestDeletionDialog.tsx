"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2, X } from "lucide-react";
import type { DeletionRequestFormState } from "@/lib/validation";

type RequestDeletionAction = (
  state: DeletionRequestFormState,
  formData: FormData,
) => Promise<DeletionRequestFormState>;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {pending ? "Sending..." : "Send request"}
    </button>
  );
}

export default function RequestDeletionDialog({
  employeeId,
  employeeName,
  action,
}: {
  employeeId: string;
  employeeName: string;
  action: RequestDeletionAction;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(action, {});

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg px-2 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
      >
        Request deletion
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close dialog"
            onClick={close}
            className="absolute inset-0 bg-slate-950/60"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#11151d]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                  Owner approval required
                </p>
                <h3 className="mt-2 font-heading text-lg font-extrabold">Request deletion</h3>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-white">{employeeName}</span> will
              stay in the directory until an owner approves this request.
            </p>

            {state.success ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {state.success}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form action={formAction} className="mt-5 space-y-4">
                <input type="hidden" name="employeeId" value={employeeId} />
                {state.error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                    {state.error}
                  </div>
                )}
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Note for the owner{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                  <textarea
                    name="reason"
                    rows={3}
                    maxLength={500}
                    placeholder="e.g. Resigned on 12 Jan, exit formalities complete"
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
                  />
                </label>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <SubmitButton />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
