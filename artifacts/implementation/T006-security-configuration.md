# T006 Security Configuration Evidence

**Observed:** 2026-07-11

Configured GitHub jobs for Gitleaks, prohibited-material validation, dependency audit, license inventory, SBOM, filesystem vulnerability scan, and provenance prerequisites.

Local verification exited zero:

```text
Security policy covers 12 surfaces and 12 field names.
Browser/server dependency boundary passed.
```

The workflow uses pinned major/action versions and grants only read contents plus security-event and OIDC permissions required by the declared jobs. CI execution evidence will be collected when a GitHub run is authorized and available.
