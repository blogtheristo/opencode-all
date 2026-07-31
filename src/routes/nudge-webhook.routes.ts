/**
 * Nudge Callback Webhook — DWS IQ 6/7 (Proactive "Act" loop close)
 *
 * POST /webhooks/nudge/callback — Receive a human's button click on a
 * proactive nudge delivered to Teams or Slack (or a generic signed caller)
 * and route it into the nudge-response-handler so the agent learns whether
 * to proceed / halt / re-analyse.
 *
 * This is the inbound half that PR #1459 left unwired: `handleResponse`
 * existed but nothing carried external button clicks into it.
 *
 * Security (DWS_SECURITY_STANDARD.md — webhooks are untrusted input):
 *   - The raw request body is verified with HMAC-SHA256 BEFORE it is trusted.
 *     Three signing schemes are supported, each gated on its own secret:
 *       · Slack  — `x-slack-signature` over `v0:{ts}:{body}` (signing secret),
 *                  with a ±5min timestamp window to defeat replay.
 *       · Teams  — `authorization: HMAC <base64>` over the raw body, key is the
 *                  base64-decoded `NUDGE_TEAMS_SECRET` (Teams outgoing-webhook).
 *       · Generic— `x-dws-signature` hex HMAC over the raw body
 *                  (`NUDGE_WEBHOOK_SECRET`), optional `x-dws-timestamp` replay.
 *   - All digest comparisons are constant-time (`crypto.timingSafeEqual`).
 *   - A request with no recognised signature header, or a header whose secret
 *     is not configured, is rejected (fail loud — never trust by default).
 *   - The org the action applies to is derived from the persisted nudge, never
 *     from the (attacker-controllable) payload, so a valid signature for one
 *     org cannot resolve another org's nudge.
 *   - Strict rate limiting (30 req/min per IP).
 */

import crypto from 'crypto';
import express, { type Request, type Response, type Router } from 'express';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import { nudgeService } from '../agents/nudge.service.js';
import { handleResponse, normalizeAction } from '../agents/nudge-response-handler.js';

const router: Router = express.Router();

/** Replay window for timestamped schemes (Slack / generic). */
const MAX_SKEW_SECONDS = 5 * 60;

const nudgeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Too many nudge callback requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

/** Constant-time compare of two hex/base64 digests of (possibly) differing length. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

type SigResult = { ok: true } | { ok: false; status: number; error: string };

/** Verify the request body against whichever signing scheme the caller used. */
function verifySignature(req: RawBodyRequest): SigResult {
  const raw = req.rawBody ?? Buffer.from('');

  // --- Slack: x-slack-signature = v0=<hex hmac of "v0:{ts}:{body}"> ---
  const slackSig = req.headers['x-slack-signature'] as string | undefined;
  if (slackSig) {
    const secret = process.env.NUDGE_SLACK_SIGNING_SECRET || process.env.SLACK_SIGNING_SECRET;
    if (!secret) return { ok: false, status: 503, error: 'Slack signing secret not configured' };
    const ts = req.headers['x-slack-request-timestamp'] as string | undefined;
    if (!ts || !withinSkew(parseInt(ts, 10))) {
      return { ok: false, status: 401, error: 'Missing or stale timestamp' };
    }
    const expected =
      'v0=' +
      crypto
        .createHmac('sha256', secret)
        .update(`v0:${ts}:${raw.toString('utf8')}`)
        .digest('hex');
    return safeEqual(slackSig, expected)
      ? { ok: true }
      : { ok: false, status: 401, error: 'Invalid Slack signature' };
  }

  // --- Teams outgoing webhook: authorization: HMAC <base64 hmac of body> ---
  const auth = req.headers['authorization'] as string | undefined;
  if (auth && auth.startsWith('HMAC ')) {
    const secret = process.env.NUDGE_TEAMS_SECRET;
    if (!secret) return { ok: false, status: 503, error: 'Teams secret not configured' };
    const provided = auth.slice('HMAC '.length).trim();
    const key = Buffer.from(secret, 'base64');
    const expected = crypto.createHmac('sha256', key).update(raw).digest('base64');
    return safeEqual(provided, expected)
      ? { ok: true }
      : { ok: false, status: 401, error: 'Invalid Teams signature' };
  }

  // --- Generic: x-dws-signature = hex hmac of body ---
  const generic = req.headers['x-dws-signature'] as string | undefined;
  if (generic) {
    const secret = process.env.NUDGE_WEBHOOK_SECRET;
    if (!secret) return { ok: false, status: 503, error: 'Webhook secret not configured' };
    const ts = req.headers['x-dws-timestamp'] as string | undefined;
    if (ts && !withinSkew(parseInt(ts, 10))) {
      return { ok: false, status: 401, error: 'Stale timestamp' };
    }
    const signed = ts ? `${ts}.${raw.toString('utf8')}` : raw.toString('utf8');
    const expected = crypto.createHmac('sha256', secret).update(signed).digest('hex');
    return safeEqual(generic, expected)
      ? { ok: true }
      : { ok: false, status: 401, error: 'Invalid signature' };
  }

  return { ok: false, status: 401, error: 'Missing signature header' };
}

function withinSkew(tsSeconds: number): boolean {
  if (!Number.isFinite(tsSeconds)) return false;
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - tsSeconds) <= MAX_SKEW_SECONDS;
}

interface ParsedCallback {
  nudgeId: string;
  rawAction: string;
  userId?: string;
}

/**
 * Extract { nudgeId, action, userId } from a verified body.
 * Supports a generic/Teams JSON shape and Slack's form-encoded interactive
 * payload (button `value` formatted as "<nudgeId>:<action>").
 */
function parseCallback(req: RawBodyRequest): ParsedCallback | null {
  const raw = (req.rawBody ?? Buffer.from('')).toString('utf8');
  const contentType = (req.headers['content-type'] || '').toString();

  // Slack interactive components POST application/x-www-form-urlencoded with a
  // single `payload` field holding the JSON.
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const payloadStr = params.get('payload');
    if (!payloadStr) return null;
    let payload: any;
    try {
      payload = JSON.parse(payloadStr);
    } catch {
      return null;
    }
    const action = payload?.actions?.[0];
    const value: string | undefined = action?.value ?? action?.action_id;
    if (!value || typeof value !== 'string') return null;
    const [nudgeId, rawAction] = value.split(':');
    if (!nudgeId || !rawAction) return null;
    return { nudgeId, rawAction, userId: payload?.user?.id ?? payload?.user?.username };
  }

  // Generic / Teams JSON: { nudgeId, action, userId? }
  let body: any;
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
  const nudgeId = body?.nudgeId ?? body?.nudge_id;
  const rawAction = body?.action;
  if (typeof nudgeId !== 'string' || typeof rawAction !== 'string') return null;
  return { nudgeId, rawAction, userId: body?.userId ?? body?.user_id };
}

router.post(
  '/callback',
  nudgeLimiter,
  // Capture the raw body for HMAC. Mounted before express.json (see app.ts).
  express.raw({ type: '*/*', limit: '64kb' }),
  async (req: RawBodyRequest, res: Response) => {
    // express.raw leaves the Buffer on req.body; expose it as rawBody too.
    if (Buffer.isBuffer(req.body)) req.rawBody = req.body;

    const sig = verifySignature(req);
    if (!sig.ok) {
      logger.warn('Nudge callback rejected', { reason: sig.error });
      res.status(sig.status).json({ error: sig.error });
      return;
    }

    const parsed = parseCallback(req);
    if (!parsed) {
      res.status(400).json({ error: 'Unparseable callback payload' });
      return;
    }

    const action = normalizeAction(parsed.rawAction);
    if (!action) {
      res.status(400).json({ error: `Unrecognised action: ${parsed.rawAction}` });
      return;
    }

    // Derive the org from the persisted nudge — never trust the payload for it.
    const nudge = await nudgeService.getNudge(parsed.nudgeId);
    if (!nudge) {
      logger.warn('Nudge callback for unknown nudge', { nudgeId: parsed.nudgeId });
      res.status(404).json({ error: 'Nudge not found' });
      return;
    }

    const result = await handleResponse(parsed.nudgeId, action, {
      orgId: nudge.orgId,
      userId: parsed.userId,
    });

    logger.info('Nudge callback handled', {
      nudgeId: parsed.nudgeId,
      action,
      outcome: result.outcome,
    });

    res.status(200).json({ ok: result.ok, outcome: result.outcome, reason: result.reason });
  },
);

export default router;
