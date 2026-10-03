import type { EmployeeStatus } from "@/lib/dashboard";

export default function StatusBadge({ status }: { status: EmployeeStatus }) {
  const active = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
        active
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}
