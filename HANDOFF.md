# DataFinOps Commercial V1 Handoff

Updated: 2026-07-14
Branch: `codex/txline-live-read-api`
Recent evidence commits: `6b82c03c`, `c09457a8`, `b5e24172`, `29bf8a1b`, `9dcb383e`, and `81a1f733`.
Use `git log --oneline -- ideawithsol/datafinops` for the current HEAD-specific commit list.

## Current State

DataFinOps Commercial V1 is implemented with Docker-free Windows runtime support. The task ledger is 110/110 complete.

The console app also includes a sellable sandbox web demo, now positioned specifically for TxLINE World Cup 2026:

- `/`: commercial SaaS landing page for TxLINE World Cup 2026 fixture coverage, odds/scores replay, governed savings proposals, and settlement proof readiness.
- `/demo`: guided sandbox command center linking into portfolio, scenarios, proposals, savings, renewals, usage, and administration through a World Cup fixture/feed/settlement operating story.
- `/demo` now includes a complete guided workflow with an `Auto-run demo` button that advances through coverage ingestion, spend detection, optimization, proposal generation, proof validation, and decision.
- The main `/demo` launch cards now open concrete TxLINE World Cup module pages instead of placeholders: portfolio baseline, optimization scenarios, governed proposal review, replay-backed savings, renewal radar, and usage/metering.
- Demo copy now shows a truthful data-source banner. With `TXLINE_API_TOKEN` or `DATAFINOPS_TXLINE_API_TOKEN`, the server reads TxLINE fixture, odds, and score snapshots. Without a token, it shows `Synthetic fallback` and explains that live reads need credentials.
- Optional live-read env vars: `TXLINE_API_ORIGIN` or `TXLINE_API_BASE_URL` for host selection, and `TXLINE_GUEST_JWT` when a pre-issued guest JWT should be reused.
- Live-write remains disabled. No browser token exposure, no wallet signing, no subscription, no purchase, and no activation path were added.

The local CI workflow structure is implemented in `.github/workflows/ci.yml`. The aggregate job is named `Required aggregate gate`, uses `if: always()`, depends on contracts, quality, tests, build, security, solver-parity, and evidence, and calls `scripts/assert-ci-results.mjs`.

Fresh T005 proof is in `artifacts/implementation/T005-ci-gates-local.json` and `artifacts/implementation/T005-ci-gates-github.json`:

- local structural tests: 5 passed
- aggregate uses `always()`: true
- failed required job fails aggregate: true
- git remote configured: true
- GitHub branch protection requires `Required aggregate gate`
- failing PR proof blocked merge: true
- fixed aggregate proof unblocked merge: true

External GitHub proof probe is in `artifacts/implementation/T005-ci-gates-github.json`. It sees `origin` as `https://github.com/maixuancanh/datafinops.git`, repository `maixuancanh/datafinops`, required status check `Required aggregate gate`, PR #1 failing-run proof, and PR #1 fixed-run/merge proof.

Remote and GitHub-plan evidence is in `artifacts/implementation/T005-remote-discovery.md`. The repo was created private, then changed to public after explicit user permission so branch protection could be configured.

Latest merge-protection proof: PR #1 failed at commit `83c5b8e` with `tests=failure` and `Required aggregate gate=failure`, observed merge state `BLOCKED`; after fix commit `7eefdc0`, `Required aggregate gate` passed, observed merge state `CLEAN`, and the PR merged as `24f4900`.

## Runtime And Verification

Docker was intentionally bypassed for this Windows machine. Native runtime scripts are present:

- `scripts/start-native-dependencies.ps1`
- `scripts/check-native-dependencies.ps1`
- `scripts/stop-native-dependencies.ps1`
- `scripts/quickstart.ps1`
- `scripts/release-rehearsal.ps1`

Previously archived evidence shows sandbox-only verification for US1-US6 and Commercial V1 under:

- `artifacts/foundation/`
- `artifacts/us1/` through `artifacts/us6/`
- `artifacts/commercial-v1/`
- `artifacts/implementation/`

Local `pnpm test:integration` requires PostgreSQL listening on `127.0.0.1:55432`. On this machine it currently fails with `ECONNREFUSED` when native PostgreSQL is not running; GitHub Actions covers this path with a PostgreSQL service mapped as `55432:5432`.

Safety state remains unchanged for write/external-spend paths: no live spend, no public deploy, no funded wallet, and no live-write enablement. Local no-token browser verification proves fallback behavior only; a configured activated TxLINE token is required to prove live upstream data.

## Final Verification Command

```powershell
git -C D:\superteam\ideawithsol\datafinops remote -v
gh repo view --json nameWithOwner,url
powershell -NoProfile -ExecutionPolicy Bypass -File D:\superteam\ideawithsol\datafinops\scripts\verify-ci-gate-github.ps1
```
