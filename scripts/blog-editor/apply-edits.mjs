#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=blog-editor Date=2026-09-28
// Audit trail: git log -- scripts/blog-editor/apply-edits.mjs
/**
 * Bring the HIC's Blog editor edits back into git.
 *
 *   node scripts/blog-editor/apply-edits.mjs <rows.json>
 *
 * <rows.json> is the page's `drafts` collection as Claude read it (ArtifactData list): an array of
 * { id, data: { name, content, baseHash, edited, approved } }. For every edited row it writes
 * docs/blog-drafts/<name> in the current checkout — unless the file in git changed since the row
 * was seeded (its hash differs from baseHash), which is reported as a conflict and left alone.
 * Prints JSON: { applied: [...], approved: [...], conflicts: [...], skipped: n }.
 * Commit, push and PR are the caller's job; then re-seed the rows (build.mjs) so baseHash moves on.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/blog-editor/apply-edits.mjs <rows.json>');
  process.exit(2);
}
const sha = (s) => createHash('sha256').update(s).digest('hex');
const raw = JSON.parse(readFileSync(file, 'utf8'));
const rows = Array.isArray(raw) ? raw : (raw.docs ?? raw.documents ?? []);
const result = { applied: [], approved: [], conflicts: [], skipped: 0 };

for (const row of rows) {
  const d = row.data ?? row;
  const name = d.name ?? row.id;
  if (!d.edited) {
    result.skipped++;
    continue;
  }
  if (!/^[A-Za-z0-9._-]+\.md$/.test(String(name)) || typeof d.content !== 'string') {
    result.conflicts.push({ name, reason: 'invalid row' });
    continue;
  }
  const path = join('docs/blog-drafts', name);
  const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
  if (current && sha(current) !== d.baseHash) {
    result.conflicts.push({ name, reason: 'changed in git since it was seeded — merge by hand' });
    continue;
  }
  const next = d.content.replace(/\r\n/g, '\n').replace(/\n*$/, '\n');
  if (next === current) {
    result.skipped++;
    continue;
  }
  writeFileSync(path, next);
  result.applied.push(name);
  if (d.approved) result.approved.push(name);
}
console.log(JSON.stringify(result, null, 2));
