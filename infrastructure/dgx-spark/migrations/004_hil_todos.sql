-- Ported from supabase/migrations/038_hil_todos.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

CREATE TABLE IF NOT EXISTS hil_todos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category     TEXT NOT NULL,       -- 'competitor_price', 'market_brief', 'config_gap', 'manual'
  description  TEXT NOT NULL,
  context      JSONB DEFAULT '{}',  -- extra metadata (competitor_name, product_name, etc.)
  dedup_key    TEXT UNIQUE NOT NULL, -- prevents duplicate open todos (e.g. 'competitor_price:Zoom')
  done_token   UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  done_at      TIMESTAMPTZ,         -- NULL = still open
  done_by      TEXT DEFAULT 'risto'
);

-- Index to quickly fetch open todos for the morning briefing
CREATE INDEX IF NOT EXISTS idx_hil_todos_open ON hil_todos (created_at DESC) WHERE done_at IS NULL;

COMMENT ON TABLE hil_todos IS
  'Human-in-the-Loop manual tasks. Populated by automated collectors; cleared via one-click Done links in the morning briefing email.';

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON hil_todos TO dws_backend;
