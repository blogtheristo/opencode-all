-- File Index — Unified document search registry
-- Source of truth for all DWS6 document metadata
-- Syncs to Upstash Redis for edge search via Cloudflare Worker
--
-- Architecture: docs/architecture/SEARCH_ARCHITECTURE.md

-- ============================================================
-- FILE_INDEX TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS file_index (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  path          TEXT NOT NULL,

  -- Classification
  category      TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  language      TEXT DEFAULT 'en',

  -- Content summary
  description   TEXT,

  -- Status
  status        TEXT DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'DRAFT', 'ARCHIVED', 'DEPRECATED')),
  version       TEXT,

  -- URLs
  github_url    TEXT,
  site_url      TEXT,

  -- Timestamps
  doc_created   TIMESTAMPTZ,
  doc_modified  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Full-text search (weighted: title > description > category/tags)
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_file_index_search ON file_index USING GIN(search_vector);
CREATE INDEX idx_file_index_category ON file_index(category);
CREATE INDEX idx_file_index_status ON file_index(status);
CREATE INDEX idx_file_index_tags ON file_index USING GIN(tags);
CREATE INDEX idx_file_index_slug ON file_index(slug);
CREATE INDEX idx_file_index_updated ON file_index(updated_at DESC);

-- ============================================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_file_index_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_file_index_updated
  BEFORE UPDATE ON file_index
  FOR EACH ROW
  EXECUTE FUNCTION update_file_index_timestamp();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public read (non-deprecated), service role write
-- ============================================================
ALTER TABLE file_index ENABLE ROW LEVEL SECURITY;

-- Anon can read only ACTIVE docs; authenticated can read all non-DEPRECATED docs
CREATE POLICY "Public anon read access to active_file_index"
  ON file_index
  FOR SELECT
  TO anon
  USING (status = 'ACTIVE');

CREATE POLICY "Public authenticated read access to file_index"
  ON file_index
  FOR SELECT
  TO authenticated
  USING (status != 'DEPRECATED');

-- Service role has full access (for sync scripts)
CREATE POLICY "Service role full access to file_index"
  ON file_index
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- HELPER: Upsert a document by slug
-- Used by sync scripts to insert-or-update documents atomically
-- ============================================================
CREATE OR REPLACE FUNCTION upsert_file_index(
  p_title TEXT,
  p_slug TEXT,
  p_path TEXT,
  p_category TEXT,
  p_tags TEXT[],
  p_language TEXT DEFAULT 'en',
  p_description TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'ACTIVE',
  p_version TEXT DEFAULT NULL,
  p_github_url TEXT DEFAULT NULL,
  p_site_url TEXT DEFAULT NULL,
  p_doc_modified TIMESTAMPTZ DEFAULT NULL
)
RETURNS file_index
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result file_index;
BEGIN
  INSERT INTO file_index (
    title, slug, path, category, tags, language,
    description, status, version, github_url, site_url,
    doc_created, doc_modified
  )
  VALUES (
    p_title, p_slug, p_path, p_category, p_tags, p_language,
    p_description, p_status, p_version, p_github_url, p_site_url,
    COALESCE(p_doc_modified, NOW()), p_doc_modified
  )
  ON CONFLICT (slug)
  DO UPDATE SET
    title = EXCLUDED.title,
    path = EXCLUDED.path,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    language = EXCLUDED.language,
    description = COALESCE(EXCLUDED.description, file_index.description),
    status = EXCLUDED.status,
    version = EXCLUDED.version,
    github_url = EXCLUDED.github_url,
    site_url = EXCLUDED.site_url,
    doc_modified = EXCLUDED.doc_modified,
    updated_at = NOW()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE file_index IS 'Unified document metadata registry. Source of truth for search indexing via Upstash Redis + Cloudflare Worker.';
COMMENT ON COLUMN file_index.slug IS 'URL-safe unique identifier, e.g. admin-manual';
COMMENT ON COLUMN file_index.category IS 'Document category: admin, architecture, field-notes, firehorse, standards, security, agents, devops, thesis, store, config, sales, mcp, industry, reports, misc';
COMMENT ON COLUMN file_index.tags IS 'Array of keyword tags for filtering and search';
COMMENT ON COLUMN file_index.search_vector IS 'Auto-generated tsvector for PostgreSQL full-text search (weighted: title=A, description=B, category/tags=C)';
COMMENT ON FUNCTION upsert_file_index IS 'Atomically insert or update a file_index row by slug. Used by sync scripts.';
