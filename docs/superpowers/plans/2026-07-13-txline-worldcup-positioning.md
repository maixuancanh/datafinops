# TxLINE World Cup Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the commercial web demo so buyers immediately see DataFinOps as a TxLINE World Cup 2026 spend, proof, and settlement control room.

**Architecture:** Keep the existing Next.js App Router pages and styling. Update deterministic demo data, landing page copy, demo page copy, metadata, docs, and browser smoke artifacts without adding auth, billing, live-write, public deployment, or real TxLINE credentials.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript static data, global CSS, pnpm workspace gates, Playwright browser smoke.

---

### File Structure

- Modify `apps/console/app/commercial-demo-data.ts`: replace generic rights-spend data with TxLINE World Cup 2026 fixtures, odds/scores, replay, validation, and settlement language.
- Modify `apps/console/app/page.tsx`: landing page headline, sections, CTA, and security copy should explicitly mention TxLINE and World Cup 2026.
- Modify `apps/console/app/demo/page.tsx`: demo command center should show TxLINE World Cup operations, not generic SaaS KPIs.
- Modify `apps/console/app/layout.tsx`: metadata should include TxLINE and World Cup 2026.
- Modify `IMPLEMENTATION_STATUS.md` and `HANDOFF.md`: document the corrected positioning.
- Update `artifacts/commercial-v1/*.png`: browser smoke evidence for corrected landing and demo pages.

### Task 1: Update Static Demo Data

- [x] **Step 1: Replace generic metrics and copy**

Update `commercial-demo-data.ts` so `heroMetrics`, `buyerPains`, `operatingLoop`, `demoModules`, `proposalQueue`, `renewalRisks`, `evidenceChecks`, `pilotPackages`, and `safetyClaims` all reference TxLINE World Cup 2026.

- [x] **Step 2: Typecheck console**

Run `pnpm --filter @datafinops/console typecheck`.

Expected: no TypeScript errors.

### Task 2: Update Landing And Demo Pages

- [x] **Step 1: Update `/` landing copy**

The landing page must include:

- TxLINE in the hero eyebrow and lead.
- World Cup 2026 in the main headline.
- Buyer use cases for sportsbook ops, fan apps, sponsor activations, and prediction-market settlement.
- A safety statement that no real TxLINE token or funded wallet is required.

- [x] **Step 2: Update `/demo` command center copy**

The demo page must include:

- “TxLINE World Cup 2026” in the H1 or lead.
- Proposal queue and renewal radar framed around fixture coverage, odds/scores replay, validation proofs, and settlement risk.
- Launch point copy that links existing workspace routes to TxLINE-specific product surfaces.

- [x] **Step 3: Build console**

Run `pnpm --filter @datafinops/console build`.

Expected: `/` and `/demo` statically render.

### Task 3: Update Metadata And Docs

- [x] **Step 1: Update metadata**

Set title/description to mention DataFinOps, TxLINE, and World Cup 2026.

- [x] **Step 2: Update docs**

Update `HANDOFF.md` and `IMPLEMENTATION_STATUS.md` so the commercial web demo is no longer described as generic buyer SaaS only.

### Task 4: Verify And Ship

- [x] **Step 1: Run local gates**

Run:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

- [x] **Step 2: Browser smoke**

Start or reuse the console server and verify `/` plus `/demo` contain TxLINE and World Cup 2026 copy. Save updated screenshots under `artifacts/commercial-v1/`.

- [ ] **Step 3: Commit, push, PR, merge through protection**

Commit on `codex/txline-worldcup-positioning`, push, create PR, wait for `Required aggregate gate`, merge only when clean, then verify main CI/security.
