// Evidence: Tool=Claude Code 2.1 Model=claude-sonnet-5 Agent=claude Date=2026-09-21
// Audit trail: git log -- src/agents/workflow-v2/graph.ts
/**
 * Procedural Graph validation and transition checking.
 * Kept dependency-free so it can run in the executor loop, the refiner, and tests alike.
 */

import type { ProceduralGraph, ProceduralNode } from './types.js';

export class GraphValidationError extends Error {}

export function findNode(graph: ProceduralGraph, nodeId: string): ProceduralNode {
  const node = graph.nodes.find((n) => n.id === nodeId);
  if (!node) {
    throw new GraphValidationError(`Node "${nodeId}" does not exist in graph "${graph.name}"`);
  }
  return node;
}

/** Structural checks: unique ids, start node exists, every edge points at a real node. */
export function validateGraph(graph: ProceduralGraph): void {
  if (graph.nodes.length === 0) {
    throw new GraphValidationError(`Graph "${graph.name}" has no nodes`);
  }

  const ids = new Set<string>();
  for (const node of graph.nodes) {
    if (ids.has(node.id)) {
      throw new GraphValidationError(`Duplicate node id "${node.id}" in graph "${graph.name}"`);
    }
    ids.add(node.id);
  }

  if (!ids.has(graph.startNode)) {
    throw new GraphValidationError(
      `Start node "${graph.startNode}" does not exist in graph "${graph.name}"`,
    );
  }

  for (const node of graph.nodes) {
    for (const next of node.allowedNext) {
      if (!ids.has(next)) {
        throw new GraphValidationError(
          `Node "${node.id}" allows transition to unknown node "${next}"`,
        );
      }
    }
  }
}

/** Enforces execution_rules #3 — the executor may only move along a declared edge. */
export function isTransitionAllowed(
  graph: ProceduralGraph,
  fromNode: string,
  toNode: string,
): boolean {
  const node = findNode(graph, fromNode);
  return node.allowedNext.includes(toNode);
}

export function assertTransitionAllowed(
  graph: ProceduralGraph,
  fromNode: string,
  toNode: string,
): void {
  if (!isTransitionAllowed(graph, fromNode, toNode)) {
    throw new GraphValidationError(
      `Illegal transition: "${fromNode}" -> "${toNode}" is not in allowedNext for "${fromNode}"`,
    );
  }
}

export function isTerminalNode(node: ProceduralNode): boolean {
  return node.allowedNext.length === 0;
}
