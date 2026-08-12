-- Ported from supabase/migrations/014_climate_assistant_usage.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CLIMATE ASSISTANT USAGE TABLE
-- Tracks daily token usage for budget enforcement (global, one row per date —
-- confirmed live schema per src/services/climate-assistant.service.ts, which
-- selects by `date` alone and calls increment_climate_usage(usage_date,
-- input_tokens_delta, output_tokens_delta, cost_delta)).
-- ============================================================
CREATE TABLE IF NOT EXISTS climate_assistant_usage (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  input_tokens bigint DEFAULT 0 NOT NULL,
  output_tokens bigint DEFAULT 0 NOT NULL,
  requests integer DEFAULT 0 NOT NULL,
  cost_usd numeric(10, 6) DEFAULT 0.0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_date UNIQUE (date)
);

-- Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_climate_assistant_usage_date ON climate_assistant_usage(date DESC);

COMMENT ON TABLE climate_assistant_usage IS 'Persistent storage for Climate Assistant daily usage tracking. Enables budget enforcement across serverless cold starts and multiple instances.';
COMMENT ON COLUMN climate_assistant_usage.date IS 'Date of usage (YYYY-MM-DD)';
COMMENT ON COLUMN climate_assistant_usage.input_tokens IS 'Total input tokens used on this date';
COMMENT ON COLUMN climate_assistant_usage.output_tokens IS 'Total output tokens used on this date';
COMMENT ON COLUMN climate_assistant_usage.requests IS 'Number of API requests made on this date';
COMMENT ON COLUMN climate_assistant_usage.cost_usd IS 'Total cost in USD for this date';

-- ============================================================
-- HELPER FUNCTION: Get or create today's usage record
-- ============================================================
CREATE OR REPLACE FUNCTION get_or_create_usage_for_date(usage_date date)
RETURNS climate_assistant_usage
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usage_record climate_assistant_usage;
BEGIN
  SELECT * INTO usage_record
  FROM climate_assistant_usage
  WHERE date = usage_date;

  IF NOT FOUND THEN
    INSERT INTO climate_assistant_usage (date, input_tokens, output_tokens, requests, cost_usd)
    VALUES (usage_date, 0, 0, 0, 0.0)
    RETURNING * INTO usage_record;
  END IF;

  RETURN usage_record;
END;
$$;

-- ============================================================
-- HELPER FUNCTION: Increment usage atomically
-- ============================================================
CREATE OR REPLACE FUNCTION increment_climate_usage(
  usage_date date,
  input_tokens_delta bigint,
  output_tokens_delta bigint,
  cost_delta numeric
)
RETURNS climate_assistant_usage
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  usage_record climate_assistant_usage;
BEGIN
  INSERT INTO climate_assistant_usage (date, input_tokens, output_tokens, requests, cost_usd, updated_at)
  VALUES (usage_date, input_tokens_delta, output_tokens_delta, 1, cost_delta, now())
  ON CONFLICT (date)
  DO UPDATE SET
    input_tokens = climate_assistant_usage.input_tokens + EXCLUDED.input_tokens,
    output_tokens = climate_assistant_usage.output_tokens + EXCLUDED.output_tokens,
    requests = climate_assistant_usage.requests + 1,
    cost_usd = climate_assistant_usage.cost_usd + EXCLUDED.cost_usd,
    updated_at = now()
  RETURNING * INTO usage_record;

  RETURN usage_record;
END;
$$;

COMMENT ON FUNCTION get_or_create_usage_for_date IS 'Gets existing usage record for date or creates a new one if it does not exist';
COMMENT ON FUNCTION increment_climate_usage IS 'Atomically increments usage counters for the given date. Safe for concurrent calls across multiple instances.';

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON climate_assistant_usage TO dws_backend;
GRANT EXECUTE ON FUNCTION get_or_create_usage_for_date(date) TO dws_backend;
GRANT EXECUTE ON FUNCTION increment_climate_usage(date, bigint, bigint, numeric) TO dws_backend;
