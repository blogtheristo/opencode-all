-- Migration 000: semantic_memories base table
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- No CREATE TABLE for semantic_memories exists anywhere in the 82 source
-- supabase/migrations/*.sql files (schema gap identified during migration audit).
-- All downstream migrations (047, 048, 049, 050, 051) ALTER or query this table
-- assuming it already exists. This file supplies that missing base definition so
-- the ported migration set is self-contained and applies cleanly to a fresh DB.
--
-- IMPORTANT — NOT FULLY CONFIRMED:
--   The columns below were reconstructed from a live query against the running
--   Supabase schema (done prior to this authoring pass), NOT from a source
--   migration file. A human should diff this against the real Supabase schema
--   (`\d+ semantic_memories` or `information_schema.columns`) before first real
--   use on dws-postgres:
--     - Index and constraint definitions beyond the primary key were NOT
--       confirmed (the live-schema query for indexes/constraints failed).
--       There is likely at least a vector index (ivfflat/hnsw on `embedding`)
--       on the real table that is not reproduced here.
--     - The `embedding` column's vector dimension is set to vector(1536) based
--       on src/agents/memory.service.ts using OpenAI `text-embedding-3-small`
--       (1536-dim) and 047_hybrid_memory_search.sql's hybrid_memory_search()
--       function signature (`query_embedding VECTOR(1536)`). This is a strong
--       inference, not a confirmed live-schema fact — verify before use.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS semantic_memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  memory_type varchar NOT NULL,
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb,
  source text,
  confidence double precision,
  access_count integer,
  accessed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  org_id varchar,
  expired_at timestamptz,
  superseded_by uuid
);

-- Self-referencing FK stays intact: semantic_memories is on this database.
ALTER TABLE semantic_memories
  ADD CONSTRAINT semantic_memories_superseded_by_fkey
  FOREIGN KEY (superseded_by) REFERENCES semantic_memories(id);

GRANT ALL ON semantic_memories TO dws_backend;
