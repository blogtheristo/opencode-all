#!/usr/bin/env node
// Evidence: Tool=Cursor Grok 4.6 Model=Cursor Grok 4.6 Agent=cursor Date=2026-09-19
// Audit trail: git log -- scripts/check-migration-filenames.mjs
/**
 * CODE VERSIONING NOTE
 * Version: 1.0
 * Tool: Cursor Grok 4.6
 * Session: cursor/supabase-advisor-warnings-3f7a
 * Date: 19.09.2026
 * Changes: DWS Document Standard §4.5 gate for new supabase/migrations filenames.
 *          PR-added files must be NNN_DDMMYY_snake_name.sql. Names already on
 *          the merge-base are grandfathered. Does not apply SQL.
 *
 * Usage:
 *   node scripts/check-migration-filenames.mjs --changed --base origin/main
 *   node scripts/check-migration-filenames.mjs --all   (inventory; exit 0 unless --fail-all)
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const MIGRATIONS_DIR = 'supabase/migrations';
/** Document Standard §4.5: [number]_[DDMMYY]_[name].sql — 3-digit number. */
export const MIGRATION_FILENAME_RE = /^(\d{3})_(\d{6})_([a-z][a-z0-9]*(?:_[a-z0-9]+)*)\.sql$/;

export function parseMigrationFilename(basename) {
  const m = basename.match(MIGRATION_FILENAME_RE);
  if (!m) return { ok: false, reason: 'pattern' };
  const dd = Number(m[2].slice(0, 2));
  const mm = Number(m[2].slice(2, 4));
  const yy = Number(m[2].slice(4, 6));
  if (dd < 1 || dd > 31 || mm < 1 || mm > 12) {
    return { ok: false, reason: 'date', dd, mm, yy };
  }
  return { ok: true, number: m[1], ddmmyy: m[2], name: m[3] };
}

function take(args, flag) {
  const i = args.indexOf(flag);
  if (i >= 0) {
    args.splice(i, 1);
    return true;
  }
  return false;
}

function takeVal(args, flag) {
  const i = args.indexOf(flag);
  if (i >= 0) {
    const v = args[i + 1];
    args.splice(i, 2);
    return v;
  }
  return undefined;
}

function gitLines(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', cwd: ROOT });
    return out
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function listAddedMigrationBasenames({ base = 'origin/main', all = false } = {}) {
  if (all) {
    const dir = path.join(ROOT, MIGRATIONS_DIR);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.sql'))
      .sort();
  }
  const names = new Set();
  const diff = gitLines(`git diff --name-status --diff-filter=ACR ${base} -- ${MIGRATIONS_DIR}`);
  for (const line of diff) {
    const parts = line.split(/\t+/);
    const status = parts[0] || '';
    const dest = status.startsWith('R') ? parts[2] : parts[1];
    if (!dest || !dest.endsWith('.sql')) continue;
    names.add(path.basename(dest));
  }
  return [...names].sort();
}

export function lintMigrationBasenames(basenames) {
  const failures = [];
  for (const name of basenames) {
    const parsed = parseMigrationFilename(name);
    if (!parsed.ok) {
      failures.push({ name, reason: parsed.reason });
    }
  }
  return failures;
}

function main(argv = process.argv.slice(2)) {
  const args = [...argv];
  const changed = take(args, '--changed');
  const all = take(args, '--all');
  const failAll = take(args, '--fail-all');
  const base = takeVal(args, '--base') || 'origin/main';
  const names = listAddedMigrationBasenames({ base, all: all && !changed });
  const failures = lintMigrationBasenames(names);
  if (names.length === 0) {
    console.log(`No ${all && !changed ? 'migration files' : 'added/renamed migrations'} to check.`);
    return 0;
  }
  console.log(`Checked ${names.length} file(s) under ${MIGRATIONS_DIR}.`);
  if (failures.length === 0) {
    console.log('OK — Document Standard §4.5.');
    return 0;
  }
  console.error(
    'FAIL — new supabase/migrations filenames must be NNN_DDMMYY_snake_name.sql (§4.5).',
  );
  for (const f of failures) {
    console.error(`  ${f.name} (${f.reason})`);
  }
  if (all && !changed && !failAll) {
    console.error('Inventory only (--all without --fail-all). Existing names are grandfathered.');
    return 0;
  }
  return 1;
}

const isCli =
  Boolean(process.argv[1]) && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  process.exit(main());
}
