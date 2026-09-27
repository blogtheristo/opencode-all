-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
-- Audit trail: git log -- supabase/tests/096_internal_organization_backoffice_verification.sql
--
-- Run against a THROWAWAY Supabase database after migration 096.
-- The transaction rolls back all fixtures.
--
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/096_internal_organization_backoffice_verification.sql
--
-- Verified 2026-09-27 against supabase/postgres:17.6.1.167 with migrations
-- 007 -> 011 -> 096 applied. All four assertions pass.

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

-- Migration 007 installs an auth.users trigger (handle_new_user) that creates
-- this row automatically. Kept as a no-op fallback for databases without it.
INSERT INTO public.user_profiles (id, email)
VALUES ('00000000-0000-0000-0000-000000000096', 'migration-096@example.invalid')
ON CONFLICT (id) DO NOTHING;

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

-- Assertion 1 - the escalation this migration closes: owning a non-internal
-- organization must not confer back-office admin.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000096', true);
SELECT pg_temp.pass(NOT public.is_backoffice_admin(), 'external organization owner is not a back-office admin');
RESET ROLE;

-- Assertion 2 - the trigger guard. Asserted as the current (superuser) role
-- rather than as `authenticated`, deliberately:
--
--   Migration 007 defines self-referential RLS on organization_members (a policy
--   ON organization_members whose USING clause selects FROM organization_members).
--   An `authenticated` UPDATE of public.organizations evaluates the "Org admins can
--   update their organization" policy, which subqueries organization_members and
--   trips `infinite recursion detected in policy`. That is a pre-existing defect in
--   007, independent of this migration, and it masks the trigger by failing first.
--
--   Running as a role that bypasses RLS isolates the 096 trigger. It is also the
--   stronger assertion: the guard is `current_user <> 'service_role'`, so passing
--   here proves even a superuser cannot set the column.
SELECT pg_temp.expect_insufficient_privilege(
  $$UPDATE public.organizations SET is_internal = true WHERE id = '00000000-0000-0000-0000-000000000961'$$,
  'non-service_role cannot set is_internal'
);

-- Assertion 3 - service_role is the only writer of the marker.
SET LOCAL ROLE service_role;
UPDATE public.organizations
SET is_internal = true
WHERE id = '00000000-0000-0000-0000-000000000962';
RESET ROLE;

SELECT pg_temp.pass(
  (SELECT is_internal FROM public.organizations WHERE id = '00000000-0000-0000-0000-000000000962'),
  'service_role may set is_internal'
);

INSERT INTO public.organization_members (organization_id, user_id, role, status)
VALUES (
  '00000000-0000-0000-0000-000000000962',
  '00000000-0000-0000-0000-000000000096',
  'owner',
  'active'
);

-- Assertion 4 - access is preserved for the internal organization.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000096', true);
SELECT pg_temp.pass(public.is_backoffice_admin(), 'internal organization owner is a back-office admin');
RESET ROLE;

ROLLBACK;
