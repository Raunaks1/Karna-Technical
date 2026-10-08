import SetPasswordForm from "./SetPasswordForm";

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorParam = params.error;
  const reasonParam = params.reason;
  const linkError = typeof errorParam === "string" ? errorParam : null;
  const linkReason = typeof reasonParam === "string" ? reasonParam : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8] px-4 py-12 dark:bg-[#0b0e14]">
      <SetPasswordForm linkError={linkError} linkReason={linkReason} />
    </div>
  );
}
