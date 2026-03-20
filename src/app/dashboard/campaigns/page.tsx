import Link from "next/link";
import { getUserCampaigns } from "@/lib/campaigns";
import { requireAuth } from "@/lib/auth";

const typeLabelMap: Record<string, string> = {
  comparison: "Comparison",
  ideal: "Ideal Partner",
  secret: "Secret Crush",
  personality: "Personality",
};

export default async function DashboardCampaignsPage() {
  const session = await requireAuth("/dashboard/campaigns");
  const campaigns = await getUserCampaigns(session.user.id);

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="badge-user">Campaign library</span>
            <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Manage every live test from one place.</h1>
            <p className="mt-3 text-sm leading-7 text-[var(--text-body)]">
              Open campaign details, copy public slugs, and keep the user-side experience focused on
              sharing and results.
            </p>
          </div>
          <Link href="/create-campaign" className="btn-user w-full sm:w-auto">
            Create campaign
          </Link>
        </div>
      </section>

      {campaigns.length === 0 ? (
        <section className="glass-card rounded-[2rem] p-10 text-center">
          <span className="badge-user">No campaigns yet</span>
          <h2 className="mt-4 text-2xl font-semibold text-white">Create your first campaign</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--text-body)]">
            You have the new dashboard shell in place. The next step is launching your first test so
            the cards, analytics, and share tools can light up.
          </p>
          <Link href="/create-campaign" className="btn-user mt-6">
            Create your first campaign
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="glass-card glass-card-hover rounded-[1.8rem] p-6">
              <div className="flex items-start justify-between gap-4">
                <span className="badge-user">{typeLabelMap[campaign.testType] ?? "Campaign"}</span>
                <span className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-[var(--text-muted)]">
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(campaign.createdAt)}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">{campaign.name}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                {campaign.crushName
                  ? `Targeted around ${campaign.crushName}.`
                  : "A general anonymous campaign ready to share anywhere."}
              </p>

              <div className="mt-5 rounded-2xl border border-white/8 bg-slate-950/40 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Share link</p>
                <p className="mt-2 break-all font-mono text-sm text-rose-200">/test/{campaign.slug}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href={`/dashboard/campaign/${campaign.id}`} className="btn-user flex-1 px-4 py-3 text-sm">
                  View analytics
                </Link>
                <Link href={`/test/${campaign.slug}`} className="btn-ghost px-4 py-3 text-sm">
                  Open page
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
