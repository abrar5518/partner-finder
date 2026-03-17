import Link from "next/link";
import { getAdminOverview } from "@/lib/admin";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-200">
              Admin Area
            </span>
            <h1 className="text-4xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-300">
              Platform-level overview for users, campaigns, responses, visits, and top-performing campaigns.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/campaigns"
              className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
            >
              Manage Campaigns
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Total Users</p>
            <p className="mt-3 text-4xl font-semibold text-white">{overview.totalUsers}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Total Campaigns</p>
            <p className="mt-3 text-4xl font-semibold text-white">{overview.totalCampaigns}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Total Responses</p>
            <p className="mt-3 text-4xl font-semibold text-white">{overview.totalResponses}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Total Visits</p>
            <p className="mt-3 text-4xl font-semibold text-white">{overview.totalVisits}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Top Campaigns By Responses</h2>
              <p className="mt-1 text-sm text-slate-400">
                Highest-performing campaigns based on response count.
              </p>
            </div>
            <Link
              href="/admin/campaigns"
              className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
            >
              View all campaigns
            </Link>
          </div>

          {overview.topCampaigns.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-400">
              No campaigns found yet.
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr] gap-4 bg-slate-950/80 px-5 py-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                <span>Campaign</span>
                <span>Owner</span>
                <span>Responses</span>
                <span>Visits</span>
                <span>Created</span>
              </div>

              {overview.topCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr] gap-4 border-t border-white/10 bg-slate-900/40 px-5 py-4 text-sm text-slate-300"
                >
                  <div>
                    <p className="font-medium text-white">{campaign.name}</p>
                    <p className="mt-1 text-xs text-cyan-200">{campaign.slug}</p>
                  </div>
                  <span>{campaign.user.email}</span>
                  <span className="font-medium text-white">{campaign._count.responses}</span>
                  <span>{campaign._count.visits}</span>
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(campaign.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
