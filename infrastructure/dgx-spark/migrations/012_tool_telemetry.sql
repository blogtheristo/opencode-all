-- Ported from supabase/migrations/054_tool_telemetry.sql
-- and supabase/migrations/066_tool_telemetry_genai.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- 054 created tool_telemetry; 066 later ALTERed it to add OpenTelemetry
-- GenAI semantic-convention columns. Merged here into a single clean
-- CREATE TABLE since this is a fresh target database with no existing rows
-- whose schema-evolution history needs preserving.

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

  -- OpenTelemetry GenAI semantic-convention columns (from 066).
  -- Non-LLM tool events leave these NULL.
  trace_id TEXT,
  span_id TEXT,
  gen_ai_system TEXT,
  gen_ai_operation_name TEXT,
  gen_ai_request_model TEXT,
  gen_ai_response_model TEXT,
  gen_ai_request_max_tokens INTEGER,
  gen_ai_request_temperature DOUBLE PRECISION,
  gen_ai_request_top_p DOUBLE PRECISION,
  gen_ai_usage_input_tokens INTEGER,
  gen_ai_usage_output_tokens INTEGER,
  gen_ai_response_finish_reasons TEXT[],
  gen_ai_response_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Query patterns: per-agent metrics, per-tool failure rates, time-window aggregation
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_agent_time ON tool_telemetry (agent_name, created_at);
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_tool_outcome ON tool_telemetry (tool_name, outcome);
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_org ON tool_telemetry (org_id);
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_session ON tool_telemetry (session_id);

-- Trace-correlation lookups: "show me everything in trace X"
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_trace
  ON tool_telemetry (trace_id)
  WHERE trace_id IS NOT NULL;

-- Per-model aggregation: token usage and finish reasons by model id
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_genai_model_time
  ON tool_telemetry (gen_ai_request_model, created_at)
  WHERE gen_ai_request_model IS NOT NULL;

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON tool_telemetry TO dws_backend;

COMMIT;
