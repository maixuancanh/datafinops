# T027 Audit Evidence

**Observed:** 2026-07-11

Two audit tests passed. Canonical append-only events bind tenant, actor, action, purpose, resource, timestamp, and previous hash. Privileged reads require purpose. Payload mutation and chain mismatch are detected. PostgreSQL update/delete triggers independently reject mutation of audit rows.
