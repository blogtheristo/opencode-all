/**
 * Nudge Callback Webhook Tests
 *
 * Security-sensitive: verifies that the inbound Teams/Slack button callback
 * endpoint rejects unsigned / mis-signed requests, and that a VALID signature
 * routes the click through to the nudge-response-handler (closing the loop).
 *
 * Runs against the in-memory nudge store (no Supabase) so it is self-contained.
 */

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import type { nudgeService } from '../agents/nudge.service.js';

// In-memory nudge store; quiet event bus.
vi.mock('../config/supabase.js', () => ({ getSupabaseClient: () => null }));
vi.mock('../agents/event-bus.js', () => ({
  eventBus: { emit: vi.fn().mockResolvedValue(undefined), subscribe: vi.fn() },
}));

const SECRET = 'test-nudge-webhook-secret';

let app: express.Express;
let nudgeService: typeof nudgeService;

beforeAll(async () => {
  process.env.NUDGE_WEBHOOK_SECRET = SECRET;
  const router = (await import('../routes/nudge-webhook.routes.js')).default;
  nudgeService = (await import('../agents/nudge.service.js')).nudgeService;

  app = express();
  // Mounted WITHOUT global express.json — the route captures the raw body itself.
  app.use('/webhooks/nudge', router);
});

function signGeneric(body: string): string {
  return crypto.createHmac('sha256', SECRET).update(body).digest('hex');
}

async function makePendingNudge(entityId: string): Promise<string> {
  const res = await nudgeService.createNudge({
    orgId: 'org-webhook',
    agentName: 'sitesense',
    signalKey: 'site_safety_low',
    entityId,
    recipientRole: 'Site Manager',
    tier: 'threshold',
    gateDecision: 'act_now',
    channels: ['in_app'],
    subject: 's',
    body: 'b',
    actionOptions: ['Confirm', 'Override'],
  });
  return res.nudgeId!;
}

describe('POST /webhooks/nudge/callback', () => {
  beforeEach(async () => {
    for (const n of await nudgeService.listPending()) {
      await nudgeService.resolveNudge(n.id, 'dismissed');
    }
  });

  it('rejects a request with no signature header (401)', async () => {
    const res = await request(app)
      .post('/webhooks/nudge/callback')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ nudgeId: 'x', action: 'confirm' }));
    expect(res.status).toBe(401);
  });

  it('rejects an invalid signature (401)', async () => {
    const body = JSON.stringify({ nudgeId: 'x', action: 'confirm' });
    const res = await request(app)
      .post('/webhooks/nudge/callback')
      .set('Content-Type', 'application/json')
      .set('x-dws-signature', 'deadbeef')
      .send(body);
    expect(res.status).toBe(401);
  });

  it('returns 404 for a valid signature over an unknown nudge', async () => {
    const body = JSON.stringify({ nudgeId: 'no-such-nudge', action: 'confirm' });
    const res = await request(app)
      .post('/webhooks/nudge/callback')
      .set('Content-Type', 'application/json')
      .set('x-dws-signature', signGeneric(body))
      .send(body);
    expect(res.status).toBe(404);
  });

  it('routes a valid signed confirm through to resolution (proceed)', async () => {
    const nudgeId = await makePendingNudge('site-webhook-confirm');
    const body = JSON.stringify({ nudgeId, action: 'confirm', userId: 'u-teams' });
    const res = await request(app)
      .post('/webhooks/nudge/callback')
      .set('Content-Type', 'application/json')
      .set('x-dws-signature', signGeneric(body))
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.outcome).toBe('proceed');
    // The nudge is no longer pending — the loop is closed.
    const stillPending = await nudgeService.getNudge(nudgeId);
    expect(stillPending?.status).toBe('confirmed');
  });

  it('parses a Slack interactive payload (override → halt)', async () => {
    const nudgeId = await makePendingNudge('site-webhook-slack');
    const slackPayload = JSON.stringify({
      user: { id: 'U123' },
      actions: [{ value: `${nudgeId}:override` }],
    });
    const body = 'payload=' + encodeURIComponent(slackPayload);
    const res = await request(app)
      .post('/webhooks/nudge/callback')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('x-dws-signature', signGeneric(body))
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body.outcome).toBe('halt');
  });
});
