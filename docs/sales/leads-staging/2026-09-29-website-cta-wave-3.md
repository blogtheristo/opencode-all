# Website-Driven Outreach — Wave 3 (lifetime.fi + dws10.com)

**Date:** 2026-09-29
**Status:** DRAFTS — not sent. Outbound email is RED zone; HIC approves each draft before send.
**Input:** the two websites, read from repo source (`dws10.com/llms.txt`, `lifetime.fi/index.html`), not recalled.
**Standards applied:** `DWS_BRAND_STANDARD.md` §22 (pitch line, verbatim) + §24 (outreach voice: 110–150 words, approved CTA, banned phrases); `DWS_ROLES_REGISTRY.md` (R-IDs); `DWS_TRUTH_STANDARD.md`.

## 1. What the websites sell → who needs it

| Site        | Offer (from site source)                                                                       | Buyer need that triggers purchase                                          | Role (R-ID)            |
| ----------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------- |
| dws10.com   | CBAM / EU ETS / CSRD compliance automation for construction, energy, manufacturing, logistics  | Importer or emitter with a regulatory filing and no audit-ready data trail | R07 CSO, R23 CFO       |
| dws10.com   | DWS IQ Aegis — single-tenant sovereign AI, Finnish-hosted, reduces CLOUD Act exposure          | Defence / dual-use / critical infrastructure with a sovereignty gate       | R15 CISO, R13 CIO      |
| lifetime.fi | Traceable AI decisions — human stays accountable; KYA agent trust controls, Art. 12–14 logging | Enterprise running AI agents in production without decision-level evidence | R15 CISO, R06/R05 risk |

## 2. The call-booking step

Every draft ends with the approved §24 CTA plus the live booking page: `https://dws10.com/book/?service=demo`. The `service` parameter pre-selects the meeting type (`dws10.com/book/index.html:1000`, `extractServiceHint()`), so the recipient books straight into the calendar; no back-and-forth email.

## 3. Drafts — named contacts already verified in the pipeline

Contacts come from `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` → "Phase 2 — Named-Contact Search: Deutsche Telekom / Siemens", where each one is confirmed by at least two independent sources. Until now they had **no outreach drafted yet**.

**Recipient email addresses are not published.** Each address must be confirmed (LinkedIn InMail, the company switchboard, or a warm intro) before sending. Never guess an address pattern.

### 3.1 Dr. Christine Knackfuss-Nikolic — Chief Sovereignty Officer, T-Systems (R15) ★★★★★

**Subject:** T-Systems + DWS: sovereignty evidence per workload

```text
Dear Dr. Knackfuss-Nikolic,

Sovereignty is now scored in procurement, not assumed: Airbus weighted CLOUD Act exposure in its 2026 sovereign-cloud tender.

Your remit sits exactly on that line. Customers of the Industrial AI Cloud will be asked to show, workload by workload, which jurisdiction controls the data, the technology and the operations. Most still answer that with a questionnaire.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. Our sovereignty assessment scores a workload on those three pillars under EU, US and Singapore rules and returns evidence an auditor can check.

Would you be open to a 15-minute call to explore whether this fits your situation?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### 3.2 Björn Weidenmüller — SVP AI Factory Go-to-Market, T-Systems (R22-level commercial owner) ★★★★☆

**Subject:** Industrial AI Cloud: compliance agents on top

```text
Dear Mr. Weidenmüller,

The Industrial AI Cloud's anchor customers (Mercedes-Benz, BMW Group, Siemens) all face CBAM, CSRD and EU AI Act obligations on the same data the platform now hosts.

That makes regulated compliance work a natural first workload for the platform: it is recurring, it has an audit deadline, and it cannot leave EU jurisdiction.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. We run on customer-controlled compute, so our agents could run inside the Industrial AI Cloud as a ready-made workload for your go-to-market.

Happy to share how we handle this for teams in your sector — does a quick call work?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### 3.3 Natalia Oropeza — Global Chief Cybersecurity Officer, Siemens AG (R15) ★★★★☆

**Subject:** AI agents on the factory floor: who decided?

```text
Dear Ms. Oropeza,

You have named AI-driven threats to the factory floor, and your team's own OT response capability, as a 2026 priority.

The harder question comes after an incident: which AI agent acted, under whose authority, and on what data. Today most industrial AI deployments cannot answer that at the level of a single decision.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. Every agent tool call is authorised against a trust score and logged, high-risk actions wait for a human approval, and a trust breach stops the agent. That is the record the EU AI Act asks for under Articles 12 and 14.

Would you be open to a 15-minute call to explore whether this fits your situation?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

## 4. New accounts found from the website ICP (research 2026-09-29)

Sourced through web search results only: the egress proxy blocked full-page fetch of the company sites. **Before any send, open each contact URL and confirm the person still holds the role.** No email pattern is published for any account. No row scores 5★: either the contact's current role is unconfirmed or the trigger is not from this quarter.

| #   | Company (country) · revenue · sector                | Trigger (source)                                                                                                                                                                                                                                                                                                                                                                                                                           | Offer                                      | Contact to verify (source)                                                                                                                                                       | ★   |
| --- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1   | Patria Oyj (FI) · €1.09B · defence                  | Partnership with NestAI on AI-enabled unmanned aerial systems, 25.05.2026 ([Patria](https://www.patriagroup.com/newsroom/news/2026/patria-and-nestai-partner-on-ai-enabled-unmanned-aerial-systems-for-european-defence))                                                                                                                                                                                                                  | Aegis sovereign + KYA                      | Mikko Leino, EVP Defence and Weapon Systems ([management](https://www.patriagroup.com/about-us/management-team/group-management-team))                                           | 4   |
| 2   | Bittium Oyj (FI) · ~€140M (est.) · defence comms    | Orders from the Finnish Defence Forces, 06/2026: roughly €21M in total ([Cision](https://news.cision.com/bittium-oyj/r/bittium-received-purchase-orders-from-the-finnish-defence-forces-for-bittium-tac-win--devices-and-sy,c4365046)). Defence sales +101% in Q2                                                                                                                                                                          | Aegis sovereign                            | Tommi Kangas, Head of Defence & Security ([management](https://www.bittium.com/investors/corporate-governance/management-group/))                                                | 4   |
| 3   | MilDef Group AB (SE) · ~€270M (est.) · rugged IT    | Record Q1 2026 order intake; 7-year framework agreement with FMV worth up to SEK 1.5B ([Q1 report](https://investors.mildef.com/wp-content/uploads/2026/04/MilDef_Q1_2026_ENG-2026-04-23-FINAL.pdf))                                                                                                                                                                                                                                       | Aegis (partner + buyer)                    | Martin Karlsson, CIO ([management](https://investors.mildef.com/corporate-governance/group-management/?lang=en))                                                                 | 4   |
| 4   | Bufab AB (SE) · ~€0.7B · fastener distribution      | Q2 2026 report flags CBAM accruals and their cash-flow timing in European operations ([Investing.com](https://ca.investing.com/news/company-news/bufab-q2-2026-slides-margins-hit-147-on-organic-growth-93CH-4732356))                                                                                                                                                                                                                     | CBAM reporting                             | Carina Lööf, Group Sustainability & Sourcing Director (**role in 2026 unconfirmed**; [policy](https://files.bufab.com/hubfs/group-files/EN/Policies/Environmental%20Policy.pdf)) | 4   |
| 5   | Aspo Oyj / ESL Shipping (FI) · shipping             | ESL Shipping demerger and listing planned for 31.12.2026 ([H1 report](https://www.inderes.fi/en/releases/aspo-plcs-half-year-financial-report-january-1-june-30-2026-substantial-profit-improvement)). EU ETS maritime surrender is 100% for 2026 emissions ([DG CLIMA](https://climate.ec.europa.eu/areas-action/transport-decarbonisation/reducing-emissions-shipping-sector/faq-maritime-transport-eu-emissions-trading-system-ets_en)) | ETS/MRV + CSRD                             | Erkka Repo, CFO ([executive committee](https://www.aspo.com/en/governance/governing-principle/group-executive-committee))                                                        | 4   |
| 6   | Peikko Group (FI) · €261M · steel connections       | Runs a CBAM + CSRD implementation project; hiring a Sustainability Manager ([Peikko](https://www.peikko.com/news/building-with-less-voices-of-the-industry-what-we-have-recently-learned/))                                                                                                                                                                                                                                                | CBAM (likely below the new CSRD threshold) | Arno Diehl, QEHS Director (**role unconfirmed**)                                                                                                                                 | 4   |
| 7   | Elenia Verkko Oyj (FI) · €356M · power distribution | NIS2 essential entity (Cybersecurity Act 124/2025). Its 2025 accounts say LLM tools are "already widely in use" ([accounts](https://www.elenia.fi/files/8cb1f37af49fdaa9b2c72d6ac2ce6127f049b201/elenia-verkko-oyj-konsernitilinpaatos-2025.pdf))                                                                                                                                                                                          | KYA + NIS2 evidence                        | Harri Happonen, CIO ([management](https://www.elenia.fi/en/elenia/company/about-us/management-team-and-board))                                                                   | 3   |

### Regulatory dates used in the drafts (official sources)

- **CBAM:** the definitive regime has applied since 01.01.2026. The first annual declaration and certificate surrender for 2026 imports are due by 30.09.2027. Importers of 50 tonnes a year or less are exempt ([EC](https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-definitive-regime_en)).
- **CSRD after Omnibus I** (in force 18.03.2026): the scope is now over 1,000 employees and over €450M turnover ([Council](https://www.consilium.europa.eu/en/press/press-releases/2026/02/24/council-signs-off-simplification-of-sustainability-reporting-and-due-diligence-requirements-to-boost-eu-competitiveness/)). Peikko and Elenia are therefore pitched on CBAM and NIS2, not CSRD.
- **EU AI Act after the AI Omnibus:** high-risk obligations apply from 02.12.2027 (Annex III) and 02.08.2028 (product-embedded) ([Council](https://www.consilium.europa.eu/en/press/press-releases/2026/05/07/artificial-intelligence-council-and-parliament-agree-to-simplify-and-streamline-rules/)). Military-only AI is outside the Act's scope, so the defence drafts do not lead with it.

## 5. Drafts — new accounts (rows 1–5; rows 6–7 wait for a confirmed contact)

### 5.1 Mikko Leino — Patria (R12/R15)

**Subject:** Patria + DWS: sovereign control of AI in UAS

```text
Dear Mr. Leino,

Patria's partnership with NestAI puts AI into unmanned aerial systems, and with it a question customers will ask: who controls the models, the data and the logs, and under which jurisdiction.

For defence programmes the answer has to be single-tenant, European-hosted, and auditable at the level of each agent decision, not each system release.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. DWS IQ Aegis runs air-gapped or on Finnish infrastructure, and every agent action is authorised against a trust score and logged.

Would you be open to a 15-minute call to explore whether this fits your situation?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### 5.2 Tommi Kangas — Bittium (R12/R15)

**Subject:** Bittium + DWS: sovereign AI for defence growth

```text
Dear Mr. Kangas,

Doubling defence sales in a quarter changes what engineering data you hold and who is allowed to process it.

As Bittium's defence programmes scale, AI tools for engineering, documentation and supply-chain work will need to run where the Finnish Defence Forces' requirements allow: single-tenant, European-hosted, with an audit trail per action.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. DWS IQ Aegis is built in Espoo for exactly this: Finnish-hosted or air-gapped, with no dependency on a US cloud provider.

Would you be open to a 15-minute call to explore whether this fits your situation?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### 5.3 Martin Karlsson — MilDef (R13)

**Subject:** MilDef + DWS: governed AI on sovereign hardware

```text
Dear Mr. Karlsson,

MilDef's new FMV framework agreement makes rugged edge hardware the default in Swedish defence. The next request from those customers is AI that runs on that hardware, under their control.

That needs a software layer that governs AI agents in the field: which agent acted, on what data, under whose authority, with no cloud call-home.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. We see DWS IQ Aegis on MilDef hardware as a joint offer, and your own programmes as a first user.

Happy to share how we handle this for teams in your sector — does a quick call work?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### 5.4 Carina Lööf — Bufab (R07) — confirm role first

**Subject:** Bufab + DWS: CBAM declaration 30.09.2027

```text
Dear Ms. Lööf,

CBAM embedded emissions declarations are now mandatory — and manual processes are creating audit risk.

Bufab's Q2 report already books CBAM costs in European operations. The first annual declaration for 2026 imports, with certificates surrendered, is due on 30 September 2027. For a distributor with thousands of steel fastener lines from many suppliers, the hard part is collecting verified emissions data per supplier, not the filing itself.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. Our agents collect supplier data, check it and prepare the declaration with an evidence trail.

Would you be open to a 15-minute call to explore whether this fits your situation?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### 5.5 Erkka Repo — Aspo / ESL Shipping (R23)

**Subject:** ESL Shipping listing: ETS reporting day one

```text
Dear Mr. Repo,

With ETS Phase 4 tightening allowance allocations, the cost of inaccurate monitoring is rising.

For ESL Shipping that arrives together with the listing: 100% of 2026 shipping emissions must be surrendered, and a newly listed company carries its own ETS, MRV and sustainability reporting from the first day, under investor scrutiny.

DWS delivers Sovereign Industrial Intelligence outcomes — audit-ready compliance decisions produced by governed agents running on infrastructure you control, for regulated European industry. Our agents turn voyage and fuel data into ETS and MRV figures, every month, with an evidence trail your auditor and your board can follow.

Would you be open to a 15-minute call to explore whether this fits your situation?
Pick a time here: https://dws10.com/book/?service=demo

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

## 6. Open conflict (Rule 7)

Sender address: `DWS_BRAND_STANDARD.md` §24 sets `risto@onelifetime.world` ("Risto at DWS") for outreach. `CLAUDE.md` Sender Identity sets `risto.paarni@lifetime.fi` for Lifetime Oy sales. The drafts follow `CLAUDE.md`, which is canonical. The HIC decides and one of the two files is aligned.
