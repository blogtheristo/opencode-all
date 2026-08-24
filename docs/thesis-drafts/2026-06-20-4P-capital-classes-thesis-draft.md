# Thesis Draft — 4P Capital Classes + Ontology-in-the-Team (v3.63 → v3.64)

**Status:** DRAFT FOR REVIEW. Nothing here has been applied to the live thesis files.
**Why a staging doc:** Thesis files are a RED-zone action (human approval required to apply).
This artifact holds the proposed sections so they can be reviewed, then applied to all four
thesis files **in lockstep** per the CLAUDE.md Thesis Rule, followed by `Learn/` HTML regen.

**Scope split (CLAUDE.md Thesis Content Scope Rule):**

- PhD (`PHD_FIREHORSE_EN/FI`) — scientific framing, theory, market/adoption signal → **§14.26, §14.27**
- Master's (`V3Thesis_EN/FI`) — implementation evidence, architecture mapping, GTM wedge → **§10.23.7**

**Source of canon:** PR #1460 "feat(ontology): 4P Capital Classes canon + Ontology Series trilogy"
(field note `docs/field-notes/2026-06-19-...control-room-capital.md` v2.0).

**4P canon (renames + one new class):**
Prompt (was Token) · People (was Human) · Plant (was Control Room — the mobile two-room
Control Room + Situation Room stack) · **Perception** (new — the governed world model fusing
sensors/mobility/satellite/robotics into one picture and closing the sense→decide→act loop).

---

## 0. Apply instructions (lockstep)

1. Bump all four files `Version: 3.63 → 3.64`.
2. Add the VERSION AND AGENT HISTORY entry below to each file. **Delimiters around the block stay
   `\***`, never `---`\*\* (Pandoc rule).
3. Insert PhD §14.26 + §14.27 into `PHD_FIREHORSE_EN.md` after §14.25.7; translate into
   `PHD_FIREHORSE_FI.md` at the matching location.
4. Insert Master's §10.23.7 into `V3Thesis_EN.md` after §10.23.6; translate into `V3Thesis_FI.md`.
5. Add Key Contribution entries (PhD #31 "4P Capital Classes", Master's #33 "4P→DWS IQ 6 mapping").
6. Regenerate `Learn/` HTML (Pandoc build) — do NOT delete prior versioned HTML.

### VERSION AND AGENT HISTORY entry (paste into each file)

```
- Version: 3.64 | Tool: Claude Code | Session: claude/ontology-trilogy-location-67ava0 | Date: 20.06.2026 | Changes: Promoted the three-capital model to the 4P Capital Classes canon — Prompt (was Token), People (was Human), Plant (was Control Room — the mobile two-room Control Room + Situation Room stack), and a new fourth class Perception (the governed world model that fuses sensor/mobility/satellite/robotics signal and closes the sense→decide→act loop). PhD §14.26 adds the 4P theory, the Perception class, and the incumbent-immune-system adoption theory (why a forty-year plant will not let a stranger rebuild it, and why a single small governed tool is the viable wedge). PhD §14.27 adds the Kaukopää/Enso "the ontology lives in the team" case — the operational ontology as undocumented human-resident capital that leaves the balance sheet at retirement. Master's §10.23.7 maps the 4P classes onto deployed DWS IQ 6 components and states the GTM wedge. All four thesis files bumped 3.63→3.64 in lockstep per the CLAUDE.md Thesis Rule; PhD receives the theory/market framing, master's receives the implementation/architecture mapping per the §1.4 scope split. Companion artefacts: onelifetime.world Ontology Series (four-capital-classes.html, software-vs-world-model.html, fi/ontologia-tiimin-aivoissa.html). Kaukopää/Enso historical facts verified against Stora Enso "Our history"/Imatra Mill pages and Wikipedia (Stora Enso, Svetogorsk); the unsupported ~4,200 workforce peak was removed and the 1944 Enso-mill cession used as the anchor. `Learn/` HTML regeneration required (needs Pandoc build).
```

> **Facts verified (2026-06-20):** Kaukopää sulfate mill construction began **1935** (then Europe's
> largest); first board machine **KA1 1950**; Gutzeit sawmill **1872** (Kotka); Enso groundwood mill
> **1887** (town of Enso); Finnish state majority ownership **Oct 1918**; original Enso mill **ceded
> to the USSR in the 1944 Moscow Armistice** while Kaukopää remained on the Finnish side.
> Sources: Stora Enso "Our history" / Imatra Mill pages; Wikipedia _Stora Enso_, _Svetogorsk_.
> **Removed as unsupported:** the ≈4,200 → ≈1,250 workforce trajectory — no source found for a
> ~4,200 peak. Current Imatra (Kaukopää + Tainionkoski) headcount is **≈1,000** (Stora Enso Imatra
> worksite info). §14.27 below uses the verified 1944 cession as its anchor instead.

---

## 1. PhD — §14.26 The 4P Capital Classes and the Incumbent Immune System

### 14.26.1 From three capitals to four classes

§14.25 framed durable agentic-era value as three capitals (token, human, Control Room). Continued
operation surfaced a category error in the third: _Control Room Capital_ bundled two distinct
assets — the sovereign infrastructure (the box) and the governed world model with its closed
sense→decide→act loop (the signal and actuation). They accumulate on different clocks and defend
against different threats, so they are separated here into the **4P Capital Classes**:

| Class          | Prior name           | What it is                                                                                                                                 | How it compounds                                                             |
| -------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Prompt**     | Token Capital        | Reusable, org-owned operating corpus — skills, evaluated agents, standards, validated prompts                                              | Each codified judgement reduces human attention per decision                 |
| **People**     | Human Capital        | Operator pattern recognition, calibration intuition, architectural judgement                                                               | Deepens — not narrows — under intensive HIL                                  |
| **Plant**      | Control Room Capital | The deployed sovereign infrastructure: the mobile two-room Control Room (edge) + Situation Room (cloud) stack and its operational maturity | Calibrated thresholds, exception libraries, populated Article 12 audit trail |
| **Perception** | _(new)_              | The governed world model that fuses sensor/mobility/satellite/robotics signal into one picture and closes the loop                         | Compounds only in deployment; the proof is in progress, not finished         |

Perception is the load-bearing addition. Prompt, People, and Plant describe how the operator and the
infrastructure mature. Perception describes the asset that makes the system _intelligence that
operates_ rather than _software that is operated_: a model of the world that perceives, decides, and
acts under governance. It is named honestly as the class still being proven.

### 14.26.2 The incumbent immune system

A forty-year industrial plant has an immune system. Its operators, its undocumented practice, and its
risk posture all reject an outside system that proposes to rebuild how the plant understands itself.
This is rational: the cost of a wrong rebuild is measured in safety, downtime, and regulatory
exposure, not in software licences. Direct displacement of the incumbent operating model is therefore
not an adoption path — it is the trigger for the immune response.

The viable wedge is the opposite of displacement. A single small, governed tool is introduced that
does something the existing team could not previously do, at low blast radius and under human
oversight. It does not ask the plant to surrender its model. Behind that tool, the governed world
model (Perception) accumulates quietly in deployment. By the time the model matters to the plant's
economics, it is a sovereign, audit-logged, customer-specific asset that no competitor can copy,
because it was grown in _this_ plant's conditions. The moat is not the model weights; it is the
governed Perception capital formed in place — consistent with the §14.25.7 barrier analysis (non-
purchasable, time-gated, compounding).

This reframes adoption theory for sovereign industrial AI: **the immune system is a design
constraint, not an objection to overcome.** The architecture wins by being small at entry and
compounding under governance, not by being comprehensive at the point of sale.

---

## 2. PhD — §14.27 The Ontology Lives in the Team (Kaukopää / Enso)

### 14.27.1 The case

The Kaukopää pulp and board mill (Imatra) — construction begun 1935 (then Europe's largest sulfate
mill), first board machine KA1 1950, within the Enso-Gutzeit lineage (Gutzeit sawmill 1872, Enso
groundwood mill 1887, Finnish state majority 1918) — is a long-horizon instance of a general claim:
a plant's most valuable model of reality is not in any database. It is the operational **ontology**
held in the experienced team's heads — which signal means what, which deviation is benign on Monday
and serious on Friday, which machine speaks before its instrument does. No manual encodes it; it is
tacit.

### 14.27.2 Capital that leaves the balance sheet unrecorded

History supplies a literal proof. In 1944 the original Enso mill was ceded across the new border to
the USSR, yet the operation continued at Kaukopää because the know-how travelled with the people: the
ontology lived in the team, not in the building, and so it survived the loss of the place. The same
logic governs the quieter loss. Each retiring operator carries out a fragment of an ontology no one
wrote down; because it was never in transferable form, it does not transfer. Today the two Imatra
units (Kaukopää + Tainionkoski) employ roughly a thousand people, and every retirement removes a
piece of unrecorded capital. This is §14.25's "ontology is capital" claim made concrete and
uncomfortable: an asset can leave the balance sheet without anyone booking the write-down. The plant
runs for decades on a model that lives in people, and discovers the asset's value only on the day it
walks out the gate.

### 14.27.3 The governed alternative

DWS does not ask the team to surrender tacit knowledge into a database. It builds a **governed
ontology** that learns alongside the team and makes the model durable: it fuses live signal into one
picture (Perception), closes the loop under human oversight with an Article 12 audit trail, and keeps
the asset sovereign (EU-resident, bound to a verified human). The research observable is the
_ontology-retention test_: would your most experienced team's model survive their departure in a form
a machine can learn and a human can check, under a known jurisdiction? Three uncertain answers means
the plant's most important capital is unrecorded.

_Honest caveat (carried from §14.26.1): Perception is the class still being proven; the world model
compounds in deployment, and that proof is in progress._

> FI companion (public): `onelifetime.world/posts/fi/ontologia-tiimin-aivoissa.html` — facts now
> verified (1944 cession anchor; ≈1,000 current headcount), no unverified-figure markers remain.

---

## 3. Master's — §10.23.7 4P Capital Classes Mapped to DWS IQ 6 (Architecture + GTM Wedge)

### 10.23.7.1 Mapping the four classes onto deployed components

| Class          | DWS IQ 6 implementation (deployed)                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prompt**     | `skills/` corpus (30+), evaluated agents in `src/agents/`, the standards library, validated prompt set, `.claude/hooks/` discipline gates                                    |
| **People**     | Operator HIL practice across the Oct 2025–Jun 2026 phase; calibration intuition recorded as exception-pattern libraries                                                      |
| **Plant**      | The mobile two-room **Control Room** (edge) + **Situation Room** (cloud) stack; calibrated thresholds, failover/limited-connectivity modes, populated Article 12 audit trail |
| **Perception** | The governed world model: sensor/mobility/satellite/robotics fusion into one picture and the closed sense→decide→act loop (the class still being proven in deployment)       |

This extends §10.23.4 (Control Room Capital) by splitting the deployed infrastructure (Plant) from
the governed world model (Perception) so the architecture diagram and the capital model agree.

### 10.23.7.2 GTM wedge (implementation consequence)

The 4P split has a direct go-to-market consequence, consistent with the PhD §14.26.2 incumbent-
immune-system theory: DWS sells entry through a **single small governed tool** (low blast radius,
human-in-the-loop, fast time-to-value) rather than a platform rip-and-replace. Plant capital makes
the tool deployable in a sovereign edge footprint; Perception capital is what compounds behind it
into a customer-specific moat. The wedge product motion (one tool → governed world model → expansion)
is the operational expression of the theory, not a separate sales tactic.

---

## 4. Remaining steps (human / RED-zone)

- [x] Verify Kaukopää/Enso figures — done (2026-06-20); unsupported workforce peak removed.
- [ ] Apply §14.26 + §14.27 to `PHD_FIREHORSE_EN.md`; translate to `PHD_FIREHORSE_FI.md`.
- [ ] Apply §10.23.7 to `V3Thesis_EN.md`; translate to `V3Thesis_FI.md`.
- [ ] Bump all four to v3.64 with the history entry (`***` delimiters) + Key Contributions.
- [ ] Regenerate `Learn/` versioned HTML via Pandoc (keep old versions).
- [ ] Promote the FI blog post out of DRAFT once figures are verified.
