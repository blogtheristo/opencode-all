/**
 * Upsell trigger rules — implements the table in
 * docs/marketing/PRODUCT-CATALOG-UPSELL-TIERS-2026.md §5 ("Trigger rules").
 *
 * Pure function module. No I/O, no DB calls. Callers (the dashboard,
 * the sales CRM webhook, the customer-success report) pass in a
 * CustomerSignals snapshot and receive a `nextSku` recommendation, or
 * `null` if no trigger has fired.
 *
 * Database integrations that consume this MUST use parameterised
 * queries when building the CustomerSignals object — never interpolate
 * user input into SQL.
 */
import { z } from "zod";

export type Tier = "T0" | "T1" | "T2" | "T3" | "T4" | "land" | "meter";

/** Zod schema validating the input signals coming from the dashboard / CRM. */
export const CustomerSignalsSchema = z
  .object({
    /** The customer's current active SKU (e.g. "CMP-T1", "ESG-T3"). */
    currentSku: z.string().min(1),
    /** Current tier (denormalised from currentSku — caller-supplied to avoid lookup). */
    currentTier: z.enum(["T0", "T1", "T2", "T3", "T4", "land", "meter"]),
    /** How many approved/signed outputs this customer has produced. */
    approvedOutputsTotal: z.number().int().nonnegative().default(0),
    /** Monthly approved-outcome counts for the most recent N months, most recent first. */
    monthlyOutcomes: z.array(z.number().int().nonnegative()).default([]),
    /** Distinct active SKUs in the same domain (e.g. ESG: MO-T2 + ED-T2 → 2). */
    sameDomainActiveSkus: z.number().int().nonnegative().default(1),
    /** Free-form text from the latest call/email — searched for verticals & C-level signal. */
    verticalSignals: z.array(z.string()).default([]),
    /** True when CFO or CEO has joined the deal conversation. */
    cfoOrCeoInvolved: z.boolean().default(false),
    /** Count of T3 bundles already attached on the account. */
    t3BundleCount: z.number().int().nonnegative().default(0),
    /** True when the buyer has explicitly pushed back on "AI capability". */
    aiCapabilityPushback: z.boolean().default(false),
  })
  .strict();

export type CustomerSignals = z.infer<typeof CustomerSignalsSchema>;

/** Upsell recommendation returned to the dashboard. */
export interface UpsellRecommendation {
  /** The recommended next SKU code (e.g. "CMP-T2", "ESG-T3"). */
  nextSku: string;
  /** The rule key that fired (used for analytics + audit log). */
  rule: UpsellRuleKey;
  /** Human-readable label rendered as the dashboard banner. */
  reason: string;
}

export type UpsellRuleKey =
  | "T0_TO_T1_FIRST_APPROVED_OUTPUT"
  | "T1_TO_T2_THREE_OUTCOMES_TWO_MONTHS"
  | "T2_TO_T3_SECOND_AGENT_SAME_DOMAIN"
  | "T3_TO_INDUSTRY_POD_VERTICAL_SIGNAL"
  | "T3_TO_T4_CFO_CEO_OR_THREE_T3"
  | "ANY_TO_LAND_AI_CAPABILITY_PUSHBACK";

/** Mapping of (currentSku → next default upsell). The catalog itself is
 *  authoritative; the dashboard SHOULD pass this map in so the function
 *  stays free of catalog coupling. We keep a minimal fallback table for
 *  unit tests and a default banner when the loader isn't ready. */
export const FALLBACK_NEXT_UPSELL: Record<string, string> = {
  // T0 → T1
  "CMP-T0": "CMP-T1",
  "SS-T0": "SS-T1",
  "MO-T0": "MO-T1",
  // T1 → T2 (selected — the dashboard should override with the live catalog)
  "CMP-T1": "CMP-T2",
  "SS-T1": "SS-T2",
  "MO-T1": "MO-T2",
  "ED-T1": "ED-T2",
  "SG-T1": "SG-T2",
  "LOG-T1": "LOG-T2",
  "SOV-T1": "SOV-T2",
  "QG-T1": "QG-T2",
  "CSAT-T1": "CSAT-T2",
  "LF-T1": "LF-T2",
  "CS-T1": "CS-T2",
  "SEO-T1": "SEO-T2",
  "DW-T1": "DW-T2",
  "VIA-T1": "VIA-T2",
  // T2 → T3 (function)
  "CMP-T2": "ESG-T3",
  "SS-T2": "HSE-T3",
  "MO-T2": "ESG-T3",
  "ED-T2": "ESG-T3",
  "SG-T2": "CONSTR-T3",
  "LOG-T2": "CONSTR-T3",
  "SOV-T2": "SOV-T3",
  "CSAT-T2": "GTM-T3",
  "LF-T2": "GTM-T3",
  "CS-T2": "GTM-T3",
  "SEO-T2": "GTM-T3",
  "TH-T2": "WF-T4",
  // T3 → T4
  "ESG-T3": "WF-T4",
  "HSE-T3": "WF-T4",
  "CONSTR-T3": "WF-T4",
  "SOV-T3": "WF-T4",
  "GTM-T3": "WF-T4",
};

/**
 * Returns the recommended next upsell SKU based on §5 trigger rules,
 * or `null` if no trigger has fired.
 *
 * Highest-impact rule wins (T4 outranks T3, T3 outranks T2, etc.).
 * The Land overlay is offered only when the buyer has pushed back —
 * never as a default banner, to avoid "nags".
 *
 * @param rawSignals - Untrusted input; validated via Zod before use.
 * @param nextUpsellLookup - Optional map (sku → nextUpsellSku) sourced from
 *   the live catalog. Defaults to `FALLBACK_NEXT_UPSELL` for unit tests.
 */
export function recommendUpsell(
  rawSignals: unknown,
  nextUpsellLookup: Record<string, string> = FALLBACK_NEXT_UPSELL,
): UpsellRecommendation | null {
  const signals = CustomerSignalsSchema.parse(rawSignals);

  // Rule: T3 → T4 — CFO/CEO involvement OR ≥3 T3 bundles
  if (
    signals.currentTier === "T3" &&
    (signals.cfoOrCeoInvolved || signals.t3BundleCount >= 3)
  ) {
    return {
      nextSku: "WF-T4",
      rule: "T3_TO_T4_CFO_CEO_OR_THREE_T3",
      reason: signals.cfoOrCeoInvolved
        ? "CFO/CEO is in the conversation — propose the Full Skilled Workforce (T4)."
        : "Three or more T3 bundles attached — consolidate under T4 Full Workforce.",
    };
  }

  // Rule: T3 → T3 + Industry Pod — vertical signal in conversation
  if (signals.currentTier === "T3" && hasIndustryVerticalSignal(signals.verticalSignals)) {
    const pod = pickIndustryPod(signals.verticalSignals);
    if (pod) {
      return {
        nextSku: pod,
        rule: "T3_TO_INDUSTRY_POD_VERTICAL_SIGNAL",
        reason: `Vertical signal detected (${pod}). Attach the matching Industry Pod on top of the current T3 bundle.`,
      };
    }
  }

  // Rule: T2 → T3 (function) — second agent in same domain attached
  if (signals.currentTier === "T2" && signals.sameDomainActiveSkus >= 2) {
    const next = nextUpsellLookup[signals.currentSku];
    if (next) {
      return {
        nextSku: next,
        rule: "T2_TO_T3_SECOND_AGENT_SAME_DOMAIN",
        reason: `Second agent attached in the same domain — bundle into ${next} (Function-as-a-Service).`,
      };
    }
  }

  // Rule: T1 → T2 — ≥3 outcomes/month for 2 consecutive months
  if (
    signals.currentTier === "T1" &&
    signals.monthlyOutcomes.length >= 2 &&
    signals.monthlyOutcomes[0] >= 3 &&
    signals.monthlyOutcomes[1] >= 3
  ) {
    const next = nextUpsellLookup[signals.currentSku];
    if (next) {
      return {
        nextSku: next,
        rule: "T1_TO_T2_THREE_OUTCOMES_TWO_MONTHS",
        reason: `≥3 approved outcomes for two months running — graduate to ${next} (Pro tier).`,
      };
    }
  }

  // Rule: T0 → T1 — customer approves first signed output
  if (signals.currentTier === "T0" && signals.approvedOutputsTotal >= 1) {
    const next = nextUpsellLookup[signals.currentSku];
    if (next) {
      return {
        nextSku: next,
        rule: "T0_TO_T1_FIRST_APPROVED_OUTPUT",
        reason: `First signed output approved — convert pilot to ${next} (Starter).`,
      };
    }
  }

  // Rule: ANY → Land overlay — buyer pushback on AI capability
  // Offered only when explicitly triggered; never as a default banner.
  if (signals.aiCapabilityPushback) {
    const landSku = pickLandOverlay(signals.currentSku);
    if (landSku) {
      return {
        nextSku: landSku,
        rule: "ANY_TO_LAND_AI_CAPABILITY_PUSHBACK",
        reason: `Buyer pushed back on AI capability — anchor with ${landSku} (engagement + agent).`,
      };
    }
  }

  return null;
}

/** Map verticals mentioned in conversation → industry pod SKU. */
const INDUSTRY_POD_KEYWORDS: Array<{ keywords: string[]; sku: string }> = [
  { keywords: ["steel", "ETS", "CBAM steel"], sku: "IND-VULCAN" },
  { keywords: ["aluminium", "aluminum"], sku: "IND-TALOS" },
  { keywords: ["cement", "concrete"], sku: "IND-GAIA" },
  { keywords: ["hydrogen", "H2"], sku: "IND-PROM" },
  { keywords: ["battery", "BESS", "battery storage"], sku: "IND-BESS" },
  { keywords: ["maritime", "shipping", "port"], sku: "IND-NEPTUN" },
  { keywords: ["energy", "utility", "power"], sku: "IND-HELIOS" },
  { keywords: ["agri", "circular", "agriculture"], sku: "IND-CERES" },
  { keywords: ["construction site", "site safety"], sku: "IND-MARS" },
];

function hasIndustryVerticalSignal(signals: string[]): boolean {
  return signals.some((raw) => {
    const s = raw.toLowerCase();
    return INDUSTRY_POD_KEYWORDS.some((p) => p.keywords.some((k) => s.includes(k.toLowerCase())));
  });
}

function pickIndustryPod(signals: string[]): string | null {
  for (const raw of signals) {
    const s = raw.toLowerCase();
    for (const p of INDUSTRY_POD_KEYWORDS) {
      if (p.keywords.some((k) => s.includes(k.toLowerCase()))) return p.sku;
    }
  }
  return null;
}

function pickLandOverlay(sku: string): string | null {
  // Map current SKU → best-fit land overlay (engagement-led re-anchor).
  const map: Record<string, string> = {
    "CMP-T0": "LAND-AIL",
    "CMP-T1": "LAND-EUAI",
    "CMP-T2": "LAND-EUAI",
    "SS-T0": "LAND-HSE",
    "SS-T1": "LAND-HSE",
    "SS-T2": "LAND-HSE",
    "MO-T0": "LAND-LCA",
    "MO-T1": "LAND-LCA",
    "MO-T2": "LAND-LCA",
    "ED-T1": "LAND-LCA",
    "ED-T2": "LAND-LCA",
    "SOV-T1": "LAND-SOV",
    "SOV-T2": "LAND-SOV",
    "SG-T1": "LAND-OPS",
    "SG-T2": "LAND-OPS",
    "LOG-T1": "LAND-OPS",
    "LOG-T2": "LAND-OPS",
    "CONSTR-T2": "LAND-OPS",
    "CSAT-T1": "LAND-GTM",
    "CSAT-T2": "LAND-GTM",
    "LF-T1": "LAND-GTM",
    "LF-T2": "LAND-GTM",
    "CS-T1": "LAND-GTM",
    "CS-T2": "LAND-GTM",
    "SEO-T1": "LAND-GTM",
    "SEO-T2": "LAND-GTM",
    "TH-T2": "LAND-THEMIS",
    "ESG-T3": "LAND-CSRD",
    "SOV-T3": "LAND-SOV",
    "CONSTR-T3": "LAND-OPS",
    "GTM-T3": "LAND-GTM",
    "WF-T4": "LAND-WF",
  };
  return map[sku] ?? null;
}
