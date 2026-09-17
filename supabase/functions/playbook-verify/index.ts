// POST /functions/v1/playbook-verify
//
// Validate a 6-char code against the most recent pending lead for
// (email, industry). On success: mark verified, log the download, return a
// 24h signed URL from the sovereign "playbooks" bucket.
//
// Error codes are intentionally generic — we do not distinguish "no such
// email" from "wrong code" to outsiders. The DB knows; the client doesn't.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { corsHeadersFor, json, preflight } from '../_shared/cors.ts';
import { verifySchema } from '../_shared/zod-schemas.ts';
import { constantTimeEqual, hashCode } from '../_shared/code.ts';
import { PLAYBOOK_BUCKET, serviceClient } from '../_shared/supabase.ts';
import { PDF_VERSIONS, PUBLISHED_PLAYBOOKS } from '../_shared/industries.ts';

const SIGNED_URL_TTL_SECONDS = 24 * 3600;

serve(async (req: Request) => {
  const pre = preflight(req);
  if (pre) return pre;

  if (req.method !== 'POST') {
    return json(req, { error: 'method-not-allowed' }, 405);
  }

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

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return json(req, { error: 'invalid-input', issues: parsed.error.flatten() }, 400);
  }
  const input = parsed.data;

  if (!PUBLISHED_PLAYBOOKS.has(input.industry)) {
    // Wait-list industries don't get a download.
    return json(req, { error: 'not-published' }, 404);
  }

  const sb = serviceClient();

  const { data: leadRows, error: selErr } = await sb
    .from('playbook_leads')
    .select('id, code_hash, code_salt, code_expires_at, attempts_remaining, verified_at, is_waitlist, language')
    .eq('email', input.email)
    .eq('industry_slug', input.industry)
    .eq('is_waitlist', false)
    .order('requested_at', { ascending: false })
    .limit(1);

  if (selErr) {
    console.error('lead select failed', selErr);
    return json(req, { error: 'server-error' }, 500);
  }
  const lead = leadRows?.[0];
  if (!lead || !lead.code_hash || !lead.code_salt || !lead.code_expires_at) {
    return json(req, { error: 'no-pending-lead' }, 404);
  }

  if (lead.attempts_remaining <= 0) {
    return json(req, { error: 'locked-out' }, 423);
  }

  if (new Date(lead.code_expires_at).getTime() < Date.now()) {
    return json(req, { error: 'code-expired' }, 410);
  }

  const supplied = await hashCode(input.code, lead.code_salt);
  if (!constantTimeEqual(supplied, lead.code_hash)) {
    await sb
      .from('playbook_leads')
      .update({ attempts_remaining: lead.attempts_remaining - 1 })
      .eq('id', lead.id);
    return json(req, { error: 'invalid-code' }, 401);
  }

  // Success: invalidate code (clear hash), stamp verified_at, log download.
  const { error: updErr } = await sb
    .from('playbook_leads')
    .update({
      verified_at: lead.verified_at ?? new Date().toISOString(),
      code_hash: null,
      code_salt: null,
      code_expires_at: null,
      attempts_remaining: 0,
    })
    .eq('id', lead.id);
  if (updErr) {
    console.error('lead update failed', updErr);
    return json(req, { error: 'server-error' }, 500);
  }

  const language = (lead.language ?? 'en') as 'en' | 'fi' | 'sv' | 'de' | 'fr';
  const pdfVersion = PDF_VERSIONS[input.industry]?.[language]
    ?? PDF_VERSIONS[input.industry]?.en;
  const objectKey = `${input.industry}-${language}.pdf`;

  const { data: signed, error: signErr } = await sb.storage
    .from(PLAYBOOK_BUCKET)
    .createSignedUrl(objectKey, SIGNED_URL_TTL_SECONDS, {
      download: `dws-playbook-${input.industry}-${language}.pdf`,
    });
  if (signErr || !signed) {
    console.error('signed url failed', signErr);
    return json(req, { error: 'server-error' }, 500);
  }

  await sb.from('playbook_downloads').insert({
    lead_id: lead.id,
    industry_slug: input.industry,
    pdf_version: pdfVersion ?? `${input.industry}-${language}@unknown`,
  });

  return json(req, {
    ok: true,
    signed_url: signed.signedUrl,
    expires_at: new Date(Date.now() + SIGNED_URL_TTL_SECONDS * 1000).toISOString(),
    pdf_version: pdfVersion ?? null,
  });
});
