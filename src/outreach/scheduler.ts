/**
 * Outreach Scheduler
 *
 * Runs Mon-Fri at 06:00 Helsinki time (Europe/Helsinki = UTC+2/+3).
 * Sends one email with all 3 pipeline sections to risto@lifetime.fi.
 *
 * Business days: Mon-Fri. Holidays ignored (single founder, not worth the complexity).
 */

import * as cron from 'node-cron';
import logger from '../utils/logger.js';
import { sendDailyDigestEmail } from './daily-digest.js';

export class OutreachScheduler {
  private dailyDigestJob: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler
   * Cron: 0 6 * * 1-5 = 06:00, Mon-Fri
   */
  start(): void {
    logger.info('Starting Outreach Scheduler');

    this.dailyDigestJob = cron.schedule(
      '0 6 * * 1-5',
      async () => {
        logger.info('Running daily outreach digest');
        try {
          await sendDailyDigestEmail();
        } catch (error) {
          logger.error('Daily outreach digest failed', { error });
        }
      },
      {
        timezone: 'Europe/Helsinki',
      }
    );

    logger.info('Outreach Scheduler started — 06:00 Helsinki, Mon-Fri', {
      recipient: process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi',
    });
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.dailyDigestJob) {
      this.dailyDigestJob.stop();
    }
    logger.info('Outreach Scheduler stopped');
  }

  /**
   * Run manually (for testing or immediate trigger)
   */
  async runManually(): Promise<void> {
    logger.info('Running outreach digest manually');
    await sendDailyDigestEmail();
  }
}

export const outreachScheduler = new OutreachScheduler();
