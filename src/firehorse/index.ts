/**
 * Firehorse Omnichannel Next Pilot
 * CustomerPilotLoop v1
 *
 * Main entry point for Firehorse Pilot automation
 */

export * from './types';
export * from './state-machine';
export * from './actions';
export * from './database';
export * from './email-service';
export * from './linkedin-service';
export * from './scheduler';
export * from './helpers';
export * from './report-module';
export * from './report-scheduler';
export * from './workflow-engine';
export { default as firehorseRoutes } from './routes';

import { scheduler } from './scheduler';
import { reportScheduler } from './report-scheduler';
import logger from '../utils/logger.js';

/**
 * Initialize Firehorse Pilot
 */
export function initFirehorsePilot(): void {
  logger.info('🔥 Initializing Firehorse Omnichannel Next Pilot...');

  // Start omnichannel outreach scheduler
  scheduler.start();

  // Start report delivery scheduler (hourly — runs due report_schedules)
  reportScheduler.start();

  logger.info('✅ Firehorse Pilot initialized');
}

/**
 * Shutdown Firehorse Pilot
 */
export function shutdownFirehorsePilot(): void {
  logger.info('🔥 Shutting down Firehorse Omnichannel Next Pilot...');

  // Stop schedulers
  scheduler.stop();
  reportScheduler.stop();

  logger.info('✅ Firehorse Pilot shutdown complete');
}
