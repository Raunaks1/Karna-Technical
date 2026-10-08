import { requireDashboardUser } from "./auth";
import { createAdminClient } from "./supabase/admin";
import { createClient } from "./supabase/server";

export type EmployeeStatus = "active" | "inactive";

export type TeamMember = {
  id: string;
  email: string;
  fullName: string;
  role: "owner" | "hr" | "marketing";
  status: string;
  isPendingInvite: boolean;
  invited_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
};

export type MyProfile = {
  id: string;
  email: string;
  fullName: string;
  role: "owner" | "hr" | "marketing";
  status: string;
  created_at: string;
  mustChangePassword: boolean;
};

export type Employee = {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  location_id: string;
  location_name: string;
  joining_date: string;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
};

export type Location = {
  id: string;
  name: string;
  city: string;
  state: string;
  created_at: string;
};

export type EmployeeFilters = {
  query?: string;
  locationId?: string;
  status?: EmployeeStatus | "all";
};

export type DeletionRequestStatus = "pending" | "approved" | "rejected";

export type EmployeeSnapshot = {
  employee_code?: string;
  full_name?: string;
  email?: string;
  designation?: string;
  department?: string;
};

export type DeletionRequest = {
  id: string;
  employee_id: string;
  employee_snapshot: EmployeeSnapshot;
  requested_by: string | null;
  requester_name: string;
  reason: string | null;
  status: DeletionRequestStatus;
  reviewed_by: string | null;
  reviewer_name: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type DeletedEmployee = Employee & {
  deleted_at: string;
};

type EmployeeRow = Omit<Employee, "location_name"> & {
  location: { name: string } | null;
};

export async function listLocations() {
  await requireDashboardUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("id, name, city, state, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Unable to load locations");
  }

  return (data ?? []) as Location[];
}

export async function listEmployees(filters: EmployeeFilters = {}) {
  await requireDashboardUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, employee_code, full_name, email, phone, designation, department, location_id, joining_date, status, created_at, updated_at, location:locations(name)",
    )
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error("Unable to load employees");
  }

  const query = filters.query?.trim().toLowerCase() ?? "";
  const rows = (data ?? []) as unknown as EmployeeRow[];

  return rows
    .map((row) => ({
      ...row,
      location_name: row.location?.name ?? "Unassigned",
    }))
    .filter((employee) => {
      const matchesQuery =
        !query ||
        [employee.full_name, employee.employee_code, employee.email].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesLocation =
        !filters.locationId || employee.location_id === filters.locationId;
      const matchesStatus =
        !filters.status || filters.status === "all" || employee.status === filters.status;

      return matchesQuery && matchesLocation && matchesStatus;
    });
}

export async function getEmployee(id: string) {
  await requireDashboardUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, employee_code, full_name, email, phone, designation, department, location_id, joining_date, status, created_at, updated_at, location:locations(name)",
    )
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load employee");
  }

  if (!data) {
    return null;
  }

  const row = data as unknown as EmployeeRow;
  return {
    ...row,
    location_name: row.location?.name ?? "Unassigned",
  };
}

export async function getMyProfile(): Promise<MyProfile> {
  const user = await requireDashboardUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, status, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Unable to load your profile");
  }

  return {
    id: data.id,
    email: user.email,
    fullName: data.full_name,
    role: data.role,
    status: data.status,
    created_at: data.created_at,
    mustChangePassword: user.mustChangePassword,
  };
}

export async function listTeamMembers(): Promise<TeamMember[]> {
  const user = await requireDashboardUser();

  if (user.role !== "owner") {
    throw new Error("Only owners can view the team.");
  }

  const admin = createAdminClient();
  const [{ data: profiles, error: profilesError }, { data: authUsers, error: usersError }] =
    await Promise.all([
      admin.from("profiles").select("id, full_name, role, status, created_at").order("created_at", { ascending: true }),
      admin.auth.admin.listUsers(),
    ]);

  if (profilesError || usersError) {
    // Log the underlying cause so Vercel Runtime Logs show it.
    // Never include keys — only the Supabase error messages.
    console.error("listTeamMembers failed", {
      profilesError: profilesError?.message,
      usersError: usersError instanceof Error ? usersError.message : usersError,
    });
    const detail =
      profilesError?.message ??
      (usersError instanceof Error ? usersError.message : null);
    throw new Error(
      detail ? `Unable to load team members: ${detail}` : "Unable to load team members",
    );
  }

  const authMap = new Map(
    (authUsers?.users ?? []).map((authUser) => [
      authUser.id,
      {
        email: authUser.email ?? "",
        invited_at: authUser.invited_at ?? null,
        confirmed_at:
          (authUser as { confirmed_at?: string | null; email_confirmed_at?: string | null })
            .confirmed_at ??
          (authUser as { confirmed_at?: string | null; email_confirmed_at?: string | null })
            .email_confirmed_at ??
          null,
        last_sign_in_at: authUser.last_sign_in_at ?? null,
      },
    ]),
  );

  return ((profiles ?? []) as { id: string; full_name: string | null; role: "owner" | "hr" | "marketing"; status: string | null; created_at: string | null }[]).map(
    (profile) => {
      const authInfo = authMap.get(profile.id);
      const isPendingInvite = Boolean(authInfo?.invited_at && !authInfo?.last_sign_in_at);

      return {
        id: profile.id,
        email: authInfo?.email ?? "",
        fullName: profile.full_name ?? "",
        role: profile.role,
        status: profile.status ?? "active",
        isPendingInvite,
        invited_at: authInfo?.invited_at ?? null,
        last_sign_in_at: authInfo?.last_sign_in_at ?? null,
        created_at: profile.created_at ?? "",
      };
    },
  );
}

export type Feedback = {
  id: string;
  name: string;
  company: string;
  rating: number;
  service: string;
  message: string;
  created_at: string;
};

export async function listFeedback(): Promise<Feedback[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id, name, company, rating, service, message, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error("Unable to load reviews");
  }

  return (data ?? []) as Feedback[];
}

type DeletionRequestRow = {
  id: string;
  employee_id: string;
  employee_snapshot: EmployeeSnapshot;
  requested_by: string | null;
  reason: string | null;
  status: DeletionRequestStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

async function withProfileNames(rows: DeletionRequestRow[]): Promise<DeletionRequest[]> {
  if (!rows.length) {
    return [];
  }

  const supabase = await createClient();
  const profileIds = [...new Set(rows.flatMap((row) => [row.requested_by, row.reviewed_by]).filter(Boolean))] as string[];
  const names = new Map<string, string>();

  if (profileIds.length) {
    const { data } = await supabase.from("profiles").select("id, full_name").in("id", profileIds);
    for (const profile of (data ?? []) as { id: string; full_name: string }[]) {
      names.set(profile.id, profile.full_name);
    }
  }

  return rows.map((row) => ({
    ...row,
    requester_name: (row.requested_by && names.get(row.requested_by)) || "Former team member",
    reviewer_name: (row.reviewed_by && names.get(row.reviewed_by)) || null,
  }));
}

export async function listDeletionRequests(status: "pending" | "all" = "pending") {
  const user = await requireDashboardUser();
  const supabase = await createClient();
  let query = supabase
    .from("deletion_requests")
    .select(
      "id, employee_id, employee_snapshot, requested_by, reason, status, reviewed_by, reviewed_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (status === "pending") {
    query = query.eq("status", "pending");
  }

  if (user.role !== "owner") {
    query = query.eq("requested_by", user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Unable to load deletion requests");
  }

  return withProfileNames((data ?? []) as DeletionRequestRow[]);
}

export async function countPendingDeletionRequests() {
  const user = await requireDashboardUser();
  const supabase = await createClient();
  let query = supabase
    .from("deletion_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (user.role !== "owner") {
    query = query.eq("requested_by", user.id);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error("Unable to count deletion requests");
  }

  return count ?? 0;
}

export async function listDeletedEmployees(): Promise<DeletedEmployee[]> {
  const user = await requireDashboardUser();

  if (user.role !== "owner") {
    throw new Error("Only owners can view the trash.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, employee_code, full_name, email, phone, designation, department, location_id, joining_date, status, created_at, updated_at, deleted_at, location:locations(name)",
    )
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load deleted employees");
  }

  return ((data ?? []) as unknown as (EmployeeRow & { deleted_at: string })[]).map((row) => ({
    ...row,
    location_name: row.location?.name ?? "Unassigned",
  }));
}
