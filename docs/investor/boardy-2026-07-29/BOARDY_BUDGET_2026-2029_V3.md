# DWS IQ — 2026-2029 Budget — V3 (actuals-anchored)

_Prepared for Boardy meeting 29 Jul 2026 · Lifetime Oy · CONFIDENTIAL — Internal · V3 (22.07.2026, rebuilt from Lifetime Oy bookkeeping actuals) · €000s unless noted_

Legend: **[A]** = actual (Lifetime Oy bookkeeping / KILA / filed bid) · **[M]** = modeled forward. NOT deck figures.

_Companion figures export (git-diffable, per Document Standard §24.2): [`BOARDY_BUDGET_2026-2029_V3.csv`](./BOARDY_BUDGET_2026-2029_V3.csv)._

---

# VERSION AND AGENT HISTORY

Version: 3.0

Sessions & Modifications:

- Version: 3.0 | Tool: Claude Code (claude-opus-4-8) | Session: claude/investor-letter-richard-wurl-5bwfa5 | Date: 24.07.2026 | Changes: Created the **repository source-of-truth copy** of the V3 (22.07.2026 actuals-anchored) budget that previously existed only as a Google Drive export ("DWS IQ — 2026-2029 Budget V3 (Boardy 29 Jul 2026)"). Content transcribed verbatim from the founder-provided board pack; no figures altered. This closes a data-drift gap (export-without-repo-copy). Canonical GM frame confirmed here — 85% at list, 80% conservative stress floor — reconciled against `docs/investor/data-room-2026Q2/PRICING_MODEL.md` §2/§4.

---

## Current state (mid-2026) — ACTUAL [A]

| Item             | Value                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Revenue          | ~€7,000/mo **services and transport revenue** (licensed transport operation + consulting) — F_Liite3 / F_Liite5, Lemonsoft. **Not software MRR.** Software: €59,900 of Q1/26 pilot contract value (2 × €29,950) + four smaller landed accounts. No churn/retention rate asserted — no cohort data. Canonical: `docs/TRACTION_CANONICAL.md` |
| Monthly cash out | ~€7,000/mo → **BREAK-EVEN**. 7k in, 7k out (founder-confirmed). We barely stay afloat.                                                             |
| Founder salary   | €0 — founder funds personal living separately (taxi days). The 100 €/h in the R&D-capitalization file is an **IMPUTED** accounting rate, NOT cash. |
| Team             | founder (hands-on, €0 salary) + Office Chief/HIC + Cubet Techno Labs (project-billed subcontractor) + governed AI agents                           |
| Retired          | V4.3 deck's −€18,100/mo "burn" + €276k/yr cost base were accrual/fully-loaded and WRONG — retired.                                                 |

## Cost base — ACTUAL ~€7k/mo; consolidate cloud [A]

| Item                | Value                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Cloud / infra       | Supabase + Cloudflare + GCP + GitHub Actions — **CONSOLIDATION TARGET** (founder priority). Exact €/mo to pull from Lemonsoft. |
| Product maintenance | €999/mo noted (F_Liite3)                                                                                                       |
| Other               | accounting (Lemonsoft) · tools · misc. Founder salary €0.                                                                      |
| Lever               | cloud consolidation is the main near-term cost reduction — fewer providers, one bill.                                          |

## Equity cure (Gate 1) — the real lever = R&D capitalization [A]

| Item                                             | Value                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instrument                                       | KPL 5:8 / IAS 38 activation of founder R&D to the balance sheet (intangible asset)                                                                                                                                                                                                                                                                                                                               |
| Amount                                           | **€594,000** — KILA-confirmed correct. Inflation-adjusted reverse-invoicing value €658,883; €594k = 90.2% (conservative).                                                                                                                                                                                                                                                                                        |
| Booked / available                               | €100,000 already booked (Phase 1, 10.04.2026, Lemonsoft); **€494,000 available** (Phase 2)                                                                                                                                                                                                                                                                                                                       |
| Why only €100k so far                            | Phase 1 was the CONSERVATIVE first booking — iron-clad last-6-mo GitHub evidence (3,200 commits / 1,030 PRs), ≤€150k so an auditor statement suffices, minimal audit risk. Phase 2 (€494k) was held pending KILA confirmation of the full method — now CONFIRMED (advance decision, Mira Merikoski), so it is bookable. "Not activated" = not yet BOOKED, not disallowed.                                        |
| 2026 work increases the asset [A/M]              | €594k covers R&D THROUGH end-2025. All 2026 founder R&D (the DWS 6→7 build) is a SEPARATE additional activation in the 31.12.2026 fiscal year (bookable ~10.04.2027). Directional increment ~€100-150k (2025 Jan-Sep = 138 R&D days ≈ €105k) → cumulative capitalized R&D asset ~€700-750k by the 2026 close. ESTIMATE — confirm from the 2026 taxi/hour register; founder's OWN hours only (partners excluded). |
| Effect                                           | repairs Oy's negative equity DIRECTLY with Oy's OWN asset — the primary cure. Keep it in Oy.                                                                                                                                                                                                                                                                                                                     |
| Valuation support                                | independent: Gust €3.8M (2021), Monaco Fondry $6M (2022)                                                                                                                                                                                                                                                                                                                                                         |
| Cash-flow support (not equity)                   | Finnvera lyhennysvapaa defers debt = liquidity relief, NOT an equity cure                                                                                                                                                                                                                                                                                                                                        |
| Entity separation — do NOT cross-contaminate [A] | €594k R&D capitalization is Lifetime Oy's asset (generated by Oy's dev work, on Oy's balance sheet). Do NOT transfer it or the IP into Lifetime AB: that triggers IP-sale tax + valuation questions AND creates group-level GBER entanglement that could disqualify AB from Vinnova. Fix Oy with its own asset; keep AB clean and independent.                                                                   |

## ORK — Oikeusrekisterikeskus (pipeline) [A]

| Item       | Value                                                                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bid        | ORK/1462/2026 — AI Expert Services framework, Ministry of Justice; €1.7M framework ref; **BID IN PREPARATION — submission deadline 14.8.2026** (`bids/ORK160826/ORK160826_ALIHANKKIJA_EN.md`). Not filed. |
| If awarded | recurring revenue + Cubet becomes a paid partner. Would be the **first Finnish government software reference** — Kela is a dispatch counterparty of the transport operation, not a software customer.  |

## Forward plan — MODELED [M]

_(built on the ~€84k/yr actual baseline; SAFE/Series-A-funded growth)_

**Cash-basis P&L (€000s) [M]**

| Line                                        | 2026 |   2027 |   2028 |   2029 |
| ------------------------------------------- | ---: | -----: | -----: | -----: |
| Recognized revenue                          |  220 |  1,300 |  4,000 | 10,500 |
| Cash operating costs (funded-growth plan)   | −330 | −1,500 | −3,600 | −8,000 |
| Net operating cash flow                     | −110 |   −200 |    400 |  2,500 |
| Cumulative net op cash flow (pre-financing) | −110 |   −310 |     90 |  2,590 |

Cash-flow positive from **~2028**.

**Cost detail (cash, €000s) [M]**

| Line                                                                          |     2026 |       2027 |       2028 |       2029 |
| ----------------------------------------------------------------------------- | -------: | ---------: | ---------: | ---------: |
| Baseline organic (ACTUAL run-rate ~€84k/yr; infra · maintenance · accounting) |      −84 |       −150 |       −300 |       −500 |
| Growth hires (cash-paid; post-SAFE / post-Series-A)                           |     −150 |       −930 |     −2,450 |     −5,700 |
| Sales & marketing (Messe · MACC/AppExchange · travel)                         |      −60 |       −300 |       −700 |     −1,600 |
| G&A (legal · audit · compliance)                                              |      −36 |       −120 |       −150 |       −200 |
| **Total cash operating costs**                                                | **−330** | **−1,500** | **−3,600** | **−8,000** |
| Cash-paid headcount EoY (FTE; founder €0, excl. deferred)                     |        2 |          8 |         20 |         40 |

## Unit economics (memo) [A/M]

| Item          | Value                                                                                  |
| ------------- | -------------------------------------------------------------------------------------- |
| Gross margin  | **85% at list** (82-89% band; `PRICING_MODEL.md`); **80% stress floor** (conservative) |
| CAC / payback | Direct €12k · MACC-burn €6k · AppExchange €9k; payback 3-12 mo                         |

## Financing & runway [A+M]

| Line                                                    | 2026 |  2027 | 2028 | 2029 |
| ------------------------------------------------------- | ---: | ----: | ---: | ---: |
| SAFE (target €650k; up to €1.0M) — GROWTH capital [A]   |  650 |       |      |      |
| Series A (growth-acceleration option; ~€3.5M H2'27) [M] |      | 3,500 |      |      |

**Runway note:** Company is at cash break-even TODAY (~€7k in/out, €0 founder salary). SAFE is NOT survival runway — it funds the growth layer. R&D capitalization (€594k, growing with 2026 work) repairs equity; ORK award would add recurring revenue.

## Flags for the board

1. **Break-even today** on ~€7k/mo of services and transport revenue (not software MRR) with €0 founder salary — the plan below break-even is FUNDED growth, not survival spend.
2. **Equity cure = R&D capitalization €594k** (KILA-confirmed), €494k still to book — plus a further ~€100-150k from 2026 work (fiscal 2026).
3. **Near-term cost lever = consolidate cloud** (Supabase/Cloudflare/GCP/GitHub). Pull exact €/mo from Lemonsoft.
4. **ORK** (€1.7M framework, filed) is the biggest single revenue catalyst in the pipeline — track the award.

---

**Document version:** v3.0 · **Date:** 22.07.2026 (repo copy created 24.07.2026) · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
