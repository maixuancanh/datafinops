# T015 Compatibility Evidence

**Observed:** 2026-07-11

Compatibility tests prove additive changes pass and removal of an operation, event channel, or required field fails. The approved contract surface is recorded in `contracts/.compatibility-baseline.json`. Updating a breaking baseline requires both `--approve-breaking` and `CONTRACT_BREAKING_CHANGE_APPROVED=true`; normal CI uses check-only mode and also rejects generated drift.

Result: 2/2 compatibility tests passed; live compatibility and generated drift checks exited zero.
