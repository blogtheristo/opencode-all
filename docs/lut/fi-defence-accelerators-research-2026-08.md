# Finnish/European Defence Accelerator & Funding Options — Verification Pass (Aug 2026)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: Verification pass on a founder-supplied draft (5 options: DEFINE Accelerator, 17Tech Defence Accelerator, Oulu DefTech Cluster North, EDF SME calls, Business Finland ReArm) listing near-term Finnish/European defence and dual-use funding windows. Checked each claim against primary/secondary sources reachable from this sandbox (`ec.europa.eu` and several vendor sites returned HTTP 403 via the outbound proxy — consistent with prior sessions; relied on WebSearch snippets and secondary sources where primary fetch was blocked). Corrected one material omission (ReArm's 31.10.2026 hard deadline, absent from the draft), one figure conflict (17Tech funding amount), and flagged two items as unverified. Calendared the two confirmed hard deadlines (EDF 29.09.2026, ReArm 31.10.2026).

Document Status:

- Created: 05.08.2026
- Last Modified: 05.08.2026
- Language: English (source list Finnish, preserved in quotes)
- Publication Status: DRAFT — internal fundraising research
- Classification: CONFIDENTIAL — Fundraising strategy
- Document Type: Funding-instrument verification pass

---

## 0. Method

The founder supplied a Finnish-language draft covering 5 funding/accelerator options, structured
like the AI-drafted research packs this repo has verified before (`eu-nato-instruments-research-2026-07.md`,
`fi-se-lanes-research-2026-07.md`) — confident, specific figures that need checking against
primary sources before they're load-bearing for a real application. Same discipline applied here:
verify before citing (`fundraising-roadmap-2026-2027.md` §1).

**Sandbox constraint:** `WebFetch` returned HTTP 403 on every target this session (`17tech.fi`,
`definefinland.fi`, `oulu.com`, `ffg.at`, `hezelburcht.com` — all blocked by the outbound proxy,
same failure mode logged in `eu-nato-instruments-research-2026-07.md` v1.0's footer). `WebSearch`
snippets were the only available signal; some snippets themselves show internal date
inconsistencies (see §2 below) that a primary-source fetch would resolve. Treat anything marked
`(verify)` as not yet safe to put in front of the Commission or a funder.

---

## 1. Verification results, item by item

### 1. DEFINE Accelerator (Riihimäki) — draft mostly right, "autumn 2026" cohort **unconfirmed**

- Confirmed: 3-month programme, no equity taken, EU + OP Häme + City of Riihimäki co-funded,
  focus on defence/security/dual-use, remote participation possible (`www.definefinland.fi`,
  `riihimaki.fi`).
- **Unconfirmed:** the draft's specific "syksy 2026 (elo–marraskuu)" cohort with a June 2026
  application deadline. What's actually confirmed by search: a **Spring 2026** cohort kicked off
  19.03.2026 and ran to mid-June 2026. No search result surfaced an autumn 2026 cohort
  specifically — DEFINE may run on a spring-only or variable cadence rather than the twice-yearly
  pattern the draft assumes. `docs/DEFINE_APPLICATION_GUIDE.md` (repo, v1.0, dated 25.03.2026,
  i.e. written before the Spring 2026 cohort even started) is now stale on this point too — its
  "Autumn 2026 | Expected April–May 2026 | TBD" row predates confirmed information.
- **Action, not a citation yet:** check `definefinland.fi/en/accelerator/` directly (site returned
  403 to this sandbox) before treating any autumn-2026 date as real.

### 2. 17Tech Defence Accelerator (Helsinki & Kyiv) — real programme, **draft's numbers don't match what's verifiable**

- Confirmed real and current: Finnish accelerator with a Kyiv R&D centre for front-line testing
  with Ukrainian units, partnered with Defence Builder (`17tech.fi`, `thedefender.media`,
  `news.cision.com`).
- **Funding amount — conflict:** the draft states **€20,000–60,000 for 4–12% equity**. The most
  specific source found (17Tech's own Cision press release) states **up to €10,000–40,000 in
  funding for 4–12% equity** for the accelerator's earlier (Jan–May 2026) cohort. The equity
  range matches; the funding range does not. Do not use either figure without opening
  `17tech.fi/faq` directly (blocked here).
- **Timing — likely conflated across cohorts:** search results describe at least two different
  cohorts with inconsistent-looking dates (one 4-month cohort starting "late January 2026"; a
  separate mention of "the next accelerator... begins 1 September 2026" with an application
  deadline given as "15 December 2025" — that combination cannot both be right, since a
  1 September 2026 start could not have a 2025 application deadline for the _same_ cohort). The
  draft's own framing — "autumn 2026 cohort already running" + "next known batch, deadline
  15 Dec 2026, Jan-start" — is a plausible resolution of this, but is **not independently
  confirmed** here. `(verify on 17tech.fi/faq before treating 15.12.2026 as real)`.

### 3. Oulu DefTech Cluster North — draft's dates confirmed; scale is smaller than "test centre access" implies

- **Confirmed, matches draft closely:** project runs **01.09.2025–30.08.2027** (`oulu.com`),
  ERDF co-funded under "Uudistuva ja osaava Suomi 2021–2027", rolling/continuous membership —
  no application deadline.
- **Correction of framing, not fact:** this is a **regional cluster-building grant with a
  €227,800 budget** — a network/roadmap vehicle, not itself a source of funding or guaranteed
  test-centre access. The draft's "pääsyn... testialustoihin, kuten suunnitteilla olevaan NATO
  Innovation Rangeen" is plausible (Oulu's 6G/cyber/edge-AI profile is real and well-documented)
  but the NATO Innovation Range Oulu claim specifically was **not independently confirmed** this
  session `(verify)`. Treat this as a genuinely low-cost, low-risk network to join (registration,
  not an application), not as a funding or test-access instrument in its own right.

### 4. European Defence Fund (EDF) — deadline and the two named sub-calls both confirmed; **one repo inconsistency surfaced**

- **Confirmed:** call closes **29.09.2026, 17:00 Brussels time** — matches both the draft and the
  existing `eu-nato-instruments-research-2026-07.md`.
- **Confirmed, matches draft:**
  - **SME Development Actions** (`EDF-2026-LS-DA-SME`): **€30M** budget, **up to €6M/project**,
    **minimum 3 entities from 3 different EDF member states/Norway** (general EDF consortium
    floor — the draft's "vähintään kolme pk-yritystä" phrasing, i.e. specifically three _SME_
    entities rather than just three entities of any type, was not distinctly confirmed;
    `(verify exact SME-only requirement on the official call fiche)`).
  - **Disruptive Technologies** (EUDIS): **€27M** available, **2 entities from 2 different
    member states/Norway** minimum — draft is correct.
- **⚠️ Repo inconsistency found, not yet resolved:** `fundraising-roadmap-2026-2027.md` §3's
  near-term deadline table currently lists a _different_ EDF entry — "**SME research action**,
  up to €4M/project, **100% funded**" — for the same 29.09.2026 deadline. EDF _Research Actions_
  and _Development Actions_ are distinct instrument types (research actions are typically
  100%-funded; development actions are co-funded 20–80%), so this may be a **third, separate**
  EDF-2026 sub-call rather than an error — but it does not match either of the two sub-calls
  verified this session. **Do not treat the roadmap's "€4M/100%-funded" row and this session's
  "€30M/€6M-max/co-funded" or "€27M/2-partner" figures as the same call until reconciled against
  the official EDF-2026 work programme** (`ec.europa.eu` PDF fiches, blocked from this sandbox
  both times). Flagging per "surface conflicts, don't average them" rather than picking one.
- The draft's **TRL ≥4 minimum requirement** claim was not independently confirmed this session
  `(verify)`.

### 5. Business Finland ReArm — draft is directionally right but **omits the hard deadline entirely**

- **Correction — material omission:** the draft describes ReArm as an open-ended "normal Business
  Finland process." It is not: it is a **continuous call open 15.04.2026–31.10.2026**
  (`rakennerahastot.fi`, `elinvoimakeskus.fi`), i.e. it **closes in under 12 weeks** from today.
  This is now calendared (§3 below) — it was not calendared before, and per the draft it would
  have read as low-urgency when it is not.
- **Confirmed:** ERDF-funded under "Uudistuva ja osaava Suomi 2021–2027"; dual-use/defence SME
  development grant; own/private co-financing required; applied for via EURA2021.
- **Correction — regional structure:** ReArm is **regionally split**, not one national pot. The
  South Finland window (Uusimaa, Päijät-Häme, Kymenlaakso, South Karelia — **Lifetime Oy's home
  region, Espoo/Uusimaa, is in this window**) has **~€15M** available; other regions (Länsi-Suomi,
  Itä-Suomi) run separate calls with separate, smaller budgets. Apply to the South Finland call
  specifically, not a generic "ReArm" application.
- **EDF national co-funding note** (draft item 5b): plausible mechanism (Business Finland does
  administer EDF national top-up/co-funding processes) but the specific procedural claim
  ("hae sähköisesti heti kun tuki on siirtynyt puolustusministeriöstä BF:lle") was not
  independently verified this session `(verify with Business Finland directly if/when an EDF
application is filed)`.

---

## 2. Calendared (this session, 05.08.2026)

| Deadline                       | What                                                 | Calendar status                               |
| ------------------------------ | ---------------------------------------------------- | --------------------------------------------- |
| **29.09.2026, 17:00 Brussels** | EDF 2026 SME/Disruptive Technologies call closes     | ✅ Created, 30/14/3-day reminders             |
| **31.10.2026**                 | Business Finland ReArm (South Finland window) closes | ✅ Created, 30/14/3-day reminders             |
| 17Tech "15.12.2026" deadline   | Unconfirmed — see §1.2                               | Not calendared — verify the date first        |
| DEFINE autumn 2026 cohort      | Unconfirmed — see §1.1                               | Not calendared — no confirmed date exists yet |

---

## 3. Recommendation vs. the draft's own recommendation

The draft's own recommendation — prioritise the **EDF SME call (29 Sep 2026)** and start
consortium-building now, and register with **Oulu DefTech Cluster** for ecosystem access — holds
up under verification and is **not** contradicted by anything found this session. Two amendments:

1. **Add ReArm (South Finland, 31 Oct 2026)** as an equally near-term, lower-effort parallel
   track — no consortium required, national/regional grant, not an EU-level multi-country
   filing. Given Lifetime Oy's stage, this is arguably the _easier_ near-term win of the two.
2. **Resolve the EDF sub-call conflict (§1.4) before drafting anything** — filing against the
   wrong sub-call's budget/co-funding assumptions would produce a proposal that doesn't match its
   own call fiche.

---

## 4. Open items

- `[ ]` Reconcile the EDF "SME research action" (roadmap §3, €4M/100%-funded) vs. "SME
  Development Actions" (`EDF-2026-LS-DA-SME`, €30M/€6M-max/co-funded) discrepancy against the
  official EDF-2026 work programme once `ec.europa.eu` is reachable.
- `[ ]` Open `17tech.fi/faq` directly to confirm funding amount and the real next deadline.
- `[ ]` Open `definefinland.fi/en/accelerator/` directly to confirm whether an autumn 2026 cohort
  exists at all, and refresh `docs/DEFINE_APPLICATION_GUIDE.md` (currently stale, dated before
  Spring 2026 cohort started).
- `[ ]` Confirm the NATO Innovation Range Oulu claim before citing it anywhere external.
