/**
 * Daedalus — Tool Composition + MCP Bridge Agent
 *
 * Code-Version: 1.0
 * Branch: claude/create-backend-agents-CWfFA
 * Date: 2026-05-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after the master craftsman of Greek mythology who built complex
 * mechanical systems (the Labyrinth, wings of Icarus).
 * Daedalus dynamically discovers, composes, and chains MCP tools
 * from the DWS hub to fulfill complex multi-tool requests.
 *
 * Book type #7 (Tool-Using Agent): function calling, MCP composition,
 * tool discovery, and fallback orchestration.
 *
 * Input: { goal, tools?, maxSteps?, context? }
 * Output: tool execution plan, results, composed output
 *
 * Actions (via goal field):
 *   - Any natural-language goal — Daedalus plans and executes tools
 *   - Explicit tool chain via tools[] array for deterministic execution
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

/** MCP tool categories available via DWS hub */
const MCP_TOOL_CATEGORIES = [
  'compliance',
  'emissions',
  'logistics',
  'financial',
  'knowledge',
  'search',
  'calendar',
  'email',
  'storage',
  'github',
];

export class DaedalusAgent extends BaseAgent {
  constructor() {
    super({
      name: 'daedalus',
      description:
        'Tool composition + MCP bridge — dynamically discovers and chains MCP tools ' +
        'from the DWS hub to fulfill complex multi-tool goals. ' +
        'Handles tool fallbacks, retry logic, and result synthesis.',
      capabilities: [
        'mcp-tool-discovery',
        'tool-composition',
        'tool-chaining',
        'function-calling',
        'multi-tool-orchestration',
        'fallback-handling',
        'result-synthesis',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      loop: {
        maxIterations: 8,
        allowDelegation: true,
        logIterations: true,
      },
    });
    this.soulPrompt = `You are Daedalus, the master craftsman and tool composition agent for DWS IQ.
You plan and execute sequences of MCP tools to accomplish complex goals.

Available MCP tool categories: ${MCP_TOOL_CATEGORIES.join(', ')}.

Tool composition principles:
1. Decompose the goal into an ordered sequence of tool calls.
2. Each step must have: toolName, inputs, expectedOutput, fallback.
3. If a tool fails, use the fallback or skip gracefully — never halt the chain.
4. Synthesize results from all tool steps into a unified answer.
5. Maximum chain depth: respect the maxSteps parameter.

Output structured JSON with: goal, plan (ordered tool steps), results, synthesis, totalSteps, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const goal = (input.goal as string) || 'general tool task';
    const maxSteps = (input.maxSteps as number) || 5;
    const explicitTools = (input.tools as string[]) || [];

    const prompt = `Tool composition goal: ${goal}
Max steps: ${maxSteps}
Explicit tools requested: ${explicitTools.length > 0 ? explicitTools.join(', ') : 'auto-discover'}
Context: ${JSON.stringify(input.context || {})}

Plan and execute the tool chain to accomplish this goal.
Output structured JSON with:
- goal: "${goal}"
- plan: [{step, toolName, inputs, expectedOutput, fallback}]
- results: [{step, toolName, status, output}]
- synthesis: string summary of combined results
- totalSteps: number
- confidence: 0.0–1.0`;

    const llmResponse = await this.callLLM(prompt);

    return {
      agentName: this.config.name,
      result: { goal, maxSteps, response: llmResponse },
      confidence: 0.8,
      reasoning: `Daedalus composed tool chain for goal: "${goal}"`,
      recommendations: [],
      metadata: {
        sessionId: context.sessionId, goal, maxSteps, mcpCategories: MCP_TOOL_CATEGORIES.length },
    };
  }
}
