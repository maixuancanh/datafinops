# DataFinOps Commercial V1 Dossier

DataFinOps is a governed subscription intelligence and optimization SaaS for teams buying TxLINE data. It connects verified pricing and entitlement state with tenant-owned usage, revenue, schedules, and service requirements; produces deterministic least-cost valid configurations; obtains policy-bound human approvals; creates unsigned transaction proposals; verifies activation; and closes realized savings with reproducible evidence.

This directory is an implementation contract. It does not claim the commercial product, live TxLINE write path, customer savings, or production deployment already exists.

## Artifact Map

- `design.md` — approved product direction and commercial boundary.
- `spec.md` — technology-independent behavior, invariants, and success criteria.
- `research.md` — resolved decisions, alternatives, and authoritative source links.
- `plan.md` — architecture, repository layout, delivery phases, and release gates.
- `tasks.md` — test-first, dependency-ordered implementation backlog.
- `architecture.md`, `data-model.md`, `ux-spec.md` — technical and user-experience design.
- `contracts/` — REST, event, optimizer snapshot, and transaction-proposal contracts.
- `security-privacy.md`, `testing-strategy.md` — non-custodial and correctness assurance.
- `deployment-runbook.md`, `operations-runbook.md` — release, rollback, incident, and routine operations.
- `commercial-plan.md`, `risk-register.md` — packaging, design-partner motion, metrics, and ownership.
- `checklists/` — requirement and production evidence gates.
- `video/` — deterministic 4:15 screenplay plus Playwright and FFmpeg automation.
- `quickstart.md` — acceptance workflow for a completed implementation.

## Non-negotiable Boundary

DataFinOps never accepts a private key or seed phrase, never signs or spends without an authorized client-side signer, never permits an optimizer result that violates hard requirements, and never books forecast savings as realized savings.

## Intended Build Order

Implement `tasks.md` in numerical order. Each story has an independent reviewable outcome and begins with failing tests. Live write mode stays disabled per tenant until contract, network, program, policy, approval, signing, entitlement, security, and operational gates all have current evidence.

## Implementation bootstrap

Requirements: Node 24.14.1, pnpm 11.5.2, Docker/Compose, and Windows PowerShell 5.1 or PowerShell 7. From this directory:

```powershell
pnpm install --frozen-lockfile
pnpm verify:workspace
```

For local dependencies, validate `.env.example`, then run `docker compose --env-file .env.example up -d`. All checked-in configuration is sandbox/replay-only, uses a fixed clock and synthetic fixtures, and keeps live-write disabled. Never insert production credentials, customer finance data, funded wallets, private keys, seed phrases, or live-write enablement evidence into local files.

Task evidence is stored under `artifacts/implementation/`; the latest bootstrap run is stored under `artifacts/bootstrap/latest.json`. Reset and lifecycle commands will be expanded as the corresponding task phases are implemented.
