import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';

const state = vi.hoisted(() => ({
  user: { id: 'u1', email: 'a@x.fi' } as { id: string; email: string } | null,
  membership: { user_id: 'u1' } as { user_id: string } | null,
}));

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('node:child_process', () => ({
  execFile: (
    _cmd: string,
    _args: string[],
    _opts: unknown,
    cb: (e: null, r: { stdout: string }) => void,
  ) =>
    cb(null, {
      stdout: [
        '{"Names":"db","Image":"postgres","State":"running","Status":"Up 2 days (healthy)"}',
        '{"Names":"worker","Image":"w","State":"restarting","Status":"Restarting (1) 5 seconds ago"}',
      ].join('\n'),
    }),
}));

vi.mock('../config/supabase.js', () => {
  const chain = (result: unknown) => {
    const q: Record<string, unknown> = {};
    for (const m of ['select', 'eq', 'neq', 'gte', 'in', 'order', 'limit']) q[m] = () => q;
    q.maybeSingle = async () => ({ data: state.membership, error: null });
    q.then = (resolve: (v: unknown) => void) => resolve(result);
    return q;
  };
  return {
    getSupabaseClient: () => ({
      auth: {
        getUser: async () => ({
          data: { user: state.user },
          error: state.user ? null : new Error('bad'),
        }),
      },
      from: () => chain({ count: 7, data: [], error: null }),
    }),
  };
});

import backofficeRouter, { parseDockerPs } from '../routes/backoffice.routes.js';

function buildApp(): Express {
  const app = express();
  app.use('/api/v1/backoffice', backofficeRouter);
  return app;
}

describe('backoffice routes', () => {
  beforeEach(() => {
    state.user = { id: 'u1', email: 'a@x.fi' };
    state.membership = { user_id: 'u1' };
  });

  it('rejects requests without a bearer token', async () => {
    const res = await request(buildApp()).get('/api/v1/backoffice/stats');
    expect(res.status).toBe(401);
  });

  it('rejects invalid tokens', async () => {
    state.user = null;
    const res = await request(buildApp())
      .get('/api/v1/backoffice/stats')
      .set('Authorization', 'Bearer x');
    expect(res.status).toBe(401);
  });

  it('rejects users who are not active org owner/admin even if metadata claims backoffice_admin', async () => {
    state.membership = null;
    const res = await request(buildApp())
      .get('/api/v1/backoffice/stats')
      .set('Authorization', 'Bearer x');
    expect(res.status).toBe(403);
  });

  it('returns real counts and container health for admins', async () => {
    const res = await request(buildApp())
      .get('/api/v1/backoffice/stats')
      .set('Authorization', 'Bearer x');
    expect(res.status).toBe(200);
    expect(res.body.users.total).toBe(7);
    expect(res.body.apiRequestsToday).toBe(7);
    expect(res.body.containers).toEqual({ total: 2, running: 1, unhealthy: 1 });
  });
});

describe('parseDockerPs', () => {
  it('derives health from docker status text', () => {
    const out = parseDockerPs(
      '{"Names":"a","Image":"i","State":"running","Status":"Up 1m (unhealthy)"}\n{"Names":"b","Image":"i","State":"running","Status":"Up 3s (health: starting)"}\n',
    );
    expect(out.map((c) => c.health)).toEqual(['unhealthy', 'starting']);
  });
});
