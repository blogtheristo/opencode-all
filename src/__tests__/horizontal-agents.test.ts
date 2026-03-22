/**
 * Horizontal Agent Deterministic Logic Tests
 *
 * Tests customer-sat, sitesense, material-oracle, viability, schedule-genius,
 * quality-gate, and sovereignty-monitor agents for correct deterministic scoring.
 * Does NOT require LLM or Supabase — mocks BaseAgent infrastructure.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AgentContext } from '../agents/types.js';

// Mock the BaseAgent's logExecution and callLLM
vi.mock('../agents/base.agent.js', () => {
  return {
    BaseAgent: class MockBaseAgent {
      config: any;
      constructor(config: any) {
        this.config = config;
      }
      getConfig() { return this.config; }
      async logExecution() { /* no-op */ }
      async callLLM() {
        return {
          content: JSON.stringify({ recommendations: ['Mock LLM recommendation'] }),
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

// ============ CustomerSat Agent ============

describe('CustomerSat Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/customer-sat.agent.js');
    agent = new mod.CustomerSatAgent();
  });

  it('should score customer with high NPS as low churn risk', async () => {
    const result = await agent.execute(mockContext, {
      customerId: 'cust-001',
      nps: 9,
      ticketCount: 1,
      interactionFrequency: 'weekly',
      contractValue: 50000,
      tenure: 24,
    });

    expect(result.agentName).toBe('customer-sat');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.result).toHaveProperty('satisfaction');
  });

  it('should score customer with low NPS as high churn risk', async () => {
    const result = await agent.execute(mockContext, {
      customerId: 'cust-002',
      nps: 2,
      ticketCount: 15,
      interactionFrequency: 'monthly',
      contractValue: 10000,
      tenure: 3,
    });

    expect(result.agentName).toBe('customer-sat');
    expect(result.result).toHaveProperty('satisfaction');
    // Low NPS + high tickets = lower satisfaction
    const sat = result.result.satisfaction as number;
    expect(sat).toBeLessThan(70);
  });
});

// ============ SiteSense Agent ============

describe('SiteSense Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/sitesense.agent.js');
    agent = new mod.SiteSenseAgent();
  });

  it('should score safe site conditions highly', async () => {
    const result = await agent.execute(mockContext, {
      siteId: 'site-001',
      siteName: 'Helsinki HQ',
      temperature: 20,
      windSpeed: 5,
      humidity: 50,
      workerCount: 10,
      maxWorkerCapacity: 50,
      recentIncidents: 0,
    });

    expect(result.agentName).toBe('sitesense');
    expect(result.confidence).toBeGreaterThan(0.5);
    const score = result.result.safetyScore as number;
    expect(score).toBeGreaterThan(70);
  });

  it('should flag high wind as unsafe (EN 13001 crane threshold)', async () => {
    const result = await agent.execute(mockContext, {
      siteId: 'site-002',
      siteName: 'Windy Port',
      temperature: 15,
      windSpeed: 25, // Above EN 13001 crane limit (~20 m/s)
      humidity: 60,
      workerCount: 20,
      maxWorkerCapacity: 50,
      recentIncidents: 0,
    });

    expect(result.agentName).toBe('sitesense');
    const score = result.result.safetyScore as number;
    expect(score).toBeLessThan(70);
    // Should have wind-related recommendation
    const hasWindWarning = result.recommendations.some(
      (r: string) => r.toLowerCase().includes('wind') || r.toLowerCase().includes('crane')
    );
    expect(hasWindWarning).toBe(true);
  });

  it('should penalize extreme cold (Finnish winter)', async () => {
    const result = await agent.execute(mockContext, {
      siteId: 'site-003',
      siteName: 'Oulu Winter Site',
      temperature: -25,
      windSpeed: 8,
      humidity: 80,
      workerCount: 5,
      maxWorkerCapacity: 30,
      recentIncidents: 1,
    });

    const score = result.result.safetyScore as number;
    expect(score).toBeLessThan(80); // Cold + incident = lower score
  });
});

// ============ MaterialOracle Agent ============

describe('MaterialOracle Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/material-oracle.agent.js');
    agent = new mod.MaterialOracleAgent();
  });

  it('should calculate EN 15978 lifecycle carbon for concrete', async () => {
    const result = await agent.execute(mockContext, {
      projectId: 'proj-001',
      materials: [
        { name: 'concrete', quantity: 100, unit: 'tonnes' },
      ],
    });

    expect(result.agentName).toBe('material-oracle');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.result).toHaveProperty('totalCarbonKg');
    // Concrete has known emission factor ~0.13-0.16 kgCO2e/kg
    const totalCarbon = result.result.totalCarbonKg as number;
    expect(totalCarbon).toBeGreaterThan(0);
  });

  it('should suggest low-carbon alternatives', async () => {
    const result = await agent.execute(mockContext, {
      projectId: 'proj-002',
      materials: [
        { name: 'steel', quantity: 50, unit: 'tonnes' },
      ],
    });

    // Should have alternative material recommendations
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should handle unknown materials with conservative estimate', async () => {
    const result = await agent.execute(mockContext, {
      projectId: 'proj-003',
      materials: [
        { name: 'exotic_composite_xyz', quantity: 10, unit: 'tonnes' },
      ],
    });

    // Should still return a result (conservative default factor)
    expect(result.result).toHaveProperty('totalCarbonKg');
    expect(result.confidence).toBeLessThan(0.9); // Lower confidence for unknown materials
  });
});

// ============ Viability Agent ============

describe('Viability Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/viability.agent.js');
    agent = new mod.ViabilityAgent();
  });

  it('should calculate ROI and payback period', async () => {
    const result = await agent.execute(mockContext, {
      projectId: 'proj-001',
      investmentEur: 100000,
      annualRevenueEur: 50000,
      annualCostsEur: 20000,
      timelineMonths: 24,
      carbonReductionTonnes: 500,
    });

    expect(result.agentName).toBe('viability');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.result).toHaveProperty('roi');
    expect(result.result).toHaveProperty('paybackMonths');
    // With 30k net annual revenue on 100k investment, payback ~40 months
    const payback = result.result.paybackMonths as number;
    expect(payback).toBeGreaterThan(0);
    expect(payback).toBeLessThan(120); // Should be reasonable
  });

  it('should include carbon credit valuation', async () => {
    const result = await agent.execute(mockContext, {
      projectId: 'proj-002',
      investmentEur: 200000,
      annualRevenueEur: 80000,
      annualCostsEur: 30000,
      timelineMonths: 36,
      carbonReductionTonnes: 1000,
    });

    // Should have carbon credit related data
    expect(result.result).toHaveProperty('carbonCredits');
  });
});

// ============ QualityGate Agent ============

describe('QualityGate Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/quality-gate.agent.js');
    agent = new mod.QualityGateAgent();
  });

  it('should score deployment readiness', async () => {
    const result = await agent.execute(mockContext, {
      deploymentTarget: 'gcp',
      testCoverage: 85,
      securityScanPassed: true,
      buildStatus: 'success',
      lintPassed: true,
    });

    expect(result.agentName).toBe('quality-gate');
    expect(result.result).toHaveProperty('qualityScore');
    const score = result.result.qualityScore as number;
    expect(score).toBeGreaterThan(60); // Good metrics = good score
  });

  it('should fail gate when security scan fails', async () => {
    const result = await agent.execute(mockContext, {
      deploymentTarget: 'gcp',
      testCoverage: 90,
      securityScanPassed: false,
      buildStatus: 'success',
      lintPassed: true,
    });

    // Security failure should lower the score significantly
    const score = result.result.qualityScore as number;
    expect(score).toBeLessThan(80);
    const hasSecurityWarning = result.recommendations.some(
      (r: string) => r.toLowerCase().includes('security')
    );
    expect(hasSecurityWarning).toBe(true);
  });
});

// ============ SovereigntyMonitor Agent ============

describe('SovereigntyMonitor Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/sovereignty-monitor.agent.js');
    agent = new mod.SovereigntyMonitorAgent();
  });

  it('should flag US-based providers as CLOUD Act exposed', async () => {
    const result = await agent.execute(mockContext, {
      providers: ['AWS', 'Google Cloud'],
      dataRegion: 'us-east-1',
      encryptionAtRest: true,
      encryptionInTransit: true,
      rlsEnabled: false,
    });

    expect(result.agentName).toBe('sovereignty-monitor');
    // US providers should trigger CLOUD Act exposure
    const hasCloudActWarning = result.recommendations.some(
      (r: string) => r.toLowerCase().includes('cloud act') || r.toLowerCase().includes('sovereignty')
    );
    expect(hasCloudActWarning).toBe(true);
  });

  it('should score EU-sovereign setup highly', async () => {
    const result = await agent.execute(mockContext, {
      providers: ['Hetzner', 'Supabase EU'],
      dataRegion: 'europe-north1',
      encryptionAtRest: true,
      encryptionInTransit: true,
      rlsEnabled: true,
    });

    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
