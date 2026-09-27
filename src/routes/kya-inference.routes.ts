// Evidence: Tool=Claude Code Model=anthropic Agent=kya-inference-ijs Date=2026-09-27
// Audit trail: git log -- src/routes/kya-inference.routes.ts
/**
 * KYA+I Inference Jurisdiction Score route
 *
 * GET /api/v1/kya/inference/:sessionId → IJS, tier, provider chain, CLOUD Act flags.
 * Auth: same as POST /api/v1/kya/snap — Bearer or x-admin-key compared timing-safe to ADMIN_API_KEY.
 * Spec: .claude/commands/kya.md §Inference Jurisdiction Score.
 */

import crypto from 'node:crypto';
import { type Request, type Response, Router } from 'express';
import {
  computeInferenceJurisdiction,
  loadSessionInferenceCalls,
} from '../identity/inference-jurisdiction.js';
import logger from '../utils/logger.js';

const router = Router();

const SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,200}$/;

function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_API_KEY;
  const auth = headerValue(req.headers.authorization);
  const bearer = auth?.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : auth?.trim();
  const provided = bearer || headerValue(req.headers['x-admin-key']);
  if (!expected || !provided) return false;
  const a = crypto.createHash('sha256').update(provided, 'utf8').digest();
  const b = crypto.createHash('sha256').update(expected, 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

router.get('/:sessionId', async (req: Request, res: Response) => {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const sessionId = String(req.params.sessionId ?? '');
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    res.status(400).json({ error: 'sessionId must be 1-200 chars of A-Z a-z 0-9 . _ : -' });
    return;
  }

  try {
    const evidence = await loadSessionInferenceCalls(sessionId);
    const inference = computeInferenceJurisdiction(evidence.calls);
    logger.info('KYA inference jurisdiction scored', {
      sessionId,
      ijs: inference.ijs,
      tier: inference.tier,
      callsScored: inference.callsScored,
    });
    res.json({
      sessionId,
      inference,
      evidence: { sources: evidence.sources, unavailable: evidence.unavailable },
      computedAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error('KYA inference scoring failed', {
      sessionId,
      error: err instanceof Error ? err.message : String(err),
    });
    res.status(500).json({ error: 'Inference jurisdiction scoring failed' });
  }
});

export default router;
