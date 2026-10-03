"use client";

export default function RemoveMemberButton({
  userId,
  memberName,
  action,
}: {
  userId: string;
  memberName: string;
  action: (formData: FormData) => void;
}) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `Remove ${memberName}? Their login stops working immediately and this cannot be undone.`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <input type="hidden" name="userId" value={userId} />
      <button
        type="submit"
        className="rounded-lg px-2 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
      >
        Remove
      </button>
    </form>
  );
}
