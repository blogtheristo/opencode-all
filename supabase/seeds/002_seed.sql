-- Seed 002: concept_context_policy baseline
-- Date: 2026-04-17
-- Purpose:
--   Global defaults + construction industry + KELA customer overrides
--   + one forbidden policy test row.
--
-- NOTE:
--   This seed targets table `concept_context_policy` introduced in migration 058.
--   Kept separate from migrations on purpose.

BEGIN;

WITH seed_rows AS (
  SELECT * FROM (
    VALUES
      -- 1) Global defaults
      ('carbon_balance', 'global'::scope_type_enum, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'en', 'preferred'::policy_level_enum, 'carbon balance sheet', NULL),
      ('compliance_agent', 'global'::scope_type_enum, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'en', 'preferred'::policy_level_enum, 'compliance agent', NULL),
      ('sovereignty', 'global'::scope_type_enum, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'en', 'preferred'::policy_level_enum, 'EU sovereignty', NULL),
      ('carbon_balance', 'global'::scope_type_enum, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'fi', 'preferred'::policy_level_enum, 'hiilitase', NULL),

      -- 2) Construction industry
      ('carbon_balance', 'industry'::scope_type_enum, 'construction', NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'en', 'preferred'::policy_level_enum, 'embodied carbon ledger', 'EN 15978 lifecycle carbon tracking for construction assets'),
      ('compliance_agent', 'industry'::scope_type_enum, 'construction', NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'en', 'preferred'::policy_level_enum, 'CSRD site agent', 'Handles EPBD + Fit for 55 + Taxonomy simultaneously'),

      -- 3) KELA customer example
      ('carbon_balance', 'customer'::scope_type_enum, 'kela', NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'fi', 'preferred'::policy_level_enum, 'kuljetuksen päästötase', 'KELA-kuljetusten CO2-seuranta per matka'),
      ('sovereignty', 'customer'::scope_type_enum, 'kela', NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'fi', 'required'::policy_level_enum, 'EU-suvereniteetti', 'KELA vaatii EU-sovereign hosting, ei US-infra'),

      -- 4) Forbidden test row
      ('physical_ai', 'customer'::scope_type_enum, 'kela', NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, 'en', 'forbidden'::policy_level_enum, 'Physical AI', 'KELA-kontekstissa ei käytetä Physical AI -termiä, käytä regulatory intelligence engine')
  ) AS v(
    concept_id,
    scope_type,
    scope_ref,
    platform_version,
    product_edition,
    legal_profile,
    cloud_profile,
    locale,
    policy_level,
    preferred_term,
    definition_override
  )
)
INSERT INTO concept_context_policy (
  concept_id,
  scope_type,
  scope_ref,
  platform_version,
  product_edition,
  legal_profile,
  cloud_profile,
  locale,
  policy_level,
  preferred_term,
  definition_override
)
SELECT
  concept_id,
  scope_type,
  scope_ref,
  platform_version,
  product_edition,
  legal_profile,
  cloud_profile,
  locale,
  policy_level,
  preferred_term,
  definition_override
FROM seed_rows
ON CONFLICT (
  concept_id,
  scope_type,
  (COALESCE(scope_ref, '__global__')),
  (COALESCE(platform_version, '__any__')),
  (COALESCE(product_edition, '__any__')),
  (COALESCE(legal_profile, '__any__')),
  (COALESCE(cloud_profile, '__any__')),
  locale
)
DO UPDATE SET
  policy_level = EXCLUDED.policy_level,
  preferred_term = EXCLUDED.preferred_term,
  definition_override = EXCLUDED.definition_override,
  updated_at = NOW();

COMMIT;
