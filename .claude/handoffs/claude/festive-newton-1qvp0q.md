# Themis bridge principal boundary (handoff)

**Branch:** `claude/festive-newton-1qvp0q` (from `origin/main` b00f319)
**Updated:** 2026-09-27
**Status:** Code-level boundary implemented and tested; no production call site; no runtime evidence.

## Current state (facts)

| Item               | Value                                                                                                                           | Source                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Principal resolver | `resolveThemisPrincipal()` — operator/tenant from DWS access JWT, agent from `themis-bridge`-scoped `BROKER_AGENT_TOKENS` entry | `src/security/themis-principal.ts`                                |
| Issuer             | `issueThemisBridgeVerdict({ principal, ... })`; rejects non-minted principal and tenant mismatch                                | `src/security/runtime-auth.ts`                                    |
| Reserved gate      | `issueKyaVerdict()` refuses `themis-policy-gate`                                                                                | `src/security/runtime-auth.ts`                                    |
| Tests              | 15 impersonation/boundary tests; mutation-checked                                                                               | `src/__tests__/security/themis-principal.test.ts`                 |
| Decision + plan    | Field note + Learn HTML                                                                                                         | `docs/field-notes/2026-09-27-themis-bridge-principal-boundary.md` |

## Open items

1. HIC: agent ↔ operator/tenant binding (G2) before first call site.
2. First Themis route + route-level impersonation tests (plan in field note).
3. Provision `themis-bridge` scope in `BROKER_AGENT_TOKENS` — secret op, HIC approval.
4. Handoff gates 2–5 unchanged (runtime bearer validation, image/SBOM, OpenShell, pilot/audit/rollback, unapplied migrations 099/024).
