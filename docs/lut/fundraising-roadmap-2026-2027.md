# Europe Fundraising Roadmap 2026–2027 — DWS IQ / Lifetime (Master Timeline)

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/eu-nato-funding-recovery-lsogw2 | Date: 14.07.2026 | Changes: Recovered the EU Commission + NATO DIANA research pack (§0 row → RECOVERED, points to `docs/lut/eu-nato-instruments-research-2026-07.md`); corrected §3 deadline-table figures where the recovery run's verification against official sources diverged from a founder-supplied draft — notably EDF's deadline (was "mid-2027", is actually 29 Sep 2026), EIC Accelerator's equity ceiling (was €30M, is €10M), Digital Europe's budget/rate (was €2-3M/50-100%, is €8.5M-total-2-grants/50-75%), and NATO DIANA's cycle framing (3 Jul 2026 was the standing 2027-cohort deadline, not a missed one-off — next entry point is ~June/July 2027 for the 2028 cohort). Added NGI Sargasso and AI4Gov-X cascade calls to the near-term table.
- Version: 1.0 | Tool: Claude Code | Session: claude/europe-roadmap-agents-g9zs8a | Date: 13.07.2026 | Changes: Reconstructed the master fundraising roadmap from the field-note conclusions of the three parallel research agents (Nordic NO/DK, DACH+France, EU Commission + NATO DIANA) plus the existing FI/SE lanes. NOTE — the three detailed per-anchor research packs generated in a prior ephemeral cloud session were never committed to git and were lost when that container was reclaimed; this document rebuilds the load-bearing conclusions only. The full packs must be re-run to recover per-anchor detail (see "Recovery status" below).

Document Status:

- Created: 13.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Fundraising strategy
- Document Type: Master fundraising roadmap / instrument timeline

***

## 0. Recovery status — read first

This roadmap was rebuilt from the summary conclusions of a prior research session whose
detailed outputs never reached git. State of the underlying material:

| Pack                                       | Detailed source file                                | Status                                                                                                                           |
| ------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| DACH + France anchors                      | `docs/lut/dach-france-anchors-research-2026-07.md`  | **LOST** — not committed; re-run required to recover per-anchor detail                                                           |
| Nordic (NO/DK) anchors                     | `docs/lut/nordic-no-dk-anchors-research-2026-07.md` | **LOST** — not committed; re-run required                                                                                        |
| EU Commission + NATO DIANA                 | `docs/lut/eu-nato-instruments-research-2026-07.md`  | **RECOVERED** (14.07.2026) — re-run + verified against official sources; see that file §9 for corrections vs. the recovery draft |
| FI/SE lanes (apurahat, Vinnova, Almi, VGR) | existing internal knowledge                         | retained                                                                                                                         |

The load-bearing conclusions below survived in the field note and are captured here. The
**per-anchor research packs** (source dumps, contact detail, verified figures) are not
recoverable from summary bullets and should be regenerated.

**Recovery runbook:** paste-ready re-run prompts (with priority order and the full loss
audit) are banked in `docs/lut/recovery-prompts-lost-research-packs-2026-07.md`.

## 1. Standing verification discipline (non-negotiable)

Every number in this document is **snippet-sourced** — the research environment could not
open primary pages. Nothing gets filed with a funder without re-verifying the figure,
deadline, and eligibility gate on the **official page first**. Where a claim is a lead
rather than a verified fact, it is marked _(verify)_. Per-pack gaps are listed in §7.

## 2. The two gates that control everything

Both gates are the founder's to open; nothing downstream unblocks until they do.

### Gate 1 — The equity cure (fundraising prerequisite, not book-keeping)

- Business Finland **cannot fund a "firm in difficulty."** Lifetime Oy's negative equity
  triggers the **GBER "undertaking in difficulty"** definition — this **blocks the FI side
  of Eurostars** (Business Finland co-funding) until the balance sheet is repaired.
- **Lifetime AB**, being **under 3 years old**, is **GBER-exempt** — so **Swedish-led
  applications are the live workaround** while the Oy heals. The AB registration is more
  valuable than previously assumed.
- **Gate 1 decision:** FI-led (after equity cure) vs. SE-led (via AB now). This decision is
  a prerequisite input to the Eurostars Call 11 application (see §4).

### Gate 2 — Entity geography picks the instrument

- The **NO / DK / AT industrial-PhD money** (€110k–€190k each) **all requires a locally
  registered entity employing the candidate**. These are **future options, not current
  ones** — unlocked only if/when a local subsidiary makes commercial sense.
- Useful detail: in the Nordic industrial-PhD schemes the **degree university may be foreign**
  — **LUT can remain the degree institution**. So a future Norwegian AS/Danish CVR branch
  would let the scheme **stack on top of the LUT doctorate**, not compete with it.

## 3. Near-term deadline table (next ~16 weeks)

| Deadline                     | Instrument                                                                                                                         | Amount / shape                                                                                                                           | Why it matters                                                                                                                        | Gate / prerequisite                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **1 Aug 2026**               | **NGI Sargasso cascade call**                                                                                                      | Equity-free FSTP funding + 9-month programme                                                                                             | Fastest deadline in the pack; GBER-exempt cascade money                                                                               | None — file first                                                                                                   |
| **31 Aug 2026**              | **AI4Gov-X cascade call** (first cut-off)                                                                                          | FSTP, rolling cut-offs through Feb 2027                                                                                                  | Low-effort parallel filing alongside Eurostars drafting                                                                               | None                                                                                                                |
| **10 Sep 2026**              | **Eurostars Call 11** (open now)                                                                                                   | ~€1.5M project, **bilaterally co-funded per country** (no single EU-wide rate), SME-led, FI+SE                                           | **Best structural fit of everything found**                                                                                           | One independent partner + **Gate 1 decision** (FI-led after cure vs. SE-led via AB)                                 |
| **29 Sep 2026**              | **European Defence Fund — SME research action**                                                                                    | Up to €4M/project, **100% funded**                                                                                                       | **Corrected from a prior "mid-2027" estimate — this deadline is live now**, per `docs/lut/eu-nato-instruments-research-2026-07.md` §6 | Founder resourcing call vs. Eurostars/Digital Europe drafting load; defence clearance/export-control scoping needed |
| **1 Oct 2026**               | **Digital Europe — "COMPLIANCE" topic** (`DIGITAL-2026-AI-DATA-10-COMPLIANCE`)                                                     | **€8.5M total / 2 grants EU-wide** (~€4.25M avg); DEP standard rate 50%, SME rate 75% — corrected from an earlier €2-3M/project estimate | Topic is literally _"digital solutions for regulatory compliance through data"_ — the product's call title                            | Academic coordinator to shield the financial-capacity check                                                         |
| **28 Oct 2026**              | **EIC dual-use window**                                                                                                            | €2.5M grant + **up to €10M equity** (corrected from an earlier €30M estimate), single company                                            | Created **June 2026** for exactly the **Aegis Defence** profile; blended/equity actions are GBER-UiD-exempt                           | Single-company; no consortium needed                                                                                |
| **~June/July 2027**          | **NATO DIANA** next Challenge Call (2028 cohort) — the 3 Jul 2026 call was the standing 2027-cohort deadline, not a missed one-off | €100k grant + €300k equity-free                                                                                                          | Confirmed **on-ramp to the €1bn NATO Innovation Fund** (FI & SE are both LPs)                                                         | **Pre-engage VTT Otaniemi and LEAD Linköping this autumn** — independent of the call calendar                       |
| **Rolling (monthly review)** | **Cascade / FSTP open calls**                                                                                                      | €30k–€200k, light applications                                                                                                           | **Mostly no financial-health gate** — the **fastest EU money available** (Gate 1 does not block these)                                | Light; monthly scan — see `docs/lut/eu-nato-instruments-research-2026-07.md` §4 for the corrected live inventory    |

Full per-instrument detail, source citations, and every correction made against the prior
recovery draft are in `docs/lut/eu-nato-instruments-research-2026-07.md`.

## 4. Eurostars — the anchor instrument (detail)

Best structural fit of everything found: **SME-led, FI+SE, ~€1.5M, 50% funded.**

- **Near-term Nordic play:** Lifetime Oy as the **Finnish SME lead**, with
  **Simula / SINTEF / Aarhus** as partners.
- Needs: **one independent partner** + the **Gate 1** decision.
- The **negative-equity / Business Finland co-funding** question is **decisive here** —
  if FI-led, the equity cure must complete first; if SE-led via AB, it proceeds now.

## 5. Academic anchors → which instrument each unlocks (consortium bench)

These anchors are the **Eurostars / Horizon partner bench**. Summary level only — the
detailed packs (§0) are lost and should be re-run for contact detail and verified figures.

### DACH + France

- **Fraunhofer IAIS — ZERTIFIZIERTE KI** (Dr. Maximilian Poretschkin) — **RQ2 bullseye.**
  They wrote the **German AI-certification assessment catalog with BSI**; our agent-level
  audit layer would be **novel to them** — ideal collaboration asymmetry.
- **TU Wien — TrustCPS** (Prof. Ezio Bartocci) — **RQ1 formal-verification fit.** Austria is
  the only DACH country that **pays companies for employed doctoral students**:
  **FFG Industrienahe Dissertationen, up to €110k, 2026 call open.**
  _Gate to verify:_ whether the **employer must be Austrian** (§2 Gate 2).
- **France** — Europe's **#1 in state-orchestrated AI capital** (€109B AI Action Summit
  announcement _(verify)_, France 2030, Mistral's €1.7B round) — **but the UK still leads
  private AI venture volume.** For a FI/SE company, France matters as **consortium/ecosystem
  gravity** (Inria / PEPR AI), **not a direct funding door.**

### Nordic (NO / DK)

- **Simula VIAS, Oslo** (Arnaud Gotlieb, Shaukat Ali) — **sharpest scientific match to
  RQ1/RQ3 anywhere in NO/DK**, with **proven Horizon Europe coordination experience**
  (matters for consortium-building). **Top Nordic anchor.**
- **Norway Nærings-ph.d.** (~€190k) and **Denmark Erhvervs-PhD** (~€143k) — generous but
  **both require a locally registered entity employing the candidate** (§2 Gate 2). Degree
  university may be foreign → **LUT can remain the degree institution.**
- **Realistic near-term Nordic instrument = Eurostars** (see §4).
- **Honest gap:** **no NO/DK legal-scholarship anchor** exists for **RQ2's legal pillar**.
  KU's information-law centre is an **unverified lead** _(verify)_.

### EU Commission + NATO DIANA

- Biggest instruments live here: **EIC Accelerator, Horizon Cluster 4, Eurostars, cascade/FSTP,
  EDF, DIANA challenge cycle + Nordic test centres, NATO Innovation Fund.**
- **DIANA → NIF path** is the confirmed on-ramp (§3); **FI & SE are both LPs** in the €1bn NIF.

## 6. Existing FI/SE lanes (retained)

- **Apurahat** (FI research grants) — decision rule stands: **apuraha → stay Finland.**
- **Vinnova** (SE) — Swedish innovation agency lane, pairs with the AB entity.
- **Almi** (SE) — Swedish financing.
- **VGR** (Västra Götalandsregionen) — regional SE lane.

## 7. Gaps to close before filing (per pack)

- **All figures:** re-verify on official pages before filing (§1).
- **France €109B** AI Action Summit figure — _(verify)_ on primary source.
- **FFG (Austria):** confirm whether the **employer must be Austrian**.
- **RQ2 legal anchor (NO/DK):** none found; **KU information-law centre** is an unverified lead.
- **Re-run the three lost research packs** (§0) to recover per-anchor contact detail and
  verified figures.

## 8. How this connects to what's already running

- **Track 1 session (AB)** and **Track 2 session (LUT / apuraha)** execute the July actions
  against this roadmap; this document is the **master** they run against.
- The **anchor research** feeds the **consortium column** — Simula, SINTEF, Aarhus,
  Fraunhofer IAIS, TU Wien are the **Eurostars / Horizon partner bench**.
- **Decision rule stands:** _apuraha → stay Finland_ — this roadmap **funds the company
  either way.**

## 9. The three highest-leverage actions this week

1. **Finnvera** — request _lyhennysvapaa_ (repayment holiday) → supports the equity cure.
2. **Accountant** — the **equity cure is Gate 1**; scope the balance-sheet repair.
3. **Eurostars partner search** — secure the one independent partner for Call 11 (10 Sep).

---
