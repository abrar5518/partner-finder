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
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | undefined>(errorMessage);

  return (
    <form
      className="space-y-5"
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
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      {formError ? (
        <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--text-body)]">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="input-base input-user"
          placeholder="you@example.com"
        />
        <p className="text-xs leading-5 text-[var(--text-muted)]">
          Use the same email you created your campaigns with.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="password" className="text-sm font-medium text-[var(--text-body)]">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="text-xs font-medium text-rose-200 hover:text-white"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          className="input-base input-user"
          placeholder="Enter your password"
        />
        <p className="text-xs leading-5 text-[var(--text-muted)]">
          A secure sign-in with instant redirect back to your dashboard.
        </p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-body)]">
        New here? Register first, then come back to view your analytics and response trends.
      </div>

      <button type="submit" disabled={pending} className="btn-user w-full">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
