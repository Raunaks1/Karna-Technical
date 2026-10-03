import { Check, X } from "lucide-react";
import { approveDeletionRequest, rejectDeletionRequest } from "@/app/dashboard/actions";
import type { DeletionRequest } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/format";

export default function DeletionReviewCard({ request }: { request: DeletionRequest }) {
  const snapshot = request.employee_snapshot;

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-white/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
            {snapshot.full_name || "Unknown employee"}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {snapshot.employee_code || "—"} · {snapshot.designation || "—"}
            {snapshot.department ? ` · ${snapshot.department}` : ""}
          </p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Requested by <span className="font-semibold">{request.requester_name}</span> ·{" "}
            {formatDateTime(request.created_at)}
          </p>
          {request.reason && (
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
              “{request.reason}”
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <form action={approveDeletionRequest}>
            <input type="hidden" name="requestId" value={request.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </button>
          </form>
          <form action={rejectDeletionRequest}>
            <input type="hidden" name="requestId" value={request.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
