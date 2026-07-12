# T001 Workspace Evidence

**Observed:** 2026-07-11
**Branch:** `codex/datafinops-commercial-v1`

## Versions

- Node.js: `24.14.1`
- pnpm: `11.5.2`
- TypeScript: `5.9.3`

## Verification

The following commands exited zero from the DataFinOps product root:

```powershell
pnpm install
pnpm install --frozen-lockfile
pnpm exec tsc --showConfig -p tsconfig.base.json
pnpm run build
pnpm run typecheck
```

At T001 there are no workspace packages yet, so recursive build and typecheck correctly reported no matching projects. The lockfile is pinned and a subsequent frozen install made no changes.
