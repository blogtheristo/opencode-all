// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/billing-integration.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import worker, { type Env } from '../cloudflare/billing-integration.js';

function makeEnv(overrides: Record<string, unknown> = {}): Env {
  const tenantConfig = {
    get: vi.fn().mockResolvedValue(null),
    put: vi.fn().mockResolvedValue(undefined),
    list: vi.fn().mockResolvedValue({ keys: [] }),
  };
  const usageData = { get: vi.fn().mockResolvedValue(null) };
  return {
    STRIPE_SECRET_KEY: 'sk_test_example',
    STRIPE_WEBHOOK_SECRET: 'whsec_example',
    TENANT_CONFIG: tenantConfig,
    USAGE_DATA: usageData,
    USAGE_METRICS: {},
    NOTIFICATION_WEBHOOK_URL: '',
    ENVIRONMENT: 'test',
    ...overrides,
  } as unknown as Env;
}

const context = {} as ExecutionContext;

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe('billing integration worker', () => {
  beforeEach(() => vi.restoreAllMocks());

  it.each([
    'https://dws10.com',
    'https://www.dws10.com',
    'https://dws6.com',
    'https://www.dws6.com',
    'https://onelifetime.world',
    'https://www.onelifetime.world',
    'https://lifetime.fi',
    'https://www.lifetime.fi',
  ])('echoes allowed production origin %s', async (origin) => {
    const response = await worker.fetch(
      new Request('https://billing.test/pricing', { headers: { Origin: origin } }),
      makeEnv(),
      context,
    );

    expect(response.headers.get('access-control-allow-origin')).toBe(origin);
    expect(response.headers.get('vary')).toBe('Origin');
  });

  it('allows localhost only under the explicit development environment', async () => {
    const requestFor = () =>
      new Request('https://billing.test/pricing', {
        headers: { Origin: 'http://localhost:5173' },
      });
    const production = await worker.fetch(requestFor(), makeEnv(), context);
    const shorthandDev = await worker.fetch(requestFor(), makeEnv({ ENVIRONMENT: 'dev' }), context);
    const development = await worker.fetch(
      requestFor(),
      makeEnv({ ENVIRONMENT: 'development' }),
      context,
    );

    expect(production.headers.get('access-control-allow-origin')).toBeNull();
    expect(shorthandDev.headers.get('access-control-allow-origin')).toBeNull();
    expect(development.headers.get('access-control-allow-origin')).toBe('http://localhost:5173');
  });

  it('permits allowed preflight and rejects disallowed non-GET requests without ACAO', async () => {
    const allowed = await worker.fetch(
      new Request('https://billing.test/sync/tenant-1', {
        method: 'OPTIONS',
        headers: { Origin: 'https://dws6.com' },
      }),
      makeEnv(),
      context,
    );
    expect(allowed.status).toBe(200);
    expect(allowed.headers.get('access-control-allow-origin')).toBe('https://dws6.com');
    expect(allowed.headers.get('access-control-allow-methods')).toContain('POST');

    for (const method of ['OPTIONS', 'POST']) {
      const blocked = await worker.fetch(
        new Request('https://billing.test/sync/tenant-1', {
          method,
          headers: { Origin: 'https://evil.example' },
        }),
        makeEnv(),
        context,
      );
      expect(blocked.status).toBe(403);
      expect(blocked.headers.get('access-control-allow-origin')).toBeNull();
      expect(blocked.headers.get('vary')).toBe('Origin');
    }
  });

  it('serves disallowed-origin GET requests without ACAO', async () => {
    const response = await worker.fetch(
      new Request('https://billing.test/pricing', {
        headers: { Origin: 'https://evil.example' },
      }),
      makeEnv(),
      context,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
    expect(response.headers.get('vary')).toBe('Origin');
  });

  it('serves health, pricing, preflight, and not-found responses', async () => {
    const env = makeEnv();
    const health = await worker.fetch(new Request('https://billing.test/health'), env, context);
    const pricing = await worker.fetch(new Request('https://billing.test/pricing'), env, context);
    const options = await worker.fetch(
      new Request('https://billing.test/pricing', { method: 'OPTIONS' }),
      env,
      context,
    );
    const missing = await worker.fetch(new Request('https://billing.test/missing'), env, context);

    await expect(readJson(health)).resolves.toMatchObject({ status: 'healthy' });
    await expect(readJson(pricing)).resolves.toHaveProperty('sandbox');
    expect(options.status).toBe(200);
    expect(options.headers.get('access-control-allow-methods')).toContain('POST');
    expect(missing.status).toBe(404);
  });

  it('aggregates tenant usage and reports threshold state', async () => {
    const getUsage = vi.fn(async (key: string) =>
      key.startsWith('usage:tenant-1:')
        ? { inputTokens: 600_000, outputTokens: 250_000, requests: 12, cost: 7.5 }
        : null,
    );
    const getTenant = vi.fn(async (key: string) =>
      key === 'tenant:tenant-1'
        ? {
            tier: 'sandbox',
            billing: { periodStart: '2026-09-27', periodEnd: '2026-09-27' },
          }
        : null,
    );
    const env = makeEnv({
      USAGE_DATA: { get: getUsage },
      TENANT_CONFIG: { get: getTenant, put: vi.fn(), list: vi.fn() },
    });

    const response = await worker.fetch(
      new Request('https://billing.test/usage/tenant-1?start=2026-09-27&end=2026-09-27'),
      env,
      context,
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      tenantId: 'tenant-1',
      tokens: { input: 600_000, output: 250_000, total: 850_000 },
      requests: 12,
      thresholds: { warning: true, exceeded: false, percentage: 85 },
    });
  });

  it('rejects unsigned Stripe webhooks and tenants without billing', async () => {
    const env = makeEnv();
    const webhook = await worker.fetch(
      new Request('https://billing.test/webhooks/stripe', { method: 'POST', body: '{}' }),
      env,
      context,
    );
    const sync = await worker.fetch(
      new Request('https://billing.test/sync/tenant-1', { method: 'POST' }),
      env,
      context,
    );
    const invoice = await worker.fetch(
      new Request('https://billing.test/invoice/tenant-1'),
      env,
      context,
    );

    expect(webhook.status).toBe(400);
    expect(sync.status).toBe(500);
    await expect(readJson(sync)).resolves.toMatchObject({
      error: 'Tenant has no active subscription',
    });
    expect(invoice.status).toBe(404);
  });

  it('does not fail a scheduled sweep when one tenant cannot sync', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const env = makeEnv({
      TENANT_CONFIG: {
        get: vi.fn().mockResolvedValue(null),
        put: vi.fn(),
        list: vi.fn().mockResolvedValue({ keys: [{ name: 'tenant:broken' }] }),
      },
    });

    await expect(worker.scheduled({} as ScheduledEvent, env, context)).resolves.toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith('Failed to sync tenant broken:', expect.any(Error));
  });
});
