# DataFinOps Testing Strategy

## Unit and Property Tests

- Exact money, currency, rounding, period, proration, and allocation reconciliation.
- Requirement versioning, hard/soft classification, effective windows, and conflicts.
- Snapshot canonicalization and hashing under reordered equivalent input.
- Solver candidate generation, objective, tie-breaks, and infeasibility.
- Independent hard-constraint verifier.
- Policy, approval graph, authority, separation of duties, expiry, and invalidation.
- Transaction canonicalization, summary, allowlist, expiry, signer, and operation keys.
- Entitlement and savings state machines, complete-input watermark, reversal, and close.

Primary properties:

1. Every promoted candidate satisfies every hard constraint.
2. For bounded generated portfolios, selected cost/objective equals brute-force truth.
3. Equivalent canonical snapshots produce identical run/candidate hashes.
4. Any material proposal change invalidates every prior approval and envelope.
5. Retry/reorder produces at most one logical transaction and activation.
6. Realized savings equals exact approved-baseline minus actual eligible cost under the versioned formula, or remains unrealized.
7. Reversals preserve ledger balance and never mutate prior entries.

## Golden and Mutation Tests

Golden portfolios cover over-provisioning, required league, latency floor, fixture-only need, effective-date boundary, equal-cost tie, budget conflict, no valid configuration, incomplete usage, current-entitlement mismatch, and change-minimization. Mutations remove requirements, alter amount/network/program, corrupt pricing, reorder approvals, duplicate callbacks, and change entitlement.

## Contract and Integration Tests

Validate OpenAPI, AsyncAPI, snapshot schema, transaction proposal schema, webhook signatures, generated clients, and breaking changes. Testcontainers exercises PostgreSQL, Redis, object storage, outbox, queue retry, connection verification, imports, optimizer jobs, approval, demo/devnet wallet, transaction observation, activation, entitlement, exports, metering, and restore.

## Security Tests

- Private-key/seed/mnemonic/keystore corpus across headers, JSON, CSV, files, errors, logs, queues, traces, exports, and support views.
- Tenant/environment/role/direct-ID/list/export/job isolation.
- Proposal and transaction tampering, extra instructions, wrong network/program/account/signer, expiry, replay, and limit overflow.
- Browser-only wallet package dependency boundary.
- Secret, SBOM, provenance, dependency, container, and object-access scans.

## Browser and Accessibility Tests

Playwright covers connection, baseline, import, requirements, scenarios, infeasibility, proposal, ordered approvals, wallet rejection, demo signing, confirmation, activation failure, entitlement mismatch, savings close, reversal, and audit. Run axe plus keyboard, focus, zoom, screen-reader, table/diff/timeline, and reduced-motion validation. Mode and network are never color-only.

## Load and Resilience Tests

k6 and worker harnesses model usage-import bursts, renewal-period portfolio runs, fair tenant scheduling, large supported problem size, transaction observation fan-out, TxLINE stale data, Redis loss, database failover, activation timeout, duplicate callbacks, and explanation-service failure.

## Required Gates

| Gate         | Standard                                                                  |
| ------------ | ------------------------------------------------------------------------- |
| Solver       | Bounded brute-force parity and zero independent-verifier failure          |
| Money/ledger | Exact arithmetic and 100% branch coverage for realized/reversal paths     |
| Non-custody  | Zero prohibited secret in corpus scans and no server wallet dependency    |
| Governance   | All role, authority, separation, expiry, and invalidation negatives green |
| Transaction  | Bound-field mutation and duplicate/fault suites green                     |
| Entitlement  | Confirmation, activation, mismatch, and no-repurchase paths green         |
| Contracts    | Valid/generated and no unapproved breaking change                         |
| Load         | Contracted optimizer and API thresholds with capacity margin              |
| Recovery     | Restore, queue replay, rollback, and live-write stop exercised            |

## Test Data and Evidence

Repository fixtures are synthetic and use unfunded public references. No production usage, revenue, credential, wallet, or TxLINE payload is copied into CI. Release evidence includes property seeds, brute-force comparison, golden hashes, contract diff, coverage, security corpus report, SBOM, load results, Playwright traces, restore/rollback proof, demo report, and FFprobe output linked to the release commit.
