# 2026-09-19 — SECURITY DEFINER / RPC caller map (dws6 repo)

# VERSION AND AGENT HISTORY

***

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC item 4 — per-function caller map from this repository. Does not apply 088.

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

***

**Standards loaded:** DWS_DOCUMENT_STANDARD.md, DWS_SECURITY_STANDARD.md §16, DWS_TRUTH_STANDARD.md, DWS_ROLES_REGISTRY.md.

**Scope:** Static callers in this git tree (2026-09-19). Not a live Postgres catalog. **088 stays unapplied.**

**Method:** `rg` for `.rpc('…')`, `SELECT * FROM <fn>(`, function names from the advisor high-risk list and 088 RLS-helper list. Frontend `dws6.com/` / `dws10.com/` have **no** `supabase.rpc` calls.

## Client keys in this repo

| Module | Key | Role |
| --- | --- | --- |
| `src/services/supabase.service.ts` | `SUPABASE_SERVICE_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | service_role |
| `src/config/supabase.ts` | same | service_role |
| `src/routes/memory.routes.ts` `getSupabase()` | `SUPABASE_SERVICE_KEY` | service_role |
| `src/firehorse/database.ts` | `SUPABASE_SERVICE_KEY` | service_role |
| `src/investor-reports/scheduler.ts` | `SUPABASE_SERVICE_KEY` | service_role |
| Other `src/**` `createClient` sites checked | service key, not anon | service_role |

No PostgREST caller in-repo uses the anon JWT to hit the high-risk billing RPCs. That does **not** prove Studio / ad-hoc SQL / a forgotten dashboard never will. PUBLIC + anon EXECUTE is still the advisor finding.

## High-risk functions (advisor dump)

| Function | Kind | In-repo caller | Client | 088 revoke PUBLIC/anon? | Notes |
| --- | --- | --- | --- | --- | --- |
| `mark_order_paid` | RPC | `src/services/billing.service.ts:331`; `src/routes/b2b-payment.routes.ts:362`; `src/routes/stripe-webhook.routes.ts:75` | service_role (`supabase.service.ts`) | Would keep working **if** only these paths call it | Stripe webhook + B2B confirm. No dashboard `.rpc`. |
| `create_b2b_order` | RPC | `src/routes/b2b-payment.routes.ts:159` | service_role | Same | Behind `requireAuth` on the HTTP route; DB still runs as service_role. |
| `confirm_order_deposit` | RPC | `src/routes/b2b-payment.routes.ts:249` | service_role | Same | |
| `issue_order_invoice` | RPC | `src/routes/b2b-payment.routes.ts:305` | service_role | Same | |
| `create_company_billing_profile` | RPC | `src/routes/b2b-payment.routes.ts:52` | service_role | Same | Not on the original “highest-risk” paste; same client. |
| `increment_usage_counter` | RPC | `src/services/usage-metering.service.ts:132` | service_role (`src/config/supabase.ts`) | Function **already** raises if JWT role ≠ `service_role` (043) | Security Standard §16. Blanket REVOKE is redundant with the guard; still do not loop-revoke every prosecdef. |
| `assign_external_user_role` | **TRIGGER** on `auth.users` | No `.rpc` — `080`/`081` `EXECUTE FUNCTION` | Trigger owner; `GRANT EXECUTE` already `service_role` | Revoking authenticated is likely fine; do not treat as a user RPC | Trigger, not PostgREST. |
| `bump_project_version` | unknown | **No match** in repo (except this session’s field notes) | — | **Do not revoke until found** in Studio / another branch / types-only leftover | Named in the HIC paste. Absent from `src/`. |

## Other `.rpc` / SQL function calls

| Function | Caller | Client | DEFINER? (migration text) |
| --- | --- | --- | --- |
| `decay_stale_memories` | `src/routes/memory.routes.ts:129`; `src/agents/memory.service.ts` via `callDbFunction` / pool | service_role **and** direct Postgres pool | 049 function (pg_cron also 051) |
| `hybrid_memory_search` | `src/agents/memory.service.ts` SQL `SELECT * FROM hybrid_memory_search(` | backend pool, not PostgREST | Extension/`vector` move in 088 **untraced** vs this SQL |
| `get_country_context` | `src/firehorse/database.ts:212` | service_role | 003: `IMMUTABLE`, not DEFINER |
| `calculate_monthly_metrics` | `src/investor-reports/scheduler.ts:139` | service_role | 006: not marked DEFINER in the header read |
| `get_pending_approvals_with_details` | `AgentFoundry/scripts/director_dashboard.py` | that script’s supabase client | Out of Express backend; review before REVOKE authenticated |
| `next_migration_number` | `mcp-servers/claude_DEPRECATED/server.py` | deprecated MCP | Do not design 088 around this |
| `get_table_info` | `mcp-servers/cloud-run-gateway-ts/src/server.ts` | that server’s `db` | Review separately |

## RLS helpers (088 would **keep** authenticated EXECUTE)

| Function | Callers in repo |
| --- | --- |
| `is_backoffice_admin()` | Policies in `011`, `026`, and 088 `ALTER POLICY` on `web_leads` / `captain_inquiries` / `blog_subscribers`. **Not** called from TypeScript. 070 admin UPDATE on `web_leads` as `authenticated` can lock Mission Control if `organization_members` is empty (helper is owner/admin on that table). |
| `is_advisor`, `is_security_auditor`, `user_has_org_role`, `get_user_organizations`, `get_advisor_permissions` | SQL policies / 007 / 026. No `.rpc` from `src/`. Must remain executable by `authenticated` or RLS breaks. |

## What this map does **not** authorize

- Applying `088_190926_advisor_security_linter.sql` (still a `prosecdef` loop + extension move).
- A replacement migration. Next SQL, if any, must be **one function or one policy family per reviewed hunk**, each row above ticked by HIC.
- Enabling leaked-password protection (Auth dashboard; not in this map).

N/A — Drive / calendar. Learn/ HTML not rendered this step.
