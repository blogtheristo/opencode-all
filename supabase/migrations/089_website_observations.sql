-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-2091
-- Branch: claude/loving-einstein-fkjj4b
-- Date: 2026-09-24
-- Owner: DWS Platform / AI Agent
-- Evidence: Tool=Claude Code Agent=claude Date=2026-09-24
-- Audit trail: git log -- supabase/migrations/089_website_observations.sql
-- ============================================================================
-- website_observations — Chapter 14 CAPTURE from the website (Observation Intake).
-- One row per event of the Active Ontology UX v2 path on dws10.com: the decision
-- question, "recognise yourself", industry, yes/no answers, path shown, success
-- statement, selected vs recommended SKU, result. Anonymised before insert
-- (emails/phones masked by the Pages Function); no names, no IPs, no user ids.
-- Design: docs/specs/active-ontology-ux-v2.md §0b; market signal MS-2026-09-005/006.
--
-- Reviewed: HIC (APPLY LD-2026-09-005, 24.09.2026). Additive, non-breaking. Authoring
-- this file is GREEN; APPLYING it is RED (human runs it).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.website_observations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  observation_id  TEXT NOT NULL,                 -- client-side visit id, joins the events of one path
  event           TEXT NOT NULL CHECK (event IN ('query','recognise','industry','answer','path_shown','success','selected','result')),
  page            TEXT,
  lang            TEXT,
  query_text      TEXT,                          -- anonymised free text ("which decision is hard right now?")
  industry        TEXT,
  topics          TEXT[] NOT NULL DEFAULT '{}',
  recognise_id    TEXT,
  path_key        TEXT,
  question_id     TEXT,
  answer          TEXT,
  answers         JSONB NOT NULL DEFAULT '{}'::jsonb,
  success_text    TEXT,                          -- anonymised "a year from now, what would have changed?"
  ontology_guess  JSONB,
  recommended_sku TEXT,
  selected_sku    TEXT,
  result          TEXT,
  source          TEXT NOT NULL DEFAULT 'website',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_observations_created ON public.website_observations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_observations_obs ON public.website_observations (observation_id);
CREATE INDEX IF NOT EXISTS idx_website_observations_industry ON public.website_observations (industry, event);

ALTER TABLE public.website_observations ENABLE ROW LEVEL SECURITY;

-- Standard grants (Firehorse/supabase-schema-templates.sql): service_role + authenticated. No anon:
-- the Pages Function writes with the service key; the Admin pipeline view reads as authenticated admin.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.website_observations TO service_role;
GRANT SELECT ON public.website_observations TO authenticated;

CREATE POLICY website_observations_service_all_v089
  ON public.website_observations FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY website_observations_admin_read_v089
  ON public.website_observations FOR SELECT TO authenticated
  USING (public.is_backoffice_admin());

COMMENT ON TABLE public.website_observations IS
  'Observation Intake (Active Ontology UX v2). Anonymised website observations: what visitors are trying to decide. Chapter 14 CAPTURE source. No PII.';
