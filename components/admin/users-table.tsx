"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteUserAction } from "@/app/admin/actions";

type AdminUserRow = {
  id: string;
  email: string;
  createdAt: Date | string;
  _count: {
    campaigns: number;
  };
};

type AdminUsersTableProps = {
  users: AdminUserRow[];
};

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "new">("all");
  const [mountedAt] = useState(() => Date.now());

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery = user.email.toLowerCase().includes(query.toLowerCase());
        const matchesFilter =
        filter === "all"
          ? true
          : filter === "active"
            ? user._count.campaigns > 0
            : mountedAt - new Date(user.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30;

      return matchesQuery && matchesFilter;
    });
  }, [filter, mountedAt, query, users]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by email"
          className="input-base input-admin"
        />
        <div className="inline-flex rounded-2xl border border-white/8 bg-slate-950/60 p-1">
          {[
            { value: "all", label: "All users" },
            { value: "active", label: "Has campaigns" },
            { value: "new", label: "New this month" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value as "all" | "active" | "new")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                filter === option.value
                  ? "bg-white text-slate-950"
                  : "text-[var(--text-body)] hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-white/4">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>User</th>
                <th>Joined</th>
                <th>Campaigns</th>
                <th>Profile state</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const initials = user.email.slice(0, 2).toUpperCase();

                return (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--admin-gradient)] text-xs font-bold text-white">
                          {initials}
                        </span>
                        <div>
                          <p className="font-medium text-white">{user.email}</p>
                          <p className="text-xs text-[var(--text-muted)]">User account</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(new Date(user.createdAt))}
                    </td>
                    <td className="text-sm text-white">{user._count.campaigns}</td>
                    <td>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          user._count.campaigns > 0
                            ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
                            : "border border-amber-500/25 bg-amber-500/10 text-amber-200"
                        }`}
                      >
                        {user._count.campaigns > 0 ? "Active creator" : "No campaigns yet"}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/campaigns?userId=${user.id}`} className="btn-ghost px-3 py-2 text-xs">
                          View campaigns
                        </Link>
                        <form action={deleteUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <button
                            type="submit"
                            className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-100 hover:bg-rose-500/20"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">
                      No users match the current search or filter.
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
