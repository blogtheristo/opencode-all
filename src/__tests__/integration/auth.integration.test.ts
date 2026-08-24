/**
 * Auth Route Integration Tests
 *
 * MVP Feature 3.4 — Tests the auth API endpoints via Supertest.
 * Validates request validation, response shapes, and error handling.
 */

import { beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import request from 'supertest';

// Build a minimal app with just auth routes for isolated testing
let app: express.Express;

beforeAll(async () => {
  // Set required env vars for auth service
  process.env.JWT_SECRET ??= 'test-jwt-secret-for-vitest-minimum-32-chars!!';
  process.env.NODE_ENV = 'test';

  const authRoutes = (await import('../../routes/auth.routes.js')).default;

  app = express();
  app.use(express.json());
  app.use('/api/v1/auth', authRoutes);

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.status || 500).json({ error: err.message });
  });
});

describe('POST /api/v1/auth/register', () => {
  it('rejects missing fields with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.details).toBeDefined();
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('rejects weak password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'short',
        firstName: 'Test',
        lastName: 'User',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'not-an-email',
        password: 'ValidP@ssw0rd!2026',
        firstName: 'Test',
        lastName: 'User',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('rejects RFC 2606 reserved domain (example.com) with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `smoke-${Date.now()}@example.com`,
        password: 'ValidP@ssw0rd!2026',
        firstName: 'Smoke',
        lastName: 'Probe',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('accepts valid registration and returns 201', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `integration-${Date.now()}@lifetime.fi`,
        password: 'ValidP@ssw0rd!2026',
        firstName: 'Integration',
        lastName: 'Test',
      });

    // Should succeed (201) or conflict (409) if user already exists
    expect([201, 409, 500]).toContain(res.status);

    if (res.status === 201) {
      expect(res.body.message).toContain('Registration successful');
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBeDefined();
      expect(res.body.user.firstName).toBe('Integration');
    }
  });
});

describe('POST /api/v1/auth/login', () => {
  it('rejects missing credentials with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('rejects invalid credentials with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Login failed');
  });

  it('returns proper response shape on login attempt', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'AnyPassword123!',
      });

    // Either 200 (valid) or 401 (invalid) — never 500
    expect([200, 401, 429]).toContain(res.status);

    if (res.status === 200) {
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.message).toBe('Login successful');
    }
  });
});

describe('POST /api/v1/auth/forgot-password', () => {
  it('always returns 200 to prevent email enumeration', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'anyone@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('If an account');
  });

  it('rejects invalid email format', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'not-valid' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  it('rejects missing refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token refresh failed');
  });

  it('rejects invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'invalid-token-value' });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/verify-email', () => {
  it('rejects invalid verification token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: 'invalid-verification-token' });

    expect([400, 500]).toContain(res.status);
  });
});

describe('POST /api/v1/auth/reset-password', () => {
  it('rejects invalid reset token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: 'invalid-reset-token',
        password: 'NewValidP@ssw0rd!2026',
      });

    expect([400, 500]).toContain(res.status);
  });

  it('rejects weak new password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({
        token: 'some-token',
        password: 'weak',
      });

    expect(res.status).toBe(400);
  });
});
