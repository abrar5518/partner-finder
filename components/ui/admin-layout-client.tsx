"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

type AdminLayoutProps = {
  children: ReactNode;
  userEmail?: string | null;
};

const navLinks = [
  { href: "/admin", label: "Overview", short: "OV", description: "Platform snapshot" },
  { href: "/admin/users", label: "Users", short: "US", description: "Accounts and activity" },
  {
    href: "/admin/campaigns",
    label: "Campaigns",
    short: "CP",
    description: "Content moderation and cleanup",
  },
];

export function AdminLayoutClient({ children, userEmail }: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLink = useMemo(
    () => navLinks.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)),
    [pathname],
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_28%)]" />

      <div
        className={`fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm transition md:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[18.5rem] border-r border-white/6 bg-slate-950/92 p-4 backdrop-blur-2xl transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass-card gradient-border-admin flex h-full flex-col rounded-[2rem] p-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-4">
            <Link href="/admin" className="inline-flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--admin-gradient)] text-xs font-bold shadow-[var(--shadow-admin)]">
                AP
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Admin Panel</p>
                <p className="text-xs text-[var(--text-muted)]">Platform control</p>
              </div>
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-sm text-[var(--text-body)] md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              X
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <span className="badge-admin">Admin panel</span>
            <p className="text-sm leading-6 text-[var(--text-body)]">
              Review users, monitor campaigns, and keep the platform tidy without touching core
              business logic.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${active ? "active-admin" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-xs font-bold">
                    {link.short}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-inherit">{link.label}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{link.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 border-t border-white/6 pt-5">
            <div className="rounded-[1.4rem] border border-white/8 bg-white/4 p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--admin-gradient)] text-sm font-bold">
                  {(userEmail?.[0] ?? "A").toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{userEmail ?? "Admin"}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">Power tools enabled</p>
                </div>
              </div>
            </div>
            <LogoutButton variant="admin" />
          </div>
        </div>
      </aside>

      <div className="md:pl-[18.5rem]">
        <header className="sticky top-0 z-30 border-b border-white/6 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-sm font-semibold text-white md:hidden"
                onClick={() => setMobileOpen(true)}
              >
                Menu
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Admin workspace</p>
                <h1 className="text-lg font-semibold text-white">{activeLink?.label ?? "Admin"}</h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="badge-admin">Platform guardian</span>
              <Link href="/dashboard" className="btn-ghost px-4 py-3 text-sm">
                User dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
