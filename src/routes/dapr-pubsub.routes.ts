/**
 * Dapr Pub/Sub Pilot — subscription callback
 * docs/field-notes/2026-09-22-dapr-use-cases-dws.md §3 Phase 1
 *
 * The Dapr sidecar calls GET /dapr/subscribe on startup to learn which
 * topics this app wants, then POSTs each matching CloudEvent to the route
 * declared here. Scoped to a single topic (agent.task_complete) for the
 * pilot — widening to more event types is a one-line change to the
 * `topics` list below, per the phased plan in the field note.
 *
 * This endpoint is only ever called by the local Dapr sidecar (same host,
 * not internet-exposed — Dapr apps are not deployed with this route
 * reachable from outside the pod/container network). Kept unauthenticated
 * like other intra-mesh Dapr routes; do not put externally-triggerable
 * logic behind it.
 */

import express, { type Request, type Response, type Router } from 'express';
import logger from '../utils/logger.js';
import { type DWSEvent, eventBus } from '../agents/event-bus.js';

const router: Router = express.Router();

const DAPR_PUBSUB_NAME = process.env.DAPR_PUBSUB_NAME || 'dws-pubsub';
const DAPR_PUBSUB_TOPIC = process.env.DAPR_PUBSUB_TOPIC || 'agent.task_complete';

/** Dapr programmatic subscription — https://docs.dapr.io/developing-applications/building-blocks/pubsub/subscription-methods/ */
router.get('/subscribe', (_req: Request, res: Response) => {
  res.status(200).json([
    {
      pubsubname: DAPR_PUBSUB_NAME,
      topic: DAPR_PUBSUB_TOPIC,
      route: '/dapr/events/agent-task-complete',
    },
  ]);
});

interface CloudEvent {
  data?: DWSEvent;
}

function isDWSEvent(value: unknown): value is DWSEvent {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e.type === 'string' &&
    typeof e.source === 'string' &&
    typeof e.orgId === 'string' &&
    typeof e.sessionId === 'string' &&
    typeof e.priority === 'string' &&
    typeof e.timestamp === 'string' &&
    typeof e.payload === 'object'
  );
}

router.post('/events/agent-task-complete', async (req: Request, res: Response) => {
  const body = req.body as CloudEvent | DWSEvent | undefined;
  // Dapr wraps the published body in a CloudEvent envelope under `data`;
  // accept a bare DWSEvent too so local `dapr publish` testing works.
  const event = body && 'data' in body ? body.data : (body as DWSEvent | undefined);

  if (!isDWSEvent(event)) {
    logger.warn('Dapr event delivery had unparseable payload', { body });
    // 200, not 400/500 — a malformed message is not retryable and Dapr
    // will otherwise redeliver it forever.
    res.status(200).json({ status: 'DROP' });
    return;
  }

  await eventBus.dispatchFromDapr(event);
  res.status(200).json({ status: 'SUCCESS' });
});

export default router;
