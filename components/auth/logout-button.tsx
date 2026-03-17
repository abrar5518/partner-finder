"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await signOut({ callbackUrl: "/login" });
        });
      }}
      disabled={pending}
      className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Signing Out..." : "Logout"}
    </button>
  );
}
