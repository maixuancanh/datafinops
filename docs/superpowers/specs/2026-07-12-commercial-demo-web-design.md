# Commercial Demo Web Design

## Goal

Turn the existing DataFinOps console into a sellable SaaS demo website: a polished landing page plus a sandbox product walkthrough that a buyer can understand without auth, billing, live-write, funded wallets, or production credentials.

## Target Buyer Experience

The first screen should answer three questions quickly:

1. What is this? DataFinOps is a commercial control plane for TxLINE/data-rights spend, renewals, proposal governance, and evidence-backed savings.
2. Why buy it? It reduces unmanaged spend, approval risk, renewal misses, and audit friction.
3. Can I see it? A clear “Launch sandbox demo” CTA opens the existing workspace routes using synthetic data.

## Scope

In scope:

- Replace the root route with a commercial landing page.
- Add a product-grade demo overview route at `/demo`.
- Add reusable UI primitives for marketing sections, KPI cards, risk cards, and CTA bands.
- Link into existing workspace pages for portfolio, scenarios, proposals, savings, renewals, usage, and administration.
- Keep safety copy explicit: sandbox-only, non-custodial, no server-side signing, no live spend, no live-write.
- Verify with formatting, lint, typecheck, build, and GitHub CI.

Out of scope:

- Real auth.
- Real billing.
- Production database provisioning.
- Public deployment of a running service.
- Live-write enablement or funded-wallet workflows.

## Architecture

The implementation stays inside `apps/console` and uses the existing Next.js app router. The root route becomes the sales page; `/demo` becomes a guided sandbox dashboard; existing workspace routes remain the deeper demo product surfaces. Static TypeScript data powers copy and metrics so the site is deterministic and safe.

## Routes

- `/`: Commercial landing page with hero, proof metrics, problem/solution, workflow, security posture, pricing-style pilot CTA, and demo CTA.
- `/demo`: Demo command center with sandbox KPIs, high-risk renewals, proposal queue, evidence readiness, and links to deeper workspace screens.
- Existing workspace routes: remain intact and linked from the landing/demo pages.

## Commercial Positioning

Primary message:

> Stop treating data-rights spend like a spreadsheet problem. DataFinOps turns usage, contracts, entitlements, approvals, and savings evidence into one controlled operating loop.

Primary CTA:

- “Launch sandbox demo” → `/demo`

Secondary CTA:

- “Review evidence pack” → `/portfolio` or `/savings`
- “Book pilot” → `mailto:sales@datafinops.example?subject=DataFinOps pilot`

## Safety And Compliance

Every commercial page must avoid implying production readiness beyond what is true. Copy should say:

- Sandbox demo.
- Synthetic data.
- Non-custodial workflow.
- No private signing material.
- Live-write remains disabled by default.

## Acceptance Criteria

- The root page looks like a complete commercial SaaS landing page.
- `/demo` looks like a complete product walkthrough entry point.
- Navigation/CTA links route into the existing demo workspace.
- The site builds with `pnpm build`.
- `pnpm lint`, `pnpm typecheck`, and `pnpm format:check` pass.
- GitHub CI and security workflows pass through protected branch PR before merge.
