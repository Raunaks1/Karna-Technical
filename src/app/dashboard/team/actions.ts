"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireDashboardUser } from "@/lib/auth";
import { sendCredentialsEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getFormString,
  inviteMemberSchema,
  resetMemberPasswordSchema,
  teamMemberIdSchema,
  type InviteMemberFormState,
  type ResetMemberPasswordFormState,
} from "@/lib/validation";

async function requireOwner() {
  const user = await requireDashboardUser();

  if (user.role !== "owner") {
    throw new Error("Only owners can manage the team.");
  }

  return user;
}

async function activeOwnerCount(admin: ReturnType<typeof createAdminClient>) {
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "owner")
    .eq("status", "active");

  if (error) {
    throw new Error("Unable to verify owner coverage.");
  }

  return count ?? 0;
}

function revalidateTeam() {
  revalidatePath("/dashboard/team");
  revalidatePath("/dashboard", "layout");
}

export async function inviteMember(
  _previousState: InviteMemberFormState,
  formData: FormData,
): Promise<InviteMemberFormState> {
  await requireOwner();
  const parsed = inviteMemberSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    email: getFormString(formData, "email"),
    password: getFormString(formData, "password"),
    role: getFormString(formData, "role"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    if (createError?.message?.toLowerCase().includes("already")) {
      return { error: "That email is already registered. Find them in the list below." };
    }

    return { error: "The account could not be created. Please try again." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: parsed.data.fullName,
    role: parsed.data.role,
    status: "active",
    must_change_password: true,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: "The invite could not be finished. Please try again." };
  }

  const headerList = await headers();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? headerList.get("origin") ?? undefined;
  const emailResult = await sendCredentialsEmail({
    to: parsed.data.email,
    name: parsed.data.fullName,
    loginEmail: parsed.data.email,
    tempPassword: parsed.data.password,
    role: parsed.data.role,
    loginUrl: origin ? `${origin}/login` : "/login",
  });

  revalidateTeam();

  if (!emailResult.ok) {
    return {
      error: `Account created but the email failed (${emailResult.error}). Share this temporary password manually — it is shown only once: ${parsed.data.password}`,
    };
  }

  return {
    success: `Invite sent to ${parsed.data.email}. They sign in as ${parsed.data.role === "owner" ? "an owner" : "HR"} and must set a new password on first login.`,
  };
}

export async function setMemberStatus(formData: FormData) {
  const user = await requireOwner();
  const id = teamMemberIdSchema.safeParse({ userId: getFormString(formData, "userId") });

  if (!id.success) {
    throw new Error("The team member is invalid.");
  }

  if (id.data.userId === user.id) {
    throw new Error("You cannot change your own access. Ask another owner.");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", id.data.userId)
    .maybeSingle();

  if (!profile) {
    throw new Error("The team member no longer exists.");
  }

  const nextStatus = profile.status === "active" ? "inactive" : "active";

  if (nextStatus === "inactive" && profile.role === "owner") {
    const owners = await activeOwnerCount(admin);

    if (owners <= 1) {
      throw new Error("You cannot deactivate the last active owner.");
    }
  }

  const { error } = await admin
    .from("profiles")
    .update({ status: nextStatus })
    .eq("id", id.data.userId);

  if (error) {
    throw new Error("The team member could not be updated.");
  }

  revalidateTeam();
}

export async function resetMemberPassword(
  _previousState: ResetMemberPasswordFormState,
  formData: FormData,
): Promise<ResetMemberPasswordFormState> {
  await requireOwner();
  const parsed = resetMemberPasswordSchema.safeParse({
    userId: getFormString(formData, "userId"),
    password: getFormString(formData, "password"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(parsed.data.userId, {
    password: parsed.data.password,
  });

  if (error) {
    return { error: "The password could not be reset. Please try again." };
  }

  await admin
    .from("profiles")
    .update({ must_change_password: true })
    .eq("id", parsed.data.userId);

  revalidateTeam();
  return { success: "Password updated. Share it with the team member securely — they must change it on next sign-in." };
}

export async function removeMember(formData: FormData) {
  const user = await requireOwner();
  const id = teamMemberIdSchema.safeParse({ userId: getFormString(formData, "userId") });

  if (!id.success) {
    throw new Error("The team member is invalid.");
  }

  if (id.data.userId === user.id) {
    throw new Error("You cannot remove your own account. Ask another owner.");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, status")
    .eq("id", id.data.userId)
    .maybeSingle();

  if (!profile) {
    throw new Error("The team member no longer exists.");
  }

  if (profile.role === "owner" && profile.status === "active") {
    const owners = await activeOwnerCount(admin);

    if (owners <= 1) {
      throw new Error("You cannot remove the last active owner.");
    }
  }

  const { error } = await admin.auth.admin.deleteUser(id.data.userId);

  if (error) {
    throw new Error("The team member could not be removed.");
  }

  revalidateTeam();
}
