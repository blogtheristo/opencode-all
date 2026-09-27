// Evidence: Tool=GitHub-Copilot-CLI Model=GPT-5.6-Sol Agent=remediation Date=2026-09-27
// Audit trail: git log -- functions/api/contact.js
const MAX_LENGTHS = { name: 120, email: 254, company: 160, phone: 40, message: 4000 };
const ALLOWED_ORIGINS = new Set(['https://dws10.com', 'https://www.dws10.com']);

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

async function checkRateLimit(env, ip) {
  if (!env.CONTACT_RATE_LIMITER || typeof env.CONTACT_RATE_LIMITER.limit !== 'function' || !ip) {
    return { configured: false, allowed: false };
  }

  try {
    const result = await env.CONTACT_RATE_LIMITER.limit({ key: `contact:${ip}` });
    return { configured: true, allowed: result.success === true };
  } catch {
    return { configured: false, allowed: false };
  }
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

  const rateLimit = await checkRateLimit(
    context.env,
    context.request.headers.get('cf-connecting-ip'),
  );
  if (!rateLimit.configured)
    return json({ error: 'Contact rate limiting is not configured.' }, 503);
  if (!rateLimit.allowed) return json({ error: 'Too many requests. Please try again later.' }, 429);

  const from = context.env.CONTACT_FROM;
  const to = context.env.CONTACT_TO || 'risto.paarni@lifetime.fi';
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
    await context.env.CONTACT_EMAIL.send({
      from,
      to,
      replyTo: fields.email,
      subject,
      text,
    });
  } catch {
    return json({ error: 'The message could not be sent. Please try again later.' }, 502);
  }
  return json({ ok: true }, 200);
}
