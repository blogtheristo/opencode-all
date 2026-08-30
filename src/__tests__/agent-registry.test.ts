/**
 * Agent Registry Tests
 *
 * Tests for agent discovery, execution error handling, and delegation depth limits.
 * These are deterministic tests that don't require LLM API keys.
 */

import { describe, expect, it } from 'vitest';
import { AgentRegistry } from '../agents/index.js';
import { BaseAgent } from '../agents/base.agent.js';
import type { AgentContext, AgentResponse } from '../agents/types.js';

// ============ TEST FIXTURES ============

const testContext: AgentContext = {
  projectId: 'test-project',
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
};

/** Minimal agent for testing */
class StubAgent extends BaseAgent {
  constructor(name: string, capabilities: string[] = ['test']) {
    super({
      name,
      description: `Test agent: ${name}`,
      capabilities,
      model: 'placeholder',
    });
  }

  async execute(
    _context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    return {
      agentName: this.config.name,
      result: { echo: input },
      confidence: 0.95,
      reasoning: 'Stub agent echoed input',
      recommendations: [],
      metadata: {},
    };
  }
}

// ============ TESTS ============

describe('AgentRegistry', () => {
  it('registers and retrieves an agent', () => {
    const registry = new AgentRegistry();
    const stub = new StubAgent('test-stub');
    registry.register(stub);

    const found = registry.getAgent('test-stub');
    expect(found).toBeDefined();
    expect(found!.getConfig().name).toBe('test-stub');
  });

  it('returns undefined for unknown agent', () => {
    const registry = new AgentRegistry();
    expect(registry.getAgent('nonexistent-agent')).toBeUndefined();
  });

  it('lists all registered agents', () => {
    const registry = new AgentRegistry();
    const agents = registry.listAgents();

    // Should include the default agents registered in constructor
    expect(agents.length).toBeGreaterThan(10);
    const names = agents.map((a) => a.name);
    expect(names).toContain('sitesense');
    expect(names).toContain('schedule-genius');
    expect(names).toContain('material-oracle');
  });

  it('discovers agents by capability', () => {
    const registry = new AgentRegistry();
    registry.register(new StubAgent('cap-test-1', ['carbon', 'emissions']));
    registry.register(new StubAgent('cap-test-2', ['safety', 'site']));

    const carbonAgents = registry.discoverAgents('carbon');
    expect(carbonAgents.some((a) => a.name === 'cap-test-1')).toBe(true);
    expect(carbonAgents.some((a) => a.name === 'cap-test-2')).toBe(false);
  });

  it('throws on executing a non-existent agent', async () => {
    const registry = new AgentRegistry();
    await expect(
      registry.executeAgent('does-not-exist', testContext, {}),
    ).rejects.toThrow('Agent "does-not-exist" not found');
  });

  it('executes a registered agent successfully', async () => {
    const registry = new AgentRegistry();
    registry.register(new StubAgent('exec-test'));

    const result = await registry.executeAgent('exec-test', testContext, {
      foo: 'bar',
    });

    expect(result.agentName).toBe('exec-test');
    expect(result.confidence).toBe(0.95);
    expect((result.result as { echo: Record<string, unknown> }).echo).toEqual({ foo: 'bar' });
  });

  it('overrides agent on re-registration', () => {
    const registry = new AgentRegistry();
    registry.register(new StubAgent('dup', ['v1']));
    registry.register(new StubAgent('dup', ['v2']));

    const agent = registry.getAgent('dup');
    expect(agent!.getConfig().capabilities).toEqual(['v2']);
  });
});

describe('Agent delegation depth limit', () => {
  it('blocks execution when delegation depth is exceeded', async () => {
    const registry = new AgentRegistry();

    // Create an agent that delegates to itself
    class RecursiveAgent extends BaseAgent {
      private callCount = 0;

      constructor() {
        super({
          name: 'recursive',
          description: 'Agent that calls itself',
          capabilities: ['test'],
          model: 'placeholder',
        });
      }

      async execute(
        context: AgentContext,
        _input: Record<string, unknown>,
      ): Promise<AgentResponse> {
        this.callCount++;
        // Attempt to re-execute self via registry
        return registry.executeAgent('recursive', context, {
          depth: this.callCount,
        });
      }
    }

    registry.register(new RecursiveAgent());

    // Should hit depth limit and return graceful error, not infinite loop
    const result = await registry.executeAgent('recursive', testContext, {});
    expect(result.confidence).toBe(0);
    expect((result.result as { error: string }).error).toBe(
      'Delegation depth limit reached',
    );
  });
});

describe('Default agent configs', () => {
  it('all default agents have required config fields', () => {
    const registry = new AgentRegistry();
    const agents = registry.listAgents();

    for (const agent of agents) {
      expect(agent.name).toBeTruthy();
      expect(agent.description).toBeTruthy();
      expect(Array.isArray(agent.capabilities)).toBe(true);
      expect(agent.model).toBeTruthy();
    }
  });

  it('all agent names are kebab-case', () => {
    const registry = new AgentRegistry();
    const agents = registry.listAgents();

    for (const agent of agents) {
      expect(agent.name).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('only compliance, customer-sat, and sitesense are above silent_pilot', () => {
    const registry = new AgentRegistry();
    const agents = registry.listAgents();
    
    const allowedAboveSilentPilot = ['compliance', 'customer-sat', 'sitesense'];
    
    for (const agent of agents) {
      const phase = (agent as any).autonomyPhase || 'silent_pilot';
      if (phase !== 'silent_pilot') {
        expect(allowedAboveSilentPilot).toContain(agent.name);
      }
    }
  });
});
