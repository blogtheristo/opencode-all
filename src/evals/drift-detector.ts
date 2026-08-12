/**
 * Drift Detector — Agent Confidence Inflection Point Finder
 *
 * Answers the question: "When did it start being wrong?"
 *
 * Reads structured JSONL logs from logs/agent-YYYY-MM-DD.jsonl,
 * computes a daily mean confidence per agent, then identifies the
 * first day the rolling average dropped below the baseline band.
 *
 * Output: JSON drift report written to logs/drift-reports/YYYY-MM-DD.json
 *         Also printed as a summary to stdout.
 *
 * Exit codes:
 *   0 — no drift detected
 *   1 — drift detected in at least one agent (> DRIFT_WARN_THRESHOLD)
 *   2 — config/read error
 *
 * Env vars:
 *   AGENT_LOG_DIR         — path to JSONL log files (default: logs/)
 *   DRIFT_WINDOW_DAYS     — current window size in days (default: 7)
 *   DRIFT_BASELINE_DAYS   — baseline window size in days (default: 14)
 *   DRIFT_WARN_THRESHOLD  — fractional drop triggering warning (default: 0.10)
 *   DRIFT_ALERT_THRESHOLD — fractional drop triggering alert (default: 0.20)
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import fs from 'node:fs';
import path from 'node:path';

// ─── Config ───────────────────────────────────────────────────────────────────

const LOG_DIR = process.env.AGENT_LOG_DIR ?? path.join(process.cwd(), 'logs');
const REPORT_DIR = path.join(LOG_DIR, 'drift-reports');
const WINDOW_DAYS = parseInt(process.env.DRIFT_WINDOW_DAYS ?? '7', 10);
const BASELINE_DAYS = parseInt(process.env.DRIFT_BASELINE_DAYS ?? '14', 10);
const WARN_THRESHOLD = parseFloat(process.env.DRIFT_WARN_THRESHOLD ?? '0.10');
const ALERT_THRESHOLD = parseFloat(process.env.DRIFT_ALERT_THRESHOLD ?? '0.20');
const LOOKBACK_DAYS = WINDOW_DAYS + BASELINE_DAYS + 7; // extra buffer for sparse days

// ─── Types ────────────────────────────────────────────────────────────────────

interface LogLine {
  runId: string;
  agentName: string;
  event: 'start' | 'end' | 'error';
  timestamp: string;
  confidence?: number;
  taskSummary?: string;
  latencyMs?: number;
  status?: string;
}

interface DailyStats {
  date: string; // YYYY-MM-DD
  meanConfidence: number;
  runCount: number;
  errorCount: number;
  p10: number; // 10th percentile confidence
  p90: number; // 90th percentile confidence
}

interface AgentDriftResult {
  agentName: string;
  timeline: DailyStats[];
  /** Mean confidence over the current WINDOW_DAYS period */
  currentMean: number;
  /** Mean confidence over the BASELINE_DAYS period before the window */
  baselineMean: number;
  /** Fractional drop: (baseline - current) / baseline */
  dropFraction: number;
  /** Severity based on thresholds */
  severity: 'ok' | 'warn' | 'alert';
  /** ISO date of the first day where the rolling 3-day mean fell below threshold */
  inflectionDate: string | null;
  /** Sample task summaries from the inflection window (for diagnosis) */
  inflectionSamples: string[];
}

interface DriftReport {
  generatedAt: string;
  windowDays: number;
  baselineDays: number;
  warnThreshold: number;
  alertThreshold: number;
  agents: AgentDriftResult[];
  summary: {
    total: number;
    ok: number;
    warn: number;
    alert: number;
  };
}

// ─── Log reader ───────────────────────────────────────────────────────────────

function dateRange(daysBack: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function readLogFile(date: string): LogLine[] {
  const filePath = path.join(LOG_DIR, `agent-${date}.jsonl`);
  if (!fs.existsSync(filePath)) return [];

  const lines: LogLine[] = [];
  for (const raw of fs.readFileSync(filePath, 'utf-8').split('\n')) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    try {
      lines.push(JSON.parse(trimmed) as LogLine);
    } catch {
      // Skip malformed lines
    }
  }
  return lines;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[idx];
}

function computeDailyStats(lines: LogLine[], date: string): DailyStats | null {
  const endLines = lines.filter((l) => l.event === 'end' && l.confidence !== undefined);
  if (endLines.length === 0) return null;

  const confidences = endLines.map((l) => l.confidence!).sort((a, b) => a - b);
  const errors = lines.filter((l) => l.event === 'error').length;
  const mean = confidences.reduce((s, c) => s + c, 0) / confidences.length;

  return {
    date,
    meanConfidence: Math.round(mean * 1000) / 1000,
    runCount: endLines.length,
    errorCount: errors,
    p10: Math.round(percentile(confidences, 10) * 1000) / 1000,
    p90: Math.round(percentile(confidences, 90) * 1000) / 1000,
  };
}

// ─── Inflection finder ────────────────────────────────────────────────────────

/**
 * Binary-search for the first day where the 3-day rolling mean dropped
 * below (baselineMean * (1 - warnThreshold)).
 * Returns the ISO date string or null if not found.
 */
function findInflection(
  timeline: DailyStats[],
  baselineMean: number,
  threshold: number,
): { date: string | null; samples: string[] } {
  const threshold_value = baselineMean * (1 - threshold);
  // timeline is newest-first; reverse to oldest-first for forward scan
  const chronological = [...timeline].reverse();

  for (let i = 2; i < chronological.length; i++) {
    const window3 = [
      chronological[i - 2].meanConfidence,
      chronological[i - 1].meanConfidence,
      chronological[i].meanConfidence,
    ];
    const rolling = window3.reduce((s, v) => s + v, 0) / 3;
    if (rolling < threshold_value) {
      return { date: chronological[i - 2].date, samples: [] };
    }
  }
  return { date: null, samples: [] };
}

// ─── Per-agent analysis ───────────────────────────────────────────────────────

interface RawEntry {
  date: string;
  lines: LogLine[];
}

function analyseAgent(agentName: string, byDate: RawEntry[]): AgentDriftResult {
  // Build timeline (only dates with data)
  const timeline: DailyStats[] = [];
  const samplesMap = new Map<string, string[]>();

  for (const { date, lines } of byDate) {
    const agentLines = lines.filter((l) => l.agentName === agentName);
    const stats = computeDailyStats(agentLines, date);
    if (stats) {
      timeline.push(stats);
      samplesMap.set(
        date,
        agentLines
          .filter((l) => l.taskSummary)
          .map((l) => l.taskSummary!)
          .slice(0, 3),
      );
    }
  }

  // timeline is newest-first (byDate order)
  const currentWindow = timeline.slice(0, WINDOW_DAYS);
  const baselineWindow = timeline.slice(WINDOW_DAYS, WINDOW_DAYS + BASELINE_DAYS);

  const currentMean =
    currentWindow.length > 0
      ? currentWindow.reduce((s, d) => s + d.meanConfidence, 0) / currentWindow.length
      : 0;

  const baselineMean =
    baselineWindow.length > 0
      ? baselineWindow.reduce((s, d) => s + d.meanConfidence, 0) / baselineWindow.length
      : currentMean; // No baseline: treat as no drift

  const dropFraction = baselineMean > 0 ? (baselineMean - currentMean) / baselineMean : 0;

  let severity: AgentDriftResult['severity'] = 'ok';
  if (dropFraction >= ALERT_THRESHOLD) severity = 'alert';
  else if (dropFraction >= WARN_THRESHOLD) severity = 'warn';

  const { date: inflectionDate } = findInflection(timeline, baselineMean, WARN_THRESHOLD);

  const inflectionSamples =
    inflectionDate && samplesMap.has(inflectionDate) ? samplesMap.get(inflectionDate)! : [];

  return {
    agentName,
    timeline,
    currentMean: Math.round(currentMean * 1000) / 1000,
    baselineMean: Math.round(baselineMean * 1000) / 1000,
    dropFraction: Math.round(dropFraction * 1000) / 1000,
    severity,
    inflectionDate,
    inflectionSamples,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (!fs.existsSync(LOG_DIR)) {
    console.log('[drift] No log directory found — no data to analyse.');
    process.exit(0);
  }

  // Load all log files within lookback window
  const dates = dateRange(LOOKBACK_DAYS);
  const byDate: RawEntry[] = dates
    .map((date) => ({ date, lines: readLogFile(date) }))
    .filter((e) => e.lines.length > 0);

  if (byDate.length === 0) {
    console.log('[drift] No log data found in the lookback window.');
    process.exit(0);
  }

  // Collect all agent names seen
  const agentNames = new Set<string>();
  for (const { lines } of byDate) {
    for (const line of lines) {
      agentNames.add(line.agentName);
    }
  }

  // Analyse each agent
  const results: AgentDriftResult[] = [];
  for (const agentName of agentNames) {
    results.push(analyseAgent(agentName, byDate));
  }

  // Sort: alert first, then warn, then ok; alphabetical within tier
  results.sort((a, b) => {
    const order = { alert: 0, warn: 1, ok: 2 };
    const diff = order[a.severity] - order[b.severity];
    return diff !== 0 ? diff : a.agentName.localeCompare(b.agentName);
  });

  const summary = {
    total: results.length,
    ok: results.filter((r) => r.severity === 'ok').length,
    warn: results.filter((r) => r.severity === 'warn').length,
    alert: results.filter((r) => r.severity === 'alert').length,
  };

  const report: DriftReport = {
    generatedAt: new Date().toISOString(),
    windowDays: WINDOW_DAYS,
    baselineDays: BASELINE_DAYS,
    warnThreshold: WARN_THRESHOLD,
    alertThreshold: ALERT_THRESHOLD,
    agents: results,
    summary,
  };

  // Save report
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const filename = `${new Date().toISOString().slice(0, 10)}.json`;
  const reportPath = path.join(REPORT_DIR, filename);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log(
    `\n[drift] ${summary.total} agents | ${summary.ok} ok | ${summary.warn} warn | ${summary.alert} alert`,
  );
  console.log(`[drift] Report: ${reportPath}\n`);

  for (const r of results) {
    if (r.severity === 'ok') continue;
    const pct = (r.dropFraction * 100).toFixed(1);
    const icon = r.severity === 'alert' ? '✗' : '!';
    console.log(
      `  ${icon} ${r.agentName.padEnd(28)} drop=${pct}% (${r.baselineMean} → ${r.currentMean})${r.inflectionDate ? ` | started ${r.inflectionDate}` : ''}`,
    );
    if (r.inflectionSamples.length > 0) {
      console.log(`      inputs at inflection: "${r.inflectionSamples[0]}"`);
    }
  }

  process.exit(summary.alert > 0 || summary.warn > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[drift] Unhandled error:', err);
  process.exit(2);
});
