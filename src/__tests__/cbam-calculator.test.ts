/**
 * CBAM Calculator Tests
 *
 * Verifies Carbon Border Adjustment Mechanism calculations,
 * origin country carbon price credits, and CBAM sector coverage.
 */

import { describe, expect, it } from 'vitest';
import {
  calculateCBAM,
  CBAM_COVERED_SECTORS,
  type CBAMDeclaration,
  estimateCBAMCost,
  isCBAMCovered,
  validateEORI,
} from '../compliance/cbam-calculator.js';
import {
  CBAM_CERTIFICATE_PRICE_EUR,
  CBAM_DEFAULT_FACTORS,
} from '../compliance/emission-factors.js';

describe('CBAM Calculator', () => {
  const steelImport: CBAMDeclaration = {
    declarant: 'Finnish Steel Importer Oy',
    eoriNumber: 'FI1234567890',
    reportingPeriod: '2026-Q1',
    imports: [
      {
        product: 'Iron and steel (hot-rolled)',
        sector: 'steel',
        quantity: 5_000, // 5,000 tonnes
        originCountry: 'CN',
      },
    ],
  };

  it('calculates embedded emissions using CBAM default factors', () => {
    const result = calculateCBAM(steelImport);

    // Steel hot-rolled factor: 1.852 tCO2e/t → 5,000 × 1.852 = 9,260
    expect(result.totalEmbeddedEmissions).toBe(9260);
    expect(result.usesDefaultValues).toBe(true);
    expect(result.importBreakdown[0].factorType).toBe('cbam-default');
  });

  it('calculates CBAM certificate cost', () => {
    const result = calculateCBAM(steelImport);

    // China has no recognized carbon pricing → full obligation
    expect(result.totalCarbonPriceCredit).toBe(0);
    expect(result.netCBAMObligation).toBe(result.totalEmbeddedEmissions);
    expect(result.estimatedCost).toBe(
      Math.round(result.netCBAMObligation * CBAM_CERTIFICATE_PRICE_EUR * 100) / 100,
    );
  });

  it('applies carbon price credit for UK imports', () => {
    const ukImport: CBAMDeclaration = {
      declarant: 'Importer',
      reportingPeriod: '2026-Q1',
      imports: [
        {
          product: 'Iron and steel (hot-rolled)',
          sector: 'steel',
          quantity: 5_000,
          originCountry: 'GB', // UK has ETS → credit applies
        },
      ],
    };

    const cnResult = calculateCBAM(steelImport);
    const ukResult = calculateCBAM(ukImport);

    // UK should have lower net obligation due to UK ETS credit
    expect(ukResult.netCBAMObligation).toBeLessThan(cnResult.netCBAMObligation);
    expect(ukResult.totalCarbonPriceCredit).toBeGreaterThan(0);
  });

  it('uses supplier-specific factor when provided', () => {
    const withSupplierData: CBAMDeclaration = {
      declarant: 'Informed Importer',
      reportingPeriod: '2026-Q1',
      imports: [
        {
          product: 'Steel',
          sector: 'steel',
          quantity: 1_000,
          originCountry: 'CN',
          supplierSpecificFactor: 1.2, // Lower than default 1.852
        },
      ],
    };

    const result = calculateCBAM(withSupplierData);

    expect(result.importBreakdown[0].factorType).toBe('supplier-specific');
    expect(result.importBreakdown[0].emissionFactor).toBe(1.2);
    expect(result.totalEmbeddedEmissions).toBe(1200); // 1000 × 1.2
    expect(result.usesDefaultValues).toBe(false);
  });

  it('handles multiple imports in one declaration', () => {
    const multiImport: CBAMDeclaration = {
      declarant: 'Multi Importer',
      reportingPeriod: '2026-Q2',
      imports: [
        { product: 'Steel', sector: 'steel', quantity: 2_000, originCountry: 'CN' },
        { product: 'Cement', sector: 'cement', quantity: 3_000, originCountry: 'TR' },
        { product: 'Aluminium', sector: 'aluminium', quantity: 500, originCountry: 'RU' },
      ],
    };

    const result = calculateCBAM(multiImport);

    expect(result.importBreakdown).toHaveLength(3);
    expect(result.affectedSectors).toContain('steel');
    expect(result.affectedSectors).toContain('cement');
    expect(result.affectedSectors).toContain('aluminium');
    expect(result.totalImportQuantity).toBe(5500);
  });

  it('detects definitive phase for 2026+', () => {
    const result = calculateCBAM(steelImport);
    expect(result.phase).toBe('definitive');

    const transitional: CBAMDeclaration = {
      ...steelImport,
      reportingPeriod: '2025-Q4',
    };
    const transResult = calculateCBAM(transitional);
    expect(transResult.phase).toBe('transitional');
  });

  it('applies explicit carbon price paid by importer', () => {
    const withPricePaid: CBAMDeclaration = {
      declarant: 'Price-Paid Importer',
      reportingPeriod: '2026-Q1',
      imports: [
        {
          product: 'Cement',
          sector: 'cement',
          quantity: 10_000,
          originCountry: 'TR', // Turkey — no recognized carbon pricing
          carbonPricePaid: 30, // EUR/tCO2 carbon tax paid in Turkey
        },
      ],
    };

    const withPrice = calculateCBAM(withPricePaid);
    const withoutPrice = calculateCBAM({
      ...withPricePaid,
      imports: [
        {
          ...withPricePaid.imports[0],
          carbonPricePaid: undefined,
        },
      ],
    });

    // Explicit price should reduce obligation
    expect(withPrice.netCBAMObligation).toBeLessThan(withoutPrice.netCBAMObligation);
  });
});

describe('isCBAMCovered', () => {
  it('returns true for covered sectors', () => {
    expect(isCBAMCovered('steel')).toBe(true);
    expect(isCBAMCovered('cement')).toBe(true);
    expect(isCBAMCovered('aluminium')).toBe(true);
    expect(isCBAMCovered('fertilizers')).toBe(true);
    expect(isCBAMCovered('electricity')).toBe(true);
    expect(isCBAMCovered('hydrogen')).toBe(true);
  });

  it('returns false for non-covered sectors', () => {
    expect(isCBAMCovered('textiles')).toBe(false);
    expect(isCBAMCovered('food')).toBe(false);
    expect(isCBAMCovered('software')).toBe(false);
  });
});

describe('estimateCBAMCost', () => {
  it('estimates cost for covered sectors', () => {
    const result = estimateCBAMCost(1_000, 'steel', 'CN');
    expect(result.covered).toBe(true);
    expect(result.embeddedEmissions).toBeGreaterThan(0);
    expect(result.estimatedCost).toBeGreaterThan(0);
  });

  it('returns zero for non-covered sectors', () => {
    const result = estimateCBAMCost(1_000, 'textiles', 'CN');
    expect(result.covered).toBe(false);
    expect(result.embeddedEmissions).toBe(0);
    expect(result.estimatedCost).toBe(0);
  });

  it('reduces cost for countries with carbon pricing', () => {
    const cnResult = estimateCBAMCost(1_000, 'cement', 'CN');
    const ukResult = estimateCBAMCost(1_000, 'cement', 'GB');

    // UK has carbon pricing → lower CBAM cost
    expect(ukResult.estimatedCost).toBeLessThan(cnResult.estimatedCost);
  });
});

describe('validateEORI', () => {
  it('accepts valid uppercase EORI format', () => {
    expect(validateEORI('FI1234567890')).toBeNull();
  });

  it('rejects lowercase country code in strict format mode', () => {
    expect(validateEORI('fi1234567890')).not.toBeNull();
  });

  it('rejects malformed EORI values', () => {
    expect(validateEORI('F1234567890')).not.toBeNull();
    expect(validateEORI('FI123')).not.toBeNull();
  });
});

describe('CBAM Default Factors', () => {
  it('covers all CBAM Annex I sectors', () => {
    const factorSectors = new Set(CBAM_DEFAULT_FACTORS.map((f) => f.sector));
    for (const sector of CBAM_COVERED_SECTORS) {
      if (sector === 'electricity') continue; // electricity uses energy sector
      expect(factorSectors).toContain(sector);
    }
  });

  it('has unique factor IDs', () => {
    const ids = CBAM_DEFAULT_FACTORS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all methodology is cbam-default (except proxy entries)', () => {
    for (const f of CBAM_DEFAULT_FACTORS) {
      // CBAM-LIME-PROXY uses ets-benchmark as proxy — lime is not yet in CBAM Annex I
      if (f.id.endsWith('-PROXY')) continue;
      expect(f.methodology).toBe('cbam-default');
    }
  });
});
