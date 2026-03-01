-- Migration 035: Anna Gueorguieva (GreeniumDC) — Boardy intro partner
-- Renumbered from 032 (was duplicate 032).
-- Source: Boardy connect-note, 2026-02-20
-- Pipeline: partner (ecosystem — data integration)

INSERT INTO outreach_orgs (domain, name, description, location, size, industry, website, source, created_by)
VALUES (
  'greeniumdc.com',
  'GreeniumDC',
  'Sustainability data aggregation and climate analytics for institutional asset managers and REITs. 50+ asset manager clients. Built environment / ESG analytics segment.',
  'International',
  '11-50',
  'Climate Tech',
  NULL,
  'boardy',
  'risto'
)
ON CONFLICT (domain) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO persons (linkedin_url, first_name, last_name, title, location, org_id, source, created_by)
VALUES (
  'https://www.linkedin.com/in/anna-gueorguieva/',
  'Anna',
  'Gueorguieva',
  'Chief Sustainability Officer (CSO)',
  'International',
  (SELECT id FROM outreach_orgs WHERE domain = 'greeniumdc.com'),
  'boardy',
  'risto'
)
ON CONFLICT (linkedin_url) DO UPDATE SET
  title = EXCLUDED.title,
  org_id = EXCLUDED.org_id,
  updated_at = NOW();

INSERT INTO person_emails (person_id, email, is_primary, verified, source, created_by)
VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/'),
  'annagindc@gmail.com',
  TRUE,
  FALSE,
  'boardy',
  'risto'
)
ON CONFLICT (person_id, email) DO NOTHING;

INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority,
  partnership_type,
  status, source, created_by,
  boardy_notes,
  our_angle,
  their_angle,
  next_action,
  next_action_type,
  next_action_date,
  waiting_since
) VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/'),
  (SELECT id FROM outreach_orgs WHERE domain = 'greeniumdc.com'),
  'partner',
  'high',
  'Integration',
  'intro_made',
  'boardy',
  'risto',
  'Ph.D., CSO at GreeniumDC. Former World Bank + Bridge Investment Group (€48B portfolio TCFD report). 50+ asset manager clients. Built environment ESG analytics. Boardy intro sent to annagindc@gmail.com.',
  'GreeniumDC aggregates climate data for 50+ asset managers. DWS IQ 6 turns that data into predictive FCD values. "Your output is our input." Integration creates joint value for mutual clients. She can also validate FCD pitch from investment committee perspective.',
  'DWS IQ 6 predictive layer makes GreeniumDC data more valuable. FCD concept is directly relevant to her TCFD work. Integration differentiates GreeniumDC from pure data aggregators.',
  'Send intro email (risto@onelifetime.world → annagindc@gmail.com). Schedule 30-min call. Prepare FCD one-pager + integration sketch.',
  'schedule',
  CURRENT_DATE + 1,
  CURRENT_DATE
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

INSERT INTO outreach_activities (
  thread_id, person_id, org_id, pipeline,
  channel, activity_type, description,
  raw_payload, outcome, source, created_by,
  next_followup_at
)
SELECT
  ot.id,
  ot.person_id,
  ot.org_id,
  'partner',
  'boardy',
  'intro',
  'Boardy connected Risto and Anna Gueorguieva (CSO, GreeniumDC). Anna has Ph.D., World Bank + Bridge Investment Group experience (€48B portfolio). 50+ asset manager clients at GreeniumDC. Ecosystem partner for FCD validation and data integration.',
  jsonb_build_object(
    'boardy_notes', ot.boardy_notes,
    'anna_email', 'annagindc@gmail.com',
    'anna_title', 'CSO',
    'anna_company', 'GreeniumDC',
    'anna_background', 'Ph.D., World Bank, Bridge Investment Group (€48B TCFD report)',
    'partnership_type', 'Ecosystem / Data Integration',
    'fcd_validation', true,
    'asset_manager_clients', '50+'
  ),
  'positive',
  'boardy',
  'risto',
  (CURRENT_DATE + 1)::timestamptz
FROM outreach_threads ot
WHERE ot.person_id = (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/')
  AND ot.pipeline = 'partner';
