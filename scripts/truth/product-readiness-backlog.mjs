#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI Model=gpt-5.6-sol Agent=product-readiness-portfolio Date=27.09.2026
// Edited: Tool=Claude Code 2.1.283 Model=anthropic/claude Agent=claude Date=2026-09-27 — automation-depth per delivery family from config/truth/delivery-automation-evaluation.json; exemption basis cited
// Audit trail: git log -- scripts/truth/product-readiness-backlog.mjs
//
// HIC 27.09.2026: "generate a roadmap/backlog entry per product for anything not finished."
// Deterministic, generated-only backlog: every catalogue product appears exactly once, with
// (a) current-version facts already true today (never invented), and (b) proposed next-version
// backlog issues derived only from the presence/absence of fields already defined in the
// catalogue schema and DWS_CAPACITY_CLASS_STANDARD.md. Report-only: this file changes no
// publication or payment behavior and is never used to gate a build.
//
// Reads:
//   dws10.com/config/products.json
//   scripts/truth/product-fulfilment.mjs (buildFulfilment — capacity/contract-scope/payment status)
//   config/truth/delivery-automation-evaluation.json (per-delivery-family automation evaluation)
// Writes:
//   config/truth/product-readiness-backlog.json
//   docs/truth/PRODUCT_READINESS_BACKLOG.md
//
// Usage:
//   node scripts/truth/product-readiness-backlog.mjs          # write both files
//   node scripts/truth/product-readiness-backlog.mjs --check  # exit 1 if committed files are stale

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFulfilment, exemptBasis } from './product-fulfilment.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.join(ROOT, 'dws10.com/config/products.json');
const OUT_JSON = path.join(ROOT, 'config/truth/product-readiness-backlog.json');
const OUT_MD = path.join(ROOT, 'docs/truth/PRODUCT_READINESS_BACKLOG.md');
const EVALUATION = path.join(ROOT, 'config/truth/delivery-automation-evaluation.json');

// A SKU's automation-depth item is answered by its delivery family's evaluation only when the
// SKU also has everything the automated paid-order packet needs (src/services/fulfilment-packet.service.ts).
function packetComplete(p) {
  const f = p.fulfilment || {};
  const k = p.acceptanceKpi || {};
  return Boolean(
    f.owner && f.acknowledgementSla && f.deliveryMode && f.runbookRef && k.condition &&
      Array.isArray(k.requiredOutcomes) && k.requiredOutcomes.length &&
      Array.isArray(p.exclusions) && p.exclusions.length,
  );
}

function familyFor(p, evaluation) {
  const mode = p.fulfilment?.deliveryMode || '';
  return evaluation?.families.find((f) => mode.startsWith(f.match)) || null;
}

function currentVersionFacts(p, evaluation) {
  const facts = [];
  facts.push(`Priced: €${p.price ?? '—'} ${p.currency || ''} (${p.type || 'unspecified'}${p.priceUnit ? `, ${p.priceUnit}` : ''})`.trim());
  if (Array.isArray(p.features) && p.features.length) facts.push(`${p.features.length} documented feature(s)`);
  if (p.checkoutUrl) facts.push(`Managed delivery contract in force — checkout: ${p.checkoutUrl} (${p.checkoutMode})`);
  else if (p.revolutLink) facts.push('Self-serve checkout link present (revolutLink)');
  if (p.acceptanceKpi) facts.push('Binary acceptance KPI defined');
  if (p.exclusions) facts.push('Contractual exclusions defined');
  if (p.fulfilment) facts.push(`Fulfilment owner: ${p.fulfilment.owner}, acknowledged within ${p.fulfilment.acknowledgementSla} via ${p.fulfilment.route}`);
  if (p.capacityClass) facts.push(`Capacity class: ${p.capacityClass}`);
  const basis = exemptBasis(p);
  if (basis) facts.push(`Capacity-class exempt (${basis.label}, DWS_CAPACITY_CLASS_STANDARD.md ${basis.section})`);
  if (p.detailsUrl) facts.push(`Detail page: ${p.detailsUrl}`);
  const family = familyFor(p, evaluation);
  if (family && packetComplete(p)) {
    facts.push(`Delivery automation evaluated (${family.family}, ${evaluation.evaluatedAt}): paid-order intake, verification, buyer acceptance/exclusions and operations checklist automated; delivery itself stays managed`);
  }
  return facts;
}

// Issue IDs are stable and deterministic (PRB-<id>-NN) so they can be filed as GitHub issues
// 1:1 without renumbering later. `category` groups issues that share a remediation owner/type;
// `versionBucket` is always "next" (proposed future work) — this generator never invents a
// version number, it only labels current (true today) vs next (proposed).
function nextVersionIssues(id, p, fRow, evaluation) {
  const issues = [];
  let n = 0;
  const push = (category, title) => {
    n += 1;
    issues.push({ issueId: `PRB-${id}-${String(n).padStart(2, '0')}`, category, versionBucket: 'next', title });
  };
  if (fRow.contractScope.status !== 'complete') {
    push('contract-scope', `Define contractual scope for ${id}: exclusions and an acceptance boundary (${fRow.contractScope.reason}).`);
  }
  if (fRow.capacity.status === 'gap') {
    push('capacity-evidence', `Document a capacity profile for ${id} in DWS_CAPACITY_CLASS_STANDARD.md before any public capacity claim (${fRow.capacity.reason}).`);
  }
  if (fRow.paymentRoute.mode === 'undetermined') {
    push('payment-route', `Confirm and record a real payment or quote route for ${id} (owner action — do not fabricate a link).`);
  }
  if (!p.features || p.features.length < 3) {
    push('content-depth', `Expand feature/spec detail for ${id} (currently ${p.features?.length || 0} feature line(s)) so the product page and price list describe a complete offer.`);
  }
  if (p.fulfilment?.deliveryMode && !(familyFor(p, evaluation) && packetComplete(p))) {
    push('automation-depth', `Evaluate automating part of the managed-delivery process for ${id} (today: ${p.fulfilment.deliveryMode.split(':')[0].trim().toLowerCase()}) once volume justifies it.`);
  }
  return issues;
}

// One follow-up per delivery family instead of one per SKU: the remaining automation work is shared
// by every SKU in the family, so filing it 138 times would count the same work repeatedly.
function familyIssues(catalog, evaluation) {
  if (!evaluation) return [];
  const issues = [];
  for (const fam of evaluation.families) {
    const skus = Object.entries(catalog.products || {})
      .filter(([, p]) => familyFor(p, evaluation) === fam && packetComplete(p))
      .map(([id]) => id)
      .sort();
    if (!skus.length) continue;
    const t = fam.volumeTrigger;
    const trigger = t.threshold == null ? `${t.metric} reaches a threshold the HIC has not set yet` : `${t.metric} reaches ${t.threshold}`;
    issues.push({
      issueId: `PRB-FAMILY-${fam.family}`,
      category: 'automation-depth',
      versionBucket: 'next',
      title: `${fam.nextCandidate} Trigger: ${trigger}. Covers ${skus.length} SKU(s).`,
      skus,
    });
  }
  return issues;
}

export function buildBacklog(catalog, evaluation = loadEvaluation()) {
  const { rows: fRows } = buildFulfilment(catalog);
  const fById = new Map(fRows.map((r) => [r.id, r]));
  const entries = [];
  for (const [id, p] of Object.entries(catalog.products || {})) {
    const fRow = fById.get(id);
    entries.push({
      id,
      name: p.name || '',
      chapter: fRow?.chapter || 'UNMAPPED',
      currentVersion: p.version || '1.0',
      lifecycle: fRow?.lifecycle || 'public',
      versionBuckets: {
        current: currentVersionFacts(p, evaluation),
        next: nextVersionIssues(id, p, fRow, evaluation),
      },
      backlogRef: `RB-${id}`,
    });
  }
  entries.sort((a, b) => a.id.localeCompare(b.id));
  const families = familyIssues(catalog, evaluation);
  const byCategory = {};
  for (const iss of [...entries.flatMap((e) => e.versionBuckets.next), ...families]) {
    byCategory[iss.category] = (byCategory[iss.category] || 0) + 1;
  }
  const summary = {
    catalogVersion: catalog.priceVersion,
    totalProducts: entries.length,
    withOpenIssues: entries.filter((e) => e.versionBuckets.next.length > 0).length,
    fullyClosed: entries.filter((e) => e.versionBuckets.next.length === 0).length,
    totalOpenIssues: entries.reduce((n, e) => n + e.versionBuckets.next.length, 0) + families.length,
    openIssuesByCategory: byCategory,
  };
  return { summary, entries, familyIssues: families };
}

function loadEvaluation() {
  return fs.existsSync(EVALUATION) ? JSON.parse(fs.readFileSync(EVALUATION, 'utf8')) : null;
}

export function renderMarkdown({ summary: s, entries, familyIssues: families = [] }) {
  const lines = [
    '# DWS Product Readiness Roadmap & Backlog — every SKU, exactly once',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${s.catalogVersion} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${s.catalogVersion} [Latest] | Tool: scripts/truth/product-readiness-backlog.mjs | Changes: Generated from dws10.com/config/products.json catalogue ${s.catalogVersion}. Do not edit by hand; run the script. HIC 27.09.2026: "generate a roadmap/backlog entry per product for anything not finished" — report-only, never gates a sale.`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: ACTIVE (internal backlog — no public-facing behavior change)',
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Measure | Count |',
    '| --- | --- |',
    `| Total catalogue products | ${s.totalProducts} |`,
    `| Products with open next-version issues | ${s.withOpenIssues} |`,
    `| Products with no per-SKU open issues today | ${s.fullyClosed} |`,
    `| Delivery-family automation follow-ups (shared, not per SKU) | ${families.length} |`,
    `| Total open backlog issues | ${s.totalOpenIssues} |`,
    '',
    '| Next-version issue category | Open count |',
    '| --- | --- |',
    ...Object.entries(s.openIssuesByCategory).sort((a, b) => a[0].localeCompare(b[0])).map(
      ([cat, n]) => `| ${cat} | ${n} |`,
    ),
    '',
    'Every product below carries a **current** version bucket (facts already true today, from the',
    'catalogue) and a **next** version bucket (proposed backlog issues — gaps only, never fabricated',
    'claims). Each next-version issue has a stable `issueId` (e.g. `PRB-<SKU>-01`) suitable for filing',
    'as a GitHub issue 1:1, with a `category` for grouping by remediation owner/type. Full',
    'fulfilment/capacity classification: `docs/truth/PRODUCT_FULFILMENT.md`.',
    '',
    '## Delivery-family automation follow-ups',
    '',
    'Automation-depth work shared by every SKU in a delivery family, filed once per family.',
    'Evaluation and evidence: `config/truth/delivery-automation-evaluation.json`.',
    '',
    ...(families.length
      ? families.map((iss) => `- [ ] \`${iss.issueId}\` (${iss.category}) ${iss.title}`)
      : ['- None.']),
    '',
    '## Every product',
    '',
  ];
  for (const e of entries) {
    lines.push(`### ${e.backlogRef.toLowerCase()}`, '');
    lines.push(`**${e.id} — ${e.name}** · ${e.chapter} · catalogue version ${e.currentVersion} · ${e.lifecycle}`, '');
    lines.push('Version bucket: current — implemented facts:', '');
    if (e.versionBuckets.current.length) {
      for (const f of e.versionBuckets.current) lines.push(`- ${f}`);
    } else {
      lines.push('- (no facts recorded)');
    }
    lines.push('');
    lines.push('Version bucket: next — proposed backlog issues:', '');
    if (e.versionBuckets.next.length) {
      for (const iss of e.versionBuckets.next) lines.push(`- [ ] \`${iss.issueId}\` (${iss.category}) ${iss.title}`);
    } else {
      lines.push('- None open today.');
    }
    lines.push('');
  }
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const built = buildBacklog(catalog);
  const md = renderMarkdown(built);
  const json = JSON.stringify(built, null, 2) + '\n';
  if (args.includes('--json')) {
    console.log(JSON.stringify(built.summary, null, 2));
    return;
  }
  if (args.includes('--check')) {
    const cur = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
    const stale = cur(OUT_MD) !== md || cur(OUT_JSON) !== json;
    if (stale) {
      console.error('[product-readiness-backlog] FAIL — stale; run node scripts/truth/product-readiness-backlog.mjs');
      process.exitCode = 1;
      return;
    }
    console.log(`[product-readiness-backlog] OK — ${built.summary.totalProducts} entries, ${built.summary.totalOpenIssues} open issues`);
    return;
  }
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_MD, md);
  fs.writeFileSync(OUT_JSON, json);
  console.log(
    `[product-readiness-backlog] wrote ${path.relative(ROOT, OUT_MD)} — ${built.summary.totalProducts} entries, ${built.summary.totalOpenIssues} open issues`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
