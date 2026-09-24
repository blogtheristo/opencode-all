#!/usr/bin/env -S node --import tsx
/**
 * CLI: send a human decision to a pending approval Workflow.
 * TS-SDK equivalent of the "approval signal sender" script in
 * temporalio/ai-cookbook's human_in_the_loop_python example.
 *
 * Usage:
 *   npm run temporal:approve -- <requestId> --approve --by "Risto Paarni" [--note "looks good"]
 *   npm run temporal:approve -- <requestId> --reject --by "Risto Paarni" --note "not yet"
 */
import { sendApprovalDecision } from '../src/temporal/approvals.js';
import logger from '../src/utils/logger.js';

function parseArgs(argv: string[]) {
  const [requestId, ...rest] = argv;
  if (!requestId) {
    throw new Error(
      'Usage: temporal-send-approval.ts <requestId> --approve|--reject --by "<name>" [--note "..."]',
    );
  }

  let approved: boolean | undefined;
  let decidedBy: string | undefined;
  let note: string | undefined;

  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === '--approve') approved = true;
    else if (arg === '--reject') approved = false;
    else if (arg === '--by') decidedBy = rest[++i];
    else if (arg === '--note') note = rest[++i];
  }

  if (approved === undefined) throw new Error('Must pass --approve or --reject');
  if (!decidedBy) throw new Error('Must pass --by "<name>"');

  return { requestId, approved, decidedBy, note };
}

async function main(): Promise<void> {
  const { requestId, approved, decidedBy, note } = parseArgs(process.argv.slice(2));
  await sendApprovalDecision(requestId, { approved, decidedBy, note });
  logger.info('Approval decision sent', { requestId, approved, decidedBy });
}

main().catch((err) => {
  logger.error('Failed to send approval decision', { error: (err as Error).message });
  process.exit(1);
});
