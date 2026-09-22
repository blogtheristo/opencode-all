/**
 * Client-side helper for the agentic-loop Workflow (Use case #11).
 * See src/temporal/workflows/agent-loop.workflow.ts.
 */
import { getTemporalClient } from './client.js';
import { TASK_QUEUES } from './task-queues.js';
import { ticketId } from './ticket-id.js';
import {
  agentLoopWorkflow,
  type AgentLoopWorkflowInput,
  type AgentLoopWorkflowResult,
  answerHumanSignal,
  pendingQuestionQuery,
} from './workflows/agent-loop.workflow.js';

export interface RunAgentLoopInput extends AgentLoopWorkflowInput {
  /** Stable ID — e.g. `${agentName}-${context.sessionId}`. */
  requestId: string;
}

function agentLoopWorkflowId(requestId: string): string {
  return ticketId('agent-loop', requestId);
}

/** Starts the durable agentic loop and waits for its result — drop-in for BaseAgent.runLoop()'s call sites. */
export async function runAgentLoopWorkflow(
  input: RunAgentLoopInput,
): Promise<AgentLoopWorkflowResult> {
  const client = await getTemporalClient();
  const { requestId, ...workflowInput } = input;

  return client.workflow.execute(agentLoopWorkflow, {
    workflowId: agentLoopWorkflowId(requestId),
    taskQueue: TASK_QUEUES.AGENT_LOOP,
    args: [workflowInput],
  });
}

/**
 * Reads the agent's current ask_human question, if it's blocked on one —
 * safe to poll (e.g. a dashboard showing "agents waiting on you").
 */
export async function getPendingAgentQuestion(requestId: string): Promise<string | undefined> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(agentLoopWorkflowId(requestId));
  return handle.query(pendingQuestionQuery);
}

/** Answers a running agent's pending ask_human call, resuming its loop. */
export async function answerAgentQuestion(requestId: string, answer: string): Promise<void> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(agentLoopWorkflowId(requestId));
  await handle.signal(answerHumanSignal, answer);
}
