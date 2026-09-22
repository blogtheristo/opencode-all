#!/usr/bin/env -S node --import tsx
/**
 * CLI: answer a running agentLoopWorkflow's pending ask_human question —
 * the agent-initiated half of the human-in-the-loop pattern (use case #11's
 * ask_human extension). Mirrors scripts/temporal-send-approval.ts.
 *
 * Usage:
 *   npm run temporal:agent-question -- <requestId>                 # read the pending question
 *   npm run temporal:agent-question -- <requestId> --answer "..."   # answer it
 */
import { answerAgentQuestion, getPendingAgentQuestion } from '../src/temporal/agent-loop.js';
import logger from '../src/utils/logger.js';

function parseArgs(argv: string[]) {
  const [requestId, ...rest] = argv;
  if (!requestId) {
    throw new Error('Usage: temporal-answer-agent-question.ts <requestId> [--answer "..."]');
  }
  const answerFlagIndex = rest.indexOf('--answer');
  const answer = answerFlagIndex >= 0 ? rest[answerFlagIndex + 1] : undefined;
  return { requestId, answer };
}

async function main(): Promise<void> {
  const { requestId, answer } = parseArgs(process.argv.slice(2));

  if (!answer) {
    const question = await getPendingAgentQuestion(requestId);
    if (!question) {
      logger.info('No pending question — agent is not currently blocked on ask_human', {
        requestId,
      });
    } else {
      logger.info('Pending question', { requestId, question });
    }
    return;
  }

  await answerAgentQuestion(requestId, answer);
  logger.info('Answer sent', { requestId, answer });
}

main().catch((err) => {
  logger.error('Failed to read/answer agent question', { error: (err as Error).message });
  process.exit(1);
});
