-- Migration 036: Construction Leads from TED (Tenders Electronic Daily)
-- Renumbered from 032 (was duplicate 032). Idempotent (IF NOT EXISTS).
-- Stores EU public procurement notices for construction projects (CPV 45xxxxx).

CREATE TABLE IF NOT EXISTS construction_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  ted_notice_id VARCHAR(100) NOT NULL UNIQUE,
  document_number VARCHAR(50),

  title TEXT NOT NULL,
  description TEXT,
  cpv_code VARCHAR(20),
  cpv_description VARCHAR(500),

  country_code VARCHAR(5),
  country_name VARCHAR(100),
  nuts_code VARCHAR(20),
  place_of_performance TEXT,

  buyer_name VARCHAR(500),
  buyer_url TEXT,

  contract_type VARCHAR(50),
  procedure_type VARCHAR(100),
  notice_type VARCHAR(100),

  estimated_value NUMERIC,
  currency VARCHAR(10) DEFAULT 'EUR',

  publication_date DATE,
  deadline_date TIMESTAMPTZ,

  ted_url TEXT,

  status VARCHAR(50) DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'qualified', 'outreach_started', 'contacted', 'passed', 'won')),
  relevance_score NUMERIC DEFAULT 0,
  notes TEXT,

  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,

  raw_data JSONB,

  source VARCHAR(50) DEFAULT 'ted_api' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'construction_lead_fetcher' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_construction_leads_ted_id ON construction_leads(ted_notice_id);
CREATE INDEX IF NOT EXISTS idx_construction_leads_cpv ON construction_leads(cpv_code);
CREATE INDEX IF NOT EXISTS idx_construction_leads_country ON construction_leads(country_code);
CREATE INDEX IF NOT EXISTS idx_construction_leads_status ON construction_leads(status);
CREATE INDEX IF NOT EXISTS idx_construction_leads_pub_date ON construction_leads(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_construction_leads_deadline ON construction_leads(deadline_date) WHERE deadline_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_construction_leads_relevance ON construction_leads(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_construction_leads_org ON construction_leads(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_construction_leads_created ON construction_leads(created_at DESC);

DROP TRIGGER IF EXISTS update_construction_leads_updated_at ON construction_leads;
CREATE TRIGGER update_construction_leads_updated_at
  BEFORE UPDATE ON construction_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE VIEW v_construction_leads_new AS
SELECT *
FROM construction_leads
WHERE status = 'new'
  AND publication_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY relevance_score DESC, publication_date DESC;

CREATE OR REPLACE VIEW v_construction_leads_deadlines AS
SELECT *
FROM construction_leads
WHERE deadline_date >= NOW()
  AND deadline_date <= NOW() + INTERVAL '14 days'
  AND status NOT IN ('passed', 'won')
ORDER BY deadline_date ASC;

CREATE OR REPLACE VIEW v_construction_leads_summary AS
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
  SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed_count,
  SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS qualified_count,
  SUM(CASE WHEN status = 'outreach_started' THEN 1 ELSE 0 END) AS outreach_count,
  SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS contacted_count,
  SUM(CASE WHEN deadline_date >= NOW() AND deadline_date <= NOW() + INTERVAL '7 days' THEN 1 ELSE 0 END) AS deadlines_this_week
FROM construction_leads
WHERE status NOT IN ('passed', 'won');

ALTER TABLE construction_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON construction_leads;
CREATE POLICY "Service role full access" ON construction_leads FOR ALL USING (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Authenticated read" ON construction_leads;
CREATE POLICY "Authenticated read" ON construction_leads FOR SELECT USING (auth.role() = 'authenticated');

COMMENT ON TABLE construction_leads IS 'EU public procurement notices for construction projects from TED API. CPV 45xxxxx. Links to outreach_orgs for buyer tracking.';
