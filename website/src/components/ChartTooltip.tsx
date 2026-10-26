import { chromeColors } from "../lib/palette";
import { fmtNumber } from "../lib/format";

interface Entry {
  name?: string;
  value?: number | string;
  color?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Entry[];
  formatter?: (value: number | string) => string;
}

/** Shared recharts tooltip content, styled from the chart-chrome tokens. */
export function ChartTooltip({ active, label, payload, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const chrome = chromeColors();
  const fmt = formatter ?? ((v: number | string) => (typeof v === "number" ? fmtNumber(v) : String(v)));

  return (
    <div
      style={{
        background: chrome.surface,
        border: `1px solid ${chrome.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        color: chrome.textPrimary,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      {label != null && (
        <div style={{ color: chrome.textMuted, marginBottom: 4, fontSize: 12 }}>{label}</div>
      )}
      {payload
        .slice()
        .reverse()
        .map((entry) => (
          <div
            key={entry.name}
            style={{ display: "flex", alignItems: "center", gap: 6, lineHeight: 1.6 }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: entry.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ color: chrome.textSecondary }}>{entry.name}</span>
            <span style={{ marginLeft: "auto", fontWeight: 600 }}>
              {entry.value != null ? fmt(entry.value) : "N/A"}
            </span>
          </div>
        ))}
    </div>
  );
}
