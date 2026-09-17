/**
 * factory-route — CLI for the DWS Factory Router (src/factory/).
 *
 * Reads an agent request body (Anthropic Messages `{messages:[...]}` or OpenAI
 * Responses `{input:[...]}`) from a file or stdin, runs the deterministic detectors
 * and the escalation ladder, and prints a structured JSON verdict. Fully offline.
 *
 * Usage:
 *   npm run factory:route -- --file trajectory.json [options]
 *   cat trajectory.json | npm run factory:route
 *
 * Options:
 *   --file <path>       Request body JSON (default: stdin)
 *   --model <name>      Current model name (default: "unknown")
 *   --tier cheap|strong Current tier (default: cheap)
 *   --cost <usd>        Session spend so far (default: 0)
 *   --budget <usd>      Session budget; 0 disables budget policing (default: 0)
 *   --switches <n>      Cheap→strong switches already used (default: 0)
 *   --restarts <n>      Clean restarts already used (default: 0)
 *   --bad <n>           Consecutive bad checkpoints carried from the previous
 *                       invocation (default: 0). Hysteresis lives across
 *                       checkpoints: feed back the `ladder.consecutiveBad`
 *                       value from the previous run's JSON output, or
 *                       restart_clean/escalate_human can never accumulate the
 *                       two agreeing checkpoints they require.
 *   --evidence          Also print the rendered evidence block to stderr
 *
 * Exit codes: 0 continue, 2 switch_model, 3 restart_clean, 4 escalate_human,
 * 1 on input error — so shell pipelines can branch on the verdict directly.
 */

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import {
  DEFAULT_FACTORY_CONFIG,
  computeSignals,
  decide,
  extractTrajectoryFromBody,
  headline,
  renderEvidence,
  type LadderState,
  type ModelTier,
} from '../src/factory/index.js';

const EXIT_CODES: Record<string, number> = {
  continue: 0,
  switch_model: 2,
  restart_clean: 3,
  escalate_human: 4,
};

function fail(message: string): never {
  console.error(`factory-route: ${message}`);
  process.exit(1);
}

function toNumber(value: string | undefined, fallback: number, label: string): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) fail(`--${label} must be a non-negative number`);
  return parsed;
}

const { values } = parseArgs({
  options: {
    file: { type: 'string' },
    model: { type: 'string' },
    tier: { type: 'string' },
    cost: { type: 'string' },
    budget: { type: 'string' },
    switches: { type: 'string' },
    restarts: { type: 'string' },
    bad: { type: 'string' },
    evidence: { type: 'boolean' },
  },
});

const tier = (values.tier ?? 'cheap') as ModelTier;
if (tier !== 'cheap' && tier !== 'strong') fail('--tier must be "cheap" or "strong"');

const raw = values.file ? readFileSync(values.file, 'utf8') : readFileSync(0, 'utf8');
if (!raw.trim()) fail('empty input; pass --file <path> or pipe a request body on stdin');

let body: Record<string, unknown>;
try {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('input must be a JSON object with a "messages" or "input" array');
  }
  body = parsed as Record<string, unknown>;
} catch (err) {
  fail(`input is not valid JSON: ${err instanceof Error ? err.message : String(err)}`);
}

const state: LadderState = {
  switchesUsed: Math.floor(toNumber(values.switches, 0, 'switches')),
  restartsUsed: Math.floor(toNumber(values.restarts, 0, 'restarts')),
  consecutiveBad: Math.floor(toNumber(values.bad, 0, 'bad')),
};

const trajectory = extractTrajectoryFromBody(body);
const report = computeSignals(trajectory, {
  model: values.model ?? 'unknown',
  tier,
  costUsd: toNumber(values.cost, 0, 'cost'),
  budgetUsd: toNumber(values.budget, 0, 'budget'),
  switchesUsed: state.switchesUsed,
});
const config = { ...DEFAULT_FACTORY_CONFIG, budgetUsd: report.budgetUsd };
const verdict = decide(config, report, state);

if (values.evidence) {
  console.error(renderEvidence(report, trajectory.goal));
}

console.log(
  JSON.stringify(
    {
      action: verdict.action,
      reason: verdict.reason,
      confidence: verdict.confidence,
      interventionProbability: verdict.interventionProbability,
      probabilities: verdict.probabilities,
      headline: headline(report),
      ladder: state,
      signals: report,
    },
    null,
    2,
  ),
);

process.exit(EXIT_CODES[verdict.action] ?? 0);
