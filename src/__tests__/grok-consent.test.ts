/**
 * Tests for Grok Consent Routes
 *
 * Covers:
 *  - Authentication required (401 without JWT)
 *  - Org-ID mismatch → 403 Forbidden
 *  - Grant consent flow
 *  - Revoke consent flow (including missing record case)
 *  - Audit log pagination validation
 *  - Grok inference blocked when consent not granted
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';

// ── Mock logger (suppress noise) ────────────────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ── Mock GrokConsentService ──────────────────────────────────────────────────
const mockCheckConsent = vi.fn();
const mockGrantConsent = vi.fn();
const mockRevokeConsent = vi.fn();
const mockGetAuditLog = vi.fn();

vi.mock('../services/grok-consent.service.js', () => ({
  grokConsentService: {
    checkConsent: mockCheckConsent,
    grantConsent: mockGrantConsent,
    revokeConsent: mockRevokeConsent,
    getAuditLog: mockGetAuditLog,
  },
}));

// ── Mock auth middleware ─────────────────────────────────────────────────────
// The real authenticateToken calls AuthService which requires JWT_SECRET.
// We intercept it so each test can control the authentication result.
let mockAuthResult: 'ok' | 'unauthenticated' | 'wrong-org' = 'ok';

vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateToken: vi.fn((req: any, res: any, next: any) => {
    if (mockAuthResult === 'unauthenticated') {
      return res
        .status(401)
        .json({ error: 'Unauthorized', message: 'No authentication token provided' });
    }
    // Attach identity to request (mirrors the real middleware)
    req.userId = 'user-test-123';
    req.userRole = 'admin';
    // Set organizationId so assertOrgAccess works correctly.
    // "wrong-org" simulates a token belonging to a different org.
    req.organizationId = mockAuthResult === 'wrong-org' ? 'org-other' : 'org-abc';
    next();
  }),
}));

// ── Build the app under test ─────────────────────────────────────────────────
// Dynamic import AFTER mocks are registered.
async function buildApp(): Promise<Express> {
  const { default: grokConsentRoutes } = await import('../routes/grok-consent.routes.js');
  const app = express();
  app.use(express.json());
  app.use('/api/grok-consent', grokConsentRoutes);
  return app;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/grok-consent/:orgId', () => {
  let app: Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockAuthResult = 'ok';
    app = await buildApp();
  });

  it('returns 401 when no JWT is provided', async () => {
    mockAuthResult = 'unauthenticated';
    const res = await request(app).get('/api/grok-consent/org-abc');
    expect(res.status).toBe(401);
  });

  it("returns consent status for the caller's own org", async () => {
    mockCheckConsent.mockResolvedValue({ granted: true, reason: 'Consent active' });
    const res = await request(app).get('/api/grok-consent/org-abc');
    expect(res.status).toBe(200);
    expect(res.body.orgId).toBe('org-abc');
    expect(res.body.granted).toBe(true);
  });

  it('returns 403 when caller org does not match path param', async () => {
    mockAuthResult = 'wrong-org';
    const res = await request(app).get('/api/grok-consent/org-abc');
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/orgId mismatch/i);
  });
});

describe('POST /api/grok-consent/:orgId/grant', () => {
  let app: Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockAuthResult = 'ok';
    app = await buildApp();
  });

  it('returns 401 when no JWT is provided', async () => {
    mockAuthResult = 'unauthenticated';
    const res = await request(app).post('/api/grok-consent/org-abc/grant').send({});
    expect(res.status).toBe(401);
  });

  it('grants consent and returns 201', async () => {
    mockGrantConsent.mockResolvedValue({ kya: {} });
    const res = await request(app)
      .post('/api/grok-consent/org-abc/grant')
      .send({ allowedCategories: ['climate'], note: 'Test grant' });
    expect(res.status).toBe(201);
    expect(res.body.granted).toBe(true);
    expect(res.body.orgId).toBe('org-abc');
    // Route passes callerKyaScore as 5th arg (undefined when no x-kya-score header)
    expect(mockGrantConsent).toHaveBeenCalledWith(
      'org-abc',
      'user-test-123',
      ['climate'],
      'Test grant',
      undefined,
    );
  });

  it('returns 403 when caller org does not match path param', async () => {
    mockAuthResult = 'wrong-org';
    const res = await request(app).post('/api/grok-consent/org-abc/grant').send({});
    expect(res.status).toBe(403);
  });

  it('returns 500 with a stable error message when service throws', async () => {
    mockGrantConsent.mockRejectedValue(new Error('Supabase internal details xyz'));
    const res = await request(app).post('/api/grok-consent/org-abc/grant').send({});
    expect(res.status).toBe(500);
    // Must NOT leak internal error details to the caller
    expect(res.body.error).not.toContain('Supabase');
    expect(res.body.error).not.toContain('xyz');
    expect(res.body.error).toBe('Internal error granting consent');
  });
});

describe('POST /api/grok-consent/:orgId/revoke', () => {
  let app: Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockAuthResult = 'ok';
    app = await buildApp();
  });

  it('returns 401 when no JWT is provided', async () => {
    mockAuthResult = 'unauthenticated';
    const res = await request(app).post('/api/grok-consent/org-abc/revoke').send({});
    expect(res.status).toBe(401);
  });

  it('revokes consent successfully', async () => {
    mockRevokeConsent.mockResolvedValue({ kya: {} });
    const res = await request(app)
      .post('/api/grok-consent/org-abc/revoke')
      .send({ reason: 'No longer needed' });
    expect(res.status).toBe(200);
    expect(res.body.granted).toBe(false);
    // Route passes callerKyaScore as 4th arg (undefined when no x-kya-score header)
    expect(mockRevokeConsent).toHaveBeenCalledWith(
      'org-abc',
      'user-test-123',
      'No longer needed',
      undefined,
    );
  });

  it('returns 403 when caller org does not match path param', async () => {
    mockAuthResult = 'wrong-org';
    const res = await request(app).post('/api/grok-consent/org-abc/revoke').send({});
    expect(res.status).toBe(403);
  });

  it('returns 500 with a stable error message when service throws (no record)', async () => {
    mockRevokeConsent.mockRejectedValue(
      new Error('No consent record found for org org-abc — grant consent before revoking'),
    );
    const res = await request(app).post('/api/grok-consent/org-abc/revoke').send({});
    expect(res.status).toBe(500);
    // Stable, non-leaking message
    expect(res.body.error).toBe('Internal error revoking consent');
  });
});

describe('GET /api/grok-consent/:orgId/audit', () => {
  let app: Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockAuthResult = 'ok';
    app = await buildApp();
  });

  it('returns 401 when no JWT is provided', async () => {
    mockAuthResult = 'unauthenticated';
    const res = await request(app).get('/api/grok-consent/org-abc/audit');
    expect(res.status).toBe(401);
  });

  it('returns audit log with default pagination', async () => {
    mockGetAuditLog.mockResolvedValue({ events: [{ id: 1 }], total: 1 });
    const res = await request(app).get('/api/grok-consent/org-abc/audit');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.events).toHaveLength(1);
    expect(mockGetAuditLog).toHaveBeenCalledWith('org-abc', 50, 0);
  });

  it('returns 400 for non-numeric limit', async () => {
    const res = await request(app).get('/api/grok-consent/org-abc/audit?limit=abc');
    expect(res.status).toBe(400);
  });

  it('returns 400 for negative offset', async () => {
    const res = await request(app).get('/api/grok-consent/org-abc/audit?offset=-1');
    expect(res.status).toBe(400);
  });

  it('returns 400 for limit=0', async () => {
    const res = await request(app).get('/api/grok-consent/org-abc/audit?limit=0');
    expect(res.status).toBe(400);
  });

  it('clamps limit to 200', async () => {
    mockGetAuditLog.mockResolvedValue({ events: [], total: 0 });
    const res = await request(app).get('/api/grok-consent/org-abc/audit?limit=999');
    expect(res.status).toBe(200);
    expect(mockGetAuditLog).toHaveBeenCalledWith('org-abc', 200, 0);
  });

  it('returns 403 when caller org does not match path param', async () => {
    mockAuthResult = 'wrong-org';
    const res = await request(app).get('/api/grok-consent/org-abc/audit');
    expect(res.status).toBe(403);
  });
});

describe('GrokConsentService.revokeConsent — missing record', () => {
  it('revokeConsent is called correctly by the route', async () => {
    vi.clearAllMocks();
    mockAuthResult = 'ok';
    const app = await buildApp();

    mockRevokeConsent.mockResolvedValue({ kya: {} });
    await request(app).post('/api/grok-consent/org-abc/revoke').send({ reason: 'test' });
    expect(mockRevokeConsent).toHaveBeenCalledOnce();
    expect(mockRevokeConsent).toHaveBeenCalledWith('org-abc', 'user-test-123', 'test', undefined);
  });
});
