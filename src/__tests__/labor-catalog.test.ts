import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(__dirname, "..", "..");
const PRODUCTS = JSON.parse(
  readFileSync(resolve(ROOT, "dws10.com/config/products.json"), "utf8"),
);
const MIRROR = JSON.parse(
  readFileSync(resolve(ROOT, "landing-pages/dws10-com/config/products.json"), "utf8"),
);

describe("labor-anchored catalog / mirror sync", () => {
  it("dws10.com and landing-pages products.json are byte-identical", () => {
    const a = readFileSync(resolve(ROOT, "dws10.com/config/products.json"));
    const b = readFileSync(resolve(ROOT, "landing-pages/dws10-com/config/products.json"));
    expect(a.equals(b)).toBe(true);
  });

  it("priceVersion is at the 1.14 labor-anchored baseline or newer", () => {
    const v = String(PRODUCTS.priceVersion ?? "");
    const [maj, min] = v.split(".").map((n) => Number.parseInt(n, 10));
    expect(maj * 1000 + min).toBeGreaterThanOrEqual(1014);
    expect(MIRROR.priceVersion).toBe(PRODUCTS.priceVersion);
  });
});

describe("labor-anchored catalog / SKU schema (§13.8)", () => {
  const labor = Object.entries(
    (PRODUCTS.products ?? {}) as Record<string, Record<string, unknown>>,
  ).filter(([, p]) => p && (p as { tier?: unknown }).tier !== undefined);

  it("loaded at least 60 labor-anchored rows (T0–T4 + Land + Industry)", () => {
    expect(labor.length).toBeGreaterThanOrEqual(60);
  });

  it("every labor-anchored SKU carries the required §13.8 fields", () => {
    const missing: string[] = [];
    for (const [sku, p] of labor) {
      for (const f of ["sku", "tier", "priceUnit", "agents", "deploymentColor", "priceVersion"]) {
        if (p[f] === undefined || p[f] === null) missing.push(`${sku}.${f}`);
      }
      // nextUpsellSku may be null for terminal SKUs but must be defined.
      if (p.nextUpsellSku === undefined) missing.push(`${sku}.nextUpsellSku`);
    }
    expect(missing).toEqual([]);
  });

  it("every T1+ non-land SKU includes a replaces.role/replaces.fteCount", () => {
    const offenders: string[] = [];
    for (const [sku, p] of labor) {
      const t = String(p.tier);
      if (["T1", "T2", "T3", "T4"].includes(t)) {
        const r = p.replaces as { role?: unknown; fteCount?: unknown } | undefined;
        if (!r || typeof r !== "object" || !r.role || typeof r.fteCount !== "number") {
          offenders.push(sku);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("every T0 SKU is deploymentColor:blue (pilot-only)", () => {
    const offenders: string[] = [];
    for (const [sku, p] of labor) {
      if (p.tier === "T0" && p.deploymentColor !== "blue") offenders.push(sku);
    }
    expect(offenders).toEqual([]);
  });
});

describe("labor-anchored catalog / LAND-* engagement + agent rule", () => {
  const landSkus = Object.entries(
    (PRODUCTS.products ?? {}) as Record<string, Record<string, unknown>>,
  ).filter(([sku]) => sku.startsWith("LAND-"));

  it("every LAND-* SKU bundles both an engagement and at least one agent", () => {
    expect(landSkus.length).toBeGreaterThanOrEqual(10);
    for (const [sku, p] of landSkus) {
      // Engagement evidence: description mentions a delivery format (sprint /
      // workshop / audit / training / onboarding / accelerator / bootcamp /
      // pilot / programme / literacy course).
      const desc = String(p.description ?? "").toLowerCase();
      const hasEngagement = /sprint|workshop|audit|training|onboard|accelerator|bootcamp|pilot|programme|program|literacy/.test(desc);
      expect(hasEngagement, `${sku} description missing engagement keyword: "${desc}"`).toBe(true);

      // Agent attach evidence: agents[] non-empty AND points to a real catalog SKU.
      const agents = Array.isArray(p.agents) ? (p.agents as string[]) : [];
      expect(agents.length, `${sku} must include at least one agent`).toBeGreaterThanOrEqual(1);

      const attach = (p.attachedAgentSku ?? p.nextUpsellSku) as string | null | undefined;
      expect(attach, `${sku} must point to an attached agent SKU`).toBeTruthy();
    }
  });
});

describe("price-list HTML snapshot diff", () => {
  const greenHtml = readFileSync(resolve(ROOT, "Learn/green-pricelist-latest.html"), "utf8");
  const pilotHtml = readFileSync(resolve(ROOT, "Learn/pilot-pricelist-latest.html"), "utf8");

  it("Green list contains the labor-anchor hero and no Blue/pilot SKUs", () => {
    expect(greenHtml).toContain("Price AI like labor, not like a tool.");
    // No T0/Blue SKU code should appear on the Green list.
    expect(greenHtml).not.toMatch(/CMP-T0|SS-T0|MO-T0/);
    expect(greenHtml).toMatch(/priceVersion 1\.\d+/);
  });

  it("Green list HTML wires the labor-anchored section + helpers", () => {
    expect(greenHtml).toContain("Skilled Agents Catalog");
    // The renderer ships the Product / Tier / Replaces column header.
    expect(greenHtml).toContain("Product / Tier / Replaces");
  });

  it("Blue/pilot list contains tier badges and the Labor Anchor column", () => {
    expect(pilotHtml).toContain("Labor Anchor");
    expect(pilotHtml).toContain("Next Upsell");
    expect(pilotHtml).toMatch(/CMP-T1|SS-T2|ESG-T3/);
  });
});
