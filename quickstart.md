# DataFinOps Commercial Acceptance Quickstart

## Purpose

Validate a completed implementation from a clean local environment through verified baseline, deterministic optimization, governed approval, unfunded signing simulation, entitlement verification, savings close, and demo capture.

## Prerequisites

- Repository-pinned Node.js and pnpm.
- Docker with PostgreSQL, Redis, and S3-compatible storage ports available.
- Playwright Chromium.
- FFmpeg and FFprobe for video generation.
- No production TxLINE credential, funded wallet, private key, seed phrase, or live-write mode.

## Start

```powershell
pnpm install --frozen-lockfile
docker compose up -d postgres redis minio
pnpm db:migrate
pnpm demo:seed
pnpm dev
```

Expected health reports `status=ok`, `mode=sandbox`, a fixed pricing clock, replay adapter, and demo signer. The UI shows `Crescent Markets Sandbox` and cannot switch to live-write.

## Scenario 1 — Verify Baseline

1. Sign in as the procurement demo user.
2. Verify the seeded TxLINE connection: network, program, API host, public wallet reference, pricing, subscription, and entitlement.
3. Import synthetic usage and revenue aggregates twice with the same idempotency key; confirm one logical import.
4. Map products and run allocation; confirm totals reconcile and unallocated cost remains visible.
5. Review current subscription cost, league coverage, latency, effective period, source freshness, and hashes.

## Scenario 2 — Optimize and Challenge

1. Open the next planning period and freeze an optimization snapshot.
2. Run the optimizer; confirm every displayed candidate has independent hard-constraint status `PASSED`.
3. Inspect current versus recommended cost, coverage, latency, headroom, changes, confidence, and rejected alternatives.
4. Add a hard coverage requirement for the seeded knockout fixture and run a new snapshot.
5. Confirm the candidate changes, prior run remains immutable, and replay produces matching hashes.
6. Run the infeasible fixture and confirm no proposal can be created.

## Scenario 3 — Govern and Sign Safely

1. Create a proposal from the valid recommendation.
2. Approve as procurement, then switch to finance and approve within authority.
3. Attempt self-approval for the independent role and confirm denial.
4. Review the unsigned transaction summary: sandbox network, program, subscription changes, exact synthetic amount, expiry, proposal hash, and operation key.
5. Confirm there is no private-key or seed-phrase input.
6. Sign with the deterministic demo signer and submit the public simulation receipt twice.
7. Confirm one logical transaction and one activation attempt.

## Scenario 4 — Verify and Close Savings

1. Advance the deterministic observer to confirmed state.
2. Run API activation and verify effective entitlement, coverage, latency, and proposal match.
3. Close the synthetic accounting period against the approved baseline.
4. Confirm realized savings links exact actual cost, baseline, allocation, verification, formula, and evidence hash.
5. Apply the seeded credit correction and confirm a reversal entry is appended without changing history.

## Automated Acceptance

```powershell
pnpm contracts:lint
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:property
pnpm test:golden
pnpm test:contract
pnpm test:integration
pnpm test:e2e
pnpm test:security
pnpm test:load
pnpm build
```

Expected result: all commands exit zero; independent verification passes every candidate; bounded generated portfolios match brute-force truth; secret corpus scans find no signing material; duplicates create one operation; and every realized entry replays exactly.

## Record Demo

```powershell
Copy-Item video/demo-config.example.json video/demo-config.json
pwsh ./video/record-demo.ps1
pwsh ./video/render-demo.ps1 -RawVideo <raw.webm> -NarrationAudio <voice.wav>
```

Check `checklists/demo-readiness.md`, archive FFprobe output and execution report, and confirm the final video never implies a funded or live transaction.

## Stop and Reset

```powershell
pnpm demo:reset
docker compose down
```

The reset command must confirm sandbox mode and remove only seeded synthetic state.
