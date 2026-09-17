# Data Room 2026 Q2 — Pricing Model (Labor-Anchored Unit Economics)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-labor-pricing-thesis-rWS2b | Date: 14.05.2026 | Changes: Initial creation — labor-anchored unit economics for DWS 365 Skilled Agents: per-SKU gross margin, inference-cost sensitivity (0.5×/1×/2×/5×), Year-1 vs Year-2 ACV per landed account, attach-rate assumptions (70% second-agent within 6 mo). Sourced from docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md. Spine: labor-anchored pricing · regulation drives demand · MACC + AppExchange drive distribution.

Session Links & References:

- Claude Code (claude/investor-labor-pricing-thesis-rWS2b): https://github.com/blogtheristo/dws6/commits/claude/investor-labor-pricing-thesis-rWS2b
- Source: docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md
- Companion: docs/investor/INVESTOR_ONE_PAGER_2026Q2.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/investor-labor-pricing-thesis-rWS2b/docs/investor/data-room-2026Q2/PRICING_MODEL.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE — investor data room, under NDA

***

## 1. Headline Bundle Economics

The buying unit is the **Full Skilled Workforce** bundle. Investor framing uses bundle math; sales conversations adapt per role.

| Line                                           | Value                  |
|------------------------------------------------|------------------------|
| List price (per-agent-month bundle)            | **€19,990 / month**    |
| List price (annual prepay)                     | **€199,990 / year**    |
| FTEs replaced (EU loaded cost basis)           | 6 – 8 EU FTE           |
| Replaced loaded human cost                     | **€600k – €1.2M / yr** |
| DWS price as fraction of replaced human cost   | A meaningful fraction — defended per deal against the customer's actual labor baseline, not a fixed industry ratio. |

The bundle composition is the sixteen Skilled Agents listed in §2 below, Themis-coordinated, with KYA TC-2+ runtime trust, audit trail, and EU data residency.

---

## 2. Per-SKU Gross Margin (Standalone, List Price)

Gross margin defined as `1 − (inference COGS + thin human-on-loop review + payment/listing fees) / list price`. Marginal-only — fixed costs (R&D, platform engineering, sovereign hosting baseline) are below the gross-margin line. Inference COGS modeled at 2026 May rates; sensitivity in §4.

| Skilled Agent          | Per-agent-month list (€) | Annual list (€) | Inference COGS / mo (€) | Themis review / mo (€) | GM (%) |
|------------------------|-------------------------:|----------------:|------------------------:|-----------------------:|------:|
| Compliance             |                    2,999 |          29,990 |                     220 |                    180 |  87%  |
| Material Oracle        |                    1,999 |          19,990 |                     180 |                    140 |  84%  |
| SiteSense              |                    2,499 |          24,990 |                     280 |                    120 |  84%  |
| Schedule Genius        |                    1,999 |          19,990 |                     150 |                    120 |  87%  |
| Emissions Data         |                    1,499 |          14,990 |                     140 |                     90 |  85%  |
| Logistics              |                    1,799 |          17,990 |                     180 |                     90 |  85%  |
| Construction (bundle)  |                    3,999 |          39,990 |                     520 |                    220 |  82%  |
| Customer Sat           |                      999 |           9,990 |                      80 |                     60 |  86%  |
| Viability              |                    1,499 |          14,990 |                     100 |                     90 |  87%  |
| Deepwiki Extractor     |                      799 |           7,990 |                      70 |                     50 |  85%  |
| Quality Gate           |                    1,499 |          14,990 |                     180 |                     70 |  83%  |
| Sovereignty Monitor    |                    1,999 |          19,990 |                     120 |                    100 |  89%  |
| Competitor Surveil.    |                    1,499 |          14,990 |                     130 |                     70 |  87%  |
| SEO Audit              |                      999 |           9,990 |                      80 |                     60 |  86%  |
| Lead Feedback          |                      999 |           9,990 |                      70 |                     60 |  87%  |
| Themis (Coordinator)   |                    2,499 |          24,990 |                     180 |                    180 |  86%  |
| **Bundle weighted avg**|                          |                 |                         |                        | **~85%** |

Notes:
- Gross margin band is 82–89% across SKUs at list. Bundle-weighted ≈85%.
- Quality Gate is the lowest GM in the catalog (83%) because of verified-output schema review overhead. Sovereignty Monitor is the highest (89%) — pure inference + automated residency checks.

---

## 3. Year-1 vs Year-2 ACV per Landed Account

Attach motion: ≥70% of T1 and T2 customers attach a second Skilled Agent within 6 months. ≥25% of landed accounts move into a Function-as-a-Service bundle (ESG-FaaS, HSE-FaaS, Construction Ops Pod, Sovereignty & Compliance Pack, Go-to-Market Pod) inside Year 1.

| Landing SKU                              | Year-1 ACV (€) | 2nd-agent attach (Y2 add, €) | Y2 mix into FaaS bundle | Year-2 ACV (€) | Y2 ACV uplift |
|------------------------------------------|---------------:|-----------------------------:|------------------------:|---------------:|--------------:|
| Compliance T2 (Pro)                      |        29,990  |     +14,990 (Sovereignty Mon)| 25% → Sov & Comp Pack   |        44,980  |     +50%      |
| SiteSense T2 (Pro)                       |        24,990  |     +14,990 (Schedule Genius)| 30% → Construction Ops  |        39,980  |     +60%      |
| Material Oracle T2                       |        19,990  |     +14,990 (Emissions Data) | 35% → ESG-FaaS          |        34,980  |     +75%      |
| EU AI Act Compliance Sprint (bundle Y1)  |        39,990  |     (Y1 includes engagement) | n/a                     |        29,990  |     −25%* (Y2 = subscription only) |
| CSRD Reporting Accelerator (bundle Y1)   |        89,990  |     (Y1 includes engagement) | already FaaS            |        69,990  |     −22%* (Y2 = subscription only) |
| Full Workforce Onboarding (bundle Y1)    |       249,990  |     (Y1 includes engagement) | already Full Workforce  |       199,990  |     −20%* (Y2 = subscription only) |

*The bundle Y2 numbers look like contractions but they are not: Y1 includes a one-time engagement (€20k–€60k) that drops out of Y2 by design. Recurring agent subscription is steady or expanding.

Investor-facing rule of thumb: **single-agent landings expand +40–80% by Y2; bundle landings stabilize at ≥80% of Y1 ACV with the engagement dropping out by design.**

---

## 4. Inference-Cost Sensitivity

Inference COGS shocked at 0.5× / 1× / 2× / 5× current rates. Holding list price and human-on-loop overhead constant.

| Scenario | Inference cost factor | Bundle weighted GM | Per-Compliance GM | Comment |
|----------|----------------------:|-------------------:|------------------:|---------|
| Tailwind | 0.5× (model commoditization) | **~88%** | ~89% | What we model for 2027 if open-source frontier closes another fold. |
| Baseline | 1.0× (2026 May rates)        | **~85%** | ~87% | Current. |
| Stress   | 2.0× (capacity squeeze)      | **~73%** | ~78% | Still healthy software margins. |
| Severe   | 5.0× (regulatory inference tax) | **~55%** | ~64% | Profitable. We would re-price upward against labor baseline before this scenario materializes. |

The chart shape that matters: **margin is monotonic in inference cost; the price never has to follow it down because the anchor is human labor cost.**

---

## 5. CAC Payback

| Motion                                   | Blended CAC (€) | Y1 ACV (€)   | Payback (months) |
|------------------------------------------|----------------:|--------------:|-----------------:|
| Direct (Risto-led, Tier-1 outbound)      |       12,000    | 30k – 90k    | 4 – 12 mo        |
| Consult-plus-keep land motion (T1 bundle)|       18,000    | 35k – 90k    | 5 – 12 mo        |
| MACC-burn (Azure Marketplace)            |        6,000    | 25k – 60k    | 3 – 8 mo         |
| AppExchange (Salesforce co-sell)         |        9,000    | 12k – 30k    | 6 – 14 mo        |

MACC-burn is the fastest payback because the customer's procurement objection collapses (committed Azure spend pays the sticker). It is also the channel we lean hardest into post-SAFE.

---

## 6. What Investors Should Defend Against

- **Per-seat-pricing logic.** We do not sell seats. Push back if an investor models seat counts × seat price.
- **SaaS multiples comping.** Comps are vertical AI labor cos (Cognition, Sierra, Decagon, Harvey), not horizontal SaaS.
- **Inference-cost-is-existential narrative.** Inference cost going down is **good** for the model — that is the whole anchor argument.

---

## 7. Companion Documents

- `docs/investor/data-room-2026Q2/TAM_REFRAMED.md`
- `docs/investor/data-room-2026Q2/DISTRIBUTION_MOAT.md`
- `docs/investor/data-room-2026Q2/REGULATORY_TAILWIND.md`
- `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md`
- `docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md`
