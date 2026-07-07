/**
 * AgentLogger — Unified Structured Agent Run Logger
 *
 * All 50 agents write through this class. Provides:
 *   - Structured JSONL to disk (logs/agent-YYYY-MM-DD.jsonl)
 *   - Internal-ops Postgres agent_executions row (non-blocking)
 *   - Consistent run IDs for cross-system correlation
 *
 * Distinct from article12-logger.ts (EU AI Act audit trail).
 * AgentLogger is the operational log; Article12Logger is the compliance record.
 * For high-risk agents, call both.
 *
 * Usage:
 *   const runId = await AgentLogger.start('compliance', context, input);
 *   // ... run agent ...
 *   await AgentLogger.end(runId, response, latencyMs);
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { getInternalDbPool } from '../config/internal-db.js';
import type { AgentContext, AgentResponse } from './types.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RunStartOptions {
  modelId?: string;
  /** Semver or hash of the system prompt in use */
  promptVersion?: string;
  /** Tools available to this agent in this run */
  toolsAvailable?: string[];
}

interface LogLine {
  runId: string;
  agentName: string;
  event: 'start' | 'end' | 'error';
  timestamp: string;
  // start fields
  sessionId?: string;
  orgId?: string;
  userId?: string;
  projectId?: string;
  inputHash?: string;
  /** PII-scrubbed input payload. Written when AGENT_LOG_FULL_INPUT=true. */
  inputPayload?: Record<string, unknown>;
  /** Short human-readable task summary extracted from input.task (first 200 chars). */
  taskSummary?: string;
  modelId?: string;
  promptVersion?: string;
  toolsAvailable?: string[];
  // end fields
  outputHash?: string;
  confidence?: number;
  toolsCalled?: string[];
  latencyMs?: number;
  status?: 'completed' | 'error';
  errorMessage?: string;
}

// ─── PII scrubber ─────────────────────────────────────────────────────────────

/** Field names whose values are redacted before disk logging. */
const PII_FIELDS = new Set([
  'email',
  'e_mail',
  'emailAddress',
  'name',
  'fullName',
  'firstName',
  'lastName',
  'surname',
  'phone',
  'phoneNumber',
  'mobile',
  'tel',
  'address',
  'streetAddress',
  'postAddress',
  'ssn',
  'socialSecurityNumber',
  'personalId',
  'henkilotunnus',
  'dob',
  'dateOfBirth',
  'birthDate',
  'password',
  'passwd',
  'secret',
  'token',
  'apiKey',
  'api_key',
  'creditCard',
  'cardNumber',
  'cvv',
  'iban',
  'bic',
]);

function scrubPii(obj: unknown, depth = 0): unknown {
  if (depth > 6 || obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => scrubPii(item, depth + 1));

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    result[key] = PII_FIELDS.has(key) ? '[redacted]' : scrubPii(value, depth + 1);
  }
  return result;
}

const LOG_FULL_INPUT = process.env.AGENT_LOG_FULL_INPUT === 'true';

// ─── Disk writer ──────────────────────────────────────────────────────────────

const LOG_DIR = process.env.AGENT_LOG_DIR ?? path.join(process.cwd(), 'logs');

function writeLine(line: LogLine): void {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(LOG_DIR, `agent-${date}.jsonl`);
    fs.appendFileSync(filePath, JSON.stringify(line) + '\n');
  } catch {
    // Never crash an agent run because of logging failure
  }
}

// ─── Internal-ops Postgres writer ─────────────────────────────────────────────

async function writeToDb(
  runId: string,
  agentName: string,
  context: AgentContext,
  input: Record<string, unknown>,
): Promise<void> {
  const pool = getInternalDbPool();
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO agent_executions (
         id, agent_name, user_id, org_id, session_id, project_id, input, output,
         status, duration_ms, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        runId,
        agentName,
        context.userId,
        context.orgId,
        context.sessionId,
        context.projectId,
        JSON.stringify(input),
        null,
        'started',
        0,
        new Date().toISOString(),
      ],
    );
  } catch {
    // Non-blocking
  }
}

async function updateDb(
  runId: string,
  response: AgentResponse | null,
  status: 'completed' | 'error',
  latencyMs: number,
  errorMessage?: string,
): Promise<void> {
  const pool = getInternalDbPool();
  if (!pool) return;
  try {
    await pool.query(
      `UPDATE agent_executions
       SET output = $1, status = $2, error_message = $3, duration_ms = $4
       WHERE id = $5`,
      [
        response === null ? null : JSON.stringify(response),
        status,
        errorMessage ?? null,
        latencyMs,
        runId,
      ],
    );
  } catch {
    // Non-blocking
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const AgentLogger = {
  /**
   * Call at the start of an agent run. Returns a runId to pass to end() or error().
   */
  async start(
    agentName: string,
    context: AgentContext,
    input: Record<string, unknown>,
    opts: RunStartOptions = {},
  ): Promise<string> {
    const runId = randomUUID();
    const inputHash = createHash('sha256').update(JSON.stringify(input)).digest('hex').slice(0, 16);

    const taskSummary =
      typeof input['task'] === 'string' ? (input['task'] as string).slice(0, 200) : undefined;

    const line: LogLine = {
      runId,
      agentName,
      event: 'start',
      timestamp: new Date().toISOString(),
      sessionId: context.sessionId,
      orgId: context.orgId,
      userId: context.userId,
      projectId: context.projectId,
      inputHash,
      inputPayload: LOG_FULL_INPUT ? (scrubPii(input) as Record<string, unknown>) : undefined,
      taskSummary,
      modelId: opts.modelId,
      promptVersion: opts.promptVersion,
      toolsAvailable: opts.toolsAvailable,
    };

    writeLine(line);
    // Fire-and-forget DB write — do not await in the caller's hot path
    writeToDb(runId, agentName, context, input).catch(() => {});

    return runId;
  },

  /**
   * Call after a successful agent run completes.
   */
  async end(
    runId: string,
    agentName: string,
    response: AgentResponse,
    latencyMs: number,
    toolsCalled: string[] = [],
  ): Promise<void> {
    const outputHash = createHash('sha256')
      .update(JSON.stringify(response.result))
      .digest('hex')
      .slice(0, 16);

    const line: LogLine = {
      runId,
      agentName,
      event: 'end',
      timestamp: new Date().toISOString(),
      outputHash,
      confidence: response.confidence,
      toolsCalled,
      latencyMs,
      status: 'completed',
    };

    writeLine(line);
    updateDb(runId, response, 'completed', latencyMs).catch(() => {});
  },

  /**
   * Call when an agent run throws an error.
   */
  async error(runId: string, agentName: string, err: unknown, latencyMs: number): Promise<void> {
    const errorMessage = err instanceof Error ? err.message : String(err);

    const line: LogLine = {
      runId,
      agentName,
      event: 'error',
      timestamp: new Date().toISOString(),
      latencyMs,
      status: 'error',
      errorMessage,
    };

    writeLine(line);
    updateDb(runId, null, 'error', latencyMs, errorMessage).catch(() => {});
  },

  /**
   * Hash helper — consistent with Article12Logger for cross-reference.
   */
  hashInput(input: Record<string, unknown>): string {
    return createHash('sha256').update(JSON.stringify(input)).digest('hex');
  },
};
