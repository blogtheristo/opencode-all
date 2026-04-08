-- Migration 054: Tool Telemetry (ASTA Phase 1)
-- Tracks agent tool invocations for adaptation priority framework.
-- Source: Stanford/Harvard "Adaptation of Agentic AI" (2026)

BEGIN;

CREATE TABLE IF NOT EXISTS tool_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  org_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'error', 'timeout', 'partial', 'skip')),
  duration_ms INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  is_retry BOOLEAN DEFAULT false,
  retry_count INTEGER DEFAULT 0,
  chain_position INTEGER DEFAULT 0,
  chain_length INTEGER DEFAULT 1,
  iteration_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Query patterns: per-agent metrics, per-tool failure rates, time-window aggregation
CREATE INDEX idx_tool_telemetry_agent_time ON tool_telemetry (agent_name, created_at);
CREATE INDEX idx_tool_telemetry_tool_outcome ON tool_telemetry (tool_name, outcome);
CREATE INDEX idx_tool_telemetry_org ON tool_telemetry (org_id);
CREATE INDEX idx_tool_telemetry_session ON tool_telemetry (session_id);

-- RLS: service_role only (same pattern as 030_agent_logging_tables.sql)
ALTER TABLE tool_telemetry ENABLE ROW LEVEL SECURITY;

CREATE POLICY tool_telemetry_service_role ON tool_telemetry
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;
