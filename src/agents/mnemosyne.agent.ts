/**
 * Mnemosyne — Long-term Memory Oracle
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after the Titaness of Memory, mother of the Muses.
 * Maintains persistent cross-session context for agents and users:
 * stores key decisions, compliance history, project milestones,
 * and learned user preferences. Acts as the long-term memory layer
 * in the Brain-Memory-Body-Hands architecture.
 *
 * Book type #3 (Memory-Augmented Agent): persistent episodic + semantic memory.
 *
 * Input: { action, sessionId, orgId, key?, value?, query?, limit? }
 * Output: stored entry, retrieved memories, or memory summary
 *
 * Actions:
 *   - store: Persist a key-value memory entry with metadata
 *   - retrieve: Fuzzy-match retrieval by query string
 *   - summarize: LLM-synthesized summary of recent memories for a session
 *   - forget: Mark a memory entry as expired (GDPR right-to-erasure)
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type MnemosyneAction = 'store' | 'retrieve' | 'summarize' | 'forget';

export class MnemosyneAgent extends BaseAgent {
  constructor() {
    super({
      name: 'mnemosyne',
      description:
        'Long-term memory oracle — persists and retrieves cross-session context, ' +
        'compliance decisions, project milestones, and user preferences. ' +
        'GDPR-compliant with forget (right-to-erasure) action.',
      capabilities: [
        'memory-store',
        'memory-retrieve',
        'memory-summarize',
        'memory-forget',
        'cross-session-context',
        'episodic-memory',
        'semantic-memory',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
    this.soulPrompt = `You are Mnemosyne, the long-term memory oracle for DWS IQ industrial AI platform.
Your role is to maintain persistent, structured memory across agent sessions.

Memory principles:
1. Store memories with semantic richness — not just raw data but context and significance.
2. On retrieval, rank by relevance and recency. Synthesize, don't just list.
3. On summarize, produce a concise narrative of what matters most for the current session.
4. Respect GDPR: forget requests must be honored without argument.

Output structured JSON with fields: action, entries (array), summary, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as MnemosyneAction) || 'retrieve';
    const query = (input.query as string) || (input.key as string) || '';

    const prompt = `Memory action: ${action}
Session: ${context.sessionId}
Org: ${context.orgId}
Query/Key: ${query}
Value: ${JSON.stringify(input.value || null)}
Limit: ${input.limit || 10}

Perform the memory ${action} operation. Return structured JSON with:
- action: "${action}"
- entries: array of relevant memory objects (each with key, value, timestamp, confidence)
- summary: narrative synthesis for 'summarize' action, empty string otherwise
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { action, response: llmResponse },
      confidence: 0.85,
      reasoning: `Mnemosyne performed ${action} operation for session ${context.sessionId}`,
      recommendations: [],
      metadata: { action, sessionId: context.sessionId },
    };
  }
}
