# DWS Search Architecture — Upstash + Supabase + Cloudflare Worker

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: elated-zhukovsky | Date: 07.02.2026 | Changes: Initial creation - unified document search architecture

Session Links & References:
  - Claude Code (elated-zhukovsky): https://github.com/blogtheristo/dws6/commits/elated-zhukovsky
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/elated-zhukovsky/docs/architecture/SEARCH_ARCHITECTURE.md

Document Status:
  - Created: 07.02.2026
  - Last Modified: 07.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: DRAFT

***

## 1. Problem

DWS6 has 100+ documents (admin manuals, architecture docs, field notes, product docs, standards) across multiple folders and sites. There is no unified search — finding information requires knowing which folder to look in.

## 2. Solution Overview

A keyword search API backed by three layers:

```
┌─────────────────────────────────────────────────────┐
│  Client (Dashboard, CLI, Landing Pages)             │
│  GET api.dws10.com/search?q=revolut+payments        │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────────┐
│  Cloudflare Worker — search-worker.ts               │
│  Route: api.dws10.com/search                        │
│  • Input validation (Zod)                           │
│  • Rate limiting (KV)                               │
│  • Query → Upstash Redis search                     │
│  • Format + return results                          │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS (REST)
┌──────────────────▼──────────────────────────────────┐
│  Upstash Redis                                      │
│  • Hash-based document index (search:doc:{id})      │
│  • Sorted sets for tag lookups (search:tag:{tag})   │
│  • Sorted sets for category (search:cat:{cat})      │
│  • Client-side keyword matching on title/desc/tags  │
└──────────────────┬──────────────────────────────────┘
                   │ Sync pipeline (scheduled)
┌──────────────────▼──────────────────────────────────┐
│  Supabase — file_index table                        │
│  • Source of truth for all document metadata         │
│  • Updated by CI/CD or manual sync script            │
│  • Triggers Upstash re-index on changes              │
└─────────────────────────────────────────────────────┘
```

## 3. Supabase file_index Table

New migration creates the source-of-truth document registry.

```sql
-- Migration: xxx_file_index.sql

CREATE TABLE IF NOT EXISTS file_index (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  title         TEXT NOT NULL,                    -- "Admin Manual"
  slug          TEXT NOT NULL UNIQUE,             -- "admin-manual"
  path          TEXT NOT NULL,                    -- "/Admin/ADMIN_MANUAL.md"

  -- Classification
  category      TEXT NOT NULL,                    -- "admin", "architecture", "field-notes", etc.
  tags          TEXT[] DEFAULT '{}',              -- ["supabase", "auth", "security"]
  language      TEXT DEFAULT 'en',                -- ISO 639-1

  -- Content summary
  description   TEXT,                             -- Short description for search results

  -- Status
  status        TEXT DEFAULT 'ACTIVE'             -- ACTIVE, DRAFT, ARCHIVED, DEPRECATED
    CHECK (status IN ('ACTIVE', 'DRAFT', 'ARCHIVED', 'DEPRECATED')),
  version       TEXT,                             -- "1.4"

  -- URLs
  github_url    TEXT,                             -- Direct GitHub link
  site_url      TEXT,                             -- Public-facing URL if any

  -- Timestamps
  doc_created   TIMESTAMPTZ,                      -- When the doc was first written
  doc_modified  TIMESTAMPTZ,                      -- When the doc was last modified
  created_at    TIMESTAMPTZ DEFAULT NOW(),         -- Row creation
  updated_at    TIMESTAMPTZ DEFAULT NOW(),         -- Row update

  -- Search optimization
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(category, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C')
  ) STORED
);

-- Indexes
CREATE INDEX idx_file_index_search ON file_index USING GIN(search_vector);
CREATE INDEX idx_file_index_category ON file_index(category);
CREATE INDEX idx_file_index_status ON file_index(status);
CREATE INDEX idx_file_index_tags ON file_index USING GIN(tags);
CREATE INDEX idx_file_index_slug ON file_index(slug);
CREATE INDEX idx_file_index_updated ON file_index(updated_at DESC);

-- Auto-update timestamp
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

-- RLS (public read, authenticated write)
ALTER TABLE file_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY file_index_public_read ON file_index
  FOR SELECT USING (status != 'DEPRECATED');

CREATE POLICY file_index_auth_write ON file_index
  FOR ALL USING (auth.role() = 'authenticated');
```

**Categories** (matching Document-index.md):

| Category | Description | Example Docs |
|----------|-------------|-------------|
| `admin` | Admin manuals | ADMIN_MANUAL.md |
| `architecture` | Technical blueprints | 00-MASTER-BLUEPRINT.md |
| `field-notes` | LWM knowledge capture | 2026-01-21-karp-*.md |
| `firehorse` | Product suite docs | Omnichannel, Reports |
| `standards` | Coding/doc standards | DWS_DOCUMENT_STANDARD.md |
| `security` | Security & compliance | SECURITY_COMPLIANCE.md |
| `agents` | AI agent docs | Agent tracking |
| `devops` | CI/CD, deployment | Docker, Cloudflare guides |
| `thesis` | Academic docs | Master thesis |
| `store` | DWS10 store docs | Store admin, payments |
| `config` | Environment setup | .env guides |

## 4. Upstash Redis Index Schema

Using Upstash REST API (same pattern as existing `upstash-redis.service.ts`). No RedisSearch module needed — we use a simpler approach.

### Key Structure

```
search:doc:{slug}          → Hash  (full document metadata)
search:cat:{category}      → Sorted Set (slug → score by recency)
search:tag:{tag}           → Sorted Set (slug → score by recency)
search:all                 → Sorted Set (all slugs → score by recency)
search:meta:last_sync      → String (ISO timestamp of last sync)
search:meta:doc_count      → String (total document count)
```

### Document Hash Fields

```
search:doc:admin-manual → {
  title:       "Admin Manual",
  slug:        "admin-manual",
  path:        "/Admin/ADMIN_MANUAL.md",
  category:    "admin",
  tags:        "supabase,auth,deployment",  // comma-separated for Redis
  description: "Master admin manual for DWS IQ 6 platform",
  status:      "ACTIVE",
  version:     "2.1",
  language:    "en",
  github_url:  "https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL.md",
  doc_modified: "2026-02-07T00:00:00Z",
  indexed_at:  "2026-02-07T12:00:00Z"
}
```

### Search Strategy (Client-Side Filtering)

Since Upstash free tier doesn't include RedisSearch, we use a **scan + filter** approach:

1. **Category/tag lookup** — Use sorted sets to narrow candidates
2. **Keyword match** — Fetch candidate doc hashes, match `title`/`description`/`tags` client-side
3. **Scoring** — Rank by match quality (title > description > tags) + recency

For the expected document count (~100-200), this is fast enough (<50ms). If the index grows beyond 1000 docs, we'd upgrade to RedisSearch or switch to Supabase full-text search directly.

## 5. Cloudflare Worker — search-worker.ts

### Endpoint Design

```
GET api.dws10.com/search?q={query}&category={category}&tag={tag}&status={status}&limit={limit}
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | required | Search query (1-200 chars) |
| `category` | string | all | Filter by category |
| `tag` | string | all | Filter by tag |
| `status` | string | ACTIVE | Filter by status |
| `limit` | number | 20 | Max results (1-50) |
| `lang` | string | all | Filter by language |

### Response Format

```json
{
  "query": "revolut payments",
  "results": [
    {
      "title": "DWS10 Store Payments",
      "slug": "dws10-store-payments",
      "path": "/Admin/ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md",
      "category": "admin",
      "tags": ["revolut", "payments", "web-sdk"],
      "description": "Revolut Web SDK store payment integration guide",
      "status": "ACTIVE",
      "version": "1.0",
      "github_url": "https://github.com/blogtheristo/dws6/...",
      "doc_modified": "2026-02-06",
      "score": 0.95
    }
  ],
  "total": 1,
  "took_ms": 12,
  "filters": {
    "category": null,
    "tag": null,
    "status": "ACTIVE"
  }
}
```

### Worker Env Bindings

```toml
# wrangler.toml addition
[env.production]
name = "dws-search-worker"
route = "api.dws10.com/search*"

[env.production.vars]
UPSTASH_REDIS_REST_URL = ""      # Set via secrets
UPSTASH_REDIS_REST_TOKEN = ""    # Set via secrets
SUPABASE_URL = ""                # For sync endpoint
SUPABASE_SERVICE_KEY = ""        # For sync endpoint

[[env.production.kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "xxx"
```

### Worker Architecture

```typescript
// Pseudocode structure
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 1. CORS preflight
    // 2. Route: GET /search → handleSearch()
    // 3. Route: POST /sync  → handleSync() (API-key protected)
    // 4. Route: GET /health → healthCheck()
  }
}

async function handleSearch(params, env): Promise<SearchResponse> {
  // 1. Validate input (q required, 1-200 chars)
  // 2. Rate limit check (100 req/min per IP)
  // 3. If category or tag filter → fetch candidates from sorted set
  //    Else → fetch all slugs from search:all
  // 4. Fetch doc hashes for candidates (pipelined)
  // 5. Score each doc against query terms
  // 6. Sort by score DESC, apply limit
  // 7. Return results
}

async function handleSync(env): Promise<void> {
  // 1. Verify API key
  // 2. Fetch all rows from Supabase file_index
  // 3. Pipeline: write each doc as hash + add to sorted sets
  // 4. Update search:meta:last_sync
}
```

## 6. Sync Pipeline

### How Documents Get Indexed

```
Document Created/Updated
        │
        ▼
  ┌─────────────────┐
  │  Option A:       │     Option B:           Option C:
  │  Manual script   │     Supabase webhook     CI/CD on merge
  │  sync-index.ts   │     → Worker /sync       → Worker /sync
  └────────┬────────┘
           ▼
  Supabase file_index (INSERT/UPDATE)
           │
           ▼
  POST api.dws10.com/sync (API-key auth)
           │
           ▼
  Worker fetches file_index → writes to Upstash Redis
```

### Initial Population Script

A Node.js script that reads Document-index.md + scans the repo to populate Supabase:

```
scripts/sync-file-index.ts
  1. Parse docs/Document-index.md tables
  2. Scan known folders for .md files
  3. Extract title, path, category from each
  4. Upsert into Supabase file_index
  5. Trigger POST /sync to rebuild Upstash index
```

## 7. Security

| Concern | Mitigation |
|---------|-----------|
| Search injection | Zod validation: `q` is 1-200 chars, alphanumeric + spaces only |
| Rate limiting | 100 req/min per IP via KV (same pattern as mcp-gateway.ts) |
| Sync endpoint | API key required (X-API-Key header), not publicly callable |
| Data exposure | Only metadata is indexed — no document content, no secrets |
| CORS | Allow `*.dws10.com`, `*.dws6.com`, `*.onelifetime.world` |
| Redis keys | Prefixed with `search:` — isolated from auth/session keys |

## 8. Cost Analysis

| Component | Free Tier | Expected Usage | Cost |
|-----------|-----------|---------------|------|
| Upstash Redis | 10K commands/day | ~500 search queries/day + sync | Free |
| Cloudflare Worker | 100K req/day | ~500 searches/day | Free |
| Supabase | 500MB, 50K rows | ~200 rows in file_index | Free |

**Total: $0/month** for current scale. Upstash pay-as-you-go kicks in at ~$0.20/100K commands if exceeded.

## 9. Implementation Plan

### Phase 1 — Foundation (this PR)

1. **Supabase migration** — Create `file_index` table
2. **Sync script** — `scripts/sync-file-index.ts` to populate from Document-index.md
3. **Cloudflare Worker** — `src/cloudflare/search-worker.ts` with search + sync endpoints
4. **Wrangler config** — Route `api.dws10.com/search*`

### Phase 2 — Enrichment (future)

5. AI-generated descriptions for docs missing them
6. Dashboard search widget in v9-react
7. CLI search command (`dws search "revolut"`)

### Phase 3 — Full-Text (future, if needed)

8. Extract document content → index in Upstash or switch to Supabase full-text search
9. Vector search with pgvector for semantic queries

## 10. Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/migrations/0xx_file_index.sql` | CREATE | file_index table migration |
| `src/cloudflare/search-worker.ts` | CREATE | Search API worker |
| `scripts/sync-file-index.ts` | CREATE | Supabase population script |
| `src/cloudflare/wrangler.toml` | MODIFY | Add search worker route |
| `docs/Document-index.md` | NO CHANGE | Already serves as input data |

## 11. Integration Points

### Existing Patterns Reused

- **Upstash client**: Same `@upstash/redis` REST pattern as `src/services/upstash-redis.service.ts`
- **Worker structure**: Same `Env` interface + CORS + rate limiting as `src/cloudflare/mcp-gateway.ts`
- **Key prefixes**: New `search:` prefix, isolated from existing `token:`, `cache:`, `ratelimit:` prefixes
- **Supabase patterns**: Same tsvector approach as `People/supabase-people-schema.sql`

### Environment Variables Needed

```env
# Already exist:
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...

# New:
SEARCH_SYNC_API_KEY=...          # For /sync endpoint auth
```
