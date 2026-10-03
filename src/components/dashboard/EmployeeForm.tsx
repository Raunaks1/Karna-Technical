"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import type { Employee, Location } from "@/lib/dashboard";
import type { EmployeeFormState } from "@/lib/validation";

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-red-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-red-400 dark:focus:ring-red-950/30";

function FieldError({ name, state }: { name: string; state?: EmployeeFormState }) {
  const message = state?.fieldErrors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs font-medium text-primary">{message}</p>;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/10 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      {pending ? "Saving..." : label}
    </button>
  );
}

type EmployeeAction = (
  state: EmployeeFormState,
  formData: FormData,
) => Promise<EmployeeFormState>;

export default function EmployeeForm({
  action,
  locations,
  employee,
  mode,
}: {
  action: EmployeeAction;
  locations: Location[];
  employee?: Employee;
  mode: "create" | "edit";
}) {
  const [state, formAction] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-8">
      {employee && <input type="hidden" name="id" value={employee.id} />}

      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {state.error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Identity</p>
          <h2 className="mt-2 font-heading text-xl font-extrabold">Personal information</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep the employee record accurate and easy to find.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Full name
            <input
              name="fullName"
              defaultValue={employee?.full_name}
              placeholder="e.g. Aarav Sharma"
              className={inputClass}
              required
            />
            <FieldError name="fullName" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Employee code
            <input
              name="employeeCode"
              defaultValue={employee?.employee_code}
              placeholder="e.g. KT-001"
              className={inputClass}
              required
            />
            <FieldError name="employeeCode" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email address
            <input
              name="email"
              type="email"
              defaultValue={employee?.email}
              placeholder="name@company.com"
              className={inputClass}
              required
            />
            <FieldError name="email" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Phone number
            <input
              name="phone"
              type="tel"
              defaultValue={employee?.phone}
              placeholder="+91 98765 43210"
              className={inputClass}
              required
            />
            <FieldError name="phone" state={state} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Work profile</p>
          <h2 className="mt-2 font-heading text-xl font-extrabold">Role and assignment</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Use these fields to filter employees by work context.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Designation
            <input
              name="designation"
              defaultValue={employee?.designation}
              placeholder="e.g. Safety Officer"
              className={inputClass}
              required
            />
            <FieldError name="designation" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Department
            <input
              name="department"
              defaultValue={employee?.department}
              placeholder="e.g. Operations"
              className={inputClass}
              required
            />
            <FieldError name="department" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Location
            <select
              name="locationId"
              defaultValue={employee?.location_id ?? ""}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select a location
              </option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} · {location.city}
                </option>
              ))}
            </select>
            <FieldError name="locationId" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Joining date
            <input
              name="joiningDate"
              type="date"
              defaultValue={employee?.joining_date}
              className={inputClass}
              required
            />
            <FieldError name="joiningDate" state={state} />
          </label>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Status
            <select
              name="status"
              defaultValue={employee?.status ?? "active"}
              className={inputClass}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FieldError name="status" state={state} />
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/employees"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employees
        </Link>
        <SubmitButton label={mode === "create" ? "Add employee" : "Save changes"} />
      </div>
    </form>
  );
}
