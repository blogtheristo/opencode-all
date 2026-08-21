# DWS Model Standard

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/model-performance-notes-4x3or | Date: 18.05.2026 | Changes: Initial creation. Promotes the model matrix from `docs/field-notes/2026-05-18-models-worth-building-on-3090-5090-dgx-spark.md` to a binding standard. Defines (a) the **Approved Model Slate** (9 models, 5 tiers), (b) the **Selection Rules** that map (Jurisdiction × Room × Sensitivity) to a tier, (c) the **(Jurisdiction × Room) Loadout Table** as the runtime decision rule, (d) per-Firehorse-use-case and per-industry-cluster bindings, (e) the **Approval & Evaluation Gate** that controls promotion/demotion of models in the slate, and (f) the **No-Cloud-Fallback Rule** for EU-sovereign workloads. Does not duplicate per-Surface Brain assignments — those live in `DWS_DEPLOYMENT_STANDARD.md` §3 and §6, which now selects from this catalog. Sources: field note 2026-05-18, `INDUSTRIES.md`, `Firehorse/Control/README.md`, `Firehorse/Situation/README.md`, `product-catalog/Firehorse/README.md`, `docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md`, `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md`, `DWS_DEPLOYMENT_STANDARD.md` v1.4, `DWS_SOVEREIGNTY_STANDARD.md`.

Session Links & References:

- Claude Code (claude/model-performance-notes-4x3or): https://github.com/blogtheristo/dws6/commits/claude/model-performance-notes-4x3or
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_MODEL_STANDARD.md
- Empirical basis: docs/field-notes/2026-05-18-models-worth-building-on-3090-5090-dgx-spark.md

Document Status:

- Created: 18.05.2026
- Last Modified: 18.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Operational Standard

***

**Code Versioning Note**
Code-Version: 1.0
Introduced-In: PR-claude/model-performance-notes-4x3or
Branch: claude/model-performance-notes-4x3or
Date: 2026-05-18
Owner: Risto Anton Päärni (Lifetime Oy, risto.paarni@lifetime.fi)
Env-Schema: n/a (documentation standard; no runtime config)

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Definitions](#2-definitions)
3. [Approved Model Slate](#3-approved-model-slate)
4. [Tier Map](#4-tier-map)
5. [Selection Rules](#5-selection-rules)
6. [Loadout Table — Jurisdiction × Room](#6-loadout-table--jurisdiction--room)
7. [Firehorse Use-Case Bindings](#7-firehorse-use-case-bindings)
8. [Industry-Cluster Bindings](#8-industry-cluster-bindings)
9. [No-Cloud-Fallback Rule](#9-no-cloud-fallback-rule)
10. [Approval & Evaluation Gate](#10-approval--evaluation-gate)
11. [Logging & Article-12 Binding](#11-logging--article-12-binding)
12. [Maintenance](#12-maintenance)
13. [Related Documents](#13-related-documents)

---

## 1. Purpose & Scope

This standard governs **which large language and multimodal models DWS uses, in which Surface, for which customer, in which jurisdiction, and under which sensitivity class.** It is the canonical catalogue from which `DWS_DEPLOYMENT_STANDARD.md` §3 and §6 pick per-Surface Brains; it is the canonical authority cited by `/sovereignty-assess`, `/compliance-check`, and the deploy gate when a Brain selection is challenged.

**In scope.**
- The Approved Model Slate (the closed set of models DWS will run in production or recommend to partners).
- The tier map and the selection rules that resolve (Jurisdiction × Room × Sensitivity) to a tier.
- The standing loadout per (Jurisdiction × Room) cell.
- Bindings to the 7 Firehorse product use cases and the 5 industry clusters of the 25-industry registry.
- The Approval & Evaluation Gate (promotion / demotion of models).
- The No-Cloud-Fallback rule for EU-sovereign workloads.

**Out of scope.**
- Per-Surface Brain assignments — `DWS_DEPLOYMENT_STANDARD.md` §3 owns these; this standard provides the catalog it draws from.
- Inference plumbing (Ollama, vLLM, llama.cpp, Continue config) — owned by `docs/Ollama.md` and `infrastructure/dgx-spark/*`.
- Quantization recipes — owned by `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` and follow-up NVFP4 study notes.
- The training of in-house weights (Lifetime World Model) — owned by `product-catalog/LWM/training-manual.md`.
- Customer-facing marketing copy — see internal-only decision in the model matrix discussion; this standard is **INTERNAL**, not public.

**Why this standard exists.** Until v1.0, model selection was scattered across the Continue config, the deployment standard's per-Surface table, the Ollama doc, and the field notes. There was no single authority on which models are sanctioned for which (jurisdiction × sensitivity) combination. The matrix in the 2026-05-18 field note exposed the gap: sudo su's three picks did not cover the EU-defence-segment slot, the board-grade Situation Room slot, or the in-house brain slot. This standard closes the gap by turning the matrix into a binding rule.

---

## 2. Definitions

**Brain.** The LLM that backs a given Surface or agent at runtime. Term inherited from `DWS_DEPLOYMENT_STANDARD.md` §2.

**Tier.** A category of Brain defined by capability ceiling, cost, sovereignty posture, and where it physically runs. Five tiers — see §4.

**Slate.** The closed set of Approved Models. Adding or removing a Brain from the Slate requires the Approval & Evaluation Gate in §10.

**Room.** Either **Control Room** (operational, ms–min latency, vision-heavy) or **Situation Room** (strategic, day–quarter latency, text/tabular). Defined by `Firehorse/Control/README.md` and `Firehorse/Situation/README.md`.

**Jurisdiction.** One of four buckets per `docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md`:
- **EU-Sovereign** (DE / FR / FI — GDPR + NIS2 + EU AI Act, CLOUD-Act-free)
- **US Cloud** (Supabase / Cloudflare path — CLOUD Act subject)
- **UAE / G42** (DIFC + ADGM, DWS IQ 7, planned 2027)
- **ASEA** (SG / MY / ID / TH / VN, DWS IQ 7, planned 2027)

**Sensitivity Class.** One of three:
- **Commercial** — standard customer-grade workload. CN-origin weights allowed.
- **Regulated** — financial services, real estate, healthcare, public sector. CN-origin weights conditional; sign-off per customer.
- **Defence / Public Sector / Aegis** — defence, public sector procurement, critical infrastructure. **CN-origin weights forbidden.** EU-origin or US-frontier-API only.

**Origin.** The jurisdiction of the entity that produced the model weights. Tracked because some sensitivity classes block specific origins (CN-origin forbidden for Defence). Tracked values: **EU**, **US**, **CN**, **DWS** (in-house).

**No-Cloud-Fallback Brain.** A Brain that, by design, never reaches out to an external API for completion. Required for EU-Sovereign × Defence workloads. See §9.

---

## 3. Approved Model Slate

The closed set of models DWS may use in production or recommend to partners as of this version. Adding to or removing from this Slate requires passing the gate in §10.

| Slate ID | Model | Origin | Where it runs | Quant / Variant | Status |
|----------|-------|--------|---------------|------------------|--------|
| **FRONTIER-CLAUDE-SONNET** | Claude Sonnet 4.6 | US (Anthropic) | Anthropic API | n/a | ✅ Active |
| **FRONTIER-CLAUDE-OPUS** | Claude Opus 4.7 | US (Anthropic) | Anthropic API | n/a | ✅ Active |
| **SOVEREIGN-STEP-3.5** | StepFun Step-3.5 Flash 121B REAP | CN (StepFun) | DGX Spark | Q6 | ✅ Active (commercial only) |
| **SOVEREIGN-NEMOTRON-SUPER** | NVIDIA Nemotron 3 Super (`nemotron_h_moe`, 123.6 B / 12.7 B-A) | US (NVIDIA) | DGX Spark | Q4_K_M | ✅ Active |
| **SOVEREIGN-MISTRAL-SMALL** | Mistral-4-Small | EU (Mistral, FR) | DGX Spark / Veriton GN-100 | TBD | 📋 Adopted (pending bench) |
| **INHOUSE-LWM-V1** | Lifetime World Model V1 | DWS (FI) | DGX Spark | FP8 → NVFP4 path | 🎯 Target (V1 GA: 12 Jun 2026) |
| **EDGE-NEMOTRON-NANO-OMNI** | NVIDIA Nemotron 3 Nano Omni (30 B / 3 B-A) | US (NVIDIA) | DGX Spark / Veriton GN-100 | TBD | ✅ Active |
| **EDGE-QWEN-VL-235B** | Qwen3-VL 235B-A22B | CN (Alibaba) | DGX Spark | Q4 / Q5 | ✅ Active (commercial only) |
| **PARTNER-QWEN-3.6** | Qwen 3.6 27B Dense | CN (Alibaba) | Single 24 GB GPU | Q4 | ✅ Active (commercial only) |
| **PARTNER-GEMMA-4** | Gemma 4 26B-A4B | US (Google) | Single 24 GB GPU | Q4 | ✅ Active |
| **PARTNER-QWEN-CODER** | Qwen3 Coder 30B-A3B | CN (Alibaba) | Single 24 GB GPU | Q4 | ✅ Active (commercial only) |

**Status legend.**
- ✅ Active — sanctioned for deployment today.
- 📋 Adopted — slate-eligible, bench-pending. Use only behind a Surface-owner sign-off.
- 🎯 Target — in development. Not yet deployable.
- ⚠️ Deprecated — being retired. Sunset date in §12.

---

## 4. Tier Map

Five tiers. Every Brain in the Slate belongs to exactly one tier.

| Tier | Name | Where it runs | Capability ceiling | Sovereignty posture | Cost surface |
|------|------|---------------|--------------------|-----------------------|----------------|
| **T1** | **Frontier API** | Anthropic API (US) | Highest — board-grade output, defence final answers | CLOUD Act subject; allowed for any sensitivity class via Anthropic data-processing agreement | Per-token API spend |
| **T2** | **Sovereign Reasoning** | DGX Spark / Veriton GN-100 | High — frontier-adjacent reasoning, fully local | EU-resident inference, CLOUD-Act-free at the operational layer. Origin caveat applies (CN-origin blocked for Defence) | Capex (hardware) only |
| **T3** | **In-House Brain** | DGX Spark / Veriton GN-100 | Medium-high (V1) → high (V2+) | DWS-owned weights → the airtight sovereignty story. No origin caveat. | Capex + training cost |
| **T4** | **Edge Multimodal** | DGX Spark / Veriton GN-100 / partner edge | Vision-strong, reasoning-thin (chain behind a T2/T3) | EU-resident; origin caveat for CN-origin variants | Capex (hardware) only |
| **T5** | **Partner Laptop** | Single 24 GB GPU (RTX 3090 / 4090 / 5090) | Tier-2 reasoning, single-GPU footprint | Per-customer; runs on customer hardware | Customer hardware |

**Rule.** A Surface declares a tier first, then picks a specific Slate ID from that tier. The deployment standard's per-Surface Brain table consumes this rule.

---

## 5. Selection Rules

The runtime decision procedure. An agent (or human) selecting a Brain for a workload **MUST** resolve in this order:

1. **Identify the Sensitivity Class** of the customer's data and the workload (Commercial / Regulated / Defence).
2. **Identify the Jurisdiction** of the deployment (EU-Sovereign / US Cloud / UAE / ASEA).
3. **Identify the Room** (Control / Situation) or the equivalent latency × modality profile.
4. **Resolve the cell** in the Loadout Table (§6) and pick the named Slate ID.
5. **Verify the No-Cloud-Fallback Rule** (§9) if jurisdiction is EU-Sovereign × Defence.
6. **Log the selection** per §11 (EU AI Act Art. 12 + KYA binding).

**Three invariants the table enforces.**

- **I1 — Universal vision pick.** `EDGE-NEMOTRON-NANO-OMNI` is the vision tier across every (jurisdiction × sensitivity) cell. Clean US-origin provenance and binding-constraint unlock for SiteSense / Material Oracle / Lifetime Fleet. No vision Brain may be substituted without an explicit §10 gate.
- **I2 — Sensitivity dominates jurisdiction.** A Defence customer in the EU and a Defence customer in UAE receive the same reasoning Brain (`SOVEREIGN-MISTRAL-SMALL` + `FRONTIER-CLAUDE-SONNET`), not the EU-default `SOVEREIGN-STEP-3.5`. Sensitivity is the harder gate.
- **I3 — In-house brain replaces Step-3.5 long-term.** Once `INHOUSE-LWM-V1` is qualified on Spark via the NVFP4 path, it **MUST** absorb the Control Room reasoning slot for every (jurisdiction × sensitivity) cell, demoting `SOVEREIGN-STEP-3.5` to a fallback. Target cutover: V1 GA (12 Jun 2026) + 30 days bench.

---

## 6. Loadout Table — Jurisdiction × Room

The standing decision table. Each cell names the Slate IDs that **MUST** be used unless a §10-gated exception applies.

| | **Control Room** (NOW, vision, ms–min) | **Situation Room** (TREND, text, day–quarter) |
|---|------------------------------------------|------------------------------------------------|
| **EU-Sovereign — Commercial** | `EDGE-NEMOTRON-NANO-OMNI` + `INHOUSE-LWM-V1` (post-GA) / `SOVEREIGN-NEMOTRON-SUPER` (pre-GA fallback) | `SOVEREIGN-STEP-3.5` ; `FRONTIER-CLAUDE-SONNET` for board-grade |
| **EU-Sovereign — Regulated** | `EDGE-NEMOTRON-NANO-OMNI` + `INHOUSE-LWM-V1` / `SOVEREIGN-NEMOTRON-SUPER` | `SOVEREIGN-NEMOTRON-SUPER` (US-origin OK for Regulated) ; `FRONTIER-CLAUDE-SONNET` for final answers |
| **EU-Sovereign — Defence / Aegis** | `EDGE-NEMOTRON-NANO-OMNI` + `INHOUSE-LWM-V1` (post-GA) only. **CN weights blocked.** | `SOVEREIGN-MISTRAL-SMALL` local ; `FRONTIER-CLAUDE-SONNET` / `FRONTIER-CLAUDE-OPUS` for final answers |
| **US Cloud — any sensitivity** | `EDGE-NEMOTRON-NANO-OMNI` + `PARTNER-QWEN-3.6` at partner tier | `SOVEREIGN-STEP-3.5` (Commercial, w/ customer CN-weight ack) ; `FRONTIER-CLAUDE-SONNET` (Regulated / Defence) |
| **UAE / G42** (DWS IQ 7, planned 2027) | `EDGE-NEMOTRON-NANO-OMNI` primary | `SOVEREIGN-MISTRAL-SMALL` until Step-3.5 license + provenance sign-off ; `FRONTIER-CLAUDE-SONNET` allowed |
| **ASEA** (DWS IQ 7, planned 2027) | `EDGE-NEMOTRON-NANO-OMNI` primary | `SOVEREIGN-STEP-3.5` (SG commercial only) or `SOVEREIGN-MISTRAL-SMALL` ; `FRONTIER-CLAUDE-SONNET` allowed |

**Reading the table.** Each cell lists the Brains in priority order (primary; secondary; fallback). The selecting agent picks the first Brain whose preconditions are met (No-Cloud-Fallback compliance, customer ack on CN-origin where flagged, sufficient compute available).

---

## 7. Firehorse Use-Case Bindings

Bindings between the 7 use cases of `product-catalog/Firehorse/README.md` and the Slate. Used by `/agent-run` and the Firehorse orchestrator to pick a Brain when no Surface-level binding overrides.

| Firehorse use case | Primary | Secondary | Defence-segment fallback |
|---------------------|---------|-----------|---------------------------|
| Forensic Compliance Auditing (Fit-for-55 / CBAM / CSRD, 1000+ pp.) | `SOVEREIGN-STEP-3.5` | `FRONTIER-CLAUDE-SONNET` final pass | `FRONTIER-CLAUDE-SONNET` or `SOVEREIGN-MISTRAL-SMALL` |
| Real-Time Carbon Tracking | `EDGE-NEMOTRON-NANO-OMNI` (tag) + `INHOUSE-LWM-V1` (roll-up) | `SOVEREIGN-STEP-3.5` batch | `EDGE-NEMOTRON-NANO-OMNI` + `SOVEREIGN-MISTRAL-SMALL` |
| Investor Relations Outreach | `PARTNER-QWEN-3.6` | `SOVEREIGN-STEP-3.5` pitch synthesis | `PARTNER-GEMMA-4` |
| Safety Incident Reconstruction (EN 13001) | `EDGE-NEMOTRON-NANO-OMNI` + `SOVEREIGN-STEP-3.5` | `EDGE-QWEN-VL-235B` for heavy frames | `EDGE-NEMOTRON-NANO-OMNI` + `FRONTIER-CLAUDE-SONNET` |
| Digital Twin Verification (BIM vs aerial) | `EDGE-NEMOTRON-NANO-OMNI` | `EDGE-QWEN-VL-235B` dense clash detection | `EDGE-NEMOTRON-NANO-OMNI` alone |
| Multi-Site Operations Coordination | Control: `EDGE-NEMOTRON-NANO-OMNI` + `INHOUSE-LWM-V1`. Situation: `SOVEREIGN-STEP-3.5` | `FRONTIER-CLAUDE-SONNET` cross-portfolio | Control: `EDGE-NEMOTRON-NANO-OMNI` + `SOVEREIGN-MISTRAL-SMALL`. Situation: `FRONTIER-CLAUDE-SONNET` |
| Automated Campaign Management | `PARTNER-QWEN-3.6` | `PARTNER-QWEN-CODER` for template logic | `PARTNER-GEMMA-4` |

---

## 8. Industry-Cluster Bindings

Bindings between the 5 industry clusters of `INDUSTRIES.md` (25 industries) and the Slate. The cluster's CN-weight sensitivity is the binding constraint.

| Cluster | Industries (count) | CN weights OK? | Primary loadout | EU-origin / frontier fallback |
|---------|---------------------|------------------|------------------|--------------------------------|
| **Heavy Emitters** (direct ETS + CBAM) | Power & Heat, Steel, Cement, Chemicals, Aviation, Maritime, Road Transport, Refining, Aluminium (9) | Yes — commercial EU-regulated | `SOVEREIGN-STEP-3.5` + `EDGE-NEMOTRON-NANO-OMNI` + `INHOUSE-LWM-V1` | `FRONTIER-CLAUDE-SONNET` for board-grade |
| **Supply-Chain** | Construction, Manufacturing, F&B, Logistics, Shipbuilding (5) | Yes | `EDGE-NEMOTRON-NANO-OMNI` + `SOVEREIGN-STEP-3.5` + `INHOUSE-LWM-V1` | `SOVEREIGN-MISTRAL-SMALL` for SOEs |
| **Financial / Scope-3** | Financial Services, Real Estate, Public Sector, Healthcare (4) | Conditional — Public Sector + Healthcare often block | `SOVEREIGN-STEP-3.5` (banks / RE) ; `SOVEREIGN-MISTRAL-SMALL` + `EDGE-NEMOTRON-NANO-OMNI` (Public + Healthcare) | `FRONTIER-CLAUDE-SONNET` for regulated final answers |
| **Emerging Tech / Dual-Use** | Data Centres, RFNBO / Green H2, Mining (3) | Conditional — defence dual-use risk | `EDGE-NEMOTRON-NANO-OMNI` + `INHOUSE-LWM-V1` ; `SOVEREIGN-STEP-3.5` clearly commercial only | `SOVEREIGN-MISTRAL-SMALL` + `FRONTIER-CLAUDE-SONNET` for dual-use |
| **Ag & Circular** | Agriculture, Waste, Pulp/Paper, Glass & Ceramics (4) | Yes | `SOVEREIGN-STEP-3.5` + `EDGE-NEMOTRON-NANO-OMNI` | `PARTNER-QWEN-3.6` at partner tier |

**Total: 25.** Matches the canonical registry.

---

## 9. No-Cloud-Fallback Rule

**Rule.** A Brain serving an **EU-Sovereign × Defence / Aegis / public-sector-critical** workload **MUST NOT** silently fall back to any external API on error, timeout, or load. This is binding.

**Why.** Silent cloud fallback breaks the sovereignty contract. A customer paying for an on-prem Brain because of a CLOUD Act constraint cannot have their prompt leave the box just because the local model OOM'd.

**Implementation.**
- The Surface's deploy manifest **MUST** declare the Brain as `cloud_fallback: false` (per `DWS_DEPLOYMENT_STANDARD.md` §6 Brain declaration).
- On failure, the Brain returns an explicit error to the agent. The agent surfaces the error to the user. **Do not retry against a cloud API.**
- The OpenClaw runtime is the canonical example: per `DWS_DEPLOYMENT_STANDARD.md` v1.4, OpenClaw declares `nemotron-3-super` primary + `qwen3-coder:30b` fast, **no cloud fallback by design.**

**Permitted cloud reach.**
- Frontier APIs (`FRONTIER-CLAUDE-SONNET`, `FRONTIER-CLAUDE-OPUS`) **MAY** be used for Defence workloads **only when explicitly named in the Loadout Table cell**, never as a silent fallback.
- All such use is logged per §11.

---

## 10. Approval & Evaluation Gate

A new model joins the Slate, or an existing one changes status, only by passing this gate.

**Inputs required.**
1. **Empirical evidence** — a field note in `docs/field-notes/` documenting first-hand testing on at least one DWS hardware target (3090, 5090, Veriton GN-100, or DGX Spark). The 2026-05-18 field note is the reference example.
2. **License & provenance review** — origin entity, weights license, redistribution terms. CN-origin models require an additional defence-segment carve-out statement.
3. **Bench against the incumbent** — on the standing DWS agent eval set (`evals/`; seed: `evals/industry_baseline.jsonl`, scored by `infrastructure/llm-training/scripts/evaluate.py`), the candidate must beat or match the incumbent for the cell it targets. Regressions block promotion.
4. **Article 12 lineage check** — confirm the model's invocations can be logged per `DWS_ARTICLE_12_LOGGING_STANDARD.md`.

**Decision.**
- Promotion to ✅ Active requires: evidence + license + bench-win + Art. 12.
- Promotion to 📋 Adopted requires: evidence + license. Bench may be pending.
- Demotion to ⚠️ Deprecated requires: a replacement Slate ID and a sunset date ≥ 90 days out.

**Owner.** Risto Anton Päärni (interim) — Model Standard owner. Engineering team votes on regressions.

---

## 11. Logging & Article-12 Binding

Every Brain invocation **MUST** be logged per `DWS_ARTICLE_12_LOGGING_STANDARD.md`. The Model Standard contributes these fields to the log envelope:

- `model.slate_id` — the Slate ID from §3 (e.g. `SOVEREIGN-STEP-3.5`).
- `model.origin` — EU / US / CN / DWS.
- `model.tier` — T1 / T2 / T3 / T4 / T5.
- `model.cloud_fallback` — `true` / `false`.
- `selection.jurisdiction` — EU-Sovereign / US Cloud / UAE / ASEA.
- `selection.sensitivity` — Commercial / Regulated / Defence.
- `selection.room` — Control / Situation / n/a.

These fields make Brain selection auditable. An EU regulator asking "why did this agent reason on this customer's data with that model?" must get a reproducible answer from the logs.

---

## 12. Maintenance

- **Review cadence.** Monthly until V1 GA (12 Jun 2026), then quarterly.
- **Trigger for off-cycle review.** Any of: a new model passes the §10 gate; a Loadout cell needs to change; a jurisdiction adds (DWS IQ 7 expansion); an industry cluster's CN-sensitivity changes; a regulator publishes new guidance touching model origin.
- **Deprecation.** Mark `⚠️ Deprecated` with sunset date ≥ 90 days. Do not delete Slate rows — preserves audit trail.
- **Cross-doc updates.** Every Slate change **MUST** update `DWS_DEPLOYMENT_STANDARD.md` §3 + §6 in the same PR. Every loadout change **MUST** update `DWS_STANDARDS_LIBRARY.md` §4 row in the same PR if the integration story changes.

---

## 13. Related Documents

- `docs/field-notes/2026-05-18-models-worth-building-on-3090-5090-dgx-spark.md` — empirical basis (the 2026 Q2 hardware bench)
- `DWS_DEPLOYMENT_STANDARD.md` §3, §6 — per-Surface Brain assignments (consumer of this Slate)
- `DWS_SOVEREIGNTY_STANDARD.md` — sovereignty tier definitions
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` — invocation logging (mandatory binding per §11)
- `DWS_STANDARDS_LIBRARY.md` — registry entry for this standard
- `INDUSTRIES.md` — 25-industry registry (cluster source)
- `Firehorse/Control/README.md` — Control Room workload definition
- `Firehorse/Situation/README.md` — Situation Room workload definition
- `product-catalog/Firehorse/README.md` — 7 Firehorse use cases (binding source)
- `product-catalog/LWM/training-manual.md` — Lifetime World Model V1/V2 training basis
- `docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md` — 4-jurisdiction model
- `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` — NVFP4 quantization for in-house brain
- `docs/Ollama.md` — local inference plumbing
- `infrastructure/dgx-spark/*` — Spark deployment recipes
