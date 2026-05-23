# DWS Skilled Agents — Labor-Anchored Price List 2026

***

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/ai-pricing-labor-model-GeqbE | Date: 14.05.2026 | Changes: Initial creation — first labor-anchored price list for DWS Skilled Agents (per-outcome + per-agent-month units) and derived listings for Microsoft Agent 365 (Azure Marketplace) and Salesforce Agentforce (AppExchange). Companion to AI-AS-LABOR-PRICING-STRATEGY.md. Pilot/Blue prices; commercial Green ratification pending Dynamic Deployment Pricing Standard governance.
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Added §3 "Model Training" chapter covering the full product ladder: Train Model (TM-001) self-serve at €1,490 / €2,990 / €7,490, Bridge Track (EMT-001 invite-only) at €19,990, Enterprise Model Training (EMT-001 project) at €50K / €100K / €200K. Renumbered subsequent chapters (Recommended Bundles → §4, Microsoft Agent 365 → §5, Salesforce Agentforce → §6, Channel Comparison → §7, Governance Hooks → §8, Open Questions → §9, Companion Documents → §10). Updated companion references to link Store SKU pages.
- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Added "Measurement plan" subsection to §3 Model Training. Flags that Train Model has zero historical conversion data and locks 60-day measurement metrics (cart starts, completed orders, tier mix, Bridge inbound, Aegis attach, time-to-completion, SLA invocations) before Y1 projections get scaled into paid marketing. Defers Firehorse mobile-UI surfacing decision until tier mix is measured.

Session Links & References:

- Claude Code (claude/ai-pricing-labor-model-GeqbE): https://github.com/blogtheristo/dws6/commits/claude/ai-pricing-labor-model-GeqbE
- Claude Code (claude/lwm-price-estimate-study-IXS4l): https://github.com/blogtheristo/dws6/commits/claude/lwm-price-estimate-study-IXS4l
- Companion: docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md
- Governance: DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md
- Store SKUs: Store/PRODUCT_TRAIN_MODEL.md, Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md

Document Status:

- Created: 14.05.2026
- Last Modified: 23.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE (pricing as pilot/Blue until Green ratification)

***

## 1. Pricing Anchors (How These Numbers Were Set)

Labor baselines — fully loaded EU cost, mid-2026:

| Role replaced                       | Day rate (€) | Monthly loaded (€) | Annual loaded (€) |
| ----------------------------------- | -----------: | -----------------: | ----------------: |
| HSE site supervisor                 |     600–900  |       9,000–13,000 |   110,000–160,000 |
| ESG / sustainability analyst        |     900–1,400|       7,500–11,000 |    90,000–135,000 |
| EU regulatory / compliance officer  |    1,200–2,000|     10,000–15,000 |   120,000–180,000 |
| Construction scheduler / planner    |     800–1,200|       7,000–10,000 |    85,000–125,000 |
| Carbon / LCA consultant             |    1,200–1,800|       9,000–14,000 |   110,000–170,000 |
| Customer-success / CSAT analyst     |     600–900  |       6,000–9,000  |    75,000–110,000 |
| Logistics / supply-chain planner    |     800–1,200|       7,500–11,000 |    90,000–135,000 |
| Competitive-intel / market analyst  |     800–1,300|       7,000–10,000 |    85,000–125,000 |
| Auditor / quality-control reviewer  |    1,000–1,600|       8,500–13,000 |   100,000–155,000 |

Two pricing units, both anchored to those baselines:

- **Per-outcome** = 10–20% of the human cost of producing that artifact today.
- **Per-agent-month** = 15–30% of the fully loaded cost of the FTE the agent stands in for, SLA-backed, with audit trail + KYA trust score + Themis escalation.

Per-seat pricing is **not offered**.

---

## 2. Master Price List — DWS Skilled Agents (Green / Direct)

Currency: EUR ex-VAT. All per-agent-month prices include audit trail, KYA TC-2+ runtime trust, EU data residency, and Themis-coordinated human-on-loop escalation.

| # | Agent                  | Role replaced                       | Per-outcome unit                          | Per-outcome price (€) | Per-agent-month (€) | Annual prepay (€) |
|---|------------------------|-------------------------------------|-------------------------------------------|----------------------:|--------------------:|------------------:|
| 1 | **SiteSense**          | HSE site supervisor                 | Site-safety assessment (per site/day)     |             49 / 99   |              2,499  |            24,990 |
| 2 | **Material Oracle**    | LCA / carbon consultant             | EN 15978 LCA report (A1–D, one project)   |            499 / 999  |              1,999  |            19,990 |
| 3 | **Compliance**         | EU regulatory / compliance officer  | CSRD / CBAM / AI Act gap analysis         |          999 / 2,499  |              2,999  |            29,990 |
| 4 | **Schedule Genius**    | Construction scheduler              | Project schedule + risk pass (per project)|            499 / 1,499|              1,999  |            19,990 |
| 5 | **Emissions Data**     | ESG data analyst                    | Scope 1/2/3 dataset + variance report     |            399 / 899  |              1,499  |            14,990 |
| 6 | **Logistics**          | Supply-chain planner                | Route/load plan + ETA risk (per lane)     |             99 / 299  |              1,799  |            17,990 |
| 7 | **Construction**       | Bundled construction analyst        | Full site assessment (safety+materials+plan) |       1,499 / 2,999|              3,999  |            39,990 |
| 8 | **Customer Sat**       | CSAT analyst                        | CSAT scoring + churn flag (per cohort)    |            199 / 499  |                999  |             9,990 |
| 9 | **Viability**          | Project viability analyst           | Go/no-go scoring + sensitivity            |            499 / 1,299|              1,499  |            14,990 |
|10 | **Deepwiki Extractor** | Knowledge-base / research analyst   | Structured extract (per source pack)      |             49 / 199  |                799  |             7,990 |
|11 | **Quality Gate**       | Auditor / fact reviewer             | Per 1,000 verified outputs                |             99        |              1,499  |            14,990 |
|12 | **Sovereignty Monitor**| Data-residency / NIS2 analyst       | DB sovereignty assessment + report        |          499 / 1,499  |              1,999  |            19,990 |
|13 | **Competitor Surveil.**| Market / competitive analyst        | Monthly competitor brief (per segment)    |            399 / 799  |              1,499  |            14,990 |
|14 | **SEO Audit**          | SEO / content analyst               | Site audit + recommendations              |            299 / 599  |                999  |             9,990 |
|15 | **Lead Feedback**      | Sales-ops analyst                   | Pipeline review + objection map           |             99 / 299  |                999  |             9,990 |
|16 | **Themis (Coord.)**    | Engagement manager / case lead      | Multi-agent case (per closed case)        |            499 / 1,499|              2,499  |            24,990 |

Notes:
- Per-outcome range is **Standard / Enterprise** (Enterprise = signed off, EU-Act-compliant, audit-pack delivered).
- Annual prepay = 10× monthly (2 months free).
- Themis is the **orchestration product** — bundling it adds 0% to the agent prices it routes; it sells on its own as a case-management unit.

---

## 3. Model Training — Customer-Owned Fine-Tuned SLMs

A three-rung product ladder that sells customer-owned fine-tuned Small Language Models. Distinct from the Skilled Agents above — these are **model artifacts the customer takes home**, not labor units we deliver as a service. Customer retains 100% IP of trained model weights.

Currency: EUR ex-VAT. All tiers include EU data residency option (Aegis uplift), KYA model attestation, and a 30-day eval-regression SLA.

| #   | SKU                            | Tier                       | Size       | Delivery        | Price (€) | Channel                              |
| --- | ------------------------------ | -------------------------- | ---------- | --------------- | --------: | ------------------------------------ |
| T1  | **Train Model — Compact**      | TM-001 self-serve          | 3B         | Overnight       |     1,490 | Stripe / Store (public)              |
| T2  | **Train Model — Standard**     | TM-001 self-serve          | 9B         | Overnight       |     2,990 | Stripe / Store (public)              |
| T3  | **Train Model — Pro**          | TM-001 self-serve          | 32B        | Overnight       |     7,490 | Stripe / Store (public)              |
| T4  | **Bridge Track 70B**           | EMT-001 invite-only        | 70B        | ~3 business days|    19,990 | Sales-qualified (15-min call)        |
| T5  | **EMT Starter**                | EMT-001 project            | 7B         | 2 weeks         |    50,000 | Sales + SOW                          |
| T6  | **EMT Professional**           | EMT-001 project            | 30B–70B    | 4 weeks         |   100,000 | Sales + SOW                          |
| T7  | **EMT Enterprise**             | EMT-001 project            | up to 405B | 8 weeks         |   200,000 | Sales + SOW                          |

### Aegis sovereign uplift

EU-residency / CLOUD-Act-free training and signed KYA chain-of-custody attestation.

| SKU range                     | Aegis uplift (€) |
| ----------------------------- | ---------------: |
| TM-001 (Compact / Standard / Pro) |              990 |
| EMT-001 Bridge Track              |            2,500 |
| EMT-001 Starter / Pro / Enterprise|     5,000–12,000 |

### Loaded BOM and margins

| SKU                | Loaded BOM (€) | List price (€) | Gross margin |
| ------------------ | -------------: | -------------: | -----------: |
| TM-001 Compact     |        129–152 |          1,490 |        ~90 % |
| TM-001 Standard    |        204–240 |          2,990 |        ~93 % |
| TM-001 Pro         |        310–380 |          7,490 |        ~94 % |
| Bridge Track 70B   |        845–1,000 |        19,990 |        ~95 % |
| EMT Starter        |     ~15,000 (incl. 2-wk engineer) |    50,000 |        ~70 % |
| EMT Professional   |     ~30,000 (incl. 4-wk engineer) |   100,000 |        ~70 % |
| EMT Enterprise     |     ~60,000 (incl. 8-wk engineer + multi-node compute) |   200,000 |        ~70 % |

Notes:
- TM-001 loaded BOM = compute (Colab / Lambda / RunPod A100 or H100) + Claude API data generation + €100/h SLM engineer touch-time (1.0 / 1.5 / 2.0 h across tiers) + conversion (GGUF/MLX/NIM).
- Bridge Track loaded BOM includes sales-engagement overhead (~€100) and 5h engineer time for the multi-day 70B run.
- EMT Starter–Enterprise margins are lower because they include dataset construction, multi-week engineering, and 12-month support contracts (not just a model artifact).
- Self-serve tiers (T1–T3) carry a 30-day eval-regression SLA. Bridge Track carries the same 30-day SLA. EMT-001 project tiers carry a 12-month support contract.

### Listing channels for Model Training

| Channel                       | TM-001 tiers | Bridge Track | EMT project tiers |
| ----------------------------- | :----------: | :----------: | :---------------: |
| Public Store (dws10.com)      |      ✅       |  ⚠️ teaser only  |       ✅           |
| Stripe self-checkout          |      ✅       |      ❌       |       ❌           |
| Microsoft Agent 365 / Marketplace | ❌ (model artifacts, not agents) | ❌  | ❌                |
| Salesforce Agentforce         | ❌ (same — not an agent) | ❌  | ❌                |
| Sales-qualified inbound       |      ❌       |      ✅       |       ✅           |

**Why Model Training does not list on Agent 365 / Agentforce:** these marketplaces transact **agents as labor**, not **model artifacts as IP**. Listing a fine-tuned 70B model on Azure Marketplace would mis-set buyer expectations and force pricing into a per-seat or per-call mental model that doesn't match the workload. Train Model and EMT-001 stay on dws10.com / direct sales.

### Ladder transitions (when a customer moves up)

| Trigger                                                       | From → To                                |
| ------------------------------------------------------------- | ---------------------------------------- |
| Dataset grew past 2M examples                                 | TM-001 Pro → Bridge Track                |
| Customer wants 70B specifically                               | TM-001 → Bridge Track                    |
| Customer needs dataset construction from raw documents        | TM-001 / Bridge → EMT Starter            |
| Customer needs custom architecture (non-Llama/Qwen base)      | Anything → EMT Professional+             |
| Customer needs 12-month support contract                      | TM-001 / Bridge → EMT Starter+           |
| Customer budget jumps from €15K–€25K to €50K+                 | Bridge Track → EMT Starter / Professional|

Full product specs:
- [Store/PRODUCT_TRAIN_MODEL.md](../../Store/PRODUCT_TRAIN_MODEL.md) — TM-001 self-serve (T1–T3)
- [Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md](../../Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md) — EMT-001 Bridge Track + Starter / Pro / Enterprise (T4–T7)

### Measurement plan (pre-launch — read before scaling marketing spend)

Train Model has **zero historical conversion data** — TM-001 is a brand-new SKU. The Y1 projection (50 customers, ~€170K revenue, mix 10 Compact / 30 Standard / 10 Pro) is anchored on price benchmarks (OpenAI fine-tune, Hugging Face AutoTrain, Together AI) and one proxy signal (78% acceptance on the production "compliance strategist" upsell rule per `docs/GTM_MACHINE_PHASE_2_SUMMARY.md:218`). It is **not** anchored on measured Train Model demand.

For the first **60 days post-launch**, track:

| Metric                            | Source                                        | Decision it informs                                |
| --------------------------------- | --------------------------------------------- | -------------------------------------------------- |
| Cart starts (TM-001 page → Stripe)| `dws10.com/admin/analytics/funnel.html`       | Top-of-funnel: is the SKU page converting visitors?|
| Completed orders                  | Stripe + Supabase                             | Y1 projection sanity check (target ≥ 4/month avg)  |
| Tier mix (Compact / Standard / Pro split) | Stripe line items                     | Pricing-anchor validity; informs Firehorse surfacing decision (heavy Standard/Pro → desktop buyers → defer mobile) |
| Bridge Track inbound qualifications | sales CRM (qualifying-call dispositions)    | Validate teaser-tile pull; confirm or kill the gated-tile pattern |
| Aegis sovereign uplift attach rate| Stripe + order metadata                       | Sovereign-tier demand signal; informs Aegis pricing |
| Time-to-completion (order → artifact delivery) | order timestamps                | Unattended-loop reliability proof (gate for SLA promise) |
| 30-day eval-regression SLA invocations | Support tickets                          | Quality signal; informs add-on pricing and Pro tier scope |

**Re-anchor before scaling.** After 60 days, re-fit the Y1 projection against measured data. If tier mix, conversion rate, or unattended reliability are materially off, the price-list §3 numbers, the Store SKU pages, and the BOM tables get a revision pass *before* paid marketing or new ICP outbound begins.

---

## 4. Recommended Bundles (Headcount Equivalents)

Sold as a **stand-in team**, not a feature pack. Marketed by the FTE count it replaces.

| Bundle                                  | Agents                                                 | Replaces (FTE)             | Per-month (€) | Annual (€) | Buyer                       |
|-----------------------------------------|--------------------------------------------------------|----------------------------|--------------:|-----------:|-----------------------------|
| **ESG Function-as-a-Service**           | Material Oracle + Emissions Data + Compliance + Themis | ~1.5–2.0 ESG/Compliance    |         6,999 |     69,990 | Head of Sustainability      |
| **HSE Function-as-a-Service**           | SiteSense + Compliance (HSE scope) + Themis            | ~1.0–1.5 HSE supervisors   |         4,999 |     49,990 | HSE / Safety Director       |
| **Construction Ops Pod**                | Construction + Schedule Genius + Logistics + Themis    | ~2.0 PM/planner roles      |         8,499 |     84,990 | COO / Operations            |
| **Sovereignty & Compliance Pack**       | Sovereignty Monitor + Compliance + Quality Gate        | ~1.0 compliance + ~0.3 DPO |         5,499 |     54,990 | CISO / DPO                  |
| **Go-to-Market Pod**                    | SEO Audit + Competitor Surveil. + Lead Feedback + CSAT | ~1.5 marketing/CS analysts |         3,999 |     39,990 | CMO / Head of Growth        |
| **Full Skilled Workforce**              | All 16 agents, Themis-coordinated                      | ~6–8 FTE across functions  |        19,990 |    199,990 | CFO / CEO                   |

A `Full Skilled Workforce` at €199,990/yr stands in for 6–8 EU FTEs whose loaded cost is **€600k–€1.2M/yr** — i.e., DWS prices in at **17–33% of the human cost** of the work being replaced. Margin sits well above 80% because the marginal cost is inference + thin human-on-loop review.

---

## 5. Microsoft Agent 365 — Listing Strategy & Pricing

### What we're listing into

Agent 365 is the Microsoft agentic plane spanning Copilot Studio, M365 Copilot, Azure AI Foundry, and the **Agent Store / Azure Marketplace** for transactable third-party agents. Customer billing flows on the Azure invoice; eligible SKUs **burn down MACC** (Microsoft Azure Consumption Commitment), which means a customer with €5M of committed-but-unspent Azure can pay our sticker without it touching new budget.

Take rate (Azure Marketplace, transactable SaaS / agent SKUs, 2025–2026): **3%** for marketplace-eligible deals, **0%** for IP co-sell with multiplier credit to seller. We design for the 3% case.

### Listing rule

- **Do not list per-seat.** The M365 default mental model is per-user/month — we override it on the listing page with a per-outcome and per-agent-month price card.
- **Two SKU shapes per agent**:
  1. **Metered (per-outcome)** — Azure Marketplace metered billing dimension (e.g., "per LCA report", "per site-safety assessment").
  2. **Flat per-agent-month** — committed monthly with annual prepay option.
- **Gross-up vs. direct list**: +3% to neutralize Microsoft take, rounded to clean numbers. Effectively absorbed by the MACC tailwind — buyer doesn't feel it.
- **Currency**: list in EUR primary, USD secondary (Microsoft requires USD for global marketplace; auto-FX is fine).

### Agent 365 price card (gross of 3% MS take, rounded)

| Agent                  | Per-outcome list (€) | Per-agent-month list (€) | MACC-burn eligible |
|------------------------|---------------------:|-------------------------:|:------------------:|
| SiteSense              |              49 / 99 |                    2,599 | ✅                 |
| Material Oracle        |             499 / 999|                    2,099 | ✅                 |
| Compliance             |          999 / 2,599 |                    3,099 | ✅                 |
| Schedule Genius        |          499 / 1,549 |                    2,099 | ✅                 |
| Emissions Data         |          399 / 929  |                    1,549 | ✅                 |
| Logistics              |              99 / 309|                    1,849 | ✅                 |
| Construction (bundle)  |        1,549 / 3,099 |                    4,099 | ✅                 |
| Customer Sat           |             199 / 519|                    1,029 | ✅                 |
| Viability              |          499 / 1,339 |                    1,549 | ✅                 |
| Deepwiki Extractor     |              49 / 199|                       829| ✅                 |
| Quality Gate           |          99 / 1,000  |                    1,549 | ✅                 |
| Sovereignty Monitor    |         499 / 1,549  |                    2,099 | ✅                 |
| Competitor Surveil.    |             399 / 829|                    1,549 | ✅                 |
| SEO Audit              |             299 / 619|                    1,029 | ✅                 |
| Lead Feedback          |              99 / 309|                    1,029 | ✅                 |
| Themis (Coordinator)   |         499 / 1,549  |                    2,599 | ✅                 |

### Why this works on Agent 365

- **MACC burn-down is the wedge.** Heads of Sustainability / HSE in enterprises that have committed €Ms to Azure (everyone in our Q1/26 target list does) can pay sticker out of an unspent commitment — procurement loves this; finance loves this.
- **Microsoft co-sell credit** counts MACC-eligible marketplace revenue at multiplier (≥1×) toward MSFT seller quotas — turns Microsoft field into a distribution channel.
- **Copilot-adjacent**: we deliberately do **not** position as a Copilot extension. Copilots are tools. Our agents are **labor units that happen to be listed where M365 customers buy**.

---

## 6. Salesforce Agentforce — Listing Strategy & Pricing

### What we're listing into

Salesforce ships agents under the Agentforce brand and transacts third-party agents via **AppExchange**. Salesforce explicitly markets its own agentic stack as **"digital labor"** — language that is on-narrative for us and saves a buyer-education step.

Take rate (AppExchange managed package / agent SKUs, 2025–2026): **15%** standard, negotiable to **10%** for strategic ISVs with co-sell. Plus Salesforce's own platform meter (Agentforce per-conversation / per-action) sits underneath — that is **the customer's cost on the Salesforce side**, not ours, but it affects the all-in price the buyer feels.

### Listing rule

- **Lead with per-agent-month flat SKUs**, not per-conversation metered. Reason: Salesforce's own per-conversation meter sits under it; stacking meter-on-meter inflates customer all-in cost and triggers procurement pushback. A flat per-agent-month sticker on top of the platform meter is much cleaner.
- **Per-outcome SKUs are listed but de-emphasized** on AppExchange, kept for direct sales channel.
- **Gross-up vs. direct list**: +18% to neutralize the 15% Salesforce take with a small buffer. Co-sell deals (10% take) keep the buffer as margin.
- **Currency**: USD primary on AppExchange (Salesforce convention), EUR shown as secondary.

### Agentforce price card (gross of ~18% SF take, rounded)

| Agent                  | Per-agent-month list (€) | Per-outcome (€, secondary) |
|------------------------|-------------------------:|---------------------------:|
| SiteSense              |                    2,949 |                     59 / 119 |
| Material Oracle        |                    2,359 |                    589 / 1,179 |
| Compliance             |                    3,539 |                  1,179 / 2,949 |
| Schedule Genius        |                    2,359 |                    589 / 1,769 |
| Emissions Data         |                    1,769 |                    469 / 1,059 |
| Logistics              |                    2,119 |                    119 / 359 |
| Construction (bundle)  |                    4,719 |                  1,769 / 3,539 |
| Customer Sat           |                    1,179 |                    239 / 589 |
| Viability              |                    1,769 |                    589 / 1,529 |
| Deepwiki Extractor     |                       949 |                     59 / 239 |
| Quality Gate           |                    1,769 |                  119 (per 1,000) |
| Sovereignty Monitor    |                    2,359 |                    589 / 1,769 |
| Competitor Surveil.    |                    1,769 |                    469 / 949 |
| SEO Audit              |                    1,179 |                    359 / 709 |
| Lead Feedback          |                    1,179 |                    119 / 359 |
| Themis (Coordinator)   |                    2,949 |                    589 / 1,769 |

### Why this works on Salesforce

- **Same vocabulary.** Salesforce already trains its customers that an Agentforce agent = digital labor with a price. We slot in at the same conceptual level and at a defensible price vs. Salesforce's own first-party agents.
- **CSAT, Lead Feedback, Competitor Surveil., SEO Audit, Themis** are the natural fits because they live in or next to CRM data. Material Oracle and SiteSense are cross-listed but lead-channel is direct/Microsoft, not Salesforce.
- **Per-conversation stacking is the trap.** We avoid it by selling **the role**, not **the chat**. A buyer pays one monthly fee for the role; per-conversation cost is Salesforce's own infra meter and is invisible to our pricing logic.

---

## 7. Channel Comparison At-A-Glance

| Dimension                       | Direct (DWS)               | Microsoft Agent 365 / Azure Marketplace | Salesforce Agentforce / AppExchange |
|---------------------------------|----------------------------|------------------------------------------|--------------------------------------|
| Take rate                       | 0%                         | 3% (marketplace) / 0% (co-sell IP)       | 15% (10% strategic ISV)              |
| Customer pays via               | DWS invoice                | Azure invoice (MACC-burn eligible)       | Salesforce invoice                   |
| Best listing shape              | Per-outcome + per-agent-mo | Per-outcome metered + per-agent-month    | Per-agent-month flat                 |
| Underlying platform meter       | None                       | Azure consumption (invisible to buyer)   | Agentforce per-conversation / action |
| Best agents to lead with        | All                        | Material Oracle, SiteSense, Compliance, Sovereignty | CSAT, Lead Feedback, Competitor Surveil., SEO Audit, Themis |
| Buyer mental model              | Hire a function            | Burn down committed cloud spend          | Hire digital labor                   |
| Net to DWS (per-agent-month)    | 100%                       | ~100% after MACC tailwind + 3% gross-up  | ~100% after 18% gross-up @ 15% take  |
| Distribution leverage           | Low                        | Very high (M365 field + MACC)            | High (CRM ISV ecosystem)             |
| Sales-cycle compression         | n/a                        | ~30–50%                                  | ~20–40%                              |

Strategy: **direct stays the master price list; both marketplaces are uplifted just enough to neutralize take and never list cheaper than direct.** Channel conflict is avoided by listing the same SKUs at marketplace-uplifted prices.

---

## 8. Governance Hooks

- **Blue/Green status**: Treat all marketplace-listed agents as **Blue** until the corresponding Green is signed off under `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md`. The price-list version field must move with each change (priceVersion ≥ 1.13 baseline).
- **Single source of truth**: `dws10.com/config/products.json` mirrored to `landing-pages/dws10-com/config/products.json` in the same commit (per CLAUDE.md Source-of-Truth Rule).
- **No hardcoded prices** in HTML, Store/*.md, or marketing pages — only references that resolve against `products.json`.
- **Listing copy on marketplaces** must say "replaces N FTEs" / "per report" / "per agent-month", never "per user / per seat" (per `AI-AS-LABOR-PRICING-STRATEGY.md`).
- **Subscription is a required separate product** on every contract (per Dynamic Deployment Pricing Standard §3) — applies even to marketplace SKUs.
- **Cloud / hardware = separate operating costs**, never bundled into the agent's per-month price.

---

## 9. Open Questions (Carry Into Next Sprint)

1. **Compliance agent split**: list as one agent priced for the largest regulatory unit (CSRD), or three SKUs (CSRD / CBAM / EU AI Act)? Recommendation: one SKU, three outcome dimensions metered separately.
2. **Industry workflow agents (Mars, Helios, Vulcan, Talos, Gaia, Ceres, Neptune, Prometheus, BESS)** — price as **vertical Themis bundles** at €3,499–4,999/mo, or as a separate "Industry Workforce" tier? Pending alignment with `DWS_PRODUCT_STANDARD.md`.
3. **EU AI Act conformity assessment**: lift Compliance Enterprise per-outcome from €2,499 to €3,999 once notified-body co-sign is in place (target Q4 2026).
4. **AppExchange co-sell tier** — push for 10% take by committing to two co-marketed launches with Salesforce in 2026.
5. **MACC field plays** — identify three Q1/26 manifesto accounts (e.g., Skanska, STRABAG, HOCHTIEF) with sizable Azure commitments and run the MACC-burn motion as proof for the rest.

---

## 10. Companion Documents

- `docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md` — the positioning thesis behind these numbers.
- `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md` — Blue/Green governance for every price below.
- `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` — the named-account target list this pricing is aimed at.
- `dws10.com/config/products.json` — the single source of truth once these prices are ratified.
- `Store/PRODUCT_TRAIN_MODEL.md` — full TM-001 SKU spec (Compact / Standard / Pro, agent surface, qualification scripts).
- `Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md` — full EMT-001 SKU spec (Bridge Track + Starter / Professional / Enterprise project tiers).
- `docs/field-notes/2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md` — loaded BOM derivation (compute + €100/h SLM engineer line) for the Model Training chapter prices.
- `docs/field-notes/2026-05-23-train-model-product-three-tier-enterprise-pricing.md` — initial productization study (3-tier rationale).
