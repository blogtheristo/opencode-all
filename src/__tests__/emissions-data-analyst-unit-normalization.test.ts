/**
 * Unit tests for EmissionsDataAnalystAgent — ETS unit normalization
 *
 * Covers the fix for: ETS cost estimation must use tCO2e-normalized totals
 * and emit a flag when records contain unrecognized or mixed units.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmissionsDataAnalystAgent } from '../agents/emissions-data-analyst.agent.js';
import type { AgentContext } from '../agents/types.js';

// Suppress logger noise during tests
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const CONTEXT: AgentContext = {
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
  projectId: 'test-project',
};

describe('EmissionsDataAnalystAgent — ETS unit normalization', () => {
  let agent: EmissionsDataAnalystAgent;

  beforeEach(() => {
    agent = new EmissionsDataAnalystAgent();
  });

  it('uses normalizedTotalTCO2e for ETS cost estimate when all units are tCO2e', async () => {
    const response = await agent.execute(CONTEXT, {
      query: 'What is the ETS cost?',
      context: 'ets',
      data: [
        { amount: 10000, unit: 'tCO2e' },
        { amount: 20000, unit: 'tonne' },
      ],
    });

    const recommendations = response.recommendations as string[];
    const costRec = recommendations.find((r) => r.includes('EUR 68/tonne'));
    expect(costRec).toBeDefined();
    // 30 000 tCO2e × 68 = 2 040 000
    expect(costRec).toContain('2,040,000');
    // clean units — no extra label
    expect(costRec).not.toContain('partial');

    const stats = (response.result as Record<string, unknown>).statistics as Record<string, unknown>;
    expect(stats.normalizedTotalTCO2e).toBe(30000);
    expect(stats.unitNormalizationFlags).toHaveLength(0);
  });

  it('converts kg units to tCO2e (÷1000) for the ETS cost estimate', async () => {
    const response = await agent.execute(CONTEXT, {
      query: 'ETS estimate',
      context: 'ets',
      data: [
        { amount: 5_000_000, unit: 'kgCO2e' },  // → 5 000 tCO2e
        { amount: 1_000_000, unit: 'kg' },        // → 1 000 tCO2e
      ],
    });

    const stats = (response.result as Record<string, unknown>).statistics as Record<string, unknown>;
    // 5 000 000 / 1000 + 1 000 000 / 1000 = 6 000 tCO2e
    expect(stats.normalizedTotalTCO2e).toBe(6000);
    expect(stats.unitNormalizationFlags).toHaveLength(0);

    const costRec = (response.recommendations as string[]).find((r) => r.includes('EUR 68/tonne'));
    expect(costRec).toBeDefined();
    // 6 000 × 68 = 408 000
    expect(costRec).toContain('408,000');
  });

  it('handles mixed tonne and kg records with correct combined normalization', async () => {
    const response = await agent.execute(CONTEXT, {
      query: 'Mixed units test',
      context: 'ets',
      data: [
        { amount: 1000, unit: 'tCO2e' },        // → 1 000 tCO2e
        { amount: 500_000, unit: 'kgCO2e' },    // → 500 tCO2e
      ],
    });

    const stats = (response.result as Record<string, unknown>).statistics as Record<string, unknown>;
    expect(stats.normalizedTotalTCO2e).toBe(1500);
    expect(stats.unitNormalizationFlags).toHaveLength(0);
  });

  it('flags unrecognized units and labels cost estimate as partial', async () => {
    const response = await agent.execute(CONTEXT, {
      query: 'MWh units test',
      context: 'ets',
      data: [
        { amount: 5000, unit: 'tCO2e' },
        { amount: 1000, unit: 'MWh' },   // cannot auto-convert
      ],
    });

    const stats = (response.result as Record<string, unknown>).statistics as Record<string, unknown>;
    expect(stats.unitNormalizationFlags).toContain('MWh');
    // normalized total should only include the tCO2e record
    expect(stats.normalizedTotalTCO2e).toBe(5000);

    const regulatoryAnalysis = (response.result as Record<string, unknown>).regulatoryAnalysis as {
      flags: string[];
      recommendations: string[];
    };

    // A unit warning flag must be present
    const unitFlag = regulatoryAnalysis.flags.find((f) => f.includes('unrecognized units'));
    expect(unitFlag).toBeDefined();
    expect(unitFlag).toContain('MWh');

    // Cost estimate must be labelled as partial
    const costRec = regulatoryAnalysis.recommendations.find((r) => r.includes('EUR 68/tonne'));
    expect(costRec).toBeDefined();
    expect(costRec).toContain('partial');
    // 5 000 × 68 = 340 000
    expect(costRec).toContain('340,000');
  });

  it('flags all unrecognized units when no known units are present', async () => {
    const response = await agent.execute(CONTEXT, {
      query: 'All MWh data',
      context: 'ets',
      data: [
        { amount: 100, unit: 'MWh' },
        { amount: 200, unit: 'GWh' },
      ],
    });

    const stats = (response.result as Record<string, unknown>).statistics as Record<string, unknown>;
    expect(stats.normalizedTotalTCO2e).toBe(0);
    expect(stats.unitNormalizationFlags).toContain('MWh');
    expect(stats.unitNormalizationFlags).toContain('GWh');

    const regulatoryAnalysis = (response.result as Record<string, unknown>).regulatoryAnalysis as {
      flags: string[];
    };
    const unitFlag = regulatoryAnalysis.flags.find((f) => f.includes('unrecognized units'));
    expect(unitFlag).toBeDefined();
  });

  it('does not add unit warning flag when all units are recognized', async () => {
    const response = await agent.execute(CONTEXT, {
      query: 'Clean data',
      context: 'ets',
      data: [
        { amount: 1000, unit: 'tCO2e' },
        { amount: 500,  unit: 'tonnes' },
        { amount: 2000, unit: 'kgCO2e' },
      ],
    });

    const regulatoryAnalysis = (response.result as Record<string, unknown>).regulatoryAnalysis as {
      flags: string[];
    };
    const unitFlag = regulatoryAnalysis.flags.find((f) => f.includes('unrecognized units'));
    expect(unitFlag).toBeUndefined();
  });
});
