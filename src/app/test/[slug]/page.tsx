import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PublicTestForm } from "@/components/test/public-test-form";
import {
  ReactionVideoConsentCard,
  ReactionVideoProvider,
} from "@/components/test/reaction-video-context";
import { getCampaignBySlug, recordCampaignVisit } from "@/lib/campaigns";

type TestPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const typeLabelMap: Record<string, string> = {
  comparison: "Comparison journey",
  ideal: "Ideal partner profile",
  secret: "Secret crush finder",
  personality: "Love personality quiz",
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
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-base)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_30%)]" />
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="glass-card gradient-border-user rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <span className="badge-user">{typeLabelMap[campaign.testType ?? "comparison"] ?? "Anonymous test"}</span>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">{campaign.name}</h1>
              <p className="text-sm leading-7 text-[var(--text-body)]">
                {campaign.message ||
                  "Answer honestly and move at your own pace. This page is designed to feel private, friendly, and simple to finish."}
              </p>
            </div>

            <div className="rounded-[1.7rem] border border-white/8 bg-slate-950/40 p-5">
              <p className="text-sm font-medium text-white">Why people trust this page</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  Anonymous: your identity is not stored with the response.
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-body)]">
                  Progress is clearly structured, so the form never feels endless.
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[var(--text-body)]">
                  This campaign uses a heart-forward visual style without changing backend logic.
                </div>
                
              </div>
            </div>
          </div>
        </section>

        <ReactionVideoProvider slug={campaign.slug}>
          <section className="glass-card rounded-[2.2rem] p-6 sm:p-8">
            <ReactionVideoConsentCard />

            <div className="mb-6">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-white">Question flow</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Progress is shown inside the form</p>
              </div>
              <div className="h-2 rounded-full bg-white/6">
                <div className="h-2 w-1/4 rounded-full bg-[var(--user-gradient)]" />
              </div>
            </div>

            <PublicTestForm slug={campaign.slug} campaignName={campaign.name} testType={campaign.testType} />
          </section>
        </ReactionVideoProvider>
      </div>
    </div>
  );
}
