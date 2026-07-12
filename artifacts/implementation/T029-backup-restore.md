# T029 Backup and Restore Evidence

**Observed:** 2026-07-11

The Docker-free restore drill used native PostgreSQL 16 binaries and an isolated cluster. It produced a custom-format backup, restored into `datafinops_restore_test`, and matched canonical schema and data fingerprints. The backup was copied under its SHA-256 into the local content-addressed object-version store. Live-write remained false.

Backup hash: `5fe1335f2b39c379157bd7f0db9c279677756087a6b2b530618a130b2a3c365c`. Machine evidence: `artifacts/foundation/restore/restore-report.json`.
