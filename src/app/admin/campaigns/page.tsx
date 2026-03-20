import Link from "next/link";
import { AdminCampaignsTable } from "@/components/admin/campaigns-table";
import { getAdminCampaigns, getAdminUserSummary } from "@/lib/admin";

type AdminCampaignsPageProps = {
  searchParams: Promise<{
    userId?: string;
  }>;
};

export default async function AdminCampaignsPage({
  searchParams,
}: AdminCampaignsPageProps) {
  const params = await searchParams;
  const selectedUser = params.userId ? await getAdminUserSummary(params.userId) : null;
  const campaigns = await getAdminCampaigns(selectedUser?.id);

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="badge-admin">Campaigns</span>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              {selectedUser ? `Campaigns by ${selectedUser.email}` : "Platform-wide campaign review"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">
              Search by owner, campaign title, or slug. Filter down to popular or freshly created
              campaigns when moderation needs to move fast.
            </p>
          </div>

          {selectedUser ? (
            <Link href="/admin/campaigns" className="btn-admin w-full sm:w-auto">
              Clear user filter
            </Link>
          ) : null}
        </div>
      </section>

      <AdminCampaignsTable campaigns={campaigns} />
    </div>
  );
}
