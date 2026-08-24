/**
 * Activity Routes Smoke Tests
 *
 * Covers the cross-tenant scoping fix from PR #982 review:
 * - GET / rejects non-UUID userIds with 400
 * - GET / builds an org-scoped .or() filter against activity_events
 *   (user_id scoping + public visibility + org scoping only for orgs
 *    the caller is an active member of).
 *
 * Note: activity.routes.ts captures getSupabaseClient() at module-load,
 * so the mocked client must be set BEFORE the route import and cannot
 * be toggled between describe blocks. The null-fallback path is covered
 * separately in activity-routes-fallback.test.ts.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-982 (PR review coverage)
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

// ── Record what the route calls on supabase ──────────────────────────────
// Hoisted so the vi.mock() factory below (which is itself hoisted above
// all top-level `const` declarations) can safely close over them.
const { recorder, responseQueue, fakeSupabase } = vi.hoisted(() => {
  const rec = {
    orFilter: null as string | null,
    tablesQueried: [] as string[],
  };
  const queue: Array<{ data: unknown; count: number }> = [];

   
  function chainable(response: { data: unknown; count: number }): any {
     
    const chain: Record<string, any> = {
      select: (..._args: unknown[]) => chain,
      eq: (..._args: unknown[]) => chain,
      in: (..._args: unknown[]) => chain,
      or: (clause: string) => {
        rec.orFilter = clause;
        return chain;
      },
      order: (..._args: unknown[]) => chain,
      range: async () => ({ ...response, error: null }),
      // Thenable for chains that don't terminate in .range (memberships lookup)
      then: (resolve: (v: unknown) => void) => resolve({ ...response, error: null }),
    };
    return chain;
  }

  const supa = {
    from: (table: string) => {
      rec.tablesQueried.push(table);
      const next = queue.shift() || { data: [], count: 0 };
      return chainable(next);
    },
  };

  return { recorder: rec, responseQueue: queue, fakeSupabase: supa };
});

vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => fakeSupabase,
}));

// ── Mock event bus (only needed for /stream, not GET /) ─────────────────
vi.mock('../agents/event-bus.js', () => ({
  eventBus: {
    getRecentEvents: vi.fn().mockReturnValue([]),
    subscribe: vi.fn().mockReturnValue(() => {}),
  },
}));

// ── Mock auth middleware: inject userId (valid UUID by default) ─────────
let injectedUserId = '11111111-2222-3333-4444-555555555555';
vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: (req: Request, _res: Response, next: NextFunction) => {
    (req as unknown as { userId: string }).userId = injectedUserId;
    next();
  },
}));

// ── Suppress logger noise ────────────────────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import activityRouter from '../routes/activity.routes.js';

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/activity', activityRouter);
  return app;
}

describe('Activity Routes — GET / (org-scoped query)', () => {
  beforeEach(() => {
    recorder.orFilter = null;
    recorder.tablesQueried = [];
    responseQueue.length = 0;
    injectedUserId = '11111111-2222-3333-4444-555555555555';
    vi.clearAllMocks();
  });

  it('returns 400 for an invalid user UUID', async () => {
    injectedUserId = 'not-a-uuid';
    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it("builds org-scoped .or() filter from user's active memberships", async () => {
    // 1st from(): organization_members -> returns one active org
    // 2nd from(): activity_events -> empty result
    responseQueue.push({
      data: [{ organization_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }],
      count: 1,
    });
    responseQueue.push({ data: [], count: 0 });

    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');

    expect(res.status).toBe(200);
    expect(recorder.tablesQueried).toContain('organization_members');
    expect(recorder.tablesQueried).toContain('activity_events');
    // The .or() filter MUST include user scoping + public + org scoping
    expect(recorder.orFilter).toBeTruthy();
    expect(recorder.orFilter).toContain(`user_id.eq.${injectedUserId}`);
    expect(recorder.orFilter).toContain('visibility.eq.public');
    expect(recorder.orFilter).toContain('visibility.eq.org');
    expect(recorder.orFilter).toContain('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
  });

  it('omits the org clause when user has no active memberships', async () => {
    responseQueue.push({ data: [], count: 0 }); // no memberships
    responseQueue.push({ data: [], count: 0 });

    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');

    expect(res.status).toBe(200);
    expect(recorder.orFilter).toBeTruthy();
    expect(recorder.orFilter).toContain('visibility.eq.public');
    // No org clause should appear when the user has no memberships
    expect(recorder.orFilter).not.toContain('visibility.eq.org');
  });
});
