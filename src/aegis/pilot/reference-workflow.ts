// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/reference-workflow.ts
/**
 * Aegis Pilot — reference control-room workflow: shift handover.
 *
 * Used for Phase 1 substrate proof and every rehearsal before the customer's
 * own workflow exists, and as the template a customer workflow's handlers
 * follow. Deterministic on purpose: the substrate test must fail only for
 * substrate reasons.
 *
 *   read-readings        core      local sensor snapshot (JSON file)
 *   evaluate-limits      core      compare each reading to its alarm band
 *   decide-actions       core      map alarms to operator actions (local rulebook);
 *                                  advisory in the reference scope: the operator decides
 *   write-shift-report   core      write the handover report to local disk
 *   sync-report          non-core  POST the report to the cloud endpoint — the
 *                                  only step that touches the network
 */

import { mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { z } from 'zod';
import { canonicalJSON, sha256 } from './crypto.js';
import { type HandlerRegistry, NetworkUnavailable } from './workflow-runner.js';

const ReadingSchema = z.object({
  tag: z.string().min(1).max(64),
  value: z.number().finite(),
  unit: z.string().max(16),
  low: z.number().finite(),
  high: z.number().finite(),
});
const ReadingsSchema = z.object({
  capturedAt: z.string(),
  readings: z.array(ReadingSchema).min(1).max(10_000),
});

type Reading = z.infer<typeof ReadingSchema>;
interface Alarm {
  tag: string;
  value: number;
  band: 'low' | 'high';
  deviationPct: number;
}

/** Local rulebook: severity by deviation from the band edge. */
function actionFor(alarm: Alarm): {
  tag: string;
  severity: 'watch' | 'act' | 'escalate';
  action: string;
} {
  if (alarm.deviationPct >= 25) {
    return {
      tag: alarm.tag,
      severity: 'escalate',
      action: 'Escalate to shift supervisor; prepare controlled shutdown per site procedure',
    };
  }
  if (alarm.deviationPct >= 10) {
    return {
      tag: alarm.tag,
      severity: 'act',
      action: `Operator to correct ${alarm.band} excursion and confirm within 15 minutes`,
    };
  }
  return { tag: alarm.tag, severity: 'watch', action: 'Log and watch through next shift' };
}

export function evaluateLimits(readings: Reading[]): Alarm[] {
  const alarms: Alarm[] = [];
  for (const r of readings) {
    const span = Math.max(Math.abs(r.high - r.low), Number.EPSILON);
    if (r.value < r.low)
      alarms.push({
        tag: r.tag,
        value: r.value,
        band: 'low',
        deviationPct: ((r.low - r.value) / span) * 100,
      });
    else if (r.value > r.high)
      alarms.push({
        tag: r.tag,
        value: r.value,
        band: 'high',
        deviationPct: ((r.value - r.high) / span) * 100,
      });
  }
  return alarms.sort((a, b) => b.deviationPct - a.deviationPct);
}

export interface ReferenceRegistryOptions {
  readingsPath: string;
  reportDir: string;
  /** Cloud endpoint for the non-core sync step; 'none' makes sync a recorded no-op. */
  syncUrl: string | 'none';
  fetchImpl?: typeof fetch;
}

export function createReferenceRegistry(opts: ReferenceRegistryOptions): HandlerRegistry {
  const fetchImpl = opts.fetchImpl ?? fetch;
  return {
    'read-readings': async () => {
      const parsed = ReadingsSchema.parse(JSON.parse(readFileSync(opts.readingsPath, 'utf8')));
      return {
        output: parsed,
        decision: `read ${parsed.readings.length} readings captured ${parsed.capturedAt}`,
        confidence: 1,
      };
    },
    'evaluate-limits': async ({ state }) => {
      const snapshot = ReadingsSchema.parse(state['read-readings']);
      const alarms = evaluateLimits(snapshot.readings);
      return {
        output: alarms,
        decision: `${alarms.length} reading(s) outside band`,
        confidence: 1,
      };
    },
    'decide-actions': async ({ state }) => {
      const alarms = (state['evaluate-limits'] ?? []) as Alarm[];
      const actions = alarms.map(actionFor);
      const escalations = actions.filter((a) => a.severity === 'escalate').length;
      return {
        output: actions,
        decision: `${actions.length} action(s), ${escalations} escalation(s)`,
        confidence: 1,
      };
    },
    'write-shift-report': async ({ state, traceId }) => {
      const report = {
        traceId,
        capturedAt: (state['read-readings'] as { capturedAt: string }).capturedAt,
        alarms: state['evaluate-limits'],
        actions: state['decide-actions'],
      };
      mkdirSync(opts.reportDir, { recursive: true });
      const path = join(opts.reportDir, `shift-report-${traceId}.json`);
      writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
      const digest = sha256(canonicalJSON(report));
      return {
        output: { path, digest },
        decision: `handover report written locally (${digest.slice(0, 12)})`,
        confidence: 1,
      };
    },
    'sync-report': async ({ state, signal }) => {
      const written = state['write-shift-report'] as { path: string; digest: string } | undefined;
      if (!written) throw new Error('no shift report to sync');
      // Send only a report this workflow wrote, unchanged: the path must resolve
      // inside reportDir under the report naming scheme, and the file must still
      // hash to the digest recorded when it was written.
      const reportRoot = realpathSync(opts.reportDir);
      const target = realpathSync(written.path);
      if (
        dirname(target) !== reportRoot ||
        !/^shift-report-[A-Za-z0-9-]{1,100}\.json$/.test(basename(target))
      ) {
        throw new Error('refusing to sync a file outside the report directory');
      }
      const body = readFileSync(target, 'utf8');
      if (sha256(canonicalJSON(JSON.parse(body))) !== written.digest) {
        throw new Error('report changed since it was written; refusing to sync');
      }
      if (opts.syncUrl === 'none') {
        return {
          output: { synced: false, reason: 'no sync target configured' },
          decision: 'sync skipped (none configured)',
        };
      }
      let res: Response;
      try {
        res = await fetchImpl(opts.syncUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          signal,
        });
      } catch (err) {
        throw new NetworkUnavailable(`sync endpoint unreachable: ${(err as Error).message}`);
      }
      if (!res.ok) throw new Error(`sync endpoint returned HTTP ${res.status}`);
      return {
        output: { synced: true, digest: written.digest },
        decision: 'report synced to cloud',
      };
    },
  };
}

/**
 * Handler-module contract for hard-stop isolation (isolated-handlers.ts): the
 * worker thread imports this module and builds its registry from plain options.
 */
export function createRegistry(options: Record<string, unknown>): HandlerRegistry {
  return createReferenceRegistry(options as unknown as ReferenceRegistryOptions);
}
