# DataFinOps Security and Non-Custody Release Checklist

## Identity and Isolation

- [ ] OIDC/SAML, MFA, lifecycle, authority limits, service-account restrictions, and break-glass are tested.
- [ ] Tenant, workspace, environment, mode, role, ID, list, export, support, and worker isolation are green.
- [ ] Privileged reads and every proposal/approval/signing/live-write action are audited.

## Prohibited Signing Material

- [ ] API/file contracts have no private-key, seed, mnemonic, keystore, passphrase, recovery, or raw signer fields.
- [ ] Corpus tests cover headers, JSON, CSV, files, errors, logs, traces, queues, exports, support, source maps, and video configs.
- [ ] Server dependency graph excludes browser wallet packages and signing code.
- [ ] SEV-1 suspected-signing-material procedure is exercised.

## Proposal and Transaction Integrity

- [ ] Snapshot, candidate, policy, proposal, approvals, envelope, and summary hashes are canonical and immutable.
- [ ] Network, program, accounts, instruction, amount, signer, expiry, proposal, and operation allowlists are enforced.
- [ ] Signed public transaction is reparsed; tampering, extra instruction, wrong signer, expiry, and replay fail closed.
- [ ] Live-write default deny, per-tenant enablement, limits, and emergency stop are green.

## Source, Finance, and Supply Chain

- [ ] TxLINE credentials and raw licensed data are server-only, minimized, redacted, and export-controlled.
- [ ] Exact money, independent verifier, approval separation, entitlement, and savings-integrity tests are green.
- [ ] TLS, encryption, KMS/secret storage, database roles, network policy, backups, and object access are reviewed.
- [ ] Secret/dependency/image/license/SBOM/provenance scans are green; critical/high findings are resolved or time-bounded.
- [ ] Penetration and threat-model actions for the release scope are closed.

## Incident Readiness

- [ ] Unauthorized write, proposal tampering, optimizer disagreement, activation failure, entitlement mismatch, and ledger integrity drills meet targets.
- [ ] Notification, evidence, public-network reconciliation, no-repurchase, restoration, and correction owners are named.
