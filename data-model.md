# DataFinOps Data Model

## Modeling Rules

- Every tenant object carries organization, workspace, and environment scope.
- All business configuration is versioned; approvals bind immutable hashes.
- Monetary values use currency plus integer minor units or exact declared decimals.
- Source, calculation, approval, transaction, verification, audit, and ledger records are append-only.
- Public wallet addresses are references; private signing material has no entity or column.
- Each external or asynchronous operation has a unique deterministic operation key.

## Tenancy and Identity

### Organization, Workspace, Environment

Plan, billing reference, base currency, accounting calendar, mode (`SANDBOX`, `DEVNET`, `LIVE_READ`, `LIVE_WRITE`), region, retention, and live-write enablement state.

### User, Role, Membership, ServiceAccount

Identity-provider subject, scopes, approval authority, amount limit, wallet signer reference, MFA/SSO posture, lifecycle, and audit metadata. Service accounts cannot receive approval or signing scopes.

## TxLINE and Inventory

### TxlineConnection and ConnectionVersion

Network, program ID, API host, encrypted read credential reference, wallet public reference, mode, adapter version, expected chain/cluster, status, verification time, and canonical hash.

### PricingSnapshot and PricingItem

Source version, retrieved/effective times, network/program, currency, tier/bundle/league/latency dimensions, exact price, billing period, permitted source reference, freshness, and content hash.

### Subscription and SubscriptionVersion

External identity, wallet reference, selected items, start/end/effective state, paid amount, transaction reference, source version, observed time, and hash.

### Entitlement and EntitlementVerification

API credential reference, league/fixture/latency/endpoint coverage, activation state, on-chain state, observed time, verifier version, proposal match, status, reason codes, and evidence hash.

### FixtureScheduleVersion

Competition, fixture reference, scheduled/effective times, status, source version, planning periods, and hash.

## Tenant Business Inputs

### Product and CostCenter

Tenant product identity, owner, lifecycle, base currency, and allowed allocation dimensions.

### UsageImport and UsageAggregate

Import identity, schema version, period, product/league/endpoint/latency dimensions, request/record counts, quality, source reference, row hash, and ingestion state. Raw bets or customer-level records are prohibited.

### RevenueImport and RevenueAggregate

Optional aggregate revenue contribution using exact currency values, declared method, period, dimension, quality, and hash.

### AllocationRuleVersion and AllocationResult

Priority-ordered matching rules, weights, rounding, effective period, input hash, allocated rows, explicit unallocated row, and reconciliation total.

### RequirementSet and RequirementVersion

Planning period plus hard/soft requirement rows for products, leagues, fixtures, latency, regions, effective dates, blackout windows, budget, headroom, confidence, and change preferences. Each row declares hardness and source owner.

## Optimization

### OptimizationSnapshot

Immutable manifest linking exact pricing, subscriptions, entitlements, fixtures, usage, revenue, allocation, requirements, policy, network, currency, clock, and optimizer version plus source hashes.

### OptimizationRun

Snapshot, algorithm version, state, declared objective, problem size, seed if any, started/completed times, resource metrics, and output hash.

### CandidateConfiguration

Canonical selected pricing items, coverage, latency, effective dates, exact projected cost, change count, headroom, objective components, satisfied constraints, rejection state, rank, and hash.

### ConstraintEvaluation

Candidate, independent verifier version, requirement row, outcome, computed values, reason, and evidence.

### Recommendation

Selected candidate, baseline candidate, current/proposed cost, forecast delta, confidence, assumptions, rejected alternatives, infeasibility conflict set, status, and immutable hash.

## Governance and Execution

### Policy and PolicyVersion

Network/program allowlists, budget/amount limits, coverage floors, change windows, proposer/approver/signer separation, approval graph, expiry, live-write rules, effective period, version, and hash.

### Proposal and ProposalVersion

Recommendation/candidate/snapshot/policy references, exact commercial summary, proposer, state, material-input hash, expiry, effective date, and canonical proposal hash.

### Approval

Proposal version/hash, actor, role, authority snapshot, decision, rationale, signed time, expiry, sequence/quorum position, and audit reference. Approval records are never updated.

### SigningEnvelope

Unsigned envelope ID, proposal/snapshot hashes, network, program, accounts, instruction discriminator, canonical payload, amount/currency, block/nonce, expiry, human-summary hash, builder version, and operation key. No secret field exists.

### TransactionObservation

Operation key, signed public transaction hash/reference, expected/observed signer, network/program, state, finality, block/slot, error, replacement lineage, first/last observed time, and receipt hash.

### ActivationAttempt

Operation key, confirmed transaction, entitlement target, attempt number, request/response hashes, state, acknowledgment, and no-repurchase guard.

### VerificationRecord

Proposal, transaction, subscription, activation, API entitlement, effective coverage, latency, verifier version, status, reason codes, verified time, and evidence hash.

## Finance and Operations

### SavingsBaseline and BaselineVersion

Approved comparison configuration, accounting period, exact expected cost, currency/conversion policy, allocation, approvers, effective time, and hash.

### SavingsPeriod and SavingsEntry

Period state, complete-input watermark, entry type (`FORECAST`, `APPROVED`, `PENDING`, `REALIZED`, `DISPUTED`, `REVERSAL`), exact amount, baseline, actual cost, entitlement verification, allocation, formula version, source entries, reason, and hash.

### FinanceExport

Period, requested format, content hash, object reference, redaction policy, generated time, and access audit.

### Renewal, Incident, WebhookDelivery, AuditEvent, EvidenceBundle, UsageMeter

Renewal window/risk, operational mismatch, signed event delivery, append-only actor/action/purpose, content-addressed evidence, and immutable commercial meters.

## Key Constraints

- Unique normalized price row per source snapshot and canonical tier/bundle/latency/effective key.
- Unique import row per workspace, source, period, and idempotency key.
- Allocation output sum plus unallocated equals imported total exactly.
- Optimization snapshot and proposal canonical hashes are immutable and unique.
- Every promoted candidate has `constraint_verification_status = PASSED`.
- Approval proposal hash must equal current proposal version hash and be unexpired.
- Unique transaction operation, activation operation, and savings close operation per tenant operation key.
- `LIVE_WRITE` requires a checked enablement record and cannot inherit from `LIVE_READ`.
- A `REALIZED` entry requires a successful verification record and complete period watermark.
- Private-key, seed, mnemonic, keystore, or raw signer columns are forbidden by migration lint.

## State Machines

```text
Connection: DRAFT -> VERIFYING -> VERIFIED_READ | BLOCKED -> DISABLED
OptimizationRun: QUEUED -> SNAPSHOTTED -> SOLVING -> VERIFYING -> COMPLETE | INFEASIBLE | FAILED
ProposalVersion: DRAFT -> POLICY_CHECK -> BLOCKED | AWAITING_APPROVAL -> APPROVED -> EXPIRED | INVALIDATED | READY_TO_SIGN
SigningEnvelope: CREATED -> PRESENTED -> SIGNED_PUBLIC -> EXPIRED | REJECTED
Transaction: OBSERVING -> SUBMITTED -> CONFIRMED | FAILED | EXPIRED | REPLACED
Verification: PENDING -> TRANSACTION_CONFIRMED -> ACTIVATING -> VERIFIED_ACTIVE | ACTIVATION_FAILED | ENTITLEMENT_MISMATCH
SavingsPeriod: OPEN -> INPUTS_COMPLETE -> RECONCILING -> CLOSED | DISPUTED
```

## Retention

Pricing/snapshot/proposal/approval/transaction/verification/audit and finance records default to seven years or contract policy. Raw licensed source payloads use the minimum permitted retention and are excluded from exports. Temporary solver files and unsigned envelopes expire promptly. Demo state is synthetic and resettable. Deletion and legal-hold behavior is contract and jurisdiction specific, but immutable financial evidence is never silently mutated.
