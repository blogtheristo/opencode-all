-- Ported from supabase/migrations/060_resolver_resolve_term.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

BEGIN;

DROP FUNCTION IF EXISTS public.resolve_term(
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT,
  TEXT
);

CREATE OR REPLACE FUNCTION public.resolve_term(
  p_concept_id TEXT,
  p_tenant_id TEXT DEFAULT NULL,
  p_industry TEXT DEFAULT NULL,
  p_lwm_version TEXT DEFAULT NULL,
  p_product_edition TEXT DEFAULT NULL,
  p_platform_version TEXT DEFAULT NULL,
  p_legal_profile TEXT DEFAULT NULL,
  p_cloud_profile TEXT DEFAULT NULL,
  p_locale TEXT DEFAULT 'en'
)
RETURNS TABLE (
  concept_id TEXT,
  preferred_term TEXT,
  definition_override TEXT,
  policy_level policy_level_enum,
  scope_type scope_type_enum,
  scope_ref TEXT
)
LANGUAGE sql
STABLE
AS $$
WITH candidates AS (
  SELECT
    ccp.*,
    CASE ccp.scope_type
      WHEN 'customer' THEN 1
      WHEN 'industry' THEN 2
      WHEN 'lwm' THEN 3
      WHEN 'edition' THEN 4
      WHEN 'platform_release' THEN 5
      WHEN 'global' THEN 6
    END AS scope_priority,
    (
      CASE WHEN ccp.platform_version IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN ccp.product_edition IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN ccp.legal_profile IS NOT NULL THEN 1 ELSE 0 END +
      CASE WHEN ccp.cloud_profile IS NOT NULL THEN 1 ELSE 0 END
    ) AS specificity_score
  FROM concept_context_policy ccp
  WHERE
    ccp.concept_id = p_concept_id
    AND ccp.locale = COALESCE(p_locale, 'en')
    AND (ccp.valid_from IS NULL OR ccp.valid_from <= NOW())
    AND (ccp.valid_to IS NULL OR ccp.valid_to >= NOW())
    AND (
      (ccp.scope_type = 'customer' AND ccp.scope_ref = p_tenant_id)
      OR (ccp.scope_type = 'industry' AND ccp.scope_ref = p_industry)
      OR (ccp.scope_type = 'lwm' AND ccp.scope_ref = p_lwm_version)
      OR (ccp.scope_type = 'edition' AND ccp.scope_ref = p_product_edition)
      OR (ccp.scope_type = 'platform_release' AND ccp.scope_ref = p_platform_version)
      OR (ccp.scope_type = 'global')
    )
    AND (ccp.platform_version IS NULL OR ccp.platform_version = p_platform_version)
    AND (ccp.product_edition IS NULL OR ccp.product_edition = p_product_edition)
    AND (ccp.legal_profile IS NULL OR ccp.legal_profile = p_legal_profile)
    AND (ccp.cloud_profile IS NULL OR ccp.cloud_profile = p_cloud_profile)
),
top_scope AS (
  SELECT MIN(scope_priority) AS priority
  FROM candidates
),
top_scope_forbidden AS (
  SELECT
    ccp.concept_id,
    ccp.preferred_term,
    ccp.definition_override,
    ccp.policy_level,
    ccp.scope_type,
    ccp.scope_ref
  FROM candidates ccp
  JOIN top_scope ts
    ON ccp.scope_priority = ts.priority
  WHERE ccp.policy_level = 'forbidden'
  ORDER BY ccp.specificity_score DESC, ccp.updated_at DESC
  LIMIT 1
),
best_allowed AS (
  SELECT
    ccp.concept_id,
    ccp.preferred_term,
    ccp.definition_override,
    ccp.policy_level,
    ccp.scope_type,
    ccp.scope_ref
  FROM candidates ccp
  WHERE ccp.policy_level <> 'forbidden'
  ORDER BY ccp.scope_priority ASC, ccp.specificity_score DESC, ccp.updated_at DESC
  LIMIT 1
)
SELECT *
FROM top_scope_forbidden
UNION ALL
SELECT *
FROM best_allowed
WHERE NOT EXISTS (SELECT 1 FROM top_scope_forbidden)
LIMIT 1;
$$;

COMMENT ON FUNCTION public.resolve_term(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) IS
'Resolve term by scope priority with forbidden hard-stop. Returns 0 rows when unresolved.';

GRANT EXECUTE ON FUNCTION public.resolve_term(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO dws_backend;

COMMIT;
