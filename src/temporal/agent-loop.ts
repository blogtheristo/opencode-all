/**
 * Client-side helper for the agentic-loop Workflow (Use case #11).
 * See src/temporal/workflows/agent-loop.workflow.ts.
 */
import { getTemporalClient } from './client.js';
import { TASK_QUEUES } from './task-queues.js';
import {
  agentLoopWorkflow,
  type AgentLoopWorkflowInput,
  type AgentLoopWorkflowResult,
} from './workflows/agent-loop.workflow.js';

export interface RunAgentLoopInput extends AgentLoopWorkflowInput {
  /** Stable ID — e.g. `${agentName}-${context.sessionId}`. */
  requestId: string;
}

/** Starts the durable agentic loop and waits for its result — drop-in for BaseAgent.runLoop()'s call sites. */
export async function runAgentLoopWorkflow(
  input: RunAgentLoopInput,
): Promise<AgentLoopWorkflowResult> {
  const client = await getTemporalClient();
  const { requestId, ...workflowInput } = input;

  return client.workflow.execute(agentLoopWorkflow, {
    workflowId: `agent-loop-${requestId}`,
    taskQueue: TASK_QUEUES.AGENT_LOOP,
    args: [workflowInput],
  });
}
