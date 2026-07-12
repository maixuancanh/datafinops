# T017 Exact Money Implementation Evidence

**Observed:** 2026-07-11

All 9 T016 tests passed. Package typecheck and root lint/boundary checks passed. Money uses bigint with signed-128 storage bounds; decimal values use unscaled bigint plus declared scale; conversions use exact rational rates with source/time/rounding evidence; accounting periods use canonical half-open UTC boundaries. No binary floating-point value participates in monetary arithmetic.
