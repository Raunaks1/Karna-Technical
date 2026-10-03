import Link from "next/link";
import { ArrowLeft, ShieldCheck, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import DeletionReviewCard from "@/components/dashboard/DeletionReviewCard";
import { getDashboardUser } from "@/lib/auth";
import { listDeletedEmployees, listDeletionRequests } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "owner") {
    redirect("/dashboard/employees");
  }

  const [pending, trashed] = await Promise.all([
    listDeletionRequests("pending"),
    listDeletedEmployees(),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to overview
        </Link>
        <div className="mt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            <ShieldCheck className="h-4 w-4" />
            Owner review
          </div>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Deletion approvals
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            HR deletion requests wait here. Approving moves the record to trash, where it can
            be restored within 30 days before permanent removal.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-lg font-extrabold">Pending requests</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {pending.length} {pending.length === 1 ? "request" : "requests"} waiting for review
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {pending.length ? (
            pending.map((request) => <DeletionReviewCard key={request.id} request={request} />)
          ) : (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
              No pending requests. New HR requests will appear here.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-primary dark:bg-red-950/40">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold">Trash</h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {trashed.length} {trashed.length === 1 ? "record" : "records"} awaiting restore or
                permanent removal
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/employees/deleted"
            className="text-xs font-bold text-primary hover:underline"
          >
            Open trash
          </Link>
        </div>
      </section>
    </div>
  );
}
