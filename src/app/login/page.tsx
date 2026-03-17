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
  default: "Enter your email and password to continue.",
  registered: "Account created successfully. You can sign in now.",
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
      badge="User Auth"
      title="Login Page"
      description="Sign in with your email and password to access your dashboard."
      footer={{
        href: "/register",
        label: "Need an account? Register",
      }}
    >
      <LoginForm callbackUrl={callbackUrl} errorMessage={errorMessage} successMessage={successMessage} />
    </AuthCard>
  );
}
