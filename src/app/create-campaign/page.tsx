import { CreateCampaignForm } from "@/components/dashboard/create-campaign-form";
import { requireAuth } from "@/lib/auth";

export default async function CreateCampaignPage() {
  await requireAuth("/create-campaign");

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200">
            Protected Route
          </span>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight">Create Campaign</h1>
            <p className="max-w-2xl text-slate-300">
              Create a new crush test campaign, generate a unique share slug, and
              continue to the campaign detail page after saving.
            </p>
          </div>
        </div>

        <CreateCampaignForm />
      </div>
    </main>
  );
}
