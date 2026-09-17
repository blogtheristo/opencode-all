/**
 * Agent System Tests
 *
 * Coverage:
 * - Agent registry (registration, discovery, execution)
 * - SiteSense agent (deterministic safety scoring)
 * - Agent response contract validation
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock external dependencies before imports
vi.mock('../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ error: null })),
    })),
  })),
}));

// Set test environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_KEY = 'test-key';

import { AgentRegistry } from '../agents/index.js';
import type { AgentContext } from '../agents/types.js';

// ============ TEST CONTEXT ============

const testContext: AgentContext = {
  projectId: 'test-project-001',
  userId: 'test-user-001',
  orgId: 'test-org-001',
  sessionId: 'test-session-001',
};

// ============ AGENT REGISTRY TESTS ============

describe('AgentRegistry', () => {
  let registry: AgentRegistry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('should register default agents on construction', () => {
    const agents = registry.listAgents();
    expect(agents.length).toBeGreaterThanOrEqual(5);
  });

  it('should list all registered agent configs', () => {
    const agents = registry.listAgents();
    const names = agents.map((a) => a.name);

    expect(names).toContain('sitesense');
    expect(names).toContain('schedule-genius');
    expect(names).toContain('material-oracle');
    expect(names).toContain('customer-sat');
    expect(names).toContain('viability');
  });

  it('should retrieve agent by name', () => {
    const agent = registry.getAgent('sitesense');
    expect(agent).toBeDefined();
    expect(agent!.getConfig().name).toBe('sitesense');
  });

  it('should return undefined for unknown agent', () => {
    const agent = registry.getAgent('nonexistent-agent');
    expect(agent).toBeUndefined();
  });

  it('should throw when executing unknown agent', async () => {
    await expect(
      registry.executeAgent('nonexistent', testContext, {}),
    ).rejects.toThrow('Agent "nonexistent" not found');
  });

  it('should have unique agent names', () => {
    const agents = registry.listAgents();
    const names = agents.map((a) => a.name);
    const uniqueNames = [...new Set(names)];
    expect(names.length).toBe(uniqueNames.length);
  });

  it('should have valid config for all agents', () => {
    const agents = registry.listAgents();

    for (const agent of agents) {
      expect(agent.name).toBeTruthy();
      expect(agent.name.length).toBeGreaterThan(0);
      expect(agent.description).toBeTruthy();
      expect(agent.description.length).toBeGreaterThan(10);
      expect(agent.capabilities).toBeInstanceOf(Array);
      expect(agent.capabilities.length).toBeGreaterThan(0);
      expect(agent.model).toBeTruthy();
    }
  });
});

// ============ SITESENSE AGENT TESTS ============

describe('SiteSense Agent - Deterministic Safety Scoring', () => {
  let registry: AgentRegistry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('should compute high safety score for optimal conditions', async () => {
    const result = await registry.executeAgent('sitesense', testContext, {
      siteId: 'test-site-001',
      metrics: {
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
        workers: 10,
        incidents: 0,
      },
    });

    expect(result.agentName).toBe('sitesense');
    expect(result.confidence).toBeGreaterThan(0.5);
    expect((result.result as any).safetyScore).toBeGreaterThanOrEqual(90);
    expect((result.result as any).weatherRisk.level).toBe('low');
  });

  it('should compute low safety score for extreme conditions', async () => {
    const result = await registry.executeAgent('sitesense', testContext, {
      siteId: 'test-site-002',
      metrics: {
        temperature: -20,
        humidity: 95,
        windSpeed: 30,
        workers: 50,
        incidents: 5,
      },
    });

    expect((result.result as any).safetyScore).toBeLessThan(50);
    expect((result.result as any).weatherRisk.level).toBe('critical');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should provide recommendations for hazardous wind', async () => {
    const result = await registry.executeAgent('sitesense', testContext, {
      siteId: 'test-site-003',
      metrics: {
        temperature: 20,
        humidity: 50,
        windSpeed: 18,
        workers: 10,
        incidents: 0,
      },
    });

    const hasWindRec = result.recommendations.some(
      (r) => r.toLowerCase().includes('crane') || r.toLowerCase().includes('wind'),
    );
    expect(hasWindRec).toBe(true);
  });

  it('should include metadata with timing', async () => {
    const result = await registry.executeAgent('sitesense', testContext, {
      siteId: 'test-site-004',
      metrics: {
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
        workers: 10,
        incidents: 0,
      },
    });

    expect(result.metadata).toBeDefined();
    expect(result.metadata.durationMs).toBeGreaterThanOrEqual(0);
  });
});

// ============ AGENT RESPONSE CONTRACT TESTS ============

describe('Agent Response Contract', () => {
  let registry: AgentRegistry;

  beforeEach(() => {
    registry = new AgentRegistry();
  });

  it('all agents should return valid AgentResponse shape', async () => {
    // Test with sitesense as representative
    const result = await registry.executeAgent('sitesense', testContext, {
      siteId: 'contract-test',
      metrics: {
        temperature: 20,
        humidity: 50,
        windSpeed: 5,
        workers: 10,
        incidents: 0,
      },
    });

    // Verify AgentResponse interface
    expect(typeof result.agentName).toBe('string');
    expect(typeof result.result).toBe('object');
    expect(typeof result.confidence).toBe('number');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(typeof result.reasoning).toBe('string');
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(typeof result.metadata).toBe('object');
  });
});
