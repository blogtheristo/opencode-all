// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/openshell-ocsf.ts
/**
 * Aegis Pilot — OpenShell OCSF security events into the Article 12 ledger
 * (readiness plan C4 remainder).
 *
 * Source facts (plan §5.2 C4, from the OpenShell source, 29.09.2026): the
 * sandbox supervisor emits OCSF events; a shorthand copy reaches the gateway
 * and is read with `openshell logs <sandbox> --source sandbox`, one line per
 * event, e.g. `[ts] [sandbox] [OCSF ] [ocsf] NET:OPEN …`. The logs go with the
 * sandbox, so they are collected before `sandbox delete`.
 *
 * What is kept: event counts per class, a digest over every OCSF line (an
 * auditor holding the raw log can check it), and the deny events as
 * timestamp + class + line digest. What is never kept: the rest of the line
 * (hosts, paths, arguments may be personal or secret data).
 *
 * Not yet verified against a live gateway (M4 session on the DGX Spark): the
 * exact deny wording. A line counts as a deny when it carries DENY, DENIED,
 * BLOCK or BLOCKED as a word, in any case.
 */

import { sha256 } from './crypto.js';
import type { CommandRunner } from './openshell-handlers.js';

/** Deny events kept per step; the count stays exact beyond this. */
export const OCSF_MAX_DENIES = 50;
/** Cap on the gateway log read per sandbox. */
export const OCSF_MAX_LOG_BYTES = 4 * 1024 * 1024;

const LINE =
  /^\[([^\]]{1,64})\]\s+\[sandbox\]\s+\[OCSF\s*\]\s+\[ocsf\]\s+([A-Z][A-Z0-9_]{0,31}:[A-Z][A-Z0-9_]{0,31})(?:\s|$)/;
const DENY = /\b(deny|denied|block|blocked)\b/i;

export interface OcsfSummary {
  events: number;
  byClass: Record<string, number>;
  denied: number;
  denies: Array<{ ts: string; class: string; lineDigest: string }>;
  deniesTruncated: boolean;
  /** sha256 over the OCSF lines, newline-joined, in gateway order. */
  digest: string;
}

export type OcsfEvidence =
  | { collected: true; summary: OcsfSummary }
  | { collected: false; error: string };

export function parseOcsfShorthand(text: string): OcsfSummary {
  const lines: string[] = [];
  const byClass: Record<string, number> = {};
  const denies: OcsfSummary['denies'] = [];
  let denied = 0;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/\r$/, '');
    const m = LINE.exec(line);
    if (!m) continue;
    lines.push(line);
    const cls = m[2];
    byClass[cls] = (byClass[cls] ?? 0) + 1;
    if (DENY.test(line.slice(m[0].length))) {
      denied++;
      if (denies.length < OCSF_MAX_DENIES)
        denies.push({ ts: m[1], class: cls, lineDigest: sha256(line) });
    }
  }
  return {
    events: lines.length,
    byClass,
    denied,
    denies,
    deniesTruncated: denied > denies.length,
    digest: sha256(lines.join('\n')),
  };
}

/** Reads a sandbox's OCSF shorthand from the gateway. A failed read is reported, never hidden. */
export async function collectOcsf(
  run: CommandRunner,
  cli: string,
  name: string,
  timeoutMs = 15_000,
): Promise<OcsfEvidence> {
  const r = await run(cli, ['logs', name, '--source', 'sandbox'], {
    timeoutMs,
    maxOutputBytes: OCSF_MAX_LOG_BYTES,
  });
  if (r.code !== 0)
    return { collected: false, error: `openshell logs exit ${r.code}: ${r.stderr.slice(0, 200)}` };
  return { collected: true, summary: parseOcsfShorthand(r.stdout) };
}
