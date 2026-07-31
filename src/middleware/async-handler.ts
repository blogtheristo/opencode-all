/**
 * Async Route Handler Wrapper
 *
 * Catches unhandled promise rejections in Express route handlers
 * and forwards them to the global error handler middleware.
 *
 * Without this, a forgotten try/catch in an async route silently
 * hangs the request (Express 4 doesn't catch rejected promises).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (P0-RC2 backend error hardening)
 * Date: 2026-03-21
 */

import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an async route handler to auto-forward errors to next().
 *
 * @example
 * router.get('/data', asyncHandler(async (req, res) => {
 *   const data = await fetchData(); // no try/catch needed
 *   res.json(data);
 * }));
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
