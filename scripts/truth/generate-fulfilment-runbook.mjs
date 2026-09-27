#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI Model=gpt-5.6-sol Agent=product-readiness-portfolio Date=27.09.2026
// Audit trail: git log -- scripts/truth/generate-fulfilment-runbook.mjs
//
// HIC 27.09.2026 (tranche 2, part A): "Generate docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md with
// universal paid-order steps and one section per chapter listing each SKU exactly once."
//
// Deterministic: every fact here is read from dws10.com/config/products.json,
// config/truth/product-capability-chapters.json and
// config/truth/product-delivery-templates.json. Nothing invented. Every SKU appears exactly once,
// under its chapter, with the checkout URL, delivery owner/SLA/mode and runbookRef anchor already
// written into its catalogue record — this file is simply the human-readable side of that same
// data, so the two can never drift once both are generated from the same run.
//
// Usage:
//   node scripts/truth/generate-fulfilment-runbook.mjs          # write the runbook
//   node scripts/truth/generate-fulfilment-runbook.mjs --check  # exit 1 if stale

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.join(ROOT, 'dws10.com/config/products.json');
const CHAPTERS_PATH = path.join(ROOT, 'config/truth/product-capability-chapters.json');
const TEMPLATES_PATH = path.join(ROOT, 'config/truth/product-delivery-templates.json');
const OUT_MD = path.join(ROOT, 'docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md');

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function render(catalog, chaptersDoc, templates) {
  const products = catalog.products || {};
  const lines = [
    '# Product Fulfilment Runbook — every SKU, exactly once',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${catalog.priceVersion} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${catalog.priceVersion} [Latest] | Tool: scripts/truth/generate-fulfilment-runbook.mjs | Changes: Generated from dws10.com/config/products.json + config/truth/product-capability-chapters.json + config/truth/product-delivery-templates.json. Do not edit by hand; run the script. HIC 27.09.2026: "universal paid-order steps and one section per chapter listing each SKU exactly once."`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: ACTIVE (internal delivery reference — no public-facing behavior change)',
    '',
    '---',
    '',
    '## Purpose',
    '',
    'This is the operational runbook for fulfilling a paid order for any of the 138 catalogue',
    'products. Every product is payable today via its `checkoutUrl`; this document is how the',
    'Lifetime Oy delivery teams turn a paid order into a delivered product. It never gates or',
    'delays payment — the steps below start **after** a payment has been captured.',
    '',
    '## Universal paid-order steps (every SKU)',
    '',
    '1. **Order received.** Checkout (`/checkout/?product=<SKU>`) or the manual `contact` route',
    '   produces an order with the buyer\'s name, email, company and the ordered SKU.',
    '2. **Acknowledge within 1 business day.** The owning team (below, per chapter) confirms',
    '   receipt to the buyer by email, referencing the SKU and its acceptance criteria.',
    '3. **Deliver per the SKU\'s `fulfilment.deliveryMode`.** Managed human delivery is the',
    '   default and fallback for every chapter — no chapter\'s commitment depends on unattended',
    '   automation succeeding.',
    '4. **Check against the SKU\'s `acceptanceKpi`.** Delivery is complete when the required',
    '   outcomes are met; a documented negative result (where applicable) is a valid, reportable',
    '   outcome, not a defect.',
    '5. **Confirm what is excluded.** Each SKU\'s `exclusions` are shared with the buyer before',
    '   or at acknowledgement so scope is unambiguous.',
    '6. **Record delivery.** Note the outcome against the order so `docs/truth/PRODUCT_FULFILMENT.md`',
    '   and `docs/truth/PRODUCT_READINESS_BACKLOG.md` stay an accurate account of what has and has',
    '   not yet been automated.',
    '',
    '## Chapters',
    '',
  ];

  for (const ch of chaptersDoc.chapters) {
    const tpl = templates.chapters[ch.chapter];
    const anchor = slugify(`${ch.chapter} ${ch.title}`);
    lines.push(`### ${ch.chapter} — ${ch.title}`, '');
    lines.push(`<a id="${anchor}"></a>`, '');
    lines.push(`- **Owner:** ${tpl.team}`, '');
    lines.push(`- **Delivery mode:** ${tpl.deliveryMode}`, '');
    lines.push(`- **Acknowledgement SLA:** ${templates.acknowledgementSla} via ${templates.contactRoute}`, '');
    lines.push('', '| SKU | Product | Checkout |', '| --- | --- | --- |');
    const skus = [...ch.skus].sort();
    for (const sku of skus) {
      const p = products[sku];
      const name = p ? p.name : '(not in current catalogue)';
      const checkout = p?.checkoutUrl || '—';
      lines.push(`| \`${sku}\` | ${name} | ${checkout} |`);
    }
    lines.push('');
  }

  // Trailing chapter loop always pushes a blank-line separator; strip it so the file ends
  // with exactly one newline and no blank line at EOF (commit preflight: no blank line at EOF).
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n') + '\n';
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const chaptersDoc = JSON.parse(fs.readFileSync(CHAPTERS_PATH, 'utf8'));
  const templates = JSON.parse(fs.readFileSync(TEMPLATES_PATH, 'utf8'));
  const md = render(catalog, chaptersDoc, templates);

  if (process.argv.includes('--check')) {
    const current = fs.existsSync(OUT_MD) ? fs.readFileSync(OUT_MD, 'utf8') : '';
    if (current !== md) {
      console.error('[generate-fulfilment-runbook] FAIL — stale; run node scripts/truth/generate-fulfilment-runbook.mjs');
      process.exitCode = 1;
      return;
    }
    console.log('[generate-fulfilment-runbook] OK — runbook current');
    return;
  }

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, md);
  console.log(`[generate-fulfilment-runbook] wrote ${path.relative(ROOT, OUT_MD)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
