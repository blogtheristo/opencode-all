# Eurostars Call 11 — Proposal-Drafting Kit (DWS IQ, SE-led via Lifetime AB)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/eu-nato-funding-recovery-nhsewr | Date: 16.07.2026 | Changes: New drafting kit for the Eurostars Call 11 application (deadline 10 Sep 2026), keyed to the anchor decision in `docs/lut/eu-nato-instruments-research-2026-07.md` §1 and §8. Gate 1 locked to SE-led via Lifetime AB (Vinnova, GBER-exempt). Evaluation mechanics verified this session (Excellence / Impact / Quality & Efficiency; average ≥3.6 per criterion; 3 remote experts → Independent Evaluation Panel). Supersedes the (now-invalid) "file NGI Sargasso first" step from the pack §8 — NGI Sargasso's open calls all closed in 2024 (OC4 1 Aug 2024, OC5 25 Nov 2024); the pack's "1 Aug 2026" was a misdated OC4. Eurostars Call 11 is therefore the earliest live anchor instrument, not the second step.

Document Status:

- Created: 16.07.2026
- Last Modified: 16.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Fundraising strategy
- Document Type: Proposal-drafting kit / application playbook

---

## 0. What this is

A working kit for drafting and submitting the **Eurostars Call 11** application for **DWS IQ**,
the EU-sovereign agentic-AI **compliance / evidence** platform. It turns the anchor decision from
the funding pack (`eu-nato-instruments-research-2026-07.md` §1, §8) into a section-by-section
drafting plan, a consortium plan, a budget shape, and a day-counted sprint to the **10 September
2026, 14:00 CET** deadline.

**One hard framing rule up front: Eurostars is _civilian only_.** The Aegis Defence / dual-use
angle is **excluded** here — it lives in EIC dual-use, EDF, and DIANA (pack §3, §5, §6). Every
sentence in this application describes DWS IQ as a **civil regulatory-compliance** platform
(EU AI Act / CBAM / CSRD / NIS2 evidence layer). A defence framing is an eligibility risk, not a
strength, in this instrument.

## 1. Fixed parameters (verified)

| Parameter               | Value                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Deadline**            | **10 Sep 2026, 14:00 CET** (portal opened 9 Jul 2026) — **56 days from 16 Jul**                                               |
| **Platform**            | `myeurekaproject.org` (Eureka Project Management Platform)                                                                    |
| **Lead**                | An **innovative SME** from a Eurostars country → **Lifetime AB (SE)**                                                         |
| **Min. consortium**     | ≥ **2 independent entities** from ≥ **2 Eurostars countries** (≥1 from an EU / Horizon-Associated country)                    |
| **SME budget floor**    | SMEs' share (excl. subcontracting) ≥ **50%** of total project cost                                                            |
| **Concentration cap**   | No single participant or single country > **70%** of budget                                                                   |
| **Duration**            | ≤ **36 months**                                                                                                               |
| **Nature**              | **Civil applications only**                                                                                                   |
| **Funding mechanism**   | **National co-funding**, not one EU rate. Sweden (Vinnova): **50% for SMEs**, cap **SEK 5M (~€440k)** per Swedish participant |
| **Evaluation criteria** | **Excellence** · **Impact** · **Quality & Efficiency of Implementation** — average **≥ 3.6 on _each_** to pass threshold      |
| **Evaluation process**  | 3 remote experts (individual) → **Independent Evaluation Panel** ranks the above-threshold proposals                          |

> **Note on the Europa Media template.** The founder's _Europa Media 50-page RIA/IA proposal
> template_ is a **Horizon Europe** template, not a Eurostars one — different portal, different
> form, shorter Eurostars page limits. Use it for **narrative craft** (impact logic, work-package
> structure, risk tables, Gantt), **not** as the submission structure. The actual submission is
> the Eurostars application form on `myeurekaproject.org`. (Surface the difference; don't blend the two.)

## 2. Gate 1 — locked

**SE-led via Lifetime AB.** Lifetime AB (Sweden, <3 yrs) is carved out of the GBER
"undertaking in difficulty" test, so Vinnova funds it at the 50% SME rate with no difficulty
block. **Lifetime Oy (FI) must not be the funded Finnish participant** — its negative equity
trips Business Finland's difficulty test until cured. If a Finnish partner is wanted for the
≥2-country rule, use a _different_ Finnish entity (a healthy SME, or LUT as an academic partner —
universities are assessed under their own rules, not the company difficulty test).

## 3. Consortium plan

Eurostars rewards a **lean, complementary** consortium (typically 2–4 partners) where every
partner is load-bearing. Recommended shape:

| Role                           | Candidate                                          | Country | Why / contribution                                                                                      | Funder                 |
| ------------------------------ | -------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------- | ---------------------- |
| **Lead SME** (bears ≥50%)      | **Lifetime AB**                                    | SE      | Owns DWS IQ; builds the core agentic-AI compliance/evidence engine; commercialises                      | Vinnova (50%, ≤SEK 5M) |
| **R&D / verification partner** | **LUT** _(FI)_ **or Simula** _(NO)_                | FI / NO | Formal verification of agentic systems (LUT doctorate RQ1) → the Excellence spine; satisfies ≥2-country | Business Finland / RCN |
| **Pilot / end-user** _(opt.)_  | An industrial SME under EU-Act/CBAM/CSRD/NIS2 load | SE / DE | Validation environment + real compliance-burden data → the Impact spine                                 | National body          |

**Alternatives from the bench** (`eu-nato-instruments-research-2026-07.md` §0): Fraunhofer IAIS
(DE) or TU Wien (AT) as the research partner if LUT/Simula can't commit in time; Aarhus (DK) for
the audit-legal angle (RQ2). **Pick two, maybe three — do not stack the whole bench.**

**Eligibility math to hold as you build the budget:** Lead SME (AB) share ≥ 50%; combined SME
share ≥ 50%; no partner and no country > 70%; ≤ 36 months. A 2-partner AB+LUT split naturally
satisfies these; adding a pilot partner improves Impact but watch the 70% cap on the Swedish side.

## 4. Section-by-section drafting plan (mapped to the three criteria)

### 4.1 Excellence — _target ≥ 4.0_

Sub-criteria: degree of innovation · new applied knowledge · technical challenge · achievability & risk.

- **Innovation claim (one sentence, sharp):** DWS IQ produces _machine-checkable compliance
  evidence for autonomous agentic systems_ — the novel step being **formal verification of
  agent-level behaviour against EU regulatory obligations** (LUT RQ1), which no incumbent
  compliance tool does.
- **What wins here:** a concrete, testable advance over the state of the art — name the incumbents
  (GRC suites, model-eval tools) and state precisely what DWS IQ does that they cannot.
- **Draft prompts:** (a) What is the current best practice and its exact limitation? (b) What new
  applied knowledge does the project create (the RQ1 verification method)? (c) What is technically
  hard, and what is the risk-mitigation for each hard part?

### 4.2 Impact — _the criterion Eurostars proposals most often fail_

Sub-criteria: market size · market access & risk · competitive advantage · realistic commercialisation · economic/environmental/societal impact.

- **Market:** size the EU market for AI-Act / CBAM / CSRD / NIS2 compliance tooling with named
  figures (cite the roadmap's market work if available; otherwise verify a defensible number).
- **Commercialisation:** a clear, dated go-to-market for DWS IQ post-project — first paying
  segments, pricing, the EU-sovereignty differentiator as buying reason.
- **Competitive advantage:** EU-sovereign, agent-native, evidence-grade — versus US GRC incumbents.
- **What wins here:** _specific and realistic_ beats _large and vague_. A credible €X path to
  revenue with named early customers outscores a huge TAM with no route.

### 4.3 Quality & Efficiency of Implementation — _target ≥ 3.8_

Sub-criteria: consortium quality · added value of cooperation · realistic management & planning · reasonable cost structure.

- **Consortium quality:** show each partner is necessary and complementary (SME builds + verifies +
  pilots). Explain _why cross-border_ — the SE build + FI/NO verification split is genuine added value.
- **Plan:** WP breakdown, Gantt, milestones, deliverables, a risk table with owners.
- **Cost structure:** per-partner budget within national caps; justify person-months.

## 5. Budget shape (planning figures — verify against locked partners)

- **Total project:** ~**€1.2–1.8M** over **30 months** (a defensible Eurostars size; the roadmap's
  "~€1.5M" is a planning midpoint, not a cap).
- **Lifetime AB (SE):** eligible costs up to ~**€880k**, of which Vinnova funds **50% = ~€440k**
  (the SEK 5M cap); AB co-finances the rest. Keep AB ≥ 50% of total to satisfy the SME-share and
  lead-SME rules.
- **Research partner (FI/NO):** funded by its national body at its own rate; sized so no single
  country exceeds 70%.
- **Pilot partner (opt.):** small, mostly in-kind validation effort.

## 6. Sprint to 10 Sep 2026 — 8 weeks, honest about the compression

Eurostars officially recommends a **3-month+** build; we have **8 weeks**. The critical path is
**consortium lock-in and each partner's national-eligibility confirmation**, not the writing.
**Kill-criterion:** if partners + their national-funder eligibility are **not locked by ~1 Aug**,
the disciplined move is to **defer to the next Eurostars call (Call 12, ~early 2027)** and say so —
a rushed, sub-3.6 submission burns the concept for a year. Do not submit to a deadline you can't
meet at quality.

| Week (2026)           | Milestone                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **W0 · 16–20 Jul**    | Lock Gate 1 (AB lead). Confirm AB "innovative SME" + Vinnova registration. 1-paragraph concept. Invite 2–3 partners.            |
| **W1 · 21–27 Jul**    | Partner LOIs signed. **Confirm each partner's national-funder eligibility** (avoid Lifetime Oy FI-difficulty). Fix WP split.    |
| **W2 · 28 Jul–3 Aug** | Draft **Excellence** (innovation, RQ1 verification, risk). WP structure + Gantt. **Gate: partners locked or defer to Call 12.** |
| **W3 · 4–10 Aug**     | Draft **Impact** (market, commercialisation, competitive advantage, EU-sovereignty).                                            |
| **W4 · 11–17 Aug**    | Draft **Implementation** (consortium, management, risk table). Build budget tables + national caps.                             |
| **W5 · 18–24 Aug**    | Internal review v1 vs the **3.6-per-criterion** bar. Partners complete org/financial forms on the platform.                     |
| **W6 · 25–31 Aug**    | External red-team (Eurostars-experienced reviewer / Vinnova NCP consult). Revise Impact hardest.                                |
| **W7 · 1–7 Sep**      | Finalise narrative + budget + forms. All partners sign off. Eligibility self-check (≥50% SME, ≤70% country, ≤36 mo, civil).     |
| **Submit · 8–9 Sep**  | **Submit by 9 Sep** (one day early) — avoid the 10 Sep 14:00 CET portal crush.                                                  |

## 7. Risk & kill-criteria

- **Threshold risk:** below **3.6 on any one** of the three criteria = rejected regardless of the
  other two. Impact is the usual failure point — over-invest there.
- **Schedule risk:** 56 days is tight; the W2 partner-lock gate is the real go/no-go.
- **Eligibility risk:** Lifetime Oy as a funded FI partner (difficulty gate) → use a different FI
  entity or none. Defence framing creeping in → civil only.
- **Concentration risk:** the Swedish leg breaching 70% if AB is too dominant → balance with the
  research partner's budget.

## 8. Do this week (W0)

1. **Confirm Lifetime AB qualifies as an "innovative SME"** under Eurostars (R&D-intensity test)
   and is registered on `myeurekaproject.org`.
2. **Send partner invitations** to the top-2 research-partner candidates (LUT and Simula) with a
   one-paragraph concept and the 10 Sep deadline — first to say yes with confirmed national-funder
   eligibility wins the slot.
3. **Write the one-sentence innovation claim** (§4.1) and the one-line market number (§4.2) — the
   two hardest, most load-bearing sentences; everything else hangs off them.
4. **Book a Vinnova NCP conversation** to confirm the Swedish SME rate/cap and any Call-11 specifics.
5. **Diarise the W2 (1 Aug) partner-lock go/no-go** against the Call-12 fallback.
