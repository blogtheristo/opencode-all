-- CSRD Compliance Data Model
-- Stores company compliance assessments, ESRS data points, and audit trail
-- Wrapped in transaction per Boardy safety rules

BEGIN;

-- ============ ORGANIZATIONS COMPLIANCE PROFILE ============

CREATE TABLE IF NOT EXISTS compliance_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'FI',
  employee_count TEXT NOT NULL DEFAULT '1-50',
  annual_revenue_eur NUMERIC DEFAULT 0,
  annual_emissions_tonnes NUMERIC DEFAULT 0,
  import_value_eur NUMERIC DEFAULT 0,
  regulations TEXT[] NOT NULL DEFAULT ARRAY['csrd'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE compliance_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org compliance profiles"
  ON compliance_profiles FOR SELECT
  USING (organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');

CREATE POLICY "Users can insert own org compliance profiles"
  ON compliance_profiles FOR INSERT
  WITH CHECK (organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');

CREATE POLICY "Users can update own org compliance profiles"
  ON compliance_profiles FOR UPDATE
  USING (organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');

-- ============ ESRS DATA POINTS ============
-- Each row = one ESRS disclosure requirement with user-provided data

CREATE TABLE IF NOT EXISTS esrs_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES compliance_profiles(id) ON DELETE CASCADE,
  esrs_standard TEXT NOT NULL,        -- e.g. 'E1', 'S1', 'G1'
  disclosure_id TEXT NOT NULL,        -- e.g. 'E1-1', 'E1-6', 'S1-1'
  disclosure_name TEXT NOT NULL,      -- Human-readable name
  category TEXT NOT NULL,             -- 'environment', 'social', 'governance'
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  data_provided BOOLEAN NOT NULL DEFAULT false,
  data_value JSONB,                   -- Flexible storage for the actual data
  evidence_url TEXT,                  -- Link to supporting document
  notes TEXT,
  last_updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE esrs_data_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ESRS data points"
  ON esrs_data_points FOR ALL
  USING (profile_id IN (
    SELECT id FROM compliance_profiles
    WHERE organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id'
  ));

-- ============ COMPLIANCE ASSESSMENTS ============
-- Stores each assessment run with scores

CREATE TABLE IF NOT EXISTS compliance_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES compliance_profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL DEFAULT 'csrd_readiness',
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  compliance_status TEXT NOT NULL,    -- 'compliant', 'mostly-compliant', 'partially-compliant', 'non-compliant'
  regulation_scores JSONB NOT NULL,   -- Array of { regulation, score, status }
  gaps JSONB NOT NULL DEFAULT '[]',   -- Array of { regulation, gap, severity }
  recommendations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  assessed_by TEXT NOT NULL DEFAULT 'system',  -- 'system' or user_id
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE compliance_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON compliance_assessments FOR SELECT
  USING (profile_id IN (
    SELECT id FROM compliance_profiles
    WHERE organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id'
  ));

CREATE POLICY "System can insert assessments"
  ON compliance_assessments FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM compliance_profiles
    WHERE organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id'
  ));

-- ============ INDEXES ============

CREATE INDEX IF NOT EXISTS idx_compliance_profiles_org
  ON compliance_profiles(organization_id);

CREATE INDEX IF NOT EXISTS idx_esrs_data_points_profile
  ON esrs_data_points(profile_id);

CREATE INDEX IF NOT EXISTS idx_esrs_data_points_standard
  ON esrs_data_points(esrs_standard, disclosure_id);

CREATE INDEX IF NOT EXISTS idx_compliance_assessments_profile
  ON compliance_assessments(profile_id);

CREATE INDEX IF NOT EXISTS idx_compliance_assessments_created
  ON compliance_assessments(created_at DESC);

COMMIT;
