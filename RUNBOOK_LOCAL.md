# DataFinOps Local Runbook

This runbook is for the Docker-free Windows path used in the current workspace.

## Install

```powershell
cd D:\superteam\ideawithsol\datafinops
pnpm install --frozen-lockfile
```

## Native Dependencies

Start or check PostgreSQL, Redis, and S3-compatible object storage:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\start-native-dependencies.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-native-dependencies.ps1
```

Stop the managed local dependency helpers:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\stop-native-dependencies.ps1
```

## Verification

Workspace checks:

```powershell
pnpm contracts:lint
pnpm contracts:generate
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:property
pnpm test:golden
pnpm test:contract
pnpm test:integration
pnpm test:security
pnpm build
```

Foundation, recovery, and release rehearsal:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-foundation.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\restore-test.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\release-rehearsal.ps1
```

Commercial acceptance and demo probe:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\commercial-acceptance.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\quickstart.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File .\video\record-demo.ps1
```

T005 local CI gate proof:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-ci-gate-local.ps1
```

T005 external GitHub branch-protection probe:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-ci-gate-github.ps1
```

This command is expected to fail until `origin` is configured and GitHub branch protection or rulesets require `Required aggregate gate`.

## Safety Boundaries

The local workflow uses sandbox/devnet fixtures only. Do not enable live-write, funded signing, public deployment, production credentials, or real customer data without explicit approval for that exact external action.

## Current External Gate

T005 requires a GitHub repository remote and branch protection or ruleset evidence requiring `Required aggregate gate`. Local tests prove fail-closed workflow behavior, but they do not prove GitHub merge blocking.
