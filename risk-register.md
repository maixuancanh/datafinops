# DataFinOps Risk Register

| ID | Risk | Likelihood | Impact | Prevention and mitigation | Trigger | Owner |
|---|---|---:|---:|---|---|---|
| DF-R01 | Optimizer recommends under-coverage | Low/Medium | Critical | Hard constraints, independent verifier, brute-force/property tests | Any verifier disagreement | Optimization Lead |
| DF-R02 | Stale/incorrect TxLINE pricing | Medium | High | Freshness, versioned adapter, expiry, executable block | Source age/schema threshold | Data Integration |
| DF-R03 | Network/program/API host mismatch | Medium | Critical | Connection verification and allowlists | Expected/observed mismatch | Security + Integration |
| DF-R04 | Private signing material enters service | Low | Critical | Absent schema, prefilter, scans, SEV-1 path | Secret corpus detection | Security |
| DF-R05 | Signed transaction differs from approval | Low | Critical | Canonical binding, reparse, allowlists, expiry | Bound-field mismatch | Security + Platform |
| DF-R06 | Duplicate purchase or activation | Low/Medium | Critical | Operation keys, observation, no-repurchase guard | Duplicate external event | Platform |
| DF-R07 | Confirmation mistaken for entitlement | Medium | High | Separate state machine and verification | On-chain/API disagreement | Integration |
| DF-R08 | Approval authority or separation bypass | Low | High | Role/limit snapshots, MFA, negative tests | Unauthorized transition | Security + Finance |
| DF-R09 | Input change leaves stale approvals | Low/Medium | High | Material hash and automatic invalidation | Snapshot/proposal hash drift | Product Engineering |
| DF-R10 | Usage or allocation quality misleads optimization | Medium | High | Quality score, unallocated bucket, advisory mode | Missing/unallocated threshold | Customer + Data |
| DF-R11 | Savings claim is overstated | Medium | High | State separation, complete close, verification, reversals | Reconciliation mismatch | Finance Engineering |
| DF-R12 | Currency/tax/proration error | Medium | High | Exact money, explicit policy, finance review | Formula or source mismatch | Finance Engineering |
| DF-R13 | Fixture reschedule changes required coverage | Medium | High | Schedule freshness, snapshot expiry, renewal re-run | Material schedule change | Product Operations |
| DF-R14 | TxLINE activation is operationally inconsistent | Medium | High | Idempotent activation, incident, no repurchase | Confirmed but inactive | Integration |
| DF-R15 | Live-write enabled accidentally | Low | Critical | Separate capability, default off, accountable gate, stop switch | Mode drift or unauthorized enable | Security + Platform |
| DF-R16 | Customer treats output as accounting/legal advice | Medium | Medium/High | Contract boundaries, evidence, customer approval | Unsupported reliance claim | Legal + Product |
| DF-R17 | Cross-tenant financial exposure | Low | Critical | Dual-layer isolation, negative tests, audited access | Isolation signal | Security |
| DF-R18 | Large optimizer job harms other tenants | Medium | Medium/High | Quotas, classes, fair queue, time/memory bounds | Fairness or SLO breach | Platform |
| DF-R19 | TxLINE rights do not permit intended retention/export | Medium | High | Contract review, minimal raw storage, derived export | Rights conflict | Legal + Partnerships |
| DF-R20 | Single-vendor wedge limits growth | Medium | Medium | Validate ROI first, adapter boundary, later expansion | Market demand for multi-vendor | Product Strategy |

## Review Policy

Critical risks are reviewed before every production release and live-write enablement; high risks monthly; the complete register quarterly. Triggers create an incident, mitigation task, or explicit time-bounded acceptance. Revenue, schedule pressure, or a customer request cannot bypass hard constraints, non-custody, proposal binding, entitlement verification, rights, or realized-savings evidence.
