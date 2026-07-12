# DataFinOps UX Specification

## Experience Principles

- Show the requirement before the recommendation.
- Never hide missing, stale, conflicting, or unallocated data.
- Make current, forecast, approved, verified, and realized states visually and semantically distinct.
- Explain every candidate, rejection, policy result, approval, and verification from deterministic facts.
- Put network, program, environment, currency, effective period, source freshness, and hash near any consequential action.
- Keep signing review calm, explicit, accessible, and free of urgency patterns.

## Information Architecture

Primary navigation: Portfolio, Connections, Requirements, Usage, Scenarios, Recommendations, Proposals, Transactions, Entitlements, Savings, Renewals, Integrations, Audit, Usage & Billing, and Administration. Workspace and mode (`Sandbox`, `Devnet`, `Live read`, `Live write`) remain persistent and strongly differentiated.

## Connection and Baseline

The wizard captures network, program, API host, public wallet reference, read credential, entitlement expectation, usage import, product mapping, and allocation policy. Verification displays expected versus observed values and source time. Secret values are one-time or masked. A mismatch blocks progression without offering a bypass.

## Requirement Workspace

Users define hard coverage/fixture/latency/effective/budget rows and separate soft preferences. Every row has owner, source, version, effective period, and impacted products. Hardness is a text label and icon, never color only. Changing a bound row previews which optimizer, proposal, approval, or renewal artifacts will be superseded.

## Scenario Comparison

Current and candidate configurations show exact cost, selected tiers, leagues, latency, effective date, coverage diff, headroom, change count, confidence, assumptions, and hard-constraint status. Rejected candidates show specific failed requirements. `INFEASIBLE` displays the conflicting set and invites an authorized requirement revision; it never auto-relaxes.

## Proposal and Approval

Proposal review freezes the snapshot, candidate, policy, amount, network, program, effective date, hash, and expiry. The approval graph shows proposer separation, required roles, order/quorum, limits, completed decisions, and invalidation rules. Approve/reject actions require accessible confirmation and rationale under policy.

## Signing Review

- Show mode, network, program, public signer, selected subscription changes, exact amount/currency, accounts, instruction purpose, expiry, proposal hash, and human-summary hash.
- Require explicit confirmation that the user is in an authorized client wallet.
- Never offer a private-key, seed-phrase, keystore, or server-signing input.
- A wallet/network/account change re-runs preflight and may invalidate the envelope.
- Rejection or wallet closure leaves the proposal unsigned and never retries automatically.

## Verification and Savings

The transaction timeline separates submitted, finality, subscription, API activation, entitlement, and effective coverage. Savings pages separate forecast, approved, pending, realized, disputed, reversal, and closed states. Every figure exposes baseline, formula, period, currency/conversion, inputs, verification, and export evidence.

## Empty, Loading, Error, and Degraded States

- Empty views state the first safe action and responsible role.
- Jobs show stable ID, snapshot hash, stage, elapsed time, cancel behavior, and retry semantics.
- Stale source, incomplete usage, or unallocated cost remains prominent in every dependent view.
- Optimizer failure does not display a partial candidate.
- Activation failure states “purchase confirmed, entitlement not verified” and never offers one-click repurchase.
- Permission denial names the needed role without exposing another tenant's resource.
- Explanation enhancement failure falls back to deterministic facts.

## Accessibility and Responsive Behavior

Core workflows conform to WCAG 2.2 AA, keyboard navigation, visible focus, semantic tables/diffs/timelines, zoom, and reduced motion. Desktop/tablet support scenario and policy editing. Mobile supports review, approval, transaction/entitlement status, renewal alerts, and audit search; dense optimization work redirects to a larger viewport.

## Stable Demo Selectors

The implementation reserves `data-testid` values for `connection-verified`, `current-subscription`, `usage-import`, `coverage-requirements`, `run-optimizer`, `recommendation-card`, `hard-constraint-status`, `snapshot-hash`, `add-hard-constraint`, `proposal-create`, `procurement-approve`, `switch-finance-role`, `finance-approve`, `proposal-hash`, `open-signing-review`, `transaction-summary`, `demo-signer`, `advance-transaction`, `transaction-confirmed`, `run-entitlement-verification`, `entitlement-verified`, `close-savings-period`, `realized-savings`, and `audit-evidence`.
