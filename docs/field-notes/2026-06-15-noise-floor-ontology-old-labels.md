# Field Note: The Noise Floor Is Set by Data, Not the Model — Why Ontology Is a Daily Discipline

**Date:** 2026-06-15
**Author:** Risto Anton Paarni
**Source:** Internal reflection (founder)
**Type:** Strategic Insight / ML Engineering Principle
**Location:** Helsinki, Finland

---

## The Quote

> **"Many people think any given ML project is 99% training. In reality, it's 50%
> evaluation, 40% data cleaning, 8% integration, and 2% training.**
>
> **The first two set the noise floor for learning. No ML magic matters; the model
> cannot lower the noise floor, as that's the optimal bound of Shannon encoding of
> your data.**
>
> **Thus, not a single day goes by without me thinking about ontology. Even the old
> labels have to be constantly reviewed."**

---

## Core Themes

### 1. The effort split is inverted from the myth

The popular picture of an ML project is 99% model training. The real distribution
puts almost all the work upstream of the model:

| Phase             | Share | What it actually is                                           |
| ----------------- | ----- | ------------------------------------------------------------- |
| **Evaluation**    | 50%   | Defining what "correct" means, building the test set, scoring |
| **Data cleaning** | 40%   | Labels, dedup, reconciliation, removing contradictions        |
| **Integration**   | 8%    | Wiring the model into systems that act on it                  |
| **Training**      | 2%    | The part everyone imagines is the whole job                   |

Evaluation and data cleaning together are 90% of the work — and they are exactly
the parts an off-the-shelf model gives you nothing for.

### 2. The model cannot beat the noise floor

The sharp claim: evaluation and data cleaning **set the noise floor for learning**,
and no amount of model sophistication drops below it. That floor is the optimal
bound of the Shannon encoding of your data — information the data does not contain
cannot be recovered by a bigger model. Garbage labels are not a training problem
you can out-compute; they are an information-theoretic ceiling.

This is the rigorous version of "ontology, not the model, is the product." A
governed, clean, well-labelled data layer **lowers the noise floor**. A bigger LLM
does not.

### 3. Ontology is a daily discipline, not a one-time build

The closing line is the operational one: _not a single day goes by without thinking
about ontology — even the old labels have to be constantly reviewed._ An ontology is
not a deliverable you ship once. Labels rot. Definitions drift. Yesterday's correct
tag is today's contradiction. Reviewing old labels **is** the work.

This is precisely the **Active Pruning** principle already written into our own
framework — see below.

---

## Why This Matters for DWS

This insight is internal validation of the architecture we already ship, and a
sharper way to explain it.

### It maps directly onto existing LWM machinery

`ONTOLOGY.md` already encodes every part of this reflection — this field note names
the _why_:

- **Active Pruning (§2 principle 3, §8).** "Old, contradictory, or invalidated
  knowledge must be actively removed. The system forces reconciliation between old
  facts and new stories." That is "old labels have to be constantly reviewed,"
  stated as a system rule.
- **World Model Collision protocol (§8).** When a new field note contradicts an old
  artifact, we flag, review, and reconcile. This is data cleaning as a continuous
  loop, not a one-off pass.
- **Confidence scores + active pruning cadence (§8).** Unvalidated artifacts decay;
  low-success rules are deprecated. The label review is mechanized, not left to memory.
- **Success metric: Active Pruning Rate 5–10%/quarter (§12).** We already treat
  healthy label turnover as a target, not an accident.

### It reframes the pitch in one line

The "noise floor" framing is a cleaner sell than "we have an ontology." To a buyer
or investor:

> A bigger model cannot fix your data. The noise floor is set by your labels and your
> evaluation, and only a governed ontology lowers it. That is the layer we build —
> the 90% nobody else does.

This is the same thesis as the AIPCon 10 / USDA note and the Karp note, now grounded
in information theory rather than anecdote.

### It connects back to the original "Old data" framing

This whole thread opened with _"Old data. Field note. How can we use ontologies?"_
The answer closes the loop: old data is not waste to be ignored — it is labels that
must be **continuously reviewed and reconciled**, because stale labels raise the
noise floor for everything learned on top of them.

---

## Ontology Tags

- **Geography:** Global (principle) → Helsinki, Finland (author)
- **Sector:** Strategy > ML Engineering > Data Governance
- **Entities:**
  - Lifetime World Model (LWM), DWS IQ 6
  - Active Pruning System, World Model Collision protocol (`ONTOLOGY.md` §8)
  - Shannon information theory (noise floor / optimal encoding bound)
- **Temporal Context:** 2026-Q2
- **Confidence:** High (founder principle; consistent with prior validated notes)

---

## Next Steps

### Immediate

- [ ] Add the "noise floor" framing to the ontology pitch one-liners (one sentence:
      _a bigger model cannot lower the noise floor; only a governed ontology can_).
- [ ] Cross-link this note from `ONTOLOGY.md` §8 (Active Pruning) as the rationale
      source, if/when that section is next revised.

### Medium-Term

- [ ] Consider a Lifetime Scope Journal post: "Your Model Can't Beat Your Noise
      Floor" — the 50/40/8/2 split + Shannon bound + Active Pruning, in house voice.
- [ ] When the Core Artifact framework is stood up, fold this into the
      Agriculture/Food ontology brief as the data-governance rationale.

---

## Related

- **Builds on:** `docs/field-notes/2026-06-05-aipcon10-usda-agricultural-ontology.md`
  and `docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md` (the "ontology,
  not the model" thesis)
- **Maps to:** `ONTOLOGY.md` §2 (Core Philosophy — Active Pruning), §8 (Active
  Pruning System + World Model Collision), §12 (Active Pruning Rate metric)
- **Published commentary:** `onelifetime.world/posts/point-it-at-the-ontology.html`

---

## Key Takeaway

> **The model cannot lower the noise floor — that is the Shannon bound of your data.
> Evaluation and clean labels set it; a governed ontology is the only thing that
> moves it. Which is why reviewing old labels is not maintenance. It is the job.**

---

**Status:** ✅ Processed
**Elevated to Core Artifact:** ✅ `artifacts/AGRICULTURE/ART-2026-001-agriculture-food-data-governance-ontology.md` (2026-06-21)
**Confidence:** High
**Impact:** Strategic (information-theoretic grounding for the LWM ontology thesis)
