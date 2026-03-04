/**
 * DWS Search Worker
 *
 * Cloudflare Worker that provides unified document search across all DWS6
 * documentation via Upstash Redis. Also exposes a /sync endpoint to rebuild
 * the Redis index from Supabase file_index.
 *
 * Endpoints:
 *   GET  /search?q=...&category=...&tag=...&status=...&limit=...&lang=...
 *   POST /sync          (API-key protected — rebuilds Redis index from Supabase)
 *   GET  /health
 *
 * @module cloudflare/search-worker
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 * @see docs/architecture/SEARCH_ARCHITECTURE.md
 */

// ============================================================================
// Types
// ============================================================================

export interface Env {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  SEARCH_SYNC_API_KEY: string;
  RATE_LIMIT_KV: KVNamespace;
}

interface DocRecord {
  title: string;
  slug: string;
  path: string;
  category: string;
  tags: string;          // comma-separated in Redis
  description: string;
  status: string;
  version: string;
  language: string;
  github_url: string;
  doc_modified: string;
  indexed_at: string;
}

interface SearchResult {
  title: string;
  slug: string;
  path: string;
  category: string;
  tags: string[];
  description: string | null;
  status: string;
  version: string | null;
  language: string;
  github_url: string | null;
  doc_modified: string | null;
  score: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  took_ms: number;
  filters: {
    category: string | null;
    tag: string | null;
    status: string;
    lang: string | null;
  };
}

interface SupabaseDoc {
  slug: string;
  title: string;
  path: string;
  category: string;
  tags: string[] | null;
  description: string | null;
  status: string;
  version: string | null;
  language: string;
  github_url: string | null;
  doc_modified: string | null;
}

// ============================================================================
// Constants
// ============================================================================

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400',
};

const PREFIX = 'search:';
const MAX_QUERY_LENGTH = 200;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const RATE_LIMIT_PER_MIN = 100;

// ============================================================================
// Upstash Redis REST helpers
// ============================================================================

async function redis(
  env: Env,
  command: string[]
): Promise<unknown> {
  const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!res.ok) {
    const details = await res.text();
    console.error(`Upstash error ${res.status}: ${details}`);
    throw new Error(`Redis operation failed (status ${res.status})`);
  }

  const data = await res.json() as { result: unknown };
  return data.result;
}

/** Pipeline: send multiple commands in one HTTP request */
async function redisPipeline(
  env: Env,
  commands: string[][]
): Promise<unknown[]> {
  const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    const details = await res.text();
    console.error(`Upstash pipeline error ${res.status}: ${details}`);
    throw new Error(`Redis pipeline operation failed (status ${res.status})`);
  }

  const data = await res.json() as { result: unknown }[];
  return data.map((d) => d.result);
}

// ============================================================================
// Input validation
// ============================================================================

function validateSearchParams(url: URL): {
  q: string;
  category: string | null;
  tag: string | null;
  status: string;
  limit: number;
  lang: string | null;
} | { error: string } {
  const q = (url.searchParams.get('q') || '').trim();
  if (!q) {
    return { error: 'Missing required parameter: q' };
  }
  if (q.length > MAX_QUERY_LENGTH) {
    return { error: `Query too long (max ${MAX_QUERY_LENGTH} chars)` };
  }
  // Allow alphanumeric (ASCII), spaces, hyphens, dots, underscores, plus selected accented chars
  if (!/^[A-Za-z0-9 _.\-äöåÄÖÅéèêëüïôàùûçñ]+$/u.test(q)) {
    return { error: 'Query contains invalid characters' };
  }

  const limitStr = url.searchParams.get('limit');
  let limit = DEFAULT_LIMIT;
  if (limitStr) {
    limit = parseInt(limitStr, 10);
    if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  }

  return {
    q,
    category: url.searchParams.get('category') || null,
    tag: url.searchParams.get('tag') || null,
    status: url.searchParams.get('status') || 'ACTIVE',
    limit,
    lang: url.searchParams.get('lang') || null,
  };
}

// ============================================================================
// Rate limiting (KV-based, same pattern as mcp-gateway.ts)
// ============================================================================

async function checkRateLimit(
  kv: KVNamespace,
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `search-rl:${ip}`;
  const now = Date.now();
  const windowMs = 60_000;

  const stored = await kv.get(key, 'json') as {
    count: number;
    windowStart: number;
  } | null;

  if (!stored || now - stored.windowStart >= windowMs) {
    await kv.put(key, JSON.stringify({ count: 1, windowStart: now }), {
      expirationTtl: 120,
    });
    return { allowed: true, remaining: RATE_LIMIT_PER_MIN - 1 };
  }

  if (stored.count >= RATE_LIMIT_PER_MIN) {
    return { allowed: false, remaining: 0 };
  }

  await kv.put(
    key,
    JSON.stringify({ count: stored.count + 1, windowStart: stored.windowStart }),
    { expirationTtl: 120 }
  );
  return { allowed: true, remaining: RATE_LIMIT_PER_MIN - stored.count - 1 };
}

// ============================================================================
// Search logic
// ============================================================================

/**
 * Score a document against search query terms.
 * title match = 3, description match = 2, tags/category match = 1
 */
function scoreDoc(doc: DocRecord, terms: string[]): number {
  let score = 0;
  const titleLower = (doc.title || '').toLowerCase();
  const descLower = (doc.description || '').toLowerCase();
  const tagsLower = (doc.tags || '').toLowerCase();
  const catLower = (doc.category || '').toLowerCase();

  for (const term of terms) {
    if (titleLower.includes(term)) score += 3;
    if (descLower.includes(term)) score += 2;
    if (tagsLower.includes(term)) score += 1;
    if (catLower.includes(term)) score += 1;
  }

  // Normalize to 0-1 range (max possible = terms.length * 7)
  const maxScore = terms.length * 7;
  return maxScore > 0 ? Math.round((score / maxScore) * 100) / 100 : 0;
}

async function handleSearch(
  url: URL,
  env: Env
): Promise<Response> {
  const params = validateSearchParams(url);
  if ('error' in params) {
    return jsonResponse({ error: params.error }, 400);
  }

  const startTime = Date.now();
  const terms = params.q.toLowerCase().split(/\s+/).filter(Boolean);

  // Step 1: Get candidate slugs
  let slugs: string[];

  if (params.category) {
    // Narrow by category
    slugs = (await redis(env, [
      'ZREVRANGE',
      `${PREFIX}cat:${params.category}`,
      '0',
      '-1',
    ])) as string[] || [];
  } else if (params.tag) {
    // Narrow by tag
    slugs = (await redis(env, [
      'ZREVRANGE',
      `${PREFIX}tag:${params.tag}`,
      '0',
      '-1',
    ])) as string[] || [];
  } else {
    // All documents
    slugs = (await redis(env, [
      'ZREVRANGE',
      `${PREFIX}all`,
      '0',
      '-1',
    ])) as string[] || [];
  }

  if (slugs.length === 0) {
    return jsonResponse({
      query: params.q,
      results: [],
      total: 0,
      took_ms: Date.now() - startTime,
      filters: {
        category: params.category,
        tag: params.tag,
        status: params.status,
        lang: params.lang,
      },
    } satisfies SearchResponse);
  }

  // Step 2: Fetch all candidate docs in one pipeline
  const fetchCmds = slugs.map((slug) => ['HGETALL', `${PREFIX}doc:${slug}`]);
  const rawDocs = await redisPipeline(env, fetchCmds);

  // Step 3: Parse hash arrays into objects, filter, score
  const results: SearchResult[] = [];

  for (const raw of rawDocs) {
    if (!raw || !Array.isArray(raw) || raw.length === 0) continue;

    // HGETALL returns [field, value, field, value, ...]
    const doc: Record<string, string> = {};
    for (let i = 0; i < raw.length; i += 2) {
      doc[raw[i] as string] = raw[i + 1] as string;
    }

    const record = doc as unknown as DocRecord;

    // Filter by status
    if (record.status !== params.status) continue;

    // Filter by language
    if (params.lang && record.language !== params.lang) continue;

    // Filter by tag (secondary — if category was the primary filter)
    if (params.tag && params.category) {
      const docTags = (record.tags || '').split(',');
      if (!docTags.includes(params.tag)) continue;
    }

    // Score against query
    const score = scoreDoc(record, terms);
    if (score === 0) continue;

    results.push({
      title: record.title,
      slug: record.slug,
      path: record.path,
      category: record.category,
      tags: (record.tags || '').split(',').filter(Boolean),
      description: record.description || null,
      status: record.status,
      version: record.version || null,
      language: record.language || 'en',
      github_url: record.github_url || null,
      doc_modified: record.doc_modified || null,
      score,
    });
  }

  // Sort by score descending, then by doc_modified descending
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aDate = a.doc_modified || '';
    const bDate = b.doc_modified || '';
    return bDate.localeCompare(aDate);
  });

  // Apply limit
  const limited = results.slice(0, params.limit);

  return jsonResponse({
    query: params.q,
    results: limited,
    total: results.length,
    took_ms: Date.now() - startTime,
    filters: {
      category: params.category,
      tag: params.tag,
      status: params.status,
      lang: params.lang,
    },
  } satisfies SearchResponse);
}

// ============================================================================
// Sync: Supabase → Upstash Redis
// ============================================================================

async function handleSync(
  request: Request,
  env: Env
): Promise<Response> {
  // Verify API key
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey || apiKey !== env.SEARCH_SYNC_API_KEY) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }

  const startTime = Date.now();

  // 1. Fetch all rows from Supabase file_index
  const sbRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/file_index?select=slug,title,path,category,tags,description,status,version,language,github_url,doc_modified&order=doc_modified.desc.nullslast`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!sbRes.ok) {
    return jsonResponse(
      { error: `Supabase fetch failed: ${sbRes.status}` },
      502
    );
  }

  const docs = (await sbRes.json()) as SupabaseDoc[];

  if (docs.length === 0) {
    return jsonResponse({ synced: 0, took_ms: Date.now() - startTime });
  }

  // 2. Build pipeline commands
  const now = new Date().toISOString();
  const commands: string[][] = [];

  // Clear old sorted sets (rebuild fresh)
  commands.push(['DEL', `${PREFIX}all`]);

  // Collect categories and tags to clear
  const cats = new Set<string>();
  const tags = new Set<string>();
  for (const doc of docs) {
    cats.add(doc.category);
    if (doc.tags) {
      for (const t of doc.tags) tags.add(t);
    }
  }
  for (const cat of cats) commands.push(['DEL', `${PREFIX}cat:${cat}`]);
  for (const tag of tags) commands.push(['DEL', `${PREFIX}tag:${tag}`]);

  // Write each document
  for (const doc of docs) {
    const tagsStr = (doc.tags || []).join(',');
    const score = doc.doc_modified
      ? new Date(doc.doc_modified).getTime()
      : 0;

    // Hash with all fields
    commands.push([
      'HSET',
      `${PREFIX}doc:${doc.slug}`,
      'title', doc.title,
      'slug', doc.slug,
      'path', doc.path,
      'category', doc.category,
      'tags', tagsStr,
      'description', doc.description || '',
      'status', doc.status || 'ACTIVE',
      'version', doc.version || '',
      'language', doc.language || 'en',
      'github_url', doc.github_url || '',
      'doc_modified', doc.doc_modified || '',
      'indexed_at', now,
    ]);

    // Add to global sorted set (score = timestamp for recency)
    commands.push(['ZADD', `${PREFIX}all`, String(score), doc.slug]);

    // Add to category sorted set
    commands.push([
      'ZADD',
      `${PREFIX}cat:${doc.category}`,
      String(score),
      doc.slug,
    ]);

    // Add to tag sorted sets
    for (const t of doc.tags || []) {
      commands.push(['ZADD', `${PREFIX}tag:${t}`, String(score), doc.slug]);
    }
  }

  // Update metadata
  commands.push(['SET', `${PREFIX}meta:last_sync`, now]);
  commands.push(['SET', `${PREFIX}meta:doc_count`, String(docs.length)]);

  // 3. Execute pipeline atomically to avoid partial index states during sync
  if (commands.length > 0 && commands[0][0] !== 'MULTI') {
    // Prepend MULTI and append EXEC to wrap the sync in a single transaction.
    commands.unshift(['MULTI']);
    commands.push(['EXEC']);
  }
  await redisPipeline(env, commands);

  return jsonResponse({
    synced: docs.length,
    categories: cats.size,
    tags: tags.size,
    took_ms: Date.now() - startTime,
  });
}

// ============================================================================
// Health check
// ============================================================================

async function handleHealth(env: Env): Promise<Response> {
  let redisOk = false;
  let docCount = '0';

  try {
    const pong = await redis(env, ['PING']);
    redisOk = pong === 'PONG';
    const count = await redis(env, ['GET', `${PREFIX}meta:doc_count`]);
    docCount = (count as string) || '0';
  } catch {
    // Redis unreachable
  }

  return jsonResponse({
    status: redisOk ? 'healthy' : 'degraded',
    service: 'dws-search-worker',
    version: '1.0.0',
    redis: redisOk,
    indexed_docs: parseInt(docCount, 10),
    timestamp: new Date().toISOString(),
  });
}

// ============================================================================
// Helpers
// ============================================================================

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
      'Cache-Control': status === 200 ? 'public, max-age=30' : 'no-cache',
    },
  });
}

// ============================================================================
// Main handler
// ============================================================================

export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Health check
    if (path === '/health') {
      return handleHealth(env);
    }

    // Search endpoint
    if (path === '/search' && request.method === 'GET') {
      // Rate limit
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rl = await checkRateLimit(env.RATE_LIMIT_KV, ip);
      if (!rl.allowed) {
        return jsonResponse({ error: 'Rate limit exceeded' }, 429);
      }

      return handleSearch(url, env);
    }

    // Sync endpoint
    if (path === '/sync' && request.method === 'POST') {
      return handleSync(request, env);
    }

    // Not found
    return jsonResponse({ error: 'Not found', endpoints: ['/search', '/sync', '/health'] }, 404);
  },
};
