-- Acknowledgement tracking for inbound web leads (071).
-- Lets scripts/hourly/web-leads-ack.ts send a one-time acknowledgement email
-- per lead (via Amazon SES) without ever double-sending. Idempotent/replay-safe.

ALTER TABLE web_leads ADD COLUMN IF NOT EXISTS ack_sent_at timestamptz;

-- Partial index makes "find leads still needing an ack" cheap.
CREATE INDEX IF NOT EXISTS web_leads_ack_pending_idx
    ON web_leads (created_at)
    WHERE ack_sent_at IS NULL;
