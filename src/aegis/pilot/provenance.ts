// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/provenance.ts
/**
 * Aegis Pilot — what governed a run (readiness plan C6, HIC 30.09.2026).
 *
 * The acceptance record names the KYA-S1 revision, the runbook, auditor guide
 * and contract-annex versions, the kit commit, and the hardware attestation in
 * force, so a stranger can answer "against what was this signed?" from the
 * record alone. Versions are read from the document headers in the kit
 * checkout, never typed by hand.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/** Kit checkout root: this file lives in <root>/src/aegis/pilot/. */
export const KIT_ROOT = resolve(new URL('../../..', import.meta.url).pathname);

export const PROVENANCE_SOURCES = {
  kyaS1: 'Legal/KYA_S1.md',
  runbook: 'docs/runbooks/AEGIS_PILOT_RUNBOOK.md',
  auditorGuide: 'docs/runbooks/AEGIS_PILOT_AUDITOR_GUIDE.md',
  acceptanceAnnex: 'docs/sales/AEGIS_PILOT_ACCEPTANCE_ANNEX.md',
} as const;

export interface HardwareAttestation {
  tpmQuote: boolean;
  measuredBoot: boolean;
  hardwareKeys: boolean;
  /** Version of the reference PCR values (RIM) handed to the auditor; null when none. */
  rimVersion: string | null;
}

/** The pilot uses none of the production-phase hardware options (offer text, 29.09.2026). */
export const PILOT_ATTESTATION: HardwareAttestation = Object.freeze({
  tpmQuote: false,
  measuredBoot: false,
  hardwareKeys: false,
  rimVersion: null,
}) as HardwareAttestation;

export interface RecordProvenance {
  standards: { kyaS1: string | null };
  documents: {
    runbook: string | null;
    auditorGuide: string | null;
    acceptanceAnnex: string | null;
  };
  kit: { commit: string | null; dirty: boolean | null };
  attestation: HardwareAttestation;
}

/** The `Version:` line of a DWS document header, or null. */
export function docVersion(path: string): string | null {
  if (!existsSync(path)) return null;
  const m = /^Version:\s*(\d+(?:\.\d+)*)/m.exec(readFileSync(path, 'utf8'));
  return m ? m[1] : null;
}

/** true when dotted version `a` is at least `b` (numeric per part). */
export function versionAtLeast(a: string, b: string): boolean {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d > 0;
  }
  return true;
}

function git(root: string, args: string[]): string | null {
  try {
    return execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 10_000,
    }).trim();
  } catch {
    return null;
  }
}

export function collectProvenance(root: string = KIT_ROOT): RecordProvenance {
  const v = (rel: string) => docVersion(join(root, rel));
  const commit = git(root, ['rev-parse', 'HEAD']);
  const status = commit ? git(root, ['status', '--porcelain', '--untracked-files=no']) : null;
  return {
    standards: { kyaS1: v(PROVENANCE_SOURCES.kyaS1) },
    documents: {
      runbook: v(PROVENANCE_SOURCES.runbook),
      auditorGuide: v(PROVENANCE_SOURCES.auditorGuide),
      acceptanceAnnex: v(PROVENANCE_SOURCES.acceptanceAnnex),
    },
    kit: {
      commit: commit && /^[0-9a-f]{40}$/.test(commit) ? commit : null,
      dirty: status === null ? null : status.length > 0,
    },
    attestation: { ...PILOT_ATTESTATION },
  };
}

/** Fields an acceptance record cannot be signed without. */
export function provenanceGaps(p: RecordProvenance): string[] {
  const gaps: string[] = [];
  if (!p.standards.kyaS1) gaps.push('standards.kyaS1');
  for (const k of ['runbook', 'auditorGuide', 'acceptanceAnnex'] as const)
    if (!p.documents[k]) gaps.push(`documents.${k}`);
  if (!p.kit.commit) gaps.push('kit.commit');
  return gaps;
}
