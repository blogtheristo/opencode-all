---
name: firehorse-report-compliance
description: >
  Generates a Compliance Summary Report covering EU ETS, CBAM, CSRD, and EU AI
  Act status with scored gap list, cost estimates, deadline urgency, and
  remediation roadmap. Audit-ready with DocuSign attestation. Use when:
  "compliance report", "compliance summary", "regulatory status report",
  "ETS CBAM CSRD summary", "audit-ready compliance", "compliance gap report".
argument-hint: "company, industry, regulations to cover, reporting period"
allowed-tools: [Bash, Read]
---

# Firehorse Skillful Report — Compliance Summary Report

**Report type:** EU Compliance Summary (ETS + CBAM + CSRD + EU AI Act)
**Agent:** `src/firehorse/report-module.ts` (format: `compliance-summary`)
**Feeds from:** `src/agents/compliance.agent.ts` (deterministic scoring)
**API:** `POST /firehorse/reports/generate` with body `{"format":"compliance-summary","input":{"company":"...","regulations":["ETS","CBAM","CSRD"]}}`
**Signature:** DocuSign eSignature for audit submission

## What This Skill Knows

The definitive EU multi-regulation compliance report. Not a dashboard screenshot — an audit-ready document with deterministic scores, cited EU regulation text, and a legally attested remediation commitment.

## Report Structure

### Section 1: Compliance Score Dashboard

- Overall score: X/100 (deterministic, not LLM-estimated)
- Per-regulation scores with trend (vs. prior period)
- Critical gaps: count and severity classification

### Section 2: ETS Status

- Current allowance position (surplus/deficit in tCO2e)
- Free allocation received vs. verified emissions
- Auction purchase requirement and estimated cost at €65/tCO2e
- Surrender deadline status
- Risk: €100/tCO2e penalty per missing allowance

### Section 3: CBAM Status

- Annex I goods imported: CN codes, quantities, origin countries
- Declared vs. default carbon intensity per product
- Certificate obligation for current quarter
- Transitional period filing status (quarterly deadlines)
- Estimated CBAM cost: tonnes × (EU ETS price − origin country carbon price)

### Section 4: CSRD/ESRS Status

- ESRS E1 climate: data point coverage (X of 82 complete)
- Material topics assessment status
- Double materiality assessment completion
- Audit-ready data package status
- External verifier readiness checklist

### Section 5: EU AI Act (if applicable)

- High-risk AI system register
- Article 12 logging compliance status
- Risk management system documentation (Article 9)
- Human oversight protocol documentation

### Section 6: Remediation Roadmap

Priority actions ranked by regulatory risk × cost exposure:

| Priority | Action | Regulation | Deadline | Cost to fix | Risk if ignored |
| -------- | ------ | ---------- | -------- | ----------- | --------------- |
| 1        | ...    | ...        | ...      | €           | € penalty       |

### Section 7: Audit Package

- Data lineage for every scored metric
- EU regulation citation for every requirement
- Agent scoring methodology (deterministic, auditable)
- DocuSign attestation block

## Output Format

```json
{
  "format": "compliance-summary",
  "overallScore": 0-100,
  "scores": { "ets": number, "cbam": number, "csrd": number, "euAiAct": number },
  "criticalGaps": [{ "regulation": "", "gap": "", "penalty": number }],
  "etsPosition": { "allocated": number, "verified": number, "deficit": number, "cost": number },
  "cbamObligation": { "certificates": number, "estimatedCost": number },
  "csrdCoverage": { "complete": number, "total": 82, "gaps": number },
  "remediationRoadmap": [{ "priority": number, "action": "", "deadline": "", "cost": number }],
  "markdown": "full compliance report as markdown",
  "signed": boolean,
  "auditPackage": "data export"
}
```

## Validation Sources

- Reg. 2021/447 — ETS free allocation benchmarks
- Reg. 2023/956 — CBAM implementation
- Reg. 2023/1773 — CBAM default carbon values
- EFRAG ESRS 2023 final set — 82 disclosure requirements
- EU Reg. 2024/1689 — EU AI Act (Article 12)
- `src/compliance/scoring-engine.ts` — deterministic scoring logic
- `src/compliance/esrs-registry.ts` — 82 ESRS data points
- `src/compliance/emission-factors.ts` — ETS/CBAM validated factors
