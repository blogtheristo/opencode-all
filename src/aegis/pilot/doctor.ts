// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=aegis-pilot-doctor Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/doctor.ts
/**
 * Aegis Pilot — preflight doctor command.
 *
 * Returns one JSON document with check results. Never modifies state.
 */

import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { SiteAuthority } from './identity.js';
import { checkLocalFilesystem } from './acceptance.js';
import { verifySegments } from './ledger-segments.js';

export interface DoctorCheck {
  check: string;
  ok: boolean;
  detail: string;
}

export interface DoctorResult {
  ok: boolean;
  checks: DoctorCheck[];
}

/**
 * @param pin the scope's `site.keyId`: undefined when no scope was given (check not run),
 *   null when a scope was given without a pin (check fails).
 */
export function doctor(stateDir: string, pin?: string | null): DoctorResult {
  const checks: DoctorCheck[] = [];
  const push = (check: string, ok: boolean, detail: string) => checks.push({ check, ok, detail });

  // 1. state-dir-mode — state dir not group/world writable
  try {
    const st = statSync(stateDir);
    const mode = st.mode & 0o777;
    const groupWritable = (mode & 0o020) !== 0;
    const worldWritable = (mode & 0o002) !== 0;
    const ok = !groupWritable && !worldWritable;
    const detail = ok
      ? `state directory mode ${st.mode.toString(8)}, writable by owner only`
      : `state directory mode ${st.mode.toString(8)}, group/world writable`;
    push('state-dir-mode', ok, detail);
  } catch (err) {
    push('state-dir-mode', false, `state directory check failed: ${(err as Error).message}`);
  }

  // 2. site-key-mode — site/site.key mode 0600
  const siteKeyPath = join(stateDir, 'site', 'site.key');
  try {
    if (!existsSync(siteKeyPath)) {
      push('site-key-mode', false, 'site/site.key not found');
    } else {
      const st = statSync(siteKeyPath);
      const mode = st.mode & 0o777;
      const ok = mode === 0o600;
      const detail = ok
        ? `site.key mode ${st.mode.toString(8)}`
        : `site.key mode ${st.mode.toString(8)}, expected 0600`;
      push('site-key-mode', ok, detail);
    }
  } catch (err) {
    push('site-key-mode', false, `site.key mode check failed: ${(err as Error).message}`);
  }

  // 3. ledger-local-fs — reuse checkLocalFilesystem from acceptance.ts
  try {
    const fsCheck = checkLocalFilesystem(stateDir);
    const ok = fsCheck.local;
    const detail = fsCheck.local
      ? `ledger on local filesystem (${fsCheck.fsType})`
      : `ledger not on local filesystem: ${fsCheck.fsType}${fsCheck.note ? `: ${fsCheck.note}` : ''}`;
    push('ledger-local-fs', ok, detail);
  } catch (err) {
    push('ledger-local-fs', false, `filesystem check failed: ${(err as Error).message}`);
  }

  // 4. ledger-verifies — verifySegments with the site public key
  try {
    const site = SiteAuthority.load(stateDir);
    const verification = verifySegments(stateDir, site, new Date());
    const ok = verification.valid;
    const detail = ok
      ? `ledger segments valid, active ledger valid, ${verification.segments.length} sealed segment(s)`
      : (verification.reason ?? 'ledger segments failed verification');
    push('ledger-verifies', ok, detail);
  } catch (err) {
    push('ledger-verifies', false, `ledger verification failed: ${(err as Error).message}`);
  }

  // 5. key-pinned — only with --scope: scope.site.keyId equals site keyId; missing pin = fail
  if (pin === null) {
    push('key-pinned', false, 'scope has no site.keyId pin');
  } else if (pin !== undefined) {
    try {
      const site = SiteAuthority.load(stateDir);
      const ok = pin === site.manifest.keyId;
      const detail = ok
        ? `site keyId ${site.manifest.keyId} matches the pin`
        : `site keyId ${site.manifest.keyId} does not match the pin ${pin}`;
      push('key-pinned', ok, detail);
    } catch (err) {
      push('key-pinned', false, `key pin check failed: ${(err as Error).message}`);
    }
  }

  // 6. isolation-tool — unshare required on Linux; warn-only, ok:true with detail on other OS
  if (process.platform === 'linux') {
    const r = spawnSync('unshare', ['--help'], { stdio: 'ignore' });
    const ok = !r.error && r.status === 0;
    push(
      'isolation-tool',
      ok,
      ok
        ? 'unshare available on Linux'
        : 'unshare not found on Linux; isolated rehearsal cannot run',
    );
  } else {
    push(
      'isolation-tool',
      true,
      `not on Linux; isolation tool check skipped (${process.platform})`,
    );
  }

  const ok = checks.every((c) => c.ok);
  return { ok, checks };
}
