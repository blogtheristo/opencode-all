-- Migration 023: Outreach System - Normalized schema
-- Renumbered from 016 (Supabase has 016-022 already deployed).
-- Table renamed: organizations → outreach_orgs (avoids conflict with 007_auth_users_orgs.sql).
--
-- persons (LinkedIn URL key) + outreach_orgs (domain key) + outreach_threads (conversation state)
-- outreach_activities = event log with raw_payload, outcome, next_followup_at
-- Single-tenant (Lifetime Oy). tenant_id can be added later as one-column migration.
-- Every table has created_by + created_at + source for attribution.
-- Pipeline as enum (investor/customer/partner). ALTER TYPE to add more later.

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE outreach_pipeline AS ENUM ('investor', 'customer', 'partner');

CREATE TYPE outreach_status AS ENUM (
  'new',              -- Just added, no action taken
  'researched',       -- Background research done
  'intro_requested',  -- Warm intro requested (e.g. via Boardy)
  'intro_made',       -- Intro completed, waiting for response
  'contacted',        -- Direct outreach sent
  'responded',        -- They responded
  'meeting_booked',   -- Meeting scheduled
  'in_negotiation',   -- Active deal/partnership discussion
  'converted',        -- Closed (invested / signed / partnered)
  'passed',           -- They passed or we passed
  'parked'            -- Not now, revisit later
);

CREATE TYPE outreach_source AS ENUM (
  'boardy',           -- Boardy AI introduction
  'linkedin',         -- LinkedIn outreach
  'conference',       -- Met at event
  'referral',         -- Personal referral
  'cold',             -- Cold outreach
  'inbound',          -- They reached out
  'manual'            -- Manually added
);

CREATE TYPE outreach_priority AS ENUM ('high', 'medium', 'low');

CREATE TYPE activity_outcome AS ENUM (
  'positive',        -- Good signal (interested, agreed, accepted)
  'neutral',         -- No clear signal (acknowledged, read)
  'negative',        -- Bad signal (declined, not interested)
  'no_response',     -- No response after reasonable time
  'bounced'          -- Email bounced, LI not delivered
);

-- ============================================================================
-- TABLE 1: OUTREACH_ORGS (company domain as natural key)
-- Named outreach_orgs to avoid collision with organizations (007_auth_users_orgs.sql)
-- ============================================================================

CREATE TABLE outreach_orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain VARCHAR(255) NOT NULL UNIQUE,       -- e.g. 'colbridgeventures.com', 'oneclicklca.com'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  size VARCHAR(100),                          -- '1-10', '11-50', '51-200', '201-500', '500+'
  industry VARCHAR(100),
  website TEXT,
  linkedin_url TEXT,

  -- Prospect tracking: orgs without a named contact yet
  prospect_status TEXT NOT NULL DEFAULT 'target_needs_contact'
    CHECK (prospect_status IN ('target_needs_contact', 'contact_identified', 'active')),

  -- Attribution
  source outreach_source DEFAULT 'manual' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'system' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TABLE 2: PERSONS (LinkedIn URL as natural key)
-- ============================================================================

CREATE TABLE persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  linkedin_url TEXT NOT NULL UNIQUE,          -- Primary identifier for dedup
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  title VARCHAR(255),
  location VARCHAR(255),

  -- Belongs to org (optional — some people are independent)
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,

  -- Attribution
  source outreach_source DEFAULT 'manual' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'system' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TABLE 3: PERSON EMAILS (multiple emails per person)
-- ============================================================================

CREATE TABLE person_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,

  -- Attribution
  source outreach_source DEFAULT 'manual' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'system' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  UNIQUE(person_id, email)
);

-- ============================================================================
-- TABLE 4: OUTREACH THREADS (person + org + pipeline + status)
-- ============================================================================

CREATE TABLE outreach_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core references
  person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,
  pipeline outreach_pipeline NOT NULL,
  priority outreach_priority DEFAULT 'medium' NOT NULL,

  -- Pipeline-specific fields
  investor_type VARCHAR(100),        -- 'VC', 'Angel', 'Family Office', 'Grants'
  check_size VARCHAR(100),           -- '$250K', '€500K-1M'
  partnership_type VARCHAR(100),     -- 'Technology', 'Reseller', 'Integration', 'Advisory'
  customer_segment VARCHAR(100),     -- 'Logistics', 'Construction', 'Manufacturing'

  -- Workflow
  status outreach_status DEFAULT 'new' NOT NULL,

  -- Context & notes
  boardy_notes TEXT,
  our_angle TEXT,                    -- Why this person matters to us
  their_angle TEXT,                  -- Why we matter to them
  next_action TEXT,                  -- What to do next (free text)
  next_action_type VARCHAR(50) DEFAULT 'research',  -- nudge, research, schedule, prep, push_to_decision
  next_action_date DATE,

  -- Tracking
  last_contacted_at TIMESTAMPTZ,
  last_response_at TIMESTAMPTZ,
  last_outbound_at TIMESTAMPTZ,            -- Last outbound action (sent/intro/nudge). Drives cadence timing.
  waiting_since DATE,                     -- When thread entered waiting (intro_made/contacted). Shows total stuck duration.
  meetings_count INTEGER DEFAULT 0,
  nudge_count INTEGER DEFAULT 0,          -- How many follow-up nudges sent in current sequence. Resets on received.

  -- Attribution
  source outreach_source DEFAULT 'manual' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'system' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- One thread = (person, org, pipeline). Never double-thread.
  UNIQUE(person_id, org_id, pipeline)
);

-- ============================================================================
-- TABLE 5: OUTREACH ACTIVITIES (every event tied to person + org + pipeline + channel)
-- ============================================================================

CREATE TABLE outreach_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES outreach_threads(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,
  pipeline outreach_pipeline NOT NULL,
  channel VARCHAR(50) NOT NULL,         -- 'email', 'linkedin', 'whatsapp', 'call', 'meeting', 'boardy'
  activity_type VARCHAR(50) NOT NULL,   -- 'sent', 'received', 'note', 'meeting', 'intro'
  description TEXT NOT NULL,

  -- Raw content (email body, LI message, call notes) — makes debugging trivial
  raw_payload JSONB,

  -- Outcome tracking — makes digest/daily_tasks generation trivial
  outcome activity_outcome,
  next_followup_at TIMESTAMPTZ,

  metadata JSONB DEFAULT '{}'::jsonb,

  -- Attribution
  source outreach_source DEFAULT 'manual' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'system' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- TABLE 6: DAILY OUTREACH TASKS (generated by scheduler, emailed to founder)
-- ============================================================================

CREATE TABLE outreach_daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pipeline outreach_pipeline NOT NULL,
  thread_id UUID REFERENCES outreach_threads(id) ON DELETE SET NULL,
  person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,
  task_description TEXT NOT NULL,
  context TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  -- Attribution
  created_by VARCHAR(100) DEFAULT 'scheduler' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Outreach Orgs
CREATE INDEX idx_outreach_orgs_name ON outreach_orgs(name);
CREATE INDEX idx_outreach_orgs_industry ON outreach_orgs(industry);

-- Persons
CREATE INDEX idx_persons_org ON persons(org_id);
CREATE INDEX idx_persons_name ON persons(first_name, last_name);

-- Person emails
CREATE INDEX idx_person_emails_email ON person_emails(email);
CREATE INDEX idx_person_emails_person ON person_emails(person_id);

-- Outreach threads
CREATE INDEX idx_outreach_threads_person ON outreach_threads(person_id);
CREATE INDEX idx_outreach_threads_org ON outreach_threads(org_id);
CREATE INDEX idx_outreach_threads_pipeline ON outreach_threads(pipeline);
CREATE INDEX idx_outreach_threads_status ON outreach_threads(status);
CREATE INDEX idx_outreach_threads_priority ON outreach_threads(priority);
CREATE INDEX idx_outreach_threads_next_action_date ON outreach_threads(next_action_date);
CREATE INDEX idx_outreach_threads_pipeline_status ON outreach_threads(pipeline, status);

-- Activities
CREATE INDEX idx_outreach_activities_thread ON outreach_activities(thread_id);
CREATE INDEX idx_outreach_activities_followup ON outreach_activities(next_followup_at) WHERE next_followup_at IS NOT NULL;
CREATE INDEX idx_outreach_activities_person ON outreach_activities(person_id);
CREATE INDEX idx_outreach_activities_pipeline ON outreach_activities(pipeline);
CREATE INDEX idx_outreach_activities_created ON outreach_activities(created_at DESC);

-- Daily tasks
CREATE INDEX idx_outreach_daily_tasks_date ON outreach_daily_tasks(task_date);
CREATE INDEX idx_outreach_daily_tasks_pipeline ON outreach_daily_tasks(pipeline, task_date);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_outreach_orgs_updated_at
  BEFORE UPDATE ON outreach_orgs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_persons_updated_at
  BEFORE UPDATE ON persons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outreach_threads_updated_at
  BEFORE UPDATE ON outreach_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sync thread state from latest activity
-- Rules:
--   1. Only move next_action_date FORWARD (never backwards from historical logs)
--   2. If outcome closes the thread (negative/bounced), NULL the date pointer
--   3. Skip already-closed threads (converted/passed/parked)
--   4. Reset waiting_since on every outbound (sent/intro/nudge) — measures "how long since we last did something"
--   5. Increment nudge_count on nudge activity_type, reset on received (they replied)
CREATE OR REPLACE FUNCTION sync_thread_from_activity()
RETURNS TRIGGER AS $$
DECLARE
  v_thread_status outreach_status;
BEGIN
  -- Check current thread status
  SELECT status INTO v_thread_status FROM outreach_threads WHERE id = NEW.thread_id;

  -- If thread is already closed, don't update dates
  IF v_thread_status IN ('converted', 'passed', 'parked') THEN
    RETURN NEW;
  END IF;

  UPDATE outreach_threads SET
    -- If outcome signals closure, NULL the date so it never appears in digest
    next_action_date = CASE
      WHEN NEW.outcome IN ('negative', 'bounced') THEN NULL
      WHEN NEW.next_followup_at IS NOT NULL
        AND (next_action_date IS NULL OR NEW.next_followup_at::date > next_action_date)
      THEN NEW.next_followup_at::date
      ELSE next_action_date
    END,
    last_contacted_at = CASE
      WHEN NEW.activity_type IN ('sent', 'meeting', 'intro', 'nudge') THEN NEW.created_at
      ELSE last_contacted_at
    END,
    last_response_at = CASE
      WHEN NEW.activity_type = 'received' THEN NEW.created_at
      ELSE last_response_at
    END,
    -- last_outbound_at: reset on every outbound action. Drives cadence timing. TIMESTAMPTZ for accuracy.
    last_outbound_at = CASE
      WHEN NEW.activity_type IN ('sent', 'intro', 'nudge') THEN NOW()
      ELSE last_outbound_at
    END,
    -- waiting_since: only set when thread enters WAITING status (intro_made/contacted).
    -- Does NOT reset on nudges — preserves "stuck 14 days" signal.
    -- Clears when thread exits waiting (received a response).
    waiting_since = CASE
      WHEN NEW.activity_type = 'received' THEN NULL
      WHEN waiting_since IS NULL
        AND NEW.activity_type IN ('sent', 'intro')
      THEN CURRENT_DATE
      ELSE waiting_since
    END,
    -- Increment nudge_count on nudge, reset on received (they responded)
    nudge_count = CASE
      WHEN NEW.activity_type = 'nudge' THEN nudge_count + 1
      WHEN NEW.activity_type = 'received' THEN 0
      ELSE nudge_count
    END
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_thread_on_activity_insert
  AFTER INSERT ON outreach_activities
  FOR EACH ROW EXECUTE FUNCTION sync_thread_from_activity();

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Enriched contact view (joins person + org for daily digest queries)
CREATE VIEW v_outreach_enriched AS
SELECT
  oc.id,
  oc.pipeline,
  oc.priority,
  oc.status,
  oc.source,
  oc.next_action,
  oc.next_action_type,
  oc.next_action_date,
  oc.our_angle,
  oc.their_angle,
  oc.boardy_notes,
  oc.last_contacted_at,
  oc.last_outbound_at,
  oc.waiting_since,
  oc.meetings_count,
  oc.nudge_count,
  oc.investor_type,
  oc.check_size,
  oc.partnership_type,
  oc.customer_segment,
  p.first_name,
  p.last_name,
  p.title AS person_title,
  p.linkedin_url,
  p.location AS person_location,
  o.name AS org_name,
  o.domain AS org_domain,
  o.location AS org_location,
  o.size AS org_size,
  pe.email AS primary_email,
  oc.person_id,
  oc.org_id,
  oc.created_at,
  oc.created_by
FROM outreach_threads oc
JOIN persons p ON oc.person_id = p.id
LEFT JOIN outreach_orgs o ON oc.org_id = o.id
LEFT JOIN person_emails pe ON pe.person_id = p.id AND pe.is_primary = TRUE;

-- Contacts due today (for daily digest)
CREATE VIEW v_outreach_due_today AS
SELECT ve.*,
  COALESCE(
    (SELECT COUNT(*) FROM outreach_activities oa WHERE oa.thread_id = ve.id),
    0
  ) AS activity_count
FROM v_outreach_enriched ve
WHERE ve.next_action_date <= CURRENT_DATE
  AND ve.status NOT IN ('converted', 'passed', 'parked')
ORDER BY ve.priority ASC, ve.next_action_date ASC;

-- Pipeline summary for daily digest
CREATE VIEW v_outreach_pipeline_summary AS
SELECT
  pipeline,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
  SUM(CASE WHEN status IN ('contacted', 'intro_made', 'intro_requested') THEN 1 ELSE 0 END) AS active_count,
  SUM(CASE WHEN status = 'meeting_booked' THEN 1 ELSE 0 END) AS meetings_count,
  SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) AS converted_count,
  SUM(CASE WHEN next_action_date <= CURRENT_DATE AND status NOT IN ('converted', 'passed', 'parked') THEN 1 ELSE 0 END) AS due_today
FROM outreach_threads
GROUP BY pipeline;

-- ============================================================================
-- RLS (Row Level Security)
-- ============================================================================

ALTER TABLE outreach_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_daily_tasks ENABLE ROW LEVEL SECURITY;

-- Service role full access (all tables)
CREATE POLICY "Service role full access" ON outreach_orgs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON persons FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON person_emails FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON outreach_threads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON outreach_activities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON outreach_daily_tasks FOR ALL USING (auth.role() = 'service_role');

-- Authenticated read access (all tables)
CREATE POLICY "Authenticated read" ON outreach_orgs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read" ON persons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read" ON person_emails FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read" ON outreach_threads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read" ON outreach_activities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read" ON outreach_daily_tasks FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Organizations first (domain as natural key)
INSERT INTO outreach_orgs (domain, name, description, location, size, industry, website, source, created_by) VALUES
  ('colbridgeventures.com', 'Colbridge Ventures', 'Pre-seed/seed climate tech VC + venture studio. $250K checks. London HQ, Hamburg partner.', 'London, UK', '11-50', 'Venture Capital', 'https://www.colbridgeventures.com', 'boardy', 'risto'),
  ('soldera.io', 'Soldera', 'Climate compliance ops for renewable energy certification. EU regulatory workflows.', 'UK', '11-50', 'Climate Tech', 'https://www.soldera.io', 'boardy', 'risto'),
  ('oneclicklca.com', 'One Click LCA', 'Building lifecycle assessment. Design-phase carbon analysis. €21.8M revenue, 200+ people.', 'Helsinki, Finland', '201-500', 'Construction Tech', 'https://www.oneclicklca.com', 'manual', 'risto'),
  ('ifs.com', 'IFS Cloud', 'ERP for asset-intensive industries. Construction, manufacturing, energy. Linkoping HQ.', 'Linkoping, Sweden', '500+', 'Enterprise Software', 'https://www.ifs.com', 'manual', 'risto'),
  ('sap.com', 'SAP', 'Largest ERP globally. S/4HANA. PartnerEdge program.', 'Walldorf, Germany', '500+', 'Enterprise Software', 'https://www.sap.com', 'manual', 'risto'),
  ('ncc.se', 'NCC AB', 'Nordic construction giant. Uses IFS Cloud. CSRD obligated.', 'Stockholm, Sweden', '500+', 'Construction', 'https://www.ncc.se', 'manual', 'risto');

-- Persons (LinkedIn URL as natural key)
INSERT INTO persons (linkedin_url, first_name, last_name, title, location, org_id, source, created_by) VALUES
  (
    'https://www.linkedin.com/in/nicolasderrien1/',
    'Nicolas', 'Derrien', 'Partner',
    'Hamburg, Germany',
    (SELECT id FROM outreach_orgs WHERE domain = 'colbridgeventures.com'),
    'boardy', 'risto'
  ),
  (
    'https://www.linkedin.com/in/ACoAADbNXUABBBu1fZSxkX3tRBbZU_5JAvG1lJs',
    'Oliver', 'Bonallack', 'Founders Associate',
    'UK',
    (SELECT id FROM outreach_orgs WHERE domain = 'soldera.io'),
    'boardy', 'risto'
  );

-- Outreach contacts (person + org + pipeline)
-- Nicolas Derrien -> investor pipeline
-- Boardy intro already accepted via WhatsApp. Waiting for Boardy to deliver the intro.
INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority,
  investor_type, check_size,
  status, source, created_by,
  boardy_notes, our_angle, their_angle,
  next_action, next_action_type, next_action_date, waiting_since
) VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/nicolasderrien1/'),
  (SELECT id FROM outreach_orgs WHERE domain = 'colbridgeventures.com'),
  'investor', 'high',
  'VC', '$250K',
  'intro_requested', 'boardy', 'risto',
  'Partner at Colbridge Ventures (London/Hamburg). Pre-seed and seed climate tech. Decision maker. Often leans capex-heavy climate infra. Co-founder of Continuum Composite Recycling (wind blade recycling). Ohio State MBA.',
  'Colbridge does pre-seed climate tech. Their portfolio companies (Continuum, WASE, Anzen) all need EU compliance reporting. DWS IQ is the compliance layer for the ecosystem they already invest in. $250K check co-lead.',
  'Industrial decarb + compliance automation at €84k ARR. SaaS with clear ROI, not capex-heavy. Every factory in his portfolio needs CSRD reporting.',
  'Waiting for Boardy to deliver intro. Prep 1-pager: SaaS economics + recurring revenue.',
  'wait', NULL, CURRENT_DATE
);

-- Oliver Bonallack -> partner pipeline (not investor — he's a peer, not a check writer)
-- Boardy intro already accepted via WhatsApp. Waiting for Boardy to deliver the intro.
INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority,
  partnership_type,
  status, source, created_by,
  boardy_notes, our_angle, their_angle,
  next_action, next_action_type, next_action_date, waiting_since
) VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/ACoAADbNXUABBBu1fZSxkX3tRBbZU_5JAvG1lJs'),
  (SELECT id FROM outreach_orgs WHERE domain = 'soldera.io'),
  'partner', 'medium',
  'Advisory',
  'intro_requested', 'boardy', 'risto',
  'Founders Associate at Soldera. Climate compliance ops for renewable certification. EU regulatory workflows. Not an investor. Deep in regulation-to-workflow automation.',
  'Same regulatory-workflow DNA. Playbook sharing, UK/EU climate circle intros, potential partnership on overlapping compliance workflows.',
  'Sees regulation-to-workflow automation daily. Could validate our approach and intro us to UK/EU climate compliance buyers.',
  'Waiting for Boardy to deliver intro. Prep peer conversation angle.',
  'wait', NULL, CURRENT_DATE
);

-- One Click LCA, IFS, NCC — orgs exist above but NO placeholder persons/threads.
-- Rule: only create person+thread when you have a named human with LinkedIn URL.
-- The org's prospect_status = 'target_needs_contact' signals "find the buyer first".

-- Log initial Boardy activities
INSERT INTO outreach_activities (thread_id, person_id, org_id, pipeline, channel, activity_type, description, raw_payload, outcome, source, created_by)
SELECT
  oc.id, oc.person_id, oc.org_id, oc.pipeline,
  'boardy', 'intro',
  'Boardy recommended warm intro. ' || oc.boardy_notes,
  jsonb_build_object('boardy_notes', oc.boardy_notes, 'our_angle', oc.our_angle),
  'positive',
  'boardy', 'risto'
FROM outreach_threads oc
WHERE oc.source = 'boardy';

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE outreach_orgs IS 'Companies/funds for outreach. Domain as natural unique key. Separate from auth organizations (007).';
COMMENT ON TABLE persons IS 'People. LinkedIn URL as natural unique key. Dedup on linkedin_url.';
COMMENT ON TABLE person_emails IS 'Multiple emails per person. Email is changeable, LinkedIn URL is not.';
COMMENT ON TABLE outreach_threads IS 'Conversation state: one per person per pipeline per org. Separates "who" from "what happened".';
COMMENT ON TABLE outreach_activities IS 'Event log: thread_id + person_id + org_id + pipeline + channel. raw_payload stores full content. outcome + next_followup_at drive daily digest.';
COMMENT ON TABLE outreach_daily_tasks IS 'Daily generated tasks emailed to founder (3 tasks, 5 days/week).';
