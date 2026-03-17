import Link from "next/link";
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
      badge="User Auth"
      title="Register Page"
      description="Create an account with email and password. Passwords are hashed before they are stored."
      footer={{
        href: "/login",
        label: "Already have an account? Login",
      }}
    >
      <form action={registerUser} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {errorMessage}
            {minLengthHint}
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
            minLength={6}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-slate-200"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
            placeholder="Repeat your password"
          />
        </div>

        <SubmitButton className="w-full">Create Account</SubmitButton>
      </form>

      <p className="text-xs text-slate-400">
        After registration you will be redirected to{" "}
        <Link href="/login" className="text-cyan-200 underline underline-offset-4">
          login
        </Link>
        .
      </p>
    </AuthCard>
  );
}
