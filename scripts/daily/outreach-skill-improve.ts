/**
 * Flow: Outreach Skill Self-Improvement (Outer Loop)
 * Auto-discovered by day-runner.sh in scripts/daily/
 *
 * Implements the outer loop of the DWS outreach self-improvement system.
 * Reads outreach_threads outcomes from the past 7 days, analyzes what
 * worked, and writes a proposal to .claude/clawdbot/proposals/ for HIL review.
 *
 * Based on Zach Lloyd's self-improvement loop pattern:
 *   Inner loop: outreach-orchestrator runs + tracks outcomes in Supabase
 *   Outer loop: this script analyzes outcomes → proposes SKILL.md diffs
 *   Human step: /promote-proposal applies approved diffs to skills/outreach-agents/SKILL.md
 *
 * Code-Version: 1.0
 * Date: 2026-06-15
 * Owner: Claude Code (outreach-agents-spark-7n0fgy)
 *
 * Schedule: daily (runs even when data is sparse — skips if < MIN_THREADS)
 * Promote: weekly (promote-proposal applied by Risto after reviewing)
 */

import 'dotenv/config';
import { agentRegistry } from '../../src/agents/index.js';
import type { AgentContext } from '../../src/agents/types.js';

const FLOW = 'outreach-skill-improve';
const MIN_THREADS = parseInt(process.env.OUTREACH_IMPROVE_MIN_THREADS || '3', 10);
const LOOKBACK_DAYS = parseInt(process.env.OUTREACH_IMPROVE_LOOKBACK_DAYS || '7', 10);
const DRY_RUN = process.env.OUTREACH_IMPROVE_DRY_RUN === 'true';

async function main() {
  console.log(
    `[${FLOW}] Starting — lookback=${LOOKBACK_DAYS}d, minThreads=${MIN_THREADS}, dryRun=${DRY_RUN}`,
  );

  const context: AgentContext = {
    projectId: 'outreach-self-improvement',
    userId: 'system',
    orgId: process.env.DEFAULT_ORG_ID || 'dws',
    sessionId: `${FLOW}-${Date.now()}`,
  };

  try {
    const result = await agentRegistry.executeAgent('outreach-improver', context, {
      lookbackDays: LOOKBACK_DAYS,
      minThreads: MIN_THREADS,
      dryRun: DRY_RUN,
    });

    if (result.result.skipped) {
      console.log(`[${FLOW}] Skipped: ${result.result.reason}`);
      return;
    }

    console.log(`[${FLOW}] Analysis complete`);
    console.log(`  Threads analyzed: ${result.result.threadsAnalyzed}`);
    console.log(`  Response rate: ${result.result.responseRate}`);
    console.log(`  Meeting rate: ${result.result.meetingRate}`);
    console.log(`  Improvements proposed: ${result.result.improvementsProposed}`);

    if (result.result.proposalPath) {
      console.log(`  Proposal written: ${result.result.proposalPath}`);
      console.log(`  Apply with: /promote-proposal ${result.result.proposalPath}`);
    } else if (DRY_RUN) {
      console.log(`  Dry run — no proposal written. Set OUTREACH_IMPROVE_DRY_RUN=false to write.`);
    }

    console.log(`[${FLOW}] Confidence: ${(result.confidence * 100).toFixed(0)}%`);
    console.log(`[${FLOW}] Done.`);
  } catch (err) {
    console.error(`[${FLOW}] FATAL:`, err);
    process.exit(1);
  }
}

main();
