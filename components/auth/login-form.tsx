"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

type LoginFormProps = {
  callbackUrl: string;
  errorMessage?: string;
  successMessage?: string;
};

export function LoginForm({
  callbackUrl,
  errorMessage,
  successMessage,
}: LoginFormProps) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | undefined>(errorMessage);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setFormError(undefined);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const password = String(formData.get("password") ?? "");

        startTransition(async () => {
          const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
          });

          if (!result || result.error) {
            setFormError("Invalid email or password.");
            return;
          }

          window.location.href = result.url ?? callbackUrl;
        });
      }}
    >
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      {formError ? (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-200">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing In..." : "Login"}
      </button>
    </form>
  );
}
