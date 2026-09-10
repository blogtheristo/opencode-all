#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-10
// Audit trail: git log -- scripts/gen-tree-gate-manifest.mjs
/**
 * P4 manifest generator for the poisoned-tree gate.
 *
 * The gate's P4 manifest is BOUND to the base commit it was generated from
 * (`loadManifest` rejects any manifest whose `baseline` differs from the
 * resolved base). A statically committed manifest therefore goes stale the
 * moment `main` moves, which is why the checked-in `.githooks/critical-files.manifest`
 * could never validate. The manifest has to be generated per evaluation.
 *
 * What stays under review is the ROSTER — `.githooks/critical-files.roster.json`,
 * a sorted array of repo-relative paths. This script reads the roster from the
 * BASE TREE (not the working tree, so a PR cannot widen or empty its own
 * allowlist) and emits the manifest entries for those paths as they exist at
 * the base commit.
 *
 * P4 is enforced unconditionally — it is not softened by the approval path — so
 * any path listed in the roster can never be changed by a PR. Only put a path
 * there when "must not change without a separate, deliberate roster edit" is
 * genuinely the intent.
 *
 * Usage:
 *   node scripts/gen-tree-gate-manifest.mjs --repo . --base <sha> --out <file>
 *
 * Exit codes: 0 = manifest written, 2 = usage or generation error (fail closed).
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const ROSTER_PATH = '.githooks/critical-files.roster.json';

function gx(repo, args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
}

/** Read the roster from the base tree. Absent roster = empty allowlist. */
export function loadRoster(repo, baseSha) {
  let entry;
  try {
    entry = gx(repo, ['ls-tree', baseSha, '--', ROSTER_PATH]);
  } catch {
    return { error: 'roster unreadable — fail closed' };
  }
  if (!entry) return { paths: [] };
  let raw;
  try {
    raw = JSON.parse(gx(repo, ['cat-file', '-p', entry.split(/\s+/)[2]]));
  } catch {
    return { error: 'roster is not valid JSON — fail closed' };
  }
  if (!Array.isArray(raw?.paths)) return { error: 'roster schema invalid — fail closed' };
  if (JSON.stringify(raw.paths) !== JSON.stringify([...raw.paths].sort())) {
    return { error: 'roster not deterministically ordered — fail closed' };
  }
  return { paths: raw.paths };
}

/** Build P4 entries for `paths` as they exist at `baseSha`. */
export function buildEntries(repo, baseSha, paths) {
  const entries = [];
  for (const path of paths) {
    let line;
    try {
      line = gx(repo, ['ls-tree', baseSha, '--', path]);
    } catch {
      return { error: `roster path unreadable at base: ${path}` };
    }
    if (!line) return { error: `roster path missing from base tree: ${path}` };
    const [meta] = line.split('\t');
    const [mode, type, oid] = meta.split(/\s+/);
    if (type !== 'blob') return { error: `roster path is not a regular file: ${path} (${type})` };
    entries.push({ path, type, mode, oid, size: parseInt(gx(repo, ['cat-file', '-s', oid]), 10) });
  }
  return { entries };
}

export function generate(repo, baseSha) {
  const roster = loadRoster(repo, baseSha);
  if (roster.error) return { error: roster.error };
  const built = buildEntries(repo, baseSha, roster.paths);
  if (built.error) return { error: built.error };
  // `loadManifest` requires byte-wise sorted paths; the roster is already
  // verified sorted above, so entries inherit that ordering.
  return { manifest: { version: 1, baseline: baseSha, files: built.entries } };
}

export function main(argv) {
  let repo = '.';
  let base = null;
  let out = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--repo') repo = argv[i + 1];
    if (argv[i] === '--base') base = argv[i + 1];
    if (argv[i] === '--out') out = argv[i + 1];
  }
  if (!base || !out) {
    console.error('gen-tree-gate-manifest: usage --repo <dir> --base <sha> --out <file>');
    process.exitCode = 2;
    return;
  }
  if (!/^[0-9a-f]{40}$/.test(base)) {
    console.error(`gen-tree-gate-manifest: --base must be a full 40-char sha, got "${base}"`);
    process.exitCode = 2;
    return;
  }
  const res = generate(repo, base);
  if (res.error) {
    console.error(`gen-tree-gate-manifest: ${res.error}`);
    process.exitCode = 2;
    return;
  }
  writeFileSync(out, `${JSON.stringify(res.manifest, null, 2)}\n`);
  console.error(
    `gen-tree-gate-manifest: wrote ${out} (baseline ${base.slice(0, 8)}, ${res.manifest.files.length} critical file(s))`,
  );
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main(process.argv.slice(2));
}
