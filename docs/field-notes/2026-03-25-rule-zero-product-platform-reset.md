# Rule Zero: The Product Platform Reset

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/fix-linkedin-channel-QK460 | Date: 25.03.2026 | Changes: Initial creation — founder field note on Rule Zero, multiple PMFs, and the product platform question

Session Links & References:
  - Claude Code (claude/fix-linkedin-channel-QK460): https://github.com/blogtheristo/dws6/commits/claude/fix-linkedin-channel-QK460
  - Sales Playbook: Firehorse/Omnichannel/Customers/DISCOVERY_QUALIFICATION_GATE.md

Document Status:
  - Created: 25.03.2026
  - Last Modified: 25.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: INTERNAL

***

| Field | Value |
|-------|-------|
| **Document ID** | DWS-FN-2026-03-25-001 |
| **Type** | Founder Field Note |
| **Date** | 2026-03-25 |
| **Author** | Risto Anton Päärni, CEO |
| **Status** | Active |
| **Classification** | Internal — Strategy |

---

## The Product Platform Question

> The founders who survive will be the ones who can look at what they've built
> and ask: if I were starting this company today, using today's tools in today's
> market, what would I actually build?

This is not a hypothetical. This is the question that separates companies that adapt from companies that die defending yesterday's assumptions.

### What "Product Platform" Actually Means

A product platform is not a product. It's the **core engine that can be pivoted quickly to any enterprise AI problem.**

The product is what you sell today (compliance agents for construction). The platform is what lets you sell something different tomorrow without rebuilding from scratch. The founders who survive are the ones who built a platform, even if they thought they were building a product.

| | Product | Product Platform |
|---|---------|-----------------|
| **Scope** | Solves one problem for one market | Core engine that can be aimed at any enterprise AI problem |
| **Pivot cost** | Months of rebuilding | Days/weeks of reconfiguration |
| **Market risk** | Dies if the market shifts | Survives because it can follow the market |
| **Example** | "CSRD compliance tool for construction" | "Enterprise AI agent orchestration with sovereign EU infrastructure" |

**The test:** If your biggest market disappeared tomorrow, how long would it take to serve a different one? If the answer is "we'd have to start over" — you built a product. If the answer is "we'd retrain agents and reconfigure workflows" — you built a platform.

---

## What This Means for DWS

We built DWS IQ 6 starting in a specific moment: pre-EU AI Act enforcement, pre-CSRD reporting deadlines, pre-sovereignty panic, pre-defense AI boom, pre-AI agent commoditization. The tools were different. The market was different. The competitive landscape was different.

If we were starting today — March 2026 — with today's tools, today's regulations, today's market:

**What would we actually build?**

Not "what features would we add to what we have." That's incremental thinking. The question is: **given everything that changed, would we build the same thing at all?**

### DWS IQ as a Product Platform

The good news: we may have accidentally built a platform, not just a product.

| Platform Layer | What we built | How it pivots |
|----------------|--------------|---------------|
| **Agent orchestration** | 16 TypeScript agents with MCP, delegation, event bus | New agent = new industry/problem in days |
| **Sovereign EU infra** | Finland/Germany data residency, EU AI Act Article 12 logging | Any EU enterprise problem that needs sovereignty |
| **Compliance engine** | ETS, CBAM, CSRD, Fit for 55 scoring | Any regulation — defense standards, financial compliance, health regs |
| **Fleet/IoT layer** | Lifetime Fleet, NVIDIA Jetson edge AI | Civilian logistics → contested logistics → autonomous systems |
| **Satellite/SAR** | Argus orbital intelligence (ICEYE) | Industrial monitoring → defense ISR → change detection |
| **Omnichannel sales** | Firehorse multi-channel automation | Sell anything to any enterprise vertical |

**The platform question for DWS:** Are we a compliance AI company that happens to have a platform, or are we a platform company that happens to do compliance first?

### Where the Moats Actually Are

When AI agent frameworks commoditize and every hyperscaler ships agent tooling, "we built agents" is no longer a moat. The defensible moats that remain:

| Moat | Why it's defensible | DWS position |
|------|--------------------|----|
| **Proprietary data** | Models are commodities. The data you train and score with is not. Whoever owns the dataset owns the outcome. | EU ETS benchmarks, CBAM defaults, ESRS registry, emission factors — all codified in `src/compliance/`. ICEYE SAR imagery via Argus. Customer compliance data accumulates over time. |
| **Deep understanding of customer outcomes** | Anyone can build an agent. Knowing *which* outcome the customer will pay for — and how to measure it — takes years of discovery. | 25+ industries mapped with specific regulatory pain. CXO call scripts with real objection patterns. MPO definitions per agent. This knowledge compounds. |
| **Regulatory lock-in** | Once a customer uses your system for regulatory reporting and an auditor has accepted it, switching costs become enormous. Compliance is sticky. | CSRD gap analysis, EU ETS allowance tracking, CBAM border carbon — once an auditor has validated reports from DWS, the customer can't easily switch mid-reporting cycle. Article 12 logging for EU AI Act creates audit trail lock-in. |
| **Program of Record** | In defense and enterprise procurement, being the "Program of Record" — the approved, contracted vendor for a specific capability — creates multi-year lock-in that competitors can't displace without a full re-evaluation. | Not yet achieved. This is the goal for Captain seats: become the named compliance AI vendor for each industry vertical. In defense: become the sovereign EU AI platform of record for NATO/EU procurement. |

**The insight:** In the age of AI commoditization, the moat is not the model, not the framework, not the agent. The moat is what you know about the customer's outcome that no one else knows — and the institutional position (regulatory, contractual, data) that makes switching irrational.

**For DWS, the moat-building priority is:**
1. **Regulatory lock-in** — be the system of record for CSRD/CBAM/EU AI Act compliance. Once auditors accept it, it's sticky for years.
2. **Proprietary data** — accumulate industry-specific compliance data that improves scoring. Every customer makes the platform smarter for the next one.
3. **Customer outcome depth** — know exactly which MPO each industry will pay for. This is discovery, not engineering.
4. **Program of Record** — become the named vendor in enterprise procurement and defense contracts. Hardest to achieve, hardest to displace.

---

## What Changed (Rule Zero Inventory)

### Things we knew about
- EU sovereignty demand (CLOUD Act, Schrems II aftermath, EU data residency)
- CSRD/CBAM enforcement timelines
- Construction industry's slow adoption curve

### Things that changed around us while we were building (Research, March 2026)

**1. SAP and Oracle went all-in on AI agents (EXISTENTIAL)**
SAP launched Joule with 400+ AI use cases including compliance agents. Joule Studio (GA Q1 2026) lets enterprises build custom compliance agents inside SAP. Oracle launched 50+ AI agents across Fusion. Both bundle compliance into ERP as included features. When SAP gives your target customer a compliance agent for free, "why buy a separate tool?" becomes nearly impossible to answer.

**2. CSRD Omnibus gutted the mid-market TAM (STRUCTURAL)**
EU Omnibus I (Feb 2026) reduced CSRD scope by ~90%. New thresholds: 1,000+ employees AND €450M+ turnover. Wave 2/3 companies delayed 2 years. Listed SMEs removed. ESRS datapoints cut from 1,100+ to ~400-500. If we were selling CSRD to mid-market (250-999 employees), that market evaporated overnight.

**3. Vendor consolidation killing point solutions (STRUCTURAL)**
90% of IT leaders prioritize vendor consolidation. Orgs target 20% reduction in vendor count. Top 5 SaaS vendors now control 51% of global market (up from 36%). CIOs want platforms, not point solutions. "Best of breed" era is over. A small EU vendor selling a standalone compliance tool is exactly what CIOs are cutting.

**4. The ROI reckoning — 95% of AI pilots deliver zero ROI (STRUCTURAL)**
MIT 2025: 95% of enterprise AI pilots deliver zero measurable ROI. 42% of companies abandoned most AI projects. CFOs demand hard P&L accountability in 90 days. Budget shifted from "innovation funds" (25% in 2024) to core IT budgets (93% in 2026). Every buyer has been burned.

**5. Sovereignty went from differentiator to procurement requirement (TAILWIND)**
US cloud holds 85% of EU market. Trump admin linked tariffs to EU digital regulation. France phasing out Zoom/Teams by 2027. All 27 member states signed sovereignty declaration. Sovereign cloud spending to triple to $23B by 2027. EU proposed CADA (Cloud and AI Development Act).

**6. AI agent frameworks commoditized (STRUCTURAL)**
Open-source agent frameworks (LangChain, CrewAI, AutoGen) are table stakes. MCP (Anthropic), A2A (Google), ACP (IBM) compete as interoperability standards. Hyperscalers spending $600B+ on AI infra in 2026. Value migrating from "can build agents" to "can orchestrate agents with domain knowledge."

**7. Defense AI went from $0 to $17.9B/year in equity alone (MISSED OPPORTUNITY)**
Defense tech VC hit $49.9B across 966 deals in 2025. Equity funding for defense startups doubled to $17.9B. Nearly 8% of all global VC now goes to defense. Helsing (Germany): €12B valuation. Anduril: $60B target. EU defense budgets: €218B (2021) → €343B (2024) → €800B target (2030). ReArm Europe: €800B investment surge + €150B SAFE loan fund. EDF 2025: €1B+ for AI-enabled R&D.

**Finland specifically:** Defense budget going from $6.8B (2025) to $11.5B (2032, 5% GDP). Finnish startups captured 85% of all Nordic defense funding ($410M in 2025). $203/capita defense tech investment — highest in Nordics. DEFINE Accelerator in Riihimaki. Defence Tech Hub in Espoo (where Lifetime Oy is based). 368 defense companies, 144 startups. Export target: €10B by 2030.

**The gap in EU defense AI:** Most startups build kinetic systems (drones, weapons, fighters). Almost nobody builds the "boring but critical" infrastructure layer — logistics AI, compliance automation, base security scoring, fleet management. That is exactly what DWS builds for civilian use.

**8. EU AI Act + NIS2 + DORA + CBAM create new compliance stack (OPPORTUNITY)**
While CSRD contracted, everything else expanded. AI Act high-risk rules live August 2026 (fines up to €35M or 7% turnover). NIS2 full compliance October 2026. DORA fully applicable. CBAM definitive phase started Jan 2026. No single ERP vendor covers all of these.

### Things we missed entirely
- Adjacent markets where our technology fits but we never looked (defense, contested logistics, medical evacuation, force protection)
- The dual-use potential of what we already built
- The CSRD Omnibus reducing our primary TAM by 90%
- SAP/Oracle bundling compliance agents as included features
- The vendor consolidation wave that makes point solutions unsellable

---

## The Dual-Use Blind Spot

While we fought for adoption in construction — a market ripe for disruption but where incumbents still control — the defense autonomy market exploded. Defense tech VC went from near-zero to $17.9B/year in equity. EU defense budgets are tripling. Finland's defense spend is heading to 5% GDP ($11.5B by 2032). And the Defence Tech Hub is in Espoo — where we are.

Our existing capabilities map directly to defense use cases:

| DWS Capability | Civilian Use | Defense Use | Validated By |
|----------------|-------------|-------------|---|
| SiteSense (0-100 safety scoring) | Construction site safety | Force protection, base security | Base Operations (US) won AFWERX SBIR doing exactly this — "BaseScore" 0-100 threat assessment |
| Logistics Agent | Fleet compliance, route optimization, ADR hazmat | Contested logistics, autonomous resupply | DEFCON AI "ARTIV" for Air Mobility Command, C3 AI Army contract for supply forecasting |
| Lifetime Fleet (IoT/autonomous) | Logistics fleet tracking | Contested logistics vehicles | Blue Water autonomous logistics ships, Sweden VTI trialing Einride AI in Hagglund military vehicles |
| Compliance agents | EU regulatory compliance (CSRD, CBAM, AI Act) | NATO STANAG, CMMC, defense procurement compliance | NATO 2024 AI Strategy requires "measurable steps" with performance indicators — compliance scoring |
| Argus (satellite/SAR imagery) | Industrial site monitoring via ICEYE | ISR, change detection, target labeling | ICEYE already has defense contracts; SAR is dual-use by nature |
| Situation Room (fleet dashboard) | Multi-site construction oversight | Theater-level operational awareness | Palantir Maven ($13B+ program of record) does this at scale |

**The gap we fit:** Most EU defense AI startups build kinetic systems (Helsing: drones/fighters, Quantum Systems: attack drones, Stark Defence: recon drones). Almost nobody builds the infrastructure layer — logistics AI, compliance automation, base security scoring, fleet management. That's exactly what DWS does.

**The entry path exists:** DEFINE Accelerator (Riihimaki) actively seeks dual-use startups. Defence Tech Hub is in Espoo. Finnish startups captured 85% of Nordic defense funding. Unclassified-first approach avoids heavy clearance requirements. Dual-use positioning means DWS doesn't become a "defense company" — it extends civilian products to defense customers.

We had the product. We had the location. We didn't have the market awareness.

---

## The Three Lessons

### 1. Multiple Product/Market Fits

In complex enterprise sales, there isn't one PMF. There are six:

| PMF | Who | Question |
|-----|-----|----------|
| User fit | End user | "Does it solve my pain?" |
| Champion fit | Internal advocate | "Can I stake my reputation on this?" |
| C-suite fit | CFO/CIO/CTO | "Is this defensible?" |
| IT/Security fit | IT ops, CISO | "Can we deploy and secure this?" |
| Procurement fit | Legal, finance | "Does it pass our vendor process?" |
| Scale fit | Transformation office | "Can this roll out enterprise-wide?" |

**A demo nails User fit. A prototype nails Champion fit. Neither tells you anything about the other four.**

### 2. Don't Build Blind

> Don't invest time and resources in building on-demand prototypes if you don't
> know the path to a purchase order.

Engineering hours are the most expensive thing a startup has. Before committing them: can you draw the path from demo to signed PO on a whiteboard? If not, stop building and start discovering.

### 3. Use Polite Forcing Functions

> Use polite forcing functions — e.g. cancelable purchase orders — to discover
> who else needs to say "yes."

The cancelable PO is not a closing tactic. It's the best discovery tool we've found. Every "I can't sign because..." reveals a stakeholder, maps a gate, and teaches you something a demo never would.

---

## What Comes Next: From PMF to Agent/Outcome Fit

The product platform question leads to a bigger paradigm shift:

> The search for Product/Market Fit will become the search for
> **AI Agent/Customer Outcome Fit.**
>
> Minimal Viable Products (MVPs) will become
> **Minimal Productive Outcomes (MPOs).**

This changes everything about how you validate, sell, and scale.

| Old world | New world |
|-----------|-----------|
| **Product/Market Fit** — does the market want this product? | **Agent/Outcome Fit** — does this agent produce the outcome the customer pays for? |
| **MVP** — smallest product a customer will use | **MPO** — smallest outcome a customer will pay for |
| Ship features, measure adoption | Ship outcomes, measure value delivered |
| Sell licenses and seats | Sell results and completions |
| "Try our platform" | "Here's what our agent did for you" |

**Why this matters for DWS:** We don't sell a compliance platform. We sell a compliance *outcome* — a scored gap analysis, a generated CSRD report, a site safety assessment. The agent is the delivery mechanism. The outcome is the product.

**The MPO test:** What is the smallest thing an agent can do that a customer would pay for *right now*, without a pilot, without integration, without a 6-month evaluation? That's your MPO.

**DWS MPOs — Dual Market (Civilian + Defense):**

| Agent | Civilian MPO | Defense MPO |
|-------|-------------|-------------|
| Compliance | One scored CSRD/CBAM gap analysis | One NATO STANAG compliance assessment |
| SiteSense | One construction site safety score (0-100) | One base/FOB force protection score (0-100) |
| Material Oracle | One embodied carbon calculation (EN 15978) | One supply chain sovereignty assessment |
| Argus | One SAR change detection for one facility | One SAR ISR report for one area of interest |
| Logistics | One fleet carbon report for one route | One contested logistics route optimization |

Same agents. Same scoring architecture. Different regulation modules. Different threat models. **One platform, two markets.**

If the customer won't pay for the MPO, they won't pay for the platform. The MPO is the new qualification gate — in both markets.

*More on this in the next post.*

---

## The Strategic Decision: Both

**Date: 25 March 2026**

DWS IQ is not a compliance company. It is not a defense company. It is a **product platform** — a sovereign EU AI agent orchestration engine that serves both markets from the same core.

```
                    ┌─────────────────────────┐
                    │   DWS IQ PRODUCT        │
                    │   PLATFORM              │
                    │                         │
                    │  Agent Orchestration     │
                    │  Sovereign EU Infra      │
                    │  MCP / Event Bus         │
                    │  Deterministic Scoring   │
                    │  Edge AI (Jetson)        │
                    │  SAR (ICEYE/Argus)       │
                    └───────────┬─────────────┘
                                │
                ┌───────────────┼───────────────┐
                │                               │
    ┌───────────▼──────────┐       ┌────────────▼─────────────┐
    │  CIVILIAN MARKET     │       │  DEFENSE MARKET          │
    │                      │       │                          │
    │  Regulation modules: │       │  Regulation modules:     │
    │  CSRD, CBAM, AI Act  │       │  NATO STANAG, CMMC       │
    │  NIS2, DORA          │       │  ITAR, defense procurement│
    │                      │       │                          │
    │  Threat models:      │       │  Threat models:          │
    │  Regulatory risk     │       │  Adversarial threat      │
    │  Audit failure       │       │  Contested environment   │
    │  Carbon penalties    │       │  Force protection        │
    │                      │       │                          │
    │  Customers:          │       │  Customers:              │
    │  Construction CXOs   │       │  Finnish MoD, NATO       │
    │  Energy, Logistics   │       │  EU defense primes       │
    │  25+ EU industries    │       │  Nordic allies           │
    │                      │       │                          │
    │  Entry: Direct sales │       │  Entry: DEFINE Accel     │
    │  €30-60K pilots      │       │  Defence Tech Hub Espoo  │
    │                      │       │  EDF, NATO Innovation    │
    └──────────────────────┘       └──────────────────────────┘
```

**Why both works:**

1. **Same platform, different config** — New agents and regulation modules, not a rebuild. Days/weeks to pivot, not months.
2. **Sovereignty is the common thread** — EU civilian buyers want EU-sovereign AI. EU defense buyers require it. Same infrastructure serves both.
3. **Moats compound across markets** — Proprietary data from civilian compliance improves defense supply chain scoring. Defense force protection data improves civilian site safety. Network effects cross markets.
4. **Defense validates civilian credibility** — A defense contract (even unclassified) signals to enterprise buyers: "this platform is serious enough for NATO." That's PMF 3 (C-suite defensibility) solved.
5. **Revenue diversification** — Construction sales cycle is 6-18 months. Defense procurement is longer but stickier (Program of Record). Civilian MPOs generate revenue while defense pipeline builds.
6. **Finland is the perfect launchpad for both** — EU member (civilian compliance), NATO member (defense procurement), €11.5B defense budget by 2032, DEFINE Accelerator and Defence Tech Hub in Espoo.

**The execution priority:**

| Quarter | Civilian | Defense |
|---------|----------|---------|
| Q2 2026 | Ship MPOs: CBAM gap analysis, SiteSense scores. Sell outcomes not platform. | Apply to DEFINE Accelerator. Attend Defence Tech Hub events. Discovery only — no engineering. |
| Q3 2026 | AI Act compliance scoring (August 2026 deadline). NIS2 assessment. | DEFINE cohort (if accepted). Map defense PMFs: who are the Users, Champions, C-suite? |
| Q4 2026 | First regulatory lock-in: customers using DWS for annual CBAM/AI Act reporting. | First defense MPO: unclassified SiteSense adaptation for base security scoring. |
| 2027 | Platform of record for multi-regulation compliance (AI Act + NIS2 + CBAM + DORA). | EDF/NATO Innovation Fund application. First defense pilot. |

**The Rule Zero answer:** If we were starting today, we would build exactly what we have — a sovereign EU AI agent platform — but we would sell it to **both** markets from day one instead of fighting for construction adoption alone.

---

## The Partnership Strategy: SAP + NATO

**The insight:** Don't compete with giants. Partner with them. Become the sovereign EU depth layer that giants need but won't build.

### SAP Partnership

SAP is not the enemy. SAP is the distribution channel.

| SAP does | DWS does | Together |
|----------|----------|----------|
| 400+ generic compliance use cases via Joule | Deep regulation-specific scoring (CBAM emission factors, AI Act risk classification, NIS2 Article 21 mapping) | SAP customers get enterprise compliance that actually passes audits |
| S/4HANA ERP platform (80% of EU large enterprises) | Sovereign EU AI layer with no CLOUD Act exposure | SAP can tell EU government customers "we have a sovereign compliance option" |
| Global scale, global sales force | 25+-industry regulatory domain depth | SAP sells, DWS delivers the 20% that SAP gets wrong |

**The play:**
1. Build certified SAP integration (DWS already has `src/integrations/erp/sap/`)
2. Position as SAP BTP (Business Technology Platform) partner extension
3. SAP customers buy DWS because SAP recommends them — for the regulatory depth Joule won't build
4. DWS gets SAP's distribution. SAP gets sovereign EU compliance depth.

**Why SAP would partner:** SAP has a sovereignty problem. US-based cloud, CLOUD Act exposed. EU government customers are asking. SAP needs a sovereign EU compliance layer they can point to. DWS is that layer.

### NATO Partnership

NATO is not a customer to cold-call. NATO is an ecosystem to enter.

| Entry point | What it gives DWS | Timeline |
|-------------|-------------------|----------|
| **DEFINE Accelerator** (Riihimaki, Finland) | 3-month cohort, defense mentors, MoD connections, funding pathway | Apply Q2 2026 |
| **Defence Tech Hub** (Espoo — our city) | Ecosystem access, co-development with defense primes | Ongoing |
| **DIANA** (Defence Innovation Accelerator for the North Atlantic) | NATO-wide access, test center validation, credibility | Apply after DEFINE |
| **NATO Innovation Fund** (€1B) | Funding for dual-use startups | Via DIANA pipeline |
| **EDF** (European Defence Fund, €1B+ for AI) | R&D grants for AI-enabled defense systems | Consortium application 2027 |

**The play:**
1. Enter via DEFINE — lowest barrier, Finnish ecosystem, designed for startups
2. Deliver first unclassified defense MPO: SiteSense for base security scoring (0-100 threat assessment — identical architecture to construction safety)
3. Build credibility, get clearances, expand to logistics and compliance
4. Target: become NATO program of record for infrastructure AI — the "boring but critical" layer
5. Defense contract validates civilian credibility (PMF 3: "this platform is serious enough for NATO")

**Why NATO would partner:** NATO has a logistics and infrastructure AI gap. €800B in EU defense spending is coming. Most defense AI startups build drones and weapons. Nobody builds the AI that makes bases safe, supplies flowing, and procurement compliant. NATO needs this. We build this.

### The Flywheel

```
SAP Partnership                    NATO Partnership
     │                                   │
     ▼                                   ▼
EU enterprise customers ──────► Defense customers
     │                                   │
     ▼                                   ▼
Regulatory data accumulates      Force protection data
     │                                   │
     └──────────► PLATFORM ◄─────────────┘
                     │
                     ▼
              Proprietary data moat deepens
              Both markets get better
              Regulatory lock-in compounds
              Program of Record status grows
```

---

## The Action

This field note triggered:
1. `DISCOVERY_QUALIFICATION_GATE.md` — sales qualification gate (6 PMFs, 24 questions, scoring)
2. `docs/20-MOAT-FORTRESS.md` — updated 20-moat fortress with Layer 0 structural moats
3. **Strategic decision: dual-market product platform** — civilian + defense from same core
4. **Partnership strategy: SAP + NATO** — complement, don't compete
5. `investor-outreach/INVESTOR_MEMO.md` — updated to v5.1 with dual-market positioning

Rule Zero complete. We stopped. We looked around. Here's what we found:
- Our primary TAM (CSRD mid-market) was gutted by 90%
- Our biggest competitor (SAP) is bundling compliance for free — so partner with them
- Our biggest opportunity (defense dual-use) was invisible to us — enter via NATO ecosystem
- Our strongest asset (sovereign EU platform) serves both markets
- Our location (Espoo, Finland) is the ideal launchpad for both
- The moats that survive AI commoditization: proprietary data, outcome depth, regulatory lock-in, Program of Record

Now we execute. Partner with SAP. Partner with NATO. Own the sovereign EU depth layer.

---

## Related Documents

| Document | What it contains |
|----------|-----------------|
| `Firehorse/Omnichannel/Customers/DISCOVERY_QUALIFICATION_GATE.md` | Sales qualification gate — 6 PMFs, 24 questions, scoring, cancelable PO hack |
| `docs/20-MOAT-FORTRESS.md` | 20-Moat Fortress v2.0 — Layer 0 structural moats + original 20 |
| `FIREHORSE_SALES_WORKFLOW.md` | Current end-to-end sales process |
| `Firehorse/Omnichannel/Customers/CONSTRUCTION_CXO_CALL_SCRIPT.md` | Call script (needs gate integration) |
| `FOUNDER_CREDIBILITY_PLAYBOOK.md` | Industry Captain structure, competitive positioning |
| `investor-outreach/V3-DWS-IQ6-InvestorPD_2026.md` | Original 20-moat fortress (Slide 4, Dec 2025) |
