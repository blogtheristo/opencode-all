/**
 * API Versioning Middleware
 *
 * Adds X-API-Version header to all API responses for client compatibility tracking.
 * Version follows the package.json version field.
 */

import { Request, Response, NextFunction } from 'express';

const API_VERSION = '1.0.0';

export function apiVersionMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-API-Version', API_VERSION);
  res.setHeader('X-Powered-By', 'DWS IQ 6');
  next();
}

export { API_VERSION };
