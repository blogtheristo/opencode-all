# EU Funding Brief — Equity-Free Bridge Capital Shortlist (2026 H2)

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                                |
| -------------- | -------------------------------------------------------------------- |
| Version        | 1.0                                                                  |
| Date           | 2026-07-15                                                           |
| Author         | Lifetime Oy                                                          |
| Owner          | risto-001                                                            |
| Status         | Draft — pre-decision                                                 |
| Classification | Internal                                                             |
| Introduced-In  | PR-TBD                                                               |
| Branch         | claude/ngi-sargasso-gber-i2l47d                                      |
| Source         | NLnet.nl, EU Funding & Tenders Portal, CORDIS (retrieved 2026-07-15) |

---

## 0. Why this brief exists

A prior session floated **"NGI Sargasso — Aug 1 deadline — GBER-exempt €100K
bridge."** On verification the premise is false: **NGI Sargasso is closed**
(project ended 31 Dec 2025; final call OC5 closed 25 Nov 2024). The remembered
Aug-1 / €100K / equity-free / transatlantic terms are authentic Sargasso, but
from an earlier open-call cycle — the year was mis-remembered as 2026.

This brief captures the **live** equity-free options that actually exist in
2026 H2, so the "fast bridge capital" thesis has a real target instead of a dead
one. It is the companion to `EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` (the larger,
higher-fit lump-sum grant, deadline 01 Oct 2026).

---

## 1. Terminology correction — "GBER-exempt" is the wrong frame

- **GBER** (General Block Exemption Regulation) governs **Member-State** aid —
  it exempts national aid schemes from prior Commission notification. It is a
  _state-aid_ concept.
- The funds below are **EU cascade funding / Financial Support to Third Parties
  (FSTP)** under Horizon Europe — Union money passed through a funded project to
  third parties. This is **not Member-State aid**, so GBER is not the operative
  test.
- What actually matters for Lifetime Oy as recipient: **equity-free** (no
  dilution), **grant not loan**, **small ticket**, **light-touch process**.
  All the options below meet those on the recipient side. Per-call state-aid
  treatment should still be confirmed from each call's Guide for Applicants
  before signing.

---

## 2. Live shortlist (verified 2026-07-15)

| #   | Fund / call                                  | Deadline                                                                                            | Ticket (equity-free)                                                  | Fit for DWS IQ                                                                                  | Verdict                                                    |
| --- | -------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1   | **NLnet — NGI TALER** (`2026-02T`)           | **01 Aug 2026, 12:00 CEST**                                                                         | up to ~€50k (NLnet scale)                                             | Low — scoped to GNU Taler / privacy-preserving **payments**                                     | Skip unless a real payments-privacy angle exists           |
| 2   | **NLnet — NGI Fediversity** (`2026-08F`)     | 01 Aug 2026 window                                                                                  | NLnet scale                                                           | Low–med — decentralised/self-hosted **hosting** stack                                           | Skip unless self-hosting play                              |
| 3   | **NLnet — NGI Zero Commons** (general)       | **Final call closed 01 Jun 2026; reopens after summer** (next cut-off likely 01 Oct or 01 Dec 2026) | first grant up to **€50k**, later up to **€150k**, €500k lifetime cap | **Med–high** — open-source internet commons; a sovereign-EU / open compliance-core framing fits | **Primary bridge candidate** — watch for reopening         |
| 4   | **Digital Europe — DIGITAL-2026-AI-DATA-10** | 01 Oct 2026, 17:00 Brussels                                                                         | Lump-sum grant (≫ €100k, consortium)                                  | **Highest** — thesis-level match                                                                | Main track (separate brief) — not a "bridge", a real grant |

Sources:

- NLnet Aug-1 call: https://nlnet.nl/news/2026/20260601-call.html
- NGI Zero Commons Fund: https://nlnet.nl/commonsfund/ · Guide: https://nlnet.nl/commonsfund/guideforapplicants/
- NGI TALER (portal): https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/competitive-calls-cs/12563
- Cascade Funding Hub (aggregator): https://cascadefunding.eu/open-calls/

---

## 3. The honest read

- **There is a real Aug-1-2026 equity-free door** — but it's **NLnet Taler /
  Fediversity**, both narrowly scoped. Forcing DWS IQ into either would be
  reverse-engineering the product to the call; reviewers see through that.
- **The right NLnet door for DWS is NGI Zero Commons**, and it is **temporarily
  closed** (reopens after summer). That removes the "18 days out" urgency — the
  realistic bridge window is **autumn 2026**.
- **No transatlantic (EU+US/Canada) €100K successor to Sargasso is open.** That
  specific niche closed with Sargasso.
- Net: the fast-bridge thesis survives, but the timeline is **weeks-to-months,
  not 18 days**, and the vehicle is NLnet NGI Zero Commons (small, fast,
  equity-free) — with Digital Europe `DIGITAL-2026-AI-DATA-10` as the larger
  parallel track.

---

## 4. Recommended next steps

| #   | Action                                                                                                                                               | Owner      | Target       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------ |
| 1   | Confirm exact NGI Zero Commons reopening date + next cut-off (watch nlnet.nl/commonsfund)                                                            | Risto + AI | rolling      |
| 2   | Decide which OSS module is the Commons "internet commons" deliverable (candidates: MCP compliance server, `emission-factors.ts`, `esrs-registry.ts`) | Risto      | on reopening |
| 3   | Draft the ~2-page NLnet proposal (NLnet applications are short by design)                                                                            | Risto + AI | on reopening |
| 4   | Assess whether any DWS payments-privacy angle justifies the Aug-1 Taler call                                                                         | Risto      | 2026-07-25   |
| 5   | Keep DIGITAL-2026-AI-DATA-10 (Oct 1) as the main EU track — see companion brief                                                                      | Risto      | 2026-10-01   |

---

## 5. Open questions

1. Does the fast-bridge need land **before** autumn? If yes, EU cascade funding
   cannot supply it on that timeline — look to non-dilutive national instruments
   (Business Finland) or revenue/bridge financing instead.
2. Is an OSS release of a DWS compliance module acceptable as a grant deliverable
   (it is required for NLnet Commons and strengthens DIGITAL)? Licence: EUPL vs
   Apache-2.0.
3. Single-applicant (NLnet allows individuals/small teams) vs consortium — NLnet
   is fast because it needs neither partners nor co-financing.

---

**End of brief.**
