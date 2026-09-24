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
import { makeTypedDecision } from '../kya-jev.js';
import type { LLMClient } from '../llm-client.js';
import type { AgentRuntimeContext, LLMMessage } from '../types.js';
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
/**
 * Two gate ids, two decisions (docs/workflow-v2-jev-kya-integration-plan.md, "three deltas"):
 *  - HIC_APPROVAL_GATE  — authorises an outbound ACTION (send, publish, dispatch impacts).
 *  - APPLY_LEARNING_GATE — authorises applying a LEARNING to the world model (Application
 *    Decision: APPLY / PARTIAL_APPLY / REJECT / DEFER). AI learning never changes the system;
 *    a token issued at this gate does.
 */
export const DEFAULT_GATED_NODE_IDS = ['HIC_APPROVAL_GATE', 'APPLY_LEARNING_GATE'];

/**
 * Thrown when a transition leaves a gated node (e.g. HIC_APPROVAL_GATE) with no
 * ApprovalToken hash matching this exact graph/edge/draft. A prompt-level
 * "stop and ask the human" instruction is not a code guarantee — Discipline
 * rule #12 (fail loud) means this is enforced in code, not trusted to the LLM.
 */
export class ApprovalRequiredError extends Error {}

/**
 * Thrown by runExecutorStepTyped when kya-jev abstains (its own output failed
 * validation twice) AND the current node has no ERROR_RECOVERY edge to fall
 * back onto. Per the integration plan, an abstention with an ERROR_RECOVERY
 * edge available is routed there instead of thrown — this error is only the
 * remaining unhandled case, kept as a named error rather than a generic
 * throw (Discipline rule #12, fail loud).
 */
export class TypedTransitionAbstainedError extends Error {}

export interface StepResult {
  currentNode: string;
  assistantText: string;
  nextNode: string | null;
  done: boolean;
  /** Set by runExecutorStepTyped: a summary of kya-jev's decision + per-option probabilities, for GraphTransition.note. */
  note?: string;
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

/**
 * Applies the HIC_APPROVAL_GATE code gate (same rule as runExecutorStep) to a
 * candidate transition. Shared by both the free-text and typed step
 * functions so the gate can never be bypassed by picking one path over the
 * other.
 */
function enforceApprovalGate(
  graph: ProceduralGraph,
  currentNodeId: string,
  nextNode: string,
  draftText: string,
  options?: RunExecutorStepOptions,
): void {
  const gatedNodeIds = options?.gatedNodeIds ?? DEFAULT_GATED_NODE_IDS;
  if (!gatedNodeIds.includes(currentNodeId)) return;

  const requiredHash = computeApprovalHash(graph.name, currentNodeId, nextNode, draftText);
  const approved = (options?.approvedTransitions ?? []).some((t) => t.hash === requiredHash);
  if (!approved) {
    throw new ApprovalRequiredError(
      `Transition "${currentNodeId}" -> "${nextNode}" requires a matching HIC ApprovalToken ` +
        `for this exact draft (graph "${graph.name}") and none was provided.`,
    );
  }
}

/**
 * Typed alternate to runExecutorStep (Phase 1, workflow-v2-jev-kya-integration-plan.md):
 * instead of parsing a `<transition>` tag out of free prose, this asks
 * kya-jev to make a typed 'choice' decision across the current node's
 * `allowedNext` options. Requires a signed 'allowed' KYA verdict on
 * `runtime` — kya-jev's own `requireKyaVerdict`/`verifyKyaVerdict` enforce
 * that; this function does not re-implement or weaken that check.
 *
 * Everything downstream of getting a candidate `nextNode` — assertTransitionAllowed,
 * the HIC_APPROVAL_GATE approval-hash gate — runs exactly as it does for
 * runExecutorStep. This only changes how the candidate is produced.
 */
export async function runExecutorStepTyped(
  client: LLMClient,
  graph: ProceduralGraph,
  currentNodeId: string,
  userInput: string,
  runtime: AgentRuntimeContext,
  options?: RunExecutorStepOptions,
): Promise<StepResult> {
  validateGraph(graph);
  const node = findNode(graph, currentNodeId);

  if (isTerminalNode(node)) {
    return {
      currentNode: currentNodeId,
      assistantText: userInput,
      nextNode: null,
      done: true,
    };
  }

  const state = `${buildExecutorSystemPrompt(graph, currentNodeId)}\n\nUser input: ${userInput}`;
  const result = await makeTypedDecision(
    client,
    {
      state,
      question: {
        kind: 'choice',
        prompt: `Choose the single next node to transition to from "${currentNodeId}", based on the user input and the node's Allowed Next Nodes.`,
        options: node.allowedNext,
      },
    },
    runtime,
  );

  const probabilitySummary = Object.entries(result.probabilities)
    .map(([option, p]) => `${option}:${p.toFixed(2)}`)
    .join(', ');
  const note = `kya-jev typed transition — decision=${result.decision} confidence=${result.confidence.toFixed(2)} probabilities={${probabilitySummary}}`;

  if (result.abstained) {
    if (!node.allowedNext.includes('ERROR_RECOVERY')) {
      throw new TypedTransitionAbstainedError(
        `kya-jev abstained choosing a transition from node "${currentNodeId}" (invalid/unparseable ` +
          `output after retries) and "${currentNodeId}" has no ERROR_RECOVERY edge to fall back onto.`,
      );
    }
    const nextNode = 'ERROR_RECOVERY';
    assertTransitionAllowed(graph, currentNodeId, nextNode);
    enforceApprovalGate(graph, currentNodeId, nextNode, note, options);
    return {
      currentNode: currentNodeId,
      assistantText: userInput,
      nextNode,
      done: false,
      note,
    };
  }

  const nextNode = result.decision;
  assertTransitionAllowed(graph, currentNodeId, nextNode);
  enforceApprovalGate(graph, currentNodeId, nextNode, note, options);

  return {
    currentNode: currentNodeId,
    assistantText: userInput,
    nextNode,
    done: false,
    note,
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
