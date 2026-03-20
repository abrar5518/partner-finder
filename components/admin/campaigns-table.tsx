"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { deleteCampaignAction } from "@/app/admin/actions";

type AdminCampaignRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date | string;
  user: {
    id: string;
    email: string;
  };
  _count: {
    responses: number;
  };
};

type AdminCampaignsTableProps = {
  campaigns: AdminCampaignRow[];
};

function inferType(name: string, slug: string) {
  const value = `${name} ${slug}`.toLowerCase();
  if (value.includes("secret")) return "Secret";
  if (value.includes("ideal")) return "Ideal";
  if (value.includes("personality")) return "Personality";
  return "Comparison";
}

export function AdminCampaignsTable({ campaigns }: AdminCampaignsTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "popular" | "fresh">("all");
  const [mountedAt] = useState(() => Date.now());

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const haystack = `${campaign.name} ${campaign.slug} ${campaign.user.email}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
        const matchesFilter =
        filter === "all"
          ? true
          : filter === "popular"
            ? campaign._count.responses > 0
            : mountedAt - new Date(campaign.createdAt).getTime() < 1000 * 60 * 60 * 24 * 14;

      return matchesQuery && matchesFilter;
    });
  }, [campaigns, filter, mountedAt, query]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by campaign, slug, or owner"
          className="input-base input-admin"
        />
        <div className="inline-flex rounded-2xl border border-white/8 bg-slate-950/60 p-1">
          {[
            { value: "all", label: "All campaigns" },
            { value: "popular", label: "With responses" },
            { value: "fresh", label: "Newly created" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value as "all" | "popular" | "fresh")}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                filter === option.value
                  ? "bg-white text-slate-950"
                  : "text-[var(--text-body)] hover:text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.8rem] border border-white/8 bg-white/4">
        <div className="overflow-x-auto">
          <table className="data-table min-w-[920px]">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Responses</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <div>
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{campaign.slug}</p>
                    </div>
                  </td>
                  <td>
                    <span className="inline-flex rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                      {inferType(campaign.name, campaign.slug)}
                    </span>
                  </td>
                  <td>{campaign.user.email}</td>
                  <td className="text-white">{campaign._count.responses}</td>
                  <td>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                    }).format(new Date(campaign.createdAt))}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/campaign/${campaign.id}`} className="btn-ghost px-3 py-2 text-xs">
                        View
                      </Link>
                      <form action={deleteCampaignAction}>
                        <input type="hidden" name="campaignId" value={campaign.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-100 hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="py-10 text-center text-sm text-[var(--text-muted)]">
                      No campaigns match the current search or filter.
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
