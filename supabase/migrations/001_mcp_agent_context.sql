-- DWS IQ 6 MCP Agent Context Storage
-- Migration for multi-agent orchestration and session persistence

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Agent Sessions Table
-- Stores context snapshots from Claude Code, Cursor, and Gemini
CREATE TABLE IF NOT EXISTS agent_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id text UNIQUE NOT NULL,
  session_name text NOT NULL,
  agent_type text NOT NULL CHECK (agent_type IN ('cursor', 'claude-code', 'gemini')),
  context_snapshot jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_agent_sessions_type ON agent_sessions(agent_type);
CREATE INDEX idx_agent_sessions_created ON agent_sessions(created_at DESC);

-- Agent Tasks Table
-- Tracks individual tasks assigned to agents
CREATE TABLE IF NOT EXISTS agent_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES agent_sessions(id) ON DELETE CASCADE,
  task_description text NOT NULL,
  assigned_agent text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  output jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Index for task queries
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_agent ON agent_tasks(assigned_agent);

-- Projects Table (if not exists)
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  status text DEFAULT 'active',
  start_date date,
  carbon_target decimal,
  created_at timestamptz DEFAULT now()
);

-- Carbon Calculations Table
-- Stores carbon calculation results for construction projects
CREATE TABLE IF NOT EXISTS carbon_calculations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  building_component text NOT NULL,
  material_type text,
  quantity_m3 decimal,
  co2_kg decimal NOT NULL,
  calculation_method text DEFAULT 'EN 15978',
  calculated_by text,
  created_at timestamptz DEFAULT now()
);

-- Index for carbon queries
CREATE INDEX idx_carbon_project ON carbon_calculations(project_id);
CREATE INDEX idx_carbon_created ON carbon_calculations(created_at DESC);

-- BIM Metadata Table
-- Stores extracted data from BIM files (IFC, Revit, etc.)
CREATE TABLE IF NOT EXISTS bim_metadata (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  file_url text,
  extracted_data jsonb NOT NULL,
  processing_agent text,
  last_updated timestamptz DEFAULT now()
);

-- Index for BIM queries
CREATE INDEX idx_bim_project ON bim_metadata(project_id);

-- Compliance Rules Table
-- EU construction compliance rules knowledge base
CREATE TABLE IF NOT EXISTS compliance_rules (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  country text NOT NULL DEFAULT 'FI',
  type text,
  regulation_name text NOT NULL,
  description text,
  requirements jsonb,
  effective_date date,
  created_at timestamptz DEFAULT now()
);

-- Index for compliance queries
CREATE INDEX idx_compliance_country ON compliance_rules(country);
CREATE INDEX idx_compliance_type ON compliance_rules(type);

-- Knowledge Base Table
-- General knowledge base for standards and documentation
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category text NOT NULL,
  title text NOT NULL,
  content text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Index for knowledge base
CREATE INDEX idx_knowledge_category ON knowledge_base(category);

-- Agent Logs Table
-- Comprehensive logging for multi-agent orchestration
CREATE TABLE IF NOT EXISTS agent_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name text NOT NULL,
  task text NOT NULL,
  status text NOT NULL,
  metadata jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Index for log queries
CREATE INDEX idx_agent_logs_agent ON agent_logs(agent_name);
CREATE INDEX idx_agent_logs_timestamp ON agent_logs(timestamp DESC);

-- Project Embeddings Table
-- Semantic search using pgvector
CREATE TABLE IF NOT EXISTS project_embeddings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  content text NOT NULL,
  embedding vector(1536),  -- OpenAI ada-002 dimensions
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Vector similarity search index
CREATE INDEX idx_project_embeddings_vector
  ON project_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Enable Row Level Security (RLS)
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bim_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow service role full access
CREATE POLICY "Service role has full access to agent_sessions"
  ON agent_sessions
  FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to agent_tasks"
  ON agent_tasks
  FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to carbon_calculations"
  ON carbon_calculations
  FOR ALL
  USING (true);

CREATE POLICY "Service role has full access to bim_metadata"
  ON bim_metadata
  FOR ALL
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for agent_sessions
CREATE TRIGGER update_agent_sessions_updated_at
  BEFORE UPDATE ON agent_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample compliance rules for Finland (Fit for 55)
INSERT INTO compliance_rules (country, type, regulation_name, description, requirements, effective_date)
VALUES
  ('FI', 'fit-for-55', 'EU Fit for 55 Package',
   'EU climate law requiring 55% emissions reduction by 2030',
   '{"reduction_target": "55%", "baseline_year": 2020, "target_year": 2030}'::jsonb,
   '2030-12-31'),
  ('FI', 'building-carbon', 'Embodied Carbon Measurement Mandate',
   'Mandatory carbon measurement for buildings >1000 m²',
   '{"building_size_threshold": "1000 m²", "methodology": "EN 15978", "lifecycle_stages": ["A1", "A2", "A3"]}'::jsonb,
   '2028-01-01');

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (category, title, content, metadata)
VALUES
  ('standards', 'EN 15978',
   'Sustainability of construction works - Assessment of environmental performance of buildings - Calculation method',
   '{"scope": "cradle to grave", "stages": ["A1-A5", "B1-B7", "C1-C4", "D"]}'::jsonb),
  ('standards', 'EN 15804',
   'Sustainability of construction works - Environmental product declarations - Core rules for the product category of construction products',
   '{"type": "EPD", "application": "product level"}'::jsonb);

-- Comments for documentation
COMMENT ON TABLE agent_sessions IS 'Stores context snapshots from multi-agent sessions (Claude Code, Cursor, Gemini)';
COMMENT ON TABLE agent_tasks IS 'Tracks individual tasks assigned to AI agents in workflows';
COMMENT ON TABLE carbon_calculations IS 'Carbon calculation results for construction projects using EN 15978';
COMMENT ON TABLE bim_metadata IS 'Extracted data from BIM files (IFC, Revit) processed by agents';
COMMENT ON TABLE compliance_rules IS 'EU construction compliance rules knowledge base (Fit for 55, ETS, CBAM)';
COMMENT ON TABLE project_embeddings IS 'Vector embeddings for semantic search across project documentation';
COMMENT ON TABLE agent_logs IS 'Comprehensive logging for multi-agent orchestration and observability';
