#!/usr/bin/env node
/**
 * DWS Price List — Versioned HTML Snapshot Generator v1.0
 *
 * Reads the canonical products.json, renders a self-contained,
 * client-ready HTML snapshot of the current stamped price list
 * (no fetch — all data inlined), and writes it to:
 *
 *   dws10.com/price-list/versions/price-list-v<version>.html
 *
 * Mirrors to landing-pages/dws10-com/price-list/versions/ so the
 * dual-folder sync rule holds.
 *
 * Filename is auto-derived from priceList.version (e.g. "2026.Q2").
 * Each snapshot is immutable and represents one quarter's stamp;
 * never delete old snapshots — they serve as the archive.
 *
 * Usage:
 *   node scripts/gen-price-list-html.cjs
 *
 * Runs automatically under scripts/on-deploy/ when products.json
 * changes (see scripts/on-deploy/regen-price-list.sh).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..');
const SRC_JSON = path.join(BASE, 'dws10.com/config/products.json');
const OUT_DIRS = [
  path.join(BASE, 'dws10.com/price-list/versions'),
  path.join(BASE, 'landing-pages/dws10-com/price-list/versions'),
];

// Product groups (HIC 25.09.2026): tag or catalogue class, each with a soft theme colour.
const LAYER_LABELS = {
  sme: 'SME campaign products',
  dwsiq: 'DWS IQ platform',
  firehorse: 'Firehorse agents',
  data: 'Independent data products',
  services: 'Services, consulting and training',
  hardware: 'Hardware and infrastructure',
  other: 'Other products',
};
const LAYER_ORDER = ['sme', 'dwsiq', 'firehorse', 'data', 'services', 'hardware', 'other'];

function commercialLayer(p, independentIds) {
  const id = p.id || '';
  const tags = Array.isArray(p.tags) ? p.tags : [];
  if (tags.includes('SME')) return 'sme';
  if (tags.includes('DWS IQ')) return 'dwsiq';
  if (tags.includes('Firehorse')) return 'firehorse';
  if (independentIds.has(id)) return 'data';
  if (
    p.storeCategory === 'advisory' ||
    p.storeCategory === 'ai-cloud' ||
    id === 'LF-TRAIN-IND' ||
    id === 'LF-ONTOLOGY-PILOT'
  ) {
    return 'services';
  }
  if (
    p.storeCategory === 'hardware' ||
    /^(LF-K8S|LF-DOCA|LF-NIM|LF-GOV|LF-IPC|LF-FIPS|LF-CINCOZE|LF-SOV)/.test(id)
  ) {
    return 'hardware';
  }
  return 'other';
}

// Per-category buyer notes rendered under the category table. Trusted constants —
// intentionally NOT escaped, so they may contain inline markup.
// The hardware note answers the question a buyer asks straight after seeing the DGX
// price: "what if NVIDIA cannot deliver?" It states the position without exposing the
// internal risk register (DD instrument, offered under NDA).
const CATEGORY_NOTES = {
  hardware:
    '<strong>Supply continuity.</strong> The models we adopt ship as open weights, so the ' +
    "inference layer is portable by design rather than tied to one vendor's stack. A " +
    'non-NVIDIA fallback path (AMD, Intel accelerators) is carried in our supply-risk plan, ' +
    'and hardware compatibility is validated per engagement rather than assumed. The full ' +
    'supply-risk register is available under NDA.',
};

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function eur(n) {
  if (n === null || n === undefined) return '—';
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n);
  } catch (e) {
    return '€' + n;
  }
}
// Accepts a product object (preferred) or a bare type string (legacy callers).
// Order of authority: explicit priceUnit -> billingPeriod -> type.
// NOTE: 'subscription' previously mapped to 'per year', which mislabelled every
// monthly SKU (e.g. the €499/mo required subscriptions) as an annual price — a
// material pricing misstatement on a customer-facing list. Subscriptions bill
// monthly unless the data says otherwise.
function unitLabel(p) {
  const prod = p && typeof p === 'object' ? p : null;
  const t = prod ? prod.type : p;
  const unitMap = {
    'per-month': 'per month',
    'per-year': 'per year',
    'per-hour': 'per hour',
    'per-day': 'per day',
    'per-seat': 'per seat',
    'per-site': 'per site (project)',
    'per-3-months': 'per 3 months',
    'one-time': 'one-time',
  };
  const priceUnit = prod && prod.priceUnit;
  if (priceUnit && unitMap[priceUnit]) return unitMap[priceUnit];
  if (t === 'subscription') {
    const b = String((prod && prod.billingPeriod) || 'monthly').toLowerCase();
    return b === 'yearly' || b === 'annual' || b === 'annually' ? 'per year' : 'per month';
  }
  return (
    {
      hourly: 'per hour',
      daily: 'per day',
      monthly: 'per month',
      'one-time': 'one-time',
    }[t] ||
    t ||
    '—'
  );
}

function renderProductsTable(list) {
  return (
    '<table class="pl-table"><thead><tr>' +
    '<th>ID</th><th>Product</th><th>Price (EUR)</th><th>Unit</th><th>SKU / MPN</th>' +
    '</tr></thead><tbody>' +
    list
      .sort(
        (a, b) =>
          (a.buyPageOrder ?? 999) - (b.buyPageOrder ?? 999) ||
          (a.name || '').localeCompare(b.name || ''),
      )
      .map((p) => {
        const priceCell =
          p.price === 0
            ? '<span class="poa">Free / POA</span>'
            : p.price == null || !Number.isFinite(Number(p.price))
              ? '<span class="poa">Quote</span>'
              : Number.isFinite(Number(p.priceMax)) && Number(p.priceMax) > Number(p.price)
                ? eur(p.price) + '–' + eur(p.priceMax)
                : (p.startingPrice === true ? 'from ' : '') + eur(p.price);
        const note = p.priceNote ? `<div class="note">${esc(p.priceNote)}</div>` : '';
        const caption = p.caption ? `<div class="caption">${esc(p.caption)}</div>` : '';
        return (
          '<tr>' +
          `<td class="id">${esc(p.id)}</td>` +
          `<td class="name">${esc(p.name)}${caption}${note}</td>` +
          `<td class="price">${priceCell}</td>` +
          `<td class="unit">${esc(unitLabel(p))}</td>` +
          `<td class="sku">${esc(p.mpn || p.sku || '—')}</td>` +
          '</tr>'
        );
      })
      .join('') +
    '</tbody></table>'
  );
}

function renderVat(vat) {
  if (!vat || !Array.isArray(vat.countries)) return '';
  const rows = vat.countries
    .map(
      (c) =>
        '<tr>' +
        `<td><span class="lp">${esc((c.language || '').toUpperCase())}</span></td>` +
        `<td>${esc(c.label || c.country)}</td>` +
        `<td class="rate">${esc(c.displayRate || (c.standardRate != null ? c.standardRate + '%' : '—'))}</td>` +
        `<td>${esc(c.note || '')}</td>` +
        '</tr>',
    )
    .join('');
  return `
<section class="vat-ref">
  <h2>VAT Reference — 5 Languages</h2>
  <p class="sub">${esc(vat.note || '')}</p>
  <table class="pl-table">
    <thead><tr><th>Language</th><th>Country / Region</th><th>Standard VAT</th><th>Notes</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="source">Source: ${esc(vat.source || '')}</p>
</section>`;
}

function build(data) {
  const pl = data.priceList || {};
  const policy = pl.policy || {};
  const gov = pl.governance || {};
  const version = pl.version || 'unversioned';
  const stampLabel = pl.stampQuarter
    ? `${pl.stampQuarter} · ${pl.stampDate || pl.effectiveDate}`
    : pl.effectiveDate || '—';
  const validUntil = pl.validUntil || pl.nextReviewDate || '—';

  const products = { ...(data.products || {}) };
  Object.entries(data.subscriptions || {}).forEach(([key, item]) => {
    if (!products[key]) products[key] = item;
  });

  const independentIds = new Set(
    (data.commercialPortfolio && data.commercialPortfolio.independentProductIds) || [
      'LF-ONTOLOGY-25',
      'LWM-ONT-SOVEREIGN',
    ],
  );

  const buckets = {};
  Object.values(products).forEach((p) => {
    if (!p || typeof p !== 'object') return;
    if (p.productType === 'archived' || p.archived === true) return;
    if (p.deploymentColor === 'blue') return;
    const cat = commercialLayer(p, independentIds);
    (buckets[cat] ||= []).push(p);
  });
  const orderedCats = LAYER_ORDER.filter((c) => buckets[c]?.length).concat(
    Object.keys(buckets).filter((c) => !LAYER_ORDER.includes(c)),
  );

  const catsHtml = orderedCats
    .map(
      (c) =>
        `<section class="cat grp-${c}"><h2>${esc(LAYER_LABELS[c] || c)} <small>(${buckets[c].length})</small></h2>${renderProductsTable(buckets[c])}${c === 'hardware' && CATEGORY_NOTES.hardware ? `<div class="notice">${CATEGORY_NOTES.hardware}</div>` : ''}</section>`,
    )
    .join('\n');

  const renderedCount = orderedCats.reduce((n, c) => n + buckets[c].length, 0);
  const countHtml = `<div class="notice">This snapshot lists <strong>${renderedCount}</strong> active public offers in six product groups. BLUE and archived SKUs are omitted. Count is derived from the tables below.</div>`;
  const subsHtml = '';

  const genStamp = new Date().toISOString();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Price List v${esc(version)} · ${esc(pl.stampQuarter || '')} · Lifetime Oy</title>
<meta name="robots" content="noindex"/>
<meta name="description" content="Stamped, immutable price list snapshot. ${esc(stampLabel)}. Valid until ${esc(validUntil)}."/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#111;background:#fff;line-height:1.55;padding:32px;max-width:1100px;margin:0 auto}
.banner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:#1e293b;color:#e2e8f0;padding:12px 18px;margin:-32px -32px 28px;border-bottom:4px solid #fbbf24}
.banner .badge{background:#fbbf24;color:#0f172a;font-weight:700;padding:5px 14px;border-radius:20px;font-size:.95rem;letter-spacing:.04em}
.banner .meta{color:#94a3b8;font-size:.8rem;text-align:right}
h1{font-size:1.8rem;border-bottom:3px solid #fbbf24;padding-bottom:8px;margin-bottom:8px}
.subtitle{color:#555;margin-bottom:20px}
.meta-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:20px}
.meta-grid div{font-size:.85rem}
.meta-grid label{display:block;color:#64748b;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;margin-bottom:2px}
.meta-grid strong{color:#0f172a;font-size:.95rem}
.notice{background:#fffbeb;border-left:4px solid #fbbf24;padding:12px 16px;margin-bottom:24px;font-size:.9rem}
.cat{margin-bottom:32px;page-break-inside:avoid;padding:14px 16px;border-radius:10px;border-left:4px solid #94a3b8}
.grp-sme{background:#fef9ec;border-left-color:#f59e0b}
.grp-dwsiq{background:#eff6ff;border-left-color:#3b82f6}
.grp-firehorse{background:#fff4ed;border-left-color:#f97316}
.grp-data{background:#effcf9;border-left-color:#14b8a6}
.grp-services{background:#f5f3ff;border-left-color:#8b5cf6}
.grp-hardware{background:#f8fafc;border-left-color:#64748b}
h2{color:#1e3a5f;border-bottom:1px solid #e2e8f0;padding-bottom:6px;margin-bottom:12px;font-size:1.15rem}
h2 small{color:#64748b;font-weight:400;font-size:.85rem}
.pl-table{width:100%;border-collapse:collapse;font-size:.88rem;background:#fff}
.pl-table th{background:#1e3a5f;color:#fff;text-align:left;padding:9px 12px;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em}
.pl-table td{border-bottom:1px solid #e2e8f0;padding:10px 12px;vertical-align:top}
.pl-table td.id,.pl-table td.sku{font-family:ui-monospace,Consolas,monospace;color:#555;font-size:.8rem;white-space:nowrap}
.pl-table td.name{font-weight:600}
.pl-table td.name .note{font-weight:400;color:#64748b;font-size:.82rem;margin-top:3px}
.pl-table td.name .caption{font-weight:400;color:#1e3a5f;font-style:italic;font-size:.84rem;margin-top:3px}
.pl-table td.price{font-weight:700;color:#065f46;white-space:nowrap;font-variant-numeric:tabular-nums}
.pl-table td.unit{color:#334155;font-size:.82rem}
.poa{color:#92400e}
.vat-ref{margin:32px 0;padding:16px 18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px}
.vat-ref .sub{color:#555;font-size:.85rem;margin-bottom:10px}
.vat-ref .rate{font-weight:700;color:#065f46}
.vat-ref .lp{background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:999px;font-family:ui-monospace,Consolas,monospace;font-size:.72rem}
.vat-ref .source{font-size:.72rem;color:#64748b;margin-top:8px}
.legal{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:.8rem;color:#555;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.legal h3{font-size:.72rem;text-transform:uppercase;color:#1e3a5f;letter-spacing:.08em;margin-bottom:6px}
@media print{.banner{margin:-16px -16px 20px}body{padding:16px}}
</style>
</head>
<body>
<div class="banner">
  <div>Lifetime Oy · DWS IQ Price List</div>
  <div class="badge">v${esc(version)}</div>
  <div class="meta">Stamp: ${esc(stampLabel)}<br/>Valid until: ${esc(validUntil)}<br/>Generated: ${esc(genStamp)}</div>
</div>

<h1>Price List</h1>
<p class="subtitle">Stamped, immutable snapshot. Single source of truth: <code>dws10.com/config/products.json</code>.</p>

<div class="meta-grid">
  <div><label>Stamp</label><strong>${esc(pl.stampQuarter || '—')}</strong></div>
  <div><label>Stamped on</label><strong>${esc(pl.stampDate || pl.effectiveDate || '—')}</strong></div>
  <div><label>Valid until</label><strong>${esc(validUntil)}</strong></div>
  <div><label>Next review</label><strong>${esc(pl.nextReviewDate || '—')}</strong></div>
  <div><label>Currency</label><strong>${esc(policy.currency || 'EUR')}</strong></div>
  <div><label>VAT</label><strong>B2B · 0% (reverse charge)</strong></div>
  <div><label>Payment terms</label><strong>${esc(policy.paymentTerms || 'Net 14')}</strong></div>
  <div><label>Quote validity</label><strong>${esc(policy.quoteValidity || '90 days')}</strong></div>
</div>

<div class="notice">
  <strong>B2B list prices, EUR, VAT 0% (reverse charge).</strong>
  Country-specific VAT added at checkout if applicable — see 5-language VAT reference below.
  Prices on this snapshot are valid until ${esc(validUntil)}.
  The live, always-current list is at <a href="https://dws10.com/price-list/">https://dws10.com/price-list/</a>.
</div>

${countHtml}

${catsHtml}

${subsHtml}

${renderVat(pl.vatReference)}

<footer class="legal">
  <div>
    <h3>Legal entity</h3>
    <p>${esc(gov.legalEntity || 'Lifetime Oy')}</p>
    <p>${esc(gov.address || '')}</p>
    <p>Business ID: ${esc(gov.businessId || '')}</p>
    <p>VAT ID: ${esc(gov.vatId || '')}</p>
  </div>
  <div>
    <h3>Price list governance</h3>
    <p>Owner: ${esc(gov.owner || '')}</p>
    <p>Cadence: Reviewed every calendar quarter</p>
    <p>Source: <code>${esc(gov.canonicalSource || 'dws10.com/config/products.json')}</code></p>
  </div>
  <div>
    <h3>Contact</h3>
    <p>Sales: <a href="https://dws10.com/contact/">Contact sales</a></p>
    <p>Quote this snapshot by its version number: <strong>v${esc(version)}</strong>.</p>
  </div>
</footer>
</body>
</html>
`;
}

function main() {
  const raw = fs.readFileSync(SRC_JSON, 'utf8');
  const data = JSON.parse(raw);
  const version = (data.priceList && data.priceList.version) || 'unversioned';
  const filename = `price-list-v${version}.html`;
  const html = build(data);

  OUT_DIRS.forEach((dir) => {
    fs.mkdirSync(dir, { recursive: true });
    const out = path.join(dir, filename);
    fs.writeFileSync(out, html, 'utf8');
    console.log(`[gen-price-list] wrote ${path.relative(BASE, out)} (${html.length} bytes)`);
  });

  const activeProducts = Object.values(data.products || {}).filter(
    (p) => p && p.productType !== 'archived',
  ).length;
  console.log(
    `[gen-price-list] version=${version} stamp=${data.priceList && data.priceList.stampQuarter} active=${activeProducts}`,
  );
}

main();
