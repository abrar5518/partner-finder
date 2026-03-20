import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignAnalyticsPanel } from "@/components/dashboard/campaign-analytics-panel";
import { ComparisonResponseDetails } from "@/components/dashboard/comparison-response-details";
import { ShareTools } from "@/components/ui/share-tools";
import { env } from "@/lib/env";
import type { CampaignResponseAnswers } from "@/lib/campaigns";
import { getUserCampaignAnalyticsById } from "@/lib/campaigns";
import { requireAuth } from "@/lib/auth";

type DashboardCampaignDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const testTypeLabels: Record<string, string> = {
  comparison: "Comparison",
  ideal: "Ideal Partner",
  secret: "Secret Crush",
  personality: "Personality",
};

export default async function DashboardCampaignDetailPage({
  params,
}: DashboardCampaignDetailPageProps) {
  const { id } = await params;
  const session = await requireAuth(`/dashboard/campaign/${id}`);
  const campaign = await getUserCampaignAnalyticsById(session.user.id, id);

  if (!campaign) {
    notFound();
  }

  const shareLink = `${env.SITE_URL}/test/${campaign.slug}`;
  const totalVisits = campaign._count.visits;
  const totalResponses = campaign._count.responses;
  const completionRate =
    totalVisits > 0 ? `${Math.round((totalResponses / totalVisits) * 100)}%` : "0%";

  return (
    <div className="space-y-6">
      <section className="glass-card gradient-border-user rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap gap-3">
              <span className="badge-user">Campaign detail</span>
              <span className="rounded-full border border-white/8 bg-white/4 px-3 py-1 text-xs text-[var(--text-body)]">
                {testTypeLabels[campaign.testType] ?? "Campaign"}
              </span>
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">{campaign.name}</h1>
            <p className="text-sm leading-7 text-[var(--text-body)]">
              {campaign.crushName
                ? `Built around ${campaign.crushName}.`
                : "A public-facing anonymous campaign with private analytics."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={`/test/${campaign.slug}`} className="btn-user">
              Open public page
            </Link>
            <Link href="/dashboard/campaigns" className="btn-ghost">
              Back to campaigns
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Visits", value: totalVisits },
          { label: "Responses", value: totalResponses },
          { label: "Completion rate", value: completionRate },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <p className="text-sm text-[var(--text-muted)]">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-card rounded-[2rem] overflow-hidden">
          <ShareTools
            title="Share this campaign"
            description="Use the campaign link across stories, chats, and social posts to keep response volume moving."
            link={shareLink}
            message="Take this anonymous crush test and tell me what you really think."
            platforms={["whatsapp", "telegram", "facebook"]}
          />
        </div>

        <div className="glass-card rounded-[2rem] p-6">
          <h2 className="text-xl font-semibold text-white">Campaign copy</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
              <p className="text-sm font-medium text-white">Intro message</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                {campaign.message || "No intro message added yet."}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
              <p className="text-sm font-medium text-white">Final message</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                {campaign.finalMessage || "No closing message added yet."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CampaignAnalyticsPanel responses={campaign.responses} visits={campaign.visits} />

      <section className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/4">
        <div className="border-b border-white/8 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">Responses</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Detailed submissions stay here so the dashboard remains practical, not just pretty.
          </p>
        </div>

        <div className="space-y-4 p-6">
          {campaign.responses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 p-8 text-center text-sm text-[var(--text-body)]">
              No responses yet. Your share tools and analytics shell are ready as soon as the first
              answer comes in.
            </div>
          ) : (
            campaign.responses.map((response, index) => {
              const answers = response.answers as CampaignResponseAnswers;
              const finalChoice =
                answers.intuitionChoice ||
                answers.attraction?.happiestConfession ||
                answers.chosenPerson ||
                answers.finalPick ||
                answers.personalityArchetype ||
                "Submission recorded";

              return (
                <article key={response.id} className="rounded-[1.6rem] border border-white/8 bg-slate-950/35">
                  <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Response #{campaign.responses.length - index}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        }).format(response.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      {finalChoice}
                    </span>
                  </div>
                  <div className="p-5">
                    <ComparisonResponseDetails answers={answers} responseId={response.id} />
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
