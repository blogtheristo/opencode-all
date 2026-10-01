#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=claude-code Date=2026-09-30
// Audit trail: git log -- scripts/check-live-versions.mjs
/**
 * Live sites never offer an old version of a document (HIC 30.09.2026).
 *
 *   node scripts/check-live-versions.mjs [--json]
 *
 * 1. Versioned references. Every public-site file (dws10.com, dws6.com, onelifetime.world,
 *    lifetime.fi and their landing-pages mirrors) is scanned for file names that carry a version,
 *    `<name>[_-]v<X.Y>.<ext>` (links, GitHub URLs, downloads, code mentions). If the repository
 *    holds the same <name> with a higher version, the reference is stale.
 *    A reference that must stay pinned (a changelog citing the old text) carries
 *    `version-pinned` on the same line.
 * 2. Published copies. `config/truth/published-artifacts.json` lists documents whose content
 *    is copied onto a site under a version-less URL. The copy's version marker must equal the
 *    newest source version.
 *
 * Exit 1 on any stale item. No network, no model.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITES = [
  'dws10.com',
  'dws6.com',
  'onelifetime.world',
  'lifetime.fi',
  'landing-pages/dws10-com',
  'landing-pages/dws6-com',
  'landing-pages/onelifetime-world',
  'landing-pages/lifetime-fi',
];
const SCANNED = /\.(html?|json|txt|xml|js|css)$/i;
const REF = /([A-Za-z0-9_.-]+?)[_-]v(\d+(?:\.\d+)+)\.(html|md|pdf|docx|pptx)\b/g;

const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
  .split('\n')
  .filter(Boolean);
const cmp = (a, b) => {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0);
  return 0;
};

// Newest version per "<name>.<ext>" anywhere in the repository (sites excluded: a stale copy
// on a site must not count as the newest source).
const newest = new Map();
for (const f of files) {
  if (SITES.some((s) => f.startsWith(`${s}/`))) continue;
  const base = f.split('/').pop();
  for (const m of base.matchAll(REF)) {
    if (m.index !== 0 || m[0] !== base) continue;
    const key = `${m[1]}.${m[3]}`;
    if (!newest.has(key) || cmp(m[2], newest.get(key).v) > 0) newest.set(key, { v: m[2], path: f });
  }
}

const stale = [];
for (const f of files) {
  if (!SITES.some((s) => f.startsWith(`${s}/`)) || !SCANNED.test(f)) continue;
  const lines = readFileSync(join(ROOT, f), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes('version-pinned')) return;
    for (const m of line.matchAll(REF)) {
      const n = newest.get(`${m[1]}.${m[3]}`);
      if (n && cmp(m[2], n.v) < 0)
        stale.push({ kind: 'reference', at: `${f}:${i + 1}`, offers: m[0], newest: n.path });
    }
  });
}

// Published copies (version-less URLs).
const REG = 'config/truth/published-artifacts.json';
const reg = existsSync(join(ROOT, REG)) ? JSON.parse(readFileSync(join(ROOT, REG), 'utf8')) : {};
for (const a of reg.artifacts ?? []) {
  const re = new RegExp(
    `^${a.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\\{v\\}', '(\\d+(?:\\.\\d+)*)')}$`,
  );
  let src = null;
  for (const f of files) {
    const m = f.match(re);
    if (m && (!src || cmp(m[1], src.v) > 0)) src = { v: m[1], path: f };
  }
  if (!src) {
    stale.push({ kind: 'registry', at: REG, offers: a.id, newest: `no file matches ${a.source}` });
    continue;
  }
  const marker = new RegExp(a.marker ?? 'Document revision:\\s*v(\\d+(?:\\.\\d+)*)');
  for (const p of a.published) {
    const got = existsSync(join(ROOT, p))
      ? readFileSync(join(ROOT, p), 'utf8').match(marker)?.[1]
      : null;
    if (got !== src.v)
      stale.push({
        kind: 'copy',
        at: p,
        offers: `v${got ?? '?'}`,
        newest: `${src.path} (v${src.v})`,
      });
  }
}

if (process.argv.includes('--json')) console.log(JSON.stringify({ stale }, null, 1));
else if (!stale.length) console.log('live-versions: OK — no site offers an older document version');
else {
  console.log(`live-versions: ${stale.length} stale item(s)`);
  for (const s of stale)
    console.log(`  STALE ${s.kind}  ${s.at}  offers ${s.offers}  → newest ${s.newest}`);
}
process.exit(stale.length ? 1 : 0);
