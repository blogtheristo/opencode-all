#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const VERSION = "1.25";
const EFFECTIVE = "2026-08-18";
const NEXT_REVIEW = "2026-11-18";
const EXPECTED_SERIOUS_IDS = [
  "DWS-EU-STARTER", "DWS-EU-PILOT", "DWS-AEGIS-PILOT-001", "DWS-AEGIS-001",
  "LIFETIME-BUNDLE-2026", "DWS-CLIMATE-001", "DWS-SOVEREIGN-DB-001",
  "edge-node-gn100", "LF-SITROOM-001", "LF-DGX-SPARK", "LF-IGX-ORIN",
  "LF-NVIDIA-INSTALL", "aws-consultancy",
];
const EXPECTED_PACKAGE_IDS = EXPECTED_SERIOUS_IDS.map((_, index) =>
  `LTF-CONSULT-${String(index + 1).padStart(3, "0")}`,
);
const PUBLICATION_FILES = [
  "dws10.com/config/products.json", "landing-pages/dws10-com/config/products.json",
  "dws10.com/buy/index.html", "landing-pages/dws10-com/buy/index.html",
  "dws10.com/price-list/index.html", "landing-pages/dws10-com/price-list/index.html",
  "lifetime.fi/config/consulting-packages.json", "landing-pages/lifetime-fi/config/consulting-packages.json",
  "lifetime.fi/price-list/index.html", "landing-pages/lifetime-fi/price-list/index.html",
];
const DUAL_ROOTS = [
  ["dws6.com/", "landing-pages/dws6-com/"],
  ["dws10.com/", "landing-pages/dws10-com/"],
  ["onelifetime.world/", "landing-pages/onelifetime-world/"],
  ["lifetime.fi/", "landing-pages/lifetime-fi/"],
];
const errors = [];
const abs = (path) => resolve(ROOT, path);
const text = (path) => readFileSync(abs(path), "utf8");
const json = (path) => JSON.parse(text(path));
const addError = (message) => errors.push(message);
const sameArray = (left, right) =>
  Array.isArray(left) && left.length === right.length && left.every((value, index) => value === right[index]);
const isArchived = (product) => product?.archived === true || product?.productType === "archived";
const isBlue = (product) => product?.deploymentColor === "blue";

function gitOutput(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}
let catalog;
let consulting;
try { catalog = json("dws10.com/config/products.json"); }
catch (error) { addError(`Catalog JSON invalid: ${error.message}`); catalog = {}; }
try { consulting = json("lifetime.fi/config/consulting-packages.json"); }
catch (error) { addError(`Consulting JSON invalid: ${error.message}`); consulting = {}; }

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

if (products.length !== 116) addError(`Product accounting: expected 116 total, found ${products.length}`);
if (publicProducts.length !== 49) addError(`Product accounting: expected 49 public non-BLUE non-archived, found ${publicProducts.length}`);
if (blue.length !== 67) addError(`Product accounting: expected 67 BLUE, found ${blue.length}`);
if (overlap.length) overlap.forEach((product) => addError(`[${product.id}] record is both BLUE and archived`));
if (publicProducts.length + blue.length + archived.length !== products.length) {
  addError(`Product accounting does not reconcile: public ${publicProducts.length} + BLUE ${blue.length} + archived ${archived.length} != total ${products.length}`);
}

for (const [label, actual] of [
  ["priceVersion", catalog.priceVersion],
  ["priceList.version", catalog.priceList?.version],
  ["commercialPortfolio.version", portfolio.version],
  ["consulting.version", consulting.version],
]) {
  if (actual !== VERSION) addError(`${label}: expected ${VERSION}, found ${String(actual)}`);
}
for (const [label, actual, expected] of [
  ["priceList.effectiveDate", catalog.priceList?.effectiveDate, EFFECTIVE],
  ["priceList.nextReviewDate", catalog.priceList?.nextReviewDate, NEXT_REVIEW],
  ["commercialPortfolio.effectiveDate", portfolio.effectiveDate, EFFECTIVE],
  ["commercialPortfolio.nextReviewDate", portfolio.nextReviewDate, NEXT_REVIEW],
  ["consulting.effectiveDate", consulting.effectiveDate, EFFECTIVE],
  ["consulting.nextReviewDate", consulting.nextReviewDate, NEXT_REVIEW],
]) {
  if (actual !== expected) addError(`${label}: expected ${expected}, found ${String(actual)}`);
}

if (!sameArray(seriousIds, EXPECTED_SERIOUS_IDS)) {
  addError(`Serious product IDs/order differ from the fixed mapping: ${JSON.stringify(seriousIds)}`);
}
if (new Set(seriousIds).size !== 13) addError(`Serious product IDs must be 13 unique IDs; found ${new Set(seriousIds).size}`);
for (const id of EXPECTED_SERIOUS_IDS) {
  const product = catalog.products?.[id];
  if (!product) addError(`[${id}] serious product missing from catalog`);
  else if (isBlue(product) || isArchived(product)) addError(`[${id}] serious product is BLUE or archived`);
}
const definitions = portfolio.definitions || {};
for (const key of ["serious", "supporting", "blue", "archive"]) {
  if (!definitions[key]?.description) addError(`commercialPortfolio.definitions.${key}.description is required`);
}
if (definitions.serious?.publicSalesEligible !== true) addError("Serious definition must be public-sales eligible");
if (definitions.supporting?.publicSalesEligible !== true) addError("Supporting definition must be public-sales eligible");
if (definitions.blue?.publicSalesEligible !== false || !definitions.blue?.activePublicationException) {
  addError("BLUE definition must include a justified active publication exception and publicSalesEligible:false");
}
if (definitions.archive?.publicSalesEligible !== false || definitions.archive?.active !== false) {
  addError("Archive definition must be inactive and publicSalesEligible:false");
}
const surfaces = portfolio.surfaces || {};
const broadSurfaceValid =
  surfaces.priceList?.path === "/price-list/" &&
  surfaces.priceList?.expectedProductCount === 49 &&
  surfaces.priceList?.includesSubscriptions === true &&
  surfaces.priceList?.productRule === "non-BLUE, non-archived products plus subscriptions";
const blueExceptionValid =
  definitions.blue?.publicSalesEligible === false && Boolean(definitions.blue?.activePublicationException);
if (surfaces.buy?.path !== "/buy/" || surfaces.buy?.expectedProductCount !== 13 || surfaces.buy?.productSource !== "commercialPortfolio.seriousProductIds") {
  addError("commercialPortfolio.surfaces.buy must govern exactly 13 serious products from seriousProductIds");
}
if (!broadSurfaceValid) {
  addError("commercialPortfolio.surfaces.priceList must govern 49 public products plus subscriptions");
}
if (surfaces.lifetimeConsulting?.configPath !== "/config/consulting-packages.json" || surfaces.lifetimeConsulting?.expectedPackageCount !== 13) {
  addError("commercialPortfolio.surfaces.lifetimeConsulting must govern 13 local consulting packages");
}
for (const product of products) {
  if (isArchived(product)) continue;
  if (isBlue(product)) {
    if (!blueExceptionValid) addError(`[${product.id}] active BLUE product has no justified publication exception`);
  } else if (!broadSurfaceValid) {
    addError(`[${product.id}] active public product has no valid broad DWS price-list surface`);
  }
}
const REQUIRED_PACKAGE_FIELDS = [
  "id", "owner", "name", "buyer", "supportedProductId", "supportedProduct", "outcomeScope",
  "workflow", "deliverable", "inputs", "deliveryWindow", "acceptanceBoundary", "price", "exclusions",
];
if (consulting.owner !== "Lifetime Oy") addError(`Consulting owner must be Lifetime Oy; found ${String(consulting.owner)}`);
if (packages.length !== 13) addError(`Expected exactly 13 consulting packages, found ${packages.length}`);
if (!sameArray(packages.map((item) => item.id), EXPECTED_PACKAGE_IDS)) {
  addError(`Consulting package IDs/order differ from LTF-CONSULT-001..013: ${JSON.stringify(packages.map((item) => item.id))}`);
}
if (!sameArray(packages.map((item) => item.supportedProductId), EXPECTED_SERIOUS_IDS)) {
  addError(`Consulting supportedProductId mapping differs from fixed serious mapping: ${JSON.stringify(packages.map((item) => item.supportedProductId))}`);
}
const packageIds = new Set();
const mappedProductIds = new Set();
for (const item of packages) {
  const diagnosticId = item?.id || "unknown-package";
  for (const field of REQUIRED_PACKAGE_FIELDS) {
    const value = item?.[field];
    if (value === undefined || value === null || value === "") addError(`[${diagnosticId}] missing required package field ${field}`);
  }
  if (item?.owner !== "Lifetime Oy") addError(`[${diagnosticId}] owner must be Lifetime Oy`);
  if (packageIds.has(item?.id)) addError(`[${diagnosticId}] duplicate consulting package ID`);
  if (mappedProductIds.has(item?.supportedProductId)) addError(`[${diagnosticId}] duplicate supportedProductId ${item?.supportedProductId}`);
  packageIds.add(item?.id);
  mappedProductIds.add(item?.supportedProductId);
  if (!seriousSet.has(item?.supportedProductId)) addError(`[${diagnosticId}] maps to non-serious product ${item?.supportedProductId}`);
  if (!catalog.products?.[item?.supportedProductId]) addError(`[${diagnosticId}] supported product ${item?.supportedProductId} is missing`);
  const price = item?.price;
  if (!price || price.currency !== "EUR" || !Number.isFinite(price.amount) || price.amount <= 0 ||
      !["fixed", "fixed-scope"].includes(price.basis) || typeof price.startingPrice !== "boolean" ||
      typeof price.display !== "string" || !price.display.startsWith("€")) {
    addError(`[${diagnosticId}] price must be structured EUR with amount, basis, startingPrice and display`);
  }
}
if (packageIds.size !== 13 || mappedProductIds.size !== 13) {
  addError(`Consulting mapping must be one-to-one: package IDs=${packageIds.size}, supported product IDs=${mappedProductIds.size}`);
}
try {
  const mainCatalog = JSON.parse(gitOutput(["show", "main:dws10.com/config/products.json"]));
  const currentIds = new Set(products.map((product) => product.id));
  const lostIds = Object.values(mainCatalog.products || {}).map((product) => product.id).filter((id) => !currentIds.has(id));
  lostIds.forEach((id) => addError(`[${id}] product ID present on git main was lost`));
} catch (error) {
  addError(`Could not prove product ID preservation against git main: ${error.message}`);
}

const requiredPairs = [
  ["dws10.com/config/products.json", "landing-pages/dws10-com/config/products.json"],
  ["dws10.com/buy/index.html", "landing-pages/dws10-com/buy/index.html"],
  ["dws10.com/price-list/index.html", "landing-pages/dws10-com/price-list/index.html"],
  ["lifetime.fi/config/consulting-packages.json", "landing-pages/lifetime-fi/config/consulting-packages.json"],
  ["lifetime.fi/price-list/index.html", "landing-pages/lifetime-fi/price-list/index.html"],
];
const pairs = new Map(requiredPairs.map(([source, mirror]) => [`${source}|${mirror}`, [source, mirror]]));
try {
  const workingChanged = gitOutput(["diff", "--name-only", "HEAD", "--"]).trim().split("\n").filter(Boolean);
  const committedChanged = workingChanged.length
    ? []
    : gitOutput(["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]).trim().split("\n").filter(Boolean);
  const changed = [
    ...workingChanged,
    ...committedChanged,
    ...gitOutput(["ls-files", "--others", "--exclude-standard"]).trim().split("\n"),
  ].filter(Boolean);
  for (const path of changed) {
    for (const [sourceRoot, mirrorRoot] of DUAL_ROOTS) {
      let source;
      let mirror;
      if (path.startsWith(sourceRoot)) {
        source = path; mirror = mirrorRoot + path.slice(sourceRoot.length);
      } else if (path.startsWith(mirrorRoot)) {
        mirror = path; source = sourceRoot + path.slice(mirrorRoot.length);
      } else continue;
      pairs.set(`${source}|${mirror}`, [source, mirror]);
    }
  }
} catch (error) {
  addError(`Could not enumerate changed dual-folder files: ${error.message}`);
}
for (const [source, mirror] of pairs.values()) {
  if (!existsSync(abs(source))) { addError(`Dual-folder source missing: ${source}`); continue; }
  if (!existsSync(abs(mirror))) { addError(`Dual-folder mirror missing: ${mirror}`); continue; }
  const sourceBytes = readFileSync(abs(source));
  const mirrorBytes = readFileSync(abs(mirror));
  if (!sourceBytes.equals(mirrorBytes)) addError(`Dual-folder byte mismatch: ${source} != ${mirror}`);
}
for (const path of PUBLICATION_FILES) {
  if (!existsSync(abs(path))) { addError(`Publication file missing: ${path}`); continue; }
  if (text(path).includes("1.26")) addError(`${path}: invented version 1.26 remains`);
}
const buyPage = text("dws10.com/buy/index.html");
const priceListPage = text("dws10.com/price-list/index.html");
const lifetimePage = text("lifetime.fi/price-list/index.html");
for (const [path, page] of [
  ["dws10.com/buy/index.html", buyPage],
  ["dws10.com/price-list/index.html", priceListPage],
  ["lifetime.fi/price-list/index.html", lifetimePage],
]) {
  if (!page.includes(`dws-doc-version\" content=\"${VERSION}`) && !page.includes(`Version: ${VERSION}`)) {
    addError(`${path}: current publication version is not ${VERSION}`);
  }
  if (!page.includes(EFFECTIVE)) addError(`${path}: effective date ${EFFECTIVE} missing`);
}
if (!priceListPage.includes(NEXT_REVIEW)) addError(`dws10.com/price-list/index.html: next review ${NEXT_REVIEW} missing`);
if (!lifetimePage.includes(NEXT_REVIEW)) addError(`lifetime.fi/price-list/index.html: next review ${NEXT_REVIEW} missing`);
if (!buyPage.includes("COMMERCIAL_PORTFOLIO.seriousProductIds") || buyPage.includes("getPageProducts(") || /\.buyPage\s*===/.test(buyPage)) {
  addError("dws10.com/buy/index.html must render only commercialPortfolio.seriousProductIds, never buyPage/first-13 logic");
}
if (!priceListPage.includes("portfolio-badge") || !priceListPage.includes("Serious") || !priceListPage.includes("Supporting")) {
  addError("dws10.com/price-list/index.html must visibly classify every public offer as Serious or Supporting");
}
if (priceListPage.includes("Retired (not for sale)")) addError("dws10.com/price-list/index.html still renders archived records");
const fetchTargets = [...lifetimePage.matchAll(/fetch\(\"([^\"]+)\"/g)].map((match) => match[1]);
if (!sameArray(fetchTargets, ["/config/consulting-packages.json"])) {
  addError(`lifetime.fi/price-list/index.html must fetch only local consulting config; found ${JSON.stringify(fetchTargets)}`);
}
if (lifetimePage.includes("dws10.com/config/products.json") || lifetimePage.includes("deploymentColor")) {
  addError("lifetime.fi/price-list/index.html still references the DWS product/BLUE catalog");
}

console.log("[validate-product-publication] accounting summary");
console.log(`  Products total: ${products.length}`);
console.log(`  Public non-BLUE, non-archived: ${publicProducts.length}`);
console.log(`    Serious: ${seriousIds.length}`);
console.log(`    Supporting: ${supportingProducts.length}`);
console.log(`  BLUE: ${blue.length}`);
console.log(`  Archived: ${archived.length}`);
console.log(`  Subscriptions on broad price list: ${subscriptions.length}`);
console.log(`  Consulting packages: ${packages.length}`);
console.log(`  Publication version: ${catalog.priceVersion || "missing"}`);

if (errors.length) {
  console.error(`[validate-product-publication] FAIL — ${errors.length} violation(s)`);
  errors.forEach((error) => console.error(`  ✗ ${error}`));
  process.exit(1);
}
console.log("[validate-product-publication] OK — governed publication model is internally consistent");
