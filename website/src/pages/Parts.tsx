import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ChartTooltip } from "../components/ChartTooltip";
import { useJson } from "../lib/useJson";
import { chromeColors, sequentialColor } from "../lib/palette";
import { fmtNumber } from "../lib/format";
import type { PartCategoryCount, TopReusedPart } from "../lib/types";

const TOP_CATEGORIES = 10;

export function Parts() {
  const categories = useJson<PartCategoryCount[]>("part_categories");
  const reuse = useJson<TopReusedPart[]>("top_reused_parts");
  const chrome = chromeColors();
  const color = sequentialColor();

  const sorted = categories.data ? [...categories.data].sort((a, b) => b.num_parts - a.num_parts) : [];
  const topCategories = sorted.slice(0, TOP_CATEGORIES);
  const maxSets = reuse.data ? Math.max(...reuse.data.map((p) => p.num_sets)) : 1;

  return (
    <div className="page">
      <div className="page-header">
        <p className="kicker">Parts</p>
        <h1>Parts: variety and reuse</h1>
        <p className="page-subtitle">
          How the part catalog breaks down by category, and which individual molds show up in
          the most sets.
        </p>
      </div>

      <div className="card-grid">
        <ChartCard
          title={`Top ${TOP_CATEGORIES} part categories by catalog size`}
          caption={`${sorted.length} categories total; see the table for the full list.`}
          status={categories.status}
          error={categories.error}
          wide
          tableRows={sorted}
        >
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={topCategories}
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
                dataKey="category_name"
                width={180}
                tick={{ fill: chrome.textSecondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => fmtNumber(Number(v))} />} />
              <Bar dataKey="num_parts" name="Distinct parts" fill={color} radius={[0, 4, 4, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={`Top ${reuse.data?.length ?? ""} most-reused parts`}
          caption="Ranked by number of distinct sets the part appears in."
          status={reuse.status}
          error={reuse.error}
          wide
        >
          <div className="data-table-scroll" style={{ maxHeight: 420 }}>
            <table>
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Category</th>
                  <th>Sets</th>
                  <th style={{ width: 140 }}>Reach</th>
                </tr>
              </thead>
              <tbody>
                {(reuse.data ?? []).map((p) => (
                  <tr key={p.part_num}>
                    <td title={p.part_num}>{p.part_name}</td>
                    <td>{p.category_name ?? "N/A"}</td>
                    <td>{fmtNumber(p.num_sets)}</td>
                    <td>
                      <div className="inline-bar-track">
                        <div
                          className="inline-bar-fill"
                          style={{ width: `${(p.num_sets / maxSets) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
