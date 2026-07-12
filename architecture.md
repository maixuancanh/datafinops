# DataFinOps Architecture

## Context

DataFinOps connects external TxLINE state and client wallets to tenant business requirements and finance evidence. It is a decision and governance layer, not a wallet, payment custodian, trading system, or raw data reseller.

```text
TxLINE pricing/subscription/fixture/API surfaces
                 │
        Versioned TxLINE Adapter
                 │
usage/revenue -> Snapshot -> Allocation -> Optimizer -> Constraint Verifier
                                                 │
                                   Recommendation/Scenario
                                                 │
                                  Policy -> Proposal -> Approvals
                                                 │
Console browser wallet <── unsigned envelope ────┘
        │ signed public transaction
        v
Observation -> Finality -> API Activation -> Entitlement Verification
                                         │
                         Period Close -> Append-only Savings Ledger
```

## Trust Boundaries

1. **Tenant imports:** untrusted aggregate business input; validate schema, units, periods, and quality.
2. **TxLINE:** external licensed source; verify network/program/host, normalize semantics, monitor freshness, preserve hashes.
3. **Optimizer:** deterministic internal component; still independently verify output.
4. **Browser wallet:** trusted by the user for signing but untrusted to the server; verify signed output against the bound envelope.
5. **APIs/workers:** service identities and scoped database roles; no signing secrets.
6. **Evidence/finance export:** sensitive tenant material; role, purpose, redaction, hash, and audit controls.

## Command and Event Flow

Management commands write a versioned domain record and transactional outbox event. Workers claim deterministic jobs and append results. The UI reads materialized status and immutable evidence. Duplicate import, optimization, approval, submission, observation, activation, verification, and close requests return the original logical operation.

## Optimization Isolation

Optimizer workers accept only a content-addressed snapshot and declared version. They have no TxLINE credentials, wallet adapter, approval mutation permission, or network write capability. Output is canonical JSON. The verifier is a separate package and CI dependency owned by a different review boundary. Expensive jobs have tenant quotas, memory/time limits, cancellation, and resumable status.

## Transaction Boundary

The server generates a typed unsigned envelope after final approval. The console renders a human summary derived from the same canonical fields, then passes it to an allowlisted browser wallet adapter. The server accepts signed public transaction bytes or an observation reference only, re-derives the summary, validates signer/network/program/accounts/instruction/amount/expiry, and records one operation. Private signing fields are absent from contracts and rejected by a general prohibited-secret guard.

## Verification State

`TRANSACTION_CONFIRMED` is not `VERIFIED_ACTIVE`. Verification requires the configured finality, expected subscription row, API activation, entitlement lookup, effective coverage and latency, and proposal hash match. Any disagreement opens an incident and blocks savings close.

## Scaling

- Partition jobs by tenant and job type with fair concurrency.
- Cache read-only normalized pricing by version, never approvals or ledger truth.
- Use PostgreSQL read replicas for audit/report workloads when required.
- Store large evidence exports in object storage with signed, expiring access.
- Scale optimizer workers by declared problem-size class and isolate them from transaction observers.

## Availability and Degradation

| Failure | Safe behavior |
|---|---|
| TxLINE stale or schema unknown | Freeze current evidence; block executable proposals |
| Usage import incomplete | Advisory confidence only; no realized savings |
| Optimizer timeout | Preserve job and snapshot; no partial candidate promoted |
| Policy unavailable | Block proposal progression |
| Wallet unavailable/rejected | Proposal remains approved but unsigned until expiry |
| Confirmation timeout | Observe without resubmitting; open incident at threshold |
| Activation failure | No repurchase; manual recovery incident |
| Entitlement mismatch | Mark verification failed; block finance close |
| Explanation service unavailable | Show deterministic facts without prose enhancement |

## Recovery Targets

- Management and read-only portfolio service: RTO 4 hours, RPO 5 minutes.
- Approval, transaction, entitlement, audit, and savings records: RTO 4 hours, RPO 5 minutes.
- Recomputable optimizer read models: RTO 24 hours from immutable snapshots.
- Live-write can remain disabled during recovery without losing read-only service.

## Required ADRs

Implementation records decisions for solver selection, exact money, wallet adapters, TxLINE network/program semantics, finality, activation, tenant isolation, object storage, migration strategy, and realized-savings methodology. Changing non-custody, hard constraints, approval binding, or realized status requires product, security, finance, and architecture approval.
