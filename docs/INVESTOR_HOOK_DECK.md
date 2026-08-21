# Investor Hook Deck — DWS IQ 6

---

# VERSION AND AGENT HISTORY

Version: 3.2

Sessions & Modifications:

- Version: 3.2 | Tool: Claude Code (Sonnet 5) | Session: claude/redact-aegis-customer-names | Date: 31.07.2026 | Changes: Reconciled seat tiers to the canonical structure from the 2026-07-29 Boardy investor pack (LD-2026-014, supersedes LD-2026-007): Fleet Admiral EUR 200K (was EUR 500K), Captain EUR 50K x 9 seats with an optional EUR 150K triple bundle (removed the separate "Industry Captain" tier — it was a duplicate label for the same seat). See `docs/field-notes/2026-07-31-investor-captain-tier-pricing-reconciliation.md`.
- Version: 3.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-qivalis-research-ePIAY | Date: 13.04.2026 | Changes: Added Slide 4 — Qivalis payment rail + DWS IQ compliance ledger. Two-layer thesis. Scarcity + timing + strategic insight hook for Captain seats.
- Version: 3.0 | Tool: Claude Code (Opus 4.6) | Session: claude/add-debit-credit-compliance-FevOa | Date: 24.03.2026 | Changes: Added carbon balance sheet thesis as fundraising one-liner. Slide 1 now leads with "carbon balance sheet" framing. Added Slide 0 (one-liner). Updated moat to include debit-credit ledger and cross-vertical intelligence.
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/kya-standard-review-W3Qcg | Date: 15.03.2026 | Changes: Updated seat tiers (Fleet Admiral EUR 500K, Captain EUR 150K, Industry Captain EUR 50K x 8, Deputy unlimited). 20 industries (was 16). Sales sprint June 15 – August 15.
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/ceo-magazine-profile-EDmiH | Date: 16.02.2026 | Changes: New 3-slide investor hook deck. Leads with EUR 333k cost advantage, explains deep tech moat (LWM + edge + orchestration), closes with Captain seats CTA.

Session Links & References:

- Claude Code (claude/ceo-magazine-profile-EDmiH): https://github.com/blogtheristo/dws6/commits/claude/ceo-magazine-profile-EDmiH
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/INVESTOR_HOOK_DECK.md

Document Status:

- Created: 16.02.2026
- Last Modified: 24.03.2026 (v3.0)
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

---

## Slide 0 — The One-Liner

### Carbon balance sheet infrastructure for industrial Europe.

**Lifetime builds the carbon balance sheet — double-entry bookkeeping for CO2, so every tonne is tracked like every euro.**

A steel mill's ETS surrender (debit) flows through to a construction company's CBAM import (debit), becomes their CSRD Scope 3 disclosure, and determines their Taxonomy alignment (credit). Same carbon, four regulatory touchpoints, one auditable ledger.

50,000+ EU companies need this by 2028. We're shipping it now.

- EUR 7K MRR live. 100% retention. 6 paying customers.
- 20 EU-regulated industries. 21 AI agents. 13 open data sources baked in.
- DWS 7 ships persistent carbon balance sheet July 2026.
- EUR 650K SAFE at EUR 3.8M cap. Bridge to Series A 2026.

---

## Slide 1 — Why Is This Cheap?

### EUR 333,000 saved per year. Per customer.

Your cloud AI compliance bill: **EUR 350,000/year.**
Our edge AI compliance bill: **EUR 17,000/year.**

|                  | Cloud-only competitor | DWS IQ 6          |
| ---------------- | --------------------- | ----------------- |
| Inference cost   | EUR 27,750/month      | EUR 0 (on-device) |
| Infrastructure   | EUR 2,000-5,000/month | EUR 15-50/month   |
| Latency          | 2-5 seconds           | Under 100ms       |
| Works offline    | No                    | Yes               |
| **Annual total** | **EUR 350,000+**      | **EUR 17,000**    |

NVIDIA Jetson Orin Nano. EUR 500 per device. 7-15 watts. Solar-capable. Runs AI at construction sites, factory floors, and mid-ocean vessels where cloud doesn't reach.

**The compliance platform that works where your factories actually are.**

---

## Slide 2 — Why Can't Anyone Copy It?

### Three pillars. Each takes years to build. Together they're a moat.

**Pillar 1: Avoid €millions in tariff exposure with real-time embedded carbon tariff automation (CBAM) + supply chain disclosure mapping (CSRD).**
Double-entry bookkeeping for CO2. Every compliance event produces a journal entry — debit or credit, in both EUR and tCO2e. ETS surrender = debit. Free allocation = credit. CBAM certificate purchase = debit. The same tonne flows across ETS, CBAM, CSRD, and Taxonomy — four regulations, one ledger. When customer A's verified emissions become customer B's actual CBAM factor (instead of regulatory defaults), both ledgers get more accurate. Concrete example: a Finnish steel producer's verified ETS registry data — accepted as a Level 1 emission factor — directly reduced a Nordic construction group's CBAM certificate cost estimate by ~40% versus the regulatory default. Neither company negotiated or shared data directly; the ledger reconciled it automatically. That's a network effect. No competitor has this. 3-5 years to replicate.

**Pillar 2: The Lifetime World Model — proprietary intelligence.**
15,000+ EU regulatory documents indexed across 20 industries. Not a fine-tuned GPT on PDFs. A regulatory intelligence graph that maps obligations across ETS, CBAM, CSRD, EPBD, and every Fit for 55 regulation simultaneously. Seven years and six platform versions to build — now at version 6 with a roadmap through version 8. 3-5 years to replicate.

**Pillar 3: Edge deployment + model-agnostic orchestration.**
AI inference on NVIDIA Jetson at industrial sites where cloud can't reach. EUR 17K/year vs EUR 350K/year cloud. Replace Claude with any LLM tomorrow — the platform still works. The intelligence lives in the World Model and the carbon ledger, not the model provider. Built on Model Context Protocol (MCP). 2-3 years to replicate.

**DWS IQ is carbon balance sheet infrastructure. The Lifetime World Model is the regulatory intelligence. Together they turn commodity AI into a compliance engine that tracks every tonne like every euro — and runs where cloud can't reach.**

---

## Slide 3 — How Do I Get In?

### Pick your seat. Fleet Admiral to Deputy Captain.

**SAFE at EUR 3.8M valuation cap. 20% discount.**

| Tier               | Investment                            | Seats     | What you get                                                                                                                                                                                |
| ------------------ | ------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fleet Admiral**  | EUR 200,000                           | 1         | Strategic co-pilot. Board observer rights. First right of refusal on all follow-on rounds. Annual 1:1 strategy.                                                                             |
| **Captain**        | EUR 50,000 (EUR 150,000 for a triple) | 9         | Named captain of one of 25 EU-regulated industries. Quarterly strategy briefings. Priority pilot routing. Founding Situation Room access. A triple bundles 3 seats — own 3 industries under one SAFE. |
| **Deputy Captain** | EUR 5,000                             | Unlimited | Quarterly briefings. Upgrade path to Captain.                                                                                                                                               |

**9 Captain seats across 20 industries — 3 as single seats, or bundle a triple for EUR 150,000. First tranche gets the best terms.**

The 20 industries: Power & Heat, Iron & Steel, Cement & Lime, Chemicals, Aviation, Maritime, Road Transport, Construction, Agriculture, Waste Management, Aluminium, Pulp & Paper, Petroleum Refining, Food & Beverage, Glass & Ceramics, Mining, Telecommunications, Pharmaceuticals, Textiles, Water & Wastewater.

**What all tiers get:**

- Founding login to the Lifetime World Model + Situation Room Reports
- Quarterly briefings — full transparency
- Priority routing for pilot introductions in your industry
- Industry-specific regulatory intelligence and compliance alerts

**The company:**

- Lifetime Oy (Finland) — 35 years of domain expertise concentrated in the founder. Not learning the industry — encoding it into AI agents.
- Team: **two humans** — Risto Päärni (Founder/CEO — 35 years domain, 1,030+ PRs shipped) and **Lucille Santiago (Office Chief; Human-In-Command — operations, customer onboarding, investor welcome; offered partnership in Lifetime AB)**. Supported by AI agents operating under Risto's editorial authority at exec capacity — the product in action, not a team gap: Rocky (investor narrative, round positioning, lead qualification), Marcus (technical DD, architecture, integration delivery), Adrian (platform architecture, security framework, partner reviews). First €50K of raise funds a senior human **technical** hire by Q3 2026.
- Advisors: Hannamari Robertsson (CEO, Robertsson Oy — ESG & Business Consulting), Dr. Jarno Varteva & Dr. Erkki Räsänen (Metropolia University of Applied Sciences)
- EUR 7k MRR (March 2026) — 100% retention, zero churn
- Sales motion: Enterprise Navigator pilots at EUR 4,950 convert first to EUR 8,950 entry-level annual contracts, then expand via multi-site / multi-module upsells to a EUR 36K average ACV (25 customers x EUR 36K = EUR 900K ARR target).
- 2-month sales sprint: June 15 – August 15, 2026
- Three InvestEU Portal listings (INPO-20254383)
- NVIDIA Connect Partner (Groq), Microsoft Founders Hub (L1-L4), Google, AWS (Consulting Partner), IBM (Business Partner), Acer Finland, Konfitech
- 100% EU data residency (Finland, Germany, Netherlands)

**When a seat is taken, it's gone. Only 9 Captain seats.**

Become Captain: https://dws10.com/captain/index.html

Contact: risto@lifetime.fi | linkedin.com/in/ristopaarni

---

## Slide 4 — The Qivalis Window

### Rail. Ledger. Neither alone is enough.

12 of Europe's largest banks — BBVA, ING, and 10 others — are launching
**Qivalis**, a MiCA-compliant euro stablecoin, in H2 2026.
The ECB's own digital euro arrives no earlier than 2029.

That is a 2–3 year window in which private digital euro infrastructure
becomes the default for industrial B2B payments in Europe.

**Qivalis moves euros. It does not record what those euros mean to the regulator.**

|             |                                                      |
| ----------- | ---------------------------------------------------- |
| **Qivalis** | Settles the payment                                  |
| **DWS IQ**  | Books it against CBAM, CSRD, and ETS — automatically |

> _A payment without compliance recording is just a transfer._
> _Compliance without payment data is just an estimate._

When a Qivalis payment clears on a steel shipment, DWS IQ writes
three journal entries in the same second: CBAM obligation updated,
CSRD Scope 3 booked, ETS account reconciled.

**The 12 consortium banks are building payment infrastructure without a compliance layer. That gap opens Q3 2026.**

BBVA Ventures and ING Ventures are the most natural strategic
investors in Europe for a platform at this intersection.

Captain seats in Steel & Metals, Chemicals, and Cement
open the conversation. 9 seats. Q2 2026.

**DWS IQ is the compliance ledger for Qivalis-era industrial payments.**

---

## Slide 5 — Payment-Agnostic Infrastructure

### The compliance layer works on every rail. Not just Qivalis.

Nordea and OP, Finland's two largest banking groups, are outside the
Qivalis consortium at launch. Their industrial clients need a
payment-agnostic compliance layer. DWS IQ records every CBAM, CSRD,
and ETS obligation regardless of whether the payment moves via Qivalis,
SEPA, or any future rail.

This is not a Qivalis-dependent product. It is infrastructure for
European industrial payments — whatever form those payments take.

| Payment rail                               | DWS IQ compliance recording |
| ------------------------------------------ | --------------------------- |
| Qivalis (H2 2026)                          | Yes                         |
| SEPA (today)                               | Yes                         |
| ECB CBDC (2029+)                           | Yes                         |
| Any future MiCA-compliant stablecoin (EMT) | Yes                         |

**The compliance obligation exists at the transaction level —
not at the rail level. Every industrial payment that triggers
a CBAM, CSRD, or ETS event needs to be recorded. The rail is irrelevant.**

Nordea, the Nordic region's largest bank by assets, and OP, Finland's
largest banking group by deposits, are outside the consortium at launch.
Both represent addressable market that does not require Qivalis adoption
to use DWS IQ.

_(Source: Nordea Annual Report 2024; OP Group Annual Report 2024)_

**The Qivalis window opens Q3 2026.
The compliance obligation is already open.**

---

**Related documents:**

- `docs/DEEP_TECH_THESIS.md` — Full three-pillar deep tech defensibility argument
- `docs/CEO_PROFILE_RISTO_PAARNI_2026.md` — 10-page CEO profile (v2.2)
- `investor-outreach/investor-pitch-deck.md` — Full investor pitch deck
- `investor-outreach/INVESTOR_MEMO.md` — Investor memo (v1.4)
