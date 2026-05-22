// POST /functions/v1/playbook-request
//
// Insert a pending lead, generate a 6-char code, send via Amazon SES (EU SMTP).
// For industries that do NOT yet have a published PDF, the row is marked
// is_waitlist=true and a wait-list confirmation email is sent instead of a code.
//
// Response 200 always; failures collapse to 4xx/5xx with neutral error text
// (don't leak whether an email already exists in the DB).
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeadersFor, json, preflight } from '../_shared/cors.ts';
import { requestSchema } from '../_shared/zod-schemas.ts';
import { generateCode, generateSaltHex, hashCode } from '../_shared/code.ts';
import { sendEmail } from '../_shared/ses-smtp.ts';
import { codeEmail, waitlistEmail } from '../_shared/email-templates.ts';
import { serviceClient } from '../_shared/supabase.ts';
import { PUBLISHED_PLAYBOOKS } from '../_shared/industries.ts';

const CODE_TTL_SECONDS = 15 * 60;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_HOURS = 1;

serve(async (req: Request) => {
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== 'POST') {
    return json(req, { error: 'method-not-allowed' }, 405);
  }

  // Reject obviously cross-origin requests up front. corsHeadersFor() already
  // returns an empty allow-origin for unknown callers, so the browser will
  // block; this is belt-and-braces for non-browser clients.
  const origin = req.headers.get('Origin') ?? '';
  const allowOrigin = corsHeadersFor(req)['Access-Control-Allow-Origin'];
  if (origin && !allowOrigin) {
    return json(req, { error: 'forbidden-origin' }, 403);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: 'invalid-json' }, 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return json(req, { error: 'invalid-input', issues: parsed.error.flatten() }, 400);
  }
  const input = parsed.data;

  const sb = serviceClient();

  // Rate limit: max N requests per (email, industry) per window.
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_HOURS * 3600 * 1000,
  ).toISOString();
  const { count: recentCount, error: rateErr } = await sb
    .from('playbook_leads')
    .select('id', { count: 'exact', head: true })
    .eq('email', input.email)
    .eq('industry_slug', input.industry)
    .gte('requested_at', windowStart);

  if (rateErr) {
    console.error('rate-check failed', rateErr);
    return json(req, { error: 'server-error' }, 500);
  }
  if ((recentCount ?? 0) >= RATE_LIMIT_MAX) {
    return json(req, { error: 'rate-limited', retry_after: RATE_LIMIT_WINDOW_HOURS * 3600 }, 429);
  }

  const isWaitlist = !PUBLISHED_PLAYBOOKS.has(input.industry);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  const ua = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  let code: string | null = null;
  let codeHash: string | null = null;
  let codeSalt: string | null = null;
  let codeExpiresAt: string | null = null;

  if (!isWaitlist) {
    code = generateCode();
    codeSalt = generateSaltHex();
    codeHash = await hashCode(code, codeSalt);
    codeExpiresAt = new Date(Date.now() + CODE_TTL_SECONDS * 1000).toISOString();
  }

  const { error: insertErr } = await sb.from('playbook_leads').insert({
    email: input.email,
    industry_slug: input.industry,
    is_waitlist: isWaitlist,
    language: input.language,
    code_hash: codeHash,
    code_salt: codeSalt,
    code_expires_at: codeExpiresAt,
    attempts_remaining: 5,
    ip,
    ua,
    consent_marketing: input.consent_marketing,
    consent_text: input.consent_text,
    utm_source: input.utm?.source ?? null,
    utm_medium: input.utm?.medium ?? null,
    utm_campaign: input.utm?.campaign ?? null,
    utm_term: input.utm?.term ?? null,
    utm_content: input.utm?.content ?? null,
  });

  if (insertErr) {
    console.error('lead insert failed', insertErr);
    return json(req, { error: 'server-error' }, 500);
  }

  try {
    const tmpl = isWaitlist
      ? waitlistEmail({ industry: input.industry, language: input.language })
      : codeEmail({ code: code!, industry: input.industry, language: input.language });
    await sendEmail({ to: input.email, ...tmpl });
  } catch (err) {
    console.error('SES send failed', err);
    return json(req, { error: 'send-failed' }, 502);
  }

  return json(req, {
    ok: true,
    mode: isWaitlist ? 'waitlist' : 'verify',
    expires_in: isWaitlist ? null : CODE_TTL_SECONDS,
  });
});
