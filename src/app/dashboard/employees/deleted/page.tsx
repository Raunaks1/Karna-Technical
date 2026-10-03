import Link from "next/link";
import { ArrowLeft, History, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { purgeEmployee, restoreEmployee } from "@/app/dashboard/actions";
import { getDashboardUser } from "@/lib/auth";
import { listDeletedEmployees } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DeletedEmployeesPage() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "owner") {
    redirect("/dashboard/employees");
  }

  const trashed = await listDeletedEmployees();

  return (
    <div className="space-y-8">
      <section>
        <Link
          href="/dashboard/employees"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Recovery</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trash
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Deleted records stay here for 30 days. Restore anything removed by mistake, or
            permanently delete records whose retention has expired.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11151d]">
        {trashed.length ? (
          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {trashed.map((employee) => (
              <div key={employee.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-heading text-xs font-extrabold text-secondary dark:bg-white/10 dark:text-white">
                    {employee.full_name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                      {employee.full_name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {employee.employee_code} · {employee.designation} · {employee.location_name}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Moved to trash {formatDateTime(employee.deleted_at)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={restoreEmployee}>
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      <History className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </form>
                  <form action={purgeEmployee}>
                    <input type="hidden" name="employeeId" value={employee.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete forever
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/10">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-extrabold">Trash is empty</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Approved deletions and records you move to trash will appear here for recovery.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
