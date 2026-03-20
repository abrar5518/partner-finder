import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const campaignCount = await prisma.campaign.count({
    where: { userId: user?.id },
  });

  const totalResponses = await prisma.response.count({
    where: { campaign: { userId: user?.id } },
  });

  const totalVisits = await prisma.visit.count({
    where: { campaign: { userId: user?.id } },
  });

  const conversion = totalVisits > 0 ? Math.round((totalResponses / totalVisits) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="glass-card gradient-border-user rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <span className="badge-user">Welcome back</span>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {user?.email ? user.email.split("@")[0] : "Creator"}, your crush campaigns are ready to grow.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--text-body)]">
              The user workspace now gives you a cleaner starting point: quick actions, clear stats,
              and a better sense of what to do next.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/create-campaign" className="btn-user">
                Create campaign
              </Link>
              <Link href="/dashboard/campaigns" className="btn-ghost">
                View campaigns
              </Link>
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-white/8 bg-slate-950/45 p-5">
            <p className="text-sm font-medium text-white">Account snapshot</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Signed in as</p>
                <p className="mt-2 text-lg font-semibold text-white">{user?.email ?? "No email available"}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Current momentum</p>
                <p className="mt-2 text-lg font-semibold text-rose-200">
                  {campaignCount === 0 ? "Start your first campaign" : `${conversion}% visit to response rate`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Campaigns", value: campaignCount, accent: "text-rose-200" },
          { label: "Responses", value: totalResponses, accent: "text-pink-200" },
          { label: "Visits", value: totalVisits, accent: "text-fuchsia-200" },
          { label: "Conversion", value: `${conversion}%`, accent: "text-emerald-200" },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${item.accent}`}>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-white">Quick actions</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Link href="/create-campaign" className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5 hover:border-rose-500/25 hover:bg-rose-500/10">
              <p className="text-sm font-medium text-white">Create a fresh campaign</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Launch a new public link with a polished campaign builder.
              </p>
            </Link>
            <Link href="/dashboard/campaigns" className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5 hover:border-rose-500/25 hover:bg-rose-500/10">
              <p className="text-sm font-medium text-white">Review active campaigns</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Open your cards, copy links, and jump straight into analytics.
              </p>
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6">
          <h2 className="text-2xl font-semibold text-white">Getting started</h2>
          <div className="mt-5 space-y-4">
            {[
              "Pick a test type that matches the vibe you want.",
              "Share the public link in the places people already respond fast.",
              "Use analytics to see which campaigns deserve another push.",
            ].map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-white/8 bg-white/4 p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--user-gradient)] text-xs font-bold">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-[var(--text-body)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
