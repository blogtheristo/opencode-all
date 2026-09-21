// Evidence: Tool=Claude Code 2.1 Model=claude-sonnet-5 Agent=claude Date=2026-09-21
// Audit trail: git log -- src/agents/workflow-v2/types.ts
/**
 * Workflow v2 — Procedural Graph types.
 *
 * Based on the "Procedural Graphs" pattern: a long-horizon task is defined as an
 * explicit graph of nodes tracked OUTSIDE chat history, instead of relying on the
 * model's conversational memory. Two roles operate on it:
 *   - Executor: acts strictly within the current node, declares its next transition.
 *   - Refiner: reads execution logs offline and edits the graph for future runs.
 */

export interface ProceduralNode {
  id: string;
  description: string;
  /** Node ids this node may transition to. Empty/absent means terminal. */
  allowedNext: string[];
}

export interface ProceduralGraph {
  name: string;
  version: number;
  nodes: ProceduralNode[];
  /** Node id where execution begins. */
  startNode: string;
}

export interface GraphTransition {
  fromNode: string;
  toNode: string;
  /** ISO 8601 timestamp of the transition. */
  at: string;
  /** Free-text note the executor gave for taking this step (tool calls, observations). */
  note?: string;
}

export type RunOutcome = 'success' | 'failure' | 'in_progress';

/**
 * Proof that a specific draft, at a specific edge, was approved by the HIC.
 * `hash` binds to the draft's exact text plus the graph/edge it applies to
 * (see computeApprovalHash in graph.ts) — it is not a rubber stamp for the
 * edge in general.
 */
export interface ApprovalToken {
  hash: string;
  /** ISO 8601 timestamp of when the HIC approved this draft. */
  approvedAt: string;
}

export interface ExecutionTrace {
  graphName: string;
  graphVersion: number;
  runId: string;
  startedAt: string;
  finishedAt?: string;
  transitions: GraphTransition[];
  outcome: RunOutcome;
  /** Populated on failure/success for the refiner to read. */
  errorContext?: string;
}
