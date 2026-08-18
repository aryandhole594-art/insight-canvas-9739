import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Bug, ShieldCheck, Timer, TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { products, SEVERITIES, trend } from "@/lib/mock-data";
import { severityHex } from "@/components/badges";
import { FindingsTable } from "@/components/FindingsTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Security Dashboard — SentryDojo" },
      {
        name: "description",
        content:
          "Live vulnerability posture across all products: severity mix, 30-day open vs. closed trend and the latest critical findings.",
      },
      { property: "og:title", content: "Security Dashboard — SentryDojo" },
      {
        property: "og:description",
        content: "Live vulnerability posture across all products, scanners and engagements.",
      },
    ],
  }),
  component: Dashboard,
});

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Bug;
  tone: string;
}) {
  return (
    <div className="glow-card rise-in rounded-2xl border border-border bg-card/70 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className={`grid size-9 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const { findings, activity } = useStore();

  const bySeverity = useMemo(
    () =>
      SEVERITIES.map((s) => ({
        name: s,
        value: findings.filter((f) => f.severity === s).length,
      })),
    [findings],
  );

  const open = findings.filter((f) => f.status === "Active" || f.status === "Verified").length;
  const critical = findings.filter((f) => f.severity === "Critical").length;
  const mitigated = findings.filter((f) => f.status === "Mitigated").length;
  const topFindings = [...findings]
    .filter((f) => f.severity === "Critical" || f.severity === "High")
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <header className="mesh-panel rounded-3xl border border-border p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
          Security posture
        </p>
        <h1 className="display-caps mt-2 text-3xl md:text-4xl">Vulnerability Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {findings.length} findings ingested from 6 scanners across {products.length} products.
          Triage the queue, accept risk with justification, or push remediation tickets to JIRA.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Open findings"
          value={String(open)}
          hint="Active + Verified awaiting remediation"
          icon={Bug}
          tone="bg-critical/20 text-critical"
        />
        <Kpi
          label="Critical"
          value={String(critical)}
          hint="Requires action within 72 hours"
          icon={TrendingUp}
          tone="bg-high/20 text-high"
        />
        <Kpi
          label="Mitigated"
          value={String(mitigated)}
          hint="Fix verified in the last 30 days"
          icon={ShieldCheck}
          tone="bg-green/20 text-green"
        />
        <Kpi
          label="Mean time to remediate"
          value="11.4d"
          hint="Down 2.1 days vs. previous quarter"
          icon={Timer}
          tone="bg-primary/25 text-foreground"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-border bg-card/70 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Severity distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bySeverity}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={88}
                  paddingAngle={3}
                  stroke="none"
                >
                  {bySeverity.map((entry) => (
                    <Cell key={entry.name} fill={severityHex[entry.name]} />
                  ))}
                </Pie>
                <Legend iconType="circle" />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card/70 p-5 lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Open vs. closed — last 30 days
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="open"
                  stroke="var(--critical)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="closed"
                  stroke="var(--green)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Priority queue</h2>
            <Link
              to="/findings"
              className="inline-flex items-center gap-1 text-sm text-link hover:underline"
            >
              All findings <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <FindingsTable findings={topFindings} compact />
        </section>

        <section className="rounded-2xl border border-border bg-card/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent activity
          </h2>
          <ul className="mt-4 space-y-4">
            {activity.slice(0, 8).map((a, i) => (
              <li key={`${a.at}-${i}`} className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-magenta" />
                <div>
                  <p className="text-sm leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.at}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}