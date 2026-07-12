# T003 Mode Configuration Evidence

**Observed:** 2026-07-11

The mode suite was first observed failing because `src/modes.ts` did not exist. After implementation:

```text
Test Files  1 passed (1)
Tests       6 passed (6)
```

`pnpm --filter @datafinops/config typecheck`, `pnpm lint`, and `pnpm install --frozen-lockfile` also exited zero. Tests cover sandbox fixed-clock behavior, live-write denial in sandbox/devnet/live-read, incomplete live-write evidence, and explicitly scoped live-write allowlists.
