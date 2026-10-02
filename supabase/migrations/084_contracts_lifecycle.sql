-- Migration 084: Sales lifecycle — contracts table
-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=OpenAI/gpt-5.6-sol Agent=Copilot Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/084_contracts_lifecycle.sql
--
-- Tracks bid → offer → contract lifecycle entries as a Supabase-native mirror
-- of the contracts/*.json file store. The JSON files remain the source of truth;
-- this table enables SQL queries, alerts, and governance reporting.

CREATE TABLE IF NOT EXISTS public.contracts_lifecycle (
  id              TEXT PRIMARY KEY,          -- matches JSON id field: bid_2026_001
  type            TEXT NOT NULL CHECK (type IN ('bid', 'offer', 'contract')),
  status          TEXT NOT NULL CHECK (status IN (
                    'DRAFT','SENT','ACCEPTED','ACTIVE',
                    'RENEWED','EXPIRED','ARCHIVED','REJECTED','CANCELLED'
                  )),
  customer_id     TEXT NOT NULL,
  customer_name   TEXT,
  total_value     NUMERIC,
  currency        TEXT DEFAULT 'EUR',
  valid_until     TIMESTAMPTZ,
  effective_date  TIMESTAMPTZ,
  expiry_date     TIMESTAMPTZ,
  renewal_reminder_date TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by      TEXT,
  source_file     TEXT,                      -- relative path to JSON file
  payload         JSONB                      -- full JSON blob for queries
);

CREATE INDEX IF NOT EXISTS contracts_lifecycle_status_idx
  ON public.contracts_lifecycle (status);

CREATE INDEX IF NOT EXISTS contracts_lifecycle_valid_until_idx
  ON public.contracts_lifecycle (valid_until)
  WHERE valid_until IS NOT NULL;

CREATE INDEX IF NOT EXISTS contracts_lifecycle_type_status_idx
  ON public.contracts_lifecycle (type, status);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contracts_lifecycle_updated_at ON public.contracts_lifecycle;
CREATE TRIGGER contracts_lifecycle_updated_at
  BEFORE UPDATE ON public.contracts_lifecycle
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Grants (DWS standard — supabase/migrations/075_public_schema_grants.sql)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts_lifecycle
  TO authenticated, service_role;

ALTER TABLE public.contracts_lifecycle ENABLE ROW LEVEL SECURITY;

-- Contract rows have no owner/org discriminator, so RLS exposes them only to
-- service_role. authenticated retains table grants but has no row policy.
CREATE POLICY "service_role full access" ON public.contracts_lifecycle
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);
