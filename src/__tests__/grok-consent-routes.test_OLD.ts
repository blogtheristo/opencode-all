/**
 * Tests for Grok Consent Routes — GDPR + EU AI Act Article 12 compliance gate
 *
 * Covers:
 *   - orgId mismatch → 403 Forbidden
 *   - GET /:orgId — consent status
 *   - POST /:orgId/grant — grant consent flow (201)
 *   - POST /:orgId/revoke — revoke consent flow (200)
 *   - GET /:orgId/audit — paginated Article 12 audit log (pagination + cap)
 *   - Service errors → 500
 *   - Grok inference blocked without consent (LLMClient.chat)
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';

// ── Mock the Grok consent service ──────────────────────────────────────────
vi.mock('../services/grok-consent.service.js', () => ({
  grokConsentService: {
    checkConsent: vi.fn(),
    grantConsent: vi.fn(),
    revokeConsent: vi.fn(),
    getAuditLog: vi.fn(),
    logInferenceBlocked: vi.fn(),
    logInferenceEvent: vi.fn(),
  },
  GrokConsentService: vi.fn(),
}));

// ── Suppress logger noise ──────────────────────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ── Pass-through auth middleware so test injection (above the router) wins.
// Without this, router.use(authenticateToken) would 401 every request because
// no Authorization header is set on supertest calls.
vi.mock('../middleware/auth.middleware.js', async () => {
  const { Request, Response } = await import('express');
  void Request;
  void Response;
  return {
    authenticateToken: (_req: unknown, _res: unknown, next: (err?: unknown) => void) => next(),
  };
});

// ── Imports after mocks ────────────────────────────────────────────────────
import grokConsentRoutes from '../routes/grok-consent.routes.js';
import { grokConsentService } from '../services/grok-consent.service.js';
import { LLMClient } from '../agents/llm-client.js';

// ── Helpers ────────────────────────────────────────────────────────────────

const ORG_ID = 'org-acme-456';
const USER_ID = 'user-admin-123';

/**
 * Build a minimal Express app that mounts the consent router.
 * @param callerOrgId  The orgId to inject into req (simulates auth middleware).
 *                     Pass `null` to simulate an unauthenticated / no-org request.
 * @param callerUserId The userId to inject into req.
 */
function buildApp(callerOrgId: string | null, callerUserId = USER_ID): Express {
  const app = express();
  app.use(express.json());

  // Simulate what authenticateToken middleware injects onto the request.
  // The real middleware sets req.organizationId (not req.orgId) — see
  // src/middleware/auth.middleware.ts:279. The route reads this via
  // getCallerOrgId(req) in src/routes/grok-consent.routes.ts.
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (callerOrgId !== null) {
      (req as unknown as Record<string, unknown>).organizationId = callerOrgId;
    }
    (req as unknown as Record<string, unknown>).userId = callerUserId;
    next();
  });

  app.use('/api/grok-consent', grokConsentRoutes);
  return app;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Grok Consent Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── 1. orgId mismatch → 403 ──────────────────────────────────────────────

  describe('orgId mismatch enforcement', () => {
    it('GET /:orgId — returns 403 when caller orgId does not match path param', async () => {
      const app = buildApp('org-other-999');
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}`);
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/orgId mismatch/i);
    });

    it('POST /:orgId/grant — returns 403 when caller orgId does not match path param', async () => {
      const app = buildApp('org-other-999');
      const res = await request(app)
        .post(`/api/grok-consent/${ORG_ID}/grant`)
        .send({ note: 'test' });
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/orgId mismatch/i);
    });

    it('POST /:orgId/revoke — returns 403 when caller orgId does not match path param', async () => {
      const app = buildApp('org-other-999');
      const res = await request(app)
        .post(`/api/grok-consent/${ORG_ID}/revoke`)
        .send({ reason: 'test' });
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/orgId mismatch/i);
    });

    it('GET /:orgId/audit — returns 403 when caller orgId does not match path param', async () => {
      const app = buildApp('org-other-999');
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}/audit`);
      expect(res.status).toBe(403);
      expect(res.body.error).toMatch(/orgId mismatch/i);
    });

    it('allows access when caller orgId matches path param', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: true,
        reason: 'Consent active',
      });
      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}`);
      expect(res.status).toBe(200);
    });

    it('allows access when no orgId is present on the request (internal service token)', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: true,
        reason: 'Consent active',
      });
      const app = buildApp(null); // no orgId → internal service token path
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}`);
      expect(res.status).toBe(200);
    });
  });

  // ── 2. GET /:orgId — consent status ────────────────────────────────────

  describe('GET /:orgId — consent status', () => {
    it('returns consent status when consent is active', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: true,
        reason: 'Consent active',
      });

      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.orgId).toBe(ORG_ID);
      expect(res.body.granted).toBe(true);
      expect(res.body.reason).toBe('Consent active');
    });

    it('returns not-granted status when no consent record exists', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: false,
        reason: 'No consent record found — explicit opt-in required',
      });

      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}`);

      expect(res.status).toBe(200);
      expect(res.body.orgId).toBe(ORG_ID);
      expect(res.body.granted).toBe(false);
    });

    it('returns 500 when the consent service throws', async () => {
      vi.mocked(grokConsentService.checkConsent).mockRejectedValue(
        new Error('Supabase connection refused'),
      );

      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── 3. POST /:orgId/grant — grant consent ───────────────────────────────

  describe('POST /:orgId/grant — grant consent', () => {
    it('returns 201 with correct grant response on success', async () => {
      vi.mocked(grokConsentService.grantConsent).mockResolvedValue({ kya: {} as never });

      const app = buildApp(ORG_ID);
      const res = await request(app)
        .post(`/api/grok-consent/${ORG_ID}/grant`)
        .send({ note: 'Approved by DPO on 2026-03-01' });

      expect(res.status).toBe(201);
      expect(res.body.orgId).toBe(ORG_ID);
      expect(res.body.granted).toBe(true);
      expect(res.body.grantedByUserId).toBe(USER_ID);
      expect(res.body.grantedAt).toBeDefined();
      expect(res.body.message).toMatch(/Article 12/i);
    });

    it('records custom allowedCategories when provided', async () => {
      vi.mocked(grokConsentService.grantConsent).mockResolvedValue({ kya: {} as never });

      const categories = ['climate', 'cbam'];
      const app = buildApp(ORG_ID);
      const res = await request(app)
        .post(`/api/grok-consent/${ORG_ID}/grant`)
        .send({ allowedCategories: categories });

      expect(res.status).toBe(201);
      expect(res.body.allowedCategories).toEqual(categories);

      const mockCall = vi.mocked(grokConsentService.grantConsent).mock.calls[0];
      expect(mockCall[0]).toBe(ORG_ID);
      expect(mockCall[1]).toBe(USER_ID);
      expect(mockCall[2]).toEqual(categories);
    });

    it('uses default categories when allowedCategories is omitted', async () => {
      vi.mocked(grokConsentService.grantConsent).mockResolvedValue({ kya: {} as never });

      const app = buildApp(ORG_ID);
      const res = await request(app).post(`/api/grok-consent/${ORG_ID}/grant`).send({});

      expect(res.status).toBe(201);
      expect(res.body.allowedCategories).toEqual(['climate', 'carbon', 'compliance']);
    });

    it('returns 500 when the consent service throws', async () => {
      vi.mocked(grokConsentService.grantConsent).mockRejectedValue(
        new Error('Supabase not configured — cannot record consent'),
      );

      const app = buildApp(ORG_ID);
      const res = await request(app).post(`/api/grok-consent/${ORG_ID}/grant`).send({});

      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── 4. POST /:orgId/revoke — revoke consent ─────────────────────────────

  describe('POST /:orgId/revoke — revoke consent', () => {
    it('returns 200 with correct revoke response on success', async () => {
      vi.mocked(grokConsentService.revokeConsent).mockResolvedValue({ kya: {} as never });

      const app = buildApp(ORG_ID);
      const res = await request(app)
        .post(`/api/grok-consent/${ORG_ID}/revoke`)
        .send({ reason: 'GDPR withdrawal request ref #4421' });

      expect(res.status).toBe(200);
      expect(res.body.orgId).toBe(ORG_ID);
      expect(res.body.granted).toBe(false);
      expect(res.body.revokedByUserId).toBe(USER_ID);
      expect(res.body.revokedAt).toBeDefined();
      expect(res.body.message).toMatch(/blocked immediately/i);
    });

    it('passes the revocation reason to the service', async () => {
      vi.mocked(grokConsentService.revokeConsent).mockResolvedValue({ kya: {} as never });

      const reason = 'User withdrew consent per GDPR Art. 7(3)';
      const app = buildApp(ORG_ID);
      await request(app).post(`/api/grok-consent/${ORG_ID}/revoke`).send({ reason });

      const mockCall = vi.mocked(grokConsentService.revokeConsent).mock.calls[0];
      expect(mockCall[0]).toBe(ORG_ID);
      expect(mockCall[1]).toBe(USER_ID);
      expect(mockCall[2]).toBe(reason);
    });

    it('returns 500 when the consent service throws', async () => {
      vi.mocked(grokConsentService.revokeConsent).mockRejectedValue(
        new Error('Supabase not configured — cannot record revocation'),
      );

      const app = buildApp(ORG_ID);
      const res = await request(app).post(`/api/grok-consent/${ORG_ID}/revoke`).send({});

      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── 5. GET /:orgId/audit — pagination ───────────────────────────────────

  describe('GET /:orgId/audit — Article 12 audit log', () => {
    const mockEvents = [
      {
        id: 'evt-1',
        org_id: ORG_ID,
        model: 'grok-3',
        status: 'ok',
        logged_at: '2026-03-01T09:00:00Z',
      },
      {
        id: 'evt-2',
        org_id: ORG_ID,
        model: 'grok-3',
        status: 'error',
        logged_at: '2026-03-01T08:00:00Z',
      },
    ];

    it('returns audit events with compliance metadata', async () => {
      vi.mocked(grokConsentService.getAuditLog).mockResolvedValue({
        events: mockEvents,
        total: 2,
      });

      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}/audit`);

      expect(res.status).toBe(200);
      expect(res.body.orgId).toBe(ORG_ID);
      expect(res.body.total).toBe(2);
      expect(res.body.events).toHaveLength(2);
      expect(res.body.compliance).toBeDefined();
      expect(res.body.compliance.regulation).toMatch(/Article 12/i);
    });

    it('uses default limit=50 and offset=0 when not specified', async () => {
      vi.mocked(grokConsentService.getAuditLog).mockResolvedValue({ events: [], total: 0 });

      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}/audit`);

      expect(res.status).toBe(200);
      expect(res.body.limit).toBe(50);
      expect(res.body.offset).toBe(0);

      const mockCall = vi.mocked(grokConsentService.getAuditLog).mock.calls[0];
      expect(mockCall[1]).toBe(50);
      expect(mockCall[2]).toBe(0);
    });

    it('respects custom limit and offset query params', async () => {
      vi.mocked(grokConsentService.getAuditLog).mockResolvedValue({ events: [], total: 0 });

      const app = buildApp(ORG_ID);
      const res = await request(app)
        .get(`/api/grok-consent/${ORG_ID}/audit`)
        .query({ limit: '10', offset: '20' });

      expect(res.status).toBe(200);
      expect(res.body.limit).toBe(10);
      expect(res.body.offset).toBe(20);

      const mockCall = vi.mocked(grokConsentService.getAuditLog).mock.calls[0];
      expect(mockCall[1]).toBe(10);
      expect(mockCall[2]).toBe(20);
    });

    it('caps limit at 200 regardless of requested value', async () => {
      vi.mocked(grokConsentService.getAuditLog).mockResolvedValue({ events: [], total: 0 });

      const app = buildApp(ORG_ID);
      const res = await request(app)
        .get(`/api/grok-consent/${ORG_ID}/audit`)
        .query({ limit: '9999' });

      expect(res.status).toBe(200);
      expect(res.body.limit).toBe(200);

      const mockCall = vi.mocked(grokConsentService.getAuditLog).mock.calls[0];
      expect(mockCall[1]).toBe(200);
    });

    it('returns 500 when the audit service throws', async () => {
      vi.mocked(grokConsentService.getAuditLog).mockRejectedValue(new Error('Database error'));

      const app = buildApp(ORG_ID);
      const res = await request(app).get(`/api/grok-consent/${ORG_ID}/audit`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // ── 6. Grok inference blocked without consent ───────────────────────────

  describe('Grok inference blocked without consent (LLMClient)', () => {
    const grokConfig = {
      provider: 'grok' as const,
      apiKey: 'test-xai-key',
      baseUrl: 'https://api.x.ai/v1',
      model: 'grok-3',
    };

    it('throws when no orgId is provided to a Grok LLMClient', async () => {
      const client = new LLMClient(grokConfig);

      await expect(client.chat([{ role: 'user', content: 'Hello' }])).rejects.toThrow(
        /requires orgId/i,
      );

      // Consent should not be checked when orgId is absent
      expect(grokConsentService.checkConsent).not.toHaveBeenCalled();
    });

    it('throws and logs a blocked event when consent is not granted', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: false,
        reason: 'No consent record found — explicit opt-in required',
      });
      vi.mocked(grokConsentService.logInferenceBlocked).mockResolvedValue(undefined);

      const client = new LLMClient(grokConfig);

      await expect(
        client.chat([{ role: 'user', content: 'Hello' }], undefined, { orgId: ORG_ID }),
      ).rejects.toThrow(/Grok inference blocked/i);

      expect(grokConsentService.logInferenceBlocked).toHaveBeenCalledWith(
        ORG_ID,
        'No consent record found — explicit opt-in required',
      );
    });

    it('throws when consent was revoked (privacy-first — never silently bypassed)', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: false,
        reason: 'Consent revoked at 2026-03-01T07:00:00Z',
      });
      vi.mocked(grokConsentService.logInferenceBlocked).mockResolvedValue(undefined);

      const client = new LLMClient(grokConfig);

      await expect(
        client.chat([{ role: 'user', content: 'Analyse emissions' }], undefined, { orgId: ORG_ID }),
      ).rejects.toThrow(/Grok inference blocked/i);

      expect(grokConsentService.logInferenceBlocked).toHaveBeenCalledOnce();
    });

    it('proceeds past the consent gate when consent is active (service call attempted)', async () => {
      vi.mocked(grokConsentService.checkConsent).mockResolvedValue({
        granted: true,
        reason: 'Consent active',
      });
      vi.mocked(grokConsentService.logInferenceEvent).mockResolvedValue(undefined);

      // Stub the underlying fetch call so no real network request is made.
      const fetchSpy = vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: { get: () => null },
        json: async () => ({ error: { message: 'Unauthorized' } }),
        text: async () => 'Unauthorized',
      } as any);

      const client = new LLMClient(grokConfig);

      // The xAI API call itself will "fail" via our stubbed fetch — we only
      // care that the consent gate was passed, not that the API call succeeded.
      let thrownError: Error | undefined;
      try {
        await client.chat([{ role: 'user', content: 'Hello' }], undefined, { orgId: ORG_ID });
      } catch (err) {
        thrownError = err as Error;
      } finally {
        // Ensure fetch is restored for any subsequent tests.
        fetchSpy.mockRestore();
      }

      // An error must have been thrown (API/network failure from the stubbed call)
      expect(thrownError).toBeDefined();
      // The error must NOT be a consent block — it should be an API/network error
      expect(thrownError?.message).not.toMatch(/Grok inference blocked/i);
      expect(thrownError?.message).not.toMatch(/consent/i);

      // The consent gate was checked
      expect(grokConsentService.checkConsent).toHaveBeenCalledWith(ORG_ID);
      // logInferenceBlocked must NOT have been called (consent was granted)
      expect(grokConsentService.logInferenceBlocked).not.toHaveBeenCalled();
    });
  });
});
