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
 * Uses SES SMTP delivery via sendEmail().
 */

import * as cron from 'node-cron';
import logger from '../utils/logger.js';
import { collectCockpitData } from './data-collectors.js';
import { buildCockpitHtml, buildCockpitPlainText } from './briefing-template.js';
import { sendEmail } from '../utils/send-email.js';

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

  const result = await sendEmail({
    from: fromAddress,
    to: recipient,
    subject,
    html,
    text,
    source: 'admin',
    templateType: 'ceo_cockpit',
    metadata: { recipientCount: 1 },
  });

  if (!result.ok) {
    logger.error('CEO Cockpit send failed', {
      error: result.error || 'Unknown SES SMTP failure',
    });
    throw new Error(result.error || 'SES SMTP send failed');
  }

  logger.info('CEO Cockpit sent via SES SMTP', {
    transport: result.transport || 'ses',
    recipientCount: 1,
  });
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
      },
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

// Convenience export for manual trigger
export async function sendBriefingNow(): Promise<void> {
  return morningBriefingScheduler.runManually();
}
