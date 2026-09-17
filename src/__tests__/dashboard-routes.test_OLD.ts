/**
 * Dashboard Routes Smoke Tests
 *
 * Covers:
 * - GET /summary returns defaults when Supabase/UsageMetering unavailable
 * - GET /health requires admin/owner role
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-982 (PR review coverage)
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

// ── Mock supabase as null (graceful-degradation path) ────────────────────
vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => null,
}));

// ── Mock usage metering to throw (fallback defaults exercised) ───────────
vi.mock('../services/usage-metering.service.js', () => ({
  UsageMeteringService: {
    getUsageStats: vi.fn().mockRejectedValue(new Error('metering unavailable')),
  },
}));

// ── Mock event bus ───────────────────────────────────────────────────────
vi.mock('../agents/event-bus.js', () => ({
  eventBus: {
    getRecentEvents: vi.fn().mockReturnValue([]),
    getSubscriptionCount: vi.fn().mockReturnValue(0),
  },
}));

// ── Mock auth middleware: inject userId + role based on test config ─────
let injectedRole = 'user';
vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: (req: Request, _res: Response, next: NextFunction) => {
    (req as unknown as { userId: string }).userId = '11111111-2222-3333-4444-555555555555';
    (req as unknown as { userRole: string }).userRole = injectedRole;
    (req as unknown as { userEmail: string }).userEmail = 'test@example.com';
    next();
  },
  requireRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const role = (req as unknown as { userRole?: string }).userRole;
    if (!role || !roles.includes(role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
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

// Imports AFTER mocks
import dashboardRouter from '../routes/dashboard.routes.js';

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/dashboard', dashboardRouter);
  return app;
}

describe('Dashboard Routes — GET /summary', () => {
  beforeEach(() => {
    injectedRole = 'user';
    vi.clearAllMocks();
  });

  it('returns aggregated summary with default usage/compliance when deps unavailable', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/v1/dashboard/summary');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('compliance');
    expect(res.body).toHaveProperty('usage');
    expect(res.body).toHaveProperty('agents');
    expect(res.body).toHaveProperty('system');
    expect(res.body.compliance.overallScore).toBe(0);
    expect(res.body.compliance.trend).toBe('stable');
    expect(res.body.system.status).toBe('healthy');
    expect(typeof res.body.system.uptime).toBe('number');
  });
});

describe('Dashboard Routes — GET /health (role-gated)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 403 when caller is not admin/owner', async () => {
    injectedRole = 'user';
    const app = buildApp();
    const res = await request(app).get('/api/v1/dashboard/health');
    expect(res.status).toBe(403);
  });

  it('returns 200 for admin role', async () => {
    injectedRole = 'admin';
    const app = buildApp();
    const res = await request(app).get('/api/v1/dashboard/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('server');
    expect(res.body).toHaveProperty('eventBus');
    expect(res.body).toHaveProperty('database');
  });

  it('returns 200 for owner role', async () => {
    injectedRole = 'owner';
    const app = buildApp();
    const res = await request(app).get('/api/v1/dashboard/health');
    expect(res.status).toBe(200);
  });
});
