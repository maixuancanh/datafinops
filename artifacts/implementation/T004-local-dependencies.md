# T004 Local Dependency Evidence

**Observed:** 2026-07-11

`docker compose --env-file .env.example config --quiet` exited zero. The resolved pinned images were:

- `postgres:17.7-alpine`
- `redis:8.4-alpine`
- `minio/minio:RELEASE.2025-09-07T16-13-09Z`

The example environment is sandbox-only, uses a fixed clock, disables live-write, and contains only synthetic/unfunded references. Services were validated but not started at this task.
