/**
 * Aegis + Vesta Agent Tests
 *
 * Both agents are fully deterministic (no LLM call in execute()), so no
 * mocking of the LLM client is required. Supabase logging is not exercised
 * here — these tests call execute() directly, not through logExecution().
 */

import { describe, expect, it } from 'vitest';
import { AegisAgent } from '../../agents/aegis.agent.js';
import { VestaAgent } from '../../agents/vesta.agent.js';
import type { AgentContext } from '../../agents/types.js';

const testContext: AgentContext = {
  projectId: 'test-project',
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
};

describe('AegisAgent', () => {
  it('has valid config', () => {
    const agent = new AegisAgent();
    const config = agent.getConfig();
    expect(config.name).toBe('aegis');
    expect(config.capabilities.length).toBeGreaterThan(0);
  });

  it('flags a critical finding older than its SLA as breach', async () => {
    const agent = new AegisAgent();
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 5); // 5 days old, critical SLA is 2 days

    const response = await agent.execute(testContext, {
      action: 'triage',
      findings: [
        {
          id: 'CVE-TEST-1',
          severity: 'critical',
          package: 'example-pkg',
          discoveredAt: oldDate.toISOString().split('T')[0],
        },
      ],
    });

    const result = response.result as { breachCount: number };
    expect(result.breachCount).toBe(1);
    expect(response.recommendations.length).toBeGreaterThan(0);
  });

  it('does not flag a fresh low-severity finding as breach', async () => {
    const agent = new AegisAgent();
    const today = new Date().toISOString().split('T')[0];

    const response = await agent.execute(testContext, {
      action: 'triage',
      findings: [{ severity: 'low', package: 'fresh-pkg', discoveredAt: today }],
    });

    const result = response.result as { breachCount: number; onTrackCount: number };
    expect(result.breachCount).toBe(0);
    expect(result.onTrackCount).toBe(1);
  });

  it('handles empty findings gracefully', async () => {
    const agent = new AegisAgent();
    const response = await agent.execute(testContext, { action: 'triage', findings: [] });
    const result = response.result as { totalFindings: number };
    expect(result.totalFindings).toBe(0);
    expect(response.confidence).toBeLessThan(1);
  });
});

describe('VestaAgent', () => {
  it('has valid config', () => {
    const agent = new VestaAgent();
    const config = agent.getConfig();
    expect(config.name).toBe('vesta');
    expect(config.capabilities.length).toBeGreaterThan(0);
  });

  it('lists the full registry by default', async () => {
    const agent = new VestaAgent();
    const response = await agent.execute(testContext, { action: 'list' });
    const result = response.result as { systems: unknown[] };
    expect(result.systems.length).toBeGreaterThan(0);
  });

  it('looks up a known system by partial name', async () => {
    const agent = new VestaAgent();
    const response = await agent.execute(testContext, { action: 'lookup', system: 'Supabase' });
    const result = response.result as { match: { criticality: string } | null };
    expect(result.match).not.toBeNull();
    expect(result.match?.criticality).toBe('critical');
  });

  it('returns no match for an undocumented system', async () => {
    const agent = new VestaAgent();
    const response = await agent.execute(testContext, {
      action: 'lookup',
      system: 'totally-made-up-system-xyz',
    });
    const result = response.result as { match: unknown };
    expect(result.match).toBeNull();
    expect(response.recommendations.length).toBeGreaterThan(0);
  });

  it('stale-check reports zero overdue entries for a freshly-created registry', async () => {
    const agent = new VestaAgent();
    const response = await agent.execute(testContext, { action: 'stale-check' });
    const result = response.result as { staleCount: number };
    expect(result.staleCount).toBe(0);
  });
});
