/**
 * Captain's Table — Public Application Route
 *
 * POST /api/v1/captain/apply — Receives captain seat applications from dws10.com/captain
 * No auth required (public lead form). Rate-limited. Sends notification email + inserts into captain_inquiries.
 */

import { type Request, type Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import emailService from '../services/email.service.js';
import { getSupabaseClient } from '../config/supabase.js';

const router = Router();

// Rate limit: 5 applications per IP per hour
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many applications. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const applyValidation = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('company').optional().isString().trim(),
  body('seat_type').isString().trim().notEmpty().withMessage('Seat type is required'),
  body('industry').isString().trim().notEmpty().withMessage('Industry is required'),
  body('message').optional().isString().trim(),
];

router.post('/apply', applyLimiter, applyValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: 'path' in e ? e.path : undefined,
        message: e.msg,
      })),
    });
    return;
  }

  const { name, email, company, seat_type, industry, message } = req.body;

  const html = `
    <h2>New Captain's Table Application</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;">
      <tr><td style="padding:8px;font-weight:bold;">Name</td><td style="padding:8px;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Company</td><td style="padding:8px;">${escapeHtml(company || '—')}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Seat Type</td><td style="padding:8px;">${escapeHtml(seat_type)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Industry</td><td style="padding:8px;">${escapeHtml(industry)}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Message</td><td style="padding:8px;">${escapeHtml(message || '—')}</td></tr>
    </table>
    <p style="margin-top:16px;color:#666;">Submitted from dws10.com/captain at ${new Date().toISOString()}</p>
  `;

  try {
    await emailService.sendNotificationEmail(
      process.env.EMAIL_FROM || 'risto@onelifetime.world',
      `Captain Application: ${name} — ${industry} (${seat_type})`,
      html
    );

    logger.info('Captain application received', { name, email, industry, seat_type });

    res.status(200).json({
      success: true,
      message: 'Application received. We will contact you within 48 hours.',
    });

    // Fire-and-forget DB insert — never affects HTTP response
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from('captain_inquiries')
        .insert({
          name,
          email,
          industry,
          seat_level: seat_type,
          message: message || null,
        })
        .then(
          ({ error: dbError }) => {
            if (dbError) {
              logger.warn('Captain inquiry DB insert failed', { error: dbError.message, name, email });
            }
          },
          (err: unknown) => {
            logger.warn('Captain inquiry DB insert error', { error: err instanceof Error ? err.message : 'unknown', name, email });
          },
        );
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Captain application email failed', { error: errorMsg, name, email });
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default router;
