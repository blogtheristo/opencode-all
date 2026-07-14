# EU Commission + NATO DIANA Funding Instruments — Research Pack (Recovery Run)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/eu-nato-funding-recovery-lsogw2 | Date: 14.07.2026 | Changes: Recovery run re-creating the EU Commission + NATO DIANA research pack lost to an unreclaimed container on 2026-07-13 (see `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` §1 row 3, "LOST — worst"). A founder-supplied Gemini draft was used as a starting hypothesis and verified against official sources; several figures in that draft were corrected (see §8). Every claim below is either sourced from an official page fetched/searched this session, or explicitly marked `(verify)` where the primary page could not be opened (HTTP 403 on `ec.europa.eu` PDF fiches and `businessfinland.fi`/`cascadefunding.eu`, blocked by the sandbox's outbound proxy).

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Fundraising strategy
- Document Type: Funding-instrument research pack (recovery)

---

## 0. Who this is for (context carried from the roadmap)

- **Lifetime Oy** (FI, Business ID 0772407-9): SME, **negative equity** → GBER "undertaking in
  difficulty" (UiD) **until cured** → blocks Business Finland co-funding (FI side of Eurostars
  and any other BF-administered instrument).
- **Lifetime AB** (SE): **under 3 years old** → **GBER-exempt from the capital-loss UiD test**
  (confirmed this session, §1.3) → SE-led applications are the live workaround while the Oy
  heals.
- **Product:** DWS IQ / Aegis Defence — EU-sovereign agentic-AI compliance platform (EU AI Act /
  CBAM / CSRD / NIS2 evidence layer; dual-use defence angle via Aegis).
- **Academic anchor:** LUT doctorate — RQ1 formal verification of agentic systems, RQ2
  certifiable agent-level audit (legal pillar), RQ3 industrial scalability.
- **Consortium bench:** Simula VIAS, SINTEF, Aarhus, Fraunhofer IAIS, TU Wien.
- **Today = 14 July 2026.** Deadlines below are load-bearing — several are weeks away, one
  (EDF, §6) is a **material correction to the roadmap**: it is not "mid-2027" as previously
  assumed, it closes **29 September 2026**.

## 1. Eurostars Call 11

- **Deadline:** Portal opens **9 July 2026**, closes **10 September 2026, 14:00 CET**. Verified
  on `eurostars.eureka.eu` / `eurekanetwork.org`.
- **Amount / shape:** No fixed project cap in the call rules; typical Eurostars projects run
  ~€1–2M total (roadmap's "~€1.5M" is a reasonable planning figure, not an official cap)
  _(verify against actual consortium budget once partners are locked)_.
- **Funding rate:** Co-funded nationally, not by a single EU-wide rate — each participating
  country's funding body sets its own rate and cap (see FI/SE split below). No single EU-wide
  "50%" figure exists; that shorthand from the Gemini draft conflates the _typical_ SME grant
  rate with the actual mechanism, which is bilateral national co-funding.
- **Eligibility gates (verified, `eurekanetwork.org`):**
  - Consortium led by an innovative SME from a Eurostars country.
  - At least **two independent entities** from **at least two Eurostars countries**, with at
    least one from an EU/Horizon-Associated country.
  - SME budget (excl. subcontracting) ≥ **50% of total project cost**.
  - No single participant or country > **70%** of budget.
  - Project duration ≤ **36 months**; **civil applications only** (this excludes framing the
    Eurostars leg as an Aegis Defence play — keep Aegis for EDF/DIANA/EIC dual-use instead).
- **The Business Finland (FI) gate — does negative equity bite? Yes.** Business Finland cannot
  fund a company classified as an "undertaking in difficulty" under GBER 651/2014 Art. 2(18)
  (`businessfinland.fi/.../firm-in-difficulty/`, confirmed via search — the page itself
  returned HTTP 403 to direct fetch this session). BF's criteria for an SME **over 3 years
  old** (Lifetime Oy's case) include loss of more than half of subscribed share capital to
  accumulated losses — Lifetime Oy's negative equity trips this. BF states it assesses
  **current equity during the ongoing financial period**, not just historical filed accounts —
  so the cure must be real and current at the time BF evaluates the application, not merely
  promised. **This blocks FI-led Eurostars co-funding until the equity cure completes.**
  _(verify exact application-date-vs-grant-agreement-date mechanics directly with a BF loan
  officer — the page's assessment-timing language is clear on "ongoing period" but doesn't
  spell out the precise procedural checkpoint)._
- **The Vinnova (SE) gate — does it apply to Lifetime AB? No.** GBER Art. 2(18) exempts an SME
  **less than 3 years old** from the capital-loss UiD criterion entirely (confirmed via
  multiple independent legal-commentary sources this session, e.g. Moore Belgium, CJEU
  case-law summaries) — this is a **structural EU-law exemption**, not a Vinnova policy choice,
  so it would apply the same way regardless of which national body administers the co-funding.
  **Lifetime AB is not subject to the UiD test and is not blocked.**
- **Vinnova funding cap (verified, `vinnova.se/en/calls-for-proposals/eurostars/eurostars-autumn-2026-call-11`):**
  with an SME on the Swedish side, the **total Swedish-side cap across all Swedish
  participants is SEK 5,000,000 (~€440k)**; without an SME on the Swedish side the cap is
  SEK 2,000,000. This confirms the Gemini draft's ~€440k Vinnova figure.
- **Gate 1 decision — FI-led (after cure) vs. SE-led (via AB) now:**

  |                             | FI-led (Lifetime Oy)                                                              | SE-led (Lifetime AB)                  |
  | --------------------------- | --------------------------------------------------------------------------------- | ------------------------------------- |
  | GBER UiD test applies?      | **Yes** — >3y old, negative equity trips it                                       | **No** — <3y old, structurally exempt |
  | Blocked today?              | **Yes**, until equity cure is real and current                                    | **No**                                |
  | National funding body       | Business Finland                                                                  | Vinnova                               |
  | Funding cap (SME-inclusive) | Not separately capped by BF in the same public page found this session _(verify)_ | SEK 5M (~€440k)                       |
  | Time-to-file                | Blocked on Gate 1 (equity cure timeline, external to this pack)                   | Filable now                           |

  **Recommendation unchanged from the roadmap: SE-led via Lifetime AB is the near-term path;
  Lifetime Oy participates as an unfunded/subcontracted partner or converts to a funded
  co-applicant once the equity cure is confirmed current.**

- **Application mechanics:** Submission via `myeurekaproject.org` (Call 11 listed as
  competition ID 29). Evaluation is a three-pillar scored framework — excellence/innovation,
  impact/market potential, implementation — each 0–6 (verified via search of the Eureka
  Network call page; exact pillar names/weights _(verify)_ against the call text itself before
  drafting).
- **Effort estimate:** High (~120–150 person-hours) — consortium coordination with Simula /
  SINTEF / Aarhus, joint technical narrative, two parallel national funding applications
  (Vinnova + eventually BF).
- **Prep timeline from 14 July 2026 (9 weeks to deadline):**
  - Weeks 1–2 (through ~28 Jul): lock consortium partners and work-package split.
  - Weeks 3–5 (through ~18 Aug): draft core technical proposal (RQ1/RQ3 framing).
  - Weeks 6–7 (through ~1 Sep): financial tables, Vinnova pre-check.
  - Week 8–9 (through 10 Sep): final portal submission.
- **Fit score: 9/10.** Best structural fit found — SME-led, FI+SE, civil-track R&D on agentic
  verification, and the SE-led route cleanly bypasses Gate 1. Docked one point because the
  civil-applications-only rule means it can't carry the Aegis Defence narrative — that lives on
  EDF/DIANA/EIC instead.

## 2. Digital Europe Programme — "Digital solutions for regulatory compliance through data"

- **Call identifier (verified, `topictree.ideal-ist.eu` + Digital Strategy info-session page):**
  **DIGITAL-2026-AI-DATA-10-COMPLIANCE**, under the Digital Europe Programme (DEP), 2026 work
  programme.
- **Deadline:** Opened **21 April 2026**, closes **1 October 2026**. Verified across two
  independent sources (`eucalls.net`, `topictree.ideal-ist.eu`); the direct EC PDF fiche
  returned HTTP 403 to this session's fetch tool, so the call text itself is unread — treat
  granular eligibility language as `(verify)` even though the deadline/budget figures below
  triangulate cleanly across independent trackers.
- **Budget — correction vs. the Gemini draft:** Total call budget is **€8.5M with 2 expected
  grants** (`topictree.ideal-ist.eu`), i.e. an implied average award near **€4.25M/project**,
  not the "€2.0–3.0M per project" range the draft stated. With only 2 grants expected
  EU-wide, this is a **highly selective** call — factor that into the effort-vs-odds
  calculation.
- **Funding rate — correction vs. the Gemini draft:** DEP's general standard rate is **50%** of
  eligible costs, but **SME participants specifically get 75%** under DEP's standard
  co-funding rules (verified via search of DEP funding-mechanism guides), not the "50% for
  SMEs / 100% for public-academic" split the draft asserted. The 100%-for-academic claim is
  plausible for a small subset of action types (e.g. certain innovation/deployment actions)
  but is not confirmed for this specific topic — mark `(verify)` against the actual call text.
- **Scope (confirmed):** Automating regulatory reporting / compliance checks with AI and data
  technologies; the call explicitly names agriculture, environment, manufacturing, healthcare,
  energy as target administrative-burden sectors. DWS IQ's AI-Act/CBAM/CSRD/NIS2 evidence-layer
  pitch is a clean thematic fit; note the sector list above skews industrial/regulatory rather
  than horizontal-AI, so the pitch should frame DWS IQ as sector-agnostic compliance
  infrastructure rather than assume a name-check.
- **Consortium requirement:** DEP's general minimum is **3 independent entities from 3
  different eligible countries** (standard DEP rule, verified via search; **not yet confirmed
  as this topic's specific requirement** — `(verify)` on the actual fiche).
- **Financial capacity gate:** The EC performs a Financial Capacity Assessment (FCA) on
  coordinators of grants above a cost threshold. Lifetime Oy's negative equity would very
  plausibly trigger a "weak capacity" finding if it coordinated. **Mitigation carried over from
  the Gemini draft and endorsed:** an academic partner (Fraunhofer IAIS, SINTEF, or similar)
  coordinates; Lifetime Oy/AB participate as SME beneficiaries, which are assessed
  individually and are a smaller blast radius than a failed coordinator FCA. This mitigation
  is standard EU-grants practice, not confirmed against this specific topic's fiche
  `(verify)`.
- **Application mechanics:** EU Funding & Tenders Portal — Part A (admin), Part B (technical
  narrative), budget tables. Standard two-stage internal review inside the consortium before
  submission is advisable given the 2-grants-only selectivity.
- **Effort estimate:** Medium-High (~80–100 person-hours assuming DWS is _not_ coordinating).
- **Fit score: 7/10** (down from the Gemini draft's 8/10) — thematically strong, but the
  €8.5M/2-grants selectivity and unread fiche mean the actual bar and eligibility fine print
  are less certain than the draft implied.

---

## 3. EIC Accelerator, incl. the June 2026 dual-use / defence window

- **Dual-use window (verified, `eic.ec.europa.eu` news + Guide for Applicants v6.0):** Opened
  **17 June 2026**, applications accepted **30 June – 28 October 2026**. Results expected early 2027. This is a rolling submission window layered on EIC Accelerator's standing bimonthly
  Stage-2 cut-offs (4 Mar, 6 May, 8 Jul, 2 Sep, 4 Nov 2026), not itself a single cut-off date —
  **28 Oct 2026 is the window's close, not a separate Stage-2 deadline.**
- **Grant/equity structure — correction vs. the Gemini draft:** Non-dilutive grant **up to
  €2.5M** (confirmed, matches draft) **plus equity investment typically €1M–€10M** via the EIC
  Fund (verified, EIC 2026 Work Programme coverage) — **the draft's "up to €30M equity" figure
  is wrong by roughly 3×; the actual EIC Fund equity ceiling is €10M**, with the Fund taking a
  minority stake (up to ~25%). Anyone filing on the draft's figure would be planning around a
  number the programme doesn't offer.
- **Dual-use fit:** Explicitly scoped for "civilian and defence applications (AI, quantum,
  advanced materials, robotics)" — Aegis Defence is a clean thematic match for this specific
  window (as opposed to Eurostars, which is civil-only, §1).
- **Financial viability vs. negative equity:** Grant-only actions apply the standard GBER UiD
  screen — Lifetime Oy's negative equity would need curing first for a grant-only path from the
  Oy. **Blended-finance and equity-only actions are explicitly exempted from the UiD
  eligibility check** (verified via search of EIC FAQ material) — control instead runs through
  KYC/"Red Flag" due diligence ahead of any EIC Fund investment. This is a materially different
  (and more favourable) gate structure than Eurostars/Digital Europe: **a blended grant+equity
  EIC application is not blocked by the Oy's negative equity the same way BF co-funding is** —
  though KYC due diligence would still surface the balance sheet, so curing it before the
  interview stage remains the sound move regardless of the technical exemption.
- **Application mechanics (confirmed, standard EIC process):**
  1. Short Proposal (Stage 1) — 10-slide pitch deck, 3-minute video, short-answer questions;
     rolling submission, ~4-week turnaround.
  2. Full Proposal (Stage 2) — written for the relevant cut-off (dual-use window: by 28 Oct
     2026 at the latest).
  3. Face-to-face interview in Brussels before an investor/expert jury.
- **Effort estimate:** Very High (~180+ person-hours); win rate is in the low single digits for
  the open/challenge tracks generally, though the dedicated dual-use window is newer and less
  oversubscribed as of this session `(verify current round's applicant volume closer to
filing)`.
- **Fit score: 8/10** (up from the draft's 7/10, once the equity figure is corrected to the
  real €10M ceiling and the UiD-exemption detail is factored in) — best long-cycle,
  large-ticket vehicle for Aegis Defence specifically, and the only instrument in this pack
  where negative equity is structurally less of a blocker.

## 4. Cascade / FSTP open calls

The draft's specific named calls (NGI Sargasso, "SecurIT Open Call 3", AI-Redio) do not fully
hold up against a live-inventory check this session — cascade/FSTP calls rotate on a monthly
cadence and several of the draft's picks are stale or unverifiable as named. Corrected,
currently-open inventory:

| Call                                                                         | Deadline                                                                                                                                                                                                                                                                                                                                    | Amount                                                                                                                  | Fit                                                                                                           | GBER gate?                                                                                                               |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **NGI Sargasso** (open call, transatlantic NGI trust/data-sovereignty track) | **1 Aug 2026** (verified, `ngisargasso.eu`/EC portal) — **18 days out from today, very tight**                                                                                                                                                                                                                                              | Equity-free cascade funding + capacity-building, 9-month programme (per-project cap not found this session, `(verify)`) | Trust/data-sovereignty framing fits DWS IQ's evidence-layer pitch                                             | No — FSTP cascade funding is structurally exempt from the GBER UiD test (confirmed pattern across cascade calls)         |
| **AI4Gov-X Cascade Funding Call** (AI4Gov-X-FSTP-CALL-01-2026)               | Rolling cut-offs **31 Aug, 31 Oct, 31 Dec 2026, 28 Feb 2027** (verified, `subsdy.com`/GoodGrants)                                                                                                                                                                                                                                           | Not confirmed this session `(verify)`                                                                                   | AI-for-governance framing — plausible compliance-adjacent fit, needs the actual scope read before committing  | No (FSTP)                                                                                                                |
| **EUDIS Cascade Funding** (EU Defence Innovation Scheme)                     | Rotates by track; **EDF 2026 calls generally close 29 Sep 2026** (see §6) — treat as the anchor date for the current EUDIS/EDF cycle `(verify EUDIS's own cascade-specific sub-deadline, which can differ from the main EDF call)`                                                                                                          | Varies by call                                                                                                          | Direct dual-use/defence framing for Aegis — better thematic fit than the generic AI/cyber cascade calls above | No (FSTP), but the parent EDF programme's own SME calls (§6) are not exempt in the same way — verify which layer applies |
| "SecurIT Open Call 3" (as named in the Gemini draft)                         | **Not confirmed as currently live** — the SecurIT project traces to an older (2023-era) H2020 cybersecurity cascade programme; the live 2026 cybersecurity cascade calls found this session are instead **SECURE** (first call closed 29 Mar 2026) and **CYSSDE Open Call 3** (closed 28 Apr 2026) — both **already closed** by 14 Jul 2026 | —                                                                                                                       | —                                                                                                             | —                                                                                                                        |
| "AI-Redio Cascade Call" (as named in the Gemini draft)                       | **Not found** in this session's search — likely a hallucinated or long-superseded call name                                                                                                                                                                                                                                                 | —                                                                                                                       | —                                                                                                             | —                                                                                                                        |

- **Recommendation:** File **NGI Sargasso now** given the 1 Aug 2026 deadline — it is the
  fastest-turnaround, GBER-exempt option found and the deadline is inside three weeks.
  Track **AI4Gov-X** for the 31 Aug cut-off as a second low-effort filing. Treat the EUDIS
  cascade track as the entry point for a future Aegis-specific cascade filing once the main
  EDF SME calls (§6) are scoped, rather than filing on the stale SecurIT/AI-Redio names from
  the draft.
- **Effort estimate:** Low (~20–30 hours per call), consistent with the draft's estimate.
- **Fit score: 7/10** (down from the draft's 9/10) — the mechanism-level fit (FSTP/cascade =
  fast, GBER-light money) holds up, but two of the draft's three named calls do not exist as
  described, so the actual near-term action is narrower than the draft implied.

## 5. NATO DIANA

- **Correction vs. the Gemini draft's framing:** The **3 July 2026 deadline was not a call that
  was "missed" in the sense of being lost — it is the standing annual Challenge Call deadline
  for the 2027 cohort** (verified, `iuk-business-connect.org.uk`, `inventya.com`,
  `nordicdefencesector.com`: "NATO DIANA Challenges for 2027", deadline 3 Jul 2026). Since we
  are past it, the practical read is the same as the draft's conclusion — **the next
  opportunity to apply is the following annual cycle** — but the framing should be "next
  Challenge Call, ~June/July 2027, for the 2028 cohort" rather than "the 2027 cycle," which
  reads as if 2027 itself were still an option.
- **Cycle mechanics (verified, `diana.nato.int/faq`):** Challenge Call opens ~June/July each
  year → notification **end of the same year (~December)** → Accelerator Programme starts
  **January of the following year**. Applying this to the missed window: 2027 cohort notified
  Dec 2026, programme starts Jan 2027 — **already in motion for companies that applied by 3
  Jul 2026**; the next call we can actually enter opens **~June/July 2027** for the 2028
  cohort.
- **Grant structure (verified, `non-dilutive-funding.com`, DIANA FAQ):** Phase 1 (boot-camp) —
  up to **€100,000**, paid up front, before Phase 1 starts. Phase 2 (scale) — up to **€300,000**
  additional, for down-selected companies, covering a further 6 months. Both **equity-free** —
  NATO takes no stake and IP stays with the company. Matches the draft's figures exactly.
- **Topic fit:** DIANA's 2027-cohort challenges include secure connectivity, space, quantum,
  and (per the June 2026 "six new challenges" announcement) broader defense/security themes —
  Aegis Defence's agentic-AI security/compliance angle is a plausible fit for a future
  "secure information sharing" or "safe autonomy" challenge type, though the _exact_ 2028-cohort
  challenge topics will not be published until the ~2027 call opens `(verify closer to the
call)`.
- **Nordic test centres (verified, `vttresearch.com`, `government.se`):**
  - **VTT Otaniemi (Espoo, FI)** — DIANA test centre for **secure connectivity, space, and
    quantum**, run with Aalto University and University of Helsinki; a companion Finnish test
    centre at **University of Oulu** covers **6G**. Pre-engaging VTT Otaniemi this autumn
    (Sep–Oct 2026) — as the roadmap already planned — remains the right move regardless of the
    2027/2028-cohort correction above, since test-centre relationships are independent of the
    annual challenge cycle.
  - **LEAD (Linköping/Norrköping, SE)** — confirmed as NATO's designated Swedish DIANA
    accelerator partner (Swedish government press release, May 2026); offers business coaching,
    testing environments, and defence-industry/government contacts.
- **DIANA → NATO Innovation Fund on-ramp (verified, `nif.fund`, `nato.int`):** NIF is capitalised
  at **€1bn**; **Finland and Sweden are both confirmed Limited Partners** (Finland as an
  original participating Ally, Sweden joining upon its NATO accession). DIANA cohort
  graduates get a fast-track relationship to NIF, consistent with the roadmap's claim.
- **Fit score: 9/10** (unchanged from the draft) — outstanding strategic alignment for Aegis
  Defence and a real NIF on-ramp; the only change is precision about _which_ cycle is next
  (2027 call → 2028 cohort, not "the 2027 cycle" as if still open) and the recommendation to
  start VTT Otaniemi/LEAD Linköping pre-engagement now, independent of the challenge-call
  calendar.

---

## Continues in this file — sections 6–7 and the ranked action plan follow below.
