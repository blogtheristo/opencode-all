-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
-- Audit trail: git log -- supabase/tests/096_internal_organization_backoffice_verification.sql
--
-- Run against a THROWAWAY Supabase database after migration 096.
-- The transaction rolls back all fixtures.
--
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/096_internal_organization_backoffice_verification.sql

BEGIN;

CREATE FUNCTION pg_temp.pass(ok boolean, label text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF ok IS NOT TRUE THEN
    RAISE EXCEPTION 'FAIL: %', label;
  END IF;
  RAISE NOTICE 'PASS: %', label;
END;
$$;

CREATE FUNCTION pg_temp.expect_insufficient_privilege(statement text, label text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  BEGIN
    EXECUTE statement;
    RAISE EXCEPTION 'FAIL: % (statement succeeded)', label;
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE 'PASS: %', label;
  END;
END;
$$;

INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000096', 'migration-096@example.invalid');

INSERT INTO public.user_profiles (id, email)
VALUES ('00000000-0000-0000-0000-000000000096', 'migration-096@example.invalid');

INSERT INTO public.organizations (id, name, slug, is_internal)
VALUES
  ('00000000-0000-0000-0000-000000000961', 'Migration 096 Customer', 'migration-096-customer', false),
  ('00000000-0000-0000-0000-000000000962', 'Migration 096 Internal', 'migration-096-internal', false);

INSERT INTO public.organization_members (organization_id, user_id, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000961',
  '00000000-0000-0000-0000-000000000096',
  'owner',
  'active'
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000096', true);
SELECT pg_temp.pass(NOT public.is_backoffice_admin(), 'external organization owner is not a back-office admin');
SELECT pg_temp.expect_insufficient_privilege(
  $$UPDATE public.organizations SET is_internal = true WHERE id = '00000000-0000-0000-0000-000000000961'$$,
  'authenticated organization owner cannot set is_internal'
);
RESET ROLE;

SET LOCAL ROLE service_role;
UPDATE public.organizations
SET is_internal = true
WHERE id = '00000000-0000-0000-0000-000000000962';
RESET ROLE;

INSERT INTO public.organization_members (organization_id, user_id, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000962',
  '00000000-0000-0000-0000-000000000096',
  'owner',
  'active'
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000096', true);
SELECT pg_temp.pass(public.is_backoffice_admin(), 'internal organization owner is a back-office admin');
RESET ROLE;

ROLLBACK;
