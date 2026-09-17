-- OpenCode-all session state management
-- Migration: 076_opencode_session_state
-- Purpose: Replace JSONL queue.jsonl with Supabase table for reliable session tracking

CREATE TABLE IF NOT EXISTS opencode_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'detect',
  state TEXT NOT NULL CHECK (state IN ('PENDING', 'RUNNING', 'DONE', 'FAILED')),
  status TEXT NOT NULL DEFAULT 'pending',

  -- Session metadata
  idempotency_key TEXT UNIQUE,
  baseline_commit TEXT,
  branch TEXT,
  worktree_path TEXT,
  handoff_path TEXT,

  -- Lifecycle tracking
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  stop_reason TEXT,
  failure_code TEXT,
  failure_detail JSONB,

  -- Worktree state
  worktree_state TEXT DEFAULT 'unknown',
  worktree_resumed BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_run TIMESTAMP WITH TIME ZONE,
  reconciled_at TIMESTAMP WITH TIME ZONE,

  -- Validation & legacy flags
  validation JSONB,
  legacy BOOLEAN DEFAULT FALSE
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_opencode_sessions_state ON opencode_sessions(state);
CREATE INDEX IF NOT EXISTS idx_opencode_sessions_status ON opencode_sessions(status);
CREATE INDEX IF NOT EXISTS idx_opencode_sessions_idempotency ON opencode_sessions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_opencode_sessions_branch ON opencode_sessions(branch);
CREATE INDEX IF NOT EXISTS idx_opencode_sessions_last_run ON opencode_sessions(last_run);
CREATE INDEX IF NOT EXISTS idx_opencode_sessions_state_status ON opencode_sessions(state, status);

-- Row-level security
ALTER TABLE opencode_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON opencode_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON opencode_sessions TO service_role;
GRANT SELECT, INSERT, UPDATE ON opencode_sessions TO authenticated;
