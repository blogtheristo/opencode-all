// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=claude-code Date=2026-09-27
// Audit trail: git log -- src/__tests__/b2b-payment-routes.test.ts
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  from: vi.fn(),
  storageFrom: vi.fn(),
  sendConfirmation: vi.fn(),
}));

vi.mock('../middleware/auth.middleware.js', () => ({
  requireAuth: vi.fn((req: Request, _res: Response, next: NextFunction) => {
    const userId = req.headers['x-test-user'];
    if (typeof userId === 'string') req.user = { id: userId } as Request['user'];
    next();
  }),
}));
vi.mock('../services/supabase.service.js', () => ({
  supabase: {
    rpc: mocks.rpc,
    from: mocks.from,
    storage: { from: mocks.storageFrom },
  },
}));
vi.mock('../services/billing.service.js', () => ({
  sendPaymentConfirmationEmail: mocks.sendConfirmation,
}));
vi.mock('stripe', () => ({ default: vi.fn() }));

const { default: b2bPaymentRoutes } = await import('../routes/b2b-payment.routes.js');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/b2b', b2bPaymentRoutes);
  return app;
}

function queryResult(result: Record<string, unknown>) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.is = vi.fn(() => builder);
  builder.order = vi.fn().mockResolvedValue(result);
  builder.single = vi.fn().mockResolvedValue(result);
  return builder;
}

describe('B2B payment routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sendConfirmation.mockResolvedValue(undefined);
  });

  it.each([
    ['post', '/api/v1/b2b/billing-profiles'],
    ['get', '/api/v1/b2b/billing-profiles'],
    ['post', '/api/v1/b2b/orders'],
    ['get', '/api/v1/b2b/orders/order-1'],
    ['post', '/api/v1/b2b/orders/order-1/confirm-deposit'],
  ] as const)('rejects unauthenticated %s %s requests', async (method, path) => {
    const response = await request(makeApp())[method](path).send({});
    expect(response.status).toBe(401);
  });

  it('creates a billing profile for the authenticated user', async () => {
    mocks.rpc.mockResolvedValue({ data: { id: 'profile-1' }, error: null });

    const response = await request(makeApp())
      .post('/api/v1/b2b/billing-profiles')
      .set('x-test-user', 'user-1')
      .send({ company_name: 'Example Oy', country: 'FI' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: 'profile-1' });
    expect(mocks.rpc).toHaveBeenCalledWith(
      'create_company_billing_profile',
      expect.objectContaining({ p_user_id: 'user-1', p_company_name: 'Example Oy' }),
    );
  });

  it('lists only billing profiles selected for the authenticated user', async () => {
    const builder = queryResult({ data: [{ id: 'profile-1' }], error: null });
    mocks.from.mockReturnValue(builder);

    const response = await request(makeApp())
      .get('/api/v1/b2b/billing-profiles')
      .set('x-test-user', 'user-1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 'profile-1' }]);
    expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(builder.is).toHaveBeenCalledWith('deleted_at', null);
  });

  it('returns 404 when an order is not owned by the authenticated user', async () => {
    const builder = queryResult({ data: null, error: { message: 'not found' } });
    mocks.from.mockReturnValue(builder);

    const response = await request(makeApp())
      .get('/api/v1/b2b/orders/order-1')
      .set('x-test-user', 'user-1');

    expect(response.status).toBe(404);
    expect(builder.eq).toHaveBeenCalledWith('user_id', 'user-1');
  });

  it('acknowledges unrelated webhook events without mutating billing state', async () => {
    const response = await request(makeApp())
      .post('/api/v1/b2b/webhook')
      .send({ type: 'unrelated.event' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it.each(['invoice.payment_succeeded', 'invoice.marked_uncollectible'])(
    'rejects unsigned Stripe %s events without touching orders',
    async (type) => {
      const response = await request(makeApp())
        .post('/api/v1/b2b/webhook')
        .send({ type, invoice_id: 'in_known_to_customer' });

      expect(response.status).toBe(410);
      expect(mocks.from).not.toHaveBeenCalled();
      expect(mocks.rpc).not.toHaveBeenCalled();
      expect(mocks.sendConfirmation).not.toHaveBeenCalled();
    },
  );
});
