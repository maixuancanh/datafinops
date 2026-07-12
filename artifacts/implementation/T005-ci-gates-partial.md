# T005 CI Gate Evidence

**Observed:** 2026-07-11

Implemented seven required CI jobs plus an `if: always()` aggregate gate. Local structural tests passed 5/5 and prove an omitted dependency, skipped aggregate, failed required result, or missing external merge-protection proof is rejected.

The task was originally partial because actual merge blocking required repository branch protection to require the `Required aggregate gate` check.

Updated 2026-07-12: local structural coverage now includes an explicit evidence validator for external merge-protection proof and passes 5/5.

Historical update 2026-07-12 after explicit user permission: `maixuancanh/datafinops` was created as a private repository, `origin` was configured, and `main` was pushed. `scripts/verify-ci-gate-github.ps1` detected the remote/repository and wrote `T005-ci-gates-github.json`, but GitHub returned HTTP 403 for branch protection/rulesets on the private repository: `Upgrade to GitHub Pro or make this repository public to enable this feature.` At that time T005 remained unchecked until branch protection/rulesets could require `Required aggregate gate` and a failing/fixed PR could prove merge blocking/unblocking.

Updated 2026-07-12 CI hardening: the GitHub PostgreSQL service now maps to the local integration-test port `55432`, the aggregate job installs Node dependencies before running `scripts/assert-ci-results.mjs`, CI audit uses production dependencies only, generated contract TypeScript is formatted by the generator, and gitleaks allowlists generated hash comments plus synthetic prohibited-material test fixtures.

Historical update 2026-07-12 after commit `2458a3a`: GitHub Actions push runs passed for `DataFinOps CI` (`29187284719`) and `DataFinOps Security` (`29187284720`) on branch `main`. This proved the workflow jobs and aggregate gate could pass on GitHub, but did not yet prove merge blocking because branch protection/rulesets were unavailable for the private repo on the then-current GitHub plan.

Updated 2026-07-12 after explicit user permission to make the repository public: branch protection on `main` now requires `Required aggregate gate`. Proof PR #1 first failed at commit `83c5b8e` with `tests=failure` and `Required aggregate gate=failure`; PR merge state was observed as `BLOCKED`. The same PR was then fixed at commit `7eefdc0`; `Required aggregate gate` passed, PR merge state was observed as `CLEAN`, and the PR merged as `24f4900267769b3750e210fad8cdfa65886046ab`. `scripts/verify-ci-gate-github.ps1` now exits 0 with `EXTERNAL_MERGE_PROTECTION_VERIFIED`.
