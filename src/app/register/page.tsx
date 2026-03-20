import { redirect } from "next/navigation";
import { AuthCard } from "@/components/ui/auth-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { auth } from "@/lib/auth";
import { registerUser } from "@/app/register/actions";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
    min?: string;
  }>;
};

const registerMessages: Record<string, string> = {
  missing_fields: "All fields are required.",
  password_too_short: "Password is too short.",
  password_mismatch: "Passwords do not match.",
  email_taken: "An account with this email already exists.",
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const errorMessage = params.error
    ? registerMessages[params.error] ?? "Unable to create account."
    : undefined;
  const minLengthHint =
    params.error === "password_too_short" && params.min
      ? ` Use at least ${params.min} characters.`
      : "";

  return (
    <AuthCard
      badge="Create account"
      title="Start building your first anonymous test"
      description="Create your account to unlock campaign creation, response analytics, and a cleaner dashboard experience from day one."
      footer={{
        href: "/login",
        label: "Already registered? Sign in",
      }}
    >
      <form action={registerUser} className="space-y-5">
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
            {minLengthHint}
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
            className="input-base input-user"
            placeholder="you@example.com"
          />
          <p className="text-xs leading-5 text-[var(--text-muted)]">
            This becomes the identity shown in your sidebar and dashboards.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-[var(--text-body)]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="input-base input-user"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--text-body)]">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="input-base input-user"
              placeholder="Repeat your password"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm leading-6 text-[var(--text-body)]">
          You will land in the user dashboard after sign-in, while admins keep a separate purple
          control area.
        </div>

        <SubmitButton className="w-full" pendingText="Creating account...">
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
