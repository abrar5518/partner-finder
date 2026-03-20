"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

type DashboardLayoutProps = {
  children: ReactNode;
  userEmail?: string | null;
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard", short: "DB", description: "Overview and momentum" },
  {
    href: "/dashboard/campaigns",
    label: "Campaigns",
    short: "CP",
    description: "Your live and draft tests",
  },
  {
    href: "/create-campaign",
    label: "Create Campaign",
    short: "NC",
    description: "Launch a new link quickly",
  },
];

export function DashboardLayoutClient({ children, userEmail }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLink = useMemo(
    () => navLinks.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)),
    [pathname],
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.1),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.08),transparent_28%)]" />

      <div
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition md:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[18.5rem] border-r border-white/6 bg-slate-950/90 p-4 backdrop-blur-2xl transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass-card gradient-border-user flex h-full flex-col rounded-[2rem] p-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-4">
            <Link href="/dashboard" className="inline-flex items-center gap-3" onClick={() => setMobileOpen(false)}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--user-gradient)] text-xs font-bold shadow-[var(--shadow-user)]">
                CT
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Crush Test</p>
                <p className="text-xs text-[var(--text-muted)]">User workspace</p>
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

          <div className="mt-5">
            <span className="badge-user">Romantic mode</span>
            <p className="mt-3 text-sm leading-6 text-[var(--text-body)]">
              Build playful campaigns, share them fast, and keep your insights organized.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${active ? "active-user" : ""}`}
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
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--user-gradient)] text-sm font-bold">
                  {(userEmail?.[0] ?? "U").toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{userEmail ?? "User"}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">Signed in and ready to share</p>
                </div>
              </div>
            </div>
            <LogoutButton variant="user" />
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
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">User dashboard</p>
                <h1 className="text-lg font-semibold text-white">{activeLink?.label ?? "Dashboard"}</h1>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <Link href="/" className="btn-ghost px-4 py-3 text-sm">
                Public site
              </Link>
              <Link href="/create-campaign" className="btn-user px-4 py-3 text-sm">
                New campaign
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
