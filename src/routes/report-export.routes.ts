/**
 * Report Export Routes
 *
 * POST /api/v1/reports/export     — Generate and download a compliance report
 * POST /api/v1/reports/schedule   — Create a scheduled report
 * GET  /api/v1/reports/schedules  — List user's report schedules
 * DELETE /api/v1/reports/schedule/:id — Delete a schedule
 * PATCH /api/v1/reports/schedule/:id/toggle — Enable/disable a schedule
 *
 * MVP Feature 3
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { ReportExportService } from '../services/report-export.service.js';
import { UsageMeteringService } from '../services/usage-metering.service.js';
import logger from '../utils/logger.js';

const router = Router();

// All report routes require authentication
router.use(authenticateToken);

// ============ SCHEMAS ============

const ExportSchema = z.object({
  companyName: z.string().min(1).max(200),
  industry: z.string().min(1),
  country: z.string().length(2).default('FI'),
  format: z.enum(['json', 'csv']).default('json'),
  includeGaps: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true),
});

const ScheduleSchema = z.object({
  companyName: z.string().min(1).max(200),
  industry: z.string().min(1),
  country: z.string().length(2).default('FI'),
  frequency: z.enum(['monthly', 'quarterly', 'annually']),
  format: z.enum(['json', 'csv']).default('json'),
  recipientEmail: z.string().email(),
  enabled: z.boolean().default(true),
});

// ============ ROUTES ============

/**
 * POST /api/v1/reports/export
 * Generate and return a downloadable compliance report.
 */
router.post(
  '/export',
  validate({ body: ExportSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Check usage limits before generating
      const usageResult = await UsageMeteringService.recordUsage(
        userId,
        'report_export',
        '/api/v1/reports/export',
      );

      if (!usageResult.allowed) {
        res.status(429).json({
          error: 'Report export limit reached',
          message: `You have used all ${usageResult.limit} report exports for this billing period. Upgrade your plan for more.`,
          remaining: 0,
          limit: usageResult.limit,
        });
        return;
      }

      const result = await ReportExportService.generateExport(req.body);

      // Set download headers
      res.setHeader('Content-Type', result.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('X-Report-Generated-At', result.generatedAt);
      res.setHeader('X-Report-Records', result.recordCount.toString());
      res.setHeader('X-Usage-Remaining', usageResult.remaining.toString());

      res.send(result.data);
    } catch (err) {
      logger.error('Report export failed', {
        userId: req.userId,
        error: err instanceof Error ? err.message : 'Unknown',
      });
      next(err);
    }
  },
);

/**
 * POST /api/v1/reports/schedule
 * Create a scheduled report delivery.
 */
router.post(
  '/schedule',
  validate({ body: ScheduleSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const schedule = await ReportExportService.createSchedule(userId, req.body);

      res.status(201).json({
        message: 'Report schedule created',
        schedule,
      });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/reports/schedules
 * List all report schedules for the authenticated user.
 */
router.get('/schedules', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const scheduleList = await ReportExportService.listSchedules(userId);

    res.json({
      schedules: scheduleList,
      total: scheduleList.length,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/reports/schedule/:id
 * Delete a report schedule.
 */
router.delete('/schedule/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const deleted = await ReportExportService.deleteSchedule(userId, req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({ message: 'Schedule deleted', scheduleId: req.params.id });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/reports/schedule/:id/toggle
 * Toggle schedule enabled/disabled.
 */
router.patch('/schedule/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const schedule = await ReportExportService.toggleSchedule(userId, req.params.id);

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    res.json({
      message: `Schedule ${schedule.enabled ? 'enabled' : 'disabled'}`,
      schedule,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
