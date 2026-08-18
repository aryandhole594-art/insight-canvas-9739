import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { FindingsTable } from "@/components/FindingsTable";

export const Route = createFileRoute("/findings")({
  head: () => ({
    meta: [
      { title: "All Findings — SentryDojo" },
      {
        name: "description",
        content:
          "Filter and sort every vulnerability finding by severity, status, scanner and product, then triage in a single click.",
      },
      { property: "og:title", content: "All Findings — SentryDojo" },
      {
        property: "og:description",
        content: "Filter, sort and triage every vulnerability finding in one queue.",
      },
    ],
  }),
  component: FindingsPage,
});

function FindingsPage() {
  const { findings } = useStore();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="display-caps text-3xl">Findings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {findings.length} findings across all products. Click any row to open the triage panel.
        </p>
      </header>
      <FindingsTable findings={findings} />
    </div>
  );
}