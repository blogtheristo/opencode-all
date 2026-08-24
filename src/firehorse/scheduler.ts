/**
 * Firehorse Omnichannel Next Pilot - Scheduler
 * CustomerPilotLoop v1
 *
 * Daily scheduler for:
 * - Processing new leads (08:00)
 * - Processing Cold 2 candidates (3 days after Cold 1)
 * - Processing Cold 3 candidates (5 days after Cold 2)
 */

import * as cron from 'node-cron';
import logger from '../utils/logger.js';
import {
  processCold2Candidates,
  processCold3Candidates,
  processNewLeadsDaily,
} from './state-machine';

// ============================================================================
// SCHEDULER
// ============================================================================

export class FirehorseScheduler {
  private dailyJob: cron.ScheduledTask | null = null;
  private followUpJob: cron.ScheduledTask | null = null;

  /**
   * Start the scheduler
   */
  start(): void {
    logger.info('🚀 Starting Firehorse Scheduler...');

    // Daily job at 08:00 - Process new leads
    this.dailyJob = cron.schedule('0 8 * * *', async () => {
      logger.info('⏰ Running daily new leads job...');
      try {
        await processNewLeadsDaily();
      } catch (error) {
        logger.error('Error in daily new leads job:', error);
      }
    });

    // Follow-up job every 6 hours - Check for Cold 2 and Cold 3 candidates
    this.followUpJob = cron.schedule('0 */6 * * *', async () => {
      logger.info('⏰ Running follow-up job...');
      try {
        await processCold2Candidates();
        await processCold3Candidates();
      } catch (error) {
        logger.error('Error in follow-up job:', error);
      }
    });

    logger.info('✅ Firehorse Scheduler started');
    logger.info('  - Daily new leads: 08:00');
    logger.info('  - Follow-ups: Every 6 hours');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    logger.info('🛑 Stopping Firehorse Scheduler...');

    if (this.dailyJob) {
      this.dailyJob.stop();
    }

    if (this.followUpJob) {
      this.followUpJob.stop();
    }

    logger.info('✅ Firehorse Scheduler stopped');
  }

  /**
   * Run jobs manually (for testing)
   */
  async runManually(job: 'daily' | 'cold2' | 'cold3' | 'all'): Promise<void> {
    logger.info(`🔧 Running manual job: ${job}`);

    try {
      switch (job) {
        case 'daily':
          await processNewLeadsDaily();
          break;
        case 'cold2':
          await processCold2Candidates();
          break;
        case 'cold3':
          await processCold3Candidates();
          break;
        case 'all':
          await processNewLeadsDaily();
          await processCold2Candidates();
          await processCold3Candidates();
          break;
      }
      logger.info('✅ Manual job completed');
    } catch (error) {
      logger.error('❌ Manual job failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const scheduler = new FirehorseScheduler();
