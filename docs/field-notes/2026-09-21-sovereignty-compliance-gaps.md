# Sovereignty/Compliance Gaps vs. Palantir/Microsoft/AWS

**Date:** September 21, 2026
**Owner:** Claude Code (Sonnet 5)
**Status:** PENDING_REVIEW

## Context

Competitor read on Palantir (audit/lineage as first-class product), Microsoft (sovereignty zones — GCC as a separate cloud, not a compliance checkbox on the commercial one), and AWS (compliance sold as a visible dashboard feature) surfaced four candidate gaps. Investigation of this repo found the picture is better than the generic critique assumed, but two gaps were real and two need a decision before they're buildable.

## What already existed (found, not built this session)

- `command_audit_log` (071) and `kya_mandate_events` (074) — append-only, hash-chained (`prev_hash → event_hash` via `BEFORE INSERT` trigger), RLS denies UPDATE/DELETE/TRUNCATE to all roles.
- `article12_audit_log` (038) — append-only, honest residency fields (`inference_in_eu`, `pii_scrub_location`, `inference_location`) already declare that inference runs on Anthropic US infra while PII scrubbing runs in Helsinki.
- `sovereignty-monitor.agent.ts` — scores CLOUD Act exposure / EU residency / RLS coverage, but only against self-reported input, not live infra introspection.

## Shipped this session

1. **Queryable compliance proof** (`src/compliance/audit-proof.ts`, route `GET /api/v1/compliance/proof`) — turns the three audit tables above into one certificate an auditor can request instantly: access allow/deny counts + denied samples, mandate-gating violations, EU residency declaration, and hash-chain integrity verification for the requested window. This directly answers "prove no unauthorized access" and "prove data declared where it ran" without a manual SQL pull.
2. **Found and surfaced, not fixed**: `article12_audit_log` has no hash chain (no `prev_hash`/`event_hash` columns — unlike 071 and 074) and no `org_id` column, so the residency section of the certificate is platform-wide, not per-tenant, and its rows can't be chain-verified. The proof certificate reports this honestly (`hashChained: false`, `scope: 'platform-wide'`) rather than hiding it.

## Deferred — need a decision, not a code change

- **EU-sovereign deployment tier.** Product/infra decision: which EU-sovereign provider (Hetzner/OVHcloud/Scaleway/Supabase EU are already in `sovereignty-monitor.agent.ts`'s allow-list) to productize as a sellable tier, and at what price point. Not a surgical code change.
- **Clearance/entitlement model.** `auth.middleware.ts` is flat RBAC (`role` on the JWT, `requireRole` middleware) — no clearance-level/compartmentalization concept (the Palantir pattern). Needs a decision on what clearance taxonomy DWS customers actually need before any schema work starts.
- **Data lineage tracking.** No table exists — only doc mentions (`docs/PHD_FIREHORSE_FI.md` etc.). Needs its own schema design and migration, reviewed as its own unit rather than folded into this PR.
- **`article12_audit_log` hardening.** Add `org_id` (for per-tenant residency proof) and a hash chain (for tamper evidence matching 071/074) — small, but its own migration.

## HIC decision needed

Which of the four deferred items should be scoped next: sovereign deployment tier, clearance/entitlement model, data lineage tracking, or `article12_audit_log` hardening?
