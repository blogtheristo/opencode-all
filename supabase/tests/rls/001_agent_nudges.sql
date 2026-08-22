-- RLS policy tests: agent_nudges (migration 069)
--
-- Contract under test (multi-tenant safety):
--   * org members see only their own org's nudges
--   * service role bypasses RLS
--   * unauthenticated (anon) access is denied
--
-- STATUS: SCAFFOLD — no assertions yet. Intentionally uses no_plan() so it
-- cannot report fake green checks. Implementing this requires a sandbox
-- schema with migration 069's table + RLS statements applied verbatim.
--
-- Run against a real Postgres with pgTAP installed:
--   pg_prove -d "$DATABASE_URL" supabase/tests/rls/*.sql
--   (or: npm run db:test:rls)

BEGIN;
SELECT no_plan();

-- TODO(hardening): fixture plan —
--   1. CREATE SCHEMA rls_test; apply migration 069 DDL verbatim inside it.
--   2. Insert one nudge per org (org_a, org_b).
--   3. SET ROLE org_a → assert count(*) = 1 (own rows only).
--   4. SET ROLE org_b → assert count(*) = 1 and org A's row invisible.
--   5. SET ROLE anon → assert SELECT denied.
--   6. Assert service_role bypasses RLS (sees both).
--   7. Assert cross-org UPDATE/DELETE returns 0 rows affected.

SELECT finish();
ROLLBACK;
