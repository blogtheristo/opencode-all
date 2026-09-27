import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';

const state = vi.hoisted(() => ({
  user: { id: 'u1', email: 'a@x.fi', user_metadata: {} } as {
    id: string;
    email: string;
    user_metadata: { role?: string };
  } | null,
  memberships: [
    {
      user_id: 'u1',
      role: 'admin',
      organizations: { name: 'Control Room', is_internal: true },
    },
  ] as Array<{
    user_id: string;
    role: string;
    organizations: { name: string; is_internal: boolean };
  }>,
  membershipError: null as Error | null,
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
    q.maybeSingle = async () => ({
      data: state.memberships[0] ?? null,
      error: state.membershipError,
    });
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
      from: (table: string) =>
        chain(
          table === 'organization_members'
            ? { data: state.memberships, error: state.membershipError }
            : { count: 7, data: [], error: null },
        ),
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
    state.user = { id: 'u1', email: 'a@x.fi', user_metadata: {} };
    state.memberships = [
      {
        user_id: 'u1',
        role: 'admin',
        organizations: { name: 'Control Room', is_internal: true },
      },
    ];
    state.membershipError = null;
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
    state.memberships = [];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/stats')
      .set('Authorization', 'Bearer x');
    expect(res.status).toBe(403);
  });

  it('/me returns false and no organizations for a non-member', async () => {
    state.memberships = [];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/me')
      .set('Authorization', 'Bearer good');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isAdmin: false, orgs: [] });
  });

  it('/me returns isAdmin false for an owner of a non-internal organization', async () => {
    state.memberships = [
      {
        user_id: 'u1',
        role: 'owner',
        organizations: { name: 'Customer Oy', is_internal: false },
      },
    ];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/me')
      .set('Authorization', 'Bearer test-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isAdmin: false, orgs: [] });
  });

  it('/me returns isAdmin true for an owner of the internal organization', async () => {
    state.memberships = [
      {
        user_id: 'u1',
        role: 'owner',
        organizations: { name: 'DWS AB', is_internal: true },
      },
    ];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/me')
      .set('Authorization', 'Bearer test-token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isAdmin: true, orgs: ['DWS AB'] });
  });

  it('/me ignores a spoofed user_metadata role without a membership', async () => {
    state.user = { id: 'u1', email: 'a@x.fi', user_metadata: { role: 'backoffice_admin' } };
    state.memberships = [];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/me')
      .set('Authorization', 'Bearer good');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isAdmin: false, orgs: [] });
  });

  it('/me returns section memberships without granting admin', async () => {
    state.memberships = [
      {
        user_id: 'u1',
        role: 'member',
        organizations: { name: 'Situation Room', is_internal: true },
      },
    ];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/me')
      .set('Authorization', 'Bearer good');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ isAdmin: false, orgs: ['Situation Room'] });
  });

  it('rejects an owner of a non-internal organization from protected routes', async () => {
    state.memberships = [
      {
        user_id: 'u1',
        role: 'owner',
        organizations: { name: 'Customer Oy', is_internal: false },
      },
    ];
    const res = await request(buildApp())
      .get('/api/v1/backoffice/stats')
      .set('Authorization', 'Bearer test-token');
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
