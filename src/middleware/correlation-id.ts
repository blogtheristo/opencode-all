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
  const id = existing || crypto.randomUUID();

  // Make it available on req and response headers
  req.headers['x-correlation-id'] = id;
  res.setHeader('X-Correlation-ID', id);

  next();
}
