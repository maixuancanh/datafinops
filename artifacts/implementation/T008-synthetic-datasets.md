# T008 Synthetic Dataset Evidence

**Observed:** 2026-07-11

TDD RED was observed with 9 expected missing-file failures. After adding eight committed datasets and provenance documentation:

```text
Test Files  2 passed (2)
Tests       18 passed (18)
```

Fixture package typecheck and formatting passed. Security configuration checks also passed. Every dataset declares schema/generator version, the fixed demo instant, synthetic origin, no customer data, and no signing material. The receipt is explicitly unfunded and sandbox-only.
