// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/aegis/pilot/site-config.ts
/**
 * Aegis Pilot — per-site anchoring configuration, `<stateDir>/site/anchoring.json`
 * (advisor review 01.10.2026, accepted; EVIDENCE_FORMAT_v1.md §8–§9).
 *
 *   sealSchedule    when the active segment is sealed: on shift change (UTC HH:MM) and at
 *                   least daily (maxAgeDays ≤ 1). After every human.override and every
 *                   configuration change too — those are not configurable. Active from
 *                   install: a missing file means the defaults, never "no schedule".
 *   operatorCopies  where the operator CLI writes its signed-command copies and the
 *                   digest-only WORM records. Must be a place the site-key holder cannot
 *                   write. `lock` names the retention lock (target, retention, holder role);
 *                   the lock itself is storage configuration, not code.
 *   anchorExport    the customer-owned sinks every seal anchor goes to: an append-only
 *                   file for SIEM pickup and/or RFC 5424 syslog over TCP/TLS, administered
 *                   by a different person than the box (`administeredBy`, a role).
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';
import { statePaths } from './identity.js';

const ROLE = z.string().regex(/^[a-z][a-z0-9_-]{1,39}$/);

const SiteConfigSchema = z
  .object({
    v: z.literal(1),
    sealSchedule: z
      .object({
        /** Shift changes, UTC, "HH:MM". */
        shiftChanges: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)).max(24),
        /** At least daily: the newest seal may be at most this old (overdue after 1 h grace). */
        maxAgeDays: z.number().positive().max(1),
      })
      .strict(),
    operatorCopies: z
      .object({
        /** Full signed-command copies; null = the operator's ~/.aegis-operator/commands. */
        dir: z.string().min(1).nullable(),
        /** Digest-only WORM records; null = the operator's ~/.aegis-operator/worm. */
        wormDir: z.string().min(1).nullable(),
        lock: z
          .object({
            target: z.string().min(1).max(200),
            retention: z.string().min(1).max(40),
            lockHolderRole: ROLE,
          })
          .strict()
          .nullable(),
      })
      .strict(),
    anchorExport: z
      .object({
        /** Append-only local file for SIEM pickup. */
        file: z.string().min(1).nullable(),
        syslog: z
          .object({
            host: z.string().min(1),
            port: z.number().int().min(1).max(65535),
            /** TLS (RFC 5425). false only for a loopback test sink; doctor warns. */
            tls: z.boolean(),
            caFile: z.string().min(1).optional(),
            servername: z.string().min(1).optional(),
            timeoutMs: z.number().int().positive().max(120_000).optional(),
          })
          .strict()
          .nullable(),
        /** Role of the person who administers the sinks — not the box administrator. */
        administeredBy: ROLE.nullable(),
      })
      .strict(),
  })
  .strict();

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type AnchorExportConfig = SiteConfig['anchorExport'];
export type SealScheduleConfig = SiteConfig['sealSchedule'];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  v: 1,
  sealSchedule: { shiftChanges: [], maxAgeDays: 1 },
  operatorCopies: { dir: null, wormDir: null, lock: null },
  anchorExport: { file: null, syslog: null, administeredBy: null },
};

export function siteConfigPath(stateDir: string): string {
  return join(statePaths(stateDir).siteDir, 'anchoring.json');
}

/** The site's anchoring config; the defaults when absent. Throws on an invalid file. */
export function loadSiteConfig(stateDir: string): SiteConfig {
  const path = siteConfigPath(stateDir);
  if (!existsSync(path)) return DEFAULT_SITE_CONFIG;
  const parsed = SiteConfigSchema.safeParse(JSON.parse(readFileSync(path, 'utf8')));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`${path} invalid at ${issue?.path.join('.')}: ${issue?.message}`);
  }
  return parsed.data;
}

/** Write the default config at install (never overwrites). */
export function writeDefaultSiteConfig(stateDir: string): string {
  const path = siteConfigPath(stateDir);
  if (!existsSync(path))
    writeFileSync(path, `${JSON.stringify(DEFAULT_SITE_CONFIG, null, 2)}\n`, {
      mode: 0o644,
      flag: 'wx',
    });
  return path;
}

/** Where the operator CLI writes copies, resolved in the operator's own home by default. */
export function operatorCopyDirs(
  config: SiteConfig,
  overrides: { dir?: string; wormDir?: string } = {},
): { dir: string; wormDir: string } {
  const home = join(homedir(), '.aegis-operator');
  return {
    dir: overrides.dir ?? config.operatorCopies.dir ?? join(home, 'commands'),
    wormDir: overrides.wormDir ?? config.operatorCopies.wormDir ?? join(home, 'worm'),
  };
}
