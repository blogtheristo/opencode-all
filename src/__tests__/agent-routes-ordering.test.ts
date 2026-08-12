/**
 * Agent Routes — Route Ordering Regression Test
 *
 * Guards against the bug fixed in claude/fix-mvp-features-NW3Sy where
 * the generic /:name route was declared BEFORE /discover/:capability,
 * /workflows, and /events. Express matches routes in order, so the
 * specific routes were being swallowed by /:name and treated as agent
 * lookups (returning 404 "Agent 'discover' not found").
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-fix-mvp-features
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

// ── Mock agent registry ──────────────────────────────────────────────────
const mockAgent = {
  getConfig: () => ({ name: 'test-agent', description: 'test' }),
};
const discoverAgentsMock = vi
  .fn()
  .mockReturnValue([{ name: 'carbon-scout', capability: 'carbon' }]);
const getAgentMock = vi.fn().mockReturnValue(mockAgent);
const listAgentsMock = vi.fn().mockReturnValue([{ name: 'test-agent' }]);

vi.mock('../agents/index.js', () => ({
  agentRegistry: {
    getAgent: (name: string) => getAgentMock(name),
    listAgents: () => listAgentsMock(),
    discoverAgents: (cap: string) => discoverAgentsMock(cap),
    executeAgent: vi.fn(),
  },
}));

// ── Mock event bus ───────────────────────────────────────────────────────
vi.mock('../agents/event-bus.js', () => ({
  eventBus: {
    getRecentEvents: vi
      .fn()
      .mockReturnValue([{
        type: 'agent.started',
        source: 'test',
        payload: {},
        priority: 'normal',
        timestamp: '2026-04-15T06:00:00Z',
        orgId: 'org-1',
        sessionId: 'sess-1',
      }]),
  },
}));

// ── Mock workflow registry ───────────────────────────────────────────────
vi.mock('../agents/workflows.js', () => ({
  WORKFLOW_REGISTRY: new Map([
    [
      'compliance-assessment',
      {
        description: 'Full compliance flow',
        version: '1.0.0',
        steps: [{ name: 's1' }, { name: 's2' }],
        timeoutMs: 60000,
      },
    ],
  ]),
  executeWorkflow: vi.fn(),
}));

// ── Mock auth: always inject a user ──────────────────────────────────────
vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: (req: Request, _res: Response, next: NextFunction) => {
    (req as unknown as { userId: string }).userId = 'user-123';
    (req as unknown as { organizationId: string }).organizationId = 'org-1';
    next();
  },
}));

// ── Suppress logger ──────────────────────────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// Imports AFTER mocks
import agentRouter from '../agents/routes.js';

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/agents', agentRouter);
  return app;
}

describe('Agent Routes — specific routes before /:name catch-all', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    discoverAgentsMock.mockReturnValue([{ name: 'carbon-scout', capability: 'carbon' }]);
    getAgentMock.mockReturnValue(mockAgent);
  });

  it('GET /discover/:capability reaches the discovery handler, not /:name', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/agents/discover/carbon');

    // If route ordering were wrong, this would call getAgent('discover') and
    // return 404 with availableAgents[]. We assert the discovery handler ran.
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('capability', 'carbon');
    expect(res.body).toHaveProperty('agents');
    expect(Array.isArray(res.body.agents)).toBe(true);
    expect(discoverAgentsMock).toHaveBeenCalledWith('carbon');
    expect(getAgentMock).not.toHaveBeenCalledWith('discover');
  });

  it('GET /workflows reaches the workflows handler, not /:name', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/agents/workflows');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('workflows');
    expect(res.body).toHaveProperty('count', 1);
    expect(res.body.workflows[0]).toMatchObject({
      name: 'compliance-assessment',
      steps: 2,
    });
    expect(getAgentMock).not.toHaveBeenCalledWith('workflows');
  });

  it('GET /events reaches the events handler, not /:name', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/agents/events');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('events');
    expect(Array.isArray(res.body.events)).toBe(true);
    expect(res.body.events[0]).toMatchObject({ type: 'agent.started' });
    expect(getAgentMock).not.toHaveBeenCalledWith('events');
  });

  it('GET /:name still works for legitimate agent lookups', async () => {
    const app = buildApp();
    const res = await request(app).get('/api/agents/test-agent');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('agent');
    expect(getAgentMock).toHaveBeenCalledWith('test-agent');
  });
});
