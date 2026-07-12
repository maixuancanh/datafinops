# T013 Contract Lint Evidence

**Observed:** 2026-07-11

TDD RED was observed when the contract inspection helper did not exist. The final contract suite parses OpenAPI 3.1, AsyncAPI 3.0, and both Draft 2020-12 schemas; validates JSON Schemas with Ajv; resolves local files and internal JSON pointers; rejects prohibited signing-material fields; and requires closed transaction objects.

Result: 4/4 schema-lint tests passed with strict test-package typecheck.
