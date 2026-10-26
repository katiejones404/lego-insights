/**
 * Categorical palette for chart data series: 8 slots in fixed order (never
 * cycled/reassigned by rank). Validated via dataviz skill's validate_palette.js,
 * worst adjacent CVD deltaE 9.1 (OKLab x100), worst adjacent normal-vision
 * deltaE 19.6. Pipeline caps themes/colors at top-7 + "Other" so no chart
 * exceeds 8 series. Left unchanged by the newspaper redesign: the site shell
 * (nav, headlines, borders) carries the red/pink/black/white look, charts keep
 * this palette so multi-series data stays distinguishable.
 */
export const CATEGORICAL = [
  "#2a78d6", // 1 blue
  "#eb6834", // 2 orange
  "#1baf7a", // 3 aqua
  "#eda100", // 4 yellow
  "#e87ba4", // 5 magenta
  "#008300", // 6 green
  "#4a3aa7", // 7 violet
  "#e34948", // 8 red
];

/** Single sequential hue (blue) for single-series magnitude bars/lines. */
export const SEQUENTIAL = "#2a78d6";

export function categoricalColors(): string[] {
  return CATEGORICAL;
}

export function sequentialColor(): string {
  return SEQUENTIAL;
}

/** Chart chrome (axes/gridlines/tooltip) as literal hex, matching the newspaper ink/paper tokens in index.css. */
export function chromeColors() {
  return {
    surface: "#ffffff",
    textPrimary: "#111111",
    textSecondary: "#4a4a4a",
    textMuted: "#767676",
    gridline: "#dcdcdc",
    baseline: "#111111",
    border: "rgba(17,17,17,0.14)",
  };
}

/** Assigns a fixed color to each series name, in first-seen order (stable, never re-ranked). */
export function colorForSeries(names: string[]): Record<string, string> {
  const colors = categoricalColors();
  const map: Record<string, string> = {};
  names.forEach((name, i) => {
    map[name] = name === "Other" ? colors[colors.length - 1] : colors[i % (colors.length - 1)];
  });
  return map;
}
