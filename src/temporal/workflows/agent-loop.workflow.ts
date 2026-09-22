/**
 * Temporal Workflow — Agentic Loop (Use case #11)
 *
 * Durable port of BaseAgent.runLoop()'s observe-think-act for-loop
 * (src/agents/base.agent.ts:161-238), following the pattern in
 * temporalio/ai-cookbook's agentic_loop_tool_call_claude_python: the
 * Workflow holds the loop and conversation history, two Activities do the
 * external work (LLM call, tool execution), and the loop continues until
 * the LLM stops requesting tools or maxIterations is reached.
 *
 * Deliberately does NOT import agents/tools.js or agents/llm-client.js —
 * those run real I/O and aren't safe to pull into the Workflow's
 * deterministic sandbox; only their *types* cross into this file (erased
 * at compile time), and the actual calls live in
 * src/temporal/activities/agent-loop.activities.ts, which runs in a normal
 * Node Activity worker. The tool list is resolved by the caller (same as
 * the cookbook's own design) rather than inside the Workflow, for the same
 * reason: BUILTIN_TOOLS resolution in the current runLoop() touches
 * autonomy-phase config and notify policy, which belongs in the caller's
 * plain Node context, not the workflow sandbox.
 *
 * NOT wired into BaseAgent.runLoop() this session — every live agent calls
 * runLoop() today; a cutover needs its own review, same caution already
 * applied to the Stripe webhook route (#6) and outreach-full's send step.
 */
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/agent-loop.activities.js';
import type { AgentContext, LLMMessage, LLMResponse, ToolDefinition } from '../../agents/types.js';

const { callAgentLLMActivity, executeAgentToolCallsActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '2 minutes',
  retry: { initialInterval: '5 seconds', backoffCoefficient: 2, maximumAttempts: 3 },
});

export interface AgentLoopWorkflowInput {
  agentModel: string;
  orgId?: string;
  systemPrompt: string;
  userMessage: string;
  tools: ToolDefinition[];
  context: AgentContext;
  maxIterations?: number;
}

export interface AgentLoopIterationRecord {
  iteration: number;
  phase: 'think' | 'act';
  thought?: string;
  toolCallCount?: number;
}

export interface AgentLoopWorkflowResult {
  content: string;
  iterations: AgentLoopIterationRecord[];
  totalTokens: { input: number; output: number };
  model: string;
}

const DEFAULT_MAX_ITERATIONS = 10;

export async function agentLoopWorkflow(
  input: AgentLoopWorkflowInput,
): Promise<AgentLoopWorkflowResult> {
  const messages: LLMMessage[] = [
    { role: 'system', content: input.systemPrompt },
    { role: 'user', content: input.userMessage },
  ];

  const iterations: AgentLoopIterationRecord[] = [];
  let totalInput = 0;
  let totalOutput = 0;
  let model = input.agentModel;
  const maxIterations = input.maxIterations ?? DEFAULT_MAX_ITERATIONS;

  for (let i = 0; i < maxIterations; i++) {
    let response: LLMResponse;
    try {
      response = await callAgentLLMActivity({
        agentModel: input.agentModel,
        orgId: input.orgId,
        messages,
        tools: input.tools,
      });
    } catch {
      break;
    }

    totalInput += response.inputTokens;
    totalOutput += response.outputTokens;
    model = response.model;

    if (
      !response.toolCalls ||
      response.toolCalls.length === 0 ||
      response.stopReason === 'end_turn'
    ) {
      iterations.push({ iteration: i, phase: 'think', thought: response.content });
      messages.push({ role: 'assistant', content: response.content });
      break;
    }

    const toolCalls = response.toolCalls;
    messages.push({ role: 'assistant', content: response.content || '', toolCalls });

    const toolResults = await executeAgentToolCallsActivity({ toolCalls, context: input.context });
    for (const result of toolResults) {
      messages.push({
        role: 'tool',
        content: JSON.stringify(result.result),
        toolCallId: result.toolCallId,
      });
    }

    iterations.push({
      iteration: i,
      phase: 'act',
      thought: response.content || undefined,
      toolCallCount: toolCalls.length,
    });
  }

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  const finalContent =
    typeof lastAssistant?.content === 'string'
      ? lastAssistant.content
      : JSON.stringify(lastAssistant?.content || {});

  return {
    content: finalContent,
    iterations,
    totalTokens: { input: totalInput, output: totalOutput },
    model,
  };
}
