# TxLINE Module Pages Design

## Intent

Turn the six demo launch cards into real buyer-facing sandbox modules instead of placeholder pages. Each linked route must visibly explain a TxLINE World Cup 2026 workflow: fixture coverage, odds/scores replay, optimization, proposal governance, savings evidence, renewal risk, or usage metering.

## Approach

Keep the implementation static and deterministic inside `apps/console`. Add shared World Cup module data and a reusable module page component under `(workspace)`, then render route-specific content for `/portfolio`, `/scenarios`, `/proposals/demo-proposal-001`, `/savings`, `/renewals`, and `/usage`.

## Safety boundaries

- No real TxLINE token.
- No live API calls.
- No funded wallet.
- No live-write.
- All proofs, hashes, event counts, and fixture references are synthetic sandbox evidence.

## Success criteria

- Every “Open module” card lands on a page with TxLINE and World Cup 2026-specific content.
- Pages include concrete KPIs, records, evidence/proof rows, and next action labels.
- Console typecheck/build passes.
- Browser smoke clicks all six module cards from `/demo` and confirms non-placeholder module copy.
