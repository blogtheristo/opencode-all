-- Migration: Create cost_audit table for persistent cost governance tracking
-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=OpenAI/gpt-5.6-sol Agent=Copilot Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/20260919_cost_audit_table.sql

-- Table: cost_audit (persistent cost governance audit log)
-- Purpose: Track all cursor, grok, and claude-code agent workload decisions
-- Schema aligns with .claude/hooks/audit/cost-policy.log format

CREATE TABLE IF NOT EXISTS public.cost_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

  -- Audit metadata (from cost-policy.log pipe-delimited format)
  session_datetime TIMESTAMPTZ NOT NULL,    -- ISO 8601 timestamp of session decision
  session_id TEXT NOT NULL,                 -- Cursor/Grok/Claude Code session ID
  agent_type TEXT NOT NULL,                 -- cursor-ai, grok-ai, claude-code
  sandbox TEXT NOT NULL,                    -- dgx-local, cloud, blocked
  workload_category TEXT NOT NULL,          -- engineering, research, spiking, pipeline, deployment, translation, batch
  decision TEXT NOT NULL,                   -- approved, blocked, deferred
  rationale TEXT,                           -- Decision rationale (max 500 chars)

  -- Cost tracking
  estimated_tokens BIGINT,                  -- Estimated token consumption (optional, for future ML)
  actual_cost_usd DECIMAL(10,2),            -- Actual cost in USD (from Cursor/Grok billing)

  -- Administrative
  created_by TEXT,                          -- Email of HIC or admin who logged entry
  notes TEXT,                               -- Additional context (max 1000 chars)

  CONSTRAINT cost_audit_valid_agent CHECK (agent_type IN ('cursor-ai', 'grok-ai', 'claude-code')),
  CONSTRAINT cost_audit_valid_sandbox CHECK (sandbox IN ('dgx-local', 'cloud', 'blocked')),
  CONSTRAINT cost_audit_valid_workload CHECK (workload_category IN ('engineering', 'research', 'spiking', 'pipeline', 'deployment', 'translation', 'batch')),
  CONSTRAINT cost_audit_valid_decision CHECK (decision IN ('approved', 'blocked', 'deferred'))
);

-- Enable RLS
ALTER TABLE public.cost_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins (three allowed emails) can read all
CREATE POLICY cost_audit_admin_read ON public.cost_audit
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' IN ('admin@dws6.com', 'risto.paarni2024@lifetime.fi', 'admin@dws10.com'));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cost_audit
  TO authenticated, service_role;

-- Indexes for efficient querying
CREATE INDEX idx_cost_audit_session_datetime ON public.cost_audit(session_datetime DESC);
CREATE INDEX idx_cost_audit_agent_type ON public.cost_audit(agent_type);
CREATE INDEX idx_cost_audit_sandbox ON public.cost_audit(sandbox);
CREATE INDEX idx_cost_audit_workload ON public.cost_audit(workload_category);
CREATE INDEX idx_cost_audit_decision ON public.cost_audit(decision);
CREATE INDEX idx_cost_audit_created_at ON public.cost_audit(created_at DESC);

-- View: 7-day rolling cost summary
CREATE OR REPLACE VIEW public.cost_audit_7day AS
SELECT
  DATE(session_datetime) as audit_date,
  agent_type,
  sandbox,
  workload_category,
  decision,
  COUNT(*) as entry_count,
  COALESCE(SUM(actual_cost_usd), 0) as total_cost_usd,
  COALESCE(SUM(estimated_tokens), 0) as total_tokens
FROM public.cost_audit
WHERE session_datetime >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(session_datetime), agent_type, sandbox, workload_category, decision
ORDER BY audit_date DESC, agent_type, sandbox;

-- View: All-time decision summary
CREATE OR REPLACE VIEW public.cost_audit_summary AS
SELECT
  agent_type,
  sandbox,
  workload_category,
  decision,
  COUNT(*) as entry_count,
  COALESCE(SUM(actual_cost_usd), 0) as total_cost_usd,
  COALESCE(SUM(estimated_tokens), 0) as total_tokens,
  MAX(created_at) as last_entry_at
FROM public.cost_audit
GROUP BY agent_type, sandbox, workload_category, decision
ORDER BY agent_type, sandbox, workload_category, decision;

-- Table comment
COMMENT ON TABLE public.cost_audit IS 'Persistent audit log for DGX-first cost governance. Tracks all cursor, grok, and claude-code agent decisions. Free-credit window: 2026-09-20 to 2026-10-11. Cloud agents blocked post-2026-10-12. See docs/DWS_COST_POLICY_STANDARD.md';
