-- Ported from supabase/migrations/042_mcp_session_sync.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- 033_mcp_session_sync.sql is a dead duplicate of this migration and was
-- deliberately NOT ported (per prior migration audit — 042 is the live version).
--
-- NOTE on mcp_migration_number_seq: on the source (Supabase) side this sequence
-- exists to give VS Code / mobile / CLI a single atomic authority for numbering
-- supabase/migrations/*.sql files. On this database it is ported as-is for
-- structural completeness, but its START WITH value ("43", i.e. "after 042") is
-- meaningless in the dws-postgres numbering context — this ported migration set
-- uses its own independent 000/001/002... sequence. A human should decide
-- whether mcp_migration_queue/next_migration_number() are still needed here at
-- all once dws-backend/dws-cron's migration-authoring workflow is finalized for
-- the split repo, or whether they should keep coordinating supabase/migrations/
-- numbering remotely.

BEGIN;

-- Session checkpoints — stores state from any tool (VS Code, Claude Code CLI, mobile)
CREATE TABLE IF NOT EXISTS mcp_sessions (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch      text NOT NULL,
    tool        text NOT NULL CHECK (tool IN ('win11', 'mobile', 'vscode', 'cli', 'chromebook')),
    checkpoint  jsonb,              -- todos, files_modified, next_action, notes
    summary     text,               -- set on session close
    closed_at   timestamptz,        -- null = session still open
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcp_sessions_branch  ON mcp_sessions (branch);
CREATE INDEX IF NOT EXISTS idx_mcp_sessions_tool    ON mcp_sessions (tool);
CREATE INDEX IF NOT EXISTS idx_mcp_sessions_created ON mcp_sessions (created_at DESC);

-- Migration queue — single number authority across all platforms
-- Mobile queues here; Win11 applies and marks as applied
CREATE TABLE IF NOT EXISTS mcp_migration_queue (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_number   integer NOT NULL UNIQUE,  -- atomic, assigned by server via sequence
    filename           text NOT NULL,
    sql                text NOT NULL,
    author_tool        text NOT NULL,
    author_branch      text NOT NULL,
    status             text NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'applied', 'discarded')),
    supabase_applied   boolean DEFAULT false,
    applied_by         text,
    applied_at         timestamptz,
    notes              text DEFAULT '',
    created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcp_migration_queue_status ON mcp_migration_queue (status);
CREATE INDEX IF NOT EXISTS idx_mcp_migration_queue_number ON mcp_migration_queue (migration_number);

-- Sequence for atomic migration numbering (prevents race conditions)
CREATE SEQUENCE IF NOT EXISTS mcp_migration_number_seq START WITH 43;

-- RPC function for atomic migration number allocation
CREATE OR REPLACE FUNCTION next_migration_number()
RETURNS integer
LANGUAGE sql
SECURITY INVOKER
AS $$
    SELECT nextval('mcp_migration_number_seq')::integer;
$$;

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON mcp_sessions TO dws_backend;
GRANT ALL ON mcp_migration_queue TO dws_backend;
GRANT USAGE, SELECT ON SEQUENCE mcp_migration_number_seq TO dws_backend;
GRANT EXECUTE ON FUNCTION next_migration_number TO dws_backend;

COMMIT;
