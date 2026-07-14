# Demo Auto Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/demo` into a guided TxLINE World Cup 2026 workflow with an `Auto-run demo` control.

**Architecture:** Keep `/demo/page.tsx` as a server page and move interactive workflow behavior into a small client component. Store deterministic workflow data in `commercial-demo-data.ts`; keep existing module cards as supporting drill-down links.

**Tech Stack:** Next.js App Router, React client component, TypeScript static data, global CSS, Playwright browser smoke.

---

### File Structure

- Modify `apps/console/app/commercial-demo-data.ts`: add workflow step data.
- Create `apps/console/app/demo/demo-workflow.tsx`: client component with auto-run/manual step controls.
- Modify `apps/console/app/demo/page.tsx`: render workflow as the main demo story before queues/modules.
- Modify `apps/console/app/globals.css`: add workflow timeline/comparison/proof/decision styles.
- Update `HANDOFF.md` and `IMPLEMENTATION_STATUS.md`.

### Task 1: Add Workflow Data And Client Component

- [x] **Step 1: Add workflow data**

Add six deterministic workflow steps with stage, title, body, metric, status, module href, proof rows, and current/candidate comparison.

- [x] **Step 2: Add auto-run component**

Create a client component with `useState`/`useEffect`. It supports manual step selection, `Auto-run demo`, pause, and reset.

### Task 2: Integrate Into `/demo`

- [x] **Step 1: Render workflow first**

Place the workflow immediately after the hero and before KPI cards/queues.

- [x] **Step 2: Keep module links as drill-down**

Keep launch cards lower on the page and explain they are drill-down details.

### Task 3: Verify And Ship

- [x] **Step 1: Run local gates**

Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`.

- [x] **Step 2: Browser smoke**

Open `/demo`, click `Auto-run demo`, confirm at least one automatic step advance, click a manual step, and save screenshot.

- [ ] **Step 3: Commit, PR, protected merge**

Push branch, create PR, wait for required aggregate gate, merge only when clean, then verify main CI/security.
