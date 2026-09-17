-- =============================================================================
-- SEED: Add Suzana Delanghe (CRO, One Click LCA) as a fresh partner lead
-- File:    supabase/seeds/20260518_add_suzana_delanghe_ocl.sql
-- Author:  claude/one-click-lca-partnership-MIYvn
-- Pairs with: supabase/cleanup/20260518_park_stalled_ocl_and_ncc.sql
--             partners-outreach/LETTER_SUZANA_DELANGHE_OCL.md
--
-- Effect: tomorrow's morning brief surfaces Suzana under the partner
-- pipeline with next_action_date = today (overdue → top of brief).
--
-- Idempotent: ON CONFLICT DO NOTHING on natural keys (linkedin_url, domain).
-- Safe to re-run.
--
-- How to run:
--   1) Open Supabase SQL editor.
--   2) Paste this entire file and run.
--   3) Verify the SELECT at the end shows one row for Suzana.
-- =============================================================================

BEGIN;

-- ── ORG: One Click LCA (insert or fetch existing) ──────────────────────────
INSERT INTO outreach_orgs (
  domain, name, description, location, size, industry, website, linkedin_url,
  prospect_status, source, created_by
)
VALUES (
  'oneclicklca.com',
  'One Click LCA',
  'World''s largest LCA & EPD platform. Acquired SimaPro & PRé (Sept 2025).',
  'Helsinki, Finland',
  '201-500',
  'Sustainability / LCA Software',
  'https://oneclicklca.com',
  'https://www.linkedin.com/company/one-click-lca',
  'active',
  'manual',
  'claude/one-click-lca-partnership-MIYvn'
)
ON CONFLICT (domain) DO UPDATE
  SET prospect_status = 'active',
      updated_at = NOW();

-- ── PERSON: Suzana Delanghe (CRO) ───────────────────────────────────────────
INSERT INTO persons (
  linkedin_url, first_name, last_name, title, location, org_id,
  source, created_by
)
SELECT
  'https://www.linkedin.com/in/suzana-delanghe-272278',
  'Suzana',
  'Delanghe',
  'Chief Revenue Officer',
  'Helsinki, Finland',
  o.id,
  'linkedin',
  'claude/one-click-lca-partnership-MIYvn'
FROM outreach_orgs o
WHERE o.domain = 'oneclicklca.com'
ON CONFLICT (linkedin_url) DO UPDATE
  SET title = EXCLUDED.title,
      updated_at = NOW();

-- ── THREAD: partner pipeline, status = 'new', due today ─────────────────────
INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority, partnership_type,
  status, our_angle, their_angle,
  next_action, next_action_type, next_action_date,
  source, created_by
)
SELECT
  p.id,
  o.id,
  'partner'::outreach_pipeline,
  'high'::outreach_priority,
  'Technology / Data Integration',
  'new'::outreach_status,
  'Their LCA output is our compliance input. Design-phase baselines feed CSRD/ETS/CBAM reporting.',
  'Operations-phase compliance extension without R&D. Churn reduction. Co-sell into CSRD buyers.',
  'Submit partner program form + LinkedIn DM Suzana same day. EN/FR bilingual courtesy.',
  'send',
  CURRENT_DATE,
  'linkedin'::outreach_source,
  'claude/one-click-lca-partnership-MIYvn'
FROM persons p
JOIN outreach_orgs o ON o.id = p.org_id
WHERE p.linkedin_url = 'https://www.linkedin.com/in/suzana-delanghe-272278'
ON CONFLICT (person_id, org_id, pipeline) DO UPDATE
  SET status = CASE
                 WHEN outreach_threads.status IN ('converted', 'passed', 'parked')
                   THEN outreach_threads.status  -- don't revive closed threads automatically
                 ELSE 'new'::outreach_status
               END,
      next_action = EXCLUDED.next_action,
      next_action_date = EXCLUDED.next_action_date,
      next_action_type = EXCLUDED.next_action_type,
      our_angle = EXCLUDED.our_angle,
      their_angle = EXCLUDED.their_angle,
      priority = EXCLUDED.priority,
      partnership_type = EXCLUDED.partnership_type,
      updated_at = NOW();

-- ── VERIFICATION ────────────────────────────────────────────────────────────
SELECT ve.first_name || ' ' || ve.last_name AS person,
       ve.person_title,
       ve.org_name,
       ve.pipeline,
       ve.status,
       ve.priority,
       ve.next_action,
       ve.next_action_date,
       ve.linkedin_url
FROM v_outreach_enriched ve
WHERE ve.linkedin_url = 'https://www.linkedin.com/in/suzana-delanghe-272278';

COMMIT;
