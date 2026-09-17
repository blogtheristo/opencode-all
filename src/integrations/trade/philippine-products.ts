/**
 * DWS IQ 6 - Philippine Import Product Catalog
 *
 * 10 climate & food products from the Philippines for EU import.
 * All data includes HS codes, EU tariff rates under GSP+,
 * carbon footprint estimates, and compliance requirements.
 *
 * Sources:
 * - EU GSP+ tariff schedule (Regulation EU 978/2012)
 * - Philippine Statistics Authority export data
 * - IPCC emission factors for agriculture & materials
 * - EU CBAM Regulation (EU 2023/956)
 * - EU Deforestation Regulation (EU 2023/1115)
 */

import {
  CarbonImpactRating,
  CBAMStatus,
  ImportComplianceStatus,
  OriginCountry,
  TariffScheme,
  type TradeProduct,
  TradeProductCategory,
  TradeProductStatus,
} from './types';

// ============================================================================
// Philippine Import Product Catalog
// ============================================================================

export const PHILIPPINE_PRODUCTS: Omit<TradeProduct, 'id' | 'createdAt' | 'updatedAt'>[] = [

  // ──────────────────────────────────────────────────────────────────────────
  // FOOD PRODUCTS (6 products)
  // ──────────────────────────────────────────────────────────────────────────

  {
    productCode: 'PH-VCO-001',
    name: 'Virgin Coconut Oil (VCO)',
    description:
      'Cold-pressed virgin coconut oil from Philippine coconut farms. ' +
      'Used as cooking oil, food ingredient, and cosmetic base. ' +
      'Philippines is the world\'s largest VCO producer.',
    category: TradeProductCategory.FOOD,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Quezon Province / Zamboanga Peninsula',
    hsCode: '1513.11',
    cnCode: '1513 11 10',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 6.4,
    unitPrice: 3.20,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 0.64,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.42,
      a4_transport: 0.18,
      c_endOfLife: 0.04,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Coconut palms are perennial carbon sinks. ' +
      'VCO cold-press process uses minimal energy vs refined oils.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: true,
      euOrganicCertBody: 'Control Union (CU)',
      reachCompliant: true,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'Phytosanitary Certificate',
        'EU Organic Certificate',
        'Certificate of Analysis (CoA)',
        'Commercial Invoice',
        'Bill of Lading',
      ],
    },
    metadata: {
      annualPHExportTonnes: 180_000,
      topEUMarkets: ['Netherlands', 'Germany', 'Spain'],
      shelfLifeMonths: 24,
    },
  },

  {
    productCode: 'PH-MNG-001',
    name: 'Dried Mangoes (Carabao variety)',
    description:
      'Dried Philippine Carabao mangoes, widely considered the sweetest mango variety. ' +
      'Major EU snack import. Cebu is the primary processing hub.',
    category: TradeProductCategory.FOOD,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Cebu / Guimaras',
    hsCode: '0804.50',
    cnCode: '0804 50 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 5.80,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 1.12,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.75,
      a4_transport: 0.28,
      c_endOfLife: 0.09,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Mango trees are significant carbon sinks (22 kg CO2/tree/year). ' +
      'Drying process is energy-intensive — solar drying reduces footprint 40%.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: false,
      reachCompliant: true,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'Phytosanitary Certificate',
        'EU Health Certificate',
        'Residue Analysis Report',
        'Commercial Invoice',
        'Bill of Lading',
      ],
    },
    metadata: {
      annualPHExportTonnes: 25_000,
      topEUMarkets: ['Germany', 'UK', 'Netherlands'],
      shelfLifeMonths: 12,
    },
  },

  {
    productCode: 'PH-CAC-001',
    name: 'Single-Origin Cacao Beans',
    description:
      'Philippine Trinitario cacao beans from Davao region. ' +
      'Growing EU specialty chocolate market demand. ' +
      'Lower transport carbon than West African supply chains.',
    category: TradeProductCategory.FOOD,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Davao del Sur / Bukidnon',
    hsCode: '1801.00',
    cnCode: '1801 00 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 4.50,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 0.95,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.58,
      a4_transport: 0.31,
      c_endOfLife: 0.06,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Cacao agroforestry systems sequester 2-4 tonnes CO2/ha/year. ' +
      'Philippine cacao is typically shade-grown under coconut canopy — ' +
      'dual carbon sink benefit.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.PENDING_REVIEW,
      gspPlusEligible: true,
      euDeforestationRegulation: true,
      euOrganicCertified: false,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'EU Deforestation Due Diligence Statement',
        'Geolocation Data of Production Plots',
        'Phytosanitary Certificate',
        'Certificate of Analysis (CoA)',
        'Commercial Invoice',
        'Bill of Lading',
      ],
      notes:
        'EU Deforestation Regulation (EUDR) applies to cacao from June 2025. ' +
        'Requires geolocation traceability to plot level.',
    },
    metadata: {
      annualPHExportTonnes: 5_000,
      topEUMarkets: ['Belgium', 'France', 'Germany'],
      shelfLifeMonths: 18,
    },
  },

  {
    productCode: 'PH-MOR-001',
    name: 'Moringa (Malunggay) Leaf Powder',
    description:
      'Dried and powdered moringa oleifera leaves. ' +
      'EU superfood market — high protein, iron, and vitamin content. ' +
      'Grows rapidly with minimal water, highly climate-resilient crop.',
    category: TradeProductCategory.FOOD,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Ilocos Norte / Pangasinan',
    hsCode: '1211.90',
    cnCode: '1211 90 86',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 12.00,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 0.35,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.15,
      a4_transport: 0.17,
      c_endOfLife: 0.03,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'One of the lowest carbon-footprint crops. ' +
      'Moringa fixes nitrogen, needs no fertilizer, tolerates drought. ' +
      'Trees grow 3-5m in first year, producing harvestable leaves within 60 days.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: true,
      euOrganicCertBody: 'Ecocert',
      reachCompliant: true,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'EU Novel Food Authorization (if needed)',
        'EU Organic Certificate',
        'Phytosanitary Certificate',
        'Heavy Metals Analysis Report',
        'Microbiological Analysis Report',
        'Commercial Invoice',
        'Bill of Lading',
      ],
      notes:
        'Moringa leaf is authorized under EU Novel Food Regulation. ' +
        'Verify authorization status for specific product forms.',
    },
    metadata: {
      annualPHExportTonnes: 2_000,
      topEUMarkets: ['Germany', 'France', 'Italy'],
      shelfLifeMonths: 24,
    },
  },

  {
    productCode: 'PH-MSC-001',
    name: 'Muscovado Sugar',
    description:
      'Unrefined whole cane sugar from Negros Occidental. ' +
      'Strong EU fair-trade and organic demand. ' +
      'Philippine muscovado has GI recognition potential.',
    category: TradeProductCategory.FOOD,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Negros Occidental',
    hsCode: '1701.13',
    cnCode: '1701 13 90',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 33.90,
    unitPrice: 1.80,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 0.52,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.30,
      a4_transport: 0.18,
      c_endOfLife: 0.04,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Muscovado uses minimal processing vs refined sugar — ' +
      'no centrifuge or chemical bleaching. ' +
      'Sugarcane bagasse used as biofuel at mills reduces fossil energy use.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: true,
      euOrganicCertBody: 'NASAA Certified Organic',
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'EU Organic Certificate',
        'Health Certificate',
        'Certificate of Analysis (CoA)',
        'Import License (EU sugar quota)',
        'Commercial Invoice',
        'Bill of Lading',
      ],
      notes:
        'EU sugar imports are quota-managed. ' +
        'GSP+ provides significant advantage (MFN rate is 33.9 EUR/100kg).',
    },
    metadata: {
      annualPHExportTonnes: 15_000,
      topEUMarkets: ['UK', 'Germany', 'Italy'],
      shelfLifeMonths: 36,
    },
  },

  {
    productCode: 'PH-SEA-001',
    name: 'Dried Seaweed / Carrageenan (E407)',
    description:
      'Kappaphycus and Eucheuma seaweed, processed into carrageenan (E407). ' +
      'Used as food thickener, stabilizer, and gelling agent in EU food industry. ' +
      'Philippines is the world\'s second-largest seaweed producer.',
    category: TradeProductCategory.FOOD,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Tawi-Tawi / Sulu / Palawan',
    hsCode: '1302.39',
    cnCode: '1302 39 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 8.50,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: -0.20,
    carbonImpactRating: CarbonImpactRating.CARBON_NEGATIVE,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: -0.45,
      a4_transport: 0.22,
      c_endOfLife: 0.03,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'CARBON NEGATIVE product. Seaweed absorbs CO2 during growth ' +
      '(~1.8 kg CO2 per kg dry weight). No freshwater, no fertilizer, no arable land needed. ' +
      'Also improves local marine biodiversity.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: false,
      reachCompliant: true,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'EU Food Additive Authorization (E407)',
        'Heavy Metals & Iodine Analysis Report',
        'Microbiological Analysis Report',
        'Certificate of Analysis (CoA)',
        'Commercial Invoice',
        'Bill of Lading',
      ],
    },
    metadata: {
      annualPHExportTonnes: 120_000,
      topEUMarkets: ['France', 'Denmark', 'Spain'],
      shelfLifeMonths: 36,
    },
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CLIMATE / SUSTAINABLE MATERIAL PRODUCTS (4 products)
  // ──────────────────────────────────────────────────────────────────────────

  {
    productCode: 'PH-COI-001',
    name: 'Coconut Coir & Husk Products',
    description:
      'Coconut coir pith and fiber from husk processing. ' +
      'Biodegradable peat replacement for EU horticulture. ' +
      'EU is phasing out peat extraction — creates strong demand.',
    category: TradeProductCategory.CLIMATE_MATERIAL,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Bicol Region / Leyte',
    hsCode: '5305.00',
    cnCode: '5305 00 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 0.45,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 0.12,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.04,
      a4_transport: 0.07,
      c_endOfLife: 0.01,
      d_beyondBoundary: -0.15,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Replaces peat in EU horticulture. Peat extraction releases ' +
      '~0.7 kg CO2/kg — coir is a 85% reduction. ' +
      'Circular economy product: waste stream from coconut oil industry. ' +
      'EU Peatland Strategy driving demand growth.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: false,
      reachCompliant: true,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'Phytosanitary Certificate',
        'Salt Content Analysis (for horticultural use)',
        'Commercial Invoice',
        'Bill of Lading',
      ],
    },
    metadata: {
      annualPHExportTonnes: 95_000,
      topEUMarkets: ['Netherlands', 'Germany', 'Belgium'],
      euPeatReplacementPotential: 'high',
    },
  },

  {
    productCode: 'PH-ABA-001',
    name: 'Abaca (Manila Hemp) Fiber',
    description:
      'World\'s strongest natural fiber, endemic to the Philippines. ' +
      'Used for biodegradable packaging, specialty paper (banknotes, tea bags), ' +
      'and automotive composites. Replaces synthetic fibers and plastics.',
    category: TradeProductCategory.SUSTAINABLE_FIBER,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Catanduanes / Leyte / Davao',
    hsCode: '5305.00',
    cnCode: '5305 00 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 2.80,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 0.38,
    carbonImpactRating: CarbonImpactRating.LOW,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 0.18,
      a4_transport: 0.16,
      c_endOfLife: 0.04,
      d_beyondBoundary: -0.25,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Replaces polypropylene (PP) in packaging — PP has 3.4 kgCO2e/kg footprint. ' +
      'Abaca is 89% lower carbon. Fully biodegradable in 3-6 months. ' +
      'Philippines supplies ~85% of global abaca.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: false,
      reachCompliant: true,
      sanitaryPhytosanitaryCert: false,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'Fiber Grade Classification Certificate',
        'Fumigation Certificate',
        'Commercial Invoice',
        'Bill of Lading',
      ],
      notes:
        'EU Single-Use Plastics Directive (2019/904) drives demand for ' +
        'natural fiber alternatives. Abaca is a key beneficiary.',
    },
    metadata: {
      annualPHExportTonnes: 70_000,
      topEUMarkets: ['UK', 'Germany', 'France'],
      globalMarketSharePercent: 85,
    },
  },

  {
    productCode: 'PH-ACC-001',
    name: 'Activated Carbon from Coconut Shells',
    description:
      'Granular and powdered activated carbon produced from coconut shell charcoal. ' +
      'Used for water purification, air filtration, and gold recovery. ' +
      'Circular economy product from coconut processing waste.',
    category: TradeProductCategory.CIRCULAR_ECONOMY,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Quezon Province / Mindanao',
    hsCode: '3802.10',
    cnCode: '3802 10 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 2.1,
    unitPrice: 1.90,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: 2.80,
    carbonImpactRating: CarbonImpactRating.MEDIUM,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: 2.30,
      a4_transport: 0.35,
      c_endOfLife: 0.15,
      d_beyondBoundary: -1.50,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'Activation process is energy-intensive (900-1100C). However, ' +
      'coconut shell is a waste product — no additional land use. ' +
      'Used activated carbon can be regenerated 3-5 times. ' +
      'Net climate benefit when displacing coal-based activated carbon (8.5 kgCO2e/kg).',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: false,
      reachCompliant: true,
      sanitaryPhytosanitaryCert: false,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'REACH Registration (for EU volumes >1 tonne/year)',
        'Safety Data Sheet (SDS)',
        'Iodine Number / Mesh Size Certificate',
        'Commercial Invoice',
        'Bill of Lading',
      ],
      notes:
        'EU Water Framework Directive drives demand for water treatment. ' +
        'Coconut-based AC is preferred over coal-based for sustainability.',
    },
    metadata: {
      annualPHExportTonnes: 110_000,
      topEUMarkets: ['Netherlands', 'Germany', 'Belgium'],
      coalACDisplacementFactor: 3.0,
    },
  },

  {
    productCode: 'PH-BAM-001',
    name: 'Bamboo (Raw & Processed)',
    description:
      'Giant bamboo (Bambusa blumeana) and kawayan tinik. ' +
      'Used for construction, textiles, packaging, and bio-composites. ' +
      'Fast-growing carbon sink replacing plastic and hardwood.',
    category: TradeProductCategory.CLIMATE_MATERIAL,
    status: TradeProductStatus.ACTIVE,
    originCountry: OriginCountry.PH,
    originRegion: 'Cagayan Valley / Bukidnon',
    hsCode: '1401.10',
    cnCode: '1401 10 00',
    tariffScheme: TariffScheme.GSP_PLUS,
    tariffRate: 0,
    mfnTariffRate: 0,
    unitPrice: 0.60,
    currency: 'EUR',
    unit: 'kg',
    carbonFootprintKgCO2ePerUnit: -0.50,
    carbonImpactRating: CarbonImpactRating.CARBON_NEGATIVE,
    cbamStatus: CBAMStatus.NOT_APPLICABLE,
    lifecycleStages: {
      a1_a3_production: -0.80,
      a4_transport: 0.22,
      c_endOfLife: 0.08,
      d_beyondBoundary: -0.30,
      unit: 'kgCO2e/kg',
    },
    climateNotes:
      'CARBON NEGATIVE material. Bamboo sequesters 12 tonnes CO2/ha/year — ' +
      '4x more than equivalent tree plantation. Harvestable in 3-5 years vs 20-50 for timber. ' +
      'No replanting needed — regenerates from root system. ' +
      'EU taxonomy-eligible as sustainable construction material.',
    euCompliance: {
      importComplianceStatus: ImportComplianceStatus.COMPLIANT,
      gspPlusEligible: true,
      euDeforestationRegulation: false,
      euOrganicCertified: false,
      reachCompliant: true,
      sanitaryPhytosanitaryCert: true,
      certificateOfOrigin: true,
      requiredDocuments: [
        'EUR.1 Certificate of Origin',
        'Phytosanitary Certificate',
        'Fumigation Certificate (ISPM-15 for raw bamboo)',
        'Forest Stewardship Council (FSC) Certification (optional)',
        'Commercial Invoice',
        'Bill of Lading',
      ],
      notes:
        'EU taxonomy classifies bamboo as sustainable material. ' +
        'Growing demand from EU construction sector under EPBD renovation wave.',
    },
    metadata: {
      annualPHExportTonnes: 8_000,
      topEUMarkets: ['Netherlands', 'Germany', 'Italy'],
      co2SequestrationPerHaPerYear: 12,
    },
  },
];

// ============================================================================
// Helper functions
// ============================================================================

/** Get all products in a given category */
export function getProductsByCategory(
  category: TradeProductCategory
): typeof PHILIPPINE_PRODUCTS {
  return PHILIPPINE_PRODUCTS.filter((p) => p.category === category);
}

/** Get all carbon-negative products */
export function getCarbonNegativeProducts(): typeof PHILIPPINE_PRODUCTS {
  return PHILIPPINE_PRODUCTS.filter(
    (p) => p.carbonImpactRating === CarbonImpactRating.CARBON_NEGATIVE
  );
}

/** Calculate total GSP+ tariff savings for a given product and quantity (kg) */
export function calculateGSPSavings(
  productCode: string,
  quantityKg: number
): { product: string; savingsEur: number; mfnDutyEur: number; gspDutyEur: number } | null {
  const product = PHILIPPINE_PRODUCTS.find((p) => p.productCode === productCode);
  if (!product || !product.unitPrice) return null;

  const cifValue = product.unitPrice * quantityKg;
  const mfnDutyEur = cifValue * (product.mfnTariffRate / 100);
  const gspDutyEur = cifValue * (product.tariffRate / 100);

  return {
    product: product.name,
    savingsEur: Math.round((mfnDutyEur - gspDutyEur) * 100) / 100,
    mfnDutyEur: Math.round(mfnDutyEur * 100) / 100,
    gspDutyEur: Math.round(gspDutyEur * 100) / 100,
  };
}

/** Summarize catalog for display */
export function getCatalogSummary(): {
  totalProducts: number;
  byCategory: Record<string, number>;
  carbonNegativeCount: number;
  gspPlusCount: number;
  averageCarbonFootprint: number;
} {
  const byCategory: Record<string, number> = {};
  let carbonNegativeCount = 0;
  let gspPlusCount = 0;
  let totalCarbon = 0;

  for (const p of PHILIPPINE_PRODUCTS) {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    if (p.carbonImpactRating === CarbonImpactRating.CARBON_NEGATIVE) carbonNegativeCount++;
    if (p.tariffScheme === TariffScheme.GSP_PLUS) gspPlusCount++;
    totalCarbon += p.carbonFootprintKgCO2ePerUnit;
  }

  return {
    totalProducts: PHILIPPINE_PRODUCTS.length,
    byCategory,
    carbonNegativeCount,
    gspPlusCount,
    averageCarbonFootprint:
      Math.round((totalCarbon / PHILIPPINE_PRODUCTS.length) * 100) / 100,
  };
}
