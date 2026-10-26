import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
import { chromeColors, colorForSeries, sequentialColor } from "../lib/palette";
import { fmtNumber, fmtPercent } from "../lib/format";
import type { SeriesByYear, TransShareByYear } from "../lib/types";

export function Colors() {
  const years = useJson<SeriesByYear[]>("colors_by_year");
  const topColors = useJson<string[]>("top_colors");
  const trans = useJson<TransShareByYear[]>("trans_share_by_year");
  const chrome = chromeColors();
  const accent = sequentialColor();

  const stackedStatus =
    years.status === "ready" && topColors.status === "ready"
      ? "ready"
      : years.status === "error" || topColors.status === "error"
        ? "error"
        : "loading";
  const series = topColors.data ?? [];
  const colorMap = colorForSeries(series);

  return (
    <div className="page">
      <div className="page-header">
        <p className="kicker">Colors</p>
        <h1>Color trends over time</h1>
        <p className="page-subtitle">
          Piece color usage across every set's part list. The top 7 colors by total piece count
          are shown individually; everything else is folded into "Other."
        </p>
      </div>

      <div className="card-grid">
        <ChartCard
          title="Parts produced per year, by color"
          status={stackedStatus}
          error={years.error ?? topColors.error}
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
                  stackId="colors"
                  stroke={colorMap[name]}
                  fill={colorMap[name]}
                  fillOpacity={0.75}
                  strokeWidth={1}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Share of translucent parts"
          caption="Translucent/transparent pieces as a share of all parts produced that year."
          status={trans.status}
          error={trans.error}
          wide
          tableRows={trans.data ?? undefined}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trans.data ?? []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
                tickFormatter={(v) => fmtPercent(v)}
                domain={[0, "dataMax"]}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => fmtPercent(Number(v))} />} />
              <Line
                dataKey="trans_share"
                name="Translucent share"
                stroke={accent}
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
