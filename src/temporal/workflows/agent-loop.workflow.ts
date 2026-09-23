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
 *
 * Agent-initiated human question (`ask_human`): the "agent→human" half of
 * the pattern in Ziggy's Durable HITL Agents demo (ADK+LangGraph+Temporal;
 * see docs/dws-use-cases.md's addendum on use case #9). `ask_human` is a
 * reserved tool name intercepted *inside this Workflow*, not dispatched to
 * executeAgentToolCallsActivity: the loop durably waits on a Signal
 * (mirrors the demo's `answer_dispatch` signal), a Query exposes the
 * pending question for external inspection (mirrors `pending_question`),
 * and the answer is fed back into the conversation as the tool's result —
 * the agent's next observation, exactly like the demo's dispatch agent.
 */
import {
  condition,
  defineQuery,
  defineSignal,
  proxyActivities,
  setHandler,
} from '@temporalio/workflow';
import type * as activities from '../activities/agent-loop.activities.js';
import type { AgentContext, LLMMessage, LLMResponse, ToolDefinition } from '../../agents/types.js';

const { callAgentLLMActivity, executeAgentToolCallsActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '2 minutes',
  retry: { initialInterval: '5 seconds', backoffCoefficient: 2, maximumAttempts: 3 },
});

export const ASK_HUMAN_TOOL_NAME = 'ask_human';

const ASK_HUMAN_TOOL_DEFINITION: ToolDefinition = {
  name: ASK_HUMAN_TOOL_NAME,
  description:
    'Ask the human operator a question when you need judgment, a missing fact, or explicit permission before continuing. Pauses durably until answered — use only when genuinely blocked, not for routine confirmations.',
  parameters: {
    type: 'object',
    properties: { question: { type: 'string', description: 'The question to ask the human.' } },
    required: ['question'],
  },
};

export const answerHumanSignal = defineSignal<[string]>('answerHuman');
export const pendingQuestionQuery = defineQuery<string | undefined>('pendingQuestion');

const DEFAULT_ASK_HUMAN_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AgentLoopWorkflowInput {
  agentModel: string;
  orgId?: string;
  systemPrompt: string;
  userMessage: string;
  tools: ToolDefinition[];
  context: AgentContext;
  maxIterations?: number;
  /** Lets the agent call ask_human mid-loop (default: true). */
  allowAskHuman?: boolean;
  /** How long a single ask_human call waits before giving up — default 24h. */
  askHumanTimeoutMs?: number;
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
  const allowAskHuman = input.allowAskHuman !== false;
  const askHumanTimeoutMs = input.askHumanTimeoutMs ?? DEFAULT_ASK_HUMAN_TIMEOUT_MS;

  let currentQuestion: string | undefined;
  let currentAnswer: string | undefined;

  setHandler(answerHumanSignal, (answer) => {
    currentAnswer = answer;
  });
  setHandler(pendingQuestionQuery, () => currentQuestion);

  async function askHuman(question: string): Promise<string> {
    currentQuestion = question;
    currentAnswer = undefined;
    const answered = await condition(() => currentAnswer !== undefined, askHumanTimeoutMs);
    currentQuestion = undefined;
    return answered && currentAnswer !== undefined
      ? currentAnswer
      : '(no answer received before timeout — proceed with your best judgment or stop)';
  }

  const tools = allowAskHuman ? [...input.tools, ASK_HUMAN_TOOL_DEFINITION] : input.tools;

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
        tools,
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

    const askHumanCalls = toolCalls.filter((tc) => tc.name === ASK_HUMAN_TOOL_NAME);
    const activityCalls = toolCalls.filter((tc) => tc.name !== ASK_HUMAN_TOOL_NAME);

    // Sequential: the demo's dispatch agent asks one question at a time; a
    // second ask_human before the first is answered would overwrite the
    // pending-question Query state, which is the right behavior for "the
    // agent is currently blocked on this one question."
    for (const call of askHumanCalls) {
      const question = (call.arguments as { question?: string }).question || '(no question given)';
      const answer = await askHuman(question);
      messages.push({ role: 'tool', content: JSON.stringify({ answer }), toolCallId: call.id });
    }

    if (activityCalls.length > 0) {
      const toolResults = await executeAgentToolCallsActivity({
        toolCalls: activityCalls,
        context: input.context,
      });
      for (const result of toolResults) {
        messages.push({
          role: 'tool',
          content: JSON.stringify(result.result),
          toolCallId: result.toolCallId,
        });
      }
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
