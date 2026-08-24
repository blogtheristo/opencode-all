# OpenClaw on DGX Spark + Karpathy Autoresearch — DWS 6 & 7 Feature Plan

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openclaw-dws-features-wTwot | Date: 14.03.2026 | Changes: Initial creation — comparative analysis of OpenClaw (NVIDIA) and Karpathy Autoresearch for DWS 6 and DWS 7 feature planning

Session Links & References:
  - Claude Code: https://github.com/blogtheristo/dws6/tree/claude/openclaw-dws-features-wTwot
  - OpenClaw: https://build.nvidia.com/spark/openclaw
  - Karpathy autoresearch: https://github.com/karpathy/autoresearch
  - DWS autoresearch fork: https://github.com/blogtheristo/autoresearch
  - DWS autoresearch methodology: docs/field-notes/2026-03-13-dws-autoresearch-methodology.md

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Strategy / Feature Plan

***

## 1. Executive Summary

Two converging forces define AI agent infrastructure in Q1 2026:

1. **NVIDIA OpenClaw** — always-on, local-first AI agent framework running on DGX Spark (128GB, GB10 Superchip). The fastest-growing open source project in history. Jensen Huang calls it "the most important software release probably ever."
2. **Karpathy Autoresearch** — autonomous experiment loop (630 lines, single GPU, 100 experiments/night). 30k+ stars in 7 days. Proven 11% efficiency gain on already-tuned nanochat.

DWS already has both in motion:
- OpenClaw evaluated since Feb 2026 (security assessment, Moltworker eval)
- Autoresearch methodology codified (v1.0, March 13) with KYA v1.4 governance integration

This document plans how to combine them for DWS 6 shipping features and DWS 7 architecture.

## 2. Head-to-Head Comparison

| Dimension | OpenClaw (NVIDIA) | Karpathy Autoresearch |
|-----------|-------------------|----------------------|
| **What it is** | Always-on local AI agent (assistant) | Autonomous experiment runner (optimizer) |
| **Core pattern** | Persistent agent with memory, skills, tools | Modify → train → evaluate → keep/discard loop |
| **Architecture** | Multi-model, skill-based, MCP-compatible | Three-file system (prepare.py, train.py, program.md) |
| **Hardware** | DGX Spark (128GB), RTX GPUs, cloud | Single GPU (any NVIDIA) |
| **Model size** | Up to 120B parameters locally | Small proxy models (depth=12 → depth=24) |
| **Data locality** | Fully local, no cloud API costs | Fully local |
| **Interaction model** | Proactive (runs continuously, initiates) | Unattended batch (runs overnight) |
| **Extensibility** | Community skills, MCP tools | Fork and adapt (pi-autoresearch, AutoKernel) |
| **Security risk** | HIGH — MCP Hub is attack surface (DWS assessment) | LOW — single file, no network, no tools |
| **Governance** | None built-in | None built-in |
| **DWS integration** | Evaluated (Feb 2026), security-assessed | Methodology codified (Mar 2026), KYA-governed |
| **Stars (Mar 2026)** | 180k+ | 30k+ (7 days) |
| **Maturity** | Production-ready (NVIDIA-backed) | Research-grade (one-person project) |

### The Insight: They Are Complementary, Not Competing

OpenClaw is the **always-on brain** — the agent that runs continuously, remembers context, uses tools, and manages workflows. Autoresearch is the **overnight optimizer** — the loop that systematically improves any measurable metric while you sleep.

**Combined:** OpenClaw manages the agent swarm during the day. Autoresearch optimizes agent parameters overnight. KYA Standard governs both.

```
┌─────────────────────────────────────────────────────┐
│                   DWS AGENT STACK                   │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │  GOVERNANCE: KYA v1.4 + Firehorse Audit     │   │
│   │  11% Efficiency Law · 72h Human Gate         │   │
│   └─────────────────────────────────────────────┘   │
│                        ▲                            │
│           ┌────────────┼────────────┐               │
│           │            │            │               │
│   ┌───────┴──────┐  ┌─┴──────────┐ │               │
│   │  DAYTIME     │  │  OVERNIGHT  │ │               │
│   │  OpenClaw    │  │ Autoresearch│ │               │
│   │              │  │             │ │               │
│   │  • Always-on │  │ • Batch     │ │               │
│   │  • Tools/MCP │  │ • 100 exp/  │ │               │
│   │  • Memory    │  │   night     │ │               │
│   │  • Skills    │  │ • Single    │ │               │
│   │  • Proactive │  │   metric    │ │               │
│   └──────────────┘  └────────────┘  │               │
│           │                │        │               │
│   ┌───────┴────────────────┴────────┴──────────┐    │
│   │  HARDWARE: Acer Veriton GN100 (DGX Spark)  │    │
│   │  GB10 · 128GB · 1 PFLOP · 3TB NVMe         │    │
│   └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## 3. DWS 6 Features (Ship Now — Q1-Q2 2026)

### 3.1 Autoresearch Agent (Priority: HIGH)

**Status:** Methodology codified, blogtheristo/autoresearch fork exists, KYA integration designed.

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **KYA Parameter Tuner** | Autoresearch loop for ATS weights, trust recovery, session TTL | `src/autoresearch/kya-tuner.ts` — adapt train.py pattern to KYA metrics |
| **Synthetic KYA Generator** | Proxy metric generator for autoresearch experiments | `src/autoresearch/synthetic-kya.ts` — generates fake agent sessions for tuning |
| **Experiment Dashboard** | Firehorse-logged experiment history with keep/discard verdicts | `dws6.com/dashboard/firehorse/autoresearch/` — React component |
| **CLI: `dws autoresearch`** | Start/stop/status for autoresearch loops | `cli/src/commands/autoresearch.ts` — JSON output, MCP-exposed |
| **Claude Skill: `/autoresearch`** | Claude Code skill to run autoresearch from chat | `.claude/commands/autoresearch.md` |

**Metric targets:**
- ATS false-positive rate: reduce by 11% (matching Karpathy's benchmark)
- Experiment throughput: 10+ experiments/hour on GN100
- Transfer validation: Spearman ρ > 0.90 from synthetic → staging

### 3.2 OpenClaw Integration (Priority: MEDIUM)

**Status:** Security-assessed (Feb 2026), MCP Hub identified as highest risk. NemoClaw (NVIDIA's hardened version) not yet available.

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **OpenClaw-to-DWS Bridge** | MCP bridge connecting OpenClaw skills to DWS agents | `src/mcp/openclaw-bridge.ts` — JSON-RPC 2.0 adapter |
| **Skill Export** | Export DWS agents as OpenClaw-compatible skills | `scripts/export-openclaw-skills.ts` — generates skill manifests |
| **Sandboxed OpenClaw Runner** | Run OpenClaw inside KYA-governed Firecracker MicroVM | `src/sandbox/openclaw-sandbox.ts` — isolate MCP attack surface |
| **DGX Spark Deployment Guide** | Production guide for DWS on GN100 hardware | `docs/deployment/dgx-spark-dws.md` |

**Security constraints (from DWS assessment):**
- OpenClaw community skills registry: BLOCKED (no auto-install, per CLAUDE.md)
- MCP tool responses: treated as untrusted input (prompt injection risk)
- OpenClaw runs INSIDE KYA sandbox, never outside governance boundary

### 3.3 Combined: Governed Self-Optimization Loop

The DWS 6 differentiator: OpenClaw + Autoresearch + KYA = **the only governed self-optimization platform**.

```
DAYTIME (OpenClaw-managed):
  1. Agents run production workloads
  2. Firehorse logs all decisions
  3. OpenClaw monitors agent performance metrics
  4. Human reviews flagged decisions

OVERNIGHT (Autoresearch-managed):
  1. Autoresearch reads today's Firehorse logs
  2. Identifies underperforming parameters (ATS weights, thresholds)
  3. Runs 100 experiments against synthetic KYA sessions
  4. Keeps improvements that pass 11% Efficiency Law
  5. Queues changes for 72-hour human gate

MORNING:
  Human reviews overnight experiments → approve/reject → deploy to staging
```

## 4. DWS 7 Features (Architecture — Q3-Q4 2026)

### 4.1 Multi-Agent Autoresearch Swarm

Karpathy's scaling path applied to DWS: spin up N agents, each optimizing different parameters, promote winners.

| Feature | Description |
|---------|-------------|
| **Swarm Orchestrator** | Temporal.io workflow that manages N parallel autoresearch agents |
| **Parameter Partitioning** | Each agent owns a non-overlapping parameter space (no conflicts) |
| **Cross-Agent Transfer** | depth=12 → depth=24 pattern: proxy agents validate, production agents receive |
| **Competitive Selection** | Agents compete on the same metric; top K survive each round |
| **Distributed Autoresearch** | SETI@home pattern — multiple GN100 devices run experiments in parallel |

### 4.2 OpenClaw as Fleet Command Interface

DGX Spark hardware becomes the Fleet Admiral command node:

| Feature | Description |
|---------|-------------|
| **Fleet OpenClaw** | One OpenClaw instance per GN100, federated via MCP |
| **Voice Command** | OpenClaw proactive mode: "Agent trust score dropped 15% — investigating" |
| **Situation Room** | OpenClaw-powered real-time fleet dashboard with natural language queries |
| **Physical Embodiment** | OpenClaw + Reachy Mini robot for physical fleet operations (NVIDIA demo pattern) |

### 4.3 NemoClaw Migration

NVIDIA's hardened version (NemoClaw) is in development. DWS 7 should:

| Action | Rationale |
|--------|-----------|
| Replace community OpenClaw with NemoClaw | Reduces MCP attack surface |
| Maintain KYA sandbox regardless | Defense in depth — don't trust vendor security alone |
| Contribute DWS governance patterns upstream | Position as enterprise governance partner |

## 5. Hardware Strategy: DGX Spark as Development Platform

The Acer Veriton GN100 (GB10 Superchip, 128GB) is already the DWS sandbox. Adding OpenClaw + Autoresearch:

| Workload | Memory | Concurrent with Others |
|----------|--------|----------------------|
| OpenClaw (always-on agent) | ~8-18GB (model-dependent) | Yes |
| Autoresearch loop (overnight) | ~4GB | Yes |
| Qwen 32B (Ollama) | ~18GB | Yes |
| Firecracker MicroVMs (agents) | ~128MB each | ~500 agents |
| PostgreSQL (Firehorse DMS) | ~2GB | Yes |
| **Total peak** | ~50GB | 128GB = plenty of headroom |

**Key advantage:** DGX Spark's 2.5x performance boost (March 2026 update) + NVFP4 instruction set makes autoresearch experiments 2-3x faster than at launch. Estimated: 20-30 experiments/hour (up from ~12).

## 6. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| OpenClaw MCP prompt injection | HIGH | KYA sandbox, untrusted input treatment |
| Community skill supply chain | HIGH | BLOCKED — no auto-install (CLAUDE.md rule) |
| Autoresearch producing unsafe configs | MEDIUM | 11% Efficiency Law + 72h human gate |
| Model hallucination in experiment evaluation | MEDIUM | Binary metric only (works/broken or numerical) |
| DGX Spark hardware failure (single point) | LOW | Firehorse logs to Supabase (cloud backup) |
| NemoClaw not released in time for DWS 7 | LOW | KYA sandbox makes vanilla OpenClaw safe enough |

## 7. Implementation Priority Matrix

### DWS 6 (Ship Q1-Q2 2026)

| # | Feature | Effort | Impact | Dependencies |
|---|---------|--------|--------|--------------|
| 1 | `dws autoresearch` CLI + skill | 2 days | HIGH | blogtheristo/autoresearch fork |
| 2 | KYA Parameter Tuner | 3 days | HIGH | Synthetic KYA generator |
| 3 | Experiment Dashboard | 2 days | MEDIUM | Firehorse audit schema |
| 4 | OpenClaw MCP Bridge | 3 days | MEDIUM | OpenClaw running on GN100 |
| 5 | Sandboxed OpenClaw Runner | 2 days | HIGH | Firecracker setup |
| 6 | DGX Spark Deployment Guide | 1 day | MEDIUM | All above |

### DWS 7 (Architecture Q3-Q4 2026)

| # | Feature | Effort | Impact | Dependencies |
|---|---------|--------|--------|--------------|
| 1 | Swarm Orchestrator | 2 weeks | HIGH | Temporal.io, autoresearch v1 |
| 2 | Fleet OpenClaw | 2 weeks | HIGH | Multiple GN100 devices |
| 3 | NemoClaw Migration | 1 week | MEDIUM | NVIDIA NemoClaw release |
| 4 | Physical Embodiment | 4 weeks | LOW | Reachy Mini hardware |

## 8. Competitive Positioning

| Competitor | Has Local Agent? | Has Autoresearch? | Has Governance? | Hardware Play? |
|------------|-----------------|-------------------|-----------------|----------------|
| **DWS IQ 6** | OpenClaw (sandboxed) | KYA-governed autoresearch | KYA v1.4 + Firehorse | DGX Spark (GN100) |
| Palantir AIP | Cloud agents | No public autoresearch | Proprietary governance | No edge hardware |
| Datadog | Monitoring only | No | Alert rules | Cloud-only |
| Weights & Biases | Experiment tracking | Manual sweeps | No governance | Cloud-only |
| OpenClaw (vanilla) | Yes | No | No | DGX Spark |
| Karpathy autoresearch | No | Yes (ML only) | No | Single GPU |

**DWS is the only platform that combines all four columns.** This is the moat.

## 9. The Pitch (Updated)

> "We don't just run AI agents. We run AI agents that optimize themselves overnight — governed by the KYA Standard, audited by Firehorse, and bounded by the 11% Efficiency Law. Your agents get 11% better every night. Your compliance trail gets 100 more entries of proof. Your competitors are still tuning hyperparameters by hand."

## Ontology

- **Geography:** Global (OpenClaw, autoresearch), Europe > Finland > Helsinki (DWS application, GN100 hardware)
- **Sector:** Technology > AI Infrastructure > Agent Platforms > Governed Self-Optimization
- **Entities:** NVIDIA, OpenClaw, NemoClaw, DGX Spark, Acer Veriton GN100, Andrej Karpathy, autoresearch, nanochat, Lifetime Oy, DWS IQ 6, DWS IQ 7, KYA Standard v1.4, Firehorse, Temporal.io
- **Tags:** openclaw, dgx-spark, autoresearch, karpathy, agent-swarm, governed-self-optimization, 11-percent-law, feature-plan
- **Temporal Context:** 2026-Q1 (plan), 2026-Q2 (DWS 6 ship), 2026-Q3-Q4 (DWS 7 architecture)
- **Confidence:** High (both projects public, DWS foundations already built)

## Related Documents

| Document | Location | Relevance |
|----------|----------|-----------|
| DWS Autoresearch Methodology | `docs/field-notes/2026-03-13-dws-autoresearch-methodology.md` | Foundation methodology |
| Karpathy autoresearch field note | `docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md` | Origin analysis |
| Acer-DGX Sandbox Strategy | `docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md` | Hardware platform |
| OpenClaw Security Assessment | `docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md` | Security constraints |
| OpenClaw/Moltworker Evaluation | `docs/field-notes/2026-02-15-moltworker-openclaw-dws-assistant.md` | Initial evaluation |
| KYA Optimization Standard v1.4 | `Legal/KYA_OPTIMIZATION_v1.4.md` | Pillar 4: Autoresearch governance |
| DWS autoresearch fork | `github.com/blogtheristo/autoresearch` | Implementation base |

---

(c) 2026 Lifetime Oy — OpenClaw + Autoresearch Feature Plan
Version 1.0 | 14.03.2026
