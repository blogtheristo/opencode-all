---
title: Observed Cloud and DGX Cost Estimate for V1 Product Completion
version: 1.1
status: Active
last_updated: 2026-09-28
source_control_url: "https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-09-28-gpt6-dgx-v1-completion-cost-estimate.md"
---

# Observed Cloud and DGX Cost Estimate for V1 Product Completion

---
VERSION AND AGENT HISTORY
---

- Version: 1.1 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-6-sol | Session: opencode/estimate | Date: 28.09.2026 | Changes: Replaced the disproven $16.16/$25 forecast with observed 48-hour usage, GitHub throughput, current G0-G10 readiness scores, and DGX-offload scenarios. | Harness: GitHub Copilot CLI + OpenCode 1.18.33 on DGX + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

## Provenance

| Field       | Value                                                                 |
|-------------|-----------------------------------------------------------------------|
| Tool        | GitHub Copilot CLI 1.0.88                                             |
| Model       | openai/gpt-6-sol                                                      |
| Session     | opencode/estimate                                                     |
| Date        | 28.09.2026                                                            |
| Harness     | GitHub Copilot CLI + OpenCode 1.18.33 on DGX + CLAUDE.md + AGENTS.md |
| HIC-approved-drift | none                                                            |

## Document Status

| Field              | Value          |
|--------------------|----------------|
| Created            | 2026-09-28     |
| Last Modified      | 2026-09-28     |
| Language           | English        |
| Languages Available| English        |
| Publication Status | ACTIVE         |
| Classification     | INTERNAL       |
| Owner              | Lifetime Oy    |

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

| Scope | Products | Average MVP | Average V1 | Remaining product-equivalents |
| --- | ---: | ---: | ---: | ---: |
| Current public catalogue in scorer | 72 | 66% | 52.1% | 34.5 |
| All live products | 137 | 64% | 49.1% | 69.7 |
| HIC's 81-product scope at the same 52.1% rate | 81 | — | 52.1% | 38.8 |

The 81-product price-list snapshot and the 72-product current scorer are different catalogue cuts. They must not be blended silently. The former 62% estimate implied 30.78 incomplete product-equivalents; current scored public V1 readiness implies 34.5 for 72 products or 38.8 if extrapolated to 81.

## The Insight

`opencode-loop` makes local implementation tokens marginally free; it does not make the completion programme free. Paid models are still used for decomposition, architecture, acceptance criteria, difficult debugging, review, and cloud backlog work. G7 production operations and G10 witnessed customer acceptance cannot be bought with tokens alone.

## Observed 48-Hour Evidence

### GitHub throughput

| Measure | Count |
| --- | ---: |
| PRs created | 98 |
| PRs merged | 84 |
| PRs updated | 133 |
| PRs closed | 84 |
| Commits landed on `main` | 147 |

These counts validate the HIC's statement that approximately 150 PRs moved when “moved” includes more than merged PRs.

### Token repricing

Token fields were repriced from uncached input, cached input, cache write, and output tokens. The session-store `cost` field was not treated as dollars.

| Model | Calls | Repriced cost |
| --- | ---: | ---: |
| GPT-5.6 Sol | 1,877 | $149.64 |
| GPT-5.6 Luna | 274 | $0.52 |
| GPT-6 Sol | 88 | $3.07 |
| GPT-6 Luna | 75 | $0.18 |
| Claude Sonnet 5 | 769 | $23.56 |
| Claude Opus 5 | 151 | $17.78 |
| **Total visible** | **3,234** | **$194.76** |

GPT-family usage reprices to $153.42 and Claude-family usage to $41.34. The HIC separately observed about $120 of Copilot billing and 250 Claude credits. Claude credits are not recorded as $250 because their currency conversion has not been verified.

## Completion-Cost Forecast

### Run-rate projection

The readiness programme had 49 nominal sessions remaining. Fourteen of the 19 visible 48-hour sessions were associated with `blogtheristo/dws6`.

| Basis | Calculation | Projected remaining usage |
| --- | --- | ---: |
| Visible token-price run rate | $194.76 / 14 × 49 | $681.66 |
| GPT-family component | $153.42 / 14 × 49 | $536.97 |
| HIC-observed Copilot billing | $120 / 14 × 49 | about $420 |
| HIC-observed Claude consumption | 250 credits / 14 × 49 | about 875 Claude credits |

This is an order-of-magnitude forecast, not a quote. It assumes the remaining sessions resemble the observed sprint and does not prove that every PR gained the same readiness points.

### DGX offload scenarios

For planning, paid work is split into a 20% specification/review floor and 80% implementation/rework. Shifting implementation to DGX changes the paid fraction as `20% + 80% × (1 − offload)`.

| DGX share of implementation | Paid-cloud fraction | Token-priced projection |
| ---: | ---: | ---: |
| 40% | 68% | $463 |
| 60% | 52% | $354 |
| 80% | 36% | $245 |

The observed sprint was already mixed local/cloud work, so these are sensitivities, not guaranteed savings.

### Recommended budget

| Budget | Amount | Meaning |
| --- | ---: | --- |
| Paid-model working range | **$500–$1,400** | One to two equivalent passes of the remaining programme |
| Operating target with strong DGX offload | **$300–$700** | Paid specifications, reviews, and escalations; local implementation |
| Hard planning envelope | **$1,500** | Stop-and-review ceiling before more cloud spend |
| DGX electricity | **€5–€20** | Tariff and wall power still unmeasured |

The recommended cash envelope is **about $1,000, capped at $1,500**, plus low tens of euros of DGX electricity. This is not €660,000: that was annualized customer list value, not engineering cost. It is also not $25.

## What Money Cannot Close

- G7 requires production deployment, observability, and exercised runbooks.
- G10 requires witnessed customer acceptance and signed evidence packs.
- Chapter 7 Kubernetes, DOCA, Gov Ready, and NIM products remain around 40% V1 because profiles contain unresolved pins and have not been deployed.
- Hardware products need supplier, warranty, burn-in, handover, and RMA evidence.

Paid models and DGX loops can make software evidence ready for acceptance; they cannot manufacture operational or customer acceptance evidence.

## GPT and DGX Routing

| Work | Default executor |
| --- | --- |
| Routine triage and small specifications | Luna-class paid model |
| Cross-system specification, architecture, difficult review | Sol-class paid model |
| Security/architecture escalation after repeated failure | Astra/Opus-class paid model |
| Implementation, tests, retry loop | DGX OpenCode via `scripts/loop-task.mjs` and `opencode-loop` |
| Merge and release decision | HIC |

## DGX Electricity Cost

Official NVIDIA DGX Spark hardware specification: 240W per https://docs.nvidia.com/dgx/dgx-spark/hardware.html

Assumptions:
- 4 hours/session
- Electricity sensitivity: EUR 0.10–0.30/kWh (planning sensitivity; not a sourced tariff)
- Session power: 0.96 kWh (240W × 4h)

### Calculations

| Scenario | kWh    | EUR Range  |
|----------|--------|------------|
| 20-session | 19.2 kWh | €1.92–€5.76 |
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

| Item | Status | Details |
|------|--------|---------|
| KB | N/A | Task-specific correction; canonical facts remain in cost and readiness artefacts |
| Field note | Complete | This file |
| Learn | Complete | Rendered to `Learn/2026-09-28-gpt6-dgx-v1-completion-cost-estimate.html` |
| Drive | N/A | No connector; repo is source-of-truth |
| HIC decision | Complete | HIC directed opencode-loop and rejected the unsupported $25 estimate |
| Calendar | N/A | No new date; existing credit expiration already governed |

## Next Steps

1. Record readiness-point deltas before and after each future 48-hour sprint.
2. Route implementation to DGX and reserve cloud spend for specification, review, and escalation.
3. Stop and reassess at the $1,500 paid-model ceiling.
4. Close G7 and G10 with real deployment and witnessed acceptance evidence.

---

**Document version:** v1.1 · **Date:** 28.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
