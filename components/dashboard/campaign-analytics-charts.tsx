"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsPoint = {
  date: string;
  visits: number;
  responses: number;
  completionRate: number;
};

type CampaignAnalyticsChartsProps = {
  data: AnalyticsPoint[];
};

const chartCardClass = "rounded-3xl border border-white/10 bg-slate-900/50 p-6";

export function CampaignAnalyticsCharts({
  data,
}: CampaignAnalyticsChartsProps) {
  if (data.length === 0) {
    return (
      <section className={chartCardClass}>
        <h2 className="text-xl font-semibold text-white">Analytics Charts</h2>
        <p className="mt-3 text-sm text-slate-400">
          No visit or response activity yet. Share the campaign link to start
          collecting chart data.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className={chartCardClass}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Visits Over Time</h2>
          <p className="mt-1 text-sm text-slate-400">
            Daily link opens across this campaign.
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                }}
              />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#22d3ee"
                fill="url(#visitsFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={chartCardClass}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Responses Over Time</h2>
          <p className="mt-1 text-sm text-slate-400">
            Daily submitted responses for this campaign.
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis allowDecimals={false} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                }}
              />
              <Bar dataKey="responses" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={chartCardClass}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-white">Completion Rate Graph</h2>
          <p className="mt-1 text-sm text-slate-400">
            Daily responses vs visits completion percentage.
          </p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis
                domain={[0, 100]}
                stroke="#94a3b8"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value) => `${Number(value ?? 0)}%`}
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "16px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completionRate"
                name="Completion Rate"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
