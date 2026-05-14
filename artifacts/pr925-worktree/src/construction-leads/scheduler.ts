/**
 * Construction Leads Scheduler
 *
 * Daily automated fetch of construction tenders from TED API.
 * Runs Mon-Fri at 05:30 Helsinki (30min before morning briefing).
 */

import * as cron from 'node-cron';
import logger from '../utils/logger.js';
import { fetchAndProcessLeads } from './lead-processor.js';
import { DEFAULT_QUERY_CONFIG } from './ted-api.js';

export class ConstructionLeadsScheduler {
  private fetchJob: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler.
   * Cron: 30 5 * * 1-5 = 05:30, Mon-Fri (weekdays only)
   * Runs 30 minutes before the CEO Cockpit briefing at 06:00.
   */
  start(): void {
    logger.info('Starting Construction Leads Scheduler');

    this.fetchJob = cron.schedule(
      '30 5 * * 1-5',
      async () => {
        logger.info('Running daily construction leads fetch');
        try {
          const result = await fetchAndProcessLeads(DEFAULT_QUERY_CONFIG);
          logger.info('Daily construction leads fetch complete', result);
        } catch (error) {
          logger.error('Daily construction leads fetch failed', { error });
        }
      },
      {
        timezone: 'Europe/Helsinki',
      },
    );

    logger.info('Construction Leads Scheduler started — 05:30 Helsinki, Mon-Fri');
  }

  /**
   * Stop the scheduler.
   */
  stop(): void {
    if (this.fetchJob) {
      this.fetchJob.stop();
    }
    logger.info('Construction Leads Scheduler stopped');
  }

  /**
   * Run manually (for testing or immediate trigger).
   */
  async runManually(): Promise<void> {
    logger.info('Running construction leads fetch manually');
    const result = await fetchAndProcessLeads(DEFAULT_QUERY_CONFIG);
    logger.info('Manual construction leads fetch complete', result);
  }
}

export const constructionLeadsScheduler = new ConstructionLeadsScheduler();
