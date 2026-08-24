---
name: firehorse-report
description: "Generates a Firehorse Skillful Report. KIND=annual|board-pack|carbon|compliance — CSRD/ESRS annual, executive climate briefing, EN 15978 embodied carbon, ETS/CBAM/AI-Act gap."
argument-hint: "KIND=<annual|board-pack|carbon|compliance> COMPANY=<name> PERIOD=<period> [extra context]"
allowed-tools: [Bash, Read]
parameters:
  - name: KIND
    required: true
    enum: [annual, board-pack, carbon, compliance]
  - name: COMPANY
    required: true
  - name: PERIOD
    required: false
    note: fiscal year (annual), reporting period (board-pack/compliance), N/A for carbon
  - name: EXTRA
    required: false
    note: industry, materials list, BIM ref, regulations subset
steps:
  - id: load-data
    kind: deterministic
    do: Pull source data via `src/firehorse/report-module.ts` for given KIND/COMPANY/PERIOD
  - id: score
    kind: deterministic
    do: Compute scores (compliance 0-100, carbon kgCO2e, etc.) via `src/compliance/scoring-engine.ts` and `src/agents/material-oracle.agent.ts` — NO LLM ARITHMETIC
  - id: gap-analysis
    kind: latent
    do: Judge which gaps are material, which remediation actions to prioritize, why
  - id: narrative
    kind: latent
    do: Write the markdown narrative (executive summary, section text)
  - id: package
    kind: deterministic
    do: Assemble audit package, DocuSign attestation block, JSON output envelope
---

# Firehorse Skillful Report (unified)

**Agent:** `src/firehorse/report-module.ts`
**CLI:** `dws run firehorse-report --format <KIND> --input '{"company":"...","period":"..."}'`
**API:** `POST /firehorse/reports/generate` body `{"format":"<KIND>","input":{...}}`
**Signature:** DocuSign eSignature via `src/firehorse/signed-reports.ts` (board-pack, compliance)

## What This Skill Knows

One skill, four invocations. Same agent, same CLI, same API surface — different `KIND` parameter selects which section structure, scoring rules, and standards citations apply. Replaces 200+ hours of manual consultant-driven reporting per cycle.

The deterministic scoring (compliance score, carbon intensity, ETS position) lives in `src/compliance/*` and `src/agents/material-oracle.agent.ts`. The LLM never does the arithmetic; it judges materiality, writes narrative, and prioritizes remediation.

---

## KIND = annual

**Report type:** Annual Sustainability Report (CSRD/ESRS compliant)
**Format selector:** `annual-report`
**Validation:** 4-week workflow (data ingestion → draft → auditor package → sign-off)

### Section Structure (ESRS)

- **ESRS 2 — General Disclosures:** governance, strategy, double materiality, metrics & targets
- **ESRS E1 — Climate Change:** Scope 1/2/3 (from ETS/CBAM agent data), energy mix, physical & transition risks, Paris-aligned targets
- **ESRS E2–E5 (if material):** pollution, water, biodiversity, circular economy
- **ESRS S1 — Own Workforce:** EN 13001 / ISO 45001 (from SiteSense), working conditions, diversity
- **ESRS G1 — Business Conduct:** ethics, anti-corruption, supplier relationships

### 82 ESRS Data Points

Full registry at `src/compliance/esrs-registry.ts`. Each data point flagged ✅ available / ⚠️ estimated / ❌ gap.

### Output (additional fields)

```json
{
  "esrsCoverage": { "total": 82, "available": "number", "estimated": "number", "gaps": "number" },
  "scope1": "number",
  "scope2": "number",
  "scope3": "number",
  "euTaxonomyAlignment": "number",
  "auditorPackage": "data export for external verification"
}
```

### Standards

EFRAG ESRS 2023 final set · EU Dir. 2022/2464 (CSRD) · GRI Universal Standards 2021 · EU Reg. 2020/852 (Taxonomy) · TCFD.

---

## KIND = board-pack

**Report type:** Board Pack (climate compliance executive summary)
**Format selector:** `board-pack`
**Audience:** CFO, CEO, non-executive directors who sign regulatory liability

### Section Structure

1. **Executive Dashboard (1 page):** overall compliance score 0–100, RAG per regulation (ETS / CBAM / CSRD / EPBD), top 3 risks with EUR exposure, next 3 deadlines
2. **Regulatory Exposure Summary:** per-regulation status table
3. **Carbon Position:** Scope 1+2+3, ETS allowance position, CBAM liability, EN 15978 embodied carbon
4. **Remediation Roadmap:** top 5 actions ranked by cost/risk
5. **Audit Trail:** data lineage + DocuSign attestation

### Output (additional fields)

```json
{
  "complianceScore": "0-100",
  "ragStatus": { "ets": "green|amber|red", "cbam": "...", "csrd": "...", "epbd": "..." },
  "topRisks": [{ "regulation": "", "exposure": "number", "currency": "EUR" }],
  "upcomingDeadlines": [{ "regulation": "", "date": "", "daysRemaining": "number" }],
  "remediationRoadmap": [{ "action": "", "owner": "", "saving": "number" }]
}
```

### Standards

ESRS 2 (board oversight) · CSRD Art. 19a · GRI 305 · TCFD · DocuSign eSignature.

---

## KIND = carbon

**Report type:** EN 15978 Carbon Footprint Report (buildings / construction)
**Format selector:** `carbon-footprint`
**Feeds from:** `src/agents/material-oracle.agent.ts` (embodied carbon per material)

**Proof point:** 420 kgCO2e/m² for a hybrid concrete-timber office tower in Helsinki (NCC project data, Feb 2026, 5-hour DWS IQ session).

### Section Structure

1. **Project Summary:** building type, GFA, location, carbon intensity (kgCO2e/m²), Nordic benchmark
2. **Lifecycle Stages (A1–D):** breakdown table per EN 15978
3. **Material Breakdown:** top 10 by carbon contribution, each with ICE v3 / EC3 EPD factor and lower-carbon alternative
4. **CBAM Implications:** Annex I imports (steel/aluminium/cement) → certificate estimate at €65/tCO2e
5. **Improvement Pathway:** prioritized substitutions ranked by saving/cost

### Benchmark Data

| Building type        | Nordic avg (kgCO2e/m²) | Source                              |
| -------------------- | ---------------------- | ----------------------------------- |
| Office (concrete)    | 400–600                | Finnish Carbon Footprint Guide 2023 |
| Residential (timber) | 150–250                | RT 20-11395                         |
| Industrial hall      | 200–350                | EN 15978 EPD database               |
| Proof point          | 420                    | DWS IQ BIM pipeline, NCC, Feb 2026  |

### Output (additional fields)

```json
{
  "grossFloorArea": "number",
  "carbonIntensity": "number",
  "unit": "kgCO2e/m2",
  "stageBreakdown": {
    "A1-A3": "number",
    "A4": "number",
    "A5": "number",
    "B": "number",
    "C": "number",
    "D": "number"
  },
  "materialBreakdown": [{ "material": "", "kgCO2e": "number", "factor": "number", "source": "" }],
  "cbamImplications": { "applicable": "boolean", "certificateEstimate": "number" },
  "improvementPathway": [{ "action": "", "savingKgCO2e": "number", "savingPercent": "number" }],
  "epbdCompliant": "boolean"
}
```

### Standards

EN 15978:2011 · EN 15804:2012+A2:2019 · ICE Database v3.0 · EC3 · EPBD (EU Dir. 2024/1275, >1,000 m² by 2028) · RT 20-11395 · ISO 14040/14044.

---

## KIND = compliance

**Report type:** EU Multi-Regulation Compliance Summary (ETS + CBAM + CSRD + EU AI Act)
**Format selector:** `compliance-summary`
**Feeds from:** `src/agents/compliance.agent.ts` (deterministic scoring)

### Section Structure

1. **Compliance Score Dashboard:** overall + per-regulation, deterministic, trend vs prior period
2. **ETS Status:** allowance position, free allocation vs verified, auction need at €65/tCO2e, surrender deadline, €100/tCO2e penalty risk
3. **CBAM Status:** Annex I goods (CN codes, quantities, origin), declared vs default carbon intensity, certificate obligation, quarterly filing status
4. **CSRD/ESRS Status:** ESRS E1 climate coverage (X of 82), double materiality completion, auditor-readiness checklist
5. **EU AI Act (if applicable):** high-risk system register, Article 12 logging, Article 9 risk management, human oversight
6. **Remediation Roadmap:** priority × regulation × deadline × cost-to-fix × penalty risk
7. **Audit Package:** data lineage per metric, regulation citation per requirement, scoring methodology, DocuSign attestation

### Output (additional fields)

```json
{
  "overallScore": "0-100",
  "scores": { "ets": "number", "cbam": "number", "csrd": "number", "euAiAct": "number" },
  "criticalGaps": [{ "regulation": "", "gap": "", "penalty": "number" }],
  "etsPosition": {
    "allocated": "number",
    "verified": "number",
    "deficit": "number",
    "cost": "number"
  },
  "cbamObligation": { "certificates": "number", "estimatedCost": "number" },
  "csrdCoverage": { "complete": "number", "total": 82, "gaps": "number" },
  "remediationRoadmap": [{ "priority": "number", "action": "", "deadline": "", "cost": "number" }],
  "auditPackage": "data export"
}
```

### Standards

Reg. 2021/447 (ETS) · Reg. 2023/956 (CBAM) · Reg. 2023/1773 (CBAM defaults) · EFRAG ESRS 2023 · EU Reg. 2024/1689 (AI Act) · `src/compliance/scoring-engine.ts` · `src/compliance/esrs-registry.ts` · `src/compliance/emission-factors.ts`.

---

## Common Output Envelope

```json
{
  "format": "<KIND format selector>",
  "company": "string",
  "period": "string or null",
  "markdown": "full report as markdown",
  "signed": "boolean (board-pack and compliance only)",
  "...KIND-specific fields (see per-KIND output above)"
}
```

## Latent vs Deterministic — at a glance

| Step               | Where                                                          | Kind          |
| ------------------ | -------------------------------------------------------------- | ------------- |
| Data load          | `src/firehorse/report-module.ts`                               | Deterministic |
| Score / arithmetic | `src/compliance/scoring-engine.ts`, `material-oracle.agent.ts` | Deterministic |
| Gap materiality    | LLM judgment over scored data                                  | Latent        |
| Narrative draft    | LLM writes markdown sections                                   | Latent        |
| Output envelope    | `src/firehorse/report-module.ts`                               | Deterministic |
| Signature          | `src/firehorse/signed-reports.ts` → DocuSign                   | Deterministic |
