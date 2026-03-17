import Link from "next/link";
import { getUserCampaigns } from "@/lib/campaigns";
import { requireAuth } from "@/lib/auth";

export default async function DashboardCampaignsPage() {
  const session = await requireAuth("/dashboard/campaigns");
  const campaigns = await getUserCampaigns(session.user.id);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200">
              Protected Route
            </span>
            <h1 className="text-4xl font-semibold tracking-tight">Your Campaigns</h1>
            <p className="text-slate-300">
              Manage your existing campaigns and open each detail page to get the
              shareable public test link.
            </p>
          </div>

          <Link
            href="/create-campaign"
            className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Create New Campaign
          </Link>
        </div>

        <div className="grid gap-4">
          {campaigns.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/40 p-8 text-sm text-slate-300">
              No campaigns yet. Create your first campaign to generate a shareable link.
            </div>
          ) : (
            campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/dashboard/campaign/${campaign.id}`}
                className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 transition hover:border-cyan-300/40 hover:bg-slate-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">{campaign.name}</h2>
                    <p className="text-sm text-slate-400">
                      Slug: <span className="font-medium text-slate-200">{campaign.slug}</span>
                    </p>
                    <p className="text-sm text-slate-400">
                      Crush Name:{" "}
                      <span className="text-slate-200">{campaign.crushName || "Not set"}</span>
                    </p>
                  </div>

                  <p className="text-sm text-slate-400">
                    Created{" "}
                    <span className="text-slate-200">
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(campaign.createdAt)}
                    </span>
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
