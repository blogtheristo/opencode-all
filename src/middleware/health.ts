/**
 * Health Check Endpoint
 *
 * Returns dependency status for Supabase, email queue, and LLM providers.
 * Cloud Run uses this to determine container readiness.
 */

import { type Request, type Response } from 'express';
import { getSupabaseClient } from '../config/supabase.js';
import { emailQueue } from '../services/email-queue.service.js';

interface DependencyStatus {
  status: 'ok' | 'degraded' | 'down';
  latencyMs?: number;
  error?: string;
}

interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  service: string;
  version: string;
  uptime: number;
  dependencies: Record<string, DependencyStatus>;
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

  // Overall status: down if any critical dep is down, degraded if any degraded
  const statuses = Object.values(dependencies).map((d) => d.status);
  let overall: 'ok' | 'degraded' | 'down' = 'ok';
  if (statuses.includes('down')) {
    overall = 'degraded'; // Keep serving — graceful degradation
  } else if (statuses.includes('degraded')) {
    overall = 'degraded';
  }

  const response: HealthResponse = {
    status: overall,
    timestamp: new Date().toISOString(),
    service: 'DWS IQ Backend',
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    dependencies,
  };

  // Return 200 even when degraded (Cloud Run should keep serving)
  // Return 503 only if we want Cloud Run to restart the container
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
