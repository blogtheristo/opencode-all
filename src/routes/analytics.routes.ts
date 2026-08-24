/**
 * Analytics Routes — DWS IQ 6/7 (GTM Machine Phase 2b)
 *
 * REST API for funnel analytics dashboard.
 * Endpoints: funnel visualization, drop-off analysis, cohort metrics.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (GTM Machine Phase 2b)
 * Branch: claude/implement-gtm-machine-Avz67
 * Date: 2026-04-28
 * Owner: Lifetime Oy
 */

import { type Request, type Response, Router } from 'express';
import logger from '../utils/logger.js';
import { analyticsService } from '../services/analytics.service.js';

const router = Router();

/**
 * GET /api/v1/analytics/funnel
 * Get funnel visualization with conversion rates
 *
 * Query parameters:
 *   - vertical: construction|manufacturing|logistics|energy|etc
 *   - company_size: sme|mid_market|enterprise
 *   - region: eu|dach|nordic|uk|other
 *   - days: 7|30|90 (default 30)
 *
 * Response:
 * {
 *   "funnel": [
 *     {
 *       "step": 1,
 *       "label": "Entry",
 *       "enters": 100,
 *       "completes": 90,
 *       "drop_off": 10,
 *       "conversion_rate": 0.90
 *     },
 *     ...
 *   ],
 *   "metrics": {
 *     "total_entries": 100,
 *     "completion_rate": 0.34,
 *     "avg_funnel_time_hours": 720,
 *     "revenue_eur": 156800,
 *     "aov_eur": 4611
 *   },
 *   "email_engagement": {
 *     "step_4_opens": 0.93,
 *     "step_4_clicks": 0.60,
 *     "form_starts": 0.66,
 *     "form_completes": 0.57
 *   }
 * }
 */
router.get('/funnel', async (req: Request, res: Response) => {
  try {
    const filter = {
      vertical: req.query.vertical as string | undefined,
      company_size: req.query.company_size as string | undefined,
      region: req.query.region as string | undefined,
      days: req.query.days ? parseInt(req.query.days as string) : undefined,
    };

    logger.debug('Analytics funnel request', { filter });

    const funnel = await analyticsService.getFunnel(filter);

    return res.status(200).json(funnel);
  } catch (err) {
    logger.error('Analytics funnel error', { error: String(err) });
    return res.status(500).json({ error: 'Failed to fetch funnel data' });
  }
});

/**
 * GET /api/v1/analytics/dropoff/:step
 * Get drop-off analysis for a specific funnel step
 *
 * Parameters:
 *   - step: 1-14 (funnel step number)
 *
 * Query parameters:
 *   - days: 7|30|90 (default 30)
 *
 * Response:
 * {
 *   "step": 4,
 *   "label": "Enterprise Form",
 *   "enters": 70,
 *   "completes": 46,
 *   "drop_off": 24,
 *   "drop_off_pct": 0.343,
 *   "reasons": [
 *     { "reason": "VAT ID invalid", "count": 6 },
 *     { "reason": "Form validation", "count": 5 },
 *     ...
 *   ]
 * }
 */
router.get('/dropoff/:step', async (req: Request, res: Response) => {
  try {
    const step = parseInt(req.params.step);
    const days = req.query.days ? parseInt(req.query.days as string) : 30;

    if (isNaN(step) || step < 1 || step > 14) {
      return res.status(400).json({ error: 'Invalid step number (1-14)' });
    }

    logger.debug('Analytics dropoff request', { step, days });

    const dropoff = await analyticsService.getDropoff(step, days);

    return res.status(200).json(dropoff);
  } catch (err) {
    logger.error('Analytics dropoff error', { error: String(err) });
    return res.status(500).json({ error: 'Failed to fetch dropoff data' });
  }
});

/**
 * GET /api/v1/analytics/cohort
 * Get cohort metrics (vertical, company size, region)
 *
 * Query parameters:
 *   - vertical: construction|manufacturing|logistics|energy|etc
 *   - company_size: sme|mid_market|enterprise
 *   - region: eu|dach|nordic|uk|other
 *   - days: 7|30|90 (default 30)
 *
 * Response:
 * {
 *   "cohort": {
 *     "vertical": "construction",
 *     "company_size": "sme",
 *     "region": "nordic",
 *     "days": 30
 *   },
 *   "total_entries": 42,
 *   "completion_rate": 0.38,
 *   "avg_funnel_time_hours": 720,
 *   "revenue_eur": 172500,
 *   "aov_eur": 9609,
 *   "funnel_steps": 7
 * }
 */
router.get('/cohort', async (req: Request, res: Response) => {
  try {
    const filter = {
      vertical: req.query.vertical as string | undefined,
      company_size: req.query.company_size as string | undefined,
      region: req.query.region as string | undefined,
      days: req.query.days ? parseInt(req.query.days as string) : undefined,
    };

    logger.debug('Analytics cohort request', { filter });

    const metrics = await analyticsService.getCohortMetrics(filter);

    return res.status(200).json(metrics);
  } catch (err) {
    logger.error('Analytics cohort error', { error: String(err) });
    return res.status(500).json({ error: 'Failed to fetch cohort metrics' });
  }
});

/**
 * GET /api/v1/analytics/health
 * Health check for analytics service
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = {
      status: 'ok',
      service: 'analytics',
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(health);
  } catch {
    return res.status(503).json({ error: 'Service unavailable' });
  }
});

export default router;
