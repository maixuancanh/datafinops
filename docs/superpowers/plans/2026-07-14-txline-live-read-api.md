# TxLINE Live Read API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the DataFinOps web demo to real TxLINE read snapshots when credentials are configured, with an explicit fallback mode otherwise.

**Architecture:** A server-only adapter owns TxLINE credential handling and snapshot reads. Server pages call the adapter and pass derived, non-secret values into existing UI components. Client workflow controls remain interactive but never receive credentials.

**Tech Stack:** Next.js App Router, TypeScript, Fetch API, TxLINE guest JWT and snapshot endpoints.

---

### Task 1: Server-side TxLINE adapter

**Files:**

- Create: `apps/console/app/txline-live-data.ts`

- [x] Add `getTxlineLiveSnapshot()` that reads `TXLINE_API_TOKEN` or `DATAFINOPS_TXLINE_API_TOKEN`.
- [x] Add `TXLINE_API_ORIGIN` / `TXLINE_API_BASE_URL` support for mainnet/devnet host selection.
- [x] Fetch guest JWT from `/auth/guest/start`.
- [x] Fetch fixtures, selected fixture odds, and selected fixture scores through TxLINE snapshot endpoints.
- [x] Return a fallback snapshot with a clear reason when no credential exists or the upstream call fails.

### Task 2: Demo page integration

**Files:**

- Modify: `apps/console/app/demo/page.tsx`
- Modify: `apps/console/app/globals.css`

- [x] Convert `/demo` to a dynamic server page.
- [x] Build hero metrics and workflow rows from the live snapshot.
- [x] Add a visible source banner for `Live TxLINE API` or `Synthetic fallback`.
- [x] Keep `DemoWorkflow` as a client component and pass only non-secret data.

### Task 3: Module page integration

**Files:**

- Modify: `apps/console/app/(workspace)/portfolio/page.tsx`
- Modify: `apps/console/app/(workspace)/scenarios/page.tsx`
- Modify: `apps/console/app/(workspace)/proposals/[id]/page.tsx`
- Modify: `apps/console/app/(workspace)/savings/page.tsx`
- Modify: `apps/console/app/(workspace)/renewals/page.tsx`
- Modify: `apps/console/app/(workspace)/usage/page.tsx`
- Modify: `apps/console/app/(workspace)/txline-module-page.tsx`

- [x] Convert module pages to dynamic server pages.
- [x] Replace static module KPIs with snapshot-derived KPIs.
- [x] Replace the old “No real TxLINE token” label with a truthful live/fallback data-mode label.

### Task 4: Documentation and status

**Files:**

- Modify: `HANDOFF.md`
- Modify: `IMPLEMENTATION_STATUS.md`

- [ ] Document the new environment variables.
- [ ] Clarify that local verification without a TxLINE token proves fallback behavior, not live upstream data.

### Task 5: Verification and PR

- [ ] Run `pnpm --filter @datafinops/console typecheck`.
- [ ] Run `pnpm --filter @datafinops/console build`.
- [ ] Run repo-level format, lint, typecheck, build, and `git diff --check`.
- [ ] Smoke test `/demo` in a browser with no token and confirm the fallback banner.
- [ ] Commit, push, open PR, wait for required checks, merge through protected `main`.
