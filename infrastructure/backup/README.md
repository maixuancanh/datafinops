# Backup and restore

Local Docker-free drills use the installed PostgreSQL 16 binaries with an isolated cluster under `.local-runtime/postgres-test`. `restore-test.ps1` creates a custom-format backup, stores a content-addressed immutable copy, restores into a separate database, and compares schema and deterministic data fingerprints. It never modifies the system PostgreSQL cluster.

Production uses managed encrypted point-in-time recovery plus versioned S3-compatible evidence storage. Live-write remains disabled throughout recovery. Recovery evidence must name commit, source/restore databases, backup hash, schema/data hashes, start/end time, and result.
