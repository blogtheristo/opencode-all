# Field Note: Graph Engineering — First Slice (Triple Store + Multi-Hop KB Query)

---

# VERSION AND AGENT HISTORY

Version: 1.0
Sessions & Modifications:

- Version: 1.0 | Agent: Claude Code (Sonnet 5) | Session: claude/graph-engineering-kimi-k3-yuifga | Date: 17.08.2026 | Changes: Initial field note documenting the graph-engineering first slice: `graph_facts` triple store, `graph_traverse` query function, extraction hook on `/kb` compile, `dws_graph_query` MCP tool. PR #1852.

---

## Overview

The user shared a Twitter/X article arguing that standard vector-similarity RAG cannot answer multi-hop causal questions ("why did sales drop in March?") because it retrieves text that _looks_ similar, not facts that _connect_ — the causal chain lives across documents sharing no keywords. The article's proposed fix is a knowledge graph: store facts as subject → relation → object triples and query the relationships directly, rather than relying on an LLM agent to loop through repeated re-queries to assemble a causal chain by hand. The article recommended Moonshot AI's "Kimi K3" as the model to run this on.

DWS6 had no graph storage before this session. It had agent _memory_ (pgvector similarity search in `semantic_memories` — unrelated to document RAG, and not what the article's argument was about) and an agent-loop framework (`BaseAgent.runLoop()`) that could already call tools repeatedly to chain facts, but nothing that stored or traversed relationships deterministically.

## What shipped

A deliberately small first slice, scoped down from a broader design pass by two explicit HIC instructions ("the model has to fit DGX, so Qwen 27B MoE" and "do not plan a church, but a small effective solution"):

- **Schema:** `graph_facts` table + `graph_traverse` recursive-CTE function, on the DGX-Spark-internal Postgres — same access-control convention as `semantic_memories` (connection-level isolation, no RLS, never exposed via PostgREST). `infrastructure/dgx-spark/migrations/022_graph_facts.sql`.
- **Extraction:** `src/agents/graph-extraction.service.ts` — sibling of the existing `fact-extraction.service.ts`, retargeted toward causal/relational predicates (`caused_by`, `led_to`, `depends_on`, `is_regulated_by`), hooked into `KBAgent`'s `kb_write_article` tool handler for `wiki/concepts/**` and `wiki/entities/**` articles only (not summaries/reports/indexes).
- **Query:** `src/agents/graph.service.ts` (allowlisted wrapper, mirrors `memory.service.ts`'s `callDbFunction` pattern) + a new `dws_graph_query` MCP tool + `/kb graph "<entity>"` subcommand. One function serves both "local search" (`max_hops=1`, direct neighbors) and multi-hop causal chains (`max_hops>1`) — Microsoft's GraphRAG local-search/global-search framing collapsed into a single parameterized query, per the simplicity-first engineering rule.
- **Model:** local `qwen3-coder:30b` (Qwen3-Coder-30B-A3B MoE), already deployed on DGX Spark and already in `AGENT_TIER_MAP` — one additive line (`'graph-extract': 'standard'`), zero new provider, zero new API key.
- **Tests:** 13 unit tests (`graph-extraction.test.ts`, `graph.service.test.ts`), all passing. `tsc --noEmit` clean.

## Key decisions and why

1. **Kimi excluded.** No "Kimi K3" exists in our documentation — only Kimi K2.5 (Moonshot AI, via Ollama Cloud) is documented, and it's a cloud model. The HIC's hardware constraint ("has to fit DGX") ruled out any cloud model regardless of naming, so extraction uses the already-deployed local Qwen MoE model instead. This is the single most important correction from the source article: the article's headline recommendation was not adoptable as stated, for two independent reasons (wrong model name, wrong deployment target).
2. **DGX-Spark-internal Postgres, not Supabase.** The architect-agent design pass flagged this as a deviation from a literal "Supabase migration" framing implicit in early planning. `semantic_memories` — the closest existing analogue — lives on the internal DB with no RLS by design (connection-level isolation only), and `graph_facts` is the same kind of agent-internal derived knowledge. HIC confirmed this via `AskUserQuestion` before implementation.
3. **Naive `ILIKE` entity matching, not fuzzy/alias resolution, in v1.** Differently-worded mentions of the same entity ("CBAM" vs "Carbon Border Adjustment Mechanism") form disconnected subgraphs until a later slice. HIC confirmed this tradeoff explicitly rather than it being silently assumed.
4. **Extraction is not inside any agent's `runLoop()`.** It fires deterministically from the `kb_write_article` tool _handler_ (plain TypeScript), not something an LLM decides to invoke — matching the engineering rule that the model is used only for the judgment call (extraction) while _whether it runs_ stays deterministic orchestration code. The query tool (`dws_graph_query`) is additive to the loop framework, not a replacement for it: a single traversal call can now replace several loop iterations of "recall → re-query → recall" for causal questions, but `runLoop()`, its iteration cap, and its audit logging are untouched.

## What's explicitly deferred (not silently dropped)

Extraction from field notes or other agent outputs (kb/ only for now); entity dedup/aliasing; a standalone `skills/graph-engineering/SKILL.md` (extends `/kb` instead, per the Skill Codification Rule — not yet run-and-approved as a distinct capability); a dedicated `dws graph` CLI subcommand (`dws mcp call dws_graph_query` already covers it); an update/supersede path for a triple (v1 only inserts); a second "global search" pattern-matching function (relation-filter-without-start-entity could serve this later).

## Next steps

- Apply migration `022_graph_facts.sql` to the live DGX Spark Postgres (requires DB credentials the agent does not hold — HIC action).
- Run `/kb compile` against real kb/ content once the migration is live, to validate the extraction → traversal path end-to-end outside of unit-test mocks.
- If this proves useful, the next slice candidates are (in order of likely value): entity alias resolution (fixes the disconnected-subgraph problem), a second content source (field notes), and a `skills/graph-engineering/SKILL.md` promotion once the capability has been run and approved per the Skill Codification Rule.

## Learning Outcome checklist (DWS_LEARNING_STANDARD.md)

1. KB update — N/A this session: `/kb compile` requires a running backend server (`POST /api/agents/kb/execute`) not available in this sandboxed session. Recommend running it once migration 022 is live, per Next Steps above.
2. Field note — this document.
3. Learn/ HTML — `Learn/2026-08-17-graph-engineering-first-slice.html` (+ `.docx`), rendered via `scripts/render-doc.sh`.
4. Drive export — done: Google Doc "Field Note: Graph Engineering First Slice (2026-08-17)" under `risto.paarni2024@lifetime.fi`.
5. HIC decision-shaped question — see below.
6. Calendared dated commitments — N/A: this session produced no deadline, expiry, or renewal date, only an open design decision (item 5).

## HIC decision point

Should the next slice prioritize **entity alias resolution** (makes the existing kb/ graph actually connected and demo-able) or **a second content source** (field notes, widening what's covered but leaving the disconnected-subgraph problem in place)? Recommendation: alias resolution first — a wider but still-disconnected graph doesn't answer more multi-hop questions than a narrower connected one.
