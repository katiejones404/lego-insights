export function fmtNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "N/A";
  return n.toLocaleString("en-US");
}

export function fmtCompact(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "N/A";
  return Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function fmtPercent(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "N/A";
  return `${(n * 100).toFixed(1)}%`;
}

export function fmtDecimal(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return "N/A";
  return n.toFixed(digits);
}
