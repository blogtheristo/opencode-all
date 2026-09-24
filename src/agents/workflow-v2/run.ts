// Evidence: Tool=Claude Code 2.1 Model=claude-opus-5 Agent=claude Date=2026-09-22
// Audit trail: git log -- src/agents/workflow-v2/run.ts
/**
 * Workflow v2 runner — the executable entry point for a procedural graph.
 *
 * Usage:
 *   npx tsx src/agents/workflow-v2/run.ts <graph.json> [options]
 *
 *   --input "<text>"     Task input handed to the executor each step.
 *   --script A,B,C       Replay a fixed transition path with no LLM. Uses the
 *                        REAL runExecutorStep code path (a scripted client
 *                        returns the <transition> tag), so graph validation,
 *                        edge enforcement and the approval gate all still run.
 *                        This is how a graph is smoke-tested offline.
 *   --typed              Use runExecutorStepTyped (kya-jev typed decisions).
 *                        Requires a signed KYA verdict; not usable with --script.
 *   --trace <path>       Where to write the ExecutionTrace JSON.
 *                        Default: .workflow-v2-runs/<graph>-<runId>.json
 *   --max-steps <n>      Loop guard (default 50). A procedural graph can still
 *                        cycle legally (AWAIT_RESPONSE -> ... -> AWAIT_RESPONSE);
 *                        this bounds a runaway rather than trusting it not to.
 *
 * Without --script a live LLM provider must be configured, or
 * createLLMClientForAgent returns null and this exits with a clear error
 * rather than a null-dereference.
 */

import { readFileSync } from 'node:fs';
import { createLLMClientForAgent, type LLMClient } from '../llm-client.js';
import type { LLMResponse } from '../types.js';
import { findNode, isTerminalNode, validateGraph } from './graph.js';
import {
  finalizeTrace,
  newTrace,
  persistTrace,
  recordTransition,
  runExecutorStep,
} from './runner.js';
import type { ExecutionTrace, ProceduralGraph } from './types.js';

interface RunOptions {
  input: string;
  script?: string[];
  tracePath?: string;
  maxSteps: number;
}

/**
 * A client that replays a fixed transition path. It satisfies only the part of
 * LLMClient the executor actually uses (`chat`), deliberately — a fuller fake
 * would invite trusting it as a stand-in for a real model, which it is not.
 */
function createScriptedClient(script: string[]): LLMClient {
  let index = 0;
  return {
    async chat(): Promise<LLMResponse> {
      const next = script[index++];
      if (next === undefined) {
        throw new Error(
          `Scripted run exhausted its path after ${script.length} step(s) without reaching a terminal node. Extend --script or check the graph.`,
        );
      }
      return {
        content: `<scratchpad>scripted replay step ${index}</scratchpad>\n<transition>${next}</transition>`,
        model: 'scripted',
        inputTokens: 0,
        outputTokens: 0,
        stopReason: 'end_turn',
      };
    },
  } as unknown as LLMClient;
}

export async function runGraph(
  graph: ProceduralGraph,
  client: LLMClient,
  options: RunOptions,
): Promise<ExecutionTrace> {
  validateGraph(graph);

  let trace = newTrace(graph);
  const tracePath = options.tracePath ?? `.workflow-v2-runs/${graph.name}-${trace.runId}.json`;

  let currentNode = graph.startNode;
  let steps = 0;

  process.stdout.write(
    `\ngraph:  ${graph.name} v${graph.version}\nrun:    ${trace.runId}\ntrace:  ${tracePath}\n\n`,
  );
  process.stdout.write(`  ${currentNode}\n`);

  try {
    while (steps < options.maxSteps) {
      if (isTerminalNode(findNode(graph, currentNode))) {
        trace = finalizeTrace(trace, 'success');
        break;
      }

      steps += 1;
      const result = await runExecutorStep(client, graph, currentNode, options.input);

      if (result.nextNode === null) {
        trace = finalizeTrace(trace, 'success');
        break;
      }

      trace = recordTransition(trace, currentNode, result.nextNode);
      await persistTrace(trace, tracePath); // checkpoint every step (Discipline #10)
      process.stdout.write(`  -> ${result.nextNode}\n`);
      currentNode = result.nextNode;
    }

    if (trace.outcome === 'in_progress') {
      trace = finalizeTrace(
        trace,
        'failure',
        `Hit --max-steps (${options.maxSteps}) without reaching a terminal node. Last node: ${currentNode}.`,
      );
    }
  } catch (err: unknown) {
    // Fail loud (Discipline #12): the trace records why, and is still written.
    trace = finalizeTrace(trace, 'failure', err instanceof Error ? err.message : String(err));
    await persistTrace(trace, tracePath);
    throw err;
  }

  await persistTrace(trace, tracePath);
  return trace;
}

function parseArgs(argv: string[]): { graphPath: string; options: RunOptions; typed: boolean } {
  const [graphPath] = argv;
  if (!graphPath) {
    throw new Error(
      'Usage: npx tsx src/agents/workflow-v2/run.ts <graph.json> [--input "..."] [--script A,B,C]',
    );
  }
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i === -1 ? undefined : argv[i + 1];
  };
  const script = get('--script');
  return {
    graphPath,
    typed: argv.includes('--typed'),
    options: {
      input: get('--input') ?? 'Proceed with this workflow.',
      script: script ? script.split(',').map((s) => s.trim()) : undefined,
      tracePath: get('--trace'),
      maxSteps: Number(get('--max-steps') ?? 50),
    },
  };
}

async function main(): Promise<void> {
  const { graphPath, options, typed } = parseArgs(process.argv.slice(2));

  if (typed && options.script) {
    throw new Error(
      '--typed and --script are mutually exclusive: typed decisions require a real kya-jev call with a signed KYA verdict.',
    );
  }
  if (typed) {
    throw new Error(
      '--typed is not wired into this entry point yet: runExecutorStepTyped needs an AgentRuntimeContext carrying a signed KYA verdict, which this CLI has no way to obtain. Use the library directly until that is threaded through.',
    );
  }

  const graph = JSON.parse(readFileSync(graphPath, 'utf-8')) as ProceduralGraph;

  let client: LLMClient | null;
  if (options.script) {
    client = createScriptedClient(options.script);
    process.stdout.write('mode:   scripted replay (no LLM)\n');
  } else {
    client = createLLMClientForAgent('workflow-v2');
    if (!client) {
      throw new Error(
        'No LLM provider configured, so there is nothing to make transition decisions.\n' +
          'Either configure a provider (DGX Spark / Ollama per the DGX-first cost policy, or a cloud key),\n' +
          'or replay a fixed path offline with --script NODE_A,NODE_B,...',
      );
    }
    process.stdout.write(`mode:   live (${client.provider} / ${client.model})\n`);
  }

  const trace = await runGraph(graph, client, options);

  const path = ['START', ...trace.transitions.map((t) => t.toNode)];
  process.stdout.write(`\noutcome: ${trace.outcome}\npath:    ${path.join(' -> ')}\n`);
  if (trace.errorContext) process.stdout.write(`reason:  ${trace.errorContext}\n`);
  process.stdout.write('\n');
}

// Only run when invoked directly, so the module stays importable by tests.
if (process.argv[1] && process.argv[1].endsWith('run.ts')) {
  main().catch((err: unknown) => {
    process.stderr.write(
      `\nworkflow-v2 run failed: ${err instanceof Error ? err.message : String(err)}\n\n`,
    );
    process.exit(1);
  });
}
