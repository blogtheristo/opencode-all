/**
 * Usage Metering Routes
 *
 * GET /api/v1/usage          — Get user's usage stats for current period
 * GET /api/v1/usage/platform — Admin: get platform-wide usage (requires admin role)
 *
 * MVP Feature 2
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { UsageMeteringService, TIERS } from '../services/usage-metering.service.js';

const router = Router();

// All usage routes require authentication
router.use(authenticateToken);

/**
 * GET /api/v1/usage
 * Get current user's usage statistics for the billing period.
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await UsageMeteringService.getUsageStats(req.userId!);

    res.json({
      ...stats,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/usage/tiers
 * Get available subscription tiers and their limits.
 */
router.get('/tiers', (_req: Request, res: Response) => {
  res.json({
    tiers: TIERS,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/usage/platform
 * Admin-only: aggregate platform usage stats.
 */
router.get(
  '/platform',
  requireRole(['admin', 'owner']),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await UsageMeteringService.getPlatformStats();

      res.json({
        ...stats,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
