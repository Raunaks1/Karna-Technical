"use client";

import { Trash2 } from "lucide-react";

export default function OwnerDeleteButton({
  employeeId,
  employeeName,
  action,
  compact = false,
}: {
  employeeId: string;
  employeeName: string;
  action: (formData: FormData) => void;
  compact?: boolean;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Move ${employeeName} to trash? You can restore the record within 30 days.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  if (compact) {
    return (
      <form action={action} onSubmit={handleSubmit}>
        <input type="hidden" name="employeeId" value={employeeId} />
        <button type="submit" className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400">
          Delete
        </button>
      </form>
    );
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="employeeId" value={employeeId} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
    </form>
  );
}
