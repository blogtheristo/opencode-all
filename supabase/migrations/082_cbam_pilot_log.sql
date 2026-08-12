-- Migration 082: CBAM Paid Pilot — endpoint log table
--
-- Creates the paid_endpoint_log table for the CBAM KYA-S1 pilot.
-- Every call to /api/v1/cbam/calculation is recorded here regardless of result.
-- The pilot_tier column is added to api_keys to distinguish pilot keys from
-- standard customer keys — no existing rows are affected.
--
-- Regulation: EU 2023/956 (CBAM)
-- KYA tier: S1 (read-only structured output, no external writes)

-- ============================================================
-- 1. Extend api_keys with a tier column (non-breaking, nullable)
-- ============================================================

ALTER TABLE api_keys
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'pilot', 'internal'));

COMMENT ON COLUMN api_keys.tier IS
  'Key tier. "pilot" = CBAM paid pilot (€0.10/call). "standard" = normal customer key. "internal" = system use.';

-- ============================================================
-- 2. Paid endpoint log
-- ============================================================

CREATE TABLE IF NOT EXISTS paid_endpoint_log (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id       UUID        NOT NULL UNIQUE,
  key_id           UUID        REFERENCES api_keys(id) ON DELETE SET NULL,
  org_id           TEXT,                         -- denormalised from api_keys for fast queries
  endpoint         TEXT        NOT NULL,         -- e.g. 'cbam.calculation.v1'
  input_hash       TEXT        NOT NULL,         -- SHA-256 of request body for repeat-purchase detection
  verdict          TEXT,                         -- 'success' | 'refused' | 'error'
  confidence       NUMERIC(4,3),                 -- 0.000–1.000
  price_eur        NUMERIC(10,4) NOT NULL DEFAULT 0.10,
  calc_version     TEXT,                         -- e.g. '1.0.0'
  uses_defaults    BOOLEAN,                      -- true if any default emission factor was used
  missing_evidence TEXT[],                       -- gap flags surfaced to caller
  fault_attr       TEXT CHECK (fault_attr IN ('requester', 'evidence_gap', 'system', NULL)),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE paid_endpoint_log IS
  'Audit log for every call to a paid DWS endpoint. Primary 30-day demand-discovery signal.';

-- RLS: service_role only — callers cannot read their peers' call history
ALTER TABLE paid_endpoint_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY paid_endpoint_log_service_only
  ON paid_endpoint_log
  FOR ALL
  TO service_role
  USING (true);

-- Explicit grants required (Supabase ≥2026-05-30 grant model)
GRANT SELECT, INSERT ON paid_endpoint_log TO service_role;

-- ============================================================
-- 3. Indexes for the 30-day analysis query
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_pel_key_id      ON paid_endpoint_log (key_id);
CREATE INDEX IF NOT EXISTS idx_pel_org_id      ON paid_endpoint_log (org_id);
CREATE INDEX IF NOT EXISTS idx_pel_created_at  ON paid_endpoint_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pel_input_hash  ON paid_endpoint_log (input_hash); -- repeat-purchase detection
