# ADR-002: Exact monetary representation

- Status: Accepted
- Date: 2026-07-11

## Decision

Represent conventional currency as an uppercase code plus integer minor units. Where a source requires another scale, use a normalized base-10 string and declared scale. Binary floating point is prohibited for pricing, allocation, approvals, billing, and savings.

## Consequences

Conversion source/time, tax, credit, proration, and rounding policy remain explicit versioned inputs. Serialization uses decimal strings.

## Verification

Unit/property tests cover scale, overflow, signs, rounding, allocation reconciliation, conversion provenance, close, and reversal balance.
