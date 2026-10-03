import { requireDashboardUser } from "@/lib/auth";
import { countPendingDeletionRequests } from "@/lib/dashboard";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireDashboardUser();
  const pendingApprovals = await countPendingDeletionRequests();

  return (
    <DashboardShell user={user} pendingApprovals={pendingApprovals}>
      {children}
    </DashboardShell>
  );
}
