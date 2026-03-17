import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
              Authenticated Area
            </span>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">Dashboard Page</h1>
              <p className="max-w-2xl text-slate-300">
                Protected dashboard placeholder for campaign owners. Signed in as{" "}
                <span className="font-medium text-white">{user?.email}</span>.
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/dashboard/campaigns"
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
          >
            View Campaigns
          </a>
          <a
            href="/create-campaign"
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
          >
            Create Campaign
          </a>
        </div>
      </div>
    </main>
  );
}
