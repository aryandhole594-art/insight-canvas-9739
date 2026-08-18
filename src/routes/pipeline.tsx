import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Detection Pipeline — SentryDojo" },
      {
        name: "description",
        content:
          "Watch a scan flow through ingestion, normalisation, deduplication, enrichment, risk scoring, routing and notification.",
      },
      { property: "og:title", content: "Detection Pipeline — SentryDojo" },
      {
        property: "og:description",
        content: "How a raw scanner report becomes a triaged, routed and notified finding.",
      },
    ],
  }),
  component: PipelinePage,
});

const steps = [
  {
    title: "Ingest scan report",
    detail: "Trivy, ZAP, Snyk, SonarQube, Semgrep and Burp artifacts are pulled from CI.",
    stat: "1 report · 412 KB",
  },
  {
    title: "Parse & normalise",
    detail: "Vendor formats are mapped to a single finding schema with CWE and CVE references.",
    stat: "39 raw findings",
  },
  {
    title: "Deduplicate",
    detail: "Hash of rule + file path + product collapses repeats from earlier scans.",
    stat: "7 duplicates suppressed",
  },
  {
    title: "Enrich",
    detail: "EPSS probability, CISA KEV membership and exploit maturity attached from threat feeds.",
    stat: "12 CVEs enriched",
  },
  {
    title: "Risk score",
    detail: "CVSS blended with product criticality and data classification into an internal score.",
    stat: "4 Critical · 8 High",
  },
  {
    title: "Route & assign",
    detail: "Findings mapped to owning squad, SLA clock started, JIRA tickets drafted.",
    stat: "3 tickets drafted",
  },
  {
    title: "Notify",
    detail: "Slack #sec-alerts pinged for Critical/High; weekly digest queued for the rest.",
    stat: "Slack + email sent",
  },
];

function PipelinePage() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (active >= steps.length) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setActive((a) => a + 1), 900);
    return () => clearTimeout(id);
  }, [active, running]);

  const restart = () => {
    setActive(0);
    setRunning(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-caps text-3xl">Detection Pipeline</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every scan artifact travels through seven stages before it reaches an engineer's queue.
          </p>
        </div>
        <button
          onClick={restart}
          className="rounded-lg brand-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          {running ? "Running…" : "Replay pipeline"}
        </button>
      </header>

      <ol className="relative space-y-4 border-l border-border pl-6">
        {steps.map((s, i) => {
          const done = i < active;
          const current = i === active && running;
          return (
            <li key={s.title} className="relative">
              <span
                className={cn(
                  "absolute -left-[2.1rem] top-4 grid size-7 place-items-center rounded-full border text-xs font-bold transition-colors duration-500",
                  done
                    ? "border-green/60 bg-green/20 text-green"
                    : current
                      ? "pipeline-pulse border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface-2 text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-3.5" />
                ) : current ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  i + 1
                )}
              </span>
              <div
                className={cn(
                  "rounded-2xl border p-5 transition-all duration-500",
                  done || current
                    ? "border-border bg-card/80 opacity-100"
                    : "border-border/60 bg-card/40 opacity-55",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold">{s.title}</h2>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity duration-500",
                      done ? "bg-green/15 text-green" : "bg-surface-2 text-muted-foreground",
                    )}
                  >
                    {s.stat}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}