# DataFinOps Commercial V1 Product Specification

**Status:** Ready for implementation planning

**Approved scope:** Independent multitenant SaaS, Commercial V1

**Primary buyer:** Procurement, product/trading operations, and finance teams buying TxLINE data

**Vendor scope:** TxLINE only

**Date:** 2026-07-11

## Product Outcome

DataFinOps lets a customer establish a verified TxLINE cost and entitlement baseline, state product coverage and latency requirements, compute the least-cost valid configuration with reproducible evidence, govern any change through policy and human approvals, sign client-side, verify effective entitlement, and reconcile realized savings without surrendering wallet custody.

## Problem Statement

Sports products commonly manage data procurement through spreadsheets and disconnected wallet, schedule, usage, and finance views. They may pay for unused league coverage or latency while risking under-provisioning a product that needs a specific fixture or service level. A recommendation is not operationally safe unless its inputs, hard constraints, approval state, transaction semantics, activation, and eventual cost result are all reproducible.

## Goals

1. Verify pricing, subscription, network, program, league, latency, and API entitlement state.
2. Attribute current spend to tenant-defined products, leagues, cost centers, and customer segments.
3. Capture versioned hard coverage, latency, schedule, effective-date, and budget requirements.
4. Generate deterministic valid candidates and rejection reasons from immutable snapshots.
5. Explain cost, coverage, confidence, tradeoffs, and changed inputs without altering computed facts.
6. Enforce policy, separation of duties, quorum/order, amount limits, and approval expiry.
7. Build reviewable unsigned transaction proposals and sign only in an authorized client wallet.
8. Verify transaction finality, subscription state, API activation, and effective coverage.
9. Distinguish forecast, approved, pending, realized, disputed, and reversed savings.
10. Operate as a secure multitenant commercial platform with audit, SSO, billing, support, and recovery.

## Non-Goals

- Holding funds, private keys, seed phrases, signing authority, or a custodial wallet.
- Automatically buying, renewing, upgrading, or downgrading without explicit authorized signing.
- Supporting non-TxLINE vendors in Commercial V1.
- Placing bets, pricing markets, managing exposure, or making trading decisions.
- Negotiating vendor contracts or replacing accounting, procurement, wallet, or ERP systems of record.
- Redistributing raw TxLINE data or reconstructing a competing feed.
- Claiming realized savings from forecasts, unsigned proposals, unverified activation, or incomplete periods.
- Using a language model to choose candidates, change figures, or override constraints.

## Personas

- **Procurement lead:** owns subscription strategy, scenarios, proposals, and renewal planning.
- **Product or trading operations manager:** defines product, league, fixture, and latency requirements.
- **Finance manager:** defines budgets, allocation rules, baselines, approval limits, and period close.
- **Authorized signer:** reviews an approved transaction summary and signs client-side.
- **Auditor:** reads snapshots, optimizer evidence, policy decisions, approvals, transaction observations, entitlement verification, and savings entries.
- **Tenant administrator:** manages connections, roles, SSO, environments, billing, retention, integrations, and secrets.
- **Service account:** imports aggregate usage/revenue under narrow scope; cannot approve or sign.

## User Stories and Acceptance Scenarios

### US1 — Connect and establish a verified baseline (P1)

As a procurement lead, I can connect read-only TxLINE and wallet references, import aggregate usage/revenue, map products to requirements, and see a verified current subscription and entitlement baseline.

**Independent value:** A buyer gains trustworthy inventory and allocation without enabling recommendations or writes.

**Acceptance scenarios:**

1. Given correct network, program, API host, wallet reference, and entitlement, when baseline verification runs, then pricing, subscriptions, coverage, activation, freshness, and hashes are recorded.
2. Given network, program, host, or entitlement mismatch, when verification runs, then the connection is blocked with nondestructive remediation.
3. Given duplicate aggregate usage import, when submitted with the same idempotency key, then one logical import is recorded.
4. Given unmapped or unallocated cost, when allocation runs, then it remains visibly unallocated rather than being hidden.

### US2 — Compute a least-cost valid configuration (P1)

As a procurement lead, I can select a planning period, freeze all relevant inputs, run an optimizer, and compare valid candidates with rejected alternatives and confidence.

**Independent value:** A customer can use advisory recommendations permanently without transaction capability.

**Acceptance scenarios:**

1. Given complete pricing, subscription, fixture, usage, and hard requirements, when optimization runs, then every candidate satisfies every hard constraint and the selected candidate minimizes the declared objective.
2. Given an added hard league or latency constraint, when a new run starts, then a new snapshot and recommendation reflect it without mutating the prior run.
3. Given no valid configuration, when optimization completes, then the result is `INFEASIBLE` with a minimal explainable conflict set and no proposal.
4. Given incomplete usage but complete coverage requirements, when advisory mode runs, then confidence is reduced and realized savings remains unavailable.
5. Given identical snapshot and optimizer version, when replayed, then candidate ordering and hashes match.

### US3 — Govern and approve a proposal (P1)

As a finance manager, I can review an immutable proposal under policy, provide an approval within my authority, and know that material input changes invalidate prior approvals.

**Independent value:** The customer can formalize procurement governance even if execution happens outside DataFinOps.

**Acceptance scenarios:**

1. Given an allowed recommendation, when policy evaluates it, then the result is `ELIGIBLE`, `APPROVAL_REQUIRED`, or `BLOCKED` with versioned reasons.
2. Given separation-of-duties policy, when the proposer attempts to satisfy an independent approval, then it is denied.
3. Given ordered or quorum approvals, when authorized reviewers act, then the exact proposal hash advances only after required approval conditions are satisfied.
4. Given a material price, requirement, policy, network, amount, or effective-date change, when detected, then a new proposal version is created and all earlier approvals expire.
5. Given an expired proposal, when approval or signing is attempted, then the action is rejected.

### US4 — Sign, observe, activate, and verify (P1)

As an authorized signer, I can inspect an approved human-readable transaction summary, sign the bound payload in my client wallet, and see transaction plus entitlement verification without DataFinOps receiving my key.

**Independent value:** A design partner can prove a complete governed devnet or signer-simulation flow.

**Acceptance scenarios:**

1. Given final approval, when the transaction builder runs, then the unsigned envelope binds network, program, accounts, instruction, amount, pricing snapshot, proposal hash, and expiry.
2. Given a request containing a private key or seed phrase, when any API receives it, then validation rejects it and redaction prevents persistence.
3. Given client-side signing, when the signer changes any bound field or the envelope expires, then submission is rejected.
4. Given duplicate submission or callback, when observed, then one logical operation and activation attempt remain.
5. Given confirmed transaction but API activation failure, when verification runs, then an incident opens and no second purchase occurs.
6. Given transaction, subscription, and API entitlement all match, when verification completes, then the proposal becomes `VERIFIED_ACTIVE`.

### US5 — Close realized savings and finance evidence (P2)

As a finance manager, I can close a period against an approved baseline and see forecast, pending, realized, disputed, and reversed entries with calculation evidence.

**Independent value:** Finance can audit economic value independently of the optimizer screen.

**Acceptance scenarios:**

1. Given an effective verified entitlement and complete period spend, when the period closes, then realized savings equals the reproducible approved-baseline delta.
2. Given incomplete invoices, entitlement mismatch, unallocated cost, or open dispute, when close runs, then realized savings is blocked or qualified.
3. Given refund, reorganization, or pricing correction, when reconciled, then a reversing entry is appended rather than history mutated.
4. Given a finance export, when generated, then it includes snapshot, baseline, period, formulas, approvals, verification, and entry hashes without raw TxLINE redistribution.

### US6 — Administer and operate the commercial service (P3)

As a tenant administrator, I can manage roles, SSO, connections, policies, retention, integrations, usage, billing, audit, support, and live-write enablement.

**Independent value:** DataFinOps can operate safely across paying tenants.

**Acceptance scenarios:**

1. Given a service account, when it attempts approval, signing, secrets access, or policy change, then authorization is denied and audited.
2. Given live-write disabled, when an otherwise valid production proposal reaches signing, then the platform remains read-only.
3. Given tenant usage, when metering closes, then the statement reconciles to immutable managed-spend and feature meters.
4. Given a restore or rollback drill, when executed, then proposal, approval, transaction, activation, and savings histories remain consistent.

## Functional Requirements

- **FR-001:** Register organizations, workspaces, environments, users, roles, service accounts, and billing plans.
- **FR-002:** Configure TxLINE network, program, API host, wallet reference, credentials, mode, and expected entitlement without storing signing material.
- **FR-003:** Verify connection network, program, host, pricing, subscription, activation, entitlement, freshness, and source hashes.
- **FR-004:** Normalize versioned pricing tiers, bundles, leagues, latency classes, effective periods, and subscription state.
- **FR-005:** Ingest supported upcoming fixture schedules and map them to tenant planning periods.
- **FR-006:** Import tenant-owned aggregate usage and revenue with schemas, idempotency, validation, and quality scoring.
- **FR-007:** Define products, cost centers, leagues, fixtures, customer segments, and versioned allocation rules.
- **FR-008:** Surface unallocated, stale, missing, and conflicting data explicitly.
- **FR-009:** Define versioned hard coverage, fixture, latency, region, effective-date, budget, and blackout requirements.
- **FR-010:** Define soft preferences including headroom, change minimization, and confidence penalties without weakening hard constraints.
- **FR-011:** Freeze pricing, subscriptions, entitlements, fixtures, usage, revenue, requirements, allocation, policy, network, and optimizer version into an immutable snapshot.
- **FR-012:** Hash source artifacts and snapshot canonical form for replay and approval binding.
- **FR-013:** Enumerate or solve for valid configurations and record rejection reasons for invalid candidates.
- **FR-014:** Guarantee every returned candidate satisfies all hard constraints.
- **FR-015:** Select and rank candidates by a versioned deterministic objective and stable tie-break rules.
- **FR-016:** Return `INFEASIBLE` with an explainable conflict set when no configuration is valid.
- **FR-017:** Calculate current cost, proposed cost, forecast delta, coverage changes, confidence, and assumption warnings.
- **FR-018:** Replay an optimizer run from preserved snapshot and version.
- **FR-019:** Create immutable recommendations and proposal versions linked to exact candidate and snapshot hashes.
- **FR-020:** Evaluate policy for spending limit, coverage, allowed network/program, effective window, signer allowlist, separation of duties, and approval rules.
- **FR-021:** Support ordered, quorum, role, amount, and expiry-based approvals with rationale and audit.
- **FR-022:** Invalidate approvals and signatures after any material bound input change.
- **FR-023:** Produce an unsigned transaction envelope and human-readable summary after final approval only.
- **FR-024:** Reject private keys, seed phrases, raw signing secrets, and server-side signing requests at every boundary.
- **FR-025:** Support client-side demo signer, devnet wallet adapter, and approved live wallet adapters behind explicit mode controls.
- **FR-026:** Bind transaction proposal to network, program, accounts, instructions, amount, block/expiry, snapshot, proposal, and operation key.
- **FR-027:** Submit or observe a signed transaction idempotently without ever receiving private signing material.
- **FR-028:** Track transaction lifecycle, finality, failure, expiry, replacement, and canonical receipt.
- **FR-029:** Activate required API entitlement idempotently and never repurchase after activation failure.
- **FR-030:** Verify on-chain subscription, API entitlement, effective coverage, latency class, and proposal match.
- **FR-031:** Open incidents for confirmation timeout, activation failure, entitlement mismatch, drift, and renewal risk.
- **FR-032:** Maintain append-only savings baseline, forecast, approved, pending, realized, disputed, reversed, and closed states.
- **FR-033:** Reconcile realized savings to complete period spend, effective dates, verified entitlement, allocation, and approved baseline.
- **FR-034:** Export permitted JSON, CSV, and human-readable evidence with hashes and redaction.
- **FR-035:** Provide renewal calendar, operational health, audit search, webhooks, SSO, retention, metering, and billing.
- **FR-036:** Separate sandbox, devnet, live-read, and live-write credentials, state, UI, APIs, policies, and enablement.

## Non-Functional Requirements

- **NFR-001:** 100% of returned executable candidates satisfy every hard constraint.
- **NFR-002:** Identical canonical snapshot and optimizer version produce identical candidate ordering and hashes.
- **NFR-003:** Zero private keys or seed phrases enter persistent storage, logs, traces, events, exports, or support tools.
- **NFR-004:** All money uses explicit currency and integer minor units or exact decimal representation; no binary floating point.
- **NFR-005:** All material price, requirement, policy, approval, transaction, entitlement, and savings objects are versioned and auditable.
- **NFR-006:** Monthly management API availability is at least 99.9% for contracted production plans.
- **NFR-007:** The p95 normal portfolio optimization completes within 60 seconds for the contracted problem size; long runs are resumable jobs.
- **NFR-008:** Transaction observation and activation processing are at-least-once transport with exactly-once logical operation semantics.
- **NFR-009:** Tenant and environment isolation is enforced at application and repository/database layers.
- **NFR-010:** Secrets, credentials, wallet metadata beyond public references, and restricted source data are redacted.
- **NFR-011:** Core procurement, approval, signing review, and audit workflows conform to WCAG 2.2 AA.
- **NFR-012:** Contracts are versioned and backward compatible across the declared support window.
- **NFR-013:** Durable financial and audit state meets documented RTO, RPO, backup, and restore targets.
- **NFR-014:** The service provides freshness, lineage, confidence, constraint, policy, and verification observability.
- **NFR-015:** Live-write is fail-closed and disabled per tenant until every enablement gate is satisfied.

## Domain Rules and Invariants

1. Hard constraints cannot be relaxed by soft preferences, policy exceptions, explanation text, or a language model.
2. A recommendation is tied to one immutable snapshot and optimizer version.
3. Any material input change produces a new proposal version and invalidates approval/signature state.
4. Proposer, required independent approver, and signer duties follow the configured separation policy.
5. No server endpoint accepts or derives private signing material.
6. Transaction confirmation and API entitlement activation are separate facts.
7. Activation failure after confirmed purchase never triggers automatic repurchase.
8. A savings entry cannot become realized without verified entitlement and complete approved close inputs.
9. Corrections append reversing or adjusting ledger entries; historical entries are immutable.
10. Raw licensed TxLINE data is not exposed through customer exports.

## Edge Cases

- Pricing changes while an optimizer run, approval, or wallet review is open.
- Fixture reschedule crosses subscription or billing periods.
- Two tiers have equal cost but different change count or headroom.
- Usage import is duplicated, late, partial, in a different currency, or mapped to retired products.
- Current entitlement disagrees between on-chain and API surfaces.
- Wallet is on the wrong network or connected account changes mid-review.
- Transaction is submitted twice, replaced, expires, confirms after timeout, or is reorganized.
- Transaction confirms but activation callback is lost or returns a conflicting tier.
- Requirement changes after one of several ordered approvals.
- Savings period includes refund, credit, proration, tax, currency conversion, or allocation correction.
- One tenant's large portfolio cannot starve another tenant's optimizer jobs.
- An optional explanation service is unavailable or produces text inconsistent with computed facts.

## Success Criteria

- **SC-001:** Every returned candidate passes an independent hard-constraint verifier.
- **SC-002:** Every optimizer, policy, approval, transaction, verification, and savings decision is replayable from preserved versions and hashes.
- **SC-003:** Zero private signing secrets appear in automated corpus scans of APIs, storage, logs, traces, queues, exports, or support artifacts.
- **SC-004:** Duplicate transaction and activation events create one logical operation and at most one activation attempt per operation key.
- **SC-005:** Every `VERIFIED_ACTIVE` proposal matches network, program, subscription, API entitlement, coverage, latency, and effective period.
- **SC-006:** Every realized savings entry reconciles to an approved baseline, actual period cost, effective entitlement, allocation version, and evidence hash.
- **SC-007:** A design partner reaches verified read-only baseline within one business day after supplying mappings and access.
- **SC-008:** A new authorized reviewer can explain selected and rejected candidates without engineering assistance.
- **SC-009:** Infeasible scenarios identify actionable conflicting requirements rather than returning a misleading candidate.
- **SC-010:** Live-write cannot be enabled without named policy, approver, signer, network, program, entitlement, security, and operational evidence.
- **SC-011:** Tenant-visible platform meters reconcile to billing and managed-spend statements.
- **SC-012:** The deterministic demo completes in 270 seconds or less with synthetic financial data and no funded wallet or production write.

## Assumptions and Dependencies

- The customer has authorized TxLINE subscription and entitlement access for its own organization.
- TxLINE exposes or documents the pricing, subscription, activation, entitlement, fixture, and verification surfaces required by the chosen mode.
- The tenant supplies aggregate usage, revenue, requirements, accounting periods, and approved allocation policy.
- An authorized client wallet or signer simulation is available for the execution phase.
- Customer contracts define currencies, taxes, credits, regions, retention, support, RTO/RPO, and savings methodology.

## Release Gates

Commercial production requires green contract, optimizer property/golden, policy, authorization, non-custody, transaction, activation, entitlement, ledger, load, security, restore, rollback, and accessibility evidence. Live-write additionally requires tenant-specific legal, TxLINE, network, program, wallet, approval, signer, limit, incident, and rollback approval.
