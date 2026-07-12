# Commercial Demo Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a polished DataFinOps SaaS demo website with a commercial landing page and guided sandbox demo entry point.

**Architecture:** Keep the implementation inside the existing Next.js console app. Add static commercial-demo data and reusable presentational components, then replace `/` and add `/demo` without changing live-write, auth, billing, or backend behavior.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, CSS modules/global CSS already in `apps/console`, pnpm workspace scripts.

---

### File Structure

- Modify `apps/console/app/page.tsx`: commercial landing page.
- Create `apps/console/app/demo/page.tsx`: guided sandbox demo command center.
- Create `apps/console/app/commercial-demo-data.ts`: deterministic copy, metrics, cards, links, and safety disclaimers.
- Modify `apps/console/app/layout.tsx`: metadata for commercial demo positioning if needed.
- Modify `apps/console/app/globals.css` or existing style file if present: marketing/demo styles.
- Update `HANDOFF.md` and `IMPLEMENTATION_STATUS.md`: document commercial demo route and safety posture.

### Task 1: Inspect Current Console Styling And Route Patterns

- [x] **Step 1: Read current console pages**

Run:

```powershell
Get-Content apps\console\app\page.tsx
Get-Content apps\console\app\layout.tsx
Get-ChildItem apps\console\app -Filter *.css -Recurse
```

Expected: identify whether styling is inline utility classes, global CSS, or component-local CSS.

- [x] **Step 2: Verify build baseline**

Run:

```powershell
pnpm --filter @datafinops/console build
```

Expected: build passes before UI edits.

### Task 2: Add Commercial Demo Data

- [x] **Step 1: Create `apps/console/app/commercial-demo-data.ts`**

Add typed arrays for:

- hero metrics: managed spend, projected savings, approval risk, evidence readiness.
- buyer pains.
- operating loop steps.
- demo modules linking to workspace routes.
- safety claims.
- pilot tiers shown as non-billing “pilot packages”.

- [x] **Step 2: Typecheck**

Run:

```powershell
pnpm --filter @datafinops/console typecheck
```

Expected: no TypeScript errors.

### Task 3: Replace Root Landing Page

- [x] **Step 1: Implement `apps/console/app/page.tsx`**

Use the static data to render:

- top nav.
- hero with CTA to `/demo`.
- buyer pain cards.
- operating loop section.
- KPI proof strip.
- safety/compliance strip.
- pilot CTA.

- [x] **Step 2: Build the console**

Run:

```powershell
pnpm --filter @datafinops/console build
```

Expected: root route statically renders successfully.

### Task 4: Add Guided Demo Page

- [x] **Step 1: Create `apps/console/app/demo/page.tsx`**

Render:

- sandbox banner.
- KPI cards.
- proposal queue.
- renewal risks.
- evidence checklist.
- module launch cards linking to `/portfolio`, `/scenarios`, `/proposals/demo-proposal-001`, `/savings`, `/renewals`, `/usage`, and `/administration`.

- [x] **Step 2: Build the console**

Run:

```powershell
pnpm --filter @datafinops/console build
```

Expected: `/demo` route appears in build output.

### Task 5: Polish Metadata And Safety Docs

- [x] **Step 1: Update metadata**

In `apps/console/app/layout.tsx`, set commercial title/description that matches the landing page.

- [x] **Step 2: Update status docs**

Update:

- `HANDOFF.md`
- `IMPLEMENTATION_STATUS.md`

Add that a sellable sandbox web demo exists locally in the console app, with no public deploy/live-write/billing.

### Task 6: Verification And Protected-Branch Merge

- [x] **Step 1: Run local gates**

Run:

```powershell
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

Expected: all pass.

- [ ] **Step 2: Commit branch**

Run:

```powershell
git add .
git commit -m "feat: add commercial SaaS demo web"
git push -u origin codex/commercial-demo-web
```

- [ ] **Step 3: Open PR and wait for required gate**

Run:

```powershell
gh pr create --repo maixuancanh/datafinops --base main --head codex/commercial-demo-web --title "Add commercial SaaS demo web" --body "Adds a sellable sandbox landing page and guided demo entry point without auth, billing, live-write, or public deployment."
gh pr view --repo maixuancanh/datafinops --json mergeStateStatus,statusCheckRollup,url
```

Expected: `Required aggregate gate` succeeds and merge state is `CLEAN`.

- [ ] **Step 4: Merge through protected branch**

Run:

```powershell
gh pr merge --merge --delete-branch
git switch main
git pull --ff-only origin main
```

Expected: local main matches protected GitHub main.
