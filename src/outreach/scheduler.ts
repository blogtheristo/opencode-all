/**
 * Outreach Scheduler
 *
 * Runs Mon-Fri at 07:00 Helsinki time (Europe/Helsinki = UTC+2/+3).
 * Generates 3 daily tasks (1 investor, 1 customer, 1 partner)
 * and emails them to risto@lifetime.fi.
 */

import * as cron from 'node-cron';
import { sendDailyDigestEmail } from './daily-digest.js';

export class OutreachScheduler {
  private dailyDigestJob: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler
   * Cron: 0 7 * * 1-5 = 07:00, Mon-Fri
   */
  start(): void {
    console.log('Starting Outreach Scheduler...');

    this.dailyDigestJob = cron.schedule(
      '0 7 * * 1-5',
      async () => {
        console.log('Running daily outreach digest...');
        try {
          await sendDailyDigestEmail();
          console.log('Daily outreach digest sent');
        } catch (error) {
          console.error('Error in daily outreach digest:', error);
        }
      },
      {
        timezone: 'Europe/Helsinki',
      }
    );

    console.log('Outreach Scheduler started');
    console.log('  - Daily digest: 07:00 Helsinki, Mon-Fri');
    console.log('  - Recipient: ' + (process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi'));
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (this.dailyDigestJob) {
      this.dailyDigestJob.stop();
    }
    console.log('Outreach Scheduler stopped');
  }

  /**
   * Run manually (for testing or immediate trigger)
   */
  async runManually(): Promise<void> {
    console.log('Running outreach digest manually...');
    await sendDailyDigestEmail();
    console.log('Manual outreach digest completed');
  }
}

export const outreachScheduler = new OutreachScheduler();
