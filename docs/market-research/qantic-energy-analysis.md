# Qantic GmbH — Competitive Energy Analysis

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Added Section 11 deal analysis (product vs API), corrected pipeline projection to verified client base (~10), fixed workshop COGS (Helsinki-Berlin travel), added 3-year revenue projection, non-compete clause rationale
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: NDA sent to Qantic GmbH — partnership status upgraded from TODO to IN PROGRESS, added NDA tracking section, updated action items
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 20.03.2026 | Changes: Initial competitive analysis — Qantic GmbH energy simulation company, Q-System product, partnership and CSRD gap analysis

Session Links & References:
  - Claude Code (claude/qantic-energy-analysis-Yjg00): https://github.com/blogtheristo/dws6/commits/claude/qantic-energy-analysis-Yjg00

Document Status:
  - Created: 20.03.2026
  - Last Modified: 21.03.2026
  - Language: EN/FI (bilingual)
  - Languages Available: English, Suomi
  - Publication Status: ACTIVE

***

**Document ID:** DWS-MR-QANTIC-001
**Classification:** Market Research — Competitive Intelligence
**DWS Products Affected:** DWS IQ Platform, Firehorse V2 Reports, LWM V1
**Partnership Status:** NDA SENT (21.03.2026)

---

## 1. Company Overview / Yritysprofiili

| Field | Value |
|-------|-------|
| **Company** | Qantic GmbH |
| **Founded** | 2018 |
| **HQ** | Berlin, Germany |
| **Registration** | Amtsgericht Charlottenburg HRB 202069 B |
| **Managing Director** | Thomas A. Kalitzky |
| **Registered Capital** | €25,000 |
| **Team Size** | 2–10 employees |
| **Funding** | Bootstrapped |
| **Website** | qantic.com |
| **Product** | Q-System (SaaS + on-premises) |
| **Industry** | Renewable Energy Services / Energy IT |

**Mission (DE→FI):** Kehittää ilmastoystävällisen ja edullisen sähköntuotannon ratkaisuja koneoppimisen avulla. Tavoitteena tukea asiakkaita energiainfrastruktuurin tehokkaassa suunnittelussa ja päästöjen vähentämisessä.

**Core Expertise:** Energy technology, energy economics, machine learning, software development — united since 2013 under the Qantic brand.

---

## 2. Product: Q-System

### 2.1 Capabilities

| Capability | Description |
|-----------|-------------|
| **Energy System Modeling** | Simulate wind, solar PV, hydro, CHP, heat pumps, conventional generators, thermal storage, battery storage |
| **Topology** | On-grid, off-grid, front-of-meter, behind-the-meter |
| **Microgrid Design** | Least-cost system design from multitude of alternatives, optimal component scaling |
| **Digital Twin** | Create digital twins of existing/planned energy systems |
| **Dispatch Optimization** | Dynamic programming for optimal scheduling considering electricity prices, market conditions, battery SoC, renewable output |
| **Revenue Stacking** | Day-ahead, intraday, FCR, aFRR, mFRR markets + BTM use cases (peak-shaving, grid-tariff-arbitrage) |
| **Battery Simulation** | Multiple configurations, duration analysis, co-located renewable sizing |
| **Sensitivity & Risk** | Multi-scenario analysis in single simulation run |
| **Curtailment Handling** | Renewable curtailment flow to battery with loss/cost modeling |
| **AI/ML Foundation** | Deep neural network agent for self-learning system design and operation optimization |

### 2.2 Deployment Model

| Model | Details |
|-------|---------|
| **SaaS** | Web-based Q-System platform (q-system.qantic.com) |
| **On-premises** | Available for enterprise clients |
| **Free Trial** | Available (contact support@qantic.com) |
| **Pricing** | Not publicly disclosed — likely project-based + SaaS subscription |

---

## 3. Reference Projects / Referenssiprojektit

### 3.1 Public Sector / Government

| Project | Client | Key Details |
|---------|--------|-------------|
| **Sähkömarkkinoiden reaaliaikainen seuranta NRW** | LANUV NRW (Nordrhein-Westfalen) | First real-time energy transition monitoring at German state level. Current energy production data, low-power generation, renewable supply, emissions, consumption |
| **Päästöaluekertoimien laskentalogiikka (ECO-vyöhyke)** | dena (Deutsche Energie-Agentur) | Regional emission factor calculation logic, energy management incentive models, grid congestion analysis, redispatch measures |
| **Energiatietotutkimusten neuvonta** | EU member state regulator (confidential) | Data collection design for energy markets — data structures, collection methods, content requirements |
| **Tietojen avoimuuden analyysi** | German TSO (siirtoverkonhaltija) | Analysis of European TSO publications on data transparency |

### 3.2 Private Sector / Enterprise

| Project | Client | Key Details |
|---------|--------|-------------|
| **Mikrogridisuunnittelutyökalun räätälöinti** | MAN Energy Solutions SE | Q-System extension for gas engine dynamic behavior and battery storage interaction in complex microgrid structures |
| **Digitaalinen kaksois naapuruusratkaisusta** | Naturstrom AG | Digital twin of neighborhood energy system (central heat pump, solar PV, thermal/electric storage), LSTM geothermal modeling |
| **Omaisuuserien arvonmääritys ja tuloennusteet** | Various clients | Microgrid design options, BTM battery systems, grid-scale storage (standalone + hybrid), economic valuation and revenue forecasting |
| **Redox-virtausmuistojen mallinnus** | Energox GmbH | Dynamic operational behavior mapping of redox flow batteries, technology-specific efficiency modeling |
| **Monimarkkinoiden optimointi akkujen varastoinnille** | International project developer | Multi-market battery storage optimization, portfolio performance calibration, project development assessment |
| **Vahvistusoppiminen energianhallintaan** | International plant manufacturer | Deep reinforcement learning for real-time control logic, simulation environment for agent training, realistic boundary conditions |

---

## 4. Strategic Analysis / Strateginen analyysi

### 4.1 Three Key Observations (User Input)

**Havainto 1: Asiakaskunta on CSRD-velvollista**

Qanticin asiakkaat ovat viranomaisia ja suuria yrityksiä:
- dena (Deutsche Energie-Agentur) — federal energy agency
- MAN Energy Solutions SE — €4B+ revenue, CSRD scope
- German TSO — transmission system operator, CSRD scope
- EU member state regulator — direct regulatory connection
- Naturstrom AG — energy supplier, CSRD reporting obligation 2025-2026
- LANUV NRW — state environmental agency

**Johtopäätös:** Nämä organisaatiot ovat CSRD-raportointivelvollisia 2025-2026. CSRD-tarve on todellinen heidän asiakaskunnassaan, mutta Qantic ei tarjoa raportointipalvelua.

**Havainto 2: Simulointi-vahva, raportointi-aukko**

Qanticin referensseissä EI OLE yhtään:
- CSRD-raportointiprojektia
- EU Taxonomy -luokittelua
- ESRS-datapisteiden keruuta
- Scope 1/2/3 -laskentaa (vain emission factors infrastruktuuritasolla)
- Auditointiraportteja tai compliance-raportteja

**Johtopäätös:** Qantic on 100% simulointi- ja mallinnuspuolella. Raportointi on aukko, jonka DWS IQ täyttää.

**Havainto 3: Tekninen emission factor -osaaminen, ei strukturoitua raportointia**

"Reaaliaikainen seuranta valtion tasolla" + "päästöaluekertoimien laskentalogiikka" (ECO-vyöhyke) kertoo:
- Heillä ON emission factor -laskentaosaaminen
- Heillä ON reaaliaikainen datankäsittelykyky
- Heillä EI OLE CSRD-raportointirakennetta

**Johtopäätös:** Qanticilla on data, mutta ei raportointikehystä. DWS IQ:lla on raportointikehys (Firehorse V2 + ESRS registry) mutta ei reaaliaikaista energiamallinnusta.

### 4.2 Competitor Classification

| Category | Classification | Rationale |
|----------|---------------|-----------|
| **For DWS IQ Platform** | Adjacent | Different product (simulation vs compliance), could expand into reporting |
| **For LWM V1** | Indirect | Both use ML for energy optimization, different scope (system design vs climate LLM) |
| **For Firehorse V2** | Not competitor | Different domain entirely — Qantic does energy simulation, not construction/audit |

---

## 5. Competitor Matrix: Energy Modeling Tools

| Feature | Q-System (Qantic) | HOMER Energy (UL Solutions) | ODYSSEY (SEED Energy) | DWS IQ Platform |
|---------|-------------------|---------------------------|---------------------|-----------------|
| **Focus** | Energy system optimization & trading | Microgrid & hybrid power optimization | Digital twin simulation & feasibility | EU compliance, emissions reporting, agent swarm |
| **Technologies** | Wind, solar, hydro, CHP, heat pumps, batteries | Hybrid microgrids, DG systems | PV, batteries, fuel cells, electrolyzers, heat pumps | Emission factors, CSRD, ETS, CBAM, EU Taxonomy |
| **AI/ML** | Deep RL, neural networks | None (analytical optimization) | AI-based sizing | 20+ AI agents, LLM-powered |
| **Digital Twin** | Yes | No | Yes | No (data model, not physical twin) |
| **Revenue Stacking** | Extensive (DA, ID, FCR, aFRR, mFRR) | Limited | Economic indicators | N/A |
| **CSRD Reporting** | No | No | No | Yes (82 ESRS disclosures) |
| **EU Taxonomy** | No | No | No | Yes |
| **Emission Factors** | Regional ECO-zone (dena project) | No | Environmental impact calc | ETS benchmarks (Reg. 2021/447), CBAM defaults |
| **Pricing** | Not public (SaaS + on-premises) | $187.50–$665/month | Not public | €4,999 (platform license) |
| **Deployment** | SaaS + on-premises | Desktop + SaaS | SaaS | Cloud (EU-hosted) |
| **EU Data Sovereignty** | Berlin-based (likely EU-hosted) | US-based (UL Solutions) | France-based | Finland/Germany (GDPR, no CLOUD Act) |
| **Team Size** | 2–10 | Large (UL Solutions parent) | Small | 2–10 |
| **Open Source** | No | No | No | Partial (MCP, agents) |

---

## 6. SWOT Analysis: Qantic vs DWS

### 6.1 Qantic Strengths (suhteessa DWS:ään)

1. **Deep energy simulation expertise** — 10+ years (since 2013), technically superior in physical modeling
2. **Government references** — dena, LANUV NRW, EU regulators build trust
3. **Enterprise clients** — MAN Energy Solutions, Naturstrom AG, German TSOs
4. **Berlin ecosystem** — access to German energy market talent and funding
5. **ML-native architecture** — deep RL for energy management, LSTM for geothermal
6. **Revenue stacking capability** — unique multi-market optimization (FCR, aFRR, mFRR)

### 6.2 Qantic Weaknesses (suhteessa DWS:ään)

1. **No CSRD/ESRS capability** — zero compliance reporting references
2. **No EU Taxonomy classification** — missing sustainability taxonomy alignment
3. **No audit trail / forensic reporting** — no Firehorse-equivalent
4. **Small team** — 2-10 employees, bootstrapped, €25k registered capital
5. **No edge AI deployment** — all cloud/on-premises, no IoT/Jetson fleet
6. **No multi-industry coverage** — energy-only, not construction/manufacturing/logistics
7. **No structured product catalog** — no public pricing or product tiers
8. **German-language dominant** — limited Nordic/Finnish market presence

### 6.3 DWS Opportunities (Qantic-suhde)

| Opportunity | Type | Priority | Estimated Impact |
|-------------|------|----------|-----------------|
| **Partnership: Qantic simulation + DWS compliance** | Strategic Alliance | HIGH | Qantic's energy clients need CSRD → DWS sells compliance layer on top of Q-System data |
| **CSRD add-on for Qantic clients** | Market Penetration | HIGH | dena, MAN, Naturstrom all need CSRD 2025-2026 → direct pipeline |
| **Emission factor data bridge** | Technical Integration | MEDIUM | Qantic's ECO-zone emission factors → DWS IQ CSRD data input |
| **LWM energy model enrichment** | Product Enhancement | MEDIUM | Q-System simulation outputs → LWM training data for energy sector |
| **German market entry via Qantic network** | Channel Partnership | MEDIUM | Access German Energiewende clients through Qantic referrals |

### 6.4 Threats

1. **Qantic could add CSRD reporting** — low probability (small team, different focus), but adjacent expansion risk
2. **HOMER/UL Solutions adds compliance** — higher probability (large parent company), would compete with DWS IQ
3. **Big 4 consultancies integrate simulation** — McKinsey/Deloitte acquiring simulation capabilities for ESG advisory

---

## 7. Partnership Potential Assessment / Kumppanuusarviointi

### 7.1 Compatibility Score

| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| **Product Complementarity** | 5 | Simulation (Qantic) + Compliance (DWS) — zero overlap |
| **Client Overlap** | 4 | Same industries (energy, utilities), different buyer personas |
| **Technical Integration** | 4 | Q-System API → DWS IQ emission data pipeline feasible |
| **Geographic Fit** | 4 | Berlin (Qantic) + Helsinki (DWS) — EU axis |
| **Cultural Fit** | 4 | Both bootstrapped, engineering-led, EU-focused, small teams |
| **Revenue Model Fit** | 3 | SaaS + consulting (both), but different price points |
| **Overall** | **4.0/5.0** | Strong partnership candidate |

### 7.2 Proposed Partnership Model

```
┌──────────────────────────────────────────────────────────────────┐
│                   QANTIC + DWS INTEGRATION                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  QANTIC (Simulation Layer)         DWS (Compliance Layer)        │
│  ┌───────────────────────┐         ┌───────────────────────┐     │
│  │ Q-System              │         │ DWS IQ Platform       │     │
│  │ - Energy modeling     │  API    │ - CSRD reporting      │     │
│  │ - Emission factors    │ ──────► │ - EU Taxonomy         │     │
│  │ - Digital twin        │         │ - ESRS data points    │     │
│  │ - Revenue stacking    │         │ - Audit trails        │     │
│  └───────────────────────┘         └───────────────────────┘     │
│                                                                  │
│  COMBINED VALUE PROPOSITION:                                     │
│  "Simulate your energy system AND report compliance in one flow" │
│                                                                  │
│  Target: Energy companies with CSRD obligation 2025-2026         │
│  Market: Germany, Nordics, EU-27                                 │
│  Price: Q-System (simulation) + DWS IQ (€4,999 compliance)      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 7.3 NDA & Partnership Progress

| Milestone | Date | Status |
|-----------|------|--------|
| Competitive analysis completed | 20.03.2026 | DONE |
| NDA sent to Qantic GmbH | 21.03.2026 | SENT — awaiting countersignature |
| NDA countersigned | — | PENDING |
| Intro meeting scheduled | — | PENDING (after NDA) |
| Joint technical assessment | — | PENDING |
| Partnership agreement | — | PENDING |

### 7.4 Action Items

| # | Action | Owner | Priority | Status |
|---|--------|-------|----------|--------|
| 1 | ~~Contact Thomas Kalitzky (MD) for intro meeting~~ | Product Strategy | HIGH | DONE — NDA sent 21.03.2026 |
| 2 | Prepare DWS IQ demo focused on CSRD for energy sector | Product | HIGH | TODO — prepare before intro meeting |
| 3 | Map Q-System emission factor output → DWS IQ ESRS input | Engineering | MEDIUM | TODO — after NDA signed |
| 4 | Create joint value proposition one-pager (EN/DE) | Marketing | MEDIUM | TODO — after intro meeting |
| 5 | Identify 3 shared target clients (dena, MAN, Naturstrom) | Sales | HIGH | TODO |
| 6 | Follow up on NDA countersignature (7 business days) | Product Strategy | HIGH | TODO — follow up by 01.04.2026 |

---

## 8. Market Context: German Energy Transition (Energiewende)

| Factor | Relevance |
|--------|-----------|
| **CSRD Timeline** | Large companies report 2025, listed SMEs 2026 — Qantic clients in scope |
| **EU ETS Phase 4** | 2021-2030, emissions cap tightening — drives demand for both simulation and reporting |
| **CBAM** | Transitional phase 2023-2025, definitive 2026 — energy-intensive importers need compliance |
| **Fit for 55** | 55% GHG reduction by 2030 — Germany's Energiewende accelerates both simulation and reporting needs |
| **German Grid Expansion** | €30B+ investment — TSOs need both system modeling (Qantic) and compliance (DWS) |
| **Battery Storage Boom** | Germany adding 10+ GWh annually — Q-System's sweet spot, DWS reports the carbon impact |

---

## 9. Recommendations / Suositukset

### 9.1 Immediate (0-3 months)

1. **Register Qantic as adjacent competitor** in DWS_MARKET_RESEARCH_STANDARD.md
2. **Monitor Q-System for CSRD feature additions** — weekly check on qantic.com changelog
3. **Prepare CSRD-for-energy one-pager** targeting Qantic's client base

### 9.2 Short-term (3-6 months)

4. **Initiate partnership conversation** with Thomas Kalitzky
5. **Build emission factor data bridge proof-of-concept** — Q-System ECO-zone → DWS IQ ESRS
6. **Create German-language DWS IQ materials** for energy sector (DE/FI bilingual)

### 9.3 Medium-term (6-12 months)

7. **Develop joint solution package** — "Energy Simulation + CSRD Compliance"
8. **Target 3 shared clients** — dena, MAN Energy Solutions, Naturstrom AG
9. **Explore technology licensing** — LWM energy models enhanced with Q-System training data

---

## 10. Data Sources / Tietolähteet

| Source | URL | Accessed |
|--------|-----|----------|
| Qantic Home | qantic.com/en/ | 2026-03-20 |
| Qantic Company | qantic.com/en/company/ | 2026-03-20 |
| Qantic Services | qantic.com/en/services/ | 2026-03-20 |
| Q-System Platform | q-system.qantic.com | 2026-03-20 |
| North Data (registration) | northdata.com/Qantic+GmbH | 2026-03-20 |
| Berlin Startup Map | startup-map.berlin/companies/qantic | 2026-03-20 |
| Dealroom | app.dealroom.co/companies/qantic | 2026-03-20 |
| LinkedIn | linkedin.com/company/qantic-gmbh | 2026-03-20 |
| HOMER Energy | homerenergy.com | 2026-03-20 |
| SEED Energy ODYSSEY | seed-energy.fr/en/odyssey.html | 2026-03-20 |
| EU ETS Regulation | EUR-Lex Reg. 2021/447 | Reference |
| CSRD Directive | EUR-Lex Directive 2022/2464 | Reference |

---

---

## 11. Deal Analysis: Product Bundle vs API Integration

### 11.1 Option A — Product Deal (Channel Partner)

Qantic refers energy clients to us, we sell direct.

**Per client revenue (full stack):**

| Product | Price | Why |
|---------|-------|-----|
| Climate Reporting Starter Bundle | €6,500 | DWS IQ + Firehorse Report + Workshop |
| Firehorse Automation | €4,950 | Event-driven CSRD workflows |
| Firehorse Data Services | €899 | API bridge Q-System → DWS IQ |
| Fit for 55 Specialist Consulting | €4,500 | ETS/CBAM/EPBD guidance |
| **Total per client (full stack)** | **€16,849** | |

**Minimum deal:** Firehorse Reports (€1,999) + Data Services (€899) = **€2,898**

**COGS per client (corrected):**

| Cost | Amount | Notes |
|------|--------|-------|
| Cloud hosting + AI compute | ~€2,000/year | |
| Workshop delivery (3 days) | ~2,300 EUR | Helsinki-Berlin flights ~€400 RT, 2 nights hotel ~€400, per diem 3 days ~€500, facilitator time ~€1,000 |
| Integration setup (one-time) | ~€500 | |
| **Total COGS** | **~€4,800** | |

**Gross margin:** Full stack: €16,849 - €4,800 = €12,049 (72%). Minimum deal: €2,898 - €2,500 = €398 (14%).

### 11.2 Option B — API Deal (OEM / Embedded)

Qantic integrates our compliance API into Q-System. Their clients get CSRD reporting inside Q-System UI.

| Model | Pricing | Year 1 (10 clients) | Notes |
|-------|---------|---------------------|-------|
| B1 — Per-seat SaaS | 200-500 EUR/seat/month | €180,000 | 50 seats × €300 × 12 |
| B2 — Per-report transaction | 500-1,500 EUR/report | €48,000 | 10 clients × 6 reports × €800 |
| B3 — Platform license (OEM) | 25,000-50,000 EUR/year + activation | €57,500 | License + 10 × €750 |
| B4 — Revenue share | 30-40% of Qantic's charge | €35,000 | 10 × €10,000 × 35% |

**Recommended:** B1 (per-seat SaaS) — predictable, scalable, fair. Do NOT offer B4 first.

### 11.3 Pipeline Reality Check (CORRECTED)

**Verified client base:** ~10 named references on qantic.com (Section 3)
- Public sector: dena, LANUV NRW, EU regulator, German TSO (4)
- Private sector: MAN, Naturstrom, Energox, int'l project developer, int'l manufacturer (5+)

**Key validation question for 26.03 call:**
"How many of your current clients have active CSRD reporting obligations this year?"
→ This separates actual pipeline (CSRD-obligated NOW) from theoretical pipeline (might need it someday).

**NOT all 10 are CSRD-obligated:**
- Government agencies (dena, LANUV NRW): NOT subject to CSRD — they are regulators, not reporting entities
- EU regulator: NOT subject to CSRD
- German TSO: YES — likely CSRD scope (large company)
- MAN Energy Solutions: YES — €4B+ revenue, CSRD Wave 1
- Naturstrom AG: YES — energy supplier, likely CSRD Wave 2
- Energox GmbH: MAYBE — depends on size thresholds
- Int'l project developer: UNKNOWN
- Int'l plant manufacturer: UNKNOWN

**Realistic CSRD pipeline: 3-5 clients (not 10)**

### 11.4 Three-Year Revenue Projection (CORRECTED)

**Conservative (verified pipeline of 3-5 CSRD-obligated clients):**

| Year | Product Deals | API Clients | Revenue |
|------|--------------|-------------|---------|
| Year 1 | 3 product deals | 0 | €44,547 |
| Year 2 | 1 product deal | 5 API (B1, est. 15 seats) | €69,849 |
| Year 3 | 0 | 10-15 API | €108,000-162,000 |
| **3-year cumulative** | | | **€222,396-276,396** |

**Optimistic (Qantic's network effect — their clients' partners, TSO ecosystem):**

| Year | Product Deals | API Clients | Revenue |
|------|--------------|-------------|---------|
| Year 1 | 3 product deals | 0 | €44,547 |
| Year 2 | 2 product deals | 8 API | €59,698 + €28,800 = €88,498 |
| Year 3 | 0 | 20-25 API | €216,000-270,000 |
| **3-year cumulative** | | | **€349,045-403,045** |

**Previous projection of 50 API clients / €1.09M was OVERESTIMATED.** Qantic's verified base supports 3-5 CSRD clients directly, with network growth to 20-25 maximum by year 3.

### 11.5 Recommended Approach: Phase 1 → 2 → 3

**Phase 1 (now → month 3): Product deals for first 2-3 clients**
- Revenue while API is being built
- Learn Q-System's actual export formats firsthand
- Get case studies and reference logos

**Phase 2 (month 3-6): Build API integration**
- Use Phase 1 learnings to design the right API surface
- Firehorse Data Services (€899) is already the bridge product
- Extend into REST/MCP endpoint for Q-System

**Phase 3 (month 6+): API deal with B1 pricing (per-seat SaaS)**
- 200-500 EUR/seat/month
- Qantic sells to their full client base
- We maintain the API, they do everything else

### 11.6 Non-Negotiable Contract Terms

| Term | Detail | Rationale |
|------|--------|-----------|
| **3-year non-compete** | Qantic cannot build competing CSRD/ESRS reporting engine | Thomas's "evening work" comment (21.03.2026) — if they can frame it as trivial to build, they will build it without the clause |
| **Minimum annual commitment** | €25,000/year from Qantic | Covers our API hosting + support costs |
| **API SLA** | 99.5% uptime, 2s response, EU-only hosting | Our differentiator vs US-hosted competitors |
| **Data ownership** | Client owns their data, we process under DPA | GDPR requirement |
| **IP protection** | DWS IQ engine, ESRS mappings, emission factor logic remain Lifetime Oy IP | Prevents reverse-engineering via API inspection |

---

**Document Owner:** Product Strategy
**Contact:** product@lifetime.fi

© 2026 Lifetime Oy · DWS Market Research · Confidential
