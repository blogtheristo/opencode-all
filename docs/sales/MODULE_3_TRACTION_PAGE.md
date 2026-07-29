# Module 3 — Hard Traction Page

---

# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/winning-sales-strategy-qb1boj | Date: 28.06.2026 | Changes: Initial creation — one-page traction summary with hard numbers only. No projections. Designed for Arctic15 resubmission, investor decks, and the Riihimäki defence funding application.
- Version: 2.0 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Reconciled to `docs/TRACTION_CANONICAL.md`. Removed the dispatch operators (Kela, Uber, Bolt) and NCC from the customer table — they are not software customers. Removed the "€7,000-14,000 MRR (Fleet division)" row, the "6 paying customers" total, the 100% retention / 0% churn rows and the unverified €161,000 LTV. Corrected the "Diana defence application" mislabelling to the Defence Startup Fund (Riihimäen Tilat ja Kehitys Oy). Industry count corrected to the canonical 25 platform / 21 Aegis split.

Document Status:

- Created: 28.06.2026
- Last Modified: 29.07.2026
- Language: English
- Publication Status: ACTIVE — every number below traces to `docs/TRACTION_CANONICAL.md`

---

## Purpose

One page. Hard numbers only. No projections, no "expected," no ranges. Every number traces to `docs/TRACTION_CANONICAL.md`, which is the canonical source. This page replaces soft traction claims in all external materials.

---

# DWS IQ — Traction (as of Q2 2026)

## Revenue

Two revenue lines, kept strictly separate. Conflating them is what caused the Arctic15 and Defence Startup Fund rejections.

| Metric                                  | Number        | Source                                                                                                                           |
| --------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Signed software pilot contracts (Q1/26) | €59,900       | Two enterprise pilots at €29,950 each — `PROOF_POINTS_2026Q2.md` §1, §3                                                          |
| Services & transport revenue            | ~€7,000/month | Licensed transport operation + consulting. **Not software revenue.** Puts Lifetime Oy at cash break-even with founder salary €0. |

**Do not state a platform MRR.** The ~€7,000/month is transport and consulting revenue that funds the company; it is not recurring software revenue and must never be presented as such.

## Customers

Software customers only. Ride orders reach Lifetime Fleet vehicles through **dispatch operators** — Uber, Bolt, Kela and Taksi Helsinki — in the dispatch-service role defined by Traficom. They are commercial counterparties of the transport operation, **not customers of DWS IQ, Aegis, or any Lifetime software product**, and never appear in this table.

| Account  | Sector                            | Bundle landed                     | Year-1 ACV | Status                                  |
| -------- | --------------------------------- | --------------------------------- | ---------- | --------------------------------------- |
| LAND-001 | Nordic Tier-1 constructor         | DWS IQ 6 Enterprise Pilot (Q1/26) | €29,950    | Live; public-name authorization pending |
| LAND-002 | Central-Europe Tier-1 constructor | DWS IQ 6 Enterprise Pilot (Q1/26) | €29,950    | Live; public-name authorization pending |
| LAND-003 | Nordic engineering consultancy    | Material Oracle T2 + Emissions T1 | ~€34k      | Live; public-name authorization pending |
| LAND-004 | DACH industrial OEM               | Compliance T2                     | ~€30k      | Live; public-name authorization pending |
| LAND-005 | Nordic facilities operator        | Sovereignty Monitor T1            | ~€16k      | Live; public-name authorization pending |
| LAND-006 | Nordic infrastructure ops         | SiteSense T1                      | ~€18k      | Live; public-name authorization pending |

**Two enterprise pilots contracted Q1/2026 at €29,950 each.** LAND-003 … LAND-006 ACVs are approximate and their live status was last confirmed 14.05.2026 — see `docs/TRACTION_CANONICAL.md` §5 before quoting them.

Active discussions with documented inbound replies: **Outokumpu**, **Kemira**. Offer letters are dated 27.6.2026 and carry no send confirmation — state these as "in discussion", never "filed" or "won".

**NCC is a prospect**, not a customer — it sits in the unlanded ULTRA cohort in `PROOF_POINTS_2026Q2.md` §2.

**Do not assert a retention or churn rate.** There is no cohort data behind the previously published "100% retention / 0% churn".

## Product

| Metric                          | Number                                           |
| ------------------------------- | ------------------------------------------------ |
| Production agents               | 50                                               |
| EU-regulated industries covered | 25 (platform); 21 (Aegis dual-use tier)          |
| EU regulation documents indexed | 15,000+                                          |
| Industry ontologies             | 25                                               |
| Platform versions shipped       | 6 (V1-V6)                                        |
| EU AI Act Article 12 compliance | Shipped March 2026 (5 months before enforcement) |
| Edge inference latency          | <100ms (NVIDIA Jetson Orin Nano)                 |
| Cloud cost advantage            | €333K/yr vs comparable cloud-only                |

## Technology Readiness

**TRL 5 completed, entering TRL 6** — anchored on the KYA engine: identity binding, session trust scoring, TC-4 Leash Snap running on the production API, and Article-12 audit tables deployed. TRL is anchored on KYA, not on Aegis and not on revenue.

**DWS IQ Aegis is in preorder. General availability September 2026. Pre-revenue.** It is never described as "live" or "in production".

## Certifications & Roadmap

| Certification                | Status      | Date       |
| ---------------------------- | ----------- | ---------- |
| EU AI Act Article 12 logging | LIVE        | March 2026 |
| ISO 27001                    | In progress | Q3 2026    |
| SOC 2 Type II                | Planned     | Q4 2026    |
| IEC 62443 (OT Security)      | Planned     | Q4 2026    |

## Partnerships & Validation

| Partner             | Status                                  | What It Means                    |
| ------------------- | --------------------------------------- | -------------------------------- |
| NVIDIA              | Connect ISV Partner (Inception Program) | Hardware + AI platform validated |
| Microsoft           | Founders Hub L1-L4                      | Technology use validated         |
| Red Hat             | AI Event Partner (Finland, March 2026)  | Enterprise Linux ecosystem       |
| European Commission | InvestEU Portal x3 (INPO-20254383)      | EU institutional recognition     |
| EIC Accelerator     | Step 1 submitted (June 2026)            | Deeptech credibility signal      |
| Arctic15 SIRA       | Top 15 of 100                           | Startup innovation recognition   |
| Peachscore          | Cohort 25 (Growth 91/100, Heat 86/100)  | Nordic VC benchmark              |

## Capital Efficiency

| Metric                      | Number                                           |
| --------------------------- | ------------------------------------------------ |
| Monthly infrastructure cost | €15-50                                           |
| Cloud credits secured       | USD 125,000 (Google + AWS)                       |
| NVIDIA hardware secured     | €54,200                                          |
| Monthly burn (infra only)   | <€100                                            |
| Headcount                   | 2-person core (Founder/CEO + Office Chief) + contracted engineering bench under NDA |

## Regulatory Tailwind (Forced Purchase Timeline)

| Year | Regulation            | Effect                                           |
| ---- | --------------------- | ------------------------------------------------ |
| 2026 | CBAM operational      | Per-shipment declarations mandatory              |
| 2026 | CSRD wave 1 expansion | Thousands of new companies in scope              |
| 2026 | EU AI Act Article 12  | AI audit trail mandatory (August 2)              |
| 2027 | ETS2                  | Road transport + buildings emissions trading     |
| 2028 | EPBD                  | Embodied carbon reporting for buildings >1,000m2 |
| 2030 | Fit for 55            | 55% emissions reduction target                   |

---

## Usage

- **Arctic15 resubmission:** Never restate "€7-14k MRR (Fleet)" — that range, taken from the transport division and presented as platform MRR, is what the rejection cited. Use the two-line revenue table above.
- **Investor decks:** This is slide 6
- **Defence Startup Fund / Riihimäki (Riihimäen Tilat ja Kehitys Oy — a municipal grant, not NATO DIANA):** Attach as appendix to pitch deck
- **Enterprise proposals:** Include as "About Lifetime Oy" section
- **Block71 Deep SAGE:** Already incorporated (strongest existing material per Risto's assessment)
