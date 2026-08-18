import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Boxes,
  FileBarChart,
  LayoutDashboard,
  Search,
  Settings,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Boxes },
  { to: "/findings", label: "Findings", icon: ShieldAlert },
  { to: "/pipeline", label: "Detection Pipeline", icon: Workflow },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur md:flex">
        <Link to="/" className="flex items-center gap-2.5 px-5 py-6">
          <span className="grid size-9 place-items-center rounded-xl brand-gradient">
            <ShieldAlert className="size-5 text-primary-foreground" />
          </span>
          <span className="display-caps text-lg">SentryDojo</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="m-3 rounded-xl bg-surface-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-magenta">Demo mode</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sample data only. Every action updates local state.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3 backdrop-blur-xl md:px-8">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search findings, products, CVEs…"
              className="h-10 w-full rounded-lg border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="relative grid size-10 place-items-center rounded-lg bg-surface-2 text-muted-foreground transition-colors hover:text-foreground">
            <Bell className="size-4" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-magenta" />
          </button>
          <div className="flex items-center gap-2.5 rounded-full bg-surface-2 py-1.5 pl-1.5 pr-4">
            <span className="grid size-8 place-items-center rounded-full brand-gradient text-xs font-bold">
              AO
            </span>
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-semibold">Ada Okonkwo</p>
              <p className="text-[11px] text-muted-foreground">Security Lead</p>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
