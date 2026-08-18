import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { integrations as seedIntegrations, team } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SentryDojo" },
      {
        name: "description",
        content:
          "Manage scanner integrations, notification routing and team access roles for the vulnerability programme.",
      },
      { property: "og:title", content: "Settings — SentryDojo" },
      {
        property: "og:description",
        content: "Integrations, notification routing and team roles.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [items, setItems] = useState(seedIntegrations);

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        toast.success(`${i.name} ${i.connected ? "disconnected" : "connected"}`);
        return { ...i, connected: !i.connected };
      }),
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="display-caps text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Integrations and access control for the vulnerability programme.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Integrations</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card/70">
          {items.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-3 p-5">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.desc}</p>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  i.connected
                    ? "border-green/50 bg-green/20 text-green"
                    : "border-border bg-surface-2 text-muted-foreground",
                )}
              >
                {i.connected ? "Connected" : "Not connected"}
              </span>
              <button
                onClick={() => toggle(i.id)}
                className="rounded-lg bg-surface-2 px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {i.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Team access</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/70">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {team.map((u) => (
                <tr key={u.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full border border-primary/60 bg-primary/25 px-2.5 py-0.5 text-xs font-semibold">
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}