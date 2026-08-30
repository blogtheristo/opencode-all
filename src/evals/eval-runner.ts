/**
 * Eval Runner — DWS IQ Agent Regression Suite
 *
 * Loads JSONL datasets, runs agents, scores outputs, and reports regressions.
 * Designed to run daily (scripts/daily/run-evals.sh) and in CI.
 *
 * Exit codes:
 *   0 — all evals passed (or no API key: all skipped)
 *   1 — regression detected (fail rate > EVAL_FAIL_THRESHOLD)
 *   2 — dataset/config error
 *
 * Env vars:
 *   ANTHROPIC_API_KEY    — required for live runs; absent = skip LLM calls
 *   EVAL_FAIL_THRESHOLD  — float 0-1, default 0.20 (fail if >20% regressions)
 *   EVAL_DATASET         — comma-separated dataset names, default "compliance"
 *   EVAL_LOG_DIR         — output dir, default "logs/eval-results"
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { agentRegistry } from '../agents/index.js';
import { type EvalExpected, scoreResponse } from './scorer.js';
import type { AgentContext } from '../agents/types.js';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Config ───────────────────────────────────────────────────────────────────

const FAIL_THRESHOLD = parseFloat(process.env.EVAL_FAIL_THRESHOLD ?? '0.20');
const DATASETS = (process.env.EVAL_DATASET ?? 'compliance').split(',').map((s) => s.trim());
const LOG_DIR = process.env.EVAL_LOG_DIR ?? path.join(process.cwd(), 'logs', 'eval-results');
const HAS_LLM = Boolean(
  process.env.ANTHROPIC_API_KEY || process.env.GROQ_API_KEY || process.env.GOOGLE_GEMINI_API_KEY,
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface EvalCase {
  id: string;
  agent: string;
  input: Record<string, unknown>;
  expected: EvalExpected;
  /** Human-readable citation for the ground truth */
  source: string;
  /** Optional: regulation being tested */
  regulation?: string;
}

interface EvalResult {
  id: string;
  agent: string;
  source: string;
  status: 'passed' | 'failed' | 'error' | 'skipped';
  score: number;
  reasons: string[];
  latencyMs: number;
  inputHash: string;
}

interface EvalReport {
  runAt: string;
  dataset: string;
  total: number;
  passed: number;
  failed: number;
  errors: number;
  skipped: number;
  passRate: number;
  results: EvalResult[];
}

// ─── Loader ──────────────────────────────────────────────────────────────────

function loadDataset(name: string): EvalCase[] {
  const datasetPath = path.join(__dirname, 'datasets', `${name}.jsonl`);
  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset not found: ${datasetPath}`);
  }

  return fs
    .readFileSync(datasetPath, 'utf-8')
    .split('\n')
    .filter((line) => line.trim())
    .map((line, i) => {
      try {
        return JSON.parse(line) as EvalCase;
      } catch {
        throw new Error(`Dataset "${name}" line ${i + 1}: invalid JSON`);
      }
    });
}

// ─── Runner ──────────────────────────────────────────────────────────────────

const TEST_CONTEXT: AgentContext = {
  projectId: 'eval-harness',
  userId: 'eval-runner',
  orgId: 'dws-internal',
  sessionId: `eval-${Date.now()}`,
};

async function runCase(evalCase: EvalCase): Promise<EvalResult> {
  const inputHash = createHash('sha256')
    .update(JSON.stringify(evalCase.input))
    .digest('hex')
    .slice(0, 16);

  if (!HAS_LLM) {
    return {
      id: evalCase.id,
      agent: evalCase.agent,
      source: evalCase.source,
      status: 'skipped',
      score: 0,
      reasons: ['No LLM API key configured — set ANTHROPIC_API_KEY to run live evals'],
      latencyMs: 0,
      inputHash,
    };
  }

  const start = Date.now();
  try {
    const response = await agentRegistry.executeAgent(evalCase.agent, TEST_CONTEXT, evalCase.input);

    const latencyMs = Date.now() - start;
    const scored = scoreResponse(response, evalCase.expected);

    return {
      id: evalCase.id,
      agent: evalCase.agent,
      source: evalCase.source,
      status: scored.passed ? 'passed' : 'failed',
      score: scored.score,
      reasons: scored.reasons,
      latencyMs,
      inputHash,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      id: evalCase.id,
      agent: evalCase.agent,
      source: evalCase.source,
      status: 'error',
      score: 0,
      reasons: [`Agent threw: ${msg}`],
      latencyMs: Date.now() - start,
      inputHash,
    };
  }
}

async function runDataset(name: string): Promise<EvalReport> {
  const cases = loadDataset(name);
  const results: EvalResult[] = [];

  logger.info(`\n[eval] Dataset: ${name} (${cases.length} cases)`);

  for (const c of cases) {
    const result = await runCase(c);
    results.push(result);

    const icon = result.status === 'passed' ? '✓' : result.status === 'skipped' ? '-' : '✗';
    const line = `  ${icon} ${result.id.padEnd(8)} score=${result.score.toFixed(2)} (${result.latencyMs}ms)`;
    logger.info(line);

    if (result.reasons.length > 0 && result.status !== 'skipped') {
      for (const r of result.reasons) {
        logger.info(`      → ${r}`);
      }
    }
  }

  const passed = results.filter((r) => r.status === 'passed').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const errors = results.filter((r) => r.status === 'error').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const active = results.length - skipped;
  const passRate = active > 0 ? passed / active : 1;

  return {
    runAt: new Date().toISOString(),
    dataset: name,
    total: results.length,
    passed,
    failed,
    errors,
    skipped,
    passRate,
    results,
  };
}

// ─── Reporter ────────────────────────────────────────────────────────────────

function saveReport(report: EvalReport): string {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const filename = `${date}-${report.dataset}.json`;
  const filePath = path.join(LOG_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  return filePath;
}

function loadPreviousReport(datasetName: string): EvalReport | null {
  if (!fs.existsSync(LOG_DIR)) return null;
  const files = fs
    .readdirSync(LOG_DIR)
    .filter((f) => f.endsWith(`-${datasetName}.json`))
    .sort()
    .reverse();

  if (files.length < 2) return null;
  try {
    return JSON.parse(fs.readFileSync(path.join(LOG_DIR, files[1]), 'utf-8')) as EvalReport;
  } catch {
    return null;
  }
}

function printSummary(report: EvalReport): void {
  const prev = loadPreviousReport(report.dataset);
  const delta = prev ? report.passRate - prev.passRate : null;
  const deltaStr =
    delta !== null ? ` (${delta >= 0 ? '+' : ''}${(delta * 100).toFixed(1)}% vs prev)` : '';

  logger.info(
    `\n[eval] ${report.dataset}: ${report.passed}/${report.total - report.skipped} passed — ${(report.passRate * 100).toFixed(1)}%${deltaStr}`,
  );

  if (report.skipped === report.total) {
    logger.info('[eval] All cases skipped — no LLM key. Set ANTHROPIC_API_KEY for live evals.');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let anyRegression = false;

  for (const dataset of DATASETS) {
    let report: EvalReport;
    try {
      report = await runDataset(dataset);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`[eval] FATAL: ${msg}`);
      process.exit(2);
    }

    const savedPath = saveReport(report);
    printSummary(report);
    logger.info(`[eval] Report saved: ${savedPath}`);

    const failRate = (report.failed + report.errors) / Math.max(report.total - report.skipped, 1);
    if (failRate > FAIL_THRESHOLD) {
      logger.error(
        `[eval] REGRESSION: ${(failRate * 100).toFixed(1)}% fail rate exceeds threshold ${(FAIL_THRESHOLD * 100).toFixed(0)}%`,
      );
      anyRegression = true;
    }
  }

  process.exit(anyRegression ? 1 : 0);
}

main().catch((err) => {
  logger.error('[eval] Unhandled error:', err);
  process.exit(2);
});
