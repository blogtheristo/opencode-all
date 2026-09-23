#!/usr/bin/env -S node --import tsx
/**
 * Entry point: `npm run temporal:worker`
 * Separate process from src/app.ts (the Express API) — run alongside it,
 * pointed at a self-hosted Temporal server (DGX Spark; see
 * src/temporal/client.ts for env vars).
 */
import { runTemporalWorkers } from '../src/temporal/worker.js';
import logger from '../src/utils/logger.js';

runTemporalWorkers().catch((err) => {
  logger.error('Temporal worker crashed', { error: (err as Error).message });
  process.exit(1);
});
