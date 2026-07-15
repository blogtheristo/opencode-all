# Europe Fundraising Roadmap 2026–2027 — DWS IQ / Lifetime (Master Timeline)

***

# VERSION AND AGENT HISTORY

Version: 1.4

Sessions & Modifications:

- Version: 1.4 | Tool: Claude Code | Session: claude/dach-france-anchors-caemw0 | Date: 15.07.2026 | Changes: DACH+France pack recovered (§0 row 1 → RECOVERED, points to `docs/lut/dach-france-anchors-research-2026-07.md`). §5 DACH+France section rewritten with per-anchor detail and two load-bearing corrections: FFG Industrienahe Dissertationen is not currently usable (2026 company-funding track exhausted + no Austrian establishment), and the Fraunhofer IAIS/BSI relationship is a strategic-cooperation agreement, not joint catalog authorship. §7 gaps closed (France €109B figure verified, FFG gate resolved) and new gaps added (AT legal-pillar anchor missing, FFG Niederlassung nuance, INESIA named lead). Merged onto main across the post-#1676 (EU/NATO), post-#1682 (FI/SE), and post-#1685 (delimiter fix) states so this stacks on every prior recovery instead of reverting any; kept the `***` header delimiters #1685 corrected.
- Version: 1.3 | Tool: Claude Code | Session: claude/brave-curie-qii1fv | Date: 15.07.2026 | Changes: Merge reconciliation for PR #1685 (resolved add/add conflicts against `main` in favour of main's canonical v1.2). Fixed the VERSION AND AGENT HISTORY block delimiters from `---` to `***` per DWS_DOCUMENT_STANDARD §2.1 — the v1.2 entry below claimed this correction was folded in via Copilot autofix, but this file's own opening/closing delimiters were still `---` (the autofix reached other files, not this one). This is the same finding Copilot re-flagged on PR #1685 (threads on lines 3 / 25); now genuinely fixed.
- Version: 1.2 | Tool: Claude Code | Session: claude/fi-se-funding-lanes-recovery-pbmlmg | Date: 15.07.2026 | Changes: Merged the FI/SE lane recovery (§0 row 4 → RECOVERED, §6 replaced with full lane detail from `docs/lut/fi-se-lanes-research-2026-07.md`) with the EU/NATO recovery (v1.1, landed independently on `main` via a PR from `claude/eu-nato-funding-recovery-lsogw2`) — both branches had independently added `docs/lut/fundraising-roadmap-2026-2027.md` and `scripts/claude-durability-checkpoint.sh`, producing add/add conflicts on merge; resolved by combining both change sets rather than picking one side. Also folded in GitHub Copilot autofix commits already applied directly on PR #1682 (`***` delimiter corrections, missing Document Status fields, `claude-durability-checkpoint.sh` hardening — `set -euo pipefail` + a `--quiet`-aware push retry that no longer swallows stderr on failure).
- Version: 1.1 | Tool: Claude Code | Session: claude/eu-nato-funding-recovery-lsogw2 | Date: 14.07.2026 | Changes: Recovered the EU Commission + NATO DIANA research pack (§0 row → RECOVERED, points to `docs/lut/eu-nato-instruments-research-2026-07.md`); corrected §3 deadline-table figures where the recovery run's verification against official sources diverged from a founder-supplied draft — notably EDF's deadline (was "mid-2027", is actually 29 Sep 2026), EIC Accelerator's equity ceiling (was €30M, is €10M), Digital Europe's budget/rate (was €2-3M/50-100%, is €8.5M-total-2-grants/50-75%), and NATO DIANA's cycle framing (3 Jul 2026 was the standing 2027-cohort deadline, not a missed one-off — next entry point is ~June/July 2027 for the 2028 cohort). Added NGI Sargasso and AI4Gov-X cascade calls to the near-term table.
- Version: 1.0 | Tool: Claude Code | Session: claude/europe-roadmap-agents-g9zs8a | Date: 13.07.2026 | Changes: Reconstructed the master fundraising roadmap from the field-note conclusions of the three parallel research agents (Nordic NO/DK, DACH+France, EU Commission + NATO DIANA) plus the existing FI/SE lanes. NOTE — the three detailed per-anchor research packs generated in a prior ephemeral cloud session were never committed to git and were lost when that container was reclaimed; this document rebuilds the load-bearing conclusions only. The full packs must be re-run to recover per-anchor detail (see "Recovery status" below).

Document Status:

- Created: 13.07.2026
- Last Modified: 15.07.2026
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
| DACH + France anchors                      | `docs/lut/dach-france-anchors-research-2026-07.md`  | **RECOVERED** (15.07.2026) — per-anchor detail, contacts, publications, fit scores, and two corrections banked                   |
| Nordic (NO/DK) anchors                     | `docs/lut/nordic-no-dk-anchors-research-2026-07.md` | **LOST** — not committed; re-run required                                                                                        |
| EU Commission + NATO DIANA                 | `docs/lut/eu-nato-instruments-research-2026-07.md`  | **RECOVERED** (14.07.2026) — re-run + verified against official sources; see that file §9 for corrections vs. the recovery draft |
| FI/SE lanes (apurahat, Vinnova, Almi, VGR) | `docs/lut/fi-se-lanes-research-2026-07.md`          | **RECOVERED** (14.07.2026) — primary-source research complete; see §6 below                                                      |

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

| Deadline                      | Instrument                                                                                                                         | Amount / shape                                                                                                                           | Why it matters                                                                                                                        | Gate / prerequisite                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **1 Aug 2026**                | **NGI Sargasso cascade call**                                                                                                      | Equity-free FSTP funding + 9-month programme                                                                                             | Fastest deadline in the pack; GBER-exempt cascade money                                                                               | None — file first                                                                                                   |
| **31 Aug 2026**               | **AI4Gov-X cascade call** (first cut-off)                                                                                          | FSTP, rolling cut-offs through Feb 2027                                                                                                  | Low-effort parallel filing alongside Eurostars drafting                                                                               | None                                                                                                                |
| **10 Sep 2026**               | **Eurostars Call 11** (open now)                                                                                                   | ~€1.5M project, **bilaterally co-funded per country** (no single EU-wide rate), SME-led, FI+SE                                           | **Best structural fit of everything found**                                                                                           | One independent partner + **Gate 1 decision** (FI-led after cure vs. SE-led via AB)                                 |
| **29 Sep 2026**               | **European Defence Fund — SME research action**                                                                                    | Up to €4M/project, **100% funded**                                                                                                       | **Corrected from a prior "mid-2027" estimate — this deadline is live now**, per `docs/lut/eu-nato-instruments-research-2026-07.md` §6 | Founder resourcing call vs. Eurostars/Digital Europe drafting load; defence clearance/export-control scoping needed |
| **1 Oct 2026**                | **Digital Europe — "COMPLIANCE" topic** (`DIGITAL-2026-AI-DATA-10-COMPLIANCE`)                                                     | **€8.5M total / 2 grants EU-wide** (~€4.25M avg); DEP standard rate 50%, SME rate 75% — corrected from an earlier €2-3M/project estimate | Topic is literally _"digital solutions for regulatory compliance through data"_ — the product's call title                            | Academic coordinator to shield the financial-capacity check                                                         |
| **6 Oct 2026**                | **Vinnova Planeringsbidrag** (planning grant for an international proposal)                                                        | Up to SEK 500,000                                                                                                                        | Funds prep for a **Horizon Europe-type** bid only — see §6, does **not** cover Eurostars prep                                         | Confirm target call is Horizon Europe, not Eurostars                                                                |
| **28 Oct 2026**               | **EIC dual-use window**                                                                                                            | €2.5M grant + **up to €10M equity** (corrected from an earlier €30M estimate), single company                                            | Created **June 2026** for exactly the **Aegis Defence** profile; blended/equity actions are GBER-UiD-exempt                           | Single-company; no consortium needed                                                                                |
| **12 Oct 2026 – 12 Jan 2027** | **Vinnova Innovativa Startups** Step 1                                                                                             | Up to SEK 500,000                                                                                                                        | Clearest direct grant fit for Lifetime AB if it stays ≤10 employees / ≤SEK 10M turnover                                               | Company-size caps; falls outside the ~16-week near-term window but should be queued                                 |
| **~June/July 2027**           | **NATO DIANA** next Challenge Call (2028 cohort) — the 3 Jul 2026 call was the standing 2027-cohort deadline, not a missed one-off | €100k grant + €300k equity-free                                                                                                          | Confirmed **on-ramp to the €1bn NATO Innovation Fund** (FI & SE are both LPs)                                                         | **Pre-engage VTT Otaniemi and LEAD Linköping this autumn** — independent of the call calendar                       |
| **Rolling (monthly review)**  | **Cascade / FSTP open calls**                                                                                                      | €30k–€200k, light applications                                                                                                           | **Mostly no financial-health gate** — the **fastest EU money available** (Gate 1 does not block these)                                | Light; monthly scan — see `docs/lut/eu-nato-instruments-research-2026-07.md` §4 for the corrected live inventory    |

Full per-instrument detail, source citations, and every correction made against the prior
recovery draft are in `docs/lut/eu-nato-instruments-research-2026-07.md` (EU/NATO) and
`docs/lut/fi-se-lanes-research-2026-07.md` (FI/SE).

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

**Full detail, contacts, publications, and runner-ups:**
`docs/lut/dach-france-anchors-research-2026-07.md` (recovered 15.07.2026).

- **Fraunhofer IAIS — AI Assurance and Assessments** (Dr. Maximilian Poretschkin) —
  **RQ2 bullseye, top-ranked overall (9/10).** New dedicated department stood up Feb 2025. **Correction:** the BSI relationship is a **strategic cooperation agreement**
  on conformity test procedures, not joint catalog authorship — the catalog itself is
  Fraunhofer-authored. Our agent-level audit layer remains **novel to them**.
  Engagement route: bilateral contract research now, Horizon/BMWK later.
- **CISPA Trustworthy AI flagship / ELSA network** (Prof. Mario Fritz) — **RQ1+RQ2,
  ranked #2 (8/10).** "Outstanding"-rated Helmholtz flagship; Fritz coordinates the EU
  excellence network ELSA — a built-in Horizon Europe consortium doorway.
- **TU Wien — TrustCPS** (Prof. Ezio Bartocci) — **RQ1 formal-verification fit, ranked
  #3 (8/10).** Active, EU-funded (FREELY project, ~€600k). **Correction — FFG
  Industrienahe Dissertationen is NOT currently usable:** the company-funding track
  for 2026 is exhausted (only research institutions can still apply), and the scheme
  requires an Austrian establishment (Niederlassung) Lifetime does not have. Reach
  Bartocci via Eurostars/Horizon consortium partnership instead, not the FFG route.
- **Switzerland (ETH Zurich SRI Lab / Prof. Martin Vechev, RQ1, 8/10):** now genuinely
  usable — Switzerland re-associated to Horizon Europe on 10 Nov 2025 (retroactive to
  1 Jan 2025), full consortium lead/coordinate rights, reversing the prior
  third-country friction. Route via Horizon Europe or Eurostars/EUREKA (Innosuisse
  funds the Swiss partner; Innosuisse's _national_ Innovation Projects instrument
  still cannot fund a foreign-led company directly).
- **France** — confirmed **consortium/ecosystem gravity, not a direct funding door**
  for a FI/SE company (PEPR IA/ANR only grants unfunded "partner" status to foreign
  companies). The **€109B AI Action Summit figure is verified** on the Élysée's own
  framing, but it is **private inbound investment into France**, not a grant pool —
  no bearing on Lifetime's funding options. Best RQ1/RQ2 partners: Inria FRAIME/FMICS
  (formal methods) and INESIA (AI evaluation/security institute, no named PI yet).
  Best legal-pillar (RQ2) anchor found in **any** DACH+France country: **ANITI
  Toulouse — Céline Castets-Renard's "Law, Accountability and Social Trust in AI"
  Chair** (7/10).

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

## 6. Existing FI/SE lanes (recovered, primary-source-verified 14.07.2026)

Full detail, sources, and `(verify)` flags: `docs/lut/fi-se-lanes-research-2026-07.md`.

- **Apurahat** (FI research grants) — decision rule stands: **apuraha → stay Finland.** Open
  2026 windows: **Nokia Foundation Scholarship** (up to €7,500, 3 Aug–15 Sep, best AI/ICT
  thematic fit), **Suomen Kulttuurirahasto** (15–30 Oct, single consolidated round from 2026),
  **Liikesivistysrahasto** (€27,000, 1 Jun–15 Aug, needs a business-economics framing), and
  the **LUT-yliopiston ja ammatillisen koulutuksen tukisäätiö** (rolling — easiest near-term
  step, contact directly). TES / Emil Aaltonen / KAUTE / HPY are all closed for 2026; KAUTE
  is the best structural fit (business+tech intersection) and should be prepared early for its
  ~Jan 2027 reopening.
- **Vinnova** (SE) — pairs with the AB entity. **Eurostars Call 11 closes 10 Sep 2026, 14:00**
  (up to SEK 5M for the SE side) — the most time-sensitive item across all four lanes.
  **Important correction:** the Planeringsbidrag (planning grant, up to SEK 500,000, closes
  6 Oct 2026) explicitly **excludes Eurostars/Eureka programs** — it only funds prep for
  Horizon Europe-type bids, so it cannot be used to fund Eurostars Call 11 prep work.
  **Innovativa Startups** Step 1 (up to SEK 500,000, opens 12 Oct 2026) is the clearest direct
  grant if Lifetime AB stays ≤10 employees / ≤SEK 10M turnover, but its deadline (12 Jan 2027)
  falls outside the near-term window. Whether Vinnova's own screening honors the GBER <3-year
  exemption is **not confirmed on any vinnova.se page** — `(verify)` before relying on it.
- **Almi** (SE) — **Mikrolån** (up to SEK 200,000–250,000, two official pages disagree on the
  ceiling — `(verify)`) needs no co-financing and is EIF/InvestEU-guaranteed (confirmed).
  **Innovationslån** (SEK 50,000–500,000) requires ≥50% co-financing from elsewhere and fits
  an early-stage product needing testing/verification. **Verifieringsmedel** (up to SEK
  100,000 grant, de-minimis) starts as an advisor conversation, not a form.
- **VGR** (Västra Götalandsregionen) — **hard gate: every program checked requires the company
  to be registered in Västra Götaland with intent to operate there.** Do not assume this is
  satisfied. **Såddfinansiering** (up to SEK 850,000 villkorslån, priority to companies <3
  years) is the only program Lifetime AB could plausibly qualify for on age/size, but the
  regional-presence gate is `(verify)`-flagged as likely blocking, and rolling applications
  submitted in July may land inside VGR's summer processing pause (mid-Jun–mid-Aug). FoU-kort,
  Hållbarhetscheck, Internationaliseringscheck, and Digitaliseringscheck all require an
  **established** company (annual reports, turnover, headcount) Lifetime AB does not yet have
  — checked and excluded.

## 7. Gaps to close before filing (per pack)

- **All figures:** re-verify on official pages before filing (§1).
- ~~France €109B AI Action Summit figure~~ — **RESOLVED**: verified on the Élysée's own
  framing (15.07.2026); it is private inbound investment into France, not a grant pool.
- ~~FFG (Austria): confirm whether the employer must be Austrian~~ — **RESOLVED**: yes,
  an Austrian Niederlassung is required, and the 2026 company-funding track is
  separately exhausted — the instrument is not currently usable regardless (15.07.2026,
  see `docs/lut/dach-france-anchors-research-2026-07.md` §2.2).
- **New gap (DACH+France pack):** no Austrian legal-pillar anchor for RQ2 identified —
  parallel to the existing NO/DK legal-pillar gap below.
- **New gap:** FFG Niederlassung nuance unresolved — whether a bare Austrian branch
  registration (no local R&D activity) would satisfy the gate needs a direct FFG
  helpdesk query.
- **New gap:** no named PI/lead confirmed for France's INESIA (AI evaluation/security
  institute) — worth a follow-up pass once its 2026-2027 roadmap produces contacts.
- **RQ2 legal anchor (NO/DK):** none found; **KU information-law centre** is an unverified lead.
- **Re-run the remaining lost research pack** (§0 — Nordic NO/DK; EU/NATO and DACH+France
  now recovered) to recover per-anchor contact detail and verified figures.

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
