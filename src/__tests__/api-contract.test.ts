/**
 * API Contract Tests — auth routes over real HTTP (supertest)
 *
 * Exercises the actual Express middleware chain (validation -> handler) for
 * the auth surface, in the backend's self-contained in-memory mode (no
 * Supabase, no SMTP). Pins the public contract: status codes and response
 * shapes that clients depend on.
 */

import { beforeAll, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';

// Quiet, dependency-free email + notification side effects.
vi.mock('../services/email.service.js', () => ({
  default: {
    sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
    sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  },
}));

let app: express.Express;

beforeAll(async () => {
  const authRoutes = (await import('../routes/auth.routes.js')).default;
  app = express();
  app.use(express.json());
  app.use('/api/v1/auth', authRoutes);
  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
});

describe('POST /api/v1/auth/register', () => {
  it('rejects invalid payloads with 400 and validation errors', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('details');
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.error).toBe('Validation Error');
  });

  it('registers a new user with 201 and a sanitized user shape', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `contract-${Date.now()}@contract.exampleco.dev`,
        password: 'Contract-Test-Passw0rd!',
        firstName: 'Con',
        lastName: 'Tract',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Registration successful/i);
    // Contract: password/hash must never appear in the response
    expect(res.body.user).toBeDefined();
    expect(Object.keys(res.body.user)).not.toContain('password');
    expect(Object.keys(res.body.user)).not.toContain('passwordHash');
    expect(res.body.user.email).toContain('@contract.exampleco.dev');
  });

  it('returns 409 when the email is already registered', async () => {
    const email = `contract-dup-${Date.now()}@contract.exampleco.dev`;
    const payload = { email, password: "Contract-Test-Passw0rd!", firstName: "Con", lastName: "Tract" };

    const first = await request(app).post('/api/v1/auth/register').send(payload);
    expect(first.status).toBe(201);

    const second = await request(app).post('/api/v1/auth/register').send(payload);
    expect(second.status).toBe(409);
    expect(second.body.error).toBe('Registration failed');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('rejects malformed logins with 400', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ password: 'x' });

    expect(res.status).toBe(400);
  });

  it('authenticates a freshly registered user and returns a token contract', async () => {
    const email = `contract-login-${Date.now()}@contract.exampleco.dev`;
    const password = 'Contract-Test-Passw0rd!';

    await request(app).post('/api/v1/auth/register').send({
      email,
      password,
      firstName: 'Con',
      lastName: 'Tract',
    });

    const res = await request(app).post('/api/v1/auth/login').send({ email, password });

    expect(res.status).toBe(200);
    expect(typeof res.body.token === 'string' || typeof res.body.accessToken === 'string').toBe(
      true,
    );
    expect(JSON.stringify(res.body)).not.toContain(password);
  });

  it('rejects a valid-shaped login with wrong credentials (401)', async () => {
    const email = `contract-wrongpw-${Date.now()}@contract.exampleco.dev`;

    await request(app).post('/api/v1/auth/register').send({
      email,
      password: 'Correct-Horse-1!',
      firstName: 'Con',
      lastName: 'Tract',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'Definitely-Wrong-1!' });

    expect([401, 403]).toContain(res.status);
  });
});
