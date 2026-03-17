import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicTestForm } from "@/components/test/public-test-form";
import { getCampaignBySlug, recordCampaignVisit } from "@/lib/campaigns";

type TestPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TestPage({ params }: TestPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || undefined;
  const userAgent = requestHeaders.get("user-agent") || undefined;

  await recordCampaignVisit(campaign.id, {
    ip,
    userAgent,
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200">
              Anonymous Public Test
            </span>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">{campaign.name}</h1>
              <p className="max-w-2xl text-slate-300">
                {campaign.message ||
                  "Answer the questions below anonymously and submit your response."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-8">
          <PublicTestForm
            slug={campaign.slug}
            campaignName={campaign.name}
            testType={campaign.testType}
          />
        </section>
      </div>
    </main>
  );
}
