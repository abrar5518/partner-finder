import type { ReactNode } from "react";
import { requireAdmin, getCurrentUser } from "@/lib/auth";
import { AdminLayoutClient } from "@/components/ui/admin-layout-client";

type AdminLayoutProps = {
  children: ReactNode;
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdmin();
  const user = await getCurrentUser();

  return (
    <AdminLayoutClient userEmail={user?.email}>
      {children}
    </AdminLayoutClient>
  );
}
