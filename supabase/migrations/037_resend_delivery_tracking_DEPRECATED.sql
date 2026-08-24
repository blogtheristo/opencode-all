-- DWS IQ 6 - Resend Delivery Tracking
-- Migration: Add resend_email_id to email_logs for delivery event correlation.
-- Enables bounce/delivery webhooks to update email status by Resend email ID.

-- ============================================================
-- ADD resend_email_id TO email_logs
-- Resend returns a unique ID (e.g. "email_abc123") for every send.
-- We store it to correlate delivery event webhooks back to the log row.
-- ============================================================

ALTER TABLE email_logs
  ADD COLUMN IF NOT EXISTS resend_email_id text;

-- Index for fast webhook delivery event lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id
  ON email_logs(resend_email_id)
  WHERE resend_email_id IS NOT NULL;

-- ============================================================
-- EXTEND status CHECK to include delivery event types
-- email.delivered → 'delivered'
-- email.bounced   → 'bounced'
-- email.complained → 'complained' (spam report)
-- ============================================================

ALTER TABLE email_logs
  DROP CONSTRAINT IF EXISTS email_logs_status_check;

ALTER TABLE email_logs
  ADD CONSTRAINT email_logs_status_check
  CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'bounced', 'complained'));

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON COLUMN email_logs.resend_email_id IS
  'Resend email ID (e.g. email_abc123) returned on send. Used to correlate delivery/bounce webhook events.';
