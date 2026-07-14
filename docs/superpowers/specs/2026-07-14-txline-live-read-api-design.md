# TxLINE Live Read API Design

## Goal

DataFinOps must use the real TxLINE read API when an activated API token is configured, while remaining demo-safe on machines without TxLINE credentials.

## Current context

The commercial web demo already explains a TxLINE World Cup 2026 spend workflow. The missing piece is a server-side data adapter that reads TxLINE fixture, odds, and score snapshots instead of only rendering static numbers.

## Design

Add a server-only TxLINE adapter under the Next.js console app. It reads `TXLINE_API_TOKEN` or `DATAFINOPS_TXLINE_API_TOKEN`, requests a guest JWT from the matching TxLINE host, then calls:

- `/api/fixtures/snapshot`
- `/api/odds/snapshot/{fixtureId}`
- `/api/scores/snapshot/{fixtureId}`

The adapter defaults to the mainnet host `https://txline.txodds.com`, but supports `TXLINE_API_ORIGIN` or `TXLINE_API_BASE_URL` for devnet.

## Safety boundaries

- API credentials are read only on the server.
- No token is exposed to client components.
- No wallet signing, subscription, purchase, activation, or live-write path is added.
- If credentials are absent or rejected, the UI falls back to synthetic demo data and shows a visible fallback banner.

## UI behavior

The `/demo` workflow and module pages show a shared data-source banner:

- `Live TxLINE API` when fixture snapshot reads succeed.
- `Synthetic fallback` when the token is missing or the read fails.

Hero metrics, workflow proof rows, launch cards, and module KPIs are derived from the same snapshot so the demo tells one coherent story.

## Verification

The implementation is acceptable only after typecheck, build, lint/format gates, diff checks, and a browser smoke test that confirms the fallback banner appears when no token is configured.
