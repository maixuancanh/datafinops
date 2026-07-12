# T004 Docker-Free Native Windows Evidence

**Observed:** 2026-07-11

Docker was reported unusable, so a verified native profile was added without weakening service semantics:

- PostgreSQL 16 Windows service at `127.0.0.1:5432` returned `accepting connections`.
- Redis Windows service at `127.0.0.1:6379` returned `PONG`.
- S3rver 3.7.1 provided an S3-compatible endpoint at `127.0.0.1:59000` and configured `datafinops-local-evidence`.

`start-native-dependencies.ps1`, `check-native-dependencies.ps1`, and `stop-native-dependencies.ps1` were exercised. Stop removed only the DataFinOps S3rver listener and deliberately left shared PostgreSQL/Redis services running. Local secrets remain examples only and live-write is false.
