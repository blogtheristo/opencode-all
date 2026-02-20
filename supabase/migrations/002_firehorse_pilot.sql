-- Firehorse Omnichannel Next Pilot - Database Schema
-- CustomerPilotLoop v1

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE lead_state AS ENUM (
  'New',
  'Cold_1_Sent',
  'Cold_1_Opened',
  'Cold_1_Clicked',
  'Cold_2_Sent',
  'Cold_3_Sent',
  'Engaged',
  'Meeting_Booked',
  'Disqualified',
  'Parked'
);

CREATE TYPE lead_country AS ENUM ('FI', 'SE', 'NO', 'DK');

CREATE TYPE event_type AS ENUM (
  'EmailSent',
  'EmailOpened',
  'LinkClicked',
  'Replied',
  'MeetingBooked',
  'StateChanged',
  'TaskCreated'
);

CREATE TYPE task_type AS ENUM ('ManualReply', 'FollowUp', 'Review');

CREATE TYPE reply_intent AS ENUM (
  'interested',
  'demo',
  'meeting',
  'later',
  'Q3',
  'H2',
  'wrong_person',
  'not_relevant',
  'unknown'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Leads table
CREATE TABLE firehorse_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(255),
  title VARCHAR(255),
  country lead_country NOT NULL,
  segment VARCHAR(100) DEFAULT 'Infra/Construction',
  state lead_state NOT NULL DEFAULT 'New',

  -- Timestamps for trigger logic
  cold_1_sent_at TIMESTAMPTZ,
  cold_2_sent_at TIMESTAMPTZ,
  cold_3_sent_at TIMESTAMPTZ,
  last_engagement_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Events log table
CREATE TABLE firehorse_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES firehorse_leads(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_firehorse_events_lead_id ON firehorse_events(lead_id);
CREATE INDEX idx_firehorse_events_created_at ON firehorse_events(created_at);
CREATE INDEX idx_firehorse_events_type ON firehorse_events(event_type);

-- Tasks table
CREATE TABLE firehorse_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES firehorse_leads(id) ON DELETE CASCADE,
  owner VARCHAR(100) NOT NULL,
  task_type task_type NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_firehorse_tasks_lead_id ON firehorse_tasks(lead_id);
CREATE INDEX idx_firehorse_tasks_owner ON firehorse_tasks(owner);
CREATE INDEX idx_firehorse_tasks_completed ON firehorse_tasks(completed);

-- Email templates table
CREATE TABLE firehorse_email_templates (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  language VARCHAR(2) DEFAULT 'EN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reply intent analysis (for AI processing)
CREATE TABLE firehorse_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES firehorse_leads(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  intent reply_intent,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_firehorse_replies_lead_id ON firehorse_replies(lead_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_firehorse_leads_updated_at
  BEFORE UPDATE ON firehorse_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_firehorse_email_templates_updated_at
  BEFORE UPDATE ON firehorse_email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View for daily new leads to process (max 30)
CREATE OR REPLACE VIEW firehorse_daily_new_leads AS
SELECT
  id,
  email,
  first_name,
  last_name,
  company,
  country,
  segment
FROM firehorse_leads
WHERE state = 'New'
  AND country IN ('FI', 'SE', 'NO', 'DK')
  AND segment = 'Infra/Construction'
ORDER BY created_at ASC
LIMIT 30;

-- View for leads needing Cold 2 follow-up (3 days after Cold 1)
CREATE OR REPLACE VIEW firehorse_cold2_candidates AS
SELECT
  id,
  email,
  first_name,
  last_name,
  company,
  country,
  state,
  cold_1_sent_at
FROM firehorse_leads
WHERE state = 'Cold_1_Sent'
  AND cold_1_sent_at IS NOT NULL
  AND cold_1_sent_at < NOW() - INTERVAL '3 days'
  AND last_engagement_at IS NULL;

-- View for leads needing Cold 3 follow-up (5 days after Cold 2)
CREATE OR REPLACE VIEW firehorse_cold3_candidates AS
SELECT
  id,
  email,
  first_name,
  last_name,
  company,
  country,
  state,
  cold_2_sent_at
FROM firehorse_leads
WHERE state = 'Cold_2_Sent'
  AND cold_2_sent_at IS NOT NULL
  AND cold_2_sent_at < NOW() - INTERVAL '5 days'
  AND last_engagement_at IS NULL;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_firehorse_leads_state ON firehorse_leads(state);
CREATE INDEX idx_firehorse_leads_country ON firehorse_leads(country);
CREATE INDEX idx_firehorse_leads_segment ON firehorse_leads(segment);
CREATE INDEX idx_firehorse_leads_cold_1_sent_at ON firehorse_leads(cold_1_sent_at);
CREATE INDEX idx_firehorse_leads_cold_2_sent_at ON firehorse_leads(cold_2_sent_at);

-- ============================================================================
-- SEED DATA - Email Templates
-- ============================================================================

INSERT INTO firehorse_email_templates (id, name, subject, body, language) VALUES
(
  'CustomerPilot_Cold1_FI',
  'Customer Pilot Cold Outreach 1 (Finnish)',
  'DWS IQ 6 + Firehorse Omnichannel – Pilottimahdollisuus Q1/2026',
  'Hei {{first_name}},

Tarjoamme valituille infra- ja rakennusalan yrityksille mahdollisuuden osallistua DWS IQ 6 + Firehorse Omnichannel -pilottiin Q1/2026.

**Mitä saat:**
• DWS IQ 6 -agenttipohjaisen AI-alustan
• Firehorse omnichannel-integraatiot
• Täyden tuen pilottivaiheessa
• Todistetut tulokset asiakashallinnassa

**Tavoite:** 30 uutta kontaktia päivässä, ≥1 tapaaminen/päivä

Kiinnostaako? Varataan 15 min keskustelu ensi viikolle.

Ystävällisin terveisin,
Risto
DWS IQ / Firehorse Team',
  'FI'
),
(
  'CustomerPilot_Cold1_EN',
  'Customer Pilot Cold Outreach 1 (English)',
  'DWS IQ 6 + Firehorse Omnichannel – Pilot Opportunity Q1/2026',
  'Hi {{first_name}},

We''re offering selected infrastructure and construction companies the opportunity to join the DWS IQ 6 + Firehorse Omnichannel pilot in Q1/2026.

**What you get:**
• DWS IQ 6 agentic AI platform
• Firehorse omnichannel integrations
• Full support during pilot phase
• Proven results in customer management

**Goal:** 30 new outbound contacts daily, ≥1 meeting/day

Interested? Let''s schedule a 15-min call next week.

Best regards,
Risto
DWS IQ / Firehorse Team',
  'EN'
),
(
  'CustomerPilot_Cold2_Reminder',
  'Customer Pilot Follow-up 2 (Reminder)',
  'Re: DWS IQ 6 + Firehorse Pilot – Still interested?',
  'Hi {{first_name}},

Quick follow-up on my previous email about the DWS IQ 6 + Firehorse Omnichannel pilot.

We have limited slots for Q1/2026, and I wanted to make sure you didn''t miss this opportunity.

The pilot includes:
✓ Full platform access
✓ Dedicated implementation support
✓ Proven omnichannel automation

Would next week work for a brief call?

Best,
Risto',
  'EN'
),
(
  'CustomerPilot_Cold3_CloseLoop',
  'Customer Pilot Final Follow-up 3 (Close Loop)',
  'Last call: DWS IQ 6 + Firehorse Pilot',
  'Hi {{first_name}},

This is my final follow-up regarding the DWS IQ 6 + Firehorse pilot opportunity.

I understand timing might not be right, but I wanted to leave the door open:

• If you''re interested later in 2026, just reply to this email
• If now isn''t the right time, no worries – I won''t follow up further
• If someone else in your organization should hear about this, please forward

Thanks for your time, and all the best with your projects in 2026!

Risto
DWS IQ / Firehorse Team',
  'EN'
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE firehorse_leads IS 'Customer pilot leads for Firehorse Omnichannel Next';
COMMENT ON TABLE firehorse_events IS 'Event log for all lead interactions and state changes';
COMMENT ON TABLE firehorse_tasks IS 'Tasks created for sales team (manual follow-ups, etc.)';
COMMENT ON TABLE firehorse_email_templates IS 'Email templates for cold outreach campaigns';
COMMENT ON TABLE firehorse_replies IS 'Email replies with AI intent analysis';
