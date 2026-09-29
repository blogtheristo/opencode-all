// Evidence: Tool=opencode Model=ollama-local/qwen3-coder-next:latest Agent=opencode Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/doctor.ts
/**
 * Aegis Pilot — preflight doctor command.
 *
 * Returns one JSON document with check results. Never modifies state.
 */

import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
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

export function doctor(stateDir: string, expectKeyId?: string): DoctorResult {
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
  if (expectKeyId !== undefined) {
    try {
      const site = SiteAuthority.load(stateDir);
      const ok = expectKeyId === site.manifest.keyId;
      const detail = ok
        ? `site keyId ${site.manifest.keyId} matches the pin`
        : `site keyId ${site.manifest.keyId} does not match the pin ${expectKeyId}`;
      push('key-pinned', ok, detail);
    } catch (err) {
      push('key-pinned', false, `key pin check failed: ${(err as Error).message}`);
    }
  } else {
    push('key-pinned', false, 'key pin check requires --scope option');
  }

  // 6. isolation-tool — unshare available on Linux; warn-only, ok:true with detail on other OS
  if (process.platform === 'linux') {
    try {
      execSync('unshare --help > /dev/null 2>&1', {
        stdio: ['ignore', 'ignore', 'ignore'],
      });
      push('isolation-tool', true, 'unshare available on Linux');
    } catch {
      push('isolation-tool', true, 'unshare not found on Linux (isolation check may fail)');
    }
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
