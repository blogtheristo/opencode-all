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
  const timeout = timeoutMs ?? parseInt(process.env.REQUEST_TIMEOUT_MS || '', 10) || DEFAULT_TIMEOUT_MS;

  return (req: Request, res: Response, next: NextFunction): void => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        logger.warn('Request timeout exceeded', {
          path: req.path,
          method: req.method,
          timeoutMs: timeout,
          correlationId: req.headers['x-correlation-id'],
        });
        next(new AppError(
          `Request timeout after ${timeout}ms`,
          408,
          'REQUEST_TIMEOUT',
        ));
      }
    }, timeout);

    // Clear timeout when response finishes (success or error)
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}
