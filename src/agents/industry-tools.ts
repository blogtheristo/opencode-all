/**
 * Industry Tools — 25-Industry Coverage (Tool Plan Phases 2 & 3)
 *
 * Four builtin tools that back the universal `industry-analyst` agent and let
 * every other agent reach industry context without importing the registry:
 *
 *   Phase 2 (GREEN, pure):
 *     - industry_profile_lookup    — registry profile by id or name/alias
 *     - sector_metrics_calculator  — deterministic sector math, one tool, the
 *                                    `metric` parameter supplies the world
 *
 *   Phase 3 (GREEN behind typed parsers — see security note):
 *     - grid_intensity_feed        — live grid carbon intensity (gCO2/kWh)
 *     - carbon_price_feed          — live EUA / carbon price
 *
 * SECURITY — why the Phase 3 feeds are GREEN, not RED:
 *   A generic `fetch_external` is RED because it can return free text carrying
 *   injected instructions, which then taints the session (lethal-trifecta gate).
 *   These two feeds are different: their parsers (`parseGridIntensityResponse`,
 *   `parseCarbonPriceResponse`) emit ONLY numbers, ISO dates, and closed enums,
 *   via assertNumber/assertIsoDate/assertEnum, and reject anything else. A
 *   compromised upstream cannot smuggle instruction text through a parser that
 *   structurally refuses to return strings it did not whitelist. The
 *   parser-rejects-injection behaviour is unit-tested. Classification +
 *   justification live in src/mcp/security/tool-colors.ts.
 *
 * All handlers degrade gracefully (return { error }) — never throw — per
 * AI_AGENT_GUIDELINES.md §2.
 */

import logger from '../utils/logger.js';
import type { AgentContext, ToolDefinition } from './types.js';
import {
  getIndustryById,
  getIndustryByName,
  type IndustryProfile,
} from './data/industry-registry.js';

// ============ PHASE 2a: INDUSTRY PROFILE LOOKUP ============

/**
 * Resolve an industry profile by numeric id or by name/alias.
 * Pure and deterministic — exported for unit testing.
 */
export function lookupIndustryProfile(args: {
  industryId?: number;
  industry?: string;
}): { profile: IndustryProfile } | { error: string } {
  if (typeof args.industryId === 'number') {
    const profile = getIndustryById(args.industryId);
    return profile
      ? { profile }
      : { error: `No industry with id ${args.industryId} (valid ids: 1-25)` };
  }
  if (typeof args.industry === 'string' && args.industry.trim()) {
    const profile = getIndustryByName(args.industry);
    return profile ? { profile } : { error: `No industry matching "${args.industry}"` };
  }
  return { error: 'Provide either industryId (number) or industry (name/alias)' };
}

// ============ PHASE 2b: SECTOR METRICS CALCULATOR ============
//
// Deterministic sector math the LLM must NOT do by hand (latent-vs-deterministic
// boundary, AI_AGENT_GUIDELINES.md §10). One tool; `metric` is the parameter.
// Each metric encodes its formula and a sourced reference so the result is
// auditable. Embedded schedules (e.g. ReFuelEU SAF) are domain knowledge baked
// into the function — this is how Aviation's distinctive needs are covered
// WITHOUT a dedicated pantheon agent.

export interface MetricResult {
  metric: string;
  values: Record<string, number>;
  unit: string;
  formula: string;
  sources: string[];
}

interface MetricDef {
  unit: string;
  formula: string;
  sources: string[];
  /** Required numeric input keys. */
  required: string[];
  compute: (i: Record<string, number>) => Record<string, number>;
}

/** ReFuelEU Aviation (Reg. (EU) 2023/2405) minimum SAF share milestones, % by volume. */
const REFUELEU_SAF_SCHEDULE: Array<[year: number, pct: number]> = [
  [2025, 2],
  [2030, 6],
  [2035, 20],
  [2040, 34],
  [2045, 42],
  [2050, 70],
];

/** SAF mandate % applicable to a given year (most recent milestone <= year). */
export function safMandatePct(year: number): number {
  let pct = 0;
  for (const [milestoneYear, milestonePct] of REFUELEU_SAF_SCHEDULE) {
    if (year >= milestoneYear) pct = milestonePct;
  }
  return pct;
}

const METRICS: Record<string, MetricDef> = {
  pue_wue: {
    unit: 'ratio',
    formula: 'PUE = total facility energy / IT equipment energy; WUE = water litres / IT kWh',
    sources: ['The Green Grid PUE/WUE', 'EN 50600-4-2 / -4-9'],
    required: ['totalFacilityEnergyKWh', 'itEnergyKWh'],
    compute: (i) => {
      const pue = i.totalFacilityEnergyKWh / i.itEnergyKWh;
      const out: Record<string, number> = { pue };
      if (typeof i.waterLitres === 'number' && i.itEnergyKWh > 0) {
        out.wue = i.waterLitres / i.itEnergyKWh;
      }
      return out;
    },
  },
  clinker_factor: {
    unit: 'ratio',
    formula: 'clinker factor = clinker tonnes / cement tonnes (lower is better)',
    sources: ['GCCA Getting the Numbers Right', 'IEA Cement roadmap'],
    required: ['clinkerTonnes', 'cementTonnes'],
    compute: (i) => ({ clinkerFactor: i.clinkerTonnes / i.cementTonnes }),
  },
  saf_blend_gap: {
    unit: 'percent',
    formula: 'gap = max(0, ReFuelEU mandate %(year) − actual blend %)',
    sources: ['ReFuelEU Aviation Regulation (EU) 2023/2405'],
    required: ['year', 'actualBlendPct'],
    compute: (i) => {
      const mandatePct = safMandatePct(i.year);
      return { mandatePct, gapPct: Math.max(0, mandatePct - i.actualBlendPct) };
    },
  },
  aviation_non_co2_forcing: {
    unit: 'tCO2e',
    formula: 'CO2e = CO2 × radiative-forcing multiplier (default 1.9; range ~1.7–3)',
    sources: ['EASA non-CO2 aviation report 2020 (EU MRV)', 'IPCC AR6 effective radiative forcing'],
    required: ['co2Tonnes'],
    compute: (i) => {
      const rf = typeof i.rfMultiplier === 'number' && i.rfMultiplier > 0 ? i.rfMultiplier : 1.9;
      return { rfMultiplier: rf, co2eTonnes: i.co2Tonnes * rf };
    },
  },
  financed_emissions_attribution: {
    unit: 'tCO2e',
    formula:
      'attribution = exposure / enterprise value; financed emissions = attribution × borrower emissions',
    sources: ['PCAF Global GHG Accounting & Reporting Standard, Part A'],
    required: ['exposureEur', 'enterpriseValueEur', 'borrowerEmissionsTCO2e'],
    compute: (i) => {
      const attributionFactor = i.exposureEur / i.enterpriseValueEur;
      return {
        attributionFactor,
        financedEmissionsTCO2e: attributionFactor * i.borrowerEmissionsTCO2e,
      };
    },
  },
  ets_allowance_gap: {
    unit: 'tCO2e',
    formula: 'gap = verified emissions − free allocation; cost = gap × carbon price (if provided)',
    sources: ['EU ETS Directive 2003/87/EC'],
    required: ['verifiedEmissionsTCO2e', 'freeAllocationAllowances'],
    compute: (i) => {
      const gap = i.verifiedEmissionsTCO2e - i.freeAllocationAllowances;
      const out: Record<string, number> = { gapTCO2e: gap };
      if (typeof i.carbonPriceEur === 'number') {
        out.estimatedCostEur = Math.max(0, gap) * i.carbonPriceEur;
      }
      return out;
    },
  },
};

/**
 * Compute a sector metric deterministically.
 * Pure — exported for unit testing.
 */
export function computeSectorMetric(
  metric: string,
  inputs: Record<string, number>,
): MetricResult | { error: string; availableMetrics: string[] } {
  const def = METRICS[metric];
  if (!def) {
    return { error: `Unknown metric "${metric}"`, availableMetrics: Object.keys(METRICS) };
  }
  const missing = def.required.filter(
    (k) => typeof inputs[k] !== 'number' || !Number.isFinite(inputs[k]),
  );
  if (missing.length > 0) {
    return {
      error: `Metric "${metric}" requires numeric inputs: ${missing.join(', ')}`,
      availableMetrics: Object.keys(METRICS),
    };
  }
  return {
    metric,
    values: def.compute(inputs),
    unit: def.unit,
    formula: def.formula,
    sources: def.sources,
  };
}

// ============ PHASE 3: TYPED SCALAR GUARDS ============
//
// The injection firewall. Any value crossing from an external feed into the
// model's context must pass one of these — they return only validated scalars
// and throw on anything else, so free text (instructions) cannot pass through.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

export function assertNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Feed field "${field}" is not a finite number`);
  }
  return value;
}

export function assertIsoDate(value: unknown, field: string): string {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) {
    throw new Error(`Feed field "${field}" is not an ISO 8601 date`);
  }
  return value;
}

export function assertEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  field: string,
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new Error(`Feed field "${field}" is not one of: ${allowed.join(', ')}`);
  }
  return value as T;
}

// ============ PHASE 3a: GRID INTENSITY FEED ============

const GRID_INDEX = ['very low', 'low', 'moderate', 'high', 'very high'] as const;

export interface GridIntensity {
  gCO2PerKWh: number;
  index: (typeof GRID_INDEX)[number];
  from: string;
  to: string;
}

/**
 * Parse a carbonintensity.org.uk /intensity response into typed scalars only.
 * Throws on any non-conforming payload — exported for unit testing (incl. the
 * injection-rejection test that justifies the GREEN classification).
 */
export function parseGridIntensityResponse(json: unknown): GridIntensity {
  const data = (json as { data?: unknown })?.data;
  const first = Array.isArray(data) ? data[0] : undefined;
  if (!first || typeof first !== 'object') {
    throw new Error('Grid intensity payload missing data[0]');
  }
  const row = first as Record<string, unknown>;
  const intensity = row.intensity as Record<string, unknown> | undefined;
  if (!intensity || typeof intensity !== 'object') {
    throw new Error('Grid intensity payload missing intensity object');
  }
  // Prefer actual; fall back to forecast — both must be numbers if present.
  const raw = intensity.actual ?? intensity.forecast;
  return {
    gCO2PerKWh: assertNumber(raw, 'intensity.actual|forecast'),
    index: assertEnum(intensity.index, GRID_INDEX, 'intensity.index'),
    from: assertIsoDate(row.from, 'from'),
    to: assertIsoDate(row.to, 'to'),
  };
}

// ============ PHASE 3b: CARBON PRICE FEED ============

export interface CarbonPrice {
  priceEur: number;
  currency: 'EUR';
  asOf: string;
  instrument: string;
}

/** Allowed instrument identifiers — a closed enum, never free text. */
const CARBON_INSTRUMENTS = ['EUA', 'EUA-FUTURE', 'EUAA', 'CHESTNUT-EUA'] as const;

/**
 * Parse a carbon-price feed response into typed scalars only.
 * Throws on any non-conforming payload — exported for unit testing.
 */
export function parseCarbonPriceResponse(json: unknown): CarbonPrice {
  const o = json as Record<string, unknown>;
  if (!o || typeof o !== 'object') throw new Error('Carbon price payload is not an object');
  const currency = assertEnum(o.currency, ['EUR'] as const, 'currency');
  return {
    priceEur: assertNumber(o.price, 'price'),
    currency,
    asOf: assertIsoDate(o.date ?? o.asOf, 'date'),
    instrument: assertEnum(o.instrument, CARBON_INSTRUMENTS, 'instrument'),
  };
}

// ============ TOOL DEFINITIONS ============

export const INDUSTRY_TOOLS: Record<string, ToolDefinition> = {
  industry_profile_lookup: {
    name: 'industry_profile_lookup',
    description:
      'Look up a Climate IQ industry profile (regulations, emission sources, decarbonization levers, coverage) by numeric id (1-25) or name/alias (e.g. "aviation", "steel", "datacenter").',
    parameters: {
      type: 'object',
      properties: {
        industryId: { type: 'number', description: 'Canonical industry id 1-25' },
        industry: { type: 'string', description: 'Industry name or alias (e.g. "aviation")' },
      },
      required: [],
    },
  },
  sector_metrics_calculator: {
    name: 'sector_metrics_calculator',
    description:
      'Compute a sector decarbonization metric deterministically. Metrics: pue_wue (data centre), clinker_factor (cement), saf_blend_gap + aviation_non_co2_forcing (aviation), financed_emissions_attribution (finance/PCAF), ets_allowance_gap (any ETS sector). Returns the value, formula, and sources.',
    parameters: {
      type: 'object',
      properties: {
        metric: { type: 'string', description: 'Metric name (see description)' },
        inputs: { type: 'object', description: 'Numeric inputs required by the metric' },
      },
      required: ['metric', 'inputs'],
    },
  },
  grid_intensity_feed: {
    name: 'grid_intensity_feed',
    description:
      'Fetch live grid carbon intensity (gCO2/kWh) for CBAM indirect-emissions and clean-energy matching. Returns typed scalars only.',
    parameters: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          enum: ['uk'],
          description: 'Data source (uk = carbonintensity.org.uk)',
        },
      },
      required: [],
    },
  },
  carbon_price_feed: {
    name: 'carbon_price_feed',
    description:
      'Fetch the latest EU ETS allowance (EUA) carbon price in EUR. Returns typed scalars only. Requires EEX_API_KEY; degrades gracefully when unset.',
    parameters: {
      type: 'object',
      properties: {
        instrument: { type: 'string', description: 'Instrument id (default EUA)' },
      },
      required: [],
    },
  },
};

// ============ HANDLER REGISTRATION ============

/** Register industry tool handlers. Mirrors registerKBToolHandlers(). */
export async function registerIndustryToolHandlers(): Promise<void> {
  const { registerToolHandler } = await import('./tools.js');

  registerToolHandler('industry_profile_lookup', async (args: Record<string, unknown>) => {
    return lookupIndustryProfile({
      industryId: typeof args.industryId === 'number' ? args.industryId : undefined,
      industry: typeof args.industry === 'string' ? args.industry : undefined,
    });
  });

  registerToolHandler('sector_metrics_calculator', async (args: Record<string, unknown>) => {
    const metric = String(args.metric ?? '');
    const inputs = (args.inputs as Record<string, number>) || {};
    return computeSectorMetric(metric, inputs);
  });

  registerToolHandler(
    'grid_intensity_feed',
    async (_args: Record<string, unknown>, _context: AgentContext) => {
      try {
        const res = await fetch('https://api.carbonintensity.org.uk/intensity', {
          headers: { Accept: 'application/json', 'User-Agent': 'DWS-IQ-Agent/7.0' },
        });
        if (!res.ok) return { error: `Grid intensity feed HTTP ${res.status}` };
        return parseGridIntensityResponse(await res.json());
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return { error: `Grid intensity feed failed: ${msg}` };
      }
    },
  );

  registerToolHandler(
    'carbon_price_feed',
    async (args: Record<string, unknown>, _context: AgentContext) => {
      const apiKey = process.env.EEX_API_KEY;
      if (!apiKey) {
        return { error: 'carbon_price_feed not configured (EEX_API_KEY unset)' };
      }
      try {
        const instrument = typeof args.instrument === 'string' ? args.instrument : 'EUA';
        const res = await fetch(
          `https://api.eex.com/v1/carbon/price?instrument=${encodeURIComponent(instrument)}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
              'User-Agent': 'DWS-IQ-Agent/7.0',
            },
          },
        );
        if (!res.ok) return { error: `Carbon price feed HTTP ${res.status}` };
        return parseCarbonPriceResponse(await res.json());
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        return { error: `Carbon price feed failed: ${msg}` };
      }
    },
  );

  logger.info('Industry tool handlers registered', {
    tools: [
      'industry_profile_lookup',
      'sector_metrics_calculator',
      'grid_intensity_feed',
      'carbon_price_feed',
    ],
  });
}
