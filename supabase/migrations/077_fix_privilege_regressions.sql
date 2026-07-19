-- Migration 077: Fix privilege regressions introduced by the applied 075
--
-- The version of 075_public_schema_grants originally applied to production
-- (remote 20260719202340) granted table CRUD and function EXECUTE broadly,
-- which silently undid two classes of deliberate hardening (caught in PR
-- #1709 review):
--
--   1. Append-only audit tables had UPDATE/DELETE/TRUNCATE revoked at the
--      table level (038/041 article12_audit_log, 071 command_audit_log,
--      074 kya_mandate_events + kya_tenant_gating_profiles). The blanket
--      "grant ... on all tables" re-granted UPDATE/DELETE to authenticated
--      and service_role on those tables.
--   2. service_role-only functions (046/048 ted_outreach_*) had EXECUTE
--      revoked from PUBLIC; the blanket "grant execute on all functions to
--      authenticated" made them callable by end users.
--
-- This migration restores both. Ordinary functions remain callable by
-- authenticated via PostgreSQL's default PUBLIC EXECUTE grant — only
-- functions whose owners deliberately revoked PUBLIC go back behind
-- service_role.
--
-- Idempotent. Safe to re-run.

BEGIN;

-- 1. Restore append-only guarantees on audit/evidence tables.
--    (TRUNCATE was never re-granted by 075 but is included for parity with
--    the original hardening statements.)
REVOKE UPDATE, DELETE, TRUNCATE ON article12_audit_log        FROM PUBLIC, authenticated, service_role;
REVOKE UPDATE, DELETE, TRUNCATE ON command_audit_log          FROM PUBLIC, authenticated, service_role;
REVOKE UPDATE, DELETE, TRUNCATE ON kya_mandate_events         FROM PUBLIC, authenticated, service_role;
REVOKE UPDATE, DELETE           ON kya_tenant_gating_profiles FROM PUBLIC, authenticated;
REVOKE TRUNCATE                 ON kya_tenant_gating_profiles FROM PUBLIC, authenticated, service_role;

-- 2. Withdraw the blanket function EXECUTE from authenticated (075 applied
--    it; corrected 075 no longer grants it). Explicit per-function grants
--    to authenticated, where they exist, are unaffected.
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM authenticated;

COMMIT;
