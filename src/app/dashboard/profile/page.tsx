import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { PasswordForm, ProfileNameForm } from "@/components/dashboard/ProfileForms";
import { updateProfileName, updateProfilePassword } from "@/app/dashboard/actions";
import { getMyProfile } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function ProfilePage() {
  const profile = await getMyProfile();

  return (
    <div className="space-y-8">
      {profile.mustChangePassword && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-200">
          <KeyRound className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            <span className="font-bold">Change your temporary password to continue.</span>{" "}
            Set a new password below — the rest of the dashboard unlocks once you do.
          </p>
        </div>
      )}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Account</p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your profile
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Review your owner/HR account details, update your display name, or change your
          password.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-secondary font-heading text-lg font-extrabold text-white dark:bg-white/10">
            {initials(profile.fullName)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-heading text-xl font-extrabold">{profile.fullName}</h2>
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500 dark:text-slate-400">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {profile.email}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              {profile.role === "owner" ? "Owner" : "HR administrator"}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {profile.status}
            </span>
          </div>
        </div>
        <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 text-sm sm:grid-cols-3 dark:border-white/10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Work email
            </p>
            <p className="mt-1.5 truncate font-semibold">{profile.email}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Read-only. Contact an owner to change it.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Access role
            </p>
            <p className="mt-1.5 font-semibold capitalize">{profile.role}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Roles are managed outside this page.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Member since
            </p>
            <p className="mt-1.5 font-semibold">{formatDate(profile.created_at.slice(0, 10))}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Active owner/HR workspace account.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold">Display name</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Shown across the dashboard beside your avatar.
            </p>
          </div>
        </div>
        <ProfileNameForm currentName={profile.fullName} action={updateProfileName} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#11151d] sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-extrabold">Change password</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Use at least 8 characters. You stay signed in on this device.
            </p>
          </div>
        </div>
        <PasswordForm action={updateProfilePassword} />
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500 dark:bg-white/5 dark:text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>
            Password changes apply to your sign-in immediately. If you forget it, ask an
            owner to reset it from the Supabase dashboard.
          </span>
        </div>
      </section>
    </div>
  );
}
