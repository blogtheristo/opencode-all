/**
 * Compliance Data Source Registry
 *
 * Central registry of all open data sources feeding the compliance ledger.
 * Tracks version, last verified date, and staleness for each source.
 * No auto-update — manual verification required for regulatory data.
 *
 * 12 sources across 5 categories:
 *   Grid factors, Carbon pricing, Emission factors,
 *   Sector benchmarks, Disclosure registries
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Date: 2026-03-24
 * Owner: Lifetime Oy
 */

// ============ TYPES ============

export type DataSourceStatus = 'live-api' | 'cached' | 'static-verified' | 'static-stale';
export type RefreshMethod = 'auto-api' | 'manual-review' | 'github-sync' | 'scheduled-fetch';
export type SourceTier = 'open' | 'enterprise';

export interface DataSource {
  id: string;
  name: string;
  category: 'grid-factors' | 'carbon-pricing' | 'emission-factors' | 'sector-benchmarks' | 'disclosure-registry';
  url: string;
  apiUrl?: string;
  license: string;
  requiresApiKey: boolean;
  envVar?: string;
  refreshMethod: RefreshMethod;
  /** ISO date when data was last verified against the source */
  lastVerified: string;
  /** Version of the regulation or dataset */
  dataVersion: string;
  /** Days before data is considered stale */
  staleAfterDays: number;
  /** Which files in src/compliance/ consume this source */
  consumedBy: string[];
  /** open = free/CC-licensed; enterprise = paid license required */
  tier: SourceTier;
  /** Estimated annual cost for enterprise tier (EUR) */
  annualCostEur?: number;
  notes?: string;
}

export interface SourceHealthCheck {
  id: string;
  status: DataSourceStatus;
  isStale: boolean;
  daysSinceVerified: number;
  staleAfterDays: number;
  message: string;
}

// ============ REGISTRY ============

export const DATA_SOURCES: DataSource[] = [
  // ---- Grid Factors ----
  {
    id: 'entsoe',
    name: 'ENTSO-E Transparency Platform',
    category: 'grid-factors',
    url: 'https://transparency.entsoe.eu/',
    apiUrl: 'https://web-api.tp.entsoe.eu/api',
    license: 'Open data, attribution required',
    requiresApiKey: true,
    envVar: 'ENTSOE_API_KEY',
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'ENTSO-E API v1 (A75 generation per type)',
    staleAfterDays: 1,
    consumedBy: ['entsoe-grid-factors.ts'],
    tier: 'open',
    notes: '15-min resolution. Covers all EU/EEA bidding zones.',
  },
  {
    id: 'energiavirasto',
    name: 'Finnish Energy Authority (Energiavirasto)',
    category: 'grid-factors',
    url: 'https://energiavirasto.fi/en/energy-authority',
    license: 'Finnish public data (CC BY 4.0)',
    requiresApiKey: false,
    refreshMethod: 'manual-review',
    lastVerified: '2026-03-24',
    dataVersion: 'Energiavirasto 2024 annual report',
    staleAfterDays: 365,
    consumedBy: ['entsoe-grid-factors.ts'],
    tier: 'open',
    notes: 'Finnish auditors may require national figure (68 gCO2/kWh) over ENTSO-E EU-wide data. Override for FI domestic reporting.',
  },

  // ---- Carbon Pricing ----
  {
    id: 'ember',
    name: 'EMBER Climate — Carbon Price Viewer',
    category: 'carbon-pricing',
    url: 'https://ember-climate.org/data/data-tools/carbon-price-viewer/',
    apiUrl: 'https://api.ember-climate.org/v1/carbon-price/eu-ets',
    license: 'CC BY 4.0',
    requiresApiKey: false,
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'EU ETS settlement price (ICE ECX)',
    staleAfterDays: 7,
    consumedBy: ['ember-carbon-price.ts', 'emission-factors.ts'],
    tier: 'open',
    notes: 'Daily CSV-derived, not API-native. Primary open source. 4-hour cache TTL.',
  },
  {
    id: 'sandbag',
    name: 'Sandbag Carbon Price Tracker',
    category: 'carbon-pricing',
    url: 'https://sandbag.be/carbon-price-viewer/',
    apiUrl: 'https://sandbag.be/api/carbon-price/latest',
    license: 'Open access',
    requiresApiKey: false,
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'Sandbag EUA tracker (near-realtime)',
    staleAfterDays: 7,
    consumedBy: ['ember-carbon-price.ts'],
    tier: 'open',
    notes: 'Secondary source in cascade. More reliable programmatic access than EMBER for live pricing.',
  },

  // ---- Carbon Pricing (Enterprise — customer brings their own feed) ----
  {
    id: 'ice-endex',
    name: 'ICE Endex EUA Futures',
    category: 'carbon-pricing',
    url: 'https://www.theice.com/products/197/EUA-Futures',
    license: 'ICE data license (paid)',
    requiresApiKey: true,
    envVar: 'ICE_ENDEX_API_KEY',
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'ICE ECX EUA Futures (real-time)',
    staleAfterDays: 1,
    consumedBy: ['ember-carbon-price.ts'],
    tier: 'enterprise',
    annualCostEur: 15_000,
    notes: 'Real-time EUA futures. CFOs at YIT/Skanska level already have ICE access. Ingest customer existing feed — don\'t replace their data provider.',
  },
  {
    id: 'refinitiv',
    name: 'Refinitiv (LSEG) Carbon',
    category: 'carbon-pricing',
    url: 'https://www.lseg.com/en/data-analytics/financial-data/pricing-data/commodities',
    license: 'LSEG data license (paid)',
    requiresApiKey: true,
    envVar: 'REFINITIV_API_KEY',
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'Refinitiv Eikon Carbon API',
    staleAfterDays: 1,
    consumedBy: ['ember-carbon-price.ts'],
    tier: 'enterprise',
    annualCostEur: 10_000,
    notes: 'EUA spot and futures, carbon market analytics. Proper API, more accessible than Bloomberg for mid-market.',
  },
  {
    id: 'bloomberg',
    name: 'Bloomberg Terminal / Bloomberg NEF',
    category: 'carbon-pricing',
    url: 'https://www.bloomberg.com/professional/solution/bloomberg-terminal/',
    license: 'Bloomberg subscription (paid)',
    requiresApiKey: true,
    envVar: 'BLOOMBERG_API_KEY',
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'Bloomberg BNEF Carbon (real-time)',
    staleAfterDays: 1,
    consumedBy: ['ember-carbon-price.ts'],
    tier: 'enterprise',
    annualCostEur: 24_000,
    notes: 'ETS carbon price, energy benchmarks, CBAM commodity prices. Removes "where does your price data come from" objection entirely. Ingest customer existing Bloomberg feed.',
  },

  // ---- Emission Factors ----
  {
    id: 'eutl',
    name: 'EU ETS Registry (EUTL)',
    category: 'emission-factors',
    url: 'https://ec.europa.eu/clima/eutl',
    license: 'EU public data',
    requiresApiKey: false,
    refreshMethod: 'scheduled-fetch',
    lastVerified: '2026-03-24',
    dataVersion: 'EUTL 2024 compliance data',
    staleAfterDays: 90,
    consumedBy: ['emission-factors.ts', 'ets-calculator.ts'],
    tier: 'open',
    notes: 'Installation-level ETS data: actual allowances, surrenders, verified emissions. More granular than EEA aggregates.',
  },
  {
    id: 'unfccc',
    name: 'UNFCCC National Inventory Submissions',
    category: 'emission-factors',
    url: 'https://unfccc.int/ghg-inventories-annex-i-parties/2024',
    apiUrl: 'https://di.unfccc.int/api/',
    license: 'UN open data',
    requiresApiKey: false,
    refreshMethod: 'manual-review',
    lastVerified: '2026-03-24',
    dataVersion: 'UNFCCC 2024 submissions',
    staleAfterDays: 365,
    consumedBy: ['emission-factors.ts'],
    tier: 'open',
    notes: 'Country-level emission factors by sector and fuel type. Annual update cycle.',
  },
  {
    id: 'ghg-protocol',
    name: 'GHG Protocol Emission Factors',
    category: 'emission-factors',
    url: 'https://ghgprotocol.org/calculation-tools-and-guidance',
    license: 'WRI/WBCSD open access',
    requiresApiKey: false,
    refreshMethod: 'manual-review',
    lastVerified: '2026-03-24',
    dataVersion: 'GHG Protocol Corporate Standard (revised 2015) + Scope 3 Standard',
    staleAfterDays: 365,
    consumedBy: ['emission-factors.ts', 'bess-calculator.ts'],
    tier: 'open',
    notes: 'Widely accepted by auditors as secondary reference for Scope 3. Complements UNFCCC for supply chain emissions.',
  },
  {
    id: 'cbam-reg',
    name: 'CBAM Default Values (Reg. 2023/1773)',
    category: 'emission-factors',
    url: 'https://eur-lex.europa.eu/eli/reg_impl/2023/1773/oj',
    license: 'EU public document',
    requiresApiKey: false,
    refreshMethod: 'manual-review',
    lastVerified: '2026-03-24',
    dataVersion: 'Implementing Regulation 2023/1773, Annex III',
    staleAfterDays: 180,
    consumedBy: ['emission-factors.ts', 'cbam-calculator.ts'],
    tier: 'open',
    notes: 'Machine-readable API planned for 2026, not live. PDF from EUR-Lex. Check quarterly for amendments.',
  },

  // ---- Emission Factors (Enterprise) ----
  {
    id: 'ecoinvent',
    name: 'Ecoinvent LCA Database',
    category: 'emission-factors',
    url: 'https://ecoinvent.org/',
    license: 'Ecoinvent license (paid)',
    requiresApiKey: true,
    envVar: 'ECOINVENT_API_KEY',
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'Ecoinvent v3.10 (2024)',
    staleAfterDays: 365,
    consumedBy: ['emission-factors.ts', 'bess-calculator.ts'],
    tier: 'enterprise',
    annualCostEur: 3_500,
    notes: 'Gold standard for LCA emission factors. Auditors recognize immediately. If Lifetime World Model references Ecoinvent, credibility signal for enterprise buyers.',
  },
  {
    id: 'sp-global',
    name: 'S&P Global Commodity Insights',
    category: 'emission-factors',
    url: 'https://www.spglobal.com/commodityinsights/',
    license: 'S&P subscription (paid)',
    requiresApiKey: true,
    envVar: 'SP_GLOBAL_API_KEY',
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'S&P Global Platts Carbon (2024)',
    staleAfterDays: 30,
    consumedBy: ['emission-factors.ts', 'cbam-calculator.ts'],
    tier: 'enterprise',
    annualCostEur: 20_000,
    notes: 'Emission factors, energy price benchmarks, CBAM commodity values. Used by industrial CFOs for procurement decisions.',
  },

  // ---- Sector Benchmarks ----
  {
    id: 'eea-ghg',
    name: 'EEA Greenhouse Gas Data Viewer',
    category: 'sector-benchmarks',
    url: 'https://www.eea.europa.eu/data-and-maps/data/national-emissions-reported-to-the-unfccc-and-to-the-eu-greenhouse-gas-monitoring-mechanism-18',
    apiUrl: 'https://discodata.eea.europa.eu/',
    license: 'EEA standard reuse policy (open)',
    requiresApiKey: false,
    refreshMethod: 'scheduled-fetch',
    lastVerified: '2026-03-24',
    dataVersion: 'EEA GHG Inventory 2024',
    staleAfterDays: 180,
    consumedBy: ['eu-benchmarks.ts'],
    tier: 'open',
    notes: 'EU country and sector emissions, annual, NACE-classified. SPARQL/OData access.',
  },
  {
    id: 'eurostat-nace',
    name: 'Eurostat NACE Statistics API',
    category: 'sector-benchmarks',
    url: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/',
    license: 'Eurostat free reuse with attribution',
    requiresApiKey: false,
    refreshMethod: 'scheduled-fetch',
    lastVerified: '2026-03-24',
    dataVersion: 'Eurostat SBS/env_ac_ainah_r2 (2024)',
    staleAfterDays: 180,
    consumedBy: ['eu-benchmarks.ts'],
    tier: 'open',
    notes: 'Industry statistics by NACE code: emissions, energy use, trade values.',
  },
  {
    id: 'eurostat-prodcom',
    name: 'Eurostat PRODCOM',
    category: 'sector-benchmarks',
    url: 'https://ec.europa.eu/eurostat/web/prodcom',
    apiUrl: 'https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/',
    license: 'Eurostat free reuse with attribution',
    requiresApiKey: false,
    refreshMethod: 'scheduled-fetch',
    lastVerified: '2026-03-24',
    dataVersion: 'PRODCOM 2024 (production by PRODCOM code)',
    staleAfterDays: 365,
    consumedBy: ['cbam-calculator.ts', 'eu-benchmarks.ts'],
    tier: 'open',
    notes: 'Industrial production by product code. CBAM import value benchmarks. PRODCOM→CN code mapping for CBAM Annex I.',
  },

  // ---- Sector Benchmarks (Enterprise) ----
  {
    id: 'cdp',
    name: 'CDP (Carbon Disclosure Project)',
    category: 'sector-benchmarks',
    url: 'https://www.cdp.net/en',
    license: 'CDP data license (paid)',
    requiresApiKey: true,
    envVar: 'CDP_API_KEY',
    refreshMethod: 'scheduled-fetch',
    lastVerified: '2026-03-24',
    dataVersion: 'CDP 2024 disclosure cycle',
    staleAfterDays: 365,
    consumedBy: ['eu-benchmarks.ts'],
    tier: 'enterprise',
    annualCostEur: 8_000,
    notes: 'Peer company emissions data for benchmarking against competitors. CFOs use for board reporting.',
  },

  // ---- Disclosure Registries ----
  {
    id: 'efrag-xbrl',
    name: 'EFRAG ESRS XBRL Taxonomy',
    category: 'disclosure-registry',
    url: 'https://www.efrag.org/lab/xbrl-taxonomy',
    apiUrl: 'https://github.com/EFRAG/ESRS-Set1-XBRL-Taxonomy',
    license: 'EFRAG open (public domain)',
    requiresApiKey: false,
    refreshMethod: 'github-sync',
    lastVerified: '2026-03-24',
    dataVersion: 'ESRS Set 1 Final (2023)',
    staleAfterDays: 90,
    consumedBy: ['esrs-registry.ts'],
    tier: 'open',
    notes: 'Machine-readable ESRS disclosures. Auto-sync from EFRAG GitHub. Moat for enterprise buyers.',
  },
  {
    id: 'openclimate',
    name: 'OpenClimate',
    category: 'emission-factors',
    url: 'https://openclimate.network/',
    apiUrl: 'https://github.com/Open-Earth-Foundation/OpenClimate',
    license: 'Apache 2.0',
    requiresApiKey: false,
    refreshMethod: 'auto-api',
    lastVerified: '2026-03-24',
    dataVersion: 'OpenClimate v2 (2024)',
    staleAfterDays: 90,
    consumedBy: ['emission-factors.ts'],
    tier: 'open',
    notes: 'Aggregated emissions data from multiple open sources. Complements primary sources.',
  },
];

// ============ HEALTH CHECK ============

/**
 * Check staleness of all data sources.
 * Returns health status for each source — use in monitoring dashboards
 * and compliance audit reports.
 */
export function checkDataSourceHealth(): SourceHealthCheck[] {
  const now = new Date();

  return DATA_SOURCES.map((src) => {
    const verified = new Date(src.lastVerified);
    const daysSince = Math.floor((now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24));
    const isStale = daysSince > src.staleAfterDays;

    let status: DataSourceStatus;
    if (src.refreshMethod === 'auto-api' && src.envVar && process.env[src.envVar]) {
      status = 'live-api';
    } else if (src.refreshMethod === 'auto-api' && !src.requiresApiKey) {
      status = 'live-api';
    } else if (isStale) {
      status = 'static-stale';
    } else {
      status = 'static-verified';
    }

    return {
      id: src.id,
      status,
      isStale,
      daysSinceVerified: daysSince,
      staleAfterDays: src.staleAfterDays,
      message: isStale
        ? `STALE: ${src.name} last verified ${daysSince} days ago (threshold: ${src.staleAfterDays} days). Run: dws compliance update-source ${src.id}`
        : `OK: ${src.name} verified ${daysSince} days ago`,
    };
  });
}

/**
 * Get all stale sources. For CI/CD alerts.
 */
export function getStaleSources(): SourceHealthCheck[] {
  return checkDataSourceHealth().filter((h) => h.isStale);
}

/**
 * Get a source by ID.
 */
export function getDataSource(id: string): DataSource | undefined {
  return DATA_SOURCES.find((s) => s.id === id);
}

/**
 * Get sources consumed by a specific file.
 */
export function getSourcesForFile(filename: string): DataSource[] {
  return DATA_SOURCES.filter((s) => s.consumedBy.includes(filename));
}

/**
 * Get open (free) sources — baked into all tiers by default.
 */
export function getOpenSources(): DataSource[] {
  return DATA_SOURCES.filter((s) => s.tier === 'open');
}

/**
 * Get enterprise sources — "Data Sovereignty Add-ons".
 * Customer brings their own license, DWS provides the connector.
 */
export function getEnterpriseSources(): DataSource[] {
  return DATA_SOURCES.filter((s) => s.tier === 'enterprise');
}

/**
 * Check which enterprise connectors are active (env var set).
 */
export function getActiveEnterpriseConnectors(): DataSource[] {
  return getEnterpriseSources().filter((s) => s.envVar && process.env[s.envVar]);
}

/**
 * Total annual cost of all enterprise sources (EUR).
 */
export function getEnterpriseTotalCost(): number {
  return getEnterpriseSources().reduce((sum, s) => sum + (s.annualCostEur ?? 0), 0);
}
