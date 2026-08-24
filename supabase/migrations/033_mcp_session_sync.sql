-- Migration 033: MCP session sync tables
-- Created: 2026-02-23
-- Purpose: Cross-platform session checkpoints and migration number authority
--          for dws-mcp-claude (port 8771)

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

-- Enable RLS — only service key can write; anon can read own branch
ALTER TABLE mcp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_full_access_sessions"
    ON mcp_sessions FOR ALL
    USING (auth.role() = 'service_role');


-- Migration queue — single number authority across all platforms
-- Mobile queues here; Win11 applies and marks as applied
CREATE TABLE IF NOT EXISTS mcp_migration_queue (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_number   integer NOT NULL UNIQUE,  -- atomic, assigned by server
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

ALTER TABLE mcp_migration_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_full_access_migrations"
    ON mcp_migration_queue FOR ALL
    USING (auth.role() = 'service_role');
