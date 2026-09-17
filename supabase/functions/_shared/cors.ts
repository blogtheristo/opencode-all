// Strict CORS allowlist — no wildcards (DWS_SECURITY_STANDARD).
const ALLOWED_ORIGINS = new Set<string>([
  'https://dws10.com',
  'https://www.dws10.com',
  // Local dev — drop in prod by leaving SUPABASE_ENV=prod
  ...(Deno.env.get('SUPABASE_ENV') === 'prod'
    ? []
    : ['http://localhost:8080', 'http://127.0.0.1:8080']),
]);

export function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') ?? '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : '';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

export function preflight(req: Request): Response | null {
  if (req.method !== 'OPTIONS') return null;
  return new Response(null, { status: 204, headers: corsHeadersFor(req) });
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeadersFor(req),
    },
  });
}
