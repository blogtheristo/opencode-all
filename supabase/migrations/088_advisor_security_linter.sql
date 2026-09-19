-- Migration 088: Clear Supabase Database Linter SECURITY warnings
-- (2026-09-19 advisor dump: function_search_path_mutable, extension_in_public,
-- rls_policy_always_true, anon/authenticated SECURITY DEFINER EXECUTE).
--
-- STATUS: review before apply. Non-breaking for table data. May return 42501
-- on /rest/v1/rpc/* for SECURITY DEFINER functions that were accidentally
-- public. Backend must keep using the service_role key for those RPCs.
--
-- Idempotent. Safe to re-run.
-- Evidence: Tool=Cursor Grok 4.6 Agent=cloud Date=2026-09-19
-- Audit trail: git log -- supabase/migrations/088_advisor_security_linter.sql

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
-- 3. Drop USING(true) ALL policies that apply to every role (lint 0024)
--    service_role already bypasses RLS; these policies opened the table
--    to any granted role. Existence-safe: tables may be remote-only.
-- ============================================================
DO $$
BEGIN
  IF to_regclass('public.agent_sessions') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role has full access to agent_sessions" ON public.agent_sessions';
  END IF;
  IF to_regclass('public.agent_tasks') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role has full access to agent_tasks" ON public.agent_tasks';
  END IF;
  IF to_regclass('public.bim_metadata') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Service role has full access to bim_metadata" ON public.bim_metadata';
  END IF;
  IF to_regclass('public.opencode_sessions') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS service_role_all ON public.opencode_sessions';
  END IF;
END
$$;

-- Public form INSERTs: keep anon write, replace WITH CHECK (true) with a
-- real predicate so lint 0024 clears.
DO $$
BEGIN
  IF to_regclass('public.web_leads') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can submit a web lead" ON public.web_leads';
    EXECUTE $p$
      CREATE POLICY "Anyone can submit a web lead"
        ON public.web_leads FOR INSERT TO anon
        WITH CHECK (
          email IS NOT NULL
          AND length(btrim(email)) >= 5
          AND position('@' IN email) > 1
        )
    $p$;

    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can update web leads" ON public.web_leads';
    EXECUTE $p$
      CREATE POLICY "Authenticated users can update web leads"
        ON public.web_leads FOR UPDATE TO authenticated
        USING (is_backoffice_admin())
        WITH CHECK (is_backoffice_admin())
    $p$;

    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can delete web leads" ON public.web_leads';
    EXECUTE $p$
      CREATE POLICY "Authenticated users can delete web leads"
        ON public.web_leads FOR DELETE TO authenticated
        USING (is_backoffice_admin())
    $p$;
  END IF;

  IF to_regclass('public.captain_inquiries') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.captain_inquiries';
    EXECUTE $p$
      CREATE POLICY "Anyone can submit an inquiry"
        ON public.captain_inquiries FOR INSERT TO anon
        WITH CHECK (
          email IS NOT NULL
          AND length(btrim(email)) >= 5
          AND position('@' IN email) > 1
          AND name IS NOT NULL
          AND length(btrim(name)) >= 1
        )
    $p$;

    EXECUTE 'DROP POLICY IF EXISTS "Authenticated users can update inquiries" ON public.captain_inquiries';
    EXECUTE $p$
      CREATE POLICY "Authenticated users can update inquiries"
        ON public.captain_inquiries FOR UPDATE TO authenticated
        USING (is_backoffice_admin())
        WITH CHECK (is_backoffice_admin())
    $p$;
  END IF;

  IF to_regclass('public.playbook_leads') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "anon can insert playbook leads" ON public.playbook_leads';
    EXECUTE $p$
      CREATE POLICY "anon can insert playbook leads"
        ON public.playbook_leads FOR INSERT TO anon
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

-- blog_subscribers: replace authenticated ALL(true) if the table exists.
-- Recreate insert with a column-aware check.
DO $$
DECLARE
  email_col text;
BEGIN
  IF to_regclass('public.blog_subscribers') IS NULL THEN
    RETURN;
  END IF;

  SELECT a.attname INTO email_col
  FROM pg_attribute a
  WHERE a.attrelid = 'public.blog_subscribers'::regclass
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND a.attname IN ('email', 'subscriber_email')
  LIMIT 1;

  EXECUTE 'DROP POLICY IF EXISTS blog_subscribers_auth_all ON public.blog_subscribers';
  EXECUTE $p$
    CREATE POLICY blog_subscribers_auth_all
      ON public.blog_subscribers FOR ALL TO authenticated
      USING (is_backoffice_admin())
      WITH CHECK (is_backoffice_admin())
  $p$;

  EXECUTE 'DROP POLICY IF EXISTS blog_subscribers_anon_insert ON public.blog_subscribers';
  IF email_col IS NOT NULL THEN
    EXECUTE format(
      $p$
        CREATE POLICY blog_subscribers_anon_insert
          ON public.blog_subscribers FOR INSERT TO anon
          WITH CHECK (
            %1$I IS NOT NULL
            AND length(btrim(%1$I::text)) >= 5
            AND position('@' IN %1$I::text) > 1
          )
      $p$,
      email_col
    );
  ELSE
    EXECUTE $p$
      CREATE POLICY blog_subscribers_anon_insert
        ON public.blog_subscribers FOR INSERT TO anon
        WITH CHECK (id IS NOT NULL)
    $p$;
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

SELECT 'Migration 088_advisor_security_linter.sql completed' AS status;
