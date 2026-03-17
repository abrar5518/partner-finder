import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdmin();

  return <>{children}</>;
}
