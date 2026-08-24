# Comparative Analysis: NVIDIA OpenClaw vs Karpathy Autoresearch — Combined Agent Architecture

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/compare-agent-systems-qDbS7 | Date: 15.03.2026 | Changes: Initial creation — deep comparative analysis of OpenClaw and Autoresearch, combined usage plan (daytime/overnight), KYA v1.4 governance, Firehorse audit trail, DWS 6 features, DWS 7 architecture

Session Links & References:
  - Claude Code: https://github.com/blogtheristo/dws6/tree/claude/compare-agent-systems-qDbS7
  - OpenClaw: https://build.nvidia.com/spark/openclaw
  - Karpathy autoresearch: https://github.com/karpathy/autoresearch
  - DWS autoresearch fork: https://github.com/blogtheristo/autoresearch
  - Feature plan: docs/field-notes/2026-03-14-openclaw-autoresearch-dws-feature-plan.md
  - Autoresearch methodology: docs/field-notes/2026-03-13-dws-autoresearch-methodology.md
  - Security assessment: docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md

Document Status:
  - Created: 15.03.2026
  - Last Modified: 15.03.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Architecture / Comparative Analysis

***

## 1. Executive Summary

This document is the definitive comparative analysis of two agent paradigms converging in Q1 2026, and the architecture that governs them together inside DWS IQ.

| System | Role in DWS | When It Runs | Governed By |
|--------|-------------|--------------|-------------|
| **NVIDIA OpenClaw** | Always-on daytime agent brain | 08:00–22:00 (continuous) | KYA v1.4 Pillars 1–3 |
| **Karpathy Autoresearch** | Overnight parameter optimizer | 22:00–08:00 (batch) | KYA v1.4 Pillar 4 |

**Combined value:** OpenClaw manages agent swarms during the day. Autoresearch optimizes agent parameters overnight. KYA Standard governs both. Firehorse logs everything.

**DWS is the only platform that combines all four:** local agent + autoresearch + governance + DGX Spark hardware.

---

## 2. System Profiles

### 2.1 NVIDIA OpenClaw

**What:** Always-on, local-first AI agent framework. Formerly Clawdbot/Moltbot. GTC 2026 star — Jensen Huang called it "the most important software release probably ever." 180k+ GitHub stars.

**Architecture:**
- Multi-model agent with persistent memory
- MCP-compatible skill system (community + custom)
- Proactive mode — initiates actions without prompting
- Runs on DGX Spark (128GB, GB10 Superchip, up to 200B parameter models)
- 2.5x performance boost since launch (March 2026 firmware update)

**Strengths:**
- Fully local — no cloud API costs, full privacy
- Persistent context across sessions
- Extensible via MCP tools and community skills
- Proactive agent behavior (monitors files, inbox, calendar)
- NVIDIA-backed, production-grade

**Weaknesses:**
- MCP Hub is the #1 attack surface (DWS security assessment: 5 critical findings)
- Community skill registry is a supply-chain risk
- No built-in governance, trust scoring, or audit trail
- Steep hardware requirements (DGX Spark or high-end RTX)
- Meta and several firms banned it from internal networks (security concerns)

**DWS Security Assessment (Feb 2026):**
- 5 critical, 17 high, 10 medium severity findings
- MCP Hub: zero auth, SSRF via callback_url, arbitrary endpoint execution
- Community skills: BLOCKED in DWS (per CLAUDE.md)
- All MCP tool responses treated as untrusted input (prompt injection risk)

### 2.2 Karpathy Autoresearch

**What:** Autonomous experiment loop — 630 lines of Python, MIT license. Released March 7, 2026 by Andrej Karpathy. 30k+ stars in 7 days.

**Architecture:**
- Three-file immutable system: `prepare.py` (fixed), `train.py` (agent-modified), `program.md` (read-only instructions)
- Fixed 5-minute time budget per experiment (~12 experiments/hour, ~100 overnight)
- Single optimization metric: `val_bpb` (validation bits-per-byte)
- Binary KEEP/DISCARD verdict per experiment

**Proven Results:**
- ~700 autonomous changes over 2 days on nanochat
- ~20 additive improvements that transferred to larger models
- "Time to GPT-2" dropped from 2.02h → 1.80h — **11% efficiency gain**
- Shopify CEO reported 19% improvement using the framework internally
- 35 agents on Hyperspace network ran 333 experiments unsupervised in one night

**Strengths:**
- Radically simple — 630 lines, single GPU, no dependencies beyond PyTorch
- No network access needed — minimal attack surface
- Proven transfer from proxy (small) to production (large) models
- Self-contained: agent reads its own code, modifies, verifies
- MIT license — enterprise-friendly

**Weaknesses:**
- Research-grade, one-person project
- No governance, audit trail, or safety bounds
- ML training only — not a general-purpose agent
- No memory, no tools, no multi-step reasoning
- Requires human to set up prepare.py and program.md correctly

---

## 3. Head-to-Head Comparison Matrix

| Dimension | OpenClaw | Autoresearch | DWS Combined |
|-----------|----------|--------------|--------------|
| **Pattern** | Persistent agent (always-on) | Batch optimizer (fire-and-forget) | Daytime brain + overnight optimizer |
| **Interaction** | Proactive (initiates) | Unattended (runs overnight) | Human-in-the-loop via 72h gate |
| **Scope** | General-purpose assistant | Single-metric optimization | KYA-scoped parameter tuning |
| **Memory** | Full session history | Experiment log only | Firehorse JSONL (Article 12) |
| **Tools** | MCP skills, file/inbox/calendar | None (modifies source only) | MCP bridge + sandboxed runner |
| **Security** | HIGH risk (MCP attack surface) | LOW risk (no network, no tools) | KYA sandbox governs both |
| **Governance** | None built-in | None built-in | KYA v1.4, 11% Efficiency Law |
| **Hardware** | DGX Spark / RTX (8–18GB) | Any single NVIDIA GPU (~4GB) | GN100: 128GB, runs both |
| **Locality** | Fully local | Fully local | Fully local (EU data residency) |
| **Extensibility** | Community skills (BLOCKED) | Fork and adapt | DWS agent export as skills |
| **Maturity** | Production (NVIDIA-backed) | Research (one-person) | Production (KYA-governed) |
| **Stars** | 180k+ | 30k+ | — |

---

## 4. Combined Usage Architecture: Daytime Brain + Overnight Optimizer

### 4.1 The Daily Cycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DWS AGENT GOVERNANCE CYCLE                          │
│                                                                        │
│  08:00 ─────────────────── DAYTIME ─────────────────── 22:00          │
│  │                                                        │            │
│  │  OpenClaw (Always-On Agent Brain)                      │            │
│  │  ┌──────────────────────────────────────────────────┐  │            │
│  │  │ • Manage agent swarm via MCP bridge              │  │            │
│  │  │ • Monitor KYA trust scores in real-time          │  │            │
│  │  │ • Flag anomalies for human review                │  │            │
│  │  │ • Execute approved autoresearch improvements     │  │            │
│  │  │ • Log all decisions to Firehorse audit trail     │  │            │
│  │  └──────────────────────────────────────────────────┘  │            │
│  │                                                        │            │
│  22:00 ────────────────── OVERNIGHT ────────────────── 08:00          │
│  │                                                        │            │
│  │  Autoresearch (Parameter Optimizer)                    │            │
│  │  ┌──────────────────────────────────────────────────┐  │            │
│  │  │ 1. Read today's Firehorse logs                   │  │            │
│  │  │ 2. Identify underperforming parameters           │  │            │
│  │  │ 3. Run 100 experiments against synthetic KYA     │  │            │
│  │  │ 4. Apply 11% Efficiency Law to each result       │  │            │
│  │  │ 5. Queue improvements for 72-hour human gate     │  │            │
│  │  └──────────────────────────────────────────────────┘  │            │
│  │                                                        │            │
│  08:00 ──────────────────── MORNING ─────────────────────             │
│  │                                                                     │
│  │  Human reviews overnight experiments → approve/reject → deploy      │
│  │                                                                     │
│  └─────────────────────────── REPEAT ────────────────────────────────  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Governance Stack

```
┌─────────────────────────────────────────────────────────────┐
│                GOVERNANCE: KYA v1.4 + Firehorse              │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Pillar 1: Identity Attribution                          │ │
│  │   KYC-verified human anchor for every agent session     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Pillar 2: Capability Gating                             │ │
│  │   Path-scoped access, dynamic permission adjustment     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Pillar 3: Forensic Observability                        │ │
│  │   Firehorse JSONL, Article 12, sub-second telemetry     │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ Pillar 4: Autoresearch Governance (v1.4)                │ │
│  │   11% Efficiency Law, 72h human gate, binary verdicts   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Agent Trust Score (ATS):                                    │
│  ATS = max(0, 1.0 - V×0.25 - L - D×0.05 + A×0.18)         │
│    V = KYA violations                                        │
│    L = latency penalty                                       │
│    D = denied access attempts                                │
│    A = autoresearch improvement factor (capped at 0.18)      │
│                                                              │
│  11% Efficiency Law:                                         │
│    0–11%  improvement → AUTO_DEPLOY                          │
│    11–25% improvement → PENDING (72h human gate)             │
│    >25%   improvement → ROLLBACK (logic drift)               │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Hardware Layout (Acer Veriton GN100 / DGX Spark)

| Workload | Memory | Time Slot | Concurrent |
|----------|--------|-----------|------------|
| OpenClaw agent (gpt-oss-120B) | ~18GB | Daytime | Yes |
| Autoresearch loop | ~4GB | Overnight | Yes |
| Qwen 32B via Ollama | ~18GB | Always | Yes |
| Firecracker MicroVMs (agents) | ~128MB each | Always | ~500 agents |
| PostgreSQL (Firehorse DMS) | ~2GB | Always | Yes |
| **Peak total** | **~50GB** | — | **128GB headroom** |

DGX Spark's 2.5x performance boost (March 2026 update) + NVFP4 instruction set: estimated 20–30 autoresearch experiments/hour (up from ~12).

---

## 5. DWS 6 Features (Ship Q1–Q2 2026)

### 5.1 Autoresearch CLI & Skill

| Component | Implementation | Status |
|-----------|---------------|--------|
| `dws autoresearch` CLI | `cli/src/commands/autoresearch.ts` | Implemented |
| Claude Skill `/autoresearch` | `.claude/commands/autoresearch.md` | Implemented |
| Experiment runner | `src/autoresearch/runner.ts` | Implemented |
| JSON output format | Structured results per experiment | Implemented |

### 5.2 KYA Parameter Tuner

The autoresearch loop applied to KYA trust score parameters (ATS weights, session TTL, trust recovery rates).

| Component | Implementation | Status |
|-----------|---------------|--------|
| KYA tuner agent | `src/autoresearch/kya-tuner.ts` | Implemented |
| Synthetic KYA generator | `src/autoresearch/synthetic-kya.ts` | Implemented |
| 11% Efficiency Law evaluation | `src/firehorse/audit-schema.ts` | Existing |

**Tunable Parameters (KYA v1.4):**
- ATS violation weight (V×0.25)
- Latency penalty (L)
- Denied access weight (D×0.05)
- Autoresearch bonus cap (A×0.18)
- Session TTL (hours)
- Trust recovery rate (points/hour)

**Non-Tunable (hardcoded, security-critical):**
- 11% Efficiency Law threshold
- 72-hour human gate requirement
- Kill switch SLA (<5ms)
- Fleet emergency stop SLA (<50ms)

### 5.3 OpenClaw MCP Bridge

| Component | Implementation | Status |
|-----------|---------------|--------|
| MCP bridge adapter | `src/mcp/openclaw-bridge.ts` | Implemented |
| Sandboxed runner | `src/sandbox/openclaw-sandbox.ts` | Implemented |
| Security constraints | KYA sandbox, untrusted input | Enforced |

**Security constraints (from DWS assessment):**
- OpenClaw community skills: BLOCKED (no auto-install)
- MCP tool responses: untrusted input (prompt injection risk)
- OpenClaw runs INSIDE KYA sandbox, never outside governance boundary
- All bridge calls logged to Firehorse audit trail

### 5.4 Governed Self-Optimization Loop

The DWS 6 differentiator: OpenClaw + Autoresearch + KYA = the only governed self-optimization platform.

```
Input: Today's Firehorse logs (agent performance metrics)
         ↓
Autoresearch identifies underperforming KYA parameters
         ↓
Runs N experiments against synthetic KYA sessions
         ↓
11% Efficiency Law evaluation per experiment
         ↓
  ≤11% → AUTO_DEPLOY (queue for next day)
  11-25% → PENDING (72h human gate)
  >25% → ROLLBACK (logic drift detected)
         ↓
Human reviews morning queue → approve/reject
         ↓
Approved changes deployed via OpenClaw during daytime
         ↓
Firehorse logs impact → feeds next overnight cycle
```

---

## 6. DWS 7 Architecture (Q3–Q4 2026)

### 6.1 Multi-Agent Autoresearch Swarm

Karpathy's scaling path applied to DWS: N agents in parallel, each optimizing different parameters, promote winners.

| Component | Description | Orchestrator |
|-----------|-------------|-------------|
| **Swarm Orchestrator** | Temporal.io workflow managing N parallel agents | `workflows/autoresearch-swarm.ts` |
| **Parameter Partitioning** | Non-overlapping parameter spaces per agent | Conflict-free |
| **Cross-Agent Transfer** | depth=12 → depth=24 pattern for validation | Spearman ρ > 0.90 |
| **Competitive Selection** | Agents compete on same metric; top K survive | Tournament |
| **Distributed Autoresearch** | SETI@home pattern across multiple GN100 devices | Fleet-wide |

### 6.2 Fleet OpenClaw

DGX Spark becomes the Fleet Admiral command node:

| Feature | Description |
|---------|-------------|
| **Fleet OpenClaw** | One OpenClaw per GN100, federated via MCP |
| **Voice Command** | Proactive mode: "Agent trust dropped 15% — investigating" |
| **Situation Room** | Real-time fleet dashboard with natural language queries |
| **Physical Embodiment** | OpenClaw + Reachy Mini robot (NVIDIA demo pattern) |

### 6.3 NemoClaw Migration Path

NVIDIA's hardened version (NemoClaw) is in development. DWS 7 strategy:

| Action | Rationale |
|--------|-----------|
| Replace community OpenClaw with NemoClaw | Reduces MCP attack surface |
| Maintain KYA sandbox regardless | Defense in depth — don't trust vendor security alone |
| Contribute DWS governance upstream | Position as enterprise governance partner |
| Keep vanilla OpenClaw as fallback | NemoClaw release timeline uncertain |

---

## 7. Competitive Positioning

| Platform | Local Agent | Autoresearch | Governance | Hardware | Audit Trail |
|----------|-------------|-------------|-----------|----------|-------------|
| **DWS IQ 6** | OpenClaw (sandboxed) | KYA-governed | KYA v1.4 | DGX Spark | Firehorse (Article 12) |
| Palantir AIP | Cloud agents | No | Proprietary | No edge | Proprietary |
| Datadog | Monitoring only | No | Alert rules | Cloud-only | Logs |
| Weights & Biases | Tracking only | Manual sweeps | No | Cloud-only | Run history |
| OpenClaw (vanilla) | Yes | No | No | DGX Spark | None |
| Karpathy autoresearch | No | Yes (ML only) | No | Single GPU | Experiment log |

**DWS moat: all six columns. No competitor has more than three.**

---

## 8. Risk Matrix

| Risk | Severity | Mitigation |
|------|----------|------------|
| OpenClaw MCP prompt injection | HIGH | KYA sandbox, untrusted input treatment, Firehorse logging |
| Community skill supply chain | HIGH | BLOCKED — no auto-install (CLAUDE.md rule) |
| Autoresearch producing unsafe configs | MEDIUM | 11% Efficiency Law + 72h human gate + security params non-tunable |
| Model hallucination in evaluation | MEDIUM | Binary metric only (works/broken or numerical) |
| DGX Spark single point of failure | LOW | Firehorse logs to Supabase (cloud backup), fleet redundancy in DWS 7 |
| NemoClaw not released for DWS 7 | LOW | KYA sandbox makes vanilla OpenClaw safe enough |
| Autoresearch experiment divergence | LOW | Parameter partitioning prevents conflicts, competitive selection prunes weak agents |

---

## 9. Implementation Map

| # | Component | File | Priority | Effort |
|---|-----------|------|----------|--------|
| 1 | Autoresearch runner | `src/autoresearch/runner.ts` | HIGH | 1 day |
| 2 | KYA parameter tuner | `src/autoresearch/kya-tuner.ts` | HIGH | 2 days |
| 3 | Synthetic KYA generator | `src/autoresearch/synthetic-kya.ts` | HIGH | 1 day |
| 4 | OpenClaw MCP bridge | `src/mcp/openclaw-bridge.ts` | MEDIUM | 2 days |
| 5 | Sandboxed OpenClaw runner | `src/sandbox/openclaw-sandbox.ts` | HIGH | 1 day |
| 6 | Claude skill `/autoresearch` | `.claude/commands/autoresearch.md` | HIGH | 0.5 day |
| 7 | Comparative analysis (this doc) | `docs/compare-openclaw-autoresearch.md` | HIGH | Done |

---

## Ontology

- **Geography:** Global (OpenClaw, autoresearch), Europe > Finland > Helsinki (DWS application, GN100 hardware)
- **Sector:** Technology > AI Infrastructure > Agent Platforms > Governed Self-Optimization
- **Entities:** NVIDIA, OpenClaw, NemoClaw, DGX Spark, Acer Veriton GN100, Andrej Karpathy, autoresearch, nanochat, Lifetime Oy, DWS IQ 6, DWS IQ 7, KYA Standard v1.4, Firehorse, Temporal.io
- **Tags:** openclaw, dgx-spark, autoresearch, karpathy, agent-swarm, governed-self-optimization, 11-percent-law, comparative-analysis, kya-v1.4, firehorse-audit
- **Temporal Context:** 2026-Q1 (implementation), 2026-Q2 (DWS 6 ship), 2026-Q3-Q4 (DWS 7 architecture)
- **Confidence:** High

## Related Documents

| Document | Location |
|----------|----------|
| Feature Plan | `docs/field-notes/2026-03-14-openclaw-autoresearch-dws-feature-plan.md` |
| Autoresearch Methodology | `docs/field-notes/2026-03-13-dws-autoresearch-methodology.md` |
| OpenClaw Security Assessment | `docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md` |
| KYA Standard v1.5 | `Legal/KYA_STANDARD_v1.md` |
| KYA Optimization v1.4 | `Legal/KYA_OPTIMIZATION_v1.4.md` |
| Firehorse Audit Schema | `src/firehorse/audit-schema.ts` |
| Base Agent | `src/agents/base.agent.ts` |

---

(c) 2026 Lifetime Oy — Comparative Analysis: OpenClaw vs Autoresearch
Version 1.0 | 15.03.2026
