# DataFinOps Shot List

| Shot | Time | Route or state | Action | Required evidence | Stable selector |
|---|---:|---|---|---|---|
| DF-01 | 00:00–00:20 | `/portfolio` | Establish over-provisioned current state | Sandbox, live-write disabled, current subscription | `current-subscription` |
| DF-02 | 00:20–00:48 | `/connections/demo` | Inspect verified source state | Network, program, entitlement, public wallet, hashes | `connection-verified` |
| DF-03 | 00:48–01:15 | `/usage` and `/requirements` | Import and review requirements | Aggregate data, unallocated cost, hard/soft labels | `usage-import`, `coverage-requirements` |
| DF-04 | 01:15–01:48 | `/scenarios/demo-1` | Run optimization | Snapshot, cost diff, verifier passed, rejections | `run-optimizer`, `recommendation-card`, `hard-constraint-status` |
| DF-05 | 01:48–02:12 | Requirement revision | Add hard fixture and rerun | New recommendation; old hash preserved | `add-hard-constraint`, `recommendation-card` |
| DF-06 | 02:12–02:46 | `/proposals/demo` | Create and approve | Proposal hash, policy, separate approvals | `proposal-create`, `procurement-approve`, `finance-approve` |
| DF-07 | 02:46–03:17 | `/proposals/demo/sign` | Review and demo-sign | Bound summary, no secret input, simulation receipt | `transaction-summary`, `demo-signer` |
| DF-08 | 03:17–03:47 | `/transactions/demo` | Confirm and verify | One transaction, activation, entitlement match | `transaction-confirmed`, `entitlement-verified` |
| DF-09 | 03:47–04:06 | `/savings/demo-period` | Close period | Baseline, actual, realized, evidence hash | `close-savings-period`, `realized-savings` |
| DF-10 | 04:06–04:15 | `/audit/demo` | Close on evidence | Replayable chain and live-write disabled | `audit-evidence` |

## Recording Acceptance

- All wallet, money, pricing, usage, receipt, entitlement, and savings data is synthetic.
- The page contains no private-key, seed-phrase, mnemonic, keystore, or passphrase input.
- Every promoted candidate visibly passes the independent verifier.
- The signing summary and entitlement timeline are readable long enough to audit.
- Raw and final video are 1920x1080 and no longer than 270 seconds.
- Failure retains trace/screenshots; success writes a JSON execution report.
