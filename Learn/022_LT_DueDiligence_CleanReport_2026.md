# 022 Lifetime Oy — Due Diligence Clean Report 2026 (v1.0)

> Canonical registry — current company due-diligence narrative. Registered in `DWS_TRUTH_STANDARD.md` §2 row 18. **Derived artifact:** reconciles against Row 1 (industries/captain hats), Row 2 (products/prices), Row 12 (legal identity); it does not originate facts.

---

**VERSION AND AGENT HISTORY**

- **Document:** 022 LT Due Diligence Clean Report 2026
- **Document ID:** 022 (continues Lifetime numbering: 019 = 2020 summary, 021a = 2021 v0.20)
- **Supersedes / updates:** `021a_LT_DueDiligence_CleanReport` (v0.20, 20.08.2021) and the `019_..._2020_summary`
- **Structure backbone:** Y Combinator _Series A Diligence Checklist_ (Aaron Harris & Jason Kwon) — https://www.ycombinator.com/library/3h-series-a-diligence-checklist
- **Version:** 1.1
- **Date:** 11.06.2026 (updated 25.06.2026)
- **Author:** Risto Anton Päärni (CEO, Lifetime Oy)
- **Reviewed by:** Management Team
- **Approved by:** **\_** (pending)
- **Owner:** Risto Päärni, Lifetime Oy (Y-tunnus 0772407-9)
- **Agent:** Claude Code
- **Branch:** claude/tutki-lifetime-sales-69g53v
- **Audience:** Auditors, private investors, VCs, SAFE-round counterparties (NDA required)
- **Sessions & Modifications:**
  - 1.1 (25.06.2026, Claude Code): Recorded **Gorilla Capital (Petri Lehmuskoski, Founding Partner)** as a prospective SAFE-round investor in §3 — prospect only: no term sheet, no instrument signed, not in the cap table. Management-provided; no other facts changed.
  - 1.0 (11.06.2026, Claude Code): Created the 2026 edition. Re-cast the 2021 DD report onto the YC Series A diligence-checklist structure and refreshed every section to the current company reality (DWS IQ 6 / sovereign-AI compliance platform). **Facts are sourced from canonical repo files or carried forward from the 2020/2021 DD documents; anything not independently verifiable is explicitly marked `TBA (management to confirm)` — no figures, customers, or cap-table entries were invented.**
- **Document Status:** DRAFT — pending management approval and data-room population
- **Sources of truth used:**
  - Legal identity → CLAUDE.md Legal Identity Rule; `lifetime.fi` footer
  - Products & pricing → `dws10.com/config/products.json` (single source)
  - Industry / agent counts → `dws10.com/config/industries.json` (`industriesServedTotal: 25`)
  - Trust / EU AI Act position → `dws10.com/testimonials/index.html`
  - Carry-forward facts → `Learn/019_LT_DueDiligence_CleanReport_2020_summary.md`; uploaded `021a` v0.20 (2021)

---

> **Status legend used throughout:**
> ✅ **Provided** = verifiable now from a cited source · 🟡 **TBA** = exists but to be located/confirmed by management for the data room · ⛔ **N/A** = not applicable at current stage.

---

## 0. Cover & purpose

| Field                  | Value                                                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Company                | **Lifetime Oy**                                                                                                                                    |
| Business ID (Y-tunnus) | **0772407-9**                                                                                                                                      |
| VAT                    | **FI07724079**                                                                                                                                     |
| Registered address     | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland                                                                                                      |
| Jurisdiction           | Finland (EU)                                                                                                                                       |
| Ownership              | 100 % Finnish-owned limited company                                                                                                                |
| CEO                    | Risto Anton Päärni (risto.paarni@lifetime.fi)                                                                                                      |
| Flagship product       | DWS IQ 6 — Sovereign AI compliance platform                                                                                                        |
| Storefront             | https://dws10.com/buy                                                                                                                              |
| Stage                  | Seed / early-commercial; V1.0 launched **23.02.2026**                                                                                              |
| This report's purpose  | Provide investors/auditors a clean, source-anchored diligence picture of Lifetime Oy as of 06/2026, mapped to the YC Series A diligence checklist. |

---

## 1. Management summary (2026)

> **TL;DR — 3-line DD summary (founder/board, 11.06.2026):**
>
> 1. **Cap table is clean** — 100 % Risto Anton Päärni, no SAFEs, no options.
> 2. **The only real gap before a term sheet** is the **founder → Lifetime Oy IP assignment**, plus possible **consultant/partner IP** if external work is involved.
> 3. **Once the IP papers are signed and board approvals are in place, the company is in a term-sheet-ready state.**

Lifetime Oy is a Finnish (EU) deep-tech company that builds and sells **sovereign AI for EU regulatory compliance**. Its flagship platform, **DWS IQ 6**, deploys **18+ Skilled Agents** (observe–think–act agentic loops) across **16 captain hats** covering **25 EU-regulated industries**, automating Fit for 55, CSRD, ETS, CBAM, EPBD, RED III, NIS2 and EU AI Act reporting. The platform is **MCP-native, CLI-accessible and EU-hosted** (Google Cloud Run, `europe-north1`), with sovereign-edge options (NVIDIA Jetson, Acer Veriton GN100) and a model layer combining Claude / OpenAI / Groq with the in-house "Lifetime World Model."

The company sells through an operational storefront (`dws10.com/buy`, 100+ SKUs priced from a single source of truth) spanning platform licences, advisory/delivery, and sovereign cloud/edge hardware. It runs **0 € pilots** as the primary land motion and reports **early commercial traction in logistics (~€7k–14k MRR per pilot)**.

**Versus the 2021 report (v0.20):** the business has shifted from a _cloud-consulting consortium ("Cloud Ready Teams," DWS 2.0)_ to a _productised, agentic, compliance-first SaaS/edge company (DWS IQ 6)_. The legal entity, founder ownership, and several Tier-1 technology partnerships (IBM, AWS, Google Cloud, RedHat, Confluent) carry forward. See the explicit 2021→2026 diff in §15.

**Honest framing for investors:** this is a **structurally sound, transparently governed, but early-stage** company with an exceptionally **clean and simple structure** — 100 % founder-owned, no external capital taken (no SAFEs signed), no human employees (the company operates via the founder, AI agents, and partner teams). The principal diligence consideration is _maturity/continuity_ (young V1.0 product, limited audited financials) and **IP chain-of-title** (founder→company assignment), **not** ownership complexity, dilution overhang, or labour exposure — those are minimal. Integrity and legal standing are verifiable. The transparency posture is unusually strong (the company publishes unedited third-party reviews of its own product, including caveats).

---

## 2. Section A — Corporate / Organizational _(YC: Corporate)_

**YC requests:** certificate of incorporation & amendments; bylaws/articles; board & stockholder consents/minutes; org chart; subsidiaries; good-standing.

| Item                                             | Status       | Lifetime Oy 2026                                                                                                                                              |
| ------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Legal entity & registration                      | ✅           | Lifetime Oy, Y-tunnus 0772407-9, registered in Finland; verifiable at YTJ/PRH: https://tietopalvelu.ytj.fi/yritys/0772407-9                                   |
| Articles of association / trade-register extract | 🟡           | Held by management; to be placed in data room                                                                                                                 |
| Board minutes / shareholder decisions            | 🟡           | Incl. **31.12.2025 board decision** on R&D capitalization (§4). Minutes to be compiled for data room                                                          |
| Group structure                                  | ✅ (changed) | 2020 "5 vertical companies" framing is **retired**; 2026 operating entity is **Lifetime Oy** as the single legal entity behind DWS IQ / Firehorse / dws10.com |
| Subsidiaries                                     | 🟡           | None confirmed for 2026; the 2021 "subsidiary per country" plan is not current. Management to confirm                                                         |
| Good standing / no insolvency proceedings        | 🟡           | Management to confirm (verifiable via PRH)                                                                                                                    |

---

## 3. Section B — Capitalization _(YC: Capitalization)_

**YC requests:** cap table; stockholder list; option pool & grants; SAFEs/convertibles; warrants; prior-round docs; ROFR/voting/co-sale agreements.

| Item                               | Status                   | Lifetime Oy 2026                                                                                                                                                                                        |
| ---------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Founder ownership                  | ✅ **confirmed 06/2026** | **Risto Anton Päärni 100 %** (fully diluted). Single-owner cap table — no co-founders, no options, no convertibles                                                                                      |
| Current cap table                  | ✅                       | 100 % founder; clean, reconciles to share register; no dilution to date                                                                                                                                 |
| SAFEs                              | ✅                       | **No SAFEs signed to date.** A SAFE round is in _planning_ (`sales-outreach/150kSAFE-closing-plan.md`) but **zero executed instruments** → no dilution, no side letters, no investor rights outstanding |
| Option pool / ESOP                 | ✅                       | None (no employees — see §9)                                                                                                                                                                            |
| Prior priced rounds / corporate VC | ✅                       | None. Per 2020 DD and confirmed 06/2026: no corporate/VC shareholders, no passive shareholders                                                                                                          |
| Warrants / other convertibles      | ✅                       | None                                                                                                                                                                                                    |

> ✅ **Diligence note (resolved 06/2026):** the cap table is **clean and simple** — 100 % founder-owned, no SAFEs signed, no options, no convertibles. The earlier "most material open item" flag is **closed**. The only remaining capital action is documenting future SAFE issuances _as and when_ executed.
>
> 🟡 **Fundraising note (06/2026):** the planned SAFE round has an identified **prospective investor — Gorilla Capital (Petri Lehmuskoski, Founding Partner; Gorilla Capital Fund III)**. **Prospect only:** no term sheet, no instrument signed, not in the cap table — recorded for completeness; creates no dilution, side letters, or investor rights until executed. Management-provided.

---

## 4. Section C — Financials _(YC: Financial)_

**YC requests:** historical financial statements; current-year monthly P&L; projections/model; burn & runway; AR/AP; debt; capitalized costs.

| Item                                    | Status         | Lifetime Oy 2026                                                                                                                                                                                     |
| --------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audited statements (last 3 yrs)         | 🟡             | 2020 DD stated 3 years of audited statements existed; 2023–2025 statements **TBA** for data room                                                                                                     |
| **R&D capitalization**                  | ✅             | **€594,000** product-development cost capitalized per board decision **31.12.2025** (KPL 5:8 / IAS 38). Source basis documented in `Learn/019_..._2020_summary.md` and the activation evidence chain |
| Revenue / traction                      | ✅ (published) | Early commercial: **~€7k–14k MRR per logistics pilot** (published on dws10.com/testimonials). Full revenue figures **TBA**                                                                           |
| Financial model / projections           | 🟡             | 2021 report referenced "three growth scenarios" + Investor Plan 2020–2026. A refreshed 2026–2030 model is **TBA**                                                                                    |
| Burn rate & runway                      | 🟡             | Management to confirm                                                                                                                                                                                |
| Public/grant funding history            | ✅             | Per 2020 DD: Finnvera, Business Finland R&D, Innovestor contacts; Business Finland R&D up to €200k applied; Horizon/InvestEU ~€2.5M in preparation. Current status **TBA**                           |
| EU Investment Project Portal references | ✅             | **EIPP-20191319**, **EIPP-20191320** (CIMS); **INPO-20254383** (DWS 6 / DWS IQ, published 25.12.2025) — independent external evidence of continuous productisation                                   |
| Debt / loans                            | 🟡             | Management to confirm                                                                                                                                                                                |

---

## 5. Section D — Material Agreements _(YC: Material Agreements)_

**YC requests:** customer contracts; supplier/vendor; partnerships/JV; resellers/channels; leases; NDAs; material licences.

| Item                          | Status             | Lifetime Oy 2026                                                                                                                                                                                                      |
| ----------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Technology partnerships       | ✅ (carry-forward) | **IBM** (Business Partnership Agreement), **AWS** (Consulting Partner), **Google Cloud**, **RedHat**, **Confluent** — active per 2020 DD; user-confirmed still active 04/2026. Re-confirm signed status for data room |
| Cloud / hosting               | ✅                 | EU production on **Google Cloud Run `europe-north1`**; sovereign-edge via NVIDIA Jetson + Acer Veriton GN100                                                                                                          |
| Payment processing            | ✅                 | **Revolut** checkout on dws10.com (per-SKU `revolutLink`); PayPal plan IDs reserved                                                                                                                                   |
| Customer / pilot agreements   | 🟡                 | Logistics pilots live; signed pilot agreements **TBA** for data room (redact under NDA)                                                                                                                               |
| Channel / reseller agreements | 🟡                 | Partner/consortium motion exists historically; current signed channel contracts **TBA**                                                                                                                               |
| Office lease                  | 🟡                 | Registered address Espoo; lease terms **TBA**                                                                                                                                                                         |
| NDAs / standard forms         | 🟡                 | Company NDA referenced on DD cover; standard forms **TBA**                                                                                                                                                            |

---

## 6. Section E — Intellectual Property _(YC: Intellectual Property)_

**YC requests:** patents/applications; trademarks; copyrights; domains; IP assignments (founders/employees/contractors); inbound/outbound licences; open-source usage.

| Item                               | Status             | Lifetime Oy 2026                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Patent activity                    | ✅ (carry-forward) | 2021 report: patent process underway for the DWS platform & business models (EU planned 2021). **Current patent status TBA** — applicant, stage, and territory must be confirmed                                                                                                                                                                                                                          |
| Core software IP                   | ✅                 | DWS IQ 6 platform, Firehorse modules, "Lifetime World Model," 18+ Skilled Agents — developed in-house                                                                                                                                                                                                                                                                                                     |
| Trademarks                         | 🟡                 | "Lifetime," "DWS IQ," "Firehorse," "DWS IQ Aegis" used in commerce; registration status **TBA**                                                                                                                                                                                                                                                                                                           |
| Domains                            | ✅                 | dws10.com, dws6.com, onelifetime.world, lifetime.fi (controlled by the company)                                                                                                                                                                                                                                                                                                                           |
| IP assignment agreements           | 🟡                 | No employees → **no employee assignments needed**. Live item is the **founder→Lifetime Oy IP assignment** (founder is a separate legal person from the company; code, models, agents, docs must be assigned on paper) + any **contractor/partner** work embedded in the current product, + confirmation that **AI-agent-generated IP** vests to founder/company. **Now the top technical diligence item** |
| Open-source & third-party licences | 🟡                 | LLM provider terms (Claude/OpenAI/Groq) and OSS dependencies; SBOM/licence inventory **TBA**                                                                                                                                                                                                                                                                                                              |

---

## 7. Section F — Product & Technology

**(Not a separate YC checklist heading, but standard in a deep-tech data room.)**

| Attribute        | Status | Detail                                                                                                                                                                                             |
| ---------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Flagship         | ✅     | **DWS IQ 6** — V1.0 launched 23.02.2026                                                                                                                                                            |
| Architecture     | ✅     | Multi-agent orchestration; **MCP-native**, **CLI-accessible**; EU-hosted (GCP `europe-north1`); sovereign-edge (Jetson, Acer Veriton GN100); models: Claude / OpenAI / Groq + Lifetime World Model |
| Coverage         | ✅     | **18+ Skilled Agents**, **16 captain hats**, **25 EU-regulated industries** (canonical `industries.json`)                                                                                          |
| Regulatory scope | ✅     | Fit for 55, CSRD, ETS, CBAM, EPBD, RED III, NIS2, EU AI Act                                                                                                                                        |
| Modules          | ✅     | Firehorse (Amplify / Report / Omnichannel / Signed Reports / CMS / Data); DWS IQ Climate Intelligence; DWS IQ Aegis (dual-use/defence)                                                             |
| Roadmap          | 🟡     | DWS 7 roadmap referenced (`Learn/DWS7_ROADMAP.md`); summarise for investors                                                                                                                        |
| QA / reliability | 🟡     | Test suites in repo; formal QA statement **TBA**                                                                                                                                                   |

---

## 8. Section G — Customers, Sales & Marketing

**YC/data-room requests:** customer list & concentration; pipeline & win-rates; pricing evidence; reference customers; marketing spend & channels.

| Item                           | Status | Lifetime Oy 2026                                                                                                                                                                                                                                                     |
| ------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storefront & pricing           | ✅     | `dws10.com/buy` — 100+ SKUs, prices from single source `products.json`. Anchor SKUs: DWS IQ 6 **€4,999**; Climate Reporting Starter Bundle **€6,500**; Firehorse Amplify **€4,950**; DWS IQ Report **€1,999**; Full Workforce Onboarding **€249,990**; pilots **€0** |
| Land motion                    | ✅     | **0 € / 30–60 day pilots** (Compliance, SiteSense, Material Oracle) as primary entry                                                                                                                                                                                 |
| Live traction                  | ✅     | Logistics pilots, ~€7k–14k MRR each (published). Construction, manufacturing, energy, real estate, infra targeted                                                                                                                                                    |
| Active sales dialogues         | 🟡     | Documented outreach (e.g., steel/industrial — Outokumpu/Forta benchmark in `sales-outreach/`). **These are prospects/pilots, not confirmed reference customers** — do not represent as customers                                                                     |
| Pricing evidence               | ✅     | Structured, quarterly, client-ready price list; VAT handled correctly (FI 25.5 %, EU B2B reverse-charge 0 %, VIES at checkout)                                                                                                                                       |
| Reference customer (speakable) | 🟡     | **TBA** — secure at least one referenceable pilot for the data room                                                                                                                                                                                                  |
| Marketing                      | ✅     | Owned channels (blogs onelifetime.world / dws10.com), LinkedIn newsletter (Lifetime Scope Monthly); spend detail **TBA**                                                                                                                                             |

---

## 9. Section H — Employees & Consultants _(YC: Employees & Consultants)_

**YC requests:** employee census (titles/comp); offer letters; CIIAA / IP-assignment; contractor agreements; benefit plans; handbook; disputes; turnover.

| Item                               | Status                   | Lifetime Oy 2026                                                                                                                                                |
| ---------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Key people                         | ✅                       | CEO Risto Anton Päärni (sole). 2020 CTO Manish Kumar no longer current management — confirm                                                                     |
| Headcount & census                 | ✅ **confirmed 06/2026** | **No human employees.** Company operates via the founder + AI agents + partner/consortium teams. Zero payroll, zero employment liabilities                      |
| Employment / contractor agreements | ⛔ / 🟡                  | Employment agreements **N/A** (no employees). **Contractor/partner** agreements (where their work is in the current product) **TBA** — must carry IP assignment |
| IP-assignment (CIIAA equivalent)   | ⛔ / 🟡                  | Employee CIIAA **N/A**. **Founder→company assignment** still required (ties to §6)                                                                              |
| Benefit / incentive schemes        | ⛔                       | N/A (no employees)                                                                                                                                              |
| Staff disputes / turnover          | ✅                       | None — no employees, so no labour disputes or turnover by definition                                                                                            |

---

## 10. Section I — Litigation & Disputes _(YC: Litigation)_

| Item                            | Status | Lifetime Oy 2026                                           |
| ------------------------------- | ------ | ---------------------------------------------------------- |
| Pending / threatened litigation | 🟡     | None known; management to confirm in writing for data room |
| Settlements / judgments         | 🟡     | None known; confirm                                        |
| Regulatory actions              | 🟡     | None known; confirm                                        |

---

## 11. Section J — Privacy, Data Security & Regulatory

**(Elevated to its own section given the compliance-first product.)**

| Item                              | Status | Lifetime Oy 2026                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GDPR                              | ✅     | GDPR-compliant posture; Art. 6 lawfulness basis documented; data minimisation                                                                                                                                                                                                                                                                                      |
| NIS2                              | ✅     | NIS2-ready architecture (private-cloud + edge); sovereignty tooling (Sovereign Database)                                                                                                                                                                                                                                                                           |
| EU AI Act                         | ✅     | **Limited-risk** self-classification with full technical docs; Article 12 record-keeping + reasoning lineage; human-in-the-loop oversight; internal AI Governance Framework. Independent review (Grok/xAI, 03/2026, published unedited): _"Overall legal position: Excellent."_ Caveat: deployer-level reclassification possible for Annex-III safety-critical use |
| Data residency                    | ✅     | EU-hosted (`europe-north1`); no CLOUD Act exposure in sovereign deployments                                                                                                                                                                                                                                                                                        |
| Third-party audit / notified body | ⛔/🟡  | Not required at limited-risk; none yet — will differentiate post-02.08.2026. Flag as planned                                                                                                                                                                                                                                                                       |
| Privacy policy / ToS / DPA        | 🟡     | Published policies to be indexed for data room                                                                                                                                                                                                                                                                                                                     |

---

## 12. Section K — Tax

| Item                  | Status | Lifetime Oy 2026                                 |
| --------------------- | ------ | ------------------------------------------------ |
| VAT registration      | ✅     | FI07724079 (active)                              |
| Corporate tax filings | 🟡     | **TBA** for data room                            |
| R&D tax treatment     | ✅     | €594k capitalization under KPL 5:8 / IAS 38 (§4) |
| Tax disputes          | 🟡     | None known; confirm                              |

---

## 13. Section L — Insurance

| Item               | Status | Lifetime Oy 2026                                                                                 |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------ |
| Business insurance | 🟡     | 2020 DD: Lähitapiola agreement (01/2020). **Confirm current 2026 cover** (liability, cyber, E&O) |

---

## 14. SWOT & risk register (2026)

**Strengths:** verifiable EU legal entity; compliance-first, regulation-aligned product; sovereign-by-design (EU hosting + edge); productised storefront with real pricing; unusual transparency (published unedited reviews); documented Tier-1 tech partnerships; capitalized, board-approved R&D base.

**Weaknesses:** young V1.0 product; thin audited financials and reference base; lean team; open cap table (SAFE in progress).

**Opportunities:** August 2026 EU AI Act enforcement wave; CSRD/CBAM/EPBD deadlines; NIS2 demand; sovereign-AI tailwind in the EU.

**Threats:** larger compliance/SaaS incumbents; regulatory interpretation risk; talent competition; funding-market timing.

| Risk                                | Level         | Mitigation                                                                                                                            |
| ----------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Stage/continuity (seed, key-person) | Medium        | 100 %-founder + no employees concentrates key-person risk on one person — mitigate via documentation, succession note, and SAFE close |
| Cap-table opacity                   | ✅ **Closed** | Resolved 06/2026: 100 % founder, no SAFEs signed, no options/convertibles (§3)                                                        |
| Product maturity (V1.0)             | Medium        | 0 € pilots + 30-day guarantee de-risk buyers; expand pilot evidence                                                                   |
| IP chain-of-title                   | Medium        | Execute **founder→company** IP assignment (+ any contractor/partner) — no employees to cover (§6/§9)                                  |
| AI Act deployer reclassification    | Low–Med       | Governance elements already in place; deployer-level risk assessments documented                                                      |

---

## 15. What changed since v0.20 (2021) → v1.0 (2026)

| Dimension          | 2021 (v0.20)                                            | 2026 (v1.0)                                                            |
| ------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------- |
| Core business      | Cloud consulting + "Cloud Ready Teams" consortium       | **Sovereign-AI compliance platform (DWS IQ 6)**                        |
| Flagship product   | Lifetime Digital Workspace **2.0** (25 €/user/mo)       | **DWS IQ 6** (€4,999 one-time + modules/subscriptions)                 |
| Tech thesis        | Cloud migration, AWS/IBM, "80 % workloads not in cloud" | **Agentic AI** (18+ Skilled Agents), MCP/CLI-native, EU sovereign edge |
| Market frame       | 7,800 corporate targets (FI/SE/DE)                      | **25 EU-regulated industries**, 16 captain hats, EU compliance regimes |
| Regulation angle   | (minimal)                                               | **Core**: Fit for 55, CSRD, CBAM, EPBD, NIS2, **EU AI Act**            |
| Go-to-market       | Consortium partner tiers                                | **Productised storefront** (dws10.com/buy) + 0 € pilots                |
| Financial evidence | Growth scenarios, grant applications                    | **€594k capitalized R&D** (31.12.2025), pilot MRR, INPO-20254383       |
| Entity framing     | "5 vertical companies" group                            | Single **Lifetime Oy** entity                                          |
| Partnerships       | IBM, AWS, Google, RedHat, Confluent                     | **Carried forward** (confirm signatures)                               |

---

## 16. Data-room index (what to upload before a term sheet)

Provide, by section: **A** trade-register extract, articles, board minutes (incl. 31.12.2025) · **B** current cap table + all SAFEs · **C** 2023–2025 audited statements, 2026–2030 model, R&D-capitalization memo · **D** partnership contracts, pilot agreements, lease, hosting/Revolut terms · **E** patent status, IP-assignment agreements, OSS/SBOM, trademark filings · **F** architecture overview, DWS 7 roadmap, QA statement · **G** customer/pilot list, pipeline, ≥1 referenceable customer · **H** employee census + agreements + IP assignments · **I** litigation rep letter · **J** GDPR/NIS2/AI-Act governance pack, privacy policy, DPA · **K** tax filings · **L** current insurance certificates.

---

## 17. Open items (priority order)

> **Pre-term-sheet 1-pager:** the highest-priority open items below (cap table → SAFEs → IP) are tracked as an actionable one-page gate in `Learn/022b_LT_PreTermSheet_DiligenceChecklist_2026.md`.

1. ✅ **Cap table — CLOSED** (100 % founder, no SAFEs signed, no options/convertibles). Action only on future SAFE issuance (§3).
2. **Founder→company IP-assignment** (+ any contractor/partner IP, + AI-agent-output vesting) — no employees to cover (§6/§9). **← now the top item.** _Templates ready for execution: `Legal/IP_ASSIGNMENT_FOUNDER_LIFETIME_OY_2026.md` (assignment) + `Legal/BOARD_MINUTES_IP_ASSIGNMENT_2026.md` (board approval). Both DRAFT — counsel review + signature pending._
   - Sharing of NDA-gated docs is gated by `Legal/NDA_MUTUAL_LIFETIME_OY_2026.md` (mutual NDA template).
3. **2023–2025 audited financials** + refreshed model (§4).
4. **Patent status confirmation** — applicant, stage, territory (§6).
5. **≥1 referenceable pilot customer** willing to speak to investors (§8).
6. **Re-confirm Tier-1 partnership signatures** (IBM/AWS/Google/RedHat/Confluent) (§5).
7. **Current insurance cover** (§13) and **litigation rep letter** (§10).

---

## 18. Publication policy (term-sheet-readiness signalling)

**Decision (CEO review, 15.06.2026): do NOT publish "term-sheet ready" / readiness or fundraising status on the public website (dws10.com or any public surface).**

Rationale:

1. **Truth.** Readiness is _conditional_ — it depends on the still-unsigned founder→Lifetime Oy IP assignment (§6) and recorded board approvals (§2). Publishing it before those are done would assert an untrue claim and breach the DWS Truth Standard ("publish only when true").
2. **Audience.** Readiness is an _investor_ signal, not customer marketing. The public site serves compliance buyers; investor status belongs in the NDA-gated data room.
3. **Strategy/regulatory.** Publicly advertising fundraising readiness weakens negotiating posture and drifts toward general-solicitation territory.

**Where readiness lives instead:** this DD report's TL;DR (§1) and the `022b` checklist — both NDA-gated. Flip an _internal_ readiness flag only after the IP assignment is signed and board approval is recorded; surface externally only as a gated investor one-pager, never as public hero copy. For public momentum, ship product/customer proof points (pilot wins, certifications, references) instead.

---

**Prepared by:** Risto Anton Päärni, CEO, Lifetime Oy — Date: \***\*\_\_\_\_\*\***

**Reviewed (Management):** \***\*\_\_\_\_\*\*** — Date: \***\*\_\_\_\_\*\***

---

> **Methodology note.** This report's section structure follows the Y Combinator _Series A Diligence Checklist_ (Aaron Harris & Jason Kwon). All affirmative facts are anchored to a cited canonical source or carried forward verbatim from the 2020/2021 Lifetime DD documents; every unverified item is marked `TBA (management to confirm)`. No financial figures, customers, or ownership percentages were fabricated. NDA required to circulate.
