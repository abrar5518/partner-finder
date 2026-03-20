import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { AuthCard } from "@/components/ui/auth-card";
import { auth } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
    success?: string;
  }>;
};

const loginMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  default: "Welcome back. Sign in to keep tracking your campaigns.",
  registered: "Account created successfully. Sign in below to continue.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";
  const errorMessage = params.error ? loginMessages[params.error] ?? loginMessages.default : undefined;
  const successMessage =
    params.success === "registered" ? loginMessages.registered : undefined;

  return (
    <AuthCard
      badge="Welcome back"
      title="Sign in and open your crush dashboard"
      description="Review campaign activity, keep sharing your links, and jump back into the experience without any backend changes."
      footer={{
        href: "/register",
        label: "Need an account? Create one",
      }}
    >
      <LoginForm callbackUrl={callbackUrl} errorMessage={errorMessage} successMessage={successMessage} />
    </AuthCard>
  );
}
