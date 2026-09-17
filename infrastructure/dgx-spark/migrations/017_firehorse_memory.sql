-- Ported from supabase/migrations/065_firehorse_memory.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

CREATE TABLE IF NOT EXISTS firehorse_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  source_session_id TEXT,
  source_proposal_path TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,
  CONSTRAINT firehorse_memory_topic_version_uniq UNIQUE (topic, version),
  CONSTRAINT firehorse_memory_topic_kebab CHECK (topic ~ '^[a-z0-9][a-z0-9-]*$'),
  CONSTRAINT firehorse_memory_version_positive CHECK (version >= 1)
);

CREATE INDEX IF NOT EXISTS idx_firehorse_memory_topic
  ON firehorse_memory (topic);
CREATE INDEX IF NOT EXISTS idx_firehorse_memory_source
  ON firehorse_memory (source);
CREATE INDEX IF NOT EXISTS idx_firehorse_memory_created_at
  ON firehorse_memory (created_at DESC);

-- "Current" view: latest non-archived version per topic.
CREATE OR REPLACE VIEW firehorse_memory_current AS
SELECT DISTINCT ON (topic) *
FROM firehorse_memory
WHERE archived_at IS NULL
ORDER BY topic, version DESC;

COMMENT ON TABLE firehorse_memory IS
  'Canonical store for Firehorse Dreaming memory notes. Insert-only / immutable: updates create new rows with incremented version. Soft-delete via archived_at. Local mirror lives at .claude/clawdbot/memory/<topic>.md.';

COMMENT ON COLUMN firehorse_memory.topic IS
  'Kebab-case identifier (matches the local <topic>.md filename, sans extension).';

COMMENT ON COLUMN firehorse_memory.source IS
  'Provenance tag, e.g. clawdbot-dream-curate, manual, firehorse-report-board-pack.';

COMMENT ON COLUMN firehorse_memory.source_session_id IS
  'Optional Claude Code .jsonl session UUID that produced this memory.';

COMMENT ON COLUMN firehorse_memory.source_proposal_path IS
  'Optional path to the .claude/clawdbot/proposals/*.md that originated this note.';

COMMENT ON VIEW firehorse_memory_current IS
  'Latest non-archived row per topic — read this for "what is our current knowledge on X".';

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON firehorse_memory TO dws_backend;
GRANT SELECT ON firehorse_memory_current TO dws_backend;
