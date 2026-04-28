/**
 * Gaps Resolution Routes — GTM Machine Step 10
 *
 * POST /api/v1/gaps/resolve — CSM/onboarding tool emits gap_resolved after
 * a product/service coverage gap identified during onboarding has been handled.
 *
 * Protected by ADMIN_API_KEY (X-Admin-Key or Authorization: Bearer).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-1227
 * Branch: claude/gtm-event-emitters-phase2
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { gtmEventLogger } from '../services/gtm-event-logger.js';
import logger from '../utils/logger.js';
import { requireAdminKey } from '../middleware/admin-auth.middleware.js';

const router = Router();

router.use(requireAdminKey);

/**
 * POST /api/v1/gaps/resolve
 * Emits gap_resolved GTM event. Called by CSM tooling or onboarding agent.
 */
router.post(
  '/resolve',
  body('gap_id').isString().trim().notEmpty(),
  body('gap_type').isString().trim().notEmpty(),
  body('resolution').isString().trim().notEmpty(),
  body('order_id').optional().isString(),
  body('user_id').optional().isString(),
  body('session_id').optional().isString(),
  body('org_id').optional().isString(),
  body('resolved_at').optional().isISO8601(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid request body', details: errors.array() });
    }

    const { gap_id, gap_type, resolution, order_id, user_id, session_id, org_id, resolved_at } =
      req.body as {
        gap_id: string;
        gap_type: string;
        resolution: string;
        order_id?: string;
        user_id?: string;
        session_id?: string;
        org_id?: string;
        resolved_at?: string;
      };

    try {
      gtmEventLogger.logEvent({
        event_type: 'gap_resolved',
        source: 'backend',
        properties: {
          gap_id,
          gap_type,
          resolution,
          order_id: order_id ?? null,
          org_id: org_id ?? null,
        },
        user_id: user_id ?? undefined,
        session_id: session_id ?? undefined,
        timestamp: resolved_at ?? new Date().toISOString(),
      });
      // flush() writes the buffer to Supabase before responding; without this
      // logEvent() only queues the event and the row may not appear until the
      // next periodic flush or could be lost on process exit.
      await gtmEventLogger.flush();

      logger.info('Gap resolved event logged', { gap_id, gap_type, order_id });
      return res.status(200).json({ success: true, gap_id });
    } catch (err) {
      logger.error('Failed to log gap_resolved event', { error: err, gap_id });
      return res.status(500).json({ error: 'Failed to log event' });
    }
  },
);

export default router;
