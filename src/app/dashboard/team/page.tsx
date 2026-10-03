import { Mail, ShieldCheck, UserPlus } from "lucide-react";
import { redirect } from "next/navigation";
import { removeMember, setMemberStatus } from "@/app/dashboard/team/actions";
import { InviteMemberForm, ResetPasswordDialog } from "@/components/dashboard/TeamForms";
import RemoveMemberButton from "@/components/dashboard/RemoveMemberButton";
import { getDashboardUser } from "@/lib/auth";
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
    // Never crash the route (Next.js 500 + "This page couldn't load").
    // Missing SUPABASE_SERVICE_ROLE_KEY on Vercel is the common cause:
    // it exists in local .env.local but was never added to Production env.
    loadError = error instanceof Error ? error.message : "Unable to load team members.";
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
          Owner only
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Team access
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Invite owner and HR accounts, reset passwords, or revoke access — no Supabase panel
          needed.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold">Invite a member</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Login details are emailed to them. They must change the password on first sign-in.
            </p>
          </div>
        </div>
        <InviteMemberForm />
      </section>

      {loadError && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 sm:p-7">
          <h2 className="font-heading text-base font-extrabold">Team list could not be loaded</h2>
          <p className="mt-2 font-medium">{loadError}</p>
          <p className="mt-3 text-xs leading-5 opacity-90">
            If this works locally but fails on Vercel, check in order: 1){" "}
            <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono dark:bg-white/10">
              SUPABASE_SERVICE_ROLE_KEY
            </code>{" "}
            is the <strong>service_role</strong> key (not anon), from the same Supabase
            project, added to the <strong>Production</strong> environment; 2) you{" "}
            <strong>redeployed after adding it</strong> (env changes need a new deployment);
            3) Vercel → Logs → Runtime Logs for a{" "}
            <code className="rounded bg-red-100 px-1.5 py-0.5 font-mono dark:bg-white/10">
              listTeamMembers failed
            </code>{" "}
            entry — its message names the real cause (e.g. invalid API key means a wrong
            key was pasted). Invites and password resets need this key too.
          </p>
        </section>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11151d]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-extrabold">Members</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {members.length} {members.length === 1 ? "account" : "accounts"} with dashboard access
              </p>
            </div>
          </div>
        </div>

        {members.length ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[820px] text-left">
                <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:bg-white/5 dark:text-slate-500">
                  <tr>
                    <th className="px-7 py-4">Member</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Added</th>
                    <th className="px-7 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {members.map((member) => {
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
                            {member.role === "owner" ? "Owner" : "HR"}
                          </span>
                        </td>
                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-sm text-slate-600 dark:text-slate-300">
                          {safeDateTime(member.created_at)}
                        </td>
                        <td className="px-7 py-5 text-right">
                          {isSelf ? (
                            <span className="text-xs text-slate-400">Current account</span>
                          ) : (
                            <div className="inline-flex items-center gap-1">
                              <form action={setMemberStatus}>
                                <input type="hidden" name="userId" value={member.id} />
                                <button
                                  type="submit"
                                  className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                                >
                                  {isActive ? "Deactivate" : "Reactivate"}
                                </button>
                              </form>
                              <ResetPasswordDialog userId={member.id} memberName={member.fullName} />
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

            <div className="divide-y divide-slate-100 dark:divide-white/10 lg:hidden">
              {members.map((member) => {
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
                          {member.role} · {member.status}
                        </p>
                      </div>
                    </div>
                    {!isSelf && (
                      <div className="mt-4 flex flex-wrap items-center gap-1">
                        <form action={setMemberStatus}>
                          <input type="hidden" name="userId" value={member.id} />
                          <button
                            type="submit"
                            className="rounded-lg px-2 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
                          >
                            {isActive ? "Deactivate" : "Reactivate"}
                          </button>
                        </form>
                        <ResetPasswordDialog userId={member.id} memberName={member.fullName} />
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
          <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            No team members found.
          </div>
        )}
      </section>
    </div>
  );
}
