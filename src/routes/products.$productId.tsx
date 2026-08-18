import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { engagements, products, tests } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { FindingsTable } from "@/components/FindingsTable";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product not found — SentryDojo" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} — Product Security — SentryDojo` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.name} — Product Security` },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { findings } = useStore();
  const own = findings.filter((f) => f.productId === product.id);
  const engs = engagements.filter((e) => e.productId === product.id);

  return (
    <div className="space-y-6">
      <nav className="text-xs text-muted-foreground">
        <Link to="/products" className="hover:text-foreground">
          Products
        </Link>{" "}
        / <span className="text-foreground">{product.name}</span>
      </nav>

      <header className="mesh-panel rounded-3xl border border-border p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
          {product.type}
        </p>
        <h1 className="display-caps mt-2 text-3xl">{product.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{product.description}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-4">
          {[
            ["Owner", product.owner],
            ["Criticality", product.criticality],
            ["Risk score", `${product.riskScore}/100`],
            ["Last scan", product.lastScan],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-sm font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Engagements</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {engs.map((e) => {
            const runs = tests.filter((t) => t.engagementId === e.id);
            return (
              <Link
                key={e.id}
                to="/engagements/$engagementId"
                params={{ engagementId: e.id }}
                className="glow-card rounded-2xl border border-border bg-card/70 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{e.name}</h3>
                  <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs text-muted-foreground">
                    {e.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {e.start} → {e.end} · Lead {e.lead} · {runs.length} tests
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Findings ({own.length})</h2>
        <FindingsTable findings={own} showProduct={false} />
      </section>
    </div>
  );
}