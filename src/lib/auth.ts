import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";

export type DashboardRole = "owner" | "hr";

export type DashboardUser = {
  id: string;
  email: string;
  fullName: string;
  role: DashboardRole;
  mustChangePassword: boolean;
};

function isDashboardRole(value: unknown): value is DashboardRole {
  return value === "owner" || value === "hr";
}

export async function getDashboardUser(): Promise<DashboardUser | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.status !== "active" ||
    !isDashboardRole(profile.role)
  ) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    role: profile.role,
    mustChangePassword: await getMustChangePassword(supabase, user.id),
  };
}

/**
 * Separate query so dashboards keep working if the must_change_password
 * migration has not been applied yet (defaults to false).
 */
async function getMustChangePassword(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("must_change_password")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }

    return (data as { must_change_password?: boolean }).must_change_password ?? false;
  } catch {
    return false;
  }
}

export async function requireDashboardUser() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
