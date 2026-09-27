#!/usr/bin/env node
/**
 * apply-product-delivery-contracts.mjs
 *
 * HIC directive (product-readiness-portfolio, tranche 2 part A):
 * Deterministically add a managed delivery contract to every one of the 138
 * catalogue products: checkoutMode, checkoutUrl, deliveryProfile, fulfilment
 * (owner/route/acknowledgement SLA/delivery mode/runbook reference),
 * acceptanceKpi and exclusions.
 *
 * Rules (never violate):
 *  - Idempotent: safe to re-run; re-running does not change output (byte
 *    stable) once applied.
 *  - Never fabricates external payment links, named individuals, or capacity
 *    claims. Owners are shared team names under "Lifetime Oy"; contact route
 *    is the real https://dws10.com/contact/ page; checkoutUrl is the real,
 *    already-working /checkout/?product=<id> route (verified against
 *    dws10.com/checkout/index.html, which resolves ANY catalogue id via
 *    PRODUCTS[productId] with a generic Revolut/PayPal fallback even when no
 *    dedicated revolutLink exists).
 *  - Preserves any already-present acceptanceKpi / exclusions (e.g. the
 *    hand-written DWS-AEGIS-PILOT-001 contract) — only fills gaps, never
 *    overwrites richer existing data.
 *  - Never touches price, revolutLink, lifecycle, storeCategory, or any
 *    visibility/publication field. Warnings/reporting only elsewhere in the
 *    pipeline; this script only ADDS delivery-contract fields.
 *
 * Usage:
 *   node scripts/truth/apply-product-delivery-contracts.mjs           (apply, write both mirrors)
 *   node scripts/truth/apply-product-delivery-contracts.mjs --check   (verify already applied + mirrors identical; exit 1 otherwise)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const CATALOGUE_PATHS = [
  path.join(ROOT, 'dws10.com/config/products.json'),
  path.join(ROOT, 'landing-pages/dws10-com/config/products.json'),
];
const CHAPTERS_PATH = path.join(ROOT, 'config/truth/product-capability-chapters.json');
const TEMPLATES_PATH = path.join(ROOT, 'config/truth/product-delivery-templates.json');

const CHECK = process.argv.includes('--check');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildChapterLookup(chaptersDoc) {
  const lookup = new Map();
  for (const ch of chaptersDoc.chapters) {
    for (const sku of ch.skus) {
      lookup.set(sku, ch);
    }
  }
  return lookup;
}

function runbookAnchor(ch) {
  return `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md#${slugify(`${ch.chapter} ${ch.title}`)}`;
}

// detailsUrl standardisation: point every product at its canonical
// ../products/<lowercase-id>.html page EXCEPT where doing so would either (a)
// downgrade a real, richer, uniquely-owned legacy page to a thin generic
// stub, or (b) do nothing (already canonical). We only repoint when the
// current link is verifiably broken/generic/collided:
//   - empty or malformed (doesn't match the ../products/*.html convention)
//   - a dead link (file no longer exists on disk)
//   - shared by 2+ distinct product ids (a collision/bug, like FH-SIGN-001 was)
//   - a bare /contact/ link where a real per-SKU page now exists
//   - a HAND_AUTHORED page (slug intentionally curated — canonical target is
//     itself the deliberately maintained page, so pointing to it is a
//     confident improvement, not a downgrade)
// Legacy pages that are unique, alive, non-hand-authored, and materially
// richer than the generic template (e.g. dgx-spark.html, situation-room.html,
// climate-intelligence.html) are left untouched — repointing them would
// replace real content with a thin stub, which this generator must never do.
function loadHandAuthoredSlugs() {
  const src = fs.readFileSync(path.join(ROOT, 'scripts/build_store.py'), 'utf8');
  const m = src.match(/HAND_AUTHORED = \{([\s\S]*?)\}/);
  const set = new Set();
  if (m) {
    for (const mm of m[1].matchAll(/"([^"]+)"/g)) set.add(mm[1]);
  }
  return set;
}

function decideDetailsUrl(id, product, byCurrentUrl, handAuthoredSlugs) {
  const slug = id.toLowerCase();
  const canonicalUrl = `../products/${slug}.html`;
  const canonicalExists = fs.existsSync(path.join(ROOT, 'dws10.com/products', `${slug}.html`));
  const current = product.detailsUrl || '';
  if (current === canonicalUrl) return { url: current, changed: false };
  if (!canonicalExists) return { url: current, changed: false }; // handled after page generation, separate pass

  const isEmpty = current.trim() === '';
  const isMalformed = current && !current.startsWith('../products/') && !current.startsWith('https://dws10.com/contact/');
  const currentFile = current.replace(/^\.\.\/products\//, '');
  const currentIsDead = current.startsWith('../products/') && !fs.existsSync(path.join(ROOT, 'dws10.com/products', currentFile));
  const isContact = current.includes('dws10.com/contact/');
  const isCollision = (byCurrentUrl.get(current) || []).length > 1;
  const isHandAuthored = handAuthoredSlugs.has(slug);

  if (isEmpty || isMalformed || currentIsDead || isCollision || isContact || isHandAuthored) {
    return { url: canonicalUrl, changed: true };
  }
  return { url: current, changed: false }; // deliberate skip: unique, alive, richer legacy page
}

function buildContractFor(id, product, ch, templates) {
  const tpl = templates.chapters[ch.chapter];
  if (!tpl) {
    throw new Error(`No delivery template for ${ch.chapter} (product ${id})`);
  }

  const checkoutMode = product.revolutLink ? 'self-serve-dedicated' : 'self-serve-fallback';
  const checkoutUrl = `/checkout/?product=${encodeURIComponent(id)}`;

  const deliveryProfile = {
    chapter: ch.chapter,
    chapterTitle: ch.title,
  };

  const fulfilment = {
    owner: tpl.team,
    route: templates.contactRoute,
    acknowledgementSla: templates.acknowledgementSla,
    deliveryMode: tpl.deliveryMode,
    runbookRef: runbookAnchor(ch),
  };

  const acceptanceKpi = product.acceptanceKpi ?? {
    condition: tpl.acceptanceCondition,
    requiredOutcomes: tpl.requiredOutcomes,
    rule: templates.acceptanceRule,
  };

  const exclusions = product.exclusions ?? tpl.exclusions;

  return { checkoutMode, checkoutUrl, deliveryProfile, fulfilment, acceptanceKpi, exclusions };
}

function apply(catalogue, chapterLookup, templates) {
  let changed = 0;
  let detailsUrlChanged = 0;
  const missingChapter = [];

  const handAuthoredSlugs = loadHandAuthoredSlugs();
  const byCurrentUrl = new Map();
  for (const [id, product] of Object.entries(catalogue.products)) {
    const url = product.detailsUrl || '';
    if (!byCurrentUrl.has(url)) byCurrentUrl.set(url, []);
    byCurrentUrl.get(url).push(id);
  }

  for (const [id, product] of Object.entries(catalogue.products)) {
    const ch = chapterLookup.get(id);
    if (!ch) {
      missingChapter.push(id);
      continue;
    }

    const decision = decideDetailsUrl(id, product, byCurrentUrl, handAuthoredSlugs);
    if (decision.changed) {
      product.detailsUrl = decision.url;
      detailsUrlChanged++;
    }

    const contract = buildContractFor(id, product, ch, templates);
    const before = JSON.stringify({
      checkoutMode: product.checkoutMode,
      checkoutUrl: product.checkoutUrl,
      deliveryProfile: product.deliveryProfile,
      fulfilment: product.fulfilment,
      acceptanceKpi: product.acceptanceKpi,
      exclusions: product.exclusions,
    });
    // Preserve field order by only assigning if different / missing.
    product.checkoutMode = contract.checkoutMode;
    product.checkoutUrl = contract.checkoutUrl;
    product.deliveryProfile = contract.deliveryProfile;
    product.fulfilment = contract.fulfilment;
    product.acceptanceKpi = contract.acceptanceKpi;
    product.exclusions = contract.exclusions;
    const after = JSON.stringify({
      checkoutMode: product.checkoutMode,
      checkoutUrl: product.checkoutUrl,
      deliveryProfile: product.deliveryProfile,
      fulfilment: product.fulfilment,
      acceptanceKpi: product.acceptanceKpi,
      exclusions: product.exclusions,
    });
    if (before !== after) changed++;
  }
  if (missingChapter.length) {
    throw new Error(`Products with no capability-chapter mapping: ${missingChapter.join(', ')}`);
  }
  return { changed, detailsUrlChanged };
}


// Original file style keeps a handful of short string arrays inline
// (e.g. "tags": ["A", "B"]) instead of one-item-per-line. JSON.stringify
// always expands arrays, so re-collapse just those known keys to avoid
// large unrelated formatting diffs across the whole catalogue.
const INLINE_ARRAY_KEYS = ["tags", "allowed", "smeCampaignProductIds"];
function collapseInlineArrays(text) {
  for (const key of INLINE_ARRAY_KEYS) {
    const re = new RegExp(
      `("${key}": )\\[\\n((?:\\s*"[^"]*",?\\n)*)(\\s*)\\]`,
      'g'
    );
    text = text.replace(re, (whole, prefix, body) => {
      const items = [...body.matchAll(/"([^"]*)"/g)].map((m) => `"${m[1]}"`);
      return `${prefix}[${items.join(', ')}]`;
    });
  }
  return text;
}


// The source catalogue escapes all non-ASCII characters as \uXXXX (lowercase
// hex), but JSON.stringify() emits raw UTF-8 characters. Re-escape to match
// the existing on-disk convention and avoid a whole-file diff of every
// accented character / em dash.
function escapeNonAscii(text) {
  return text.replace(/[\u007f-\uffff]/g, (ch) =>
    '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
  );
}

function main() {
  const chaptersDoc = JSON.parse(fs.readFileSync(CHAPTERS_PATH, 'utf8'));
  const templates = JSON.parse(fs.readFileSync(TEMPLATES_PATH, 'utf8'));
  const chapterLookup = buildChapterLookup(chaptersDoc);

  const results = [];
  for (const catPath of CATALOGUE_PATHS) {
    const raw = fs.readFileSync(catPath, 'utf8');
    const catalogue = JSON.parse(raw);
    const { changed, detailsUrlChanged } = apply(catalogue, chapterLookup, templates);
    const serialized = escapeNonAscii(collapseInlineArrays(JSON.stringify(catalogue, null, 2))) + '\n';
    results.push({ catPath, raw, serialized, changed, detailsUrlChanged });
  }

  const identical = results[0].serialized === results[1].serialized;
  if (!identical) {
    console.error('FATAL: catalogue mirrors would diverge after applying delivery contracts.');
    process.exit(1);
  }

  if (CHECK) {
    let ok = true;
    for (const r of results) {
      if (r.raw !== r.serialized) {
        console.error(`STALE: ${path.relative(ROOT, r.catPath)} is not up to date with delivery contracts.`);
        ok = false;
      }
    }
    if (!ok) process.exit(1);
    console.log('OK: product delivery contracts up to date in both catalogue files.');
    return;
  }

  for (const r of results) {
    fs.writeFileSync(r.catPath, r.serialized);
    console.log(`Wrote ${path.relative(ROOT, r.catPath)} (${r.changed} products updated/confirmed, ${r.detailsUrlChanged} detailsUrl repointed)`);
  }
}

main();
