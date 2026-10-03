import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for owner-only admin tasks (inviting team members,
 * resetting passwords, removing accounts). Bypasses RLS, so every caller
 * MUST verify `user.role === "owner"` in code before using it.
 *
 * Server-only: this module reads a non-public env var and must never be
 * imported by a client component.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Team management is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (and Vercel env).",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
