/**
 * Paid Endpoint Middleware — KYA-S1 Gate
 *
 * Guards paid API endpoints with:
 *   1. ****** key validation against the `api_keys` table (pilot tier)
 *   2. HTTP 402 + machine-readable x402 body when no valid key is present
 *      (Cloudflare Pay Per Crawl compatible — x402/MPP ready for future settlement)
 *   3. request_id stamped on req for downstream logging
 *   4. Call logged to paid_endpoint_log regardless of downstream result
 *
 * KYA tier: S1 — read-only, structured output, no external writes.
 * Regulation: EU 2023/956 (CBAM)
 *
 * Usage:
 *   router.post('/cbam/calculation', paidEndpointMiddleware('cbam.calculation.v1'), handler)
 */

import crypto from 'crypto';
import { type NextFunction, type Request, type Response } from 'express';
import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';

// Extend Express Request so downstream handlers can read these
declare global {
  namespace Express {
    interface Request {
      paidRequestId?: string;
      paidKeyId?: string;
      paidOrgId?: string;
      paidEndpoint?: string;
    }
  }
}

const PILOT_PRICE_EUR = 0.10;

/** x402 body returned when no valid key is present (HTTP 402). */
function x402Body(endpoint: string) {
  return {
    error: 'Payment Required',
    code: 'x402',
    endpoint,
    price_eur: PILOT_PRICE_EUR,
    message:
      'This endpoint requires a DWS pilot API key. ' +
      'Contact risto@onelifetime.world to join the CBAM pilot.',
    kya_tier: 'S1',
    info: 'https://dws10.com/api/cbam/pilot',
  };
}

/**
 * Returns middleware that validates a pilot API key and logs the call.
 * @param endpoint - Logical endpoint identifier, e.g. 'cbam.calculation.v1'
 */
export function paidEndpointMiddleware(endpoint: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = crypto.randomUUID();
    req.paidRequestId = requestId;
    req.paidEndpoint = endpoint;

    // ── 1. Extract ****** ──────────────────────────────────────────────
    const authHeader = req.headers['authorization'];
    const rawKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (!rawKey) {
      res.status(402).json(x402Body(endpoint));
      return;
    }

    // ── 2. Hash and look up in api_keys ────────────────────────────────────
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase client unavailable - cannot verify API key');
      }

      const { data: keyRow, error } = await supabase
        .from('api_keys')
        .select('id, user_id, revoked, expires_at, tier, scopes')
        .eq('hash', keyHash)
        .single();

      if (error || !keyRow) {
        res.status(402).json(x402Body(endpoint));
        return;
      }

      if (keyRow.revoked) {
        res.status(402).json({ ...x402Body(endpoint), error: 'Key revoked' });
        return;
      }

      if (keyRow.expires_at && new Date(keyRow.expires_at) < new Date()) {
        res.status(402).json({ ...x402Body(endpoint), error: 'Key expired' });
        return;
      }

      // Only pilot (or internal) keys allowed on paid endpoints
      if (keyRow.tier !== 'pilot' && keyRow.tier !== 'internal') {
        res.status(402).json({
          ...x402Body(endpoint),
          error: 'Key tier not authorised for this endpoint. Pilot key required.',
        });
        return;
      }

      req.paidKeyId = keyRow.id;
      req.paidOrgId = keyRow.user_id; // user_id used as org proxy until org_id column exists

      // Update last_used_at (fire and forget)
      supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyRow.id)
        .then(({ error: e }) => {
          if (e) logger.warn('Failed to update last_used_at', { keyId: keyRow.id });
        });
    } catch (err) {
      logger.error('paidEndpointMiddleware: Supabase lookup failed', { requestId, err });
      res.status(503).json({ error: 'Service unavailable', requestId });
      return;
    }

    // ── 3. Log call entry (verdict filled in by logPaidCall after handler) ─
    // Downstream handler is responsible for calling logPaidCall() with result.
    next();
  };
}

export interface PaidCallLogEntry {
  requestId: string;
  keyId: string | undefined;
  orgId: string | undefined;
  endpoint: string;
  inputHash: string;
  verdict: 'success' | 'refused' | 'error';
  confidence?: number;
  calcVersion?: string;
  usesDefaults?: boolean;
  missingEvidence?: string[];
  faultAttr?: 'requester' | 'evidence_gap' | 'system';
}

/** Persist a completed call to paid_endpoint_log. Fire from the route handler. */
export async function logPaidCall(entry: PaidCallLogEntry): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      logger.error('logPaidCall: Supabase client unavailable - call not logged', {
        requestId: entry.requestId,
        endpoint: entry.endpoint,
      });
      return;
    }

    await supabase.from('paid_endpoint_log').insert({
      request_id: entry.requestId,
      key_id: entry.keyId ?? null,
      org_id: entry.orgId ?? null,
      endpoint: entry.endpoint,
      input_hash: entry.inputHash,
      verdict: entry.verdict,
      confidence: entry.confidence ?? null,
      price_eur: PILOT_PRICE_EUR,
      calc_version: entry.calcVersion ?? null,
      uses_defaults: entry.usesDefaults ?? null,
      missing_evidence: entry.missingEvidence ?? null,
      fault_attr: entry.faultAttr ?? null,
    });
  } catch (err) {
    // Log but never block the response
    logger.error('logPaidCall: failed to persist', { requestId: entry.requestId, err });
  }
}
