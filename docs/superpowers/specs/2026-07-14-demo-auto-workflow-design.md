# Demo Auto Workflow Design

## Intent

Make `/demo` feel like a complete guided product workflow, not a module launcher. The page should tell a six-step TxLINE World Cup 2026 story from coverage ingestion through final decision.

## Workflow

1. Ingest World Cup coverage: fixture snapshot, TxLINE odds/scores feeds, coverage hash.
2. Detect spend problem: duplicate odds feed, overpaid latency tier, missing sponsor-trigger proof.
3. Run optimization scenario: current versus candidate with hard requirement pass/fail checks.
4. Generate governed proposal: `WC26-2048`, material hash, approvals, expiry, signer status.
5. Validate proof pack: fixture hash, odds replay, scores replay, validation proof, settlement envelope.
6. Decide next action: approve safe savings, watch renewal risk, block unsafe settlement change.

## Auto-run behavior

Add an `Auto-run demo` button. When pressed, the active workflow step advances automatically on a timer, loops through the six steps once, and can be paused/reset manually. Manual step buttons remain available.

## Safety

This remains a deterministic sandbox. No live TxLINE token, no funded wallet, no live-write, no network fetches.
