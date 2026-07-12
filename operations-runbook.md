# DataFinOps Operations Runbook

## Dashboards

- TxLINE connection/network/program/API host verification and source freshness.
- Pricing, subscription, fixture, activation, and entitlement ingestion lag/schema drift.
- Import quality, unallocated cost, mapping completeness, and currency consistency.
- Snapshot, optimizer duration, problem size, infeasible rate, verifier disagreements, and tenant fairness.
- Policy outcomes, proposal age, approval bottleneck, expiry, invalidation, and separation violations.
- Signing envelope issuance, wallet rejection, observation, finality, replacement, and timeout.
- Activation attempts, no-repurchase guard, entitlement match, and renewal risk.
- Savings input watermark, close status, disputes, reversals, export, metering, and billing reconciliation.
- Live-write enabled tenants, transaction limits, emergency stop, secrets, queues, databases, storage, and cost.

## Alert Ownership

| Alert | Severity | First owner | Immediate action |
|---|---|---|---|
| Signing material detected | SEV-1 | Security | Stop affected ingestion, restrict evidence, investigate |
| Unauthorized or wrong-bound transaction | SEV-1 | Security + Platform | Disable live-write and builder |
| Cross-tenant finance access | SEV-1 | Security | Isolate service and revoke access |
| Optimizer/verifier disagreement | SEV-1/2 | Optimization | Disable recommendations from version |
| Confirmed purchase, activation failed | SEV-2 | Integrations | Preserve no-repurchase guard, open recovery |
| Entitlement mismatch | SEV-2 | Integrations + Procurement | Block savings/renewal action |
| Transaction observation backlog | SEV-2 | Platform | Scale observer; never resubmit blindly |
| Pricing or fixture stale | SEV-2/3 | Data Integration | Block executable proposals |
| Ledger reconciliation failure | SEV-2 | Finance Engineering | Stop close/export for affected period |
| Optimizer queue or tenant fairness breach | SEV-3 | Platform | Rebalance bounded workers |

## Incident Sequence

1. Acknowledge, assign incident commander, and identify tenant, workspace, environment, mode, network, program, versions, and time.
2. Disable live-write, envelope creation, proposals, recommendations, or period close according to the affected invariant.
3. Preserve immutable hashes, audit, source freshness, outbox, queue, observation, and limited evidence.
4. Reconcile public network state independently; never resubmit or repurchase to “fix” uncertainty.
5. Mitigate with credential rotation, job pause, adapter disablement, version rollback, or read-only mode.
6. Re-run constraint, proposal, transaction, entitlement, and ledger verification before restoration.
7. Communicate under contractual, legal, finance, security, and TxLINE obligations.
8. Append correction/reversal records where required and publish a post-incident review.

## Common Procedures

### Pricing or Schema Drift

Mark the source version unknown/stale, block new executable proposals, keep prior evidence immutable, inspect adapter schema differences, implement a versioned mapping, replay the golden corpus, and re-verify affected snapshots before enabling.

### Optimizer/Verifier Disagreement

Quarantine the optimizer version and its recommendations, preserve snapshots and outputs, reproduce with the exact version, compare to brute-force bounded truth, fix through test-first review, and issue new recommendations rather than mutating prior evidence.

### Transaction Timeout

Continue observing the same public transaction/operation key to the declared finality window. Do not generate a replacement unless tenant policy, network semantics, and an explicit new approved proposal permit it. Record replacement lineage.

### Activation Failure

Confirm transaction finality and expected subscription state, activate using the same operation key where safe, contact TxLINE support with permitted evidence, and keep the no-repurchase guard. Savings remains pending or blocked.

### Entitlement Mismatch

Compare network, program, wallet public reference, subscription, API credential, league, latency, and effective time. Disable dependent product action, open a procurement incident, and require successful verification before close.

### Savings Reconciliation Failure

Freeze period close and finance export, verify baseline version, actual spend, credits, tax/conversion, allocation, effective entitlement, and formula. Append a correction or reversal; never edit a closed entry.

## Routine Cadence

- Daily: source freshness, verifier agreement, proposal/transaction/activation backlog, entitlement mismatch, live-write roster.
- Weekly: import quality, unallocated cost, renewal risk, approval age, incidents, capacity, secrets and access anomalies.
- Monthly: access/authority review, usage/billing reconciliation, savings close review, SLO and vulnerability report.
- Quarterly: backup restore, transaction/activation game day, live-write emergency stop, wallet/network review, runbook exercise.
- Annually: penetration test, threat model, finance methodology review, disaster recovery, TxLINE contract/rights review.
