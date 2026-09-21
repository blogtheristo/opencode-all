# 2026-09-19 — Supabase Database Linter SECURITY warnings

# VERSION AND AGENT HISTORY

---

Version: 1.3 [Latest]

Sessions & Modifications:

- Version: 1.3 [Latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC item 5 — leaked-password protection required (Studio). 088 still DO NOT APPLY.
- Version: 1.2 [not latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC item 4 — caller map written (`2026-09-19-security-definer-caller-map.md`). 088 still DO NOT APPLY.
- Version: 1.1 [not latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC refused to run 088 — agent lacked dws6 repo awareness. File marked DO NOT APPLY. Prior 1.0 [not latest].
- Version: 1.0 [not latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: Advisor SECURITY dump field note; 088 not applied.

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

**Observed at:** 2026-09-19T00:51:14.175Z (HIC paste)
**Branch:** `cursor/supabase-advisor-warnings-3f7a`
**Status:** HIC REFUSED 2026-09-19 — do not apply `088_190926_advisor_security_linter.sql`.

HIC: agent is not aware of dws6 repository work enough. Accepted. 076 already said the Advisor 0028 sweep needs a **per-function review**, not a loop over every `prosecdef`. 088 skipped that.

## What the advisor reported

| Lint                                                 | Count (approx)     | Meaning                                                                                         |
| ---------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `function_search_path_mutable`                       | 60 function OIDs   | `search_path` not pinned; a hostile schema can hijack unqualified names inside SECURITY DEFINER |
| `extension_in_public`                                | `vector`, `citext` | Extensions live in the exposed API schema                                                       |
| `rls_policy_always_true`                             | 12 policies        | INSERT/UPDATE/DELETE/ALL with `USING (true)` / `WITH CHECK (true)`                              |
| `anon_security_definer_function_executable`          | 19                 | Anon can call owner-privileged RPCs                                                             |
| `authenticated_security_definer_function_executable` | 19                 | Signed-in users can call the same                                                               |
| `auth_leaked_password_protection`                    | Auth setting       | HaveIBeenPwned check is off — **dashboard only, no SQL**                                        |

Highest-risk RPCs in the dump: `mark_order_paid`, `confirm_order_deposit`, `create_b2b_order`, `issue_order_invoice`, `assign_external_user_role`, `increment_usage_counter`, `bump_project_version`.

Service-role `ALL (true)` policies on `agent_sessions`, `agent_tasks`, `bim_metadata`, `opencode_sessions` were created without `TO service_role` (`roles: ["-"]`), so they applied to every role that holds table GRANT.

Public-form `WITH CHECK (true)` on `web_leads`, `captain_inquiries`, `playbook_leads`, `blog_subscribers` is the intended anon insert path; the lint still flags the literal `true`. Authenticated UPDATE/DELETE on leads was also unrestricted.

## Studio “destructive operations” banner

Expected. The editor keyword-scans `REVOKE` and `ALTER EXTENSION`. 088 does **not** `DELETE`/`TRUNCATE` rows and does **not** `DROP TABLE`/`SCHEMA`/`FUNCTION`. Policies are `ALTER POLICY` in place.

## What 088 does

1. `ALTER FUNCTION … SET search_path = pg_catalog, public` for every public function missing a pin.
2. For every public SECURITY DEFINER function: `REVOKE EXECUTE` from `PUBLIC` and `anon`; `GRANT` to `service_role`. Authenticated EXECUTE is **kept only** for RLS helpers: `is_advisor`, `is_backoffice_admin`, `is_security_auditor`, `user_has_org_role`, `get_user_organizations`, `get_advisor_permissions`. Those six will still appear on lint 0029 until they move to a private schema.
3. `ALTER POLICY … TO service_role` on unrestricted ALL(true) policies (service_role already bypasses RLS).
4. Anon INSERT checks require a plausible email (and name / industry_slug where those columns exist). Authenticated write on `web_leads` / `captain_inquiries` / `blog_subscribers` requires `is_backoffice_admin()`.
5. `ALTER EXTENSION vector/citext SET SCHEMA extensions` when they still sit in `public`.

## Not in SQL

Leaked-password protection: Auth → Providers → Email → enable “Leaked password protection”.

## HIC decision (closed)

**Refuse 088.** Do not run it.

**Caller map (HIC item 4, 19.09.2026):** `docs/field-notes/2026-09-19-security-definer-caller-map.md`. Replacement SQL still not authorized — map is PENDING_REVIEW.

Gaps this session did not have before writing 088 (now checked, still not enough to apply):

| Repo fact                                                                                                          | Why 088 was unsafe to guess                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src/services/supabase.service.ts` uses **service_role**                                                           | Billing RPCs (`mark_order_paid`, `create_b2b_order`, …) would keep working **if** only that client calls them — not proven for dashboards |
| `DWS_SECURITY_STANDARD.md` §16: `increment_usage_counter` is SECURITY DEFINER with a **service_role caller guard** | Blanket REVOKE is the wrong unit of change                                                                                                |
| 076: “full sweep needs a **per-function review**”                                                                  | 088 did a `FOR f IN prosecdef` loop                                                                                                       |
| `web_leads` authenticated UPDATE is used as admin (070)                                                            | Switching to `is_backoffice_admin()` can lock Mission Control if `organization_members` is empty                                          |
| `vector` / `citext` columns (`playbook_leads.email`, memory search)                                                | `ALTER EXTENSION SET SCHEMA` not traced against `hybrid_memory_search` / dashboard types                                                  |

Leaked-password Auth toggle: HIC approved enable 19.09.2026 — `docs/field-notes/2026-09-19-auth-leaked-password-protection.md`. Still not SQL / not 088.

N/A — KB / Learn / Drive / calendar.
