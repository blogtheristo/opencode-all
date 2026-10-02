// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/checkout-durable-intake.test.ts
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it, vi } from 'vitest';

interface DurableIntakeApi {
  persistDurableOrderIntake(input: {
    endpoint: string;
    orderData: { product: { id: string } };
    idempotencyKey: string;
    timeoutMs?: number;
  }): Promise<Record<string, unknown>>;
}

const helperSource = readFileSync(
  new URL('../../dws10.com/checkout/durable-order-intake.js', import.meta.url),
  'utf8',
);

function loadHelper(fetchImpl: typeof fetch): DurableIntakeApi {
  const browserWindow: { DwsCheckoutIntake?: DurableIntakeApi } = {};
  vm.runInNewContext(helperSource, {
    window: browserWindow,
    fetch: fetchImpl,
    AbortController,
    setTimeout,
    clearTimeout,
  });
  if (!browserWindow.DwsCheckoutIntake) throw new Error('Checkout intake helper did not load');
  return browserWindow.DwsCheckoutIntake;
}

const orderData = { product: { id: 'DWS-IQ-006' } };
const validBody = {
  order_intent_id: '11111111-1111-4111-8111-111111111111',
  product_id: 'DWS-IQ-006',
  idempotent_replay: false,
};

describe('checkout durable intake gate', () => {
  it('accepts only a successful, well-formed durable intake response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validBody), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const helper = loadHelper(fetchMock as typeof fetch);

    await expect(
      helper.persistDurableOrderIntake({
        endpoint: 'https://api.lifetime.fi/v1/orders/notify',
        orderData,
        idempotencyKey: 'ORD-12345678',
      }),
    ).resolves.toMatchObject(validBody);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.lifetime.fi/v1/orders/notify',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Idempotency-Key': 'ORD-12345678' }),
      }),
    );
  });

  it.each([
    [
      'non-2xx',
      new Response(JSON.stringify({ error: 'unavailable' }), {
        status: 503,
        headers: { 'content-type': 'application/json' },
      }),
    ],
    [
      'non-JSON',
      new Response('<html>failure</html>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      }),
    ],
    [
      'malformed JSON body',
      new Response(JSON.stringify({ product_id: 'DWS-IQ-006' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    ],
  ])('rejects a %s response before payment navigation', async (_caseName, response) => {
    const helper = loadHelper(vi.fn().mockResolvedValue(response) as typeof fetch);
    await expect(
      helper.persistDurableOrderIntake({
        endpoint: 'https://api.lifetime.fi/v1/orders/notify',
        orderData,
        idempotencyKey: 'ORD-12345678',
      }),
    ).rejects.toThrow();
  });

  it('aborts a timed-out intake request', async () => {
    const fetchMock = vi.fn(
      (_url: string, options?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    const helper = loadHelper(fetchMock as typeof fetch);

    await expect(
      helper.persistDurableOrderIntake({
        endpoint: 'https://api.lifetime.fi/v1/orders/notify',
        orderData,
        idempotencyKey: 'ORD-12345678',
        timeoutMs: 1,
      }),
    ).rejects.toThrow('aborted');
  });

  it('keeps root and deployment mirror identical and awaits intake before redirect', () => {
    const root = readFileSync(
      new URL('../../dws10.com/checkout/index.html', import.meta.url),
      'utf8',
    );
    const mirror = readFileSync(
      new URL('../../landing-pages/dws10-com/checkout/index.html', import.meta.url),
      'utf8',
    );

    expect(mirror).toBe(root);
    expect(root).toContain('await sendOrderNotification(orderData)');
    expect(root.indexOf('await sendOrderNotification(orderData)')).toBeLessThan(
      root.indexOf('safeRedirect(paymentUrl)'),
    );
    expect(root).not.toContain('Notification failed, but payment continues');
    expect(root.match(/const TRUSTED_PAYMENT_DOMAINS/g)).toHaveLength(1);
    expect(root).toContain(
      "const TRUSTED_PAYMENT_DOMAINS = ['revolut.com', 'revolut.me', 'paypal.com'];",
    );
    expect(root).not.toContain("'api.lifetime.fi',");
    expect(root).not.toContain("'dws10.com'");
  });
});
