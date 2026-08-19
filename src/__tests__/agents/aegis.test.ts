/**
 * Aegis Agent Tests
 *
 * Covers the deterministic parts of execute(): action routing, replay
 * protection, and the tamper-evident audit chain. Sub-agent LLM calls
 * (Argus / SovereigntyMonitor / ComplianceAgent) fall back to the
 * deterministic "LLM unavailable" placeholder path in BaseAgent.callLLM()
 * when no provider API key is configured (the case in this test
 * environment), so no LLM mocking is required — this matches the pattern
 * in vuln-patch-sla-triage-vesta.test.ts.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AegisAgent } from '../../agents/aegis.agent.js';
import type { AgentContext } from '../../agents/types.js';

const testContext: AgentContext = {
  projectId: 'test-project',
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session-aegis',
};

describe('AegisAgent', () => {
  beforeEach(() => {
    AegisAgent._resetForTests();
  });

  it('has valid config', () => {
    const agent = new AegisAgent();
    const config = agent.getConfig();
    expect(config.name).toBe('aegis');
    expect(config.capabilities.length).toBeGreaterThan(0);
  });

  it('defaults to assess when action is missing or unknown', async () => {
    const agent = new AegisAgent();
    const response = await agent.execute(testContext, {});
    const result = response.result as { action: string; components: Record<string, unknown> };
    expect(result.action).toBe('assess');
    expect(Object.keys(result.components)).toEqual(
      expect.arrayContaining(['sovereignty', 'compliance']),
    );
  });

  it('runs only sovereignty for action=sovereignty', async () => {
    const agent = new AegisAgent();
    const response = await agent.execute(testContext, { action: 'sovereignty' });
    const result = response.result as { action: string; components: Record<string, unknown> };
    expect(result.action).toBe('sovereignty');
    expect(Object.keys(result.components)).toEqual(['sovereignty']);
  });

  it('rejects an identical replayed request within the same process', async () => {
    const agent = new AegisAgent();
    const input = { action: 'compliance', industry: 'steel' };

    const first = await agent.execute(testContext, input);
    expect((first.metadata as { replayRejected?: boolean }).replayRejected).toBeUndefined();

    const second = await agent.execute(testContext, input);
    const result = second.result as { replay?: boolean };
    expect(result.replay).toBe(true);
  });

  it('does not reject the same input under a different sessionId', async () => {
    const agent = new AegisAgent();
    const input = { action: 'compliance', industry: 'steel' };

    await agent.execute(testContext, input);
    const otherSession: AgentContext = { ...testContext, sessionId: 'different-session' };
    const second = await agent.execute(otherSession, input);
    const result = second.result as { replay?: boolean };
    expect(result.replay).toBeUndefined();
  });

  it('builds a verifiable, tamper-evident audit chain across executions', async () => {
    const agent = new AegisAgent();
    await agent.execute(testContext, { action: 'sovereignty' });
    await agent.execute({ ...testContext, sessionId: 's2' }, { action: 'compliance' });

    const chainResponse = await agent.execute(testContext, { action: 'audit-chain' });
    const result = chainResponse.result as {
      chainLength: number;
      valid: boolean;
      brokenAtSeq: number | null;
    };
    expect(result.chainLength).toBe(2);
    expect(result.valid).toBe(true);
    expect(result.brokenAtSeq).toBeNull();
  });

  it('detects a tampered audit chain entry', async () => {
    const agent = new AegisAgent();
    await agent.execute(testContext, { action: 'sovereignty' });

    const chain = AegisAgent.getAuditChain();
    // Simulate tampering: mutate a field on the stored entry object directly.
    (chain[0] as { resultSummary: string }).resultSummary = 'tampered';

    const verification = AegisAgent.verifyAuditChain();
    expect(verification.valid).toBe(false);
    expect(verification.brokenAtSeq).toBe(1);
  });

  it('flags Article 12 logging as degraded when INTERNAL_DB_URL is not configured', async () => {
    const agent = new AegisAgent();
    const response = await agent.execute(testContext, { action: 'compliance' });
    const metadata = response.metadata as { article12: { logged: boolean; error?: string } };
    // In this test environment INTERNAL_DB_URL is not set, so Article12Logger
    // must throw at construction and Aegis must degrade gracefully rather
    // than crash or silently pretend the evidence was persisted.
    expect(metadata.article12.logged).toBe(false);
    expect(metadata.article12.error).toBeTruthy();
  });

  it('returns audit-chain action without executing any sub-agent', async () => {
    const agent = new AegisAgent();
    const response = await agent.execute(testContext, { action: 'audit-chain' });
    const result = response.result as { action: string; entries: unknown[] };
    expect(result.action).toBe('audit-chain');
    expect(Array.isArray(result.entries)).toBe(true);
  });
});
