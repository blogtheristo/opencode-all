# 2026-09-19 — Supabase Database Linter SECURITY warnings

**Observed at:** 2026-09-19T00:51:14.175Z (HIC paste)
**Branch:** `cursor/supabase-advisor-warnings-3f7a`
**Status:** PENDING_REVIEW — migration `088_advisor_security_linter.sql` is in repo only; not applied.

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

## What 088 does

1. `ALTER FUNCTION … SET search_path = pg_catalog, public` for every public function missing a pin.
2. For every public SECURITY DEFINER function: `REVOKE EXECUTE` from `PUBLIC` and `anon`; `GRANT` to `service_role`. Authenticated EXECUTE is **kept only** for RLS helpers: `is_advisor`, `is_backoffice_admin`, `is_security_auditor`, `user_has_org_role`, `get_user_organizations`, `get_advisor_permissions`. Those six will still appear on lint 0029 until they move to a private schema.
3. Drop unrestricted service-role-named `ALL (true)` policies (service_role already bypasses RLS).
4. Anon INSERT checks require a plausible email (and name / industry_slug where those columns exist). Authenticated write on `web_leads` / `captain_inquiries` / `blog_subscribers` requires `is_backoffice_admin()`.
5. `ALTER EXTENSION vector/citext SET SCHEMA extensions` when they still sit in `public`.

## Not in SQL

Leaked-password protection: Auth → Providers → Email → enable “Leaked password protection”.

## HIC decision needed

1. Apply 088 on staging, then production? (YELLOW/RED apply — needs explicit go-ahead.)
2. Enable leaked-password protection in the Auth dashboard?
3. Accept remaining lint 0029 on the six RLS helpers, or schedule a follow-up that moves them to a private schema?

N/A — KB compile / Learn HTML / Drive export / calendar: this note is the session outcome; no dated external commitment besides the apply decision above.
