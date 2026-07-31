#!/usr/bin/env node
/**
 * record-session-tokens.mjs — Claude-side token log (DWS Open Item 5)
 *
 * Closes the gap named in docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md §5:
 * DWS could not state its own cost per completed task because no Claude Code token
 * usage survived a container. Everything downstream already existed — the
 * `token_usage_events` table carries prompt/completion/cached tokens, cost_eur,
 * model, session_id and task_id, and `TokenProduct` already declares 'claude-code'.
 * The only missing piece was the recorder. This is it.
 *
 * WHAT A "TASK" IS: one user turn and all assistant work that follows it until the
 * next user turn. That is the unit an operator actually asks for, so cost-per-task
 * is a `GROUP BY task_id` and not a spreadsheet exercise.
 *
 * Usage:
 *   node scripts/record-session-tokens.mjs --transcript <path> [--session <id>] [--dry-run]
 *
 * Sinks, in order:
 *   1. POST to $DWS_API_BASE/api/usage/tokens/ingest when configured (auth via
 *      $DWS_API_TOKEN). This is the real ledger.
 *   2. Otherwise append to telemetry/token-usage/<session>.jsonl, which is
 *      git-tracked and therefore survives the container. `.claude/hooks/audit/`
 *      does NOT survive (.gitignore ignores .claude/*), which is why the log
 *      never landed there.
 *
 * Fails loud: prints which sink was used and why. Never silently drops a session.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const LEDGER_DIR = 'telemetry/token-usage';

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--transcript') out.transcript = argv[++i];
    else if (a === '--session') out.session = argv[++i];
    else if (a === '--dry-run') out.dryRun = true;
  }
  return out;
}

/**
 * Read a Claude Code transcript JSONL and aggregate token usage per task.
 * Exported for tests: pure function over lines, no I/O, no clock.
 */
export function aggregateTranscript(lines, sessionId) {
  /** @type {Map<string, {model:string, promptTokens:number, completionTokens:number, cachedTokens:number, timestamp:string}>} */
  const byKey = new Map();
  let turn = 0;
  let sawUser = false;

  for (const line of lines) {
    if (!line.trim()) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue; // a partially-flushed final line is normal; skip it
    }

    const message = entry.message ?? {};
    const role = message.role ?? entry.type;

    // A user turn opens a new task. Tool results are replayed with role "user"
    // but carry no usage and must not open a task of their own, so we only
    // advance on a turn that actually has usage-bearing assistant work after it.
    if (role === 'user' && !entry.isMeta) {
      const isToolResult =
        Array.isArray(message.content) &&
        message.content.some((c) => c && c.type === 'tool_result');
      if (!isToolResult) {
        turn += 1;
        sawUser = true;
      }
    }

    const usage = message.usage;
    if (!usage) continue;

    const model = message.model ?? 'unknown';
    // Cache creation is input the provider actually wrote this call, so it is
    // prompt cost. Cache reads are billed differently and map to cachedTokens.
    const promptTokens =
      (usage.input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0);
    const completionTokens = usage.output_tokens ?? 0;
    const cachedTokens = usage.cache_read_input_tokens ?? 0;
    if (promptTokens + completionTokens + cachedTokens === 0) continue;

    const taskId = `${sessionId}#turn-${sawUser ? turn : 0}`;
    const key = `${taskId}|${model}`;
    const acc = byKey.get(key) ?? {
      model,
      taskId,
      promptTokens: 0,
      completionTokens: 0,
      cachedTokens: 0,
      timestamp: entry.timestamp ?? null,
    };
    acc.promptTokens += promptTokens;
    acc.completionTokens += completionTokens;
    acc.cachedTokens += cachedTokens;
    if (entry.timestamp) acc.timestamp = entry.timestamp;
    byKey.set(key, acc);
  }

  return [...byKey.values()]
    .filter((a) => a.timestamp)
    .map((a) => ({
      provider: 'anthropic',
      product: 'claude-code',
      model: a.model,
      promptTokens: a.promptTokens,
      completionTokens: a.completionTokens,
      cachedTokens: a.cachedTokens,
      sessionId,
      taskId: a.taskId,
      timestamp: a.timestamp,
    }));
}

async function postToLedger(events) {
  const base = process.env.DWS_API_BASE;
  const token = process.env.DWS_API_TOKEN;
  if (!base || !token) return { ok: false, reason: 'DWS_API_BASE/DWS_API_TOKEN not set' };
  try {
    const res = await fetch(`${base.replace(/\/$/, '')}/api/usage/tokens/ingest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ events }),
    });
    if (!res.ok) return { ok: false, reason: `ingest returned HTTP ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: `ingest unreachable: ${err.message}` };
  }
}

function appendLedgerFile(events, sessionId) {
  fs.mkdirSync(LEDGER_DIR, { recursive: true });
  const file = path.join(LEDGER_DIR, `${sessionId}.jsonl`);
  const body = events.map((e) => JSON.stringify(e)).join('\n');
  fs.writeFileSync(file, `${body}\n`, 'utf-8');
  return file;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.transcript) {
    console.error('record-session-tokens: --transcript is required');
    process.exit(1);
  }
  if (!fs.existsSync(args.transcript)) {
    console.error(`record-session-tokens: transcript not found: ${args.transcript}`);
    process.exit(1);
  }

  const sessionId =
    args.session || path.basename(args.transcript).replace(/\.jsonl$/, '') || 'unknown-session';
  const lines = fs.readFileSync(args.transcript, 'utf-8').split('\n');
  const events = aggregateTranscript(lines, sessionId);

  if (events.length === 0) {
    console.log('record-session-tokens: no usage-bearing entries — nothing recorded.');
    return;
  }

  const totals = events.reduce(
    (t, e) => ({
      prompt: t.prompt + e.promptTokens,
      completion: t.completion + e.completionTokens,
      cached: t.cached + e.cachedTokens,
    }),
    { prompt: 0, completion: 0, cached: 0 },
  );
  const tasks = new Set(events.map((e) => e.taskId)).size;

  if (args.dryRun) {
    console.log(JSON.stringify({ events, totals, tasks }, null, 2));
    return;
  }

  const posted = await postToLedger(events);
  if (posted.ok) {
    console.log(
      `record-session-tokens: ${events.length} events across ${tasks} tasks -> token_usage_events (API).`,
    );
    return;
  }

  const file = appendLedgerFile(events, sessionId);
  console.log(
    `record-session-tokens: ${events.length} events across ${tasks} tasks -> ${file}\n` +
      `  (API sink unused: ${posted.reason})\n` +
      `  prompt=${totals.prompt} completion=${totals.completion} cached=${totals.cached}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(`record-session-tokens: ${err.message}`);
    process.exit(1);
  });
}
