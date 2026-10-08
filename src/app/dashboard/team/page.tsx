import { Clock, Mail, ShieldAlert, ShieldCheck, UserCheck, UserPlus, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { removeMember, setMemberStatus } from "@/app/dashboard/team/actions";
import { InviteMemberForm, ResendInviteButton, SendResetLinkButton } from "@/components/dashboard/TeamForms";
import RemoveMemberButton from "@/components/dashboard/RemoveMemberButton";
import { getDashboardUser, roleShortLabel } from "@/lib/auth";
import { listTeamMembers } from "@/lib/dashboard";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

function initials(name: string | null | undefined) {
  const cleaned = (name ?? "").trim();

  if (!cleaned) {
    return "—";
  }

  return (
    cleaned
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "—"
  );
}

function safeDateTime(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return formatDateTime(value);
  } catch {
    return "—";
  }
}

export default async function TeamPage() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "owner") {
    redirect("/dashboard");
  }

  let members: Awaited<ReturnType<typeof listTeamMembers>> = [];
  let loadError: string | null = null;

  try {
    members = await listTeamMembers();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Unable to load team members.";
  }

  const pendingMembers = members.filter((m) => m.isPendingInvite);
  const activeMembers = members.filter((m) => !m.isPendingInvite);

  // Test sender heuristic: Resend's onboarding address only delivers to the
  // Resend account owner's own inbox. Real owner/HR invites silently fail
  // until a domain is verified (Squarespace DNS) and RESEND_FROM is updated.
  const resendFrom = process.env.RESEND_FROM ?? "";
  const isTestSender =
    !process.env.RESEND_API_KEY || resendFrom.includes("onboarding@resend.dev");

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            Owner Management
          </p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Team &amp; Access Control
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Invite and manage workspace Owners, HR administrators, and Marketing Executives.
            New members receive a secure magic invitation link to activate their account and
            set their password.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm dark:border-white/10 dark:bg-[#11151d]">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {activeMembers.length} {activeMembers.length === 1 ? "Active User" : "Active Users"}
            </span>
          </div>
          {pendingMembers.length > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                {pendingMembers.length} Pending
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Invite Member Card */}
      {isTestSender && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 sm:p-6">
          <h2 className="font-heading text-base font-extrabold">Email delivery is in test mode</h2>
          <p className="mt-2">
            Current sender:{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
              {resendFrom || "(not set)"}
            </code>{" "}
            — Resend&apos;s test address only delivers to your own inbox, so real team addresses
            will never receive invites. The invitation link is still generated and shown after
            you invite (copy and share it manually as a workaround).
          </p>
          <p className="mt-2 text-xs leading-5 opacity-90">
            To fix permanently: set <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono dark:bg-white/10">RESEND_FROM</code> to
            an address on the verified Resend domain <strong>mail.karnaengservice.com</strong> (e.g.{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono dark:bg-white/10">Karna Technical &lt;noreply@mail.karnaengservice.com&gt;</code>
            — do not use root-domain addresses like team@karnaengservice.com, that domain is not
            verified), plus <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono dark:bg-white/10">RESEND_REPLY_TO=karnatech@karnaengservice.com</code>,
            in <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono dark:bg-white/10">.env.local</code> and the
            Vercel Production env, then <strong>redeploy</strong> (env changes need a fresh
            deployment). This banner disappears once the verified sender is live.
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold">Send Team Invitation</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Generate a secure invitation magic link and email it directly to the recipient.
            </p>
          </div>
        </div>
        <InviteMemberForm />
      </section>

      {/* Load Error Alert */}
      {loadError && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 sm:p-7">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h2 className="font-heading text-base font-extrabold">Team list could not be loaded</h2>
              <p className="mt-1 font-medium">{loadError}</p>
              <p className="mt-3 text-xs leading-5 opacity-90">
                Ensure <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono dark:bg-white/10">SUPABASE_SERVICE_ROLE_KEY</code> is correctly configured in your environment variables.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Pending Invitations Section (if any) */}
      {pendingMembers.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-sm dark:border-amber-900/40 dark:bg-[#11151d]">
          <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/50 px-5 py-4 dark:border-amber-950/50 dark:bg-amber-950/20 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading text-base font-extrabold text-amber-950 dark:text-amber-100">
                  Pending Invitations ({pendingMembers.length})
                </h2>
                <p className="text-xs text-amber-800/80 dark:text-amber-400">
                  These members have been invited but haven&apos;t completed password setup yet.
                  Each resend creates a new link — only the newest email works, and every link
                  works exactly once.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {pendingMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-heading text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    {initials(member.fullName)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                        {member.fullName}
                      </p>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        {roleShortLabel(member.role)}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                        Pending Accept
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Mail className="h-3 w-3" />
                      {member.email || "—"}
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span>Invited {safeDateTime(member.invited_at || member.created_at)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ResendInviteButton userId={member.id} />
                  <RemoveMemberButton
                    userId={member.id}
                    memberName={member.fullName}
                    action={removeMember}
                    label="Revoke"
                    confirmMessage={`Revoke invitation for ${member.fullName}? The invitation link will no longer work.`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Team Members List */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11151d]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold">Active Team Accounts</h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {activeMembers.length} {activeMembers.length === 1 ? "account" : "accounts"} with dashboard access
              </p>
            </div>
          </div>
        </div>

        {activeMembers.length ? (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:bg-white/5 dark:text-slate-500">
                  <tr>
                    <th className="px-7 py-4">Member</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Last Active</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-7 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {activeMembers.map((member) => {
                    const isSelf = member.id === user.id;
                    const isActive = member.status === "active";

                    return (
                      <tr key={member.id} className="transition hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                        <td className="px-7 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                              {initials(member.fullName)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                                {member.fullName}
                                {isSelf && (
                                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <Mail className="h-3 w-3" />
                                {member.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-600 dark:border-white/10 dark:text-slate-300">
                            {roleShortLabel(member.role)}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {member.status}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-600 dark:text-slate-300">
                          {safeDateTime(member.last_sign_in_at)}
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-600 dark:text-slate-300">
                          {safeDateTime(member.created_at)}
                        </td>
                        <td className="px-7 py-5 text-right">
                          {isSelf ? (
                            <span className="text-xs font-medium text-slate-400">Current session</span>
                          ) : (
                            <div className="inline-flex items-center gap-1.5">
                              <SendResetLinkButton userId={member.id} />
                              <form action={setMemberStatus}>
                                <input type="hidden" name="userId" value={member.id} />
                                <button
                                  type="submit"
                                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                  {isActive ? "Deactivate" : "Reactivate"}
                                </button>
                              </form>
                              <RemoveMemberButton
                                userId={member.id}
                                memberName={member.fullName}
                                action={removeMember}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="divide-y divide-slate-100 dark:divide-white/10 lg:hidden">
              {activeMembers.map((member) => {
                const isSelf = member.id === user.id;
                const isActive = member.status === "active";

                return (
                  <div key={member.id} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                        {initials(member.fullName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">
                          {member.fullName}
                          {isSelf && <span className="ml-2 text-[10px] font-bold text-slate-400">(You)</span>}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {member.email || "—"}
                        </p>
                        <p className="mt-1 text-xs capitalize text-slate-500 dark:text-slate-400">
                          {roleShortLabel(member.role)} · {member.status} · Joined {safeDateTime(member.created_at)}
                        </p>
                      </div>
                    </div>
                    {!isSelf && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-white/5">
                        <SendResetLinkButton userId={member.id} />
                        <form action={setMemberStatus}>
                          <input type="hidden" name="userId" value={member.id} />
                          <button
                            type="submit"
                            className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                          >
                            {isActive ? "Deactivate" : "Reactivate"}
                          </button>
                        </form>
                        <RemoveMemberButton
                          userId={member.id}
                          memberName={member.fullName}
                          action={removeMember}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-slate-400">
            <UserCheck className="h-10 w-10 stroke-1 opacity-60" />
            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              No active team members found.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Send an invitation above to add your first team member.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
