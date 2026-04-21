/**
 * Morning Briefing Scheduler — CEO Cockpit
 *
 * Runs Mon-Sat at 06:00 Helsinki time (Europe/Helsinki).
 * Sends a focused 5-minute CEO cockpit briefing:
 *   1. 3 Changes (pipeline, product, delivery)
 *   2. Today's 3 Bets
 *   3. Top Risk + next action
 *   4. Captain Momentum (who to ping + artifact)
 *   5. Metrics Strip (MRR, active convos, commits, MVP ETA)
 *   6. Send List (3-5 contacts for manual outreach)
 *
 * Uses Resend (primary) with SendGrid fallback.
 */

import * as cron from 'node-cron';
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
        logger.info('CEO Cockpit sent via Resend', {
          transport: 'resend',
          recipientCount: 1,
        });
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
        logger.info('CEO Cockpit sent via SendGrid', {
          transport: 'sendgrid',
          recipientCount: 1,
        });
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
// SCHEDULER CLASS
// ============================================================================

export class MorningBriefingScheduler {
  private job: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler.
   * Cron: 0 6 * * 1-6 = 06:00, Mon-Sat (Helsinki timezone)
   */
  start(): void {
    logger.info('Starting CEO Cockpit Scheduler');

    this.job = cron.schedule(
      '0 6 * * 1-6',
      async () => {
        logger.info('Running CEO Cockpit briefing');
        try {
          await sendMorningBriefing();
        } catch (error) {
          logger.error('CEO Cockpit briefing failed', { error });
        }
      },
      {
        timezone: 'Europe/Helsinki',
      }
    );

    logger.info('CEO Cockpit Scheduler started — 06:00 Helsinki, Mon-Sat', {
      recipient: process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi',
    });
  }

  /**
   * Stop the scheduler.
   */
  stop(): void {
    if (this.job) {
      this.job.stop();
    }
    logger.info('CEO Cockpit Scheduler stopped');
  }

  /**
   * Run manually (for testing or immediate trigger).
   */
  async runManually(): Promise<void> {
    logger.info('Running CEO Cockpit manually');
    await sendMorningBriefing();
  }
}

export const morningBriefingScheduler = new MorningBriefingScheduler();
