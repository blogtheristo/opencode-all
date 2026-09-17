// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/middleware/correlation-id.ts
/**
 * Correlation ID Middleware
 *
 * Attaches a unique trace ID to every request for debugging production issues.
 * If the client sends X-Correlation-ID, it's preserved. Otherwise, a new one is generated.
 */

import { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';

export function correlationId(req: Request, res: Response, next: NextFunction): void {
  const existing = req.headers['x-correlation-id'] as string | undefined;
  // Only trust well-formed client IDs; anything else (control chars, overlong,
  // hostile charset) is replaced — Node's header validator would otherwise
  // throw on setHeader and turn garbage input into a 500.
  const id =
    existing && /^[A-Za-z0-9\-_.]{1,64}$/.test(existing) ? existing : crypto.randomUUID();

  // Make it available on req and response headers
  req.headers['x-correlation-id'] = id;
  res.setHeader('X-Correlation-ID', id);

  next();
}
