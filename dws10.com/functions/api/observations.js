// Active Ontology — Observation Intake (Chapter 14 CAPTURE from the website).
// Stores anonymised observations in Supabase table website_observations via the REST API.
// Env (Cloudflare Pages project settings): SUPABASE_URL, SUPABASE_SERVICE_KEY. Without them the
// endpoint answers 202 so the front-end keeps working; nothing is stored (fail loud in logs).
const ALLOWED_ORIGINS = new Set(['https://dws10.com', 'https://www.dws10.com']);
const EVENTS = new Set([
  'query',
  'recognise',
  'industry',
  'answer',
  'ownership',
  'path_shown',
  'success',
  'selected',
  'result',
]);
function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
function str(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : null;
}
const OWN_DIMS = new Set(['impact', 'owner', 'decision', 'action', 'accountability', 'data']);
const OWN_VERDICTS = new Set(['discovery', 'transfer', 'outsourced_accountability', 'aligned']);
const OWN_ROLES = new Set([
  'ceo',
  'coo',
  'cfo',
  'sustainability',
  'digital',
  'quality',
  'bu',
  'board',
  'external',
  'unknown',
]);
// Ownership stage (LD-2026-09-007): roles only, whitelisted; anything else is dropped.
function ownership(o) {
  if (!o || typeof o !== 'object') return null;
  const known = ['yes', 'partly', 'no'].includes(o.known) ? o.known : null;
  const map = {};
  if (o.map && typeof o.map === 'object')
    for (const [k, v] of Object.entries(o.map)) if (OWN_DIMS.has(k) && OWN_ROLES.has(v)) map[k] = v;
  return known ? { known, map } : null;
}
function anonymise(s) {
  return s
    ? s.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]').replace(/\+?\d[\d\s().-]{6,}\d/g, '[phone]')
    : s;
}
export async function onRequestPost(context) {
  const origin = context.request.headers.get('origin');
  if (origin && !ALLOWED_ORIGINS.has(origin))
    return json({ error: 'Request origin is not allowed.' }, 403);
  let input;
  try {
    input = await context.request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!input || typeof input !== 'object' || Array.isArray(input))
    return json({ error: 'Invalid request.' }, 400);
  const event = str(input.event, 32);
  if (!EVENTS.has(event)) return json({ error: 'Unknown event.' }, 400);
  const row = {
    observation_id: str(input.id, 64),
    event,
    page: str(input.page, 200),
    lang: str(input.lang, 5),
    query_text: anonymise(str(input.query, 400)),
    industry: str(input.industry, 64),
    topics: Array.isArray(input.topics)
      ? input.topics.slice(0, 5).map((x) => String(x).slice(0, 32))
      : [],
    recognise_id: str(input.recognise, 64),
    path_key: str(input.path, 64),
    answers: input.answers && typeof input.answers === 'object' ? input.answers : {},
    success_text: anonymise(str(input.success, 300)),
    ontology_guess:
      input.ontology_guess && typeof input.ontology_guess === 'object'
        ? input.ontology_guess
        : null,
    recommended_sku: str(input.recommended_sku, 64),
    selected_sku: str(input.selected_sku, 64),
    result: str(input.result, 64),
    ownership_map: ownership(input.ownership),
    question_id: str(input.question, 64),
    answer: str(input.answer, 8),
    source: 'website',
  };
  const url = context.env.SUPABASE_URL,
    key = context.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error(
      'observations: SUPABASE_URL/SUPABASE_SERVICE_KEY not configured — observation not stored',
    );
    return json({ ok: true, stored: false, id: row.observation_id || crypto.randomUUID() }, 202);
  }
  if (!row.observation_id) row.observation_id = crypto.randomUUID();
  try {
    const r = await fetch(`${url}/rest/v1/website_observations`, {
      method: 'POST',
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        'content-type': 'application/json',
        prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      console.error('observations: supabase insert failed', r.status);
      return json({ ok: false, stored: false, id: row.observation_id }, 502);
    }
  } catch (e) {
    console.error('observations: supabase unreachable');
    return json({ ok: false, stored: false, id: row.observation_id }, 502);
  }
  return json({ ok: true, stored: true, id: row.observation_id }, 200);
}
