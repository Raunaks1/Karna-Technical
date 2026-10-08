"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { requireDashboardUser } from "@/lib/auth";
import {
  sendInvitationEmail,
  sendPasswordResetEmail,
} from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getFormString,
  inviteMemberSchema,
  teamMemberIdSchema,
  type InviteMemberFormState,
} from "@/lib/validation";

async function requireOwner() {
  const user = await requireDashboardUser();

  if (user.role !== "owner") {
    throw new Error("Only owners can manage the team.");
  }

  return user;
}

async function getSiteOrigin() {
  const headerList = await headers();
  const forwardedHost = headerList.get("x-forwarded-host");
  const forwardedProto = headerList.get("x-forwarded-proto") ?? "https";
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : headerList.get("origin") ?? "http://localhost:3000");

  return origin.replace(/\/$/, "");
}

/**
 * Direct /auth/confirm link carrying the raw token hash.
 * Prefer this over Supabase's hosted `action_link`: admin generateLink
 * never produces PKCE links, so the hosted link resolves via a URL-hash
 * session (#access_token) that server routes cannot read. The direct link
 * is verified server-side with verifyOtp — no hosted hop, no hash.
 */
function buildDirectConfirmLink(
  origin: string,
  hashedToken: string | null | undefined,
  type: "invite" | "magiclink" | "recovery",
  fallback: string,
) {
  if (!hashedToken) {
    console.error("generateLink returned no hashed_token; falling back to hosted action_link");
    return fallback;
  }

  return `${origin}/auth/confirm?token_hash=${encodeURIComponent(hashedToken)}&type=${type}`;
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
  const user = await requireOwner();
  const parsed = inviteMemberSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
    email: getFormString(formData, "email"),
    role: getFormString(formData, "role"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Team management is not configured. Add SUPABASE_SERVICE_ROLE_KEY and redeploy.",
    };
  }

  const origin = await getSiteOrigin();
  const redirectTo = `${origin}/auth/confirm`;

  const cleanEmail = parsed.data.email.trim().toLowerCase();

  // Generate an invitation magic link
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "invite",
    email: cleanEmail,
    options: {
      redirectTo,
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (linkError || !linkData.user) {
    if (linkError?.message?.toLowerCase().includes("already")) {
      return { error: "That email is already registered. Find them in the member list below." };
    }

    return { error: linkError?.message || "The invitation link could not be generated. Please try again." };
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: linkData.user.id,
    full_name: parsed.data.fullName,
    role: parsed.data.role,
    status: "active",
    must_change_password: false,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(linkData.user.id);
    return { error: "The profile could not be created. Please try again." };
  }

  const inviteUrl = buildDirectConfirmLink(
    origin,
    linkData.properties?.hashed_token,
    "invite",
    linkData.properties?.action_link ?? redirectTo,
  );

  const emailResult = await sendInvitationEmail({
    to: parsed.data.email,
    name: parsed.data.fullName,
    role: parsed.data.role,
    inviterName: user.fullName || undefined,
    inviteUrl,
  });

  revalidateTeam();

  if (!emailResult.ok) {
    return {
      success: `Invitation link generated! Email delivery note: ${emailResult.error}`,
      inviteLink: inviteUrl,
    };
  }

  return {
    success: `Invitation sent to ${parsed.data.email}! They will receive a magic link to set up their password.`,
    inviteLink: inviteUrl,
  };
}

export async function resendMemberInvite(formData: FormData) {
  const user = await requireOwner();
  const id = teamMemberIdSchema.safeParse({ userId: getFormString(formData, "userId") });

  if (!id.success) {
    throw new Error("The team member is invalid.");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", id.data.userId)
    .maybeSingle();

  if (!profile) {
    throw new Error("The member record no longer exists.");
  }

  const { data: userData, error: userError } = await admin.auth.admin.getUserById(id.data.userId);
  if (userError || !userData?.user?.email) {
    throw new Error("The user account could not be found.");
  }

  const email = userData.user.email;
  const origin = await getSiteOrigin();
  const redirectTo = `${origin}/auth/confirm`;

  // Generate invite or magic link
  const isConfirmed = Boolean(
    (userData.user as { confirmed_at?: string | null; email_confirmed_at?: string | null })
      .confirmed_at ||
      (userData.user as { confirmed_at?: string | null; email_confirmed_at?: string | null })
        .email_confirmed_at,
  );

  const linkType = isConfirmed ? "magiclink" : "invite";

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: linkType,
    email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties) {
    throw new Error(linkError?.message || "Unable to generate a new invitation link.");
  }

  const inviteUrl = buildDirectConfirmLink(
    origin,
    linkData.properties.hashed_token,
    linkType,
    linkData.properties.action_link ?? redirectTo,
  );

  const emailResult = await sendInvitationEmail({
    to: email,
    name: profile.full_name || email,
    role: profile.role,
    inviterName: user.fullName || undefined,
    inviteUrl,
  });

  if (!emailResult.ok) {
    throw new Error(`Invite generated but email failed: ${emailResult.error}`);
  }

  revalidateTeam();
}

export async function sendMemberPasswordResetLink(formData: FormData) {
  await requireOwner();
  const id = teamMemberIdSchema.safeParse({ userId: getFormString(formData, "userId") });

  if (!id.success) {
    throw new Error("The team member is invalid.");
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, full_name")
    .eq("id", id.data.userId)
    .maybeSingle();

  const { data: userData, error: userError } = await admin.auth.admin.getUserById(id.data.userId);
  if (userError || !userData?.user?.email) {
    throw new Error("The user account could not be found.");
  }

  const email = userData.user.email;
  const origin = await getSiteOrigin();
  const redirectTo = `${origin}/auth/confirm`;

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (linkError || !linkData?.properties) {
    throw new Error(linkError?.message || "Unable to generate a password reset link.");
  }

  const resetUrl = buildDirectConfirmLink(
    origin,
    linkData.properties.hashed_token,
    "recovery",
    linkData.properties.action_link ?? redirectTo,
  );

  const emailResult = await sendPasswordResetEmail({
    to: email,
    name: profile?.full_name || email,
    resetUrl,
  });

  if (!emailResult.ok) {
    throw new Error(`Reset link created but email failed: ${emailResult.error}`);
  }

  revalidateTeam();
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
