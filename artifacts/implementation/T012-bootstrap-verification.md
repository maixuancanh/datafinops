# T012 Bootstrap Evidence

**Observed:** 2026-07-11

`powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/verify-workspace.ps1` completed successfully from the product root. It verified pinned Node/pnpm, frozen install, lint, typecheck, all current tests, security configuration, Docker Compose configuration, and production builds.

Machine-readable evidence is archived at `artifacts/bootstrap/latest.json`. The recorded mode is sandbox, live-write is false, and build inclusion is true. README documents install, verification, evidence, safe demo boundaries, and local dependency start without claiming later lifecycle commands exist.
