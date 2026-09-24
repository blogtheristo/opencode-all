-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-2091
-- Branch: claude/loving-einstein-fkjj4b
-- Date: 2026-09-24
-- Owner: DWS Platform / AI Agent
-- Evidence: Tool=Claude Code Agent=claude Date=2026-09-24
-- Audit trail: git log -- supabase/migrations/091_240926_website_observation_summary.sql
-- ============================================================================
-- "Show me, not trust me" (LD-2026-09-007 round 5, HIC 24.09.2026). Aggregates stored
-- observations per industry/path so DISCOVER can show what the ontology knows, what it
-- does not, and what organisations typically do next. Counts only, no free text, no PII.
-- A minimum of 5 cases (p_min) is enforced inside the function: below that the summary
-- says so instead of showing numbers — the page never fabricates evidence.
-- Reviewed: HIC (APPLY LD-2026-09-007, 24.09.2026). Additive. Applying is RED.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.website_observation_summary(
  p_industry TEXT DEFAULT NULL,
  p_path     TEXT DEFAULT NULL,
  p_min      INT  DEFAULT 5
) RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
WITH scope AS (
  SELECT observation_id,
         MAX(industry) FILTER (WHERE industry IS NOT NULL)          AS industry,
         MAX(path_key) FILTER (WHERE path_key IS NOT NULL)          AS path_key,
         MAX(ownership_map::text) FILTER (WHERE event = 'ownership')::jsonb AS ownership,
         MAX(recommended_sku) FILTER (WHERE event = 'selected')     AS recommended_sku,
         BOOL_OR(event = 'query')                                   AS observed,
         BOOL_OR(event = 'path_shown')                              AS path_found
  FROM public.website_observations
  GROUP BY observation_id
), cases AS (
  SELECT * FROM scope
  WHERE (p_industry IS NULL OR industry = p_industry)
    AND (p_path IS NULL OR path_key = p_path)
), n AS (SELECT COUNT(*)::int AS total FROM cases),
patterns AS (
  SELECT COALESCE(ownership->'map'->>'owner','?') || '+' || COALESCE(ownership->'map'->>'decision','?') AS pattern,
         COUNT(*)::int AS c
  FROM cases WHERE ownership IS NOT NULL AND ownership->>'known' <> 'no'
  GROUP BY 1 ORDER BY 2 DESC LIMIT 4
), next_steps AS (
  SELECT recommended_sku AS sku, COUNT(*)::int AS c
  FROM cases WHERE recommended_sku IS NOT NULL
  GROUP BY 1 ORDER BY 2 DESC LIMIT 3
)
SELECT jsonb_build_object(
  'industry', p_industry, 'path', p_path, 'min', p_min,
  'similar_cases', (SELECT total FROM n),
  'sufficient', (SELECT total FROM n) >= p_min,
  'problems_observed',     (SELECT COUNT(*) FROM cases WHERE observed),
  'ownership_unclear',     (SELECT COUNT(*) FROM cases WHERE ownership->>'known' = 'no'),
  'decision_maker_known',  (SELECT COUNT(*) FROM cases WHERE ownership->'map'->>'decision' IS NOT NULL AND ownership->'map'->>'decision' <> 'unknown'),
  'path_identified',       (SELECT COUNT(*) FROM cases WHERE path_found),
  'ownership_patterns', CASE WHEN (SELECT total FROM n) >= p_min
      THEN COALESCE((SELECT jsonb_agg(jsonb_build_object('pattern', pattern, 'count', c)) FROM patterns), '[]'::jsonb) ELSE '[]'::jsonb END,
  'next_steps', CASE WHEN (SELECT total FROM n) >= p_min
      THEN COALESCE((SELECT jsonb_agg(jsonb_build_object('sku', sku, 'count', c)) FROM next_steps), '[]'::jsonb) ELSE '[]'::jsonb END,
  'generated_at', now()
);
$$;

REVOKE ALL ON FUNCTION public.website_observation_summary(TEXT, TEXT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.website_observation_summary(TEXT, TEXT, INT) TO service_role, authenticated;

COMMENT ON FUNCTION public.website_observation_summary(TEXT, TEXT, INT) IS
  'DISCOVER evidence panel: aggregate counts per industry/path (similar cases, ownership patterns owner+decision, typical next steps, DISCOVER counters). Enforces a minimum case count; no free text, no PII.';
