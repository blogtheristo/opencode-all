#!/usr/bin/env -S node --import tsx
/**
 * Entry point: `npm run temporal:schedules:setup`
 * One-time (idempotent) setup of Temporal Schedules — run once against a
 * fresh Temporal server, or again after a Schedule definition changes.
 */
import { ensureReportSchedulePoll } from '../src/temporal/schedules.js';
import logger from '../src/utils/logger.js';

async function main(): Promise<void> {
  await ensureReportSchedulePoll();
  logger.info('Temporal schedules ensured');
}

main().catch((err) => {
  logger.error('Temporal schedule setup failed', { error: (err as Error).message });
  process.exit(1);
});
