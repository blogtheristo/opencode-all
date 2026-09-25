#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=price-list-a5-campaign Date=2026-09-25
// Audit trail: git log -- scripts/truth/product-valuation.mjs
//
// Per-product TAM and valuation, plus the repository's cost-approach value (HIC 25.09.2026).
// Every assumption lives in config/truth/product-valuation-model.json; this script only does the
// arithmetic, so a changed assumption is a reviewable one-line diff. Output:
// docs/truth/PRODUCT_VALUATION.md and config/truth/product-valuation.json.
//
// Usage: node scripts/truth/product-valuation.mjs [--check]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CATALOG = path.join(ROOT, 'dws10.com/config/products.json');
const MODEL = path.join(ROOT, 'config/truth/product-valuation-model.json');
const OUT_MD = path.join(ROOT, 'docs/truth/PRODUCT_VALUATION.md');
const OUT_JSON = path.join(ROOT, 'config/truth/product-valuation.json');

const pub = (p) => !(p.archived || p.productType === 'archived' || p.deploymentColor === 'blue');

function ruleFor(id, p, model, independent) {
  const tags = p.tags || [];
  return model.rules.find(
    ({ match: m }) =>
      m.any ||
      (m.ids && m.ids.includes(id)) ||
      (m.tag && tags.includes(m.tag)) ||
      (m.idPrefix && id.startsWith(m.idPrefix)) ||
      (m.independent && independent.has(id)),
  );
}

function annualValue(p, rule, d) {
  const price = Number.isFinite(Number(p.price)) && p.price !== null ? Number(p.price) : null;
  if (price === null) return { value: null, basis: 'price on application' };
  if (price === 0) return { value: 0, basis: 'free' };
  if (p.billingPeriod === 'yearly') return { value: price, basis: 'yearly price' };
  if (
    p.type === 'monthly' ||
    p.billingPeriod === 'monthly' ||
    (p.type === 'subscription' && !p.billingPeriod)
  )
    return { value: price * 12, basis: 'monthly x 12' };
  if (p.type === 'hourly')
    return { value: price * d.hoursPerYear, basis: `hourly x ${d.hoursPerYear} h` };
  const cycle = rule.cycle || d.replacementCycleYears;
  return {
    value: price / cycle,
    basis: cycle === 1 ? 'one-time, yearly purchase' : `one-time / ${cycle} y`,
  };
}

export function buildValuation(catalog, model) {
  const products = { ...catalog.products };
  for (const [k, v] of Object.entries(catalog.subscriptions || {}))
    if (!products[k]) products[k] = v;
  const independent = new Set(catalog.commercialPortfolio?.independentProductIds || []);
  const d = model.defaults;
  const disc = Math.pow(1 + model.method.discountRate, 5);
  const rows = [];
  for (const [id, p] of Object.entries(products)) {
    if (!pub(p)) continue;
    const rule = ruleFor(id, p, model, independent);
    const seg = model.segments[rule.segment];
    const fam = model.families[rule.family];
    const av = annualValue(p, rule, d);
    const tam = av.value === null ? null : seg.buyers * rule.fit * av.value;
    const som = tam === null ? null : tam * fam.capture;
    const pv = (k) => (som === null ? null : (som * k * fam.multiple * fam.probability) / disc);
    rows.push({
      id,
      name: p.name || '',
      family: rule.family,
      segment: rule.segment,
      segmentStatus: seg.status,
      buyers: seg.buyers,
      fit: rule.fit,
      annualValuePerBuyer: av.value,
      annualValueBasis: av.basis,
      tamEurPerYear: tam,
      somYear5Eur: som,
      valueLowEur: pv(0.5),
      valueCentralEur: pv(1),
      valueHighEur: pv(2),
    });
  }
  rows.sort((a, b) => (b.valueCentralEur ?? -1) - (a.valueCentralEur ?? -1));
  const sum = (k, f = () => true) => rows.filter(f).reduce((n, r) => n + (r[k] || 0), 0);
  const byFamily = Object.fromEntries(
    Object.keys(model.families).map((f) => [
      f,
      {
        products: rows.filter((r) => r.family === f).length,
        tamEurPerYear: sum('tamEurPerYear', (r) => r.family === f),
        valueCentralEur: sum('valueCentralEur', (r) => r.family === f),
      },
    ]),
  );

  const R = model.repo;
  const kloc = R.codeSloc / 1000;
  const cocomoPm = 2.4 * Math.pow(kloc, 1.05); // basic COCOMO, organic mode
  const traditionalEur = cocomoPm * R.loadedCostPerPersonMonthEur;
  const repo = {
    codeKsloc: Math.round(kloc),
    cocomoPersonMonths: Math.round(cocomoPm),
    rebuildTraditionalEur: traditionalEur,
    rebuildAiLowEur: traditionalEur / R.aiProductivityFactorHigh,
    rebuildAiHighEur: traditionalEur / R.aiProductivityFactorLow,
    rdLedgerEur: R.rdLedgerEur,
    capitalisedEur: R.capitalisedEur,
  };
  const products_ = {
    tamEurPerYear: sum('tamEurPerYear'),
    somYear5Eur: sum('somYear5Eur'),
    valueLowEur: sum('valueLowEur'),
    valueCentralEur: sum('valueCentralEur'),
    valueHighEur: sum('valueHighEur'),
    unpriced: rows.filter((r) => r.tamEurPerYear === null).map((r) => r.id),
  };
  return {
    asOf: model.asOf,
    catalogVersion: catalog.priceVersion,
    products: products_,
    byFamily,
    repo,
    rows,
  };
}

const eur = (v) =>
  v === null || v === undefined
    ? '—'
    : v >= 1e9
      ? `€${(v / 1e9).toFixed(2)}B`
      : v >= 1e6
        ? `€${(v / 1e6).toFixed(2)}M`
        : v >= 1e3
          ? `€${Math.round(v / 1e3)}k`
          : `€${Math.round(v)}`;

export function renderMarkdown(v, model) {
  const P = v.products;
  const R = v.repo;
  const segRows = Object.entries(model.segments).map(
    ([k, s]) =>
      `| ${k} | ${s.label} | ${s.buyers.toLocaleString('en-GB')} | ${s.status} | ${s.basis} |`,
  );
  const famRows = Object.entries(model.families).map(
    ([k, f]) =>
      `| ${k} | ${v.byFamily[k].products} | ${(f.capture * 100).toFixed(2)} % | ${f.multiple}x | ${f.probability} | ${eur(v.byFamily[k].tamEurPerYear)} | ${eur(v.byFamily[k].valueCentralEur)} |`,
  );
  return [
    '# DWS Product Valuation — TAM and value per product',
    '',
    '# VERSION AND AGENT HISTORY',
    '',
    '---',
    '',
    `Version: ${v.catalogVersion} [Latest]`,
    '',
    'Sessions & Modifications:',
    '',
    `- Version: ${v.catalogVersion} [Latest] | Tool: scripts/truth/product-valuation.mjs | Changes: Generated from dws10.com/config/products.json ${v.catalogVersion} and config/truth/product-valuation-model.json (as of ${v.asOf}). Do not edit by hand.`,
    '',
    'Document Status:',
    '',
    '- Language: English',
    '- Publication Status: INTERNAL — model estimate, not a market study; segment sizes marked "estimate" must be verified before investor use (DWS_TRUTH_STANDARD.md)',
    '- Canonical row: DWS_TRUTH_STANDARD.md §2 row 45',
    '',
    '---',
    '',
    '## Result',
    '',
    '| Measure | Low | Central | High |',
    '| --- | --- | --- | --- |',
    `| Products: present value (${v.rows.length} public offers) | ${eur(P.valueLowEur)} | ${eur(P.valueCentralEur)} | ${eur(P.valueHighEur)} |`,
    `| Repository as product-development environment: AI-assisted rebuild cost | ${eur(R.rebuildAiLowEur)} | — | ${eur(R.rebuildAiHighEur)} |`,
    `| Repository: traditional rebuild cost (basic COCOMO, ${R.codeKsloc} KSLOC, ${R.cocomoPersonMonths} person-months) | — | ${eur(R.rebuildTraditionalEur)} | — |`,
    '',
    `Sum of product TAMs: ${eur(P.tamEurPerYear)} per year. Year-5 obtainable revenue (SOM): ${eur(P.somYear5Eur)}. Documented R&D (hours ledger 2018–09/2025): ${eur(R.rdLedgerEur)}; capitalised on the balance sheet: ${eur(R.capitalisedEur)}.`,
    '',
    `Unpriced offers (price on application, no TAM): ${P.unpriced.join(', ') || 'none'}.`,
    '',
    '## Method',
    '',
    `- **TAM** — ${model.method.tam}`,
    `- **SOM** — ${model.method.som}`,
    `- **Value** — ${model.method.value} Discount rate ${model.method.discountRate * 100} %: ${model.method.discountRateBasis}`,
    "- **Repository** — cost approach. Basic COCOMO (organic): effort = 2.4 × KSLOC^1.05 person-months, at the loaded monthly cost in the model. The AI-assisted range divides that by the model's productivity factor. Documentation, standards and data are not in the KSLOC count, so the figure is a floor for the environment, not a ceiling.",
    '',
    '## Segments',
    '',
    '| Segment | Buyers | Count | Status | Basis |',
    '| --- | --- | --- | --- | --- |',
    ...segRows,
    '',
    '## Families',
    '',
    '| Family | Offers | Year-5 capture | Multiple | Probability | TAM / yr | Value (central) |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...famRows,
    '',
    '## Every public offer',
    '',
    '| # | ID | Family | Segment | Buyers × fit | Annual value / buyer | TAM / yr | SOM yr 5 | Value low | Value central | Value high |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...v.rows.map(
      (r, i) =>
        `| ${i + 1} | \`${r.id}\` | ${r.family} | ${r.segment}${r.segmentStatus === 'estimate' ? '*' : ''} | ${Math.round(r.buyers * r.fit).toLocaleString('en-GB')} | ${eur(r.annualValuePerBuyer)} (${r.annualValueBasis}) | ${eur(r.tamEurPerYear)} | ${eur(r.somYear5Eur)} | ${eur(r.valueLowEur)} | ${eur(r.valueCentralEur)} | ${eur(r.valueHighEur)} |`,
    ),
    '',
    '\\* segment size is a model estimate to verify.',
    '',
  ].join('\n');
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const model = JSON.parse(fs.readFileSync(MODEL, 'utf8'));
  const v = buildValuation(catalog, model);
  const md = renderMarkdown(v, model);
  const json = JSON.stringify(v, null, 2) + '\n';
  if (process.argv.includes('--check')) {
    const cur = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
    if (cur(OUT_MD) !== md || cur(OUT_JSON) !== json) {
      console.error(
        '[product-valuation] FAIL — stale; run node scripts/truth/product-valuation.mjs',
      );
      process.exitCode = 1;
    } else console.log('[product-valuation] OK');
    return;
  }
  fs.writeFileSync(OUT_MD, md);
  fs.writeFileSync(OUT_JSON, json);
  const P = v.products;
  console.log(
    `[product-valuation] ${v.rows.length} offers; TAM ${eur(P.tamEurPerYear)}/yr; value ${eur(P.valueLowEur)} / ${eur(P.valueCentralEur)} / ${eur(P.valueHighEur)}; repo rebuild ${eur(v.repo.rebuildAiLowEur)}–${eur(v.repo.rebuildAiHighEur)} (AI) / ${eur(v.repo.rebuildTraditionalEur)} (traditional)`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
