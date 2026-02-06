# Redis Search Analysis for Industry Pulse

## Question

Can Redis Search be used to power the Industry Pulse feature (last30days content aggregation)?

## Short Answer

**Yes, but with caveats.** Redis Search (RediSearch module) is excellent for fast full-text search and caching, but the primary bottleneck is API calls to OpenAI/xAI for research, not search speed.

---

## Redis Search Capabilities

### What Redis Search Does Well

| Capability | Benefit for Industry Pulse |
|------------|---------------------------|
| **Full-text search** | Search across all cached insights by keyword |
| **Faceted filtering** | Filter by industry, source (Reddit/X), date range |
| **Aggregations** | Count insights per industry, engagement totals |
| **Auto-complete** | Suggest topics as user types |
| **Sub-millisecond queries** | Instant search results |
| **JSON support** | Store structured insight data natively |

### RediSearch Index Example

```redis
FT.CREATE idx:insights ON JSON
  PREFIX 1 insight:
  SCHEMA
    $.industry AS industry TAG
    $.source AS source TAG
    $.title AS title TEXT WEIGHT 2.0
    $.summary AS summary TEXT
    $.engagement.upvotes AS upvotes NUMERIC SORTABLE
    $.engagement.likes AS likes NUMERIC SORTABLE
    $.created_at AS created_at NUMERIC SORTABLE
    $.expires_at AS expires_at NUMERIC SORTABLE
```

### Query Examples

```redis
# Find all manufacturing insights with high engagement
FT.SEARCH idx:insights "@industry:{manufacturing} @upvotes:[500 +inf]" SORTBY upvotes DESC LIMIT 0 5

# Full-text search across all industries
FT.SEARCH idx:insights "CBAM compliance steel" RETURN 3 title summary source

# Get insights expiring soon (for refresh scheduling)
FT.SEARCH idx:insights "@expires_at:[0 1707264000]" RETURN 2 industry title
```

---

## Architecture Comparison

### Option A: Supabase Only (Current Plan)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ last30days  │────▶│  Supabase   │────▶│  Landing    │
│ Research    │     │  PostgreSQL │     │  Pages      │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    7-day TTL via
                    expires_at column
```

**Pros:**
- Simpler architecture (already using Supabase)
- PostgreSQL full-text search is adequate for this scale
- No additional infrastructure

**Cons:**
- Slower search than Redis (still <100ms for small datasets)
- No built-in caching layer

### Option B: Redis + Supabase (Hybrid)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ last30days  │────▶│  Supabase   │────▶│   Redis     │
│ Research    │     │ (persistent)│     │  (cache +   │
└─────────────┘     └─────────────┘     │   search)   │
                                        └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │  Landing    │
                                        │  Pages      │
                                        └─────────────┘
```

**Pros:**
- Sub-millisecond search
- Built-in TTL for cache expiration
- Can serve stale content while refreshing
- Excellent for high-traffic pages

**Cons:**
- Additional infrastructure (Redis Cloud or self-hosted)
- Data sync complexity between Supabase and Redis
- Overkill for current traffic levels

### Option C: Redis Only

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ last30days  │────▶│   Redis     │────▶│  Landing    │
│ Research    │     │  Stack      │     │  Pages      │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Pros:**
- Fastest possible reads
- Simpler than hybrid
- Redis JSON + Search is powerful

**Cons:**
- Redis is not ideal as primary data store
- Need persistence configuration (RDB/AOF)
- Lose Supabase's row-level security, auth integration

---

## Recommendation

### For Current Scale: **Option A (Supabase Only)**

The bottleneck is not search performance—it's the weekly research API calls. With ~50 insights per industry and 16 industries, you have ~800 total records. PostgreSQL handles this trivially.

```sql
-- Supabase query is fast enough
SELECT * FROM industry_insights
WHERE industry = 'manufacturing'
  AND expires_at > NOW()
ORDER BY engagement_score DESC
LIMIT 5;
```

### For Future Scale: **Option B (Hybrid)**

Add Redis when:
- Page views exceed 10K/day per industry page
- You need sub-10ms response times
- You want real-time search across all insights
- You're building an API for partners

### Redis Stack Hosting Options

| Provider | Free Tier | Paid | Notes |
|----------|-----------|------|-------|
| Redis Cloud | 30MB | $5/mo+ | Official, includes RediSearch |
| Upstash | 10K commands/day | $0.2/100K | Serverless, good for low-traffic |
| Railway | - | $5/mo | Easy deploy, includes modules |
| Self-hosted | N/A | VPS cost | Full control, more ops work |

---

## Implementation If Using Redis

### 1. Store Insight on Research Complete

```typescript
// After last30days research completes
import { createClient } from 'redis';

const redis = createClient({ url: process.env.REDIS_URL });

async function storeInsight(insight: Insight) {
    const key = `insight:${insight.industry}:${insight.id}`;

    await redis.json.set(key, '$', {
        industry: insight.industry,
        source: insight.source,
        title: insight.title,
        summary: insight.summary,
        url: insight.url,
        engagement: insight.engagement,
        created_at: Date.now(),
        expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Auto-expire the key
    await redis.expire(key, 7 * 24 * 60 * 60);
}
```

### 2. Query for Industry Page

```typescript
async function getIndustryInsights(industry: string, limit = 5) {
    const results = await redis.ft.search('idx:insights',
        `@industry:{${industry}}`,
        {
            SORTBY: { BY: 'upvotes', DIRECTION: 'DESC' },
            LIMIT: { from: 0, size: limit }
        }
    );

    return results.documents.map(doc => doc.value);
}
```

### 3. Search Across All Industries

```typescript
async function searchInsights(query: string) {
    const results = await redis.ft.search('idx:insights',
        query,
        {
            RETURN: ['title', 'summary', 'industry', 'source'],
            LIMIT: { from: 0, size: 20 }
        }
    );

    return results.documents;
}
```

---

## Alternative: Cloudflare KV + D1

Since DWS6 uses Cloudflare Workers, consider:

| Service | Use Case |
|---------|----------|
| **Cloudflare KV** | Cache insights at edge (global, fast reads) |
| **Cloudflare D1** | SQLite at edge (search, filtering) |

```typescript
// Cloudflare Worker example
export default {
    async fetch(request, env) {
        const industry = new URL(request.url).searchParams.get('industry');

        // Try KV cache first
        const cached = await env.INSIGHTS_KV.get(`pulse:${industry}`, 'json');
        if (cached) return Response.json(cached);

        // Fall back to D1
        const { results } = await env.DB.prepare(
            `SELECT * FROM insights
             WHERE industry = ? AND expires_at > unixepoch()
             ORDER BY engagement_score DESC LIMIT 5`
        ).bind(industry).all();

        // Cache for 1 hour
        await env.INSIGHTS_KV.put(`pulse:${industry}`, JSON.stringify(results), {
            expirationTtl: 3600
        });

        return Response.json(results);
    }
};
```

---

## Conclusion

| Approach | When to Use |
|----------|-------------|
| **Supabase only** | Now. Simple, adequate for current scale |
| **Redis Search** | When you need cross-industry search, >10K daily page views |
| **Cloudflare KV/D1** | When you want edge caching (already on CF Workers) |

**Recommended path:**
1. Start with Supabase (Phase 2 of integration plan)
2. Add Cloudflare KV caching when traffic grows
3. Consider Redis only if you build a search-heavy API product

The real optimization opportunity is in the research pipeline (smarter caching, incremental updates) rather than the read layer.
