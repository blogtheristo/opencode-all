# Field Note: Agent Deployment & Execution — Harness, Sandbox, UI, LangSmith, Aspire

***
# VERSION AND AGENT HISTORY

Version: 1.12

Sessions & Modifications:
  - Version: 1.12 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.11 — Canonical LangSmith Platform three-layer architecture (Agent / Applications+Infra / Traces). Maps every box to a previously-covered DWS section. Introduces "Fleet" (multi-agent coordination at scale) as a new capability — flagged for V3+ when DWS runs >10 agents per tenant.
  - Version: 1.11 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.10 — LangSmith Engine BETA. Engine is the automated govern loop: watches production traces, clusters failures, opens PRs (code changes), adds test datasets, updates Context Hub policies, registers new online evals. Customer quotes (Harmonic, Campfire). Multi-model neutrality risk flagged (VentureBeat). EU AI Act Art. 14 human-oversight gate specified for auto-PR approval. Updated §0.3 ASCII diagram to add "Govern" outer-loop label (LangChain confirmed) and Traces+SmithDB at center.
  - Version: 1.10 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Verified against the canonical Interrupt 2026 announcement (langchain.com/blog/interrupt-2026-overview). Corrected §0.8 SmithDB technology stack (Rust + Apache DataFusion + Vortex; stateless services; 15× perf vs prior; P50 trace tree 92ms, P50 single run 71ms). Added §0.9 — other Interrupt 2026 announcements that interact with our model: LLM Gateway (spend limits + PII redaction), Messages View, Context Hub versioning, Managed Deep Agents GA, Sandboxes GA.
  - Version: 1.9 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.8 — SmithDB internal architecture from the LangChain slide (Cluster Manager + Ingestion / Compaction / Query services + Postgres Metastore + NVMe SSD Cache + Object Storage durability). Updated §0.6 sovereign-fallback design to a "SmithDB-shaped" local stack on DGX Spark.
  - Version: 1.8 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.7 — EU AI Act compliance mapping. Traces ARE the Article 12 record-keeping artifact; govern seat IS the Article 72 post-market monitoring; cold-tier 18-month retention satisfies the audit-trail obligation. Per-article responsibility matrix.
  - Version: 1.7 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Updated §0.6 — SmithDB named as the LangSmith-native purpose-built trace DB. Reframed hot-tier identity (not "ClickHouse under the hood" but a purpose-built engine); V1/V2 stay on SmithDB; V3 self-host falls back to ClickHouse only if sovereignty mandates it.
  - Version: 1.6 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.6 — "Traditional data infra wasn't built for this." Rules out single-DB designs for agent observability; specifies the three-tier DWS observability stack (ClickHouse hot OLAP, object-storage payloads, Supabase + Iceberg cold lakehouse) with the govern-seat "three stores or fewer" budget rule.
  - Version: 1.5 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.5 — Trace volume curve from testing (10M / wk) to new-agents adoption (160M / wk), 16x growth. Defines per-stage DWS capacity, sampling, retention, and govern-seat budget triggers; flags the cost-blow-up risk if observability storage is metered per-event.
  - Version: 1.4 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.4 — Why agent traces are different: deeply nested, unbounded payloads, multi-modal, unique query patterns. Maps each property to a DWS storage / schema / redaction decision and rules out generic APM for the hot path.
  - Version: 1.3 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.3 — BUILD → TEST → DEPLOY → MONITOR lifecycle loop with Traces as the central primitive. Defined the DWS trace schema, the four phases of trace consumption, and the "traces are the govern-seat data" claim.
  - Version: 1.2 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0.2 — LangSmith ecosystem matrix (Server / Model / Context Hub / Sandboxes / MCPs / UI) with the per-row vendor list and DWS pick / fallback per row.
  - Version: 1.1 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Added Section 0 — LangChain Agent Platform 5-pillar reference model (Agent Server / Production Runtime / Sandboxes / Observability & Evals / Context Hub) and the "Observability = Cost Management = Govern" framing. Mapped DWS layers to the 5 pillars.
  - Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/agent-deployment-execution-U8B2C | Date: 28.05.2026 | Changes: Initial capture — execution environment, managed loop, Deep Agents 0.6 (GLM-5 + Exa), CopilotKit / assistant-ui harnesses, LangSmith eval + GA sandboxes, local→prod cycle, Aspire framing.

Session Links & References:
  - Claude Code (claude/agent-deployment-execution-U8B2C): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-05-28-agent-deployment-execution-harness.md
  - **Canonical source — Interrupt 2026 overview:** https://www.langchain.com/blog/interrupt-2026-overview
  - SmithDB announcement (Ankush Gola): referenced via LangChain X / LinkedIn (Jan 2026)
  - LangSmith observability docs: https://docs.langchain.com/langsmith/observability
  - Related: docs/OPENAI_HARNESS_ENGINEERING_ANALYSIS.md
  - Related: docs/AGENT_DEVELOPMENT_GUIDE.md
  - Related: docs/CLOUDFLARE_SANDBOX_PILOT.md
  - Related: docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md
  - Related: AGENTS.md

Document Status:
  - Created: 28.05.2026
  - Last Modified: 28.05.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Global; EU-sovereign deployment via DGX Spark + Scaleway / Nebius / Nscale
- **Sector:** Technology > Agentic AI > Agent Harness > Deployment & Eval Tooling
- **Entities:** Deep Agents 0.6, GLM-5, Exa, LangSmith, LangGraph, CopilotKit, assistant-ui, .NET Aspire, Cloudflare Sandbox, OpenAI Harness, DWS IQ
- **Temporal Context:** 2026-Q2 — LangSmith sandboxes hit GA, Deep Agents 0.6 ships local code-interpreter, harness UIs (CopilotKit / assistant-ui) maturing into production layers.
- **Confidence:** Medium — synthesizes upstream signals into a working DWS deployment model. Vendor versions move fast; revisit before pinning.

---

## 0. Reference model — the 5 pillars

LangChain's Agent Platform diagram pins five pillars around the agent core. We adopt the same vocabulary so DWS terminology lines up with the upstream stack:

```
          ┌───────────────────────┐
          │  PRODUCTION RUNTIME   │
          └───────────────────────┘
                    ·
   ┌──────────┐     ·     ┌───────────┐
   │  AGENT   │ · · ◆ · · │ SANDBOXES │
   │  SERVER  │     ·     └───────────┘
   └──────────┘     ·
                    ·
   ┌──────────┐     ·     ┌─────────────────────┐
   │ CONTEXT  │ · · · · · │ OBSERVABILITY &     │
   │   HUB    │           │ EVALS  ( = GOVERN ) │
   └──────────┘           └─────────────────────┘
```

**Mapping to the DWS sections below:**

| Pillar | What it owns | DWS implementation | Covered in |
|---|---|---|---|
| **Agent Server** | Hosts agent definitions, versions them, serves runs over an API | LangGraph server on DGX Spark + Scaleway; agents registered per `AGENTS.md` | §3 Harness |
| **Production Runtime** | The actual execution loop in prod (managed, never polled) | Aspire-orchestrated harness loop, KYA-gated | §3, §8 |
| **Sandboxes** | Isolated VFS + CLI execution surfaces | LangSmith Sandbox (eval) + Cloudflare Sandbox (prod) + DA 0.6 interpreter (local) | §2, §4 |
| **Observability & Evals** | Traces, costs, datasets, experiments, **governance** | LangSmith eval + OTel GenAI traces + cost ledger | §6, §0.1 |
| **Context Hub** | Long-term memory, KB, canonical facts, per-run context | `/kb` mount + DWS_TRUTH_STANDARD registry + LangGraph checkpoints | §2 |

### 0.1 Observability = Cost Management = Govern

This is the framing we are committing to:

> **Observability is not a dashboard. It is the cost-management seat. The cost-management seat is the governance seat.**

Three reasons that collapse into one decision:

1. **What you can't measure, you can't budget.** Every agent run has a token bill, a tool-call bill, a sandbox-minutes bill, and a human-review bill. The observability layer is where those four bills get added up per agent, per customer, per tenant.
2. **What you can't budget, you can't gate.** Promotion from local → staging → prod is a budget gate as much as a correctness gate. The same trace that proves the agent did the right thing also proves it did it within cost (see §6 metrics: cost p50/p95).
3. **What you can't gate, you can't govern.** KYA tiers, leash-snap, and EU-sovereignty obligations all need a single source of truth for "what did this agent actually do, at what cost, on whose data." Observability *is* that source.

**Concrete consequence for DWS:** the Observability & Evals pillar gets a **GOVERN** sub-label in every diagram and every PRD. The owner of this pillar (currently the `/cron` + `/kya` + LangSmith-eval surface) is the agent-platform governance owner — not just the SRE.

**Concrete consequence for the cycle (§7):** the canary step (4) is rejected if cost p95 exceeds baseline by more than the per-agent tolerance, even when correctness is green. Cheap-but-wrong fails; right-but-expensive also fails.

### 0.2 LangSmith ecosystem — the row-by-row matrix

LangChain's second slide expands the pillars into a **six-row vendor matrix**. Each row is one layer; each row has a LangChain-native option and a set of partner options. Our job is to pick one primary and one fallback per row, by sovereignty and cost — not to adopt every box.

| Row | LangChain native | Partner options shown | DWS primary (V1) | DWS fallback / sovereign | Notes |
|---|---|---|---|---|---|
| **Server** | LangSmith Deployment | — | LangSmith Deployment | Self-host LangGraph server on DGX Spark | Native is fine for non-sensitive runs; sovereign mode needed for EU-tier customers |
| **Model** | — | Fireworks AI, Baseten, *+ any provider* | Anthropic Claude (claude-opus-4-7 / sonnet-4-6 / haiku-4-5) + Fireworks for OSS | GLM-5 on DGX Spark via Ollama (`/ollama-spark`) | Per-agent model choice; price + sovereignty drives it |
| **Context Hub** | LangSmith Context Hub | MongoDB, Redis, Elastic, Pinecone | LangSmith Context Hub + Supabase Postgres (`/kb`) | Self-hosted Redis on DGX Spark for hot cache | Canonical facts stay in repo `/kb`, not in vendor hub |
| **Sandboxes** | LangSmith Sandboxes | Modal, Daytona, Runloop | LangSmith Sandboxes (eval) | Cloudflare Sandbox (prod EU) — see `CLOUDFLARE_SANDBOX_PILOT.md` | Already decided in §2; Modal worth a spike for heavy GPU sandboxes |
| **MCPs** | — | Arcade, *+ any MCP server* | Our existing `mcp-hub/` + `mcp-servers/` (GitHub MCP, Exa, etc.) | Arcade for hosted SaaS connectors we don't want to self-run | MCP-first per `docs/GITHUB_MCP_TOOLS.md` |
| **UI** | — | CopilotKit, assistant-ui | CopilotKit (customer dashboards) | assistant-ui (operator consoles) | Decided in §5 |

**What the matrix actually says.** LangChain is not telling us to use everything. It is saying: pick *one box per row*, and make sure the rows are wired together by the harness — the value is in the *composition*, not in any single vendor.

**Where DWS deviates.** Two rows are deliberately non-LangSmith-native:

1. **Context Hub.** LangSmith Context Hub is fine for run-scoped memory, but **canonical DWS facts** (industry counts, prices, KYA tiers) live in the repo under `/kb` and are governed by `DWS_TRUTH_STANDARD.md`. Vendor-hosted context is a cache, not a source of truth.
2. **MCPs.** We already have `mcp-hub/` and `mcp-servers/` running. Arcade is a fallback for SaaS connectors we don't want to operate, not a replacement.

**Procurement consequence.** Each row's primary + fallback gets a line item in the cost ledger from §6. The govern seat (§0.1) approves new vendors per row — adding "Daytona" without retiring "LangSmith Sandboxes" doubles the audit surface for no win.

### 0.3 Traces — the central primitive of the agent lifecycle

LangChain's third slide reframes the whole stack as a four-phase loop with **Traces + SmithDB** at the center and **Govern** as the outer loop (LangChain's own term, confirmed on the *"Accelerating the Agent Development Lifecycle"* slide):

```
        ────────────────  GOVERN  ────────────────
              BUILD  ───────────►  TEST
        deepagents               datasets
        langchain                evals
        langgraph                experiments
              ▲                      │
              │     ┌──────────┐     │
              │     │  Traces  │     │
              │     │  SmithDB │     ▼
              │     └──────────┘
              │                      │
        MONITOR  ◄───────────  DEPLOY
        tracing                  runtime
        dashboards               agent server
        online evals             sandboxes
        user feedback            context hub
        ────────────────  GOVERN  ────────────────
```

LangChain also names the cycle **ADLC — Agent Development Lifecycle**. That term is now adopted in this note (replaces our ad-hoc "deployment cycle" where appropriate in §7).

The slide's tagline — *"someone at the company who thinks more about traces"* — is the right hire. Traces are not a side-effect of running agents; they are **the work product**. Everything else (datasets, evals, experiments, dashboards, online evals, user feedback) is a *consumer* of traces.

**Why this matters for §0.1.** The "Observability = Cost Management = Govern" claim only works if traces are the single source of truth across all four phases. If BUILD uses one trace schema, TEST uses another, and MONITOR uses a third, the govern seat has to do reconciliation work that will be skipped under pressure. **One trace schema. Four phases that read it.**

**The four phases of trace consumption:**

| Phase | Reads traces for… | Writes back to traces… |
|---|---|---|
| **BUILD** | Replaying historical failures while editing the agent (deepagents / langchain / langgraph) | Nothing — build is a fork, the run is new |
| **TEST** | Comparing experiment runs to baseline; computing per-dataset metrics | Experiment IDs, dataset IDs, score annotations |
| **DEPLOY** | Verifying the new runtime emits the same shape | Production run traces — the main fire-hose |
| **MONITOR** | Tracing, dashboards, online evals, user feedback — the govern seat | User-feedback labels, online-eval scores, incident tags |

**DWS trace schema (v0 — to be ratified):**

A single trace event must carry:

- `trace_id`, `parent_span_id`, `span_id` — OTel-compatible.
- `agent_id` + `agent_version` — which agent and which version emitted this.
- `tenant_id` — for cost attribution and EU-residency routing.
- `kya_tier` — runtime trust level (see `/kya`).
- `model`, `prompt_tokens`, `completion_tokens`, `cached_tokens` — the cost primitive.
- `tool_calls[]` with name, sandbox, duration, status.
- `cost_eur` — pre-computed at emit time, not at query time.
- `eval_scores{}` — populated later by online evals; sparse on most rows.
- `feedback{}` — populated later by user feedback; sparse on most rows.

The same row is the BUILD replay record, the TEST result, the DEPLOY canary observation, and the MONITOR govern artifact. **One schema, one storage, four queries.**

**Storage.** LangSmith for the hot path (last 30 days, dashboards, online evals). Cold-tier export to Supabase (`supabase/migrations/`) for the cost ledger and audit history — that is the **sovereign copy** that survives a LangSmith outage and answers "what did this agent do for this customer 18 months ago."

**OTel GenAI alignment.** The DWS schema MUST be a superset of OpenTelemetry GenAI semantic conventions so the same traces feed Aspire's OTel pipeline (`docs/field-notes/2026-05-15-opentelemetry-genai-observability-control-room.md`) without re-mapping. Vendor neutrality is bought at the schema layer.

**Three guardrails the trace-owner enforces:**

1. **No silent schema changes.** Adding a field to a trace is a PR with an `/eval` run against historical datasets to confirm consumers still parse.
2. **No PII in traces.** Prompt and completion text get redacted at emit time when `kya_tier` ≥ 2. The cost-and-shape data stays; the content does not leave the tenant boundary unredacted.
3. **No trace, no merge.** A new agent (or a new tool call) without a trace span is rejected at PR review. If MONITOR can't see it, DEPLOY won't ship it.

**The hire.** "Someone who thinks more about traces" maps to a named DWS role: the **Agent Platform Govern Lead** (sits on the Observability & Evals pillar from §0). Owns the schema, the storage tiering, the redaction policy, and the cost ledger. Not the SRE, not the ML engineer — a distinct seat.

### 0.4 Why agent traces are different — the four properties

Agent traces break every assumption of traditional APM (Datadog, Honeycomb, New Relic). The LangChain slide names four properties; each forces a specific DWS design decision.

| Property | What it means | Why APM tools fail | DWS decision |
|---|---|---|---|
| **Deeply nested traces** | Planner → sub-agent → tool call → sub-tool — depth 8+ is normal, not exceptional | APM span trees flatten or truncate; sampling drops parent-child links | Native tree storage in LangSmith (hot) + JSONB-with-`ltree` in Supabase (cold). Never sample below trace-root level. |
| **Unbounded payloads** | A single LLM call can hold a 200 KB prompt + 50 KB completion; tool output can be MB | APM payload caps are KB-sized; the interesting data is what gets truncated | Payload-by-reference: store body in object storage (R2 / GCS), keep only a content hash + size in the span. Spans stay small, bodies stay queryable. |
| **Modalities** | Text + images + audio + video + code + structured JSON + embeddings — sometimes all in one span | APM is text-and-numbers; binary blobs end up out-of-band and out-of-mind | Modality tag per payload reference (`text`, `image`, `audio`, `video`, `code`, `embedding`); govern seat enforces per-modality retention + redaction policy. |
| **Unique query patterns** | "Show all runs where the model hallucinated `industry_count`" — not "p95 latency by endpoint" | APM query DSLs assume known dimensions; agent debug needs full-text + semantic search over payloads | Hybrid query path: SQL for metrics, full-text + vector search (Supabase pgvector or Pinecone — see §0.2 Context Hub row) for payload-content questions. |

**The headline consequence.** Generic APM (Datadog / Honeycomb) is **out of scope for the hot path**. We will still export *cost and latency aggregates* to whichever APM the wider business uses, but the agent-debug surface is LangSmith + the DWS sovereign cold tier — not retrofitted infrastructure tracing.

**Schema implication for §0.3.** The trace schema v0 needs three additions to cover these properties cleanly:

- `payload_refs[]` — `{kind, modality, hash, size_bytes, storage_uri}` per body. Spans never inline more than ~2 KB.
- `tree_path` — materialized `ltree`-style path so deep-nested queries don't recurse at read time.
- `search_index_keys[]` — small flat list of indexable phrases for the agent's debug surface (e.g., entity names, tool names, model IDs). The full-text / vector indexes are built off `payload_refs` resolution.

### 0.5 Trace volume grows ~16x from testing to adoption

The LangChain slide tracks one customer's weekly trace volume across four stages. Read it as a capacity-planning curve, not a vanity metric:

```
Stage              | Weekly traces | Multiplier vs. test
-------------------|---------------|--------------------
TESTING            |       10 M    |   1×   (baseline)
PRODUCTION ROLLOUT |   35–50 M     |   3.5–5×
GROWING ADOPTION   |   55–65 M     |   5.5–6.5×
NEW AGENTS (fleet) |  110–160 M    |   11–16×
```

The narration on screen — *"but as the agent enters production"* — is the inflection point: testing volumes are not a useful predictor of production volumes. Plan for 16× from day one or pay for an emergency migration later.

**Why the curve looks this way:**

- **Testing → Rollout (3–5×):** real traffic shows up; each user run also pulls in retries, side-trips, and a longer tool chain than the golden set.
- **Rollout → Adoption (~1.3×):** retention drives repeat-use; agent runs grow faster than seat count.
- **Adoption → New Agents (~2.5×):** the *platform effect* — a working agent stack invites three more agents on top of it. Each new agent inherits the trace fire-hose.

**What this means for DWS V1 capacity:**

| Metric | V1 (testing, today) | V2 (rollout, +6 mo) | V3 (adoption, +12 mo) | V4 (fleet, +18 mo) |
|---|---|---|---|---|
| Weekly traces | ~5 M (extrapolated) | ~25 M | ~50 M | ~120 M |
| LangSmith hot retention | 30 d | 30 d | 14 d | 7 d |
| Supabase cold retention | 18 mo | 18 mo | 18 mo | 18 mo (mandatory for audit) |
| Daily ingest peak | ~1 M | ~5 M | ~10 M | ~25 M |
| Cost-ledger row size | trivial | OLTP | partitioned | partitioned + monthly roll-up |

**Sampling, but never blind.** Below V3 we keep 100 % of traces. From V3 onward we apply **stratified sampling** at the span-leaf level (not the trace-root level): 100 % of error traces and KYA-tier-≥-2 traces, 100 % of canary traces, plus 10 % uniform sample of successful prod traces. The cost ledger (§6) still sees 100 % cost attribution — we sample *payloads*, not *cost rows*.

**Govern-seat budget triggers (per §0.1):** the Govern Lead gets an alert (not just a chart) when any of these fire:

1. Weekly trace volume grows >2× over a rolling 4-week window without a corresponding agent-count or seat-count change. (Means an agent went into a loop or a new tool is being called per token.)
2. Per-tenant cost p95 grows >30 % week-over-week with flat trace count. (Means token usage per run is bloating — probably a context-window leak.)
3. Cold-tier (Supabase) growth rate would cross the 18-month retention budget within 30 days. (Means we need partition pruning, not more disk.)

These are the operational tripwires that turn "Observability = Govern" (§0.1) from a slogan into a paging policy.

### 0.6 Traditional data infra wasn't built for this — the new DB need

§0.4 (four trace properties) × §0.5 (16× volume growth) = a storage problem none of our existing databases solve alone. The LangChain slide names the two failure modes that catch teams out:

- **Slow queries & ingestion bottlenecks** — APM tools and generic OLTP databases choke on deep span trees + multi-MB payloads at 100 M+ events / week.
- **Rising infra cost & complexity** — the naive fix is "add another store." Five stores later, the cost ledger is unreadable and the govern seat is blind.

The lesson is *not* "buy LangSmith and stop thinking." The lesson is **traces have a different storage shape than business data**, and pretending otherwise burns six months. Three things have to be true at once:

1. **Append-mostly, never updated.** A trace span is written once; the only later mutation is sparse annotation (eval score, user feedback, redaction tombstone). This is OLAP / log-store shape, not OLTP.
2. **High-cardinality, deep-nested.** Billions of spans, each with a unique parent path. Row-store indexes either explode (Postgres) or lose the tree (flat log stores).
3. **Mixed query budget.** Dashboards run sub-second aggregates. Debug runs full-text + vector search over individual payloads. One engine cannot price both well.

**Why each "obvious" single-DB pick fails:**

| Candidate | What breaks first |
|---|---|
| Postgres alone (Supabase) | Row count past ~500 M; JSONB payload bloat; vacuum stalls under ingest pressure |
| MongoDB | Aggregation pipeline at 100 M events/week needs sharded fleet; no native cost-attribution joins |
| Elasticsearch / OpenSearch | Full-text is great; cost per indexed GB at this volume is prohibitive; cluster ops are full-time |
| BigQuery / Snowflake / Redshift | Slot pricing on per-trace recall queries is ruinous; minute-class latency hurts the debug surface |
| Datadog / Honeycomb (APM) | Per-event pricing × 160 M/week → a six-figure monthly bill; payload caps drop the interesting bits |
| A single "AI-native trace DB" startup | Vendor risk; sovereignty risk; no EU residency story |

**The three-tier DWS observability stack (committed):**

```
┌──────────────────────────────────────────────────────────────────┐
│                    DWS OBSERVABILITY STACK                       │
├────────────────────┬─────────────────────────┬───────────────────┤
│  HOT  (queryable)  │  PAYLOAD  (large blobs) │  COLD  (audit)    │
│                    │                         │                   │
│  SmithDB (LangSmith│  Cloudflare R2          │  Supabase Postgres│
│   managed for V1)  │  / Google Cloud Storage │  + Iceberg tables │
│  ClickHouse =      │                         │  on object store  │
│   sovereign fallbk │                         │                   │
│                    │                         │                   │
│  • spans + tree    │  • prompt / completion  │  • cost ledger    │
│  • metrics         │  • tool outputs         │  • audit history  │
│  • cost attrib.    │  • multi-modal blobs    │  • 18 mo retention│
│  • 7–30 d retention│  • content-addressed    │  • EU-resident    │
└────────────────────┴─────────────────────────┴───────────────────┘
        ▲                       ▲                     ▲
        │                       │                     │
        └───── one DWS trace schema (§0.3) feeds all three ─────┘
```

**Why this exact shape:**

- **SmithDB for hot (purpose-built).** LangSmith ships **SmithDB** — a database built specifically for the four trace properties from §0.4 (deep nesting, unbounded payloads, modalities, agent-shaped queries). This re-frames the hot tier: it's not "an OLAP DB we are repurposing for traces," it's a purpose-built trace store. V1 and V2 sit on SmithDB via LangSmith managed; **ClickHouse remains the self-host fallback** only if sovereignty mandates it and SmithDB is not yet available as a deployable artifact. The architecture story is the same either way — the marketing name changes, the operational shape (append-mostly, columnar, nested-native) does not.
- **R2 / GCS for payloads.** Content-addressed storage (hash → blob); spans hold only the hash + size. Cheap, durable, and the *only* tier that scales linearly with modality (text, image, audio). Already in our stack via `/gcr-skill`.
- **Supabase + Iceberg for cold.** Postgres holds the cost ledger and tenant-scoped audit indexes; Iceberg tables on the same object store hold the historical span archive in open columnar format. If we ever migrate the hot tier, the cold tier is the source of truth that survives the swap. **EU-resident, sovereign, governed.**

**Govern-seat budget rule: "three stores or fewer."** Any proposal that adds a fourth durable store to the observability stack needs the Agent Platform Govern Lead (§0.3) to sign off — and to retire one of the existing three at the same time. This is the rule that stops a five-system observability sprawl from being inherited unchallenged from the previous architecture.

**V1 → V3 migration path:**

| Stage | Hot | Payload | Cold | Trigger to advance |
|---|---|---|---|---|
| **V1 (today)** | SmithDB (LangSmith managed) | LangSmith blob store | Supabase Postgres only | Default — keep it simple |
| **V2 (~+6 mo)** | SmithDB (LangSmith managed) | R2 / GCS via payload-by-ref | Supabase + Iceberg snapshot | Payload bills > $1k / mo on LangSmith |
| **V3 (~+12 mo)** | SmithDB self-hosted if available, else ClickHouse on DGX Spark | R2 / GCS | Supabase + Iceberg | SmithDB hot bill > €4k / mo OR EU-resident hot mandated by customer (NIS2 / sectoral) |

No stage-skipping. Going straight to V3 to "save money" is the classic mistake — the engineering cost of operating ClickHouse beats the savings until weekly traces clear ~50 M.

**What this means for the BUILD / TEST cycle.** Nothing changes at the developer surface. Agents still emit OTel-shaped spans into the LangSmith SDK; the storage tier they land in is a deployment concern, not an SDK concern. The govern seat owns the migration; the agent code does not.

### 0.7 EU AI Act compliance — the traces ARE the evidence

The DWS agent platform falls inside scope of the **EU AI Act** (Regulation (EU) 2024/1689). Most DWS customer-facing agents — compliance, site safety, sovereignty assessment, viability scoring — sit in the *high-risk* tier (Annex III: critical infrastructure, employment, essential services) and therefore inherit the full Chapter III, Section 2 obligations. The agent platform also delivers general-purpose AI (GPAI) capability, so Chapter V also applies for upstream model usage.

This section maps the EU AI Act obligations to the artifacts the stack from §0.1 – §0.6 already produces. **The traces ARE the compliance evidence.** Done right, there is no "compliance documentation" project — the platform emits it as a side-effect.

**Per-article mapping (high-risk Chapter III, Section 2):**

| Article | Obligation | DWS artifact that satisfies it |
|---|---|---|
| **Art. 9** — Risk management system | Documented, iterative risk management across the lifecycle | The §0.3 BUILD → TEST → DEPLOY → MONITOR loop, with §6 eval gates as the iteration step |
| **Art. 10** — Data governance | Training / validation / test data quality, relevance, bias checks | `/kb/eval/<agent>/` golden datasets + `DWS_TRUTH_STANDARD.md` canonical-facts registry + per-tenant data residency from `tenant_id` |
| **Art. 11** — Technical documentation | Annex IV documentation kept current | `AGENTS.md` + `docs/AGENT_DEVELOPMENT_GUIDE.md` + this field note + the per-agent `SKILL.md` files |
| **Art. 12** — Record-keeping (automatic logging) | "Capable of automatic recording of events over the lifetime" — the heart of the regulation for agentic systems | **The traces.** §0.3 schema v0 + §0.6 three-tier stack + 18-month cold-tier retention = the literal record-keeping system Art. 12 names |
| **Art. 13** — Transparency to deployer | Instructions for use, system characteristics, accuracy / robustness metrics | Per-agent README + §6 LangSmith experiment scoreboard (correctness + cost + hallucination rate) |
| **Art. 14** — Human oversight | Pause, interrupt, override; understand outputs | §3 harness steering + CopilotKit / assistant-ui surfaces (§5) + `/kya` leash-snap (TC-4 chain termination) |
| **Art. 15** — Accuracy, robustness, cybersecurity | Documented accuracy levels; resilient against adversarial inputs | §6 metrics + prompt-injection redaction (`kya_tier ≥ 2` → no PII in spans, §0.3 guardrail #2) + `DWS_SECURITY_STANDARD.md` |
| **Art. 16–17** — Quality management system | Provider-side QMS | The `/ship` + `/review` + `/qa` skill chain + this branch's PR review gate |
| **Art. 26** — Deployer obligations (logs) | Deployer must keep automatic logs for ≥ 6 months | Cold tier 18-month retention exceeds the minimum; cost ledger gives per-tenant attribution for the deployer hand-off |
| **Art. 72** — Post-market monitoring | Continuous monitoring of performance after deployment | The §0.1 govern seat: cost ledger, online evals, user feedback, tripwires from §0.5 |
| **Art. 73** — Serious incident reporting | Notify market surveillance authority within deadlines | `/kya` TC-4 leash-snap event → incident tag in trace → 15-day reporting timer triggered by govern seat |

**Per-article mapping (GPAI, Chapter V):**

| Article | Obligation | DWS artifact |
|---|---|---|
| **Art. 53** — GPAI technical documentation | Maintain technical documentation for upstream models used | Per-model row in §0.2 ecosystem matrix + Anthropic / Fireworks / Baseten capability disclosures |
| **Art. 55** — Systemic-risk GPAI evaluation | Adversarial testing, model evaluation, incident logging for systemic-risk models | Inherited from upstream model providers (Anthropic, etc.); referenced in `docs/PHD_FIREHORSE_EN.md` for our own LWM work |

**Why the stack from §0.6 is the right shape for the Act:**

1. **Article 12 says "lifetime of the system."** Hot-tier sampling at any level above the span-leaf would violate this for high-risk agents. Our §0.5 rule — *never sample cost rows, never sample error or `kya_tier ≥ 2` traces* — is the operational expression of Art. 12.
2. **Article 26 wants ≥ 6 months retention; we keep 18.** Three-times margin protects us against deployer-side audits running long, customer migrations, and regulator follow-up requests. Cold tier is the **EU-resident, sovereign, Iceberg-on-object-store** archive — not a Datadog log bucket on US infra.
3. **Article 14 needs "effective oversight by natural persons."** The govern seat is a *named human seat* (Agent Platform Govern Lead, §0.3) — not a dashboard. The Act explicitly rejects checkbox governance; we explicitly assign a person.
4. **Article 73 needs incident-to-report timing.** A trace tagged with `kya_tier_snap` at emit time starts the 15-day clock automatically. No "we'll find the right log" — the trace is the report.

**Operational consequence — the EU AI Act readiness scorecard:**

The govern seat keeps a one-page scorecard per agent with a pass / fail per applicable article. Promotion from staging → prod (§7) requires green across all applicable rows. This scorecard becomes:

- The default attachment to **conformity assessment** filings (Art. 43) for high-risk agents.
- The input to the **EU AI Act compliance check** for any new agent (use the `/compliance-check` skill).
- A renewal artifact every time an agent version changes (compliance posture can regress with a prompt change).

**Open coordination items (per §9 Open Questions):**

- Conformity assessment: notified-body-based or self-assessment? Depends on whether the agent is on Annex III List A (mandatory third-party) or Annex III List B (self-assessment allowed). Per-agent classification needed.
- Article 50 transparency: end-users interacting with the agent need a disclosure that they are talking to an AI. CopilotKit / assistant-ui surfaces need a standardised banner.
- Per `DWS_SECURITY_STANDARD.md`, NIS2 obligations interlock with Art. 15 cybersecurity — these are one workstream, not two.

### 0.8 SmithDB internal architecture — separation of storage and compute

LangChain's architecture slide unpacks SmithDB into a **separation-of-storage-and-compute** design that mirrors what Snowflake / Iceberg / BigQuery pioneered for analytics — but adapted for the four trace properties (§0.4) and the 16× volume curve (§0.5).

**Verified technology stack (per the Interrupt 2026 announcement):** SmithDB is built in **Rust** on top of **Apache DataFusion** (columnar query engine) and **Vortex** (next-gen file format optimized for nested / variable-width data — the natural fit for the §0.4 properties). The services (Ingestion / Compaction / Query) are **stateless** — durability lives entirely in object storage, with Postgres holding the metastore. Reported performance: **~15× speed-up** on core LangSmith workloads vs. the prior stack; **P50 trace-tree load ≈ 92 ms; P50 single-run load ≈ 71 ms**.

```
              ┌──────────────────────┐
              │ SmithDB Cluster Mgr  │ ◄── ASSIGNMENTS
              └──────────┬───────────┘
                         │ assigns ranges
                         ▼
   ┌──────────┐    ┌─────────────────────────────────┐    ┌─────────────┐
   │LangSmith │───►│        SmithDB Services         │───►│  Postgres   │
   │ Services │    │  ┌───────────────────────────┐  │    │  Metastore  │
   │  (SDK,   │    │  │ Ingestion Service (write) │  │    │ (catalog,   │
   │  API,    │    │  └───────────────────────────┘  │    │  schemas,   │
   │  UI)     │    │  ┌───────────────────────────┐  │    │  partition  │
   │          │    │  │ Compaction Service (bg)   │  │    │  manifests) │
   │          │    │  └───────────────────────────┘  │    └─────────────┘
   │          │    │  ┌───────────────────────────┐  │
   │          │    │  │ Query Service (read)      │  │    ┌─────────────┐
   │          │    │  │   └► NVMe SSD Cache       │  │───►│   Object    │
   │          │    │  └───────────────────────────┘  │    │   Storage   │
   └──────────┘    └─────────────────────────────────┘    │ (durability)│
                                                          └─────────────┘
```

**The five components and what each owns:**

| Component | Role | DWS-side analogue |
|---|---|---|
| **Cluster Manager** | Assigns ingest / query / compaction ranges to service nodes; the brain | Equivalent to a Kafka controller or Iceberg catalog coordinator — runs separately from the data plane |
| **Ingestion Service** | Append-path: receives span batches, writes raw segments to object storage, registers them in Postgres | Maps cleanly to OTel collector → object store pattern |
| **Compaction Service** | Background: rewrites many small segments into fewer larger ones, re-sorts by useful keys (trace_id, tenant_id, time), prunes per retention policy | This is the cost-saver — without it, query latency drifts and storage bills bloat |
| **Query Service + NVMe SSD Cache** | Read-path: pulls segments from object storage, hot-caches the working set on local NVMe | Tail-latency lives here — hot working set must fit NVMe |
| **Postgres Metastore** | Catalog: what segments exist, what partitions they cover, what schema, what tenant | Same shape as Iceberg's `metadata.json` + the AWS Glue / Hive metastore |
| **Object Storage** | Durability: all segment files, content-addressed; the only stateful tier | R2 / GCS / S3-compatible |

**The four design properties this gives SmithDB (and why they matter for DWS):**

1. **Compute scales independently of storage.** Add Query nodes during a debug spike (incident response) without re-provisioning the durability tier. The §0.5 16× growth curve is survivable because compute scales linearly while storage stays cheap.
2. **Object storage = sovereignty knob.** The single stateful tier is a bucket. EU residency → EU-region bucket. Customer-mandated isolation → per-tenant bucket. The govern seat (§0.1) has *one* lever to pull for compliance, not five.
3. **Postgres metastore is small.** Catalog is megabytes-to-gigabytes, not terabytes. That is exactly why Supabase Postgres is the right cold-tier metastore in our V3 fallback — the volume problem from §0.5 lives in object storage, not in the metastore.
4. **Compaction is a first-class service.** Most teams under-budget compaction and end up with slow queries and bloated storage. Naming it a service line-item — with its own SLOs and cost line in the ledger (§6) — is the discipline that keeps the system healthy. **Add Compaction Service ops cost to the cost ledger as a separate row.**

**Why this validates §0.6's three-tier shape.** SmithDB is *internally* the same shape we already chose externally:

| Our §0.6 tier | SmithDB internal equivalent |
|---|---|
| Hot (queryable) | Query Service + NVMe SSD Cache |
| Payload (large blobs) | Object Storage |
| Cold (audit, EU) | Object Storage with retention policy + Postgres Metastore for indexes |

We are not running a parallel architecture — we are running the same architecture, either as **SmithDB managed** (V1–V2) or as **a SmithDB-shaped local stack** (V3) when sovereignty mandates it.

**V3 sovereign fallback — concrete bill of materials:**

If SmithDB is not available as a deployable artifact (or licensing makes it unattractive) at the time we need EU-resident hot, the V3 fallback assembles a SmithDB-shaped stack on DGX Spark:

| SmithDB component | DWS V3 sovereign substitute |
|---|---|
| Cluster Manager | A small Go / Rust controller, or use Kubernetes operators + leader election (etcd) |
| Ingestion Service | OpenTelemetry Collector + custom Arrow-format writer → object storage |
| Compaction Service | Iceberg-rewrite jobs scheduled via `/cron`; daily compaction + weekly re-sort |
| Query Service + NVMe Cache | DuckDB or ClickHouse local node, NVMe-backed, reading Iceberg from object storage |
| Postgres Metastore | Supabase Postgres (already in stack) — catalog tables + Iceberg manifest pointers |
| Object Storage | Scaleway Object Storage (EU-resident) or GCS Europe multi-region |

This is a 4–6 engineer-month build, not a green-field re-think. The architecture is the same; the binaries are different. The govern seat approves the V3 transition only when SmithDB-managed bills + sovereignty risk exceed this build cost.

**Implication for §0.4 payload-by-reference.** SmithDB already content-addresses segments to object storage. Our §0.4 payload-by-reference scheme should **share the same bucket family** (same lifecycle policy, same encryption, same audit log) rather than running a parallel "payload" bucket. One bucket family, two write-paths (span segments + raw payloads), one retention policy.

**Verified modern-stack rationale:**

- **Rust** — memory-safe, no GC pauses on the ingest hot path; aligns with NIS2 / Art. 15 cybersecurity posture.
- **Apache DataFusion** — Arrow-native columnar query engine; gives SQL + vectorised execution on Arrow buffers. Means SmithDB is *queryable from any DataFusion-aware client* if we ever need to read its data plane directly. Lower lock-in than it looks.
- **Vortex** — next-generation file format optimised for nested + variable-width data, with cascading lightweight encodings. This is the part that handles §0.4's deeply-nested + unbounded-payloads properties at the file-layout level — Parquet would struggle here.

**Sovereignty consequence.** The two non-LangChain building blocks (DataFusion, Vortex) are open-source projects. A SmithDB-shaped sovereign clone (V3 fallback, §0.6) can use **the same data plane** — write Vortex files into our own object store and query them with our own DataFusion services. **The data file format is portable; the cluster manager is the differentiator.** Plan accordingly.

### 0.9 Other Interrupt 2026 announcements — LLM Gateway, Messages View, Context Hub versioning, Managed Deep Agents

The same Interrupt 2026 release that announced SmithDB shipped four more pieces. Each one slots into the model we've been building and either replaces something we would have built ourselves or fills a gap we hadn't named yet.

#### 0.9.1 LLM Gateway — directly delivers the govern seat

This is the highest-priority adoption decision out of Interrupt 2026 for DWS. LangChain's **LLM Gateway** sits between the agent and the model provider and does two things we had assigned to the govern seat ourselves:

1. **Spend limit enforcement** — per-tenant, per-agent caps; requests blocked before they leave the environment.
2. **PII redaction before egress** — payload scrubbed *before* the request reaches Anthropic / OpenAI / Fireworks.

Both of these were items we had planned to build as DWS-side middleware. **LLM Gateway is the build-vs-buy decision flipped to "buy" for V1.**

| Function we had planned | LLM Gateway provides it? | DWS decision |
|---|---|---|
| Per-tenant spend cap (govern-seat tripwire from §0.5) | Yes | Adopt; route all upstream LLM calls through Gateway |
| PII redaction at `kya_tier ≥ 2` (§0.3 guardrail #2) | Yes | Adopt; configure redaction rules from `DWS_SECURITY_STANDARD.md` |
| Cost ledger row per call (§6) | Partial — Gateway emits cost; we still persist | Gateway as source, our cold tier as ledger |
| EU residency routing per `tenant_id` | Verify — likely supported via gateway policy | Spike before V2 commit |
| Model-version pinning per `agent_version` | Verify — depends on Gateway feature surface | Spike alongside above |

**EU AI Act ramifications.** LLM Gateway *materially helps* on three articles from §0.7:

- **Art. 14 (human oversight)** — spend caps are an automatic oversight control, not a soft policy.
- **Art. 15 (cybersecurity)** — PII redaction before egress reduces breach surface for upstream model providers.
- **Art. 26 (deployer logging)** — gateway-emitted call records become an additional log source feeding the cold-tier audit trail.

**Risk to flag.** A single chokepoint for all upstream LLM traffic is high-blast-radius. The govern seat must (a) ensure Gateway has its own SLO and on-call rotation, (b) configure a graceful-degrade path that routes around Gateway in a documented incident mode, and (c) include Gateway in the "three stores or fewer" rule's data-plane equivalent — **don't end up with three different gateways for three different cost models**.

#### 0.9.2 Messages View — multi-turn traces become human-readable

LangChain's **Messages View** renders multi-turn agent runs as a readable conversation rather than as a raw span tree. Quoted: *"makes multi-turn traces readable at a glance"*.

| Our model | Messages View impact |
|---|---|
| §3 harness steering (human intervention) | The UI surface humans actually use during steering, on top of CopilotKit / assistant-ui |
| §6 evals / debug surface | Reviewer can read a failure in seconds instead of decoding a 40-span tree |
| §0.4 deeply-nested-traces property | The view layer that pays the cost §0.4 named: depth-tolerant rendering |

**DWS adoption.** Embed Messages View into the **operator console** (assistant-ui surface from §5) as the default debug pane. Customer-facing dashboards (CopilotKit) keep their own simpler view; Messages View is for the govern seat and the agent owners.

#### 0.9.3 Context Hub — versions the instructions and policies agents follow

LangChain's **Context Hub** versions agent instructions and policies the way a code repository versions source. Each prompt, each tool-use policy, each redaction rule has a version, a diff, and a rollback.

This refines §0.2's Context Hub row from the ecosystem matrix: it's not just a memory store, it's a **policy registry**.

| §0.2 Context Hub row (before) | After this announcement |
|---|---|
| LangSmith Context Hub + Supabase Postgres | LangSmith Context Hub (versioned policy registry) + Supabase Postgres + `/kb` (canonical facts) |
| Run-scoped memory | Run-scoped memory + version-controlled instruction registry |

**EU AI Act ramifications.** Versioned policies map directly onto **Art. 11 (technical documentation)** and **Art. 16 (quality management)** — the conformity-assessment auditor can ask "what instructions was this agent running on 2026-04-12?" and get a deterministic answer. The govern seat owns the Hub's promotion gates.

**Three-store rule check (§0.6).** Adding Context Hub doesn't break the "three stores or fewer" rule because it shares the §0.6 cold-tier (Postgres metastore + object-storage segments). Confirm during V2 adoption.

#### 0.9.4 Managed Deep Agents — replaces "DA 0.6 local-first" framing

§4's framing of **Deep Agents 0.6** as a *local-first execution profile* now has an opposite-side counterpart: **Managed Deep Agents** is the same agent kit running on LangSmith's managed runtime. Quoted from the announcement: *"a path from local prototype to production without stitching together the runtime layer themselves."*

**Updated §4 stance:** DA is no longer "local-only fast path." It is:

- **Managed Deep Agents** for the standard cloud path (lower trust tiers, customer-facing agents, fast prototyping).
- **Deep Agents 0.6 self-hosted** for the EU-sovereign / DGX Spark path (high trust tiers, regulated customers).

Same SDK, two runtimes. The agent code is portable; the deployment target is a govern-seat decision.

#### 0.9.5 Sandboxes GA — V1 commitment is now safe

§2's "LangSmith Sandboxes GA, 2026-Q2" is the **already-announced** sandbox tier from the same release. No change to §2 — just upgrading "GA available" from rumor to confirmed.

#### Summary — what changed in our V1 plan

| Plan item | Before Interrupt 2026 | After |
|---|---|---|
| Per-tenant spend cap | Build ourselves | **Adopt LLM Gateway** |
| PII redaction before egress | Build ourselves | **Adopt LLM Gateway** |
| Multi-turn debug UI | Build on assistant-ui | **Adopt Messages View** inside assistant-ui |
| Instruction versioning | Roll into `/kb` | **Adopt Context Hub** for policies; `/kb` keeps canonical facts |
| Local-only DA fast path | DA 0.6 self-hosted | **Managed Deep Agents** + DA 0.6 self-hosted (two profiles) |
| Sandbox commitment | Rumored GA | Confirmed GA — no plan change |

**Net effect.** We retire roughly four "we will build this ourselves" items from the V1 sprint plan and replace them with adoption + configuration tasks. The govern-seat workload shifts from *implementation* to *policy authoring + audit*. That is the correct shape for a 25-person company building on a managed-platform foundation.

### 0.10 LangSmith Engine BETA — Engine investigates traces and acts

**Engine is the automation of the govern seat.** It is the most consequential Interrupt 2026 announcement for DWS after SmithDB itself. One-line summary: *Engine investigates traces and acts.*

**What it does (verified):**

LangSmith Engine watches the production trace stream and, when it sees a failure pattern worth fixing, **drafts a pull request against the live codebase** and proposes a custom evaluator for that pattern. It runs continuously, not on-demand — closing the BUILD → TEST → DEPLOY → MONITOR loop without a human triggering each round.

**The four ADLC actions Engine takes (per the slide):**

```
        ┌─────────────────────────────────────┐
        │   LangSmith Engine accelerates ADLC │
        └─────────────────────────────────────┘

   Build  ──►  CODE CHANGES  (Engine opens a PR with the fix)
   Test   ──►  ADD TO DATASETS  (Engine adds the failure case as a golden example)
   Deploy ──►  CONTEXT CHANGES  (Engine updates instructions/policies in Context Hub)
   Monitor──►  ADD TO ONLINE EVALS  (Engine registers a new detector for this pattern)
```

**Signals Engine monitors:**

1. Explicit errors (tool-call failures, exceptions)
2. Online-evaluator failures (correctness regressions)
3. Trace anomalies (latency / depth / cost outliers)
4. Negative user feedback (thumbs-down, NPS, etc.)
5. Unusual behaviours (loops, repetition, off-policy actions)

**How the act-phase works:** Engine reads the live codebase, locates the suspected culprit, and emits a PR. *"If you connect it to Prompt or Context Hub"* (per the slide caption), it can also propose policy changes instead of code — the right surface depends on where the fix belongs.

**Customer evidence shown at Interrupt:**

> *"Engine saves our team hours of digging by not only identifying emerging failure modes, but also **proactively suggesting evals and code changes** to resolve them quickly."*
> — Austin Berke, Founding Engineer, **Harmonic**

> *"It has **dramatically reduced our time-to-detection and time-to-triage**, meaning less time spent hunting through traces and a much shorter path from broken behavior to a deployed fix."*
> — Nancy Jin, AI Engineer, **Campfire**

**Why this matters for DWS:**

Engine *delivers* what §0.1 ("Observability = Cost Management = Govern") asks the Govern Seat to do. Previously we framed the govern seat as a human role (Agent Platform Govern Lead, §0.3) with tooling. After Engine, the seat becomes **a human + an autonomous co-pilot agent**, where the human's job shifts from *finding* failures to *approving Engine's proposed fixes*.

| Govern-seat workflow | Pre-Engine | With Engine |
|---|---|---|
| Detect failure pattern | Human reads dashboards | Engine clusters traces → named issue |
| Diagnose root cause | Human bisects in IDE | Engine reads codebase + drafts hypothesis |
| Propose fix | Human writes PR | Engine opens PR + linked evaluator |
| Verify fix | Human runs eval | Engine adds case to dataset; eval auto-runs |
| Deploy | Human approves merge + release | Human reviews + approves; release automated |
| Monitor for recurrence | Human adds custom dashboard | Engine adds the online eval automatically |

**DWS adoption decision: adopt for V2, with explicit safety rails.**

Engine is too valuable to skip — the time-to-triage improvement is the difference between staffing a 24/7 govern rotation and not. But it is also an autonomous agent that **writes against our live codebase**, which puts it inside the same governance frame it is helping us run.

**Four mandatory safety rails (Govern Lead enforces):**

1. **Engine PRs require human merge approval.** No auto-merge, ever, regardless of CI signal. The Govern Lead (or a delegated agent owner) approves the merge. This is the operational expression of EU AI Act **Art. 14 (human oversight)** for the platform's own self-modification.
2. **Engine runs at KYA tier ≤ 2.** It does not get credentials for KYA-tier-3 systems (production data, customer DBs, infrastructure changes). It can only propose; only humans push fixes into those tiers.
3. **Engine PRs are tagged in the cost ledger.** Each Engine-authored PR carries a `source: langsmith-engine` label so the §6 cost ledger can attribute the engineer-hours saved against the Engine subscription cost. This is the cost-management seat measuring its own ROI.
4. **Engine cannot edit `DWS_TRUTH_STANDARD.md` or `/kb/eval/` golden datasets.** Canonical facts and the evaluation ground truth are out of bounds for autonomous edit — they are the reference frame Engine itself is evaluated against. The Govern Lead pre-stamps these paths as Engine-read-only via a `CODEOWNERS` block.

**Multi-model neutrality risk (flagged in coverage):**

VentureBeat's analysis notes that *"multi-model enterprises still need a neutral layer"* — Engine optimises for the LangSmith-native stack. DWS uses Anthropic Claude (claude-opus-4-7) as primary, with Fireworks for OSS models and GLM-5 on DGX Spark for sovereign workloads. Two practical mitigations:

- **Spike Engine against a non-Anthropic agent first** during V2 evaluation — confirms cross-model trace-pattern recognition works before committing.
- **Maintain a thin DWS-side "engine-equivalent" path** for sovereign agents that cannot send traces to LangSmith managed — even if it's just a Friday-afternoon cluster-and-summarise job, it keeps us un-locked.

**EU AI Act readiness consequence (refines §0.7):**

Engine accelerates compliance by **collapsing time-to-fix** on Article 12 record-keeping signals into hours. But it adds a new compliance surface:

- **Art. 14 (human oversight)** — the human approval gate on Engine PRs is the oversight; it MUST be documented in the agent's Annex IV technical file.
- **Art. 15 (cybersecurity)** — an autonomous agent with write-PR access is an attack surface. Engine credentials are short-lived, scoped to the agent platform repo, and rotated per `DWS_SECURITY_STANDARD.md`.
- **Art. 73 (serious incident reporting)** — if Engine itself proposes a *wrong* fix that gets merged and triggers a serious incident, the 15-day reporting clock starts. Engine's contribution must be diff-traceable in the audit log.

**Trace-schema implication (refines §0.3):**

Engine reads traces; therefore the §0.3 schema needs one more annotation field so Engine outputs are first-class:

- `engine_action[]` — `{action_type, issue_id, pr_url, eval_id, confidence}` per Engine intervention. Sparse on most rows; populated when Engine acts on the trace.

**Updated §7 ADLC step list (Engine-aware):**

The local → prod cycle from §7 picks up an automated feedback edge:

```
Local → CI → Staging → Canary → Prod
                                  │
                                  ▼
                              MONITOR ── Engine investigates
                                  │              │
                                  │              ▼
                                  │       Engine drafts PR ──┐
                                  ▼                          │
                              Govern Lead ◄─────────────────┘
                              approves ─► back to CI as a new run
```

Engine never closes the loop alone — it always re-enters at CI as a fresh PR. The promotion gates from §6 still apply: no green eval, no merge, no matter who (or what) wrote the patch.

**Summary one-liner:** *Engine is the agent we deploy to govern the agents we deploy.* Treat it accordingly — same KYA tiering, same cost attribution, same human-oversight gates as any other production agent.

### 0.11 LangSmith Platform — the canonical three-layer view

The closing slide of the Interrupt 2026 keynote consolidates every product into a single three-layer architecture. This is the diagram to put in a slide deck when explaining the agent platform to a non-engineer:

```
┌─────────────────────────────────────────────────────────────────┐
│                            AGENT                                │
│                     ┌──────────────────┐                        │
│                     │  LangSmith Engine│   ← §0.10               │
│                     └──────────────────┘                        │
├─────────────────────────────────────────────────────────────────┤
│                     APPLICATIONS + INFRA                        │
│  ┌─────────────┐ ┌───────────┐ ┌────────────┐ ┌────┐ ┌────────┐ │
│  │Observability│ │Evaluations│ │Context Hub │ │OSS │ │ Fleet  │ │
│  └─────────────┘ └───────────┘ └────────────┘ └────┘ └────────┘ │
│  ┌─────────────┐ ┌──────────┐ ┌─────────────────┐ ┌──────────┐  │
│  │ Context Hub │ │ Gateway  │ │ Managed Deep    │ │Sandboxes │  │
│  │ (runtime)   │ │          │ │     Agents      │ │          │  │
│  └─────────────┘ └──────────┘ └─────────────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                            TRACES                               │
│                       ┌─────────────┐                           │
│                       │   SmithDB   │   ← §0.8                  │
│                       └─────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

**Reading the diagram in plain English:**

> *Traces are the foundation (SmithDB). Applications and infrastructure sit on top of traces. A single agent — LangSmith Engine — sits on top of everything and operates the platform itself. Every layer reads from the trace layer below it; every layer can be steered by the agent layer above.*

**Component → DWS section coverage map:**

| Layer | Component | DWS section(s) |
|---|---|---|
| **Agent** | LangSmith Engine | §0.10 |
| **Applications + Infra** | Observability | §0.1, §6, §0.4–§0.6, §0.8 |
| | Evaluations | §6, §0.7 (EU AI Act gates) |
| | Context Hub (data) | §0.2, §0.9.3 (versioned policies) |
| | OSS | §0.2 (langchain / langgraph / deepagents) |
| | Fleet | **NEW — §0.11.1 below** |
| | Context Hub (runtime) | §0.9.3 (same component, runtime role) |
| | Gateway | §0.9.1 (LLM Gateway) |
| | Managed Deep Agents | §0.9.4, §4 |
| | Sandboxes | §0.2, §2 (LangSmith Sandboxes GA) |
| **Traces** | SmithDB | §0.6, §0.8 |

Every box on the slide has a home in this note — **except Fleet**, which is the one capability not yet covered.

#### 0.11.1 Fleet — multi-agent coordination at scale

"Fleet" is the LangSmith capability for **managing many agents as a single coordinated population** — discovery, routing, capacity planning, per-agent cost, per-fleet SLOs. It is the layer that becomes necessary the moment a tenant runs more than a handful of agents that share customers, data, or budget.

**Why it appears on the platform slide:** SmithDB + Engine + 16× trace growth (§0.5) are the *technical* story. **Fleet** is what makes them a *product* story for enterprise buyers who think in portfolios: "I have 40 agents in production; show me which two are the most expensive, which three are regressing, and which one is responsible for 60 % of my legal-review queue."

**DWS adoption decision: defer to V3.** Today we run a handful of agents per tenant. Fleet's value crosses break-even when:

- A tenant runs **≥ 10 agents** in parallel, OR
- Multiple tenants share a single agent fleet and we need **per-tenant cost allocation at the fleet level** (not just per-agent), OR
- A single business process is composed by **chained calls across ≥ 3 agents** and we need fleet-level orchestration / retry / SLO.

Below that line, the per-agent observability from §0.1 + the cost ledger from §6 are enough. Fleet adds value when the unit of management becomes the population, not the agent.

**Fleet ↔ Captain hat / Themis case coordinator alignment.** DWS already has internal patterns for multi-agent coordination — the Captain framework (per `DWS_TRUTH_STANDARD.md`), the Themis Case Coordinator (per `/case-run`), and the agent-XX numbering scheme (per `AGENTS.md`). Fleet, if we adopt it, **must compose with these patterns, not replace them.** The govern seat owns the integration design before any Fleet pilot starts.

**Updated §0.2 ecosystem matrix.** Add a new row for V3 planning:

| Row | LangChain native | DWS primary (V3) | Fallback |
|---|---|---|---|
| **Fleet** | LangSmith Fleet | LangSmith Fleet + Captain/Themis overlay | Self-host fleet manager on DGX Spark + Supabase index |

#### 0.11.2 The platform's own architecture vs. ours — single most important takeaway

LangSmith's three-layer shape is **the same architecture we should ship to DWS customers**:

- **Bottom — Traces (single source of truth).** Ours is SmithDB hot + Supabase + Iceberg cold (§0.6, §0.8).
- **Middle — Applications + Infra (the productised capabilities).** Ours is the DWS skills + agents catalogue (`AGENTS.md`, `/discover-agents`, `/agent-run`, `/workflow`, etc.).
- **Top — One agent that operates the platform.** Ours is the **Agent Platform Govern Lead** (human) **+ LangSmith Engine** (autonomous co-pilot, §0.10) — same shape, with the human-in-the-loop gate that EU AI Act Art. 14 requires.

This is the single most important architectural takeaway from Interrupt 2026: **operate the agent platform as an agent platform itself.** The platform's tools are the same tools customers use; the platform's traces feed the same SmithDB; the platform's evolution is itself a govern-tracked, traceable, auditable agent run.

That's the shape we ship.

---

## 1. Why this note

The brief: pin down how DWS IQ agents are *executed*, *steered*, *tested*, and *deployed* — end to end — so the next sprint can pick a stack instead of debating one. Branch `claude/agent-deployment-execution-U8B2C` is the working surface.

Five layers to nail:

1. **Execution environment** — where the agent's bash/python/file ops actually run.
2. **Harness** — the managed loop around the model (context, delegation, steering).
3. **UI** — how a human (or another agent) watches and intervenes in the run.
4. **Evaluation** — datasets, metrics, experiments that gate promotion.
5. **Deployment cycle** — local → staging → prod, with rollback.

Aspire is the orchestrator that ties (1)–(5) together as a single `dotnet aspire` run-graph.

---

## 2. Execution Environment — VFS in a sandbox

**Model.** Every agent run gets a **virtual file system** mounted inside a **sandbox VM**. The agent talks to it through CLIs (`bash`, `python`, `gh`, `dws`, project-local scripts). The host never sees the agent's filesystem directly.

**Layout inside the sandbox:**

```
/work          # the repo checkout for this run (ephemeral)
/kb            # mounted knowledge base, read-mostly (compiled wiki)
/secrets       # broker-injected, scoped to the run, never persisted
/tmp           # scratch
```

**Two candidate sandboxes:**

| Sandbox | Pros | Cons |
|---|---|---|
| **LangSmith Sandboxes (GA, 2026-Q2)** | Native LangGraph integration; per-step replay; turn-key for eval | Vendor-coupled; egress shape is LangSmith's |
| **Cloudflare Sandbox (pilot — see CLOUDFLARE_SANDBOX_PILOT.md)** | Edge-local, EU-friendlier; we already piloted it | More plumbing to integrate with LangSmith eval |

**Decision draft:** use **LangSmith Sandboxes** for *evaluation runs* (cheap to replay, comparable across experiments), and **Cloudflare Sandbox** for *production agent execution* where egress and EU residency matter. They are not mutually exclusive — Aspire can route by env.

**`kb` mount is non-negotiable.** Every agent gets `/kb` read-mounted into the VFS. Maintained by the `/kb` skill (compile + ingest + research). This is where canonical DWS facts live — `DWS_TRUTH_STANDARD.md` and friends — so agents don't hallucinate prices, industry counts, or KYA tiers.

---

## 3. Harness — the managed loop

The harness owns the loop; the model only produces the next step. OpenAI's harness-engineering writeup (see `docs/OPENAI_HARNESS_ENGINEERING_ANALYSIS.md`) is the reference shape. Four responsibilities:

1. **Context management.** Compact on threshold, keep system prompt + recent turns + tool result tail. Persist long-term state in `/kb` and in LangGraph checkpoints, *not* in the rolling window.
2. **Delegation.** A planner spawns sub-agents (research, code, review) and joins their results. Each sub-agent gets its own VFS slice and its own budget.
3. **Steering.** Human-in-the-loop interventions: pause, redirect, approve a destructive tool call, choose between alternatives. CopilotKit / assistant-ui carry the messages.
4. **Termination.** Budget exhausted, goal reached, or KYA "leash snap" (see `/kya`). Always end deterministically — no zombie runs.

The loop is **managed** — the agent does not poll, sleep, or self-schedule. The harness wakes it on events (webhook, queue, human input, timer).

---

## 4. Deep Agents 0.6 — open-source, local-first

DA 0.6 is the candidate for the **local-first execution profile**. Three properties that matter:

- **Open-source model backend.** GLM-5 (and friends) hosted on DGX Spark / Scaleway H100. Keeps sensitive runs out of US clouds.
- **Built-in code interpreter** — no docker, no extra sandbox shim. The interpreter itself is the execution surface for short-lived python.
- **Exa for deep search.** Replaces ad-hoc Google scraping; pairs with our existing `exa-openclaw-gcp-vault` integration (see field note 2026-05-24).

**Trade-off to flag:** DA 0.6's "no docker no sandbox" stance is fine for trusted, local code-gen, but it is **not** a substitute for the LangSmith / Cloudflare sandbox when an agent runs untrusted plans or touches credentials. Treat DA 0.6's interpreter as a *fast path*; route anything KYA-tier-≥-2 through the real sandbox.

---

## 5. UI — delightful, streaming, agent-aware

Goal: build UIs that make agent runs feel like collaboration, not log-tailing.

Two harness UI libraries in scope:

- **CopilotKit** — React-first, opinionated about state sync between UI and agent runtime. Good for embedding inside the dashboard surfaces in `dws6.com/dashboard/` and `dws10.com/`.
- **assistant-ui** — closer to the metal, gives us full control over the message + tool-call rendering. Better for the Control Room and Situation Room surfaces (`/remote-control` skill).

Both **stream** by default. Streaming is the UX feature that makes a 90-second agent run feel like 9 seconds.

**Decision draft:** CopilotKit for product dashboards (customer-facing), assistant-ui for operator consoles (Control Room / Situation Room). One harness API behind both, so the agent doesn't care which UI it's talking to.

---

## 6. Observability & Evals — the GOVERN seat

This is the pillar from §0 that earns the explicit `= Govern` label. Promotion from `local` → `staging` → `prod` is gated *both* on correctness and on cost — same trace, two checks.

- **Datasets.** Per-agent golden sets in `/kb/eval/<agent>/`. Curated by the agent's owner; versioned in git so a regression has a blame trail.
- **Metrics — correctness side.** Correctness vs. ground truth, hallucination rate against `DWS_TRUTH_STANDARD.md`, tool-call success rate.
- **Metrics — govern side.** Cost p50 / p95 (tokens × price + tool calls + sandbox minutes + human-review time), latency p50 / p95, KYA trust-score delta, per-tenant cost attribution.
- **Experiments.** Each candidate prompt / model / harness change is an experiment. Compare against the current prod baseline. **No improvement on correctness OR a regression on cost p95 → no merge.**
- **Cost ledger.** Observability emits a per-run cost record into a tenant-scoped ledger. The ledger — not the dashboard — is the governance artifact.

LangSmith's recent **deployment study** is worth re-reading before we finalize the gate thresholds — it shows where teams over-fit to eval sets and miss prod regressions, and where cost drifts silently after a model swap. Add a held-out **production-shadow dataset** to catch correctness drift and a **rolling 7-day cost baseline** to catch budget drift.

---

## 7. Agent deployment cycle — local → prod

The full cycle (Aspire-orchestrated):

1. **Local** — developer iterates with `dotnet aspire run`, harness + sandbox + UI all up on one machine. DA 0.6 code interpreter is fine here.
2. **CI** — PR opens. LangSmith experiment runs on the agent's golden dataset. Cost, latency, correctness must beat baseline or match within tolerance.
3. **Staging** — merged-to-main builds deploy to a staging Aspire app. LangSmith Sandbox is the execution surface. Production-shadow dataset replays here.
4. **Canary** — 1–5% of prod traffic for the changed agent. Live metrics streamed to LangSmith; KYA monitors for trust-score drops.
5. **Prod** — full rollout. Cloudflare Sandbox is the execution surface. `/kb` is read-only mounted.
6. **Rollback** — Aspire keeps the previous version warm for N minutes; one command flips back.

LangSmith Sandboxes being **GA** as of 2026-Q2 is what makes steps 3–4 cleanly reproducible — same VFS shape as local, same step replay.

---

## 8. Aspire — the orchestrator

`.NET Aspire` is the chosen orchestration substrate (it already shows up in `docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md` and the 2026-04-08 field note on Aspire observability). For agent deployment it gives us:

- One `Program.cs` that wires harness + sandbox + UI + LangSmith + secrets broker as named resources.
- OpenTelemetry traces for every tool call out of the box (matches `docs/field-notes/2026-05-15-opentelemetry-genai-observability-control-room.md`).
- The same run-graph in `local`, `staging`, `prod` — only the resource implementations swap (DA 0.6 ↔ LangSmith Sandbox ↔ Cloudflare Sandbox).

"Think solving with Aspire" reframes the whole problem: the deployment unit is not "an agent" or "a model" — it's the **Aspire app graph** that names every piece and binds them together. That is the unit we ship, version, and roll back.

---

## 9. Open questions to close next sprint

- Which secret broker fronts `/secrets` in the sandbox VFS? (GCP Secret Manager via `gcr-skill`, or extend the existing Exa vault pattern?)
- KYA tier mapping per execution surface — what is the minimum tier for DA 0.6 local interpreter vs. LangSmith vs. Cloudflare?
- LangSmith dataset hosting — do datasets live in LangSmith only, or do we mirror them into `/kb/eval/` for sovereignty?
- CopilotKit vs. assistant-ui — pick one for the V1 customer surface, defer the other to V2, instead of running both day-one.
- Production-shadow sampling rate — 1% feels low for low-traffic agents; need a per-agent floor.

---

## 10. Next actions

1. Stand up a minimal Aspire app graph that wires DA 0.6 (local) + LangSmith Sandbox (eval) + a single agent.
2. Move one existing agent (candidate: `compliance` or `material-oracle`) to the new graph as the reference implementation.
3. Land a golden dataset for that agent under `/kb/eval/` and wire the CI gate.
4. Spike CopilotKit on the `dws10.com/dashboard` surface against the reference agent.
5. Re-read the LangSmith deployment study and post the threshold proposal back to this note as v1.1.
