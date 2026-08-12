/**
 * Usage Metering Routes
 *
 * GET /api/v1/usage          — Get user's usage stats for current period
 * GET /api/v1/usage/platform — Admin: get platform-wide usage (requires admin role)
 *
 * MVP Feature 2
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { TIERS, UsageMeteringService } from '../services/usage-metering.service.js';
import { tokenUsageService } from '../services/token-usage.service.js';

const router = Router();

// All usage routes require authentication
router.use(authenticateToken);

const ingestValidation = [
  body('events').isArray({ min: 1, max: 500 }).withMessage('events must be an array (1-500)'),
  body('events.*.provider')
    .isIn(['anthropic', 'github', 'openai', 'other'])
    .withMessage('provider must be anthropic/github/openai/other'),
  body('events.*.product')
    .isIn(['claude-code', 'github-copilot', 'other'])
    .withMessage('product must be claude-code/github-copilot/other'),
  body('events.*.model').isString().trim().notEmpty().withMessage('model is required'),
  body('events.*.promptTokens').isInt({ min: 0 }).withMessage('promptTokens must be >= 0'),
  body('events.*.completionTokens')
    .isInt({ min: 0 })
    .withMessage('completionTokens must be >= 0'),
  body('events.*.cachedTokens').isInt({ min: 0 }).withMessage('cachedTokens must be >= 0'),
  body('events.*.sessionId').isString().trim().notEmpty().withMessage('sessionId is required'),
  body('events.*.taskId').isString().trim().notEmpty().withMessage('taskId is required'),
  body('events.*.timestamp').isISO8601().withMessage('timestamp must be ISO8601'),
  body('events.*.eventId').optional().isString().trim().notEmpty(),
];

const summaryValidation = [
  query('periodDays')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('periodDays must be between 1 and 365'),
];

const recommendationsValidation = [
  query('periodDays')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('periodDays must be between 1 and 365'),
  query('sessionId')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('sessionId must be a non-empty string up to 200 chars'),
];

const budgetValidation = [
  body('dailyLimitTokens').isInt({ min: 0 }).withMessage('dailyLimitTokens must be >= 0'),
  body('monthlyLimitTokens').isInt({ min: 0 }).withMessage('monthlyLimitTokens must be >= 0'),
  body('monthlyLimitEur').isFloat({ min: 0 }).withMessage('monthlyLimitEur must be >= 0'),
  body('hardCap').isBoolean().withMessage('hardCap must be boolean'),
  body('notifyThresholds').isArray({ min: 1, max: 5 }).withMessage('notifyThresholds is required'),
  body('notifyThresholds.*')
    .isInt({ min: 1, max: 100 })
    .withMessage('notifyThresholds values must be 1..100'),
];

const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((error) => ({
        field: 'path' in error ? error.path : undefined,
        message: error.msg,
      })),
    });
    return true;
  }
  return false;
};

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
 * POST /api/v1/usage/tokens/ingest
 * Ingest token usage events for the authenticated user.
 */
router.post('/tokens/ingest', ingestValidation, async (req: Request, res: Response, next: NextFunction) => {
  if (handleValidationErrors(req, res)) {
    return;
  }

  try {
    const result = await tokenUsageService.ingestEvents(req.userId!, req.body.events);
    res.status(201).json({
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/usage/tokens/summary
 * Return token usage summary grouped by model for the authenticated user.
 */
router.get('/tokens/summary', summaryValidation, async (req: Request, res: Response, next: NextFunction) => {
  if (handleValidationErrors(req, res)) {
    return;
  }

  try {
    const periodDays =
      typeof req.query.periodDays === 'string' ? Number.parseInt(req.query.periodDays, 10) : 30;
    const summary = await tokenUsageService.getSummary(req.userId!, periodDays);
    res.json({
      ...summary,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/usage/tokens/recommendations
 * Return token optimization recommendations for the authenticated user.
 */
router.get(
  '/tokens/recommendations',
  recommendationsValidation,
  async (req: Request, res: Response, next: NextFunction) => {
  if (handleValidationErrors(req, res)) {
    return;
  }

    try {
      const periodDays =
        typeof req.query.periodDays === 'string' ? Number.parseInt(req.query.periodDays, 10) : 30;
      const sessionId = typeof req.query.sessionId === 'string' ? req.query.sessionId : undefined;
      const recommendationResult = await tokenUsageService.getRecommendations(
        req.userId!,
        periodDays,
        sessionId,
      );

      res.json({
        ...recommendationResult,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/usage/tokens/budgets
 * Configure token usage budget for the authenticated user.
 */
router.post('/tokens/budgets', budgetValidation, async (req: Request, res: Response, next: NextFunction) => {
  if (handleValidationErrors(req, res)) {
    return;
  }

  try {
    const budget = await tokenUsageService.setBudget(req.userId!, {
      dailyLimitTokens: req.body.dailyLimitTokens,
      monthlyLimitTokens: req.body.monthlyLimitTokens,
      monthlyLimitEur: req.body.monthlyLimitEur,
      hardCap: req.body.hardCap,
      notifyThresholds: req.body.notifyThresholds,
    });

    res.json({
      budget,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/usage/tokens/budgets
 * Get configured token budget for the authenticated user.
 */
router.get('/tokens/budgets', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const budget = await tokenUsageService.getBudget(_req.userId!);
    res.json({
      budget,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
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
