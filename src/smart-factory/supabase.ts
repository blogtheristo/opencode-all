/**
 * Smart Factory — Supabase REST helper.
 * Same pattern as construction-leads/ted-outreach.ts (service key, PostgREST).
 */

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

export async function restFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = requireEnv('SUPABASE_URL');
  const key = requireEnv('SUPABASE_SERVICE_KEY');
  const baseHeaders: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
  if (options.body !== undefined) {
    baseHeaders['Content-Type'] = 'application/json';
  }
  const merged = new Headers(baseHeaders);
  const extra = new Headers(options.headers);
  extra.forEach((v, k) => merged.set(k, v));
  if (!merged.has('Prefer') && options.method !== 'PATCH') {
    merged.set('Prefer', 'return=representation');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: merged,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }
  if (response.status === 204) return [] as unknown as T;
  const text = await response.text();
  if (!text) return [] as unknown as T;
  return JSON.parse(text) as T;
}

/** True when Supabase env is configured (pipeline degrades to dry-run without it). */
export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}
