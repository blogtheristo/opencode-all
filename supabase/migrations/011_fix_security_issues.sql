-- ============================================================
-- Migration 011: Fix Critical Security Issues
-- ============================================================
-- Purpose: Enable RLS on all public tables and convert SECURITY DEFINER views
-- Date: 2026-01-08
-- Issues Fixed:
--   1. Enable RLS on 15 tables (firehorse, customers, financial)
--   2. Convert 13 SECURITY DEFINER views to SECURITY INVOKER
-- ============================================================

-- ============================================================
-- PART 1: ENABLE RLS ON ALL PUBLIC TABLES
-- ============================================================

-- Migration 002: Firehorse tables
ALTER TABLE IF EXISTS firehorse_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS firehorse_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS firehorse_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS firehorse_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS firehorse_templates ENABLE ROW LEVEL SECURITY;

-- Migration 005: Firehorse LinkedIn workflow tables
ALTER TABLE IF EXISTS firehorse_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS firehorse_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS firehorse_linkedin_activities ENABLE ROW LEVEL SECURITY;

-- Migration 006: Customer/Financial tables
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS revenue_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS runway_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 2: CREATE RLS POLICIES FOR FIREHORSE TABLES
-- ============================================================

-- Helper function to check if user is a backoffice admin
CREATE OR REPLACE FUNCTION is_backoffice_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE user_id = auth.uid()
    AND role IN ('owner', 'admin')
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION is_backoffice_admin() IS 'Check if current user is a backoffice admin (owner/admin role)';

-- firehorse_leads policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_leads" ON firehorse_leads;
CREATE POLICY "Backoffice admins can manage firehorse_leads"
  ON firehorse_leads FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_leads" ON firehorse_leads;
CREATE POLICY "Service role has full access to firehorse_leads"
  ON firehorse_leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_events policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_events" ON firehorse_events;
CREATE POLICY "Backoffice admins can manage firehorse_events"
  ON firehorse_events FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_events" ON firehorse_events;
CREATE POLICY "Service role has full access to firehorse_events"
  ON firehorse_events FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_tasks policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_tasks" ON firehorse_tasks;
CREATE POLICY "Backoffice admins can manage firehorse_tasks"
  ON firehorse_tasks FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_tasks" ON firehorse_tasks;
CREATE POLICY "Service role has full access to firehorse_tasks"
  ON firehorse_tasks FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_replies policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_replies" ON firehorse_replies;
CREATE POLICY "Backoffice admins can manage firehorse_replies"
  ON firehorse_replies FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_replies" ON firehorse_replies;
CREATE POLICY "Service role has full access to firehorse_replies"
  ON firehorse_replies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_templates policies (table renamed from firehorse_email_templates in 003;
-- this block predated the rename and targeted the stale name — caught by the CI soak)
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_templates" ON firehorse_templates;
CREATE POLICY "Backoffice admins can manage firehorse_templates"
  ON firehorse_templates FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_templates" ON firehorse_templates;
CREATE POLICY "Service role has full access to firehorse_templates"
  ON firehorse_templates FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_meetings policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_meetings" ON firehorse_meetings;
CREATE POLICY "Backoffice admins can manage firehorse_meetings"
  ON firehorse_meetings FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_meetings" ON firehorse_meetings;
CREATE POLICY "Service role has full access to firehorse_meetings"
  ON firehorse_meetings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_proposals policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_proposals" ON firehorse_proposals;
CREATE POLICY "Backoffice admins can manage firehorse_proposals"
  ON firehorse_proposals FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_proposals" ON firehorse_proposals;
CREATE POLICY "Service role has full access to firehorse_proposals"
  ON firehorse_proposals FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- firehorse_linkedin_activities policies
DROP POLICY IF EXISTS "Backoffice admins can manage firehorse_linkedin_activities" ON firehorse_linkedin_activities;
CREATE POLICY "Backoffice admins can manage firehorse_linkedin_activities"
  ON firehorse_linkedin_activities FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to firehorse_linkedin_activities" ON firehorse_linkedin_activities;
CREATE POLICY "Service role has full access to firehorse_linkedin_activities"
  ON firehorse_linkedin_activities FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- PART 3: CREATE RLS POLICIES FOR CUSTOMER/FINANCIAL TABLES
-- ============================================================

-- customers policies
DROP POLICY IF EXISTS "Backoffice admins can manage customers" ON customers;
CREATE POLICY "Backoffice admins can manage customers"
  ON customers FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to customers" ON customers;
CREATE POLICY "Service role has full access to customers"
  ON customers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- contracts policies
DROP POLICY IF EXISTS "Backoffice admins can manage contracts" ON contracts;
CREATE POLICY "Backoffice admins can manage contracts"
  ON contracts FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to contracts" ON contracts;
CREATE POLICY "Service role has full access to contracts"
  ON contracts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- subscriptions policies
DROP POLICY IF EXISTS "Backoffice admins can manage subscriptions" ON subscriptions;
CREATE POLICY "Backoffice admins can manage subscriptions"
  ON subscriptions FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to subscriptions" ON subscriptions;
CREATE POLICY "Service role has full access to subscriptions"
  ON subscriptions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- revenue_recognition policies
DROP POLICY IF EXISTS "Backoffice admins can manage revenue_recognition" ON revenue_recognition;
CREATE POLICY "Backoffice admins can manage revenue_recognition"
  ON revenue_recognition FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to revenue_recognition" ON revenue_recognition;
CREATE POLICY "Service role has full access to revenue_recognition"
  ON revenue_recognition FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- runway_tracking policies
DROP POLICY IF EXISTS "Backoffice admins can manage runway_tracking" ON runway_tracking;
CREATE POLICY "Backoffice admins can manage runway_tracking"
  ON runway_tracking FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to runway_tracking" ON runway_tracking;
CREATE POLICY "Service role has full access to runway_tracking"
  ON runway_tracking FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- transactions policies
DROP POLICY IF EXISTS "Backoffice admins can manage transactions" ON transactions;
CREATE POLICY "Backoffice admins can manage transactions"
  ON transactions FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to transactions" ON transactions;
CREATE POLICY "Service role has full access to transactions"
  ON transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- PART 4: RECREATE VIEWS WITH SECURITY INVOKER
-- ============================================================
-- Note: PostgreSQL 15+ supports security_invoker option
-- For older versions, we use explicit RLS on underlying tables

-- Migration 002: Firehorse views
DROP VIEW IF EXISTS firehorse_daily_new_leads;
CREATE VIEW firehorse_daily_new_leads
  WITH (security_invoker = true)
AS
SELECT
  id,
  email,
  first_name,
  last_name,
  company,
  country,
  segment
FROM firehorse_leads
WHERE state = 'New'
  AND country IN ('FI', 'SE', 'NO', 'DK')
  AND segment = 'Infra/Construction'
ORDER BY created_at ASC
LIMIT 30;

COMMENT ON VIEW firehorse_daily_new_leads IS 'Daily new leads to process (max 30) - SECURITY INVOKER';

DROP VIEW IF EXISTS firehorse_cold2_candidates;
CREATE VIEW firehorse_cold2_candidates
  WITH (security_invoker = true)
AS
SELECT
  id,
  email,
  first_name,
  last_name,
  company,
  country,
  state,
  cold_1_sent_at
FROM firehorse_leads
WHERE state = 'Cold_1_Sent'
  AND cold_1_sent_at IS NOT NULL
  AND cold_1_sent_at < NOW() - INTERVAL '3 days'
  AND last_engagement_at IS NULL;

COMMENT ON VIEW firehorse_cold2_candidates IS 'Leads needing Cold 2 follow-up - SECURITY INVOKER';

DROP VIEW IF EXISTS firehorse_cold3_candidates;
CREATE VIEW firehorse_cold3_candidates
  WITH (security_invoker = true)
AS
SELECT
  id,
  email,
  first_name,
  last_name,
  company,
  country,
  state,
  cold_2_sent_at
FROM firehorse_leads
WHERE state = 'Cold_2_Sent'
  AND cold_2_sent_at IS NOT NULL
  AND cold_2_sent_at < NOW() - INTERVAL '5 days'
  AND last_engagement_at IS NULL;

COMMENT ON VIEW firehorse_cold3_candidates IS 'Leads needing Cold 3 follow-up - SECURITY INVOKER';

-- Migration 005: LinkedIn workflow views
DROP VIEW IF EXISTS firehorse_linkedin_pending;
CREATE VIEW firehorse_linkedin_pending
  WITH (security_invoker = true)
AS
SELECT
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title,
  l.country,
  l.linkedin_url,
  l.state
FROM firehorse_leads l
WHERE l.linkedin_connection_status = 'not_sent'
  AND l.linkedin_url IS NOT NULL
  AND l.state = 'New'
ORDER BY l.revenue_eur_million DESC NULLS LAST, l.created_at ASC
LIMIT 50;

COMMENT ON VIEW firehorse_linkedin_pending IS 'Leads pending LinkedIn connection - SECURITY INVOKER';

DROP VIEW IF EXISTS firehorse_upcoming_meetings;
CREATE VIEW firehorse_upcoming_meetings
  WITH (security_invoker = true)
AS
SELECT
  m.id AS meeting_id,
  m.title AS meeting_title,
  m.scheduled_at,
  m.duration_minutes,
  m.meeting_type,
  m.status,
  l.id AS lead_id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title AS lead_title
FROM firehorse_meetings m
JOIN firehorse_leads l ON m.lead_id = l.id
WHERE m.status = 'scheduled'
  AND m.scheduled_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY m.scheduled_at ASC;

COMMENT ON VIEW firehorse_upcoming_meetings IS 'Upcoming meetings (next 7 days) - SECURITY INVOKER';

DROP VIEW IF EXISTS firehorse_active_proposals;
CREATE VIEW firehorse_active_proposals
  WITH (security_invoker = true)
AS
SELECT
  p.id AS proposal_id,
  p.title AS proposal_title,
  p.status,
  p.amount_eur,
  p.pilot_duration_months,
  p.sent_at,
  p.valid_until,
  l.id AS lead_id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title AS lead_title,
  l.country
FROM firehorse_proposals p
JOIN firehorse_leads l ON p.lead_id = l.id
WHERE p.status IN ('sent', 'under_review', 'negotiation')
ORDER BY p.sent_at DESC;

COMMENT ON VIEW firehorse_active_proposals IS 'Active proposals - SECURITY INVOKER';

DROP VIEW IF EXISTS firehorse_sales_pipeline;
CREATE VIEW firehorse_sales_pipeline
  WITH (security_invoker = true)
AS
SELECT
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.country,
  l.state AS lead_state,
  l.linkedin_connection_status,
  COUNT(DISTINCT m.id) AS meetings_count,
  COUNT(DISTINCT p.id) AS proposals_count,
  MAX(m.scheduled_at) AS last_meeting_at,
  MAX(p.sent_at) AS last_proposal_sent_at,
  l.revenue_eur_million,
  l.created_at
FROM firehorse_leads l
LEFT JOIN firehorse_meetings m ON l.id = m.lead_id
LEFT JOIN firehorse_proposals p ON l.id = p.lead_id
WHERE l.state IN ('Engaged', 'Meeting_Booked')
GROUP BY l.id
ORDER BY l.revenue_eur_million DESC NULLS LAST;

COMMENT ON VIEW firehorse_sales_pipeline IS 'Sales pipeline overview - SECURITY INVOKER';

-- Migration 006: Customer/Financial views
DROP VIEW IF EXISTS current_mrr_by_customer;
CREATE VIEW current_mrr_by_customer
  WITH (security_invoker = true)
AS
SELECT
  c.id,
  c.name,
  c.status,
  c.current_mrr,
  c.current_arr,
  c.contract_start_date,
  COUNT(s.id) as active_subscriptions,
  SUM(s.monthly_amount) as subscription_mrr
FROM customers c
LEFT JOIN subscriptions s ON c.id = s.customer_id AND s.is_active = TRUE
WHERE c.status IN ('active', 'trial', 'expansion')
GROUP BY c.id, c.name, c.status, c.current_mrr, c.current_arr, c.contract_start_date
ORDER BY c.current_mrr DESC;

COMMENT ON VIEW current_mrr_by_customer IS 'Current MRR by customer - SECURITY INVOKER';

DROP VIEW IF EXISTS monthly_metrics_summary;
CREATE VIEW monthly_metrics_summary
  WITH (security_invoker = true)
AS
SELECT
  rr.month,
  rr.mrr,
  rr.arr,
  rr.new_mrr,
  rr.expansion_mrr,
  rr.churned_mrr,
  rr.active_customers,
  rr.churn_rate,
  rt.cash_balance,
  rt.net_burn,
  rt.runway_months
FROM revenue_recognition rr
LEFT JOIN runway_tracking rt ON rr.month = rt.month
ORDER BY rr.month DESC
LIMIT 12;

COMMENT ON VIEW monthly_metrics_summary IS 'Monthly metrics summary (last 12 months) - SECURITY INVOKER';

DROP VIEW IF EXISTS contracts_pending_signature;
CREATE VIEW contracts_pending_signature
  WITH (security_invoker = true)
AS
SELECT
  ct.id,
  ct.contract_number,
  ct.title,
  ct.total_value,
  ct.status,
  ct.sent_date,
  c.name as customer_name,
  c.primary_contact_email,
  CURRENT_DATE - ct.sent_date as days_pending
FROM contracts ct
JOIN customers c ON ct.customer_id = c.id
WHERE ct.status IN ('sent')
ORDER BY ct.sent_date ASC;

COMMENT ON VIEW contracts_pending_signature IS 'Contracts pending signature - SECURITY INVOKER';

DROP VIEW IF EXISTS subscriptions_expiring_soon;
CREATE VIEW subscriptions_expiring_soon
  WITH (security_invoker = true)
AS
SELECT
  s.id,
  s.product_name,
  s.monthly_amount,
  s.end_date,
  c.name as customer_name,
  c.primary_contact_email,
  s.end_date - CURRENT_DATE as days_until_expiry
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
WHERE s.is_active = TRUE
  AND s.end_date IS NOT NULL
  AND s.end_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY s.end_date ASC;

COMMENT ON VIEW subscriptions_expiring_soon IS 'Subscriptions expiring soon (90 days) - SECURITY INVOKER';

-- Migration 008: Payment views
DROP VIEW IF EXISTS recent_payment_events;
CREATE VIEW recent_payment_events
  WITH (security_invoker = true)
AS
SELECT 
    pe.id,
    pe.provider,
    pe.event_type,
    pe.amount,
    pe.currency,
    pe.created_at,
    s.product_name,
    c.name as customer_name,
    c.primary_contact_email as customer_email
FROM payment_events pe
LEFT JOIN subscriptions s ON pe.subscription_id = s.id
LEFT JOIN customers c ON s.customer_id = c.id
ORDER BY pe.created_at DESC
LIMIT 100;

COMMENT ON VIEW recent_payment_events IS 'Recent payment events - SECURITY INVOKER';

DROP VIEW IF EXISTS subscription_details;
CREATE VIEW subscription_details
  WITH (security_invoker = true)
AS
SELECT 
    s.id,
    s.customer_id,
    s.product_name,
    s.billing_cycle,
    s.monthly_amount,
    s.currency,
    s.start_date,
    s.end_date,
    s.next_billing_date,
    s.is_active,
    s.payment_provider,
    s.provider_subscription_id,
    s.cancelled_at,
    s.cancellation_reason,
    s.created_at,
    s.updated_at,
    c.name as customer_name,
    c.primary_contact_email as customer_email,
    c.status as customer_status
FROM subscriptions s
JOIN customers c ON s.customer_id = c.id
ORDER BY s.created_at DESC;

COMMENT ON VIEW subscription_details IS 'Subscription details with customer info - SECURITY INVOKER';

DROP VIEW IF EXISTS monthly_payment_summary;
CREATE VIEW monthly_payment_summary
  WITH (security_invoker = true)
AS
SELECT 
    DATE_TRUNC('month', pe.created_at) as month,
    pe.provider,
    COUNT(*) FILTER (WHERE pe.event_type LIKE '%completed%' OR pe.event_type LIKE '%ACTIVATED%') as successful_payments,
    COUNT(*) FILTER (WHERE pe.event_type LIKE '%failed%' OR pe.event_type LIKE '%FAILED%') as failed_payments,
    SUM(pe.amount) FILTER (WHERE pe.event_type LIKE '%completed%' OR pe.event_type LIKE '%ACTIVATED%') as total_revenue,
    pe.currency
FROM payment_events pe
WHERE pe.amount IS NOT NULL
GROUP BY DATE_TRUNC('month', pe.created_at), pe.provider, pe.currency
ORDER BY month DESC, provider;

COMMENT ON VIEW monthly_payment_summary IS 'Monthly payment summary - SECURITY INVOKER';

-- ============================================================
-- PART 5: VERIFICATION QUERIES (Run these to verify)
-- ============================================================

-- Check RLS is enabled on all tables
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN (
--   'firehorse_leads', 'firehorse_events', 'firehorse_tasks', 
--   'firehorse_replies', 'firehorse_email_templates',
--   'firehorse_meetings', 'firehorse_proposals', 'firehorse_linkedin_activities',
--   'customers', 'contracts', 'subscriptions', 
--   'revenue_recognition', 'runway_tracking', 'transactions'
-- );

-- Check views are using security_invoker
-- SELECT viewname, definition 
-- FROM pg_views 
-- WHERE schemaname = 'public' 
-- AND viewname LIKE 'firehorse%' OR viewname LIKE '%mrr%' OR viewname LIKE '%payment%';

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
-- Summary:
-- - Enabled RLS on 14 tables
-- - Created 28 RLS policies (2 per table: admin + service_role)
-- - Recreated 13 views with security_invoker = true
-- - Created helper function is_backoffice_admin()
-- ============================================================
