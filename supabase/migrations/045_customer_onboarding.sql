-- Migration 045: Customer Onboarding (DWS7 PR 041)
-- Stores customer onboarding wizard data: industry, company, ERP connection, regulations.
-- Used by POST /api/v1/onboard to persist wizard completion.
-- Replaces the in-memory Map that was used in MVP.

BEGIN;

CREATE TABLE IF NOT EXISTS customer_onboarding (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL UNIQUE,
  company_name     TEXT NOT NULL,
  industry         TEXT NOT NULL,
  country          TEXT NOT NULL DEFAULT 'Finland',
  employee_count   TEXT NOT NULL DEFAULT '1-50',
  annual_revenue   TEXT,
  regulations      TEXT[] NOT NULL DEFAULT '{csrd}',
  data_sources     TEXT[] NOT NULL DEFAULT '{}',
  erp_connection   JSONB,                          -- {type, host, authMethod, tenantId, verified}
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by user
CREATE INDEX idx_customer_onboarding_user ON customer_onboarding (user_id);

-- Index for analytics: how many customers per industry
CREATE INDEX idx_customer_onboarding_industry ON customer_onboarding (industry);

-- RLS: users can only read/write their own onboarding record
ALTER TABLE customer_onboarding ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own row
CREATE POLICY customer_onboarding_select ON customer_onboarding
  FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own row
CREATE POLICY customer_onboarding_insert ON customer_onboarding
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own row
CREATE POLICY customer_onboarding_update ON customer_onboarding
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can access all rows (for backend API with service key)
CREATE POLICY customer_onboarding_service ON customer_onboarding
  USING (auth.role() = 'service_role');

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_customer_onboarding_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_customer_onboarding_updated
  BEFORE UPDATE ON customer_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_onboarding_timestamp();

COMMENT ON TABLE customer_onboarding IS 'DWS7 customer onboarding wizard data — industry, company, ERP, regulations';
COMMENT ON COLUMN customer_onboarding.erp_connection IS 'JSON: {type, host, authMethod, tenantId, verified}';
COMMENT ON COLUMN customer_onboarding.regulations IS 'Array of regulation IDs: csrd, ets, cbam, epbd, fit-for-55, eu-ai-act';

COMMIT;
