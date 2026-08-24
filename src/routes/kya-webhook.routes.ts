// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/routes/kya-webhook.routes.ts
/**
 * KYA Webhook Routes — Shufti Pro → DWS IQ 6 API Bridge
 *
 * POST /v1/kya/webhook/shufti — Receive Shufti Pro verification signals
 *
 * Spec Version: 1.1.0-beta (March 2026)
 * SLA: < 200ms signal processing (part of the 500ms Leash Snap)
 *
 * Flow:
 *   1. Validate HMAC-SHA256 signature (Shufti secret key)
 *   2. Parse verification_data.aml_screening.status
 *   3. Route to Policy Engine (Shanghai Model)
 *   4. Execute action: UPDATE_SCORE / TERMINATE_CHAIN / REVAL_LEASH
 *   5. Return acknowledgement
 *
 * Security:
 *   - HMAC-SHA256 signature verification (SHUFTI_SECRET_KEY)
 *   - Strict rate limiting (20 req/min per IP)
 *   - Input validation via Zod schema
 *
 * @see DWS_SECURITY_STANDARD.md §18.5
 */

import crypto from 'crypto';
import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import { claimOnce } from '../services/redis-token-blacklist.service.js';
import {
  evaluateSignal,
  executeDecision,
  type ShuftiWebhookPayload,
} from '../identity/kya-engine.js';

const router: Router = express.Router();

// ============ RATE LIMITING ============

const shuftiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many webhook requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============ SIGNATURE VERIFICATION ============

/**
 * Validate Shufti Pro HMAC-SHA256 signature.
 *
 * Protocol: SHA256(SecretKey + RawPayload) compared against Signature header.
 * Uses constant-time comparison to prevent timing attacks.
 */
function validateShuftiSignature(req: Request, res: Response, next: NextFunction): void {
  const secretKey = process.env.SHUFTI_SECRET_KEY;

  if (!secretKey) {
    logger.error('SHUFTI_SECRET_KEY not configured — rejecting webhook');
    res.status(503).json({ error: 'Webhook signature verification not configured' });
    return;
  }

  const signature = req.headers['signature'] as string
    || req.headers['x-shufti-signature'] as string;

  if (!signature) {
    logger.warn('Shufti webhook: missing signature header');
    res.status(401).json({ error: 'Missing signature header' });
    return;
  }

  // Verify over the EXACT raw bytes the sender signed. app.ts stashes rawBody
  // in express.json's verify callback; fail closed rather than signing a
  // re-serialization whose byte order may differ from the original payload.
  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
  if (!rawBody) {
    logger.error('Shufti webhook: raw body unavailable — cannot verify signature over exact bytes');
    res.status(500).json({ error: 'Raw body not captured for signature verification' });
    return;
  }
  const expectedSignature = crypto
    .createHash('sha256')
    .update(Buffer.concat([Buffer.from(secretKey, 'utf8'), rawBody]))
    .digest('hex');

  // Constant-time comparison (length-guard first: timingSafeEqual throws on
  // mismatched lengths)
  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');

  if (sigBuffer.length !== expectedBuffer.length
    || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    logger.warn('Shufti webhook: invalid signature', {
      receivedLength: signature.length,
      correlationId: req.headers['x-correlation-id'],
    });
    res.status(401).json({ error: 'Invalid signature' });
    return;
  }

  next();
}

// ============ REPLAY PROTECTION ============

// Replay contract: Shufti payloads carry no trusted timestamp, so the contract
// is event-ID deduplication — sha256 of the exact raw body claimed atomically
// (Redis SET NX PX; in-memory fallback) for 24h. A replayed identical webhook
// is acknowledged but not re-processed into the policy engine.
const REPLAY_TTL_MS = 24 * 60 * 60 * 1000;

async function replayGate(rawBody: Buffer): Promise<boolean> {
  const dedupKey = crypto.createHash('sha256').update(rawBody).digest('hex');
  return claimOnce(dedupKey, REPLAY_TTL_MS);
}

// ============ INPUT VALIDATION ============

function validatePayload(body: unknown): { valid: true; payload: ShuftiWebhookPayload } | { valid: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.event !== 'string') {
    return { valid: false, error: 'Missing or invalid "event" field' };
  }

  if (typeof b.reference !== 'string' || b.reference.length === 0) {
    return { valid: false, error: 'Missing or invalid "reference" field' };
  }

  const vd = b.verification_data as Record<string, unknown> | undefined;
  if (!vd || typeof vd !== 'object') {
    return { valid: false, error: 'Missing "verification_data" object' };
  }

  const aml = vd.aml_screening as Record<string, unknown> | undefined;
  if (!aml || typeof aml !== 'object') {
    return { valid: false, error: 'Missing "verification_data.aml_screening" object' };
  }

  if (aml.status !== 'approved' && aml.status !== 'declined') {
    return { valid: false, error: 'aml_screening.status must be "approved" or "declined"' };
  }

  return { valid: true, payload: body as ShuftiWebhookPayload };
}

// ============ WEBHOOK ENDPOINT ============

/**
 * POST /v1/kya/webhook/shufti
 *
 * Receives Shufti Pro verification.status.changed events.
 * Processes the signal through the Shanghai Model Policy Engine.
 */
router.post(
  '/webhook/shufti',
  shuftiLimiter,
  validateShuftiSignature,
  async (req: Request, res: Response) => {
    const startTime = performance.now();

    // Validate payload structure
    const validation = validatePayload(req.body);
    if (!validation.valid) {
      logger.warn('Shufti webhook: invalid payload', { error: (validation as { valid: false; error: string }).error });
      res.status(400).json({ error: (validation as { valid: false; error: string }).error });
      return;
    }

    const payload = (validation as { valid: true; payload: ShuftiWebhookPayload }).payload;

    // Replay gate: identical raw-body webhooks within 24h are acknowledged but
    // not re-processed into the policy engine.
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody ?? Buffer.from(JSON.stringify(req.body));
    if (!(await replayGate(rawBody))) {
      logger.warn('Shufti webhook: duplicate delivery suppressed', { reference: payload.reference });
      res.status(200).json({ received: true, duplicate: true });
      return;
    }

    logger.info('Shufti webhook received', {
      event: payload.event,
      reference: payload.reference,
      amlStatus: payload.verification_data.aml_screening.status,
    });

    try {
      // 1. Evaluate signal through Policy Engine
      const decision = evaluateSignal(payload);

      // 2. Execute the policy decision
      const result = await executeDecision(decision);

      const totalDurationMs = Math.round((performance.now() - startTime) * 100) / 100;

      logger.info('Shufti webhook processed', {
        reference: payload.reference,
        action: decision.action,
        reason: decision.reason,
        durationMs: `${totalDurationMs}ms`,
        slaCompliant: totalDurationMs < 200,
      });

      res.status(200).json({
        received: true,
        action: decision.action,
        sessionId: decision.sessionId,
        reason: decision.reason,
        durationMs: totalDurationMs,
        ...(result ? { termination: result } : {}),
      });
    } catch (err) {
      const errorMsg = (err as Error).message;
      logger.error('Shufti webhook processing failed', {
        error: errorMsg,
        reference: payload.reference,
      });
      res.status(500).json({ error: 'Internal processing error' });
    }
  },
);

export default router;
