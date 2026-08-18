import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { reports } from "@/lib/mock-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — SentryDojo" },
      {
        name: "description",
        content:
          "Executive and per-product vulnerability reports covering findings, critical counts and reporting periods.",
      },
      { property: "og:title", content: "Reports — SentryDojo" },
      {
        property: "og:description",
        content: "Executive and per-product vulnerability reports, ready to export.",
      },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="display-caps text-3xl">Reports</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generated snapshots of posture per product, engagement and quarter.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <article
            key={r.id}
            className="glow-card rise-in flex flex-col rounded-2xl border border-border bg-card/70 p-5"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/25">
                <FileText className="size-4" />
              </span>
              <div>
                <h2 className="font-semibold leading-snug">{r.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.product} · {r.range}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                <strong className="text-foreground">{r.findings}</strong> findings
              </span>
              <span>
                <strong className="text-critical">{r.critical}</strong> critical
              </span>
              <span>Generated {r.generated}</span>
            </div>
            <button
              onClick={() => toast.success("Report export queued", { description: r.title })}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="size-4" /> Export PDF
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}