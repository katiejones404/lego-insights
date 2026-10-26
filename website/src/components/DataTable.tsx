interface DataTableProps {
  rows: readonly object[];
  columns?: string[];
}

/** Plain HTML table twin for a chart: the WCAG-clean equivalent, collapsed by default. */
export function DataTable({ rows, columns }: DataTableProps) {
  if (!rows || rows.length === 0) return null;
  const records = rows as Record<string, unknown>[];
  const cols = columns ?? Object.keys(records[0]);

  return (
    <details className="data-table">
      <summary>View as table</summary>
      <div className="data-table-scroll">
        <table>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((row, i) => (
              <tr key={i}>
                {cols.map((c) => (
                  <td key={c}>{String(row[c] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
