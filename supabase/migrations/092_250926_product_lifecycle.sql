-- Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=price-list-a5-campaign Date=2026-09-25
-- Audit trail: git log -- supabase/migrations/092_250926_product_lifecycle.sql
-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-2107
-- Branch: claude/price-list-a5-campaign
-- Date: 2026-09-25
-- Owner: DWS Platform / AI Agent
-- ============================================================================
-- Product lifecycle registry (TRUTH row 43, ONTOLOGY.md §17.3). HIC 25.09.2026: "IDs has to be
-- on truth registry with retired to future unpublished products. The lifecycle state of a
-- product with decision evidence has to be found there. Make own md and later supabase db".
--
-- One row per product ID (product_lifecycle) plus one row per evidence item
-- (product_lifecycle_evidence). Rows are loaded from config/truth/product-lifecycle.json by
-- scripts/truth/product-lifecycle-to-supabase.mjs; the repo JSON stays the source, the table
-- is its queryable copy. Internal data (BLUE records): no read policy for anon or
-- authenticated yet; service_role writes and reads. Add a read policy when a dashboard needs it.
-- Additive, no existing object touched. Applying is RED (HIC).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.product_lifecycle (
  product_id      TEXT PRIMARY KEY,
  name            TEXT NOT NULL DEFAULT '',
  state           TEXT NOT NULL CHECK (state IN (
                    'planned', 'page-only', 'internal', 'published',
                    'archived', 'discontinued', 'removed')),
  state_source    TEXT NOT NULL DEFAULT '',
  record_version  INT,          -- vN: Nth distinct catalogue-record content on main
  record_last_changed DATE,
  record_last_commit  TEXT,
  page            TEXT,         -- dws10.com/products/<slug>.html
  page_versions   INT,          -- commits on main that changed the page (all languages)
  catalog_version TEXT,
  loaded_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.product_lifecycle IS
  'Every DWS product ID from planned to retired with its lifecycle state. Source: config/truth/product-lifecycle.json (TRUTH row 43).';

CREATE TABLE IF NOT EXISTS public.product_lifecycle_evidence (
  id              BIGSERIAL PRIMARY KEY,
  product_id      TEXT NOT NULL REFERENCES public.product_lifecycle(product_id) ON DELETE CASCADE,
  kind            TEXT NOT NULL CHECK (kind IN ('decision', 'git', 'catalogue', 'page')),
  evidence_date   DATE,
  ref             TEXT NOT NULL DEFAULT '',
  text            TEXT NOT NULL DEFAULT '',
  evidence_hash   TEXT GENERATED ALWAYS AS (
                    md5(product_id || '|' || kind || '|' || ref || '|' || text)) STORED,
  loaded_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_lifecycle_evidence_unique UNIQUE (evidence_hash)
);

COMMENT ON TABLE public.product_lifecycle_evidence IS
  'Decision evidence per product ID: HIC decisions (ledger), git commits, catalogue fields, product pages.';

CREATE INDEX IF NOT EXISTS product_lifecycle_state_idx
  ON public.product_lifecycle (state);
CREATE INDEX IF NOT EXISTS product_lifecycle_evidence_product_idx
  ON public.product_lifecycle_evidence (product_id, evidence_date);

-- === Standard grants for a new public table (Firehorse/supabase-schema-templates.sql) ===
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_lifecycle
  TO authenticated, service_role;
ALTER TABLE public.product_lifecycle ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_lifecycle_evidence
  TO authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.product_lifecycle_evidence_id_seq
  TO authenticated, service_role;
ALTER TABLE public.product_lifecycle_evidence ENABLE ROW LEVEL SECURITY;
-- No policies: with RLS on and no policy, authenticated users see no rows.
-- service_role bypasses RLS and is the only writer (loader script).
