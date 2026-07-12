# DataFinOps Commercial V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task, and `superpowers:test-driven-development` for every behavioral change.

**Goal:** Build a production-operable, non-custodial TxLINE subscription intelligence platform that computes least-cost valid configurations, governs approvals, verifies activation, and reconciles realized savings.

**Architecture:** A Next.js console and Fastify API expose tenant-scoped inventory, requirements, scenarios, approvals, transaction observation, entitlement, and finance workflows. PostgreSQL stores immutable versions and append-only evidence; Redis/BullMQ orchestrates ingestion, optimization, observation, activation, renewal, and close jobs; object storage holds content-addressed permitted exports. A versioned TxLINE adapter isolates vendor semantics, a deterministic optimizer plus independent verifier enforces hard constraints, and wallet signing remains exclusively client-side.

**Tech Stack:** TypeScript, pnpm workspaces, Next.js, React, Fastify, PostgreSQL, Drizzle ORM, Redis, BullMQ, S3-compatible storage, a deterministic constraint solver selected by ADR, wallet adapter interfaces, OpenTelemetry, Sentry, Vitest, fast-check, Testcontainers, Pact, Playwright, k6, Vercel, Railway, FFmpeg.

## Constitutional Gates

| Gate | Requirement | Evidence |
|---|---|---|
| Source truth | TxLINE adapter verifies network, program, pricing, subscription, activation, and entitlement | Adapter contract/golden tests |
| Optimization safety | Every candidate passes an independent hard-constraint verifier | Property and mutation tests |
| Reproducibility | Snapshots and all material objects are immutable/versioned | Replay and hash tests |
| Governance | Policy, separation, approval, expiry, and invalidation bind exact proposal | Authorization/state tests |
| Non-custody | No server signing or private signing material | Schema, security, artifact scans |
| Verified value | Confirmation, activation, entitlement, and realized savings are separate | Integration and ledger tests |
| Operational safety | Live-write per-tenant default off with tested kill switches | Enablement and incident evidence |
| Demo safety | Synthetic metrics and unfunded signer flow | Capture report and config audit |

## Repository Layout

```text
datafinops/
├── apps/
│   ├── console/                   # Next.js procurement and finance UI
│   ├── api/                       # Fastify management/integration API
│   └── workers/                   # ingestion, optimize, observe, activate, close
├── packages/
│   ├── contracts/                 # generated REST/event/schema types
│   ├── domain/                    # money, requirements, versions, state machines
│   ├── txline-adapter/            # vendor/network/program normalization
│   ├── allocation-engine/         # versioned cost allocation
│   ├── optimizer/                 # deterministic solver and explanations
│   ├── constraint-verifier/       # independent hard-constraint checker
│   ├── policy-engine/             # spending and governance policy
│   ├── transaction-builder/       # unsigned bound envelopes and summaries
│   ├── wallet-client/             # browser-only wallet adapters/demo signer
│   ├── entitlement-verifier/      # on-chain/API effective-state verification
│   ├── savings-ledger/            # append-only close and reversal logic
│   ├── auth/                      # tenancy, RBAC, SSO, service accounts
│   ├── observability/             # trace, metrics, redaction
│   └── test-fixtures/             # pricing, portfolios, receipts, periods
├── infrastructure/
│   ├── migrations/
│   ├── railway/
│   ├── vercel/
│   ├── dashboards/
│   └── runbooks/
├── tests/
│   ├── contract/
│   ├── integration/
│   ├── property/
│   ├── e2e/
│   ├── security/
│   └── load/
└── docs/
```

## Component Boundaries

- **Console:** compares configurations, gathers approvals, and hosts browser wallet adapters; never receives server secrets in rendered data.
- **API:** authenticates tenant/role, validates schemas and idempotency, writes versioned commands, and returns jobs/read models.
- **TxLINE adapter:** owns network/program/API host semantics, source freshness, normalization, and permitted evidence references.
- **Snapshot service:** canonicalizes and hashes all optimizer inputs in one transactionally consistent manifest.
- **Allocation engine:** maps costs under immutable rules and exposes unallocated value.
- **Optimizer:** returns candidates, objective value, and rejection reasons from a snapshot only.
- **Constraint verifier:** independently validates every hard requirement before recommendation or proposal.
- **Policy engine:** determines eligibility, approval graph, signer allowlist, limits, and blocked reasons.
- **Transaction builder:** generates only unsigned bound envelopes after final approval.
- **Wallet client:** lives in browser-only modules and returns signed public transaction bytes or simulation receipts, never secret material.
- **Entitlement verifier:** separates finality, subscription state, activation, API entitlement, and effective coverage.
- **Savings ledger:** closes periods from verified facts and appends corrections.

## Data and Consistency

- PostgreSQL is authoritative for versions, approvals, operations, observations, verification, audit, and savings.
- Monetary values use currency and exact representation; calculations record rounding policy.
- Every async operation has a stable operation key and transactional outbox event.
- Snapshots, candidate sets, recommendations, proposal versions, approvals, transaction envelopes, verification records, baselines, and ledger entries are immutable.
- Redis stores queues, locks, rate limits, and cache only; no approval or financial fact exists solely in Redis.
- Evidence objects are content-addressed; PostgreSQL records hash, size, media type, retention, and access policy.

## Solver Strategy

Start with a finite exact solver appropriate to the observed TxLINE tier/bundle model. Canonical input order and explicit tie-break rules eliminate nondeterminism. For every solver candidate, the separate constraint-verifier package checks coverage, fixtures, latency, period, budget, network, and policy-independent hard rules. Golden cases and property generators compare solver results to brute-force truth for bounded portfolios. Infeasible results include conflict explanations derived from constraints, not language-model inference.

## Contract Strategy

The OpenAPI, AsyncAPI, optimization snapshot schema, and transaction proposal schema are authoritative. CI validates examples, generates TypeScript clients, detects breaking changes, and runs provider/consumer tests. Webhooks use signed versioned envelopes. Transaction schemas set `additionalProperties: false` and explicitly exclude signing secrets.

## Security and Non-Custody

- OIDC/SAML, MFA for privileged roles, scoped service accounts, and audited break-glass.
- Tenant/environment predicates at API and repository/database layers.
- Strict prohibited-secret validation for mnemonic, seed, private key, keystore, raw signer, and free-form signing payload fields.
- Browser-only wallet package excluded from server dependency graph by build tests.
- Allowlist network, program, accounts, instruction discriminators, currencies, and amounts.
- Bind envelope to proposal/snapshot hashes, operation key, expiry, and human-readable summary digest.
- Live-write separate from live-read and disabled by default per tenant.

## Delivery Phases

### Phase 1 — Foundation

Create workspace, contracts, domain primitives, exact money, tenancy, audit, outbox, migrations, demo fixtures, CI, security scans, and local services. Exit with isolation and contract gates green.

### Phase 2 — Baseline (US1)

Build TxLINE modes and normalization, connection verification, pricing/subscription/entitlement inventory, usage/revenue import, allocation, requirements, freshness, and baseline UX. Exit with a reproducible verified read-only inventory.

### Phase 3 — Optimize (US2)

Build canonical snapshots, solver, independent verifier, infeasibility explanation, scenario comparison, confidence, replay, and shadow recommendation. Exit when golden and property suites prove optimal valid output for the supported envelope.

### Phase 4 — Govern (US3)

Build policy versions, proposal versions, approval graphs, separation of duties, limits, effective windows, invalidation, notifications, and audit. Exit with an independently usable procurement approval dossier.

### Phase 5 — Execute and Verify (US4)

Build unsigned transaction envelope, browser demo/devnet wallet adapter, preflight, observation, finality, activation, entitlement verification, incidents, and live-write gate. Exit with a complete unfunded demo/devnet verified flow.

### Phase 6 — Finance (US5)

Build baselines, period close, actual cost ingestion, forecast/pending/realized/disputed/reversed ledger, reconciliation, exports, and renewal calendar. Exit when every realized entry replays from evidence.

### Phase 7 — Commercial Hardening (US6)

Build SSO, roles, service accounts, retention, metering, billing, support, dashboards, alerts, load, restore, rollback, Vercel/Railway deployment, and customer enablement. Exit only after all release gates have dated evidence.

## Environments

- **Local:** Docker PostgreSQL/Redis/MinIO, fixed clock, replay adapter, synthetic portfolios, demo signer.
- **CI:** isolated containers, brute-force/property verification, contract generation, secret corpus scan, SBOM.
- **Staging:** Vercel preview console and isolated Railway services; sandbox/devnet only by default.
- **Production live-read:** real permitted inventory with all write routes disabled.
- **Production live-write:** separate tenant capability, secrets, policy, network/program allowlist, approval, signer, alerts, and emergency stop.

## Deployment and Rollback

Use forward-compatible expand/contract migrations, canary APIs, paused new workers, shadow optimizer comparison, and progressive console release. Any optimizer version deploys in shadow before recommendations. Transaction builders are versioned and allowlisted. Rollback disables live-write first, restores prior images/optimizer/builder, pauses incompatible jobs, and uses forward database repair rather than destructive rollback.

## Verification Commands

```powershell
pnpm install --frozen-lockfile
pnpm contracts:lint
pnpm contracts:generate
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
pwsh ./scripts/quickstart.ps1
pwsh ./video/record-demo.ps1
pwsh ./video/render-demo.ps1 -RawVideo <raw.webm> -NarrationAudio <voice.wav>
```

## Definition of Done

- Requirements map to implementation tasks and test evidence.
- Independent verifier passes every returned candidate; brute-force truth matches bounded generated portfolios.
- No private signing material exists in APIs, artifacts, logs, or dependencies.
- Proposal invalidation, duplicate transaction, activation failure, and entitlement mismatch paths are exercised.
- Every realized savings entry replays exactly from approved evidence.
- Live-write enablement and emergency stop are exercised in staging/devnet.
- Restore, rollback, queue replay, metering, accessibility, quickstart, and deterministic video are green.
- Accountable owners check production, security, and demo readiness with dated evidence.
