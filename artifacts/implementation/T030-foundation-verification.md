# T030 Foundation Verification Evidence

**Observed:** 2026-07-11

`verify-foundation.ps1` passed contracts, domain, auth, queues, prohibited-material, serialized PostgreSQL integration, typecheck, lint, zero-production-vulnerability audit, and native backup/restore. Machine evidence is `artifacts/foundation/verification-report.json`; restore evidence is `artifacts/foundation/restore/restore-report.json`. The isolated cluster stopped in `finally`; shared PostgreSQL/Redis were not changed.
