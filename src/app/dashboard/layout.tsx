import type { ReactNode } from "react";
import { requireAuth, getCurrentUser } from "@/lib/auth";
import { DashboardLayoutClient } from "@/components/ui/dashboard-layout-client";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await requireAuth("/dashboard");
  const user = await getCurrentUser();

  return (
    <DashboardLayoutClient userEmail={user?.email}>
      {children}
    </DashboardLayoutClient>
  );
}
