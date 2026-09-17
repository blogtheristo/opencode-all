// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/__tests__/health.test.ts
/**
 * Health Endpoint Policy Tests
 *
 * Verifies the public-surface sanitization: /health returns dependency
 * status labels only — no error strings, latencies, version, or uptime on
 * the wire; detail goes to logs instead.
 */

import { describe, expect, it, vi } from 'vitest';
import { type Request, type Response } from 'express';

vi.mock('../config/supabase.js', () => ({
  getSupabaseClient: () => null, // forces supabase: down with error message
}));

vi.mock('../services/email-queue.service.js', () => ({
  emailQueue: { isAvailable: () => false },
}));

vi.mock('../utils/logger.js', () => ({ default: { info: vi.fn(), warn: vi.fn() } }));

import { healthCheck } from '../middleware/health.js';

function makeRes(): {
  res: Response;
  getBody: () => Record<string, unknown>;
  getStatus: () => number;
} {
  const state = { body: {} as Record<string, unknown>, status: 0 };
  const res = {
    status(code: number) {
      state.status = code;
      return this;
    },
    json(payload: Record<string, unknown>) {
      state.body = payload;
      return this;
    },
  } as unknown as Response;
  return { res, getBody: () => state.body, getStatus: () => state.status };
}

describe('health endpoint policy', () => {
  it('returns 200 degraded and never leaks error strings or latencies', async () => {
    const { res, getBody, getStatus } = makeRes();
    await healthCheck({ headers: {} } as Request, res);

    expect(getStatus()).toBe(200); // graceful degradation keeps serving
    const body = getBody();
    expect(body.status).toBe('degraded');
    const deps = body.dependencies as Record<string, { status?: string }>;
    expect(deps.supabase.status).toBe('down');
    expect(deps.emailQueue.status).toBe('degraded');

    const raw = JSON.stringify(body);
    for (const leak of ['error', 'latencyMs', 'uptime', 'version', 'message']) {
      expect(raw).not.toContain(leak);
    }
    // Supabase "Not configured" error text must not reach the wire either.
    expect(raw).not.toContain('Not configured');
  });
});
