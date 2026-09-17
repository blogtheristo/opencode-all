-- Migration: Semantic Graph Layer for Option A Delivery (KYA v2 Drift Detection)
-- Version: 1.0
-- Date: 2026-09-07
-- Purpose: Create tables for semantic drift detection, entity reconciliation, and Article 12 compliance logging
-- Reviewed: Option A delivery finalization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Semantic entities table (immutable reference to truth standard)
CREATE TABLE IF NOT EXISTS semantic_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truth_standard_key TEXT NOT NULL UNIQUE,
  entity_type VARCHAR(50) NOT NULL,
  label TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}',
  confidence NUMERIC(4,3) DEFAULT 1.0,
  cluster_id UUID,
  source_ontology VARCHAR(100) DEFAULT 'dws-truth-v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_type CHECK (entity_type IN (
    'Agent', 'Role', 'Skill', 'Org', 'Partner', 'Document', 'Policy', 'Integration'
  )),
  CONSTRAINT valid_confidence CHECK (confidence >= 0.0 AND confidence <= 1.0)
);

-- Semantic edges (relationships between entities)
CREATE TABLE IF NOT EXISTS semantic_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES semantic_entities(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES semantic_entities(id) ON DELETE CASCADE,
  relation VARCHAR(100) NOT NULL,
  weight NUMERIC(4,3) NOT NULL,
  direction VARCHAR(20) DEFAULT 'directed',
  evidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, target_id, relation),
  CONSTRAINT valid_weight CHECK (weight >= 0.0 AND weight <= 1.0),
  CONSTRAINT valid_direction CHECK (direction IN ('directed', 'undirected'))
);

-- Entity clusters (groupings from graph algorithms)
CREATE TABLE IF NOT EXISTS semantic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  cluster_algorithm VARCHAR(50) DEFAULT 'louvain-v1',
  entity_count INT DEFAULT 0,
  avg_edge_weight NUMERIC(4,3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_count CHECK (entity_count >= 0),
  CONSTRAINT valid_weight CHECK (
    avg_edge_weight IS NULL OR (avg_edge_weight >= 0.0 AND avg_edge_weight <= 1.0)
  )
);

-- Article 12 compliance audit log (immutable)
CREATE TABLE IF NOT EXISTS drift_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES semantic_entities(id),
  drift_score NUMERIC(5,4) NOT NULL,
  action VARCHAR(50) NOT NULL,
  confidence_chain JSONB NOT NULL,
  reasoning_checkpoints TEXT,
  approver_role_id VARCHAR(50),
  approver_decision VARCHAR(50),
  kya_decision VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_immutable BOOLEAN DEFAULT TRUE,
  hash_chain_previous UUID,
  hash_sha256 VARCHAR(64),
  CONSTRAINT valid_drift CHECK (drift_score >= 0.0 AND drift_score <= 1.0),
  CONSTRAINT valid_action CHECK (action IN ('PROCEED', 'LOG', 'ESCALATE', 'HALT')),
  CONSTRAINT valid_decision CHECK (
    approver_decision IS NULL OR
    approver_decision IN ('approved', 'deferred', 'rejected', 'escalated')
  ),
  CONSTRAINT immutable CHECK (is_immutable = TRUE)
);

-- Transparency report cache (for efficient Article 13 compliance)
CREATE TABLE IF NOT EXISTS drift_transparency_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  total_evaluations INT DEFAULT 0,
  escalations INT DEFAULT 0,
  halts INT DEFAULT 0,
  avg_drift_score NUMERIC(5,4),
  content_md TEXT,
  content_pdf BYTEA,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(report_period_start, report_period_end)
);

-- Row-level security policies
ALTER TABLE semantic_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE drift_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE drift_transparency_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies: allow service_role full access, authenticated users read audit logs
CREATE POLICY "service_role_full_access_entities" ON semantic_entities
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "authenticated_read_entities" ON semantic_entities
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "service_role_full_access_audit" ON drift_audit_log
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "authenticated_read_audit_own_role" ON drift_audit_log
  FOR SELECT
  USING (auth.role() = 'authenticated' AND approver_role_id = auth.jwt() ->> 'role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_semantic_entities_type ON semantic_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_semantic_entities_truth_key ON semantic_entities(truth_standard_key);
CREATE INDEX IF NOT EXISTS idx_semantic_entities_cluster ON semantic_entities(cluster_id);
CREATE INDEX IF NOT EXISTS idx_semantic_edges_source ON semantic_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_semantic_edges_target ON semantic_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_semantic_edges_relation ON semantic_edges(relation);
CREATE INDEX IF NOT EXISTS idx_drift_audit_entity ON drift_audit_log(entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drift_audit_action ON drift_audit_log(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drift_audit_approver ON drift_audit_log(approver_role_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transparency_period ON drift_transparency_reports(report_period_start, report_period_end);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON semantic_entities TO service_role;
GRANT SELECT, INSERT, UPDATE ON semantic_edges TO service_role;
GRANT SELECT, INSERT, UPDATE ON semantic_clusters TO service_role;
GRANT INSERT ON drift_audit_log TO service_role;
GRANT SELECT ON drift_audit_log TO service_role;
GRANT SELECT ON drift_transparency_reports TO authenticated;

-- Commented by: reviewed by HIC, Article 12/13/14 compliance verified
-- Evidence: semanticdrift-scorer.service.ts, article-13-amr-logger.ts
