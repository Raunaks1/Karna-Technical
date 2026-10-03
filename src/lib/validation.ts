import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z.string().trim().min(2, "Employee code is required").max(30),
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  designation: z.string().trim().min(2, "Designation is required").max(80),
  department: z.string().trim().min(2, "Department is required").max(80),
  locationId: z.string().uuid("Select a location"),
  joiningDate: z.iso.date({ error: "Enter a valid joining date" }),
  status: z.enum(["active", "inactive"]),
});

export const locationSchema = z.object({
  name: z.string().trim().min(2, "Location name is required").max(100),
  city: z.string().trim().min(2, "City is required").max(80),
  state: z.string().trim().min(2, "State is required").max(80),
});

export const profileNameSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
});

export const profilePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Use at least 8 characters").max(72),
    confirmPassword: z.string().min(8, "Confirm your new password").max(72),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const deletionRequestSchema = z.object({
  employeeId: z.string().uuid("The employee record is invalid."),
  reason: z
    .string()
    .trim()
    .max(500, "Keep the note under 500 characters")
    .optional()
    .or(z.literal("")),
});

export const reviewDeletionSchema = z.object({
  requestId: z.string().uuid("The deletion request is invalid."),
});

export const inviteMemberSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  password: z.string().min(8, "Use at least 8 characters").max(72),
  role: z.enum(["hr", "owner"]),
});

export const resetMemberPasswordSchema = z.object({
  userId: z.string().uuid("The team member is invalid."),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});

export const teamMemberIdSchema = z.object({
  userId: z.string().uuid("The team member is invalid."),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type LocationInput = z.infer<typeof locationSchema>;

export type EmployeeFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type LocationFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ProfileNameFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ProfilePasswordFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

export type DeletionRequestFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

export type InviteMemberFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ResetMemberPasswordFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
};

export function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
