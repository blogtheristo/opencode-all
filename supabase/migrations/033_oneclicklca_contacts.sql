-- Migration: 033_oneclicklca_contacts
-- Date: 2026-02-24
-- Purpose: Add One Click LCA partnership contacts (Panu Pasanen CEO, Simon Sim Communicator)
--          and create outreach thread for partnership pitch
-- Session: claude/oneclicklca-partnership-pitch-k7R62

-- Persons: Panu Pasanen (CEO) and Simon Sim (connection/intro path)
INSERT INTO persons (linkedin_url, first_name, last_name, title, location, org_id, source, created_by) VALUES
  (
    'https://www.linkedin.com/in/panupasanen/',
    'Panu', 'Pasanen', 'CEO & Founder',
    'Helsinki, Finland',
    (SELECT id FROM outreach_orgs WHERE domain = 'oneclicklca.com'),
    'manual', 'risto'
  ),
  (
    'https://www.linkedin.com/in/simonsim/',
    'Simon', 'Sim', 'Communicator',
    'Helsinki, Finland',
    (SELECT id FROM outreach_orgs WHERE domain = 'oneclicklca.com'),
    'manual', 'risto'
  )
ON CONFLICT (linkedin_url) DO NOTHING;

-- Update One Click LCA org description with latest info (SimaPro acquisition, funding)
UPDATE outreach_orgs
SET description = 'World''s largest LCA & EPD platform. Design-phase carbon analysis. €21.8M revenue, 228+ people. Acquired SimaPro/PRé (Sept 2025). $43.8M funding (InfraVia, PSG). 170+ countries, 500k+ LCA data points.'
WHERE domain = 'oneclicklca.com';

-- Outreach thread: Partnership pitch via Simon Sim → Panu Pasanen
INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority,
  partnership_type,
  status, source, created_by,
  boardy_notes, our_angle, their_angle,
  next_action, next_action_type, next_action_date, waiting_since
) VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/panupasanen/'),
  (SELECT id FROM outreach_orgs WHERE domain = 'oneclicklca.com'),
  'partner', 'high',
  'Technology',
  'new', 'manual', 'risto',
  'CEO & Founder of One Click LCA. Decarbonization evangelist. Helsinki-based. Connection path via Simon Sim (Communicator). Two pitch versions prepared: warm intro via Simon Sim + direct to Panu.',
  'Their LCA output = our compliance input. We import One Click LCA building assessments as design-phase baselines for CSRD/ETS/CBAM reporting. Reduces their churn (customer keeps subscription), extends their platform into operations compliance. No competition — we are downstream.',
  'Platform extension into operations lifecycle without building it. Churn reduction on design-phase customers. Revenue share from CSRD customer referrals needing LCA data. 49,000 EU companies need CSRD, many already One Click LCA users.',
  'Send Version 1 pitch via Simon Sim (warm intro to Panu Pasanen). If no response in 5 days, send Version 2 directly.',
  'send', CURRENT_DATE, NULL
)
ON CONFLICT (person_id, org_id, pipeline) DO UPDATE SET
  priority = EXCLUDED.priority,
  partnership_type = EXCLUDED.partnership_type,
  status = EXCLUDED.status,
  boardy_notes = EXCLUDED.boardy_notes,
  our_angle = EXCLUDED.our_angle,
  their_angle = EXCLUDED.their_angle,
  next_action = EXCLUDED.next_action,
  next_action_type = EXCLUDED.next_action_type,
  next_action_date = EXCLUDED.next_action_date,
  waiting_since = EXCLUDED.waiting_since,
  updated_at = NOW();
