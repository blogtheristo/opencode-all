-- Ported from supabase/migrations/030_agent_logging_tables.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- agent_activity - mcp-hub multi-agent orchestration logging
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_activity (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL,
  task text NOT NULL,
  status text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_name ON agent_activity(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_activity_status ON agent_activity(status);
CREATE INDEX IF NOT EXISTS idx_agent_activity_created_at ON agent_activity(created_at DESC);

COMMENT ON TABLE agent_activity IS 'MCP Hub multi-agent orchestration activity log (log_agent_activity, sweep)';

-- ============================================================================
-- agent_logs - Supabase MCP server log_agent_activity endpoint
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL,
  task text NOT NULL,
  status text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_timestamp ON agent_logs(timestamp DESC);

COMMENT ON TABLE agent_logs IS 'Supabase MCP server agent activity logging';

-- ============================================================================
-- agent_executions - src/agents/base.agent.ts execution audit trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_executions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL,
  user_id uuid NOT NULL,
  org_id uuid NOT NULL,
  session_id text NOT NULL,
  project_id text NOT NULL,
  input jsonb DEFAULT '{}'::jsonb,
  output jsonb,
  status text NOT NULL CHECK (status IN ('started', 'completed', 'error')),
  error_message text,
  duration_ms integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_name ON agent_executions(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_org_id ON agent_executions(org_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_session_id ON agent_executions(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created_at ON agent_executions(created_at DESC);

COMMENT ON TABLE agent_executions IS 'AI agent execution audit trail (base.agent.ts logExecution)';

-- ============================================================================
-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
-- ============================================================================
GRANT ALL ON agent_activity TO dws_backend;
GRANT ALL ON agent_logs TO dws_backend;
GRANT ALL ON agent_executions TO dws_backend;
