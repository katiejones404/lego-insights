import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { useJson } from "../lib/useJson";
import { chromeColors, colorForSeries } from "../lib/palette";
import { fmtNumber } from "../lib/format";
import type { SeriesByYear } from "../lib/types";

export function Themes() {
  const years = useJson<SeriesByYear[]>("themes_by_year");
  const topThemes = useJson<string[]>("top_themes");
  const chrome = chromeColors();

  const status = years.status === "ready" && topThemes.status === "ready" ? "ready" : years.status === "error" || topThemes.status === "error" ? "error" : "loading";
  const series = topThemes.data ?? [];
  const colorMap = colorForSeries(series);

  return (
    <div className="page">
      <div className="page-header">
        <p className="kicker">Themes</p>
        <h1>Theme popularity over time</h1>
        <p className="page-subtitle">
          Which LEGO themes have driven set releases each year. The top 7 themes by total sets
          are shown individually; everything else is folded into "Other."
        </p>
      </div>

      <div className="card-grid">
        <ChartCard
          title="Sets released per year, by theme"
          status={status}
          error={years.error ?? topThemes.error}
          wide
          tableRows={years.data ?? undefined}
        >
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={years.data ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              <Tooltip content={<ChartTooltip formatter={(v) => fmtNumber(Number(v))} />} />
              <Legend wrapperStyle={{ fontSize: 12, color: chrome.textSecondary }} />
              {series.map((name) => (
                <Area
                  key={name}
                  dataKey={name}
                  name={name}
                  stackId="themes"
                  stroke={colorMap[name]}
                  fill={colorMap[name]}
                  fillOpacity={0.75}
                  strokeWidth={1}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
