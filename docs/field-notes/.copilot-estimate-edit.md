---
title: GPT-6 Luna/Sol/Astra Cost Estimate for V1 Product Completion
version: 1.0
status: Active
last_updated: 2026-09-28
source_control_url: "https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-09-28-gpt6-dgx-v1-completion-cost-estimate.md"
---

# GPT-6 Luna/Sol/Astra Cost Estimate for V1 Product Completion

---  
VERSION AND AGENT HISTORY  
---

- Version: 1.0 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-6-sol | Session: opencode/estimate | Date: 28.09.2026 | Changes: Created GPT-6 author + DGX OpenCode V1 completion cost estimate; OpenCode independently challenged the denominator and missing-cost assumptions. | Harness: GitHub Copilot CLI + OpenCode 1.18.33 on DGX + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

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

Estimation of GPT-6 model costs for completing DWS IQ V1 products using OpenCode on DGX Spark hardware. This estimate addresses the remaining work after Chapter 0 (2 sessions) leaving 49 sessions per the Plan.

## Ontology Tags

**Geography:** Espoo Finland, DGX Spark  
**Sector:** Software development, AI agent orchestration  
**Entities:** GPT-6 Luna, GPT-6 Sol, GPT-6 Astra, OpenCode, DGX Spark, V1 products  
**Temporal Context:** 2026-09-28, Plan-defined 51 sessions, Chapter 0 complete  
**Confidence:** Medium—direct pricing known, token ratios unmeasured

## The Story

The V1 product completion plan defines 51 sessions. Chapter 0 accounts for 2 sessions, leaving 49 sessions of remaining work. The user reported Claude estimated that most V1 products are 62% complete, though this denominator has not been verified against G0-G10. The estimate must evaluate cost for both the strict remainder (49 sessions) and a rounded 20-session sensitivity scenario.

## The Insight

OpenCode on DGX uses `scripts/loop-task.mjs` and `opencode-loop` for implementation. The cost structure must separate paid author/reviewer tokens (GPT-6) from DGX electricity consumption. Paid tokens are assumed to be 20% of a full cloud implementation session (unmeasured). The session-store reported cost field was not used as dollars; token counts were repriced.

## Cost Structure

### Executive Decision

Three GPT-6 models route tasks with different responsibilities:
- **Luna**: routine specs and reviews
- **Sol**: cross-system contracts, debugging, final synthesis
- **Astra**: escalation-only for architecture, concurrency, security failure modes

OpenCode on DGX implements via `loop-task.mjs` and `opencode-loop`. `scripts/loop-task.mjs` writes the acceptance spec; after it lands on main, opencode-loop creates/resumes the isolated worktree; implements, tests, commits, pushes, opens PR. GPT Sol reviews; Astra only for escalation. HIC merges/releases.

### Executive Table

| Scenario  | Paid GPT Authoring (USD) | DGX Electricity (EUR) |
|-----------|--------------------------|-----------------------|
| 20-session optimistic remainder | $6.60 | €1.92–€5.76 |
| 49-session readiness baseline   | $16.16 | €4.70–€14.11 |

**Currency separation explanation:** Paid GPT authoring is billed in USD to GitHub; DGX electricity is EUR to Lifetime Oy Finnish utility provider. The tables keep currencies separate intentionally.

### Denominators

- Plan defines 51 sessions total
- Chapter 0 complete: 2 sessions
- Strict remainder: 49 sessions
- 20-session optimistic: round(51 × 0.38) = 20 only if denominators match; used for sensitivity analysis

### Official GitHub Pricing (per 1M tokens)

Source: https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing read 2026-09-28

| Model    | Input (USD) | Cached Input (USD) | Cache Write (USD) | Output (USD) |
|----------|-------------|--------------------|-------------------|--------------|
| Luna     | $0.10       | $0.01              | $0.125            | $0.50        |
| Sol      | $2.00       | $0.20              | $2.50             | $10.00       |
| Astra    | $10.00      | $1.00              | $12.50            | $50.00       |

### Telemetry Repricing Facts

- One Luna heavy session: $0.212
- Sol session: $1.671 and $2.134; average $1.902
- Astra same average mix: $9.512 (every Astra rate is 5× Sol)

### Sensitivity Analysis

Assumption: paid author/reviewer tokens are 20% of full cloud implementation session (unmeasured).

| Parameter | Values |
|-----------|--------|
| Sensitivity | 10%, 20%, 30% of author share |

## MODEL-ONLY Tables

Each column assumes that one model handles all paid authoring for all sessions.

### 20-Session MODEL-ONLY

| Mix        | Luna (USD) | Sol (USD) | Astra (USD) |
|------------|------------|-----------|-------------|
| 10%        | $0.42      | $3.80     | $19.02      |
| 20%        | $0.85      | $7.61     | $38.05      |
| 30%        | $1.27      | $11.41    | $57.07      |
| 100% full  | $4.24      | $38.05    | $190.24     |

### 49-Session MODEL-ONLY

| Mix        | Luna (USD) | Sol (USD) | Astra (USD) |
|------------|------------|-----------|-------------|
| 10%        | $1.04      | $9.32     | $46.61      |
| 20%        | $2.08      | $18.64    | $93.22      |
| 30%        | $3.12      | $27.96    | $139.82     |
| 100% full  | $10.40     | $93.22    | $466.08     |

**Note:** These tables assume pure model routing. Mixed routing weighted across models produces different totals.

## Recommended Mixed Routing

### 20% Author Share (Recommended)

**60% Luna / 30% Sol / 10% Astra**
- 20-session: $6.60
- 49-session: $16.16

**Quality-heavy 20% / 60% / 20%**
- 20-session: $12.34
- 49-session: $30.24

These are weighted mixes, unlike the MODEL-ONLY tables which assume full allocation to a single model.

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

## Exclusions & Risks

### Exclusions

- Hardware depreciation (unknown purchase basis, residual, lifetime, allocable hours)
- Human labour
- Claude/Grok specialist review
- Cloud services
- Retries/rework
- Exchange rate fluctuations

### Risks

- Denominator uncertainty (62% V1 completion unverified against G0-G10)
- Task duration variance (token ratio unmeasured)
- Quality/routing efficiency (model mix sensitivity)
- Dependency cascade (PR reviews, merges)
- Credit expiry (promotional credit may reduce cash outlay only if balance remains unused before expiry; economic usage still reported)

## Workflow

GPT Luna authors spec/checks; `scripts/loop-task.mjs` writes the acceptance spec; after it lands on main, opencode-loop creates/resumes the isolated worktree; implements, tests, commits, pushes, opens PR; GPT Sol reviews; GPT Astra only for escalation; HIC merges/releases.

## Learning

| Item | Status | Details |
|------|--------|---------|
| KB | N/A | Task-specific; no KB update required |
| Field note | Complete | This file |
| Learn | Complete | Rendered to `Learn/2026-09-28-gpt6-dgx-v1-completion-cost-estimate.html` |
| Drive | N/A | No connector; repo is source-of-truth |
| HIC decision | Complete | User directed opencode-loop; see Next Steps |
| Calendar | N/A | No new date; existing credit expiration already governed |

## State

OpenCode independently challenged denominator and missing costs.

**Insight:** Completion definition dominates token price; measure author-token ratio and DGX wall power over first five sessions.

## Next Steps

**These are decisions already taken/actions, not questions.**

1. Use 49-session baseline for commitment
2. Keep 20-session sensitivity for buffer analysis
3. Deploy opencode-loop for future implementation
4. Measure first five sessions to calibrate author-token ratio and DGX wall power
5. Escalation policy: Astra only for architecture, concurrency, security failure modes

---

**Document version:** v1.0 · **Date:** 28.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
