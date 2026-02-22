-- Migration 032: Construction Leads from TED (Tenders Electronic Daily)
--
-- Stores EU public procurement notices for construction projects (CPV 45xxxxx).
-- Links to outreach_orgs for the contracting authority (buyer).
-- Feeds into the daily outreach digest as a "CONSTRUCTION LEADS" section.
--
-- Source: TED Search API (https://api.ted.europa.eu) — free, anonymous access.
-- Query: CPV = 45000000 (Construction Work) + sub-codes.

-- ============================================================================
-- TABLE: CONSTRUCTION_LEADS
-- ============================================================================

CREATE TABLE construction_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- TED notice identifiers
  ted_notice_id VARCHAR(100) NOT NULL UNIQUE,   -- TED notice number (e.g., "2026/S 038-123456")
  document_number VARCHAR(50),                   -- Short doc number

  -- Notice content
  title TEXT NOT NULL,
  description TEXT,
  cpv_code VARCHAR(20),                          -- e.g., "45000000" for Construction Work
  cpv_description VARCHAR(500),

  -- Location
  country_code VARCHAR(5),                       -- ISO 3166-1 alpha-2 (FI, SE, DE, etc.)
  country_name VARCHAR(100),
  nuts_code VARCHAR(20),                         -- NUTS region code
  place_of_performance TEXT,

  -- Buyer (contracting authority)
  buyer_name VARCHAR(500),
  buyer_url TEXT,

  -- Contract details
  contract_type VARCHAR(50),                     -- works, supplies, services
  procedure_type VARCHAR(100),                   -- open, restricted, negotiated, etc.
  notice_type VARCHAR(100),                      -- contract notice, prior information, award

  -- Value
  estimated_value NUMERIC,
  currency VARCHAR(10) DEFAULT 'EUR',

  -- Dates
  publication_date DATE,
  deadline_date TIMESTAMPTZ,                     -- Tender submission deadline

  -- Links
  ted_url TEXT,                                  -- Direct link to TED notice

  -- Lead management
  status VARCHAR(50) DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'qualified', 'outreach_started', 'contacted', 'passed', 'won')),
  relevance_score NUMERIC DEFAULT 0,             -- 0-100, calculated by lead processor
  notes TEXT,

  -- Link to outreach system
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,

  -- Raw API response
  raw_data JSONB,

  -- Attribution
  source VARCHAR(50) DEFAULT 'ted_api' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'construction_lead_fetcher' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_construction_leads_ted_id ON construction_leads(ted_notice_id);
CREATE INDEX idx_construction_leads_cpv ON construction_leads(cpv_code);
CREATE INDEX idx_construction_leads_country ON construction_leads(country_code);
CREATE INDEX idx_construction_leads_status ON construction_leads(status);
CREATE INDEX idx_construction_leads_pub_date ON construction_leads(publication_date DESC);
CREATE INDEX idx_construction_leads_deadline ON construction_leads(deadline_date) WHERE deadline_date IS NOT NULL;
CREATE INDEX idx_construction_leads_relevance ON construction_leads(relevance_score DESC);
CREATE INDEX idx_construction_leads_org ON construction_leads(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX idx_construction_leads_created ON construction_leads(created_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_construction_leads_updated_at
  BEFORE UPDATE ON construction_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- New leads for daily digest (published in last 7 days, not yet reviewed)
CREATE VIEW v_construction_leads_new AS
SELECT *
FROM construction_leads
WHERE status = 'new'
  AND publication_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY relevance_score DESC, publication_date DESC;

-- Upcoming deadlines (next 14 days)
CREATE VIEW v_construction_leads_deadlines AS
SELECT *
FROM construction_leads
WHERE deadline_date >= NOW()
  AND deadline_date <= NOW() + INTERVAL '14 days'
  AND status NOT IN ('passed', 'won')
ORDER BY deadline_date ASC;

-- Pipeline summary for digest
CREATE VIEW v_construction_leads_summary AS
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

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE construction_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON construction_leads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated read" ON construction_leads FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE construction_leads IS 'EU public procurement notices for construction projects from TED API. CPV 45xxxxx. Links to outreach_orgs for buyer tracking.';
COMMENT ON COLUMN construction_leads.ted_notice_id IS 'TED notice identifier, unique per notice. Format: "2026/S 038-123456"';
COMMENT ON COLUMN construction_leads.relevance_score IS 'Calculated score 0-100 based on country, value, CPV match, and buyer fit.';
COMMENT ON COLUMN construction_leads.org_id IS 'Links to outreach_orgs when buyer is matched/created as an outreach target.';
