-- ============================================================================
-- Migration 065: firehorse_memory — Canonical store for Firehorse Dreaming
-- ============================================================================
--
-- Implements "CMS as canonical source of truth" per Firehorse/Firehorse CMS.md.
-- Backs the local Firehorse Dreaming feature: when /promote-proposal accepts a
-- memory note for promotion, it writes the body to
-- .claude/clawdbot/memory/<topic>.md AND inserts a row here. The on-disk file
-- stays the always-available local mirror; this table is the queryable,
-- audit-trailed canonical source for downstream agents (Firehorse reports,
-- World Model training).
--
-- Storage model: insert-only / immutable.
--   - Updates to a topic create a NEW row with version = previous + 1.
--   - Soft-delete via archived_at (per CLAUDE.md no-rm rule).
--   - "Current" view exposes the latest non-archived row per topic.
--
-- Date: 2026-05-12
-- See also: skills/promote-proposal/SKILL.md,
--           scripts/firehorse-memory-write.mjs,
--           .claude/clawdbot/memory/clawdbot-architecture.md
-- ============================================================================

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

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE firehorse_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to firehorse_memory"
  ON firehorse_memory FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can read non-archived memory"
  ON firehorse_memory FOR SELECT
  TO authenticated
  USING (archived_at IS NULL);

-- ============================================================================
-- COMMENTS
-- ============================================================================

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
