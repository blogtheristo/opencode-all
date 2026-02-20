-- DWS IQ 6 - Email Queue: Redis Streams audit trail
-- Migration for email queue tracking and dead-letter persistence
-- Feature: Email Capability with Redis Streams

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- EMAIL QUEUE TABLE
-- Mirrors Redis Streams entries for audit, analytics, and
-- recovery if Redis data is lost. Each row corresponds to
-- one XADD on the email:outbox stream.
-- ============================================================
CREATE TABLE IF NOT EXISTS email_queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stream_message_id text UNIQUE,
  to_email text NOT NULL,
  subject text NOT NULL,
  template_type text,
  source text DEFAULT 'platform' CHECK (source IN ('platform', 'firehorse', 'outreach', 'admin')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'dead_letter')),
  attempts integer DEFAULT 0,
  sent_at timestamptz,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  enqueued_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes for email_queue
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_source ON email_queue(source);
CREATE INDEX idx_email_queue_to ON email_queue(to_email, created_at DESC);
CREATE INDEX idx_email_queue_enqueued ON email_queue(enqueued_at DESC);
CREATE INDEX idx_email_queue_stream_id ON email_queue(stream_message_id) WHERE stream_message_id IS NOT NULL;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Service role has full access (backend queue worker)
CREATE POLICY "Service role has full access to email_queue"
  ON email_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can view their org's queue entries (read-only)
-- This requires a join through email_logs.organization_id for org-scoped access.
-- For now, only service role can access queue data.
CREATE POLICY "Authenticated users can view email_queue"
  ON email_queue FOR SELECT
  TO authenticated
  USING (false);  -- Restricted by default; open per org if needed

-- ============================================================
-- EMAIL QUEUE STATS VIEW
-- Aggregated view for dashboard monitoring
-- ============================================================
CREATE OR REPLACE VIEW v_email_queue_stats AS
SELECT
  source,
  status,
  count(*) AS total,
  count(*) FILTER (WHERE created_at > now() - interval '1 hour') AS last_hour,
  count(*) FILTER (WHERE created_at > now() - interval '24 hours') AS last_24h,
  max(created_at) AS latest
FROM email_queue
GROUP BY source, status
ORDER BY source, status;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE email_queue IS 'Audit trail for emails queued via Redis Streams (email:outbox). Tracks delivery status from enqueue through send or dead-letter.';
COMMENT ON COLUMN email_queue.stream_message_id IS 'Redis Streams message ID (e.g. 1234567890-0). Unique per enqueue.';
COMMENT ON COLUMN email_queue.to_email IS 'Recipient email address';
COMMENT ON COLUMN email_queue.subject IS 'Email subject line';
COMMENT ON COLUMN email_queue.template_type IS 'Template identifier (welcome, password_reset, report_delivery, notification, invoice, custom)';
COMMENT ON COLUMN email_queue.source IS 'Originating system: platform (core), firehorse (campaigns), outreach (digest), admin';
COMMENT ON COLUMN email_queue.status IS 'Delivery lifecycle: queued → sent | failed | dead_letter';
COMMENT ON COLUMN email_queue.attempts IS 'Number of delivery attempts made by the queue worker';
COMMENT ON COLUMN email_queue.sent_at IS 'Timestamp when delivery was confirmed by the email provider';
COMMENT ON COLUMN email_queue.error IS 'Last error message if delivery failed';
COMMENT ON COLUMN email_queue.metadata IS 'Arbitrary JSON metadata (template variables, lead_id, etc.)';
COMMENT ON COLUMN email_queue.enqueued_at IS 'Timestamp when the message was added to the Redis stream';

COMMENT ON VIEW v_email_queue_stats IS 'Aggregated email queue statistics by source and status for dashboard monitoring';
