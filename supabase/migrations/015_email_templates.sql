-- DWS IQ 6 - Email System: Logs and Template Storage
-- Migration for email tracking and template management
-- Feature 9: Email System

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- EMAIL LOGS TABLE
-- Tracks every outbound email for auditing and debugging
-- ============================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_email text NOT NULL,
  from_email text NOT NULL,
  subject text NOT NULL,
  template_type text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  sent_at timestamptz,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  -- Organization scope for RLS
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes for email_logs
CREATE INDEX idx_email_logs_to_sent ON email_logs(to_email, sent_at DESC);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_template ON email_logs(template_type);
CREATE INDEX idx_email_logs_org ON email_logs(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_email_logs_created ON email_logs(created_at DESC);

-- ============================================================
-- EMAIL TEMPLATES TABLE
-- Stores editable email templates with variable placeholders
-- ============================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  subject_template text NOT NULL,
  body_template text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for active template lookups
CREATE INDEX idx_email_templates_name_active ON email_templates(name) WHERE active = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- email_logs: Organization-scoped access
-- Users can view email logs belonging to their organization
CREATE POLICY "Users can view email logs for their organization"
  ON email_logs FOR SELECT
  USING (
    organization_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = email_logs.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

-- Org admins can insert email logs (triggered by sending emails)
CREATE POLICY "Org admins can insert email logs"
  ON email_logs FOR INSERT
  WITH CHECK (
    organization_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = email_logs.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.status = 'active'
    )
  );

-- Service role has full access to email_logs (backend operations)
CREATE POLICY "Service role has full access to email_logs"
  ON email_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- email_templates: Read access for authenticated users, write for service role
CREATE POLICY "Authenticated users can view active templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (active = true);

-- Service role has full access to email_templates (manage templates)
CREATE POLICY "Service role has full access to email_templates"
  ON email_templates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at on email_templates changes
-- Uses the update_updated_at_column() function from 007_auth_users_orgs.sql
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DEFAULT TEMPLATES
-- ============================================================

INSERT INTO email_templates (name, subject_template, body_template, variables, active) VALUES
  (
    'welcome',
    'Welcome to DWS IQ 6',
    'Hi {{name}}, your DWS IQ 6 account has been created.',
    '["name"]'::jsonb,
    true
  ),
  (
    'password_reset',
    'Reset Your Password - DWS IQ 6',
    'Click the link to reset your password: {{resetLink}}',
    '["resetLink"]'::jsonb,
    true
  ),
  (
    'report_delivery',
    'Your Report Is Ready: {{reportName}}',
    'Your report "{{reportName}}" is ready. Download: {{downloadUrl}}',
    '["reportName", "downloadUrl"]'::jsonb,
    true
  ),
  (
    'notification',
    '{{subject}}',
    '{{body}}',
    '["subject", "body"]'::jsonb,
    true
  ),
  (
    'invoice',
    'Invoice {{invoiceId}} - DWS IQ 6',
    'Invoice {{invoiceId}} for {{currency}} {{amount}} has been generated.',
    '["invoiceId", "amount", "currency"]'::jsonb,
    true
  )
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE email_logs IS 'Audit trail for all outbound transactional emails sent by the platform';
COMMENT ON COLUMN email_logs.to_email IS 'Recipient email address';
COMMENT ON COLUMN email_logs.from_email IS 'Sender email address';
COMMENT ON COLUMN email_logs.subject IS 'Email subject line';
COMMENT ON COLUMN email_logs.template_type IS 'Template identifier (welcome, password_reset, report_delivery, notification, invoice)';
COMMENT ON COLUMN email_logs.status IS 'Delivery status: pending, sent, failed, or bounced';
COMMENT ON COLUMN email_logs.sent_at IS 'Timestamp when the email was successfully delivered to the provider';
COMMENT ON COLUMN email_logs.error IS 'Error message if delivery failed';
COMMENT ON COLUMN email_logs.metadata IS 'Additional context stored as JSON (template variables, provider response, etc.)';
COMMENT ON COLUMN email_logs.organization_id IS 'Organization that owns this email log entry (for RLS scoping)';

COMMENT ON TABLE email_templates IS 'Editable email templates with variable placeholders for dynamic content';
COMMENT ON COLUMN email_templates.name IS 'Unique template identifier';
COMMENT ON COLUMN email_templates.subject_template IS 'Email subject with {{variable}} placeholders';
COMMENT ON COLUMN email_templates.body_template IS 'Email body with {{variable}} placeholders';
COMMENT ON COLUMN email_templates.variables IS 'JSON array of variable names expected by this template';
COMMENT ON COLUMN email_templates.active IS 'Whether this template is currently in use';
