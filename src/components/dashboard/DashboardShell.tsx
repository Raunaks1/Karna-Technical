"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  Menu,
  Plus,
  ShieldCheck,
  Star,
  UserCheck,
  UserCog,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { DashboardUser } from "@/lib/auth";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/dashboard/ThemeToggle";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, ownerOnly: false },
  { label: "Employees", href: "/dashboard/employees", icon: Users, ownerOnly: false },
  { label: "Add employee", href: "/dashboard/employees/new", icon: Plus, ownerOnly: false },
  { label: "Locations", href: "/dashboard/locations", icon: MapPin, ownerOnly: false },
  { label: "Approvals", href: "/dashboard/approvals", icon: UserCheck, ownerOnly: true },
  { label: "Team", href: "/dashboard/team", icon: UserCog, ownerOnly: true },
  { label: "Feedback", href: "/dashboard/feedback", icon: Star, ownerOnly: false },
];

function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-400/40 hover:bg-red-50 hover:text-primary disabled:opacity-60 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white ${compact ? "w-full" : ""}`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Sign out
    </button>
  );
}

function ProfileMenu({ user }: { user: DashboardUser }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open ]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white transition ring-offset-2 ring-offset-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-white/10 dark:ring-offset-[#0b0e14]"
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#11151d]"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 p-4 dark:border-white/10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white dark:bg-white/10">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user.fullName}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              <span className="mt-1.5 inline-block rounded-full border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-white/10 dark:text-slate-400">
                {user.role === "owner" ? "Owner" : "HR administrator"}
              </span>
            </div>
          </div>
          <div className="p-2">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <UserRound className="h-4 w-4" />
              View profile
            </Link>
            <div className="mt-1 border-t border-slate-100 pt-2 dark:border-white/10">
              <LogoutButton compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardShell({
  user,
  pendingApprovals = 0,
  children,
}: {
  user: DashboardUser;
  pendingApprovals?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavigation = navigation.filter((item) => !item.ownerOnly || user.role === "owner");

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  function NavBadge({ href }: { href: string }) {
    if (href !== "/dashboard/approvals" || pendingApprovals <= 0) {
      return null;
    }

    return (
      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-extrabold text-white">
        {pendingApprovals > 99 ? "99+" : pendingApprovals}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-900 dark:bg-[#0b0e14] dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#11151d] lg:flex">
        <div className="flex h-24 items-center gap-3 border-b border-slate-200 px-7 dark:border-white/10">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
            <Logo className="h-9 w-9" />
          </div>
          <div>
            <p className="font-heading text-sm font-extrabold tracking-tight">Karna Technical</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              People operations
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            Workspace
          </p>
          <nav className="space-y-1.5">
            {visibleNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-primary text-white shadow-lg shadow-red-950/15"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                  <NavBadge href={item.href} />
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Private workspace</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Employee records are visible only to authorized owner and HR accounts.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-white/10">
          <ThemeToggle />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0e14]/90">
          <div className="flex h-20 items-center justify-between px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Secure portal</p>
                <p className="mt-1 font-heading text-lg font-extrabold tracking-tight">People operations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:block">
                {user.role === "owner" ? "Owner" : "HR administrator"}
              </div>
              <ProfileMenu key={pathname} user={user} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/60"
          />
          <aside className="relative flex h-full w-[min(86vw,20rem)] flex-col bg-white p-5 shadow-2xl dark:bg-[#11151d]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Logo className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-heading text-sm font-extrabold">Karna Technical</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">People operations</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1.5 py-7">
              {visibleNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                    <NavBadge href={item.href} />
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-slate-200 pt-4 dark:border-white/10">
              <ThemeToggle />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
