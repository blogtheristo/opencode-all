/**
 * GTM Events API Routes — DWS IQ 6/7
 *
 * Endpoint for receiving GTM events from frontend and logging to Supabase.
 * Called by gtm-client.ts on the buy page when events fire.
 *
 * POST /api/gtm/events — batch or single event
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 1)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import { Router, Request, Response } from 'express';
import logger from '../utils/logger.js';
import { gtmEventLogger } from '../services/gtm-event-logger.js';
import { eventBus } from '../agents/event-bus.js';

const router = Router();

/**
 * POST /api/gtm/events
 * Receive GTM events from frontend data layer
 *
 * Body:
 * {
 *   "event": "page_view" | "product_view" | "add_to_cart" | "begin_checkout" | "purchase",
 *   "timestamp": "2026-04-28T14:30:00.000Z",
 *   ... (event-specific properties)
 * }
 *
 * Or array of events (batch):
 * [
 *   { "event": "page_view", ... },
 *   { "event": "add_to_cart", ... }
 * ]
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const sessionId = (req.headers['x-session-id'] as string) || 'anonymous';
    const userId = (req as any).user?.id; // If authenticated

    // Handle both single event and batch array
    const events = Array.isArray(payload) ? payload : [payload];

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Invalid event format' });
    }

    // Process each event
    for (const eventData of events) {
      const { event, timestamp, ...properties } = eventData;

      if (!event || !timestamp) {
        logger.warn('Invalid GTM event — missing event or timestamp', { eventData });
        continue;
      }

      try {
        // Log to GTM event logger (buffers for flush)
        gtmEventLogger.logEvent({
          event_type: event,
          source: 'gtm',
          properties,
          user_id: userId,
          session_id: sessionId,
          timestamp,
        });

        // Emit to event bus for downstream handlers
        await eventBus.emit({
          type: `sales.${event}`,
          source: 'gtm',
          payload: {
            event,
            ...properties,
          },
          priority: 'normal',
          timestamp,
          orgId: 'unknown', // GTM events are typically anonymous
          sessionId,
        });

        logger.debug('GTM event received', {
          event_type: event,
          session_id: sessionId,
          user_id: userId,
        });
      } catch (eventErr) {
        logger.warn('Error processing GTM event', {
          event_type: event,
          error: String(eventErr),
        });
      }
    }

    // Return success (even if some events failed — best-effort)
    return res.status(200).json({
      success: true,
      events_received: events.length,
      session_id: sessionId,
    });
  } catch (err) {
    logger.error('GTM events endpoint error', { error: String(err) });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
