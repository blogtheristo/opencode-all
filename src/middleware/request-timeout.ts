/**
 * Request Timeout Middleware
 *
 * Terminates requests that exceed a configurable timeout.
 * Prevents zombie requests from consuming server resources
 * (especially important on Cloud Run with scale-to-zero).
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (P0-RC2 backend error hardening)
 * Date: 2026-03-21
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './error-handler.js';
import logger from '../utils/logger.js';

const DEFAULT_TIMEOUT_MS = 30_000; // 30 seconds

/**
 * Middleware that aborts requests exceeding the timeout.
 *
 * @param timeoutMs - Max request duration in milliseconds (default: 30s)
 */
export function requestTimeout(timeoutMs?: number) {
  const timeout = timeoutMs ?? (parseInt(process.env.REQUEST_TIMEOUT_MS || '', 10) || DEFAULT_TIMEOUT_MS);

  return (req: Request, res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      // If the response is already in progress or finished, just make sure
      // the underlying connection is torn down to avoid further work.
      if (res.headersSent || res.writableEnded) {
        if (!req.destroyed) {
          req.destroy();
        }
        return;
      }

      // Mark the request as timed out so downstream logic can short-circuit.
      (req as any).timedout = true;

      logger.warn('Request timeout exceeded', {
        path: req.path,
        method: req.method,
        timeoutMs: timeout,
        correlationId: req.headers['x-correlation-id'],
      });

      // Send a 408 response and actively terminate the connection to prevent
      // any further writes from downstream handlers.
      res.status(408).json({
        status: 'error',
        code: 'REQUEST_TIMEOUT',
        message: `Request timeout after ${timeout}ms`,
      });

      // Ensure the response/connection are fully closed.
      if (!res.writableEnded) {
        res.end();
      }
      if (!req.destroyed) {
        req.destroy();
      }
    }, timeout);

    // Clear timeout when response finishes (success or error)
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}
