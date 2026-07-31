/**
 * EU CBAM Calculator
 *
 * Calculates Carbon Border Adjustment Mechanism obligations for importers.
 * Based on CBAM Regulation (EU) 2023/956 and Implementing Regulation 2023/1773.
 *
 * CBAM applies to imports of: cement, iron & steel, aluminium, fertilizers,
 * electricity, and hydrogen — effective 2026 (definitive phase).
 *
 * Formula:
 *   Embedded emissions = Import quantity × Emission factor (specific or default)
 *   CBAM certificates = Embedded emissions - (EU ETS-equivalent carbon price paid in origin country)
 *   Cost = CBAM certificates × Weekly average ETS auction price
 */

import {
  CBAM_CERTIFICATE_PRICE_EUR,
  type EmissionFactor,
  getFactorsForSector,
} from './emission-factors.js';

// ============ TYPES ============

export interface CBAMImport {
  product: string;
  sector: string;
  quantity: number; // tonnes (or MWh for electricity)
  originCountry: string; // ISO 3166-1 alpha-2
  supplierSpecificFactor?: number; // tCO2e/t — verified supplier data
  carbonPricePaid?: number; // EUR/tCO2 — carbon price already paid in origin country
}

export interface CBAMDeclaration {
  declarant: string;
  eoriNumber?: string; // EU Economic Operator Registration ID
  reportingPeriod: string; // e.g. "2026-Q1"
  imports: CBAMImport[];
}

export interface CBAMCalculationResult {
  declarant: string;
  reportingPeriod: string;
  totalImportQuantity: number; // tonnes
  totalEmbeddedEmissions: number; // tCO2e
  totalCarbonPriceCredit: number; // tCO2e credited from origin country carbon pricing
  netCBAMObligation: number; // tCO2e (certificates needed)
  estimatedCost: number; // EUR
  certificatePrice: number; // EUR/tCO2e
  importBreakdown: CBAMImportBreakdown[];
  affectedSectors: string[];
  usesDefaultValues: boolean; // true if any import uses CBAM default factors
  phase: 'transitional' | 'definitive';
}

export interface CBAMImportBreakdown {
  product: string;
  sector: string;
  originCountry: string;
  quantity: number;
  emissionFactor: number;
  factorType: 'supplier-specific' | 'cbam-default';
  embeddedEmissions: number; // tCO2e
  carbonPriceCredit: number; // tCO2e equivalent
  netObligation: number; // tCO2e
  estimatedCost: number; // EUR
}

// ============ CBAM SECTOR COVERAGE ============

/** CBAM Annex I covered sectors (definitive phase from 2026) */
export const CBAM_COVERED_SECTORS = [
  'cement',
  'steel',
  'aluminium',
  'fertilizers',
  'electricity',
  'hydrogen',
] as const;

export type CBAMSector = (typeof CBAM_COVERED_SECTORS)[number];

/**
 * Countries with carbon pricing recognized under CBAM.
 * Imports from these countries get a credit for carbon costs already paid.
 * Per CBAM Regulation Art. 9.
 */
const COUNTRIES_WITH_CARBON_PRICING: Record<string, number> = {
  // Country: effective carbon price EUR/tCO2e (2024 estimates)
  GB: 45, // UK ETS
  CH: 50, // Swiss ETS (linked to EU ETS)
  NZ: 30, // NZ ETS
  KR: 15, // Korean ETS
  CA: 40, // Canadian federal carbon price
  NO: 65, // Norway (EEA, mirrors EU ETS)
  IS: 65, // Iceland (EEA, mirrors EU ETS)
  LI: 65, // Liechtenstein (EEA, mirrors EU ETS)
};

// ============ CALCULATOR ============

/**
 * Calculate CBAM obligations for a set of imports.
 *
 * @param declaration - Import declaration with products and quantities
 * @param certificatePrice - Override CBAM certificate price (defaults to ETS auction price)
 */
export function calculateCBAM(
  declaration: CBAMDeclaration,
  certificatePrice: number = CBAM_CERTIFICATE_PRICE_EUR,
): CBAMCalculationResult {
  const breakdown: CBAMImportBreakdown[] = [];
  let totalQuantity = 0;
  let totalEmissions = 0;
  let totalCredit = 0;
  let totalNetObligation = 0;
  let usesDefaults = false;
  const sectors = new Set<string>();

  for (const imp of declaration.imports) {
    const result = calculateSingleImport(imp, certificatePrice);
    breakdown.push(result);

    totalQuantity += imp.quantity;
    totalEmissions += result.embeddedEmissions;
    totalCredit += result.carbonPriceCredit;
    totalNetObligation += result.netObligation;
    sectors.add(imp.sector);

    if (result.factorType === 'cbam-default') usesDefaults = true;
  }

  const estimatedCost = Math.round(totalNetObligation * certificatePrice * 100) / 100;

  // Determine phase: transitional (reporting only) vs definitive (purchase certificates)
  const year = parseInt(declaration.reportingPeriod.split('-')[0], 10);
  const phase = year < 2026 ? 'transitional' : 'definitive';

  return {
    declarant: declaration.declarant,
    reportingPeriod: declaration.reportingPeriod,
    totalImportQuantity: Math.round(totalQuantity * 100) / 100,
    totalEmbeddedEmissions: Math.round(totalEmissions * 100) / 100,
    totalCarbonPriceCredit: Math.round(totalCredit * 100) / 100,
    netCBAMObligation: Math.round(totalNetObligation * 100) / 100,
    estimatedCost,
    certificatePrice,
    importBreakdown: breakdown,
    affectedSectors: [...sectors],
    usesDefaultValues: usesDefaults,
    phase,
  };
}

/**
 * Calculate CBAM obligation for a single import line.
 */
function calculateSingleImport(imp: CBAMImport, certificatePrice: number): CBAMImportBreakdown {
  // Determine emission factor
  let emissionFactor: number;
  let factorType: 'supplier-specific' | 'cbam-default';

  if (imp.supplierSpecificFactor !== undefined && imp.supplierSpecificFactor > 0) {
    emissionFactor = imp.supplierSpecificFactor;
    factorType = 'supplier-specific';
  } else {
    const defaultFactor = resolveDefaultFactor(imp.product, imp.sector);
    emissionFactor = defaultFactor?.factor ?? 1.0;
    factorType = 'cbam-default';
  }

  const embeddedEmissions = Math.round(imp.quantity * emissionFactor * 100) / 100;

  // Calculate carbon price credit from origin country
  let carbonPriceCredit = 0;
  if (imp.carbonPricePaid && imp.carbonPricePaid > 0) {
    // Convert carbon price paid to equivalent tonnes credited
    carbonPriceCredit =
      Math.round((imp.carbonPricePaid / certificatePrice) * embeddedEmissions * 100) / 100;
  } else {
    // Check if origin country has recognized carbon pricing
    const countryPrice = COUNTRIES_WITH_CARBON_PRICING[imp.originCountry.toUpperCase()];
    if (countryPrice) {
      carbonPriceCredit =
        Math.round((countryPrice / certificatePrice) * embeddedEmissions * 100) / 100;
    }
  }

  const netObligation = Math.max(
    0,
    Math.round((embeddedEmissions - carbonPriceCredit) * 100) / 100,
  );
  const estimatedCost = Math.round(netObligation * certificatePrice * 100) / 100;

  return {
    product: imp.product,
    sector: imp.sector,
    originCountry: imp.originCountry,
    quantity: imp.quantity,
    emissionFactor,
    factorType,
    embeddedEmissions,
    carbonPriceCredit,
    netObligation,
    estimatedCost,
  };
}

/**
 * Resolve CBAM default emission factor for a product.
 */
function resolveDefaultFactor(product: string, sector: string): EmissionFactor | undefined {
  const sectorFactors = getFactorsForSector(sector, 'cbam');

  // Match by product name
  const productMatch = sectorFactors.find(
    (f) =>
      f.product.toLowerCase().includes(product.toLowerCase()) ||
      product.toLowerCase().includes(f.product.toLowerCase()),
  );
  if (productMatch) return productMatch;

  // Fallback to first sector factor
  return sectorFactors[0];
}

/**
 * Check if a product/sector combination falls under CBAM scope.
 */
export function isCBAMCovered(sector: string): boolean {
  return CBAM_COVERED_SECTORS.includes(sector.toLowerCase() as CBAMSector);
}

/**
 * Validate EORI number format (strict, case-sensitive).
 * Returns null when valid, otherwise an error message.
 */
export function validateEORI(eori: string): string | null {
  if (!eori) return 'EORI number is required';
  if (!/^[A-Z]{2}[A-Z0-9]{8,15}$/.test(eori)) {
    return 'Invalid EORI format. Use 2 uppercase country letters followed by 8-15 uppercase letters/digits.';
  }
  return null;
}

/**
 * Quick estimate of CBAM cost for a given import value and sector.
 * Used by the scoring engine for risk assessment without full declaration data.
 */
export function estimateCBAMCost(
  importQuantityTonnes: number,
  sector: string,
  originCountry: string = 'CN',
  certificatePrice: number = CBAM_CERTIFICATE_PRICE_EUR,
): { embeddedEmissions: number; estimatedCost: number; covered: boolean } {
  if (!isCBAMCovered(sector)) {
    return { embeddedEmissions: 0, estimatedCost: 0, covered: false };
  }

  const factor = resolveDefaultFactor(sector, sector);
  const emissionFactor = factor?.factor ?? 1.0;
  const embeddedEmissions = Math.round(importQuantityTonnes * emissionFactor * 100) / 100;

  // Apply origin country credit if applicable
  const countryPrice = COUNTRIES_WITH_CARBON_PRICING[originCountry.toUpperCase()] ?? 0;
  const creditRatio = countryPrice / certificatePrice;
  const netEmissions = embeddedEmissions * (1 - creditRatio);

  const estimatedCost = Math.round(Math.max(0, netEmissions) * certificatePrice * 100) / 100;

  return { embeddedEmissions, estimatedCost, covered: true };
}
