/**
 * Morning Briefing — CEO Cockpit
 *
 * Delivery: GitHub Actions workflow (.github/workflows/morning-briefing.yml)
 * fires Mon-Sat at 06:00 Helsinki via dual UTC crons (DST-safe).
 *
 * This module provides the send logic used by both the standalone script
 * (scripts/send-morning-briefing.ts) and the Express manual-trigger endpoint.
 *
 * Uses Resend (primary) with Gmail SMTP fallback.
 */

import logger from '../utils/logger.js';
import { collectCockpitData } from './data-collectors.js';
import { buildCockpitHtml, buildCockpitPlainText } from './briefing-template.js';
import nodemailer from 'nodemailer';

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

  // Send via Resend (primary) or Gmail SMTP (fallback)
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [recipient],
          subject,
          html,
          text,
        }),
      });

      if (response.ok) {
        logger.info('CEO Cockpit sent via Resend', { to: recipient });
        return;
      }

      const errorBody = await response.text();
      logger.warn('Resend CEO Cockpit failed, trying Gmail SMTP', {
        status: response.status,
        error: errorBody,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Resend CEO Cockpit error, trying Gmail SMTP', { error: msg });
    }
  }

  // Gmail SMTP fallback (App Password)
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (gmailUser && gmailAppPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      await transporter.sendMail({
        from: `"DWS IQ 6" <${gmailUser}>`,
        to: recipient,
        subject,
        html,
        text,
      });

      logger.info('CEO Cockpit sent via Gmail SMTP', { to: recipient });
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Gmail SMTP CEO Cockpit error', { error: msg });
    }
  }

  // No provider — print to console
  logger.warn('No email provider configured. Printing cockpit to console.');
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
