-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/096_270926_internal_organization_backoffice.sql
--
-- Migration 096: Restrict back-office administration to internal organizations.
--
-- APPLY REQUIREMENT: the production organization named "DWS AB" must be marked
-- is_internal = true in this same transaction. This migration performs that
-- update when exactly one matching row exists. The production operator must
-- verify the row before COMMIT; do not apply this migration separately from that check.

BEGIN;

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS is_internal boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.organizations.is_internal IS
  'Server-controlled marker for organizations whose active owners/admins may access DWS back-office surfaces.';

-- Standard Supabase Data API grant + RLS block. The trigger below protects the
-- server-controlled marker from authenticated writes despite the table-level grant.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations
  TO authenticated, service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  dws_internal_org_count integer;
BEGIN
  SELECT count(*)
    INTO dws_internal_org_count
    FROM public.organizations
    WHERE name = 'DWS AB';

  IF dws_internal_org_count = 1 THEN
    UPDATE public.organizations
      SET is_internal = true
      WHERE name = 'DWS AB';
  ELSE
    RAISE WARNING
      'Migration 096 did not flag DWS AB: expected exactly one matching organization, found %',
      dws_internal_org_count;
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.enforce_internal_organization_marker()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF (
    (TG_OP = 'INSERT' AND NEW.is_internal)
    OR (TG_OP = 'UPDATE' AND NEW.is_internal IS DISTINCT FROM OLD.is_internal)
  ) AND current_user <> 'service_role' THEN
    RAISE EXCEPTION 'organizations.is_internal is service_role-managed'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS organizations_internal_marker_guard ON public.organizations;
CREATE TRIGGER organizations_internal_marker_guard
  BEFORE INSERT OR UPDATE OF is_internal ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_internal_organization_marker();

CREATE OR REPLACE FUNCTION public.is_backoffice_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.organization_members AS membership
    JOIN public.organizations AS organization
      ON organization.id = membership.organization_id
    WHERE membership.user_id = auth.uid()
      AND membership.role IN ('owner', 'admin')
      AND membership.status = 'active'
      AND organization.is_internal = true
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_backoffice_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_backoffice_admin() TO authenticated, service_role;

COMMENT ON FUNCTION public.is_backoffice_admin() IS
  'Returns true only for an active owner/admin of a server-designated internal organization.';

COMMIT;
