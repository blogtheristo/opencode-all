# Synthetic Data Pipeline — CBAM Stress Testing for DD Readiness

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/synthetic-data-pipeline-TK1Lp | Date: 06.04.2026 | Changes: Initial — built complete synthetic data pipeline: CBAM schema (NeMo DataDesigner), LLM-as-Judge validation, 50 seed filings, compute strategy, SyntheticDataAgent (Agent 19), daily health check
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/vulcan-cn-codes-pr-dv519 | Date: 06.04.2026 | Changes: Vulcan CN code expansion (12 → 55 codes), Red Team seed negatives documentation, isCBAMSteelAndIron() helper

Session Links & References:

- Claude Code (claude/synthetic-data-pipeline-TK1Lp): https://github.com/blogtheristo/dws6/commits/claude/synthetic-data-pipeline-TK1Lp
- NVIDIA NeMo DataDesigner: https://github.com/NVIDIA-NeMo/DataDesigner.git
- NVIDIA Connect ISV Partner: docs/field-notes/2026-03-08-nvidia-connect-isv-approved.md
- GTC 2026 Impact: docs/field-notes/2026-03-16-nvidia-gtc-2026-keynote-dws-impact.md
- NVIDIA x Groq Deal: docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md

Document Status:

- Created: 06.04.2026
- Last Modified: 06.04.2026 (v1.1)
- Language: English
- Publication Status: ACTIVE

---

**Type:** Technical Architecture / DD Artifact
**Scope:** `src/synthetic-data/`, `src/agents/synthetic-data.agent.ts`, `scripts/daily/synthetic-data-health.ts`
**Related:** CBAM Regulation (EU) 2023/956, Implementing Regulation 2023/1773, Delegated Regulation 2025/2547

---

## Summary

Built the "Nervous System" — a synthetic data pipeline that generates, validates, and stress-tests CBAM declarations against the existing DWS IQ compliance agent swarm. This is the pivotal shift from storytelling to technical readiness for Series A DD.

The pipeline runs directly against the existing 8.6KB `cbam-calculator.ts` — confirmed integration, not a separate demo.

---

## What Was Built

### Artifact 1: CBAM Synthetic Schema (`src/synthetic-data/cbam-schema.ts`)

NeMo DataDesigner configuration for generating high-fidelity CBAM declarations:

| Component             | Detail                                                                                                |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| Installation profiles | 12 seed installations across 9 countries (TR, IN, CN, RU, EG, UA, VN, MA, SA, NO, BA, GB)             |
| CN codes              | All CBAM Annex I categories (cement, steel, aluminium, fertilizers, electricity, hydrogen)            |
| Column types          | SamplerColumnConfig, ExpressionColumnConfig, LLMTextColumnConfig, LookupColumnConfig                  |
| Anomaly injection     | 8 types (emission-energy mismatch, route mismatch, unverified low, default value inconsistency, etc.) |
| MTC narrative         | LLM-generated Mill Test Certificate comments with intentional discrepancies                           |
| Target                | 100,000 validated records                                                                             |

### Artifact 2: LLM-as-Judge Validation (`src/synthetic-data/llm-judge.ts`)

Two-stage quality gate:

1. **Deterministic validators** — rule-based checks against physical emission maximums, production route consistency, CBAM default value logic
2. **LLM judge** — Nemotron-4 340B scoring for regulatory fidelity (5 criteria, min 0.95)
3. **Calculator integration** — every synthetic record processed through `calculateCBAM()` from the real production calculator

### Artifact 3: Seed Dataset (`src/synthetic-data/seed-dataset.ts`)

50 hand-vetted CBAM filings as NeMo DataDesigner ground truth:

| Sector         | Seeds | Emission Range      | Source                                 |
| -------------- | ----- | ------------------- | -------------------------------------- |
| Steel (BF-BOF) | 10    | 1.85–2.65 tCO2e/t   | World Steel Association 2024, IEA 2024 |
| Steel (EAF)    | 5     | 0.50–0.85 tCO2e/t   | World Steel Association 2024           |
| Steel (DRI)    | 5     | 1.15–1.45 tCO2e/t   | World Steel Association 2024, IEA 2024 |
| Aluminium      | 8     | 0.50–18.00 tCO2e/t  | IAI GHG Data 2024                      |
| Cement         | 7     | 0.58–0.80 tCO2e/t   | GCCA GNR 2024                          |
| Fertilizers    | 5     | 1.75–3.10 tCO2e/t   | IFA 2024, CBAM defaults                |
| Hydrogen       | 5     | 0.50–10.50 tCO2e/t  | IEA Global Hydrogen Review 2024        |
| Electricity    | 5     | 0.21–1.10 tCO2e/MWh | EEA 2024, DESNZ 2024                   |

### Artifact 4: Compute Strategy (`src/synthetic-data/compute-strategy.ts`)

NVIDIA AI Enterprise stack architecture as NVIDIA Connect ISV Partner:

| Node                      | Role                     | Status     | Residency |
| ------------------------- | ------------------------ | ---------- | --------- |
| DGX Spark (Acer GN100)    | Edge inference + sandbox | Active     | EU        |
| Scaleway EU               | Primary inference        | Active     | EU        |
| Google Cloud Run (FI)     | Orchestration            | Active     | EU        |
| Groq Cloud                | US fallback              | Active     | US        |
| NVIDIA NIM (EU)           | Strategic inference      | Planned    | EU        |
| NeMo DataDesigner cluster | Generation               | Planned    | EU        |
| Groq 3 LPX (EU)           | Real-time audit          | Evaluation | EU        |

### Agent 19: SyntheticDataAgent (`src/agents/synthetic-data.agent.ts`)

Registered in agent registry with 6 actions:

- `health-check` — verify pipeline ↔ calculator integration
- `run-pipeline` — deterministic validation on all 50 seeds
- `validate-record` — single record validation
- `simulation-matrix` — compute full combination matrix (96 base × 1000 variations)
- `dd-summary` — investor due diligence summary
- `seed-analytics` — seed dataset statistics

### Red Team Seed Negatives (5 adversarial filings in `seed-dataset.ts`)

The 50 clean seeds are ground truth — but a pipeline that only validates correct data proves nothing. 5 Red Team negatives are designed to break naive validators:

| #   | Name                   | Attack Vector                                                                       | Expected Outcome                                                    |
| --- | ---------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Greenwash Steel        | BF-BOF installation claims 0.42 tCO2e/t (EAF-level emissions from a blast furnace)  | REJECT — emission-energy mismatch, physically impossible for BF-BOF |
| 2   | Ghost Precursor Cement | Cement plant with 0.00 tCO2e/t precursor emissions despite clinker production       | REJECT — zero precursor on clinker route violates thermodynamics    |
| 3   | Dirty Grid Aluminium   | Smelter claims 2.50 tCO2e/t with 0.95 tCO2e/MWh grid factor (should be ~16 tCO2e/t) | REJECT — indirect emissions impossibly low for given grid factor    |
| 4   | Hydrogen Hallucination | Grey hydrogen (SMR) claims 0.80 tCO2e/t (green hydrogen levels)                     | REJECT — SMR process minimum ~9 tCO2e/t without CCS                 |
| 5   | Rounding Fraud         | Steel filing with emissions rounded to exactly 1.000000 tCO2e/t                     | REJECT — suspiciously precise, likely fabricated value              |

These negatives are critical for DD: they prove the LLM-as-Judge + deterministic validator pipeline catches real-world fraud patterns, not just format errors.

### Vulcan CN Code Expansion (12 → 52 codes)

The Vulcan agent (`src/agents/workflow/industry/vulcan.agent.ts`) previously covered only CN codes 7206–7217 (12 codes: semi-finished flat/long steel products). This was expanded to the full CBAM Annex I steel & iron scope:

| Range     | Count  | Coverage                                                                                                 |
| --------- | ------ | -------------------------------------------------------------------------------------------------------- |
| 7201–7229 | 29     | Chapter 72: pig iron, ferro-alloys, scrap, granules, all flat-rolled, bars, wire, stainless, alloy steel |
| 7301–7326 | 26     | Chapter 73: sheet piling, rails, tubes, fittings, structures, containers, chain, fasteners, castings     |
| **Total** | **55** | Full CBAM Annex I Sections 3.1–3.2 (source: Reg. 2023/956 Annex I)                                       |

New exported helper: `isCBAMSteelAndIron(cnCode: string): boolean` — accepts 4-digit headings or 8-digit full CN codes, returns true if within CBAM steel & iron scope.

### Daily Health Check (`scripts/daily/synthetic-data-health.ts`)

Auto-discovered by DGX Spark day-runner. Validates all 50 seeds daily, alerts if emission factors drift or calculator interface breaks.

---

## Integration Verification

The critical question: **does the CBAM schema + synthetic data pipeline run against the existing compliance agent?**

**YES.** The pipeline:

1. Imports `calculateCBAM()` from `src/compliance/cbam-calculator.ts`
2. Imports `CBAM_DEFAULT_FACTORS` from `src/compliance/emission-factors.ts`
3. Converts synthetic records to `CBAMDeclaration` type (same interface the ComplianceAgent uses)
4. Validates calculator output (non-negative costs, non-negative emissions)
5. SyntheticDataAgent is registered alongside ComplianceAgent in the same registry

This means V1 demo for NCC is possible with existing code — no integration gap.

---

## Roadmap

| Phase          | Timeline       | Deliverable                                                  |
| -------------- | -------------- | ------------------------------------------------------------ |
| Phase 1 (done) | April 2026     | 50 seeds + deterministic validation + agent registration     |
| Phase 2        | May–June 2026  | NIM judge deployment, 1K records, V1 demo for NCC (June 15)  |
| Phase 3        | July–Sept 2026 | 100K records via NeMo DataDesigner on B200, cuDF integration |
| Phase 4        | Oct 2026+      | Continuous re-simulation on regulatory updates, Vera Rubin   |

---

## CBAM Technical Specs Status

**Do we have the CBAM Technical Specifications (XML/JSON structures required by the EU Authorisation Management Module)?**

Partially. We have:

- All CN codes from CBAM Annex I (mapped in `cbam-schema.ts`)
- Declaration data fields from Reg. 2023/956 Art. 6 and Implementing Reg. 2023/1773
- Installation-level data requirements (ID, country, production route, emission factors)
- Default emission values from CBAM transitional phase
- Verification methodology standards (ISO 14064-3, EU MRV 2018/2066)

We do NOT yet have:

- The exact XML schema of the EU CBAM Transitional Registry API (not publicly released as machine-readable)
- The definitive CBAM registry submission format (Commission has not published technical specs)
- CBAM certificate purchase API specification

**Risk:** Low. The EU Commission planned a machine-readable CBAM API for 2026 but it is not yet live. Our schema is built from the regulation text itself and can be adapted when the API spec is published.

---

_The Nervous System has its first 50 nerve endings. The 10,000-year simulation is the extrapolation._

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
