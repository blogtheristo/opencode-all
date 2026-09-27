#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=price-list-a5-campaign Date=2026-09-25
// Audit trail: git log -- scripts/truth/product-registry.mjs
//
// Product registry for DWS_TRUTH_STANDARD.md row 42 (HIC 25.09.2026: "write every product to
// truth standard"). Lists every catalogue ID in dws10.com/config/products.json — products,
// subscription-only records and discontinued records — with its status and whether it is on the
// public /price-list/, and why not when it is not. Counts must reconcile, so the gap between the
// catalogue size and the price-list row count is always explained, never silent drift.
//
// Usage:
//   node scripts/truth/product-registry.mjs          # write docs/truth/PRODUCT_REGISTRY.md + config/truth/product-registry.json
//   node scripts/truth/product-registry.mjs --check  # exit 1 if the committed files are stale
//   node scripts/truth/product-registry.mjs --json   # print the summary

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildValuation } from './product-valuation.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.join(ROOT, 'dws10.com/config/products.json');
const OUT_MD = path.join(ROOT, 'docs/truth/PRODUCT_REGISTRY.md');
const OUT_JSON = path.join(ROOT, 'config/truth/product-registry.json');

const isArchived = (p) => p?.archived === true || p?.productType === 'archived';
const isBlue = (p) => p?.deploymentColor === 'blue';

// Price-list product group — same rules as commercialLayer() in dws10.com/price-list/index.html.
function productGroup(id, p, independent) {
  const tags = Array.isArray(p.tags) ? p.tags : [];
  if (tags.includes('SME')) return 'SME';
  if (tags.includes('DWS IQ')) return 'DWS IQ';
  if (tags.includes('Firehorse')) return 'Firehorse';
  if (independent.has(id)) return 'Data';
  if (
    p.storeCategory === 'advisory' ||
    p.storeCategory === 'ai-cloud' ||
    id === 'LF-TRAIN-IND' ||
    id === 'LF-ONTOLOGY-PILOT'
  )
    return 'Services';
  if (
    p.storeCategory === 'hardware' ||
    /^(LF-K8S|LF-DOCA|LF-NIM|LF-GOV|LF-IPC|LF-FIPS|LF-CINCOZE|LF-SOV)/.test(id)
  )
    return 'Hardware';
  return 'Other';
}

// TAM per product (HIC 25.09.2026) from the valuation model: config/truth/product-valuation-model.json.
function tamById(catalog) {
  const f = path.join(ROOT, 'config/truth/product-valuation-model.json');
  if (!fs.existsSync(f)) return {};
  const v = buildValuation(catalog, JSON.parse(fs.readFileSync(f, 'utf8')));
  return Object.fromEntries(v.rows.map((r) => [r.id, r.tamEurPerYear]));
}

export function buildRegistry(catalog) {
  const tam = tamById(catalog);
  const products = catalog.products || {};
  const subs = catalog.subscriptions || {};
  const discontinued = catalog.discontinuedProducts || {};
  const cp = catalog.commercialPortfolio || {};
  const serious = new Set(cp.seriousProductIds || []);
  const independent = new Set(cp.independentProductIds || []);
  const sme = new Set(cp.smeCampaignProductIds || []);

  const rows = [];
  for (const [id, p] of Object.entries(products)) {
    let status;
    let onPriceList = false;
    let reason = '';
    if (isArchived(p)) {
      status = 'archived';
      reason = p.supersededBy ? `archived; superseded by ${p.supersededBy}` : 'archived';
    } else if (isBlue(p)) {
      status = 'blue';
      reason = 'BLUE: internal or pilot record, needs internal sign-off before quoting';
    } else {
      status = 'public';
      onPriceList = true;
    }
    const cls = sme.has(id)
      ? 'sme-campaign'
      : independent.has(id)
        ? 'independent'
        : serious.has(id)
          ? 'serious'
          : '—';
    rows.push({
      id,
      source: 'products',
      name: p.name || '',
      price: p.price ?? null,
      status,
      class: cls,
      group: onPriceList ? productGroup(id, p, independent) : '—',
      onPriceList,
      reason,
    });
  }
  for (const [id, s] of Object.entries(subs)) {
    if (products[id]) continue; // same record already listed from products
    const archived = isArchived(s);
    rows.push({
      id,
      source: 'subscriptions',
      name: s.name || '',
      price: s.price ?? null,
      status: archived ? 'archived' : 'subscription',
      class: independent.has(id) ? 'independent' : archived ? '—' : 'subscription',
      group: archived ? '—' : productGroup(id, s, independent),
      onPriceList: !archived,
      reason: archived ? 'archived subscription record' : '',
    });
  }
  for (const [id, p] of Object.entries(discontinued)) {
    rows.push({
      id,
      source: 'discontinuedProducts',
      name: p.name || '',
      price: p.price ?? null,
      status: 'discontinued',
      class: '—',
      group: '—',
      onPriceList: false,
      reason: 'discontinued',
    });
  }
  for (const r of rows) r.tam = tam[r.id] ?? null;
  const order = { public: 0, subscription: 1, blue: 2, archived: 3, discontinued: 4 };
  rows.sort((a, b) => order[a.status] - order[b.status] || a.id.localeCompare(b.id));

  const count = (f) => rows.filter(f).length;
  const summary = {
    catalogVersion: catalog.priceVersion,
    totalIds: rows.length,
    productsRecords: Object.keys(products).length,
    subscriptionOnlyRecords: count((r) => r.source === 'subscriptions'),
    discontinuedRecords: count((r) => r.source === 'discontinuedProducts'),
    onPriceList: count((r) => r.onPriceList),
    publicProducts: count((r) => r.status === 'public'),
    activeSubscriptions: count((r) => r.status === 'subscription'),
    blue: count((r) => r.status === 'blue'),
    archived: count((r) => r.status === 'archived'),
    discontinued: count((r) => r.status === 'discontinued'),
    smeCampaign: count((r) => r.class === 'sme-campaign'),
    serious: count((r) => r.class === 'serious' || r.class === 'sme-campaign'),
    groups: Object.fromEntries(
      ['SME', 'DWS IQ', 'Firehorse', 'Data', 'Services', 'Hardware', 'Other'].map((g) => [
        g,
        count((r) => r.onPriceList && r.group === g),
      ]),
    ),
    expectedPriceListProducts: cp.surfaces?.priceList?.expectedProductCount ?? null,
  };
  summary.reconciles =
    summary.onPriceList + summary.blue + summary.archived + summary.discontinued ===
      summary.totalIds && summary.publicProducts === summary.expectedPriceListProducts;
  return { summary, rows };
}

const eur = (v) => (v === null || v === undefined ? '—' : `€${Number(v).toLocaleString('en-GB')}`);
const cell = (s) => String(s).replace(/\|/g, '\\|');

export function renderMarkdown({ summary: s, rows }) {
  const lines = [
    '# DWS Product Registry — every catalogue ID',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${s.catalogVersion} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${s.catalogVersion} [Latest] | Tool: scripts/truth/product-registry.mjs | Changes: Generated from dws10.com/config/products.json catalogue ${s.catalogVersion}. Do not edit by hand; run the script.`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: ACTIVE',
    '- Canonical row: DWS_TRUTH_STANDARD.md §2 row 42',
    '',
    '---',
    '',
    '## Summary',
    '',
    '| Measure | Count |',
    '| --- | --- |',
    `| All catalogue IDs (products + subscription-only + discontinued) | ${s.totalIds} |`,
    `| — records in \`products\` | ${s.productsRecords} |`,
    `| — subscription-only records | ${s.subscriptionOnlyRecords} |`,
    `| — discontinued records | ${s.discontinuedRecords} |`,
    `| **On the public price list** | **${s.onPriceList}** |`,
    `| — public products (non-BLUE, non-archived) | ${s.publicProducts} |`,
    `| — active subscriptions | ${s.activeSubscriptions} |`,
    ...Object.entries(s.groups).map(([g, n]) => `| — price-list group ${g} | ${n} |`),
    `| Not on the price list: BLUE (internal / pilot) | ${s.blue} |`,
    `| Not on the price list: archived | ${s.archived} |`,
    `| Not on the price list: discontinued | ${s.discontinued} |`,
    `| Reconciles (on list + BLUE + archived + discontinued = all; public = expected ${s.expectedPriceListProducts}) | ${s.reconciles ? 'yes' : '**NO**'} |`,
    '',
    'TAM / yr is a model estimate per public offer (`config/truth/product-valuation-model.json`); method, segments and value per offer: `docs/truth/PRODUCT_VALUATION.md` (TRUTH row 45).',
    '',
    '## Every ID',
    '',
    '| # | ID | Name | Price | Status | Class | Group | On price list | TAM / yr (model) | Why not |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (r, i) =>
        `| ${i + 1} | \`${cell(r.id)}\` | ${cell(r.name)} | ${eur(r.price)} | ${r.status} | ${r.class} | ${r.group} | ${r.onPriceList ? 'yes' : 'no'} | ${r.tam == null ? '—' : `€${(r.tam / 1e6).toFixed(2)}M`} | ${cell(r.reason)} |`,
    ),
    '',
  ];
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const reg = buildRegistry(catalog);
  const md = renderMarkdown(reg);
  const json = JSON.stringify(reg.summary, null, 2) + '\n';
  if (args.includes('--json')) {
    console.log(json);
    return;
  }
  if (args.includes('--check')) {
    const cur = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
    const stale = cur(OUT_MD) !== md || cur(OUT_JSON) !== json;
    if (stale || !reg.summary.reconciles) {
      console.error(
        `[product-registry] FAIL — ${stale ? 'registry is stale; run node scripts/truth/product-registry.mjs' : ''}${!reg.summary.reconciles ? ' counts do not reconcile' : ''}`,
      );
      process.exitCode = 1;
      return;
    }
    console.log(
      `[product-registry] OK — ${reg.summary.totalIds} IDs, ${reg.summary.onPriceList} on the price list`,
    );
    return;
  }
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_MD, md);
  fs.writeFileSync(OUT_JSON, json);
  console.log(
    `[product-registry] wrote ${path.relative(ROOT, OUT_MD)} — ${reg.summary.totalIds} IDs, ${reg.summary.onPriceList} on the price list, reconciles=${reg.summary.reconciles}`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
