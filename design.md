# DataFinOps Product Design

**Status:** Approved design

**Product:** DataFinOps

**Target:** Independent Commercial V1 SaaS
**Design date:** 2026-07-11

## Executive Summary

DataFinOps is a governed B2B SaaS agent that helps sports-data buyers minimize TxLINE subscription cost while preserving required league coverage, data freshness, and operational safety. It combines TxLINE's on-chain pricing and entitlement state with tenant-owned usage, revenue, schedule, and service-level requirements. A deterministic optimizer produces an auditable recommendation; a policy engine decides whether the proposal is eligible for approval; an authorized user signs any resulting transaction on the client. DataFinOps never stores private keys, signs transactions, or spends funds without explicit approval.

Commercial V1 supports TxLINE only. Multi-vendor procurement, contract negotiation, and automated custody are explicitly deferred.

## Problem

Sportsbook, prediction-market, media, and quantitative teams frequently buy more data coverage or lower latency than their products use. The opposite failure is also costly: under-provisioning a required league or latency tier can interrupt a live product. Spreadsheet-based procurement cannot reliably connect subscription choices to fixture schedules, real endpoint usage, revenue contribution, latency SLOs, and on-chain entitlement state.

The buyer needs a system that can answer four questions with reproducible evidence:

1. What data is currently purchased and actually available?
2. Which products, leagues, and customers consume it?
3. What is the least expensive valid subscription configuration?
4. Was the approved change successfully activated, and did it produce real savings?

## Product Goals

- Maintain a verified inventory of TxLINE pricing, subscription, league, latency, and entitlement state.
- Attribute data cost to tenant-defined products, leagues, markets, and customer segments.
- Find the lowest-cost valid configuration under hard coverage, latency, budget, and approval constraints.
- Produce deterministic, explainable recommendations with immutable input snapshots.
- Require policy evaluation and human approval before any transaction is signed.
- Verify both on-chain subscription state and API entitlement activation after execution.
- Measure realized savings without treating forecasts as achieved outcomes.
- Provide audit, finance, renewal, and operational workflows suitable for a commercial organization.

## Non-Goals

- Holding customer funds, private keys, seed phrases, or signing authority.
- Placing bets, pricing markets, managing exposure, or making trading decisions.
- Automatically purchasing or renewing a subscription without an authorized signer.
- Supporting data vendors other than TxLINE in Commercial V1.
- Redistributing raw TxLINE data or reconstructing a competing data product.
- Replacing the tenant's accounting, wallet, or procurement system of record.
- Claiming savings until invoices, entitlement periods, and actual usage confirm them.

## Personas and Permissions

### Procurement Lead

Owns subscription strategy, reviews recommendations, compares scenarios, and schedules renewals. Can create proposals but cannot sign unless separately granted signer authority.

### Product or Trading Operations Manager

Defines required fixtures, leagues, products, latency classes, blackout windows, and minimum coverage. Can submit requirement changes and view impact but cannot alter finance policies.

### Finance Manager

Defines budgets, cost centers, allocation rules, currencies, and realized-savings periods. Can approve commercial changes within an assigned limit.

### Authorized Signer

Reviews an approved transaction proposal and signs it with a client-side wallet. DataFinOps never receives the private key.

### Auditor

Has read-only access to input snapshots, optimizer versions, policy evaluations, approvals, transaction receipts, activation evidence, and savings calculations.

### Service Account

Uploads usage and revenue aggregates through scoped API credentials. It cannot approve or sign proposals.

## Primary Journeys

### Connect and Baseline

An organization connects a TxLINE wallet address and API entitlement, maps internal products to leagues and latency requirements, imports usage and revenue aggregates, and selects a finance allocation policy. DataFinOps verifies network, program, API host, subscription rows, and entitlement state before creating the baseline.

### Optimize a Subscription

The procurement lead selects a target period. The optimizer snapshots pricing, current subscriptions, upcoming fixtures, usage, requirements, and budgets. It enumerates valid configurations, rejects any that violate hard constraints, ranks the remaining candidates, and presents current versus proposed cost, coverage changes, expected savings, and confidence.

### Govern and Approve

The policy engine evaluates the proposal against spending limits, signer rules, minimum coverage, allowed networks, renewal windows, and separation-of-duties requirements. Required approvers review the same immutable proposal version. Any material input change invalidates prior approvals and creates a new version.

### Execute and Verify

After final approval, DataFinOps creates an unsigned transaction payload bound to a network, program, pricing snapshot, proposal, and expiry. The signer reviews and signs client-side. DataFinOps submits or observes the signed transaction, confirms finality, activates the corresponding API entitlement where required, and verifies that the effective coverage matches the approved proposal.

### Close the Savings Period

At the end of a billing period, DataFinOps reconciles subscription spend, effective dates, usage, and approved baseline. Only the verified delta is posted to the savings ledger. Finance can export the result with its calculation inputs and approval chain.

## System Architecture

### Web Application

A Next.js and TypeScript application provides onboarding, inventory, requirements, scenario comparison, approval, signing, verification, reporting, and administration experiences. Wallet signing occurs only in the browser through a supported adapter.

### Public API

A Fastify and TypeScript service exposes tenant-scoped REST endpoints for usage imports, requirements, scenarios, proposals, approvals, transaction status, entitlement status, reports, and integrations. Webhooks notify external procurement, finance, and incident systems.

### Background Workers

Node.js workers use Redis and BullMQ for pricing refresh, schedule ingestion, usage aggregation, optimization, proposal expiry, transaction observation, entitlement activation, renewal checks, and savings reconciliation. Jobs use deterministic identifiers and idempotency keys.

### Persistence

PostgreSQL stores tenant configuration, normalized pricing, subscriptions, requirements, allocation rules, optimizer runs, proposals, policies, approvals, transaction envelopes, entitlement checks, incidents, and savings entries. Large immutable evidence bundles and exports are stored in S3-compatible object storage with content hashes recorded in PostgreSQL.

### TxLINE Integration Boundary

The TxLINE adapter owns all communication with pricing, subscription, fixtures, activation, entitlement, and on-chain verification surfaces. It supports `sandbox`, `devnet`, and `live-read` modes. Any write-capable production mode remains approval-gated and never has custody of a signing key.

## End-to-End Data Flow

1. Ingestion workers retrieve pricing, subscription, entitlement, and fixture state.
2. Tenant APIs receive aggregated usage, revenue, and business requirements.
3. The snapshot service freezes all optimization inputs and their hashes.
4. The allocation engine maps current spend to configured dimensions.
5. The constraint optimizer produces valid candidates and rejection reasons.
6. The explanation layer renders deterministic facts in business language; an optional LLM may rephrase but cannot change figures or ranking.
7. The policy engine returns `ELIGIBLE`, `APPROVAL_REQUIRED`, or `BLOCKED`.
8. Approval records bind named users to a proposal hash.
9. The transaction builder creates an unsigned, expiring proposal.
10. The authorized wallet signs client-side.
11. The verifier confirms transaction, subscription, and API entitlement state.
12. The savings service reconciles actual spend after the effective period.

## Major Components

- **Pricing and Entitlement Adapter:** Normalizes pricing rows, subscription periods, league bundles, latency classes, wallets, networks, and activation status.
- **Usage Ingestion:** Validates tenant-owned aggregate usage and revenue records without accepting raw customer bets or credentials.
- **Cost Allocation Engine:** Applies versioned allocation rules and makes unallocated cost visible rather than hiding it.
- **Constraint Optimizer:** Solves a finite, deterministic configuration problem with hard and soft constraints.
- **Scenario Workspace:** Compares current state and candidate states with coverage and cost diffs.
- **Policy-as-Code Engine:** Enforces budget, approval, network, allowlist, coverage, and separation-of-duties policies.
- **Approval Registry:** Manages ordered or quorum approvals and invalidates them when proposal inputs change.
- **Transaction Proposal Builder:** Creates reviewable unsigned payloads with expiry and replay protection.
- **Entitlement Verifier:** Confirms on-chain and API state after execution.
- **Savings Ledger:** Separates forecast, approved, pending, realized, disputed, and reversed savings.
- **Renewal Calendar:** Tracks effective periods, lead time, required approvals, and expiry risk.
- **Audit and Export Service:** Produces signed JSON, CSV, and human-readable evidence packages.

## Decision Model

The optimizer minimizes projected subscription cost subject to required coverage, maximum acceptable delay, effective-date, budget, and tenant policy constraints. Soft preferences may include headroom, fewer configuration changes, and confidence penalties. Every candidate includes a machine-readable explanation of satisfied constraints and rejected alternatives.

Recommendations are never based solely on an LLM. The optimizer version, pricing snapshot, requirement version, allocation version, and source hashes are included in every result.

## Core Domain Entities

- Organization, Workspace, User, Role, ServiceAccount
- TxlineConnection, NetworkConfiguration, WalletReference
- PricingSnapshot, PricingTier, LeagueBundle, LatencyClass
- Subscription, Entitlement, ActivationAttempt
- ProductMapping, CoverageRequirement, LatencyRequirement
- UsageAggregate, RevenueAggregate, CostAllocationRule
- OptimizationSnapshot, OptimizationRun, CandidateConfiguration
- Recommendation, Policy, PolicyEvaluation
- Proposal, ProposalVersion, Approval, SigningEnvelope
- TransactionObservation, EntitlementVerification
- SavingsBaseline, SavingsEntry, FinanceExport
- AuditEvent, EvidenceBundle, Incident

All mutable business objects are versioned. Audit records are append-only.

## External Surfaces

Commercial V1 exposes REST APIs for connections, usage imports, requirements, optimization runs, recommendations, proposals, approvals, transaction observations, entitlement verification, reports, and admin configuration. Webhooks cover recommendation readiness, approval requirements, proposal expiry, transaction status, activation failure, entitlement mismatch, renewal risk, and savings-period closure.

Transaction surfaces return serialized unsigned payloads and human-readable transaction summaries. Private signing material is never accepted by any API.

## Security and Compliance

- Multitenant row isolation is enforced in both application authorization and database queries.
- RBAC supports least privilege and separation of procurement, finance, approval, and signing duties.
- MFA is required for privileged roles; enterprise SSO is supported.
- Wallet addresses are references, not identities; private keys and seed phrases are rejected at validation boundaries.
- Secrets are held in platform secret stores and redacted from logs, traces, exports, and support tooling.
- Sensitive configuration is encrypted at rest and in transit.
- Transaction proposals bind network, program ID, account set, pricing snapshot, amount, expiry, and proposal hash.
- Signed transaction replay, double submission, and duplicate activation are prevented with unique operation keys.
- Raw TxLINE data is retained only as allowed by the customer's commercial license and is not exposed through customer-facing export APIs.
- Audit retention and regional storage are configurable for enterprise tenants.

## Failure Handling and Idempotency

- A stale pricing snapshot, unknown tier, network mismatch, program mismatch, API-host mismatch, missing requirement, or low-confidence mapping blocks execution.
- Optimization with incomplete usage may run in advisory mode but cannot claim realized savings.
- Proposal input changes create a new version and invalidate all prior approvals and signatures.
- Transaction submission uses a stable operation key; duplicate requests return the original operation state.
- A failed or expired signature never triggers automatic repurchase.
- A confirmed transaction followed by activation failure opens an incident and enters manual recovery; it does not issue another purchase.
- Entitlement mismatch blocks the savings ledger and marks the proposal `VERIFICATION_FAILED`.
- Reorganizations, refunds, or pricing corrections create reversing ledger entries instead of mutating history.

## Observability and Support

OpenTelemetry spans connect ingestion, snapshot, optimization, policy, approval, transaction, activation, and verification operations. Structured logs include tenant-safe correlation IDs and exclude secrets. Sentry captures application failures. Service-level dashboards track pricing freshness, ingestion lag, optimizer duration, proposal throughput, transaction confirmation, activation success, entitlement verification, renewal risk, and savings reconciliation. Each production incident produces an evidence bundle suitable for customer support.

## Testing Strategy

- Unit tests cover normalization, allocation, policy evaluation, transaction summaries, and savings calculations.
- Property tests verify that optimizer outputs always satisfy every hard constraint and never cost more than the selected baseline without an explicit justified preference.
- Golden tests pin expected recommendations for versioned pricing and requirement fixtures.
- Mutation tests ensure invalid coverage, latency, and network states are rejected.
- Contract tests validate every REST endpoint, webhook, and serialized transaction envelope.
- Integration tests use sandbox and devnet adapters for subscription and activation flows.
- Shadow-mode tests compare recommendations against current tenant choices without enabling execution.
- Fault tests cover stale pricing, reordered jobs, duplicate callbacks, confirmation timeouts, activation failures, network mismatch, and entitlement drift.
- Security tests cover tenant isolation, RBAC, proposal tampering, replay, secret leakage, and webhook authentication.
- Load tests validate concurrent usage imports, portfolio optimization, and renewal-period spikes.
- Playwright tests validate the full recommendation, approval, signing simulation, verification, and reporting journey.

## Deployment and Operations

The frontend is deployed on Vercel. The API, workers, PostgreSQL, and Redis run on Railway with separate staging and production environments. Object storage uses an S3-compatible managed service. Database migrations are forward-only and exercised in staging. Deployments use health checks, phased worker rollout, queue draining, rollback procedures, automated backups, point-in-time database recovery, and quarterly restore tests.

Production release requires successful contract, integration, security, load, and quickstart validation. Live write capability is disabled per tenant until connection, policy, approval, and signer-readiness checks pass.

## Commercial Model

DataFinOps charges a platform subscription based on workspace count and managed data spend. A contracted success-fee option may use verified realized savings, never forecast savings. Enterprise plans add SSO, custom policies, private deployment, extended retention, finance integrations, and contractual support targets.

The initial customer profile is a small or regional sportsbook, prediction platform, sports-media product, or quantitative team with meaningful TxLINE spend and limited procurement automation.

## Demo Design

The deterministic demo uses synthetic business metrics and a replayable TxLINE pricing and entitlement fixture:

1. Show a tenant paying for broader or faster coverage than required.
2. Import usage, revenue, fixture, and latency requirements.
3. Run optimization and compare the current and recommended configurations.
4. Add a hard coverage constraint and show the recommendation update.
5. Approve the proposal through procurement and finance roles.
6. Use a demo signer or devnet wallet flow to complete the transaction proposal.
7. Verify on-chain and API entitlement state.
8. Close a simulated period and show realized savings with its audit evidence.

The video is an English 16:9 walkthrough under four minutes and thirty seconds. Playwright controls the UI and deterministic scenario; FFmpeg records and assembles the final output.

## Rollout Strategy

1. **Design-partner release:** Read-only inventory, usage import, allocation, and shadow recommendations.
2. **Governed proposal release:** Policy, approvals, and unsigned transaction generation.
3. **Verified execution release:** Client-side signing, transaction observation, activation, and entitlement verification.
4. **Finance release:** Savings close, exports, renewal calendar, and enterprise controls.

Execution remains opt-in. A customer may buy Commercial V1 while operating permanently in recommendation-only mode.

## Risks and Mitigations

- **Incorrect requirements cause under-coverage:** Require hard minimums, preview diffs, staged approval, and shadow periods.
- **Pricing or entitlement semantics change:** Version the adapter, validate schemas, and block on unknown rows.
- **Savings claims lose customer trust:** Distinguish forecast from realized savings and preserve the full baseline calculation.
- **Signing creates custody expectations:** Keep signing client-side and explicitly reject private signing material.
- **Activation is operationally inconsistent:** Separate transaction confirmation from entitlement verification and provide manual recovery.
- **Single-vendor market limits expansion:** Validate the wedge with TxLINE before adding a vendor-neutral procurement layer.
- **Sparse usage data weakens confidence:** Surface data quality, run advisory-only, and require conservative coverage defaults.

## Success Criteria

- 100% of executable proposals satisfy all hard coverage, latency, network, budget, and approval constraints.
- 100% of proposal decisions can be replayed from a preserved input and version snapshot.
- Zero private keys or seed phrases enter server storage, logs, traces, or exports.
- At least 99.9% of confirmed transaction observations are processed idempotently without duplicate activation attempts.
- Every realized-savings entry reconciles to an approved baseline, effective subscription period, and verified entitlement.
- Design partners can complete baseline-to-recommendation in under one business day after supplying required mappings.
- A new authorized reviewer can understand why a recommendation was selected without consulting the engineering team.

## Design Approval Record

The product scope, independent SaaS model, pragmatic TypeScript stack, Commercial V1 target, governed signing boundary, and demo approach were approved in conversation on 2026-07-11.
