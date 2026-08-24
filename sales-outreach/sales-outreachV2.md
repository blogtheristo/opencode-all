# Sales Outreach — V2

***
# VERSION AND AGENT HISTORY

Version: 2.1

Sessions & Modifications:
  - Version: 2.1 | Tool: Claude Code (Opus 4.7) | Session: claude/sales-outreach-note-Le9Rc | Date: 12.08.2026 | Changes: Latest-info refresh — added canonical product-name reconciliation (user's Aegis / Sovereign Infra / Connect vs canonical DWS IQ product lines per DWS_TRUTH_STANDARD.md rows 20 / 27 / 33), positioning-pillar alignment (row 22), traction guardrails (row 33 — Aegis pre-revenue until Sept 2026 GA; never claim MRR/ARR/customer counts), Estonian competitor note (Veriff adjacent, not competitor), current regulatory context (EU AI Act Art. 50 in force since 2 Aug 2026), and KYA-S1 assurance hook. User pitch text preserved verbatim per Rule 12. Fixed VERSION block delimiter to `***` per DWS_DOCUMENT_STANDARD.md and CLAUDE.md Markdown Delimiter Rule (had drifted to `---`).
  - Version: 2.0 | Tool: Claude Code (Opus 4.7) | Session: claude/sales-outreach-note-Le9Rc | Date: 12.08.2026 | Changes: Initial V2 outreach note — regulated-industry wedge (Aegis / Sovereign Infra / Connect), one-BU one-pilot framing, cross-jurisdiction positioning (EU / ASEAN / US)

Session Links & References:
  - Claude Code (claude/sales-outreach-note-Le9Rc): https://github.com/blogtheristo/dws6

Document Status:
  - Created: 12.08.2026
  - Last Modified: 12.08.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Purpose

V2 outreach note for regulated-industry decision-makers (Ops, Finance, Compliance
leadership). Positions DWS IQ as the **operational layer**, not another compliance
tool. Anchors on a single-BU, single-pain-point, measurable pilot.

**Use when:** the target company is multi-jurisdictional, has an existing ERP, and
treats compliance as recurring operational overhead rather than a one-off project.

**Do NOT use when:** the lead is asking for a point compliance tool, a reporting
dashboard, or a greenfield build. Route those to product-specific templates.

---

## Outreach Message (copy-paste)

> This is the right wedge for You.
>
> DWS IQ is the missing operational layer for regulated industry. We turn
> compliance from manual overhead into infrastructure that lowers risk, cuts
> cost, and scales across EU, ASEAN, and US jurisdictions.
>
> Today, regulated companies are still handling critical compliance work through
> fragmented legal, finance, and operations processes. That creates duplicated
> effort across subsidiaries, slower audit response, higher enforcement risk,
> and avoidable margin leakage. The work is mandatory, but the tooling is still
> too manual.
>
> DWS IQ changes that.
>
> - **Aegis** converts regulation into control, giving teams a practical layer
>   for audit trails, governance, and operational accountability.
> - **Sovereign Infra** handles jurisdiction-specific workflow automation, so
>   the same company can operate cleanly across different regulatory
>   environments.
> - **Connect** links directly into existing ERP and financial systems, so
>   compliance lives inside the workflow instead of sitting beside it.
>
> The point is not compliance software. It is less friction across industrial
> workflows, stronger auditability, and better cross-entity control. In
> practice, that means lower operating cost, faster regulatory response, and a
> system that gets stronger with every deployment.
>
> For Your business, I would start with one business unit, one pain point, and
> one measurable pilot outcome. If the pilot works, the rest becomes a
> distribution story.
>
> If this is of interest, I'd love to set up a short call and map one concrete
> use case.

---

## Why this message works

| Element                     | Effect                                                             |
| --------------------------- | ------------------------------------------------------------------ |
| "Operational layer"         | Reframes DWS away from crowded "compliance software" category      |
| Aegis / Sovereign / Connect | Three concrete capabilities, each mapped to a different buyer pain |
| EU / ASEAN / US             | Signals multi-jurisdiction readiness without naming specific regs  |
| One-BU pilot                | Lowers buyer risk — no platform bet, no multi-year commitment      |
| "Distribution story"        | Plants the expansion narrative without pushing it                  |
| No pricing, no SKU          | First contact is about fit, not procurement                        |

---

## Positioning-pillar alignment (`DWS_TRUTH_STANDARD.md` row 22)

The pitch aligns with all three canonical pillars — leave it alone, don't drift:

| Pillar                                | How the V2 pitch hits it                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **1 — Doctrine Shift**                | "compliance from manual overhead into infrastructure" = voluntary ESG → mandatory sovereign infra         |
| **2 — Orchestration Over Components** | Zero agent count, zero skill count, zero model name — the whole pitch is at the outcome layer             |
| **3 — Ari Test (Buyer-Side Truth)**   | "lower operating cost, faster regulatory response" = risk removed + leverage gained, procurement-quotable |

---

## Product-name reconciliation (READ BEFORE THE CALL)

The three names in the user's outreach copy are **marketing shorthand**, not the
canonical DWS product-line names. Every canonical product name lives in
`DWS_TRUTH_STANDARD.md` (rows 20, 27) and `DWS_BRAND_STANDARD.md` §2.1 / §22.

| Pitch name (V2 copy) | Maps to canonical                                                                                                                                                                                                                        | If the prospect asks "what is that?"                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Aegis**            | **DWS IQ Aegis** — the sovereign / dual-use / defence tier (Aegis Standard, Aegis Defence, Aegis Sovereign). **Aegis tier = 21 industries** (not 25).                                                                                    | "Aegis is our sovereign-tier deployment: single-tenant, defence-grade audit trails and governance. Available for 21 industries where dual-use rules apply."                 |
| **Sovereign Infra**  | The **three-pillar sovereignty model** (Data / Technology / Operational — row 16, `docs/PHD_FIREHORSE_EN.md` §14.23) and the SOV-T1/T2/T3 deployment tiers. There is no product literally named "Sovereign Infra" today.                 | "The infrastructure layer runs under EU / customer-jurisdiction sovereignty — Data, Technology and Operational pillars, so nothing leaves the perimeter you're audited on." |
| **Connect**          | **Not a canonical SKU.** The capability is real (ERP + financial-system integration) and lives in the `DWS IQ Industrial Intelligence` product line and the KYA-S1 provenance layer, but no product is shipped under the name "Connect". | "It's the integration layer into your ERP and finance systems — SAP, Oracle, Dynamics, Netvisor — so evidence and controls live inside the workflow rather than beside it." |

**If a customer-facing deliverable (proposal, LOI, contract) is drawn from this
V2 note, replace `Aegis / Sovereign Infra / Connect` with the canonical names
before it leaves.** The V2 shorthand is fine for a first-touch, category-setting
email — it is _not_ fine on a page a procurement team will diff against the
`dws10.com/config/products.json` mirror.

---

## Traction guardrails (`DWS_TRUTH_STANDARD.md` row 33)

These are hard **DO NOT SAY** items. Row 33 exists because prior variants cost
the company an Arctic15 rejection and a Defence Startup Fund rejection.

- **Aegis is preorder — General Availability September 2026 — pre-revenue.** Never say "live", "in production", "deployed at N customers".
- **Never quote MRR/ARR figures**; ~€7,000/month is _services and transport_ revenue, not software MRR. Software Q1/2026 traction is **€59,900 of pilot contract value** (two enterprise pilots at €29,950 each) plus four smaller landed accounts under redaction.
- **Never assert customer counts**, "6 paying customers", "100% retention", "zero churn", or "~€84k ARR".
- **Uber / Bolt / Kela / Taksi Helsinki are dispatch operators**, not DWS IQ customers. Never present them as such.
- **Platform = 25 industries; Aegis = 21.** Never attribute 25 to Aegis.
- **Never name Nokia as a defence counterparty** (NDA, €100k penalty). Use "a defence-industry prime" if the reference is unavoidable.
- **TRL:** TRL 5 completed, entering TRL 6, anchored on the KYA engine — not on Aegis and not on revenue.
- **Team:** two-person core (Founder/CEO + Office Chief/HIC) + contracted engineering bench (Cubet Techno Labs, Kochi) + a **funded and active** senior technical leadership hire. Not "solo founder". Not "CTO gap".

---

## Regulatory context — pitch this against (as of 12.08.2026)

- **EU AI Act Article 50 — deployer duties in force since 2 August 2026.** Any prospect publishing AI-authored text to inform the public without human editorial responsibility is already exposed; Aegis's provenance layer answers this. (Row 31.)
- **CSRD** — first wave of large undertakings reported FY2024; wave 2 (large non-listed) reports FY2025 through 2026.
- **CBAM** — definitive regime from 1 January 2026; quarterly reports live.
- **NIS2** — national transpositions live across EU-27; enforcement ramping.
- **Machinery Regulation (EU) 2023/1230** — applies from 20 January 2027; physical-AI conformity route via NVIDIA Halos brief (row 28).
- **EU AI Act Article 12 (reasoning lineage)** and **Article 14 (human oversight)** — the KYA-S1 layer answers both; do not conflate with Article 50 (three distinct duties, `Legal/KYA_S1.md` §4).

---

## Assurance hook — for the technically curious prospect

If the buyer's CIO / CISO / DPO asks _"how do you attest what the agents do?"_,
point to **KYA-S1 v1.5** (`Legal/KYA_S1.md`) — DWS's public agent-attestation
specification, in public-comment window until **4 November 2026**. Seven
controls (IDV, BHM, REG, TC4, FLT, TRS, PRV) and three assurance levels
(**KYA-AL1 Standard / KYA-AL2 Enhanced / KYA-AL3 Critical** — NOT
Bronze/Silver/Gold, that naming was retired 09.08.2026). Sits next to SOC 2
(org), FedRAMP (platform), GDPR (data) as the _agent-layer_ attestation.

Do not lead with KYA-S1 — it's a landing zone for the technical follow-up
conversation, not the wedge.

---

## Competitor context

DWS IQ has no direct EU horizontal competitor at the operational-layer /
governed-outcome tier today. The market is still splintered across point
compliance tools (Sweep, Persefoni, Watershed on climate; separate GRC vendors
on audit).

**Adjacent, not competing:**

- **Veriff (Tallinn, EE)** — identity verification. Evaluated as a KYA identity-layer partner (`docs/field-notes/2026-03-18-kya-outreach-veriff-signicat.md`); rejected on AWS dependency (CLOUD Act exposure). Not a platform competitor. Bring up only if the buyer asks about IDV / KYC / KYB.
- **StirlingX ($20M Series A, 2026)** and **Octostar** — closest to DWS's "Sovereign Intelligence" outcome-layer positioning; they use near-identical phrasing (row 27 audit). Prefer the more defensible full phrase **"Sovereign Industrial Intelligence outcomes"** and avoid the bare "Sovereign Intelligence" abbreviation on customer-facing surfaces.

**Not competitors (recurring confusion):**

- **Nortal (EE)** — digital-government integrator; portfolio signal only.
- **Bolt (EE)** — dispatch/transport unicorn; unrelated market.
- **NVIDIA Sovereign AI / IBM** — infrastructure/compute category; DWS sits in the outcome layer above them, does not compete on infra (row 27, layer-model correction 10.07.2026).

Estonian industrial-AI / compliance-automation landscape (Cybernetica,
Proekspert, others) is not yet profiled in `DWS_MARKET_RESEARCH_STANDARD.md` —
flag for the next `/regulatory-radar` sweep before this note ships to a Baltic
prospect.

---

## Pilot framing (ready for the call)

When the prospect responds, propose the pilot on this shape:

1. **One business unit** — the one with the highest audit frequency or newest
   regulatory exposure (CSRD, CBAM, NIS2, or local equivalent).
2. **One pain point** — the single most expensive manual workflow in that unit.
   Examples: quarterly disclosure assembly, cross-entity evidence collection,
   audit-trail reconstruction, supplier compliance attestation.
3. **One measurable outcome** — a number the buyer will recognise. Examples:
   audit preparation time (hours), evidence retrieval latency (days → minutes),
   cross-entity reporting cycle (weeks → days), enforcement-risk score delta.
4. **Time-box** — 6–8 weeks, fixed scope, fixed fee.
5. **Exit criteria** — if the measurable outcome is not met, pilot ends. No
   platform lock-in, no pressure to continue.

---

## What NOT to say in first contact

- No pricing. No SKU names beyond the three pitch labels above.
- No agent counts, no model names, no infrastructure brand-names (row 22 Pillar 2).
- No competitor comparisons. The wedge is category redefinition, not feature war.
- No customer counts, no MRR/ARR figures, no "live" claims for Aegis (row 33).
- No hard asks beyond the 20-minute call.

---

## Follow-up if no response (T+7 days)

Short, one-line nudge — same channel, same thread:

> Quick follow-up — still happy to map one concrete use case in your environment
> if the timing is better this week.

If no response at T+21 days, close the loop politely and log the contact as
cold in the outreach registry.

---

## Related

- `sales-outreach/enterprise-sales.md` — full enterprise playbook
- `sales-outreach/NORDIC_SALES_STRATEGY.md` — Nordic-specific plays
- `sales-outreach/template-partner-advisory-nico.md` — indirect / advisory wedge
- `DWS_TRUTH_STANDARD.md` — canonical product names (rows 20, 27), traction guardrails (row 33), positioning pillars (row 22)
- `DWS_STANDARDS_LIBRARY.md` — regulations referenced (CSRD, CBAM, NIS2, EU AI Act)
- `Legal/KYA_S1.md` v1.5 — agent-attestation spec (assurance hook)
- `docs/field-notes/2026-03-18-kya-outreach-veriff-signicat.md` — Veriff (EE) competitor context
