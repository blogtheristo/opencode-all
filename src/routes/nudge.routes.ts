/**
 * Nudge Inbox Routes — DWS IQ 6/7 (in-app "Act" surface)
 *
 * Gives the `in_app` nudge channel a real destination: a human can list the
 * proactive nudges pending for their org and resolve them (confirm / override /
 * dismiss / investigate). Backs public/nudges/index.html.
 *
 *   GET  /api/v1/nudges            — list pending nudges for the caller's org
 *   POST /api/v1/nudges/:id/respond — apply a response to one nudge
 *
 * All routes require JWT auth; the org is taken from the token, and a nudge can
 * only be resolved by a caller in the same org (no cross-org IDOR).
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { nudgeService } from '../agents/nudge.service.js';
import { handleResponse, normalizeAction } from '../agents/nudge-response-handler.js';

const router: Router = express.Router();

function orgOf(req: Request): string {
  return req.organizationId || `user:${req.userId || 'unknown'}`;
}

/** GET /api/v1/nudges — pending nudges for the caller's org. */
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const orgId = orgOf(req);
    const nudges = await nudgeService.listPending(orgId);
    return res.status(200).json({ nudges, count: nudges.length });
  } catch (err) {
    logger.error('Failed to list nudges', { error: (err as Error).message });
    return res
      .status(500)
      .json({ error: 'Internal Server Error', message: 'Failed to list nudges' });
  }
});

/** POST /api/v1/nudges/:id/respond — apply a human response. Body: { action }. */
router.post(
  '/:id/respond',
  authenticateToken,
  [
    param('id').isString().trim().isLength({ min: 1, max: 100 }),
    body('action').isString().trim().notEmpty().withMessage('action is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation Error', details: errors.array() });
    }

    const orgId = orgOf(req);
    const nudgeId = req.params.id;

    const action = normalizeAction(req.body.action);
    if (!action) {
      return res.status(400).json({ error: `Unrecognised action: ${req.body.action}` });
    }

    // Authorization: the nudge must belong to the caller's org.
    const nudge = await nudgeService.getNudge(nudgeId);
    if (!nudge || nudge.orgId !== orgId) {
      return res.status(404).json({ error: 'Nudge not found' });
    }

    const result = await handleResponse(nudgeId, action, { orgId, userId: req.userId });
    return res.status(result.ok ? 200 : 409).json(result);
  },
);

export default router;
