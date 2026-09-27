// Evidence: Tool=GitHub-Copilot-CLI Model=GPT-5.6-Sol Agent=remediation Date=2026-09-27
// Audit trail: git log -- src/__tests__/contact-form.test.ts
import { describe, expect, it, vi } from 'vitest';
import { onRequestPost } from '../../dws10.com/functions/api/contact.js';

function request(body: Record<string, unknown>, includeIp = true): Request {
  const headers = new Headers({
    'content-type': 'application/json',
    origin: 'https://dws10.com',
  });
  if (includeIp) headers.set('cf-connecting-ip', '203.0.113.7');
  return new Request('https://dws10.com/api/contact', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

const validBody = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'Analytical Engines',
  phone: '+358 40 123 4567',
  message: 'Please contact me.',
};

function context(options: {
  rateLimiter?: { limit: ReturnType<typeof vi.fn> };
  email?: { send: ReturnType<typeof vi.fn> };
  includeIp?: boolean;
}) {
  return {
    request: request(validBody, options.includeIp),
    env: {
      CONTACT_RATE_LIMITER: options.rateLimiter,
      CONTACT_EMAIL: options.email,
      CONTACT_FROM: 'contact@dws10.com',
    },
  };
}

describe('dws10 contact form', () => {
  it('sends mail after the atomic rate-limit binding allows the caller', async () => {
    const limit = vi.fn().mockResolvedValue({ success: true });
    const send = vi.fn().mockResolvedValue(undefined);

    const response = await onRequestPost(
      context({ rateLimiter: { limit }, email: { send } }) as never,
    );

    expect(response.status).toBe(200);
    expect(limit).toHaveBeenCalledWith({ key: 'contact:203.0.113.7' });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'contact@dws10.com',
        replyTo: 'ada@example.com',
        subject: 'Website contact from Ada Lovelace',
      }),
    );
  });

  it('returns 429 and does not send when the binding denies the caller', async () => {
    const send = vi.fn();
    const response = await onRequestPost(
      context({
        rateLimiter: { limit: vi.fn().mockResolvedValue({ success: false }) },
        email: { send },
      }) as never,
    );

    expect(response.status).toBe(429);
    expect(send).not.toHaveBeenCalled();
  });

  it('fails closed when the rate-limit binding is absent', async () => {
    const send = vi.fn();
    const response = await onRequestPost(context({ email: { send } }) as never);

    expect(response.status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it('fails closed when Cloudflare does not provide the client IP', async () => {
    const send = vi.fn();
    const response = await onRequestPost(
      context({
        rateLimiter: { limit: vi.fn().mockResolvedValue({ success: true }) },
        email: { send },
        includeIp: false,
      }) as never,
    );

    expect(response.status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it('fails closed when the rate-limit service errors', async () => {
    const send = vi.fn();
    const response = await onRequestPost(
      context({
        rateLimiter: { limit: vi.fn().mockRejectedValue(new Error('unavailable')) },
        email: { send },
      }) as never,
    );

    expect(response.status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it('keeps honeypot submissions side-effect free', async () => {
    const limit = vi.fn();
    const send = vi.fn();
    const honeypotContext = context({ rateLimiter: { limit }, email: { send } });
    honeypotContext.request = request({ ...validBody, website: 'spam.example' });

    const response = await onRequestPost(honeypotContext as never);

    expect(response.status).toBe(200);
    expect(limit).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});
