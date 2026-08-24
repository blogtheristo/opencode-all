/**
 * Usage Tracking Middleware
 *
 * Automatically records API calls for metering.
 * Attach after authenticateToken middleware on routes that should be metered.
 *
 * MVP Feature 2
 */

import { type NextFunction, type Request, type Response } from 'express';
import { UsageMeteringService } from '../services/usage-metering.service.js';
import logger from '../utils/logger.js';

/**
 * Track API call usage for the authenticated user.
 * Non-blocking — does not fail the request if metering errors.
 */
export function trackUsage(type: 'api_call' | 'assistant_message' | 'report_export' = 'api_call') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      // Not authenticated — skip metering
      return next();
    }

    try {
      const result = await UsageMeteringService.recordUsage(
        req.userId,
        type,
        req.originalUrl,
      );

      // Add usage headers to response
      res.setHeader('X-Usage-Remaining', result.remaining.toString());
      res.setHeader('X-Usage-Limit', result.limit.toString());

      if (!result.allowed) {
        res.status(429).json({
          error: 'Usage limit exceeded',
          message: `You have reached your ${type.replace('_', ' ')} limit for this billing period.`,
          remaining: 0,
          limit: result.limit,
        });
        return;
      }
    } catch (err) {
      // Metering should never block the request
      logger.warn('Usage tracking failed (non-blocking)', {
        userId: req.userId,
        error: err instanceof Error ? err.message : 'Unknown',
      });
    }

    next();
  };
}

export default trackUsage;
