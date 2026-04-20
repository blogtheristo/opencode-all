/**
 * Compliance Agent V1.0 Integration Tests
 *
 * Tests that the ComplianceAgent correctly delegates to the scoring engine,
 * CBAM/ETS calculators, and report generator. Does NOT require LLM or Supabase.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComplianceAgent } from '../agents/compliance.agent.js';
import type { AgentContext } from '../agents/types.js';

// Mock the BaseAgent's logExecution and callLLM (they need Supabase/Groq)
vi.mock('../agents/base.agent.js', () => {
  return {
    BaseAgent: class MockBaseAgent {
      config: any;
      constructor(config: any) {
        this.config = config;
      }
      async logExecution() { /* no-op */ }
      async callLLM() {
        return {
          content: JSON.stringify({
            prioritizedActions: ['Implement emissions monitoring system'],
            riskAssessment: 'Medium risk — CSRD deadline approaching',
          }),
          model: 'mock',
          inputTokens: 0,
          outputTokens: 0,
        };
      }
    },
  };
});

const mockContext: AgentContext = {
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
  projectId: 'test-project',
};

describe('ComplianceAgent V1.0 Integration', () => {
  let agent: ComplianceAgent;

  beforeEach(() => {
    agent = new ComplianceAgent();
  });

  it('returns valid response with minimal input', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['ets', 'cbam', 'csrd'],
    });

    expect(result.agentName).toBe('compliance');
    expect(result.result).toBeDefined();
    expect(typeof (result.result as any).overallScore).toBe('number');
    expect((result.result as any).overallScore).toBeGreaterThanOrEqual(0);
    expect((result.result as any).overallScore).toBeLessThanOrEqual(100);
  });

  it('includes scoring engine fields in response', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['ets', 'cbam', 'csrd'],
      annualEmissions: 50000,
      importValue: 200000,
    });

    const r = result.result as any;

    // Scoring engine fields
    expect(typeof r.dataCompleteness).toBe('number');
    expect(r.regulationScores).toBeInstanceOf(Array);
    expect(r.gaps).toBeInstanceOf(Array);

    // Cost estimates from calculators
    expect(r.costEstimates).toBeDefined();
    expect(typeof r.costEstimates.ets.estimatedCost).toBe('number');
    expect(typeof r.costEstimates.cbam.estimatedCost).toBe('number');

    // Audit report
    expect(r.report).toBeDefined();
    expect(r.report.reportId).toMatch(/^CR-/);
    expect(r.report.metadata.framework).toBe('DWS IQ Compliance Engine');
  });

  it('maintains backward compatible fields', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'cement',
      regulations: ['csrd'],
      currentMeasures: {
        carbonReporting: true,
        emissionsMonitoring: false,
        supplyChainDueDiligence: false,
        aiSystemLogging: false,
      },
    });

    const r = result.result as any;

    // All backward-compat fields must be present
    expect(r.projectId).toBeDefined();
    expect(r.industry).toBe('cement');
    expect(r.complianceStatus).toMatch(/compliant|mostly-compliant|partially-compliant|non-compliant/);
    expect(r.regulationScores).toBeInstanceOf(Array);
    expect(r.gaps).toBeInstanceOf(Array);
    expect(r.deadlines).toBeInstanceOf(Array);
    expect(r.industryRiskFactor).toBe(0.95); // cement
    expect(r.thresholds).toBeDefined();
    expect(r.thresholds.cbamImportThreshold).toBe(150_000);
    expect(r.thresholds.etsEmissionsThreshold).toBe(25_000);
  });

  it('ETS cost estimate reflects high emissions', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['ets'],
      annualEmissions: 100_000,
    });

    const r = result.result as any;
    expect(r.costEstimates.ets.estimatedCost).toBeGreaterThan(0);
    expect(r.costEstimates.ets.surrenderObligation).toBe(100_000);
    expect(r.thresholds.etsApplies).toBe(true);
  });

  it('handles fit-for-55 and eu-ai-act (not in scoring engine)', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'manufacturing',
      regulations: ['fit-for-55', 'eu-ai-act', 'csrd'],
      currentMeasures: {
        carbonReporting: true,
        emissionsMonitoring: true,
        supplyChainDueDiligence: true,
        aiSystemLogging: true,
      },
    });

    const r = result.result as any;
    const regNames = r.regulationScores.map((rs: any) => rs.regulation);
    expect(regNames).toContain('fit-for-55');
    expect(regNames).toContain('eu-ai-act');
    expect(regNames).toContain('csrd');

    // fit-for-55 with all measures should score 100
    const ff55 = r.regulationScores.find((rs: any) => rs.regulation === 'fit-for-55');
    expect(ff55.score).toBe(100);

    // eu-ai-act with aiSystemLogging=true should score 100
    const euai = r.regulationScores.find((rs: any) => rs.regulation === 'eu-ai-act');
    expect(euai.score).toBe(100);
  });

  it('ESRS data points improve CSRD score', async () => {
    // Without data points
    const resultNoData = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['csrd'],
      currentMeasures: {
        carbonReporting: true,
        emissionsMonitoring: true,
        supplyChainDueDiligence: false,
        aiSystemLogging: false,
      },
    });

    // With some ESRS data points
    const resultWithData = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['csrd'],
      currentMeasures: {
        carbonReporting: true,
        emissionsMonitoring: true,
        supplyChainDueDiligence: false,
        aiSystemLogging: false,
      },
      dataPoints: [
        { disclosureId: 'E1-1', provided: true },
        { disclosureId: 'E1-4', provided: true },
        { disclosureId: 'E1-5', provided: true },
        { disclosureId: 'E1-6', provided: true },
        { disclosureId: 'S1-1', provided: true },
        { disclosureId: 'S1-6', provided: true },
        { disclosureId: 'G1-1', provided: true },
      ],
    });

    const scoreNoData = (resultNoData.result as any).overallScore;
    const scoreWithData = (resultWithData.result as any).overallScore;
    expect(scoreWithData).toBeGreaterThan(scoreNoData);
  });

  it('metadata includes scoringEngine v1.0', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['csrd'],
    });

    expect(result.metadata?.scoringEngine).toBe('v1.0');
  });

  it('identifies critical gaps for high-emission steel company', async () => {
    const result = await agent.execute(mockContext, {
      industry: 'steel',
      regulations: ['ets', 'cbam', 'csrd'],
      annualEmissions: 200_000,
      importValue: 500_000,
      currentMeasures: {
        carbonReporting: false,
        emissionsMonitoring: false,
        supplyChainDueDiligence: false,
        aiSystemLogging: false,
      },
    });

    const r = result.result as any;
    const criticalGaps = r.gaps.filter((g: any) => g.severity === 'critical');
    expect(criticalGaps.length).toBeGreaterThan(0);
    expect(r.overallScore).toBeLessThan(50);
    expect(r.complianceStatus).toBe('non-compliant');
  });
});
