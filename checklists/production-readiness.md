# DataFinOps Production Readiness Checklist

Check only with current, dated implementation and environment evidence.

## Source and Customer Inputs

- [ ] TxLINE production rights, network, program, API host, pricing, subscription, activation, entitlement, retention, and support semantics are approved.
- [ ] Product, league, fixture, latency, effective-date, blackout, budget, and allocation owners have approved current versions.
- [ ] Usage/revenue quality and unallocated cost meet the contracted decision threshold.
- [ ] Currency, tax, proration, credit, refund, and savings methodology are finance-approved.

## Correctness and Governance

- [ ] Optimizer golden/property/brute-force parity and independent verifier gates are green.
- [ ] Infeasible and stale-input paths block executable proposals.
- [ ] Policy, separation, role/amount authority, order/quorum, expiry, and invalidation tests are green.
- [ ] Exact proposal/approval/envelope hashes replay from immutable evidence.
- [ ] Accessibility review covers requirements, scenarios, approval, signing summary, verification, and savings.

## Non-Custody and Execution

- [ ] Prohibited-signing-material corpus and artifact scans report zero exposure.
- [ ] Server dependency graph contains no wallet client or signing implementation.
- [ ] Bound transaction field, extra-instruction, wrong network/program/account/signer, expiry, and replay tests are green.
- [ ] Duplicate transaction/activation and no-repurchase paths are green.
- [ ] Transaction finality, subscription, activation, API entitlement, coverage, latency, and proposal verification are exercised.

## Platform and Operations

- [ ] Tenant, environment, mode, role, direct-ID, list, export, and background-job isolation are green.
- [ ] Migration, backup/restore, queue replay, rollback, optimizer shadow, and emergency stop are exercised.
- [ ] Source, optimizer, proposal, transaction, activation, entitlement, savings, and infrastructure SLO/alerts link to owned runbooks.
- [ ] Load, renewal spike, tenant fairness, dependency loss, and capacity evidence meets contract.
- [ ] Metering and billing statements reconcile to immutable platform usage.
- [ ] SBOM, provenance, vulnerability, penetration, threat-model, and risk decisions are approved.

## Live-Write Enablement

- [ ] Tenant has explicitly selected live-write rather than inheriting it from read-only mode.
- [ ] Named network, program, accounts, wallet adapters, signers, limits, policy, approvers, expiry, and emergency authority are approved.
- [ ] Devnet rehearsal and tenant-specific production preflight are green.
- [ ] Incident communication, TxLINE escalation, transaction recovery, and rollback paths are staffed.
- [ ] Final accountable approval enables only the contracted tenant and environment.
