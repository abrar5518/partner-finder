import Link from "next/link";
import { deleteCampaignAction } from "@/app/admin/actions";
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
  const selectedUser = params.userId
    ? await getAdminUserSummary(params.userId)
    : null;
  const campaigns = await getAdminCampaigns(selectedUser?.id);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-200">
              Admin Area
            </span>
            <h1 className="text-4xl font-semibold tracking-tight">Admin Campaigns</h1>
            <p className="text-slate-300">
              {selectedUser
                ? `Showing campaigns for ${selectedUser.email}.`
                : "Review all campaigns across the platform."}
            </p>
          </div>

          <div className="flex gap-3">
            {selectedUser ? (
              <Link
                href="/admin/campaigns"
                className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
              >
                Clear Filter
              </Link>
            ) : null}
            <Link
              href="/admin"
              className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
            >
              Back to Admin Dashboard
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950/70 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Campaign</th>
                  <th className="px-6 py-4 font-medium">Owner Email</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Responses</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-t border-white/10 text-slate-200">
                    <td className="px-6 py-4">{campaign.name}</td>
                    <td className="px-6 py-4">{campaign.user.email}</td>
                    <td className="px-6 py-4">{campaign.slug}</td>
                    <td className="px-6 py-4">{campaign._count.responses}</td>
                    <td className="px-6 py-4">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(campaign.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/admin/campaign/${campaign.id}`}
                          className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-medium transition hover:border-cyan-300/40 hover:bg-slate-950"
                        >
                          View Details
                        </Link>

                        <form action={deleteCampaignAction}>
                          <input type="hidden" name="campaignId" value={campaign.id} />
                          <button
                            type="submit"
                            className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-400/20"
                          >
                            Delete Campaign
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
