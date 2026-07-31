/**
 * Email API Routes
 *
 * REST endpoints for the DWS IQ 6 email capability.
 * Emails are queued via Redis Streams for reliable async delivery,
 * with fallback to direct send when Redis is unavailable.
 *
 * Endpoints:
 *   POST /api/v1/email/send          — Queue an email for delivery
 *   POST /api/v1/email/send-direct   — Send immediately (bypass queue)
 *   GET  /api/v1/email/queue/info    — Queue health and depth
 *
 * Auth: All endpoints require a valid JWT via Authorization header,
 *       except queue/info which also accepts the X-Admin-Key header.
 */

import { type Request, type Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import emailService from '../services/email.service.js';
import { emailQueue } from '../services/email-queue.service.js';
import type { QueuedEmail } from '../services/email-queue.service.js';

const router = Router();

// ============================================================================
// VALIDATION MIDDLEWARE
// ============================================================================

const sendValidation = [
  body('to').isEmail().withMessage('Valid email address required'),
  body('subject').isString().trim().notEmpty().withMessage('Subject is required'),
  body('templateType')
    .optional()
    .isIn(['welcome', 'password_reset', 'report_delivery', 'notification', 'invoice', 'custom'])
    .withMessage('Invalid template type'),
  body('body').optional().isString().withMessage('Body must be a string'),
  body('html').optional().isString().withMessage('HTML must be a string'),
  body('metadata').optional().isObject().withMessage('Metadata must be an object'),
  body('source')
    .optional()
    .isIn(['platform', 'firehorse', 'outreach', 'admin'])
    .withMessage('Invalid source'),
];

function handleValidationErrors(req: Request, res: Response): boolean {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: 'path' in e ? e.path : undefined,
        message: e.msg,
      })),
    });
    return true;
  }
  return false;
}

// ============================================================================
// POST /send — Queue email for async delivery via Redis Streams
// ============================================================================

router.post('/send', sendValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const { to, subject, body: bodyText, html, templateType, metadata, source } = req.body;

  const email: QueuedEmail = {
    to,
    subject,
    html: html || bodyText || '',
    templateType: templateType || 'notification',
    metadata: metadata || {},
    source: source || 'platform',
  };

  try {
    const messageId = await emailQueue.enqueue(email);

    logger.info('Email queued via API', {
      messageId,
      to,
      subject,
      templateType: email.templateType,
      source: email.source,
    });

    res.status(202).json({
      success: true,
      messageId,
      queued: messageId !== 'direct',
      message:
        messageId === 'direct'
          ? 'Email sent directly (queue unavailable)'
          : 'Email queued for delivery',
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Email send API error', { error: errorMsg, to });
    res.status(500).json({ error: 'Failed to send email', message: errorMsg });
  }
});

// ============================================================================
// POST /send-direct — Send immediately, bypassing the queue
// ============================================================================

router.post('/send-direct', sendValidation, async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  const { to, subject, body: bodyText, html, templateType, metadata } = req.body;

  try {
    // Route to the appropriate template method
    switch (templateType) {
      case 'welcome':
        await emailService.sendWelcomeEmail(to, metadata?.name || 'User');
        break;
      case 'password_reset':
        await emailService.sendPasswordResetEmail(to, metadata?.resetLink || '');
        break;
      case 'report_delivery':
        await emailService.sendReportDeliveryEmail(
          to,
          metadata?.reportName || 'Report',
          metadata?.downloadUrl || '',
        );
        break;
      case 'invoice':
        await emailService.sendInvoiceEmail(
          to,
          metadata?.invoiceId || '',
          metadata?.amount || 0,
          metadata?.currency || 'EUR',
        );
        break;
      default:
        await emailService.sendNotificationEmail(to, subject, html || bodyText || '');
        break;
    }

    logger.info('Email sent directly via API', { to, subject, templateType });
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Direct email send failed', { error: errorMsg, to });
    res.status(500).json({ error: 'Failed to send email', message: errorMsg });
  }
});

// ============================================================================
// GET /queue/info — Queue health and depth
// ============================================================================

router.get('/queue/info', async (_req: Request, res: Response) => {
  try {
    const info = await emailQueue.getQueueInfo();
    res.json({
      success: true,
      queue: info,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to get queue info', message: errorMsg });
  }
});

// ============================================================================
// GET /analytics — Email delivery analytics (counts by status, template type)
// ============================================================================

router.get('/analytics', async (_req: Request, res: Response) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(503).json({
      error: 'Email analytics unavailable',
      message: 'Supabase not configured',
    });
    return;
  }

  try {
    // Fetch email log stats from Supabase
    const response = await fetch(
      `${supabaseUrl}/rest/v1/email_logs?select=status,template_type,sent_at`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.warn('Email analytics query failed', {
        status: response.status,
        error: errorBody,
      });
      res.status(502).json({
        error: 'Failed to fetch email analytics',
        message: errorBody,
      });
      return;
    }

    const logs = (await response.json()) as Array<{
      status: string;
      template_type: string | null;
      sent_at: string | null;
    }>;

    // Aggregate by status
    const byStatus: Record<string, number> = {};
    for (const log of logs) {
      byStatus[log.status] = (byStatus[log.status] || 0) + 1;
    }

    // Aggregate by template type
    const byTemplate: Record<string, number> = {};
    for (const log of logs) {
      const key = log.template_type || 'unknown';
      byTemplate[key] = (byTemplate[key] || 0) + 1;
    }

    // Last 24h count
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const last24h = logs.filter((l) => l.sent_at && l.sent_at >= oneDayAgo).length;

    res.json({
      success: true,
      analytics: {
        total: logs.length,
        last24h,
        byStatus,
        byTemplate,
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Email analytics error', { error: errorMsg });
    res.status(500).json({ error: 'Failed to get email analytics', message: errorMsg });
  }
});

export default router;
