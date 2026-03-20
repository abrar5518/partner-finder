"use client";

import { useMemo, useState } from "react";

type AnalyticsItem = {
  id: string;
  createdAt: Date | string;
  answers?: unknown;
};

type VisitItem = {
  id: string;
  createdAt: Date | string;
};

type CampaignAnalyticsPanelProps = {
  responses: AnalyticsItem[];
  visits: VisitItem[];
};

type TabKey = "responses" | "visits";

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(value));
}

export function CampaignAnalyticsPanel({
  responses,
  visits,
}: CampaignAnalyticsPanelProps) {
  const [tab, setTab] = useState<TabKey>("responses");

  const visitBuckets = useMemo(() => {
    const byDay = new Map<string, number>();

    visits.forEach((visit) => {
      const key = new Date(visit.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    });

    return [...byDay.entries()].slice(-6);
  }, [visits]);

  const responsePreview = responses.slice(0, 8);

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-white/4">
      <div className="flex flex-col gap-3 border-b border-white/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Analytics tabs</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Switch between responder activity and link-open momentum.
          </p>
        </div>
        <div className="inline-flex rounded-2xl border border-white/8 bg-slate-950/60 p-1">
          {(["responses", "visits"] as TabKey[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                tab === item
                  ? "bg-white text-slate-950"
                  : "text-[var(--text-body)] hover:text-white"
              }`}
            >
              {item === "responses" ? `Responses (${responses.length})` : `Visits (${visits.length})`}
            </button>
          ))}
        </div>
      </div>

      {tab === "responses" ? (
        <div className="space-y-4 p-6">
          {responsePreview.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-8 text-center text-sm text-[var(--text-body)]">
              No responses yet. Share the link a little more and this panel will start filling up.
            </div>
          ) : (
            responsePreview.map((response, index) => (
              <div
                key={response.id}
                className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-slate-950/35 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white">Response #{responses.length - index}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatDate(response.createdAt)}</p>
                </div>
                <span className="inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  Captured successfully
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-5 p-6">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-5">
              <p className="text-sm font-medium text-white">Link traffic pulse</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-body)]">
                Total recorded opens: {visits.length}. This is a quick visual to help you spot spikes.
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-5">
              <div className="grid gap-3">
                {visitBuckets.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">No visits recorded yet.</p>
                ) : (
                  visitBuckets.map(([label, value]) => (
                    <div key={label} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[var(--text-body)]">
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/6">
                        <div
                          className="h-2 rounded-full bg-[var(--user-gradient)]"
                          style={{ width: `${Math.max((value / Math.max(...visitBuckets.map(([, count]) => count), 1)) * 100, 12)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-5">
            <p className="text-sm font-medium text-white">Most recent opens</p>
            <div className="mt-4 grid gap-3">
              {visits.slice(-5).reverse().map((visit) => (
                <div key={visit.id} className="flex items-center justify-between text-sm text-[var(--text-body)]">
                  <span>Visitor opened your test</span>
                  <span className="text-[var(--text-muted)]">{formatDate(visit.createdAt)}</span>
                </div>
              ))}
              {visits.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">Fresh campaign. No opens have been tracked yet.</p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
