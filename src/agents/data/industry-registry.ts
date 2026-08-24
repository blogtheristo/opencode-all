/**
 * Industry Registry — Climate IQ 25-Industry Coverage
 *
 * Canonical-grounded, data-backed profile of all 25 EU-regulated industries the
 * platform serves. This is the compression that lets ONE parameterized agent
 * (`industry-analyst.agent.ts`) cover every industry, instead of 25 near-identical
 * pantheon files (see AI_AGENT_GUIDELINES.md §11.2 / §11.4 and the Skill
 * Codification Rule in CLAUDE.md — "the skill describes the process; the
 * invocation supplies the world").
 *
 * SOURCE-OF-TRUTH BOUNDARY (DWS_TRUTH_STANDARD.md):
 *   - `id`, `name`, `tier`, `captainHat`, `primaryRegulations` MIRROR the canonical
 *     registry `dws10.com/config/industries.json` (which itself mirrors /INDUSTRIES.md).
 *     If they disagree, /INDUSTRIES.md wins. The unit test asserts non-drift against
 *     the JSON, so this file cannot silently diverge.
 *   - `keyEmissionSources`, `decarbonizationLevers`, `marketBenchmark`, `dwsOffering`,
 *     `coverageGap` are ENGINEERING DOMAIN KNOWLEDGE (well-established sector
 *     decarbonization practice), NOT canonical "facts". They are advisory inputs to
 *     the analyst agent, not assertions to be propagated as DWS truth claims.
 */

/** A dedicated pantheon agent name, or null when only the universal analyst covers it. */
export type DedicatedAgent =
  | 'helios'
  | 'vulcan'
  | 'gaia'
  | 'juno'
  | 'neptune'
  | 'mars'
  | 'ceres'
  | 'talos'
  | 'prometheus'
  | 'hermes'
  | 'logistics'
  | null;

export interface IndustryProfile {
  /** Canonical industry id (industries.json). */
  id: number;
  /** Canonical industry name (industries.json) — must match exactly. */
  name: string;
  /** Captain-framework tier (1 = first tranche, 2 = second, 3 = folded/platform-only). */
  tier: 1 | 2 | 3;
  /** Captain hat that clusters this industry, or 'platform-only'. */
  captainHat: string;
  /** Existing dedicated pantheon agent, or null (universal analyst only). */
  dedicatedAgent: DedicatedAgent;
  /** Primary EU regulatory exposure (subset of industries.json regulationsInScope). */
  primaryRegulations: string[];
  /** Where this sector's emissions come from (domain knowledge). */
  keyEmissionSources: string[];
  /** Market best efforts — the decarbonization frontier leaders pursue (domain knowledge). */
  decarbonizationLevers: string[];
  /** A concrete market best-practice reference point (domain knowledge). */
  marketBenchmark: string;
  /** What the DWS platform offers this industry today. */
  dwsOffering: string;
  /** What we should offer more of — the gap to close (domain knowledge). */
  coverageGap: string;
}

/**
 * The 25 industries. Ids/names/tiers/hats/regulations mirror
 * dws10.com/config/industries.json (industriesServedTotal: 25).
 */
export const INDUSTRY_REGISTRY: readonly IndustryProfile[] = [
  {
    id: 1,
    name: 'Power & Heat Generation',
    tier: 1,
    captainHat: 'Power & Heat Generation',
    dedicatedAgent: 'helios',
    primaryRegulations: ['ETS / ETS2', 'Fit for 55', 'RED III', 'CSRD'],
    keyEmissionSources: ['Fossil combustion (coal/gas)', 'Heat networks', 'Auxiliary load'],
    decarbonizationLevers: [
      'Renewable build-out',
      'Grid decarbonization',
      'Gas→H2 / co-firing',
      'CCS on thermal plant',
      'Storage + flexibility',
    ],
    marketBenchmark: 'RE100 + 24/7 hourly carbon-free energy matching',
    dwsOffering:
      'Helios agent: ETS allowance modelling, generation-mix emissions, RED III tracking',
    coverageGap: 'Hourly granular CFE matching and PPA carbon attribution',
  },
  {
    id: 2,
    name: 'Iron & Steel Production',
    tier: 1,
    captainHat: 'Iron & Steel',
    dedicatedAgent: 'vulcan',
    primaryRegulations: ['ETS / ETS2', 'CBAM', 'Fit for 55', 'CSRD'],
    keyEmissionSources: ['Blast furnace (coke)', 'Sinter/pellet', 'Process gases'],
    decarbonizationLevers: ['H2-DRI', 'Scrap-EAF route shift', 'CCS/CCU', 'Renewable power'],
    marketBenchmark: 'H2 Green Steel / HYBRIT fossil-free DRI',
    dwsOffering:
      'Vulcan agent: ETS Phase 4 gap, full 42-code CBAM carbon content, BF-vs-EAF pathway',
    coverageGap: 'Scope 3 precursor tracing for downstream steel articles at scale',
  },
  {
    id: 3,
    name: 'Cement & Lime Production',
    tier: 1,
    captainHat: 'Cement & Lime',
    dedicatedAgent: 'gaia',
    primaryRegulations: ['ETS / ETS2', 'CBAM', 'Fit for 55', 'CSRD'],
    keyEmissionSources: ['Calcination (process CO2)', 'Kiln fuel', 'Electricity'],
    decarbonizationLevers: [
      'Clinker substitution (SCMs)',
      'Calcined clay (LC3)',
      'Alternative fuels',
      'CCS/CCUS',
    ],
    marketBenchmark: 'LEILAC direct separation + calcined-clay cements',
    dwsOffering:
      'Gaia agent: clinker-factor modelling, ETS process-emission gap, CBAM cement scope',
    coverageGap: 'CCUS project bankability and captured-CO2 accounting',
  },
  {
    id: 4,
    name: 'Chemicals & Petrochemicals',
    tier: 1,
    captainHat: 'Chemicals & Petrochemicals',
    dedicatedAgent: 'juno',
    primaryRegulations: ['ETS / ETS2', 'CBAM', 'RED III', 'CSRD', 'ESPR'],
    keyEmissionSources: ['Steam cracking', 'Process heat', 'Hydrogen (SMR)', 'N2O/process'],
    decarbonizationLevers: [
      'Electric steam crackers',
      'Green-H2 feedstock',
      'Bio-based feedstock',
      'Process electrification',
    ],
    marketBenchmark: 'Electrically-heated steam cracker (BASF/SABIC/Linde)',
    dwsOffering: 'Juno agent: CBAM fertiliser/H2 precursors, ETS process emissions',
    coverageGap: 'Mass-balance bio/recycled feedstock certification',
  },
  {
    id: 5,
    name: 'Aviation',
    tier: 1,
    captainHat: 'Aviation',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'ReFuelEU Aviation', 'Fit for 55', 'CSRD'],
    keyEmissionSources: ['Jet fuel combustion', 'Non-CO2 (contrails/NOx)', 'Ground ops'],
    decarbonizationLevers: [
      'SAF blending mandates',
      'Fleet renewal',
      'Operational/ATM efficiency',
      'H2/electric R&D',
    ],
    marketBenchmark: 'ReFuelEU SAF blending trajectory (2% 2025 → 70% 2050)',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap:
      'NO DEDICATED AGENT (tier-1 gap): SAF mandate tracking, non-CO2 effects, ETS aviation free-allowance phase-out',
  },
  {
    id: 6,
    name: 'Maritime Shipping',
    tier: 1,
    captainHat: 'Maritime Shipping',
    dedicatedAgent: 'neptune',
    primaryRegulations: ['ETS / ETS2', 'FuelEU Maritime', 'Fit for 55', 'CSRD'],
    keyEmissionSources: ['Bunker fuel (HFO/MGO)', 'Auxiliary engines', 'Boil-off (LNG)'],
    decarbonizationLevers: [
      'Green methanol/ammonia',
      'Wind-assist',
      'Slow steaming',
      'Shore power',
    ],
    marketBenchmark: 'Green-methanol dual-fuel vessels (Maersk)',
    dwsOffering:
      'Neptune agent: FuelEU Maritime intensity, ETS Maritime phase-in, voyage emissions',
    coverageGap: 'Well-to-wake fuel pathway certification and pooling optimisation',
  },
  {
    id: 7,
    name: 'Road Transport & Logistics',
    tier: 1,
    captainHat: 'Road Transport & Logistics',
    dedicatedAgent: 'hermes',
    primaryRegulations: ['ETS / ETS2', 'Fit for 55', 'CSRD'],
    keyEmissionSources: ['Diesel HGV/LCV fleet', 'Refrigeration', 'Depot energy'],
    decarbonizationLevers: [
      'Fleet electrification',
      'Modal shift to rail',
      'Route optimisation',
      'Biofuels/HVO',
    ],
    marketBenchmark: 'Battery-electric truck depots with megawatt charging',
    dwsOffering: 'Hermes/Logistics agents: ETS2 fuel exposure, fleet emissions, modal analysis',
    coverageGap: 'Charging-infrastructure TCO and depot grid-capacity planning',
  },
  {
    id: 8,
    name: 'Construction & Buildings',
    tier: 1,
    captainHat: 'Construction & Buildings',
    dedicatedAgent: 'mars',
    primaryRegulations: ['EPBD', 'ETS / ETS2', 'CSRD', 'ESPR', 'EU Taxonomy'],
    keyEmissionSources: ['Embodied carbon (materials)', 'Operational energy', 'Site plant'],
    decarbonizationLevers: [
      'Low-carbon materials',
      'Whole-life carbon (EN 15978)',
      'Deep retrofit',
      'Heat pumps',
    ],
    marketBenchmark: 'Whole-life carbon limits (RICS/LETI) + EPBD zero-emission buildings',
    dwsOffering: 'Mars agent + Material Oracle: embodied carbon (A1–D), EPBD pathway',
    coverageGap: 'Digital Building Logbook and as-built vs as-designed carbon reconciliation',
  },
  {
    id: 9,
    name: 'Agriculture & Livestock',
    tier: 2,
    captainHat: 'Agriculture',
    dedicatedAgent: 'ceres',
    primaryRegulations: ['ESR', 'CSRD', 'Fit for 55'],
    keyEmissionSources: ['Enteric methane', 'Manure management', 'Fertiliser N2O', 'Land use'],
    decarbonizationLevers: [
      'Feed additives/inhibitors',
      'Manure-to-biogas',
      'Precision nitrogen',
      'Cover cropping',
    ],
    marketBenchmark: 'SBTi FLAG targets + methane-inhibitor adoption',
    dwsOffering: 'Ceres agent: ESR non-ETS exposure, fertiliser/livestock emissions',
    coverageGap: 'Field-level MRV and soil-carbon removal accounting',
  },
  {
    id: 10,
    name: 'Waste Management & Recycling',
    tier: 2,
    captainHat: 'Waste Management',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'CSRD', 'Fit for 55'],
    keyEmissionSources: ['Waste-to-energy combustion', 'Landfill methane', 'Collection fleet'],
    decarbonizationLevers: [
      'CCS on WtE',
      'Landfill-gas capture',
      'Circularity / diversion',
      'Fleet electrification',
    ],
    marketBenchmark: 'CCS-equipped waste-to-energy plants',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap:
      'NO DEDICATED AGENT: WtE ETS inclusion (2028), biogenic vs fossil CO2 split, landfill methane MRV',
  },
  {
    id: 11,
    name: 'Aluminium Production',
    tier: 2,
    captainHat: 'Aluminium',
    dedicatedAgent: 'talos',
    primaryRegulations: ['ETS / ETS2', 'CBAM', 'Fit for 55', 'CSRD'],
    keyEmissionSources: ['Smelting electricity (indirect)', 'Anode (direct CO2)', 'PFCs'],
    decarbonizationLevers: [
      'Inert anodes',
      'Renewable smelting power',
      'Recycled scrap',
      'PFC suppression',
    ],
    marketBenchmark: 'ELYSIS inert-anode zero-process-CO2 smelting',
    dwsOffering: 'Talos agent: CBAM indirect (grid carbon) emissions, ETS aluminium scope',
    coverageGap: 'Grid carbon-intensity attribution for indirect CBAM emissions',
  },
  {
    id: 12,
    name: 'Pulp, Paper & Printing',
    tier: 2,
    captainHat: 'Pulp & Paper',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'CSRD', 'Fit for 55', 'ESPR'],
    keyEmissionSources: ['Recovery/lime kilns', 'Steam/process heat', 'Drying'],
    decarbonizationLevers: [
      'Biomass recovery boilers',
      'Electrification of drying',
      'Black-liquor gasification',
      'Heat integration',
    ],
    marketBenchmark: 'Fossil-free integrated mills (Nordic)',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap: 'NO DEDICATED AGENT: biogenic carbon accounting, recovery-boiler benchmarking',
  },
  {
    id: 13,
    name: 'Petroleum Refining',
    tier: 2,
    captainHat: 'Petroleum Refining',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'CBAM', 'RED III', 'CSRD'],
    keyEmissionSources: ['Process furnaces', 'Hydrogen (SMR)', 'FCC catalyst regen', 'Flaring'],
    decarbonizationLevers: [
      'Green H2 for hydrotreating',
      'Electrification of heat',
      'CCS',
      'Co-processing bio-feed',
    ],
    marketBenchmark: 'Refinery CCS + renewable-hydrogen integration',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap:
      'NO DEDICATED AGENT: refinery CWT benchmark allocation, RED III renewable-fuel share',
  },
  {
    id: 14,
    name: 'Food & Beverage Processing',
    tier: 2,
    captainHat: 'Food & Beverage',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'CSRD', 'Fit for 55'],
    keyEmissionSources: [
      'Process heat (boilers)',
      'Refrigeration (F-gases)',
      'Scope 3 agriculture',
    ],
    decarbonizationLevers: [
      'Heat-pump electrification',
      'Low-GWP refrigerants',
      'Anaerobic digestion',
      'Supplier Scope 3 programs',
    ],
    marketBenchmark: 'SBTi FLAG + industrial heat-pump process heat',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap: 'NO DEDICATED AGENT: Scope 3 agricultural supply chain, F-gas phase-down tracking',
  },
  {
    id: 15,
    name: 'Glass & Ceramics Production',
    tier: 2,
    captainHat: 'Glass & Ceramics',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'CBAM', 'CSRD', 'Fit for 55'],
    keyEmissionSources: ['Melting furnaces (gas)', 'Carbonate decomposition', 'Forehearth'],
    decarbonizationLevers: [
      'Electric/hybrid melting',
      'Oxy-fuel firing',
      'Cullet recycling',
      'H2 firing trials',
    ],
    marketBenchmark: 'All-electric melting furnaces (container glass)',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap:
      'NO DEDICATED AGENT: furnace-campaign emission modelling, cullet-rate optimisation',
  },
  {
    id: 16,
    name: 'Mining & Quarrying',
    tier: 2,
    captainHat: 'Mining',
    dedicatedAgent: null,
    primaryRegulations: ['ETS / ETS2', 'CSRD', 'CRM Act'],
    keyEmissionSources: ['Diesel haul fleet', 'Processing energy', 'Fugitive methane (coal)'],
    decarbonizationLevers: [
      'Battery/trolley haul trucks',
      'Renewable mine power',
      'Methane capture',
      'Electrified processing',
    ],
    marketBenchmark: 'Battery-electric haul-truck fleets + on-site renewables',
    dwsOffering: 'Universal analyst only — no dedicated agent yet',
    coverageGap:
      'NO DEDICATED AGENT: CRM Act critical-raw-material reporting, fugitive methane MRV',
  },
  {
    id: 17,
    name: 'Real Estate',
    tier: 3,
    captainHat: 'Construction & Buildings (folded)',
    dedicatedAgent: 'mars',
    primaryRegulations: ['EPBD', 'EU Taxonomy', 'CSRD', 'SFDR'],
    keyEmissionSources: ['Operational building energy', 'Embodied (refurb)', 'Tenant Scope 3'],
    decarbonizationLevers: [
      'MEPS-driven retrofit',
      'Heat-pump conversion',
      'On-site renewables',
      'Stranding-risk avoidance',
    ],
    marketBenchmark: 'CRREM 1.5°C decarbonization pathways',
    dwsOffering: 'Mars agent (folded): EPBD operational pathway, Taxonomy alignment',
    coverageGap: 'Portfolio-level CRREM stranding analysis and capex sequencing',
  },
  {
    id: 18,
    name: 'Manufacturing (cross-sector)',
    tier: 3,
    captainHat: 'platform-only',
    dedicatedAgent: null,
    primaryRegulations: ['ESPR', 'CSRD', 'EED', 'ETS / ETS2'],
    keyEmissionSources: ['Plant process energy', 'Compressed air/motors', 'Purchased materials'],
    decarbonizationLevers: [
      'ISO 50001 energy management',
      'Motor/drive efficiency',
      'Electrification',
      'Digital Product Passports',
    ],
    marketBenchmark: 'ESPR Digital Product Passport + ISO 50001 EnMS',
    dwsOffering: 'Platform-only: DPP, plant-level energy + emissions, ESPR, CSRD',
    coverageGap: 'NO DEDICATED AGENT: DPP data assembly, product-level LCA at line speed',
  },
  {
    id: 19,
    name: 'Healthcare',
    tier: 3,
    captainHat: 'platform-only',
    dedicatedAgent: null,
    primaryRegulations: ['EHDS', 'MDR', 'CSRD', 'GDPR'],
    keyEmissionSources: ['Facility energy', 'Anaesthetic gases', 'Medical-device supply chain'],
    decarbonizationLevers: [
      'Facility electrification',
      'Anaesthetic-gas capture/substitution',
      'Sustainable procurement',
      'Telehealth',
    ],
    marketBenchmark: 'NHS Net Zero (first national health-system target)',
    dwsOffering: 'Platform-only: facility carbon, ESRS S1, EHDS-aligned secondary data',
    coverageGap: 'NO DEDICATED AGENT: anaesthetic-gas accounting, ESRS S1 social metrics',
  },
  {
    id: 20,
    name: 'Financial Services',
    tier: 3,
    captainHat: 'platform-only',
    dedicatedAgent: null,
    primaryRegulations: ['SFDR', 'EU Taxonomy', 'CRR3', 'CSRD'],
    keyEmissionSources: ['Financed emissions (Scope 3 cat. 15)', 'Operational (minor)'],
    decarbonizationLevers: [
      'PCAF financed-emissions accounting',
      'Portfolio alignment (NZBA)',
      'Taxonomy-aligned lending',
      'Engagement',
    ],
    marketBenchmark: 'PCAF Standard + Net-Zero Banking Alliance targets',
    dwsOffering: 'Platform-only: financed-emissions accounting, PAI tables, Taxonomy KPIs',
    coverageGap:
      'NO DEDICATED AGENT: PCAF asset-class coverage, SFDR PAI auto-assembly, data-gap proxying',
  },
  {
    id: 21,
    name: 'Public Sector',
    tier: 3,
    captainHat: 'platform-only',
    dedicatedAgent: null,
    primaryRegulations: ['GPP', 'NIS2', 'CSRD', 'GDPR'],
    keyEmissionSources: ['Public buildings/fleet', 'Procurement Scope 3', 'Data/IT'],
    decarbonizationLevers: [
      'Green Public Procurement criteria',
      'Building retrofit',
      'Fleet electrification',
      'Sovereign on-prem AI',
    ],
    marketBenchmark: 'EU GPP criteria + climate-neutral cities mission',
    dwsOffering: 'Platform-only: sovereign on-prem AI, GPP green procurement, NIS2 dossiers',
    coverageGap: 'NO DEDICATED AGENT: GPP tender-criteria scoring, NIS2 incident dossiers',
  },
  {
    id: 22,
    name: 'Shipbuilding',
    tier: 3,
    captainHat: 'Maritime Shipping (folded)',
    dedicatedAgent: 'neptune',
    primaryRegulations: ['EU Taxonomy', 'CSRD', 'CBAM', 'ESPR'],
    keyEmissionSources: ['Yard energy', 'Steel/aluminium inputs (embodied)', 'Coatings/welding'],
    decarbonizationLevers: [
      'Green-steel inputs',
      'Yard electrification',
      'Eco-design vessels',
      'Renewable yard power',
    ],
    marketBenchmark: 'Taxonomy-aligned green vessel design',
    dwsOffering: 'Neptune agent (folded): vessel LCA, Taxonomy shipyard alignment',
    coverageGap: 'Cradle-to-gate vessel LCA with green-steel precursor data',
  },
  {
    id: 23,
    name: 'Logistics (multimodal freight)',
    tier: 3,
    captainHat: 'Road Transport & Logistics (folded)',
    dedicatedAgent: 'logistics',
    primaryRegulations: ['ETS / ETS2', 'CSRD', 'Fit for 55'],
    keyEmissionSources: ['Multimodal freight movements', 'Warehousing energy', 'Last-mile'],
    decarbonizationLevers: [
      'Modal shift',
      'ISO 14083 emissions accounting',
      'Network optimisation',
      'Zero-emission last-mile',
    ],
    marketBenchmark: 'GLEC Framework / ISO 14083 logistics emissions',
    dwsOffering: 'Logistics agent (folded): CountEmissionsEU/ISO 14083 freight emissions',
    coverageGap: 'Shipment-level primary-data MRV across carriers',
  },
  {
    id: 24,
    name: 'Data Centres',
    tier: 3,
    captainHat: 'platform-only',
    dedicatedAgent: null,
    primaryRegulations: ['EED', 'CSRD', 'NIS2', 'EU Taxonomy'],
    keyEmissionSources: ['IT load electricity', 'Cooling', 'Backup generation'],
    decarbonizationLevers: [
      'PUE/WUE optimisation',
      'Heat reuse',
      'Renewable PPAs / CFE',
      'Free cooling',
    ],
    marketBenchmark: 'Climate Neutral Data Centre Pact + EED Annex VII reporting',
    dwsOffering: 'Platform-only: PUE/WUE telemetry, Annex VII reporting, sovereign on-prem AI',
    coverageGap:
      'NO DEDICATED AGENT: EED Annex VII auto-reporting, hourly CFE matching, heat-reuse accounting',
  },
  {
    id: 25,
    name: 'RFNBO / Green H2 & E-Fuels',
    tier: 3,
    captainHat: 'Chemicals & Petrochemicals (folded)',
    dedicatedAgent: 'prometheus',
    primaryRegulations: ['RED III', 'ETS / ETS2', 'CSRD', 'CBAM'],
    keyEmissionSources: [
      'Grid electricity (electrolysis)',
      'Feedstock CO2 (e-fuels)',
      'Compression',
    ],
    decarbonizationLevers: [
      'Additional renewable PPAs',
      'Temporal/geographic correlation',
      'Electrolyser scale-up',
      'Biogenic/DAC CO2',
    ],
    marketBenchmark: 'RED III RFNBO certification (additionality + hourly matching)',
    dwsOffering: 'Prometheus agent (folded): RED III additionality, RFNBO certification',
    coverageGap: 'Hourly additionality proof and guarantee-of-origin chain of custody',
  },
] as const;

/** Total industries served — must equal industries.json summary.industriesServedTotal. */
export const INDUSTRIES_SERVED_TOTAL = INDUSTRY_REGISTRY.length;

// ---------------------------------------------------------------------------
// Module-level indexes — built once at import time, O(1) lookups thereafter.
// ---------------------------------------------------------------------------

/** O(1) lookup by canonical numeric id. */
const _INDUSTRY_BY_ID: Map<number, IndustryProfile> = new Map(
  INDUSTRY_REGISTRY.map((p) => [p.id, p]),
);

/** O(1) exact canonical-name lookup (lower-cased key). */
const _INDUSTRY_BY_NAME_LOWER: Map<string, IndustryProfile> = new Map(
  INDUSTRY_REGISTRY.map((p) => [p.name.toLowerCase(), p]),
);

/** Alias → canonical id mapping (built once). */
const _ALIAS_TO_ID: ReadonlyMap<string, number> = new Map<string, number>([
  ['steel', 2],
  ['metals', 2],
  ['cement', 3],
  ['lime', 3],
  ['chemicals', 4],
  ['petrochemicals', 4],
  ['aviation', 5],
  ['airline', 5],
  ['maritime', 6],
  ['shipping', 6],
  ['road', 7],
  ['trucking', 7],
  ['construction', 8],
  ['buildings', 8],
  ['agriculture', 9],
  ['farming', 9],
  ['livestock', 9],
  ['waste', 10],
  ['recycling', 10],
  ['aluminium', 11],
  ['aluminum', 11],
  ['paper', 12],
  ['pulp', 12],
  ['refining', 13],
  ['refinery', 13],
  ['food', 14],
  ['beverage', 14],
  ['glass', 15],
  ['ceramics', 15],
  ['mining', 16],
  ['quarrying', 16],
  ['real estate', 17],
  ['manufacturing', 18],
  ['healthcare', 19],
  ['hospital', 19],
  ['finance', 20],
  ['financial services', 20],
  ['banking', 20],
  ['government', 21],
  ['public sector', 21],
  ['shipbuilding', 22],
  ['logistics', 23],
  ['freight', 23],
  ['data centre', 24],
  ['data center', 24],
  ['datacenter', 24],
  ['hydrogen', 25],
  ['h2', 25],
  ['efuel', 25],
]);

/** Pre-computed list of industries without a dedicated pantheon agent. */
const _INDUSTRIES_WITHOUT_DEDICATED_AGENT: readonly IndustryProfile[] = INDUSTRY_REGISTRY.filter(
  (p) => p.dedicatedAgent === null,
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Resolve a profile by numeric id. O(1). */
export function getIndustryById(id: number): IndustryProfile | undefined {
  return _INDUSTRY_BY_ID.get(id);
}

/**
 * Resolve a profile by a loose name/alias (case-insensitive substring either way).
 * Accepts canonical names ("Aviation") and common aliases ("steel", "datacenter").
 * Exact name → O(1). Known alias → O(1). Fuzzy substring → O(n) fallback only.
 */
export function getIndustryByName(query: string): IndustryProfile | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  // Exact canonical match — O(1).
  const exact = _INDUSTRY_BY_NAME_LOWER.get(q);
  if (exact) return exact;
  // Known alias — O(1).
  const aliasId = _ALIAS_TO_ID.get(q);
  if (aliasId !== undefined) return _INDUSTRY_BY_ID.get(aliasId);
  // Guard: single-character queries are too ambiguous for fuzzy matching and
  // would match unpredictably on whichever industry appears first in the array.
  if (q.length < 2) return undefined;
  // Fuzzy substring on canonical names — O(n) fallback only for unrecognised inputs.
  return INDUSTRY_REGISTRY.find(
    (p) => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()),
  );
}

/** Industries that lack a dedicated pantheon agent — the "offer more" target list. */
export function industriesWithoutDedicatedAgent(): readonly IndustryProfile[] {
  return _INDUSTRIES_WITHOUT_DEDICATED_AGENT;
}
