-- Migration 038: HIL (Human-in-the-Loop) Todos
-- Stores pending manual tasks surfaced in the morning briefing.
-- Each todo has a done_token UUID used as a one-click "mark done" link in email.

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
CREATE INDEX idx_hil_todos_open ON hil_todos (created_at DESC) WHERE done_at IS NULL;

-- RLS: service key only (this table is internal / never exposed to anonymous users)
ALTER TABLE hil_todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY hil_todos_service_only ON hil_todos
  USING (auth.role() = 'service_role');

COMMENT ON TABLE hil_todos IS
  'Human-in-the-Loop manual tasks. Populated by automated collectors; cleared via one-click Done links in the morning briefing email.';
