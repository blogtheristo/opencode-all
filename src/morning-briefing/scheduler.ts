/**
 * Morning Briefing — CEO Cockpit
 *
 * Delivery: GitHub Actions workflow (.github/workflows/morning-briefing.yml)
 * fires Mon-Sat at 06:00 Helsinki via dual UTC crons (DST-safe).
 *
 * SECURITY: Resend SDK removed 2026-03-26 due to suspected account compromise.
 * Email delivery: Amazon SES (SMTP) only. Console fallback for dev.
 *
 * risto@onelifetime.world managed by Amazon SES eu-north-1.
 * SMTP env vars: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';
import { collectCockpitData } from './data-collectors.js';
import { buildCockpitHtml, buildCockpitPlainText } from './briefing-template.js';

// ============================================================================
// SMTP TRANSPORT
// ============================================================================

function createSmtpTransport(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ============================================================================
// SEND BRIEFING
// ============================================================================

async function sendMorningBriefing(): Promise<void> {
  const recipient = process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';

  const data = await collectCockpitData();
  const html = buildCockpitHtml(data);
  const text = buildCockpitPlainText(data);

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `CEO Cockpit ${dateStr}`;

  // --- SES SMTP ---
  const smtpTransport = createSmtpTransport();
  if (smtpTransport) {
    try {
      const info = await smtpTransport.sendMail({
        from: fromAddress,
        to: recipient,
        subject,
        html,
        text,
      });
      logger.info('CEO Cockpit sent via SES SMTP', { to: recipient, messageId: info.messageId });
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('SES SMTP send failed', { error: msg });
    }
  }

  // --- Last resort: console ---
  logger.warn('No SMTP transport configured (SMTP_HOST). Printing to console.');
  console.log('\n' + text);
}

// ============================================================================
// PUBLIC API (used by Express manual-trigger endpoint)
// ============================================================================

/**
 * Send the CEO Cockpit briefing immediately.
 * Called from the POST /api/v1/morning-briefing/send endpoint.
 */
export async function sendBriefingNow(): Promise<void> {
  logger.info('Running CEO Cockpit manually');
  await sendMorningBriefing();
}
