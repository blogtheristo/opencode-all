# Supabase Audit + Aiven Deployment Plan

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code | Session: claude/supabase-audit-aiven-td3x8r | Date: 02.07.2026 | Changes: Wired the ERP integration module (all 6 connectors incl. Dynamics 365) into `src/app.ts`. Un-excluded `src/integrations/erp/**/*` from `tsconfig.json`, fixed the ~80 pino logger call-order errors + 47 missing `.js` ESM extensions + an `export *` name collision + a handful of real type errors that were the actual reason the module was excluded — validated with `npm install`, a clean `npm run build`, and a live `dist/app.js` boot (server starts, `GET /api/v1/erp/registry` returns real data, clean shutdown). One pre-existing functional gap surfaced and left flagged rather than guessed at: `scheduler.ts`'s machine-data/OEE sync jobs fetch data but never pass it to the sync call.
- Version: 1.1 | Tool: Claude Code | Session: claude/supabase-audit-aiven-td3x8r | Date: 02.07.2026 | Changes: Applied migration 073 to the live `dws6` Supabase project (`kpucuwwfhuwurdxyjjtz`) via the Supabase MCP connector — `erp_integrations`/`erp_webhook_events`/`erp_sync_operations` now exist live, RLS enabled, no advisory findings. Founder resolved the Aiven sovereignty Open Question: approved Aiven-managed PostgreSQL on `google-europe-north1` as the dws6.com (DWS IQ 6) DB layer, recorded in `DWS_SECURITY_STANDARD.md` §17.5 as an explicit exception with residual risk noted, not a "None" CLOUD Act rating.
- Version: 1.0 | Tool: Claude Code | Session: claude/supabase-audit-aiven-td3x8r | Date: 02.07.2026 | Changes: Full Supabase audit (new Dynamics 365 connector, migration completeness, backup posture, doc currency) + Aiven deployment plan, with sovereignty conflict flagged as an open decision.

Document Status:

- Created: 02.07.2026
- Last Modified: 02.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Audit Summary

Full audit requested: new ERP connector, SQL migration completeness, backup posture, documentation currency, and an Aiven deployment plan. Findings and remediation below.

### 1. New connector — Microsoft Dynamics 365

`src/integrations/erp/connectors/dynamics365-connector.ts`, part of the 6-connector ERP integration module (Monitor, IFS, Dynamics 365, SAP, Visma, Jeeves) added 2026-05-17. Documented correctly in `docs/ERP_INTEGRATIONS.md`.

Two gaps found and their disposition:

- **Missing schema (fixed and applied).** `src/integrations/erp/service.ts` reads/writes `erp_integrations`, `erp_webhook_events`, `erp_sync_operations` — no migration created them. Added `supabase/migrations/073_erp_integration_tables.sql` (RLS on all three, service-role bypass + org-member read policy, matches the `api_keys`/`organization_members` pattern from migrations 007/043). **Applied 2026-07-02** to the live `dws6` project (`kpucuwwfhuwurdxyjjtz`) via `mcp__Supabase__apply_migration` at the user's explicit request; verified live with `list_tables` (all three exist, RLS enabled) and `get_advisors` (zero findings referencing the new tables).
- **Wired into the running app (fixed 2026-07-02).** `tsconfig.json` excluded `src/integrations/**/*` from the build entirely (line 32) — not an oversight, but because the erp module didn't actually compile. With `npm install` run and `src/integrations/erp/**/*` carved out of the exclude (siblings `docusign`/`ec3`/`esg`/`iceye`/`trade` left excluded, not separately validated), the real errors were: ~80 pino logger calls using `(msg, obj)` instead of pino's `(obj, msg)` convention, 47 intra-module relative imports missing the `.js` extension Node's ESM loader requires at runtime (tsc's `bundler` resolution doesn't catch this — a live `dist/app.js` boot did), an `export *` collision between two separate company→ERP mapping implementations, an axios interceptor type mismatch, and a string-literal-vs-string-enum type mismatch. All fixed; `npm run build` is clean and a live boot confirms `GET /api/v1/erp/registry` serves real data end-to-end. Full detail in the commit message (`c0fa879`). One pre-existing gap left flagged, not silently fixed: `scheduler.ts`'s machine-data/OEE sync jobs fetch pending records but never pass them into the sync call — needs someone who knows the `machine_telemetry` table shape to complete the mapping.

### 2. Migration completeness

101 files in `supabase/migrations/`. The 13 duplicate-numbered pairs are intentional, pre-existing tech debt (documented in the README, not a defect). Fixed two README inaccuracies:

- `050` was listed as an unused/available sequence number — `050_memory_consolidation.sql` exists and is applied. Corrected.
- Dead migrations were documented as `*_OLD.sql`, but commit `5d563cd` renamed them all to `*_DEPRECATED.sql`. README updated to match, and version-bumped to v1.1.

Live-DB cross-check (`list_tables`/`list_migrations`/`get_advisors` against the running Supabase project) was **not possible** — the Supabase MCP server disconnected mid-session. Recommend re-running that check before treating "migrations complete" as fully verified.

### 3. Backups

No gaps. Daily `pg_dump` to 4 destinations (local, Proton Drive, Acer Veriton Helsinki, GitHub Actions), GPG AES-256 at rest, documented RPO 24h / RTO 4h (1h Aiven failover), tested restore path (`scripts/db-backup-test.sh`, `scripts/daily/db-restore-verify.sh`). `DWS_SECURITY_STANDARD.md` §3.6.1 accurately describes what the scripts actually do.

### 4. Documentation currency

Fixed:

- `DWS_SECURITY_STANDARD.md` §17.5 cited "AGENTS.md Section 20 (Deployment Architecture)" — that section does not exist (AGENTS.md tops out at Section 8). Repointed to `docs/DEPLOYMENT_ARCHITECTURE_ENTERPRISE.md`.
- `supabase/migrations/README.md` — see §2 above.

Not fixed (needs a decision, not a doc edit) — see §5.

## 5. Aiven Deployment Plan

**Status: sovereignty question resolved 2026-07-02 (founder decision). Plan below is now unblocked for Stages 1–3; Stage 4 (production cutover) remains its own future PR.**

### Resolution

Founder decision: approve Aiven-managed PostgreSQL on `google-europe-north1` as the dws6.com (DWS IQ 6) database layer. Recorded in `DWS_SECURITY_STANDARD.md` §17.5 as an **explicit sovereignty exception**, not a "None" CLOUD Act rating — the residual risk (Aiven's US-VC ownership, and GCP being elsewhere classified "Transitional"/migrate-away for DWS compute) is documented there, not hidden. No script changes were required: `scripts/aiven-vault-bootstrap.sh` and `mcp-hub/config/aiven-mcp.json` already defaulted to `google-europe-north1`.

### The conflict (as it stood before resolution)

`DWS_SECURITY_STANDARD.md` §17.5 (dated 2026-03-26, marked "PERMANENT SECURITY RULE") lists Aiven as a **"Yellow flag"** — Finnish company, US-VC-backed, "unclear" CLOUD Act exposure — approved only when its "DB layer runs on Hetzner infra." Two other repo artifacts disagree and predate or ignore that rule:

- `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md` (16 days _before_ the rule) says Aiven has "no CLOUD Act exposure" outright.
- `scripts/aiven-vault-bootstrap.sh` and `mcp-hub/config/aiven-mcp.json` both default to `google-europe-north1` — Aiven's own **Google Cloud** region, not Hetzner.

New finding this session: **Aiven does not offer Hetzner as a deployable cloud provider.** Its supported infrastructure is AWS, Google Cloud, Azure, OVHcloud, Oracle Cloud, Exoscale, and UpCloud ([Aiven — Available cloud regions](https://aiven.io/docs/platform/reference/list_of_clouds)). Aiven BYOC (Bring Your Own Cloud) could theoretically run Aiven's control plane on Hetzner-owned hardware, but that's an unconfirmed enterprise feature nothing in this repo currently uses or documents. As literally written, §17.5's approval condition for Aiven is **not achievable** with the tooling that exists today. I've recorded this as an Open Question in `DWS_SECURITY_STANDARD.md` §17.5 rather than silently picking a resolution — it changes DWS's sovereignty posture and should be a human call.

### Plan, staged so it's usable regardless of which way that question resolves

**Stage 0 — Resolve the sovereignty question. DONE (2026-07-02).** Founder chose: accept Aiven-managed `google-europe-north1` as sufficiently sovereign for the dws6.com DB layer, recorded as an explicit exception in §17.5.

**Stage 1 — Provisioning (already scripted, just needs the target confirmed).** `scripts/aiven-vault-bootstrap.sh` creates the Aiven PostgreSQL service (`avn service create`) and vault; update its `AIVEN_CLOUD` default once Stage 0 lands. `docs/field-notes/2026-03-10-v1-aiven-plan-decision.md`'s Developer ($5/mo dev) + Startup ($75/mo prod) plan sizing is still reasonable and doesn't need to change.

**Stage 2 — Schema parity.** `scripts/aiven-init.sql` already handles the two things Aiven-vs-Supabase differ on: pgvector extension enable, and `auth.uid()`/`auth.jwt()`/`auth.role()` stub functions so RLS policies created against Supabase's `auth` schema don't fail on Aiven (which has no `auth` schema). Run once per new Aiven service. No changes needed — this part is correct as-is.

**Stage 3 — Data migration / ongoing mirror.** `scripts/db-recovery.sh --target aiven` replays all migrations in order (schema-only) for a fresh Aiven instance; `Mirror-ToAiven.ps1` handles the daily production→Aiven data mirror via `pg_restore` with row-count delta verification (>5% triggers a warning). Both already exist and are exercised daily per `DWS_SECURITY_STANDARD.md` DR-5. No changes needed for the _mirror_ path — only the _primary/production_ cutover is gated on Stage 0.

**Stage 4 — Cutover (if Aiven becomes primary, not just a mirror/DR target).** Not currently scripted — today Aiven is a **DR failover + agent-sandbox mirror**, not the production database. If Stage 0 resolves toward making Aiven (or self-hosted Hetzner Postgres) the primary, that's a separate, larger migration: connection-string cutover across `src/config/supabase.ts` and every service using `getSupabaseClient()`, a maintenance-window data freeze + final sync, and RLS/auth re-validation against the `auth.*` stub functions (which are currently a "good enough for sandbox" approximation, not audited for production-grade RLS equivalence). Scope this as its own PR once Stage 0 is decided — do not fold it into this audit's fixes.

### What's NOT part of this plan

Wiring the ERP module into the live app was unrelated to the Aiven question — see §1, done 2026-07-02.

---

(c) 2026 Lifetime Oy — Field Note
