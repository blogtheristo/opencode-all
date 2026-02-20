-- Agent Logging Tables for MCP Hub, Supabase MCP, and Base Agent
-- DWS IQ 6 - Required by mcp-hub (agent_activity), mcp-servers/supabase (agent_logs), base.agent.ts (agent_executions)
-- Created: 2026-02 - Fixes missing tables causing MCP/Supabase logging failures

-- Ensure uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- agent_activity - Used by mcp-hub/server.py for multi-agent orchestration logging
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
-- agent_logs - Used by mcp-servers/supabase/server.py log_agent_activity endpoint
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
-- agent_executions - Used by src/agents/base.agent.ts for execution audit trail
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
-- RLS - Service role only (backend services)
-- ============================================================================
ALTER TABLE agent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access agent_activity"
  ON agent_activity FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access agent_logs"
  ON agent_logs FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access agent_executions"
  ON agent_executions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- No public/anon access
CREATE POLICY "No anon agent_activity" ON agent_activity FOR ALL TO anon USING (false) WITH CHECK (false);
CREATE POLICY "No anon agent_logs" ON agent_logs FOR ALL TO anon USING (false) WITH CHECK (false);
CREATE POLICY "No anon agent_executions" ON agent_executions FOR ALL TO anon USING (false) WITH CHECK (false);

-- Migration complete
SELECT 'Migration 030_agent_logging_tables.sql completed successfully' as status;
