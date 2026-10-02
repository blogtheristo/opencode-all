#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI Model=gpt-5.6-sol Agent=product-readiness-portfolio Date=27.09.2026
// Audit trail: git log -- scripts/truth/generate-firehorse-store-preview-data.mjs
//
// HIC 27.09.2026 (tranche 2, part B): "Replace/upgrade dws6.com/dashboard/firehorse/store-preview.html
// ... so it dynamically renders the 9 Chapter 5 products from the canonical dws10.com products
// JSON, with current prices/descriptions/features, direct checkout CTA and details CTA."
//
// dws6.com and dws10.com are different origins with no confirmed CORS allowance on
// dws10.com/config/products.json, so store-preview.html cannot safely fetch it cross-origin.
// This generator produces a same-origin, byte-deterministic MIRROR of just the 9 Chapter 5
// (Firehorse applications) records, written under dws6.com/dashboard/firehorse/ itself. It is
// never hand-edited — re-run after any catalogue change, exactly like the dual-folder mirrors
// elsewhere in this repo.
//
// Reads:
//   dws10.com/config/products.json
//   config/truth/product-capability-chapters.json
// Writes:
//   dws6.com/dashboard/firehorse/firehorse-chapter5-products.json
//   landing-pages/dws6-com/dashboard/firehorse/firehorse-chapter5-products.json
//
// Usage:
//   node scripts/truth/generate-firehorse-store-preview-data.mjs          # write both copies
//   node scripts/truth/generate-firehorse-store-preview-data.mjs --check  # exit 1 if stale

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.join(ROOT, 'dws10.com/config/products.json');
const CHAPTERS_PATH = path.join(ROOT, 'config/truth/product-capability-chapters.json');
export const OUT_PATHS = [
  path.join(ROOT, 'dws6.com/dashboard/firehorse/firehorse-chapter5-products.json'),
  path.join(ROOT, 'landing-pages/dws6-com/dashboard/firehorse/firehorse-chapter5-products.json'),
];

const FIELDS = [
  'id', 'name', 'caption', 'price', 'currency', 'priceUnit', 'priceNote', 'description',
  'features', 'checkoutUrl', 'detailsUrl', 'exclusions', 'acceptanceKpi', 'fulfilment',
  'storeCategory',
];

export function build() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const chaptersDoc = JSON.parse(fs.readFileSync(CHAPTERS_PATH, 'utf8'));
  const chapter5 = chaptersDoc.chapters.find((c) => c.chapter === 'Chapter 5');
  if (!chapter5) throw new Error('Chapter 5 (Firehorse applications) not found in chapter map');

  const missing = [];
  const products = [];
  for (const sku of chapter5.skus) {
    const p = catalog.products[sku];
    if (!p) {
      missing.push(sku);
      continue;
    }
    const record = { id: sku };
    for (const f of FIELDS) {
      if (f === 'id') continue;
      if (p[f] !== undefined) record[f] = p[f];
    }
    // Resolve detailsUrl to an absolute dws10.com URL — this file is served from dws6.com, so a
    // relative "../products/x.html" link would be wrong there.
    if (record.detailsUrl && record.detailsUrl.startsWith('../products/')) {
      record.detailsUrl = `https://dws10.com/products/${record.detailsUrl.replace('../products/', '')}`;
    } else if (record.detailsUrl && record.detailsUrl.startsWith('/')) {
      record.detailsUrl = `https://dws10.com${record.detailsUrl}`;
    }
    // checkoutUrl is a root-relative path (/checkout/?product=<id>) that only exists on
    // dws10.com — resolve it to an absolute URL for the same reason.
    if (record.checkoutUrl && record.checkoutUrl.startsWith('/')) {
      record.checkoutUrl = `https://dws10.com${record.checkoutUrl}`;
    }
    products.push(record);
  }

  if (missing.length) {
    throw new Error(`Chapter 5 SKUs missing from catalogue: ${missing.join(', ')}`);
  }
  if (products.length !== 9) {
    throw new Error(`Expected exactly 9 Firehorse Chapter 5 products, found ${products.length}`);
  }

  return {
    $comment:
      'Generated, same-origin mirror of the 9 Chapter 5 (Firehorse applications) catalogue ' +
      'records, for dws6.com/dashboard/firehorse/store-preview.html. Source of truth remains ' +
      'dws10.com/config/products.json — do not hand-edit this file, run ' +
      'scripts/truth/generate-firehorse-store-preview-data.mjs.',
    catalogVersion: catalog.priceVersion,
    products,
  };
}

function main() {
  const data = build();
  const json = JSON.stringify(data, null, 2) + '\n';

  if (process.argv.includes('--check')) {
    let ok = true;
    for (const p of OUT_PATHS) {
      const cur = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
      if (cur !== json) {
        console.error(`[generate-firehorse-store-preview-data] STALE: ${path.relative(ROOT, p)}`);
        ok = false;
      }
    }
    if (!ok) process.exit(1);
    console.log('[generate-firehorse-store-preview-data] OK — both copies current');
    return;
  }

  for (const p of OUT_PATHS) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, json);
    console.log(`[generate-firehorse-store-preview-data] wrote ${path.relative(ROOT, p)}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
