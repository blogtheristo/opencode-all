/**
 * Temporal Activities — Agentic Loop (Use case #11)
 *
 * TS port of temporalio/ai-cookbook's agentic_loop_tool_call_claude_python:
 * the LLM call and tool execution become Activities so a Temporal Workflow
 * can durably drive the observe-think-act loop that
 * `BaseAgent.runLoop()` (src/agents/base.agent.ts) currently runs in a
 * single in-process for-loop with no durability — a crash on iteration 7 of
 * 10 loses the whole conversation and every LLM call already paid for.
 *
 * Both Activities take and return plain JSON-serializable data (AgentContext
 * and the LLM/tool types in src/agents/types.ts carry no live handles —
 * confirmed by reading their definitions before porting this), so no
 * adaptation was needed to cross the Activity boundary.
 */
import { ApplicationFailure } from '@temporalio/activity';
import { createLLMClient } from '../../agents/llm-client.js';
import { executeTools } from '../../agents/tools.js';
import type {
  AgentContext,
  LLMMessage,
  LLMResponse,
  ToolCall,
  ToolDefinition,
  ToolResult,
} from '../../agents/types.js';

export interface CallAgentLLMInput {
  /** Model/provider selector — same string BaseAgent passes to createLLMClient today. */
  agentModel: string;
  orgId?: string;
  messages: LLMMessage[];
  tools: ToolDefinition[];
}

export async function callAgentLLMActivity(input: CallAgentLLMInput): Promise<LLMResponse> {
  const client = createLLMClient(input.agentModel, input.orgId);
  if (!client) {
    throw ApplicationFailure.create({
      message: `No LLM provider configured for model "${input.agentModel}" (no API key found)`,
      type: 'LLMProviderUnavailable',
      nonRetryable: true,
    });
  }

  try {
    return await client.chat(input.messages, input.tools);
  } catch (err) {
    throw ApplicationFailure.create({
      message: `LLM call failed: ${(err as Error).message}`,
      type: 'LLMCallError',
      nonRetryable: false,
    });
  }
}

export interface ExecuteAgentToolCallsInput {
  toolCalls: ToolCall[];
  context: AgentContext;
}

export async function executeAgentToolCallsActivity(
  input: ExecuteAgentToolCallsInput,
): Promise<ToolResult[]> {
  return executeTools(input.toolCalls, input.context);
}
