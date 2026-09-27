#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=pr-ci-main-ref-fallback Date=2026-09-27
// Audit trail: git log -- scripts/validate-product-publication.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildRegistry, renderMarkdown } from './truth/product-registry.mjs';
import { buildLifecycle, renderMarkdown as renderLifecycle } from './truth/product-lifecycle.mjs';
import { checkPriceListVersions } from './truth/price-list-versions.mjs';
import { buildValuation, renderMarkdown as renderValuation } from './truth/product-valuation.mjs';
import { buildFulfilment, renderMarkdown as renderFulfilment } from './truth/product-fulfilment.mjs';
import { buildBacklog, renderMarkdown as renderBacklog } from './truth/product-readiness-backlog.mjs';
import { render as renderRunbook } from './truth/generate-fulfilment-runbook.mjs';
import { build as buildFirehoseChapter5Preview, OUT_PATHS as FIREHORSE_CHAPTER5_OUT_PATHS } from './truth/generate-firehorse-store-preview-data.mjs';

const ROOT = resolve(process.cwd());
const CATALOG_VERSION = '1.33';
const CONSULTING_VERSION = '1.33';
const EFFECTIVE = '2026-09-25';
const BUY_EFFECTIVE = '2026-08-30';
const LIFETIME_PAGE_EFFECTIVE = '2026-08-30';
const NEXT_REVIEW = '2026-11-15';
const CONSULTING_NEXT_REVIEW = '2026-11-30';
const CONSULTING_EFFECTIVE = '2026-09-14';
const EXPECTED_INDEPENDENT_IDS = ['LF-ONTOLOGY-25', 'LWM-ONT-SOVEREIGN'];
// Serious products that carry a 1:1 Lifetime consulting package (LTF-CONSULT-001..013).
const CONSULTING_MAPPED_IDS = [
  'DWS-EU-STARTER',
  'DWS-EU-PILOT',
  'DWS-AEGIS-PILOT-001',
  'DWS-AEGIS-001',
  'LIFETIME-BUNDLE-2026',
  'DWS-CLIMATE-001',
  'DWS-SOVEREIGN-DB-001',
  'edge-node-gn100',
  'LF-SITROOM-001',
  'LF-DGX-SPARK',
  'LF-IGX-ORIN',
  'LF-NVIDIA-INSTALL',
  'aws-consultancy',
];
// HIC 2026-09-23: Lifetime web services join the Serious /buy/ portfolio (no consulting package).
const EXPECTED_SERIOUS_IDS = [
  ...CONSULTING_MAPPED_IDS,
  'LIFETIME-WEB-STARTER',
  'LIFETIME-WEBSTORE-MINI',
];
const EXPECTED_PACKAGE_IDS = CONSULTING_MAPPED_IDS.map(
  (_, index) => `LTF-CONSULT-${String(index + 1).padStart(3, '0')}`,
);
const PUBLICATION_FILES = [
  'dws10.com/config/products.json',
  'landing-pages/dws10-com/config/products.json',
  'dws10.com/buy/index.html',
  'landing-pages/dws10-com/buy/index.html',
  'dws10.com/price-list/index.html',
  'landing-pages/dws10-com/price-list/index.html',
  'lifetime.fi/config/consulting-packages.json',
  'landing-pages/lifetime-fi/config/consulting-packages.json',
  'lifetime.fi/price-list/index.html',
  'landing-pages/lifetime-fi/price-list/index.html',
];
const DUAL_ROOTS = [
  ['dws6.com/', 'landing-pages/dws6-com/'],
  ['dws10.com/', 'landing-pages/dws10-com/'],
  ['onelifetime.world/', 'landing-pages/onelifetime-world/'],
  ['lifetime.fi/', 'landing-pages/lifetime-fi/'],
];
const errors = [];
const abs = (path) => resolve(ROOT, path);
const text = (path) => readFileSync(abs(path), 'utf8');
const json = (path) => JSON.parse(text(path));
const addError = (message) => errors.push(message);
const sameArray = (left, right) =>
  Array.isArray(left) &&
  left.length === right.length &&
  left.every((value, index) => value === right[index]);
const isArchived = (product) => product?.archived === true || product?.productType === 'archived';
const isBlue = (product) => product?.deploymentColor === 'blue';

function gitOutput(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}
let catalog;
let consulting;
try {
  catalog = json('dws10.com/config/products.json');
} catch (error) {
  addError(`Catalog JSON invalid: ${error.message}`);
  catalog = {};
}
try {
  consulting = json('lifetime.fi/config/consulting-packages.json');
} catch (error) {
  addError(`Consulting JSON invalid: ${error.message}`);
  consulting = {};
}

const products = Object.values(catalog.products || {});
const subscriptions = Object.values(catalog.subscriptions || {});
const archived = products.filter(isArchived);
const blue = products.filter((product) => isBlue(product) && !isArchived(product));
const overlap = products.filter((product) => isBlue(product) && isArchived(product));
const publicProducts = products.filter((product) => !isBlue(product) && !isArchived(product));
const portfolio = catalog.commercialPortfolio || {};
const seriousIds = portfolio.seriousProductIds || [];
const seriousSet = new Set(seriousIds);
const supportingProducts = publicProducts.filter((product) => !seriousSet.has(product.id));
const packages = consulting.packages || [];

if (products.length !== 138)
  addError(`Product accounting: expected 138 total, found ${products.length}`);
if (publicProducts.length !== 72)
  addError(
    `Product accounting: expected 72 public non-BLUE non-archived, found ${publicProducts.length}`,
  );
if (blue.length !== 65) addError(`Product accounting: expected 65 BLUE, found ${blue.length}`);
if (overlap.length)
  overlap.forEach((product) => addError(`[${product.id}] record is both BLUE and archived`));
if (publicProducts.length + blue.length + archived.length !== products.length) {
  addError(
    `Product accounting does not reconcile: public ${publicProducts.length} + BLUE ${blue.length} + archived ${archived.length} != total ${products.length}`,
  );
}

for (const [label, actual, expected] of [
  ['priceVersion', catalog.priceVersion, CATALOG_VERSION],
  ['priceList.version', catalog.priceList?.version, CATALOG_VERSION],
  ['commercialPortfolio.version', portfolio.version, CATALOG_VERSION],
  ['consulting.version', consulting.version, CONSULTING_VERSION],
]) {
  if (actual !== expected) addError(`${label}: expected ${expected}, found ${String(actual)}`);
}
for (const [label, actual, expected] of [
  ['priceList.effectiveDate', catalog.priceList?.effectiveDate, EFFECTIVE],
  ['priceList.nextReviewDate', catalog.priceList?.nextReviewDate, NEXT_REVIEW],
  ['commercialPortfolio.effectiveDate', portfolio.effectiveDate, EFFECTIVE],
  ['commercialPortfolio.nextReviewDate', portfolio.nextReviewDate, NEXT_REVIEW],
  ['consulting.effectiveDate', consulting.effectiveDate, CONSULTING_EFFECTIVE],
  ['consulting.nextReviewDate', consulting.nextReviewDate, CONSULTING_NEXT_REVIEW],
]) {
  if (actual !== expected) addError(`${label}: expected ${expected}, found ${String(actual)}`);
}

if (!sameArray(portfolio.independentProductIds || [], EXPECTED_INDEPENDENT_IDS)) {
  addError(
    `Independent product IDs/order differ from the fixed mapping: ${JSON.stringify(portfolio.independentProductIds)}`,
  );
}
if (new Set(portfolio.independentProductIds || []).size !== 2)
  addError(
    `Independent product IDs must be 2 unique IDs; found ${new Set(portfolio.independentProductIds || []).size}`,
  );
for (const id of EXPECTED_INDEPENDENT_IDS) {
  const product = catalog.products?.[id] || catalog.subscriptions?.[id];
  if (!product) addError(`[${id}] independent product missing from catalog`);
  else if (isBlue(product) || isArchived(product))
    addError(`[${id}] independent product is BLUE or archived`);
}
if (!sameArray(seriousIds, EXPECTED_SERIOUS_IDS)) {
  addError(
    `Serious product IDs/order differ from the fixed mapping: ${JSON.stringify(seriousIds)}`,
  );
}
if (new Set(seriousIds).size !== EXPECTED_SERIOUS_IDS.length)
  addError(
    `Serious product IDs must be ${EXPECTED_SERIOUS_IDS.length} unique IDs; found ${new Set(seriousIds).size}`,
  );
for (const id of EXPECTED_SERIOUS_IDS) {
  const product = catalog.products?.[id];
  if (!product) addError(`[${id}] serious product missing from catalog`);
  else if (isBlue(product) || isArchived(product))
    addError(`[${id}] serious product is BLUE or archived`);
}
const definitions = portfolio.definitions || {};
for (const key of ['serious', 'supporting', 'independent', 'blue', 'archive']) {
  if (!definitions[key]?.description)
    addError(`commercialPortfolio.definitions.${key}.description is required`);
}
if (definitions.serious?.publicSalesEligible !== true)
  addError('Serious definition must be public-sales eligible');
if (definitions.supporting?.publicSalesEligible !== true)
  addError('Supporting definition must be public-sales eligible');
if (definitions.independent?.publicSalesEligible !== true)
  addError('Independent definition must be public-sales eligible');
if (definitions.independent?.expectedProductCount !== 2)
  addError('Independent definition must expect exactly 2 products');
if (
  definitions.blue?.publicSalesEligible !== false ||
  !definitions.blue?.activePublicationException
) {
  addError(
    'BLUE definition must include a justified active publication exception and publicSalesEligible:false',
  );
}
if (definitions.archive?.publicSalesEligible !== false || definitions.archive?.active !== false) {
  addError('Archive definition must be inactive and publicSalesEligible:false');
}
const surfaces = portfolio.surfaces || {};
const broadSurfaceValid =
  surfaces.priceList?.path === '/price-list/' &&
  surfaces.priceList?.expectedProductCount === publicProducts.length &&
  surfaces.priceList?.includesSubscriptions === true &&
  surfaces.priceList?.productRule === 'non-BLUE, non-archived products plus subscriptions';
const blueExceptionValid =
  definitions.blue?.publicSalesEligible === false &&
  Boolean(definitions.blue?.activePublicationException);
if (
  surfaces.buy?.path !== '/buy/' ||
  surfaces.buy?.expectedProductCount !== EXPECTED_SERIOUS_IDS.length ||
  surfaces.buy?.productSource !== 'commercialPortfolio.seriousProductIds'
) {
  addError(
    `commercialPortfolio.surfaces.buy must govern exactly ${EXPECTED_SERIOUS_IDS.length} serious products from seriousProductIds`,
  );
}
if (!broadSurfaceValid) {
  addError(
    `commercialPortfolio.surfaces.priceList must govern ${publicProducts.length} public products plus subscriptions`,
  );
}
if (
  surfaces.lifetimeConsulting?.configPath !== '/config/consulting-packages.json' ||
  surfaces.lifetimeConsulting?.expectedPackageCount !== 13
) {
  addError(
    'commercialPortfolio.surfaces.lifetimeConsulting must govern 13 local consulting packages',
  );
}
for (const product of products) {
  if (isArchived(product)) continue;
  if (isBlue(product)) {
    if (!blueExceptionValid)
      addError(`[${product.id}] active BLUE product has no justified publication exception`);
  } else if (!broadSurfaceValid) {
    addError(`[${product.id}] active public product has no valid broad DWS price-list surface`);
  }
}
const REQUIRED_PACKAGE_FIELDS = [
  'id',
  'owner',
  'name',
  'buyer',
  'supportedProductId',
  'supportedProduct',
  'outcomeScope',
  'workflow',
  'deliverable',
  'inputs',
  'deliveryWindow',
  'acceptanceBoundary',
  'price',
  'exclusions',
];
if (consulting.owner !== 'Lifetime Oy')
  addError(`Consulting owner must be Lifetime Oy; found ${String(consulting.owner)}`);
if (packages.length !== 13)
  addError(`Expected exactly 13 consulting packages, found ${packages.length}`);
if (
  !sameArray(
    packages.map((item) => item.id),
    EXPECTED_PACKAGE_IDS,
  )
) {
  addError(
    `Consulting package IDs/order differ from LTF-CONSULT-001..013: ${JSON.stringify(packages.map((item) => item.id))}`,
  );
}
if (
  !sameArray(
    packages.map((item) => item.supportedProductId),
    CONSULTING_MAPPED_IDS,
  )
) {
  addError(
    `Consulting supportedProductId mapping differs from fixed serious mapping: ${JSON.stringify(packages.map((item) => item.supportedProductId))}`,
  );
}
const packageIds = new Set();
const mappedProductIds = new Set();
for (const item of packages) {
  const diagnosticId = item?.id || 'unknown-package';
  for (const field of REQUIRED_PACKAGE_FIELDS) {
    const value = item?.[field];
    if (value === undefined || value === null || value === '')
      addError(`[${diagnosticId}] missing required package field ${field}`);
  }
  if (item?.owner !== 'Lifetime Oy') addError(`[${diagnosticId}] owner must be Lifetime Oy`);
  if (packageIds.has(item?.id)) addError(`[${diagnosticId}] duplicate consulting package ID`);
  if (mappedProductIds.has(item?.supportedProductId))
    addError(`[${diagnosticId}] duplicate supportedProductId ${item?.supportedProductId}`);
  packageIds.add(item?.id);
  mappedProductIds.add(item?.supportedProductId);
  if (!seriousSet.has(item?.supportedProductId))
    addError(`[${diagnosticId}] maps to non-serious product ${item?.supportedProductId}`);
  if (!catalog.products?.[item?.supportedProductId])
    addError(`[${diagnosticId}] supported product ${item?.supportedProductId} is missing`);
  const price = item?.price;
  if (
    !price ||
    price.currency !== 'EUR' ||
    !Number.isFinite(price.amount) ||
    price.amount <= 0 ||
    !['fixed', 'fixed-scope'].includes(price.basis) ||
    typeof price.startingPrice !== 'boolean' ||
    typeof price.display !== 'string' ||
    !price.display.startsWith('€')
  ) {
    addError(
      `[${diagnosticId}] price must be structured EUR with amount, basis, startingPrice and display`,
    );
  }
}
if (packageIds.size !== 13 || mappedProductIds.size !== 13) {
  addError(
    `Consulting mapping must be one-to-one: package IDs=${packageIds.size}, supported product IDs=${mappedProductIds.size}`,
  );
}
// PR CI checks out a depth-1 merge ref with no local `main` or `origin/main`, so resolve the
// base catalog from the first ref that exists, fetching origin/main once if neither does.
function mainCatalogJson() {
  const path = 'dws10.com/config/products.json';
  for (const ref of ['main', 'origin/main']) {
    try {
      return gitOutput(['show', `${ref}:${path}`]);
    } catch {
      // try the next ref
    }
  }
  gitOutput(['fetch', '--quiet', '--depth=1', 'origin', 'main']);
  return gitOutput(['show', `FETCH_HEAD:${path}`]);
}

try {
  const mainCatalog = JSON.parse(mainCatalogJson());
  const currentIds = new Set(products.map((product) => product.id));
  const lostIds = Object.values(mainCatalog.products || {})
    .map((product) => product.id)
    .filter((id) => !currentIds.has(id));
  lostIds.forEach((id) => addError(`[${id}] product ID present on git main was lost`));
} catch (error) {
  addError(`Could not prove product ID preservation against git main: ${error.message}`);
}

const requiredPairs = [
  ['dws10.com/config/products.json', 'landing-pages/dws10-com/config/products.json'],
  ['dws10.com/buy/index.html', 'landing-pages/dws10-com/buy/index.html'],
  ['dws10.com/price-list/index.html', 'landing-pages/dws10-com/price-list/index.html'],
  [
    'lifetime.fi/config/consulting-packages.json',
    'landing-pages/lifetime-fi/config/consulting-packages.json',
  ],
  ['lifetime.fi/price-list/index.html', 'landing-pages/lifetime-fi/price-list/index.html'],
];
const pairs = new Map(
  requiredPairs.map(([source, mirror]) => [`${source}|${mirror}`, [source, mirror]]),
);
try {
  const workingChanged = gitOutput(['diff', '--name-only', 'HEAD', '--'])
    .trim()
    .split('\n')
    .filter(Boolean);
  const committedChanged = workingChanged.length
    ? []
    : gitOutput(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'])
        .trim()
        .split('\n')
        .filter(Boolean);
  const changed = [
    ...workingChanged,
    ...committedChanged,
    ...gitOutput(['ls-files', '--others', '--exclude-standard']).trim().split('\n'),
  ].filter(Boolean);
  for (const path of changed) {
    for (const [sourceRoot, mirrorRoot] of DUAL_ROOTS) {
      let source;
      let mirror;
      if (path.startsWith(sourceRoot)) {
        source = path;
        mirror = mirrorRoot + path.slice(sourceRoot.length);
      } else if (path.startsWith(mirrorRoot)) {
        mirror = path;
        source = sourceRoot + path.slice(mirrorRoot.length);
      } else continue;
      pairs.set(`${source}|${mirror}`, [source, mirror]);
    }
  }
} catch (error) {
  addError(`Could not enumerate changed dual-folder files: ${error.message}`);
}
for (const [source, mirror] of pairs.values()) {
  if (!requiredPairs.some(([requiredSource, requiredMirror]) => requiredSource === source && requiredMirror === mirror)
    && !existsSync(abs(source)) && !existsSync(abs(mirror))) continue;
  if (!existsSync(abs(source))) {
    addError(`Dual-folder source missing: ${source}`);
    continue;
  }
  if (!existsSync(abs(mirror))) {
    addError(`Dual-folder mirror missing: ${mirror}`);
    continue;
  }
  const sourceBytes = readFileSync(abs(source));
  const mirrorBytes = readFileSync(abs(mirror));
  if (!sourceBytes.equals(mirrorBytes))
    addError(`Dual-folder byte mismatch: ${source} != ${mirror}`);
}
for (const path of PUBLICATION_FILES) {
  if (!existsSync(abs(path))) {
    addError(`Publication file missing: ${path}`);
    continue;
  }
  if (text(path).includes('1.26')) addError(`${path}: invented version 1.26 remains`);
}
const buyPage = text('dws10.com/buy/index.html');
const priceListPage = text('dws10.com/price-list/index.html');
const lifetimePage = text('lifetime.fi/price-list/index.html');

// Per-page version checks: each surface has its own document version that must
// be internally consistent (header ↔ meta tag ↔ history block). The catalog
// version in products.json governs pricing data, not HTML document versions.
const PAGE_VERSIONS = {
  'dws10.com/price-list/index.html': {
    version: CATALOG_VERSION,
    effective: EFFECTIVE,
    nextReview: NEXT_REVIEW,
  },
  'lifetime.fi/price-list/index.html': {
    version: '1.28',
    effective: LIFETIME_PAGE_EFFECTIVE,
    nextReview: CONSULTING_NEXT_REVIEW,
  },
  'dws10.com/buy/index.html': { version: '2.0', effective: BUY_EFFECTIVE },
};
for (const [path, page] of [
  ['dws10.com/price-list/index.html', priceListPage],
  ['lifetime.fi/price-list/index.html', lifetimePage],
  ['dws10.com/buy/index.html', buyPage],
]) {
  const expected = PAGE_VERSIONS[path];
  if (!expected) continue;
  if (
    !page.includes(`dws-doc-version" content="${expected.version}"`) &&
    !page.includes(`Version: ${expected.version}`)
  ) {
    addError(`${path}: document version is not ${expected.version}`);
  }
  if (!page.includes(expected.effective))
    addError(`${path}: effective date ${expected.effective} missing`);
}
if (!priceListPage.includes(NEXT_REVIEW))
  addError(`dws10.com/price-list/index.html: next review ${NEXT_REVIEW} missing`);
if (!lifetimePage.includes(CONSULTING_NEXT_REVIEW))
  addError(`lifetime.fi/price-list/index.html: next review ${CONSULTING_NEXT_REVIEW} missing`);
if (
  !buyPage.includes('COMMERCIAL_PORTFOLIO.seriousProductIds') ||
  buyPage.includes('getPageProducts(') ||
  /\.buyPage\s*===/.test(buyPage)
) {
  addError(
    'dws10.com/buy/index.html must render only commercialPortfolio.seriousProductIds, never buyPage/first-13 logic',
  );
}
if (
  !priceListPage.includes('portfolio-badge') ||
  !priceListPage.includes('Serious') ||
  !priceListPage.includes('Independent')
) {
  addError('dws10.com/price-list/index.html must visibly badge Serious and Independent offers');
}
// Every public offer has a one-line caption; tags come from the allowed list (HIC 25.09.2026).
{
  const allowedTags = new Set(definitions.productTags?.allowed || []);
  for (const product of publicProducts) {
    if (!product.caption) addError(`[${product.id}] public offer has no one-line caption`);
    else if (product.caption.length > 160)
      addError(`[${product.id}] caption longer than 160 characters (one line)`);
    for (const tag of product.tags || [])
      if (!allowedTags.has(tag)) addError(`[${product.id}] unknown tag "${tag}"`);
    if (!product.captionFi)
      addError(`[${product.id}] public offer has no Finnish caption (captionFi)`);
    const tags = product.tags || [];
    const order = [...allowedTags];
    if (tags.map((t) => order.indexOf(t)).some((v, i, arr) => i > 0 && v < arr[i - 1]))
      addError(`[${product.id}] tags not in the order of definitions.productTags.allowed`);
    if (tags.includes('Sovereign Cloud') && tags.includes('US Sovereign Cloud'))
      addError(`[${product.id}] cannot be both Sovereign Cloud and US Sovereign Cloud`);
    const recurring =
      ['subscription', 'monthly'].includes(product.type) ||
      ['monthly', 'yearly'].includes(product.billingPeriod);
    if (recurring !== tags.includes('Subscription'))
      addError(
        `[${product.id}] Subscription tag must match a recurring offer (type/billingPeriod)`,
      );
  }
}
// FI chip labels on the price list must equal the dictionary's product_tag_* fi values.
{
  const dict = JSON.parse(
    readFileSync(resolve(ROOT, 'docs/localization/dws-dictionary.json'), 'utf8'),
  ).shared;
  for (const term of Object.values(dict)) {
    if (!term.productTag || term.kind !== 'attribute') continue;
    if (!priceListPage.includes(`${JSON.stringify(term.productTag)}: ${JSON.stringify(term.fi)}`))
      addError(`price-list TAG_FI label for "${term.productTag}" differs from the dictionary`);
    if (!(definitions.productTags?.allowed || []).includes(term.productTag))
      addError(
        `dictionary product tag "${term.productTag}" is not in definitions.productTags.allowed`,
      );
  }
}
// Product groups (HIC 25.09.2026): each group tag renders its own themed section.
for (const tag of definitions.productGroups?.tags || []) {
  if (!priceListPage.includes(`"${tag}"`))
    addError(`dws10.com/price-list/index.html does not group products tagged "${tag}"`);
  if (!publicProducts.some((product) => (product.tags || []).includes(tag)))
    addError(`Product group tag "${tag}" has no public product`);
}
if (priceListPage.includes('Retired (not for sale)'))
  addError('dws10.com/price-list/index.html still renders archived records');
const fetchTargets = [...lifetimePage.matchAll(/fetch\(\"([^\"]+)\"/g)].map((match) => match[1]);
if (!sameArray(fetchTargets, ['/config/consulting-packages.json'])) {
  addError(
    `lifetime.fi/price-list/index.html must fetch only local consulting config; found ${JSON.stringify(fetchTargets)}`,
  );
}
if (
  lifetimePage.includes('dws10.com/config/products.json') ||
  lifetimePage.includes('deploymentColor')
) {
  addError('lifetime.fi/price-list/index.html still references the DWS product/BLUE catalog');
}

console.log('[validate-product-publication] accounting summary');
console.log(`  Products total: ${products.length}`);
console.log(`  Public non-BLUE, non-archived: ${publicProducts.length}`);
console.log(`    Serious: ${seriousIds.length}`);
console.log(`    Supporting: ${supportingProducts.length}`);
console.log(`  BLUE: ${blue.length}`);
console.log(`  Archived: ${archived.length}`);
console.log(`  Subscriptions on broad price list: ${subscriptions.length}`);
console.log(`  Consulting packages: ${packages.length}`);
console.log(`  Publication version: ${catalog.priceVersion || 'missing'}`);

// Product registry (DWS_TRUTH_STANDARD.md row 42): every catalogue ID accounted for, counts reconcile,
// committed registry matches the catalogue.
{
  const reg = buildRegistry(catalog);
  if (!reg.summary.reconciles) addError('Product registry: counts do not reconcile');
  const regPath = resolve(ROOT, 'docs/truth/PRODUCT_REGISTRY.md');
  const current = existsSync(regPath) ? readFileSync(regPath, 'utf8') : '';
  if (current !== renderMarkdown(reg)) {
    addError('Product registry is stale: run node scripts/truth/product-registry.mjs');
  }
  const sme = catalog.commercialPortfolio?.smeCampaignProductIds || [];
  for (const id of sme) {
    const prod = catalog.products?.[id];
    if (!prod) addError(`[${id}] SME campaign product missing from catalogue`);
    else if (!Array.isArray(prod.tags) || !prod.tags.includes('SME'))
      addError(`[${id}] SME campaign product lacks tag "SME"`);
  }
}

// Price-list versions (DWS_TRUTH_STANDARD.md row 44): every frozen snapshot exists unchanged in
// both folders; the current version has a snapshot (HIC 25.09.2026: versions are evidence).
for (const problem of checkPriceListVersions()) addError(`Price-list versions: ${problem}`);

// Product valuation (DWS_TRUTH_STANDARD.md row 45): generated file matches catalogue + model.
{
  const model = JSON.parse(
    readFileSync(resolve(ROOT, 'config/truth/product-valuation-model.json'), 'utf8'),
  );
  const valPath = resolve(ROOT, 'docs/truth/PRODUCT_VALUATION.md');
  const current = existsSync(valPath) ? readFileSync(valPath, 'utf8') : '';
  if (current !== renderValuation(buildValuation(catalog, model), model))
    addError('Product valuation is stale: run node scripts/truth/product-valuation.mjs');
}

// Product lifecycle registry (DWS_TRUTH_STANDARD.md row 43): every ID ever in the catalogue,
// planned, or with a public page has a lifecycle state and evidence; committed file is current.
{
  const readJson = (rel, fallback) => {
    const f = resolve(ROOT, rel);
    return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : fallback;
  };
  const life = buildLifecycle(
    catalog,
    readJson('config/truth/product-lifecycle-ledger.json', { decisions: [] }),
    readJson('config/truth/product-id-history.json', null),
  );
  const lifePath = resolve(ROOT, 'docs/truth/PRODUCT_LIFECYCLE.md');
  const current = existsSync(lifePath) ? readFileSync(lifePath, 'utf8') : '';
  if (current !== renderLifecycle(life))
    addError('Product lifecycle registry is stale: run node scripts/truth/product-lifecycle.mjs');
  const noState = life.rows.filter((r) => !r.state).map((r) => r.id);
  if (noState.length) addError(`Product lifecycle: IDs without state: ${noState.join(', ')}`);
}

// ---------------------------------------------------------------------------
// WARN-ONLY reporting (HIC 27.09.2026): fulfilment/readiness classification and the per-SKU
// backlog are advisory. They are never added to `errors` and never affect the exit code or any
// public/payment surface. They only print a warning when the generated files are stale, so an
// engineer regenerates them the same way the other truth/* generators already work.
{
  const warnings = [];
  const fulfil = buildFulfilment(catalog);
  const fulfilMdPath = resolve(ROOT, 'docs/truth/PRODUCT_FULFILMENT.md');
  const fulfilJsonPath = resolve(ROOT, 'config/truth/product-fulfilment.json');
  const curFulfilMd = existsSync(fulfilMdPath) ? readFileSync(fulfilMdPath, 'utf8') : '';
  const curFulfilJson = existsSync(fulfilJsonPath) ? readFileSync(fulfilJsonPath, 'utf8') : '';
  if (curFulfilMd !== renderFulfilment(fulfil) || curFulfilJson !== JSON.stringify(fulfil, null, 2) + '\n') {
    warnings.push('Product fulfilment classification is stale: run node scripts/truth/product-fulfilment.mjs');
  }
  if (!fulfil.summary.reconciles) {
    warnings.push('Product fulfilment classification: chapter map does not reconcile with the catalogue');
  }

  const backlog = buildBacklog(catalog);
  const backlogMdPath = resolve(ROOT, 'docs/truth/PRODUCT_READINESS_BACKLOG.md');
  const backlogJsonPath = resolve(ROOT, 'config/truth/product-readiness-backlog.json');
  const curBacklogMd = existsSync(backlogMdPath) ? readFileSync(backlogMdPath, 'utf8') : '';
  const curBacklogJson = existsSync(backlogJsonPath) ? readFileSync(backlogJsonPath, 'utf8') : '';
  if (curBacklogMd !== renderBacklog(backlog) || curBacklogJson !== JSON.stringify(backlog, null, 2) + '\n') {
    warnings.push('Product readiness backlog is stale: run node scripts/truth/product-readiness-backlog.mjs');
  }

  // Runbook staleness (same warn-only contract).
  const chaptersDoc = JSON.parse(readFileSync(resolve(ROOT, 'config/truth/product-capability-chapters.json'), 'utf8'));
  const deliveryTemplates = JSON.parse(readFileSync(resolve(ROOT, 'config/truth/product-delivery-templates.json'), 'utf8'));
  const runbookPath = resolve(ROOT, 'docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md');
  const curRunbook = existsSync(runbookPath) ? readFileSync(runbookPath, 'utf8') : '';
  if (curRunbook !== renderRunbook(catalog, chaptersDoc, deliveryTemplates)) {
    warnings.push('Product fulfilment runbook is stale: run node scripts/truth/generate-fulfilment-runbook.mjs');
  }

  // Tranche 2 managed delivery contract completeness — every SKU must carry checkoutUrl,
  // deliveryProfile, fulfilment, acceptanceKpi and exclusions. Advisory only: a missing field
  // here is a content gap to close, not a reason to unpublish or block payment.
  const missingContractFields = [];
  for (const [id, p] of Object.entries(catalog.products || {})) {
    const missing = ['checkoutUrl', 'checkoutMode', 'deliveryProfile', 'fulfilment', 'acceptanceKpi', 'exclusions'].filter(
      (f) => !p[f],
    );
    if (missing.length) missingContractFields.push(`${id} (missing ${missing.join(', ')})`);
  }
  if (missingContractFields.length) {
    warnings.push(`Products missing a full delivery contract: ${missingContractFields.join('; ')}`);
  }

  // Canonical detail page existence — advisory: flags a product whose detailsUrl points at a
  // ../products/*.html file that does not exist on disk (a dead link), never blocks a sale.
  const deadDetailsUrls = [];
  for (const [id, p] of Object.entries(catalog.products || {})) {
    const url = p.detailsUrl;
    if (typeof url === 'string' && url.startsWith('../products/')) {
      const filePath = resolve(ROOT, 'dws10.com/products', url.replace('../products/', ''));
      if (!existsSync(filePath)) deadDetailsUrls.push(`${id} -> ${url}`);
    }
  }
  if (deadDetailsUrls.length) {
    warnings.push(`Products with a dead detailsUrl (no file on disk): ${deadDetailsUrls.join('; ')}`);
  }

  // Product-page dual-folder mirror parity — advisory here (the hard byte-for-byte dual-folder
  // check elsewhere in this file already covers correctness; this just gives an early, scoped
  // warning specific to generated product pages so `python scripts/build_store.py` output is
  // never left unsynced silently).
  const productsDir = resolve(ROOT, 'dws10.com/products');
  const mirrorProductsDir = resolve(ROOT, 'landing-pages/dws10-com/products');
  if (existsSync(productsDir) && existsSync(mirrorProductsDir)) {
    const driftFiles = [];
    for (const entry of readdirSync(productsDir, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const file = entry.name;
      const a = resolve(productsDir, file);
      const b = resolve(mirrorProductsDir, file);
      if (!existsSync(b) || readFileSync(a, 'utf8') !== readFileSync(b, 'utf8')) {
        driftFiles.push(file);
      }
    }
    if (driftFiles.length) {
      warnings.push(
        `Product page mirror drift (run rsync dws10.com/products/ -> landing-pages/dws10-com/products/): ${driftFiles.length} file(s), e.g. ${driftFiles.slice(0, 5).join(', ')}`,
      );
    }
  }

  // Firehorse Chapter 5 store-preview mirror staleness (HIC 2026-09-27) — advisory only.
  // dws6.com/dashboard/firehorse/store-preview.html renders a same-origin JSON mirror of the 9
  // Chapter 5 (Firehorse applications) catalogue records, generated by
  // scripts/truth/generate-firehorse-store-preview-data.mjs. Reuse that generator's own build()
  // rather than re-deriving the 9-SKU field extraction here, and just diff its deterministic
  // output against what is currently on disk (both dual-folder copies).
  try {
    const firehoseData = JSON.stringify(buildFirehoseChapter5Preview(), null, 2) + '\n';
    const staleFirehorseCopies = [];
    for (const p of FIREHORSE_CHAPTER5_OUT_PATHS) {
      const cur = existsSync(p) ? readFileSync(p, 'utf8') : '';
      if (cur !== firehoseData) staleFirehorseCopies.push(p.replace(`${ROOT}/`, ''));
    }
    if (staleFirehorseCopies.length) {
      warnings.push(
        `Firehorse Chapter 5 store-preview mirror is stale: run node scripts/truth/generate-firehorse-store-preview-data.mjs (${staleFirehorseCopies.join(', ')})`,
      );
    }
  } catch (error) {
    warnings.push(`Firehorse Chapter 5 store-preview mirror could not be checked: ${error.message}`);
  }

  if (warnings.length) {
    console.warn(`[validate-product-publication] WARN — ${warnings.length} advisory notice(s) (non-blocking):`);
    warnings.forEach((w) => console.warn(`  ! ${w}`));
  } else {
    console.log(
      `[validate-product-publication] advisory OK — fulfilment classification and readiness backlog current (${fulfil.summary.totalProducts} products, ${backlog.summary.totalOpenIssues} open backlog issues)`,
    );
  }
}

if (errors.length) {
  console.error(`[validate-product-publication] FAIL — ${errors.length} violation(s)`);
  errors.forEach((error) => console.error(`  ✗ ${error}`));
  process.exit(1);
}
console.log(
  '[validate-product-publication] OK — governed publication model is internally consistent',
);
