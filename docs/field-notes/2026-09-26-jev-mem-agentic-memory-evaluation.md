# Jev-Mem — System-One-Controlled Agentic Memory: Evaluation for DWS Memory Plane

Status: PENDING_REVIEW
Date: 2026-09-26
Author: Claude Code (standby runtime), session `claude/jev-mem-performance-635cn7`
Standards loaded: `docs/system-config/STANDARDS_ROUTING.md`, `DWS_LEARNING_STANDARD.md`, `DWS_TRUTH_STANDARD.md` (memory rows), `DWS_ROLES_REGISTRY.md` (R03/R04)
Tags: memory, agent-architecture, benchmark, LoCoMo, Jev, pgvector, competitive-intelligence

## 1. Source

| Item         | Value                                                                                                                                                                                                                                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paper        | _Jev-Mem: System-One-Controlled Agentic Memory for Efficient AI Agents_, arXiv 2609.23986v1. Dongming Jiang, Yi Li, Bingzhe Li (corresponding), Dept. of Computer Science, University of Texas at Dallas                                                                                                                                                                            |
| Code         | `github.com/libingzheren/Jev-Mem`: MIT, Python 3.11, offline demo without API keys                                                                                                                                                                                                                                                                                                  |
| HIC pointer  | academy.dair.ai/papers/jev-mem-system-one-controlled-agentic-memory-for-efficient-ai-agents-2609.23986 (HIC, 2026-09-26)                                                                                                                                                                                                                                                            |
| Verification | v1.1: full paper text read via Hugging Face connector (`hf://papers/2609.23986/paper.md`, arXiv HTML mirror). Repo README read directly. academy.dair.ai, arxiv.org, huggingface.co web, aiweekly.co are `EGRESS_BLOCKED` from this sandbox. Tables 1–2 are images in the HTML; per-category and baseline figures below are from the paper's prose (§4.2–4.3), not the table cells. |

## 2. What it is

Two-speed memory architecture, System-One / System-Two:

- **System-One control plane.** A typed controller J(S, Q): structured state S plus a batch of explicit decision questions Q. It returns probabilities for independent propositions or a distribution over fixed alternatives. No free-form text is generated and parsed. Decisions on the same state are batched into one call. The same interface drives the write path (memory typing, relation construction) and the read path (query routing, retrieval budget, graph traversal, candidate scoring, adaptive stopping). The repo implements it as Jev decisions (default `jev-latest`) plus deterministic code (graph limits, validation, timestamp ordering); no model training.
- **Memory plane.** Shared canonical nodes with **four typed edge sets: semantic, temporal, causal, entity**. Several typed edges may join the same pair. Vector and lexical indexes are entry points into the same node set. Embeddings: MiniLM (repo).
- **System-Two plane.** The answer LLM (GPT-4o-mini in all experiments), called only for complex reasoning and answer synthesis on the assembled evidence.

The core idea (§2.2): most memory-control operations are "semantic but not generative". They output labels, probabilities or scores, so running them through token-by-token LLM generation is wasted cost on the critical path. This is the same principle as request-level model cascades and speculative decoding, applied per memory decision.

## 3. Reported results (LoCoMo, GPT-4o-mini, LLM-as-Judge)

Baselines: Full Context, A-MEM, Nemori, MemoryOS, MAGMA (same answer model where applicable).

| Metric              | Jev-Mem | Best baseline                    | Delta              |
| ------------------- | ------- | -------------------------------- | ------------------ |
| Overall             | 0.777   | 0.700                            | +11.0 % relative ✔ |
| Multi-hop           | 0.625   | 0.569                            | +9.8 % ✔           |
| Open-domain         | 0.610   | 0.517                            | +18.0 % ✔          |
| Adversarial         | 0.962   | 0.742                            | +29.6 % ✔          |
| Single-hop          | 0.797   | not stated in prose              | best               |
| Temporal            | 0.650   | 0.650                            | tie                |
| Memory construction | 158 s   | 1 044 s (fastest competitor)     | −84.9 %, 6.6× ✔    |
| Avg query latency   | 0.93 s  | 1.47 s (fastest memory baseline) | −36.7 % ✔          |
| vs Full Context     | 0.93 s  | 1.74 s                           | −46.6 % ✔          |

Outliers named in the paper: A-MEM and MemoryOS build times > 3 000 s; MemoryOS query latency 32.68 s.

✔ = arithmetic re-checked against the stated figures.

**Correction to v1.0:** v1.0 stated MAGMA build time 1 404 s and "8.9× vs MAGMA". That came from a summarised README fetch and is wrong. The paper gives 1 044 s for the fastest competing system and does not name it in prose. Removed.

**Paper vs repo drift:** the repo README reports slightly different per-category scores (multi-hop 0.623, temporal 0.637, open-domain 0.618, single-hop 0.802). Overall 0.777 matches. Likely a different run; the paper figures are used here.

## 4. Critical reading (method)

1. **Gains are real but uneven.** The largest gain is adversarial (+29.6 %, distractor rejection). That is the category where an explicit evidence-sufficiency check is expected to help most. Multi-hop +9.8 % and open-domain +18.0 % are meaningful. Temporal is only a tie, even though the system adds dedicated temporal edges. Absolute multi-hop and open-domain scores (≈0.61–0.63) are still low for enterprise use.
2. **One benchmark only.** §4.1 says "two widely used benchmarks" but describes and reports LoCoMo only. No LongMemEval result. This is an internal inconsistency in v1 of the paper.
3. **One answer model only.** GPT-4o-mini is used for everything. Transfer to other backbones (our DGX-hosted models) is untested.
4. **No ablation, no variance.** The retrieved text has no ablation of the four edge types or of adaptive stopping, no run-to-run variance and no token-cost figure. We cannot tell which component produces the gain.
5. **No limitations section.** The paper goes from §4 straight to the conclusion.
6. **The judge is a soft metric.** LLM-as-Judge (Zheng et al., 2023) depends on the judge model and prompt. The judge model is not named in the retrieved text. Comparisons across papers are only valid with the same judge.
7. **Sovereignty.** The default stack is US-hosted GPT-4o-mini plus an external `jev-latest` controller. For DWS EU/Sovereign tiers this is an Inference Jurisdiction (IJS) issue. Both are swappable (OpenAI-compatible interface), but the published latency does not transfer until a local controller is measured.

## 5. Fit against DWS memory plane

Current: `src/agents/memory.service.ts` (v1.0.0, 1 144 lines) — pgvector + pg_trgm hybrid recall, temporal superseding for contradictions, entity–relation profile facts (`memory.types.ts:166-175`), decay, duplicate consolidation, LRU recall cache. 5 production call sites.

| Jev-Mem element                    | DWS today                             | Gap                                                |
| ---------------------------------- | ------------------------------------- | -------------------------------------------------- |
| Semantic view                      | pgvector similarity                   | none                                               |
| Temporal view                      | supersede-by-time only                | no temporal edges between memories                 |
| Causal view                        | —                                     | **missing**                                        |
| Entity view                        | profile facts (entity/relation/value) | partial; not a traversable graph                   |
| Cheap controller before LLM        | fixed similarity threshold (0.5)      | **missing** — no routing/evidence-sufficiency step |
| One LLM call on assembled evidence | caller-dependent                      | not enforced                                       |

The architecture matches DWS's own Discipline Rule 5 ("model for judgement calls only") and the Brain-Memory-Body-Hands split. It is a published, benchmarked argument for a design we already hold as a principle.

## 6. Recommendation

**PILOT, do not adopt.** Borrow the pattern, not the dependency.

1. **Reproduce first (1 day, DGX, GREEN).** Clone the MIT repo onto DGX Spark, run the offline demo, then LoCoMo with a **local** answer model and a local controller in place of GPT-4o-mini / `jev-latest`. Accept only if overall ≥ 0.72 and multi-hop ≥ 0.60 on our stack. Gate rationale: 0.72 is above the best baseline (0.700) and 0.60 is above the best multi-hop baseline (0.569). Add one ablation the paper lacks: causal + temporal edges off vs on. This converts a paper claim into a DWS measured fact and shows which part we should actually build.
2. **If it reproduces — extend `memory.service.ts`, don't replace it.** Add (a) typed `temporal` and `causal` edge tables beside the existing pgvector store (one migration file, RLS + grants per standard; application is RED/HIC), (b) a cheap router/evidence-sufficiency gate in `recall()` before the answer model. Keeps Postgres, RLS and the Aegis audit chain intact.
3. **Build our own LoCoMo-style eval** into `src/evals/` so every memory change carries a number. Ties into token-capital (private evals as owned capability).
4. **Do not** add an external controller API to the Sovereign tier path.

**Commercial use (sales / investor):** usable as third-party evidence that "fast controller + single LLM call" beats "LLM on every memory op" on both quality and latency. Claim only after step 1 reproduces on our hardware — until then cite as "published result, UT Dallas, arXiv 2609.23986", never as DWS performance.

## 7. Learning outcome steps

- Step 1 (KB): N/A — `/kb` ingest deferred until reproduction result exists; a paper claim should not enter KB as fact.
- Step 2 (field note): this file.
- Step 3 (Learn/ HTML): `Learn/2026-09-26-jev-mem-agentic-memory-evaluation.html`.
- Step 4 (Drive export): N/A — no Drive write performed this session; repo is source of truth.
- Step 5 (HIC question): **Q1** below.
- Step 6 (Calendar): N/A — no dated commitment made; reproduction date is HIC's to set.

## 8. HIC decision

**Q1.** Approve a 1-day DGX reproduction of Jev-Mem on LoCoMo with a local model (step 6.1), with the go/no-go gate overall ≥ 0.72 and multi-hop ≥ 0.60 — yes / no / change gate?

---

## VERSION AND AGENT HISTORY

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/jev-mem-performance-635cn7 | Date: 26.09.2026 | Changes: Read full paper via HF connector. Added authors, baselines, per-category baseline deltas, full-context latency. Corrected v1.0 MAGMA build-time error (1 404 s / 8.9× removed; paper: 1 044 s fastest competitor, 6.6×). Added method gaps: LoCoMo-only despite "two benchmarks", no ablation/variance/limitations, temporal tie. Recorded paper-vs-README score drift.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/jev-mem-performance-635cn7 | Date: 26.09.2026 | Changes: Initial evaluation of Jev-Mem (arXiv 2609.23986) against `memory.service.ts`; pilot recommendation; Q1.
