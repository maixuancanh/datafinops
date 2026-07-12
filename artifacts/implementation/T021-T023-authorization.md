# T021-T023 Authorization Evidence

**Observed:** 2026-07-11

Ten tenant/mode/role/direct-ID/list/export/job/service-account negative tests passed. Cross-tenant direct IDs return opaque not-found, mode mismatch is denied, exports require explicit scope, and service accounts cannot approve, sign, change policy, or enable live-write. OIDC issuer/subject mapping, RBAC principal scopes/authorities, mandatory repository predicates, and Fastify problem responses are implemented.

Four privileged-access tests passed: MFA and active role are required; break-glass is reasoned, audited, read-only, and limited to 60 minutes; expiry denies; role lifecycle transitions are explicit.
