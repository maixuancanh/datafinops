# DataFinOps Demo Screenplay and Voice-over

**Format:** English, 16:9, 1920x1080, 30 fps

**Target duration:** 4:15 (255 seconds)

**Audience:** procurement, product/trading operations, finance, security, and engineering leaders

**Data:** synthetic pricing, usage, revenue, wallet references, transaction receipt, entitlement, and savings

## Creative Direction

Use the fictional tenant `Crescent Markets Sandbox` with a persistent Sandbox banner and `Live write disabled` badge. Cost figures use clearly labeled demo currency `USD` and synthetic amounts. The wallet scene is an in-app deterministic signer simulation with no browser extension, funded account, private-key field, or live network.

## Timed Script

### 00:00–00:20 — Procurement without guesswork

**Picture:** Open Portfolio with the current TxLINE subscription and over-provisioning callout. Title: “Buy the coverage you need — and prove it.”

**Voice-over:**

“Sports data procurement often lives in spreadsheets disconnected from real usage, fixture schedules, latency requirements, and entitlement state. DataFinOps makes the decision reproducible from baseline to realized savings.”

### 00:20–00:48 — Verified baseline

**Picture:** Show verified sandbox connection: network, program, API host, public wallet reference, pricing freshness, subscription, API entitlement, exact current cost, and source hashes.

**Voice-over:**

“This sandbox connection verifies the expected network, program, pricing, current subscription, and API entitlement. The wallet is a public reference only. DataFinOps never stores a private key or seed phrase.”

### 00:48–01:15 — Business inputs and requirements

**Picture:** Import synthetic aggregate usage and show product allocation. Open requirements with required leagues, maximum latency, planning period, and a visible unallocated-cost row.

**Voice-over:**

“Synthetic aggregate usage is mapped to products and cost centers. Unallocated spend remains visible. Operations then defines hard league, fixture, latency, effective-date, and budget requirements separately from soft preferences.”

### 01:15–01:48 — Deterministic optimization

**Picture:** Run optimizer. Show immutable snapshot hash, current versus recommended configuration, exact costs, forecast delta, coverage diff, confidence, rejected candidates, and `Hard constraints: PASSED`.

**Voice-over:**

“The optimizer freezes every input and computes valid configurations deterministically. A separate verifier checks every hard constraint. The selected candidate reduces projected cost while preserving required coverage, and rejected alternatives explain exactly which requirement they fail.”

### 01:48–02:12 — Challenge the recommendation

**Picture:** Add a hard knockout-fixture requirement and rerun. The recommendation changes; prior run remains accessible with its original hash.

**Voice-over:**

“Now we add a hard requirement for an upcoming knockout fixture. DataFinOps creates a new snapshot and a different recommendation. It never relaxes the requirement, and the prior decision remains immutable and replayable.”

### 02:12–02:46 — Govern with separation of duties

**Picture:** Create proposal. Approve as Procurement, switch role, approve as Finance. Show proposal hash, policy, amount limit, approval graph, expiry, and `READY TO SIGN`.

**Voice-over:**

“The recommendation becomes a versioned proposal governed by policy. Procurement and finance approve the exact proposal hash under separate roles and limits. Any material price, requirement, network, amount, or effective-date change invalidates these approvals.”

### 02:46–03:17 — Non-custodial signing

**Picture:** Open transaction summary. Show Sandbox, network, program, public signer, subscription changes, exact amount, expiry, and hashes. Select **Sign with demo signer** and submit the simulation receipt.

**Voice-over:**

“Only after final approval does DataFinOps create an unsigned, expiring transaction envelope. The human summary is bound to the same fields. This deterministic demo signer runs client-side; there is no private-key input and no funded transaction.”

### 03:17–03:47 — Verify effective entitlement

**Picture:** Advance transaction to confirmed, then activation and entitlement verified. Timeline shows distinct stages and one operation.

**Voice-over:**

“Transaction confirmation is only one checkpoint. DataFinOps separately verifies subscription state, API activation, league coverage, latency, effective period, and proposal match. Duplicate callbacks still create one logical operation and never a second purchase.”

### 03:47–04:06 — Close realized savings

**Picture:** Close synthetic period. Show forecast versus realized, approved baseline, actual cost, verification link, exact calculation, and evidence hash.

**Voice-over:**

“At period close, synthetic actual spend is reconciled against the approved baseline and verified entitlement. Only then does the ledger label the delta realized. Corrections append reversals instead of rewriting history.”

### 04:06–04:15 — Close

**Picture:** End on audit evidence and badge `Live write disabled`. End card: “DataFinOps — optimize cost, preserve coverage, verify value.”

**Voice-over:**

“Optimize cost, preserve coverage, and verify value. That is DataFinOps.”

## Capture Notes

- Never open a real wallet extension or show a secret-input control.
- Keep `Hard constraints: PASSED`, proposal hash, Sandbox mode, and entitlement verification readable.
- Label every financial value and outcome as synthetic demo data.
- Use the exact selector contract in `ux-spec.md` and fixed replay clock.
- Final duration must not exceed 270 seconds.
