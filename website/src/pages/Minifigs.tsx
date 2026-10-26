import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { useJson } from "../lib/useJson";
import { chromeColors, sequentialColor } from "../lib/palette";
import { fmtNumber } from "../lib/format";
import type { MinifigsByTheme, MinifigsByYear } from "../lib/types";

export function Minifigs() {
  const byYear = useJson<MinifigsByYear[]>("minifigs_by_year");
  const byTheme = useJson<MinifigsByTheme[]>("minifigs_by_theme");
  const chrome = chromeColors();
  const color = sequentialColor();

  return (
    <div className="page">
      <div className="page-header">
        <p className="kicker">Minifigs</p>
        <h1>Minifigure diversity</h1>
        <p className="page-subtitle">
          How many distinct minifigures LEGO has introduced each year, and which themes have
          produced the most minifig variety.
        </p>
      </div>

      <div className="card-grid">
        <ChartCard
          title="Distinct minifigs introduced per year"
          status={byYear.status}
          error={byYear.error}
          wide
          tableRows={byYear.data ?? undefined}
        >
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={byYear.data ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              <Line
                dataKey="distinct_minifigs"
                name="Distinct minifigs"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: chrome.surface }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Most minifig-diverse themes"
          caption="Top themes by number of distinct minifigs produced."
          status={byTheme.status}
          error={byTheme.error}
          wide
          tableRows={byTheme.data ?? undefined}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={byTheme.data ?? []}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} stroke={chrome.gridline} />
              <XAxis
                type="number"
                tick={{ fill: chrome.textMuted, fontSize: 12 }}
                axisLine={{ stroke: chrome.baseline }}
                tickLine={false}
                tickFormatter={(v) => fmtNumber(v)}
              />
              <YAxis
                type="category"
                dataKey="theme_name"
                width={160}
                tick={{ fill: chrome.textSecondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => fmtNumber(Number(v))} />} />
              <Bar
                dataKey="distinct_minifigs"
                name="Distinct minifigs"
                fill={color}
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
