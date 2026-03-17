import Link from "next/link";
import { notFound } from "next/navigation";
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
  const shareMessage =
    "Take this quick personality test and discover your compatibility.";
  const totalVisits = campaign._count.visits;
  const totalResponses = campaign._count.responses;
  const completionRate =
    totalVisits > 0 ? ((totalResponses / totalVisits) * 100).toFixed(1) : "0.0";
  const testTypeLabels: Record<string, string> = {
    comparison: "Crush Comparison",
    ideal: "Ideal Partner",
    secret: "Secret Crush Finder",
    personality: "Love Personality Test",
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-200">
              Campaign Analytics
            </span>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">{campaign.name}</h1>
              <p className="max-w-2xl text-slate-300">
                Review campaign details, shareable link performance, and raw
                anonymous responses from participants.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/campaigns"
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
          >
            Back to Campaigns
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">Shareable Test Link</h2>
            <p className="mt-2 text-sm text-slate-400">
              Anyone with this link can open the public test page.
            </p>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-950/80 p-4">
              <p className="break-all text-sm text-cyan-200">{shareLink}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/test/${campaign.slug}`}
                className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Open Public Test Route
              </Link>
              <Link
                href="/create-campaign"
                className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
              >
                Create Another Campaign
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-white">Campaign Details</h2>
            <dl className="mt-5 space-y-4 text-sm text-slate-300">
              <div>
                <dt className="text-slate-500">Campaign ID</dt>
                <dd className="mt-1 break-all text-slate-100">{campaign.id}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Slug</dt>
                <dd className="mt-1 text-slate-100">{campaign.slug}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Test Type</dt>
                <dd className="mt-1 text-slate-100">
                  {testTypeLabels[campaign.testType] || campaign.testType}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Crush Name</dt>
                <dd className="mt-1 text-slate-100">{campaign.crushName || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Public Link</dt>
                <dd className="mt-1 break-all text-cyan-200">{shareLink}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Created</dt>
                <dd className="mt-1 text-slate-100">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(campaign.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <ShareTools
          title="Share Campaign"
          description="Send your public campaign link anywhere and invite more people to take the test."
          link={shareLink}
          message={shareMessage}
          platforms={["whatsapp", "telegram", "facebook"]}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Total Link Opens</p>
            <p className="mt-3 text-3xl font-semibold text-white">{totalVisits}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Total Test Responses</p>
            <p className="mt-3 text-3xl font-semibold text-white">{totalResponses}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Completion Rate</p>
            <p className="mt-3 text-3xl font-semibold text-white">{completionRate}%</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h3 className="text-base font-semibold text-white">Intro Message</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {campaign.message || "No intro message added yet."}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h3 className="text-base font-semibold text-white">Final Message</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {campaign.finalMessage || "No final message added yet."}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Responses</h2>
              <p className="mt-1 text-sm text-slate-400">
                Raw anonymous responses submitted for this campaign.
              </p>
            </div>
            <p className="text-sm text-slate-400">{totalResponses} submissions</p>
          </div>

          {campaign.responses.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-300">
              No responses yet. Share the public link to start collecting answers.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {campaign.responses.map((response, index) => {
                const answers = response.answers as CampaignResponseAnswers;
                const finalChoice =
                  answers.intuitionChoice ||
                  answers.attraction?.happiestConfession ||
                  answers.chosenPerson ||
                  "No final choice recorded";

                return (
                  <article
                    key={response.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm text-slate-500">Response #{index + 1}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          Submitted{" "}
                          <span className="text-slate-100">
                            {new Intl.DateTimeFormat("en-US", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(response.createdAt)}
                          </span>
                        </p>
                      </div>

                      <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-100">
                        Final Choice: {finalChoice}
                      </div>
                    </div>

                    <div className="mt-5">
                      <ComparisonResponseDetails answers={answers} responseId={response.id} />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
