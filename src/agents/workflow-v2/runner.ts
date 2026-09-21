// Evidence: Tool=Claude Code 2.1 Model=claude-sonnet-5 Agent=claude Date=2026-09-21
// Audit trail: git log -- src/agents/workflow-v2/runner.ts
/**
 * Workflow v2 state manager — the "lightweight wrapper" the framework calls for.
 *
 * Tracks Current State outside chat history, calls the executor LLM one turn at a
 * time, reads the <transition> tag, validates it against the graph, checkpoints the
 * trace to disk after every step (Discipline rule #10), and clears conversational
 * history between turns so the agent anchors to graph state, not chat memory.
 */

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import type { LLMClient } from '../llm-client.js';
import type { LLMMessage } from '../types.js';
import {
  assertTransitionAllowed,
  computeApprovalHash,
  findNode,
  isTerminalNode,
  validateGraph,
} from './graph.js';
import { buildExecutorSystemPrompt, buildRefinerPrompt } from './prompts.js';
import type {
  ApprovalToken,
  ExecutionTrace,
  GraphTransition,
  ProceduralGraph,
  RunOutcome,
} from './types.js';

const TRANSITION_RE = /<transition>\s*([A-Za-z0-9_]+)\s*<\/transition>/;

/** Node ids that always require a matching ApprovalToken before their outbound edge fires. */
export const DEFAULT_GATED_NODE_IDS = ['HIC_APPROVAL_GATE'];

/**
 * Thrown when a transition leaves a gated node (e.g. HIC_APPROVAL_GATE) with no
 * ApprovalToken hash matching this exact graph/edge/draft. A prompt-level
 * "stop and ask the human" instruction is not a code guarantee — Discipline
 * rule #12 (fail loud) means this is enforced in code, not trusted to the LLM.
 */
export class ApprovalRequiredError extends Error {}

export interface StepResult {
  currentNode: string;
  assistantText: string;
  nextNode: string | null;
  done: boolean;
}

export interface RunExecutorStepOptions {
  /** HIC-issued approval tokens available to satisfy any gated transition this step proposes. */
  approvedTransitions?: ApprovalToken[];
  /** Node ids whose outbound edges require a matching ApprovalToken. Defaults to DEFAULT_GATED_NODE_IDS. */
  gatedNodeIds?: string[];
}

/** One turn of executor work: fresh minimal context, graph + current node only. */
export async function runExecutorStep(
  client: LLMClient,
  graph: ProceduralGraph,
  currentNodeId: string,
  userInput: string,
  options?: RunExecutorStepOptions,
): Promise<StepResult> {
  validateGraph(graph);
  const node = findNode(graph, currentNodeId);

  const messages: LLMMessage[] = [
    { role: 'system', content: buildExecutorSystemPrompt(graph, currentNodeId) },
    { role: 'user', content: userInput },
  ];

  const response = await client.chat(messages);
  const match = TRANSITION_RE.exec(response.content);

  if (!match) {
    if (isTerminalNode(node)) {
      return {
        currentNode: currentNodeId,
        assistantText: response.content,
        nextNode: null,
        done: true,
      };
    }
    throw new Error(
      `Executor did not declare a <transition> from node "${currentNodeId}" (required unless terminal)`,
    );
  }

  const nextNode = match[1];
  assertTransitionAllowed(graph, currentNodeId, nextNode);

  const gatedNodeIds = options?.gatedNodeIds ?? DEFAULT_GATED_NODE_IDS;
  if (gatedNodeIds.includes(currentNodeId)) {
    const requiredHash = computeApprovalHash(graph.name, currentNodeId, nextNode, response.content);
    const approved = (options?.approvedTransitions ?? []).some((t) => t.hash === requiredHash);
    if (!approved) {
      throw new ApprovalRequiredError(
        `Transition "${currentNodeId}" -> "${nextNode}" requires a matching HIC ApprovalToken ` +
          `for this exact draft (graph "${graph.name}") and none was provided.`,
      );
    }
  }

  return {
    currentNode: currentNodeId,
    assistantText: response.content,
    nextNode,
    done: false,
  };
}

export function newTrace(graph: ProceduralGraph): ExecutionTrace {
  return {
    graphName: graph.name,
    graphVersion: graph.version,
    runId: randomUUID(),
    startedAt: new Date().toISOString(),
    transitions: [],
    outcome: 'in_progress',
  };
}

export function recordTransition(
  trace: ExecutionTrace,
  fromNode: string,
  toNode: string,
  note?: string,
): ExecutionTrace {
  const transition: GraphTransition = { fromNode, toNode, at: new Date().toISOString(), note };
  return { ...trace, transitions: [...trace.transitions, transition] };
}

export function finalizeTrace(
  trace: ExecutionTrace,
  outcome: RunOutcome,
  errorContext?: string,
): ExecutionTrace {
  return { ...trace, finishedAt: new Date().toISOString(), outcome, errorContext };
}

/** Checkpoint the trace to disk after every step — never rely on chat history alone. */
export async function persistTrace(trace: ExecutionTrace, path: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(trace, null, 2), 'utf-8');
}

export async function loadTrace(path: string): Promise<ExecutionTrace> {
  return JSON.parse(await readFile(path, 'utf-8')) as ExecutionTrace;
}

/** Runs the offline Refiner turn against a completed trace and returns its raw reply. */
export async function runRefiner(
  client: LLMClient,
  graph: ProceduralGraph,
  trace: ExecutionTrace,
): Promise<string> {
  const messages: LLMMessage[] = [{ role: 'user', content: buildRefinerPrompt(graph, trace) }];
  const response = await client.chat(messages);
  return response.content;
}

export { buildExecutorSystemPrompt, buildRefinerPrompt } from './prompts.js';
export { validateGraph } from './graph.js';
