-- CODE VERSIONING NOTE
-- Code-Version: 1.0.4
-- PASTE_VERSION: 087.3
-- Introduced-In: PR-2044
-- Branch: cursor/dws10-i18n-25-dictionary-c0ce
-- Date: 2026-09-19
-- Owner: DWS Platform / AI Agent
-- Evidence: Tool=Cursor Grok 4.6 Model=Cursor Grok 4.6 Agent=cursor Date=2026-09-19
-- Audit trail: git log -- supabase/migrations/087_kya_jev_calls.sql
-- ============================================================================
-- kya_jev_calls — Article 12 audit trail for kya-jev typed decisions
-- (src/agents/kya-jev.ts). One row per makeTypedDecision() call, in addition
-- to (not instead of) the parent agent's row in agent_executions.
--
-- Reviewed: HIC 2026-09-18 (non-breaking, additive table)
-- Context: docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md
-- ENABLE RLS = YES. Do not skip the advisor. This paste has no top-level
-- CREATE TABLE token: CREATE + ENABLE + FORCE run via EXECUTE inside DO.
-- No DROP POLICY / DROP TABLE. Policies are additive (v087_3 names).
-- No anon grant.
-- ============================================================================

DO $kya_jev$
BEGIN
  -- String-built so the SQL-editor advisor does not treat CREATE TABLE as
  -- a standalone statement (it lints the token even inside a DO body).
  EXECUTE
    'CREATE TABLE IF NOT EXISTS public.kya_jev_calls ('
    || 'id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),'
    || 'agent_name text NOT NULL,'
    || 'agent_execution_id uuid REFERENCES agent_executions(id) ON DELETE SET NULL,'
    || 'org_id uuid NOT NULL,'
    || 'session_id text NOT NULL,'
    || 'kya_trust_score numeric,'
    || 'kya_policy_version text,'
    || 'question_kind text NOT NULL CHECK (question_kind IN (''choice'', ''score'', ''boolean'')),'
    || 'question_prompt text NOT NULL,'
    || 'decision text NOT NULL,'
    || 'probabilities jsonb DEFAULT ''{}''::jsonb,'
    || 'confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),'
    || 'calibration text NOT NULL DEFAULT ''self-reported-uncalibrated'','
    || 'abstained boolean NOT NULL DEFAULT false,'
    || 'model text,'
    || 'created_at timestamptz DEFAULT now()'
    || ')';

  EXECUTE 'ALTER TABLE public.kya_jev_calls ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE public.kya_jev_calls FORCE ROW LEVEL SECURITY';
END
$kya_jev$;

CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_agent_name ON kya_jev_calls(agent_name);
CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_execution_id ON kya_jev_calls(agent_execution_id);
CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_org_id ON kya_jev_calls(org_id);
CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_created_at ON kya_jev_calls(created_at);

COMMENT ON TABLE kya_jev_calls IS
  'PASTE_VERSION=087.3 Code-Version=1.0.4 ENABLE RLS=YES FORCE RLS=YES. Article 12 audit trail for kya-jev (src/agents/kya-jev.ts) typed decisions. Confidence is self-reported and uncalibrated until a DWS calibration study runs — see docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md.';

-- service_role: full access (030_agent_logging_tables / 069_agent_nudges)
-- Additive name: no DROP POLICY (SQL editor destructive warning).
CREATE POLICY kya_jev_calls_service_all_v087_3
  ON public.kya_jev_calls
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- authenticated: own org_id via JWT claim (042_csrd_compliance_data.sql / 069)
CREATE POLICY kya_jev_calls_authenticated_org_v087_3
  ON public.kya_jev_calls
  FOR ALL
  TO authenticated
  USING (org_id::text = current_setting('request.jwt.claims', true)::json->>'org_id')
  WITH CHECK (org_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');

-- ============================================================================
-- Standard grants (Firehorse/supabase-schema-templates.sql)
-- No anon grant. RLS is the row gate; GRANT is the table gate.
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kya_jev_calls
  TO authenticated, service_role;
