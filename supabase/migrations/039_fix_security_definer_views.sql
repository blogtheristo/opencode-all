-- Migration 039: Fix SECURITY DEFINER views on construction_leads
-- Recreate views with security_invoker = on so RLS policies
-- of the querying user are enforced, not the view owner's.
-- Fixes Supabase lint: "View defined with SECURITY DEFINER property"

DROP VIEW IF EXISTS v_construction_leads_summary;
DROP VIEW IF EXISTS v_construction_leads_new;
DROP VIEW IF EXISTS v_construction_leads_deadlines;

CREATE VIEW v_construction_leads_new
WITH (security_invoker = on) AS
SELECT *
FROM construction_leads
WHERE status = 'new'
  AND publication_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY relevance_score DESC, publication_date DESC;

CREATE VIEW v_construction_leads_deadlines
WITH (security_invoker = on) AS
SELECT *
FROM construction_leads
WHERE deadline_date >= NOW()
  AND deadline_date <= NOW() + INTERVAL '14 days'
  AND status NOT IN ('passed', 'won')
ORDER BY deadline_date ASC;

CREATE VIEW v_construction_leads_summary
WITH (security_invoker = on) AS
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
  SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed_count,
  SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS qualified_count,
  SUM(CASE WHEN status = 'outreach_started' THEN 1 ELSE 0 END) AS outreach_count,
  SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS contacted_count,
  SUM(CASE WHEN deadline_date >= NOW() AND deadline_date <= NOW() + INTERVAL '7 days' THEN 1 ELSE 0 END) AS deadlines_this_week
FROM construction_leads
WHERE status NOT IN ('passed', 'won');
