# DWS / Lifetime Oy — Canonical Traction Statement

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Initial creation. Single canonical, evidence-backed traction statement for Lifetime Oy / DWS IQ. Closes `docs/investor/INVESTOR_DOCS_AUDIT_2026-05-17.md` Gap 9 ("contradictions that will get caught in diligence"), which asked for one canonical customer list in May 2026 and was never produced. Retires the "6 paying customers / €7k MRR / 100% retention since Dec 2025" formulation and the propagation of dispatch operators (Uber, Bolt, Kela, Taksi Helsinki) as software customers. Founder-confirmed 2026-07-29.

Session Links & References:

- Audit that raised the gap: `docs/investor/INVESTOR_DOCS_AUDIT_2026-05-17.md` §Gap 9
- Investor data room: `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md`
- Truth registry: `DWS_TRUTH_STANDARD.md`

Document Status:

- Created: 29.07.2026
- Last Modified: 29.07.2026
- Language: English
- Publication Status: ACTIVE — canonical. Every other document reuses §2 verbatim or points here.

---

## 0. Why this document exists

For roughly seven months an inflated and internally contradictory traction claim propagated across this repository. It has cost the company money twice:

- **Arctic15 rejection** — internally diagnosed as "'€7-14k MRR (Fleet)' — a range, from the wrong division."
- **Defence Startup Fund rejection (23 April 2026)** — the application told the funder "Nykyisiä logistiikka-asiakkaitamme ovat Kela, Uber, Bolt ja Taksi Helsinki (MRR €7K)".

`INVESTOR_DOCS_AUDIT_2026-05-17.md` flagged the same contradictions as **Gap 9** and asked for one canonical list. This is that list.

**Rule:** no document in this repository may assert a customer count, an MRR figure, a retention rate, a TRL level, an industry count, or a pipeline status that is not reproduced from §2 below. Where a number is not verifiable from bookkeeping or a signed contract, it is marked `[UNVERIFIED]` here and must not be asserted externally at all.

---

## 2. THE CANONICAL BLOCK (reuse this verbatim)

> **Lifetime Oy — traction, as of 29 July 2026**
>
> **Services and transport revenue (funds the company; not software traction).**
> Lifetime Oy operates a licensed passenger-transport business and a small consulting practice. Combined, these run at approximately **€7,000/month**, which puts the company at **cash break-even with a founder salary of €0**. This revenue is what funds product development; it is explicitly **not** platform or software revenue and must never be presented as such.
>
> Ride orders reach Lifetime Fleet vehicles through **dispatch operators** — Uber, Bolt, Kela and Taksi Helsinki — acting in the dispatch-service role defined by Traficom. They charge commission on completed jobs and also buy transport capacity. They are **commercial counterparties of the transport operation, not customers of DWS IQ, DWS IQ Aegis, or any Lifetime software product.**
>
> **Software pipeline (real, contracted).**
> Two enterprise pilots were contracted in **Q1/2026 at €29,950 each (€59,900 booked)**. Additional smaller landed accounts are tracked under redacted LAND-\* codes in the investor data room. **Outokumpu** and **Kemira** are **active discussions with documented inbound replies**; offer letters are dated 27.6.2026 and carry no send confirmation, so their status is "in discussion" — never "filed" or "won".
>
> **Product status.**
> **DWS IQ Aegis is in preorder. General availability September 2026. Pre-revenue.** It is never described as "live" or "in production".
>
> **Technology readiness.**
> **TRL 5 completed, entering TRL 6**, anchored on the KYA engine — identity binding, session trust scoring, TC-4 Leash Snap running on the production API, and Article-12 audit tables deployed. TRL is anchored on KYA, **not** on Aegis and **not** on revenue.
>
> **Coverage.**
> The platform covers **25 EU-regulated industries**. The Aegis dual-use tier covers **21**. The figure 25 is never attributed to Aegis.
>
> **Team.**
> A **two-person core** — Founder/CEO and Office Chief — plus a **contracted engineering bench under NDA**.

---

## 3. Retired claims — do not reuse in any form

| Retired claim                                                                                                                      | Why it is retired                                                                                                                                                               | Replacement                                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "6 paying customers, €7k MRR, 100% retention since first paid deployment (Dec 2025)"                                               | Three separate defects: the customers are dispatch operators not software customers; the €7k is transport + consulting revenue; the "since Dec 2025" start date is unsupported. | §2, "Services and transport revenue" + "Software pipeline".                                                                                                                                     |
| "€7-14k MRR" / "€7k–14k MRR"                                                                                                       | A range, and sourced from the Fleet (transport) division while presented as platform MRR. This specific wording is what the Arctic15 rejection cited.                           | "approximately €7,000/month services and transport revenue".                                                                                                                                    |
| Uber / Bolt / Kela / Taksi Helsinki / Limo Helsinki / Sixt as customers of DWS IQ, Aegis, "the platform", or "logistics customers" | They are dispatch operators under the Traficom-defined role, and commercial counterparties of the transport business.                                                           | "dispatch operators … not customers of any Lifetime software product".                                                                                                                          |
| "NCC — live customer" / "NCC" in the paying-customer table                                                                         | NCC appears as an _unlanded ULTRA-cohort prospect_ in `PROOF_POINTS_2026Q2.md` §2. Both cannot be true. The weaker claim is correct.                                            | NCC is a **prospect**, in the Nordic Tier-1 construction cohort.                                                                                                                                |
| "100% retention", "zero churn", "no customer lost since launch"                                                                    | Retention across a taxi register running since 2010 and a five-to-six-account software base are not the same population; the composite figure is not reproducible from either.  | Do not assert a retention rate. State the contracted pilot count instead.                                                                                                                       |
| "ORK — BID FILED"                                                                                                                  | The ORK bid pack records a submission deadline of **14 August 2026** (`bids/ORK160826/ORK160826_ALIHANKKIJA_EN.md`). A bid cannot have been filed against a future deadline.    | "ORK — bid in preparation; submission deadline 14 August 2026."                                                                                                                                 |
| "NATO DIANA application" (referring to the Riihimäki funding round)                                                                | Mislabelling. That application went to the **Defence Startup Fund**, administered by **Riihimäen Tilat ja Kehitys Oy** — a municipal grant instrument. Rejected 23 April 2026.  | "Defence Startup Fund (Riihimäen Tilat ja Kehitys Oy) — applied 26.3.2026, rejected 23.4.2026." A genuine NATO DIANA submission is separately in preparation and must not be conflated with it. |
| "Aegis is live / in production"                                                                                                    | Aegis is preorder, GA September 2026, pre-revenue.                                                                                                                              | "DWS IQ Aegis — preorder; GA September 2026."                                                                                                                                                   |
| "25 industries" attributed to Aegis                                                                                                | Platform = 25; Aegis dual-use tier = 21.                                                                                                                                        | Use the figure matching the subject.                                                                                                                                                            |
| "the team includes women and men across engineering, product and operations"                                                       | Overstates headcount against a two-person core.                                                                                                                                 | "Two-person core (Founder/CEO + Office Chief) plus a contracted engineering bench under NDA."                                                                                                   |
| Naming **Nokia** as a defence counterparty                                                                                         | The NDA covers the negotiations and the partnership and carries a €100,000 penalty.                                                                                             | "a defence-industry prime", where a reference is needed at all.                                                                                                                                 |

---

## 4. Evidence sources

| Claim in §2                                                               | Evidence                                                                                                                                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Two Q1/2026 enterprise pilots at €29,950 each; €59,900 booked             | `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md` §1, §3 (LAND-001, LAND-002), §4                                                                                               |
| Redacted LAND-\* landed accounts                                          | `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md` §3 (LAND-001 … LAND-006)                                                                                                      |
| ~€7k/month, and that a contemporaneous figure said **5** customers, not 6 | `backups/pre-quality-standards/index-backup-20251226.html` line 1236 and `dws10.com/index.html` line 1919: "Dec 6, 2025 \| €7k MRR \| 5 customers"                                    |
| Defence Startup Fund is a municipal RTOY grant, rejected 23.4.2026        | `docs/DEFENCE_STARTUP_FUND_APPLICATION.md` §0 (timeline; decision by Laura Manner-Raappana, RTOY)                                                                                     |
| ORK bid not filed; deadline 14 August 2026                                | `bids/ORK160826/ORK160826_ALIHANKKIJA_EN.md` line 104                                                                                                                                 |
| Outokumpu / Kemira are in discussion, not filed                           | `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_*.md`, `sales-outreach/LETTER_MARIA_SEDERHOLM_KEMIRA_MATERIAL_PACKAGE.md` — offer letters dated 27.6.2026, no send confirmation on file |
| Uber / Bolt / Kela / Taksi Helsinki are dispatch operators                | Traficom dispatch-service (välityspalvelu) role definition; founder confirmation 2026-07-29                                                                                           |
| Contradiction was known and unresolved since May 2026                     | `docs/investor/INVESTOR_DOCS_AUDIT_2026-05-17.md` §Gap 9                                                                                                                              |
| Whole statement                                                           | Founder confirmation, Risto Anton Päärni, 2026-07-29                                                                                                                                  |

---

## 5. Numbers still needing founder confirmation

These are **not** to be asserted externally until confirmed against bookkeeping or a signed contract.

| Item                                                                                        | Status                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exact split of the ~€7k/month between transport revenue and consulting revenue              | `[UNVERIFIED]` — no bookkeeping export in repo                                                                                                                                                           |
| Consulting customer **Caring Huoltopalvelu Tmi** (website work) — contract value and period | `[UNVERIFIED]` — named by the founder 2026-07-29; no contract or invoice in repo                                                                                                                         |
| Whether the software base at Dec 2025 was 5 or 6 accounts                                   | `[UNVERIFIED]` — the Dec-2025 site backup says 5; later documents say 6                                                                                                                                  |
| ACV of LAND-003 … LAND-006 (~€34k, ~€30k, ~€16k, ~€18k)                                     | `[UNVERIFIED]` — data-room figures are marked with "~"; the summed ~€158k ACV in `PROOF_POINTS_2026Q2.md` §5 is arithmetically inconsistent with a ~€7k MRR run-rate and one of the two must be restated |
| Whether LAND-003 … LAND-006 are still live                                                  | `[UNVERIFIED]` — "Live" status last confirmed 14.05.2026                                                                                                                                                 |
| Retention / churn across the software base                                                  | `[UNVERIFIED]` — no cohort data; do not assert                                                                                                                                                           |
| Customer LTV €161,000 and "€17K/yr vs €350K/yr cloud"                                       | `[UNVERIFIED]` — modelled, not observed                                                                                                                                                                  |

---

## 6. How to use this document

1. **Reusing the statement:** copy §2 verbatim. Do not paraphrase numbers.
2. **Shorter surface (a deck slide, a one-pager):** use only the lines you need from §2, unchanged.
3. **Correcting an existing document:** replace the offending claim with the §2 wording and add a line to that document's `VERSION AND AGENT HISTORY` block citing `docs/TRACTION_CANONICAL.md`.
4. **Correspondence that was already sent:** never edit the body. Per `DWS_DOCUMENT_STANDARD.md` §24, sent correspondence is preserved verbatim; add a dated correction note **above** the letter body.
5. **A number you cannot find here:** it is not canonical. Get founder confirmation and add it to §2 or §5 before using it.
