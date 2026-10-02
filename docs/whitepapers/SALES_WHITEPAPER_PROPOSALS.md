# Whitepaper Proposals for Live Sales Paths

**Version:** 1.0 [Latest] · **Date:** 30.09.2026 · **Owner:** HIC (Risto Anton Päärni) · **Status:** PROPOSED — HIC picks, then `/dialog` drafting
**Rules applied:** `docs/BLOG_STANDARD.md` §17 (customer value above expectations, ≥3 sources with ≥1 academic, routes, 30-day demo only from `products.json`); `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` "Decision Paths" (the two customer-originated gates).

---

## 1. Why these, and why now

The pipeline shows 0 of 11 decision paths with either gate closed: no buyer has stated their own number, and no signer is confirmed (`SALES_OPPORTUNITIES_PIPELINE.md`, "Two customer-originated gates"). A whitepaper helps sales only if it moves a named decider to answer one of those two questions. So each proposal below names:

- **the decider** it is written for, and the path it sits on;
- **the buyer's number** it asks the reader to supply (the paper ends with a short worksheet, not a pitch);
- **the evidence we already have** (code, tests, runbooks), so the paper claims only what we can demonstrate today;
- **the demo** it may link, taken from `dws10.com/config/products.json` (§17.4).

The existing plan in `docs/whitepapers/README.md` (WP01–WP12) was written from the consulting handbook, before the pipeline had named paths. The proposals below reorder it around live deals. WP01 and WP07 stay as brand pieces.

## 2. Proposals, ranked by pipeline value

| Rank | ID   | Working title                                                                            | Decider / path                                                                                                 | Buyer's number it asks for                                                            | Demo link (`products.json`)                                                                |
| ---- | ---- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1    | WP13 | **When the link drops** — proving an industrial agent keeps working and stops on command | Site/OT owner + Head of IP at Outokumpu (`AWAIT_RESPONSE`); Neste, Metso, Forcit, Summa Defence (★★★★☆)        | Clearances or decisions per month that stop when the uplink is lost; cost of one hour | `DWS-AEGIS-PILOT-001` (3 months). **No 30-day Aegis demo SKU exists** — see HIC decision 1 |
| 2    | WP14 | **Batch-level product carbon footprint** — the capability nobody owns                    | Kemira Fiber Essentials (`HIC_APPROVAL_GATE`); the paper exists to surface the owner                           | PCF requests per quarter; hours per batch report today                                | `DWS-EU-PILOT` (monthly)                                                                   |
| 3    | WP15 | **Containment is not evidence** — agent sandboxes, allowed traffic and the signed record | CISO / Head of InfoSec (R15/R16); PhD §14.55 NVIDIA OpenShell launch, §14.57 HF allowed-traffic (★★★★☆, ★★★☆☆) | Agents in production with outbound access; hours per audit request answered today     | `DWS-AEGIS-PILOT-001`                                                                      |
| 4    | WP16 | **Article 50 for agent operators** — what an enforcement letter will ask you to show     | Klarna path (`INTRO_REQUESTED`), Zalando, L'Oréal (§14.46 ★★★★★)                                               | AI-generated customer interactions per month; share without a disclosure record       | `KYA-JEV-001` (early access); `CMP-T0` Compliance Agent pilot (60 days)                    |
| 5    | WP17 | **Buying AI under €60,000** — a pilot route for Finnish agencies                         | Kela (`HIC_APPROVAL_GATE`), Valtori, Traficom (`RESEARCH`)                                                     | Cases per year the pilot workflow touches; the agency's own productivity target       | `DWS-EU-PILOT` (monthly)                                                                   |
| 6    | WP18 | **Pricing an agent before it runs** — capped, per-outcome budgets vs. usage credits      | CIO/CFO at EU M365 enterprises (Copilot Autopilot preview, ★★★☆☆); §14.20 token-billing squeeze (★★★★☆)        | Last quarter's agent spend variance against budget                                    | `AIS-OUTCOME-PILOT` (6 weeks)                                                              |

Existing README items folded in: WP05 (sovereign defence) becomes a Defence annex of WP13; WP04 (forced purchase timeline) becomes the regulatory-calendar section of WP14 and WP16, re-checked against current dates; WP09 stays internal sales enablement.

## 3. One-page briefs

### WP13 — When the link drops

- **customer_value (draft):** A plant director sees, on their own hardware in week 11, that the agent workflow completes with the uplink cut and halts within 500 ms when an operator types `stop`, and receives a signed record an auditor can check offline three years later.
- **What it proves, from code we have:** severed-uplink acceptance (`src/aegis/pilot/acceptance.ts`); hard stop in a worker thread (C1); Article 12 ledger with segments and retention (C2); operator decision event (C5); OpenShell containment per step (#2289, #2290); `doctor`, `check-handlers`, nightly rehearsal (A1, A3, A4). Runbook: `docs/runbooks/AEGIS_PILOT_RUNBOOK.md`.
- **Must not claim yet:** the witnessed `physical-disconnect` run (M4, H3) and the auditor bundle (A2) are not done. The paper says "planned" for both until they are.
- **Sources to read before citing:** Regulation (EU) 2024/1689 Art. 12 and 14 (regulation); IEC 62443-3-3 (standard); one peer-reviewed paper on fail-safe / human override in autonomous industrial control (academic, to be selected and read); NVIDIA OpenShell documentation (primary).
- **Routes:** sales (Outokumpu path), roadmap (M4 date), ontology (`severed-uplink acceptance`).

### WP14 — Batch-level product carbon footprint

- **customer_value (draft):** A chemicals product line answers each customer's batch-level PCF request from existing plant data, in minutes, with the calculation traceable to its inputs, instead of by a manual report.
- **Evidence:** Climate IQ thread with Kemira and Outokumpu; `compliance-check`; Article 12 trail. Batch-level PCF automation is **not** a shipped feature today. The paper frames the problem and the ownership question and describes the pilot as the build, labelled as planned.
- **Sources:** ISO 14067:2018 (standard); WBCSD PACT Pathfinder Framework v3 (industry); CBAM Implementing Regulation (EU) 2023/1773 (regulation); one peer-reviewed study on batch- or product-level LCA variability in chemicals (academic).
- **Pipeline rule:** do not state "no one owns it" as fact. The paper asks the ownership question (Q2/Q3 in the pipeline).
- **Routes:** sales (Kemira), ontology (`batch PCF`).

### WP15 — Containment is not evidence

- **customer_value (draft):** A CISO keeps the agent sandbox they are adopting and gets, per step, a signed record of what the agent was allowed to reach, what it tried, and who stopped it, ready for an Article 12 request without a log-hunting exercise.
- **Evidence:** OpenShell policy generation and security-review fixes (#2289, #2290); GKE agent-sandbox policy (#2267); allowed-traffic digests (C5 candidate, PhD §14.57).
- **Sources:** NIST SP 800-207 Zero Trust Architecture (standard); Regulation (EU) 2024/1689 Art. 12, 15 (regulation); a peer-reviewed paper on LLM-agent sandbox escape or tool-use security (academic); NVIDIA / Hugging Face primary documentation.
- **Routes:** sales (§14.55 accounts), PhD §14.55/§14.57 (already filed), roadmap (C4 remainder).

### WP16 — Article 50 for agent operators

- **customer_value (draft):** A consumer-facing company can show, per AI interaction, that the disclosure was made and which agent made it, and so turns an Art. 50 information request into an export instead of a project.
- **Evidence:** KYA Specification, KYA-JEV-001 typed decisions, Compliance Agent.
- **Sources:** Regulation (EU) 2024/1689 Art. 50, 99(4) (regulation); Commission guidelines / code of practice on transparency when published (primary; open question until read); a peer-reviewed paper on AI disclosure effects on users (academic).
- **Routes:** sales (Klarna path), truth standard (Art. 50 date and penalty wording).

### WP17 — Buying AI under €60,000

- **customer_value (draft):** An agency can start a sovereign AI pilot within its own procurement rules this quarter and exit with measured productivity against its own target, without opening a tender first.
- **Evidence:** DWS-EU-PILOT, Firehorse agent suite, Article 12 logging, NIS2 dashboard.
- **Sources:** Hankintalaki 1397/2016 §25 (regulation); VM guidance on AI in public administration (primary); a peer-reviewed study on AI adoption in public-sector case handling (academic).
- **Caution:** procurement-law statements need HIC or counsel review before publication.
- **Routes:** sales (Kela, Valtori, Traficom).

### WP18 — Pricing an agent before it runs

- **customer_value (draft):** A CFO approves an agent programme with a fixed price per outcome and a hard cap, instead of a usage meter whose cost is only known after the fact.
- **Evidence:** AIS-OUTCOME-PILOT, token-capital method, the PhD §14.20 capitulation signal.
- **Sources:** vendor primary docs (Microsoft Copilot Credits); a peer-reviewed paper on cloud cost predictability or outcome-based contracting (academic); FinOps Foundation framework (industry).
- **Routes:** sales, PhD §14.20.

## 4. HIC decisions

1. **30-day Aegis demo.** §17.4 lets a paper link only a demo that exists in `products.json`. For Aegis the only offer is the 3-month €19,990 pilot. Create a 30-day, small-fee Aegis evaluation SKU (pricing is RED, HIC sets the fee), or let WP13/WP15 link the 3-month pilot?
2. **Order.** Recommended: WP13 first (the Outokumpu 12.10 follow-up and the 02.10–15.10 contract window), then WP14 (Kemira ownership question).
3. **Network allowlist** (already open): eur-lex.europa.eu, doi.org, arxiv.org are needed to read the regulation and academic sources before citing them (§17.2).

---

## VERSION AND AGENT HISTORY

| Version      | Date       | Change                                                                                       | Author      |
| ------------ | ---------- | -------------------------------------------------------------------------------------------- | ----------- |
| 1.0 [Latest] | 30.09.2026 | First proposal set: WP13–WP18 mapped to live pipeline paths, gates and `products.json` demos | Claude Code |
