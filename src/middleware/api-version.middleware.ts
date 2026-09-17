/**
 * API Versioning Middleware
 *
 * Adds X-API-Version header to all API responses for client compatibility tracking.
 * Version follows the package.json version field.
 */

import { type NextFunction, type Request, type Response } from 'express';

const API_VERSION = '1.0.0';

export function apiVersionMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-API-Version', API_VERSION);
  next();
}

export { API_VERSION };
