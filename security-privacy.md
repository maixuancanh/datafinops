# DataFinOps Security and Non-Custody Specification

## Security Objectives

1. DataFinOps never stores, logs, transmits, or requests private signing material.
2. Only an approved, unexpired, policy-compliant proposal can produce a reviewable unsigned envelope.
3. A signed public transaction is accepted only if it matches every bound field.
4. Tenant, environment, role, network, program, and mode isolation are independently enforced.
5. Optimizer, policy, transaction, entitlement, and savings facts remain reproducible and tamper-evident.
6. Live-write is fail-closed and separable from the commercially useful read-only product.

## Data Classification

| Class | Examples | Controls |
|---|---|---|
| Restricted secret | TxLINE API credential, webhook secret, SSO secret, database secret | Managed secret store, rotation, no export, redaction |
| Prohibited signing material | Private key, seed phrase, mnemonic, keystore, raw signer secret | No schema/column, boundary rejection, corpus scanning, incident response |
| Confidential finance | Usage/revenue aggregates, budgets, allocations, savings, approval authority | Tenant RBAC, encryption, audit, retention |
| Confidential operational | Requirements, proposals, wallet public references, entitlement evidence | Least privilege, purpose logging, controlled export |
| Licensed source | Raw TxLINE pricing/subscription/feed payload | Server-only, licensed retention, no reconstructive export |
| Public chain data | Transaction signature, public wallet, network/program | Integrity verification and tenant context |

## Identity and Authorization

- Console authentication uses OIDC; Enterprise supports SAML SSO and lifecycle provisioning.
- MFA is required for administrators, approvers, finance roles, and authorized signers.
- Roles distinguish connection admin, requirements editor, procurement proposer, finance approver, signer, auditor, service account, and support.
- Approval authority includes role, amount/currency limit, workspace, effective period, and expiry.
- Service accounts can import scoped aggregates but cannot propose, approve, sign, enable live-write, manage secrets, or close savings.
- Tenant and environment context is mandatory in API middleware and repository/database predicates.
- Break-glass is time-limited, reasoned, alerted, read-only where possible, and reviewed.

## Prohibited Secret Controls

- Contracts contain no private key, seed, mnemonic, keystore, passphrase, recovery phrase, raw signer, or arbitrary secret payload field.
- A request prefilter rejects field names and values matching known encoded signing-material formats before durable logging.
- Error messages contain only a generic prohibited-material reason and correlation ID.
- Browser wallet APIs remain in a browser-only package; dependency-graph tests fail if server packages import them.
- Source maps, client storage, analytics, support captures, and video configs are scanned for secret patterns.
- Any suspected signing-material ingestion is a SEV-1: stop affected ingestion, restrict evidence, rotate exposed public/related credentials as applicable, and follow notification review.

## Transaction Integrity

- Allowlist network, program ID, accounts, instruction discriminator, token/currency, amount range, and supported transaction version.
- Canonical envelope binds snapshot hash, proposal hash, policy version, approvals digest, operation key, exact amount, effective intent, expiry, and human-summary digest.
- Preflight re-derives the proposal and summary immediately before wallet presentation.
- After signing, re-parse public transaction bytes and compare every bound field; reject any extra or changed instruction.
- Enforce expiry, proposal state, signer allowlist, account, network, and replay protection.
- Duplicate submission returns the original operation; it never sends a second purchase.

## Optimizer and Finance Integrity

- Snapshot canonicalization uses documented ordering and exact numeric representation.
- Solver output passes an independent verifier; only verified candidates can be recommended.
- Optimizer workers have no signing, approval, live-write, or source-secret permissions.
- Approval records and transaction/savings ledgers are append-only and content-hashed.
- Realized savings requires complete input watermark and successful entitlement verification.
- Changes produce new versions or reversing entries rather than mutation.

## Threat Model

| Threat | Primary control | Verification |
|---|---|---|
| Server receives a seed/private key | Absent schema, prefilter, no columns, redaction | Corpus tests and artifact scans |
| Proposal tampering | Canonical hashes, immutable version, approval binding | Mutation tests |
| Wallet signs different instruction | Re-parse and compare allowlisted bound fields | Wallet integration security tests |
| Approval privilege escalation | Role/limit snapshot, separation, MFA, audit | Negative authorization suite |
| Cross-tenant finance access | Dual-layer scoping and opaque IDs | Isolation tests |
| Invalid optimizer candidate | Independent verifier and brute-force comparison | Property/golden tests |
| Stale pricing purchase | Freshness and expiry gate | Clock/freshness tests |
| Duplicate purchase/activation | Stable operation keys and no-repurchase guard | Retry/fault tests |
| False realized savings | Verification and complete-period close | Ledger property tests |
| TxLINE credential/source leak | Server-only adapter, redaction, export allowlist | Build/log/export scan |
| Live-write accidental enablement | Separate capability and accountable enablement | Configuration and game-day test |

## Privacy

DataFinOps processes organizational procurement and aggregate product metrics, not bettor or viewer records. Import schemas reject customer-level bet, identity, payment, or event data. User identity and approval records are retained according to audit and employment lifecycle policy. Export and support access are role/purpose audited. Regional and retention controls follow contract; raw TxLINE licensed data is minimized.

## Secure Operations

- TLS, encryption at rest, managed secret stores, scoped database roles, network restrictions, and backup access controls.
- Lockfiles, dependency/image scanning, SBOM, provenance, secret scans, and reviewed release artifacts.
- Structured allowlist logging with currency/amount redaction where support does not need values.
- Credential rotation for TxLINE, webhooks, SSO, service accounts, database, and platform services.
- Annual penetration test and targeted review before adding a new transaction builder, wallet adapter, network, or live-write tenant.

## Severity

- **SEV-1:** signing material ingested, cross-tenant finance access, unauthorized live write, proposal/transaction integrity failure.
- **SEV-2:** broad read outage, confirmation/activation backlog, entitlement mismatch across tenants, savings integrity risk.
- **SEV-3:** stale pricing for a subset, optimizer backlog, report delay, isolated integration failure.

Containment prioritizes disabling live-write and affected proposal progression while keeping verified read-only evidence available when safe.
