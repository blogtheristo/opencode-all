/**
 * CBAM Synthetic Data Schema — NeMo DataDesigner Configuration
 *
 * Code-Version: 1.0
 * Branch: claude/synthetic-data-pipeline-TK1Lp
 * Date: 2026-04-06
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Defines the schema for NVIDIA NeMo DataDesigner to generate high-fidelity
 * CBAM declarations, Mill Test Certificates (MTCs), and installation-level
 * emission records for stress-testing the DWS IQ compliance agent swarm.
 *
 * Sources:
 * - CBAM Regulation (EU) 2023/956 — main regulation
 * - Implementing Regulation (EU) 2023/1773 — transitional rules & default values
 * - Commission Delegated Regulation (EU) 2025/2547 — definitive regime methodology
 * - EU CBAM Transitional Registry technical guidance (2024)
 * - src/compliance/emission-factors.ts — real-sourced ETS/CBAM factors
 * - src/compliance/cbam-calculator.ts — existing CBAM obligation calculator
 */

// ============ CBAM CN CODES (Combined Nomenclature) ============

/**
 * CBAM Annex I product categories with CN codes.
 * Source: Regulation (EU) 2023/956, Annex I
 */
export const CBAM_CN_CODES = {
  cement: {
    category: 'Cement',
    codes: ['2523 21', '2523 29', '2523 30', '2523 90'],
    descriptions: [
      'White Portland cement',
      'Other Portland cement',
      'Aluminous cement',
      'Other hydraulic cements',
    ],
  },
  steel: {
    category: 'Iron and Steel',
    codes: [
      '7201',
      '7202',
      '7203',
      '7204',
      '7205',
      '7206',
      '7207',
      '7208',
      '7209',
      '7210',
      '7211',
      '7212',
      '7213',
      '7214',
      '7215',
      '7216',
      '7217',
      '7218',
      '7219',
      '7220',
      '7221',
      '7222',
      '7223',
      '7224',
      '7225',
      '7226',
      '7227',
      '7228',
      '7229',
      '7301',
      '7302',
      '7303',
      '7304',
      '7305',
      '7306',
      '7307',
      '7308',
      '7309',
      '7310',
      '7311',
      '7318',
      '7326',
    ],
    descriptions: [
      'Pig iron and spiegeleisen',
      'Ferro-alloys',
      'Ferrous waste/scrap',
      'Iron/steel granules',
      'Iron/steel powder',
      'Iron ingots',
      'Semi-finished iron/steel',
      'Hot-rolled flat products',
      'Cold-rolled flat products',
      'Flat products (clad/plated/coated)',
      'Other flat-rolled products',
      'Flat products (narrow)',
      'Bars/rods (hot-rolled)',
      'Other bars/rods',
      'Other bars/rods (cold)',
      'Angles/shapes/sections',
      'Wire',
      'Stainless semi-finished',
      'Stainless flat (hot-rolled)',
      'Stainless flat (cold-rolled)',
      'Stainless wire rod',
      'Stainless bars',
      'Stainless wire',
      'Other alloy steel ingots',
      'Other alloy flat products',
      'Other alloy flat (narrow)',
      'Other alloy wire rod',
      'Other alloy bars/rods',
      'Other alloy wire',
      'Sheet piling',
      'Railway track',
      'Tubes/pipes (cast iron)',
      'Tubes/pipes (seamless)',
      'Other tubes/pipes',
      'Other tubes/pipes (welded)',
      'Tube/pipe fittings',
      'Structures/parts',
      'Reservoirs/tanks',
      'Tanks/casks',
      'Containers for compressed gas',
      'Bolts/nuts/screws',
      'Other iron/steel articles',
    ],
  },
  aluminium: {
    category: 'Aluminium',
    codes: [
      '7601',
      '7602',
      '7603',
      '7604',
      '7605',
      '7606',
      '7607',
      '7608',
      '7609',
      '7610',
      '7611',
      '7612',
      '7613',
      '7614',
      '7615',
      '7616',
    ],
    descriptions: [
      'Unwrought aluminium',
      'Aluminium waste/scrap',
      'Aluminium powders/flakes',
      'Aluminium bars/rods/profiles',
      'Aluminium wire',
      'Aluminium plates/sheets',
      'Aluminium foil',
      'Aluminium tubes/pipes',
      'Aluminium tube fittings',
      'Aluminium structures',
      'Aluminium reservoirs/tanks',
      'Aluminium casks/drums',
      'Aluminium containers (compressed gas)',
      'Aluminium stranded wire/cables',
      'Aluminium table/kitchen/sanitary ware',
      'Other aluminium articles',
    ],
  },
  fertilizers: {
    category: 'Fertilizers',
    codes: ['2808 00', '3102', '3105'],
    descriptions: [
      'Nitric acid; sulphonitric acids',
      'Mineral or chemical fertilisers, nitrogenous',
      'Mineral or chemical fertilisers (2+ nutrients)',
    ],
  },
  electricity: {
    category: 'Electricity',
    codes: ['2716 00 00'],
    descriptions: ['Electrical energy'],
  },
  hydrogen: {
    category: 'Hydrogen',
    codes: ['2804 10 00'],
    descriptions: ['Hydrogen'],
  },
} as const;

// ============ INSTALLATION REGISTRY (Synthetic Seeds) ============

/**
 * Seed installation profiles for synthetic data generation.
 * Each represents a real-world archetype with validated emission ranges.
 *
 * Source: EU CBAM Transitional Registry guidance, EUTL installation data,
 * World Steel Association statistical yearbook 2024.
 */
export interface InstallationProfile {
  id: string;
  country: string; // ISO 3166-1 alpha-2
  countryName: string;
  sector: string;
  productionRoute: string;
  capacityTonnesPerYear: number;
  emissionRange: { min: number; max: number }; // tCO2e/t product
  energySources: string[];
  unlocode?: string; // UN/LOCODE for port/facility
  source: string; // Citation
}

export const SEED_INSTALLATIONS: InstallationProfile[] = [
  // === STEEL ===
  {
    id: 'TR-992-IRON',
    country: 'TR',
    countryName: 'Turkiye',
    sector: 'steel',
    productionRoute: 'Blast Furnace (BF-BOF)',
    capacityTonnesPerYear: 3_500_000,
    emissionRange: { min: 1.8, max: 2.5 },
    energySources: ['coal', 'coke', 'natural gas', 'BF gas recovery'],
    unlocode: 'TRIST',
    source: 'World Steel Association 2024 — Turkey BF-BOF avg 2.1 tCO2e/t',
  },
  {
    id: 'IN-551-STEEL',
    country: 'IN',
    countryName: 'India',
    sector: 'steel',
    productionRoute: 'Blast Furnace (BF-BOF)',
    capacityTonnesPerYear: 5_000_000,
    emissionRange: { min: 2.0, max: 2.8 },
    energySources: ['coal', 'coke', 'captive power (coal)'],
    unlocode: 'INJNP',
    source: 'IEA Iron and Steel Technology Roadmap 2024 — India avg 2.4 tCO2e/t',
  },
  {
    id: 'CN-008-ALU',
    country: 'CN',
    countryName: 'China',
    sector: 'aluminium',
    productionRoute: 'Hall-Heroult Electrolysis',
    capacityTonnesPerYear: 800_000,
    emissionRange: { min: 12.0, max: 18.0 },
    energySources: ['coal-fired grid electricity', 'captive coal power'],
    unlocode: 'CNLYG',
    source: 'IAI 2024 — China primary aluminium avg 16.2 tCO2e/t (incl. indirect)',
  },
  {
    id: 'RU-201-STEEL',
    country: 'RU',
    countryName: 'Russia',
    sector: 'steel',
    productionRoute: 'Electric Arc Furnace (EAF)',
    capacityTonnesPerYear: 2_000_000,
    emissionRange: { min: 0.4, max: 0.9 },
    energySources: ['grid electricity (gas+hydro mix)', 'natural gas', 'scrap input'],
    unlocode: 'RULED',
    source: 'World Steel Association 2024 — Russia EAF avg 0.6 tCO2e/t',
  },
  {
    id: 'EG-044-FERT',
    country: 'EG',
    countryName: 'Egypt',
    sector: 'fertilizers',
    productionRoute: 'Haber-Bosch (steam methane reforming)',
    capacityTonnesPerYear: 1_200_000,
    emissionRange: { min: 1.6, max: 2.5 },
    energySources: ['natural gas (feedstock + fuel)', 'grid electricity'],
    unlocode: 'EGADB',
    source: 'IFA 2024 — MENA ammonia avg 1.9 tCO2e/t NH3',
  },
  {
    id: 'UA-117-STEEL',
    country: 'UA',
    countryName: 'Ukraine',
    sector: 'steel',
    productionRoute: 'Direct Reduced Iron (DRI)',
    capacityTonnesPerYear: 1_500_000,
    emissionRange: { min: 1.0, max: 1.6 },
    energySources: ['natural gas (DRI)', 'grid electricity'],
    unlocode: 'UAODS',
    source: 'World Steel Association 2024 — DRI-EAF route avg 1.2 tCO2e/t',
  },
  // === CEMENT ===
  {
    id: 'VN-303-CEM',
    country: 'VN',
    countryName: 'Vietnam',
    sector: 'cement',
    productionRoute: 'Dry process rotary kiln',
    capacityTonnesPerYear: 4_000_000,
    emissionRange: { min: 0.6, max: 0.9 },
    energySources: ['coal', 'petroleum coke', 'waste-derived fuels'],
    unlocode: 'VNHPH',
    source: 'GCCA 2024 — SE Asia cement avg 0.68 tCO2e/t clinker',
  },
  {
    id: 'MA-078-CEM',
    country: 'MA',
    countryName: 'Morocco',
    sector: 'cement',
    productionRoute: 'Dry process rotary kiln',
    capacityTonnesPerYear: 2_500_000,
    emissionRange: { min: 0.55, max: 0.8 },
    energySources: ['petroleum coke', 'coal', 'wind co-generation'],
    unlocode: 'MACAS',
    source: 'GCCA 2024 — North Africa cement avg 0.63 tCO2e/t clinker',
  },
  // === HYDROGEN ===
  {
    id: 'SA-511-H2',
    country: 'SA',
    countryName: 'Saudi Arabia',
    sector: 'hydrogen',
    productionRoute: 'Steam Methane Reforming (grey H2)',
    capacityTonnesPerYear: 200_000,
    emissionRange: { min: 8.5, max: 12.0 },
    energySources: ['natural gas (feedstock + fuel)'],
    unlocode: 'SAJUB',
    source: 'IEA Global Hydrogen Review 2024 — SMR grey H2 avg 9.2 tCO2e/t H2',
  },
  {
    id: 'NO-622-H2',
    country: 'NO',
    countryName: 'Norway',
    sector: 'hydrogen',
    productionRoute: 'PEM Electrolysis (green H2)',
    capacityTonnesPerYear: 50_000,
    emissionRange: { min: 0.3, max: 1.5 },
    energySources: ['hydroelectric grid (99% renewable)', 'wind'],
    unlocode: 'NOSVG',
    source: 'IEA Global Hydrogen Review 2024 — Nordic electrolysis avg 0.8 tCO2e/t H2',
  },
  // === ELECTRICITY ===
  {
    id: 'BA-901-ELEC',
    country: 'BA',
    countryName: 'Bosnia and Herzegovina',
    sector: 'electricity',
    productionRoute: 'Lignite thermal power',
    capacityTonnesPerYear: 0, // MWh not tonnes
    emissionRange: { min: 0.8, max: 1.2 },
    energySources: ['lignite'],
    source: 'EEA GHG Inventory 2024 — W. Balkans grid avg 0.95 tCO2e/MWh',
  },
  {
    id: 'GB-444-ELEC',
    country: 'GB',
    countryName: 'United Kingdom',
    sector: 'electricity',
    productionRoute: 'Gas CCGT + offshore wind mix',
    capacityTonnesPerYear: 0,
    emissionRange: { min: 0.15, max: 0.35 },
    energySources: ['natural gas CCGT', 'offshore wind', 'nuclear'],
    source: 'DESNZ 2024 — UK grid factor 0.207 kgCO2e/kWh',
  },
];

// ============ NeMo DataDesigner SCHEMA ============

/**
 * Column configuration types aligned with NeMo DataDesigner API.
 *
 * NeMo DataDesigner uses a discriminated union on `column_type` field:
 *   "sampler" | "expression" | "llm-text" | "llm-judge" | "llm-structured"
 *   | "llm-code" | "validation" | "seed-dataset" | "embedding" | "image" | "custom"
 *
 * Sampler types: "uuid" | "category" | "subcategory" | "uniform" | "gaussian"
 *   | "bernoulli" | "poisson" | "scipy" | "person" | "datetime" | "timedelta"
 *
 * Source: github.com/NVIDIA-NeMo/DataDesigner (Apache 2.0)
 *   packages/data-designer-config/src/data_designer/config/column_configs.py
 */
export interface SamplerColumnConfig {
  name: string;
  column_type: 'sampler';
  sampler_type: 'category' | 'uniform' | 'gaussian' | 'uuid' | 'person' | 'datetime';
  params: { values?: string[] | number[]; weights?: number[]; low?: number; high?: number };
  drop?: boolean;
}

export interface ExpressionColumnConfig {
  name: string;
  column_type: 'expression';
  /** Jinja2 expression string — can reference other columns and Python builtins */
  expr: string;
  dtype?: 'int' | 'float' | 'str' | 'bool';
  drop?: boolean;
}

export interface LLMTextColumnConfig {
  name: string;
  column_type: 'llm-text';
  model_alias: string;
  /** Jinja2 prompt template — use {{ column_name }} for interpolation */
  prompt: string;
  system_prompt?: string;
  max_tokens?: number;
  drop?: boolean;
}

export interface LLMJudgeColumnConfig {
  name: string;
  column_type: 'llm-judge';
  model_alias: string;
  prompt: string;
  scores: Array<{ name: string; description: string; options: Record<string, string> }>;
  drop?: boolean;
}

export interface LookupColumnConfig {
  name: string;
  column_type: 'expression';
  /** Expression-based lookup via Jinja2 dict access */
  expr: string;
  dtype: 'str';
  drop?: boolean;
}

export type ColumnConfig =
  | SamplerColumnConfig
  | ExpressionColumnConfig
  | LLMTextColumnConfig
  | LLMJudgeColumnConfig
  | LookupColumnConfig;

export interface ValidationConfig {
  judge_model: string;
  criteria: string;
  min_score: number;
  retry_on_fail: boolean;
  max_retries: number;
}

/**
 * Top-level schema matching NeMo DataDesigner's DataDesignerConfig.
 * Can be serialized to YAML via DataDesignerConfigBuilder.write_config().
 */
export interface NeMoDatasetSchema {
  dataset_name: string;
  version: string;
  description: string;
  target_rows: number;
  columns: ColumnConfig[];
  model_configs?: Array<{ alias: string; model: string; provider?: string }>;
  validation: ValidationConfig;
  metadata: {
    regulation: string;
    source_citations: string[];
    created: string;
    owner: string;
  };
}

// ============ HELPERS ============

/**
 * Build a Jinja2 dict-lookup expression for NeMo DataDesigner.
 * Converts [key, value] pairs into: {{ {"key1": "val1", "key2": "val2"}[installation_id] }}
 */
function buildLookupExpr(pairs: string[][]): string {
  const entries = pairs.map(([k, v]) => `"${k}": "${v}"`).join(', ');
  return `{{ {${entries}}[installation_id] }}`;
}

// ============ SCHEMA BUILDER ============

/**
 * Build the CBAM stress-test dataset schema for NeMo DataDesigner.
 *
 * This schema generates synthetic CBAM declarations with intentional
 * anomalies to test the ComplianceAgent's audit capabilities.
 *
 * Integrates with: src/compliance/cbam-calculator.ts (calculateCBAM)
 * Tested by: src/agents/compliance.agent.ts (ComplianceAgent)
 */
export function buildCBAMStressTestSchema(): NeMoDatasetSchema {
  const installationIds = SEED_INSTALLATIONS.map((i) => i.id);

  return {
    dataset_name: 'DWS_IQ_CBAM_StressTest_v1',
    version: '1.0.0',
    description:
      'Synthetic CBAM declarations with embedded carbon leakage signatures ' +
      'for stress-testing DWS IQ compliance agents. Generated via NVIDIA NeMo ' +
      'DataDesigner with LLM-as-Judge validation.',
    target_rows: 100_000,
    model_configs: [
      { alias: 'nv-nemotron-3-70b', model: 'nvidia/nemotron-3-70b-instruct', provider: 'nim' },
      {
        alias: 'nv-nemotron-4-340b-instruct',
        model: 'nvidia/nemotron-4-340b-instruct',
        provider: 'nim',
      },
    ],
    columns: [
      // === DECLARANT INFO ===
      {
        name: 'declaration_id',
        column_type: 'expression',
        expr: 'f\'CBAM-{random.choice(["2026","2027"])}-Q{random.randint(1,4)}-{random.randint(100000,999999)}\'',
      },
      {
        name: 'declarant_eori',
        column_type: 'expression',
        expr: "f'FI{random.randint(1000000,9999999)}00'",
      },
      {
        name: 'reporting_period',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: ['2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4', '2027-Q1', '2027-Q2'],
          weights: [0.25, 0.25, 0.2, 0.15, 0.1, 0.05],
        },
      },

      // === INSTALLATION & PRODUCT ===
      {
        name: 'installation_id',
        column_type: 'sampler',
        sampler_type: 'category',
        params: { values: installationIds },
      },
      {
        name: 'origin_country',
        column_type: 'expression',
        expr: buildLookupExpr(SEED_INSTALLATIONS.map((i) => [i.id, i.country])),
        dtype: 'str',
      },
      {
        name: 'production_method',
        column_type: 'expression',
        expr: buildLookupExpr(SEED_INSTALLATIONS.map((i) => [i.id, i.productionRoute])),
        dtype: 'str',
      },
      {
        name: 'sector',
        column_type: 'expression',
        expr: buildLookupExpr(SEED_INSTALLATIONS.map((i) => [i.id, i.sector])),
        dtype: 'str',
      },
      {
        name: 'cn_code',
        column_type: 'expression',
        expr: buildLookupExpr(
          SEED_INSTALLATIONS.map((i) => {
            const sectorCodes = CBAM_CN_CODES[i.sector as keyof typeof CBAM_CN_CODES];
            return [i.id, sectorCodes?.codes[0] ?? 'UNKNOWN'];
          }),
        ),
        dtype: 'str',
      },
      {
        name: 'import_quantity_tonnes',
        column_type: 'expression',
        expr: 'round(random.uniform(50, 25000), 2)',
      },

      // === EMISSIONS DATA ===
      {
        name: 'embedded_emissions_direct',
        column_type: 'expression',
        expr: 'round(random.uniform(0.3, 18.0), 4)',
      },
      {
        name: 'embedded_emissions_indirect',
        column_type: 'expression',
        expr: 'round(random.uniform(0.0, 5.0), 4)',
      },
      {
        name: 'uses_default_values',
        column_type: 'sampler',
        sampler_type: 'category',
        params: { values: ['true', 'false'], weights: [0.35, 0.65] },
      },
      {
        name: 'carbon_price_paid_origin',
        column_type: 'expression',
        expr: 'round(random.choice([0, 0, 0, random.uniform(5, 65)]), 2)',
      },

      // === ENERGY & PRODUCTION CONTEXT ===
      {
        name: 'energy_source_primary',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: [
            'coal',
            'natural gas',
            'coke',
            'petroleum coke',
            'grid electricity (coal-heavy)',
            'grid electricity (gas mix)',
            'grid electricity (renewable-heavy)',
            'captive coal power',
            'biomass co-firing',
            'waste-derived fuels',
          ],
          weights: [0.18, 0.22, 0.1, 0.08, 0.12, 0.1, 0.05, 0.07, 0.04, 0.04],
        },
      },
      {
        name: 'electricity_consumption_mwh_per_tonne',
        column_type: 'expression',
        expr: 'round(random.uniform(0.05, 15.0), 3)',
      },
      {
        name: 'precursor_materials',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: [
            'iron ore, coke, limestone',
            'scrap steel, lime, electrodes',
            'iron ore, natural gas, lime',
            'bauxite, alumina, cryolite',
            'clinker, gypsum, fly ash',
            'natural gas feedstock',
            'ammonia, nitric acid',
            'n/a (electricity)',
          ],
        },
      },

      // === MILL TEST CERTIFICATE (MTC) NARRATIVE ===
      {
        name: 'mtc_narrative',
        column_type: 'llm-text',
        model_alias: 'nv-nemotron-3-70b',
        max_tokens: 1024,
        prompt:
          'You are a metallurgical quality engineer writing a Mill Test Certificate ' +
          '(MTC) comment for a CBAM-covered shipment.\n\n' +
          'Installation: {{ installation_id }} ({{ origin_country }})\n' +
          'Production route: {{ production_method }}\n' +
          'Sector: {{ sector }}\n' +
          'CN Code: {{ cn_code }}\n' +
          'Quantity: {{ import_quantity_tonnes }} tonnes\n' +
          'Stated direct emissions: {{ embedded_emissions_direct }} tCO2e/t\n' +
          'Energy source: {{ energy_source_primary }}\n' +
          'Precursors: {{ precursor_materials }}\n\n' +
          'Write a technical MTC comment (3-5 paragraphs) covering:\n' +
          '1. Chemical composition and mechanical properties summary\n' +
          '2. Production route and heat treatment details\n' +
          '3. Energy consumption and emission monitoring methodology\n' +
          '4. Quality certifications (EN 10204, ISO 14064)\n\n' +
          'IMPORTANT: In 30% of cases, intentionally include a subtle discrepancy ' +
          'between the stated carbon intensity ({{ embedded_emissions_direct }} tCO2e/t) ' +
          'and the energy source cited. For example, claiming low emissions but citing ' +
          'coal-heavy grid, or claiming BF-BOF route but with EAF-level emissions. ' +
          'This tests agent audit capabilities for carbon leakage detection.',
      },

      // === VERIFICATION METADATA ===
      {
        name: 'verifier_accreditation',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: [
            'TUV SUD (DE-V-0012)',
            'Bureau Veritas (FR-V-0003)',
            'DNV (NO-V-0001)',
            'SGS (CH-V-0007)',
            'LRQA (GB-V-0015)',
            'UNVERIFIED',
          ],
          weights: [0.2, 0.2, 0.2, 0.15, 0.1, 0.15],
        },
      },
      {
        name: 'verification_methodology',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: [
            'ISO 14064-3:2019 (reasonable assurance)',
            'ISO 14064-3:2019 (limited assurance)',
            'EU MRV Regulation 2018/2066',
            'CBAM Implementing Regulation 2023/1773 Art. 4',
            'self-declared (no third-party verification)',
          ],
          weights: [0.25, 0.2, 0.2, 0.2, 0.15],
        },
      },

      // === ANOMALY INJECTION (for agent testing) ===
      {
        name: 'anomaly_type',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: [
            'none',
            'emission_energy_mismatch',
            'production_route_emission_mismatch',
            'unverified_low_emissions',
            'default_values_with_low_claim',
            'missing_precursor_data',
            'carbon_price_credit_overclaim',
            'cn_code_sector_mismatch',
          ],
          weights: [0.4, 0.12, 0.1, 0.1, 0.08, 0.08, 0.07, 0.05],
        },
      },
      {
        name: 'anomaly_severity',
        column_type: 'sampler',
        sampler_type: 'category',
        params: {
          values: ['none', 'low', 'medium', 'high', 'critical'],
          weights: [0.4, 0.15, 0.2, 0.15, 0.1],
        },
      },
    ],

    validation: {
      judge_model: 'nv-nemotron-4-340b-instruct',
      criteria:
        'Evaluate whether this synthetic CBAM filing contains: ' +
        '(1) internally consistent emission data matching the stated production route, ' +
        '(2) a logically verifiable carbon leakage signature per EU 2023/956 and 2025/2547, ' +
        '(3) realistic technical language matching real-world MTCs, ' +
        '(4) CN codes matching the declared sector. ' +
        'Score 0.0-1.0 where 1.0 = perfect regulatory fidelity.',
      min_score: 0.95,
      retry_on_fail: true,
      max_retries: 3,
    },

    metadata: {
      regulation:
        'EU CBAM Regulation 2023/956 + Implementing Regulation 2023/1773 + Delegated Regulation 2025/2547',
      source_citations: [
        'EU ETS Benchmark 2021-2025 (Commission Implementing Regulation 2021/447)',
        'CBAM transitional default values (Implementing Regulation 2023/1773)',
        'World Steel Association Statistical Yearbook 2024',
        'International Aluminium Institute (IAI) GHG Data 2024',
        'GCCA Getting the Numbers Right (GNR) 2024',
        'IEA Iron and Steel Technology Roadmap 2024',
        'IEA Global Hydrogen Review 2024',
        'EEA GHG Inventory 2024',
        'IFA Fertilizer Industry Handbook 2024',
      ],
      created: '2026-04-06',
      owner: 'Lifetime Oy (0772407-9)',
    },
  };
}

/**
 * Get emission factor range for a given installation, used to validate
 * synthetic data against real-sourced bounds.
 */
export function getInstallationEmissionBounds(
  installationId: string,
): { min: number; max: number } | undefined {
  const installation = SEED_INSTALLATIONS.find((i) => i.id === installationId);
  return installation?.emissionRange;
}

/**
 * Validate that a synthetic emission value falls within the real-sourced
 * bounds for its installation. Returns false for anomalous records
 * (which is expected — anomalies are intentional for agent testing).
 */
export function isEmissionWithinBounds(installationId: string, emissionFactor: number): boolean {
  const bounds = getInstallationEmissionBounds(installationId);
  if (!bounds) return false;
  return emissionFactor >= bounds.min && emissionFactor <= bounds.max;
}
