import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { engagements, products, tests } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { FindingsTable } from "@/components/FindingsTable";

export const Route = createFileRoute("/engagements/$engagementId")({
  loader: ({ params }) => {
    const engagement = engagements.find((e) => e.id === params.engagementId);
    if (!engagement) throw notFound();
    const product = products.find((p) => p.id === engagement.productId)!;
    return { engagement, product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Engagement not found — SentryDojo" }, { name: "robots", content: "noindex" }],
      };
    }
    const { engagement, product } = loaderData;
    const desc = `Scan runs, scanners and findings recorded during ${engagement.name} on ${product.name}.`;
    return {
      meta: [
        { title: `${engagement.name} — Engagement — SentryDojo` },
        { name: "description", content: desc },
        { property: "og:title", content: `${engagement.name} — Engagement` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: EngagementDetail,
});

function EngagementDetail() {
  const { engagement, product } = Route.useLoaderData();
  const { findings } = useStore();
  const runs = tests.filter((t) => t.engagementId === engagement.id);
  const own = findings.filter((f) => f.engagementId === engagement.id);

  return (
    <div className="space-y-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/products" className="hover:text-foreground">
          Products
        </Link>{" "}
        /{" "}
        <Link
          to="/products/$productId"
          params={{ productId: product.id }}
          className="hover:text-foreground"
        >
          {product.name}
        </Link>{" "}
        / <span className="text-foreground">{engagement.name}</span>
      </nav>

      <header className="mesh-panel rounded-3xl border border-border p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
          {engagement.status}
        </p>
        <h1 className="display-caps mt-2 text-3xl">{engagement.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {engagement.start} → {engagement.end} · Lead {engagement.lead} · {own.length} findings
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Test runs</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {runs.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card/70 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.kind}</p>
              <h3 className="mt-1 font-semibold">{t.name}</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {t.scanner} · {t.date}
              </p>
              <p className="mt-3 text-2xl font-bold">{t.findings}</p>
              <p className="text-xs text-muted-foreground">findings imported</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Findings</h2>
        <FindingsTable findings={own} showProduct={false} />
      </section>
    </div>
  );
}