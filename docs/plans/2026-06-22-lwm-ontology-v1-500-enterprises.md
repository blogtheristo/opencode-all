# LWM Ontology V1 — 5,000 European Industrial Enterprises

---

# VERSION AND AGENT HISTORY

Version: 2.2

Sessions & Modifications:

- Version: 2.2 | Tool: Claude Code (claude-sonnet-5) | Session: claude/palantir-us-open-source-models-tsexbg | Date: 05.07.2026 | Changes: Stage 1 engine switched from Qwen3-Coder 30B (Alibaba, Chinese-origin) to Nemotron-TwoTower 30B-A3B (NVIDIA, U.S.-origin) per founder direction, following the Palantir/NVIDIA U.S. open-weight positioning (see `docs/field-notes/2026-07-05-nemotron-twotower-stage1-production-switch.md`). Updated §3 diagram, §3.1 engine spec, §3.4 economics (projected). Added §11.4 validation gate — throughput/VRAM/extraction-quality figures are NVIDIA's own aggregate benchmarks, not yet measured on this task; first post-switch industry run is the validation, with Qwen3-Coder documented as fallback.
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/lwm-ontology-v1-500-enterprises | Date: 22.06.2026 | Changes: Added Layer 6 (Commercial Intelligence) and Layer 7 (Investor Positioning) to ontology structure. Maps to DWS_ROLES_REGISTRY.md R01-R25 buying-journey stages. Ontology now feeds sales outreach (/investor-outreach, /sales skills) and investor materials directly.
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/lwm-ontology-v1-500-enterprises | Date: 22.06.2026 | Changes: Scale from 500 → 5,000 enterprises (200/industry). Revised 25-industry taxonomy (manufacturing/engineering focused). 3-stage pipeline (AI Workbench → Claude API → Sovereign training). Added LWM vs RAG vs KG comparison. Added LF-ONTOLOGY-25 and LF-TRAIN-IND SKUs.
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/lwm-ontology-v1-500-enterprises | Date: 22.06.2026 | Changes: Initial creation — 25-industry enterprise research plan, 500-enterprise target list methodology, deployment cadence (1/day × 500 days), remote update architecture, ontology data schema

Document Status:

- Created: 22.06.2026
- Last Modified: 05.07.2026
- Language: English
- Publication Status: DRAFT
- Document Type: Research & Deployment Plan
- Branch: `claude/lwm-ontology-v1-500-enterprises`

---

## Work Breakdown Structure

```
LWM Ontology V1 — 5,000 European Industrial Enterprises
│
├── 1. CONTEXT & OBJECTIVES                                    [v2.0]
│   ├── 1.1 Why 5,000 enterprises (200 per industry)
│   ├── 1.2 Why per-industry ontology
│   ├── 1.3 Revised 25-industry taxonomy
│   └── 1.4 Deployment cadence target: 1 customer/day × 500 days
│
├── 2. THE 25 INDUSTRIES (revised manufacturing taxonomy)      [v2.0]
│   ├── 2.1 Heavy Industry & Primary Processing (IDs 1-6)
│   ├── 2.2 Energy & Utilities (IDs 7-9)
│   ├── 2.3 Advanced Manufacturing (IDs 10-15)
│   ├── 2.4 Infrastructure & Built Environment (IDs 16-19)
│   └── 2.5 Frontier & Deep-Tech (IDs 20-25)
│
├── 3. 3-STAGE PIPELINE ARCHITECTURE                           [v2.0]
│   ├── 3.1 Stage 1: AI Workbench local preprocessing (Qwen3-Coder 30B)
│   ├── 3.2 Stage 2: Claude API JSON-LD ontology synthesis
│   ├── 3.3 Stage 3: Sovereign NVFP4 QLoRA fine-tuning on GB10
│   └── 3.4 Pipeline economics per industry
│
├── 4. LWM vs ALTERNATIVES (comparison framework)              [v2.0]
│   ├── 4.1 LWM Sovereign Ontology
│   ├── 4.2 Traditional RAG
│   ├── 4.3 Corporate Knowledge Graphs
│   └── 4.4 Why LWM wins for industrial Physical AI
│
├── 5. ENTERPRISE SELECTION METHODOLOGY                        [v1.0 → v2.0]
│   ├── 5.1 Selection criteria (scaled for 200/industry)
│   ├── 5.2 Data sources (Orbis, Eurostat, EBR, CSRD, patents)
│   ├── 5.3 Data schema per enterprise
│   └── 5.4 Output: Per-industry ontology file (JSON-LD/OWL/RDF)
│
├── 6. ONTOLOGY STRUCTURE (per industry, 7 layers)             [v1.0 → v2.1]
│   ├── 6.1 Domain concepts layer
│   ├── 6.2 Regulatory terms layer
│   ├── 6.3 Operational vocabulary layer
│   ├── 6.4 Process taxonomy layer
│   ├── 6.5 Compliance requirements layer
│   ├── 6.6 Commercial intelligence layer (sales outreach)     [v2.1]
│   └── 6.7 Investor positioning layer (investor outreach)     [v2.1]
│
├── 7. DEPLOYMENT CADENCE — 1 CUSTOMER/DAY × 500 DAYS         [v1.0 → v2.0]
│   ├── 7.1 Day-0 deployment checklist
│   ├── 7.2 Pipeline: 5 parallel tracks
│   ├── 7.3 Capacity checkpoints (scaled to 5,000 ontology base)
│   └── 7.4 Revenue model
│
├── 8. REMOTE UPDATE ARCHITECTURE                              [v1.0]
│   ├── 8.1 Update channels (LWM, agents, runtime)
│   ├── 8.2 Secure remote access (Cloudflare Tunnel, outbound-only)
│   ├── 8.3 Update agent (systemd, 6-hour check, auto-rollback)
│   ├── 8.4 Update policy (per customer YAML)
│   └── 8.5 Fleet management at scale (10→500 nodes)
│
├── 9. RESEARCH EXECUTION PLAN                                 [v2.0]
│   ├── 9.1 Phase 1: Heavy Industry & Primary (weeks 1-8)
│   ├── 9.2 Phase 2: Energy & Advanced Mfg (weeks 9-16)
│   ├── 9.3 Phase 3: Infrastructure & Frontier (weeks 17-24)
│   └── 9.4 Phase 4: Validation & curriculum generation (weeks 25-28)
│
├── 10. PRODUCT SKUs                                           [v2.0]
│   ├── 10.1 LF-ONTOLOGY-25 (25-Industry Ontology Package)
│   └── 10.2 LF-TRAIN-IND (Sovereign Training Service)
│
└── 11. VERIFICATION
    ├── 11.1 Ontology completeness checks
    ├── 11.2 Enterprise data quality (5,000 target)
    └── 11.3 Deployment pipeline dry-run
```

---

## 1. Context & Objectives

### 1.1 Why 5,000 Enterprises [v2.0]

Each LWM V1 fine-tune needs an industry ontology — the domain vocabulary, regulatory terms, and operational concepts that make the model useful for that industry. We build these ontologies by studying real European enterprises:

- **200 enterprises per industry** gives deep semantic coverage: enough to capture regional dialects (Nordic vs DACH vs Southern European operational vocabulary), sub-sector specializations, and regulatory nuance across the full EU landscape
- **5,000 total** (25 × 200) provides the most comprehensive European industrial ontology ever assembled for sovereign AI training
- The 10× scale over the original 500 pilot means each industry ontology captures not just the vocabulary of the top 20 giants, but the full spectrum from €100M mid-market to €100B+ conglomerates

### 1.2 Why Per-Industry Ontology

The sovereign training cascade (see `docs/DEPLOYMENT_ARCHITECTURE_ENTERPRISE.md`) works in stages:

```
Base Model → [Industry Ontology] → Location Fine-Tune → Factory Fine-Tune
                    ↑
            This plan builds these
```

The industry ontology is the **reusable** layer — every customer in the same industry starts from the same fine-tuned base. Location and factory layers are customer-specific. By investing in 25 high-quality industry ontologies backed by 200 enterprises each, we can deploy to any customer in that industry within days.

### 1.3 Revised 25-Industry Taxonomy [v2.0]

The v2.0 taxonomy is **manufacturing and engineering focused** — optimized for enterprises that operate physical plants, factories, and infrastructure where sovereign edge AI has the highest value. This differs from the INDUSTRIES.md canonical emissions-focused taxonomy by emphasizing operational complexity over regulatory categorization.

**Rationale:** The LWM ontology serves factory-floor AI. Industries are defined by what they build, process, and operate — not by which EU directive governs their emissions. A steel mill and a chemical plant share ETS exposure but have completely different operational vocabularies.

### 1.4 Deployment Cadence: 1 Customer/Day × 500 Days

Same as v1.0 — the 5,000-enterprise ontology base makes each deployment faster (richer pre-built vocabulary) without changing the hardware logistics bottleneck.

---

## 2. The 25 Industries (Revised Manufacturing Taxonomy)

### 2.1 Heavy Industry & Primary Processing (IDs 1-6)

| ID  | Industry                           | Target | Ontology Complexity                   | Key EU Regulations                 |
| --- | ---------------------------------- | ------ | ------------------------------------- | ---------------------------------- |
| 1   | Steel & Metallurgy                 | 200    | Very High (CBAM, ETS, DRI transition) | ETS, CBAM, CSRD, IED               |
| 2   | Forestry, Pulp & Paper             | 200    | High (LULUCF, bioeconomy)             | EUDR, LULUCF, RED III, CSRD        |
| 3   | Automotive & Heavy Transport Mfg   | 200    | Very High (Euro 7, ELV, battery)      | Euro 7, ELV Directive, Battery Reg |
| 4   | Aerospace & Defence                | 200    | Very High (CORSIA, dual-use)          | EU ETS aviation, CORSIA, ITAR/EAR  |
| 5   | Chemical Processing                | 200    | Very High (REACH, Seveso III)         | REACH, CLP, Seveso III, ETS        |
| 6   | Pharmaceutical & Bio-Manufacturing | 200    | High (GMP, MDR adjacent)              | GMP, ATMP, pharmacovigilance       |

**Subtotal: 1,200 enterprises**

### 2.2 Energy & Utilities (IDs 7-9)

| ID  | Industry                        | Target | Ontology Complexity             | Key EU Regulations             |
| --- | ------------------------------- | ------ | ------------------------------- | ------------------------------ |
| 7   | Maritime & Shipbuilding         | 200    | High (FuelEU, vessel LCA)       | FuelEU Maritime, EU ETS, MRV   |
| 8   | Power Generation & Nuclear      | 200    | Very High (ETS, nuclear safety) | ETS, EURATOM, RED III, EED     |
| 9   | Renewable Energy Infrastructure | 200    | High (RED III, grid codes)      | RED III, TEN-E, RfG grid codes |

**Subtotal: 600 enterprises**

### 2.3 Advanced Manufacturing (IDs 10-15)

| ID  | Industry                             | Target | Ontology Complexity             | Key EU Regulations                 |
| --- | ------------------------------------ | ------ | ------------------------------- | ---------------------------------- |
| 10  | Mining & Mineral Extraction          | 200    | High (CRM Act, extractive)      | CRM Act, Extractive Waste Dir, EIA |
| 11  | Industrial Automation & Robotics     | 200    | High (Machinery Reg, AI Act)    | Machinery Regulation, EU AI Act    |
| 12  | Construction & Civil Infrastructure  | 200    | Very High (lifecycle, EN 15978) | CPR, EPBD, EN 15978, taxonomy      |
| 13  | Food & Beverage Manufacturing        | 200    | Medium (supply chain, HACCP)    | General Food Law, HACCP, PPWR      |
| 14  | Glass, Ceramics & Building Materials | 200    | Medium (process emissions, EPD) | ETS, CPR, EPD standards            |
| 15  | Electronics & Semiconductor Fab      | 200    | High (Chips Act, RoHS, WEEE)    | EU Chips Act, RoHS, WEEE, REACH    |

**Subtotal: 1,200 enterprises**

### 2.4 Infrastructure & Built Environment (IDs 16-19)

| ID  | Industry                             | Target | Ontology Complexity         | Key EU Regulations               |
| --- | ------------------------------------ | ------ | --------------------------- | -------------------------------- |
| 16  | Oil & Gas Refining                   | 200    | High (decline pathway, SAF) | ETS, RED III, FQD, methane reg   |
| 17  | Textiles & Industrial Fabrics        | 200    | Medium (DPP, ESPR)          | ESPR, DPP, OEKO-TEX, REACH       |
| 18  | Water Treatment & Waste Management   | 200    | Medium (circular economy)   | UWWTD, WFD, Circular Economy pkg |
| 19  | Agricultural Machinery Manufacturing | 200    | Medium (precision farming)  | Machinery Regulation, CAP, CSRD  |

**Subtotal: 800 enterprises**

### 2.5 Frontier & Deep-Tech (IDs 20-25)

| ID  | Industry                             | Target | Ontology Complexity            | Key EU Regulations                 |
| --- | ------------------------------------ | ------ | ------------------------------ | ---------------------------------- |
| 20  | Telecom Infrastructure               | 200    | Medium (NIS2, 5G security)     | EECC, NIS2, 5G Toolbox             |
| 21  | Medical Devices Manufacturing        | 200    | Very High (MDR, IVDR, EUDAMED) | MDR, IVDR, EU AI Act (high-risk)   |
| 22  | High-Speed Rail & Transport Infra    | 200    | High (ERA, ERTMS, TEN-T)       | ERA interoperability, TEN-T, EIA   |
| 23  | Datacenter Infra & Thermal Mgmt      | 200    | Medium (EED Art.12, PUE/WUE)   | EED Art.12, EU CoC, taxonomy       |
| 24  | Battery & Energy Storage Cell Mfg    | 200    | Very High (Battery Reg, IPCEI) | Battery Regulation, CRM Act, IPCEI |
| 25  | Marine & Offshore Subsea Engineering | 200    | High (OSPAR, offshore safety)  | OSPAR, Offshore Safety Dir, MSP    |

**Subtotal: 1,200 enterprises**

**Grand total: 5,000 enterprises (25 × 200)**

---

## 3. 3-Stage Pipeline Architecture [v2.0]

The pipeline processes 5,000 enterprises into 25 sovereign industry ontologies using a hybrid local + API + on-prem architecture:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    3-STAGE ONTOLOGY PIPELINE                        │
│                                                                     │
│  Stage 1: LOCAL PREPROCESSING              DGX Spark / AI Workbench│
│  ┌─────────────────────────────────────┐                           │
│  │ Nemotron-TwoTower 30B-A3B (NVIDIA) │                           │
│  │ • Ingest: annual reports, CSRD,     │                           │
│  │   patents, equipment catalogs       │                           │
│  │ • Semantic filtering: extract       │                           │
│  │   domain terms, regulatory refs,    │                           │
│  │   process descriptions              │                           │
│  │ • Output: cleaned term candidates   │                           │
│  │   per enterprise (~500-2000 terms)  │                           │
│  └──────────────┬──────────────────────┘                           │
│                 │                                                    │
│  Stage 2: CLAUDE API SYNTHESIS             Cloud (Anthropic API)    │
│  ┌──────────────▼──────────────────────┐                           │
│  │ Claude (Opus/Sonnet)                │                           │
│  │ • JSON-LD ontology generation       │                           │
│  │ • OWL class hierarchy construction  │                           │
│  │ • RDF triple validation             │                           │
│  │ • Cross-enterprise deduplication    │                           │
│  │ • 5-layer ontology assembly         │                           │
│  │ • Output: validated industry        │                           │
│  │   ontology (JSON-LD + OWL/RDF)      │                           │
│  └──────────────┬──────────────────────┘                           │
│                 │                                                    │
│  Stage 3: SOVEREIGN FINE-TUNING            DGX Spark / AI Workbench│
│  ┌──────────────▼──────────────────────┐                           │
│  │ QLoRA on GB10 (NVFP4 quantization)  │                           │
│  │ • Ontology → synthetic training set │                           │
│  │   (~2000 examples per industry)     │                           │
│  │ • Fine-tune base model (8B or 70B)  │                           │
│  │ • Validate: ontology term recall    │                           │
│  │ • Package: customer-ready model     │                           │
│  └─────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.1 Stage 1: AI Workbench Local Preprocessing

**Engine:** Nemotron-TwoTower 30B-A3B (NVIDIA, diffusion LM adapted from Nemotron-3-Nano-30B-A3B) running on DGX Spark via AI Workbench — replaces Qwen3-Coder 30B as of 05.07.2026.

**Why the switch:**

- **Throughput:** NVIDIA's own benchmark reports 2.42× faster generation at 98.7% aggregate benchmark quality vs. the AR backbone it's adapted from.
- **Model-weight provenance:** Nemotron is a U.S.-origin (NVIDIA) open-weight model, replacing a Chinese-origin (Alibaba) model on the pipeline's single most confidentiality-sensitive stage — the one that exists specifically because it must never send enterprise data to a third party. This aligns DWS's sovereignty posture with model provenance, not only data residency, echoing Palantir's public U.S.-open-weight positioning (cf. `docs/field-notes/2026-07-05-nemotron-twotower-stage1-production-switch.md`).

**Not yet independently validated on this task.** The throughput and quality figures above are NVIDIA's own aggregate benchmarks, not a measurement on enterprise-document semantic filtering/entity extraction. The first production industry run after this switch serves as the validation — see §11.4. Qwen3-Coder 30B remains a documented fallback if VRAM or extraction quality don't hold up (see `docs/Ollama.md`, `scripts/daily/check-ollama-models.sh`).

**Input per enterprise:**

- Annual report PDF (extracted text)
- CSRD/sustainability report
- Patent filings (Espacenet bulk)
- Equipment catalogs and technical specs
- Industry association glossaries

**Processing:**

- Semantic filtering: identify domain-specific terms vs generic business language
- Entity extraction: products, processes, materials, equipment, regulations
- Relationship mapping: which terms co-occur in operational contexts
- Output: structured term candidates JSON (~500-2000 terms per enterprise)

**Why local:** The raw documents may contain confidential information (patent details, process IP). Local preprocessing means no enterprise data leaves the DGX Spark during the extraction phase.

**Throughput:** ~60 enterprises/hour projected (2.42× the prior ~25/hour Qwen3-Coder baseline) — unconfirmed until the first production run measures it directly, per §11.4.

**VRAM:** Unconfirmed on GB10. Nemotron-TwoTower ships ~60B total parameters across two towers (~3B active per tower per token) vs. Qwen3-Coder's single dense 30B (~18GB). Feasibility must be confirmed on first run; fall back to Qwen3-Coder for that batch if it doesn't fit, and record the fallback in the industry's provenance note (§11.4).

### 3.2 Stage 2: Claude API JSON-LD Ontology Synthesis

**Engine:** Claude API (Opus for complex industries, Sonnet for simpler ones)

**Input:** Aggregated term candidates from 200 enterprises in one industry

**Processing:**

- JSON-LD ontology generation with `@context` pointing to industry-specific namespace
- OWL class hierarchy: domain concepts → sub-concepts → instances
- RDF triple validation: every relationship machine-parseable
- Cross-enterprise deduplication: merge equivalent terms from different companies
- 5-layer assembly: domain, regulatory, operational, process, compliance

**Output:** Validated per-industry ontology file (JSON-LD primary, OWL/RDF exports)

**Cost:** ~€40-80 per industry (200 enterprises × ~2000 tokens each = ~400K input tokens)

**Why API:** Ontology synthesis requires world knowledge (EU regulation text, industry standards) that the local 30B model lacks. Claude sees only the extracted terms, never raw enterprise documents.

### 3.3 Stage 3: Sovereign NVFP4 QLoRA Fine-Tuning

**Engine:** QLoRA on GB10 via AI Workbench (NVFP4 quantization for 70B models, FP16 for 8B)

**Input:** Per-industry ontology → synthetic training examples

**Processing:**

- Generate ~2000 synthetic Q&A pairs per industry from the ontology
- QLoRA fine-tune: rank-16 adapters, 3-4 epochs, ~2-4 hours per industry
- Validation: ontology term recall test (target: >95% of domain terms recognized)
- Package: LoRA adapter + base model → customer-deployable artifact

**VRAM budget:**

- 8B model FP16: ~20GB → comfortable on 128GB
- 70B model NVFP4: ~40-50GB → fits but requires production stack teardown (mode-switch)

### 3.4 Pipeline Economics Per Industry

| Cost Component          | Per Industry (200 enterprises)                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Stage 1 local compute   | ~3.3 hours DGX Spark time projected (2.42× throughput; unconfirmed — see §11.4); ~8 hours if fallback to Qwen3-Coder is needed |
| Stage 2 Claude API      | ~€40-80 (Opus/Sonnet mix)                                                                                                      |
| Stage 3 QLoRA compute   | ~4 hours DGX Spark time (free, owned hardware)                                                                                 |
| Research labor          | ~40 hours (enterprise identification + data collection)                                                                        |
| **Total per industry**  | **~€60-100 API + ~47 hours projected (~52 hours if fallback)**                                                                 |
| **Total 25 industries** | **~€1,500-2,500 API + ~1,175 hours projected (~1,300 hours if fallback)**                                                      |

---

## 4. LWM vs Alternatives (Comparison Framework) [v2.0]

| Dimension                  | LWM Sovereign Ontology                           | Traditional RAG                            | Corporate Knowledge Graphs                     |
| -------------------------- | ------------------------------------------------ | ------------------------------------------ | ---------------------------------------------- |
| **Data residency**         | 100% on-prem (GB10)                              | Cloud vector DB (US/EU)                    | Cloud graph DB or on-prem                      |
| **Regulatory alignment**   | CSRD/ETS/CBAM terms baked into model weights     | Retrieved at query time, may miss context  | Manually maintained, drift-prone               |
| **Operational vocabulary** | 200 enterprises × 5 layers = deep domain fluency | Surface-level: whatever is in the chunk    | Schema-dependent: only what was modeled        |
| **Latency**                | <100ms (local inference)                         | 200-500ms (retrieval + LLM)                | 50-200ms (graph traversal)                     |
| **Update mechanism**       | QLoRA re-fine-tune (2-4 hours)                   | Re-embed documents (minutes-hours)         | Manual graph updates (days-weeks)              |
| **Hallucination risk**     | Low: constrained by fine-tuned vocabulary        | Medium: retrieval may miss, LLM fills gaps | Low for structured queries, N/A for generation |
| **Setup cost**             | €60-100 API + DGX Spark time per industry        | €500-2000/mo vector DB + embedding costs   | €50K-500K initial modeling + tooling           |
| **Moat**                   | Unreplicable: your data trained your model       | None: RAG stack is commodity               | Moderate: graph structure is IP but portable   |
| **Air-gap capable**        | Yes (full offline after fine-tune)               | No (needs cloud retrieval)                 | Partial (if on-prem graph DB)                  |
| **Scales to**              | 25 industries × unlimited customers              | Per-document, grows linearly               | Per-entity, grows with maintenance burden      |

### 4.4 Why LWM Wins for Industrial Physical AI

1. **Sovereignty is non-negotiable.** EU-regulated factories cannot send operational data to US cloud vector databases. LWM trains and runs entirely on-prem.
2. **Domain depth beats retrieval breadth.** A fine-tuned model that "knows" blast furnace terminology outperforms one that "retrieves" it from chunks.
3. **The moat compounds.** Each quarter of continuous improvement fine-tuning makes the customer's model more unique and more valuable — RAG chunks are replaceable, fine-tuned weights are not.
4. **Latency matters at the edge.** Factory-floor AI needs <100ms response. RAG's 200-500ms retrieval round-trip is too slow for real-time process control.

---

## 5. Enterprise Selection Methodology

### 5.1 Selection Criteria [v2.0]

For each industry, select 200 enterprises that:

1. **European HQ or major EU operations** — must have EU regulatory exposure
2. **Revenue > €50M** (lowered from €100M to capture the full industrial landscape at 200/industry)
3. **Publicly reporting** — CSRD, voluntary ESG, or annual reports available
4. **Operational diversity** — mix of:
   - Nordic (Finland, Sweden, Norway, Denmark) — home market
   - DACH (Germany, Austria, Switzerland) — largest industrial EU economy
   - Southern Europe (Italy, Spain, France) — manufacturing + construction
   - Central/Eastern Europe (Poland, Czech Republic, Romania) — growth markets
   - Benelux + UK + Ireland — financial, logistics, maritime hubs
5. **Sub-sector diversity** — within each industry, cover all major sub-segments (e.g., in Steel: flat products, long products, stainless, specialty, recycled)
6. **Include 10-20 "ontology outliers"** — companies doing unusual things that stretch the vocabulary

### 5.2 Data Sources [v2.0]

| Source                           | What it provides                                             | Access                 |
| -------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Orbis (Bureau van Dijk)          | Company financials, ownership, NACE codes for 400M+ entities | Licensed               |
| Eurostat SBS                     | Structural business statistics by NACE code                  | Public                 |
| European Business Register (EBR) | Cross-border company verification, LEI codes                 | Licensed/API           |
| CSRD disclosures (EFRAG ESRS)    | Sustainability reports, double materiality                   | Public (company sites) |
| Patent filings (Espacenet)       | Technology portfolios, process IP indicators                 | Public (EPO)           |
| Equipment catalogs               | Operational vocabulary, product taxonomies                   | Public/trade           |
| EU ETS Union Registry            | Verified emissions by installation                           | Public                 |
| CBAM Registry                    | Import declarations, product categories                      | Public (limited)       |
| Industry associations            | Sector glossaries, standards references                      | Public/member          |

### 5.3 Data Schema Per Enterprise

```json
{
  "id": "STEEL-001",
  "name": "ArcelorMittal",
  "hq_country": "LU",
  "industry_id": 1,
  "industry": "Steel & Metallurgy",
  "revenue_eur_m": 68300,
  "employees": 158000,
  "eu_facilities": ["Gent (BE)", "Dunkerque (FR)", "Bremen (DE)", "Fos-sur-Mer (FR)"],
  "eu_countries": ["BE", "FR", "DE", "ES", "PL", "CZ", "RO"],
  "sub_sector": "integrated steelmaker (flat + long products)",
  "regulatory_exposure": ["ETS", "CBAM", "CSRD", "RED III", "IED"],
  "csrd_reporting": true,
  "key_products": ["flat steel", "long steel", "tubular products"],
  "key_processes": ["blast furnace", "BOF", "EAF", "DRI", "hot rolling", "cold rolling"],
  "sustainability_initiatives": ["XCarb", "Smart Carbon", "DRI-EAF transition"],
  "patents_eu": 1250,
  "ontology_terms_extracted": 0,
  "data_quality": "pending",
  "source_urls": [],
  "notes": ""
}
```

### 5.4 Output: Per-Industry Ontology File (JSON-LD/OWL/RDF) [v2.0]

Each industry gets a structured ontology at `ontology/industries/{id}-{name}.json` in JSON-LD format with OWL class hierarchy:

```json
{
  "@context": {
    "lwm": "https://ontology.dws6.com/lwm/v1/",
    "owl": "http://www.w3.org/2002/07/owl#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "skos": "http://www.w3.org/2004/02/skos/core#"
  },
  "@type": "lwm:IndustryOntology",
  "industry_id": 1,
  "industry": "Steel & Metallurgy",
  "version": "1.0",
  "enterprises_studied": 200,
  "domain_concepts": {
    "@type": "owl:Class",
    "processes": ["blast furnace", "basic oxygen furnace", "electric arc furnace", "DRI", "HBI"],
    "materials": ["iron ore", "coking coal", "scrap steel", "pig iron", "slab", "billet"],
    "metrics": ["tCO2/tSteel", "specific energy consumption", "scrap ratio", "yield"]
  },
  "regulatory_terms": {
    "ets": ["free allocation", "benchmark", "carbon leakage", "auctioning"],
    "cbam": [
      "embedded emissions",
      "carbon price equivalent",
      "default values",
      "authorized declarant"
    ],
    "csrd": ["double materiality", "ESRS E1", "transition plan", "Scope 1/2/3"]
  },
  "operational_vocabulary": {
    "production": ["hot rolling", "cold rolling", "galvanizing", "pickling", "annealing"],
    "quality": ["grade", "tensile strength", "yield strength", "elongation"],
    "logistics": ["coil", "slab yard", "reheat furnace", "continuous casting"]
  },
  "process_taxonomy": ["ironmaking → steelmaking → casting → rolling → finishing → shipping"],
  "compliance_requirements": {
    "ets_scope": "Direct emissions from furnaces + indirect from purchased electricity",
    "cbam_products": ["iron and steel (CN 72), articles of iron and steel (CN 73)"],
    "csrd_sectors": ["ESRS sector-specific: Mining, quarrying and coal"]
  },
  "synthetic_training_seeds": []
}
```

---

## 6. Ontology Structure (Per Industry)

Each industry ontology has 7 layers, extracted from studying the 200 enterprises. Layers 1-5 power model fine-tuning; layers 6-7 power sales and investor outreach:

### 6.1 Domain Concepts Layer

Core nouns and entities of the industry: what they make, what they use, what they measure. Extracted from annual reports, product catalogs, and facility descriptions.

### 6.2 Regulatory Terms Layer

EU regulation vocabulary specific to this industry: which directives apply, what must be reported, what metrics are mandated. Extracted from CSRD reports, ETS benchmarks, and CBAM product lists.

### 6.3 Operational Vocabulary Layer

How practitioners talk about their work: process names, equipment, quality measures, safety terms. Extracted from technical documentation, sustainability reports, and industry association glossaries.

### 6.4 Process Taxonomy Layer

The value chain for this industry: raw material → processing → product → distribution → end-of-life. Extracted from LCA studies, product environmental footprints, and industry reference models.

### 6.5 Compliance Requirements Layer

What this industry must report and to whom: ETS obligations, CBAM product codes, CSRD sector standards, national transpositions. Extracted from EU legislation and national implementation.

### 6.6 Commercial Intelligence Layer (Sales Outreach) [v2.1]

Per-industry buying intelligence that feeds the `/sales` skills and per-customer INTRO/LETTER generation. Maps each industry to the DWS_ROLES_REGISTRY.md 25-role taxonomy:

**Structure per industry:**

```json
{
  "commercial_intelligence": {
    "door_1_role": "R02",
    "door_1_wedge": "Your CBAM disclosures are IP filings in disguise",
    "buying_journey_by_stage": {
      "strategic_sponsors": {
        "roles": ["R01", "R02", "R03", "R04"],
        "pain_points": [
          "IP leakage via mandatory disclosure",
          "R&D investment visibility in ESG reports"
        ],
        "value_proposition": "KYA-governed disclosure logic protects proprietary detail",
        "budget_holder": "R04"
      },
      "operational_owners": {
        "roles": ["R07", "R08", "R11", "R12"],
        "pain_points": ["Manual CSRD data collection across 15+ plants", "Scope 3 supplier forms"],
        "value_proposition": "80% reduction in compliance reporting time",
        "budget_holder": "R12"
      },
      "tech_approvers": {
        "roles": ["R13", "R14", "R15", "R16"],
        "pain_points": [
          "NIS2 exposure from cloud AI tools",
          "Data sovereignty for operational data"
        ],
        "value_proposition": "100% on-prem, CLOUD Act exempt, air-gap switchable",
        "budget_holder": "R13"
      },
      "commercial_drivers": {
        "roles": ["R17", "R18", "R19", "R20"],
        "pain_points": ["Compliance friction slows deal velocity", "Supplier scoring manual"],
        "value_proposition": "Sell more by removing compliance friction before the sale",
        "budget_holder": "R19"
      },
      "executive_sponsors": {
        "roles": ["R22", "R23", "R24", "R25"],
        "pain_points": ["Board ESG narrative credibility", "MSCI/Sustainalytics rating defense"],
        "value_proposition": "Auditable, sovereign, board-ready compliance posture",
        "budget_holder": "R22"
      }
    },
    "industry_specific_wedges": [],
    "competitive_alternatives": [],
    "typical_acv_range_eur": [50000, 200000],
    "sales_cycle_months": [3, 9],
    "procurement_path": "CIO-led with CSO sponsorship"
  }
}
```

**Extracted from:** Enterprise annual reports (org charts, executive bios), CSRD reports (materiality assessments = pain points), LinkedIn (role titles, team sizes), industry association events (buyer personas).

**Feeds into:**

- `sales-outreach/INTRO_*.md` generation — per-role, per-industry wedge selection
- `sales-outreach/LETTER_*.md` follow-ups — pain-point-specific deepening
- Agent `sales-outreach` skill — automated wedge-by-role matrix per prospect
- People database (`People/people_database.json`) enrichment

### 6.7 Investor Positioning Layer (Investor Outreach) [v2.1]

Per-industry market intelligence that feeds the `/investor-outreach` skill and investor materials (data room, one-pagers, talk tracks). Maps each industry to the 6 investor wedge types from `docs/investor/INTRO_TEMPLATE_LABOR_THESIS.md`:

**Structure per industry:**

```json
{
  "investor_positioning": {
    "tam_eur_m": 2500,
    "tam_methodology": "200 enterprises × €12.5K avg ACV (CR-1 + ontology + model sub)",
    "sam_eur_m": 800,
    "sam_methodology": "80 enterprises with CSRD + €500M+ revenue + Nordic/DACH footprint",
    "regulatory_tailwinds": [
      {
        "regulation": "CBAM Phase 2 (2026)",
        "impact": "Mandatory embedded-emissions reporting for all steel imports"
      },
      {
        "regulation": "CSRD (2025-2026)",
        "impact": "200 enterprises now required to report double materiality"
      }
    ],
    "competitive_landscape": [
      {
        "competitor": "Sphera (Blackstone)",
        "positioning": "Cloud-only, US-hosted, no sovereign option"
      },
      { "competitor": "Ecoinvent", "positioning": "Database, not AI — no operational vocabulary" }
    ],
    "wedge_mapping": {
      "REGULATION": "CBAM + CSRD = mandatory compliance spending, not discretionary",
      "SOVEREIGNTY": "EU factories cannot send process data to US cloud",
      "EU_INDUSTRIAL": "200 enterprises × on-prem hardware = physical infrastructure moat",
      "DEFENSE": "Dual-use: defense-adjacent industries (aerospace, shipbuilding) need air-gap",
      "DISTRIBUTION": "Industry ontology = partner channel for Big 4 / system integrators",
      "MARGIN": "Labor-anchored pricing: €12.5K/yr vs €150K/yr consultant baseline"
    },
    "case_study_candidates": ["ArcelorMittal (CBAM exposure)", "Outokumpu (IP disclosure wedge)"],
    "investor_proof_points": [],
    "market_signals": []
  }
}
```

**Extracted from:** Industry reports (McKinsey, Deloitte, EU JRC), regulation timelines (EUR-Lex), competitor pricing (public websites, Gartner), enterprise procurement patterns (analyst reports).

**Feeds into:**

- `investor-outreach/INTRO_*.md` — per-fund wedge selection based on industry thesis alignment
- `docs/investor/data-room-2026Q2/TAM_REFRAMED.md` — industry-level TAM build-up
- `docs/investor/INVESTOR_ONE_PAGER_*.md` — industry proof points
- Agent `iris` (research) and `apollo` (content) — automated investor material generation

---

## 7. Deployment Cadence — 1 Customer/Day × 500 Days

### 7.1 Day-0 Deployment Checklist

```
Day -5:  Hardware ordered (DGX Spark from Nordic distributor, 1-3 day delivery)
Day -3:  Customer data collection starts (facility list, product lines, org chart)
Day -2:  Hardware arrives on-site, rack-mounted, network-connected
Day -1:  DWS stack pre-loaded: Docker images, base model, industry ontology
         Remote access configured (Cloudflare Tunnel or customer VPN)
Day  0:  ┌── Industry fine-tune verification (pre-built, ~30min validation)
         ├── Location fine-tune (2-4 hours, site-specific data)
         ├── Factory fine-tune (2-4 hours, customer data)
         ├── Agent fleet activation (18+ agents, Docker compose up)
         ├── Heartbeat + monitoring verified
         └── Customer training session (2 hours)
Day +1:  Go-live. Customer's LWM is unique and operational.
Day +7:  First-week health check (remote)
Day +30: First-month review + model confidence report
```

### 7.2 Pipeline: 5 Parallel Tracks

To sustain 1 customer/day, run 5 parallel pipelines (each customer takes ~5 business days):

```
Pipeline A: ░░░ Customer 1 ░░░░░░░░░░░░░░░░░░░░
Pipeline B:   ░░░ Customer 2 ░░░░░░░░░░░░░░░░░░░░
Pipeline C:     ░░░ Customer 3 ░░░░░░░░░░░░░░░░░░░░
Pipeline D:       ░░░ Customer 4 ░░░░░░░░░░░░░░░░░░░░
Pipeline E:         ░░░ Customer 5 ░░░░░░░░░░░░░░░░░░░░
                ↑                   ↑
            Day 1 deploy         Day 5 go-live
```

**Staffing per pipeline:**

- 1 deployment engineer (hardware + network + stack install)
- 1 data engineer (ontology + fine-tune + validation)
- 0.5 customer success (training + handoff)

**Total team for 1/day cadence:** ~12 people (5 × 2.5, with shared roles)

### 7.3 Capacity Checkpoints [v2.0]

| Month | Cumulative Customers | Active Fleet Nodes | Team Size | Milestone                         |
| ----- | -------------------- | ------------------ | --------- | --------------------------------- |
| 1     | 5                    | 5                  | 5         | Pilot: prove pipeline works       |
| 3     | 20                   | 20                 | 8         | First industry fully covered      |
| 6     | 60                   | 60                 | 10        | Fleet management v1 needed        |
| 9     | 120                  | 120                | 12        | Remote update system proven       |
| 12    | 250                  | 250                | 12        | Half the fleet, 15+ industries    |
| 18    | 400                  | 400                | 15        | Fleet management v2 (auto-update) |
| 24    | 500                  | 500                | 15        | Full deployment complete          |

**Ontology advantage at 5,000 scale:** Every industry has 200-enterprise depth from day 1. A customer in Battery Manufacturing (ID 24) gets the same ontology quality as Steel (ID 1) — no "Tier 3 industries have thinner ontologies" problem.

### 7.4 Revenue Model

At €4,994/unit (CR-1 Basic) + ontology license + training service:

- Month 6: ~€300K hardware + €180K ontology/training services
- Month 12: ~€1.25M hardware + €750K ontology/training services
- Month 24: ~€2.5M hardware + €1.5M ontology/training + recurring model update contracts

---

## 8. Remote Update Architecture

### 8.1 Update Channels

| Channel         | What it updates                              | Cadence                          | Size     | Mechanism                                |
| --------------- | -------------------------------------------- | -------------------------------- | -------- | ---------------------------------------- |
| **LWM Model**   | Industry/location/factory fine-tuned model   | Monthly or on-demand             | 5-40GB   | Ollama model pull from internal registry |
| **Agent Stack** | DWS IQ Docker images (backend, cron, agents) | Weekly patches, monthly releases | 50-500MB | Docker image pull from private registry  |
| **Runtime**     | OS packages, CUDA, drivers, security patches | Monthly (scheduled maintenance)  | Variable | apt + systemd, coordinated reboot        |

### 8.2 Secure Remote Access (No Cloud Dependency)

```
DWS Operations Center                    Customer's Control Room
┌─────────────────────┐                  ┌──────────────────────────┐
│                     │    Cloudflare    │                          │
│  Fleet Manager      │    Tunnel       │  cloudflared daemon       │
│  (fleet.dws6.com)   │◄──────────────►│  (outbound-only QUIC)    │
│                     │    (existing)   │                          │
│  Update Registry    │                  │  Update Agent            │
│  (registry.dws6.com)│                  │  (checks for updates)    │
│                     │                  │                          │
│  Health Dashboard   │    Heartbeat    │  Heartbeat service       │
│                     │◄──────────────►│  (port 9999)             │
└─────────────────────┘                  └──────────────────────────┘

Key design principles:
- Customer initiates ALL connections (outbound-only, no inbound ports)
- Cloudflare Tunnel already proven (DGX Spark heartbeat infrastructure)
- Air-gap mode: updates delivered via USB/portable media for strict customers
- No DWS access to customer data — only health metrics and update status
```

### 8.3 Update Agent

```
dws-update-agent (systemd service)
├── Check for updates every 6 hours
│   ├── Compare local versions with registry.dws6.com manifest
│   ├── Download delta packages (not full images when possible)
│   └── Stage updates in /var/dws/staging/
├── Apply updates during maintenance window
│   ├── Default: Sunday 02:00-06:00 local time
│   ├── Customer-configurable via /etc/dws/update-policy.yaml
│   └── Skip if critical workload is running (check Docker labels)
├── Health check after update
│   ├── All Docker services healthy?
│   ├── Ollama responding?
│   ├── Model inference latency within bounds?
│   └── Roll back automatically if health check fails within 30 minutes
└── Report status to fleet manager
```

### 8.4 Update Policy (Per Customer)

```yaml
# /etc/dws/update-policy.yaml
auto_update: true
maintenance_window:
  day: sunday
  start: "02:00"
  end: "06:00"
  timezone: "Europe/Helsinki"
channels:
  agent_stack: "stable" # stable | beta | pinned:<version>
  lwm_model: "stable"
  runtime: "security-only" # security-only | stable | manual
rollback:
  enabled: true
  health_check_timeout: 1800 # 30 minutes
  max_rollback_depth: 2 # keep 2 previous versions
air_gap: false # true = no network checks, USB-only updates
```

### 8.5 Fleet Management at Scale

| Fleet Size | Management Approach                                     | Tools                                 |
| ---------- | ------------------------------------------------------- | ------------------------------------- |
| 1-10       | Manual SSH + scripts                                    | Current: Cloudflare Tunnel + SSH      |
| 10-50      | Fleet Manager v1 (dashboard + batch commands)           | Custom: fleet.dws6.com + update-agent |
| 50-200     | Fleet Manager v2 (auto-update, canary rollouts)         | Custom + Grafana fleet dashboard      |
| 200-500    | Fleet Manager v3 (self-healing, predictive maintenance) | Custom + anomaly detection agent      |

---

## 9. Research Execution Plan [v2.0]

### 9.1 Phase 1: Heavy Industry & Primary Processing (Weeks 1-8)

| Week | Industries                            | Enterprises | Deliverable                    |
| ---- | ------------------------------------- | ----------- | ------------------------------ |
| 1-2  | Steel & Metallurgy (#1)               | 200         | 1 ontology + enterprise data   |
| 3-4  | Forestry, Pulp & Paper (#2)           | 200         | 1 ontology + enterprise data   |
| 5-6  | Chemical Processing (#5), Pharma (#6) | 400         | 2 ontologies + enterprise data |
| 7-8  | Automotive (#3), Aerospace (#4)       | 400         | 2 ontologies + enterprise data |

**Phase 1 total: 1,200 enterprises across 6 industries**

### 9.2 Phase 2: Energy & Advanced Manufacturing (Weeks 9-16)

| Week  | Industries                                                     | Enterprises | Deliverable  |
| ----- | -------------------------------------------------------------- | ----------- | ------------ |
| 9-10  | Power Generation (#8), Renewable Energy (#9)                   | 400         | 2 ontologies |
| 11-12 | Maritime & Shipbuilding (#7), Mining (#10)                     | 400         | 2 ontologies |
| 13-14 | Construction (#12), Industrial Automation (#11)                | 400         | 2 ontologies |
| 15-16 | Food & Beverage (#13), Electronics (#15), Glass/Ceramics (#14) | 600         | 3 ontologies |

**Phase 2 total: 1,800 enterprises across 9 industries**

### 9.3 Phase 3: Infrastructure & Frontier (Weeks 17-24)

| Week  | Industries                                          | Enterprises | Deliverable  |
| ----- | --------------------------------------------------- | ----------- | ------------ |
| 17-18 | Oil & Gas (#16), Water/Waste (#18)                  | 400         | 2 ontologies |
| 19-20 | Textiles (#17), Agri Machinery (#19), Telecom (#20) | 600         | 3 ontologies |
| 21-22 | Medical Devices (#21), Rail (#22), Datacenter (#23) | 600         | 3 ontologies |
| 23-24 | Battery (#24), Marine/Offshore (#25)                | 400         | 2 ontologies |

**Phase 3 total: 2,000 enterprises across 10 industries**

### 9.4 Phase 4: Validation & Curriculum Generation (Weeks 25-28)

1. Cross-industry term deduplication (remove overlapping terms between industries)
2. Regulatory term validation against EUR-Lex sources
3. OWL/RDF consistency validation (every ontology parseable by standard tools)
4. Generate synthetic training seeds (~2000 per industry) for QLoRA curriculum
5. Peer review: each ontology reviewed by a second pass with different search sources
6. Package all 25 ontologies into `ontology/industries/` for the training pipeline

---

## 10. Product SKUs [v2.0]

### 10.1 LF-ONTOLOGY-25

**SKU:** `LF-ONTOLOGY-25`
**Name:** 25-Industry Ontology Package
**Description:** Pre-compiled semantic ontology models capturing the operational constraints, regulatory boundaries, and structural vocabularies of 5,000 leading European industrial enterprises across 25 manufacturing and engineering sectors.
**Pricing type:** Enterprise License / Tiered by Site Count
**Delivery:** Pre-loaded on Control Room hardware or delivered as update package

### 10.2 LF-TRAIN-IND

**SKU:** `LF-TRAIN-IND`
**Name:** Sovereign Training Service (Per Industry)
**Description:** On-site configuration of the 5-stage sovereign training cascade using NVIDIA AI Workbench — from industry ontology selection through factory-specific fine-tuning to continuous improvement setup.
**Pricing type:** Quote Required / Per Factory Footprint
**Delivery:** On-site engineer + remote fine-tuning support

Both SKUs added to `dws10.com/config/products.json` + dual-folder mirror.

---

## 11. Verification

### 11.1 Ontology Completeness

- [ ] Each of 25 industries has a JSON-LD ontology file in `ontology/industries/`
- [ ] Each ontology has all 5 layers populated (domain, regulatory, operational, process, compliance)
- [ ] Minimum 200 domain concepts per industry (scaled from 50 at 500-enterprise level)
- [ ] All ETS/CBAM/CSRD terms validated against EUR-Lex
- [ ] OWL/RDF parseable by standard tooling (Apache Jena, rdflib)
- [ ] Cross-industry dedup completed (no term appears in >5 industry files)

### 11.2 Enterprise Data Quality

- [ ] 4,750-5,250 enterprises total (5,000 ± 250)
- [ ] Each enterprise has: name, country, revenue, facilities, regulatory exposure, sub-sector
- [ ] Geographic diversity: no single country > 25% of total
- [ ] Revenue diversity: mix of €50M-€100B+ companies
- [ ] CSRD reporting rate: > 50% of enterprises have public sustainability reports
- [ ] Sub-sector coverage: all major sub-segments within each industry represented

### 11.3 Deployment Pipeline

- [ ] Day-0 checklist tested with 1 real deployment
- [ ] Remote update agent prototype running on DGX Spark
- [ ] Update policy YAML schema validated
- [ ] Rollback tested: intentionally deploy bad update, verify auto-rollback
- [ ] Fleet dashboard prototype showing 5+ node status

### 11.4 Stage 1 Engine Switch Validation (Nemotron-TwoTower, added v2.2)

- [ ] VRAM fit confirmed for Nemotron-TwoTower 30B-A3B on GB10 (DGX Spark) — if it doesn't fit, fall back to Qwen3-Coder for that run
- [ ] First post-switch industry's term-candidate JSON diffed against the last Qwen3-Coder-processed industry; no material extraction-quality regression before that industry's ontology ships to any customer
- [ ] Measured Stage 1 throughput recorded and compared against the projected 2.42× figure
- [ ] Each industry ontology file records which Stage 1 engine (and version) processed it, so per-customer model provenance is documented, not implicit — cf. `docs/field-notes/2026-07-05-nemotron-twotower-stage1-production-switch.md`

---

## Enterprise Research — Starting Data (from v1.0 research agents)

Research agents completed for 8 industries at the 20-enterprise pilot scale. These serve as seeds for scaling to 200/industry:

- **Power & Heat Generation** → maps to ID 8 (Power Generation & Nuclear): 20 enterprises researched (Enel, EDF, RWE, Fortum, Ørsted, etc.)
- **Iron & Steel Production** → maps to ID 1 (Steel & Metallurgy): 20 enterprises listed (ArcelorMittal, SSAB, Outokumpu, voestalpine, etc.)
- **Construction & Buildings** → maps to ID 12 (Construction & Civil Infrastructure): 20 enterprises researched with full CSRD data (VINCI, Skanska, NCC, etc.)
- **Cement & Lime** → maps to ID 14 (Glass, Ceramics & Building Materials): partially overlaps
- **Chemicals & Petrochemicals** → maps to ID 5 (Chemical Processing): 20 enterprises listed
- **Aviation** → maps to ID 4 (Aerospace & Defence): 20 enterprises listed
- **Maritime Shipping** → maps to ID 7 (Maritime & Shipbuilding): 20 enterprises listed
- **Road Transport & Logistics** → no direct mapping in v2.0 taxonomy (absorbed into Automotive #3 and other sectors)

---

## File Structure [v2.0]

```
ontology/
├── industries/                          25 JSON-LD ontology files
│   ├── 01-steel-metallurgy.json
│   ├── 02-forestry-pulp-paper.json
│   ├── ...
│   └── 25-marine-offshore-subsea.json
├── enterprises/
│   ├── enterprise-registry.json         Master list (5,000 target)
│   └── per-industry/                    Raw enterprise data
│       ├── 01-steel-metallurgy.json     (200 enterprise records)
│       ├── 02-forestry-pulp-paper.json
│       └── ...
├── synthetic-seeds/                     Training examples per industry
│   ├── 01-steel-metallurgy-seeds.json
│   └── ...
└── README.md
```
