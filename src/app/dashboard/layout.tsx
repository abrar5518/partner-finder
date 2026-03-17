import type { ReactNode } from "react";
import { requireAuth } from "@/lib/auth";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await requireAuth("/dashboard");

  return <>{children}</>;
}
