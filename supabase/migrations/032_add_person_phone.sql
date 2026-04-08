-- Migration 032: Add phone to persons + update enriched view
--
-- Adds phone column so CEO can call prospects directly from morning briefing.
-- Updates v_outreach_enriched to include phone.

-- ============================================================================
-- 1. ADD PHONE COLUMN TO PERSONS
-- ============================================================================

ALTER TABLE persons
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

COMMENT ON COLUMN persons.phone IS 'Phone number for direct calls. International format preferred (+358...).';

-- Index for phone lookups
CREATE INDEX IF NOT EXISTS idx_persons_phone ON persons(phone) WHERE phone IS NOT NULL;

-- ============================================================================
-- 2. UPDATE ENRICHED VIEW — include phone
-- ============================================================================

DROP VIEW IF EXISTS v_outreach_due_today;
DROP VIEW IF EXISTS v_outreach_enriched;
CREATE VIEW v_outreach_enriched
  WITH (security_invoker = true)
AS
SELECT
  t.id,
  t.pipeline,
  t.priority,
  t.status,
  t.source,
  t.next_action,
  t.next_action_type,
  t.next_action_date,
  t.our_angle,
  t.their_angle,
  t.boardy_notes,
  t.last_contacted_at,
  t.last_outbound_at,
  t.waiting_since,
  t.meetings_count,
  t.nudge_count,
  t.thread_token,
  t.investor_type,
  t.check_size,
  t.partnership_type,
  t.customer_segment,
  p.first_name,
  p.last_name,
  p.title AS person_title,
  p.linkedin_url,
  p.location AS person_location,
  p.phone AS person_phone,
  o.name AS org_name,
  o.domain AS org_domain,
  o.location AS org_location,
  o.size AS org_size,
  pe.email AS primary_email,
  t.person_id, t.org_id, t.created_at, t.created_by
FROM outreach_threads t
JOIN persons p ON p.id = t.person_id
LEFT JOIN outreach_orgs o ON o.id = t.org_id
LEFT JOIN person_emails pe ON pe.person_id = p.id AND pe.is_primary = true;

-- Recreate dependent view
CREATE VIEW v_outreach_due_today
  WITH (security_invoker = true)
AS
SELECT ve.*,
  COALESCE(
    (SELECT COUNT(*) FROM outreach_activities oa WHERE oa.thread_id = ve.id),
    0
  ) AS activity_count
FROM v_outreach_enriched ve
WHERE ve.next_action_date <= CURRENT_DATE
  AND ve.status NOT IN ('converted', 'passed', 'parked')
ORDER BY ve.priority ASC, ve.next_action_date ASC;
