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
import { grokConsentService } from '../services/grok-consent.service.js';
import logger from '../utils/logger.js';

const router: Router = express.Router();

// ============ HELPERS ============

/** Extract orgId from JWT payload attached by upstream auth middleware. */
function getCallerOrgId(req: Request): string | null {
  return (req as unknown as Record<string, unknown>).orgId as string | null ?? null;
}

function getCallerUserId(req: Request): string {
  return ((req as unknown as Record<string, unknown>).userId as string) ?? 'unknown';
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
 */
router.get('/:orgId', async (req: Request, res: Response) => {
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  try {
    const status = await grokConsentService.checkConsent(orgId);
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
router.post('/:orgId/grant', async (req: Request, res: Response) => {
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  const { allowedCategories, note } = req.body as {
    allowedCategories?: string[];
    note?: string;
  };

  const userId = getCallerUserId(req);

  try {
    await grokConsentService.grantConsent(orgId, userId, allowedCategories, note);
    res.status(201).json({
      orgId,
      granted: true,
      grantedByUserId: userId,
      grantedAt: new Date().toISOString(),
      allowedCategories: allowedCategories ?? ['climate', 'carbon', 'compliance'],
      message: 'Grok inference consent granted. All calls will be logged per EU AI Act Article 12.',
    });
  } catch (err: unknown) {
    logger.error('Failed to grant Grok consent', { orgId, error: String(err) });
    res.status(500).json({ error: 'Internal error granting consent' });
  }
});

/**
 * POST /grok-consent/:orgId/revoke
 * Body: { reason?: string }
 *
 * Revokes consent immediately. Grok inference is blocked from this point.
 */
router.post('/:orgId/revoke', async (req: Request, res: Response) => {
  const { orgId } = req.params;
  if (!assertOrgAccess(req, res, orgId)) return;

  const { reason } = req.body as { reason?: string };
  const userId = getCallerUserId(req);

  try {
    await grokConsentService.revokeConsent(orgId, userId, reason);
    res.json({
      orgId,
      granted: false,
      revokedByUserId: userId,
      revokedAt: new Date().toISOString(),
      message: 'Grok inference consent revoked. All future calls are blocked immediately.',
    });
  } catch (err: unknown) {
    logger.error('Failed to revoke Grok consent', { orgId, error: String(err) });
    res.status(500).json({ error: 'Internal error revoking consent' });
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

  const limit = Math.min(parseInt(String(req.query.limit ?? '50'), 10), 200);
  const offset = parseInt(String(req.query.offset ?? '0'), 10);

  try {
    const { events, total } = await grokConsentService.getAuditLog(orgId, limit, offset);
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
    });
  } catch (err: unknown) {
    logger.error('Failed to fetch Grok audit log', { orgId, error: String(err) });
    res.status(500).json({ error: 'Internal error fetching audit log' });
  }
});

export default router;
