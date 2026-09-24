-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-2091
-- Branch: claude/loving-einstein-fkjj4b
-- Date: 2026-09-24
-- Owner: DWS Platform / AI Agent
-- Evidence: Tool=Claude Code Agent=claude Date=2026-09-24
-- Audit trail: git log -- supabase/migrations/090_240926_website_observations_ownership.sql
-- ============================================================================
-- Ownership stage of the Active Ontology (LD-2026-09-007, HIC APPLY 24.09.2026).
-- Observation → Meaning → Ownership → Decision → Action → Outcome. Ownership is an
-- ontological stage: {known: yes|partly|no, map: {impact, owner, decision, action,
-- accountability, data} → role id, verdict: discovery|transfer|outsourced_accountability|aligned}.
-- Four distinct things: problem ownership, decision rights, action responsibility, consequence
-- accountability. Action may be 'external' (outsourced); accountability never is. Roles only
-- (ceo, coo, cfo, sustainability, digital, quality, bu, board, external, unknown); never names. Adds the 'ownership' event.
-- Reviewed: HIC (APPLY LD-2026-09-007, 24.09.2026). Additive, non-breaking. Applying is RED.
-- ============================================================================

ALTER TABLE public.website_observations
  ADD COLUMN IF NOT EXISTS ownership_map JSONB;

ALTER TABLE public.website_observations
  DROP CONSTRAINT IF EXISTS website_observations_event_check;
ALTER TABLE public.website_observations
  ADD CONSTRAINT website_observations_event_check
  CHECK (event IN ('query','recognise','industry','answer','ownership','path_shown','success','selected','result'));

CREATE INDEX IF NOT EXISTS idx_website_observations_ownership_known
  ON public.website_observations ((ownership_map->>'known'))
  WHERE ownership_map IS NOT NULL;

COMMENT ON COLUMN public.website_observations.ownership_map IS
  'Ownership stage (LD-2026-09-007): known = yes|partly|no; map = dimension → role id; verdict = discovery|transfer|outsourced_accountability|aligned. Roles only, no PII. known=no → first work stage is Ownership Discovery; otherwise Decision Mapping.';
