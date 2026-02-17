/**
 * Morning Briefing — CEO Cockpit
 *
 * Delivery: GitHub Actions workflow (.github/workflows/morning-briefing.yml)
 * fires Mon-Sat at 06:00 Helsinki via dual UTC crons (DST-safe).
 *
 * This module provides the send logic used by both the standalone script
 * (scripts/send-morning-briefing.ts) and the Express manual-trigger endpoint.
 *
 * Uses Resend for email delivery.
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

  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    logger.warn('RESEND_API_KEY not configured. Printing cockpit to console.');
    console.log('\n' + text);
    return;
  }

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
    logger.error('Resend CEO Cockpit failed', {
      status: response.status,
      error: errorBody,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Resend CEO Cockpit error', { error: msg });
  }
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
