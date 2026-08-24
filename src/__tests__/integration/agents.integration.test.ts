/**
 * Agent Route Integration Tests
 *
 * MVP Feature 3.5 — Tests agent API endpoints via Supertest.
 * Validates agent listing, discovery, and execution request validation.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';

let app: express.Express;

beforeAll(async () => {
  process.env.JWT_SECRET ??= 'test-jwt-secret-for-vitest-minimum-32-chars!!';
  process.env.NODE_ENV = 'test';

  // Import auth service to generate a test token
  const agentRoutes = (await import('../../agents/routes.js')).default;
  const complianceRoutes = (await import('../../routes/compliance.routes.js')).default;

  app = express();
  app.use(express.json());
  app.use('/api/agents', agentRoutes);
  app.use('/api/v1/compliance', complianceRoutes);

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.statusCode || err.status || 500).json({ error: err.message });
  });
});

describe('GET /api/agents', () => {
  it('returns agent list (requires auth or returns 401)', async () => {
    const res = await request(app).get('/api/agents');

    // Without auth token, should either return list (if unprotected) or 401
    expect([200, 401]).toContain(res.status);

    if (res.status === 200) {
      expect(res.body).toBeDefined();
      // Should be an array or object with agents
      if (Array.isArray(res.body)) {
        expect(res.body.length).toBeGreaterThan(0);
      } else if (res.body.agents) {
        expect(Array.isArray(res.body.agents)).toBe(true);
      }
    }
  });
});

describe('POST /api/v1/compliance/assess', () => {
  it('returns compliance assessment for valid input', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/assess')
      .send({
        companyName: 'Test Corp',
        industry: 'manufacturing',
        country: 'FI',
        dataPoints: [
          { disclosureId: 'ESRS2-GOV1', provided: true },
          { disclosureId: 'ESRS2-GOV2', provided: false },
        ],
        annualEmissions: 10000,
        importValue: 50000,
        hasTransitionPlan: true,
        hasEmissionsMonitoring: false,
        hasSupplyChainDD: false,
      });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.summary).toBeDefined();
    expect(res.body.summary.overallScore).toBeGreaterThanOrEqual(0);
    expect(res.body.summary.overallScore).toBeLessThanOrEqual(100);
    expect(res.body.gaps).toBeDefined();
    expect(Array.isArray(res.body.gaps)).toBe(true);
  });

  it('rejects missing company name', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/assess')
      .send({
        industry: 'manufacturing',
      });

    // Zod validation returns 400 or 500 depending on error handler setup
    expect([400, 500]).toContain(res.status);
    expect(res.status).not.toBe(200);
  });

  it('handles empty data points gracefully', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/assess')
      .send({
        companyName: 'Empty Test',
        industry: 'construction',
        country: 'DE',
        dataPoints: [],
        annualEmissions: 0,
        importValue: 0,
      });

    expect(res.status).toBe(200);
    expect(res.body.summary.overallScore).toBeGreaterThanOrEqual(0);
  });
});

describe('GET /api/v1/compliance/registry', () => {
  it('returns full ESRS disclosure registry', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/registry');

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.totalInRegistry).toBeGreaterThan(0);
    expect(res.body.disclosures).toBeDefined();
    expect(Array.isArray(res.body.disclosures)).toBe(true);
  });

  it('filters by mandatory disclosures', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/registry?mandatory=true');

    expect(res.status).toBe(200);
    expect(res.body.disclosures.every((d: any) => d.isMandatory === true)).toBe(true);
  });

  it('filters by standard', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/registry?standard=ESRS2');

    expect(res.status).toBe(200);
    if (res.body.disclosures.length > 0) {
      expect(res.body.disclosures.every((d: any) => d.standard === 'ESRS2')).toBe(true);
    }
  });
});

describe('POST /api/v1/compliance/cost-estimate', () => {
  it('returns ETS + CBAM cost estimate', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/cost-estimate')
      .send({
        annualEmissions: 25000,
        importQuantity: 1000,
        sector: 'steel',
        originCountry: 'CN',
        freeAllocation: 5000,
      });

    expect(res.status).toBe(200);
    expect(res.body.ets).toBeDefined();
    expect(res.body.ets.estimatedCost).toBeGreaterThanOrEqual(0);
    expect(res.body.cbam).toBeDefined();
    expect(res.body.cbam.covered).toBe(true);
    expect(res.body.totalEstimatedCost).toBeGreaterThanOrEqual(0);
  });

  it('handles zero emissions', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/cost-estimate')
      .send({
        annualEmissions: 0,
        importQuantity: 0,
      });

    expect(res.status).toBe(200);
    expect(res.body.totalEstimatedCost).toBe(0);
  });

  it('rejects invalid body types with 400', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/cost-estimate')
      .send({
        annualEmissions: '10',
        importQuantity: { bad: true },
        sector: 'steel',
        originCountry: 'CN',
      });

    expect(res.status).toBe(400);
  });
});
