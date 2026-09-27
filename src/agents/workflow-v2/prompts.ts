// Evidence: Tool=Claude Code 2.1 Model=claude-sonnet-5 Agent=claude Date=2026-09-21
// Audit trail: git log -- src/agents/workflow-v2/prompts.ts
/**
 * Prompt builders for the two Workflow v2 roles.
 *   - buildExecutorSystemPrompt: Part 1, injected per-turn with the graph + current node.
 *   - buildRefinerPrompt: Part 2, run offline against a completed trace.
 */

import type { ExecutionTrace, ProceduralGraph } from './types.js';

function formatGraph(graph: ProceduralGraph): string {
  return graph.nodes
    .map(
      (n) =>
        `- Node: ${n.id}\n  Description: ${n.description}\n  Allowed Next Nodes: [${n.allowedNext.join(', ')}]`,
    )
    .join('\n');
}

export function buildExecutorSystemPrompt(graph: ProceduralGraph, currentNodeId: string): string {
  return `You are an advanced AI executor agent following an explicit Procedural Graph to complete long-horizon tasks. To avoid getting lost in chat history, you must always anchor your actions to your Current State within the graph.

<procedural_graph>
${formatGraph(graph)}
</procedural_graph>

<current_state>
Active Node: ${currentNodeId}
</current_state>

<execution_rules>
1. You may ONLY take actions described in the active node.
2. After taking an action and observing the result, you must choose the next node to transition to.
3. You may ONLY transition to nodes listed in the "Allowed Next Nodes" for your current state.
4. Before taking any action or transitioning, use <scratchpad> tags to briefly reason about your current state, what tools you need to use, and why.
5. Do not rely on deep chat history for your operational context; rely entirely on the current state, recent tool outputs, and the procedural graph.
</execution_rules>

Based on the user's latest input, recent tool outputs, and your <current_state>, perform the necessary work and declare your next transition using the following format:
<transition>NEXT_NODE_NAME</transition>`;
}

function formatTrace(trace: ExecutionTrace): string {
  const path = ['START', ...trace.transitions.map((t) => t.toNode)].join(' -> ');
  return `Outcome: ${trace.outcome === 'success' ? 'Success' : trace.outcome === 'failure' ? 'Failure' : 'In Progress'}
Trace: ${path}
Error/Context: ${trace.errorContext ?? 'N/A'}`;
}

export function buildRefinerPrompt(graph: ProceduralGraph, trace: ExecutionTrace): string {
  return `You are a Procedural Graph Architect. Your job is to optimize the workflow structure for an AI execution agent.

The agent recently ran a workflow using an explicit Procedural Graph. I will provide you with the Original Graph, the Execution Logs (showing the path the agent took), and whether the task was a Success or Failure.

<optimization_rules>
1. Identify Bottlenecks: Did the agent get stuck in an infinite loop between two nodes?
2. Identify Missing Paths: Did the agent need to transition to a node, but the edge wasn't allowed, causing a failure?
3. Identify Ambiguity: Did the agent take steps in the wrong order because the node descriptions were too broad?
4. Edit the Graph: Add new nodes, delete obsolete nodes, edit descriptions, or add/remove allowed edges.
5. Safety Principle: Ensure that your edits resolve the failure without breaking the logical flow required for successful runs. Keep the graph as small and efficient as possible.
</optimization_rules>

<original_graph>
${formatGraph(graph)}
</original_graph>

<execution_logs>
${formatTrace(trace)}
</execution_logs>

Analyze the logs inside <analysis> tags. Focus on exactly where the agent deviated from optimal behavior or got trapped.
Then, output the newly optimized graph inside <updated_graph> tags. Ensure it maintains the format of Nodes, Descriptions, and Allowed Next Nodes.`;
}
