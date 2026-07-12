# T018-T020 Database Foundation Evidence

**Observed:** 2026-07-11

T018 RED was observed because `0001_baseline.sql` was absent. T019 then passed 5/5 tests against an isolated native PostgreSQL 16 cluster on port 55432: all 47 durable tables exist, scoped records require organization/workspace/environment, append-only approval updates fail, unique import/transaction/activation operation constraints exist, and migration signing-column lint is clean.

T020 compile-time tests reject missing or raw repository context. Runtime tests pass the exact immutable validated context into every adapter call. Domain package result after T020: 11/11 tests and strict typecheck passed.
