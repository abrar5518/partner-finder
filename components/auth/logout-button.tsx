"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

type LogoutButtonProps = {
  variant?: "user" | "admin";
};

export function LogoutButton({ variant = "user" }: LogoutButtonProps) {
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
      className={
        variant === "admin"
          ? "btn-ghost w-full justify-center border-violet-500/20 bg-violet-500/10 text-violet-100 hover:border-violet-400/30 hover:bg-violet-500/20"
          : "btn-ghost w-full justify-center border-rose-500/20 bg-rose-500/10 text-rose-100 hover:border-rose-400/30 hover:bg-rose-500/20"
      }
    >
      {pending ? "Signing out..." : "Logout"}
    </button>
  );
}
