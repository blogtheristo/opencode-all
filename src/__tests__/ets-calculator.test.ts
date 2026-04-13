/**
 * ETS Calculator Tests
 *
 * Verifies EU ETS emission calculations, free allocation reduction,
 * and cost estimation with real EU benchmark factors.
 */

import { describe, expect, it } from 'vitest';
import { calculateETS, estimateETSCost, type ETSInstallation } from '../compliance/ets-calculator.js';
import { ETS_CARBON_PRICE_EUR, ETS_EMISSION_FACTORS } from '../compliance/emission-factors.js';

describe('ETS Calculator', () => {
  const steelPlant: ETSInstallation = {
    name: 'Nordic Steel Oy',
    sector: 'steel',
    activityData: [
      { product: 'Hot metal', quantity: 100_000 }, // 100k tonnes
    ],
    freeAllocationTonnes: 80_000,
  };

  it('calculates total emissions from activity data', () => {
    const result = calculateETS(steelPlant);

    // Hot metal factor is 1.328 tCO2e/t → 100,000 × 1.328 = 132,800
    expect(result.totalEmissions).toBe(132800);
    expect(result.emissionBreakdown).toHaveLength(1);
    expect(result.emissionBreakdown[0].product).toBe('Hot metal');
    expect(result.emissionBreakdown[0].factor).toBe(1.328);
  });

  it('calculates surrender obligation after free allocation', () => {
    const result = calculateETS(steelPlant, 2026);

    // Free allocation reduces over time (Phase 4 linear reduction)
    expect(result.freeAllocation).toBeLessThan(80_000);
    expect(result.surrenderObligation).toBeGreaterThan(0);
    expect(result.surrenderObligation).toBe(
      Math.round((result.totalEmissions - result.freeAllocation) * 100) / 100,
    );
  });

  it('calculates estimated cost using carbon price', () => {
    const customPrice = 70;
    const result = calculateETS(steelPlant, 2026, customPrice);

    expect(result.carbonPrice).toBe(customPrice);
    expect(result.estimatedCost).toBe(
      Math.round(result.surrenderObligation * customPrice * 100) / 100,
    );
  });

  it('applies Phase 4 free allocation reduction factor', () => {
    const result2024 = calculateETS(steelPlant, 2024);
    const result2028 = calculateETS(steelPlant, 2028);

    // Later years have more reduction → less free allocation
    expect(result2028.freeAllocation).toBeLessThan(result2024.freeAllocation);
    expect(result2028.freeAllocationReduction).toBeGreaterThan(result2024.freeAllocationReduction);
  });

  it('flags installations exceeding 25,000 tCO2e threshold', () => {
    const result = calculateETS(steelPlant);
    expect(result.exceedsThreshold).toBe(true);

    const smallPlant: ETSInstallation = {
      name: 'Small Bakery',
      sector: 'construction',
      activityData: [{ product: 'Bricks', quantity: 100 }],
    };
    const smallResult = calculateETS(smallPlant);
    expect(smallResult.exceedsThreshold).toBe(false);
  });

  it('handles zero free allocation', () => {
    const noFreeAlloc: ETSInstallation = {
      name: 'Power Plant',
      sector: 'energy',
      activityData: [{ product: 'Electricity (coal)', quantity: 1000 }], // 1000 MWh
    };
    const result = calculateETS(noFreeAlloc);

    expect(result.freeAllocation).toBe(0);
    expect(result.surrenderObligation).toBe(result.totalEmissions);
  });

  it('uses specific emission factor by ID when provided', () => {
    const plant: ETSInstallation = {
      name: 'EAF Steel',
      sector: 'steel',
      activityData: [
        { product: 'Steel', quantity: 50_000, emissionFactorId: 'ETS-STEEL-EAF' },
      ],
    };
    const result = calculateETS(plant);

    // EAF factor is 0.283, not hot metal 1.328
    expect(result.emissionBreakdown[0].factor).toBe(0.283);
    expect(result.totalEmissions).toBe(14150); // 50,000 × 0.283
  });

  it('handles multiple activity data entries', () => {
    const mixedPlant: ETSInstallation = {
      name: 'Integrated Steel',
      sector: 'steel',
      activityData: [
        { product: 'Hot metal', quantity: 50_000 },
        { product: 'Coke', quantity: 20_000 },
      ],
    };
    const result = calculateETS(mixedPlant);

    expect(result.emissionBreakdown).toHaveLength(2);
    // Hot metal: 50,000 × 1.328 = 66,400
    // Coke: 20,000 × 0.286 = 5,720
    expect(result.totalEmissions).toBe(72120);
  });
});

describe('estimateETSCost', () => {
  it('returns correct cost for simple calculation', () => {
    const result = estimateETSCost(100_000, 50_000, 65);
    expect(result.surrenderObligation).toBe(50_000);
    expect(result.estimatedCost).toBe(3_250_000);
  });

  it('returns zero cost when free allocation covers emissions', () => {
    const result = estimateETSCost(10_000, 20_000);
    expect(result.surrenderObligation).toBe(0);
    expect(result.estimatedCost).toBe(0);
  });

  it('uses default carbon price', () => {
    const result = estimateETSCost(10_000);
    expect(result.estimatedCost).toBe(10_000 * ETS_CARBON_PRICE_EUR);
  });
});

describe('ETS Emission Factors', () => {
  it('has factors for all major ETS sectors', () => {
    const sectors = new Set(ETS_EMISSION_FACTORS.map((f) => f.sector));
    expect(sectors).toContain('steel');
    expect(sectors).toContain('cement');
    expect(sectors).toContain('aluminium');
    expect(sectors).toContain('chemicals');
    expect(sectors).toContain('energy');
  });

  it('has unique factor IDs', () => {
    const ids = ETS_EMISSION_FACTORS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all factors are positive numbers', () => {
    for (const f of ETS_EMISSION_FACTORS) {
      expect(f.factor).toBeGreaterThan(0);
    }
  });
});
