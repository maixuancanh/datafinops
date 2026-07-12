# DataFinOps Requirement Quality Checklist

**Purpose:** Test the written requirements for completeness, precision, consistency, and implementation neutrality.

**Status:** Passed during dossier authoring on 2026-07-11; implementation evidence remains unchecked elsewhere.

## Product and Scope

- [x] Buyer, users, procurement problem, and commercial value are explicit.
- [x] TxLINE-only Commercial V1 and read-only commercial mode are explicit.
- [x] Wallet custody, betting, multi-vendor, accounting-system replacement, and automatic renewal are excluded.
- [x] User stories are independently valuable with Given/When/Then-level acceptance.
- [x] The dossier does not imply deployed software, funded execution, or achieved savings.

## Optimization and Governance

- [x] Every optimization input and version required for replay is named.
- [x] Hard and soft constraints cannot be confused or silently relaxed.
- [x] Determinism, independent verification, tie-breaks, infeasibility, and confidence are specified.
- [x] Unallocated, missing, stale, and conflicting input remains visible.
- [x] Policy results, authority, separation, approval order/quorum, expiry, and invalidation are defined.
- [x] Material input changes require a new proposal version.

## Non-Custody and Verification

- [x] Private signing material is absent and explicitly prohibited at every boundary.
- [x] Unsigned envelope fields and human-summary binding are specified.
- [x] Client signing, signed-public verification, duplicate handling, and no automatic retry are defined.
- [x] Transaction finality, activation, API entitlement, and effective coverage are separate facts.
- [x] Activation failure cannot cause automatic repurchase.

## Finance and Commercial Operations

- [x] Exact money, currency, period, allocation, and source behavior are requirements.
- [x] Forecast, approved, pending, realized, disputed, reversal, and close states are distinct.
- [x] Realized savings requires verified entitlement and complete approved inputs.
- [x] SSO, RBAC, audit, support, metering, billing, retention, recovery, and live-write gating are included.
- [x] Availability, optimization time, idempotency, accessibility, RTO, RPO, compatibility, and observability are measurable.

## Artifact Consistency

- [x] Domain entities and state machines support every functional requirement.
- [x] REST, event, snapshot, and transaction contracts cover external surfaces.
- [x] Plan components own all critical invariants and verification methods.
- [x] Tasks are sequential, path-specific, test-first, and user-story labeled.
- [x] Video uses synthetic financial values and an unfunded signer path.
- [x] No unresolved requirement marker remains.
