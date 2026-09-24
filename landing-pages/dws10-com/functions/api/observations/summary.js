// Active Ontology — evidence panel ("show me, not trust me", LD-2026-09-007 round 5).
// GET /api/observations/summary?industry=<id>&path=<key>
// Reads aggregate counts via the SQL function website_observation_summary (migration 091):
// similar cases, typical ownership patterns, typical next steps, DISCOVER counters.
// Counts only. Below the minimum case count the function returns sufficient=false and empty
// distributions, and the page says so instead of showing numbers. Cached 5 minutes.
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY. Unconfigured → 200 {available:false}.
const ID = /^[a-z0-9:_-]{1,64}$/;
function json(body, status, cache) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cache || 'no-store',
    },
  });
}
export async function onRequestGet(context) {
  const u = new URL(context.request.url);
  const industry = u.searchParams.get('industry');
  const path = u.searchParams.get('path');
  if ((industry && !ID.test(industry)) || (path && !ID.test(path)))
    return json({ error: 'Invalid parameter.' }, 400);
  const url = context.env.SUPABASE_URL,
    key = context.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return json({ available: false, reason: 'not_configured' }, 200);
  const cache = caches.default;
  const cacheKey = new Request(u.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;
  try {
    const r = await fetch(`${url}/rest/v1/rpc/website_observation_summary`, {
      method: 'POST',
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ p_industry: industry || null, p_path: path || null, p_min: 5 }),
    });
    if (!r.ok) {
      console.error('observations/summary: supabase', r.status, (await r.text()).slice(0, 200));
      return json({ available: false, reason: 'upstream' }, 200);
    }
    const data = await r.json();
    const res = json({ available: true, ...data }, 200, 'public, max-age=300');
    context.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (e) {
    console.error('observations/summary:', e && e.message);
    return json({ available: false, reason: 'error' }, 200);
  }
}
