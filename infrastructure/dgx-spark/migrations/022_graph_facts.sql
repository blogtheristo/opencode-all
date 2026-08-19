-- Migration 022: graph_facts table + graph_traverse function
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- Graph-engineering first slice: subject/relation/object triples extracted
-- from the /kb wiki, queryable via a bounded recursive-CTE traversal that
-- serves both "local search" (max_hops=1, direct neighbors) and multi-hop
-- causal chains (max_hops>1). See src/agents/graph-extraction.service.ts
-- and src/agents/graph.service.ts.
--
-- Same database/access-control convention as semantic_memories
-- (000_semantic_memories_base.sql): connection-level isolation via the
-- dws_backend role, no RLS — this table is never exposed via PostgREST.

CREATE TABLE IF NOT EXISTS graph_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id text NOT NULL,
  subject text NOT NULL,
  relation text NOT NULL,
  object text NOT NULL,
  confidence double precision NOT NULL DEFAULT 1.0,
  source_type text NOT NULL,
  source_ref text NOT NULL,
  extracted_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS graph_facts_org_subject_idx ON graph_facts (org_id, subject);
CREATE INDEX IF NOT EXISTS graph_facts_org_object_idx ON graph_facts (org_id, object);
CREATE INDEX IF NOT EXISTS graph_facts_org_relation_idx ON graph_facts (org_id, relation);

GRANT ALL ON graph_facts TO dws_backend;

-- Single traversal function serving both GraphRAG-style local search
-- (max_hops=1: direct neighbors of start_entity) and multi-hop causal
-- chains (max_hops>1). Cycle guard prevents infinite loops on circular
-- relations; caller (graph.service.ts) enforces a hard hop cap of 5.
CREATE OR REPLACE FUNCTION graph_traverse(
  org_filter text,
  start_entity text,
  max_hops int DEFAULT 1,
  relation_filter text DEFAULT NULL
) RETURNS TABLE (
  hop int,
  subject text,
  relation text,
  object text,
  confidence double precision,
  source_ref text,
  path text[]
)
LANGUAGE sql SECURITY INVOKER AS $$
  WITH RECURSIVE walk AS (
    SELECT 1 AS hop, gf.subject, gf.relation, gf.object, gf.confidence, gf.source_ref,
           ARRAY[gf.subject, gf.object] AS path
    FROM graph_facts gf
    WHERE gf.org_id = org_filter
      AND (gf.subject ILIKE start_entity OR gf.object ILIKE start_entity)
      AND (relation_filter IS NULL OR gf.relation = relation_filter)
    UNION ALL
    SELECT w.hop + 1, gf.subject, gf.relation, gf.object, gf.confidence, gf.source_ref,
           w.path || gf.object
    FROM walk w
    JOIN graph_facts gf ON gf.org_id = org_filter
      AND (gf.subject = w.object OR gf.object = w.subject)
    WHERE w.hop < max_hops
      AND NOT gf.object = ANY(w.path)
  )
  SELECT * FROM walk ORDER BY hop, confidence DESC LIMIT 200;
$$;

GRANT EXECUTE ON FUNCTION graph_traverse(text, text, int, text) TO dws_backend;
