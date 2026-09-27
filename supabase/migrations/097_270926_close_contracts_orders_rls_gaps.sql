-- Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=claude-code Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/097_270926_close_contracts_orders_rls_gaps.sql
--
-- Migration 097: close two live RLS gaps in production (checked 27.09.2026
-- with a read-only query of pg_policies and role_table_grants).
--
-- 1. contracts_lifecycle had policy "authenticated read all" (SELECT, USING true):
--    every signed-in user could read every contract. The table has no owner or
--    organization column, so only service_role may access it.
-- 2. orders had orders_user_insert / orders_user_update for role PUBLIC: a
--    signed-in user could insert orders and change amount or status on their
--    own rows through the Data API. Orders are written only by the backend
--    (src/services/billing.service.ts, src/routes/stripe-webhook.routes.ts,
--    src/routes/b2b-payment.routes.ts), which uses the service-role key and
--    bypasses RLS. Users keep read access to their own orders.
--
-- Editing 084/086 does not change production: those versions are already
-- recorded (or were never applied), so this forward migration is the fix.
-- Idempotent: safe to re-run.
--
-- HIC applies (RED zone). Apply this file only, e.g. via the Supabase SQL
-- editor or `supabase migration up` after the history is reconciled.
-- Do NOT run `supabase db push`: repo and production migration history have
-- diverged (production 083/084 are different migrations than repo 083/084).

BEGIN;

-- 1. contracts_lifecycle: service_role only
DROP POLICY IF EXISTS "authenticated read all" ON public.contracts_lifecycle;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.contracts_lifecycle FROM authenticated;
GRANT SELECT ON public.contracts_lifecycle TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts_lifecycle TO service_role;
ALTER TABLE public.contracts_lifecycle ENABLE ROW LEVEL SECURITY;

-- 2. orders: users read their own rows; writes are service_role only
DROP POLICY IF EXISTS orders_user_insert ON public.orders;
DROP POLICY IF EXISTS orders_user_update ON public.orders;
DROP POLICY IF EXISTS authenticated_insert_own ON public.orders;
DROP POLICY IF EXISTS authenticated_update_own ON public.orders;

DROP POLICY IF EXISTS orders_user_view ON public.orders;
CREATE POLICY orders_user_view ON public.orders
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.orders FROM authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Verify after apply (expect: no rows)
-- SELECT tablename, policyname, cmd, roles FROM pg_policies
--  WHERE schemaname = 'public'
--    AND ((tablename = 'contracts_lifecycle' AND policyname = 'authenticated read all')
--      OR (tablename = 'orders' AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')));
