# DataFinOps Research and Decision Record

## Scope

This record resolves Commercial V1 product and architecture decisions. It does not replace tenant legal, tax, accounting, wallet, TxLINE subscription, or network review.

## Decision 1 — TxLINE-only wedge

**Decision:** Commercial V1 supports TxLINE pricing, subscriptions, fixtures, activation, entitlement, and proof-aware verification through one versioned adapter.

**Why:** A single source allows correct semantics, executable integrations, and a credible design-partner wedge before attempting vendor-neutral procurement.

**Source:** [TxLINE Soccer Feed](https://txline.txodds.com/documentation/scores/soccer-feed), [TxLINE Streaming Data](https://txline.txodds.com/documentation/examples/streaming-data), and applicable [TxLINE terms](https://txline.txodds.com/documentation/legal/hackathon-terms).

## Decision 2 — Snapshot every optimization input

**Decision:** Freeze canonical pricing, subscription, entitlement, schedule, usage, revenue, requirements, allocation, policy, network, and optimizer version before solving.

**Why:** Procurement decisions become unreproducible if inputs can move during optimization or approval.

## Decision 3 — Deterministic constrained optimization

**Decision:** Use an exact finite solver appropriate to the pricing model. Hard coverage, latency, network, effective-date, and budget constraints are verified independently after solving. Stable tie-break rules determine ordering.

**Why:** A recommendation must be auditable and safe. An optional language model can rephrase the computed explanation but cannot add candidates, change figures, or override constraints.

## Decision 4 — Show infeasibility honestly

**Decision:** Return `INFEASIBLE` with a minimal or near-minimal conflict explanation rather than silently relax requirements.

**Why:** Under-coverage can interrupt live products. The user, not the optimizer, must decide whether to change a hard requirement.

## Decision 5 — Preserve unallocated cost

**Decision:** Allocation rules are versioned, and unmatched cost remains an explicit `UNALLOCATED` bucket.

**Why:** Forcing totals into arbitrary products creates false unit economics and misleading savings.

## Decision 6 — Human governance before execution

**Decision:** Policy produces `ELIGIBLE`, `APPROVAL_REQUIRED`, or `BLOCKED`; ordered/quorum approvals bind to an immutable proposal hash. Material change invalidates all prior approvals.

**Why:** Procurement and finance need separation of duties, limits, and reviewable intent rather than an opaque automation switch.

## Decision 7 — Non-custodial client-side signing

**Decision:** The server creates an unsigned, expiring transaction envelope and human-readable summary. A supported browser wallet or deterministic demo signer signs client-side. APIs reject private keys and seed phrases.

**Why:** This preserves wallet control and narrows security and regulatory scope.

## Decision 8 — Confirmation, activation, and entitlement are distinct

**Decision:** Track transaction finality, subscription state, API activation, and effective entitlement as separate checks. A confirmed transaction plus failed activation opens an incident and never triggers automatic repurchase.

**Why:** On-chain success alone may not prove the API capability is usable.

## Decision 9 — Append-only savings ledger

**Decision:** Track forecast, approved, pending, realized, disputed, reversed, and closed entries. Realized status requires complete period inputs and verified effective entitlement. Corrections append reversing entries.

**Why:** Forecasting and finance evidence serve different trust thresholds. Mutation would erase the audit chain.

## Decision 10 — Exact monetary representation

**Decision:** Store monetary values as currency plus integer minor units when the currency supports them, or exact decimal with declared scale when required. Store conversion sources and time separately.

**Why:** Binary floating-point arithmetic is unsuitable for billing, savings, or approval limits.

## Decision 11 — Pragmatic commercial stack

**Decision:** Next.js console, Fastify APIs, TypeScript workers with BullMQ, PostgreSQL, Redis, S3-compatible evidence storage, Vercel, and Railway.

**Why:** The stack supports shared schemas, managed operation, durable job orchestration, independent scaling, and a client-only wallet surface. Fastify's schema-based validation and response serialization support narrow non-custodial boundaries: [Fastify Validation and Serialization](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/). Next.js documents supported deployment modes: [Next.js Deploying](https://nextjs.org/docs/app/getting-started/deploying).

## Decision 12 — Modes are separate capabilities

**Decision:** `sandbox`, `devnet`, `live-read`, and `live-write` have separate credentials, configuration, state, UI banners, policy, and enablement. Live-write defaults off for each tenant.

**Why:** A read-only customer is commercially valid, and enabling production write must be an explicit controlled transition.

## Decision 13 — Deterministic non-funded demo

**Decision:** Use synthetic business metrics, a replayed TxLINE pricing/entitlement fixture, fixed clock, and demo signer or devnet fixture. No funded wallet or real purchase is required.

**Why:** The demo is repeatable, shareable, and cannot accidentally spend funds.

## Alternatives Rejected

- **Spreadsheet export only:** useful as an output but cannot preserve versioned constraints, approval, execution, and verification.
- **LLM-selected subscription:** not deterministic and cannot guarantee hard constraints.
- **Server-held signing key:** expands custody and compromise risk beyond the product's purpose.
- **Automatic renewal:** violates the approved human-approval boundary.
- **Treating transaction confirmation as entitlement:** can hide activation failure.
- **Booking forecast at approval:** overstates verified value.
- **Multi-vendor first release:** increases semantic and contract complexity before validating the TxLINE wedge.

## Customer-Specific Validations

- Exact TxLINE pricing, subscription, transaction, activation, and entitlement semantics for the contracted network.
- Program/account allowlists and wallet adapter compatibility.
- Currency, tax, proration, credit, refund, and accounting-period policy.
- Supported products, leagues, fixture horizon, latency definitions, and blackout windows.
- Approval authority, separation of duties, transaction limits, and live-write enablement.
- Evidence retention, audit, security, support, RTO, RPO, and realized-savings methodology.
