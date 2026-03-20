import { AdminUsersTable } from "@/components/admin/users-table";
import { getAdminUsers } from "@/lib/admin";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <span className="badge-admin">Users</span>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Search, filter, and review user accounts.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-body)]">
          This table stays focused on moderation and account review, with a clearer admin visual
          treatment than the main user-facing product.
        </p>
      </section>

      <AdminUsersTable users={users} />
    </div>
  );
}
