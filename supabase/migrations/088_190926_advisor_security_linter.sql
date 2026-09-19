-- CODE VERSIONING NOTE
-- Code-Version: 1.1.0
-- Introduced-In: PR-2045
-- Branch: cursor/supabase-advisor-warnings-3f7a
-- Commit: (see git log -- this-file)
-- Date: 2026-09-19
-- Owner: DWS Platform / Cursor cloud agent
-- Env-Schema: env-v1.0
--
-- Migration 088: Clear Supabase Database Linter SECURITY warnings
-- (2026-09-19 advisor dump: function_search_path_mutable, extension_in_public,
-- rls_policy_always_true, anon/authenticated SECURITY DEFINER EXECUTE).
--
-- Studio banner "This query includes destructive operations":
-- keyword scan hits REVOKE and ALTER EXTENSION. This file does not
-- DELETE/TRUNCATE rows and does not DROP TABLE/SCHEMA/FUNCTION.
-- Policies are ALTER-ed in place (no DROP POLICY).
--
-- STATUS: HIC REFUSED 2026-09-19 — DO NOT APPLY.
-- Reason: authored without a per-function caller map of this repo.
-- 076 already required that review (not a blanket PUBLIC revoke).
-- Next version only after: src/ rpc call sites, RLS helper usage,
-- dashboard JWT vs service_role, and DWS_SECURITY_STANDARD §16.
--
-- Idempotent. Safe to re-run.
-- Filename per DWS_DOCUMENT_STANDARD.md §4.5 / §1 (v2.16).

BEGIN;

-- ============================================================
-- 1. Pin search_path on every public function missing it (lint 0011)
-- ============================================================
DO $$
DECLARE
  f record;
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prokind IN ('f', 'p')
      AND (
        p.proconfig IS NULL
        OR NOT EXISTS (
          SELECT 1
          FROM unnest(p.proconfig) AS c(cfg)
          WHERE c.cfg LIKE 'search_path=%'
        )
      )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %s SET search_path = pg_catalog, public',
      f.sig
    );
  END LOOP;
END
$$;

-- ============================================================
-- 2. SECURITY DEFINER not callable via PostgREST as anon (lint 0028)
--    Trigger / owner-only functions also lose authenticated EXECUTE (0029).
--    RLS helpers keep authenticated EXECUTE (policies call them as the user).
-- ============================================================
DO $$
DECLARE
  f record;
  rls_helpers text[] := ARRAY[
    'is_advisor',
    'is_backoffice_admin',
    'is_security_auditor',
    'user_has_org_role',
    'get_user_organizations',
    'get_advisor_permissions'
  ];
BEGIN
  FOR f IN
    SELECT p.oid::regprocedure AS sig, p.proname AS name
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND p.prokind IN ('f', 'p')
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC', f.sig);
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', f.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', f.sig);

    IF f.name = ANY (rls_helpers) THEN
      EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO authenticated', f.sig);
    ELSE
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM authenticated', f.sig);
    END IF;
  END LOOP;
END
$$;

-- ============================================================
-- 3. Tighten always-true write policies (lint 0024) via ALTER POLICY
-- ============================================================
DO $$
BEGIN
  -- Unscoped ALL(true) → service_role only (bypasses RLS anyway).
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'agent_sessions'
      AND policyname = 'Service role has full access to agent_sessions'
  ) THEN
    EXECUTE 'ALTER POLICY "Service role has full access to agent_sessions" ON public.agent_sessions TO service_role';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'agent_tasks'
      AND policyname = 'Service role has full access to agent_tasks'
  ) THEN
    EXECUTE 'ALTER POLICY "Service role has full access to agent_tasks" ON public.agent_tasks TO service_role';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bim_metadata'
      AND policyname = 'Service role has full access to bim_metadata'
  ) THEN
    EXECUTE 'ALTER POLICY "Service role has full access to bim_metadata" ON public.bim_metadata TO service_role';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'opencode_sessions'
      AND policyname = 'service_role_all'
  ) THEN
    EXECUTE 'ALTER POLICY service_role_all ON public.opencode_sessions TO service_role';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'web_leads'
      AND policyname = 'Anyone can submit a web lead'
  ) THEN
    EXECUTE $p$
      ALTER POLICY "Anyone can submit a web lead" ON public.web_leads
      WITH CHECK (
        email IS NOT NULL
        AND length(btrim(email)) >= 5
        AND position('@' IN email) > 1
      )
    $p$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'web_leads'
      AND policyname = 'Authenticated users can update web leads'
  ) THEN
    EXECUTE $p$
      ALTER POLICY "Authenticated users can update web leads" ON public.web_leads
      USING (is_backoffice_admin())
      WITH CHECK (is_backoffice_admin())
    $p$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'web_leads'
      AND policyname = 'Authenticated users can delete web leads'
  ) THEN
    EXECUTE $p$
      ALTER POLICY "Authenticated users can delete web leads" ON public.web_leads
      USING (is_backoffice_admin())
    $p$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'captain_inquiries'
      AND policyname = 'Anyone can submit an inquiry'
  ) THEN
    EXECUTE $p$
      ALTER POLICY "Anyone can submit an inquiry" ON public.captain_inquiries
      WITH CHECK (
        email IS NOT NULL
        AND length(btrim(email)) >= 5
        AND position('@' IN email) > 1
        AND name IS NOT NULL
        AND length(btrim(name)) >= 1
      )
    $p$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'captain_inquiries'
      AND policyname = 'Authenticated users can update inquiries'
  ) THEN
    EXECUTE $p$
      ALTER POLICY "Authenticated users can update inquiries" ON public.captain_inquiries
      USING (is_backoffice_admin())
      WITH CHECK (is_backoffice_admin())
    $p$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'playbook_leads'
      AND policyname = 'anon can insert playbook leads'
  ) THEN
    EXECUTE $p$
      ALTER POLICY "anon can insert playbook leads" ON public.playbook_leads
      WITH CHECK (
        email IS NOT NULL
        AND length(btrim(email::text)) >= 5
        AND position('@' IN email::text) > 1
        AND industry_slug IS NOT NULL
        AND length(btrim(industry_slug)) >= 1
      )
    $p$;
  END IF;
END
$$;

DO $$
DECLARE
  email_col text;
  check_sql text;
BEGIN
  IF to_regclass('public.blog_subscribers') IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blog_subscribers'
      AND policyname = 'blog_subscribers_auth_all'
  ) THEN
    EXECUTE $p$
      ALTER POLICY blog_subscribers_auth_all ON public.blog_subscribers
      TO authenticated
      USING (is_backoffice_admin())
      WITH CHECK (is_backoffice_admin())
    $p$;
  END IF;

  SELECT a.attname INTO email_col
  FROM pg_attribute a
  WHERE a.attrelid = 'public.blog_subscribers'::regclass
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND a.attname IN ('email', 'subscriber_email')
  LIMIT 1;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blog_subscribers'
      AND policyname = 'blog_subscribers_anon_insert'
  ) THEN
    IF email_col IS NOT NULL THEN
      check_sql := format(
        $p$
          ALTER POLICY blog_subscribers_anon_insert ON public.blog_subscribers
          WITH CHECK (
            %1$I IS NOT NULL
            AND length(btrim(%1$I::text)) >= 5
            AND position('@' IN %1$I::text) > 1
          )
        $p$,
        email_col
      );
    ELSE
      check_sql := $p$
        ALTER POLICY blog_subscribers_anon_insert ON public.blog_subscribers
        WITH CHECK (id IS NOT NULL)
      $p$;
    END IF;
    EXECUTE check_sql;
  END IF;
END
$$;

-- ============================================================
-- 4. Move extensions out of public (lint 0014)
--    Types move with the extension; existing columns keep working.
-- ============================================================
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'vector' AND n.nspname = 'public'
  ) THEN
    EXECUTE 'ALTER EXTENSION vector SET SCHEMA extensions';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'citext' AND n.nspname = 'public'
  ) THEN
    EXECUTE 'ALTER EXTENSION citext SET SCHEMA extensions';
  END IF;
END
$$;

COMMIT;

SELECT 'Migration 088_190926_advisor_security_linter.sql completed' AS status;

-- Document version: 1.1.0 · Date: 19.09.2026 · Owner: Lifetime Oy
-- © 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
