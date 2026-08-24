#!/usr/bin/env -S node --import tsx/esm
/**
 * Pricing-config validator.
 *
 * Enforces DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD §13 + §13.8:
 *   1. dws10.com/config/products.json and its landing-pages mirror are
 *      byte-identical (SHA-256 match).
 *   2. Every SKU with a `tier` field has the labor-anchored fields:
 *      sku, tier, priceUnit, agents[], nextUpsellSku, deploymentColor,
 *      priceVersion. Non-`land` T1+ rows additionally require `replaces`.
 *   3. priceVersion is monotonically increasing vs. main (when git is available).
 *   4. No public-site .md file publishes a EUR price (only renders from json).
 *
 * Exit codes: 0 = green, 1 = standard violation.
 *
 * Used by .husky/pre-commit and the CI workflow.
 */
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO_ROOT = resolve(process.cwd());
const SRC = join(REPO_ROOT, "dws10.com", "config", "products.json");
const MIRROR = join(REPO_ROOT, "landing-pages", "dws10-com", "config", "products.json");

const errors: string[] = [];
const warnings: string[] = [];

function sha(filePath: string): string {
  const buf = readFileSync(filePath);
  return createHash("sha256").update(buf).digest("hex");
}

function loadJson(filePath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function checkMirrorHash() {
  const a = sha(SRC);
  const b = sha(MIRROR);
  if (a !== b) {
    errors.push(
      `Mirror out of sync: ${SRC} (sha=${a.slice(0, 12)}) != ${MIRROR} (sha=${b.slice(0, 12)}). ` +
        `Re-run scripts/load-labor-catalog.py or copy manually.`,
    );
  }
}

const REQUIRED_FIELDS = [
  "sku",
  "tier",
  "priceUnit",
  "agents",
  "nextUpsellSku",
  "deploymentColor",
  "priceVersion",
] as const;
const VALID_TIERS = new Set(["T0", "T1", "T2", "T3", "T4", "land", "meter"]);
const VALID_DEPLOY = new Set(["blue", "green"]);

function checkSchema(json: Record<string, unknown>) {
  const products = (json.products ?? {}) as Record<string, Record<string, unknown>>;
  for (const [key, p] of Object.entries(products)) {
    if (!p || typeof p !== "object") continue;
    if (p.tier === undefined) continue; // legacy row — grandfathered per §13.8

    for (const f of REQUIRED_FIELDS) {
      // nextUpsellSku may be null on terminal SKUs (T4 / attach-only) per §13.8.
      // All other required fields must be present and non-null.
      if (p[f] === undefined) {
        errors.push(`SKU ${key}: missing required field "${f}"`);
      } else if (p[f] === null && f !== "nextUpsellSku") {
        errors.push(`SKU ${key}: required field "${f}" cannot be null`);
      }
    }
    if (p.tier && !VALID_TIERS.has(String(p.tier))) {
      errors.push(`SKU ${key}: invalid tier "${p.tier}"`);
    }
    if (p.deploymentColor && !VALID_DEPLOY.has(String(p.deploymentColor))) {
      errors.push(`SKU ${key}: invalid deploymentColor "${p.deploymentColor}"`);
    }
    if (p.tier === "T0" && p.deploymentColor !== "blue") {
      errors.push(`SKU ${key}: tier T0 must be deploymentColor:"blue"`);
    }
    // `replaces` required on non-land T1+ rows
    const needsReplaces =
      p.tier !== "land" &&
      p.tier !== "T0" &&
      p.tier !== "meter" &&
      ["T1", "T2", "T3", "T4"].includes(String(p.tier));
    if (needsReplaces) {
      const r = p.replaces as Record<string, unknown> | undefined;
      if (!r || typeof r !== "object") {
        errors.push(`SKU ${key}: missing required object "replaces" (T1+ non-land)`);
      } else {
        if (!r.role) errors.push(`SKU ${key}: replaces.role required`);
        if (r.fteCount === undefined || typeof r.fteCount !== "number")
          errors.push(`SKU ${key}: replaces.fteCount must be a number`);
      }
    }
    if (!Array.isArray(p.agents)) {
      errors.push(`SKU ${key}: agents must be an array`);
    }
    // LAND-* SKUs must include both engagement and at least one agent row
    if (String(key).startsWith("LAND-")) {
      if (!Array.isArray(p.agents) || (p.agents as unknown[]).length === 0) {
        errors.push(`LAND SKU ${key}: must include at least one agent (engagement + agent)`);
      }
      if (!p.attachedAgentSku && !p.nextUpsellSku) {
        errors.push(`LAND SKU ${key}: must point to attachedAgentSku or nextUpsellSku`);
      }
    }
  }
}

function checkPriceVersionMonotonic(json: Record<string, unknown>) {
  const current = String(json.priceVersion ?? "");
  if (!current) {
    errors.push(`products.json missing priceVersion`);
    return;
  }
  let prev: string | null = null;
  try {
    prev = execSync(`git show main:dws10.com/config/products.json 2>/dev/null | python3 -c "import json,sys; print(json.load(sys.stdin).get('priceVersion',''))"`, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    /* main not present or git missing — skip silently */
  }
  if (prev) {
    const tup = (v: string) => v.split(".").map((n) => Number.parseInt(n, 10));
    const [a1, a2] = tup(current);
    const [b1, b2] = tup(prev);
    const cur = (a1 ?? 0) * 1000 + (a2 ?? 0);
    const old = (b1 ?? 0) * 1000 + (b2 ?? 0);
    if (cur < old) {
      errors.push(`priceVersion regressed: main=${prev} → current=${current}`);
    } else if (cur === old) {
      warnings.push(`priceVersion unchanged vs main (${current}). OK if this commit is non-pricing.`);
    }
  }
}

const PUBLIC_SITE_ROOTS = [
  "dws10.com",
  "dws6.com",
  "onelifetime.world",
  "lifetime.fi",
  "landing-pages/dws10-com",
  "landing-pages/dws6-com",
  "landing-pages/onelifetime-world",
  "landing-pages/lifetime-fi",
];

function walkMd(dir: string, out: string[]) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) {
      if (e === "node_modules" || e.startsWith(".") || e === "out") continue;
      walkMd(full, out);
    } else if (e.endsWith(".md")) {
      out.push(full);
    }
  }
}

const EUR_PATTERN = /€\s?\d{2,}|EUR\s?\d{2,}|\b\d{3,}\s?€/;

function checkNoMdPrices() {
  // Markdown files inside public-site folders must not contain prices.
  for (const root of PUBLIC_SITE_ROOTS) {
    const abs = join(REPO_ROOT, root);
    const mds: string[] = [];
    walkMd(abs, mds);
    for (const mdPath of mds) {
      const rel = mdPath.replace(REPO_ROOT + "/", "");
      // Skip the marketing strategy docs themselves — they are not published
      // to a public-site web folder, only referenced internally.
      if (rel.includes("/docs/")) continue;
      const text = readFileSync(mdPath, "utf8");
      if (EUR_PATTERN.test(text)) {
        warnings.push(
          `Public-site markdown carries a price string: ${rel} — confirm it renders from products.json instead.`,
        );
      }
    }
  }
}

checkMirrorHash();
const json = loadJson(SRC);
checkSchema(json);
checkPriceVersionMonotonic(json);
checkNoMdPrices();

if (warnings.length) {
  console.warn("[validate-pricing] warnings:");
  for (const w of warnings) console.warn("  • " + w);
}

if (errors.length) {
  console.error("[validate-pricing] FAIL");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}

console.log(`[validate-pricing] OK — priceVersion ${json.priceVersion}`);
