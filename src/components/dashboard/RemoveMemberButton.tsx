"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Trash2 } from "lucide-react";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
    >
      {pending ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      {pending ? "Removing..." : label}
    </button>
  );
}

export default function RemoveMemberButton({
  userId,
  memberName,
  action,
  label = "Remove",
  confirmMessage,
}: {
  userId: string;
  memberName: string;
  action: (formData: FormData) => void;
  label?: string;
  confirmMessage?: string;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const defaultMsg = `Remove ${memberName}? Their login access stops immediately and this cannot be undone.`;
    const confirmed = window.confirm(confirmMessage || defaultMsg);

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="userId" value={userId} />
      <SubmitButton label={label} />
    </form>
  );
}
