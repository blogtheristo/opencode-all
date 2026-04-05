/**
 * Activity Routes Smoke Tests
 *
 * Covers the cross-tenant scoping fix from PR #982 review:
 * - GET /api/v1/activity rejects non-UUID userIds with 400 (when supabase present)
 * - GET / falls back to in-memory event bus when supabase is null
 * - GET / builds an org-scoped .or() filter against activity_events
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-982 (PR review coverage)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express, { Express, Request, Response, NextFunction } from 'express';

// ── Mutable supabase mock (can be null or a chainable query builder) ─────
type QueryRecorder = {
  orFilter: string | null;
  table: string | null;
};
const recorder: QueryRecorder = { orFilter: null, table: null };

function buildChainable(data: unknown, count = 0) {
  const chain: Record<string, unknown> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    or: vi.fn((clause: string) => {
      recorder.orFilter = clause;
      return chain;
    }),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockResolvedValue({ data, count, error: null }),
    // await-able terminal when chain ends without .range
    then: (resolve: (v: unknown) => void) => resolve({ data, count, error: null }),
  };
  return chain;
}

let supabaseValue: unknown = null;
vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => supabaseValue,
}));

// ── Mock event bus ───────────────────────────────────────────────────────
vi.mock('../agents/event-bus.js', () => ({
  eventBus: {
    getRecentEvents: vi.fn().mockReturnValue([
      {
        type: 'agent.task_complete',
        source: 'compliance-agent',
        priority: 'normal',
        timestamp: new Date().toISOString(),
        payload: { score: 85 },
      },
    ]),
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

describe('Activity Routes — GET / (supabase=null, fallback)', () => {
  beforeEach(() => {
    supabaseValue = null;
    injectedUserId = '11111111-2222-3333-4444-555555555555';
    recorder.orFilter = null;
    recorder.table = null;
    vi.clearAllMocks();
  });

  it('falls back to in-memory event bus when supabase is unconfigured', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('events');
    expect(res.body.source).toBe('event-bus');
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body.events.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Activity Routes — GET / (supabase present, scoped query)', () => {
  beforeEach(() => {
    injectedUserId = '11111111-2222-3333-4444-555555555555';
    recorder.orFilter = null;
    vi.clearAllMocks();
  });

  it('returns 400 for an invalid user UUID', async () => {
    supabaseValue = {
      from: vi.fn().mockReturnValue(buildChainable([])),
    };
    injectedUserId = 'not-a-uuid';
    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it("builds org-scoped .or() filter from user's active memberships", async () => {
    // Two responses are needed: (1) organization_members lookup,
    // (2) activity_events query. Use a small state machine.
    let call = 0;
    const fromMock = vi.fn((table: string) => {
      call += 1;
      recorder.table = table;
      if (call === 1) {
        // organization_members -> returns one active org
        return buildChainable([{ organization_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' }], 1);
      }
      // activity_events -> empty but no error
      return buildChainable([], 0);
    });
    supabaseValue = { from: fromMock };

    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');

    expect(res.status).toBe(200);
    expect(fromMock).toHaveBeenCalledWith('organization_members');
    expect(fromMock).toHaveBeenCalledWith('activity_events');
    // The .or() filter MUST include user scoping + public + org scoping
    expect(recorder.orFilter).toBeTruthy();
    expect(recorder.orFilter).toContain(`user_id.eq.${injectedUserId}`);
    expect(recorder.orFilter).toContain('visibility.eq.public');
    expect(recorder.orFilter).toContain('visibility.eq.org');
    expect(recorder.orFilter).toContain('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
  });

  it('omits the org clause when user has no active memberships', async () => {
    let call = 0;
    const fromMock = vi.fn(() => {
      call += 1;
      if (call === 1) {
        return buildChainable([], 0); // no memberships
      }
      return buildChainable([], 0);
    });
    supabaseValue = { from: fromMock };

    const app = buildApp();
    const res = await request(app).get('/api/v1/activity');

    expect(res.status).toBe(200);
    expect(recorder.orFilter).toBeTruthy();
    expect(recorder.orFilter).toContain('visibility.eq.public');
    // No org clause should appear when the user has no memberships
    expect(recorder.orFilter).not.toContain('visibility.eq.org');
  });
});
