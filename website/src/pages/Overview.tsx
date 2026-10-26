import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { useJson } from "../lib/useJson";
import { chromeColors, sequentialColor } from "../lib/palette";
import { fmtCompact, fmtDecimal, fmtNumber } from "../lib/format";
import type { SetsByYear } from "../lib/types";

export function Overview() {
  const { status, data, error } = useJson<SetsByYear[]>("sets_by_year");
  const chrome = chromeColors();
  const color = sequentialColor();

  const totals = data
    ? {
        sets: data.reduce((s, d) => s + d.num_sets, 0),
        parts: data.reduce((s, d) => s + d.total_parts, 0),
        years: `${data[0]?.year ?? "N/A"}-${data[data.length - 1]?.year ?? "N/A"}`,
        peakYear: data.reduce((best, d) => (d.num_sets > best.num_sets ? d : best), data[0]),
      }
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <p className="kicker">Data analysis</p>
        <h1>LEGO sets over time</h1>
        <p className="page-subtitle">
          A high-level look at six decades of LEGO sets from the Rebrickable catalog: how many
          sets release each year, and how complex the average set has gotten.
        </p>
      </div>

      {totals && (
        <div className="stat-row">
          <div className="stat-tile">
            <div className="stat-label">Total sets catalogued</div>
            <div className="stat-value">{fmtCompact(totals.sets)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Total parts across all sets</div>
            <div className="stat-value">{fmtCompact(totals.parts)}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Years covered</div>
            <div className="stat-value">{totals.years}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Biggest release year</div>
            <div className="stat-value">{totals.peakYear?.year}</div>
          </div>
        </div>
      )}

      <div className="card-grid">
        <ChartCard title="Sets released per year" status={status} error={error} wide tableRows={data ?? undefined}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={chrome.gridline} />
              <XAxis
                dataKey="year"
                tick={{ fill: chrome.textMuted, fontSize: 12 }}
                axisLine={{ stroke: chrome.baseline }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: chrome.textMuted, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtCompact(v)}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => fmtNumber(Number(v))} />} />
              <Bar dataKey="num_sets" name="Sets released" fill={color} radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Average parts per set"
          caption="A proxy for how complex the average LEGO set has become."
          status={status}
          error={error}
          wide
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={chrome.gridline} />
              <XAxis
                dataKey="year"
                tick={{ fill: chrome.textMuted, fontSize: 12 }}
                axisLine={{ stroke: chrome.baseline }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: chrome.textMuted, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtNumber(v)}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => fmtDecimal(Number(v))} />} />
              <Line
                dataKey="avg_parts"
                name="Avg. parts per set"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: chrome.surface }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
