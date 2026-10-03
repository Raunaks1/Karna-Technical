import Link from "next/link";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  Mail,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import OwnerDeleteButton from "@/components/dashboard/OwnerDeleteButton";
import RequestDeletionDialog from "@/components/dashboard/RequestDeletionDialog";
import { deactivateEmployee, deleteEmployee, requestDeletion } from "@/app/dashboard/actions";
import { getDashboardUser } from "@/lib/auth";
import { listDeletionRequests, listEmployees, listLocations, type EmployeeStatus } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return typeof value === "string" ? value : "";
}

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = getParam(params, "query");
  const locationId = getParam(params, "location");
  const statusParam = getParam(params, "status");
  const status: EmployeeStatus | "all" =
    statusParam === "active" || statusParam === "inactive" ? statusParam : "all";
  const [employees, locations, user, pendingRequests] = await Promise.all([
    listEmployees({ query, locationId, status }),
    listLocations(),
    getDashboardUser(),
    listDeletionRequests("pending"),
  ]);
  const isOwner = user?.role === "owner";
  const pendingByEmployee = new Map(pendingRequests.map((request) => [request.employee_id, request]));

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Directory</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Employee records</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Search, filter, and maintain the employee information used by your owner and HR team.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/dashboard/employees/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" />
            Add employee
          </Link>
          {isOwner && (
            <Link
              href="/dashboard/employees/deleted"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Trash
            </Link>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-5">
        <form method="get" className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px_auto]">
          <label className="relative block">
            <span className="sr-only">Search employees</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="query"
              defaultValue={query}
              placeholder="Search by name, code, or email"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
            />
          </label>
          <label className="relative block">
            <span className="sr-only">Filter by location</span>
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              name="location"
              defaultValue={locationId}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>
          <label className="relative block">
            <span className="sr-only">Filter by status</span>
            <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              name="status"
              defaultValue={status}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            Apply
          </button>
        </form>
        {(query || locationId || status !== "all") && (
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
            <span>Showing {employees.length} matching {employees.length === 1 ? "record" : "records"}</span>
            <Link href="/dashboard/employees" className="font-bold text-primary hover:underline">
              Clear filters
            </Link>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11151d]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold">All employees</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{employees.length} records in this view</p>
            </div>
          </div>
        </div>

        {employees.length ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:bg-white/5 dark:text-slate-500">
                  <tr>
                    <th className="px-7 py-4">Employee</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-7 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                            {employee.full_name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800 dark:text-white">{employee.full_name}</p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{employee.designation}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{employee.department}</p>
                      </td>
                      <td className="px-5 py-5">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {employee.location_name}
                        </p>
                        <p className="mt-1 pl-5 text-xs text-slate-500 dark:text-slate-400">{employee.employee_code}</p>
                      </td>
                      <td className="px-5 py-5 text-sm text-slate-600 dark:text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(employee.joining_date)}
                        </span>
                      </td>
                      <td className="px-5 py-5">
                        <StatusBadge status={employee.status} />
                      </td>
                      <td className="px-7 py-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              href={`/dashboard/employees/${employee.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                              View
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                            {employee.status === "active" && (
                              <form action={deactivateEmployee}>
                                <input type="hidden" name="employeeId" value={employee.id} />
                                <button
                                  type="submit"
                                  className="rounded-lg px-2 py-2 text-xs font-bold text-slate-400 transition hover:bg-red-50 hover:text-primary dark:hover:bg-red-950/30"
                                >
                                  Deactivate
                                </button>
                              </form>
                            )}
                            {pendingByEmployee.has(employee.id) ? (
                              <span className="rounded-lg bg-amber-50 px-2 py-2 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                Pending approval
                              </span>
                            ) : isOwner ? (
                              <OwnerDeleteButton
                                employeeId={employee.id}
                                employeeName={employee.full_name}
                                action={deleteEmployee}
                              />
                            ) : (
                              <RequestDeletionDialog
                                employeeId={employee.id}
                                employeeName={employee.full_name}
                                action={requestDeletion}
                              />
                            )}
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/10 lg:hidden">
              {employees.map((employee) => (
                <div key={employee.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                      {employee.full_name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link href={`/dashboard/employees/${employee.id}`} className="text-sm font-bold hover:text-primary">
                            {employee.full_name}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{employee.employee_code}</p>
                        </div>
                        <StatusBadge status={employee.status} />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <p className="flex items-center gap-1.5">
                          <BriefcaseBusiness className="h-3.5 w-3.5 text-slate-400" />
                          {employee.designation}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {employee.location_name}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(employee.joining_date)}
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {employee.email}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Link href={`/dashboard/employees/${employee.id}`} className="text-xs font-bold text-primary hover:underline">
                          View details
                        </Link>
                        <div className="flex items-center gap-3">
                          {employee.status === "active" && (
                            <form action={deactivateEmployee}>
                              <input type="hidden" name="employeeId" value={employee.id} />
                              <button type="submit" className="text-xs font-bold text-slate-400 hover:text-primary">
                                Deactivate
                              </button>
                            </form>
                          )}
                          {pendingByEmployee.has(employee.id) ? (
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-300">
                              Pending approval
                            </span>
                          ) : isOwner ? (
                            <OwnerDeleteButton
                              employeeId={employee.id}
                              employeeName={employee.full_name}
                              action={deleteEmployee}
                              compact
                            />
                          ) : (
                            <RequestDeletionDialog
                              employeeId={employee.id}
                              employeeName={employee.full_name}
                              action={requestDeletion}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/10">
              <UserRound className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-extrabold">No employees found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Try clearing your filters or add the first employee record to this workspace.
            </p>
            <Link href="/dashboard/employees/new" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              <Plus className="h-4 w-4" />
              Add employee
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
