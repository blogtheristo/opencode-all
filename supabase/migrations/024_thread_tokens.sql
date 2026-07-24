-- Migration 024: Thread tokens + inbound email reply support
-- Renumbered from 017 (Supabase has 016-022 already deployed).
-- Depends on 023_outreach_contacts.sql (outreach_orgs, persons, outreach_threads).
--
-- 1. thread_token on outreach_threads — stable 10-char alphanumeric token (50 bits)
--    Used in digest emails: "T:8F3K2P9Q7H [INV] Nicolas Derrien …"
--    User replies:          "T:8F3K2P9Q7H status responded"
--
-- 2. inbound_emails table — idempotency for webhook retries
--    Stores Resend message_id with UNIQUE constraint.
--
-- 3. manual_update + manual_update_failed outcome values

-- ============================================================================
-- 1. THREAD TOKEN
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Token generator: 10-char from safe alphabet (no 0/O, 1/I/L). 30^10 ≈ 590 trillion values.
CREATE OR REPLACE FUNCTION generate_thread_token(len INT DEFAULT 10)
RETURNS TEXT AS $$
DECLARE
  alphabet TEXT := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  result TEXT := '';
  i INT;
  bytes BYTEA;
BEGIN
  bytes := gen_random_bytes(len);
  FOR i IN 0..len-1 LOOP
    result := result || substr(alphabet, (get_byte(bytes, i) % 30) + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add column (nullable for backfill)
ALTER TABLE outreach_threads
  ADD COLUMN IF NOT EXISTS thread_token TEXT;

-- Backfill existing rows
UPDATE outreach_threads
SET thread_token = generate_thread_token()
WHERE thread_token IS NULL;

-- NOT NULL + UNIQUE + CHECK uppercase alphanumeric 4-12 chars
ALTER TABLE outreach_threads
  ALTER COLUMN thread_token SET NOT NULL;

ALTER TABLE outreach_threads
  ALTER COLUMN thread_token SET DEFAULT generate_thread_token();

ALTER TABLE outreach_threads
  ADD CONSTRAINT outreach_threads_thread_token_key UNIQUE (thread_token);

ALTER TABLE outreach_threads
  ADD CONSTRAINT outreach_threads_thread_token_format
  CHECK (thread_token ~ '^[23456789A-HJ-NP-Z]{4,12}$');

-- ============================================================================
-- 2. INBOUND EMAILS — webhook idempotency
-- ============================================================================

CREATE TABLE IF NOT EXISTS inbound_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  from_email TEXT,
  subject TEXT,
  thread_token TEXT,
  command_line TEXT,
  parse_ok BOOLEAN DEFAULT false,
  error TEXT,
  raw_payload JSONB NOT NULL,

  CONSTRAINT inbound_emails_provider_message_id_key UNIQUE (provider_message_id)
);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_received_at ON inbound_emails (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_thread_token ON inbound_emails (thread_token);

-- RLS for inbound_emails
ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access" ON inbound_emails FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- 3. ACTIVITY OUTCOME — add manual_update values
-- ============================================================================

ALTER TYPE activity_outcome ADD VALUE IF NOT EXISTS 'manual_update';
ALTER TYPE activity_outcome ADD VALUE IF NOT EXISTS 'manual_update_failed';

-- ============================================================================
-- 4. UPDATE ENRICHED VIEW — include thread_token
-- Must DROP first because CREATE OR REPLACE VIEW cannot remove columns.
-- The 023 view has columns (their_angle, boardy_notes, investor_type, etc.)
-- that we keep here. We add thread_token.
-- ============================================================================

-- v_outreach_due_today (023) depends on v_outreach_enriched — drop dependent first.
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

DROP VIEW IF EXISTS v_outreach_due_today;
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
