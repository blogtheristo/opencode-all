-- Migration 093: Hilma tenders (Finnish public procurement) for Sales Mission Control
-- Evidence: Tool=Claude Code Model=claude-opus-5 Agent=sales-outreach Date=2026-09-22
-- Audit trail: git log -- supabase/migrations/093_250926_hilma_tenders.sql
--
-- Sibling of 036_construction_leads (TED / EU-wide). This table holds notices from
-- hankintailmoitukset.fi (Hilma), captured by skills/hilma-watch and synced from a host
-- that can reach the domain. Mission Control reads it as the `sales` centre Hilma lane.
-- Idempotent (IF NOT EXISTS) so it is safe to re-apply.

CREATE TABLE IF NOT EXISTS public.hilma_tenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Canonical Hilma notice URL (…/public/procedure/<id>/…). Natural dedup key —
  -- hilma-watch dedupes by URL, so the uniqueness contract matches the scanner.
  notice_url TEXT NOT NULL UNIQUE,
  procedure_id VARCHAR(100),

  title TEXT NOT NULL,
  -- Surrounding card text from the search result; the only description Hilma's
  -- list view exposes without opening each notice.
  context TEXT,

  buyer_name VARCHAR(500),
  cpv_codes TEXT[] DEFAULT '{}',
  region VARCHAR(100),

  published_date DATE,
  deadline_date TIMESTAMPTZ,

  -- Deterministic score from hilma-watch: min(100, keywordHits*10 + cpvHits*15). No model.
  relevance_score NUMERIC DEFAULT 0 NOT NULL,
  keyword_hits TEXT[] DEFAULT '{}',
  cpv_hits TEXT[] DEFAULT '{}',
  matched_terms TEXT[] DEFAULT '{}',

  status VARCHAR(50) DEFAULT 'new' NOT NULL
    CHECK (status IN ('new', 'reviewed', 'qualified', 'bid_drafting', 'bid_submitted', 'passed', 'won', 'lost')),
  notes TEXT,

  org_id UUID REFERENCES public.outreach_orgs(id) ON DELETE SET NULL,

  raw_data JSONB,

  source VARCHAR(50) DEFAULT 'hilma_watch' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'hilma_watch_sync' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hilma_tenders_status ON public.hilma_tenders(status);
CREATE INDEX IF NOT EXISTS idx_hilma_tenders_relevance ON public.hilma_tenders(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_hilma_tenders_published ON public.hilma_tenders(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_hilma_tenders_deadline ON public.hilma_tenders(deadline_date) WHERE deadline_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hilma_tenders_org ON public.hilma_tenders(org_id) WHERE org_id IS NOT NULL;

DROP TRIGGER IF EXISTS update_hilma_tenders_updated_at ON public.hilma_tenders;
CREATE TRIGGER update_hilma_tenders_updated_at
  BEFORE UPDATE ON public.hilma_tenders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Open tenders whose deadline has not passed, ranked by fit. Mission Control's lane source.
CREATE OR REPLACE VIEW public.v_hilma_tenders_open
  WITH (security_invoker = true) AS
SELECT *
FROM public.hilma_tenders
WHERE status NOT IN ('passed', 'won', 'lost')
  AND (deadline_date IS NULL OR deadline_date >= NOW())
ORDER BY relevance_score DESC, published_date DESC NULLS LAST;

-- ============================================================================
-- GRANTS + RLS (CLAUDE.md "Supabase table grants" — GRANT is the table gate,
-- RLS is the row gate; without both, PostgREST returns 42501).
-- `anon` is intentionally omitted: no policy targets it, tenders are HIC-only.
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hilma_tenders TO authenticated, service_role;
-- Supabase default privileges grant anon on new objects; revoke explicitly.
REVOKE ALL ON public.hilma_tenders FROM anon;
REVOKE ALL ON public.v_hilma_tenders_open FROM anon;
GRANT SELECT ON public.v_hilma_tenders_open TO authenticated, service_role;

ALTER TABLE public.hilma_tenders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON public.hilma_tenders;
CREATE POLICY "Service role full access" ON public.hilma_tenders
  FOR ALL USING (auth.role() = 'service_role');

-- HIC-only: backoffice owners/admins (organization_members), not every signed-in user.
DROP POLICY IF EXISTS "Authenticated read" ON public.hilma_tenders;
DROP POLICY IF EXISTS "Backoffice admin read" ON public.hilma_tenders;
CREATE POLICY "Backoffice admin read" ON public.hilma_tenders
  FOR SELECT USING (is_backoffice_admin());

-- Mission Control triage (status / notes) happens in the signed-in browser.
DROP POLICY IF EXISTS "Authenticated triage" ON public.hilma_tenders;
DROP POLICY IF EXISTS "Backoffice admin triage" ON public.hilma_tenders;
CREATE POLICY "Backoffice admin triage" ON public.hilma_tenders
  FOR UPDATE USING (is_backoffice_admin()) WITH CHECK (is_backoffice_admin());

COMMENT ON TABLE public.hilma_tenders IS 'Finnish public procurement notices (hankintailmoitukset.fi / Hilma) captured by skills/hilma-watch. Deterministic relevance_score; no model in the scoring loop. Read by dashboard/mission-control as the Hilma sales lane.';
