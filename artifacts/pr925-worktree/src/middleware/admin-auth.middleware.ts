/**
 * Admin key authentication middleware.
 *
 * Accepts the key via either:
 *   Authorization: Bearer <ADMIN_API_KEY>
 *   X-Admin-Key: <ADMIN_API_KEY>
 *
 * Uses timing-safe comparison to prevent timing attacks.
 * Returns 401 when ADMIN_API_KEY is not configured so misconfigured
 * deployments fail closed rather than open.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-1227
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

function extractBearer(authorization: string | undefined): string | undefined {
  if (!authorization) return undefined;
  return authorization.toLowerCase().startsWith('bearer ')
    ? authorization.slice(7).trim()
    : authorization.trim();
}

function timingSafeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a, 'utf8').digest();
  const hb = crypto.createHash('sha256').update(b, 'utf8').digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function requireAdminKey(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const raw = Array.isArray(req.headers['x-admin-key'])
    ? req.headers['x-admin-key'][0]
    : req.headers['x-admin-key'];
  const provided =
    extractBearer(
      Array.isArray(req.headers.authorization)
        ? req.headers.authorization[0]
        : req.headers.authorization,
    ) || raw;

  if (!provided || !timingSafeEqual(provided, expected)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
