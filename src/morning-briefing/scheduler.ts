/**
 * Morning Briefing — CEO Cockpit
 *
 * Delivery: GitHub Actions workflow (.github/workflows/morning-briefing.yml)
 * fires Mon-Sat at 06:00 Helsinki via dual UTC crons (DST-safe).
 *
 * This module provides the send logic used by both the standalone script
 * (scripts/send-morning-briefing.ts) and the Express manual-trigger endpoint.
 *
 * Uses Resend (primary) with SendGrid fallback.
 */

import logger from '../utils/logger.js';
import { collectCockpitData } from './data-collectors.js';
import { buildCockpitHtml, buildCockpitPlainText } from './briefing-template.js';

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

  // Send via Resend (primary) or SendGrid (fallback)
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;

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
      logger.warn('Resend CEO Cockpit failed, trying SendGrid', {
        status: response.status,
        error: errorBody,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Resend CEO Cockpit error, trying SendGrid', { error: msg });
    }
  }

  if (sendgridKey) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sendgridKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipient }] }],
          from: { email: fromAddress },
          subject,
          content: [
            { type: 'text/plain', value: text },
            { type: 'text/html', value: html },
          ],
        }),
      });

      if (response.ok || response.status === 202) {
        logger.info('CEO Cockpit sent via SendGrid', { to: recipient });
        return;
      }

      const errorBody = await response.text();
      logger.warn('SendGrid CEO Cockpit also failed', {
        status: response.status,
        error: errorBody,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('SendGrid CEO Cockpit error', { error: msg });
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
