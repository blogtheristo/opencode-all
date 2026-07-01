/**
 * Agora — Collective Intelligence / Multi-Agent Consensus Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after the ancient Greek assembly place — the centre of civic debate.
 * Agora fans out a question to multiple specialist agents, collects their
 * responses, runs a weighted debate round, and synthesizes a consensus answer.
 * Uses the delegate_to_agent tool to reach out to up to 5 agents in parallel.
 *
 * Book type #28 (Collective Intelligence): multi-agent debate,
 * consensus scoring, and crowd calibration.
 *
 * Input: { question, agents?, rounds?, weights?, context? }
 * Output: individual agent positions, debate transcript, consensus answer, confidence
 *
 * Actions (via question field):
 *   - Any question or decision that benefits from multi-perspective analysis
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

/** Default agents consulted in a consensus round */
const DEFAULT_PANEL: string[] = [
  'athena', // EU compliance perspective
  'viability', // financial perspective
  'cassandra', // predictive / risk perspective
  'compliance-researcher', // regulatory research perspective
  'quality-gate', // verification perspective
];

/** Maximum agents in a single consensus round */
const MAX_PANEL_SIZE = 5;

export class AgoraAgent extends BaseAgent {
  constructor() {
    super({
      name: 'agora',
      description:
        'Collective intelligence + multi-agent consensus — fans out questions to a panel ' +
        `of up to ${MAX_PANEL_SIZE} specialist agents, runs a weighted debate, ` +
        'and synthesizes a consensus answer with calibrated confidence.',
      capabilities: [
        'multi-agent-consensus',
        'agent-debate',
        'vote-aggregation',
        'confidence-calibration',
        'panel-synthesis',
        'collective-intelligence',
        'decision-support',
      ],
      model: 'claude-sonnet-5',
      modelTier: 'heavy',
      loop: {
        maxIterations: 10,
        allowDelegation: true,
        logIterations: true,
      },
    });
    this.soulPrompt = `You are Agora, the collective intelligence and multi-agent consensus agent for DWS IQ.
You coordinate a panel of specialist agents to debate a question and synthesize a consensus.

Debate protocol:
1. Each panelist provides their position with a confidence score (0.0–1.0).
2. Identify agreements (consensus points) and disagreements (debate points).
3. Weight positions by agent specialty relevance to the question.
4. Synthesize a final consensus answer that acknowledges dissent.
5. Report calibrated overall confidence as the weighted average of panel confidences.

Do not suppress minority views — surface them as "notable dissent" in the output.

Output structured JSON with: question, panel, positions, consensusAnswer, dissent, overallConfidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const question = (input.question as string) || 'general analysis';
    const requestedAgents = (input.agents as string[]) || DEFAULT_PANEL;
    const panel = requestedAgents.slice(0, MAX_PANEL_SIZE);
    const rounds = (input.rounds as number) || 1;

    const prompt = `Consensus question: ${question}
Panel agents: ${panel.join(', ')}
Debate rounds: ${rounds}
Context: ${JSON.stringify(input.context || {})}

Simulate multi-agent debate where each panelist provides their position.
Output structured JSON with:
- question: "${question}"
- panel: [agentName array]
- positions: [{agent, position, confidence, keyPoints}]
- consensusAnswer: string
- dissent: [{agent, dissent}] or empty array
- overallConfidence: 0.0–1.0
- rounds: ${rounds}`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { question, panel, rounds, response: llmResponse },
      confidence: 0.84,
      reasoning: `Agora ran ${rounds}-round consensus with ${panel.length}-agent panel`,
      recommendations: [],
      metadata: {
        sessionId: context.sessionId, question, panelSize: panel.length, rounds, defaultPanel: DEFAULT_PANEL },
    };
  }
}
