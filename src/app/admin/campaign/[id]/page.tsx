import Link from "next/link";
import { notFound } from "next/navigation";
import { ComparisonResponseDetails } from "@/components/dashboard/comparison-response-details";
import type { CampaignResponseAnswers } from "@/lib/campaigns";
import { getAdminCampaignAnalyticsById } from "@/lib/admin";

type AdminCampaignDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCampaignDetailPage({
  params,
}: AdminCampaignDetailPageProps) {
  const { id } = await params;
  const campaign = await getAdminCampaignAnalyticsById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-200">
              Admin Campaign Detail
            </span>
            <h1 className="text-4xl font-semibold tracking-tight">{campaign.name}</h1>
            <p className="text-slate-300">
              Owner: <span className="text-white">{campaign.user.email}</span>
            </p>
          </div>

          <Link
            href="/admin/campaigns"
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
          >
            Back to Admin Campaigns
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Slug</p>
            <p className="mt-3 break-all text-lg font-semibold text-white">{campaign.slug}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Test Type</p>
            <p className="mt-3 text-lg font-semibold text-white">{campaign.testType}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Responses</p>
            <p className="mt-3 text-3xl font-semibold text-white">{campaign._count.responses}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <p className="text-sm text-slate-500">Visits</p>
            <p className="mt-3 text-3xl font-semibold text-white">{campaign._count.visits}</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Intro Message</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {campaign.message || "No intro message added yet."}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold text-white">Final Message</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {campaign.finalMessage || "No final message added yet."}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Responses</h2>
              <p className="mt-1 text-sm text-slate-400">
                Full submitted data for this campaign is shown below.
              </p>
            </div>
            <p className="text-sm text-slate-400">{campaign.responses.length} submissions</p>
          </div>

          {campaign.responses.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-300">
              No responses yet.
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
