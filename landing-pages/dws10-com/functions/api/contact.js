const MAX_LENGTHS = { name: 120, email: 254, company: 160, phone: 40, message: 4000 };
const ALLOWED_ORIGINS = new Set(['https://dws10.com', 'https://www.dws10.com']);
const RATE_LIMIT_MAX = 5,
  RATE_LIMIT_WINDOW_SECONDS = 600;
function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
// Returns true when the caller is over the limit. Requires the CONTACT_RL KV binding;
// without it the check is skipped and the caller is not limited (see PR notes).
async function overRateLimit(env, ip) {
  if (!env.CONTACT_RL || !ip) return false;
  const key = `contact:${ip}`,
    count = Number(await env.CONTACT_RL.get(key)) || 0;
  if (count >= RATE_LIMIT_MAX) return true;
  await env.CONTACT_RL.put(key, String(count + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return false;
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
  if (input === null || typeof input !== 'object' || Array.isArray(input))
    return json({ error: 'Invalid request.' }, 400);
  if (clean(input.website, 80)) return json({ ok: true }, 200);
  const fields = Object.fromEntries(
    Object.entries(MAX_LENGTHS).map(([key, maxLength]) => [key, clean(input[key], maxLength)]),
  );
  if (!fields.name || !fields.company || !fields.phone || !validEmail(fields.email))
    return json({ error: 'Please provide a valid name, email, company, and phone number.' }, 400);
  if (await overRateLimit(context.env, context.request.headers.get('cf-connecting-ip')))
    return json({ error: 'Too many requests. Please try again later.' }, 429);
  const from = context.env.CONTACT_FROM,
    to = context.env.CONTACT_TO || 'risto.paarni@lifetime.fi';
  if (!from || !context.env.CONTACT_EMAIL)
    return json({ error: 'Contact delivery is not configured.' }, 503);
  const text = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Company: ${fields.company}`,
    `Phone: ${fields.phone}`,
    '',
    'Message:',
    fields.message || '(none)',
  ].join('\n');
  const subject = `Website contact from ${fields.name.replace(/[\r\n]+/g, ' ')}`;
  try {
    await context.env.CONTACT_EMAIL.send({ from, to, replyTo: fields.email, subject, text });
  } catch {
    return json({ error: 'The message could not be sent. Please try again later.' }, 502);
  }
  return json({ ok: true }, 200);
}
