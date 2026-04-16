---
name: compliance
description: >
  EU regulatory compliance scoring for Fit for 55, ETS, CBAM, CSRD, and EU AI
  Act. Produces scored gap lists, cost estimates, deadline urgency, and
  remediation roadmaps. Use when: "compliance check", "am I compliant", "CSRD
  status", "ETS obligations", "CBAM reporting", "Fit for 55", "regulatory gap",
  "compliance score", "carbon cost estimate".
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
  "complianceScore": 0-100,
  "gapList": [{"regulation": "", "gap": "", "severity": "critical|high|medium"}],
  "costEstimate": { "ets": number, "cbam": number, "total": number },
  "deadlineUrgency": [{"regulation": "", "deadline": "date", "daysRemaining": number}],
  "auditReport": "markdown",
  "recommendations": ["string"]
}
```

## When to Use

- Annual compliance assessment for industrial companies
- Pre-acquisition due diligence (carbon liability)
- Board reporting on regulatory exposure
- CSRD data gap identification before reporting deadline
- CBAM transitional period filings (quarterly, due by Jan/April/July/Oct)

## Standards References

- EU Reg. 2021/447 — ETS free allocation benchmarks (product benchmarks Annex I)
- EU Reg. 2023/956 — CBAM (Carbon Border Adjustment Mechanism)
- EU Reg. 2023/1773 — CBAM default values for carbon intensity
- EFRAG ESRS 2023 final set — 82 European Sustainability Reporting Standards
- EUR-Lex 32023L2772 — CSRD (Corporate Sustainability Reporting Directive)
- EU Reg. 2024/1689 — EU AI Act (Article 12: logging for high-risk systems)
