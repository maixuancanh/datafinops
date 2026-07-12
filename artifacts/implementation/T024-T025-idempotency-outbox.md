# T024-T025 Idempotency and Outbox Evidence

**Observed:** 2026-07-11

TDD RED was observed before operation functions existed. Three PostgreSQL integration tests passed: concurrent request replay executes the handler once and returns the original result; domain result and outbox roll back together on failure; reordered/duplicate consumer delivery records one logical consumption. Advisory transaction locks and unique scoped keys provide exactly-once logical behavior over at-least-once delivery.
