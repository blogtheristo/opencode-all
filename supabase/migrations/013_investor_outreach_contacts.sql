-- Investor Outreach Contacts - Construction CEO Database
-- Stores contacts from 80_construction_CEO.md and similar research documents

-- ============================================================================
-- TABLE
-- ============================================================================

CREATE TABLE investor_outreach_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document VARCHAR(100) NOT NULL DEFAULT '80_construction_CEO',
  company VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(500),
  role_type VARCHAR(100),
  division VARCHAR(255),
  country VARCHAR(100),
  linkedin_url TEXT,
  contact_email TEXT,
  contact_other TEXT,
  notes TEXT,
  priority_rank INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_investor_contacts_company ON investor_outreach_contacts(company);
CREATE INDEX idx_investor_contacts_country ON investor_outreach_contacts(country);
CREATE INDEX idx_investor_contacts_role_type ON investor_outreach_contacts(role_type);
CREATE INDEX idx_investor_contacts_source ON investor_outreach_contacts(source_document);
CREATE INDEX idx_investor_contacts_priority ON investor_outreach_contacts(priority_rank) WHERE priority_rank IS NOT NULL;
CREATE INDEX idx_investor_contacts_tags ON investor_outreach_contacts USING GIN(tags);

-- Unique constraint: same person in same document (avoid duplicates on re-import)
CREATE UNIQUE INDEX idx_investor_contacts_unique
  ON investor_outreach_contacts(source_document, company, name);

-- Updated_at trigger (uses update_updated_at_column from migration 002)
CREATE TRIGGER update_investor_outreach_contacts_updated_at
  BEFORE UPDATE ON investor_outreach_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (allow service role full access; backoffice read)
ALTER TABLE investor_outreach_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to investor_outreach_contacts"
  ON investor_outreach_contacts FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Backoffice admins can read investor_outreach_contacts"
  ON investor_outreach_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users u
      WHERE u.id = auth.uid()
      AND (u.raw_user_meta_data->>'role' = 'backoffice_admin' OR u.raw_user_meta_data->>'role' = 'admin')
    )
  );

COMMENT ON TABLE investor_outreach_contacts IS 'B2B outreach contacts from investor research (e.g. 80_construction_CEO.md). For Sales Navigator, Firehorse integration.';
