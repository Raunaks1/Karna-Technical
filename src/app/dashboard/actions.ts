"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireDashboardUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  deletionRequestSchema,
  employeeSchema,
  getFormString,
  locationSchema,
  profileEmailSchema,
  profileNameSchema,
  profilePasswordSchema,
  reviewDeletionSchema,
  type DeletionRequestFormState,
  type EmployeeFormState,
  type LocationFormState,
  type ProfileEmailFormState,
  type ProfileNameFormState,
  type ProfilePasswordFormState,
} from "@/lib/validation";

function employeeFormValues(formData: FormData) {
  return {
    employeeCode: getFormString(formData, "employeeCode"),
    fullName: getFormString(formData, "fullName"),
    email: getFormString(formData, "email"),
    phone: getFormString(formData, "phone"),
    designation: getFormString(formData, "designation"),
    department: getFormString(formData, "department"),
    locationId: getFormString(formData, "locationId"),
    joiningDate: getFormString(formData, "joiningDate"),
    status: getFormString(formData, "status"),
  };
}

export async function createEmployee(
  _previousState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  const user = await requireDashboardUser();
  const parsed = employeeSchema.safeParse(employeeFormValues(formData));

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("employees").insert({
    employee_code: parsed.data.employeeCode,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    designation: parsed.data.designation,
    department: parsed.data.department,
    location_id: parsed.data.locationId,
    joining_date: parsed.data.joiningDate,
    status: parsed.data.status,
    created_by: user.id,
    updated_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "That employee code or email is already in use." };
    }

    return { error: "The employee could not be added. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  redirect("/dashboard/employees");
}

export async function updateEmployee(
  _previousState: EmployeeFormState,
  formData: FormData,
): Promise<EmployeeFormState> {
  const user = await requireDashboardUser();
  const id = z.string().uuid().safeParse(getFormString(formData, "id"));

  if (!id.success) {
    return { error: "The employee record is invalid." };
  }

  const parsed = employeeSchema.safeParse(employeeFormValues(formData));

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update({
      employee_code: parsed.data.employeeCode,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      designation: parsed.data.designation,
      department: parsed.data.department,
      location_id: parsed.data.locationId,
      joining_date: parsed.data.joiningDate,
      status: parsed.data.status,
      updated_by: user.id,
    })
    .eq("id", id.data)
    .is("deleted_at", null);

  if (error) {
    if (error.code === "23505") {
      return { error: "That employee code or email is already in use." };
    }

    return { error: "The employee could not be updated. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  revalidatePath(`/dashboard/employees/${id.data}`);
  redirect(`/dashboard/employees/${id.data}`);
}

export async function deactivateEmployee(formData: FormData) {
  const user = await requireDashboardUser();
  const id = z.string().uuid().safeParse(getFormString(formData, "employeeId"));

  if (!id.success) {
    throw new Error("The employee record is invalid.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update({ status: "inactive", updated_by: user.id })
    .eq("id", id.data)
    .is("deleted_at", null);

  if (error) {
    throw new Error("The employee could not be deactivated.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
}

export async function deleteEmployee(formData: FormData) {
  const user = await requireDashboardUser();

  if (user.role !== "owner") {
    throw new Error("Only owners can move records to trash. Ask an owner to approve the deletion.");
  }

  const id = z.string().uuid().safeParse(getFormString(formData, "employeeId"));

  if (!id.success) {
    throw new Error("The employee record is invalid.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update({ deleted_at: new Date().toISOString(), updated_by: user.id })
    .eq("id", id.data)
    .is("deleted_at", null);

  if (error) {
    throw new Error("The employee could not be moved to trash.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
}

export async function requestDeletion(
  _previousState: DeletionRequestFormState,
  formData: FormData,
): Promise<DeletionRequestFormState> {
  const user = await requireDashboardUser();
  const parsed = deletionRequestSchema.safeParse({
    employeeId: getFormString(formData, "employeeId"),
    reason: getFormString(formData, "reason"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("id, employee_code, full_name, email, designation, department")
    .eq("id", parsed.data.employeeId)
    .is("deleted_at", null)
    .maybeSingle();

  if (employeeError || !employee) {
    return { error: "That employee record no longer exists." };
  }

  const { data: existing } = await supabase
    .from("deletion_requests")
    .select("id")
    .eq("employee_id", parsed.data.employeeId)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return { error: "A deletion request for this employee is already pending review." };
  }

  const reason = parsed.data.reason?.trim() ? parsed.data.reason.trim() : null;
  const { error } = await supabase.from("deletion_requests").insert({
    employee_id: parsed.data.employeeId,
    employee_snapshot: {
      employee_code: employee.employee_code,
      full_name: employee.full_name,
      email: employee.email,
      designation: employee.designation,
      department: employee.department,
    },
    requested_by: user.id,
    reason,
    status: "pending",
  });

  if (error) {
    return { error: "The request could not be sent. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/approvals");
  return { success: "Request sent. An owner will review it." };
}

async function requireOwner() {
  const user = await requireDashboardUser();

  if (user.role !== "owner") {
    throw new Error("Only owners can review deletion requests.");
  }

  return user;
}

export async function approveDeletionRequest(formData: FormData) {
  const user = await requireOwner();
  const parsed = reviewDeletionSchema.safeParse({
    requestId: getFormString(formData, "requestId"),
  });

  if (!parsed.success) {
    throw new Error("The deletion request is invalid.");
  }

  const supabase = await createClient();
  const { data: request, error: requestError } = await supabase
    .from("deletion_requests")
    .select("id, employee_id, status")
    .eq("id", parsed.data.requestId)
    .maybeSingle();

  if (requestError || !request) {
    throw new Error("The deletion request no longer exists.");
  }

  if (request.status !== "pending") {
    throw new Error("This request has already been reviewed.");
  }

  const now = new Date().toISOString();
  const { error: trashError } = await supabase
    .from("employees")
    .update({ deleted_at: now, updated_by: user.id })
    .eq("id", request.employee_id)
    .is("deleted_at", null);

  if (trashError) {
    throw new Error("The employee could not be moved to trash.");
  }

  const { error: reviewError } = await supabase
    .from("deletion_requests")
    .update({ status: "approved", reviewed_by: user.id, reviewed_at: now })
    .eq("id", request.id);

  if (reviewError) {
    throw new Error("The request could not be marked as approved.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/approvals");
}

export async function rejectDeletionRequest(formData: FormData) {
  const user = await requireOwner();
  const parsed = reviewDeletionSchema.safeParse({
    requestId: getFormString(formData, "requestId"),
  });

  if (!parsed.success) {
    throw new Error("The deletion request is invalid.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("deletion_requests")
    .update({ status: "rejected", reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", parsed.data.requestId)
    .eq("status", "pending");

  if (error) {
    throw new Error("The request could not be rejected.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/approvals");
}

export async function restoreEmployee(formData: FormData) {
  const user = await requireOwner();
  const id = z.string().uuid().safeParse(getFormString(formData, "employeeId"));

  if (!id.success) {
    throw new Error("The employee record is invalid.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .update({ deleted_at: null, updated_by: user.id })
    .eq("id", id.data)
    .not("deleted_at", "is", null);

  if (error) {
    throw new Error("The employee could not be restored.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/approvals");
}

export async function purgeEmployee(formData: FormData) {
  await requireOwner();
  const id = z.string().uuid().safeParse(getFormString(formData, "employeeId"));

  if (!id.success) {
    throw new Error("The employee record is invalid.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id.data)
    .not("deleted_at", "is", null);

  if (error) {
    throw new Error("The employee could not be permanently deleted.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/employees");
  revalidatePath("/dashboard/approvals");
}

export async function createLocation(
  _previousState: LocationFormState,
  formData: FormData,
): Promise<LocationFormState> {
  await requireDashboardUser();
  const parsed = locationSchema.safeParse({
    name: getFormString(formData, "name"),
    city: getFormString(formData, "city"),
    state: getFormString(formData, "state"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("locations").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return { error: "That location already exists." };
    }

    return { error: "The location could not be added. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/locations");
  redirect("/dashboard/locations");
}

export async function updateProfileName(
  _previousState: ProfileNameFormState,
  formData: FormData,
): Promise<ProfileNameFormState> {
  const user = await requireDashboardUser();
  const parsed = profileNameSchema.safeParse({
    fullName: getFormString(formData, "fullName"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted field and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.fullName })
    .eq("id", user.id);

  if (error) {
    return { error: "Your name could not be updated. Please try again." };
  }

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/profile");
  return { success: "Display name updated." };
}

export async function updateProfilePassword(
  _previousState: ProfilePasswordFormState,
  formData: FormData,
): Promise<ProfilePasswordFormState> {
  const user = await requireDashboardUser();
  const parsed = profilePasswordSchema.safeParse({
    newPassword: getFormString(formData, "newPassword"),
    confirmPassword: getFormString(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  });

  if (error) {
    return { error: "Your password could not be updated. Please try again." };
  }

  await supabase
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id);

  revalidatePath("/dashboard/profile");
  return { success: "Password updated. Use it the next time you sign in." };
}

export async function updateProfileEmail(
  _previousState: ProfileEmailFormState,
  formData: FormData,
): Promise<ProfileEmailFormState> {
  const user = await requireDashboardUser();
  const parsed = profileEmailSchema.safeParse({
    newEmail: getFormString(formData, "newEmail"),
    confirmEmail: getFormString(formData, "confirmEmail"),
  });

  if (!parsed.success) {
    return {
      error: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const newEmail = parsed.data.newEmail.trim();

  if (newEmail.toLowerCase() === user.email.toLowerCase()) {
    return { error: "That is already your sign-in email." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      return { error: "That email is already registered to another account." };
    }

    if (message.includes("rate limit") || message.includes("too many")) {
      return { error: "Too many attempts. Wait a few minutes and try again." };
    }

    return { error: "Your email could not be updated. Please try again." };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard", "layout");
  return {
    success:
      "Confirmation sent. Click the link in your new inbox (and current inbox, if asked) to finish the change — then sign in with the new email.",
  };
}
