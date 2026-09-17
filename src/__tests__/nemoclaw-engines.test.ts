import { beforeEach, describe, expect, it, vi } from 'vitest';

const logger = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
}));

vi.mock('../utils/logger.js', () => ({ default: logger }));

import { ComplianceAgent } from '../agents/compliance.agent.js';
import { type AgentLookup, buildEngineHost, NEMOCLAW_ENGINES } from '../mcp/nemoclaw-engines.js';
import type { BaseAgent } from '../agents/base.agent.js';
import type { AgentContext, AgentResponse } from '../agents/types.js';

/** Minimal stand-in agent for registration-only assertions. */
function fakeAgent(name: string): BaseAgent {
  return {
    getConfig: () => ({
      name,
      description: `fake ${name}`,
      capabilities: [],
      model: 'placeholder',
      autonomyPhase: 'advisor',
    }),
    execute: async (): Promise<AgentResponse> => ({
      agentName: name,
      result: { ok: true },
      confidence: 1,
      reasoning: 'fake',
      recommendations: [],
      metadata: {},
    }),
  } as unknown as BaseAgent;
}

/** Lookup backed by a fixed map of agents. */
function lookupFrom(agents: Record<string, BaseAgent>): AgentLookup {
  return { getAgent: (n: string) => agents[n] };
}

function makeContext(): AgentContext {
  return { projectId: 'p', userId: 'u', orgId: 'o', sessionId: 's' };
}

beforeEach(() => {
  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
  logger.debug.mockReset();
});

describe('NEMOCLAW_ENGINES roster', () => {
  it('defines the documented leaf engineers, each with non-empty skills', () => {
    for (const key of ['athena', 'hephaestus', 'mercury', 'iris', 'apollo']) {
      expect(NEMOCLAW_ENGINES[key]).toBeDefined();
      expect(NEMOCLAW_ENGINES[key].skills.length).toBeGreaterThan(0);
      expect(NEMOCLAW_ENGINES[key].orchestrator).toBe(key);
    }
  });
});

describe('buildEngineHost', () => {
  it('throws on an unknown engine', () => {
    expect(() => buildEngineHost('nope', lookupFrom({}))).toThrow(/Unknown NemoClaw engine/i);
  });

  it('wires all declared agents and whitelists only the engine skills', () => {
    const lookup = lookupFrom({
      compliance: new ComplianceAgent(),
      'compliance-researcher': fakeAgent('compliance-researcher'),
    });

    const { host, registered, missing } = buildEngineHost('athena', lookup);

    expect(registered.sort()).toEqual(['compliance', 'compliance-researcher']);
    expect(missing).toEqual([]);
    expect(
      host
        .listSkills()
        .map((s) => s.name)
        .sort(),
    ).toEqual(['compliance', 'compliance-researcher']);
  });

  it('surfaces missing agents instead of dropping them silently (fail loud)', () => {
    const lookup = lookupFrom({ sitesense: fakeAgent('sitesense') });

    const { registered, missing } = buildEngineHost('hephaestus', lookup);

    expect(registered).toEqual(['sitesense']);
    expect(missing.sort()).toEqual(['material-oracle', 'schedule-genius']);
    expect(logger.warn).toHaveBeenCalled();
  });

  it('runs a composed compliance skill end-to-end through the engine host', async () => {
    const lookup = lookupFrom({
      compliance: new ComplianceAgent(),
      'compliance-researcher': fakeAgent('compliance-researcher'),
    });
    const { host } = buildEngineHost('athena', lookup);

    const result = await host.invokeAgentSkill({
      skill: 'compliance',
      params: {
        projectId: 'p',
        industry: 'cement',
        regulations: ['ets', 'cbam'],
        annualEmissions: 40_000,
        importValue: 0,
        currentMeasures: {
          carbonReporting: true,
          emissionsMonitoring: true,
          supplyChainDueDiligence: false,
          aiSystemLogging: false,
        },
      },
      callerAgentId: 'athena',
      kyaSessionId: 'kya-eng-1',
      callerATS: 85,
      context: makeContext(),
    });

    expect(result.success).toBe(true);
    expect(result.result?.agent).toBe('compliance');
    expect(host.getStepLog()).toHaveLength(1);
    expect(host.getStepLog()[0].status).toBe('ok');
  });
});
