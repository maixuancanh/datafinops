# DataFinOps Deployment Runbook

## Release Preconditions

- Approved release commit, artifact manifest, provenance, and SBOM.
- Green contract, unit, property, golden, integration, browser, security, load, accessibility, and build gates.
- Independent verifier parity and no unresolved solver regression.
- Backward-compatible database and contract review.
- Staging restore, rollback, queue replay, transaction/activation fault, and live-write stop evidence.
- No active SEV-1/SEV-2 or expired security/finance exception.

## Deployment Sequence

1. Freeze service images, console, contracts, migrations, optimizer, verifier, policy, transaction builder, and TxLINE adapter versions.
2. Confirm production backup and point-in-time recovery state.
3. Apply expand-only migrations and run exact-money, hash, and repository smoke checks.
4. Deploy workers with new consumers paused; deploy optimizer in shadow-only mode.
5. Canary API and read-only adapter paths; verify tenant/mode isolation and source freshness.
6. Compare shadow optimizer output to prior version across the approved portfolio corpus.
7. Enable ingestion, snapshot, optimizer, notification, observation, activation, and finance workers gradually.
8. Deploy console and verify mode/network/program banners and signing-review summary.
9. Enable the new optimizer/builder only for sandbox/devnet canaries.
10. Promote live-read after observation. Preserve live-write off unless a separately approved tenant enablement names versions and limits.
11. Archive release metrics, hashes, approvals, owner, and post-deploy decision.

## Smoke Tests

- Health exposes correct version/mode/region and no secret.
- Cross-tenant, role, and live-write negative probes deny access without disclosure.
- Seeded/restricted read-only connection verifies the expected network/program.
- Canonical snapshot and golden recommendation hashes match.
- Independent verifier passes all displayed candidates.
- Proposal policy, approval separation, and invalidation work.
- Unsigned envelope summary matches the canonical payload and no secret input exists.
- Duplicate simulation receipt produces one operation and activation.
- Entitlement verification and savings replay match expected evidence.

## Rollback

- Disable live-write and signing-envelope creation first.
- Pause affected optimizer, transaction, activation, and close queues.
- Restore prior API, workers, optimizer, verifier, builder, and console artifacts.
- Keep expanded schema; use a reviewed forward repair instead of destructive migration rollback.
- Recompute derived recommendations from immutable snapshots when needed; never alter approval, transaction, or ledger history.
- Resume transaction observation before activation; reconcile every in-flight operation by operation key.
- Open an incident for any candidate, approval, transaction, entitlement, or savings integrity uncertainty.

## Abort Conditions

Abort on independent-verifier disagreement, nondeterministic golden hash, cross-tenant result, signing-material signal, wrong network/program/account summary, unexplained duplicate operation, live-write state drift, entitlement mismatch increase, or ledger reconciliation failure.

## Post-Release

Observe canaries through the approved period; reconcile jobs and audit records; review cost/capacity; resolve warnings; and schedule contract/schema cleanup only after all supported clients and in-flight proposals have expired or migrated.
