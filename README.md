# Security Command Center

can u please complete this project Done so far

src/styles.css — full Discord-inspired dark indigo design system (Blurple/magenta/green tokens, severity colors, gradient mesh, glow/animation utilities).

src/lib/mock-data.ts — 39 seeded findings across 4 products, engagements, tests, 30-day trend data, reports, integrations, team.

src/lib/store.tsx — local state store (status changes, risk acceptance, JIRA tickets, activity log, drawer state).

src/components/badges.tsx, AppShell.tsx (sidebar + top bar), FindingsTable.tsx (sortable/filterable), FindingDrawer.tsx (CVSS bar, status dropdown, duplicates, risk-acceptance form, JIRA/Slack toasts, activity log).

Still to build

Route files, which is why the current typecheck error exists (AppShell links to routes that don't exist yet): index.tsx (dashboard with KPIs + recharts donut/line), products.index.tsx, products.$productId.tsx, engagements.$engagementId.tsx, findings.tsx, pipeline.tsx (the 7-step animated pipeline), reports.tsx, settings.tsx.

Wiring StoreProvider, AppShell, FindingDrawer, and <Toaster /> into src/routes/__root.tsx, plus per-route head metadata and the Space Grotesk/Inter font <link>.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7dea2e11-38a5-4c25-8547-c4aeeab57657).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
