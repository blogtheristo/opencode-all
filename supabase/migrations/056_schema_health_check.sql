-- Migration 056: Schema Health Check (dry-run diagnostic)
-- Date: 2026-04-07
-- Author: Boardy (DWS6 Systems Architect)
-- Purpose: Runtime verification of RLS, SECURITY DEFINER, and schema hygiene.
--          This migration creates NO tables and modifies NO data.
--          It only emits RAISE NOTICE diagnostics for operator review.
--
-- Run with: psql -f 056_schema_health_check.sql
-- Or via Supabase Dashboard > SQL Editor (read the NOTICE output)
--
-- Introduced-In: PR-TBD
-- Code-Version: 1.0
-- Branch: claude/check-supabase-schema-LS5eZ

BEGIN;

-- ============================================================
-- CHECK 1: Public tables without Row Level Security
-- ============================================================
DO $$
DECLARE
  r RECORD;
  found_count INT := 0;
BEGIN
  RAISE NOTICE '=== CHECK 1: Tables WITHOUT Row Level Security ===';
  FOR r IN
    SELECT schemaname, tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE '__%'
    ORDER BY tablename
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = r.schemaname
        AND c.relname = r.tablename
        AND c.relrowsecurity = true
    ) THEN
      RAISE NOTICE 'CRITICAL — Missing RLS: %.%', r.schemaname, r.tablename;
      found_count := found_count + 1;
    END IF;
  END LOOP;

  IF found_count = 0 THEN
    RAISE NOTICE 'OK — All public tables have RLS enabled.';
  ELSE
    RAISE NOTICE 'FOUND % table(s) without RLS.', found_count;
  END IF;
END $$;

-- ============================================================
-- CHECK 2: Views with SECURITY DEFINER (should be INVOKER)
-- ============================================================
DO $$
DECLARE
  r RECORD;
  found_count INT := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CHECK 2: Views with SECURITY DEFINER ===';
  FOR r IN
    SELECT schemaname, viewname
    FROM pg_views
    WHERE schemaname = 'public'
    ORDER BY viewname
  LOOP
    -- pg_class.relrowsecurity doesn't apply to views; check reloptions
    IF EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = r.schemaname
        AND c.relname = r.viewname
        AND c.relkind = 'v'
        AND NOT (c.reloptions @> ARRAY['security_invoker=on']
                 OR c.reloptions @> ARRAY['security_invoker=true'])
    ) THEN
      RAISE NOTICE 'WARNING — SECURITY DEFINER view: %.%', r.schemaname, r.viewname;
      found_count := found_count + 1;
    END IF;
  END LOOP;

  IF found_count = 0 THEN
    RAISE NOTICE 'OK — All public views use SECURITY INVOKER.';
  ELSE
    RAISE NOTICE 'FOUND % view(s) with SECURITY DEFINER.', found_count;
  END IF;
END $$;

-- ============================================================
-- CHECK 3: Functions with SECURITY DEFINER in public schema
-- ============================================================
DO $$
DECLARE
  r RECORD;
  found_count INT := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CHECK 3: Functions with SECURITY DEFINER ===';
  FOR r IN
    SELECT p.proname AS function_name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef = true
    ORDER BY p.proname
  LOOP
    RAISE NOTICE 'HIGH — SECURITY DEFINER function: public.%(%)', r.function_name, r.args;
    found_count := found_count + 1;
  END LOOP;

  IF found_count = 0 THEN
    RAISE NOTICE 'OK — No SECURITY DEFINER functions in public schema.';
  ELSE
    RAISE NOTICE 'FOUND % function(s) with SECURITY DEFINER. Audit each — convert to INVOKER where possible.', found_count;
  END IF;
END $$;

-- ============================================================
-- CHECK 4: Tables with RLS enabled but NO policies defined
-- (RLS enabled + zero policies = table locked to everyone)
-- ============================================================
DO $$
DECLARE
  r RECORD;
  found_count INT := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CHECK 4: Tables with RLS but NO policies ===';
  FOR r IN
    SELECT c.relname AS tablename
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relrowsecurity = true
      AND NOT EXISTS (
        SELECT 1 FROM pg_policy pol
        WHERE pol.polrelid = c.oid
      )
    ORDER BY c.relname
  LOOP
    RAISE NOTICE 'CRITICAL — RLS enabled but NO policies: public.%', r.tablename;
    found_count := found_count + 1;
  END LOOP;

  IF found_count = 0 THEN
    RAISE NOTICE 'OK — All RLS-enabled tables have at least one policy.';
  ELSE
    RAISE NOTICE 'FOUND % table(s) with RLS but no policies (locked to all users!).', found_count;
  END IF;
END $$;

-- ============================================================
-- CHECK 5: Orphaned policies (referencing non-existent roles)
-- ============================================================
DO $$
DECLARE
  r RECORD;
  found_count INT := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CHECK 5: Policy role coverage summary ===';
  FOR r IN
    SELECT c.relname AS tablename,
           COUNT(pol.polname) AS policy_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN pg_policy pol ON pol.polrelid = c.oid
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND c.relrowsecurity = true
    GROUP BY c.relname
    ORDER BY policy_count ASC, c.relname
    LIMIT 10
  LOOP
    RAISE NOTICE '  %.% — % policies', 'public', r.tablename, r.policy_count;
    found_count := found_count + 1;
  END LOOP;

  RAISE NOTICE 'Showing tables with fewest policies (bottom 10).';
END $$;

-- ============================================================
-- CHECK 6: Table count summary
-- ============================================================
DO $$
DECLARE
  total_tables INT;
  rls_tables INT;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== CHECK 6: Schema summary ===';

  SELECT COUNT(*) INTO total_tables
  FROM pg_tables WHERE schemaname = 'public';

  SELECT COUNT(*) INTO rls_tables
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relrowsecurity = true;

  RAISE NOTICE 'Total public tables: %', total_tables;
  RAISE NOTICE 'Tables with RLS: %', rls_tables;
  RAISE NOTICE 'Tables WITHOUT RLS: %', total_tables - rls_tables;
  RAISE NOTICE 'RLS coverage: %percent', ROUND(100.0 * rls_tables / GREATEST(total_tables, 1), 1);
END $$;

-- RAISE is only legal inside PL/pgSQL — wrap the closing banner in a DO block.
-- (CI soak catch, blank-slate replay.)
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== Schema health check complete. Review NOTICE output above. ===';
END $$;

COMMIT;
