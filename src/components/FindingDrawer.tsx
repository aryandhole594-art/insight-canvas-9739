import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Copy, MessageSquare, ShieldCheck, Ticket, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { SeverityBadge, StatusBadge } from "./badges";
import { products, STATUSES, type FindingStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function FindingDrawer() {
  const { findings, openFindingId, closeFinding, setStatus, acceptRisk, createTicket } = useStore();
  const finding = findings.find((f) => f.id === openFindingId) ?? null;
  const [showDupes, setShowDupes] = useState(false);
  const [riskOpen, setRiskOpen] = useState(false);
  const [justification, setJustification] = useState("Compensating control in place at the WAF.");
  const [expiry, setExpiry] = useState("2026-12-31");

  useEffect(() => {
    setShowDupes(false);
    setRiskOpen(false);
  }, [openFindingId]);

  if (!finding) return null;
  const product = products.find((p) => p.id === finding.productId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close panel"
        onClick={closeFinding}
        className="flex-1 bg-background/70 backdrop-blur-sm animate-in fade-in"
      />
      <aside className="flex w-full max-w-xl flex-col overflow-y-auto border-l border-border bg-card shadow-[var(--shadow-float)] animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-border bg-card/95 p-5 backdrop-blur">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={finding.severity} />
              <StatusBadge status={finding.status} />
              {finding.kev && (
                <span className="rounded-full bg-critical/20 px-2.5 py-0.5 text-xs font-semibold text-critical">
                  KEV — Known Exploited
                </span>
              )}
            </div>
            <h2 className="mt-3 text-xl font-bold leading-snug">{finding.title}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {finding.ref} · {product?.name} · {finding.scanner} · {finding.date}
            </p>
          </div>
          <button
            onClick={closeFinding}
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <section className="rounded-xl bg-surface-2 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wide">CVSS score</span>
              <span className="text-sm font-bold text-foreground">{finding.cvss.toFixed(1)} / 10</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full brand-gradient transition-[width] duration-700"
                style={{ width: `${finding.cvss * 10}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
              <Meta label="CWE" value={finding.cwe} />
              <Meta label="CVE" value={finding.cve ?? "—"} />
              <Meta
                label="EPSS"
                value={finding.epss ? `${Math.round(finding.epss * 100)}%` : "—"}
              />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{finding.description}</p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs">
              <Copy className="size-3.5 text-muted-foreground" />
              {finding.location}
            </div>
          </section>

          {(finding.duplicateOf || finding.duplicates) && (
            <section className="rounded-xl border border-magenta/40 bg-magenta/10 p-4">
              {finding.duplicateOf && (
                <p className="text-sm font-semibold text-magenta">
                  Duplicate of {finding.duplicateOf}
                </p>
              )}
              {finding.duplicates && (
                <>
                  <button
                    onClick={() => setShowDupes((v) => !v)}
                    className="flex w-full items-center justify-between text-sm font-semibold text-magenta"
                  >
                    {finding.duplicates.length} duplicate findings merged
                    <ChevronDown
                      className={cn("size-4 transition-transform", showDupes && "rotate-180")}
                    />
                  </button>
                  {showDupes && (
                    <ul className="mt-3 space-y-1.5 text-xs text-foreground/80 rise-in">
                      {finding.duplicates.map((d) => (
                        <li key={d} className="rounded-md bg-background/40 px-2.5 py-1.5">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Triage
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select
                value={finding.status}
                onChange={(e) => {
                  setStatus(finding.id, e.target.value as FindingStatus);
                  toast.success(`Status updated to ${e.target.value}`);
                }}
                className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRiskOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg bg-medium/20 px-3 py-2 text-sm font-semibold text-medium transition-colors hover:bg-medium/30"
              >
                <ShieldCheck className="size-4" /> Accept Risk
              </button>
            </div>

            {riskOpen && (
              <div className="mt-3 space-y-3 rounded-xl bg-surface-2 p-4 rise-in">
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Justification
                  <textarea
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    rows={2}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal normal-case tracking-normal text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Expiry date
                  <input
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <button
                  onClick={() => {
                    acceptRisk(finding.id, justification, expiry);
                    setRiskOpen(false);
                    toast.success("Risk acceptance recorded");
                  }}
                  className="w-full rounded-lg bg-green px-4 py-2 text-sm font-bold text-green-foreground transition-transform hover:scale-[1.01]"
                >
                  Submit risk acceptance
                </button>
              </div>
            )}
          </section>

          <section className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const key = createTicket(finding.id);
                toast.success(`Pushed to JIRA — ${key}`);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Ticket className="size-4" /> Push to JIRA
            </button>
            <button
              onClick={() => toast.success("Posted to #sec-alerts on Slack")}
              className="inline-flex items-center gap-2 rounded-lg bg-surface-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent"
            >
              <MessageSquare className="size-4" /> Push to Slack
            </button>
            {finding.jira && (
              <span className="inline-flex items-center rounded-full bg-green/20 px-3 py-2 text-xs font-bold text-green">
                Ticket Created ({finding.jira})
              </span>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Activity log
            </h3>
            <ol className="mt-3 space-y-3 border-l border-border pl-4">
              {finding.activity.map((a, i) => (
                <li key={i} className="relative text-sm rise-in">
                  <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-primary" />
                  <p>{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.at}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </aside>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/50 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}
