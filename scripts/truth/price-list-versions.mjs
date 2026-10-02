#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=price-list-a5-campaign Date=2026-09-25
// Audit trail: git log -- scripts/truth/price-list-versions.mjs
//
// Price-list version evidence (HIC 25.09.2026: "Price-list versiot ovat tärkeitä evidenssiä joten
// ne pitää aina säästää"). One entry per catalogue version with its snapshot file, sha256, origin
// (original or reconstructed from git), the last main commit of that version and its product
// counts. Every version older than the current one is frozen: its snapshot must exist unchanged
// in both folders (checked here and by validate-product-publication.mjs), and
// scripts/gen-price-list-html.cjs refuses to overwrite it.
//
// Usage:
//   node scripts/truth/price-list-versions.mjs --scan   # counts per version from git (needs full history)
//   node scripts/truth/price-list-versions.mjs          # write manifest + docs/truth/PRICE_LIST_VERSIONS.md
//   node scripts/truth/price-list-versions.mjs --check  # exit 1 if a frozen snapshot is missing or changed

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG_REL = 'dws10.com/config/products.json';
const DIRS = ['dws10.com/price-list/versions', 'landing-pages/dws10-com/price-list/versions'];
const MANIFEST = path.join(ROOT, 'config/truth/price-list-versions.json');
const OUT_MD = path.join(ROOT, 'docs/truth/PRICE_LIST_VERSIONS.md');

const sha256 = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const vkey = (v) => (/^\d+\.\d+$/.test(v) ? v.split('.').map(Number) : [0, 0]); // 2026.Q2 sorts first
const cmpV = (a, b) => vkey(a)[0] - vkey(b)[0] || vkey(a)[1] - vkey(b)[1];

function counts(cat) {
  const pr = cat.products || {};
  const sb = cat.subscriptions || {};
  const all = { ...pr };
  for (const [k, v] of Object.entries(sb)) if (!all[k]) all[k] = v;
  const pub = (p) => !(p.archived || p.productType === 'archived' || p.deploymentColor === 'blue');
  return {
    productRecords: Object.keys(pr).length,
    subscriptionRecords: Object.keys(sb).length,
    publicProducts: Object.values(pr).filter(pub).length,
    onPriceList: Object.values(all).filter(pub).length,
  };
}

function scanGit() {
  const git = (a) =>
    execFileSync('git', a, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  const out = {};
  // First pass: main's first-parent line. Second pass: any branch, for versions never on main.
  for (const firstParent of [true, false]) {
    const log = git([
      'log',
      ...(firstParent ? ['--first-parent'] : []),
      '--format=%H %ad',
      '--date=short',
      'HEAD',
      '--',
      CATALOG_REL,
    ])
      .trim()
      .split('\n');
    const seen = new Set();
    for (const line of log) {
      const [sha, date] = line.split(' ');
      let cat;
      try {
        cat = JSON.parse(git(['show', `${sha}:${CATALOG_REL}`]));
      } catch {
        continue;
      }
      // priceList.version is the list version; priceVersion sometimes lagged behind it, so it is
      // only used on the branch pass, for versions never seen on main.
      const keys = firstParent
        ? [cat.priceList?.version || cat.priceVersion]
        : [cat.priceList?.version, cat.priceVersion];
      for (const v of new Set(keys.filter(Boolean))) {
        if (out[v] || seen.has(v)) continue; // newest commit per version wins (log is newest first)
        seen.add(v);
        if (!firstParent && Object.keys(out).includes(v)) continue;
        out[v] = {
          lastMainCommit: sha.slice(0, 9),
          lastMainDate: date,
          ...(firstParent ? {} : { branchOnly: true }),
          ...counts(cat),
        };
      }
    }
  }
  return out;
}

function build(scanned) {
  const old = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
    : { versions: [] };
  const byV = Object.fromEntries(old.versions.map((e) => [e.version, e]));
  const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, CATALOG_REL), 'utf8'));
  const current = catalog.priceList?.version || catalog.priceVersion;
  const files = fs
    .readdirSync(path.join(ROOT, DIRS[0]))
    .map((f) => f.match(/^price-list-v(.+)\.html$/)?.[1])
    .filter(Boolean);
  const history = new Set((catalog.priceHistory || []).map((h) => h.version));
  const versions = [...new Set([...files, ...history, ...Object.keys(scanned || {})])].sort(cmpV);
  const entries = versions.map((v) => {
    const prev = byV[v] || {};
    const file = `price-list-v${v}.html`;
    const abs = path.join(ROOT, DIRS[0], file);
    const exists = fs.existsSync(abs);
    const html = exists ? fs.readFileSync(abs, 'utf8') : '';
    const e = {
      version: v,
      snapshot: exists ? file : null,
      origin: !exists
        ? 'missing'
        : html.includes('Reconstructed snapshot.')
          ? 'reconstructed'
          : 'original',
      frozen: exists && v !== current,
      sha256: exists ? sha256(abs) : null,
      ...(prev.lastMainCommit
        ? { lastMainCommit: prev.lastMainCommit, lastMainDate: prev.lastMainDate }
        : {}),
      ...(prev.onPriceList !== undefined
        ? {
            productRecords: prev.productRecords,
            subscriptionRecords: prev.subscriptionRecords,
            publicProducts: prev.publicProducts,
            onPriceList: prev.onPriceList,
          }
        : {}),
      ...((scanned || {})[v] || {}),
    };
    const from = html.match(/at commit ([0-9a-f]{7,40})/);
    if (e.origin === 'reconstructed' && from) e.reconstructedFrom = from[1];
    if (v === current) Object.assign(e, counts(catalog));
    // A frozen hash never moves: keep the recorded one so --check can catch a change.
    if (prev.frozen && prev.sha256) e.sha256 = prev.sha256;
    return e;
  });
  return { current, versions: entries };
}

function renderMd(m) {
  const rows = m.versions.map(
    (e) =>
      `| ${e.version} | ${e.snapshot ? `\`${e.snapshot}\`` : '—'} | ${e.origin} | ${e.frozen ? 'yes' : e.version === m.current ? 'current' : 'no'} | ${e.lastMainDate || '—'} | ${e.lastMainCommit ? `\`${e.lastMainCommit}\`${e.branchOnly ? ' (branch)' : ''}` : '—'} | ${e.productRecords ?? '—'} | ${e.publicProducts ?? '—'} | ${e.onPriceList ?? '—'} |`,
  );
  return [
    '# Price-List Versions — evidence register',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${m.current} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${m.current} [Latest] | Tool: scripts/truth/price-list-versions.mjs | Changes: Generated from config/truth/price-list-versions.json. Do not edit by hand.`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: ACTIVE',
    '- Canonical row: DWS_TRUTH_STANDARD.md §2 row 44',
    '',
    '---',
    '',
    'Every catalogue version keeps its price-list snapshot (HIC 25.09.2026). Versions older than the current one are **frozen**: the snapshot must exist unchanged (sha256) in `dws10.com/price-list/versions/` and its `landing-pages/` mirror, and the generator refuses to overwrite it. **Reconstructed** snapshots were never saved at the time; they were rebuilt from the catalogue at the named commit and say so on the page.',
    '',
    'Missing: 1.14 is listed in `priceHistory`, but no catalogue commit on any branch ever carried it (the catalogue went from 1.13 to 1.15 in #1305), so there is nothing to rebuild. 1.26 was never issued.',
    '',
    'Counts: `records` = entries in `products`; `public` = non-BLUE, non-archived `products`; `on list` = public products + active subscription-only records (what the price list renders).',
    '',
    '| Version | Snapshot | Origin | Frozen | Last main date | Last main commit | Records | Public | On list |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

function check(m) {
  const problems = [];
  for (const e of m.versions.filter((x) => x.frozen)) {
    for (const d of DIRS) {
      const f = path.join(ROOT, d, e.snapshot);
      if (!fs.existsSync(f)) problems.push(`${d}/${e.snapshot} missing`);
      else if (sha256(f) !== e.sha256)
        problems.push(`${d}/${e.snapshot} changed (frozen evidence)`);
    }
  }
  const cur = m.versions.find((x) => x.version === m.current);
  if (!cur?.snapshot) problems.push(`no snapshot for current version ${m.current}`);
  return problems;
}

export function checkPriceListVersions() {
  if (!fs.existsSync(MANIFEST)) return ['config/truth/price-list-versions.json missing'];
  return check(JSON.parse(fs.readFileSync(MANIFEST, 'utf8')));
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--check')) {
    const problems = checkPriceListVersions();
    if (problems.length) {
      console.error(`[price-list-versions] FAIL — ${problems.join('; ')}`);
      process.exitCode = 1;
    } else console.log('[price-list-versions] OK — every frozen snapshot present and unchanged');
    return;
  }
  const m = build(args.includes('--scan') ? scanGit() : null);
  fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + '\n');
  fs.writeFileSync(OUT_MD, renderMd(m));
  console.log(
    `[price-list-versions] ${m.versions.length} versions; frozen ${m.versions.filter((e) => e.frozen).length}; missing ${m.versions.filter((e) => e.origin === 'missing').length}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
