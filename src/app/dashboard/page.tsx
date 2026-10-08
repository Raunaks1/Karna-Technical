import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import DeletionReviewCard from "@/components/dashboard/DeletionReviewCard";
import { canEditData, getDashboardUser } from "@/lib/auth";
import { listDeletionRequests, listEmployees, listLocations } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-3 font-heading text-3xl font-extrabold tracking-tight">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">{detail}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const [employees, locations, user, pendingRequests] = await Promise.all([
    listEmployees(),
    listLocations(),
    getDashboardUser(),
    listDeletionRequests("pending"),
  ]);
  const isOwner = user?.role === "owner";
  const canEdit = user ? canEditData(user.role) : false;
  const activeEmployees = employees.filter((employee) => employee.status === "active");
  const recentEmployees = [...employees]
    .sort((first, second) => second.created_at.localeCompare(first.created_at))
    .slice(0, 5);
  const locationCounts = locations.map((location) => ({
    ...location,
    count: employees.filter((employee) => employee.location_id === location.id).length,
  }));
  const maxLocationCount = Math.max(...locationCounts.map((location) => location.count), 1);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-secondary px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border-[36px] border-white/5" aria-hidden="true" />
        <div className="absolute -bottom-32 right-24 h-64 w-64 rounded-full border-[28px] border-primary/20" aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-red-200">
              <ShieldCheck className="h-4 w-4" />
              Private people operations
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Good morning, manage your people with clarity.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Keep employee information organized, searchable, and available only to your authorized team.
            </p>
          </div>
          {canEdit && (
            <Link
              href="/dashboard/employees/new"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-primary-hover"
            >
              <Plus className="h-4 w-4" />
              Add employee
            </Link>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total employees"
          value={employees.length}
          detail="All records in your workspace"
          icon={Users}
          accent="bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
        />
        <StatCard
          label="Active employees"
          value={activeEmployees.length}
          detail={`${employees.length - activeEmployees.length} inactive records`}
          icon={UserPlus}
          accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
        />
        <StatCard
          label="Locations"
          value={locations.length}
          detail="Active branches and sites"
          icon={MapPin}
          accent="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300"
        />
        <StatCard
          label="Departments"
          value={new Set(employees.map((employee) => employee.department)).size}
          detail="Across your employee records"
          icon={BriefcaseBusiness}
          accent="bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300"
        />
      </section>

            {pendingRequests.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/10 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-extrabold">
                  {isOwner ? "Deletion requests awaiting your review" : "Your pending deletion requests"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {pendingRequests.length} {pendingRequests.length === 1 ? "request" : "requests"} pending
                  {isOwner && (
                    <>
                      {" · "}
                      <Link href="/dashboard/approvals" className="font-bold text-primary hover:underline">
                        Open approvals
                      </Link>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {isOwner ? (
              pendingRequests
                .slice(0, 3)
                .map((request) => (
                  <div key={request.id} className="rounded-xl bg-white dark:bg-[#11151d]">
                    <DeletionReviewCard request={request} />
                  </div>
                ))
            ) : (
              <ul className="space-y-2">
                {pendingRequests.slice(0, 5).map((request) => (
                  <li
                    key={request.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-sm dark:bg-[#11151d]"
                  >
                    <span className="truncate font-semibold">
                      {request.employee_snapshot.full_name || "Unknown employee"}
                    </span>
                    <span className="shrink-0 text-xs font-bold text-amber-700 dark:text-amber-300">
                      Pending approval
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.35fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Coverage</p>
              <h2 className="mt-2 font-heading text-xl font-extrabold">Employees by location</h2>
            </div>
            <Link href="/dashboard/locations" className="text-xs font-bold text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="mt-7 space-y-5">
            {locationCounts.map((location) => (
              <div key={location.id}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{location.name}</span>
                  <span className="text-xs font-semibold text-slate-400">{location.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.max((location.count / maxLocationCount) * 100, location.count ? 8 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Latest changes</p>
              <h2 className="mt-2 font-heading text-xl font-extrabold">Recently added</h2>
            </div>
            <Link href="/dashboard/employees" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 divide-y divide-slate-100 dark:divide-white/10">
            {recentEmployees.length ? (
              recentEmployees.map((employee) => (
                <Link
                  key={employee.id}
                  href={`/dashboard/employees/${employee.id}`}
                  className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-heading text-xs font-extrabold text-secondary dark:bg-white/10 dark:text-white">
                    {employee.full_name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{employee.full_name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      {employee.designation} · {employee.location_name}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <StatusBadge status={employee.status} />
                    <p className="mt-1.5 flex items-center justify-end gap-1 text-[11px] text-slate-400">
                      <CalendarDays className="h-3 w-3" />
                      {formatDateTime(employee.created_at)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">No employees have been added yet.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
