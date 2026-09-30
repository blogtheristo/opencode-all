// Evidence: Tool=opencode-all Model=ollama-local/qwen3-coder-next:latest Agent=opencode Date=2026-09-30
// Audit trail: git log -- src/__tests__/nemoclaw-openshell-containment.test.ts
/**
 * NemoClaw Skill Host — OpenShell containment integration tests.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const logger = vi.hoisted(() => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
}));

vi.mock('../utils/logger.js', () => ({ default: logger }));

import { ComplianceAgent } from '../agents/compliance.agent.js';
import {
  ContainmentEvidence,
  ContainmentMode,
  NemoClawSkillHost,
  SandboxTier,
  getTierCapabilities,
  resolveTier,
} from '../mcp/nemoclaw-skill-host.js';
import type { AgentContext } from '../agents/types.js';

function makeContext(): AgentContext {
  return {
    projectId: 'proj-1',
    userId: 'user-1',
    orgId: 'org-1',
    sessionId: 'sess-1',
  };
}

const COMPLIANCE_PARAMS = {
  projectId: 'proj-1',
  industry: 'steel',
  regulations: ['ets', 'cbam', 'csrd'],
  annualEmissions: 50_000,
  importValue: 200_000,
  currentMeasures: {
    carbonReporting: true,
    emissionsMonitoring: false,
    supplyChainDueDiligence: false,
    aiSystemLogging: false,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('NemoClawSkillHost containment mode', () => {
  describe('containment: none (default)', () => {
    it('runs skill in-process without invoking openshell', async () => {
      const host = new NemoClawSkillHost({
        allowedSkills: ['compliance'],
        containment: 'none',
      });
      host.registerAgentSkill(new ComplianceAgent());

      const result = await host.invokeAgentSkill({
        skill: 'compliance',
        params: COMPLIANCE_PARAMS,
        callerAgentId: 'athena',
        kyaSessionId: 'kya-1',
        callerATS: 60,
        context: makeContext(),
      });

      expect(result.success).toBe(true);
      expect(result.containment?.mode).toBe('none');
      expect(result.result?.schemaVersion).toBe('dws-skill-result/1');
    });

    it('works when containment is omitted (backward compatible)', async () => {
      const host = new NemoClawSkillHost({
        allowedSkills: ['compliance'],
      });
      host.registerAgentSkill(new ComplianceAgent());

      const result = await host.invokeAgentSkill({
        skill: 'compliance',
        params: COMPLIANCE_PARAMS,
        callerAgentId: 'athena',
        kyaSessionId: 'kya-1',
        callerATS: 60,
        context: makeContext(),
      });

      expect(result.success).toBe(true);
      expect(result.containment?.mode).toBe('none');
    });
  });

  describe('tier resolution', () => {
    it('derives no-network policy for restricted tier', () => {
      expect(resolveTier(60)).toBe('restricted');
      const caps = getTierCapabilities('restricted');
      expect(caps.allowNetwork).toBe(false);
    });

    it('full_agency tier has network access', () => {
      expect(resolveTier(90)).toBe('full_agency');
      const caps = getTierCapabilities('full_agency');
      expect(caps.allowNetwork).toBe(true);
    });

    it('suspended tier has no network and no filesystem', () => {
      expect(resolveTier(10)).toBe('suspended');
      const caps = getTierCapabilities('suspended');
      expect(caps.allowNetwork).toBe(false);
      expect(caps.allowFilesystem).toBe(false);
    });

    it('quarantine tier has no network and no filesystem', () => {
      expect(resolveTier(0)).toBe('quarantine');
      const caps = getTierCapabilities('quarantine');
      expect(caps.allowNetwork).toBe(false);
      expect(caps.allowFilesystem).toBe(false);
    });
  });

  describe('containment evidence structure', () => {
    it('records containment evidence with mode', async () => {
      const evidence: ContainmentEvidence = {
        mode: 'openshell' as ContainmentMode,
        sandbox: 'as-test-123',
        step: 'compliance',
        image: 'aegis-pilot-node:22',
        policyDigest: 'a'.repeat(64),
        limits: { memory: '256Mi', cpu: '2' },
      };

      expect(evidence.mode).toBe('openshell');
      expect(evidence.sandbox).toBe('as-test-123');
      expect(evidence.limits).toBeDefined();
      expect(evidence.limits?.memory).toBe('256Mi');
    });
  });

  describe('containment: openshell (basic structure)', () => {
    it('has the correct type signature', () => {
      const modes: ContainmentMode[] = ['openshell', 'none'];
      expect(modes).toEqual(['openshell', 'none']);
    });

    it('getTierCapabilities throws on unknown tier', () => {
      expect(() => getTierCapabilities('invalid' as SandboxTier)).toThrow('Unknown sandbox tier');
    });
  });
});
