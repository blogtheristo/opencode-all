-- Firehorse Omnichannel Next Pilot - LinkedIn Workflow Extension
-- Human-in-the-loop LinkedIn automation + meeting & proposal tracking

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE linkedin_connection_status AS ENUM (
  'not_sent',
  'request_sent',
  'accepted',
  'declined',
  'withdrawn'
);

CREATE TYPE meeting_status AS ENUM (
  'scheduled',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE proposal_status AS ENUM (
  'draft',
  'sent',
  'under_review',
  'negotiation',
  'accepted',
  'rejected',
  'expired'
);

-- ============================================================================
-- ALTER LEADS TABLE
-- ============================================================================

-- Add LinkedIn workflow fields
ALTER TABLE firehorse_leads
  ADD COLUMN linkedin_connection_status linkedin_connection_status DEFAULT 'not_sent',
  ADD COLUMN linkedin_request_sent_at TIMESTAMPTZ,
  ADD COLUMN linkedin_accepted_at TIMESTAMPTZ,
  ADD COLUMN linkedin_note_text TEXT,
  ADD COLUMN revenue_eur_million INTEGER;

-- Add indexes
CREATE INDEX idx_firehorse_leads_linkedin_status ON firehorse_leads(linkedin_connection_status);

-- ============================================================================
-- MEETINGS TABLE
-- ============================================================================

CREATE TABLE firehorse_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES firehorse_leads(id) ON DELETE CASCADE,

  -- Meeting details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_type VARCHAR(50) DEFAULT 'demo', -- demo, discovery, proposal, follow_up
  status meeting_status DEFAULT 'scheduled',

  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 30,
  location VARCHAR(255), -- Zoom link, Teams link, physical address, etc.

  -- Attendees
  attendees JSONB DEFAULT '[]', -- [{name, email, title}]

  -- Outcomes
  outcome_notes TEXT,
  next_steps TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_firehorse_meetings_lead_id ON firehorse_meetings(lead_id);
CREATE INDEX idx_firehorse_meetings_scheduled_at ON firehorse_meetings(scheduled_at);
CREATE INDEX idx_firehorse_meetings_status ON firehorse_meetings(status);

-- ============================================================================
-- PROPOSALS TABLE
-- ============================================================================

CREATE TABLE firehorse_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES firehorse_leads(id) ON DELETE CASCADE,

  -- Proposal details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status proposal_status DEFAULT 'draft',

  -- Pricing
  amount_eur DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  pilot_duration_months INTEGER DEFAULT 5,

  -- Documents
  document_url TEXT, -- Link to PDF or Google Drive

  -- Key dates
  sent_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,

  -- Notes
  notes TEXT,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_firehorse_proposals_lead_id ON firehorse_proposals(lead_id);
CREATE INDEX idx_firehorse_proposals_status ON firehorse_proposals(status);
CREATE INDEX idx_firehorse_proposals_sent_at ON firehorse_proposals(sent_at);

-- ============================================================================
-- LINKEDIN WORKFLOW TRACKING TABLE
-- ============================================================================

CREATE TABLE firehorse_linkedin_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES firehorse_leads(id) ON DELETE CASCADE,

  -- Activity type
  activity_type VARCHAR(50) NOT NULL, -- connection_request, message_sent, profile_view, etc.

  -- Details
  note_text TEXT, -- Connection request note
  message_text TEXT, -- DM text if accepted

  -- Metadata
  linkedin_url VARCHAR(500),
  performed_by VARCHAR(100) DEFAULT 'Risto', -- Who did this action

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_firehorse_linkedin_activities_lead_id ON firehorse_linkedin_activities(lead_id);
CREATE INDEX idx_firehorse_linkedin_activities_type ON firehorse_linkedin_activities(activity_type);
CREATE INDEX idx_firehorse_linkedin_activities_created_at ON firehorse_linkedin_activities(created_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp for meetings
CREATE TRIGGER update_firehorse_meetings_updated_at
  BEFORE UPDATE ON firehorse_meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at timestamp for proposals
CREATE TRIGGER update_firehorse_proposals_updated_at
  BEFORE UPDATE ON firehorse_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Leads pending LinkedIn connection request
CREATE OR REPLACE VIEW firehorse_linkedin_pending AS
SELECT
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title,
  l.country,
  l.linkedin_url,
  l.state
FROM firehorse_leads l
WHERE l.linkedin_connection_status = 'not_sent'
  AND l.linkedin_url IS NOT NULL
  AND l.state = 'New'
ORDER BY l.revenue_eur_million DESC NULLS LAST, l.created_at ASC
LIMIT 50;

-- View: Upcoming meetings (next 7 days)
CREATE OR REPLACE VIEW firehorse_upcoming_meetings AS
SELECT
  m.id AS meeting_id,
  m.title AS meeting_title,
  m.scheduled_at,
  m.duration_minutes,
  m.meeting_type,
  m.status,
  l.id AS lead_id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title AS lead_title
FROM firehorse_meetings m
JOIN firehorse_leads l ON m.lead_id = l.id
WHERE m.status = 'scheduled'
  AND m.scheduled_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY m.scheduled_at ASC;

-- View: Active proposals (sent, under review, negotiation)
CREATE OR REPLACE VIEW firehorse_active_proposals AS
SELECT
  p.id AS proposal_id,
  p.title AS proposal_title,
  p.status,
  p.amount_eur,
  p.pilot_duration_months,
  p.sent_at,
  p.valid_until,
  l.id AS lead_id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title AS lead_title,
  l.country
FROM firehorse_proposals p
JOIN firehorse_leads l ON p.lead_id = l.id
WHERE p.status IN ('sent', 'under_review', 'negotiation')
ORDER BY p.sent_at DESC;

-- View: Sales pipeline summary
CREATE OR REPLACE VIEW firehorse_sales_pipeline AS
SELECT
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.country,
  l.state AS lead_state,
  l.linkedin_connection_status,
  COUNT(DISTINCT m.id) AS meetings_count,
  COUNT(DISTINCT p.id) AS proposals_count,
  MAX(m.scheduled_at) AS last_meeting_at,
  MAX(p.sent_at) AS last_proposal_sent_at,
  l.revenue_eur_million,
  l.created_at
FROM firehorse_leads l
LEFT JOIN firehorse_meetings m ON l.id = m.lead_id
LEFT JOIN firehorse_proposals p ON l.id = p.lead_id
WHERE l.state IN ('Engaged', 'Meeting_Booked')
GROUP BY l.id
ORDER BY l.revenue_eur_million DESC NULLS LAST;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE firehorse_meetings IS 'Meeting tracking for leads (demos, discovery calls, proposals)';
COMMENT ON TABLE firehorse_proposals IS 'Proposal and quote tracking for pilot opportunities';
COMMENT ON TABLE firehorse_linkedin_activities IS 'LinkedIn connection and messaging activity log (human-in-the-loop)';
COMMENT ON VIEW firehorse_linkedin_pending IS 'Leads ready for LinkedIn connection request (prioritized by revenue)';
COMMENT ON VIEW firehorse_upcoming_meetings IS 'Scheduled meetings in next 7 days';
COMMENT ON VIEW firehorse_active_proposals IS 'Proposals currently sent, under review, or in negotiation';
COMMENT ON VIEW firehorse_sales_pipeline IS 'Sales pipeline overview with meeting and proposal counts';
