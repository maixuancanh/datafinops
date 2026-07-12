# T010 Observability Evidence

**Observed:** 2026-07-11

TDD RED was observed when `packages/observability/src/index.ts` was absent. After implementation, 2/2 tests passed with package typecheck and root lint green.

The tests prove recursive signing-secret, credential, and finance redaction across structured logs, metric attributes, trace span attributes, and captured errors. Log fields are allowlisted; unexpected attributes are dropped. The package exposes OpenTelemetry-compatible span/metric concepts and Sentry-compatible redacted error capture without coupling domain code to a vendor SDK.
