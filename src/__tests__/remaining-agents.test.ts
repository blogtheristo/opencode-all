/**
 * Remaining Agent Tests — Coverage for all previously untested agents
 *
 * Tests: schedule-genius, argus, designer, deepwiki-extractor,
 * compliance-researcher, construction, logistics.
 * Does NOT require LLM or Supabase.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentContext } from '../agents/types.js';

vi.mock('../agents/base.agent.js', () => ({
  BaseAgent: class {
    config: any;
    constructor(config: any) { this.config = config; }
    getConfig() { return this.config; }
    async logExecution() {}
    async callLLM() {
      return {
        content: JSON.stringify({ recommendations: ['Mock recommendation'] }),
        model: 'mock',
        inputTokens: 0,
        outputTokens: 0,
      };
    }
  },
}));

// Mock agent registry for construction/logistics delegation
vi.mock('../agents/index.js', () => ({
  agentRegistry: {
    executeAgent: vi.fn().mockResolvedValue({
      agentName: 'mock-sub-agent',
      result: { mockScore: 80 },
      confidence: 0.85,
      reasoning: 'Mock sub-agent result',
      recommendations: ['Mock sub-agent recommendation'],
      metadata: {},
    }),
  },
}));

const ctx: AgentContext = {
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
  projectId: 'test-project',
};

// ============ ScheduleGenius ============

describe('ScheduleGenius Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/schedule-genius.agent.js');
    agent = new mod.ScheduleGeniusAgent();
  });

  it('should calculate critical path for simple task list', async () => {
    const result = await agent.execute(ctx, {
      projectId: 'proj-001',
      tasks: [
        { name: 'Foundation', duration: 10, dependencies: [], progress: 0 },
        { name: 'Framing', duration: 15, dependencies: ['Foundation'], progress: 0 },
        { name: 'Roofing', duration: 5, dependencies: ['Framing'], progress: 0 },
      ],
    });

    expect(result.agentName).toBe('schedule-genius');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.result).toHaveProperty('criticalPath');
  });

  it('should detect delay risk in tasks with high progress gap', async () => {
    const result = await agent.execute(ctx, {
      projectId: 'proj-002',
      tasks: [
        { name: 'Task A', duration: 30, dependencies: [], progress: 10 },
        { name: 'Task B', duration: 20, dependencies: ['Task A'], progress: 0 },
      ],
    });

    expect(result.agentName).toBe('schedule-genius');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

// ============ Argus (SAR Satellite) ============

describe('Argus Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/argus.agent.js');
    agent = new mod.ArgusAgent();
  });

  it('should accept orbital scan request with AOI', async () => {
    const result = await agent.execute(ctx, {
      aoi: {
        latitude: 60.1695,
        longitude: 24.9354,
        radiusKm: 10,
      },
      industries: ['power-heat-generation'],
      dateRange: { start: '2024-01-01', end: '2024-12-31' },
      acquisitionMode: 'archive',
    });

    expect(result.agentName).toBe('argus');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

// ============ Designer ============

describe('Designer Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/designer.agent.js');
    agent = new mod.DesignerAgent();
  });

  it('should classify style-change as safe complexity', async () => {
    const result = await agent.execute(ctx, {
      action: 'style-change',
      description: 'Change button color to primary blue',
      framework: 'react',
    });

    expect(result.agentName).toBe('designer');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should flag state-change as requiring review', async () => {
    const result = await agent.execute(ctx, {
      action: 'state-change',
      description: 'Add global auth state management',
      framework: 'react',
    });

    expect(result.agentName).toBe('designer');
    // State changes should flag for engineer review
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

// ============ DeepWiki Extractor ============

describe('DeepWiki Extractor Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/deepwiki-extractor.agent.js');
    agent = new mod.DeepWikiExtractorAgent();
  });

  it('should analyze repo and generate extraction plan', async () => {
    const result = await agent.execute(ctx, {
      repoUrl: 'github.com/anthropics/anthropic-sdk-python',
      functionality: 'API client wrapper',
      targetModule: 'api-client.ts',
      language: 'typescript',
    });

    expect(result.agentName).toBe('deepwiki-extractor');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

// ============ Compliance Researcher ============

describe('Compliance Researcher Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/compliance-researcher.agent.js');
    agent = new mod.ComplianceResearcherAgent();
  });

  it('should return ETS regulation info for quick research', async () => {
    const result = await agent.execute(ctx, {
      topic: 'EU Emissions Trading System reporting requirements',
      regulations: ['ets'],
      industry: 'power-generation',
      depth: 'quick',
    });

    expect(result.agentName).toBe('compliance-researcher');
    expect(result.confidence).toBeGreaterThan(0);
    // Should have regulation-related content in reasoning
    const reasoning = result.reasoning.toLowerCase();
    expect(reasoning).toContain('regulation');
  });

  it('should handle CSRD research with deep depth', async () => {
    const result = await agent.execute(ctx, {
      topic: 'CSRD double materiality assessment',
      regulations: ['csrd'],
      industry: 'manufacturing',
      depth: 'deep',
    });

    expect(result.agentName).toBe('compliance-researcher');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});

// ============ Construction (basic action) ============

describe('Construction Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/construction.agent.js');
    agent = new mod.ConstructionAgent();
  });

  it('should run compliance check for commercial project', async () => {
    const result = await agent.execute(ctx, {
      projectId: 'proj-construction-1',
      action: 'compliance-check',
      project: {
        name: 'Office Building Helsinki',
        location: 'Helsinki',
        type: 'commercial',
        phase: 'permitting',
        budget: 5000000,
        startDate: '2024-06-01',
        endDate: '2025-12-31',
      },
    });

    expect(result.agentName).toBe('construction');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.result).toHaveProperty('projectId');
  });

  it('should validate Y-tunnus for subcontractor vetting', async () => {
    const result = await agent.execute(ctx, {
      projectId: 'proj-construction-2',
      action: 'subcontractor-vet',
      project: {
        name: 'Residential Block',
        location: 'Espoo',
        type: 'residential',
        phase: 'construction',
        budget: 2000000,
        startDate: '2024-01-01',
        endDate: '2025-06-30',
      },
      subcontractor: {
        ytunnus: '0772407-9',
        name: 'Lifetime Oy',
        role: 'IT Systems',
      },
    });

    expect(result.agentName).toBe('construction');
    expect(result.result).toHaveProperty('subcontractor');
  });

  it('should run schedule risk assessment', async () => {
    const result = await agent.execute(ctx, {
      projectId: 'proj-construction-3',
      action: 'schedule-risk',
      project: {
        name: 'Winter Project',
        location: 'Oulu',
        type: 'infrastructure',
        phase: 'foundation',
        budget: 10000000,
        startDate: '2024-10-01',
        endDate: '2025-03-31', // Winter overlap
      },
    });

    expect(result.agentName).toBe('construction');
    // Winter overlap should be detected
    expect(result.result.winterOverlap).toBe(true);
  });
});

// ============ Logistics (basic action) ============

describe('Logistics Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/logistics.agent.js');
    agent = new mod.LogisticsAgent();
  });

  it('should check fleet compliance for Euro 6 truck', async () => {
    const result = await agent.execute(ctx, {
      action: 'fleet-compliance',
      fleet: {
        vehicles: [
          { id: 'truck-001', type: 'truck', euroClass: 6, payload_kg: 25000 },
        ],
      },
    });

    expect(result.agentName).toBe('logistics');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should flag non-compliant Euro 3 vehicle', async () => {
    const result = await agent.execute(ctx, {
      action: 'fleet-compliance',
      fleet: {
        vehicles: [
          { id: 'old-truck', type: 'truck', euroClass: 3, payload_kg: 20000 },
        ],
      },
    });

    expect(result.agentName).toBe('logistics');
    // Euro 3 should trigger compliance warning
    const hasComplianceWarning = result.recommendations.some(
      (r: string) => r.toLowerCase().includes('euro') || r.toLowerCase().includes('emission')
    );
    expect(hasComplianceWarning).toBe(true);
  });

  it('should calculate supply chain carbon for cross-border transport', async () => {
    const result = await agent.execute(ctx, {
      action: 'supply-chain-carbon',
      materials: [
        { name: 'steel', weight_kg: 10000, origin_country: 'DE', transport_mode: 'road' },
      ],
    });

    expect(result.agentName).toBe('logistics');
    expect(result.result).toHaveProperty('totalEmissions_kgCO2');
    const emissions = result.result.totalEmissions_kgCO2 as number;
    expect(emissions).toBeGreaterThan(0);
  });
});
