import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { engagements, products } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/badges";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Products — SentryDojo" },
      {
        name: "description",
        content:
          "Every application, API and mobile client under security review, with risk score, owner and open finding counts.",
      },
      { property: "og:title", content: "Products — SentryDojo" },
      {
        property: "og:description",
        content: "Applications and services under security review, ranked by risk score.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { findings } = useStore();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display-caps text-3xl">Products</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} products in scope, each with its own engagements and scan history.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {products.map((p) => {
          const own = findings.filter((f) => f.productId === p.id);
          const critical = own.filter((f) => f.severity === "Critical").length;
          const engCount = engagements.filter((e) => e.productId === p.id).length;
          return (
            <Link
              key={p.id}
              to="/products/$productId"
              params={{ productId: p.id }}
              className="glow-card rise-in rounded-2xl border border-border bg-card/70 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {p.type} · {p.owner}
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.description}</p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Risk score</span>
                  <span className="font-semibold text-foreground">{p.riskScore}/100</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full brand-gradient transition-all duration-700"
                    style={{ width: `${p.riskScore}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {critical > 0 && <SeverityBadge severity="Critical" />}
                <span>{own.length} findings</span>
                <span>·</span>
                <span>{engCount} engagements</span>
                <span>·</span>
                <span>Last scan {p.lastScan}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}