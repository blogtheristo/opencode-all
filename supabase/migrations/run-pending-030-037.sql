-- PENDING MIGRATIONS 030-037 (legacy bundled run)
-- STATUS: Applied on hosted DB — 030-037 complete; no further action from this file.
-- Supabase Studio -> SQL Editor -> paste -> Run (idempotent replay still safe)
-- All statements idempotent (IF NOT EXISTS / ON CONFLICT DO NOTHING)
-- New work: use numbered files in this folder (038+) and `supabase db push` / migration history.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 030 agent tables
CREATE TABLE IF NOT EXISTS agent_activity (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL, task text NOT NULL, status text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb, created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_name ON agent_activity(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_activity_status ON agent_activity(status);
CREATE INDEX IF NOT EXISTS idx_agent_activity_created_at ON agent_activity(created_at DESC);

CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL, task text NOT NULL, status text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb, timestamp timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_timestamp ON agent_logs(timestamp DESC);

CREATE TABLE IF NOT EXISTS agent_executions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL, user_id uuid NOT NULL, org_id uuid NOT NULL,
  session_id text NOT NULL, project_id text NOT NULL,
  input jsonb DEFAULT '{}'::jsonb, output jsonb,
  status text NOT NULL CHECK (status IN ('started','completed','error')),
  error_message text, duration_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_name ON agent_executions(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_session_id ON agent_executions(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created_at ON agent_executions(created_at DESC);

ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agent_activity' AND policyname='svc_aa') THEN
    CREATE POLICY svc_aa ON agent_activity FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agent_logs' AND policyname='svc_al') THEN
    CREATE POLICY svc_al ON agent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='agent_executions' AND policyname='svc_ae') THEN
    CREATE POLICY svc_ae ON agent_executions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 031 FK indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_contract_id ON subscriptions(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_contract_id ON transactions(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_import_shipments_supplier_id ON import_shipments(supplier_id) WHERE supplier_id IS NOT NULL;

-- 032 phone on persons
ALTER TABLE persons ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
CREATE INDEX IF NOT EXISTS idx_persons_phone ON persons(phone) WHERE phone IS NOT NULL;

DROP VIEW IF EXISTS v_outreach_due_today;
DROP VIEW IF EXISTS v_outreach_enriched;
CREATE VIEW v_outreach_enriched WITH (security_invoker = true) AS
SELECT
  t.id AS id,
  t.pipeline, t.priority, t.status, t.source,
  t.next_action, t.next_action_type, t.next_action_date,
  t.our_angle, t.their_angle, t.boardy_notes,
  t.last_contacted_at, t.last_outbound_at, t.waiting_since,
  t.meetings_count, t.nudge_count, t.thread_token,
  t.investor_type, t.check_size, t.partnership_type, t.customer_segment,
  p.first_name, p.last_name,
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

CREATE VIEW v_outreach_due_today WITH (security_invoker = true) AS
SELECT
  ve.*,
  COALESCE(
    (SELECT COUNT(*) FROM outreach_activities oa WHERE oa.thread_id = ve.id), 0
  ) AS activity_count
FROM v_outreach_enriched ve
WHERE ve.next_action_date <= CURRENT_DATE
  AND ve.status NOT IN ('converted', 'passed', 'parked')
ORDER BY ve.priority ASC, ve.next_action_date ASC;

-- 033 One Click LCA contacts
INSERT INTO persons (linkedin_url, first_name, last_name, title, location, org_id, source, created_by)
VALUES
  ('https://www.linkedin.com/in/panupasanen/', 'Panu', 'Pasanen', 'CEO & Founder', 'Helsinki, Finland',
   (SELECT id FROM outreach_orgs WHERE domain = 'oneclicklca.com'), 'manual', 'risto'),
  ('https://www.linkedin.com/in/simonsim/', 'Simon', 'Sim', 'Communicator', 'Helsinki, Finland',
   (SELECT id FROM outreach_orgs WHERE domain = 'oneclicklca.com'), 'manual', 'risto')
ON CONFLICT (linkedin_url) DO NOTHING;

UPDATE outreach_orgs
SET description = 'Worlds largest LCA & EPD platform. EUR 21.8M revenue, 228+ people. Acquired SimaPro Sept 2025. $43.8M funding. 170+ countries.'
WHERE domain = 'oneclicklca.com';

INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority, partnership_type,
  status, source, created_by,
  boardy_notes, our_angle, their_angle,
  next_action, next_action_type, next_action_date
) VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/panupasanen/'),
  (SELECT id FROM outreach_orgs WHERE domain = 'oneclicklca.com'),
  'partner', 'high', 'Technology', 'new', 'manual', 'risto',
  'CEO of One Click LCA. Connection via Simon Sim.',
  'Their LCA output is our compliance input.',
  'Platform extension into operations. Churn reduction. CSRD referral revenue.',
  'Send Version 1 pitch via Simon Sim.',
  'send', CURRENT_DATE
) ON CONFLICT (person_id, org_id, pipeline) DO UPDATE SET
  next_action = EXCLUDED.next_action,
  next_action_date = EXCLUDED.next_action_date,
  updated_at = NOW();

-- 034 social posts queue
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL DEFAULT 'linkedin'
    CHECK (platform IN ('linkedin','twitter')),
  category TEXT NOT NULL
    CHECK (category IN ('thought_leadership','product_update','compliance_news','case_study','webinar_promo','hiring')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','pending_approval','approved','scheduled','published','rejected')),
  content TEXT NOT NULL,
  image_url TEXT,
  scheduled_at TIMESTAMPTZ,
  source TEXT NOT NULL DEFAULT 'manual',
  approval_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status, scheduled_at);
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='social_posts' AND policyname='svc_sp') THEN
    CREATE POLICY svc_sp ON social_posts FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

-- 035 Anna Gueorguieva GreeniumDC
INSERT INTO outreach_orgs (domain, name, description, location, size, industry, source, created_by)
VALUES ('greeniumdc.com', 'GreeniumDC',
  'Sustainability data aggregation for institutional asset managers. 50+ clients.',
  'International', '11-50', 'Climate Tech', 'boardy', 'risto')
ON CONFLICT (domain) DO UPDATE SET description = EXCLUDED.description, updated_at = NOW();

INSERT INTO persons (linkedin_url, first_name, last_name, title, location, org_id, source, created_by)
VALUES (
  'https://www.linkedin.com/in/anna-gueorguieva/',
  'Anna', 'Gueorguieva', 'Chief Sustainability Officer', 'International',
  (SELECT id FROM outreach_orgs WHERE domain = 'greeniumdc.com'),
  'boardy', 'risto'
) ON CONFLICT (linkedin_url) DO UPDATE SET
  title = EXCLUDED.title, org_id = EXCLUDED.org_id, updated_at = NOW();

INSERT INTO person_emails (person_id, email, is_primary, verified, source, created_by)
VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/'),
  'annagindc@gmail.com', TRUE, FALSE, 'boardy', 'risto'
) ON CONFLICT (person_id, email) DO NOTHING;

-- 036 construction leads
CREATE TABLE IF NOT EXISTS construction_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ted_notice_id VARCHAR(100) NOT NULL UNIQUE,
  document_number VARCHAR(50),
  title TEXT NOT NULL,
  description TEXT,
  cpv_code VARCHAR(20),
  cpv_description VARCHAR(500),
  country_code VARCHAR(5),
  country_name VARCHAR(100),
  nuts_code VARCHAR(20),
  place_of_performance TEXT,
  buyer_name VARCHAR(500),
  buyer_url TEXT,
  contract_type VARCHAR(50),
  procedure_type VARCHAR(100),
  notice_type VARCHAR(100),
  estimated_value NUMERIC,
  currency VARCHAR(10) DEFAULT 'EUR',
  publication_date DATE,
  deadline_date TIMESTAMPTZ,
  ted_url TEXT,
  status VARCHAR(50) DEFAULT 'new'
    CHECK (status IN ('new','reviewed','qualified','outreach_started','contacted','passed','won')),
  relevance_score NUMERIC DEFAULT 0,
  notes TEXT,
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,
  raw_data JSONB,
  source VARCHAR(50) DEFAULT 'ted_api' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'construction_lead_fetcher' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cl_ted ON construction_leads(ted_notice_id);
CREATE INDEX IF NOT EXISTS idx_cl_cpv ON construction_leads(cpv_code);
CREATE INDEX IF NOT EXISTS idx_cl_country ON construction_leads(country_code);
CREATE INDEX IF NOT EXISTS idx_cl_status ON construction_leads(status);
CREATE INDEX IF NOT EXISTS idx_cl_pub ON construction_leads(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_cl_deadline ON construction_leads(deadline_date) WHERE deadline_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cl_score ON construction_leads(relevance_score DESC);

DROP TRIGGER IF EXISTS update_construction_leads_updated_at ON construction_leads;
CREATE TRIGGER update_construction_leads_updated_at
  BEFORE UPDATE ON construction_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE VIEW v_construction_leads_new AS
SELECT * FROM construction_leads
WHERE status = 'new'
  AND publication_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY relevance_score DESC, publication_date DESC;

CREATE OR REPLACE VIEW v_construction_leads_deadlines AS
SELECT * FROM construction_leads
WHERE deadline_date >= NOW()
  AND deadline_date <= NOW() + INTERVAL '14 days'
  AND status NOT IN ('passed','won')
ORDER BY deadline_date ASC;

CREATE OR REPLACE VIEW v_construction_leads_summary AS
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
  SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS qualified_count,
  SUM(CASE WHEN deadline_date >= NOW()
    AND deadline_date <= NOW() + INTERVAL '7 days' THEN 1 ELSE 0 END) AS deadlines_this_week
FROM construction_leads
WHERE status NOT IN ('passed','won');

ALTER TABLE construction_leads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='construction_leads' AND policyname='svc_cl') THEN
    CREATE POLICY svc_cl ON construction_leads FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='construction_leads' AND policyname='auth_cl') THEN
    CREATE POLICY auth_cl ON construction_leads FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- 037 resend tracking
ALTER TABLE email_logs ADD COLUMN IF NOT EXISTS resend_email_id text;
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id
  ON email_logs(resend_email_id)
  WHERE resend_email_id IS NOT NULL;
ALTER TABLE email_logs DROP CONSTRAINT IF EXISTS email_logs_status_check;
ALTER TABLE email_logs ADD CONSTRAINT email_logs_status_check
  CHECK (status IN ('pending','sent','failed','delivered','bounced','complained'));

-- clear hil todos
UPDATE hil_todos SET done_at = NOW()
WHERE category = 'pending_migration'
  AND dedup_key IN (
    'pending_migration:030','pending_migration:031','pending_migration:032',
    'pending_migration:033','pending_migration:034','pending_migration:035',
    'pending_migration:036','pending_migration:037'
  );

SELECT 'Migrations 030-037 OK' AS status;
