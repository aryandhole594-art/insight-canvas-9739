import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { SeverityBadge, StatusBadge } from "./badges";
import { useStore } from "@/lib/store";
import { products, SEVERITIES, STATUSES, type Finding, type Severity } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const order: Record<Severity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3, Info: 4 };
const productName = (id: string) => products.find((p) => p.id === id)?.name ?? "—";

export function FindingsTable({
  findings,
  showProduct = true,
  compact = false,
}: {
  findings: Finding[];
  showProduct?: boolean;
  compact?: boolean;
}) {
  const { openFinding } = useStore();
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(false);

  const rows = useMemo(() => {
    const filtered = findings.filter(
      (f) =>
        (severity === "all" || f.severity === severity) && (status === "all" || f.status === status),
    );
    return [...filtered].sort((a, b) =>
      sortDesc ? order[b.severity] - order[a.severity] : order[a.severity] - order[b.severity],
    );
  }, [findings, severity, status, sortDesc]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-surface-2 text-muted-foreground hover:text-foreground",
    );

  return (
    <div className="rounded-2xl border border-border bg-card/70">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Severity
        </span>
        <button className={chip(severity === "all")} onClick={() => setSeverity("all")}>
          All
        </button>
        {SEVERITIES.map((s) => (
          <button key={s} className={chip(severity === s)} onClick={() => setSeverity(s)}>
            {s}
          </button>
        ))}
        <span className="ml-4 mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-muted-foreground">{rows.length} findings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">
                <button
                  className="inline-flex items-center gap-1 hover:text-foreground"
                  onClick={() => setSortDesc((v) => !v)}
                >
                  Severity <ArrowUpDown className="size-3" />
                </button>
              </th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">CWE / CVE</th>
              {showProduct && <th className="px-4 py-3">Product</th>}
              <th className="px-4 py-3">Status</th>
              {!compact && <th className="px-4 py-3">Scanner</th>}
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr
                key={f.id}
                onClick={() => openFinding(f.id)}
                className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-primary/10"
              >
                <td className="px-4 py-3">
                  <SeverityBadge severity={f.severity} />
                </td>
                <td className="max-w-[320px] px-4 py-3">
                  <p className="truncate font-medium">{f.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{f.location}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <div>{f.cwe}</div>
                  {f.cve && <div className="text-link">{f.cve}</div>}
                </td>
                {showProduct && (
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {productName(f.productId)}
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={f.status} />
                </td>
                {!compact && <td className="px-4 py-3 text-xs text-muted-foreground">{f.scanner}</td>}
                <td className="px-4 py-3 text-xs text-muted-foreground">{f.date}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No findings match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
