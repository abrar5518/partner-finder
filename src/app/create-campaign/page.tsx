import { CreateCampaignForm } from "@/components/dashboard/create-campaign-form";
import { requireAuth } from "@/lib/auth";

export default async function CreateCampaignPage() {
  await requireAuth("/create-campaign");

  return (
    <div className="space-y-6">
      <section className="glass-card gradient-border-user rounded-[2rem] p-6 sm:p-8">
        <div className="max-w-3xl space-y-4">
          <span className="badge-user">Campaign builder</span>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Launch a new crush test with cleaner structure and better guidance.
          </h1>
          <p className="text-sm leading-7 text-[var(--text-body)]">
            Choose the test experience, name your campaign, and customize the messages people will
            see before and after they submit.
          </p>
        </div>
      </section>

      <CreateCampaignForm />
    </div>
  );
}
