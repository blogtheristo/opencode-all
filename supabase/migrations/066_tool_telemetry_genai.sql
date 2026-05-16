-- Migration 066: tool_telemetry — OpenTelemetry GenAI semantic-convention columns
--
-- Adds optional fields aligned with the OpenTelemetry GenAI semantic
-- conventions so that LLM invocations recorded by src/agents/telemetry.service.ts
-- can carry `gen_ai.*` attributes alongside the existing ASTA tool-use signals.
--
-- Reference:
--   https://opentelemetry.io/blog/2026/genai-observability/
--   https://opentelemetry.io/docs/specs/semconv/gen-ai/
--   docs/field-notes/2026-05-15-opentelemetry-genai-observability-control-room.md
--
-- Non-LLM tool events leave these columns NULL — fully additive, no backfill.

BEGIN;

ALTER TABLE tool_telemetry
  ADD COLUMN IF NOT EXISTS trace_id TEXT,
  ADD COLUMN IF NOT EXISTS span_id TEXT,
  ADD COLUMN IF NOT EXISTS gen_ai_system TEXT,
  ADD COLUMN IF NOT EXISTS gen_ai_operation_name TEXT,
  ADD COLUMN IF NOT EXISTS gen_ai_request_model TEXT,
  ADD COLUMN IF NOT EXISTS gen_ai_response_model TEXT,
  ADD COLUMN IF NOT EXISTS gen_ai_request_max_tokens INTEGER,
  ADD COLUMN IF NOT EXISTS gen_ai_request_temperature DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS gen_ai_request_top_p DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS gen_ai_usage_input_tokens INTEGER,
  ADD COLUMN IF NOT EXISTS gen_ai_usage_output_tokens INTEGER,
  ADD COLUMN IF NOT EXISTS gen_ai_response_finish_reasons TEXT[],
  ADD COLUMN IF NOT EXISTS gen_ai_response_id TEXT;

-- Trace-correlation lookups: "show me everything in trace X"
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_trace
  ON tool_telemetry (trace_id)
  WHERE trace_id IS NOT NULL;

-- Per-model aggregation: token usage and finish reasons by model id
CREATE INDEX IF NOT EXISTS idx_tool_telemetry_genai_model_time
  ON tool_telemetry (gen_ai_request_model, created_at)
  WHERE gen_ai_request_model IS NOT NULL;

COMMIT;
