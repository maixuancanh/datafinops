# ADR-001: Deterministic finite solver with independent verification

- Status: Accepted
- Date: 2026-07-11

## Decision

Use a deterministic exact solver for the supported finite TxLINE tier/bundle envelope. Canonical input ordering and stable tie-breaks define output order. A separately owned verifier checks every hard constraint before promotion. Bounded portfolios must match brute-force truth; infeasible results expose requirement IDs and never relax constraints.

## Consequences

Optimizer workers receive only immutable snapshots and have no signing, approval, or source-secret capability. New solver versions run shadow comparisons before recommendation use.

## Verification

Golden, property, brute-force, mutation, replay, cancellation, and resource-limit suites are release gates.
