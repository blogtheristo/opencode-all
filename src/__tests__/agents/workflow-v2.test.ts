// Evidence: Tool=Claude Code 2.1 Model=claude-sonnet-5 Agent=claude Date=2026-09-21
// Audit trail: git log -- src/__tests__/agents/workflow-v2.test.ts

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ApprovalRequiredError,
  assertTransitionAllowed,
  buildExecutorSystemPrompt,
  buildRefinerPrompt,
  computeApprovalHash,
  finalizeTrace,
  GraphValidationError,
  isTerminalNode,
  isTransitionAllowed,
  newTrace,
  type ProceduralGraph,
  recordTransition,
  runExecutorStep,
  runExecutorStepTyped,
  TypedTransitionAbstainedError,
  validateGraph,
} from '../../agents/workflow-v2/index.js';
import type { LLMClient } from '../../agents/llm-client.js';
import type { AgentRuntimeContext, LLMResponse } from '../../agents/types.js';
import { issueKyaVerdict } from '../../security/runtime-auth.js';

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

describe('investor-outreach example graph (chapter two)', () => {
  it('is structurally valid and gates SEND behind HIC_APPROVAL_GATE, mirroring chapter one', () => {
    const investorGraph: ProceduralGraph = JSON.parse(
      readFileSync(
        new URL('../../agents/workflow-v2/examples/investor-outreach.graph.json', import.meta.url),
        'utf-8',
      ),
    );

    expect(() => validateGraph(investorGraph)).not.toThrow();

    const sendNode = investorGraph.nodes.find((n) => n.id === 'SEND');
    expect(sendNode).toBeDefined();
    // Nothing may reach SEND except through the approval gate — same rule as chapter one.
    for (const node of investorGraph.nodes) {
      if (node.id === 'HIC_APPROVAL_GATE') continue;
      expect(node.allowedNext).not.toContain('SEND');
    }
    expect(isTransitionAllowed(investorGraph, 'HIC_APPROVAL_GATE', 'SEND')).toBe(true);

    // A follow-up send must re-enter the gate, never resend without fresh approval.
    const awaitResponse = investorGraph.nodes.find((n) => n.id === 'AWAIT_RESPONSE');
    expect(awaitResponse?.allowedNext).not.toContain('SEND');
    expect(awaitResponse?.allowedNext).toContain('HIC_APPROVAL_GATE');
  });
});

describe('runExecutorStep — HIC_APPROVAL_GATE code-level enforcement', () => {
  const gateGraph: ProceduralGraph = {
    name: 'gate-test-graph',
    version: 1,
    startNode: 'HIC_APPROVAL_GATE',
    nodes: [
      { id: 'HIC_APPROVAL_GATE', description: 'await HIC approval', allowedNext: ['SEND'] },
      { id: 'SEND', description: 'terminal', allowedNext: [] },
    ],
  };

  const draftText = 'Draft to prospect@example.com: hello there.';

  function fakeClient(content: string): LLMClient {
    return {
      chat: async (): Promise<LLMResponse> => ({
        content,
        model: 'fake-model',
        inputTokens: 1,
        outputTokens: 1,
        stopReason: 'end_turn',
      }),
    } as unknown as LLMClient;
  }

  it('throws ApprovalRequiredError when no matching token is provided', async () => {
    const client = fakeClient(`${draftText}\n<transition>SEND</transition>`);
    await expect(
      runExecutorStep(client, gateGraph, 'HIC_APPROVAL_GATE', 'send it'),
    ).rejects.toThrow(ApprovalRequiredError);
  });

  it('proceeds when a correctly-computed matching token is provided', async () => {
    const content = `${draftText}\n<transition>SEND</transition>`;
    const client = fakeClient(content);
    const hash = computeApprovalHash('gate-test-graph', 'HIC_APPROVAL_GATE', 'SEND', content);

    const result = await runExecutorStep(client, gateGraph, 'HIC_APPROVAL_GATE', 'send it', {
      approvedTransitions: [{ hash, approvedAt: new Date().toISOString() }],
    });

    expect(result.nextNode).toBe('SEND');
    expect(result.done).toBe(false);
  });

  it('rejects a token computed for a different draft (hash binds to draft content)', async () => {
    const actualContent = `${draftText}\n<transition>SEND</transition>`;
    const client = fakeClient(actualContent);
    const staleHash = computeApprovalHash(
      'gate-test-graph',
      'HIC_APPROVAL_GATE',
      'SEND',
      `A different draft entirely.\n<transition>SEND</transition>`,
    );

    await expect(
      runExecutorStep(client, gateGraph, 'HIC_APPROVAL_GATE', 'send it', {
        approvedTransitions: [{ hash: staleHash, approvedAt: new Date().toISOString() }],
      }),
    ).rejects.toThrow(ApprovalRequiredError);
  });

  it('does not require a token from a non-gated node (no regression)', async () => {
    const ungatedGraph: ProceduralGraph = {
      name: 'ungated-test-graph',
      version: 1,
      startNode: 'START',
      nodes: [
        { id: 'START', description: 'begin', allowedNext: ['END'] },
        { id: 'END', description: 'terminal', allowedNext: [] },
      ],
    };
    const client = fakeClient('moving on\n<transition>END</transition>');

    const result = await runExecutorStep(client, ungatedGraph, 'START', 'go');

    expect(result.nextNode).toBe('END');
    expect(result.done).toBe(false);
  });
});

describe('runExecutorStepTyped — kya-jev typed transitions (Phase 1)', () => {
  const typedGraph: ProceduralGraph = {
    name: 'typed-test-graph',
    version: 1,
    startNode: 'START',
    nodes: [
      { id: 'START', description: 'begin', allowedNext: ['FETCH', 'ERROR_RECOVERY'] },
      { id: 'FETCH', description: 'fetch data', allowedNext: ['END'] },
      { id: 'END', description: 'terminal', allowedNext: [] },
      { id: 'ERROR_RECOVERY', description: 'recover', allowedNext: [] },
    ],
  };

  const gateTypedGraph: ProceduralGraph = {
    name: 'typed-gate-test-graph',
    version: 1,
    startNode: 'HIC_APPROVAL_GATE',
    nodes: [
      { id: 'HIC_APPROVAL_GATE', description: 'await HIC approval', allowedNext: ['SEND'] },
      { id: 'SEND', description: 'terminal', allowedNext: [] },
    ],
  };

  const ORIGINAL_SECRET = process.env.KYA_VERDICT_SIGNING_SECRET;

  beforeEach(() => {
    process.env.KYA_VERDICT_SIGNING_SECRET = 'test-signing-secret-do-not-use-in-prod';
  });

  afterEach(() => {
    if (ORIGINAL_SECRET === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET;
    else process.env.KYA_VERDICT_SIGNING_SECRET = ORIGINAL_SECRET;
  });

  function runtimeWith(kya: AgentRuntimeContext['kya']): AgentRuntimeContext {
    return { name: 'workflow-v2-test', autonomyPhase: 'silent_pilot', kya };
  }

  function fakeClient(content: string): LLMClient {
    return {
      chat: async (): Promise<LLMResponse> => ({
        content,
        model: 'fake-model',
        inputTokens: 1,
        outputTokens: 1,
        stopReason: 'end_turn',
      }),
    } as unknown as LLMClient;
  }

  it('succeeds end-to-end given a valid signed KYA verdict and a valid typed-decision reply', async () => {
    const client = fakeClient(
      '{"decision":"FETCH","probabilities":{"FETCH":0.81,"ERROR_RECOVERY":0.19},"confidence":0.81}',
    );
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });

    const result = await runExecutorStepTyped(
      client,
      typedGraph,
      'START',
      'go fetch it',
      runtimeWith(verdict),
    );

    expect(result.nextNode).toBe('FETCH');
    expect(result.done).toBe(false);
    expect(result.note).toContain('decision=FETCH');
    expect(result.note).toContain('FETCH:0.81');
  });

  it("propagates kya-jev's own rejection when no valid signed KYA verdict is present", async () => {
    const client = fakeClient('{"decision":"FETCH","confidence":0.9}');

    // No verdict at all.
    await expect(
      runExecutorStepTyped(
        client,
        typedGraph,
        'START',
        'go fetch it',
        undefined as unknown as AgentRuntimeContext,
      ),
    ).rejects.toThrow(/KYA verdict/);

    // Hand-constructed, unsigned "allowed" verdict — the forgery kya-jev exists to reject.
    await expect(
      runExecutorStepTyped(
        client,
        typedGraph,
        'START',
        'go fetch it',
        runtimeWith({ decision: 'allowed', trustScore: 100 }),
      ),
    ).rejects.toThrow(/signature verification/);
  });

  it('routes an abstained typed decision to ERROR_RECOVERY when that edge exists', async () => {
    const client = fakeClient('not json at all');
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });

    const result = await runExecutorStepTyped(
      client,
      typedGraph,
      'START',
      'ambiguous input',
      runtimeWith(verdict),
    );

    expect(result.nextNode).toBe('ERROR_RECOVERY');
    expect(result.done).toBe(false);
  });

  it('throws TypedTransitionAbstainedError when abstained and no ERROR_RECOVERY edge exists', async () => {
    const client = fakeClient('not json at all');
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });
    const noRecoveryGraph: ProceduralGraph = {
      name: 'no-recovery-graph',
      version: 1,
      startNode: 'FETCH',
      nodes: [
        { id: 'FETCH', description: 'fetch data', allowedNext: ['END'] },
        { id: 'END', description: 'terminal', allowedNext: [] },
      ],
    };

    await expect(
      runExecutorStepTyped(
        client,
        noRecoveryGraph,
        'FETCH',
        'ambiguous input',
        runtimeWith(verdict),
      ),
    ).rejects.toThrow(TypedTransitionAbstainedError);
  });

  it('still enforces the HIC_APPROVAL_GATE code gate for a typed transition leaving a gated node', async () => {
    const client = fakeClient(
      '{"decision":"SEND","probabilities":{"SEND":0.95},"confidence":0.95}',
    );
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });

    await expect(
      runExecutorStepTyped(
        client,
        gateTypedGraph,
        'HIC_APPROVAL_GATE',
        'send it',
        runtimeWith(verdict),
      ),
    ).rejects.toThrow(ApprovalRequiredError);
  });

  it('proceeds past HIC_APPROVAL_GATE for a typed transition when a correctly-computed token is provided', async () => {
    const client = fakeClient(
      '{"decision":"SEND","probabilities":{"SEND":0.95},"confidence":0.95}',
    );
    const verdict = issueKyaVerdict({ decision: 'allowed', trustScore: 90 });
    // The approval hash binds to the note text produced by the typed path, since that
    // is what the HIC reviews for a typed transition — compute it the same way runExecutorStepTyped does.
    const note =
      'kya-jev typed transition — decision=SEND confidence=0.95 probabilities={SEND:0.95}';
    const hash = computeApprovalHash('typed-gate-test-graph', 'HIC_APPROVAL_GATE', 'SEND', note);

    const result = await runExecutorStepTyped(
      client,
      gateTypedGraph,
      'HIC_APPROVAL_GATE',
      'send it',
      runtimeWith(verdict),
      { approvedTransitions: [{ hash, approvedAt: new Date().toISOString() }] },
    );

    expect(result.nextNode).toBe('SEND');
  });
});

describe('kya-incident-response example graph (chapter seven)', () => {
  it('is structurally valid and gates SNAP_EXECUTE behind SNAP_DRY_RUN -> SNAP_CONFIRM', () => {
    const kyaGraph: ProceduralGraph = JSON.parse(
      readFileSync(
        new URL(
          '../../agents/workflow-v2/examples/kya-incident-response.graph.json',
          import.meta.url,
        ),
        'utf-8',
      ),
    );

    expect(() => validateGraph(kyaGraph)).not.toThrow();

    const snapExecute = kyaGraph.nodes.find((n) => n.id === 'SNAP_EXECUTE');
    expect(snapExecute).toBeDefined();

    // Nothing except SNAP_CONFIRM may reach SNAP_EXECUTE.
    for (const node of kyaGraph.nodes) {
      if (node.id === 'SNAP_CONFIRM') continue;
      expect(node.allowedNext).not.toContain('SNAP_EXECUTE');
    }
    expect(isTransitionAllowed(kyaGraph, 'SNAP_CONFIRM', 'SNAP_EXECUTE')).toBe(true);

    // And nothing except SNAP_DRY_RUN may reach SNAP_CONFIRM — the dry-run-first path
    // from the skill doc is structurally the only way in.
    for (const node of kyaGraph.nodes) {
      if (node.id === 'SNAP_DRY_RUN') continue;
      expect(node.allowedNext).not.toContain('SNAP_CONFIRM');
    }
    expect(isTransitionAllowed(kyaGraph, 'SNAP_DRY_RUN', 'SNAP_CONFIRM')).toBe(true);
  });

  it('maps ASSESS_TRUST onto all four IJS tiers', () => {
    const kyaGraph: ProceduralGraph = JSON.parse(
      readFileSync(
        new URL(
          '../../agents/workflow-v2/examples/kya-incident-response.graph.json',
          import.meta.url,
        ),
        'utf-8',
      ),
    );
    const assessTrust = kyaGraph.nodes.find((n) => n.id === 'ASSESS_TRUST');
    expect(assessTrust?.allowedNext).toEqual(
      expect.arrayContaining(['SOVEREIGN', 'COMPLIANT', 'PARTIAL_REMEDIATION', 'ESCALATE_C_LEVEL']),
    );
  });
});

// ── Chapters 3–8 ────────────────────────────────────────────────────────────
// Chapters 3 and 4 are read-only assessments: they issue no outbound action, so
// they deliberately carry no approval gate. Chapters 5, 6 and 8 each end in an
// action a human must authorize, and reuse the same `HIC_APPROVAL_GATE` node id
// that `DEFAULT_GATED_NODE_IDS` in runner.ts already enforces in code.

function loadExampleGraph(fileName: string): ProceduralGraph {
  return JSON.parse(
    readFileSync(
      new URL(`../../agents/workflow-v2/examples/${fileName}`, import.meta.url),
      'utf-8',
    ),
  );
}

const EXAMPLE_GRAPHS = [
  'b2b-growth-funnel.graph.json',
  'case-coordination.graph.json',
  'compliance-assessment.graph.json',
  'construction-site-assessment.graph.json',
  'content-publishing.graph.json',
  'data-pipeline.graph.json',
  'helpdesk-triage.graph.json',
  'investor-outreach.graph.json',
  'kya-incident-response.graph.json',
  'sales-outreach.graph.json',
];

describe('every shipped example graph', () => {
  it.each(EXAMPLE_GRAPHS)('%s is structurally valid', (fileName) => {
    const graph = loadExampleGraph(fileName);
    expect(() => validateGraph(graph)).not.toThrow();
    expect(graph.nodes.some((n) => n.id === graph.startNode)).toBe(true);
    // Every graph must be able to finish: at least one terminal node.
    expect(graph.nodes.some((n) => n.allowedNext.length === 0)).toBe(true);
  });
});

// Each entry: the graph, its gate node, and the single protected action that
// must be unreachable except through that gate. Listed explicitly rather than
// inferred — a gate's other successors are back-edges (e.g. "revise") that are
// legitimately reachable from elsewhere, so only the protected action is exclusive.
const GATED_ACTIONS = [
  { file: 'sales-outreach.graph.json', gate: 'HIC_APPROVAL_GATE', protected: 'SEND' },
  { file: 'investor-outreach.graph.json', gate: 'HIC_APPROVAL_GATE', protected: 'SEND' },
  { file: 'content-publishing.graph.json', gate: 'HIC_APPROVAL_GATE', protected: 'PUBLISH' },
  { file: 'helpdesk-triage.graph.json', gate: 'HIC_APPROVAL_GATE', protected: 'SEND_REPLY' },
  { file: 'case-coordination.graph.json', gate: 'HIC_APPROVAL_GATE', protected: 'EXECUTE_ACTION' },
  { file: 'kya-incident-response.graph.json', gate: 'SNAP_CONFIRM', protected: 'SNAP_EXECUTE' },
];

describe('gated actions are structurally unreachable except through their gate', () => {
  it.each(GATED_ACTIONS)('$file: only $gate may reach $protected', ({ file, gate, protected: protectedNode }) => {
    const graph = loadExampleGraph(file);
    expect(graph.nodes.find((n) => n.id === protectedNode)).toBeDefined();
    for (const node of graph.nodes) {
      if (node.id === gate) continue;
      expect(node.allowedNext).not.toContain(protectedNode);
    }
    expect(isTransitionAllowed(graph, gate, protectedNode)).toBe(true);
  });
});

describe('compliance-assessment example graph (chapter three)', () => {
  it('routes every pipeline stage to MISSING_DATA — the recovery the DAG lacks', () => {
    const graph = loadExampleGraph('compliance-assessment.graph.json');
    for (const stage of ['COLLECT_INPUTS', 'RUN_EMISSIONS_ANALYSIS', 'RUN_REGULATORY_CHECK', 'RUN_VIABILITY_ASSESSMENT']) {
      expect(isTransitionAllowed(graph, stage, 'MISSING_DATA')).toBe(true);
    }
    // MISSING_DATA must lead back into the pipeline, not dead-end.
    expect(isTransitionAllowed(graph, 'MISSING_DATA', 'COLLECT_INPUTS')).toBe(true);
  });

  it('keeps the emissions -> regulatory -> viability backbone', () => {
    const graph = loadExampleGraph('compliance-assessment.graph.json');
    expect(isTransitionAllowed(graph, 'RUN_EMISSIONS_ANALYSIS', 'RUN_REGULATORY_CHECK')).toBe(true);
    expect(isTransitionAllowed(graph, 'RUN_REGULATORY_CHECK', 'RUN_VIABILITY_ASSESSMENT')).toBe(true);
  });
});

describe('construction-site-assessment example graph (chapter four)', () => {
  it('makes the safety -> schedule dependency explicit (the fan-out cannot express it)', () => {
    const graph = loadExampleGraph('construction-site-assessment.graph.json');
    expect(isTransitionAllowed(graph, 'ASSESS_SAFETY', 'ANALYSE_MATERIALS_CARBON')).toBe(true);
    expect(isTransitionAllowed(graph, 'ANALYSE_MATERIALS_CARBON', 'CHECK_SCHEDULE')).toBe(true);
    const schedule = graph.nodes.find((n) => n.id === 'CHECK_SCHEDULE');
    expect(schedule?.description).toContain('capacity');
  });

  it('gives every measurement stage a stale-input recovery path', () => {
    const graph = loadExampleGraph('construction-site-assessment.graph.json');
    for (const stage of ['GATHER_SITE_CONDITIONS', 'ASSESS_SAFETY', 'ANALYSE_MATERIALS_CARBON', 'CHECK_SCHEDULE']) {
      expect(isTransitionAllowed(graph, stage, 'STALE_INPUT_RECOVERY')).toBe(true);
    }
  });
});

describe('content-publishing example graph (chapter five)', () => {
  it('sends every revision round back through the approval gate', () => {
    const graph = loadExampleGraph('content-publishing.graph.json');
    // REVISE must not reach PUBLISH directly; it returns to SHOW_TO_HIC,
    // which is the only route back into the gate.
    expect(isTransitionAllowed(graph, 'REVISE', 'SHOW_TO_HIC')).toBe(true);
    expect(isTransitionAllowed(graph, 'SHOW_TO_HIC', 'HIC_APPROVAL_GATE')).toBe(true);
    expect(graph.nodes.find((n) => n.id === 'REVISE')?.allowedNext).not.toContain('PUBLISH');
  });

  it('reopens the loop on a post-approval edit instead of republishing', () => {
    const graph = loadExampleGraph('content-publishing.graph.json');
    expect(isTransitionAllowed(graph, 'POST_APPROVAL_EDIT', 'DRAFT')).toBe(true);
    expect(graph.nodes.find((n) => n.id === 'POST_APPROVAL_EDIT')?.allowedNext).not.toContain('PUBLISH');
  });
});

describe('helpdesk-triage example graph (chapter six)', () => {
  it('routes low-confidence / refund / escalate away from the reply path', () => {
    const graph = loadExampleGraph('helpdesk-triage.graph.json');
    expect(isTransitionAllowed(graph, 'CLASSIFY_ACTION', 'ESCALATED')).toBe(true);
    // ESCALATED is terminal for the agent — a human owns the ticket from there.
    expect(graph.nodes.find((n) => n.id === 'ESCALATED')?.allowedNext).toEqual([]);
  });

  it('makes a follow-up reply re-enter triage rather than resend on the prior approval', () => {
    const graph = loadExampleGraph('helpdesk-triage.graph.json');
    const awaitCustomer = graph.nodes.find((n) => n.id === 'AWAIT_CUSTOMER');
    expect(awaitCustomer?.allowedNext).toContain('TRIAGE');
    expect(awaitCustomer?.allowedNext).not.toContain('SEND_REPLY');
  });
});

describe('case-coordination example graph (chapter eight)', () => {
  it('holds an open case across events without restarting it', () => {
    const graph = loadExampleGraph('case-coordination.graph.json');
    expect(isTransitionAllowed(graph, 'REPORT_STATUS', 'AWAIT_NEXT_EVENT')).toBe(true);
    expect(isTransitionAllowed(graph, 'AWAIT_NEXT_EVENT', 'DISPATCH_AGENTS')).toBe(true);
    // Re-entry goes to DISPATCH_AGENTS, not back to START — the case is not restarted.
    expect(graph.nodes.find((n) => n.id === 'AWAIT_NEXT_EVENT')?.allowedNext).not.toContain('START');
  });

  it('surfaces a partial agent set instead of reporting it as complete', () => {
    const graph = loadExampleGraph('case-coordination.graph.json');
    expect(isTransitionAllowed(graph, 'DISPATCH_AGENTS', 'AGENT_FAILURE')).toBe(true);
    expect(isTransitionAllowed(graph, 'AGENT_FAILURE', 'DISPATCH_AGENTS')).toBe(true);
  });
});
