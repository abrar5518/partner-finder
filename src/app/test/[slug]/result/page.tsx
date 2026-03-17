import Link from "next/link";
import { getCampaignBySlug } from "@/lib/campaigns";

type LegacyResultPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function LegacyResultPage({ params }: LegacyResultPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <span className="mx-auto inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm font-medium text-amber-200">
          Result Moved
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Response-Specific Results</h1>
          <p className="text-slate-300">
            Results are now tied to a specific submission to avoid showing the wrong
            response when multiple people complete the same test.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          {campaign
            ? `Please submit ${campaign.name} again to generate a unique result URL.`
            : "Please reopen the public test and submit it again to generate a unique result URL."}
        </div>

        <div className="flex justify-center">
          <Link
            href={campaign ? `/test/${campaign.slug}` : "/"}
            className="rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 text-sm font-medium transition hover:border-cyan-300/40 hover:bg-slate-900"
          >
            {campaign ? "Open Test Again" : "Back to Home"}
          </Link>
        </div>
      </div>
    </main>
  );
}
