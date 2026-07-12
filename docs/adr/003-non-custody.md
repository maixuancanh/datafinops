# ADR-003: Browser-only signing and isolated operating modes

- Status: Accepted
- Date: 2026-07-11

## Decision

DataFinOps never accepts private signing material. The server may build an approved unsigned envelope and verify a signed public transaction; signing exists only in the browser wallet package. Sandbox, devnet, live-read, and live-write are separate capabilities. Live-write is tenant-scoped, evidence-bound, and disabled by default.

## Consequences

Server packages cannot import wallet-client code. Prohibited material is rejected before durable logging. Confirmation, activation, and entitlement remain distinct; activation failure cannot trigger repurchase.

## Verification

Dependency-boundary, secret-corpus, transaction mutation, mode-isolation, duplicate-operation, no-repurchase, and emergency-stop tests are mandatory.
