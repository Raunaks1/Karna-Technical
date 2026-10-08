/**
 * Dashboard role definitions and display helpers.
 *
 * Client-safe: this module has zero server imports, so both server
 * components/actions and "use client" components may import from it.
 * (Importing from "@/lib/auth" inside a client component breaks the build
 * because auth.ts pulls in the Supabase server client.)
 */

export type DashboardRole = "owner" | "hr" | "marketing";

export function isOwnerRole(role: DashboardRole) {
  return role === "owner";
}

/**
 * Marketing Executives are view-only (except Feedback, which every
 * dashboard role manages). Owners and HR keep full edit rights.
 */
export function canEditData(role: DashboardRole) {
  return role === "owner" || role === "hr";
}

export function roleLabel(role: DashboardRole) {
  if (role === "owner") {
    return "Owner";
  }

  if (role === "hr") {
    return "HR Administrator";
  }

  return "Marketing Executive";
}

export function roleShortLabel(role: DashboardRole) {
  if (role === "owner") {
    return "Owner";
  }

  if (role === "hr") {
    return "HR";
  }

  return "Marketing";
}
