/**
 * Production Log Error Review (Daily)
 *
 * Auto-discovered by DGX Spark day-runner.sh (scripts/daily/*.ts convention).
 * Reviews the production agent error log for the last N hours, clusters distinct
 * errors, and surfaces actionable issues for fix follow-up via:
 *   1) Email digest (fast path)
 *   2) HIL todo (fallback + audit trail, deduped per day)
 *
 * Source of truth for "production logs":
 *   Supabase `agent_executions` rows with status='error' — written by
 *   src/agents/agent-logger.ts (the operational run log). Each row carries
 *   agent_name, error_message, created_at.
 *
 * Why detect-and-surface, not auto-fix:
 *   Tracing a runtime error to a code root cause and patching it is judgment
 *   work (CLAUDE.md Rule 5) that must not be automated by an unattended cron.
 *   This job does the deterministic part — find, cluster, triage, route — and
 *   hands actionable clusters to a human/agent to fix and open a PR. When there
 *   are no errors in the window it exits cleanly without side effects.
 *
 * Exit codes: 0 = healthy / no actionable errors, 1 = errors surfaced.
 *
 * Code-Version: 1.0
 * Date: 2026-06-21
 * Owner: Lifetime Oy
 */

import { fileURLToPath } from 'node:url';
import { sendEmail } from '../../src/utils/send-email.js';

const LOOKBACK_HOURS = Number(process.env.PROD_LOG_LOOKBACK_HOURS || 24);
const MAX_ROWS = Number(process.env.PROD_LOG_MAX_ROWS || 1000);
const EMAIL_FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const ALERT_TO =
  process.env.OUTAGE_ALERT_EMAIL || process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
const DRY_RUN = process.argv.includes('--dry-run');

export interface ExecutionErrorRow {
  agent_name: string;
  error_message: string | null;
  created_at: string;
}

export interface ErrorCluster {
  /** Stable key: agent_name + normalized signature */
  key: string;
  agentName: string;
  signature: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  sample: string;
}

// ─── Pure triage logic (unit-tested) ───────────────────────────────────────

/**
 * Collapse a raw error message into a stable signature so that the same bug
 * reported with different ids/numbers/timestamps clusters into one issue.
 */
export function normalizeErrorSignature(message: string | null): string {
  if (!message) return '(no message)';
  return message
    .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<uuid>')
    .replace(/\d{4}-\d{2}-\d{2}[T ][\d:.]+Z?/g, '<timestamp>')
    .replace(/0x[0-9a-f]+/gi, '<hex>')
    .replace(/\d+/g, '<n>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

/**
 * Group error rows into distinct clusters, sorted by frequency (desc).
 * This is the heart of "review the logs for errors" — it turns a noisy row
 * stream into a short, actionable list of distinct problems.
 */
export function summarizeErrors(rows: ExecutionErrorRow[]): ErrorCluster[] {
  const byKey = new Map<string, ErrorCluster>();

  for (const row of rows) {
    const signature = normalizeErrorSignature(row.error_message);
    const key = `${row.agent_name}::${signature}`;
    const existing = byKey.get(key);

    if (existing) {
      existing.count += 1;
      if (row.created_at < existing.firstSeen) existing.firstSeen = row.created_at;
      if (row.created_at > existing.lastSeen) existing.lastSeen = row.created_at;
    } else {
      byKey.set(key, {
        key,
        agentName: row.agent_name,
        signature,
        count: 1,
        firstSeen: row.created_at,
        lastSeen: row.created_at,
        sample: (row.error_message || '(no message)').slice(0, 500),
      });
    }
  }

  return [...byKey.values()].sort((a, b) => b.count - a.count);
}

// ─── IO: fetch production error log from Supabase ───────────────────────────

async function fetchErrorRows(): Promise<ExecutionErrorRow[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_KEY not set — cannot read production agent_executions log',
    );
  }

  const since = new Date(Date.now() - LOOKBACK_HOURS * 3600 * 1000).toISOString();
  const endpoint =
    `${url}/rest/v1/agent_executions` +
    `?status=eq.error` +
    `&created_at=gte.${encodeURIComponent(since)}` +
    `&select=agent_name,error_message,created_at` +
    `&order=created_at.desc` +
    `&limit=${MAX_ROWS}`;

  const response = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`agent_executions query failed: HTTP ${response.status} ${body.slice(0, 200)}`);
  }

  return (await response.json()) as ExecutionErrorRow[];
}

// ─── IO: surface actionable clusters ────────────────────────────────────────

export function renderDigest(clusters: ErrorCluster[], totalRows: number): string {
  const lines = [
    `Production agent error review — last ${LOOKBACK_HOURS}h`,
    `Total error rows: ${totalRows} · Distinct issues: ${clusters.length}`,
    '',
    'Distinct issues (most frequent first):',
  ];
  clusters.forEach((c, i) => {
    lines.push(
      '',
      `${i + 1}. [${c.count}×] ${c.agentName}`,
      `   first: ${c.firstSeen}  last: ${c.lastSeen}`,
      `   ${c.sample}`,
    );
  });
  lines.push('', 'Next step: triage each cluster, trace to root cause, fix, and open a PR.');
  return lines.join('\n');
}

async function upsertHilTodo(clusters: ErrorCluster[], totalRows: number): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return;

  const dedupKey = `prod_log_errors:${new Date().toISOString().slice(0, 10)}`;
  const description = `Production errors (${LOOKBACK_HOURS}h): ${clusters.length} distinct issue(s) across ${totalRows} row(s) — ${clusters
    .slice(0, 3)
    .map((c) => `${c.agentName} (${c.count}×)`)
    .join(', ')}`;

  if (DRY_RUN) {
    console.log('[prod-log-review] DRY-RUN: skipping HIL todo upsert');
    return;
  }

  await fetch(`${url}/rest/v1/hil_todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'resolution=ignore-duplicates',
    },
    body: JSON.stringify({
      category: 'prod_log_errors',
      description,
      context: {
        lookbackHours: LOOKBACK_HOURS,
        totalRows,
        clusters: clusters.map((c) => ({
          agentName: c.agentName,
          count: c.count,
          signature: c.signature,
          firstSeen: c.firstSeen,
          lastSeen: c.lastSeen,
          sample: c.sample,
        })),
        detectedAt: new Date().toISOString(),
      },
      dedup_key: dedupKey,
    }),
  });
}

async function sendDigestEmail(clusters: ErrorCluster[], totalRows: number): Promise<void> {
  const text = renderDigest(clusters, totalRows);
  const subject = `[PROD-LOG] ${clusters.length} distinct error(s) in last ${LOOKBACK_HOURS}h`;

  if (DRY_RUN) {
    console.log('[prod-log-review] DRY-RUN: skipping digest email send');
    console.log(text);
    return;
  }

  await sendEmail({
    from: EMAIL_FROM,
    to: ALERT_TO,
    subject,
    text,
    html: `<pre>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`,
    source: 'admin',
    templateType: 'prod_log_error_review',
    metadata: { check: 'prod-log-error-review', distinctIssues: clusters.length, totalRows },
  });
}

// ─── Entry point ────────────────────────────────────────────────────────────

export async function main(): Promise<void> {
  const rows = await fetchErrorRows();
  const clusters = summarizeErrors(rows);

  if (clusters.length === 0) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        check: 'prod-log-error-review',
        status: 'healthy',
        lookbackHours: LOOKBACK_HOURS,
        errorRows: 0,
      }),
    );
    return;
  }

  console.error(
    `[prod-log-review] ${clusters.length} distinct error(s) across ${rows.length} row(s) in last ${LOOKBACK_HOURS}h`,
  );
  for (const c of clusters) {
    console.error(`[prod-log-review] [${c.count}×] ${c.agentName}: ${c.signature}`);
  }

  await Promise.all([sendDigestEmail(clusters, rows.length), upsertHilTodo(clusters, rows.length)]);
  process.exit(1);
}

// Only run when executed directly (so unit tests can import pure helpers).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(
      `[prod-log-review] FATAL: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  });
}
