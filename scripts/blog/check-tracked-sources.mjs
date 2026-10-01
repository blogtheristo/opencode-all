#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-opus-5-5 Agent=aegis-disclosure-depth Date=2026-10-01
// Audit trail: git log -- scripts/blog/check-tracked-sources.mjs
// Blog drift gate (HIC 01.10.2026: "update it always when aegis products move; it cannot have drift").
// A draft in docs/blog-drafts/ may declare `tracks:` (source files its claims rest on) and
// `tracks_sha256:`. When any tracked source changes, this check FAILS until the post is re-read,
// its `version` bumped, and the hash refreshed with --update <slug>.
// Tracked entry forms: a repo path, or `dws10.com/config/products.json#PREFIX` (only products whose
// id starts with PREFIX are hashed, so unrelated catalogue edits do not trip the gate).
//
// Usage: node scripts/blog/check-tracked-sources.mjs            # check all drafts with tracks:
//        node scripts/blog/check-tracked-sources.mjs --update <slug>
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const DRAFTS = join(ROOT, 'docs', 'blog-drafts');

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = { raw: m[1] };
  const tracks = [];
  let inTracks = false;
  for (const line of m[1].split('\n')) {
    if (/^tracks:\s*$/.test(line)) {
      inTracks = true;
      continue;
    }
    if (inTracks && /^\s+-\s+/.test(line)) {
      tracks.push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    inTracks = false;
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^"|"$/g, '');
  }
  fm.tracks = tracks;
  return fm;
}

function sourceBytes(entry) {
  const [file, prefix] = entry.split('#');
  const text = readFileSync(join(ROOT, file), 'utf8');
  if (!prefix) return text;
  const products = JSON.parse(text).products ?? {};
  const picked = Object.keys(products)
    .filter((id) => id.startsWith(prefix))
    .sort()
    .map((id) => [id, products[id]]);
  if (picked.length === 0) throw new Error(`${entry}: no products with id prefix ${prefix}`);
  return JSON.stringify(picked);
}

function digest(tracks) {
  const h = createHash('sha256');
  for (const entry of tracks) {
    h.update(entry + '\0');
    h.update(sourceBytes(entry));
    h.update('\0');
  }
  return h.digest('hex');
}

const args = process.argv.slice(2);
const updateSlug = args[0] === '--update' ? args[1] : null;
let failed = 0;
let checked = 0;

for (const name of readdirSync(DRAFTS)
  .filter((f) => f.endsWith('.md'))
  .sort()) {
  const path = join(DRAFTS, name);
  const text = readFileSync(path, 'utf8');
  const fm = frontmatter(text);
  if (!fm || fm.tracks.length === 0) continue;
  const slug = name.replace(/\.md$/, '');
  const now = digest(fm.tracks);
  if (updateSlug === slug) {
    if (!/^tracks_sha256:/m.test(fm.raw))
      throw new Error(`${name}: add a tracks_sha256: line first`);
    writeFileSync(path, text.replace(/^tracks_sha256:.*$/m, `tracks_sha256: ${now}`));
    console.log(
      `updated ${name} tracks_sha256 → ${now.slice(0, 12)} (version ${fm.version ?? '?'})`,
    );
    continue;
  }
  checked++;
  if (fm.tracks_sha256 !== now) {
    failed++;
    console.log(
      `FAIL ${name} v${fm.version ?? '?'}: a tracked source changed (${fm.tracks.join(', ')}).\n` +
        `     Re-read the post against the sources, fix any drift, bump version:, then run\n` +
        `     node scripts/blog/check-tracked-sources.mjs --update ${slug}\n` +
        `     A published post changed after approval goes back to the HIC (Rule 13).`,
    );
  } else console.log(`ok   ${name} v${fm.version ?? '?'}`);
}
if (!updateSlug) console.log(`blog tracked-source check: ${checked} post(s), ${failed} drifted`);
process.exit(failed ? 1 : 0);
