import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, ShieldCheck } from "lucide-react";
import EmployeeForm from "@/components/dashboard/EmployeeForm";
import { createEmployee } from "@/app/dashboard/actions";
import { canEditData, getDashboardUser } from "@/lib/auth";
import { listLocations } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default async function NewEmployeePage() {
  const user = await getDashboardUser();

  if (!user || !canEditData(user.role)) {
    redirect("/dashboard/employees");
  }

  const locations = await listLocations();

  return (
    <div className="space-y-8">
      <section>
        <Link href="/dashboard/employees" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-primary dark:text-slate-400">
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Authorized editor action
            </div>
            <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Add an employee</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Create a private employee record. Only owner and HR accounts can add or change records; the wider team can view them.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 sm:flex">
            <Plus className="h-4 w-4" />
            Secure record
          </div>
        </div>
      </section>

      <EmployeeForm action={createEmployee} locations={locations} mode="create" />
    </div>
  );
}
