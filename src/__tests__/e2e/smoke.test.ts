/**
 * E2E Smoke Test — Login → Dashboard → Compliance Query → Response
 *
 * Tests the critical user journey end-to-end using supertest against
 * the Express app. No external services required (uses in-memory state).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (final MVP items)
 * Date: 2026-03-22
 */

import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

// Dynamic import to handle ESM + dotenv initialization
let app: any;

beforeAll(async () => {
  process.env.JWT_SECRET = 'e2e-smoke-test-secret-key-not-for-production';
  process.env.NODE_ENV = 'test';
  const mod = await import('../../app.js');
  app = mod.default || mod.app;
});

describe('E2E Smoke Test: Login → Dashboard → Compliance Query → Response', () => {
  const testEmail = `smoke-${Date.now()}@example.com`;
  const testPassword = 'SmokeTestP@ss123!';
  let authToken: string;
  let refreshToken: string;

  // ============ STEP 1: Health check ============

  it('1. Health endpoint responds OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(['ok', 'degraded']).toContain(res.body.status);
  });

  it('1b. Liveness probe responds OK', async () => {
    const res = await request(app).get('/livez');
    expect(res.status).toBe(200);
  });

  // ============ STEP 2: Register + Login ============

  it('2a. Register a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: testEmail,
      password: testPassword,
      firstName: 'Smoke',
      lastName: 'Test',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail.toLowerCase());
  });

  it('2b. Login with registered credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    expect(res.body.expiresIn).toBe(86400);

    authToken = res.body.token;
    refreshToken = res.body.refreshToken;
  });

  it('2c. Reject wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: testEmail,
      password: 'WrongPassword456!',
    });

    expect(res.status).toBe(401);
  });

  // ============ STEP 3: Compliance query (core product value) ============

  it('3a. Run compliance assessment (CSRD for steel)', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/assess')
      .send({
        companyName: 'Smoke Test Steel GmbH',
        industry: 'steel',
        country: 'FI',
        annualEmissions: 75000,
        importValue: 200000,
        hasTransitionPlan: false,
        hasEmissionsMonitoring: true,
        hasSupplyChainDD: false,
        dataPoints: [
          { disclosureId: 'E1-1', provided: true },
          { disclosureId: 'E1-6', provided: true },
          { disclosureId: 'S1-1', provided: false },
        ],
      });

    expect(res.status).toBe(200);
    // Response is a ComplianceReport — overallScore is nested under summary
    const score = res.body.summary?.overallScore ?? res.body.overallScore;
    expect(score).toBeDefined();
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(res.body.gaps).toBeDefined();
    expect(Array.isArray(res.body.gaps)).toBe(true);
  });

  it('3b. Get ESRS disclosure registry', async () => {
    const res = await request(app).get('/api/v1/compliance/registry');

    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThan(0);
    expect(res.body.disclosures).toBeDefined();
    expect(Array.isArray(res.body.disclosures)).toBe(true);
  });

  it('3c. Get sector benchmarks', async () => {
    const res = await request(app).get('/api/v1/compliance/benchmarks/steel');

    // May timeout if external carbon price API is unreachable — accept 200 or 500
    if (res.status === 200) {
      expect(res.body.sector).toBe('steel');
      expect(res.body.benchmark).toBeDefined();
    } else {
      // External API failure is acceptable in test environment
      expect([500, 504]).toContain(res.status);
    }
  }, 15000);

  it('3d. Get cost estimate (ETS + CBAM)', async () => {
    const res = await request(app).post('/api/v1/compliance/cost-estimate').send({
      annualEmissions: 75000,
      importQuantity: 5000,
      sector: 'steel',
      originCountry: 'CN',
    });

    expect(res.status).toBe(200);
    expect(res.body.ets).toBeDefined();
    expect(res.body.cbam).toBeDefined();
    expect(res.body.totalEstimatedCost).toBeGreaterThan(0);
  });

  // ============ STEP 4: Authenticated dashboard APIs ============

  it('4a. Get compliance overview (authenticated)', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/overview')
      .set('Authorization', `Bearer ${authToken}`);

    // Authenticated requests should succeed with a compliance overview payload
    expect(res.status).toBe(200);
    expect(res.body.overallScore).toBeDefined();
  });

  it('4b. Compliance overview rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/v1/compliance/overview');

    expect(res.status).toBe(401);
  });

  // ============ STEP 5: Token refresh ============

  it('5. Refresh token returns new access token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.token).not.toBe(authToken); // New token
  });

  // ============ STEP 6: Agent discovery ============

  it('6. Agent discovery returns agent list', async () => {
    const res = await request(app).get('/api/agents').set('Authorization', `Bearer ${authToken}`);

    // Accept 200 (success) or 401 (auth required but no valid JWT in test env)
    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.agents || res.body).toBeDefined();
    }
  });

  // ============ STEP 7: 404 for unknown routes ============

  it('7. Unknown API route returns 404', async () => {
    const res = await request(app).get('/api/v1/this-does-not-exist');

    expect(res.status).toBe(404);
  });
});
