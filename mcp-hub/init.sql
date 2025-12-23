-- Initialize MCP context store database
-- This is used by the context-store PostgreSQL container

CREATE DATABASE mcp_context;
\c mcp_context;

-- Basic logging table for local context store
CREATE TABLE IF NOT EXISTS workflow_logs (
  id SERIAL PRIMARY KEY,
  workflow_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_workflow_logs_id ON workflow_logs(workflow_id);
CREATE INDEX idx_workflow_logs_created ON workflow_logs(created_at DESC);
