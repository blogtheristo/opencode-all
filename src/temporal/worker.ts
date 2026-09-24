/**
 * Temporal Worker Bootstrap
 *
 * One Worker process polls all six domain task queues (see task-queues.ts).
 * Split into per-domain Workers later if throughput demands it; a single
 * process is the right starting scale for DWS6's current volume.
 *
 * Run via: npm run temporal:worker (scripts/temporal-worker.ts)
 * Requires a reachable Temporal server — see src/temporal/client.ts.
 */
import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/index.js';
import { TASK_QUEUES } from './task-queues.js';
import { getTemporalAddress, getTemporalNamespace } from './client.js';
import logger from '../utils/logger.js';

const WORKFLOWS_PATH = new URL('./workflows/index.js', import.meta.url).pathname;

async function createWorkerForQueue(taskQueue: string): Promise<Worker> {
  const connection = await NativeConnection.connect({
    address: getTemporalAddress(),
    tls: process.env.TEMPORAL_TLS === 'true',
  });

  return Worker.create({
    connection,
    namespace: getTemporalNamespace(),
    taskQueue,
    workflowsPath: WORKFLOWS_PATH,
    activities,
  });
}

export async function runTemporalWorkers(): Promise<void> {
  const queues = Object.values(TASK_QUEUES);
  logger.info('Starting Temporal workers', { queues, address: getTemporalAddress() });

  const workers = await Promise.all(queues.map(createWorkerForQueue));
  await Promise.all(workers.map((worker) => worker.run()));
}
