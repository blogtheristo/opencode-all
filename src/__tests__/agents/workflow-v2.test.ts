// Evidence: Tool=Claude Code 2.1 Model=claude-sonnet-5 Agent=claude Date=2026-09-21
// Audit trail: git log -- src/__tests__/agents/workflow-v2.test.ts

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  assertTransitionAllowed,
  buildExecutorSystemPrompt,
  buildRefinerPrompt,
  finalizeTrace,
  GraphValidationError,
  isTerminalNode,
  isTransitionAllowed,
  newTrace,
  type ProceduralGraph,
  recordTransition,
  validateGraph,
} from '../../agents/workflow-v2/index.js';

const graph: ProceduralGraph = {
  name: 'test-graph',
  version: 1,
  startNode: 'START',
  nodes: [
    { id: 'START', description: 'begin', allowedNext: ['FETCH', 'END'] },
    { id: 'FETCH', description: 'fetch data', allowedNext: ['END'] },
    { id: 'END', description: 'terminal', allowedNext: [] },
  ],
};

describe('validateGraph', () => {
  it('accepts a well-formed graph', () => {
    expect(() => validateGraph(graph)).not.toThrow();
  });

  it('rejects an unknown start node', () => {
    const bad: ProceduralGraph = { ...graph, startNode: 'NOPE' };
    expect(() => validateGraph(bad)).toThrow(GraphValidationError);
  });

  it('rejects an edge to a node that does not exist', () => {
    const bad: ProceduralGraph = {
      ...graph,
      nodes: [...graph.nodes, { id: 'DANGLING', description: 'x', allowedNext: ['GHOST'] }],
    };
    expect(() => validateGraph(bad)).toThrow(GraphValidationError);
  });

  it('rejects duplicate node ids', () => {
    const bad: ProceduralGraph = {
      ...graph,
      nodes: [...graph.nodes, { id: 'START', description: 'dup', allowedNext: [] }],
    };
    expect(() => validateGraph(bad)).toThrow(GraphValidationError);
  });
});

describe('transitions', () => {
  it('allows a declared edge', () => {
    expect(isTransitionAllowed(graph, 'START', 'FETCH')).toBe(true);
    expect(() => assertTransitionAllowed(graph, 'START', 'FETCH')).not.toThrow();
  });

  it('rejects an edge that skips the graph — the failure case Procedural Graphs prevent', () => {
    expect(isTransitionAllowed(graph, 'FETCH', 'START')).toBe(false);
    expect(() => assertTransitionAllowed(graph, 'FETCH', 'START')).toThrow(GraphValidationError);
  });

  it('flags the terminal node', () => {
    expect(isTerminalNode(graph.nodes[2])).toBe(true);
    expect(isTerminalNode(graph.nodes[0])).toBe(false);
  });
});

describe('buildExecutorSystemPrompt', () => {
  it('anchors the prompt to the current node, not chat history', () => {
    const prompt = buildExecutorSystemPrompt(graph, 'FETCH');
    expect(prompt).toContain('Active Node: FETCH');
    expect(prompt).toContain('Node: START');
    expect(prompt).toContain('<transition>NEXT_NODE_NAME</transition>');
  });
});

describe('trace lifecycle', () => {
  it('records transitions and finalizes an outcome', () => {
    let trace = newTrace(graph);
    expect(trace.outcome).toBe('in_progress');
    trace = recordTransition(trace, 'START', 'FETCH', 'called fetch tool');
    trace = recordTransition(trace, 'FETCH', 'END');
    trace = finalizeTrace(trace, 'success');

    expect(trace.transitions).toHaveLength(2);
    expect(trace.outcome).toBe('success');
    expect(trace.finishedAt).toBeDefined();
  });
});

describe('buildRefinerPrompt', () => {
  it('renders the execution path and outcome for the refiner to analyze', () => {
    let trace = newTrace(graph);
    trace = recordTransition(trace, 'START', 'FETCH');
    trace = recordTransition(trace, 'FETCH', 'FETCH', 'retry after tool error');
    trace = finalizeTrace(trace, 'failure', 'tool timed out twice');

    const prompt = buildRefinerPrompt(graph, trace);
    expect(prompt).toContain('Trace: START -> FETCH -> FETCH');
    expect(prompt).toContain('Outcome: Failure');
    expect(prompt).toContain('tool timed out twice');
    expect(prompt).toContain('<updated_graph>');
  });
});

describe('sales-outreach example graph (chapter one)', () => {
  it('is structurally valid and gates SEND behind HIC_APPROVAL_GATE', () => {
    const salesGraph: ProceduralGraph = JSON.parse(
      readFileSync(
        new URL('../../agents/workflow-v2/examples/sales-outreach.graph.json', import.meta.url),
        'utf-8',
      ),
    );

    expect(() => validateGraph(salesGraph)).not.toThrow();

    const sendNode = salesGraph.nodes.find((n) => n.id === 'SEND');
    expect(sendNode).toBeDefined();
    // Nothing may reach SEND except through the approval gate.
    for (const node of salesGraph.nodes) {
      if (node.id === 'HIC_APPROVAL_GATE') continue;
      expect(node.allowedNext).not.toContain('SEND');
    }
    expect(isTransitionAllowed(salesGraph, 'HIC_APPROVAL_GATE', 'SEND')).toBe(true);
  });
});

describe('b2b-growth-funnel example graph (campaign-level, feeds chapter one)', () => {
  it('is structurally valid and documents its handoff into sales-outreach.graph.json', () => {
    const funnelGraph: ProceduralGraph = JSON.parse(
      readFileSync(
        new URL('../../agents/workflow-v2/examples/b2b-growth-funnel.graph.json', import.meta.url),
        'utf-8',
      ),
    );

    expect(() => validateGraph(funnelGraph)).not.toThrow();
    expect(funnelGraph.startNode).toBe('START');

    const stages = funnelGraph.nodes.map((n) => n.id);
    expect(stages).toEqual(
      expect.arrayContaining(['RESEARCH', 'STRATEGY', 'EXECUTION', 'CAPTURE_OPPORTUNITY']),
    );

    // Research -> Strategy -> Execution is the required backbone; execution
    // is the only stage allowed to hand off into the per-prospect chapter.
    expect(isTransitionAllowed(funnelGraph, 'RESEARCH', 'STRATEGY')).toBe(true);
    expect(isTransitionAllowed(funnelGraph, 'STRATEGY', 'EXECUTION')).toBe(true);
    const execution = funnelGraph.nodes.find((n) => n.id === 'EXECUTION');
    expect(execution?.description).toContain('sales-outreach.graph.json');
  });
});
