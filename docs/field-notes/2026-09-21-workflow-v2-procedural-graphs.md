---
Status: PENDING_REVIEW
---

# Workflow v2 — Procedural Graph executor/refiner

## Decisions

- Implemented the Procedural Graphs pattern (external explicit-graph state, not chat
  memory) as a new module: `src/agents/workflow-v2/`.
- Executor turn builds a system prompt anchored to `<current_state>` + the graph, parses
  `<transition>NEXT_NODE</transition>`, and rejects any edge not declared in the node's
  `allowedNext` (`graph.ts::assertTransitionAllowed`).
- Refiner turn (`runRefiner`) reads a completed `ExecutionTrace` and the original graph,
  reusing the existing `LLMClient` (`src/agents/llm-client.ts`) — no new provider wiring.
- Traces checkpoint to disk after every transition (`persistTrace`) per Discipline rule
  #10 (checkpoint every step) and rule #12 (fail loud — illegal transitions throw
  `GraphValidationError`, not silently reroute).
- Did NOT wire this into the existing `/workflow` slash command or the multi-agent
  DAG orchestrator (`mcp-hub/workflows.py`, `cli/src/cli.ts workflow`) — that system
  runs predefined agent-chaining pipelines (compliance-assessment, construction-full,
  seo-pipeline); Workflow v2 is a different primitive (single long-horizon agent, graph
  as external memory) and integrating them was out of scope for this session.

## Facts used

- `src/agents/llm-client.ts:285` — `LLMClient.chat()` is the existing provider-agnostic
  call surface reused for both executor and refiner turns.
- `src/agents/types.ts:214` — `LLMMessage`/`LLMResponse` shapes matched, no new types
  needed on that side.
- Tests: `src/__tests__/agents/workflow-v2.test.ts` — 10/10 passing (`npx vitest run`),
  covering graph validation, illegal-transition rejection, prompt anchoring, and trace
  lifecycle. No live LLM call in tests (deterministic, dependency-free).
- Example graph: `src/agents/workflow-v2/examples/data-pipeline.graph.json`.

## HIC actions

1. Decide whether Workflow v2 should get its own slash command / CLI entry point
   (e.g. `dws workflow-v2 run <graph.json>`), or stay a library other agents import
   directly. No action needed to use the code as-is — it's a pure TS module.

N/A — KB update, Learn/ HTML render, and Drive export skipped this session: no HIC
decision point beyond the one above, and the deliverable is source code, not a
document artifact (Rule 12, fail loud on the skip rather than silently omitting it).
