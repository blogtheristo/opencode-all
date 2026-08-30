// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/middleware/health.ts
/**
 * Health Check Endpoint
 *
 * Policy (2026-08-24): /livez is the only fully public probe surface.
 * /health returns sanitized output to anonymous callers — dependency status
 * LABELS only. Error messages, latencies, uptime, and version are logged
 * server-side and never returned unauthenticated.
 */

import { type Request, type Response } from 'express';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';
import { emailQueue } from '../services/email-queue.service.js';

interface DependencyStatus {
  status: 'ok' | 'degraded' | 'down';
  latencyMs?: number;
  error?: string;
}

/** Public-safe projection: status label only, no error text or latency. */
type PublicDependencyStatus = Pick<DependencyStatus, 'status'>;

interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  service: string;
  dependencies: Record<string, PublicDependencyStatus>;
}

const startTime = Date.now();

async function checkSupabase(): Promise<DependencyStatus> {
  const client = getSupabaseClient();
  if (!client) {
    return { status: 'down', error: 'Not configured' };
  }

  const start = Date.now();
  try {
    // Lightweight query — just check connectivity
    const { error } = await client.from('profiles').select('id').limit(1);
    const latencyMs = Date.now() - start;
    if (error) {
      return { status: 'degraded', latencyMs, error: error.message };
    }
    return { status: 'ok', latencyMs };
  } catch (err) {
    return {
      status: 'down',
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

function checkEmailQueue(): DependencyStatus {
  return {
    status: emailQueue.isAvailable() ? 'ok' : 'degraded',
    ...(emailQueue.isAvailable() ? {} : { error: 'Redis unavailable — direct send fallback' }),
  };
}

function checkLlmProviders(): DependencyStatus {
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasGemini = !!process.env.GOOGLE_GEMINI_API_KEY;

  const available = [hasGroq && 'groq', hasAnthropic && 'anthropic', hasGemini && 'gemini'].filter(
    Boolean,
  );

  if (available.length === 0) {
    return { status: 'down', error: 'No LLM provider configured' };
  }
  return { status: 'ok' };
}

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const supabase = await checkSupabase();
  const email = checkEmailQueue();
  const llm = checkLlmProviders();

  const dependencies: Record<string, DependencyStatus> = {
    supabase,
    emailQueue: email,
    llmProviders: llm,
  };

  // Overall status: degraded if any dep is down/degraded — keep serving.
  const statuses = Object.values(dependencies).map((d) => d.status);
  let overall: 'ok' | 'degraded' | 'down' = 'ok';
  if (statuses.includes('down') || statuses.includes('degraded')) {
    overall = 'degraded'; // Keep serving — graceful degradation
  }

  // Full detail (errors, latency) goes to server logs only, never the wire.
  logger.info('Health check', {
    overall,
    dependencies,
    uptimeSec: Math.floor((Date.now() - startTime) / 1000),
    correlationId: _req.headers['x-correlation-id'],
  });

  // Public-safe projection: strip error strings and latencies.
  const publicDependencies: Record<string, PublicDependencyStatus> = Object.fromEntries(
    Object.entries(dependencies).map(([name, dep]) => [name, { status: dep.status }]),
  );

  const response: HealthResponse = {
    status: overall,
    timestamp: new Date().toISOString(),
    service: 'DWS IQ Backend',
    dependencies: publicDependencies,
  };

  // Return 200 even when degraded (keep serving); 503 only for hard down.
  const httpStatus = (overall as string) === 'down' ? 503 : 200;

  res.status(httpStatus).json(response);
}

/**
 * Lightweight liveness probe — just confirms the process is running.
 * Use for Cloud Run liveness checks (no dependency calls).
 */
export function livenessCheck(_req: Request, res: Response): void {
  res.status(200).json({ status: 'alive', timestamp: new Date().toISOString() });
}
