# Artifact: Agriculture/Food + Data-Governance Ontology — The Governed Ontology Is the Product

---

## METADATA (The "Coordinates")

- **Artifact ID:** ART-2026-001
- **Temporal Stamp:** 2026-06-21T00:00:00Z
- **Ontology Anchors:**
  - Object: Agriculture, Food & Beverage, Enterprise AI / Data Governance
  - Sector: Food Supply Security; Regulated Enterprise AI
  - Geography: EU Single Market (27 member states); US (USDA demonstration, applied to EU)
  - Regulatory Context: EU AI Act (Art. 12 logging), GDPR (data residency), CAP, Farm to Fork, EUDR (deforestation), food-security mandates
- **Safety Status:** 🧪 Experimental
- **Confidence Score:** 0.70 (new artifact; strategic thesis High, EU-mandate specifics Medium)
- **Source:** Three ontology field notes — Karp (FN 2026-01-21), AIPCon 10 / USDA (FN 2026-06-05), Noise Floor (FN 2026-06-15)

---

## NARRATIVE (The "Divine Story")

### The Observation

> **Field Note Insight (Karp, 2026-01-21):** "If you just buy LLMs off the shelf and
> try to do any of this, it won't work. … Once you build a software layer to
> orchestrate and manage the LLMs in a language your enterprise understands, you
> actually can create value."

> **Field Note Insight (AIPCon 10 / USDA, 2026-06-05):** "Pointing an LLM at hundreds
> of disconnected, ungoverned databases gets you a system that hallucinates, is
> insecure, and unauditable. For something as consequential as our nation's
> agricultural data, that is not just useless — it's dangerous. The Ontology has been
> the key to delivering AI-enabled technology to every farmer in the country."

> **Field Note Insight (Noise Floor, 2026-06-15):** "An ML project is ~50% evaluation,
> 40% data cleaning, 8% integration, 2% training. The first two set the noise floor —
> the model cannot lower it, as that's the optimal bound of the Shannon encoding of
> your data."

These three observations are the same thesis at three altitudes: a competitive-strategy
claim (Karp), a national mission-critical demonstration (USDA), and an
information-theoretic proof (noise floor).

### Why It Failed

The recurring failure mode is the **raw LLM pointed at ungoverned data**. Off-the-shelf
models fail regulated, consequential tasks because:

1. **They lack enterprise-specific language and precision** (Karp — underwriting,
   compliance, regulated decisions).
2. **Over ungoverned data they actively become dangerous, not merely useless** (USDA) —
   three concrete failure modes:
   - **Hallucination** — wrong yield, subsidy, or supply figures presented with false confidence.
   - **Insecurity** — no access governance over sensitive farm, land, and supply-chain records.
   - **Unauditability** — no lineage; you cannot prove _why_ a decision was made or to whom.
3. **A bigger model cannot recover what the data never held** (noise floor) — dirty
   labels are an information-theoretic ceiling, not a tuning problem you can out-compute.

### The Ground Truth

**Reality that contradicts generic AI:**

- For consequential agricultural / food-security data, the **governed ontology over the
  model is the product** — not the model.
- The ontology is the **integration** layer (one queryable model over hundreds of
  databases), the **security** boundary (purpose/marking policies, RLS), and the **audit
  spine** (per-decision lineage + KYA).
- **Governance is the reach multiplier**, not a brake: the USDA ontology delivered AI to
  _every_ farmer, not a pilot. Compliance is the access key, not a cost center.
- The **noise floor is set upstream** by evaluation and clean labels; only a governed,
  continuously-pruned ontology lowers it. A bigger LLM does not.
- The **EU edge is sovereignty**: a US-hosted ontology over EU farm data is a CLOUD Act
  liability. DWS's EU-native residency turns "auditable national food data" into
  **sovereign** auditable food data — a property a US-hosted system structurally cannot offer.

---

## LOGIC (The "Orchestration Rule")

### Proposed Rule

```python
IF:
  - Domain in {"Agriculture", "Food & Beverage"}
  - Data_Source = "multiple_ungoverned_databases"
  - Decision_Consequence in {"food_security", "subsidy", "customs_class", "compliance"}
THEN:
  - route_through_ontology = True          # never query raw sources directly
  - require_source_citation = True         # anti-hallucination contract (§8)
  - apply_purpose_and_marking_policies = True   # security by construction
  - record_decision_lineage = True         # EU AI Act Art. 12 + KYA
  - enforce_active_pruning = True          # 5–10%/quarter label turnover (lowers noise floor)
  - require_eu_data_residency = True       # sovereignty (no CLOUD Act exposure)
  - IF confidence < 0.75: flag_for_human_review = True
```

### LWM Update Instruction

```yaml
world_model_update:
  spatial:
    - market: EU.SingleMarket
    - data_residency: [Finland, Germany]
  temporal:
    - effective_context: 2026-Q2
    - regulatory_horizon: EU_AI_Act_full_enforcement_2026-08-02
  causal:
    - if_raw_llm_over_ungoverned_data: "hallucination + insecurity + unauditability"
    - if_governed_ontology: "integration + security + auditability + reach"
    - if_clean_labels_and_evaluation: "noise floor lowered"
    - learning_weight: HIGH
  governance:
    - vertical: Agriculture_Food_food_security_headline
    - position_against_incumbents: sovereignty_not_features
```

---

## VALIDATION & FEEDBACK

### Usage History

| Date       | User                | Action                                      | Result        | Feedback                                    |
| ---------- | ------------------- | ------------------------------------------- | ------------- | ------------------------------------------- |
| 2026-06-21 | risto.paarni@…      | Promoted three field notes into this artifact | 🧪 Created    | First real Core Artifact (ART-2026-001)     |

### World Model Weight

- **Initial Weight:** 0.70
- **Current Weight:** 0.70 (new — awaiting validation)
- **Usage Count:** 0
- **Success Rate:** n/a (pending field validation)

---

## RELATED ARTIFACTS

- **Promotes (field notes):**
  - `docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`
  - `docs/field-notes/2026-06-05-aipcon10-usda-agricultural-ontology.md`
  - `docs/field-notes/2026-06-15-noise-floor-ontology-old-labels.md`
- **References:** `ONTOLOGY.md` (§5 Artifact Framework, §8 Safety & Orchestration / Active
  Pruning, EU Single Market); `DWS_SECURITY_STANDARD.md` (KYA / auditability);
  `DWS_TRUTH_STANDARD.md` (before asserting any industry/mandate fact externally)
- **Published commentary:**
  `onelifetime.world/posts/your-model-cant-beat-your-noise-floor.html` (EN) /
  `your-model-cant-beat-your-noise-floor.fi.html` (FI);
  `onelifetime.world/posts/point-it-at-the-ontology.html`
- **Brand canon:** `DWS_BRAND_STANDARD.md` §22 Ontology One-Liners (Approved)

---

## VERSION HISTORY

- **v1.0** (2026-06-21): Initial creation — promotes the three ontology field notes
  (Karp, AIPCon 10/USDA, Noise Floor) into one Agriculture/Food + Data-Governance Core
  Artifact. First real ART file under the §5 framework.

---

**Status:** 🧪 Experimental
**Confidence:** 0.70 (strategic thesis High; EU-mandate specifics Medium — confirm with domain owner via `DWS_TRUTH_STANDARD.md` before external claims)
**Impact:** Strategic (positions Agriculture/Food as a sovereign, auditable ontology vertical)
