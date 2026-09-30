---
title: Observed Cloud and DGX Cost Estimate for V1 Product Completion
version: 1.2
status: Active
last_updated: 2026-09-28
source_control_url: "https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-09-28-gpt6-dgx-v1-completion-cost-estimate.md"
---

# Observed Cloud and DGX Cost Estimate for V1 Product Completion

---

## VERSION AND AGENT HISTORY

- Version: 1.2 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-6-sol | Session: opencode/estimate | Date: 28.09.2026 | Changes: Added the exact 81-product price-list-to-V1-readiness crosswalk (72 scored, 9 explicitly unscored); replaced the disproven $16.16/$25 forecast with observed 48-hour usage, GitHub throughput, current G0-G10 readiness scores, and DGX-offload scenarios. | Harness: GitHub Copilot CLI + OpenCode 1.18.33 on DGX + CLAUDE.md + AGENTS.md | HIC-approved-drift: none
- Version: 1.1 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-6-sol | Session: opencode/estimate | Date: 28.09.2026 | Changes: Replaced the disproven $16.16/$25 forecast with observed 48-hour usage, GitHub throughput, current G0-G10 readiness scores, and DGX-offload scenarios. | Harness: GitHub Copilot CLI + OpenCode 1.18.33 on DGX + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

## Provenance

| Field              | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Tool               | GitHub Copilot CLI 1.0.88                                            |
| Model              | openai/gpt-6-sol                                                     |
| Session            | opencode/estimate                                                    |
| Date               | 28.09.2026                                                           |
| Harness            | GitHub Copilot CLI + OpenCode 1.18.33 on DGX + CLAUDE.md + AGENTS.md |
| HIC-approved-drift | none                                                                 |

## Document Status

| Field               | Value       |
| ------------------- | ----------- |
| Created             | 2026-09-28  |
| Last Modified       | 2026-09-28  |
| Language            | English     |
| Languages Available | English     |
| Publication Status  | ACTIVE      |
| Classification      | INTERNAL    |
| Owner               | Lifetime Oy |

## Date

2026-09-28T00:00:00Z

## Author

GitHub Copilot CLI 1.0.88 (copilot@lifetime.fi)

## Location

Espoo Finland / DGX Spark

## Context

Observed-cost estimate for completing DWS IQ V1 products using paid models for specifications and review, with OpenCode on DGX Spark performing implementation. This version supersedes the unsupported $16.16/$25 forecast.

## Ontology Tags

**Geography:** Espoo Finland, DGX Spark
**Sector:** Software development, AI agent orchestration
**Entities:** GitHub Copilot, GPT-5.6 Sol, GPT-6 Sol, Claude Sonnet 5, Claude Opus 5, OpenCode, opencode-loop, DGX Spark, V1 products
**Temporal Context:** 2026-09-27 to 2026-09-28; 48-hour observed window
**Confidence:** High for observed usage and GitHub counts; medium for completion forecast because readiness-point gain per PR is not yet measured

## The Story

The HIC reported spending about $120 of Copilot cloud capacity and 250 Claude credits while moving roughly 150 PRs in one day. Repository and session telemetry supports the central claim: this was a high-throughput, high-burn sprint, not a $25 completion programme.

In the exact 48-hour window, 98 PRs were created, 84 merged, 133 updated, and 147 commits landed on `main`. Visible model telemetry reprices to $194.76 at GitHub's published token rates. The earlier estimate used three small GPT-6 CLI sessions and assumed, without evidence, that paid author/reviewer work would consume only 20% of cloud implementation tokens. That assumption excluded the actual cloud-agent loops and is invalid.

The latest report-only G0-G10 scorer in PR #2194 changes the readiness baseline:

| Scope                              | Products | Average MVP |                     Average V1 | Remaining product-equivalents |
| ---------------------------------- | -------: | ----------: | -----------------------------: | ----------------------------: |
| Current public catalogue in scorer |       72 |         66% |                          52.1% |                          34.5 |
| All live products                  |      137 |         64% |                          49.1% |                          69.7 |
| Price-list v1.33                   |       81 |           — | Exact average pending 9 scores |                     34.5–43.5 |

The 81-product price-list snapshot and the 72-product current scorer are different catalogue cuts. They must not be blended silently. The former 62% estimate implied 30.78 incomplete product-equivalents; the exact crosswalk below shows 34.5 incomplete equivalents among the 72 scored products plus an unknown 0–9 equivalents for the unscored products.

## Price-List v1.33 Product Readiness Crosswalk

This is the requested product-level reference. The immutable price-list snapshot contains 81 products. Seventy-two IDs match the current G0-G10 scorer; nine do not have a score and are marked **Not scored** rather than assigned an inferred percentage.

|   # | Price-list ID                   | Product                                                        |   V1 readiness |
| --: | ------------------------------- | -------------------------------------------------------------- | -------------: |
|   1 | `LIFETIME-IT-TUKI-10H`          | IT Support Hour Bank for SMEs — 10 h                           |            55% |
|   2 | `LIFETIME-WEBSTORE-MINI`        | Small Online Store with Price List                             |            55% |
|   3 | `LIFETIME-WEB-STARTER`          | Website Starter — Modern Business Site                         |            55% |
|   4 | `DWS-AEGIS-001`                 | DWS IQ Aegis                                                   |            56% |
|   5 | `DWS-IQ-FREE-2026`              | DWS IQ Free — 1 project, CSRD-ready                            |            55% |
|   6 | `DWS-AEGIS-PILOT-001`           | DWS IQ Aegis Pilot (3 months)                                  |            56% |
|   7 | `DWS-IQ-006`                    | Lifetime DWS IQ Platform (Version 6)                           |            57% |
|   8 | `DWS-AEGIS-IMPL-001`            | DWS IQ Aegis Implementation Programme (3 phases)               |            56% |
|   9 | `LIFETIME-BUNDLE-2026`          | Climate Reporting Starter Bundle                               |            57% |
|  10 | `FH-RPT-001`                    | DWS IQ Report                                                  |            50% |
|  11 | `DWS-US-STARTER`                | DWS IQ — US Cloud Starter                                      |            55% |
|  12 | `DWS-US-PILOT`                  | DWS IQ — US Cloud Pilot                                        |            55% |
|  13 | `KYA-JEV-001`                   | kya-jev — KYA-Gated Typed Decisions (Early Access)             |            56% |
|  14 | `DWS-CLIMATE-001`               | DWS IQ Climate Intelligence                                    |            55% |
|  15 | `DWS-SOVEREIGN-DB-001`          | Sovereign Database — EU Data Sovereignty for PostgreSQL        |            55% |
|  16 | `DWS-EU-STARTER`                | DWS IQ — EU Sovereign Starter                                  |            55% |
|  17 | `DWS-EU-PILOT`                  | DWS IQ — EU Sovereign Pilot                                    |            55% |
|  18 | `DWS-AEGIS-SUB-001`             | DWS IQ Aegis — Maintenance Subscription                        |            55% |
|  19 | `DWS-IQ-ESS-SUB-MANAGED`        | DWS IQ Essentials — Managed                                    | **Not scored** |
|  20 | `DWS-IQ-ESS-SUB-SELF`           | DWS IQ Essentials — Self-Hosted                                | **Not scored** |
|  21 | `DWS-IQ-ESS-SETUP`              | DWS IQ Essentials — Setup                                      |            54% |
|  22 | `DWS-IQ-SUB-001`                | DWS IQ Monthly Subscription                                    | **Not scored** |
|  23 | `FH-OMNI-001`                   | Firehorse Omnichannel Next                                     |            50% |
|  24 | `omnichannel-multimodal`        | Firehorse Omnichannel & Multimodal AI Assistant                |            50% |
|  25 | `FH-SIGN-001`                   | Firehorse Signed Reports                                       |            50% |
|  26 | `FH-CMS-001`                    | Firehorse Content Management                                   |            50% |
|  27 | `FH-AUTO-001`                   | Firehorse Amplify                                              |            50% |
|  28 | `firehorse-data-services`       | Firehorse Data Services                                        |            50% |
|  29 | `firehorse-flow`                | AI Customer Agent                                              |            50% |
|  30 | `conversational-agent`          | EU-Hosted Conversational Agent                                 |            50% |
|  31 | `FH-SUB-001`                    | Firehorse Monthly Subscription                                 | **Not scored** |
|  32 | `LF-ONTOLOGY-25`                | European Industry Ontology, 25 industries                      | **Not scored** |
|  33 | `LWM-ONT-SOVEREIGN`             | European Industry Ontology — Sovereign on-prem pack            | **Not scored** |
|  34 | `AIS-EU-SOV-OC`                 | EU-Sovereign AI Migration — Per Workload                       |            55% |
|  35 | `ai-consulting-agentic`         | Agentic Software Development for EU Teams                      |            62% |
|  36 | `AIS-OUTCOME-PILOT`             | Outcome-Priced Applied-AI Pilot (6 weeks)                      |            55% |
|  37 | `ai-consultant-day`             | Captain Day — One-Day AI Outcome                               |            62% |
|  38 | `business-mentor-30`            | Claude Code AI Coaching — 30 Hours                             |            62% |
|  39 | `consulting-fit55`              | Consulting Fit for 55 Specialist                               |            63% |
|  40 | `devops-lead`                   | Assessment                                                     |            62% |
|  41 | `firehorse-coach`               | EU AI Act Literacy Training                                    |            62% |
|  42 | `lean-project`                  | EU AI Project Accelerator (Fixed Price)                        |            62% |
|  43 | `sovereignty-cloud-consulting`  | Sovereignty Cloud Consulting – European Cloud Migration        |            62% |
|  44 | `ai-koulutus-3d`                | AI Koulutus 3 Days Programme                                   |            62% |
|  45 | `claude-code-coaching-3day`     | Claude Code Coaching — Lecture + Workshop (3 Days)             |            62% |
|  46 | `claude-code-coaching-lecture`  | Claude Code Coaching — 1-Day Lecture                           |            62% |
|  47 | `claude-code-coaching-workshop` | Claude Code Coaching — 2-Day Workshop                          |            62% |
|  48 | `claude-code-coaching-project`  | Claude Code Coaching — Client Project Work                     |            62% |
|  49 | `LF-ONTOLOGY-PILOT`             | Independent Ontology Pilot, one site                           | **Not scored** |
|  50 | `LF-TRAIN-IND`                  | Ontology Implementation and Organisation (site configuration)  | **Not scored** |
|  51 | `aws-consultancy`               | EU-Sovereign AI Engineering & Cloud Consultancy                |            62% |
|  52 | `ai-agent-engineering`          | AI & Agent Engineering — Outcome-Backed Hourly                 |            62% |
|  53 | `consulting-hourly`             | Senior Compliance Specialist — Retainer + Outcomes             |            63% |
|  54 | `edge-node-gn100`               | Control Room — Acer Veriton GN100                              |            50% |
|  55 | `LF-SITROOM-001`                | Situation Room — Two Sovereign AI Nodes                        |            50% |
|  56 | `LF-COMPLIANCE-AMBULANCE-001`   | DWS IQ Compliance Ambulance — Mobile Office (NVIDIA Thor Edge) |            50% |
|  57 | `LF-NVIDIA-INSTALL`             | NVIDIA Model Installation + Full Service                       |            50% |
|  58 | `LF-JETSON-NANO`                | Jetson Sensor Node — Orin Nano Super + Install & Service       |            50% |
|  59 | `LF-JETSON-AGX`                 | Jetson Sensor Concentrator — AGX Orin 64GB + Install & Service |            50% |
|  60 | `LF-DGX-SPARK`                  | DGX Spark — NVIDIA-Branded Sovereign Edge AI                   |            50% |
|  61 | `LF-JETSON-NX`                  | Jetson Sensor Mid — Orin NX 16 GB + Install & Service          |            50% |
|  62 | `LF-IGX-ORIN`                   | IGX Orin — Industrial / Medical Sovereign Edge AI              |            50% |
|  63 | `LF-K8S-T1`                     | Kubernetes Orchestration — Single-Node k3s (Tier 1)            |            40% |
|  64 | `LF-K8S-T2`                     | Kubernetes Orchestration — HA Cluster k3s (Tier 2)             |            40% |
|  65 | `LF-K8S-T3`                     | Kubernetes Orchestration — Gov Ready RKE2 (Tier 3)             |            40% |
|  66 | `LF-K8S-T4`                     | Kubernetes Orchestration — Full Infra Stack (Tier 4)           |            40% |
|  67 | `LF-DOCA-ESSENTIAL`             | DOCA Microservices — Essential Package                         |            40% |
|  68 | `LF-DOCA-SECURITY`              | DOCA Microservices — Security & Compliance Package             |            40% |
|  69 | `LF-DOCA-NETWORK-STORAGE`       | DOCA Microservices — Networking & Storage Acceleration Package |            40% |
|  70 | `LF-GOV-READY-SETUP`            | Government Ready Cluster Setup                                 |            40% |
|  71 | `LF-GOV-READY-ANNUAL`           | Government Ready Annual Maintenance                            |            40% |
|  72 | `LF-GOV-AIRGAP-BUNDLE`          | Air-Gapped Gov Ready Image Bundle                              |            40% |
|  73 | `LF-FIPS-VALIDATION`            | FIPS 140-3 Validation Service                                  |            40% |
|  74 | `LF-NIM-STARTER`                | NIM Microservices — Starter Profile                            |            40% |
|  75 | `LF-NIM-RETRIEVAL`              | NIM Microservices — Retrieval & Embedding Profile              |            40% |
|  76 | `LF-NIM-CODE`                   | NIM Microservices — Code Generation Profile                    |            40% |
|  77 | `LF-NIM-BIOLOGY`                | NIM Microservices — Biology & Genomics Profile                 |            40% |
|  78 | `LF-IPCMAX-IPC409`              | iPCMax IPC-409 — Compact Fanless Sensor Gateway                |            50% |
|  79 | `LF-IPCMAX-IPCP68`              | iPCMax IPC-P68 — Vision Gateway with PoE                       |            50% |
|  80 | `LF-IPCMAX-CINCOZE-DA1200`      | Cincoze DA-1200 — Rugged Expandable Edge Computer              |            50% |
|  81 | `LF-SOV-MODEL-SUB`              | Sovereign Model Updates Subscription                           | **Not scored** |

**Crosswalk result:** 72/81 scored products average 52.1% V1. The nine unscored products are `DWS-IQ-ESS-SUB-MANAGED`, `DWS-IQ-ESS-SUB-SELF`, `DWS-IQ-SUB-001`, `FH-SUB-001`, `LF-ONTOLOGY-25`, `LWM-ONT-SOVEREIGN`, `LF-ONTOLOGY-PILOT`, `LF-TRAIN-IND`, and `LF-SOV-MODEL-SUB`. Until those are scored, the exact 81-product average is unknown. Its mathematical bound is 46.3% if all nine score 0%, or 57.4% if all nine score 100%; remaining work is therefore 34.5–43.5 product-equivalents.

## The Insight

`opencode-loop` makes local implementation tokens marginally free; it does not make the completion programme free. Paid models are still used for decomposition, architecture, acceptance criteria, difficult debugging, review, and cloud backlog work. G7 production operations and G10 witnessed customer acceptance cannot be bought with tokens alone.

## Observed 48-Hour Evidence

### GitHub throughput

| Measure                  | Count |
| ------------------------ | ----: |
| PRs created              |    98 |
| PRs merged               |    84 |
| PRs updated              |   133 |
| PRs closed               |    84 |
| Commits landed on `main` |   147 |

These counts validate the HIC's statement that approximately 150 PRs moved when “moved” includes more than merged PRs.

### Token repricing

Token fields were repriced from uncached input, cached input, cache write, and output tokens. The session-store `cost` field was not treated as dollars.

| Model             |     Calls | Repriced cost |
| ----------------- | --------: | ------------: |
| GPT-5.6 Sol       |     1,877 |       $149.64 |
| GPT-5.6 Luna      |       274 |         $0.52 |
| GPT-6 Sol         |        88 |         $3.07 |
| GPT-6 Luna        |        75 |         $0.18 |
| Claude Sonnet 5   |       769 |        $23.56 |
| Claude Opus 5     |       151 |        $17.78 |
| **Total visible** | **3,234** |   **$194.76** |

GPT-family usage reprices to $153.42 and Claude-family usage to $41.34. The HIC separately observed about $120 of Copilot billing and 250 Claude credits. Claude credits are not recorded as $250 because their currency conversion has not been verified.

## Completion-Cost Forecast

### Run-rate projection

The readiness programme had 49 nominal sessions remaining. Fourteen of the 19 visible 48-hour sessions were associated with `blogtheristo/dws6`.

| Basis                           | Calculation           | Projected remaining usage |
| ------------------------------- | --------------------- | ------------------------: |
| Visible token-price run rate    | $194.76 / 14 × 49     |                   $681.66 |
| GPT-family component            | $153.42 / 14 × 49     |                   $536.97 |
| HIC-observed Copilot billing    | $120 / 14 × 49        |                about $420 |
| HIC-observed Claude consumption | 250 credits / 14 × 49 |  about 875 Claude credits |

This is an order-of-magnitude forecast, not a quote. It assumes the remaining sessions resemble the observed sprint and does not prove that every PR gained the same readiness points.

### DGX offload scenarios

For planning, paid work is split into a 20% specification/review floor and 80% implementation/rework. Shifting implementation to DGX changes the paid fraction as `20% + 80% × (1 − offload)`.

| DGX share of implementation | Paid-cloud fraction | Token-priced projection |
| --------------------------: | ------------------: | ----------------------: |
|                         40% |                 68% |                    $463 |
|                         60% |                 52% |                    $354 |
|                         80% |                 36% |                    $245 |

The observed sprint was already mixed local/cloud work, so these are sensitivities, not guaranteed savings.

### Recommended budget

| Budget                                   |          Amount | Meaning                                                             |
| ---------------------------------------- | --------------: | ------------------------------------------------------------------- |
| Paid-model working range                 | **$500–$1,400** | One to two equivalent passes of the remaining programme             |
| Operating target with strong DGX offload |   **$300–$700** | Paid specifications, reviews, and escalations; local implementation |
| Hard planning envelope                   |      **$1,500** | Stop-and-review ceiling before more cloud spend                     |
| DGX electricity                          |      **€5–€20** | Tariff and wall power still unmeasured                              |

The recommended cash envelope is **about $1,000, capped at $1,500**, plus low tens of euros of DGX electricity. This is not €660,000: that was annualized customer list value, not engineering cost. It is also not $25.

## What Money Cannot Close

- G7 requires production deployment, observability, and exercised runbooks.
- G10 requires witnessed customer acceptance and signed evidence packs.
- Chapter 7 Kubernetes, DOCA, Gov Ready, and NIM products remain around 40% V1 because profiles contain unresolved pins and have not been deployed.
- Hardware products need supplier, warranty, burn-in, handover, and RMA evidence.

Paid models and DGX loops can make software evidence ready for acceptance; they cannot manufacture operational or customer acceptance evidence.

## GPT and DGX Routing

| Work                                                       | Default executor                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| Routine triage and small specifications                    | Luna-class paid model                                        |
| Cross-system specification, architecture, difficult review | Sol-class paid model                                         |
| Security/architecture escalation after repeated failure    | Astra/Opus-class paid model                                  |
| Implementation, tests, retry loop                          | DGX OpenCode via `scripts/loop-task.mjs` and `opencode-loop` |
| Merge and release decision                                 | HIC                                                          |

## DGX Electricity Cost

Official NVIDIA DGX Spark hardware specification: 240W per https://docs.nvidia.com/dgx/dgx-spark/hardware.html

Assumptions:

- 4 hours/session
- Electricity sensitivity: EUR 0.10–0.30/kWh (planning sensitivity; not a sourced tariff)
- Session power: 0.96 kWh (240W × 4h)

### Calculations

| Scenario   | kWh       | EUR Range    |
| ---------- | --------- | ------------ |
| 20-session | 19.2 kWh  | €1.92–€5.76  |
| 49-session | 47.04 kWh | €4.70–€14.11 |

**Note:** Ceiling not measured power; actual consumption may differ.

## Exclusions and Uncertainty

- Human labour, customer participation, supplier work, cloud infrastructure, and hardware procurement.
- Exchange-rate conversion: GitHub prices are USD; no unsourced USD/EUR rate is applied.
- Claude credit monetary value is unverified.
- PR count is throughput, not readiness-point gain.
- PR #2194's G0-G10 scorer is report-only and still open.
- The 49-session plan is a work-package count, not a calibrated effort estimate.

## Learning

| Item         | Status   | Details                                                                          |
| ------------ | -------- | -------------------------------------------------------------------------------- |
| KB           | N/A      | Task-specific correction; canonical facts remain in cost and readiness artefacts |
| Field note   | Complete | This file                                                                        |
| Learn        | Complete | Rendered to `Learn/2026-09-28-gpt6-dgx-v1-completion-cost-estimate.html`         |
| Drive        | N/A      | No connector; repo is source-of-truth                                            |
| HIC decision | Complete | HIC directed opencode-loop and rejected the unsupported $25 estimate             |
| Calendar     | N/A      | No new date; existing credit expiration already governed                         |

## Next Steps

1. Record readiness-point deltas before and after each future 48-hour sprint.
2. Route implementation to DGX and reserve cloud spend for specification, review, and escalation.
3. Stop and reassess at the $1,500 paid-model ceiling.
4. Close G7 and G10 with real deployment and witnessed acceptance evidence.

---

**Document version:** v1.2 · **Date:** 28.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
