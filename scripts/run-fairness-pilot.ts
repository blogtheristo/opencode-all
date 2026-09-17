#!/usr/bin/env npx tsx
/**
 * Counterfactual Fairness Pilot — CLI Re-Run
 *
 * Re-runs the EU AI Act Art. 10 / Annex III counterfactual-fairness pilot for
 * the single financed-decision path and emits the signed, reproducible
 * artifact (+ Article-12 evidence). Provided so a reviewer can reproduce the
 * result with one command (Script Automation Rule — no human-memory steps).
 *
 * Usage:
 *   npm run fairness:pilot                       # biased model → verdict FAIL
 *   npm run fairness:pilot -- --penalty 0        # fair model   → verdict PASS
 *   npx tsx scripts/run-fairness-pilot.ts --out ./reports/fairness-pilot
 *
 * Re-running with the same flags produces an identical content hash.
 *
 * Code-Version: 1.0.0
 * Branch: claude/mutatis-fairness-pilot-3jmbb5
 * Date: 2026-06-23
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 */

import dotenv from 'dotenv';
import { emitSignedFairnessReport } from '../src/fairness/emit-signed-fairness-report';
import { HELD_OUT_APPLICANTS } from '../src/synthetic-data/lending-applicants';
import type { FairnessConfig } from '../src/fairness/counterfactual-fairness';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

function getFlag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main(): Promise<void> {
  const outputDir = getFlag('out') ?? 'reports/fairness-pilot';

  const fairnessConfig: FairnessConfig = {};
  const penaltyArg = getFlag('penalty');
  if (penaltyArg !== undefined) {
    const penalty = Number(penaltyArg);
    if (!Number.isFinite(penalty)) {
      console.error(`run-fairness-pilot: --penalty must be a number, got "${penaltyArg}"`);
      process.exit(2);
    }
    fairnessConfig.protectedPenalty = penalty;
  }

  const result = await emitSignedFairnessReport({
    applicants: HELD_OUT_APPLICANTS,
    fairnessConfig,
    outputDir,
  });

  const r = result.artifact.result;
  console.log('\n=== Counterfactual Fairness Pilot ===');
  console.log(`Verdict           : ${result.artifact.verdict}`);
  console.log(`Protected group   : ${r.protectedGroupValue} (n=${r.n})`);
  console.log(`Approval-rate gap : ${(r.approvalRateGap * 100).toFixed(2)}%`);
  console.log(`Decision flip rate: ${(r.flipRate * 100).toFixed(2)}%`);
  console.log(`Mean score delta  : ${r.meanScoreDelta}`);
  console.log(`Content hash       : ${result.contentHash}`);
  console.log(`Artifact (md)     : ${result.artifactMarkdownPath}`);
  console.log(`Artifact (json)   : ${result.artifactJsonPath}`);
  console.log(`Article-12 log    : ${result.article12LogPath}`);
  if (result.supabaseTraceId) console.log(`Supabase trace    : ${result.supabaseTraceId}`);
  if (result.envelopeId) console.log(`DocuSign envelope : ${result.envelopeId}`);

  // Non-zero exit on FAIL so the pilot can gate CI if wired in later.
  process.exit(result.artifact.verdict === 'FAIL' ? 1 : 0);
}

main().catch((err) => {
  console.error('run-fairness-pilot failed:', err instanceof Error ? err.message : err);
  process.exit(2);
});
