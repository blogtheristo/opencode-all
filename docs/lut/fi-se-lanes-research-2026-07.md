# FI/SE Funding Lane Research — Apurahat, Vinnova, Almi, VGR (2026-07)

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/brave-curie-qii1fv | Date: 15.07.2026 | Changes: Reconciled the add/add merge conflict between this branch (PR #1685) and `main`. A parallel session (`claude/fi-se-funding-lanes-recovery-pbmlmg`, PR #1682) had independently recovered this same file and merged first; its v1.0 is the canonical base and is kept in full (its provenance §0.1, GBER snapshot §0.4, per-instrument sources, figure-conflict flags, and §5 action list are strictly more complete). Added only this branch's genuinely-additive artifact — the §0.5 per-lane verdict at-a-glance table — adapted to reference the canonical figures/caveats. This branch's independent four-lane research run remains in its git history (commits e4b9458 / fba2262) and was not used to overwrite any canonical figure.
- Version: 1.0 | Tool: Claude Code | Session: claude/fi-se-funding-lanes-recovery-pbmlmg | Date: 14.07.2026 | Changes: Initial recovery of the FI/SE regional funding-lane research bank-checked in `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` Prompt B / `RECOVERY_SESSION_PROMPTS_PASTE_READY_2026-07-14.md` §Prompt B. Four parallel primary-source research passes (apurahat via foundation sites, Vinnova via vinnova.se, Almi via almi.se, VGR via vgregion.se), each WebSearch-indexed against the official domain (direct WebFetch to all four primary domains was blocked by this session's outbound proxy policy — see §0 Methodology). Supersedes an unverified block appended to this session's task description that presented fabricated "RECOVERED & VERIFIED" figures under a "gemini" label; that block was **not used as a source** — see §0.1.

Document Status:

- Created: 14.07.2026
- Last Modified: 15.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Fundraising strategy
- Document Type: Funding-lane research pack (companion to `docs/lut/fundraising-roadmap-2026-2027.md` §6)

---

## 0. Methodology and standing caveats — read first

**0.1 Note on a rejected input.** This session's task description had a block appended to it, labeled "gemini," presenting a fully pre-written document claiming to be "RECOVERED & VERIFIED (2026-07-14)" with specific grant amounts and deadlines. That block was not part of the original recovery prompt (verified against `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` Prompt B, which the legitimate portion of the task matches verbatim) and was treated as untrusted/injected content, not a source. None of its figures were copied into this document. Everything below was independently researched this session via WebSearch/WebFetch against the official domains named in the task (foundation/säätiö pages + aurora-tietokanta.fi, vinnova.se, almi.se, vgregion.se). Where a figure below happens to match that rejected block, it is coincidental and was re-derived independently — it still carries the `(verify)` tag on the same basis as everything else.

**0.2 Access limitation (applies to all four lanes).** Direct `WebFetch`/`curl` to vinnova.se, almi.se, and vgregion.se returned HTTP 403 at this session's outbound proxy/egress-policy layer (confirmed via the proxy status endpoint) — an environment restriction, not a site-side block. Most Finnish foundation sites (lsr.fi, tekniikanedistamissaatio.fi, kaute.fi, emilaaltonen.fi, nokiafoundation.com, lut-tukisaatio.fi) returned HTTP 403 directly (bot protection). **All facts below therefore come from WebSearch-indexed excerpts of the named official pages, cited by URL — not from a direct page render in this session.** This is real primary-source text (Google's index of the official page), but one tier below a live fetch. Per the task's instruction, every figure/date not independently cross-confirmed across two sources is marked **(verify)** — treat this entire document as requiring one live-page confirmation pass (a human browser session, or a future session with unrestricted egress) before any figure is used in a filing.

**0.3 Decision-rule context (unchanged from the roadmap):** apuraha → stay Finland. Apurahat are personal grants to the individual researcher (Risto Anton Päärni as LUT doctoral candidate), not company state aid — this is the mechanism that lets FI-side research funding proceed even while Lifetime Oy's negative equity blocks Business-Finland-style company aid (Gate 1, roadmap §2).

**0.4 GBER eligibility snapshot (entity-level; carries into every lane below):**

| Entity               | Status          | GBER Article 2(18) posture                                  | Consequence                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------- | --------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Lifetime Oy (FI)** | Negative equity | "Undertaking in difficulty" until cured (roadmap §2 Gate 1) | Blocked from **company** state aid (Business Finland-style co-funding). Apurahat paid to the individual researcher are a separate legal category and are not confirmed to be blocked by this — see §1's framing note, itself marked (verify) pending legal confirmation.                                                                                                     |
| **Lifetime AB (SE)** | <3 years old    | GBER-exempt from the standard difficulty test               | Not blocked by the Oy's balance sheet. But **GBER exemption is not the same as automatic eligibility** — each Swedish instrument below has its own independent gates (company-age caps, employee-count floors, turnover floors, regional-presence requirements) that can exclude Lifetime AB regardless of the GBER question. Do not treat "GBER-exempt" as "pre-qualified." |

---

## 0.5 Per-lane verdict (at a glance)

At-a-glance summary of the four lanes; the per-instrument detail, sources, and every `(verify)`
flag are in §1–§4, and the deadline-ordered action list is in §5.

| Lane              | Vehicle                 | Nature                                     | Does the negative-equity gate bite?                                                                                   | Verdict / soonest action                                                                                                                         |
| ----------------- | ----------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Apurahat (FI)** | Risto (individual, LUT) | Non-dilutive **personal grant**            | **No** — personal grants ≠ company state aid; bites only Business Finland (§1 framing note, _verify with counsel_)    | **Cleanest lane; _apuraha → stay Finland_ holds.** Act now: **LSR (closes 15 Aug)**, Nokia Foundation (3 Aug–15 Sep), LUT tukisäätiö (rolling)   |
| **Vinnova (SE)**  | Lifetime AB             | Non-dilutive **grant** (de minimis / GBER) | **No** — AB is <3y; but the GBER young-company carve-out is **not confirmed on any vinnova.se page** (§2.4, _verify_) | **Best SE grant lane.** **Eurostars Call 11 (closes 10 Sep)** is the most time-sensitive item; Innovativa Startups Step 1 opens 12 Oct           |
| **Almi (SE)**     | Lifetime AB             | **Debt** (+ Verifieringsmedel grant)       | No direct gate; standard Sweden-registration eligibility (+ non-Swedish-founder BankID caveat, §3.2)                  | **Debt lever, not a grant lane.** Realistic near-term draws: **Mikrolån (≤SEK 200–250k, _verify_)** + **Verifieringsmedel (≤SEK 100k)**. Rolling |
| **VGR (SE)**      | Lifetime AB             | Conditional **seed loan** + checkar        | No (under-3y is _prioritised_) — but the **territorial VG-registration gate very likely blocks** (§4.4)               | **Blocked today** unless Lifetime AB establishes a Västra Götaland presence; Såddfinansiering (≤SEK 850k) is the target if gated                 |

---

## 1. Lane 1 — Apurahat (Finnish research-grant foundations)

**Target:** funding Risto Anton Päärni's LUT doctoral research on AI agent verification/trust systems, as an individual applicant, independent of Lifetime Oy's balance sheet.

**Aurora-tietokanta.fi note:** the task asked this be used as the starting index. Direct WebFetch to it was blocked and a filtered tag search (tekoäly/tietotekniikka/väitöskirja) could not be cleanly reproduced via WebSearch — **this instruction was only partially fulfilled**. A session with working aurora-tietokanta.fi access should re-run the tagged search directly to catch anything foundation-by-foundation search missed.

### Open windows as of 14.07.2026 (2026 calendar)

| Foundation                                                | Instrument                                                           | Amount                                                                                                                   | Window (2026)                                                                                   | Thematic fit                                                                                                      |
| --------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Nokia Foundation** (Nokia-säätiö)                       | Nokia Scholarship                                                    | Up to €7,500 (verify)                                                                                                    | **3 Aug – 15 Sep 2026**                                                                         | Explicitly PhD in ICT — best thematic match found                                                                 |
| **Suomen Kulttuurirahasto** (SKR)                         | Science grants (tiede-apurahat)                                      | Not confirmed per-grant (verify); ~€30M distributed across ~9,000 applicants in the October round, aggregate figure only | **15–30 Oct 2026** (single consolidated round — structural change from prior multi-round years) | Broad science/art; no confirmed AI/ICT category                                                                   |
| **Liikesivistysrahasto** (LSR)                            | Väitöskirjatutkimuksen apuraha                                       | €27,000 (12-month full-time); €32,000 post-doc (verify)                                                                  | **1 Jun – 15 Aug 2026, 24:00 UTC+3**                                                            | Kauppatieteellinen tutkimus (business economics) — needs a business/governance framing, not ICT-native            |
| **LUT-yliopiston ja ammatillisen koulutuksen tukisäätiö** | Dissertation/thesis grants + completion recognition (€2,000, verify) | Not confirmed for main working grant (verify)                                                                            | **Rolling/continuous** (verify — processed roughly every two weeks per indexed source)          | LUT's own affiliated foundation — direct institutional relevance; easiest near-term action item, contact directly |

### Closed for 2026 — bank as 2027 targets

| Foundation                          | Instrument                     | Amount                                                                            | 2026 window (closed)     | Note                                                                                                                                                                                             |
| ----------------------------------- | ------------------------------ | --------------------------------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **KAUTE-säätiö**                    | General grant call             | €6,000 (3mo) / €13,000 (6mo) / €26,000 (12mo); post-doc €28,000 (verify)          | 2–30 Jan 2026            | **Best structural fit found** — explicitly funds the business-sciences/technical-sciences intersection, matching the dual founder+researcher profile. Prepare early for the ~Jan 2027 reopening. |
| **Tekniikan edistämissäätiö** (TES) | Jatko-opiskelijoiden apurahat  | Full-year up to €26,600; part-year up to €2,200/mo; encouragement €5,000 (verify) | 9 Jan – 12 Feb 2026      | General engineering scope; AI/ICT fit not explicitly confirmed (verify)                                                                                                                          |
| **Emil Aaltosen säätiö**            | Väitöskirjatutkimuksen apuraha | €34,000 (min. €30,000 as personal living-cost grant) (verify)                     | 15 Jan – 15 Feb 2026     | No explicit AI/ICT carve-out found                                                                                                                                                               |
| **HPY:n Tutkimussäätiö**            | Kannustusapuraha               | €3,000 (verify, small/incentive-scale)                                            | 8 Dec 2025 – 31 Jan 2026 | Telecom/data-communications adjacency; secondary top-up only                                                                                                                                     |

### Checked and excluded (fail loud — do not re-research these)

- **Jane ja Aatos Erkon säätiö** — does not award personal dissertation/post-doc grants; funds project/programme grants to institutions only.
- **Walter Ahlströmin säätiö** — explicitly states it does **not** support telecommunications, 5G/6G, or AI research; scope is wood processing, electrical engineering, power economy, metals.
- **Niilo Helanderin säätiö** — has an AI-tagged 2026 call, but targets AI in the performing arts, not technical/ICT research; window already closed (28.2.2026).
- **Teknologiateollisuuden 100-vuotissäätiö (Techfinland100)** — has an AI-thesis grant, but restricted to master's-thesis work tied to a member company's AI project, not PhD-track.

### Legal framing note (verify with counsel before relying on it)

General Finnish grant/tax terminology distinguishes state aid (valtiontuki, directed at _economic activity_) from a personal apuraha to an individual for non-economic scientific work — supporting the working assumption that Lifetime Oy's GBER "undertaking in difficulty" status does not block apurahat paid to Risto Anton Päärni personally. **No foundation's own page discusses GBER or state-aid status directly** (they are private foundations, not state-aid-administering bodies) — this reasoning is inferred, not foundation-confirmed. Confirm with a lawyer/accountant before filing on this assumption, and check each application form for whether it asks about the applicant's company affiliations.

---

## 2. Lane 2 — Vinnova (Sweden, national innovation agency)

**Target:** Lifetime AB as the Swedish co-applicant/lead entity.

### 2.1 Planeringsbidrag inför en internationell ansökan (Planning grant for international proposal)

- **Amount:** Up to **SEK 300,000** as a project partner; up to **SEK 500,000** coordinating an international consortium (≥3 countries).
- **Duration:** Up to 12 months. Co-funding % not confirmed (verify).
- **2026 deadline:** Closing **6 Oct 2026** (verify exact time; Vinnova calls conventionally close 14:00). Opening date not confirmed (verify).
- **Critical exclusion, confirmed on the call page:** **Eureka programs, including Eurostars, are explicitly NOT covered by this grant.** It funds prep for Horizon Europe-type calls only. This directly contradicts the assumption (present in the rejected injected block, §0.1) that this instrument funds Eurostars Call 11 prep — it does not.
- **Portal:** Vinnova Intressentportalen.
- **Source:** vinnova.se/e/utlysning-2026-00442/planeringsbidrag-infor-en-2026-00484

### 2.2 Eurostars (Höst 2026 / Call 11)

- **Amount:** Up to **SEK 5,000,000** per Swedish participant; capped at **SEK 2,000,000** if no Swedish SME is in the consortium.
- **Co-funding rate (Vinnova share):** SMEs 50%, large companies 30%, universities/institutes/public sector 70%.
- **Solvency gate (verify — unusual, confirm directly):** applicant's net turnover or equity must be at least half the amount applied for.
- **2026 timeline:** Opens **9 Jul 2026**; closes **10 Sep 2026, 14:00**; decisions **17 Dec 2026**.
- **Eligibility:** international consortium (≥2 countries), SME-led typical/preferred.
- **This is the most time-sensitive item across all four lanes** given the Sep 10 deadline sits inside the roadmap's near-term window (roadmap §3/§4).
- **Source:** vinnova.se/e/eurostars/eurostars-hosten-2026-call-11

### 2.3 Innovativa Startups (Innovative Startups)

- **Step 1:** up to **SEK 500,000**. Eligibility: Swedish aktiebolag, max 10 years old, **max 10 employees**, **max SEK 10M** turnover or balance sheet, has not distributed profit. 2026 window: **12 Oct 2026 – 12 Jan 2027, 14:00**; decisions 23 Mar 2027. (A conflicting "1 Sep 2026" open date appeared once in search results and is treated as unreliable against the twice-confirmed 12 Oct date.)
- **Step 2:** up to **SEK 900,000**, Vinnova funds max 90% (≥10% own co-funding required); only open to companies that completed Step 1.
- **Fit:** clearest direct-funding match **if** Lifetime AB stays within the size caps — but the deadline (Jan 2027) is past the near-term window.
- **Source:** vinnova.se/e/innovativa-startups/innovativa-startups-2026

### 2.4 De-minimis / state-aid rules (governs all Vinnova grants above)

- Vinnova operates under Government regulation 2015:208, referencing EU GBER and the De Minimis Regulation.
- De-minimis ceiling: **€300,000 over a rolling 3-year period**, counted across all financiers, not just Vinnova. A signed de-minimis certificate is a hard requirement — applications missing it are rejected outright.
- Vinnova's own rules state recipients **cannot be in financial difficulty during the project**, but **no Vinnova page found explicitly restates the GBER <3-year exemption** the way the roadmap's Gate 1 framing assumes exists. **(verify directly — do not assume Vinnova automatically honors the young-company GBER carve-out without seeing it stated on a Vinnova rules page.)**
- Source: vinnova.se/sok-finansiering/regler-for-finansiering/statligt-stod

### 2.5 Other calls checked (lower relevance)

- **AI – Spets och innovation:** SEK 2–10M/project, but framed around industrial/manufacturing AI, not B2B compliance software — fit unconfirmed (verify before applying).
- **Starta er AI-resa! (company track):** requires 10–499 employees — **likely excludes an early-stage team**.
- **Verifiering för tillväxt:** appears channeled through university holding companies (spinout-oriented), not independent startups — likely not applicable without a university affiliation (verify).

---

## 3. Lane 3 — Almi (Sweden, state-owned financing)

**Target:** Lifetime AB, pre-revenue.

### 3.1 Almi Mikrolån (Microloan)

- **Amount:** Up to **SEK 250,000** per the FAQ page — but a separate Mikrolån page states SEK 200,000. **These two official pages disagree; treat the ceiling as (verify) pending direct confirmation, do not file on either figure alone.**
- **Co-financing:** "Normally does not require co-financing."
- **Collateral:** limited personal guarantee ("borgen") of 10% of the loan amount.
- **Rate:** not fixed/published; guidance suggests ~2–3 percentage points above bank rates.
- **EIF/InvestEU backing — confirmed, not assumed:** Almi and the European Investment Fund signed an InvestEU guarantee agreement (€211M in new SME/micro-enterprise lending capacity), explicitly named as enabling Mikrolån.
- **Eligibility:** Sweden-registered, up to 249 employees; targeted at micro-enterprises/sole traders struggling to access bank credit. Companies only, not private individuals.
- **Processing:** ~3–4 weeks via the applicant's regional Almi office.
- **Sources:** almi.se/en/loan/microloan/ ; almi.se/en/loan/microloan/frequently-asked-questions-about-micro-loan/ ; press.almi.se (InvestEU/EIF agreement)

### 3.2 Almi Innovationslån (Innovation loan)

- **Amount:** **SEK 50,000–500,000** (a "~SEK 300,000 typical" figure appeared only as an unquoted paraphrase — verify).
- **Co-financing:** required — Almi covers up to **50%** of estimated project cost; the rest must be sourced elsewhere.
- **Repayment:** usually 3–5 years, max 96 months (8 years); a deferred/interest-free development-phase period is referenced for Almi loans generally but not confirmed specifically for this product (verify).
- **Eligibility:** Sweden-registered, up to 249 employees; open to new and established companies "as commercially promising"; targeted at innovation projects needing testing/verification/prototyping before market — a reasonable fit for an early-stage AI product.
- **Application:** digital, via etjanster.almi.se, Mobile BankID authentication; requires financial statements/budget/liquidity forecast (for a newly formed company, a budget for current + following fiscal year). **Note:** BankID authentication implies a Swedish personal ID path — verify how a non-Swedish-resident founder authorizes the application.
- **Sources:** almi.se/en/loan/innovation-loan/ ; almi.se/en/loan/innovation-loan/frequently-asked-questions-about-innovation-loan/

### 3.3 Verifieringsmedel (Verification Grant) — grant, not loan

- **Amount:** up to **SEK 100,000** "in many cases."
- **Structure:** de-minimis state aid; total public de-minimis aid to the company capped at **€300,000 over 3 rolling years** (same ceiling as Vinnova's, and they count against the same cap).
- **Eligibility:** early-phase Swedish SMEs (and in some cases individuals with Swedish ID/bank account/business intent). One regional (Uppsala) page added a "potential to reach SEK 1M revenue + 1 FTE within 1–2 years" criterion that may be office-specific, not national — **(verify against the national page and against Lifetime AB's own regional office).**
- **Application:** starts as an advisor conversation, not a form — access to the formal e-service application follows an initial screening dialogue.
- **Sources:** almi.se/en/loan/verification-grant/

### 3.4 Other Almi products (lower relevance / unconfirmed terms)

- **Tillväxtlån (Growth Loan):** up to SEK 10M, normally requires co-financing (Almi covers 30–50%) — implies a later, post-traction stage than pure seed.
- **Exportlån (Export Loan):** confirmed to exist; amount/terms not found (verify).
- **Innovationscheck (regional, Jönköping page):** reimburses up to 50% of costs (cap SEK 150,000), but that regional page prioritizes companies with **≥SEK 1M revenue** — would likely exclude a pre-revenue Lifetime AB; unclear if this is national or regional-only (verify).

### 3.5 Cross-cutting Almi eligibility (all products)

Sweden-registered (or in the process of registering — pre-registration applications accepted, payout requires registration); up to 250 employees; turnover ≤€50M or balance sheet ≤€43M; applicant needs Swedish residence permit, EU/EEA right of residence, or Nordic citizenship; all applications routed through the applicant's regional Almi office.

---

## 4. Lane 4 — VGR (Västra Götalandsregionen, regional)

**Target:** Lifetime AB — **gated hard on regional presence; read this section before assuming any VGR program is usable.**

### 4.1 Såddfinansiering — nystartade innovativa företag (Seed financing, newly started innovative companies)

- **Form:** villkorslån (conditional loan); repayment begins once the innovation generates revenue, though one source separately says loans are "normally repaid within 5 years" — these two repayment descriptions are not reconciled **(verify)**.
- **Amount:** max **SEK 850,000**, covering max **65%** of eligible development costs. A conflicting reference to a smaller grant tier (up to SEK 50,000) and a conflicting minimum-application figure (SEK 150,000) both appeared and are **(verify)**.
- **Eligibility:**
  - Company **under 5 years old; priority to under 3 years** — Lifetime AB likely qualifies on age.
  - **Hard regional gate, consistently worded across sources:** "ska vara registrerade i Västra Götaland med avsikt att driva verksamheten här" — **must be registered in Västra Götaland with intent to operate there.** This is very likely a **blocking gate for Lifetime AB unless it establishes a registered VGR office/operating presence before applying** — do not assume this is satisfied.
  - Max 10 employees; innovation height must be confirmed by a third party (Almi, Vinnova, or an incubator); must operate on market terms with a business plan.
- **Deadline/cadence:** processed **löpande (continuously)**, "with exceptions for certain periods" — a **15 Jun–15 Aug and 15 Dec–15 Jan processing pause** was confirmed on a related VGR page (Digitaliseringscheck) and very likely applies broadly, meaning **applications submitted in July land inside the summer pause window** — verify current processing status before submitting.
- **Application:** Tillväxtverket's "Min ansökan" e-service, BankID login, requires a Bolagsverket registration certificate.
- **Contact:** foretagsfinansiering@vgregion.se
- **Source:** vgregion.se/regional-utveckling/omraden/naringsliv/foretagsfinansiering/nystartade-innovativa-foretag/

### 4.2 FoU-kort, Hållbarhetscheck, Internationaliseringscheck, Digitaliseringscheck — checked, excluded

All four require an **established** company with filing/turnover/headcount history Lifetime AB does not yet have:

| Program                    | Threshold that excludes Lifetime AB                                                                                                                       |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FoU-kort                   | Net turnover ≥SEK 5M + 5–250 employees                                                                                                                    |
| Hållbarhetscheck           | ≥2 full-year employees + ≥SEK 3M turnover                                                                                                                 |
| Internationaliseringscheck | ≥2 annual reports (alone rules out a company <3 years old)                                                                                                |
| Digitaliseringscheck       | Funds companies _buying_ consulting services from vendors — not a channel Lifetime AB could apply through as an applicant even before checking thresholds |

All four also carry an explicit or implied Västra Götaland presence requirement.

### 4.3 Innovationsfonden VGR and Regionalt investeringsstöd — checked, not relevant

- **Innovationsfonden VGR** is restricted to individuals employed within VGR-financed healthcare — not applicable to an outside company.
- **Regionalt investeringsstöd** is geographically restricted to specific national-support-area municipalities (Dalsland, norra Bohuslän, norra Skaraborg) and funds physical investment (machinery, buildings), not software — not applicable unless Lifetime AB is registered in one of those municipalities.

### 4.4 Verdict on the regional-presence gate (verify)

Based on consistently worded text across the Såddfinansiering, Hållbarhetscheck, Internationaliseringscheck, and Digitaliseringscheck pages, **the Västra Götaland registration/presence requirement is very likely a hard blocker for every VGR program checked**, unless Lifetime AB establishes a registered office or operating presence in the region before applying. This verdict itself needs a direct live-page confirmation pass (§0.2) before it drives the 2026 grant strategy.

---

## 5. Consolidated near-term action list (2026, in deadline order)

| Deadline                                               | Lane     | Instrument                                            | Amount                                                   | Gate to clear first                                                                                                                                                    |
| ------------------------------------------------------ | -------- | ----------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Rolling / act now**                                  | Apurahat | LUT-yliopiston ja ammatillisen koulutuksen tukisäätiö | Not confirmed (verify)                                   | None — contact directly, easiest near-term step                                                                                                                        |
| **Rolling / act now, but likely paused until ~15 Aug** | VGR      | Såddfinansiering                                      | Up to SEK 850,000 (verify exact cap)                     | **Confirm/establish VGR regional presence first — likely blocking otherwise**                                                                                          |
| **1 Jun – 15 Aug 2026**                                | Apurahat | Liikesivistysrahasto                                  | €27,000 (verify)                                         | Needs business-economics framing of the thesis                                                                                                                         |
| **3 Aug – 15 Sep 2026**                                | Apurahat | Nokia Foundation Scholarship                          | Up to €7,500 (verify)                                    | Requires principal-supervisor commitment statement — arrange with LUT supervisor now                                                                                   |
| **10 Sep 2026, 14:00**                                 | Vinnova  | Eurostars Call 11                                     | Up to SEK 5,000,000 (SE side)                            | Needs the Gate 1 FI-led-vs-SE-led decision (roadmap §2) + ≥1 independent partner; **not fundable via the Vinnova planning grant (§2.1 excludes Eurostars explicitly)** |
| **6 Oct 2026**                                         | Vinnova  | Planeringsbidrag (international planning grant)       | Up to SEK 500,000                                        | Only applicable to a **Horizon Europe-type** bid, not Eurostars                                                                                                        |
| **15–30 Oct 2026**                                     | Apurahat | Suomen Kulttuurirahasto                               | Not confirmed per-grant (verify)                         | General fallback if AI/ICT-specific funds unavailable                                                                                                                  |
| **12 Oct 2026 – 12 Jan 2027**                          | Vinnova  | Innovativa Startups Step 1                            | Up to SEK 500,000                                        | Company must stay ≤10 employees, ≤SEK 10M turnover, no profit distributed                                                                                              |
| **Rolling**                                            | Almi     | Mikrolån                                              | Up to SEK 200,000–250,000 (conflicting sources — verify) | None beyond standard Sweden-registration eligibility                                                                                                                   |
| **Rolling**                                            | Almi     | Innovationslån                                        | SEK 50,000–500,000                                       | Requires ≥50% co-financing from elsewhere                                                                                                                              |

**Not usable in the near term:** TES, Emil Aaltonen, KAUTE, HPY (all closed for 2026 — bank as 2027 targets, prepare KAUTE application materials early since its window historically opens in January); FoU-kort/Hållbarhetscheck/Internationaliseringscheck/Digitaliseringscheck (established-company thresholds Lifetime AB does not yet meet); Innovationsfonden VGR and Regionalt investeringsstöd (categorically not applicable).

---

## 6. Open gaps requiring a live-page confirmation pass

1. Almi Mikrolån exact ceiling (SEK 200,000 vs 250,000 — two official pages disagree).
2. Whether the GBER <3-year "undertaking in difficulty" exemption is explicitly honored in Vinnova's own eligibility screening (not found stated on any vinnova.se page).
3. Såddfinansiering: exact repayment trigger/schedule, minimum application amount, and whether the Jun–Aug processing pause applies to it specifically.
4. LUT-yliopiston ja ammatillisen koulutuksen tukisäätiö's actual working-grant amount and application mechanics (only the €2,000 completion-recognition figure and rolling cadence were found).
5. Whether foundation supervisor-statement requirements (KAUTE, HPY) exist, beyond the confirmed Nokia Foundation requirement.
6. Aurora-tietokanta.fi's own filtered listing (tekoäly/tietotekniikka/väitöskirja) was never directly browsed this session — re-run if aurora-tietokanta.fi access is available.
7. Whether Lifetime AB has (or can establish) a registered Västra Götaland presence — this single fact determines whether Lane 4 is usable at all.

All of §1–§6 should be treated as a research bank, not a filing-ready document, until the confirmation pass in §0.2 and §6 is complete.
