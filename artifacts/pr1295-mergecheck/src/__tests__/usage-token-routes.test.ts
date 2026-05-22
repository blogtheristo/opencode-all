import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: (req: Request, _res: Response, next: NextFunction) => {
    (req as Request & { userId: string }).userId = '11111111-2222-3333-4444-555555555555';
    (req as Request & { userRole: 'member' }).userRole = 'member';
    next();
  },
  requireRole: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => null,
}));

const { default: usageRouter } = await import('../routes/usage.routes.js');
const { tokenUsageService } = await import('../services/token-usage.service.js');

function buildApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/usage', usageRouter);
  return app;
}

describe('Usage token routes', () => {
  beforeEach(() => {
    tokenUsageService.resetForTests();
    vi.clearAllMocks();
  });

  it('ingests token usage events', async () => {
    const app = buildApp();
    const response = await request(app)
      .post('/api/v1/usage/tokens/ingest')
      .send({
        events: [
          {
            provider: 'anthropic',
            product: 'claude-code',
            model: 'claude-sonnet-4.5',
            promptTokens: 1000,
            completionTokens: 500,
            cachedTokens: 100,
            sessionId: 'sess-1',
            taskId: 'task-1',
            timestamp: new Date().toISOString(),
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.ingested).toBe(1);
    expect(response.body.duplicate).toBe(0);
    expect(response.body.totalCostEur).toBeGreaterThan(0);
  });

  it('rejects invalid ingest payload', async () => {
    const app = buildApp();
    const response = await request(app).post('/api/v1/usage/tokens/ingest').send({
      events: [{ provider: 'anthropic' }],
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });

  it('returns token summary for the period', async () => {
    const app = buildApp();
    await request(app)
      .post('/api/v1/usage/tokens/ingest')
      .send({
        events: [
          {
            provider: 'anthropic',
            product: 'claude-code',
            model: 'claude-sonnet-4.5',
            promptTokens: 1200,
            completionTokens: 800,
            cachedTokens: 0,
            sessionId: 'sess-2',
            taskId: 'task-2',
            timestamp: new Date().toISOString(),
          },
        ],
      });

    const response = await request(app).get('/api/v1/usage/tokens/summary').query({ periodDays: '30' });

    expect(response.status).toBe(200);
    expect(response.body.totals.totalEvents).toBe(1);
    expect(response.body.totals.totalTokens).toBe(2000);
    expect(response.body.byModel).toHaveLength(1);
    expect(response.body.byModel[0].model).toBe('claude-sonnet-4.5');
  });

  it('sets and returns token budget', async () => {
    const app = buildApp();
    const setResponse = await request(app).post('/api/v1/usage/tokens/budgets').send({
      dailyLimitTokens: 10000,
      monthlyLimitTokens: 200000,
      monthlyLimitEur: 120,
      hardCap: true,
      notifyThresholds: [50, 80, 95],
    });

    expect(setResponse.status).toBe(200);
    expect(setResponse.body.budget.hardCap).toBe(true);

    const getResponse = await request(app).get('/api/v1/usage/tokens/budgets');
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.budget.monthlyLimitEur).toBe(120);
    expect(getResponse.body.budget.notifyThresholds).toEqual([50, 80, 95]);
  });

  it('returns budget threshold breaches in summary', async () => {
    const app = buildApp();
    await request(app).post('/api/v1/usage/tokens/budgets').send({
      dailyLimitTokens: 10000,
      monthlyLimitTokens: 1000,
      monthlyLimitEur: 1,
      hardCap: true,
      notifyThresholds: [50, 80, 95],
    });

    await request(app)
      .post('/api/v1/usage/tokens/ingest')
      .send({
        events: [
          {
            provider: 'anthropic',
            product: 'claude-code',
            model: 'claude-sonnet-4.5',
            promptTokens: 1200,
            completionTokens: 800,
            cachedTokens: 0,
            sessionId: 'sess-b1',
            taskId: 'task-b1',
            timestamp: new Date().toISOString(),
          },
        ],
      });

    const summaryResponse = await request(app).get('/api/v1/usage/tokens/summary');
    expect(summaryResponse.status).toBe(200);
    expect(summaryResponse.body.budget.usage.hardCapExceeded).toBe(true);
    expect(summaryResponse.body.budget.usage.thresholdBreaches).toContain(50);
    expect(summaryResponse.body.budget.usage.thresholdBreaches).toContain(80);
  });

  it('returns token optimization recommendations', async () => {
    const app = buildApp();
    await request(app).post('/api/v1/usage/tokens/budgets').send({
      dailyLimitTokens: 10000,
      monthlyLimitTokens: 2500,
      monthlyLimitEur: 5,
      hardCap: false,
      notifyThresholds: [50, 80, 95],
    });

    await request(app)
      .post('/api/v1/usage/tokens/ingest')
      .send({
        events: [
          {
            provider: 'anthropic',
            product: 'claude-code',
            model: 'claude-sonnet-4.5',
            promptTokens: 2000,
            completionTokens: 1500,
            cachedTokens: 0,
            sessionId: 'sess-r1',
            taskId: 'task-r1',
            timestamp: new Date().toISOString(),
          },
          {
            provider: 'anthropic',
            product: 'claude-code',
            model: 'claude-sonnet-4.5',
            promptTokens: 1800,
            completionTokens: 1200,
            cachedTokens: 0,
            sessionId: 'sess-r1',
            taskId: 'task-r2',
            timestamp: new Date().toISOString(),
          },
        ],
      });

    const response = await request(app)
      .get('/api/v1/usage/tokens/recommendations')
      .query({ periodDays: '30', sessionId: 'sess-r1' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.recommendations)).toBe(true);
    expect(response.body.recommendations.length).toBeGreaterThan(0);
    expect(response.body.recommendations[0]).toHaveProperty('ruleId');
    expect(response.body.recommendations[0]).toHaveProperty('estimatedSavingsEur');
  });

  it('dedupes repeated token events', async () => {
    const app = buildApp();
    const event = {
      eventId: 'evt-123',
      provider: 'anthropic',
      product: 'claude-code',
      model: 'claude-sonnet-4.5',
      promptTokens: 900,
      completionTokens: 300,
      cachedTokens: 50,
      sessionId: 'sess-d1',
      taskId: 'task-d1',
      timestamp: new Date().toISOString(),
    };

    const first = await request(app).post('/api/v1/usage/tokens/ingest').send({ events: [event] });
    expect(first.status).toBe(201);
    expect(first.body.ingested).toBe(1);
    expect(first.body.duplicate).toBe(0);

    const second = await request(app).post('/api/v1/usage/tokens/ingest').send({ events: [event] });
    expect(second.status).toBe(201);
    expect(second.body.ingested).toBe(0);
    expect(second.body.duplicate).toBe(1);

    const summary = await request(app).get('/api/v1/usage/tokens/summary').query({ periodDays: '30' });
    expect(summary.status).toBe(200);
    expect(summary.body.totals.totalEvents).toBe(1);
  });
});
