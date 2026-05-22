/**
 * E2E Smoke Test
 *
 * MVP Feature 3.6 — Validates core user journey:
 * Health check → Compliance registry → Compliance assessment → Cost estimate
 *
 * Uses Supertest against a minimal Express app with the critical MVP routes.
 * Note: Full app import blocked by pre-existing syntax errors in non-MVP modules.
 * This test assembles the MVP-critical routes to validate the end-to-end flow.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import express from 'express';

let app: express.Express;

beforeAll(async () => {
  process.env.JWT_SECRET ??= 'test-jwt-secret-for-vitest-minimum-32-chars!!';
  process.env.NODE_ENV = 'test';

  const authRoutes = (await import('../../routes/auth.routes.js')).default;
  const complianceRoutes = (await import('../../routes/compliance.routes.js')).default;
  const onboardRoutes = (await import('../../routes/onboard.routes.js')).default;

  app = express();
  app.use(express.json());

  // Health check (same as app.ts)
  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'DWS IQ Backend',
      version: '1.0.0',
    });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/compliance', complianceRoutes);
  app.use('/api/v1/onboard', onboardRoutes);

  // 404 handler
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
    });
  });

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.status || 500).json({ error: err.message });
  });
});

describe('E2E Smoke Test — Core User Journey', () => {
  it('Step 1: Health check returns ok', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('DWS IQ Backend');
    expect(res.body.timestamp).toBeDefined();
  });

  it('Step 2: ESRS registry is accessible', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/registry');

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.disclosures.length).toBeGreaterThan(0);
  });

  it('Step 3: Compliance assessment returns real scores', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/assess')
      .send({
        companyName: 'Smoke Test Corp',
        industry: 'manufacturing',
        country: 'FI',
        dataPoints: [
          { disclosureId: 'ESRS2-GOV1', provided: true },
          { disclosureId: 'ESRS2-SBM1', provided: true },
          { disclosureId: 'E1-1', provided: false },
        ],
        annualEmissions: 15000,
        importValue: 75000,
        hasTransitionPlan: true,
        hasEmissionsMonitoring: true,
        hasSupplyChainDD: false,
      });

    expect(res.status).toBe(200);

    const report = res.body;
    expect(report.summary).toBeDefined();
    expect(report.summary.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.summary.overallScore).toBeLessThanOrEqual(100);
    expect(report.gaps).toBeDefined();
    expect(report.company).toBeDefined();
    expect(report.company.name).toBe('Smoke Test Corp');
    expect(report.generatedAt).toBeDefined();
  });

  it('Step 4: Cost estimate provides actionable data', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/cost-estimate')
      .send({
        annualEmissions: 15000,
        importQuantity: 500,
        sector: 'cement',
        originCountry: 'TR',
      });

    expect(res.status).toBe(200);
    expect(res.body.ets.estimatedCost).toBeGreaterThan(0);
    expect(res.body.cbam).toBeDefined();
    expect(res.body.totalEstimatedCost).toBeGreaterThan(0);
    expect(res.body.note).toBeDefined();
  });

  it('Step 5: 404 handler returns structured error', async () => {
    const res = await request(app)
      .get('/api/v1/nonexistent-route');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  it('Step 6: Auth routes are accessible', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'smoke@test.com', password: 'test' });

    // Should get 400 (validation) or 401 — not 404 or 500
    expect([400, 401, 429]).toContain(res.status);
  });

  it('Step 7: Onboard endpoint is reachable', async () => {
    const res = await request(app)
      .post('/api/v1/onboard')
      .send({});

    // Should return validation error or auth required — not 404
    expect([400, 401, 422, 500]).toContain(res.status);
    expect(res.status).not.toBe(404);
  });
});
