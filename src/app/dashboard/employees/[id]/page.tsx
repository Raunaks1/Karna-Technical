import Link from "next/link";
import { z } from "zod";
import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import EmployeeForm from "@/components/dashboard/EmployeeForm";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { updateEmployee } from "@/app/dashboard/actions";
import { canEditData, getDashboardUser } from "@/lib/auth";
import { getEmployee, listLocations } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const [employee, locations] = await Promise.all([getEmployee(parsedId.data), listLocations()]);

  if (!employee) {
    notFound();
  }

  const user = await getDashboardUser();
  const canEdit = user ? canEditData(user.role) : false;

  return (
    <div className="space-y-8">
      <section>
        <Link href="/dashboard/employees" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 transition hover:text-primary dark:text-slate-400">
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary font-heading text-lg font-extrabold text-white">
              {employee.full_name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-extrabold tracking-tight">{employee.full_name}</h1>
                <StatusBadge status={employee.status} />
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{employee.designation} · {employee.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Authorized record
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Employee code</p>
          <p className="mt-3 text-sm font-bold">{employee.employee_code}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Location</p>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold"><MapPin className="h-4 w-4 text-primary" />{employee.location_name}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Joined</p>
          <p className="mt-3 text-sm font-bold">{formatDate(employee.joining_date)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#11151d]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Contact</p>
          <p className="mt-3 flex items-center gap-2 truncate text-sm font-bold"><Mail className="h-4 w-4 text-primary" />{employee.email}</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Phone className="h-3.5 w-3.5" />{employee.phone}</p>
        </div>
      </section>

      {canEdit && (
        <section>
          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Edit record</p>
            <h2 className="mt-2 font-heading text-xl font-extrabold">Update employee information</h2>
          </div>
          <EmployeeForm action={updateEmployee} locations={locations} employee={employee} mode="edit" />
        </section>
      )}
    </div>
  );
}
