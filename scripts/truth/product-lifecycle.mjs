#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=price-list-a5-campaign Date=2026-09-25
// Audit trail: git log -- scripts/truth/product-lifecycle.mjs
//
// Product lifecycle registry (HIC 25.09.2026: "IDs has to be on truth registry with retired to
// future unpublished products. The lifecycle state of a product with decision evidence has to be
// found there. Make own md and later supabase db").
//
// One row per product ID that has ever existed or is decided to exist:
//   - every ID in dws10.com/config/products.json (products, subscriptions, discontinuedProducts)
//   - every ID that was in the catalogue in git history and has since been removed
//   - every planned or decided ID in the HIC decision ledger (config/truth/product-lifecycle-ledger.json)
//   - every public product page in dws10.com/products/ that has no catalogue ID (drift)
// Each row carries its lifecycle state and the evidence behind it: catalogue fields, git commits
// that changed its state, and HIC decisions from the ledger.
//
// The row shape matches the planned Supabase table (one row per ID + one row per evidence event),
// so the later DB load is a straight copy of config/truth/product-lifecycle.json.
//
// Usage:
//   node scripts/truth/product-lifecycle.mjs --scan-git  # rebuild config/truth/product-id-history.json (needs full git history)
//   node scripts/truth/product-lifecycle.mjs             # write docs/truth/PRODUCT_LIFECYCLE.md + config/truth/product-lifecycle.json
//   node scripts/truth/product-lifecycle.mjs --check     # exit 1 if stale or a catalogue ID has no lifecycle state

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG_REL = 'dws10.com/config/products.json';
const CATALOG = path.join(ROOT, CATALOG_REL);
const PAGES_DIR = path.join(ROOT, 'dws10.com/products');
const LEDGER = path.join(ROOT, 'config/truth/product-lifecycle-ledger.json');
const HISTORY = path.join(ROOT, 'config/truth/product-id-history.json');
const OUT_MD = path.join(ROOT, 'docs/truth/PRODUCT_LIFECYCLE.md');
const OUT_JSON = path.join(ROOT, 'config/truth/product-lifecycle.json');

// Lifecycle states, in lifecycle order.
export const STATES = {
  planned: 'Decided or planned; no catalogue record yet',
  'page-only': 'Public product page exists but no catalogue ID (drift; needs a decision)',
  internal: 'Catalogue record, BLUE: internal or pilot, not on the public price list',
  published: 'Catalogue record, public: on the price list',
  archived: 'Retired: catalogue record kept, archived, not sold',
  discontinued: 'Retired: moved to discontinuedProducts',
  removed: 'Retired: was in the catalogue, record deleted (evidence from git history)',
};
const STATE_ORDER = Object.keys(STATES);

const isArchived = (p) => p?.archived === true || p?.productType === 'archived';

function catalogueStates(catalog) {
  const out = {};
  for (const [id, p] of Object.entries(catalog.discontinuedProducts || {}))
    out[id] = { state: 'discontinued', source: 'discontinuedProducts', rec: p };
  for (const [id, p] of Object.entries(catalog.subscriptions || {}))
    out[id] = {
      state: isArchived(p) ? 'archived' : p.deploymentColor === 'blue' ? 'internal' : 'published',
      source: 'subscriptions',
      rec: p,
    };
  for (const [id, p] of Object.entries(catalog.products || {}))
    out[id] = {
      state: isArchived(p) ? 'archived' : p.deploymentColor === 'blue' ? 'internal' : 'published',
      source: 'products',
      rec: p,
    };
  return out;
}

// ---- git history scan -------------------------------------------------------------------------

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

function scanGit() {
  if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true')
    throw new Error(
      'shallow clone: run git fetch --unshallow --filter=blob:none origin main first',
    );
  const log = git([
    'log',
    '--first-parent',
    '--reverse',
    '--format=%H%x09%ad%x09%s',
    '--date=short',
    'HEAD',
    '--',
    CATALOG_REL,
  ])
    .trim()
    .split('\n')
    .filter(Boolean);
  const ids = {};
  let prev = {};
  let skipped = 0;
  for (const line of log) {
    const [sha, date, ...rest] = line.split('\t');
    const subject = rest.join('\t');
    let cat;
    try {
      cat = JSON.parse(
        execFileSync('git', ['show', `${sha}:${CATALOG_REL}`], {
          cwd: ROOT,
          encoding: 'utf8',
          maxBuffer: 256 * 1024 * 1024,
          stdio: ['ignore', 'pipe', 'ignore'],
        }),
      );
    } catch {
      skipped++;
      continue;
    }
    const states = catalogueStates(cat);
    const now = Object.fromEntries(Object.entries(states).map(([id, v]) => [id, v.state]));
    for (const [id, v] of Object.entries(states))
      if (v.rec.name) (ids[id] ||= { events: [] }).name = v.rec.name;
    const ev = (id, state) =>
      (ids[id] ||= { events: [] }).events.push({
        state,
        commit: sha.slice(0, 9),
        date,
        subject: subject.slice(0, 160),
      });
    for (const [id, state] of Object.entries(now)) if (prev[id] !== state) ev(id, state);
    for (const id of Object.keys(prev)) if (!(id in now)) ev(id, 'removed');
    prev = now;
  }
  const head = git(['rev-parse', '--short=9', 'HEAD']).trim();
  const out = { scannedThrough: head, commitsScanned: log.length, commitsSkipped: skipped, ids };
  fs.mkdirSync(path.dirname(HISTORY), { recursive: true });
  fs.writeFileSync(HISTORY, JSON.stringify(out, null, 2) + '\n');
  console.log(
    `[product-lifecycle] scanned ${log.length} catalogue commits (${skipped} unparsable) — ${Object.keys(ids).length} IDs ever seen`,
  );
}

// ---- registry ---------------------------------------------------------------------------------

function pageOnlySlugs(catalog) {
  if (!fs.existsSync(PAGES_DIR)) return [];
  const blob = JSON.stringify(catalog).toLowerCase();
  const ids = new Set(
    ['products', 'subscriptions', 'discontinuedProducts'].flatMap((s) =>
      Object.keys(catalog[s] || {}).map((k) => k.toLowerCase()),
    ),
  );
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith('.html') && f !== 'index.html' && !/[.-](fi|sv|de|fr)\.html$/.test(f))
    .map((f) => f.replace(/\.html$/, ''))
    .filter(
      (slug) =>
        !ids.has(slug.toLowerCase()) &&
        !blob.includes(`products/${slug.toLowerCase()}.html`) &&
        !blob.includes(`/${slug.toLowerCase()}/`),
    )
    .sort();
}

export function buildLifecycle(catalog, ledger, history) {
  const cat = catalogueStates(catalog);
  const hist = history?.ids || {};
  const decisions = ledger?.decisions || [];
  const rows = new Map();
  const row = (id) => {
    if (!rows.has(id)) rows.set(id, { id, name: '', state: '', stateSource: '', evidence: [] });
    return rows.get(id);
  };

  for (const [id, v] of Object.entries(cat)) {
    const r = row(id);
    r.name = v.rec.name || '';
    r.state = v.state;
    r.stateSource = `catalogue ${v.source}`;
    const f = v.rec;
    const facts = [
      f.archivedDate && `archivedDate ${f.archivedDate}`,
      f.archivedReason && `archivedReason: ${f.archivedReason}`,
      f.supersededBy && `supersededBy ${f.supersededBy}`,
      f.discontinuedReason && `discontinuedReason: ${f.discontinuedReason}`,
    ].filter(Boolean);
    if (facts.length)
      r.evidence.push({
        kind: 'catalogue',
        date: f.archivedDate || '',
        ref: CATALOG_REL,
        text: facts.join('; '),
      });
  }
  for (const [id, h] of Object.entries(hist)) {
    const r = row(id);
    for (const e of h.events)
      r.evidence.push({
        kind: 'git',
        date: e.date,
        ref: e.commit,
        text: `${e.state}: ${e.subject}`,
      });
    if (!r.name && h.name) r.name = h.name;
    if (!r.state) {
      const last = h.events[h.events.length - 1];
      r.state = 'removed';
      r.stateSource = `git ${last.commit}`;
    }
  }
  // Product pages with no current catalogue ID: attach to the historical ID they belong to
  // (case-insensitive, _RETIRED suffix ignored); otherwise they are their own page-only row.
  const byLower = new Map([...rows.keys()].map((id) => [id.toLowerCase(), id]));
  for (const slug of pageOnlySlugs(catalog)) {
    const retiredPage = /_RETIRED$/.test(slug);
    const known = byLower.get(slug.replace(/_RETIRED$/, '').toLowerCase());
    const r = row(known || slug);
    r.evidence.push({
      kind: 'page',
      date: '',
      ref: `dws10.com/products/${slug}.html`,
      text: retiredPage
        ? 'page file carries the _RETIRED suffix'
        : known
          ? 'public page still live although the ID left the catalogue (drift)'
          : 'public page, no catalogue ID',
    });
    if (!r.state) {
      r.state = 'page-only';
      r.stateSource = `dws10.com/products/${slug}.html`;
    }
  }
  for (const d of decisions) {
    const r = row(d.id);
    r.evidence.push({
      kind: 'decision',
      date: d.date,
      ref: d.ref || '',
      text: `${d.state} — ${d.decidedBy}: ${d.quote || d.note || ''}`.trim(),
    });
    if (!r.name && d.name) r.name = d.name;
    if (!r.state) {
      r.state = d.state;
      r.stateSource = `ledger ${d.date}`;
    }
  }
  for (const r of rows.values())
    r.evidence.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const list = [...rows.values()].sort(
    (a, b) =>
      STATE_ORDER.indexOf(a.state) - STATE_ORDER.indexOf(b.state) || a.id.localeCompare(b.id),
  );
  const byState = Object.fromEntries(
    STATE_ORDER.map((s) => [s, list.filter((r) => r.state === s).length]),
  );
  const summary = {
    catalogVersion: catalog.priceVersion,
    gitScannedThrough: history?.scannedThrough || null,
    totalIds: list.length,
    catalogueIds: Object.keys(cat).length,
    byState,
    withoutEvidence: list.filter((r) => r.evidence.length === 0).length,
    hicDecisions: decisions.length,
  };
  return { summary, rows: list };
}

const cell = (s) =>
  String(s ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');

export function renderMarkdown({ summary: s, rows }) {
  const lines = [
    '# DWS Product Lifecycle Registry — every product ID, retired to planned',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${s.catalogVersion} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${s.catalogVersion} [Latest] | Tool: scripts/truth/product-lifecycle.mjs | Changes: Generated from ${CATALOG_REL} ${s.catalogVersion}, git history through ${s.gitScannedThrough} and the HIC decision ledger. Do not edit by hand; add decisions to config/truth/product-lifecycle-ledger.json and run the script.`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: ACTIVE',
    '- Canonical row: DWS_TRUTH_STANDARD.md §2 row 43',
    '- Planned store: Supabase (tables product_lifecycle + product_lifecycle_evidence); this file stays the review copy',
    '',
    '---',
    '',
    '## Lifecycle states',
    '',
    '| State | Meaning | IDs |',
    '| --- | --- | --- |',
    ...Object.entries(STATES).map(([k, v]) => `| ${k} | ${v} | ${s.byState[k]} |`),
    `| **All** | Every ID ever in the catalogue, planned, or with a public page | **${s.totalIds}** |`,
    '',
    `Catalogue IDs today: ${s.catalogueIds}. HIC decisions in the ledger: ${s.hicDecisions}. IDs without any evidence: ${s.withoutEvidence}.`,
    '',
    'Evidence kinds: **decision** = HIC decision from the ledger (quote + date); **git** = commit that changed the state in the catalogue (first-parent history); **catalogue** = archive/discontinue fields in the record; **page** = public product page with no catalogue ID.',
    '',
    '## Every ID',
    '',
    '| # | ID | Name | State | State source | Evidence (oldest first) |',
    '| --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (r, i) =>
        `| ${i + 1} | \`${cell(r.id)}\` | ${cell(r.name)} | ${r.state} | ${cell(r.stateSource)} | ${r.evidence
          .map((e) =>
            `${e.kind} ${e.date || ''} ${e.ref ? `\`${cell(e.ref)}\`` : ''} ${cell(e.text)}`
              .replace(/\s+/g, ' ')
              .trim(),
          )
          .join('<br>')} |`,
    ),
    '',
  ];
  return lines.join('\n');
}

function readJson(f, fallback) {
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fallback;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--scan-git')) {
    scanGit();
    if (args.length === 1) return;
  }
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const ledger = readJson(LEDGER, { decisions: [] });
  const history = readJson(HISTORY, null);
  const reg = buildLifecycle(catalog, ledger, history);
  const md = renderMarkdown(reg);
  const json = JSON.stringify(reg, null, 2) + '\n';
  if (args.includes('--check')) {
    const cur = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
    const problems = [];
    if (cur(OUT_MD) !== md || cur(OUT_JSON) !== json)
      problems.push('lifecycle registry is stale; run node scripts/truth/product-lifecycle.mjs');
    const noState = reg.rows.filter((r) => !r.state).map((r) => r.id);
    if (noState.length) problems.push(`IDs without lifecycle state: ${noState.join(', ')}`);
    const unknown = (ledger.decisions || []).filter((d) => !STATES[d.state]).map((d) => d.id);
    if (unknown.length) problems.push(`ledger decisions with unknown state: ${unknown.join(', ')}`);
    if (problems.length) {
      console.error(`[product-lifecycle] FAIL — ${problems.join('; ')}`);
      process.exitCode = 1;
      return;
    }
    console.log(`[product-lifecycle] OK — ${reg.summary.totalIds} IDs with lifecycle state`);
    return;
  }
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md);
  fs.writeFileSync(OUT_JSON, json);
  console.log(
    `[product-lifecycle] wrote ${path.relative(ROOT, OUT_MD)} — ${reg.summary.totalIds} IDs: ${JSON.stringify(reg.summary.byState)}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
