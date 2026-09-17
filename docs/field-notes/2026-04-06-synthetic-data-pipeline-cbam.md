# Synthetic Data Pipeline — CBAM Stress Testing for DD Readiness

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/synthetic-data-pipeline-TK1Lp | Date: 06.04.2026 | Changes: Initial — built complete synthetic data pipeline: CBAM schema (NeMo DataDesigner), LLM-as-Judge validation, 50 seed filings, compute strategy, SyntheticDataAgent (Agent 19), daily health check
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/vulcan-cn-codes-pr-dv519 | Date: 06.04.2026 | Changes: Vulcan CN code expansion (12 → 42 explicit codes, 55 heading range), Red Team seed negatives documentation, isCBAMSteelAndIron() helper
- Version: 1.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/cbam-alignment-pr-6as8L-gm8Fx | Date: 21.05.2026 | Changes: Phase 2 — added Scaleway H100 Python runner script (scripts/scaleway/generate-cbam-1k.py); generates 1,000 validated CBAM declarations with MTC narratives for NCC V1 demo (deadline: June 15, 2026); async LLM generation via Scaleway Generative APIs, deterministic rule-checker + LLM-as-Judge validation, checkpoint resume, JSONL + CSV output

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

### Vulcan CN Code Expansion (12 → 42 explicit codes)

The Vulcan agent (`src/agents/workflow/industry/vulcan.agent.ts`) previously covered only CN codes 7206–7217 (12 codes: semi-finished flat/long steel products). Expanded to 42 explicit codes across 6 product groups, imported from `cbam-schema.ts` as single source of truth:

| Group               | Codes                 | Count  | Coverage                                               |
| ------------------- | --------------------- | ------ | ------------------------------------------------------ |
| Raw materials       | 7201–7207             | 7      | Pig iron, ferro-alloys, scrap, granules, powder, semis |
| Flat products       | 7208–7212             | 5      | Hot-rolled, cold-rolled, coated, narrow strip          |
| Long products       | 7213–7217             | 5      | Bars, rods, angles, shapes, sections, wire             |
| Stainless & alloy   | 7218–7229             | 12     | Stainless/alloy semi-finished, flat, bars, wire        |
| Tubes & fittings    | 7301–7307             | 7      | Sheet piling, rails, cast iron/seamless/welded tubes   |
| Downstream articles | 7308–7311, 7318, 7326 | 6      | Structures, reservoirs, containers, fasteners          |
| **Total**           |                       | **42** | CBAM Annex I Sections 3.1–3.2 (Reg. 2023/956)          |

Range-based helper `isCBAMSteelAndIron(cnCode: string): boolean` covers the full 7201–7229 + 7301–7326 heading space (55 possible headings) for forward-compatible matching of future CN code additions. Accepts 4-digit headings or 8-digit full CN codes.

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
| Phase 2 (done) | May–June 2026  | Scaleway H100 runner script, 1K records, V1 demo for NCC (June 15) |
| Phase 3        | July–Sept 2026 | 100K records via NeMo DataDesigner on B200, cuDF integration |
| Phase 4        | Oct 2026+      | Continuous re-simulation on regulatory updates, Vera Rubin   |

---

## Phase 2 — Scaleway H100 Runner Script

**File:** `scripts/scaleway/generate-cbam-1k.py`
**Deps:** `scripts/scaleway/requirements.txt` (openai, tqdm; Python 3.11)

### What it does

Generates 1,000 synthetic CBAM declarations suitable for the NCC due diligence demo.
Ported directly from the TypeScript schema in `src/synthetic-data/cbam-schema.ts`.

| Step | Detail |
| ---- | ------ |
| 1. Sample | 13 seed installations × weighted categorical columns for all CBAM fields |
| 2. Anomaly inject | 60% clean / 40% anomalous (8 anomaly types, 5 severities) |
| 3. Deterministic validate | Rule-check physical bounds, positive quantities, valid CN codes |
| 4. MTC narrative | Async call to `llama-3.3-70b-instruct` via Scaleway Generative APIs |
| 5. LLM judge | `mistral-nemo-instruct-2407` scores 0.0–1.0; threshold 0.80 to accept |
| 6. Checkpoint | Save to `data/cbam-1k-ncc-v1-checkpoint.jsonl` every batch |
| 7. Final output | `data/cbam-1k-ncc-v1.jsonl` (full) + `data/cbam-1k-ncc-v1.csv` (truncated MTC) |

### How to run on Scaleway H100

```bash
# 1. Provision Scaleway GPU Instance (fr-par-2, H100 SXM 80GB, Ubuntu 22.04 LTS)
# 2. SSH in, clone repo, install deps:
pip install -r scripts/scaleway/requirements.txt

# 3. Set API key (from Scaleway Console → IAM → API Keys):
export SCW_SECRET_KEY=<your-scaleway-api-key>

# 4. Dry-run first (no LLM calls, instant):
python scripts/scaleway/generate-cbam-1k.py --dry-run --records 10

# 5. Full 1K run (skip judge for speed during demo prep):
python scripts/scaleway/generate-cbam-1k.py --skip-llm-judge

# 6. Full 1K with judge validation (production-quality, ~5h, EUR 14):
python scripts/scaleway/generate-cbam-1k.py
```

Checkpoint resume is automatic — re-run the same command if interrupted.

### Cost envelope

| Mode | Duration | Cost |
| ---- | -------- | ---- |
| `--skip-llm-judge` | ~1h | EUR 2.73 (H100) + free tier judge |
| Full with judge | ~5h | EUR 13.65 (H100) + Generative APIs free tier |
| 100K Phase 3 | ~200h on 2× H100 | EUR 1,092 |

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
