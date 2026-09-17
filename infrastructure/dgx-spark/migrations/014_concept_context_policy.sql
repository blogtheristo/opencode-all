-- Ported from supabase/migrations/058_concept_context_policy.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'policy_level_enum'
  ) THEN
    CREATE TYPE policy_level_enum AS ENUM (
      'preferred',
      'allowed',
      'forbidden',
      'required'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'scope_type_enum'
  ) THEN
    CREATE TYPE scope_type_enum AS ENUM (
      'global',
      'platform_release',
      'edition',
      'lwm',
      'industry',
      'customer'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS concept_context_policy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id TEXT NOT NULL,
  scope_type scope_type_enum NOT NULL,
  scope_ref TEXT,
  platform_version TEXT,
  product_edition TEXT,
  legal_profile TEXT,
  cloud_profile TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  policy_level policy_level_enum NOT NULL DEFAULT 'preferred',
  preferred_term TEXT NOT NULL,
  definition_override TEXT,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_ccp_global_scope_ref
    CHECK (
      (scope_type = 'global' AND scope_ref IS NULL) OR
      (scope_type <> 'global' AND scope_ref IS NOT NULL)
    ),
  CONSTRAINT chk_ccp_validity_window
    CHECK (valid_to IS NULL OR valid_to > valid_from)
);

-- One active row per exact context tuple.
-- NOTE: We normalize NULL context fields to sentinels so uniqueness applies
-- across all dimensions consistently (including global rows).
CREATE UNIQUE INDEX IF NOT EXISTS uq_ccp_context
  ON concept_context_policy (
    concept_id,
    scope_type,
    COALESCE(scope_ref, '__global__'),
    COALESCE(platform_version, '__any__'),
    COALESCE(product_edition, '__any__'),
    COALESCE(legal_profile, '__any__'),
    COALESCE(cloud_profile, '__any__'),
    locale
  );

CREATE INDEX IF NOT EXISTS idx_ccp_concept_scope
  ON concept_context_policy (concept_id, scope_type, scope_ref);

CREATE INDEX IF NOT EXISTS idx_ccp_context_filters
  ON concept_context_policy (
    locale,
    platform_version,
    product_edition,
    legal_profile,
    cloud_profile
  );

CREATE INDEX IF NOT EXISTS idx_ccp_validity
  ON concept_context_policy (valid_from, valid_to);

CREATE OR REPLACE FUNCTION trg_set_updated_at_concept_context_policy()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at_concept_context_policy
  ON concept_context_policy;

CREATE TRIGGER set_updated_at_concept_context_policy
  BEFORE UPDATE ON concept_context_policy
  FOR EACH ROW
  EXECUTE FUNCTION trg_set_updated_at_concept_context_policy();

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON concept_context_policy TO dws_backend;
GRANT EXECUTE ON FUNCTION trg_set_updated_at_concept_context_policy TO dws_backend;

COMMIT;
