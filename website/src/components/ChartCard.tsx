import type { ReactNode } from "react";
import { DataTable } from "./DataTable";

interface ChartCardProps {
  title: string;
  caption?: string;
  wide?: boolean;
  status: "loading" | "error" | "ready";
  error?: string | null;
  tableRows?: readonly object[];
  tableColumns?: string[];
  children: ReactNode;
}

export function ChartCard({
  title,
  caption,
  wide,
  status,
  error,
  tableRows,
  tableColumns,
  children,
}: ChartCardProps) {
  return (
    <section className={`card${wide ? " card--wide" : ""}`}>
      <div className="card-head">
        <h3>{title}</h3>
      </div>
      {status === "loading" && <div className="chart-state">Loading…</div>}
      {status === "error" && <div className="chart-state">Couldn't load data: {error}</div>}
      {status === "ready" && children}
      {caption && <p className="card-caption">{caption}</p>}
      {status === "ready" && tableRows && <DataTable rows={tableRows} columns={tableColumns} />}
    </section>
  );
}
