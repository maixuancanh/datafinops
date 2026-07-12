# T028 Prohibited Material Evidence

**Observed:** 2026-07-11

TDD RED was observed before the prefilter existed. Nine package corpus tests and eleven broader security tests passed. Fake signing-like values across headers, JSON, CSV, files, errors, queues, arrays, and encoded content are rejected before durable logging. Safe sinks record only correlation and `PROHIBITED_SIGNING_MATERIAL`; raw values never appear. Public wallet references and normal aggregate data remain allowed.
