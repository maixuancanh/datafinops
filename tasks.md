# DataFinOps Commercial V1 Implementation Tasks

**Input artifacts:** `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, and runbooks.

**Execution rule:** Complete tasks in ID order unless `[P]` marks safe parallel work. Tests are written and observed failing before the behavior they specify.

**Path convention:** Paths are relative to the future `datafinops/` implementation repository root.

## Phase 1 — Workspace and Delivery Foundation

- [x] T001 Create the pnpm workspace, pinned Node version, strict TypeScript base, and root scripts in `./package.json`, `./pnpm-workspace.yaml`, `./.nvmrc`, and `./tsconfig.base.json`; verify clean frozen installation.
- [x] T002 [P] Configure lint, formatting, commit checks, exact-import rules, and browser/server boundary lint in `eslint.config.mjs`, `prettier.config.mjs`, `.editorconfig`, and `scripts/check-boundaries.mjs`.
- [x] T003 [P] Implement typed environment configuration and fail-closed mode schema in `packages/config/src/index.ts` and `packages/config/src/modes.ts`; test sandbox/devnet/live-read/live-write isolation in `packages/config/test/modes.test.ts`.
- [x] T004 [P] Define local PostgreSQL, Redis, MinIO, and service dependencies in `./docker-compose.yml` and `./.env.example`; include only synthetic and unfunded references.
- [ ] T005 Configure CI aggregate gates for contracts, lint, type, tests, build, security, SBOM, solver parity, and evidence in `.github/workflows/ci.yml`; prove any failed job blocks merge.
- [x] T006 [P] Configure secret, prohibited-signing-material, dependency, license, image, and provenance scans in `.github/workflows/security.yml`, `.gitleaks.toml`, and `security/prohibited-material.yml`.
- [x] T007 [P] Build fixed clock, deterministic IDs, exact money factories, portfolio generators, and seed control in `packages/test-fixtures/src/`; verify repeatable canonical hashes.
- [x] T008 [P] Add synthetic pricing, subscription, fixture, usage, requirements, receipts, entitlement, and savings fixtures with provenance in `packages/test-fixtures/fixtures/` and `packages/test-fixtures/README.md`.
- [x] T009 Create console, API, worker, and health skeletons in `apps/console/`, `apps/api/`, and `apps/workers/`; health must report version, mode, adapter, fixed clock, and live-write state without secrets.
- [x] T010 [P] Implement structured logs, correlation, OpenTelemetry, metrics, Sentry, finance/secret redaction, and allowlisted fields in `packages/observability/src/`; test in `packages/observability/test/redaction.test.ts`.
- [x] T011 [P] Create ADR template and initial solver, exact-money, non-custody, and mode decisions in `docs/adr/000-template.md`, `docs/adr/001-solver.md`, `docs/adr/002-money.md`, and `docs/adr/003-non-custody.md`.
- [x] T012 Document bootstrap, verification, evidence, safe demo, and reset procedures in `README.md` and `scripts/verify-workspace.ps1`; archive a clean run under `artifacts/bootstrap/`.

## Phase 2 — Blocking Platform Foundations

- [x] T013 Write failing schema lint and no-signing-secret tests for `contracts/openapi.yaml`, `contracts/events.asyncapi.yaml`, and `contracts/schemas/*.json` in `tests/contract/schema-lint.test.ts`.
- [x] T014 Import approved contracts, validate examples, and generate strict TypeScript types from `contracts/openapi.yaml`, `contracts/events.asyncapi.yaml`, `contracts/schemas/optimization-snapshot.schema.json`, and `contracts/schemas/transaction-proposal.schema.json` into `packages/contracts/src/generated/`.
- [x] T015 [P] Add contract breaking-change and generated-artifact checks in `scripts/check-contract-compatibility.mjs` and `packages/contracts/package.json`; require approval for incompatibility.
- [x] T016 [P] Write exact money, currency, scale, rounding, period, and arithmetic tests in `packages/domain/test/money.test.ts`, including overflow and conversion-source behavior.
- [x] T017 Implement exact money and accounting-period primitives without binary floating point in `packages/domain/src/money/` and `packages/domain/src/periods/`; pass T016.
- [x] T018 Write failing migration/repository tests for all entities and forbidden signing columns in `tests/integration/database-model.test.ts` and `tests/security/migration-secret-lint.test.ts`.
- [x] T019 Implement forward-only baseline migrations, indexes, constraints, append-only guards, and tenant/mode columns in `infrastructure/migrations/0001_baseline.sql`; pass T018.
- [x] T020 [P] Implement mandatory tenant/workspace/environment repository context in `packages/domain/src/repositories/`; prohibit unscoped repositories with `packages/domain/test/repository-context.test-d.ts`.
- [x] T021 Write cross-tenant, cross-mode, role, direct-ID, list, export, and job negative tests in `tests/security/tenant-role-isolation.test.ts`.
- [x] T022 Implement OIDC subject mapping, RBAC, approval authority, service account restrictions, and dual-layer scope in `packages/auth/src/` and `apps/api/src/plugins/auth.ts`; pass T021.
- [x] T023 [P] Implement privileged MFA posture, audited time-limited break-glass, and role lifecycle in `packages/auth/src/privileged-access.ts`; test denial/expiry in `packages/auth/test/privileged-access.test.ts`.
- [x] T024 Write failing idempotency, transactional outbox, consumer deduplication, and reorder tests in `tests/integration/idempotency-outbox.test.ts`.
- [x] T025 Implement stable operation keys, request replay results, transactional outbox, and consumer deduplication in `packages/domain/src/idempotency/` and `apps/workers/src/outbox/`; pass T024.
- [x] T026 [P] Create isolated queues and fair tenant scheduling for ingestion, snapshot, optimization, notification, observation, activation, verification, renewal, close, export, and metering in `apps/workers/src/queues/`.
- [x] T027 [P] Implement append-only canonical audit events and purpose-bound privileged reads in `packages/domain/src/audit/`; test tamper rejection in `packages/domain/test/audit.test.ts`.
- [x] T028 [P] Build prohibited-signing-material prefilter and redaction corpus in `packages/security/src/prohibited-material.ts` and `tests/security/fixtures/signing-material-corpus.json`; assert no raw value reaches test log sinks.
- [x] T029 Configure local backup, point-in-time restore simulation, object versioning, and restore verification in `infrastructure/backup/` and `scripts/restore-test.ps1`; compare hashes after restore.
- [x] T030 Run `scripts/verify-foundation.ps1`; archive contract, exact-money, isolation, prohibited-material, outbox, restore, and dependency evidence under `artifacts/foundation/`.

## Phase 3 — US1 Connect and Establish a Verified Baseline

- [x] T031 [P] [US1] Write TxLINE adapter contract tests for network, program, API host, pricing, tiers, bundles, leagues, latency, subscriptions, activation, entitlement, fixtures, freshness, source/ingest time, and unknown schema in `packages/txline-adapter/test/contract.test.ts`.
- [x] T032 [P] [US1] Write sandbox/replay mode tests and live-write default-deny tests in `packages/txline-adapter/test/modes.test.ts`; ensure write methods are absent from live-read capability.
- [x] T033 [US1] Implement versioned TxLINE adapter interfaces and replay/live-read implementations in `packages/txline-adapter/src/`; make unknown semantics block dependent executable state.
- [x] T034 [US1] Implement connection create, secret reference, expected network/program/host, verification job, and result in `apps/api/src/routes/connections.ts` and `apps/workers/src/connections/`; never expose the read credential after creation.
- [x] T035 [P] [US1] Write normalization, deduplication, correction, freshness, and canonical hash tests for pricing/subscription/fixture/entitlement rows in `packages/txline-adapter/test/normalization.test.ts`.
- [x] T036 [US1] Implement normalized pricing, subscription, fixture schedule, activation, and entitlement versions in `apps/workers/src/txline/` and `packages/domain/src/inventory/`.
- [x] T037 [P] [US1] Write usage/revenue CSV and JSON contract tests for schema, period, currency, units, duplicate, late, prohibited customer-level data, and quality score in `tests/contract/imports.test.ts`.
- [x] T038 [US1] Implement scoped aggregate usage/revenue imports and idempotent row hashes in `apps/api/src/routes/imports.ts` and `apps/workers/src/imports/`; pass T037.
- [x] T039 [P] [US1] Write allocation tests for priority, weights, exact reconciliation, rounding, retired mappings, and explicit unallocated cost in `packages/allocation-engine/test/allocation.test.ts`.
- [x] T040 [US1] Implement versioned product, cost center, mapping, allocation rule, result, and unallocated bucket in `packages/allocation-engine/src/` and `packages/domain/src/allocation/`.
- [x] T041 [P] [US1] Write requirement lifecycle tests for hard/soft, owner, product, league, fixture, latency, budget, period, blackout, and effective time in `packages/domain/test/requirements.test.ts`.
- [x] T042 [US1] Implement immutable requirement versions and validation in `packages/domain/src/requirements/` and `apps/api/src/routes/requirements.ts`.
- [x] T043 [P] [US1] Build connection verification and expected/observed inventory UX in `apps/console/app/(workspace)/connections/`; add Playwright tests in `tests/e2e/connection-baseline.spec.ts`.
- [x] T044 [P] [US1] Build usage import, mapping, allocation, quality, and unallocated-cost UX in `apps/console/app/(workspace)/usage/` and `apps/console/app/(workspace)/allocation/`.
- [x] T045 [US1] Build current subscription and entitlement baseline read model in `apps/workers/src/read-models/baseline.ts` and `apps/console/app/(workspace)/portfolio/`; show exact cost, coverage, latency, periods, freshness, and hashes.
- [x] T046 [US1] Execute `scripts/accept-us1.ps1` with valid, mismatched, duplicate, and unallocated fixtures; archive verified baseline and nondestructive block evidence under `artifacts/us1/`.

## Phase 4 — US2 Compute a Least-Cost Valid Configuration

- [x] T047 [P] [US2] Write canonical snapshot ordering, completeness, source-version, exact-money, material-hash, and immutability tests in `packages/domain/test/optimization-snapshot.test.ts`.
- [x] T048 [US2] Implement transactional snapshot assembly and JSON Schema validation in `packages/domain/src/snapshots/` and `apps/workers/src/optimization/snapshot.ts`; persist content-addressed input manifest.
- [x] T049 [P] [US2] Write a brute-force oracle for bounded synthetic portfolios in `packages/test-fixtures/src/brute-force-optimizer.ts` and prove the oracle against hand-calculated cases in `packages/test-fixtures/test/brute-force.test.ts`.
- [x] T050 [P] [US2] Write optimizer golden tests for over-provisioning, league, fixture, latency, budget, period, tie, headroom, change-minimization, and infeasible cases in `packages/optimizer/test/golden.test.ts`.
- [x] T051 [P] [US2] Write generated property tests comparing the selected objective to the brute-force oracle in `tests/property/optimizer-optimality.property.test.ts`.
- [x] T052 [US2] Implement deterministic supported-envelope solver, canonical candidate output, objective components, stable tie-breaks, cancellation, and limits in `packages/optimizer/src/`; pass golden and optimality tests.
- [x] T053 [P] [US2] Write independent verifier tests for every hard requirement and malicious/buggy candidates in `packages/constraint-verifier/test/verifier.test.ts`.
- [x] T054 [US2] Implement the independently owned hard-constraint verifier in `packages/constraint-verifier/src/`; prohibit recommendation promotion unless verifier status is passed.
- [x] T055 [P] [US2] Write infeasibility and conflict explanation tests in `packages/optimizer/test/infeasibility.test.ts`; require actionable requirement IDs without automatic relaxation.
- [x] T056 [US2] Implement rejection reasons, infeasible conflict set, data-quality confidence, assumptions, and deterministic explanation facts in `packages/optimizer/src/explanations/`.
- [x] T057 [P] [US2] Write identical-snapshot replay and nondeterminism detection tests in `tests/integration/optimizer-replay.test.ts`.
- [x] T058 [US2] Implement optimization job lifecycle, resource class, tenant fairness, immutable results, replay, and shadow-version comparison in `apps/workers/src/optimization/`.
- [x] T059 [P] [US2] Build requirement workspace with hard/soft semantics and downstream supersession preview in `apps/console/app/(workspace)/requirements/`; test keyboard/table behavior.
- [x] T060 [P] [US2] Build current-versus-candidate comparison, coverage diff, verifier status, confidence, assumptions, rejections, and infeasible UX in `apps/console/app/(workspace)/scenarios/`.
- [x] T061 [P] [US2] Add optional explanation adapter that can only rephrase signed fact input and falls back safely in `packages/optimizer/src/explanations/optional-language-adapter.ts`; test figure/ranking mismatch rejection.
- [x] T062 [US2] Execute `scripts/accept-us2.ps1`; archive snapshots, candidate/verifier results, brute-force parity, added-constraint rerun, infeasible result, and replay hashes under `artifacts/us2/`.

## Phase 5 — US3 Govern and Approve a Proposal

- [x] T063 [P] [US3] Write policy schema and immutable lifecycle tests for network/program allowlist, spend limit, coverage floor, window, separation, approval graph, signer, expiry, and live-write rule in `packages/policy-engine/test/policy.test.ts`.
- [x] T064 [P] [US3] Write policy decision-table tests for `ELIGIBLE`, `APPROVAL_REQUIRED`, and `BLOCKED` with versioned reasons in `packages/policy-engine/test/evaluation.test.ts`.
- [x] T065 [US3] Implement versioned policy and deterministic evaluation in `packages/policy-engine/src/`; ensure policy cannot relax optimization hard constraints.
- [x] T066 [P] [US3] Write proposal canonicalization, material-input hash, immutable version, expiry, and supersession tests in `packages/domain/test/proposals.test.ts`.
- [x] T067 [US3] Implement recommendation-to-proposal creation and versioning in `packages/domain/src/proposals/` and `apps/api/src/routes/proposals.ts`; bind candidate, snapshot, policy, amount, network, program, and effective time.
- [x] T068 [P] [US3] Write ordered/quorum/role/amount/separation/self-approval/expiry authorization tests in `packages/domain/test/approvals.test.ts` and `tests/security/approval-authorization.test.ts`.
- [x] T069 [US3] Implement append-only approval graph, authority snapshots, rationale, notifications, and state transitions in `packages/domain/src/approvals/` and `apps/api/src/routes/approvals.ts`.
- [x] T070 [P] [US3] Write material change invalidation tests for pricing, requirement, policy, amount, network, program, signer, effective date, and expiry in `tests/integration/proposal-invalidation.test.ts`.
- [x] T071 [US3] Implement material-change watcher and automatic approval/envelope invalidation in `apps/workers/src/proposals/invalidate.ts`; preserve prior version evidence.
- [x] T072 [P] [US3] Build policy editor, simulation, review, publication, and effective date UX in `apps/console/app/(workspace)/policies/`; require accessible confirmation.
- [x] T073 [P] [US3] Build frozen proposal, semantic diff, approval graph, authority, rationale, hash, expiry, and audit UX in `apps/console/app/(workspace)/proposals/[id]/`.
- [x] T074 [P] [US3] Implement signed approval-required, rejected, invalidated, and expired webhooks in `apps/workers/src/webhooks/governance.ts`; test HMAC/replay in `tests/contract/governance-webhooks.test.ts`.
- [x] T075 [US3] Execute `scripts/accept-us3.ps1`; archive policy facts, separation denial, ordered approvals, exact proposal hash, material-change invalidation, expiry, and webhook evidence under `artifacts/us3/`.

## Phase 6 — US4 Sign, Observe, Activate, and Verify

- [x] T076 [P] [US4] Write unsigned transaction schema, canonical payload, human-summary parity, amount/network/program/account/instruction allowlist, expiry, and version tests in `packages/transaction-builder/test/builder.test.ts`.
- [x] T077 [US4] Implement versioned unsigned transaction builder and canonical human summary in `packages/transaction-builder/src/`; require final approval and current material hash.
- [x] T078 [P] [US4] Write dependency-graph tests proving `packages/wallet-client/` cannot be imported by API, worker, domain, builder, or adapter packages in `tests/security/browser-wallet-boundary.test.ts`.
- [x] T079 [P] [US4] Write browser wallet tests for rejection, wrong network, account change, tampering, expiry, simulation, devnet, and no secret input in `packages/wallet-client/test/wallet-client.test.ts`.
- [x] T080 [US4] Implement browser-only deterministic demo signer and approved devnet wallet adapter interface in `packages/wallet-client/src/`; export only public signed transaction or simulation receipt.
- [x] T081 [P] [US4] Write prohibited-signing-material request/log/queue/trace/export corpus tests in `tests/security/non-custody-corpus.test.ts`.
- [x] T082 [US4] Apply prohibited-material prefilter, schema rejection, safe errors, and support redaction to all API/file surfaces in `apps/api/src/plugins/prohibited-material.ts` and `packages/observability/src/redaction.ts`; pass T081.
- [x] T083 [P] [US4] Write signed-public-transaction reparse and bound-field mutation tests in `packages/transaction-builder/test/signed-verification.test.ts`, including extra instruction and signer mismatch.
- [x] T084 [US4] Implement signed public transaction verification and idempotent observation creation in `packages/transaction-builder/src/verify-signed.ts` and `apps/api/src/routes/transactions.ts`.
- [x] T085 [P] [US4] Write observation tests for submitted, confirmed, failed, expired, replaced, reorganized, duplicate, callback reorder, and finality in `tests/integration/transaction-observation.test.ts`.
- [x] T086 [US4] Implement deterministic demo/devnet/live observer adapters and operation state in `apps/workers/src/transactions/`; never resubmit automatically.
- [x] T087 [P] [US4] Write activation idempotency, lost callback, confirmed-purchase failure, and no-repurchase tests in `tests/integration/activation.test.ts`.
- [x] T088 [US4] Implement activation operation and manual recovery incident in `apps/workers/src/activation/`; enforce one activation operation per confirmed transaction/proposal.
- [x] T089 [P] [US4] Write entitlement verification tests for subscription, API state, league, fixture, latency, period, network, program, and proposal hash in `packages/entitlement-verifier/test/verifier.test.ts`.
- [x] T090 [US4] Implement versioned entitlement verifier and mismatch reason/evidence in `packages/entitlement-verifier/src/` and `apps/workers/src/entitlements/`.
- [x] T091 [P] [US4] Build accessible transaction review and wallet surface in `apps/console/app/(workspace)/proposals/[id]/sign/`; display every bound field, mode, exact amount, expiry, and no secret input.
- [x] T092 [P] [US4] Build transaction, activation, entitlement timeline and no-repurchase incident UX in `apps/console/app/(workspace)/transactions/[id]/` and `apps/console/app/(workspace)/entitlements/[id]/`.
- [x] T093 [US4] Implement per-tenant live-write enablement evidence, limits, mode isolation, and emergency stop in `packages/domain/src/live-write/` and `apps/api/src/plugins/live-write-gate.ts`.
- [x] T094 [US4] Execute `scripts/accept-us4.ps1` using demo signer and devnet fixture; archive envelope/summary parity, no-secret scan, duplicate operation, confirmation, activation, entitlement, failure, and stop-switch evidence under `artifacts/us4/`.

## Phase 7 — US5 Close Realized Savings and Finance Evidence

- [x] T095 [P] [US5] Write baseline version, period, currency, conversion, tax/credit/proration, and approval tests in `packages/savings-ledger/test/baseline.test.ts`.
- [x] T096 [P] [US5] Write savings state, complete-input watermark, exact delta, verification gate, dispute, close, reversal, and balance property tests in `packages/savings-ledger/test/ledger.test.ts` and `tests/property/savings-ledger.property.test.ts`.
- [x] T097 [US5] Implement approved savings baseline, period state machine, append-only entries, exact calculation, reversal, and content hashes in `packages/savings-ledger/src/`; pass T095–T096.
- [x] T098 [US5] Implement actual spend/credit/conversion import and period completeness reconciliation in `apps/api/src/routes/finance-imports.ts` and `apps/workers/src/savings/reconcile.ts`.
- [x] T099 [P] [US5] Write finance export contract tests for baseline, period, formula, allocation, approvals, entitlement, entries, hashes, redaction, and no raw TxLINE redistribution in `tests/contract/finance-export.test.ts`.
- [x] T100 [US5] Implement content-addressed JSON/CSV/human-readable finance export in `apps/workers/src/exports/finance.ts` and `packages/domain/src/evidence/`; include access audit and expiry.
- [x] T101 [P] [US5] Build savings state, evidence drill-down, dispute, reversal, and close UX in `apps/console/app/(workspace)/savings/`; never style forecast as realized.
- [x] T102 [P] [US5] Build renewal calendar and risk workflows in `apps/console/app/(workspace)/renewals/` and `apps/workers/src/renewals/`; link required snapshot, policy, approvals, and entitlement.
- [x] T103 [US5] Execute `scripts/accept-us5.ps1`; archive verified close replay, incomplete-input block, entitlement mismatch block, credit reversal, export hash, and exact reconciliation under `artifacts/us5/`.

## Phase 8 — US6 Administration and Commercial Hardening

- [x] T104 [P] [US6] Implement enterprise SSO, lifecycle, role/authority review, scoped service accounts, retention, webhooks, and audit search in `apps/console/app/(workspace)/administration/` and `packages/auth/src/enterprise/`.
- [x] T105 [P] [US6] Implement immutable platform meters for workspaces, managed spend, optimizer runs, evidence storage, integrations, and enterprise features in `packages/domain/src/metering/`, `apps/workers/src/metering/`, and `apps/console/app/(workspace)/usage/`.
- [x] T106 [P] [US6] Configure SLO dashboards, alerts, owners, and validated runbook links for sources, optimizer, proposals, transactions, activation, entitlement, savings, modes, and infrastructure in `infrastructure/dashboards/`, `infrastructure/alerts/`, and `infrastructure/runbooks/`.
- [x] T107 [P] [US6] Implement Vercel and Railway deployment manifests, managed secret references, autoscaling, queue drain, optimizer shadow, canary, and live-write default off in `infrastructure/vercel/` and `infrastructure/railway/`.
- [x] T108 [US6] Run migration, backup/restore, queue replay, API/worker/optimizer/builder rollback, transaction reconciliation, and emergency-stop drills using `scripts/release-rehearsal.ps1`; archive RTO/RPO under `artifacts/us6/recovery/`.
- [x] T109 [P] [US6] Run usage-import burst, renewal spike, large supported optimization, tenant fairness, observer fan-out, TxLINE stale, Redis loss, database failover, and activation timeout tests from `tests/load/` and `tests/resilience/`; record capacity under `artifacts/us6/capacity/`.
- [x] T110 [US6] Run `scripts/commercial-acceptance.ps1`, `scripts/quickstart.ps1`, and `video/record-demo.ps1`; check all release lists and archive release manifest, SBOM, solver proof, no-secret report, restore/rollback, video probe, and accountable approvals under `artifacts/commercial-v1/`.

## Dependency Summary

- Phase 1 precedes Phase 2; Phase 2 blocks all stories.
- US1 creates trusted inventory, imports, allocation, and requirements required by US2.
- US2 creates verified recommendations required by US3.
- US3 creates approved proposals required by US4.
- US4 creates entitlement evidence required by US5.
- US6 packages cross-cutting commercial operation and is the production gate.
- Read-only Baseline and Optimize plans can ship without US4 live-write; the Commercial V1 dossier still implements and verifies all six stories.
