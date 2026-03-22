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
export * from './workflow-engine';
export { default as firehorseRoutes } from './routes';

import { scheduler } from './scheduler';

/**
 * Initialize Firehorse Pilot
 */
export function initFirehorsePilot(): void {
  console.log('🔥 Initializing Firehorse Omnichannel Next Pilot...');

  // Start scheduler
  scheduler.start();

  console.log('✅ Firehorse Pilot initialized');
}

/**
 * Shutdown Firehorse Pilot
 */
export function shutdownFirehorsePilot(): void {
  console.log('🔥 Shutting down Firehorse Omnichannel Next Pilot...');

  // Stop scheduler
  scheduler.stop();

  console.log('✅ Firehorse Pilot shutdown complete');
}
