// Evidence: Tool=OpenCode Model=ollama-local/qwen3-coder-next:latest Agent=opencode Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/handler-conformance.ts
/**
 * Aegis Pilot — handler conformance checker.
 *
 * Validates handler implementations against the contract:
 *   - registered: handler key exists in registry
 *   - honours-abort: handler rejects/resolves within 500ms when aborted
 *   - network-errors-typed: NetworkUnavailable surfaces via instanceof
 */

import { tmpdir } from 'node:os';
import { mkdir, rm } from 'node:fs/promises';
import { mkdir as mkdirAsync } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { type PilotScope, type PilotStep } from './scope.js';
import { type HandlerRegistry, NetworkUnavailable } from './workflow-runner.js';
import { canonicalJSON, sha256 } from './crypto.js';

export interface CheckResult {
  check: string;
  ok: boolean;
  detail: string;
}

export interface StepCheckResult {
  step: PilotStep;
  checks: CheckResult[];
}

export interface ConformanceResult {
  ok: boolean;
  steps: StepCheckResult[];
}

/**
 * Run handler conformance checks against a reference registry.
 */
export async function checkHandlerConformance(
  scope: PilotScope,
  registry: HandlerRegistry,
  registryOptions?: { reportDir?: string },
): Promise<ConformanceResult> {
  const results: StepCheckResult[] = [];
  const tempDir = await mkdirTemp();

  try {
    for (const step of scope.workflow.steps) {
      const checks: CheckResult[] = [];

      // Check 1: registered
      const handler = registry[step.handler];
      if (!handler) {
        checks.push({
          check: 'registered',
          ok: false,
          detail: `handler "${step.handler}" not found in registry`,
        });
        results.push({ step, checks });
        continue;
      }

      checks.push({
        check: 'registered',
        ok: true,
        detail: `handler "${step.handler}" found in registry`,
      });

      // Check 2: honours-abort (only if registered)
      // Use a wrapper to enforce the 500ms timeout
      const abortAborter = new AbortController();
      abortAborter.abort(new Error('test abort'));
      const abortSignal = abortAborter.signal;

      // Provide empty state - handler should honour abort regardless of input
      const abortCheckResult = await callWithTimeout(
        () =>
          handler({
            signal: abortSignal,
            traceId: 'conformance-abort-test',
            step,
            state: {},
            uplinkDown: false,
          } as any),
        500,
      );

      if (abortCheckResult.timedOut) {
        checks.push({
          check: 'honours-abort',
          ok: false,
          detail: 'handler did not reject or resolve within 500ms when aborted',
        });
      } else if (abortCheckResult.error) {
        checks.push({
          check: 'honours-abort',
          ok: true,
          detail: 'handler correctly rejected on abort',
        });
      } else {
        checks.push({
          check: 'honours-abort',
          ok: true,
          detail: 'handler correctly resolved on abort',
        });
      }

      // Check 3: network-errors-typed (only if registered and requiresNetwork)
      if (step.requiresNetwork) {
        // For network steps, we need to provide state that allows the handler
        // to reach the network call. For sync-report, we write a report file.
        // Use the reportDir from registryOptions (or tempDir as fallback) so the
        // reference workflow's path validation passes.
        const reportDir = registryOptions?.reportDir ?? tempDir;
        const state = await getStepState(step, scope.workflow.steps, registry, tempDir, reportDir);

        const networkAbortController = new AbortController();
        const networkCheckResult = await callWithTimeout(
          () =>
            handler({
              signal: networkAbortController.signal,
              traceId: 'conformance-network-test',
              step,
              state,
              uplinkDown: false,
              fetchImpl: async (url: string, init: Record<string, unknown>) => {
                // Simulate network failure - throw NetworkUnavailable
                throw new NetworkUnavailable(`network error for ${url}`);
              },
            } as any),
          200,
        );

        if (networkCheckResult.error instanceof NetworkUnavailable) {
          checks.push({
            check: 'network-errors-typed',
            ok: true,
            detail: 'handler correctly surfaced NetworkUnavailable via instanceof',
          });
        } else if (networkCheckResult.error) {
          checks.push({
            check: 'network-errors-typed',
            ok: false,
            detail: `handler errored with ${networkCheckResult.error.name} instead of NetworkUnavailable`,
          });
        } else if (networkCheckResult.timedOut) {
          checks.push({
            check: 'network-errors-typed',
            ok: false,
            detail: 'handler did not complete within timeout when simulating network failure',
          });
        } else {
          checks.push({
            check: 'network-errors-typed',
            ok: false,
            detail: 'handler did not surface NetworkUnavailable',
          });
        }
      } else {
        checks.push({
          check: 'network-errors-typed',
          ok: true,
          detail: 'step does not require network, skipping',
        });
      }

      results.push({ step, checks });
    }

    const allOk = results.every((r) => r.checks.every((c) => c.ok));

    return { ok: allOk, steps: results };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

/**
 * Call a function with a timeout. Returns { timedOut: true } if timeout,
 * { error: Error } if rejected, { result: T } if resolved.
 * If the function doesn't complete within timeoutMs, the timer rejects with a timeout error.
 */
function callWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
): Promise<{ timedOut: boolean; error?: Error; result?: T }> {
  return new Promise((resolve) => {
    let timedOut = false;
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        timedOut = true;
        settled = true;
        resolve({ timedOut });
      }
    }, timeoutMs);

    Promise.resolve(fn())
      .then((result) => {
        if (!settled) {
          clearTimeout(timer);
          settled = true;
          resolve({ timedOut: false, result });
        }
      })
      .catch((error) => {
        if (!settled) {
          clearTimeout(timer);
          settled = true;
          resolve({ timedOut: false, error: error as Error });
        }
      });
  });
}

/**
 * Get state for a step that requires valid inputs. For network steps like
 * sync-report, this creates a temporary report file and returns its path/digest.
 */
async function getStepState(
  step: PilotStep,
  steps: PilotStep[],
  registry: HandlerRegistry,
  tempDir: string,
  reportDir?: string,
): Promise<Record<string, unknown>> {
  if (step.handler === 'sync-report') {
    // Use reportDir if provided, otherwise use tempDir
    const targetDir = reportDir || tempDir;
    const reportData = {
      traceId: 'conformance-test',
      capturedAt: '2024-01-01T00:00:00Z',
      alarms: [],
      actions: [],
    };

    const fileName = `shift-report-conformance-${randomUUID()}.json`;
    const filePath = join(targetDir, fileName);
    const body = JSON.stringify(reportData, null, 2) + '\n';
    writeFileSync(filePath, body, 'utf8');
    const digest = sha256(canonicalJSON(reportData));

    return {
      'write-shift-report': {
        path: filePath,
        digest,
      },
    };
  }

  // For other steps, use empty state (or could run prerequisite steps here)
  return {};
}

async function mkdirTemp(): Promise<string> {
  const dir = join(tmpdir(), `aegis-pilot-conformance-${process.pid}-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  return dir;
}
