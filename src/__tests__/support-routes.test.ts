/**
 * Support ticket routes — request validation + happy path.
 *
 * Stubs the Supabase client via vi.mock so the routes run in-process with
 * deterministic inputs.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// ---- Fake supabase client ----------------------------------------------
const calls: Array<{ table: string; op: string; payload?: unknown }> = [];
const customers: Array<{ id: string; primary_contact_email: string }> = [];
let ticketCounter = 0;

function chain(table: string): unknown {
  const ctx: Record<string, unknown> = {};
  const builder: Record<string, unknown> = {
    select() {
      ctx.op = 'select';
      return builder;
    },
    eq(col: string, val: unknown) {
      ctx[`eq_${col}`] = val;
      return builder;
    },
    order() {
      return builder;
    },
    limit() {
      if (table === 'customers' && ctx.op === 'select') {
        const email = ctx['eq_primary_contact_email'] as string;
        const match = customers.find((c) => c.primary_contact_email === email);
        return Promise.resolve({ data: match ? [match] : [], error: null });
      }
      if (table === 'support_tickets' && ctx.op === 'select') {
        return Promise.resolve({ data: [], error: null });
      }
      return Promise.resolve({ data: [], error: null });
    },
    insert(payload: unknown) {
      calls.push({ table, op: 'insert', payload });
      if (table === 'support_tickets') {
        ticketCounter += 1;
        const id = `00000000-0000-0000-0000-${String(ticketCounter).padStart(12, '0')}`;
        return {
          select() {
            return {
              limit() {
                return Promise.resolve({
                  data: [{ id, status: 'new', source: 'web', created_at: '2026-05-12T00:00:00Z' }],
                  error: null,
                });
              },
            };
          },
        };
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return builder;
}

const fakeClient = { from: (table: string) => chain(table) };

vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => fakeClient,
}));

vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    (req as express.Request & { userId?: string; userEmail?: string }).userId = 'user-1';
    (req as express.Request & { userId?: string; userEmail?: string }).userEmail =
      'staff@onelifetime.world';
    next();
  },
  optionalAuth: (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
    next(),
}));

const { default: supportRoutes } = await import('../routes/support.routes.js');

const app = express();
app.use(express.json());
app.use('/api/v1/support', supportRoutes);

describe('POST /api/v1/support/tickets', () => {
  beforeEach(() => {
    calls.length = 0;
    customers.length = 0;
    ticketCounter = 0;
  });

  test('rejects empty body', async () => {
    const r = await request(app).post('/api/v1/support/tickets').send({});
    expect(r.status).toBe(400);
    expect(r.body).toHaveProperty('error', 'Validation failed');
  });

  test('rejects a body that is whitespace only', async () => {
    const r = await request(app)
      .post('/api/v1/support/tickets')
      .send({ body: '   ', email: 'a@b.com' });
    expect(r.status).toBe(400);
  });

  test('rejects a web ticket missing the email', async () => {
    const r = await request(app)
      .post('/api/v1/support/tickets')
      .send({ body: 'I have a question', source: 'web' });
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/email/i);
  });

  test('creates a web ticket with email + body', async () => {
    customers.push({ id: 'cust-1', primary_contact_email: 'alice@example.com' });
    const r = await request(app).post('/api/v1/support/tickets').send({
      body: 'My dashboard does not load',
      email: 'alice@example.com',
      subject: 'Dash issue',
    });
    expect(r.status).toBe(201);
    expect(r.body).toHaveProperty('ticketId');
    expect(r.body.source).toBe('web');

    const rawPayload = calls.find((c) => c.table === 'support_tickets')!.payload;
    const insert = (Array.isArray(rawPayload) ? rawPayload[0] : rawPayload) as Record<
      string,
      unknown
    >;
    expect(insert).toMatchObject({
      source: 'web',
      from_addr: 'alice@example.com',
      customer_id: 'cust-1',
      status: 'new',
    });
    expect(calls.some((c) => c.table === 'ticket_events')).toBe(true);
    expect(calls.some((c) => c.table === 'ticket_messages')).toBe(true);
  });

  test('rejects a body that is too large', async () => {
    const big = 'x'.repeat(50_001);
    const r = await request(app)
      .post('/api/v1/support/tickets')
      .send({ body: big, email: 'a@b.com' });
    expect(r.status).toBe(400);
  });

  test('rejects invalid email', async () => {
    const r = await request(app)
      .post('/api/v1/support/tickets')
      .send({ body: 'hi', email: 'not-an-email' });
    expect(r.status).toBe(400);
  });

  test('rejects invalid source', async () => {
    const r = await request(app)
      .post('/api/v1/support/tickets')
      .send({ body: 'hi', email: 'a@b.com', source: 'slack' });
    expect(r.status).toBe(400);
  });
});

describe('GET /api/v1/support/tickets/:id', () => {
  test('rejects a non-UUID id', async () => {
    const r = await request(app).get('/api/v1/support/tickets/not-a-uuid');
    expect(r.status).toBe(400);
  });
});
