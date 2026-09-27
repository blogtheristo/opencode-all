#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI Model=gpt-5.6-sol Agent=product-readiness-portfolio Date=27.09.2026
// Audit trail: git log -- scripts/truth/product-fulfilment.mjs
//
// HIC 27.09.2026: "go through ALL 138 product records... keep all current selling surfaces
// live... add factual delivery implementation data... never fabricate external payment links or
// claims." This script computes a per-SKU, additive, generated-only classification: which
// implementation chapter/capability family owns it, the legal seller of record, the payment/quote
// route as observably encoded in dws10.com/config/products.json today (never invented), and which
// capacity/contract-scope evidence gates are open. It never gates, hides or blocks a sale — it
// only reports. Nothing here changes what is public or payable.
//
// Reads:
//   dws10.com/config/products.json                        (catalogue — unchanged by this script)
//   config/truth/product-capability-chapters.json          (chapter->SKU map, transcribed from
//                                                            docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md)
// Writes:
//   config/truth/product-fulfilment.json
//   docs/truth/PRODUCT_FULFILMENT.md
//
// Usage:
//   node scripts/truth/product-fulfilment.mjs          # write both files
//   node scripts/truth/product-fulfilment.mjs --check  # exit 1 if committed files are stale
//   node scripts/truth/product-fulfilment.mjs --json   # print summary only

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.join(ROOT, 'dws10.com/config/products.json');
const CHAPTER_MAP = path.join(ROOT, 'config/truth/product-capability-chapters.json');
const OUT_JSON = path.join(ROOT, 'config/truth/product-fulfilment.json');
const OUT_MD = path.join(ROOT, 'docs/truth/PRODUCT_FULFILMENT.md');

const isArchived = (p) => p?.archived === true || p?.productType === 'archived';
const isBlue = (p) => p?.deploymentColor === 'blue';

// DWS_CAPACITY_CLASS_STANDARD.md §5 — the capacity-evidence section that already covers a SKU,
// referenced (not duplicated) so evidence stays single-sourced.
const CAPACITY_STANDARD_SECTION = {
  'DWS-IQ-006': '§5.1', 'DWS-US-STARTER': '§5.2', 'DWS-US-PILOT': '§5.2',
  'DWS-EU-STARTER': '§5.2', 'DWS-EU-PILOT': '§5.2', 'DWS-AEGIS-001': '§5.3',
  'LF-K8S-T1': '§5.4', 'LF-K8S-T2': '§5.4', 'LF-K8S-T3': '§5.4', 'LF-K8S-T4': '§5.4',
  'LF-NIM-RETRIEVAL': '§5.5', 'LF-NIM-CODE': '§5.5', 'LF-NIM-BIOLOGY': '§5.5',
  'LF-DOCA-SECURITY': '§5.6', 'LF-DOCA-NETWORK-STORAGE': '§5.6',
  'LF-GOV-READY-SETUP': '§5.7', 'LF-GOV-READY-ANNUAL': '§5.7', 'LF-GOV-AIRGAP-BUNDLE': '§5.7',
  'LF-DGX-SPARK': '§5.8', 'LF-IGX-ORIN': '§5.8', 'LF-JETSON-NANO': '§5.8',
  'LF-JETSON-NX': '§5.8', 'LF-JETSON-AGX': '§5.8', 'LF-SITROOM-001': '§5.8',
  'LF-IPCMAX-IPC409': '§5.9', 'LF-IPCMAX-IPCP68': '§5.9', 'LF-IPCMAX-CINCOZE-DA1200': '§5.9',
};

function loadChapterIndex() {
  const map = JSON.parse(fs.readFileSync(CHAPTER_MAP, 'utf8'));
  const index = new Map();
  for (const c of map.chapters) {
    for (const sku of c.skus) index.set(sku, { chapter: c.chapter, capabilityFamily: c.title });
  }
  return index;
}

// Payment/quote route: derived ONLY from fields already present in the catalogue. Never invents a
// link, inbox or contact name. Three observable states, nothing more claimed than the data shows.
function paymentRoute(p) {
  // Tranche 2: every product now carries a working checkoutUrl (verified against
  // dws10.com/checkout/index.html, which resolves any catalogue id via a generic
  // Revolut/PayPal fallback even without a dedicated revolutLink). This closes the
  // payment-route gap for all 138 products; the mode still records HOW checkout is
  // backed (dedicated link vs generic fallback) for transparency.
  if (p.checkoutUrl && p.checkoutMode === 'self-serve-dedicated') {
    return { mode: 'self-serve-checkout', evidence: `checkoutUrl ${p.checkoutUrl} backed by dedicated revolutLink` };
  }
  if (p.checkoutUrl && p.checkoutMode === 'self-serve-fallback') {
    return { mode: 'self-serve-checkout-fallback', evidence: `checkoutUrl ${p.checkoutUrl} backed by generic /checkout/ Revolut/PayPal fallback (no dedicated revolutLink)` };
  }
  if (p.revolutLink) return { mode: 'self-serve-checkout', evidence: 'revolutLink present in catalogue' };
  if (typeof p.detailsUrl === 'string' && p.detailsUrl.includes('dws10.com/contact/')) {
    return { mode: 'contact-route', evidence: `detailsUrl routes to ${p.detailsUrl}` };
  }
  if (typeof p.detailsUrl === 'string' && p.detailsUrl.endsWith('.html')) {
    return { mode: 'product-page-quote', evidence: `product detail page exists (${p.detailsUrl}); no self-serve checkout link recorded` };
  }
  return { mode: 'undetermined', evidence: 'no revolutLink and no resolvable detailsUrl' };
}

function capacityStatus(p) {
  if (p.capacityExempt === true) return { status: 'exempt', reason: 'storeCategory advisory — DWS_CAPACITY_CLASS_STANDARD.md §5.11' };
  const fields = ['capacityClass', 'capacityOptions', 'capacityCapabilities', 'capacityLimits'];
  const missing = fields.filter((f) => !p[f]);
  if (missing.length === 0) return { status: 'complete', reason: '' };
  return { status: 'gap', reason: `missing: ${missing.join(', ')}` };
}

function contractScopeStatus(p) {
  if (p.exclusions && p.acceptanceKpi) return { status: 'complete', reason: '' };
  if (p.exclusions || p.acceptanceKpi) return { status: 'partial', reason: p.exclusions ? 'has exclusions, no acceptanceKpi' : 'has acceptanceKpi, no exclusions' };
  return { status: 'gap', reason: 'no exclusions and no acceptanceKpi recorded' };
}

export function buildFulfilment(catalog) {
  const chapterIndex = loadChapterIndex();
  const rows = [];
  for (const [id, p] of Object.entries(catalog.products || {})) {
    const chapterInfo = chapterIndex.get(id);
    if (!chapterInfo) {
      rows.push({
        id, name: p.name || '', chapter: 'UNMAPPED', capabilityFamily: 'UNMAPPED',
        owner: 'Lifetime Oy', lifecycle: isArchived(p) ? 'archived' : isBlue(p) ? 'blue' : 'public',
        paymentRoute: paymentRoute(p), capacity: capacityStatus(p), contractScope: contractScopeStatus(p),
        evidenceRefs: [], backlogRef: `RB-${id}`,
      });
      continue;
    }
    const evidenceRefs = ['docs/truth/PRODUCT_REGISTRY.md'];
    if (CAPACITY_STANDARD_SECTION[id]) {
      evidenceRefs.push(`DWS_CAPACITY_CLASS_STANDARD.md ${CAPACITY_STANDARD_SECTION[id]}`);
    } else if (p.capacityExempt) {
      evidenceRefs.push('DWS_CAPACITY_CLASS_STANDARD.md §5.11');
    }
    if (p.acceptanceKpi) evidenceRefs.push(`${id} acceptanceKpi (catalogue)`);
    rows.push({
      id,
      name: p.name || '',
      chapter: chapterInfo.chapter,
      capabilityFamily: chapterInfo.capabilityFamily,
      owner: 'Lifetime Oy', // legal seller of record for every catalogue product (Y-tunnus 0772407-9)
      lifecycle: isArchived(p) ? 'archived' : isBlue(p) ? 'blue' : 'public',
      paymentRoute: paymentRoute(p),
      capacity: capacityStatus(p),
      contractScope: contractScopeStatus(p),
      evidenceRefs,
      backlogRef: `RB-${id}`,
    });
  }
  rows.sort((a, b) => a.id.localeCompare(b.id));

  const count = (f) => rows.filter(f).length;
  const summary = {
    catalogVersion: catalog.priceVersion,
    totalProducts: rows.length,
    unmapped: count((r) => r.chapter === 'UNMAPPED'),
    byPaymentRoute: {
      'self-serve-checkout': count((r) => r.paymentRoute.mode === 'self-serve-checkout'),
      'self-serve-checkout-fallback': count((r) => r.paymentRoute.mode === 'self-serve-checkout-fallback'),
      'contact-route': count((r) => r.paymentRoute.mode === 'contact-route'),
      'product-page-quote': count((r) => r.paymentRoute.mode === 'product-page-quote'),
      undetermined: count((r) => r.paymentRoute.mode === 'undetermined'),
    },
    byCapacity: {
      exempt: count((r) => r.capacity.status === 'exempt'),
      complete: count((r) => r.capacity.status === 'complete'),
      gap: count((r) => r.capacity.status === 'gap'),
    },
    byContractScope: {
      complete: count((r) => r.contractScope.status === 'complete'),
      partial: count((r) => r.contractScope.status === 'partial'),
      gap: count((r) => r.contractScope.status === 'gap'),
    },
    byChapter: {},
  };
  for (const r of rows) {
    summary.byChapter[r.chapter] = (summary.byChapter[r.chapter] || 0) + 1;
  }
  summary.reconciles = summary.totalProducts === Object.keys(catalog.products || {}).length && summary.unmapped === 0;
  return { summary, rows };
}

export function renderMarkdown({ summary: s, rows }) {
  const lines = [
    '# DWS Product Fulfilment & Readiness Classification',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${s.catalogVersion} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${s.catalogVersion} [Latest] | Tool: scripts/truth/product-fulfilment.mjs | Changes: Generated from dws10.com/config/products.json catalogue ${s.catalogVersion} and config/truth/product-capability-chapters.json (chapter map transcribed from docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md). Do not edit by hand; run the script. HIC 27.09.2026: report-only — never gates, hides or blocks a sale.`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: ACTIVE (internal — reporting only, no public-facing behavior change)',
    '',
    '---',
    '',
    '## Purpose',
    '',
    'HIC 27.09.2026: "go through ALL 138 product records; keep all current selling surfaces live; make',
    'each product payable/deliverable by adding factual delivery implementation data... never',
    'fabricate external payment links or claims." This report classifies every catalogue product by',
    'shared capability family (the implementation chapter that owns its runtime — never 138',
    'independent stacks), records the legal seller of record, and states the payment/quote route and',
    'capacity/contract-scope evidence status exactly as encoded in the catalogue today. **This report',
    'changes no publication or payment behavior.** It is read by `scripts/validate-product-publication.mjs`',
    'only to print warnings, never to fail the build.',
    '',
    '## Summary',
    '',
    '| Measure | Count |',
    '| --- | --- |',
    `| Total catalogue products classified | ${s.totalProducts} |`,
    `| Unmapped (must be 0) | ${s.unmapped} |`,
    `| Reconciles (every product mapped to exactly one chapter) | ${s.reconciles ? 'yes' : '**NO**'} |`,
    `| Payment route: self-serve checkout (revolutLink present) | ${s.byPaymentRoute['self-serve-checkout']} |`,
    `| Payment route: named contact route | ${s.byPaymentRoute['contact-route']} |`,
    `| Payment route: product-page quote (page exists, no self-serve link yet) | ${s.byPaymentRoute['product-page-quote']} |`,
    `| Payment route: undetermined | ${s.byPaymentRoute.undetermined} |`,
    `| Capacity evidence: exempt (advisory, §5.11) | ${s.byCapacity.exempt} |`,
    `| Capacity evidence: complete | ${s.byCapacity.complete} |`,
    `| Capacity evidence: gap (backlog) | ${s.byCapacity.gap} |`,
    `| Contract scope: complete (exclusions + acceptanceKpi) | ${s.byContractScope.complete} |`,
    `| Contract scope: partial | ${s.byContractScope.partial} |`,
    `| Contract scope: gap (backlog) | ${s.byContractScope.gap} |`,
    '',
    '## By capability family (implementation chapter)',
    '',
    '| Chapter | Products |',
    '| --- | --- |',
    ...Object.entries(s.byChapter)
      .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
      .map(([ch, n]) => `| ${ch} | ${n} |`),
    '',
    '## Every product',
    '',
    '| # | ID | Chapter | Owner | Payment route | Capacity | Contract scope | Backlog |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (r, i) =>
        `| ${i + 1} | \`${r.id}\` | ${r.chapter} | ${r.owner} | ${r.paymentRoute.mode} | ${r.capacity.status} | ${r.contractScope.status} | [${r.backlogRef}](./PRODUCT_READINESS_BACKLOG.md#${r.backlogRef.toLowerCase()}) |`,
    ),
    '',
  ];
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const built = buildFulfilment(catalog);
  const md = renderMarkdown(built);
  const json = JSON.stringify(built, null, 2) + '\n';
  if (args.includes('--json')) {
    console.log(JSON.stringify(built.summary, null, 2));
    return;
  }
  if (args.includes('--check')) {
    const cur = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
    const stale = cur(OUT_MD) !== md || cur(OUT_JSON) !== json;
    if (stale || !built.summary.reconciles) {
      console.error(
        `[product-fulfilment] FAIL — ${stale ? 'stale; run node scripts/truth/product-fulfilment.mjs. ' : ''}${!built.summary.reconciles ? 'chapter map does not reconcile with catalogue.' : ''}`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(`[product-fulfilment] OK — ${built.summary.totalProducts} products classified, 0 unmapped`);
    return;
  }
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_MD, md);
  fs.writeFileSync(OUT_JSON, json);
  console.log(
    `[product-fulfilment] wrote ${path.relative(ROOT, OUT_MD)} — ${built.summary.totalProducts} products, reconciles=${built.summary.reconciles}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
