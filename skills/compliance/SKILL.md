---
name: compliance
description: "EU regulatory compliance scoring: Fit for 55, ETS, CBAM, CSRD, AI Act. Produces gap lists, cost estimates, deadline urgency, remediation roadmaps."
argument-hint: "industry, regulations, annual emissions (tCO2e), import value (EUR)"
allowed-tools: [Bash, WebSearch]
---

# Compliance — EU Regulatory Expertise Skill

**Domain:** EU climate & AI regulation compliance
**Agent:** `src/agents/compliance.agent.ts`
**CLI:** `dws run compliance --input '{"industry":"construction","regulations":["ETS","CBAM","CSRD"]}'`
**Scoring engine:** `src/compliance/scoring-engine.ts`

## What This Skill Knows

7+ years of EU compliance iteration, covering the Fit for 55 package in full:

### Regulation Coverage

| Regulation                                | Scope                                                                                                     | DWS Source                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| EU ETS (Emissions Trading System)         | Free allocation benchmarks, cap thresholds, auction obligations                                           | `src/compliance/ets-calculator.ts`, Reg. 2021/447  |
| CBAM (Carbon Border Adjustment Mechanism) | Import carbon intensity, CN codes (Annex I: cement, steel, aluminium, fertilisers, electricity, hydrogen) | `src/compliance/cbam-calculator.ts`, Reg. 2023/956 |
| CSRD (Corporate Sustainability Reporting) | 82 ESRS data points across E1–E5, S1–S4, G1                                                               | `src/compliance/esrs-registry.ts`, EFRAG ESRS 2023 |
| EU AI Act Article 12                      | Logging obligations for high-risk AI systems                                                              | `src/agents/article12-logger.ts`                   |
| EPBD (Energy Performance of Buildings)    | Building renovation waves, EPC requirements                                                               | —                                                  |

### Scoring Model

**Input → Score → Gap → Cost → Deadline → Report**

- Score range: 0–100 (deterministic, not LLM-generated)
- Gap list: specific missing data points per ESRS disclosure
- Cost estimate: ETS carbon price × gap tonnes + CBAM border adjustment
- Deadline urgency: days remaining to next regulatory reporting window

### Key Thresholds (validated sources)

| Threshold                             | Value                              | Source                |
| ------------------------------------- | ---------------------------------- | --------------------- |
| CBAM import value requiring reporting | > €150,000/year                    | Reg. 2023/956 Art. 35 |
| ETS free allocation (steel benchmark) | 1.328 tCO2e/t                      | Reg. 2021/447 Annex I |
| ETS carbon price (2024 avg)           | €65/tCO2e                          | EU ETS 2024 average   |
| CSRD mandatory for large companies    | > 500 employees OR > €50M turnover | CSRD Art. 19a         |
| ESRS disclosure count                 | 82 data points                     | EFRAG ESRS 2023 final |

## Input / Output Contract

**Input:**

```json
{
  "projectId": "string",
  "industry": "construction|steel|cement|aluminium|energy|...",
  "regulations": ["ETS", "CBAM", "CSRD", "EU_AI_ACT"],
  "currentMeasures": ["string"],
  "annualEmissions": number,
  "importValue": number,
  "dataPoints": { "esrsCode": "status" }
}
```

**Output:**

```json
{
  "overallScore": 0-100,
  "complianceStatus": "compliant|partially_compliant|non_compliant",
  "regulationScores": [
    { "regulation": "ETS|CBAM|CSRD|EU_AI_ACT", "score": 0-100 }
  ],
  "gaps": [{"regulation": "", "gap": "", "severity": "critical|high|medium"}],
  "deadlines": [{"regulation": "", "deadline": "date", "daysRemaining": number}],
  "costEstimates": { "ets": number, "cbam": number, "total": number },
  "report": "markdown",
  "recommendations": ["string"]
}
```

## When to Use

- Annual compliance assessment for industrial companies
- Pre-acquisition due diligence (carbon liability)
- Board reporting on regulatory exposure
- CSRD data gap identification before reporting deadline
- CBAM transitional period filings (quarterly, due by Jan/April/July/Oct)

## Latent vs Deterministic

| Step                                               | Where                                                    | Kind          |
| -------------------------------------------------- | -------------------------------------------------------- | ------------- |
| Score computation (0–100 per regulation)           | `src/compliance/scoring-engine.ts`                       | Deterministic |
| ETS allowance / CBAM certificate arithmetic        | `src/compliance/ets-calculator.ts`, `cbam-calculator.ts` | Deterministic |
| ESRS data-point coverage lookup                    | `src/compliance/esrs-registry.ts`                        | Deterministic |
| Gap severity judgment (critical/high/medium)       | LLM                                                      | Latent        |
| Cost-vs-risk prioritization in remediation roadmap | LLM                                                      | Latent        |
| Narrative / report markdown                        | LLM                                                      | Latent        |

Rule: do not ask the LLM to compute the compliance score. The score is a function of inputs and must match `scoring-engine.ts`.

## Standards References

- EU Reg. 2021/447 — ETS free allocation benchmarks (product benchmarks Annex I)
- EU Reg. 2023/956 — CBAM (Carbon Border Adjustment Mechanism)
- EU Reg. 2023/1773 — CBAM default values for carbon intensity
- EFRAG ESRS 2023 final set — 82 European Sustainability Reporting Standards
- EUR-Lex 32023L2772 — CSRD (Corporate Sustainability Reporting Directive)
- EU Reg. 2024/1689 — EU AI Act (Article 12: logging for high-risk systems)
