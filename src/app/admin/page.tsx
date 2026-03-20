import Link from "next/link";
import { getAdminOverview } from "@/lib/admin";

export default async function AdminPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-6">
      <section className="glass-card gradient-border-admin rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="badge-admin">Platform overview</span>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Admin operations with a cleaner visual split.</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">
              The admin area now feels deliberately different from the user dashboard, with a
              stronger monitoring and moderation tone.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/users" className="btn-admin">
              Manage users
            </Link>
            <Link href="/admin/campaigns" className="btn-ghost">
              Review campaigns
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Users", value: overview.totalUsers, delta: "All registered accounts" },
          { label: "Campaigns", value: overview.totalCampaigns, delta: "Live and historical content" },
          { label: "Responses", value: overview.totalResponses, delta: "Captured submissions" },
          { label: "Visits", value: overview.totalVisits, delta: "Tracked public page opens" },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-violet-200">{item.delta}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-white">Quick nav</h2>
          <div className="mt-5 grid gap-4">
            <Link href="/admin/users" className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5 hover:border-violet-500/25 hover:bg-violet-500/10">
              <p className="text-sm font-medium text-white">Users registry</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Search accounts, filter active creators, and clean up edge cases.
              </p>
            </Link>
            <Link href="/admin/campaigns" className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5 hover:border-violet-500/25 hover:bg-violet-500/10">
              <p className="text-sm font-medium text-white">Campaign moderation</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Review public-facing content, jump into details, and remove problem campaigns.
              </p>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/4">
          <div className="border-b border-white/8 px-6 py-5">
            <h2 className="text-xl font-semibold text-white">Top campaigns</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Highest-performing campaigns by response count.
            </p>
          </div>

          {overview.topCampaigns.length === 0 ? (
            <div className="p-6 text-sm text-[var(--text-muted)]">No campaigns found yet.</div>
          ) : (
            <div className="divide-y divide-white/6">
              {overview.topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--admin-gradient)] text-xs font-bold text-white">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{campaign.user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-body)]">
                    <span>{campaign._count.responses} responses</span>
                    <span>{campaign._count.visits} visits</span>
                    <span>{campaign.slug}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
