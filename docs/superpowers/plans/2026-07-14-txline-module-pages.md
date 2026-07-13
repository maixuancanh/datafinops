# TxLINE Module Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder launch destinations with concrete TxLINE World Cup 2026 sandbox module pages.

**Architecture:** Add static module data and a reusable module-page component under the existing Next.js `(workspace)` route group. Each route imports one module definition and renders consistent KPIs, records, proof checks, and safe next-action copy without adding backend calls.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript static data, global CSS, pnpm gates, Playwright browser smoke.

---

### File Structure

- Create `apps/console/app/(workspace)/txline-worldcup-modules.ts`: shared deterministic module definitions.
- Create `apps/console/app/(workspace)/txline-module-page.tsx`: reusable page shell for module routes.
- Modify six route pages:
  - `apps/console/app/(workspace)/portfolio/page.tsx`
  - `apps/console/app/(workspace)/scenarios/page.tsx`
  - `apps/console/app/(workspace)/proposals/[id]/page.tsx`
  - `apps/console/app/(workspace)/savings/page.tsx`
  - `apps/console/app/(workspace)/renewals/page.tsx`
  - `apps/console/app/(workspace)/usage/page.tsx`
- Modify `apps/console/app/globals.css`: workspace module layout styles.
- Update `IMPLEMENTATION_STATUS.md` and `HANDOFF.md` with the deeper module behavior.

### Task 1: Add Shared Module Data And Renderer

- [x] **Step 1: Add `txline-worldcup-modules.ts`**

Create typed module definitions for portfolio, scenarios, proposal, savings, renewals, and usage. Each definition includes eyebrow, title, lead, KPIs, records, proof checks, and a next action.

- [x] **Step 2: Add `txline-module-page.tsx`**

Create a reusable React Server Component that renders the shared module definition.

### Task 2: Replace Placeholder Routes

- [x] **Step 1: Wire the six routes**

Each route imports `TxlineModulePage` and the relevant module definition. Proposal still reads `params.id` and passes it into the renderer.

- [x] **Step 2: Add styles**

Add workspace module CSS classes for hero, KPI grid, table-like records, proof checklist, and action band.

### Task 3: Verify And Ship

- [x] **Step 1: Run local gates**

Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`.

- [x] **Step 2: Browser smoke**

Click all six module cards from `/demo`, confirm each module page includes `TxLINE`, `World Cup 2026`, and route-specific non-placeholder copy, then save an updated screenshot.

- [ ] **Step 3: Commit, push, PR, merge**

Use branch `codex/txline-module-pages`, wait for required GitHub gate, merge only when clean, and verify main CI/security.
