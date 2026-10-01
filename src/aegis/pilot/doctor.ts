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
import { anchorStatus, sealDue, verifySegments } from './ledger-segments.js';
import { loadSiteConfig, operatorCopyDirs, type SiteConfig } from './site-config.js';

/**
 * Can the owner of the state directory write `dir`? The copy directory must be out of the
 * site key holder's reach (EVIDENCE_FORMAT_v1.md §7). Root owns everything it runs as.
 */
export function writableByStateOwner(stateDir: string, dir: string): boolean {
  const owner = statSync(stateDir);
  const st = statSync(dir);
  const mode = st.mode & 0o777;
  if (owner.uid === 0) return true;
  if (mode & 0o002) return true;
  if (st.uid === owner.uid && mode & 0o200) return true;
  return st.gid === owner.gid && (mode & 0o020) !== 0;
}

export interface DoctorCheck {
  check: string;
  ok: boolean;
  detail: string;
  /** A warning is reported with ok: true; it does not fail the doctor. */
  level?: 'warning';
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

  // 7–8. Operator command copies (anchoring level 1): out of the site key holder's reach,
  // with a named retention lock. Warnings — the lock itself is storage configuration.
  let config: SiteConfig | null = null;
  try {
    config = loadSiteConfig(stateDir);
  } catch (err) {
    push('site-config', false, (err as Error).message);
  }
  const warn = (check: string, detail: string) =>
    checks.push({ check, ok: true, level: 'warning', detail });
  if (config) {
    const { dir, wormDir } = operatorCopyDirs(config);
    for (const [name, d] of [
      ['operator-copies-dir', dir],
      ['operator-worm-dir', wormDir],
    ] as const) {
      try {
        if (!existsSync(d))
          warn(name, `${d} does not exist yet (created by the first stop/decide)`);
        else if (writableByStateOwner(stateDir, d))
          warn(
            name,
            `${d} is writable by the state-dir owner: the site key holder can rewrite the copies`,
          );
        else push(name, true, `${d} not writable by the state-dir owner`);
      } catch (err) {
        warn(name, `${d}: ${(err as Error).message}`);
      }
    }
    // 9. Seal age: a monitored setting. Overdue is an alert (seal-status records the incident).
    try {
      const due = sealDue(stateDir, config.sealSchedule, new Date());
      const hours = (due.ageMs / 3_600_000).toFixed(1);
      push(
        'seal-age',
        !due.overdue,
        due.overdue
          ? `last seal ${hours} h old: OVERDUE (max ${config.sealSchedule.maxAgeDays} d); run "seal --scheduled"`
          : `last seal ${hours} h old (max ${config.sealSchedule.maxAgeDays} d)${due.due ? `; due now: ${due.reasons.join('; ')}` : ''}`,
      );
    } catch (err) {
      push('seal-age', false, (err as Error).message);
    }
    // 10. Anchor export: a customer-owned sink, administered by someone other than the box.
    const ax = config.anchorExport;
    if (!ax.file && !ax.syslog)
      warn('anchor-export', 'no anchor sink configured (anchorExport.file / anchorExport.syslog)');
    else {
      const st = anchorStatus(stateDir, ax);
      if (st.failing.length)
        warn(
          'anchor-export',
          `export failing to ${st.failing.join(', ')}; anchors queued, retried by "seal --scheduled"`,
        );
      else if (ax.syslog && !ax.syslog.tls)
        warn('anchor-export', 'syslog sink without TLS: use RFC 5425 TLS outside a loopback test');
      else if (!ax.administeredBy)
        warn(
          'anchor-export',
          'anchorExport.administeredBy names no role: the sink must be administered by someone other than the box',
        );
      else push('anchor-export', true, `sinks configured, administered by ${ax.administeredBy}`);
    }
    const lock = config.operatorCopies.lock;
    if (lock)
      push(
        'operator-copies-lock',
        true,
        `retention lock named: ${lock.target}, ${lock.retention}, held by ${lock.lockHolderRole} (storage configuration; not verified by code)`,
      );
    else
      warn(
        'operator-copies-lock',
        'retention lock unverified: site/anchoring.json names no lock (target, retention, lockHolderRole)',
      );
  }

  const ok = checks.every((c) => c.ok);
  return { ok, checks };
}
