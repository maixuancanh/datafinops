# DataFinOps Commercial V1 runbook links

- Sources: verify freshness and block unknown semantics.
- Optimizer: replay snapshot and compare material hash.
- Proposals/transactions: invalidate on material change; stop live-write gate.
- Activation/entitlement: never repurchase; open recovery incident.
- Savings: close only after complete-input watermark.
- Infrastructure: native Windows PostgreSQL/Redis/S3rver checks; restore evidence under `artifacts/foundation/`.
