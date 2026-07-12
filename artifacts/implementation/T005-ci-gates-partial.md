# T005 CI Gate Evidence — Partial

**Observed:** 2026-07-11

Implemented seven required CI jobs plus an `if: always()` aggregate gate. Local structural tests passed 5/5 and prove an omitted dependency, skipped aggregate, failed required result, or missing external merge-protection proof is rejected.

The task remains unchecked because actual merge blocking requires the repository's branch protection to require the `Required aggregate gate` check. That external GitHub setting has not been inspected or changed in this run.

Updated 2026-07-12: local structural coverage now includes an explicit evidence validator for external merge-protection proof and passes 5/5.

Updated 2026-07-12 after explicit user permission: `maixuancanh/datafinops` was created as a private repository, `origin` was configured, and `main` was pushed. `scripts/verify-ci-gate-github.ps1` now detects the remote/repository and writes `T005-ci-gates-github.json`, but GitHub returns HTTP 403 for branch protection/rulesets on this private repository: `Upgrade to GitHub Pro or make this repository public to enable this feature.` T005 remains unchecked until branch protection/rulesets can require `Required aggregate gate` and a failing/fixed PR proves merge blocking/unblocking.

Updated 2026-07-12 CI hardening: the GitHub PostgreSQL service now maps to the local integration-test port `55432`, the aggregate job installs Node dependencies before running `scripts/assert-ci-results.mjs`, CI audit uses production dependencies only, generated contract TypeScript is formatted by the generator, and gitleaks allowlists generated hash comments plus synthetic prohibited-material test fixtures.

Updated 2026-07-12 after commit `2458a3a`: GitHub Actions push runs passed for `DataFinOps CI` (`29187284719`) and `DataFinOps Security` (`29187284720`) on branch `main`. This proves the workflow jobs and aggregate gate can pass on GitHub, but still does not prove merge blocking because branch protection/rulesets remain unavailable for this private repo on the current GitHub plan.
