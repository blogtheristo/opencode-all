# Partner Outreach: Palantir NGC2 Signal → EU-Sovereign Aegis Play

---

**Document Classification:** Partner Confidential
**Version:** 1.0
**Created:** 2026-06-23
**Owner:** Lifetime Oy
**Status:** Draft — competitive signal logged; outreach drafts awaiting human send approval (RED zone)
**Type:** Market Signal → Strategic Defence Outreach

---

## VERSION AND AGENT HISTORY

| Version | Date       | Agent         | Action                                                                                    |
| ------- | ---------- | ------------- | ----------------------------------------------------------------------------------------- |
| 1.0     | 2026-06-23 | Claude (Opus) | Logged Palantir/Anduril NGC2 data-layer signal; mapped DWS IQ Aegis EU-sovereign response |

---

## 1. The Signal

**Source:** Public announcement — U.S. Army NGC2 (Next Generation Command & Control) common data layer baseline.

| Element                 | Detail                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| **What happened**       | The U.S. Army established the NGC2 common data layer baseline for C2 modernization.           |
| **Cloud data layer**    | Palantir **Foundry**.                                                                         |
| **Tactical data layer** | Anduril **Lattice**.                                                                          |
| **Stated value**        | Scalable foundation for AI-enabled tools, interoperability, and faster battlefield decisions. |
| **Date observed**       | 2026-06-23                                                                                    |

**Why it matters to DWS:** This is the clearest validation yet of the _sovereign data-layer thesis_ — that command-and-control and dual-use operations are won at the data/interoperability layer, not at the application layer. Palantir + Anduril now own that layer for the U.S. Army. **No equivalent EU-sovereign baseline exists.** That gap is exactly what DWS IQ Aegis is built to fill for European defence and dual-use institutions.

---

## 2. Relevance to DWS / Lifetime Oy

DWS IQ Aegis (`Store/PRODUCT_AEGIS.md`) already names both incumbents in its competitive table. The NGC2 win sharpens, rather than weakens, the wedge:

| Incumbent (NGC2 role)                     | Structural gap for European buyers                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Palantir Foundry** (cloud data layer)   | U.S.-based, CLOUD Act exposed. Not EU-sovereign. No EU AI Act Article 12 native compliance.       |
| **Anduril Lattice** (tactical data layer) | Hardware-centric, U.S.-only. No compliance/governance agents (no KYA, no Article 12 audit trail). |

**The DWS wedge:** A European defence ministry or dual-use prime that adopts a U.S.-controlled data layer inherits CLOUD Act exposure, an EU AI Act compliance gap, and no agent-governance (KYA) layer. Aegis is EU-sovereign by design (UpCloud Helsinki, zero CLOUD Act exposure), Article 12 native, and ships KYA agent governance — the one capability neither incumbent offers.

| DWS Asset             | Mapping to the NGC2 pattern                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| **Aegis cloud layer** | EU-sovereign analogue to Foundry's cloud data layer (UpCloud UKS, Helsinki DC, CLOUD-Act-free).     |
| **Aegis edge/field**  | Jetson Orin Nano edge-cloud inference split (roadmap item 137D) — sovereign tactical-edge analogue. |
| **KYA + Article 12**  | Governance/auditability layer the incumbents lack — required under EU AI Act for AI-enabled C2.     |
| **ArgusAgent (SAR)**  | Orbital intelligence layer (ICEYE-compatible) — sovereign ISR feed into the data layer.             |

---

## 3. Outreach Targets (European Defence Ecosystem)

This signal is a conversation-opener, not a single-partner pitch. Priority targets where the "EU sovereign answer to the NGC2 stack" framing lands:

| #   | Target                                                       | Channel / Existing link                                             | Angle                                                               |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | **Allianz für Europäische Sicherheit e. V.**                 | Existing outreach (`2026-03-28-allianz-europaeische-sicherheit.md`) | "Europe needs its own sovereign C2 data layer" — direct follow-up.  |
| 2   | **NATO DIANA Accelerator** (VTT, Espoo)                      | Aegis eligible programme                                            | Sovereign C2/data-layer + edge AI as a DIANA challenge fit.         |
| 3   | **Finnish Defence Tech Hub** (ICEYE, IQM, Kuva Space, Varjo) | Ecosystem (`PRODUCT_AEGIS.md` §DEFINE)                              | Joint EU-sovereign data-layer narrative; ICEYE SAR into Argus.      |
| 4   | **DEFINE Accelerator**                                       | Lifetime Oy participant                                             | Position Aegis as the EU-sovereign data-layer baseline.             |
| 5   | **EU member-state defence ministries**                       | Government procurement                                              | CLOUD Act / EU AI Act risk briefing on U.S.-controlled data layers. |

---

## 4. Recommended Actions

- [x] Log NGC2 competitive signal and map to Aegis positioning (this document).
- [ ] **Refresh `Store/PRODUCT_AEGIS.md` competitive table** to cite NGC2 explicitly (Palantir Foundry = cloud data layer, Anduril Lattice = tactical data layer) — keep `landing-pages/dws10-com/` mirror in lockstep if the product page is published. _(Separate scoped change — not in this record.)_
- [ ] Draft follow-up to **Allianz für Europäische Sicherheit** referencing the NGC2 signal (German; human sends — RED zone).
- [ ] Route the **scientific/market-signal framing** into the PhD thesis market-signal section (PHD_FIREHORSE EN/FI) per CLAUDE.md split — thesis edits are RED zone; flag for human-approved lockstep update, do not edit here.
- [ ] Prepare a one-page **"EU-Sovereign C2 Data Layer"** brief for DIANA / DEFINE conversations.
- [ ] If a target engages: send NDA using `Partners/NDA_TEMPLATE_EU_2026.md`.

---

## 5. Proposed Talking Points (Draft — Not Yet Sent)

> The U.S. Army just made its command-and-control data layer the strategic baseline — Palantir Foundry in the cloud, Anduril Lattice at the tactical edge. It proves the thesis: C2 modernization is won at the sovereign data layer.
>
> Europe has no equivalent baseline — and adopting the U.S. stack means inheriting CLOUD Act exposure and an EU AI Act compliance gap, with no agent-governance layer.
>
> DWS IQ Aegis is the EU-sovereign answer: a Helsinki-hosted, CLOUD-Act-free data layer with EU AI Act Article 12 logging built in, KYA agent governance neither incumbent offers, and ICEYE-compatible orbital intelligence feeding it. Built for European defence and dual-use supply chains across all EU-regulated industries.

---

## 6. Guardrails

- **RED zone:** No email sent, no thesis files edited, no deploys. Drafts and analysis only; human reviews and sends.
- **Public claims:** Run `Store/PRODUCT_AEGIS.md` edits and any external copy through `/truth-check` against `DWS_TRUTH_STANDARD.md` before publishing (e.g., industry count, hosting claims).
- **Competitor references:** Factual, sourced to the public NGC2 announcement; no disparagement beyond documented structural gaps (sovereignty, compliance, governance).
- **No customer data:** Pre-NDA, references DWS IQ Aegis capabilities only.

---

_Next review: When a target in §3 responds, or when the human approves the Aegis competitive-table refresh and the Allianz follow-up send._
