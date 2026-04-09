-- Migration 046: TED Lead Sourcing Pipeline
-- Stores construction leads from TED (Tenders Electronic Daily) API v3
-- Part of Tranche 2 automated lead generation
-- Source: scripts/ted-lead-pipeline.ts (daily cron)

BEGIN;

-- ── Table ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ted_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_number TEXT UNIQUE NOT NULL,
  title TEXT,
  buyer_name TEXT,
  buyer_country TEXT,           -- ISO 3-letter (FIN, SWE, DEU, FRA, GBR)
  notice_type TEXT,             -- cn-standard, can-standard, pin-only
  cpv TEXT,                     -- CPV code (45000000 = construction)
  estimated_value NUMERIC,      -- EUR
  place_of_performance TEXT,
  publication_date DATE,
  deadline_date DATE,
  ted_url TEXT,

  -- DWS enrichment
  dm_language TEXT,             -- EN/SV/DE/FI/FR (auto-mapped from buyer_country)
  dm_personalization TEXT,      -- Pre-generated tender-specific DM opener
  erp_qualifier TEXT,           -- SAP/IFS/Monitor/Visma/Dynamics or NULL

  -- Outreach tracking
  linkedin_contact TEXT,        -- Filled manually or by future agent
  linkedin_profile_url TEXT,
  outreach_status TEXT DEFAULT 'new'
    CHECK (outreach_status IN ('new', 'researching', 'dm_sent', 'followed_up', 'replied', 'demo_booked', 'closed_won', 'closed_lost', 'disqualified')),
  outreach_date TIMESTAMPTZ,
  followup_date TIMESTAMPTZ,
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE ted_leads IS 'Construction leads from TED API v3 — automated daily pipeline';
COMMENT ON COLUMN ted_leads.publication_number IS 'Unique TED notice ID (e.g., 196127-2026)';
COMMENT ON COLUMN ted_leads.dm_personalization IS 'Auto-generated tender-specific DM opener in target language';
COMMENT ON COLUMN ted_leads.erp_qualifier IS 'ERP system used by company — SAP/IFS/Monitor/Visma/Dynamics = native integration angle';
COMMENT ON COLUMN ted_leads.outreach_status IS 'Pipeline stage: new → researching → dm_sent → followed_up → replied → demo_booked → closed';

-- ── Indexes ────────────────────────────────────────────────────────────

CREATE INDEX idx_ted_leads_pub_number ON ted_leads (publication_number);
CREATE INDEX idx_ted_leads_status ON ted_leads (outreach_status, created_at DESC);
CREATE INDEX idx_ted_leads_country ON ted_leads (buyer_country);
CREATE INDEX idx_ted_leads_date ON ted_leads (publication_date DESC);

-- ── RLS ────────────────────────────────────────────────────────────────

ALTER TABLE ted_leads ENABLE ROW LEVEL SECURITY;

-- Service role (backend cron job) — full access
CREATE POLICY "Service role full access"
  ON ted_leads FOR ALL
  USING (auth.role() = 'service_role');

-- Authenticated admin users — full access
CREATE POLICY "Authenticated users can read leads"
  ON ted_leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update leads"
  ON ted_leads FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ── Auto-update trigger ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_ted_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ted_leads_updated_at
  BEFORE UPDATE ON ted_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_ted_leads_updated_at();

COMMIT;
