-- =============================================================================
-- DWS Edge PostgreSQL — Extension Initialization
-- =============================================================================
-- Target: Acer Veriton GN100 edge database
-- Extensions: TimescaleDB, pg_duckdb, pgvector
--
-- This script runs automatically on first container startup via
-- /docker-entrypoint-initdb.d/. It is idempotent — safe to re-run.
--
-- Version: 1.0.0 | Date: 2026-03-13
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. Enable extensions
-- =============================================================================

-- TimescaleDB: time-series hypertables, compression, continuous aggregates
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- pg_duckdb: DuckDB-powered OLAP analytics engine inside PostgreSQL
CREATE EXTENSION IF NOT EXISTS duckdb;

-- pgvector: vector similarity search (matches Supabase production stack)
CREATE EXTENSION IF NOT EXISTS vector;

-- uuid-ossp: UUID generation (matches Supabase production stack)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pgcrypto: cryptographic functions (matches Supabase production stack)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 2. Verify extensions loaded
-- =============================================================================
DO $$
DECLARE
    ext RECORD;
BEGIN
    FOR ext IN
        SELECT extname, extversion
        FROM pg_extension
        WHERE extname IN ('timescaledb', 'duckdb', 'vector', 'uuid-ossp', 'pgcrypto')
        ORDER BY extname
    LOOP
        RAISE NOTICE 'Extension loaded: % v%', ext.extname, ext.extversion;
    END LOOP;
END
$$;

-- =============================================================================
-- 3. Auth schema stubs (Supabase RLS compatibility)
-- =============================================================================
-- Mirrors scripts/aiven-init.sql — allows Supabase migrations to apply
-- without errors when RLS policies reference auth.uid() / auth.jwt().

CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid LANGUAGE sql STABLE
AS $$ SELECT '00000000-0000-0000-0000-000000000000'::uuid $$;

CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb LANGUAGE sql STABLE
AS $$ SELECT '{}'::jsonb $$;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text LANGUAGE sql STABLE
AS $$ SELECT 'authenticated'::text $$;

-- =============================================================================
-- 4. Edge metadata table
-- =============================================================================
CREATE TABLE IF NOT EXISTS _edge_metadata (
    id            SERIAL PRIMARY KEY,
    initialized   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    device_host   TEXT NOT NULL DEFAULT 'gn100-cb5d',
    pg_version    TEXT NOT NULL DEFAULT current_setting('server_version'),
    extensions    JSONB,
    notes         TEXT
);

-- Record initialization
INSERT INTO _edge_metadata (extensions, notes)
SELECT
    jsonb_agg(jsonb_build_object('name', extname, 'version', extversion)),
    'Initial edge database setup on Acer Veriton GN100'
FROM pg_extension
WHERE extname IN ('timescaledb', 'duckdb', 'vector', 'uuid-ossp', 'pgcrypto');

COMMIT;

-- =============================================================================
-- 5. TimescaleDB telemetry off (EU data sovereignty)
-- =============================================================================
-- Run outside transaction — TimescaleDB GUC may not be available in BEGIN block
ALTER SYSTEM SET timescaledb.telemetry_level = 'off';

-- =============================================================================
-- 6. Informational output
-- =============================================================================
DO $$
BEGIN
    RAISE NOTICE '=== DWS Edge PostgreSQL initialized ===';
    RAISE NOTICE 'Host: gn100-cb5d (Acer Veriton GN100)';
    RAISE NOTICE 'Extensions: timescaledb, duckdb, pgvector, uuid-ossp, pgcrypto';
    RAISE NOTICE 'Auth stubs: auth.uid(), auth.jwt(), auth.role()';
    RAISE NOTICE 'TimescaleDB telemetry: OFF (EU sovereignty)';
    RAISE NOTICE 'Ready for DWS edge workloads.';
END
$$;
