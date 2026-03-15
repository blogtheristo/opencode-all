/**
 * Grok Consent Routes — Captain's Sovereignty Dashboard API
 *
 * Allows org admins to grant, revoke, and audit Grok (xAI) inference consent.
 *
 * All endpoints require authentication (JWT). Org-level operations require
 * the caller's orgId to match the path param (enforced below).
 *
 * Endpoints:
 *   GET    /grok-consent/:orgId          — Current consent status
 *   POST   /grok-consent/:orgId/grant    — Grant consent
 *   POST   /grok-consent/:orgId/revoke   — Revoke consent (immediate effect)
 *   GET    /grok-consent/:orgId/audit    — Paginated Article 12 audit log
 */

import express, { Router, Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import { grokConsentService } from '../services/grok-consent.service.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';

const router: Router = express.Router();

// ============ VALIDATION ============

const validateRequest = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.type === 'field' ? (e as { path: string }).path : 'unknown',
        message: e.msg,
      })),
    });
    return false;
  }
  return true;
};

/** Shared validator: :orgId must be a UUID */
const orgIdParam = param('orgId').isUUID().withMessage('orgId must be a valid UUID');
// Require a valid JWT on every endpoint in this router.
router.use(authenticateToken);

// ============ HELPERS ============

/** Extract orgId from JWT payload attached by upstream auth middleware. */
function getCallerOrgId(req: Request): string | null {
  return req.organizationId ?? null;
}

function getCallerUserId(req: Request): string {
  return ((req as unknown as Record<string, unknown>).userId as string) ?? 'unknown';
}

/** Extract KYA score from request (set by KYA middleware or header). */
function getCallerKyaScore(req: Request): number | undefined {
  const fromMiddleware = (req as unknown as Record<string, unknown>).kyaScore;
  if (typeof fromMiddleware === 'number') return fromMiddleware;
  const fromHeader = req.headers['x-kya-score'];
  if (fromHeader && typeof fromHeader === 'string') {
    const parsed = parseInt(fromHeader, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) return parsed;
  }
  return undefined;
}

/** Block cross-org access: caller must own the orgId in the path. */
function assertOrgAccess(req: Request, res: Response, orgId: string): boolean {
  const callerOrg = getCallerOrgId(req);
  // Allow if no org claim (e.g. internal service token) or org matches
  if (callerOrg && callerOrg !== orgId) {
    res.status(403).json({ error: 'Forbidden — orgId mismatch' });
    return false;
  }
  return true;
}

// ============ ROUTES ============

/**
 * GET /grok-consent/:orgId
 * Returns current consent status for the org.
 * Includes KYA governance context (harness L6 metadata).
 */
router.get('/:orgId', [orgIdParam], async (req: Request, res: Response) => {
  if (!validateRequest(req, res)) return;
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  const callerKyaScore = getCallerKyaScore(req);

  try {
    const status = await grokConsentService.checkConsent(orgId, callerKyaScore);
    res.json({ orgId, ...status });
  } catch (err: unknown) {
    logger.error('Failed to check Grok consent', { orgId, error: String(err) });
    res.status(500).json({ error: 'Internal error checking consent' });
  }
});

/**
 * POST /grok-consent/:orgId/grant
 * Body: { allowedCategories?: string[], note?: string }
 *
 * Records explicit opt-in consent (GDPR Art. 6(1)(a)).
 * The authenticated user is recorded as the consent author.
 */
router.post('/:orgId/grant', [orgIdParam], async (req: Request, res: Response) => {
  if (!validateRequest(req, res)) return;
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  const { allowedCategories, note } = req.body as {
    allowedCategories?: string[];
    note?: string;
  };

  const userId = getCallerUserId(req);
  const callerKyaScore = getCallerKyaScore(req);

  try {
    const { kya } = await grokConsentService.grantConsent(
      orgId, userId, allowedCategories, note, callerKyaScore,
    );
    res.status(201).json({
      orgId,
      granted: true,
      grantedByUserId: userId,
      grantedAt: new Date().toISOString(),
      allowedCategories: allowedCategories ?? ['climate', 'carbon', 'compliance'],
      message: 'Grok inference consent granted. All calls will be logged per EU AI Act Article 12.',
      kya,
    });
  } catch (err: unknown) {
    const msg = String(err instanceof Error ? err.message : err);
    // KYA trust gate returns 403; other errors return 500
    const status = msg.includes('KYA trust score') ? 403 : 500;
    logger.error('Failed to grant Grok consent', { orgId, error: msg });
    res.status(status).json({ error: msg });
  }
});

/**
 * POST /grok-consent/:orgId/revoke
 * Body: { reason?: string }
 *
 * Revokes consent immediately. Grok inference is blocked from this point.
 */
router.post('/:orgId/revoke', [orgIdParam], async (req: Request, res: Response) => {
  if (!validateRequest(req, res)) return;
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  const { reason } = req.body as { reason?: string };
  const userId = getCallerUserId(req);
  const callerKyaScore = getCallerKyaScore(req);

  try {
    const { kya } = await grokConsentService.revokeConsent(orgId, userId, reason, callerKyaScore);
    res.json({
      orgId,
      granted: false,
      revokedByUserId: userId,
      revokedAt: new Date().toISOString(),
      message: 'Grok inference consent revoked. All future calls are blocked immediately.',
      kya,
    });
  } catch (err: unknown) {
    const msg = String(err instanceof Error ? err.message : err);
    const status = msg.includes('KYA trust score') ? 403 : 500;
    logger.error('Failed to revoke Grok consent', { orgId, error: msg });
    res.status(status).json({ error: msg });
  }
});

/**
 * GET /grok-consent/:orgId/audit
 * Query params: ?limit=50&offset=0
 *
 * Returns the Article 12 inference audit log for regulator export or
 * Captain's dashboard display. Never includes prompt/response content.
 */
router.get('/:orgId/audit', async (req: Request, res: Response) => {
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  const parsedLimit = parseInt(String(req.query.limit ?? '50'), 10);
  const parsedOffset = parseInt(String(req.query.offset ?? '0'), 10);

  if (
    !Number.isFinite(parsedLimit) || parsedLimit < 1 ||
    !Number.isFinite(parsedOffset) || parsedOffset < 0
  ) {
    res.status(400).json({ error: 'Invalid pagination params: limit must be ≥1, offset must be ≥0' });
    return;
  }

  const limit = Math.min(parsedLimit, 200);
  const offset = parsedOffset;

  try {
    const { events, total, harness } = await grokConsentService.getAuditLog(orgId, limit, offset);
    res.json({
      orgId,
      total,
      limit,
      offset,
      events,
      compliance: {
        regulation: 'EU AI Act Article 12 — Automatic logging of high-risk AI systems',
        dataStored: 'Token counts and model ID only. No prompt or response content.',
        residency: 'Supabase eu-north1 (Helsinki, Finland). CLOUD Act-free.',
      },
      harness,
    });
  } catch (err: unknown) {
    logger.error('Failed to fetch Grok audit log', { orgId, error: String(err) });
    res.status(500).json({ error: 'Internal error fetching audit log' });
  }
});

export default router;
