-- ============================================================================
-- kya_jev_calls — Article 12 audit trail for kya-jev typed decisions
-- (src/agents/kya-jev.ts). One row per makeTypedDecision() call, in addition
-- to (not instead of) the parent agent's row in agent_executions.
--
-- Reviewed: HIC 2026-09-18 (non-breaking, additive table)
-- Context: docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md
-- ============================================================================

CREATE TABLE IF NOT EXISTS kya_jev_calls (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL,
  agent_execution_id uuid REFERENCES agent_executions(id) ON DELETE SET NULL,
  org_id uuid NOT NULL,
  session_id text NOT NULL,
  -- KYA verdict this call was gated on (never LLM- or user-supplied — see
  -- requireKyaVerdict() in kya-jev.ts, which refuses to run without one).
  kya_trust_score numeric,
  kya_policy_version text,
  question_kind text NOT NULL CHECK (question_kind IN ('choice', 'score', 'boolean')),
  question_prompt text NOT NULL,
  decision text NOT NULL,
  probabilities jsonb DEFAULT '{}'::jsonb,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  -- Always 'self-reported-uncalibrated' until a calibration study (per the
  -- field note) produces a measured expected-calibration-error and this
  -- column can carry a real value. Never silently defaulted to "calibrated".
  calibration text NOT NULL DEFAULT 'self-reported-uncalibrated',
  abstained boolean NOT NULL DEFAULT false,
  model text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_agent_name ON kya_jev_calls(agent_name);
CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_execution_id ON kya_jev_calls(agent_execution_id);
CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_org_id ON kya_jev_calls(org_id);
CREATE INDEX IF NOT EXISTS idx_kya_jev_calls_created_at ON kya_jev_calls(created_at);

COMMENT ON TABLE kya_jev_calls IS
  'Article 12 audit trail for kya-jev (src/agents/kya-jev.ts) typed decisions. Confidence is self-reported and uncalibrated until a DWS calibration study runs — see docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md.';

-- ============================================================================
-- Standard grants (Firehorse/supabase-schema-templates.sql)
-- ============================================================================
grant select, insert, update, delete on public.kya_jev_calls
  to authenticated, service_role;
alter table public.kya_jev_calls enable row level security;
