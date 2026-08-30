# Field Note — Locking Six Research Questions, and Finding the Wrong List Behind Gate 1

- **Date:** 2026-07-25
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — LUT doctoral work (`PHD_FIREHORSE`) and the KYA open specification (`standards/kya-open/`)
- **Confidence:** High for the repo findings (three RQ sets located, partner map read, repo privacy verified). **Medium** for the external candidate assessment (RISE, DNV — desk research, no contact made). **Explicitly unverified:** the €260bn figure, and the RQ2/RQ3 anchor replies.

## Ontology Tags

- **Geography:** Europe > EU > Finland, Sweden, Norway
- **Sector:** Research > Doctoral; Governance > Standardisation; Conformity assessment
- **Entities:** LUT (Smolander), KTH/TECoSA (Törngren), RISE, DNV, CEN-CENELEC JTC 21, SFS, Linux Foundation / A2A, `standards/kya-open/SPEC.md`, `PHD_FIREHORSE` Appendix H
- **Temporal Context:** 2026-Q3 → 2027

---

## Why this session was substantive

Two problems that looked unrelated turned out to be the same problem. The doctoral research questions had drifted from four to ten and back, and the KYA specification had been described as further along the road to standardisation than it is. **Both are failures of the same kind: a claim outrunning what has actually been earned.** The instruments that fixed them are also the same shape — a lock with a mechanism, and a gate with a criterion.

---

## Part 1 — The research questions were not badly written; there were three sets of them

The HIC asked whether six questions could be locked so they stop moving. Searching the corpus found the actual cause: **three competing sets existed, and none of them knew about the others.**

| Set | Where | Count | State |
| --- | ----- | ----- | ----- |
| A | `PHD_FIREHORSE_FI.md` §1.2, v3.86 | 7 | Lives in the file. §1.2.2's cross-references are all off by one |
| B | `PHD_RESEARCH_QUESTIONS_RESCOPE_PROPOSAL.md`, 27.06.2026 | 7 | Never applied |
| C | `docs/lut/2026-07-14-letter-smolander-six-questions.md` | 6 | **Sent.** In Smolander's inbox, anchors named |

**Set C won on a structural argument, not an aesthetic one:** it is the only set that exists in the outside world. Locking A or B would put the next message to the supervisor in contradiction with the last one, and that costs more credibility than any internal defect in the questions. Set C also happened to be the best — every question has a named anchor, an existing testbed, and an explicit role in the whole (RQ5 the technical spine, RQ6 the organisational counterpart).

Locked 25.07.2026 in `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 on HIC confirmation (*"Kyllä."*).

### The mechanism matters more than the lock

A lock without a mechanism drifts again within three months. Four rules:

1. **A signal never becomes a question.** New market, regulatory or technology signals attach to an existing RQ or go to the signal appendix. They never get their own number.
2. **Changing the set requires a version bump and a recorded reason.** No silent edits.
3. **The set is externally communicated, so a change is an external act** — not an internal decision. That alone puts the threshold at the right height.
4. **The thesis file follows this file, not the other way round.**

### The signal test — the criterion that would have prevented the drift

> **Would this question be worth asking even if the news that triggered it had never happened?**

Applied to set A, three of seven fail. The clearest case is "DWS OS," which entered the research programme as a spine within 48 hours of two news items (Dell+Palantir 18.5., Google 19.5.). It is a true and important observation — but it is an *answer to a market signal*, and it belongs in the architecture description and the signal appendix, not on the question list.

**Nothing was discarded.** Every rejected question was given a new home — sovereignty became a binding condition running through all six rather than its own question; the standardisation path merged into RQ5; Agentic Commerce, eWallet and transactions were retained as a one-paragraph IPR option outside the core scope.

---

## Part 2 — The HIC's methodological correction, and the test it produced

> *"Minusta nykyinen 3.86 on kuvausta testbed tuotantoympäristöstä johon liittyvät tutkimuskysymykset. Tekstin ei ole tarkoitus vastata tutkimuskysymyksiin. Jos teksti jo vastaa RQ:hon tai vastaus syntyy nykyisen aineiston pohjalta helposti on RQ väärin muotoiltu."*

This settles a question that had been open across the whole corpus: **what the 3 500-line `PHD_FIREHORSE` document actually is.** It is not a thesis draft. It is a testbed description. The research questions *relate* to it; they are not its table of contents.

From that follows a criterion that did not previously exist: **a research question lives in the gap between what the testbed demonstrates and what it cannot demonstrate.** And it explains the drift mechanically — a rich testbed tempts you to write the questions from inside it, and then they answer themselves. That is exactly how sets A and B were produced.

### T1 / T2 / T3

- **T1** — would a competent reader answer this from v3.86 alone? If yes → it is documentation.
- **T2** — would the answer emerge from existing material in a week? If yes → it is an analysis task.
- **T3** — if the answer turns out negative ("does not work", "not sufficient", "not adopted"), is that a publishable finding? If no → the question is not falsifiable.

**T3 is the new one and the important one.** T1 and T2 screen out trivial questions. T3 screens out something more dangerous: questions that *wait for a process rather than investigate a phenomenon*. Their negative answer is not a finding, it is a delay — and you cannot write a dissertation out of a delay.

The same falsification principle now appears in three places in the corpus (§10.26 as a test-quality gate, §14.42 for governance claims, T1–T3 for research questions). Stating it once and applying it three times is itself a methodological contribution.

### One of six failed — and it was the one named as the spine

RQ5 (KYA as an open conformance standard) failed both T1 and T2: the corpus contains the artifact, the specification, the reference implementation and the four gates. **The counter-intuitive part is worth keeping:** RQ5 is the best-anchored question in the set, the only one whose artifact is entirely in our own hands. That is precisely why it is the most already-answered. **The better a question is anchored to your own work, the greater the risk your own work has already answered it.**

RQ5 then narrowed twice more, and the second narrowing came from the HIC's own confirmation. When the specification/standard definition was confirmed as *known*, the sharpened v2 ("what distinguishes a specification from a standard") fell to T1 in turn — the criterion works against its own author, which is the sign that it is a test and not a rhetorical device.

**RQ5 v3, recorded but not adopted:**

> *Does the classical specification/standard distinction hold for agent governance, where the certified subject changes after certification — and is the four-gate criterion necessary and sufficient for that difference?*

A bolt standard certifies an artifact that does not change after certification. An agent-governance standard certifies behaviour that changes continuously — the model updates, the agent population learns, mandates rotate, and §14.33's Red Queen effect makes the assessor itself a moving target. **The classical distinction assumes a static subject.** Nobody has answered this, because the question only came into existence once the previous two were closed.

Each narrowing made the question smaller and more answerable. That is the right direction.

---

## Part 3 — The specification/standard distinction, and two things I had wrong

Three states, not two:

| State | What it means | KYA |
| ----- | ------------- | --- |
| 1 · Specification | Versioned, implementable, internal | ✅ **here** |
| 2 · Published specification | Public, licensed, implementable by anyone | ❌ not yet |
| 3 · Standard | Four gates met | ❌ |

**The trap sits between 2 and 3**, because publication feels like arrival. The four gates (SPEC §0.6): two or more independent implementations by parties with **no commercial relationship to the author**; a conformance suite an implementation can fail; body acceptance or genuine adoption; change control outliving the author.

### Correction 1 — KYA is at state 1, not state 2

Earlier versions of the kb file said KYA was a *published* specification. `blogtheristo/dws6` is **private** (verified 25.07.2026), so `standards/kya-open/SPEC.md` is not public. KYA is at state 1.

### Correction 2 — the Apache-2.0 patent licence has not been granted to anyone

It follows from correction 1 and it is not cosmetic. **Apache-2.0 §3 grants the patent licence to a recipient.** If the work has been conveyed to no one, there are no recipients and the licence has not taken effect against anybody.

**Correct formulation: the licence choice is a pre-commitment to a patent licence that activates on publication.** Nothing has been given away yet — and that makes the NOTICE file's own warning more urgent, not less, because publication is the moment the patent terms lock. It also strengthens the decision to keep the specification internal for a reason better than "the governance model is unsettled."

### The A2A lesson on gate 4

Google Cloud **donated A2A to the Linux Foundation in June 2025**; the project is now governed by a TSC including AWS, Cisco, Google, IBM Research, Microsoft, Salesforce, SAP and ServiceNow. Gate 4 — change control outliving the author — is not a future formality. **It is the expensive step, and it is a donation.** The gate you build is a gate you do not own.

That is not an argument against building it. It is an argument for identifying the motive correctly: if the goal is exclusionary control, standardisation is the wrong instrument — it is specifically the mechanism for giving control up. If the goal is shaping the market, it is the right instrument, and the price is control.

### And on the hard-gate question

The premise needed one correction that decided the whole answer. **A standard does not create the gate; legislation creates the gate, and the standard defines the cheapest route through it.** Under the EU New Legislative Framework, harmonised standards confer a presumption of conformity and are *voluntary*; and for most product categories there is no third-party pre-approval at all — the manufacturer self-declares and affixes CE. The EU's gate is mostly a declaration gate with liability consequences, not a permission gate.

That does not weaken the gate. **It shifts the weight onto the quality of the evidence** — which is exactly where an evidence framework sits.

The commercially interesting consequence: the AI Act becomes fully applicable in **August 2026** and the harmonised standards are not ready. In that window every high-risk supplier must demonstrate conformity *without a presumption route*. KYA's realistic near-term position is not the gate — it is **what people use as evidence while the gate has no official route**. That is a genuine position, reachable without a body, and it is time-limited: when JTC 21's standards are cited, the presumption route opens and a market-driven framework loses value sharply. **A timing question, not a standardisation question.**

---

## Part 4 — Gate 1, and the finding that the existing partner map is the wrong list

The HIC asked for candidates for two independent implementers. The first finding came before any candidate search.

`PHD_FIREHORSE` Appendix H maps the KYA partner ecosystem: Shufti Pro (PoC), Palantir (connector model, revenue models proposed), NVIDIA, Siemens, ABB, xAI, Mistral. **Every one of them is disqualified by gate 1 — not because they are bad partners, but because they are partners.**

Appendix H states the reason itself: *"the partnership model is a distribution strategy."* A distribution partner implements the specification **because it has a commercial interest with the author**, which is precisely what gate 1 excludes.

> **The better the partnership strategy works, the less it helps gate 1.**

This does not invalidate the partner strategy. It separates two things that had been bundled: **distribution and legitimation require different parties, and success in one does not accrue to the other.**

### The cold start, and why an academic implementer is structural rather than merely easiest

An implementer says yes only if (a) implementing is cheaper than building their own **and** (b) there is option value in the framework becoming widespread. **Condition (b) requires another visible adopter — which is the cold start.** A research institute does not need option value; research and evaluation are its output. That is what breaks the deadlock, and it is why the academic implementer is first by structure, not by convenience.

*(Recorded against a claim that political pressure could substitute for implementer motivation: it inverts what A2A demonstrates, and Gaia-X is the experimental result of that same hypothesis.)*

### The decided sequence (HIC, 25.07.2026)

| # | Step | Instrument | Gate |
| - | ---- | ---------- | ---- |
| 1 | Törngren role: TECoSA implements, Törngren evaluates | written confirmation | unblocks RQ1/RQ4 |
| 2 | **RISE** — research side implements | mutual NDA + research frame | breaks the cold start · gate 1 (1/2) |
| 3 | **DNV** — second implementation; RISE's certification side may assess it | mutual NDA | gate 1 (2/2) · gate 3 begins |
| 4 | Operational third (Scaleway / public sector) | value proposition, condition (b) now satisfiable | strengthens gate 1 |
| 5 | Governance model and body | — | gate 4, structurally |

*"Spec pysyy sisäisenä. Kaikki lähestymiset luottamuksellisesti."*

**Three execution notes, none of which changes the order:**

1. **RISE's dual nature repeats the Törngren conflict.** Its strength — research and certification behind one door — is also its risk. Apply the same split: RISE research implements; RISE certification does not certify that implementation. It can assess DNV's, which is ideal, because DNV's implementation needs an assessor.
2. **Both candidates are assurance-sector.** Two assurance organisations implementing an assurance framework is somewhat self-referential, and the first critical reader will notice. Gate 1's strongest form includes at least one implementation by a party that needs it for its own operations. Roadmap addition, not a blocker — and the third is easier than the first was, once the cold start is broken.
3. ⚠️ **`Legal/KYA_PARTNER_AGREEMENT.md` must not be used.** A partnership agreement creates exactly the commercial relationship gate 1 excludes; the name alone would be enough to question independence later, whatever the contents. The correct instrument is `Legal/NDA_MUTUAL_LIFETIME_OY_2026.md` — mutual NDA, no licence, no money moving in either direction. **Zero consideration is a feature, not a gap:** if RISE or DNV invoices for the implementation, it is an engagement, and a contractor is not independent.

---

---

## Part 5 — the strategic reassessment, and the gate inversion it produces

Late in the arc the HIC put a number on the standardisation route: **1:1000** for KYA becoming a central European standard. Lifetime Oy is too small, the money in agentic commerce compliance is too large, and the interests are too big.

**This is not new pessimism — it is the strategy arriving where the analysis already was.** The hard-gate analysis had recorded the same conclusion the same day, from the process side: *a single-vendor specification from a Finnish micro-company does not enter the JTC 21 pipeline as a candidate.* Two assessments, two routes, one direction.

**But the fact that closes one door opens another.** Huge horizontal money is an argument against a horizontal standard, not against a niche. Large players systematically underserve narrow, regulation-heavy verticals, because those are won with domain knowledge rather than capital.

**The niche route inverts three of the four gates:** the independent implementers become vertical operators rather than assurance bodies (so the operational implementation is the *first*, not the third); the conformance suite stops being a precondition and becomes the product; gate 3 runs through **adoption** rather than a body — a route `SPEC.md` §0.6 already allows; and **gate 4 drops away, so the IPR stays.** The A2A trade-off reverses: the gate you build on this route is one you *do* own.

**The survival condition** is to position KYA *under* the horizontal standard rather than beside it. When JTC 21's harmonised standards are eventually cited, a narrow market-driven framework dies — unless it is the thing that makes the horizontal standard operable in that vertical. That positioning has to be taken from the start; it cannot be adopted after the horizontal wins.

**And the sharpest part — which half of KYA survives.** Trust scoring *as a protocol* commoditises: agent identity, provenance and audit primitives are moving into the platform layer, built by parties with resources Lifetime Oy does not have. **Domain evidence mapping does not commoditise** — the CBAM evidence chain in steel, the CSRD datapoint's derivability from measurement to report, the safety case in an edge deployment. No platform vendor will build steel's CBAM evidence chain. **Invest in what is domain-specific; take the protocol layer for free from whoever gives it away.**

The honest risk stays named: a single-vendor niche framework is a product feature, not a framework. The four-gate discipline does not disappear on this route — it changes target, and **at least one party in the vertical must use KYA without us.**

**Operationally this changes less than it seems.** Steps 1–4 pay off under either strategy; step 5 — the governance body — probably falls away, and it was the expensive one.

**And RQ5 v3 turns out to have immunised the dissertation against this exact scenario, before the scenario was raised.** Had RQ5 stayed in its original form, the whole thesis would now rest on an outcome its author privately rates at 1:1000 — precisely the T3 defect, a question waiting for a process. v3 asks instead whether the distinction holds and whether the criterion is right, and that answer is publishable regardless of what happens to KYA commercially. The falsifiability work repaid itself the same day, from a direction nobody was looking.

Recorded in full as `docs/phd/KYA_STRATEGIC_REASSESSMENT_2026-07-25.md` — **an assessment, not a decision.**

---

## What did not survive verification

- **€260bn flowing annually from Europe to US cloud providers** — could not be verified; the entire European cloud market is €74.4bn. Replaced with the sourced 70% / 15% share split. Flagged a second time when it propagated forward through an external review.
- **"KTH's and LUT's partners" as the candidate pool** — this is the sharpest form of the same independence trap. LUT is the dissertation's home, KTH runs through Törngren, and shared Horizon/Vinnova funding is a commercial relationship.
- **Gaia-X** is retained as the cautionary precedent for a coalition assembled from political motive without implementer motive.

## Learning Standard — five steps

1. **kb** — ✅ `kb/wiki/concepts/specification-vs-standard-four-gates.md` v1.4 (three states, A2A gate-4 comparison, IPR inversion, both self-corrections) and `kb/wiki/concepts/institutional-record-errors.md`.
2. **Field note** — ✅ this file.
3. **`Learn/` HTML** — ✅ `Learn/2026-07-25-rq-lock-and-gate-one-coalition.{html,docx}` via `scripts/render-doc.sh`.
4. **Drive export** — ✅ [2026-07-25 Field Note — Locking Six Research Questions, and the Wrong List Behind Gate 1](https://docs.google.com/document/d/1rVD1BfGAMTyraPuPsYIXAM2FMNRsAHn-LriGwSQ1NWY/edit) (verified: 9 562 bytes, content present). **This is the first time step 4 has succeeded in this arc** — the nine prior failures were all attempts to export the 552 KB `PHD_FIREHORSE` source, which exceeds the tool's content argument. A digest fits. The repo file remains source of truth; the Drive copy is a copy.
5. **HIC question** — ⬇️

## HIC question (EU AI Act Art. 14 intervention point)

> **Is RQ5 v3 adopted into the lock, or does the locked set stay as sent?**

This is the only genuinely open decision in this arc, and it cannot be made inside a session:

- **Lock rule 2** requires an HIC decision, a version bump and a recorded reason. The falsifiability audit is *input* to a possible v2 of the lock, not a unilateral change.
- **Lock rule 3** makes it an **external act** — the six questions are in Smolander's inbox, so adopting v3 means telling him.
- The recommendation on record is **(a) + (c)**: change RQ5 only, and put the T1–T3 criterion into the methodology chapter, where it is a contribution rather than an internal note. RQ5 v3 reads to a supervisor as a **deepening**, not a retraction — *"the question is not how KYA is designed, but whether the distinction holds when the certified subject moves"* is a stronger message than the original.

**The cost of not deciding is not zero.** Every week the sent set stands unamended, RQ5 remains a question the corpus has already answered — and the next supervisor meeting is where that becomes visible.

## Next steps

- **Decide the TECoSA consideration question — this now precedes the Törngren role letter.** Paid TECoSA partnership is the *default route* recorded on 14.07.2026, and it would break gate 1 without anyone deciding to. See `docs/phd/KYA_GATE1_IMPLEMENTER_CANDIDATES.md` v1.4.
- Resolve the Törngren role (cheapest, and it must be settled before it settles itself). The letter is free; **what the letter sets in motion is not**.
- Check whether the RQ2/RQ3 anchors (Galaz; Universeum/Chalmers) have replied. **An anchor's absence does not kill a question — the anchor is replaced and the question stays.** Confusing those two caused the earlier drift.
- Mark RQ3 explicitly forward-looking (one sentence; replacing it costs credibility).
- Update `PHD_FIREHORSE_FI/EN` §1.2 to match the lock — this simultaneously fixes structure-audit defect 1, since the whole set is replaced and the off-by-one references go with it.

## Related

- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 — the lock and its four rules
- `docs/phd/RQ_FALSIFIABILITY_AUDIT_2026-07-25.md` — T1–T3 applied to all six
- `docs/phd/RQ_SHARPENING_SIDE_BY_SIDE.md` v1.1 — old vs sharpened, RQ5 v3
- `docs/phd/KYA_HARD_GATE_ANALYSIS_2026-07-25.md` — the premise correction and the August 2026 window
- `docs/phd/KYA_GATE1_IMPLEMENTER_CANDIDATES.md` v1.3 — candidates, cold start, decided sequence
- `docs/phd/PHD_STRUCTURE_AUDIT_2026-07-25.md` — seven structural defects
- `kb/wiki/concepts/specification-vs-standard-four-gates.md` v1.4
- `standards/kya-open/SPEC.md` §0.6 — the gates
- `Legal/NDA_MUTUAL_LIFETIME_OY_2026.md` — the correct instrument for gate-1 approaches
