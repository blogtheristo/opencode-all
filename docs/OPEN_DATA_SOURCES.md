# Open Data Sources — DWS IQ 6 Platform

***
# VERSION AND AGENT HISTORY

Version: 1.4

Sessions & Modifications:
  - Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Revised licensing to Apache 2.0 (from BSL) based on Redis/HashiCorp cautionary tales, added deepset/Haystack as closest DWS analog, cautionary tales section, implementation sequence, EU sovereign AI tailwinds
  - Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Updated framework stars with 2026 download data (LangGraph 34.5M/mo production leader), added enterprise vendor platforms (Salesforce $900M, Microsoft 400K agents), SAP Joule specifics (2,400 skills), market sizing ($7.84B→$52.62B), Procore Agent Builder, PermitFlow, Augury
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Added BYOA (Bring Your Own Agents) with industry agent landscape mapping, open-source strategy recommendation (BSL license), npm package structure, revenue model, competitive gap analysis
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Added BYOP (Bring Your Own Processes) section, strengthened zero-friction data sovereignty principle, added ProcessConfig interface pattern
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Initial research — mapped open data sources to DWS products and agents, Bloomberg alternative analysis, customer data input strategy

Session Links & References:
  - Claude Code (claude/research-open-data-sources-BMEJ0): https://github.com/blogtheristo/dws6/commits/claude/research-open-data-sources-BMEJ0
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/OPEN_DATA_SOURCES.md

Document Status:
  - Created: 23.03.2026
  - Last Modified: 23.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.4
**Effective Date:** 2026-03-23
**Last Updated:** 2026-03-23
**Status:** Active

---

## 1. Purpose

This document maps open data sources to DWS IQ 6 products and agents. It defines a **three-tier data strategy** where customers choose their data inputs:

| Tier | Data Source | Cost | Example |
|------|-----------|------|---------|
| **Open** | Public APIs, EU portals, open-source platforms | Free | Eurostat, EEA, Open-Meteo, OpenBB |
| **Premium** | Licensed commercial feeds | $$$ | Bloomberg, Refinitiv, MSCI ESG |
| **Customer** | Customer's own ERP/ESG/internal data | N/A | SAP, Dynamics 365, Worldfavor |

**Customer choice principle:** DWS ships with Open tier built-in. Customers connect their own data sources — Premium feeds, internal ERP, proprietary databases — without friction, without gatekeeping, without asking permission. Every agent accepts any data source that implements the `DataSourceConfig` interface. Plug in, score, done.

**Zero-friction data sovereignty:** The customer's data stays in the customer's infrastructure. DWS agents query it — they never copy, cache, or exfiltrate it beyond the configured TTL. The customer owns their data pipeline end-to-end.

---

## 2. Current State — What We Already Have

DWS IQ 6 currently integrates these validated data sources (in `src/compliance/`):

| Source | File | Data |
|--------|------|------|
| EU ETS Benchmarks (Reg. 2021/447) | `emission-factors.ts` | 20 product emission factors |
| CBAM Defaults (Reg. 2023/1773) | `emission-factors.ts` | 8 product factors |
| IPCC 2006 | `emission-factors.ts` | Combustion factors |
| EEA GHG Inventory | `eu-benchmarks.ts` | 20+ sector averages |
| Eurostat NACE | `eu-benchmarks.ts` | Industry classification |
| EFRAG ESRS 2023 | `esrs-registry.ts` | 82 disclosures |
| Eurostat JSON API | `public-data-fetcher.ts` | Air emissions by NACE |
| EEA GHG Inventory API | `public-data-fetcher.ts` | Sector emissions |
| EU ETS EUTL Registry | `public-data-fetcher.ts` | Verified emissions per installation |

**Gap:** Static/cached data, no real-time carbon prices, no financial data, no weather, no EPD data, no trade statistics.

---

## 3. Open Data Sources — By Category

### 3.1 EU Regulatory & Compliance

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **EEA EU ETS Data Viewer** | eea.europa.eu/en/datahub | CSV/SQL download | Open | compliance, emissions-data-analyst |
| **EEA EU ETS Data Download** | eea.europa.eu/data-and-maps/data/european-union-emissions-trading-scheme-17 | Bulk CSV | Open | compliance |
| **Apitalks EU ETS REST API** | api.store (EU ETS from EUTL) | REST JSON | Free | compliance, emissions-data-analyst |
| **EUETS.INFO** | euets.info | Web (scraping) | Open | compliance-researcher |
| **ICAP Carbon Action** | icapcarbonaction.com | Web | Open | compliance-researcher |
| **EUR-Lex** | eur-lex.europa.eu | SPARQL, REST | Open | compliance-researcher |
| **data.europa.eu** | data.europa.eu | REST, SPARQL, CKAN | Open | all agents |

**Integration priority:** Apitalks REST API replaces our static EUTL data in `public-data-fetcher.ts`.

### 3.2 Carbon Pricing & Emissions

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **Oil Price API — EU Carbon Price** | oilpriceapi.com/live/eu-carbon-price | REST JSON | Free tier | compliance, material-oracle |
| **Sandbag Carbon Price Viewer** | sandbag.be/carbon-price-viewer | Web | Open (historical) | compliance-researcher |
| **ECB SDW — Carbon-related** | data.ecb.europa.eu | SDMX REST | Open | compliance |
| **IPCC Emission Factor Database** | efdb.apps.ghgprotocol.org | Download | Open | material-oracle |
| **Climate TRACE** | climatetrace.org/data | REST API (beta), bulk CSV | CC 4.0 (free) | compliance, argus |
| **Climatiq** | climatiq.io | REST JSON | Free tier + paid | material-oracle, emissions-data-analyst |
| **Ember** | ember-energy.org/data | Download | Open | compliance |

**Integration priority:** Oil Price API for real-time EU ETS carbon price → feeds into `ets-calculator.ts` and `cbam-calculator.ts`.

### 3.3 Financial & Market Data (Bloomberg Alternatives)

The Bloomberg Terminal costs ~$24,000/year per seat. Here is what it provides and what open alternatives exist:

| Bloomberg Capability | Open Alternative | URL | API | Cost |
|---------------------|-----------------|-----|-----|------|
| **Market data, screening, charting** | **OpenBB** | github.com/OpenBB-finance/OpenBB | Python SDK, REST | Free (AGPL-3.0) |
| **Market data, screening** | **Fincept Terminal** | github.com/fincept | Python CLI | Free (open-source) |
| **Interest rates, FX, macro** | **ECB Data Portal** | data.ecb.europa.eu | SDMX REST | Free |
| **Economic indicators** | **Eurostat** | ec.europa.eu/eurostat | REST (JSON-stat, SDMX) | Free |
| **Development indicators** | **World Bank Open Data** | api.worldbank.org/v2/ | REST (JSON, XML) | Free |
| **Economic/social stats** | **OECD Data Explorer** | data-explorer.oecd.org | SDMX REST | Free |
| **SEC filings** | **SEC EDGAR** | sec.gov/cgi-bin/browse-edgar | REST, XBRL | Free |
| **Company financials** | **Yahoo Finance** | finance.yahoo.com | Unofficial API | Free |
| **Company financials** | **CapEdge** | capedge.com | Web | Free |
| **Fund analysis** | **Morningstar Direct** | morningstar.com | Paid API | $$$ |
| **Full terminal replacement** | **Refinitiv Workspace (LSEG)** | refinitiv.com | REST | ~$3,600/yr |
| **Research & analytics** | **FactSet** | factset.com | REST | $$$ |

**DWS Strategy:**
- **Ship with:** OpenBB (open-source), ECB, Eurostat, World Bank, OECD
- **Premium connector:** Bloomberg B-PIPE, Refinitiv Eikon API, FactSet
- **Agent mapping:** `viability` agent uses financial data, `sales-outreach` uses company data

### 3.4 Construction & Building Materials

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **openEPD / EC3** (Building Transparency) | buildingtransparency.org/tools/ec3 | REST (openEPD format) | Free, open-source | material-oracle, construction |
| **EPD International (Environdec)** | environdec.com/all-about-epds/api | REST (upstream/downstream) | Free download | material-oracle |
| **ECO Portal** (ECO Platform) | eco-platform.org/epd-data.html | REST (new 2025 portal) | Free general access | material-oracle |
| **EPD North America** | epdna.com | Web | Free access | material-oracle |
| **ICE Database** (Bath Univ.) | circularecology.com/embodied-carbon-footprint-database | Download | Academic/commercial | material-oracle |

**Integration priority:** openEPD/EC3 API is the most critical — gives material-oracle agent access to thousands of EPDs with embodied carbon data per EN 15978.

### 3.5 Weather & Site Safety

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **Open-Meteo** | open-meteo.com | REST JSON (no key needed) | Free (non-commercial), paid commercial | sitesense |
| **OpenWeatherMap** | openweathermap.org/api | REST JSON | Free tier (60 calls/min) | sitesense |
| **Visual Crossing** | visualcrossing.com | REST JSON | Free tier (1000 calls/day) | sitesense |
| **Tomorrow.io** | tomorrow.io/weather-api | REST JSON | Free tier | sitesense |
| **FMI Open Data** (Finland) | en.ilmatieteenlaitos.fi/open-data | REST (WFS/WMS) | CC-BY 4.0 | sitesense |
| **MET Norway** | api.met.no | REST JSON (free) | Norwegian Open Gov License | sitesense |
| **DWD Open Data** (Germany) | dwd.de/EN/ourservices/opendata | Bulk download | Free (German law) | sitesense |
| **Copernicus CDS** | cds.climate.copernicus.eu | Python cdsapi | Free (registration) | construction, sitesense |

**Integration priority:** Open-Meteo (no API key, open-source) as default → customer can upgrade to Visual Crossing for construction-specific safety thresholds.

### 3.6 Company & ESG Data

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **data.europa.eu** | data.europa.eu | REST, SPARQL | Open | compliance |
| **Wikirate** | wikirate.org | REST | Open (CC) | compliance, esg-report-extractor |
| **CDP Open Data** | cdp.net/en | Download (some open) | Registration | compliance |
| **EFRAG ESRS Portal** | efrag.org | Download | Open | compliance |
| **PRB (Finnish company registry)** | avoindata.prh.fi | REST JSON | CC-BY 4.0 | sales-outreach, viability |
| **LEI (Legal Entity Identifiers)** | gleif.org/en/lei-data | REST, bulk download | Open | compliance, sales-outreach |
| **OpenCorporates** | opencorporates.com | REST | Free tier (limited) | sales-outreach |
| **BRIS** (EU Business Registers) | openbris.eu/api/v1 | REST | Free (official EU) | compliance, sales-outreach |

**Integration priority:** PRH (Finnish companies) for Nordic market, GLEIF for global entity identification, Wikirate for open ESG scores.

### 3.7 Trade & Supply Chain

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **UN Comtrade** | comtrade.un.org | REST JSON (Python/R libraries) | Free (premium bulk) | logistics, compliance (CBAM) |
| **Eurostat COMEXT** | ec.europa.eu/eurostat (external trade) | REST (SDMX) | Open | logistics, compliance |
| **EU TARIC** (tariff database) | ec.europa.eu/taxation_customs/dds2/taric | Web service | Open | compliance (CBAM) |
| **WTO Statistics** | stats.wto.org | REST | Open | compliance-researcher |
| **Finnish Customs (Tulli)** | tulli.fi/en/statistics/open-data | REST | CC-BY 4.0 | logistics |

**Integration priority:** UN Comtrade for CBAM import analysis (replaces hardcoded Philippine product data in `src/integrations/trade/`).

### 3.8 Geospatial & Infrastructure

| Source | URL | API | License | DWS Agent |
|--------|-----|-----|---------|-----------|
| **OpenStreetMap** | openstreetmap.org | Overpass API | ODbL | sitesense, logistics |
| **Copernicus Data Space** | dataspace.copernicus.eu | openEO, Sentinel Hub, STAC | Free | argus |
| **INSPIRE Geoportal** (EU) | inspire-geoportal.ec.europa.eu | WMS/WFS | Open | construction |
| **Paikkatietoikkuna** (Finland) | paikkatietoikkuna.fi | WMS/WFS | CC-BY 4.0 | construction, sitesense |

---

## 4. Product-to-Data Mapping

### What each DWS product needs and what the customer can choose:

| DWS Product (SKU) | Built-in Open Data | Premium Option (Customer Brings) |
|--------------------|-------------------|----------------------------------|
| **DWS IQ Platform** (DWS-IQ-006) | All open sources below | Bloomberg B-PIPE, Refinitiv, custom ERP |
| **Firehorse Report** (FH-RPT-001) | Eurostat, EEA, ESRS registry | LSEG ESG, MSCI, Sustainalytics |
| **Firehorse Automation** (FH-AUTO-001) | Open-Meteo, EU ETS API | Visual Crossing, Tomorrow.io premium |
| **Expert Services** | OpenBB, ECB, World Bank | Bloomberg Terminal, FactSet |
| **Climate Reporting Bundle** | All compliance open sources | Worldfavor premium, CDP full access |

### What each agent needs:

| Agent | Open Sources (Default) | Premium Sources (Customer Choice) |
|-------|----------------------|----------------------------------|
| `compliance` | EEA ETS, Eurostat, ESRS, EUR-Lex | MSCI ESG, Sustainalytics, Bloomberg ESG |
| `emissions-data-analyst` | EEA GHG, Apitalks ETS API, IPCC | CDP full dataset, company-specific ERP |
| `material-oracle` | openEPD/EC3, ICE Database, Oil Price API | EPD International premium, proprietary LCA |
| `sitesense` | Open-Meteo, OpenStreetMap | Visual Crossing (safety thresholds), Tomorrow.io |
| `viability` | ECB, Eurostat, World Bank, OECD | Bloomberg, Refinitiv, FactSet |
| `compliance-researcher` | EUR-Lex, ICAP, EUETS.INFO, WTO | LexisNexis, Westlaw |
| `logistics` | UN Comtrade, TARIC, Finnish Customs | TradeLens, FourKites, project44 |
| `sales-outreach` | PRH, OpenCorporates, GLEIF | ZoomInfo, Apollo, LinkedIn Sales Nav |
| `construction` | openEPD, Open-Meteo, INSPIRE | BIM 360, Procore, Aconex |
| `argus` | Copernicus (satellite) | ICEYE (SAR, already integrated) |
| `customer-sat` | (no external open data) | Salesforce, HubSpot, Intercom |
| `schedule-genius` | Open-Meteo (weather delays) | Microsoft Project, Primavera |
| `sovereignty-monitor` | GDPR enforcement database | OneTrust, TrustArc |

---

## 5. Bloomberg Terminal — What Customers Actually Want

When a customer says "I want Bloomberg data," they typically mean:

| Bloomberg Feature | What It Does | DWS Open Alternative | Gap? |
|-------------------|-------------|---------------------|------|
| **Real-time market data** | Live prices, FX, commodities | OpenBB + Yahoo Finance + ECB | Delayed vs real-time |
| **Company financials** | Balance sheets, income, cash flow | SEC EDGAR, OpenBB, CapEdge | Coverage (US-heavy) |
| **ESG scores** | BESG scores for 11,000+ companies | Wikirate, CDP open data | Fewer companies |
| **Carbon pricing** | EU ETS, CER, VER prices | Oil Price API, Sandbag | Adequate for EU ETS |
| **News terminal** | Curated financial news | OpenBB news aggregation | Less curated |
| **Excel integration** | BDH/BDP formulas | OpenBB Python SDK | Different workflow |
| **Fixed income analytics** | Bond pricing, yield curves | ECB yield curve data | Less depth |
| **Commodity data** | Metals, energy, agriculture | World Bank commodity prices | Less granular |
| **Chat/messaging** | Bloomberg IB chat | Not relevant to DWS | N/A |

**Bloomberg's real moat** is NOT the data (most is available elsewhere) — it's:
1. **IB Chat network** — 350K+ users, OTC trades happen here (irreplaceable)
2. **Fixed income pricing** — no open alternative for OTC bond pricing
3. **Convenience** — everything in one interface

For DWS IQ 6's compliance/ESG/industrial use cases, open alternatives fully cover the requirement.

**DWS approach:** We don't replace Bloomberg. We provide:
1. **Open data default** — covers 80% of compliance/reporting use cases at zero cost
2. **Bloomberg connector** — customer plugs in their Bloomberg B-PIPE or Refinitiv feed
3. **Data normalization** — all sources feed into the same agent scoring engine
4. **OpenBB integration** — open-source financial platform with MCP server support (aligns with DWS MCP architecture)

---

## 6. Implementation Roadmap

### Phase 1 — Ship (Q2 2026)
- [ ] Integrate Oil Price API for real-time EU ETS carbon price
- [ ] Integrate Open-Meteo for sitesense agent weather data
- [ ] Integrate openEPD/EC3 API for material-oracle EPD lookups
- [ ] Replace static Eurostat data with live Eurostat JSON API calls
- [ ] Add PRH Finnish company registry for sales-outreach

### Phase 2 — Verify (Q3 2026)
- [ ] Add OpenBB as financial data layer for viability agent
- [ ] Integrate UN Comtrade for CBAM import analysis
- [ ] Add GLEIF entity resolution for compliance agent
- [ ] Build data source configuration UI (customer picks Open vs Premium)

### Phase 3 — Harden (Q4 2026)
- [ ] Bloomberg B-PIPE connector (enterprise customers)
- [ ] Refinitiv Eikon API connector
- [ ] MSCI ESG data connector
- [ ] Data freshness monitoring and cache management
- [ ] SLA tracking per data source

---

## 7. Data Source Configuration Pattern

**Design principle: Connect anything, question nothing.** Every DWS agent accepts any data source that implements the interface below. Customer brings Bloomberg? Works. Customer brings their own proprietary REST API? Works. Customer brings a CSV on a network share? Works (via adapter). No approval workflow, no vendor lock-in, no gatekeeping.

```typescript
interface DataSourceConfig {
  tier: 'open' | 'premium' | 'customer';
  source: string;           // e.g. 'openbb', 'bloomberg', 'eurostat', 'my-internal-api'
  apiKey?: string;           // for premium sources
  endpoint?: string;         // custom endpoint override — customer points to their own API
  cacheTtl: number;          // seconds (default: 86400 for open, 300 for premium)
  fallback?: DataSourceConfig; // fallback if primary fails
  dataResidency?: string;    // e.g. 'eu-north1', 'customer-premise' — data never leaves this zone
}

// Example 1: Carbon price — open data default
const carbonPriceConfig: DataSourceConfig = {
  tier: 'open',
  source: 'oilpriceapi',
  cacheTtl: 3600,
  fallback: {
    tier: 'open',
    source: 'ember',
    cacheTtl: 86400,
  }
};

// Example 2: Customer plugs in their Bloomberg feed — zero questions asked
const customerBloomberg: DataSourceConfig = {
  tier: 'premium',
  source: 'bloomberg-bpipe',
  endpoint: 'https://customer-bloomberg-proxy.internal:8194',
  apiKey: process.env.CUSTOMER_BLOOMBERG_KEY,
  cacheTtl: 300,
  dataResidency: 'customer-premise',
  fallback: carbonPriceConfig,  // falls back to open data if Bloomberg is down
};

// Example 3: Customer's own internal ESG database
const customerEsgDb: DataSourceConfig = {
  tier: 'customer',
  source: 'customer-esg-api',
  endpoint: process.env.CUSTOMER_ESG_ENDPOINT,  // customer provides their own URL
  apiKey: process.env.CUSTOMER_ESG_KEY,
  cacheTtl: 600,
  dataResidency: 'eu-north1',
};
```

**How it works at runtime:**
1. Agent checks if customer has configured a data source for the needed capability
2. If yes → use customer source, respect `dataResidency` constraint
3. If no → fall back to open tier (always available, always free)
4. If open tier fails → log warning, return partial result with confidence penalty

**No vendor lock-in:** Switching from Bloomberg to Refinitiv is a config change, not a code change. Switching from open to premium is the same `DataSourceConfig` interface.

---

## 8. Bring Your Own Processes (BYOP)

Data is only half the story. Enterprise customers also have their own processes — approval workflows, scoring models, compliance checklists, escalation chains. DWS agents must accept these without question.

**Design principle: The customer's process is the correct process.** DWS provides default workflows. Customers override any step with their own logic. No "our way or the highway."

```typescript
interface ProcessConfig {
  name: string;                    // e.g. 'compliance-approval', 'carbon-scoring'
  type: 'default' | 'customer';
  steps: ProcessStep[];
  escalation?: EscalationConfig;   // customer's own escalation chain
}

interface ProcessStep {
  id: string;
  action: string;                  // 'score' | 'approve' | 'notify' | 'custom-webhook'
  handler: string;                 // DWS agent name OR customer webhook URL
  timeout?: number;                // seconds before escalation
  requiredApprovers?: string[];    // customer's own approval list
}

// Example: Customer overrides compliance approval with their own chain
const customerComplianceProcess: ProcessConfig = {
  name: 'compliance-approval',
  type: 'customer',
  steps: [
    { id: 'score', action: 'score', handler: 'compliance-agent' },          // DWS scores
    { id: 'review', action: 'custom-webhook', handler: 'https://customer.internal/api/compliance-review' },  // Customer reviews
    { id: 'approve', action: 'approve', handler: 'https://customer.internal/api/approval-chain', requiredApprovers: ['cso@customer.com', 'cfo@customer.com'] },
    { id: 'notify', action: 'notify', handler: 'https://customer.internal/api/slack-notify' },
  ],
};
```

**What customers bring:**

| Process Type | Default (DWS) | Customer Override |
|-------------|---------------|-------------------|
| **Compliance scoring** | DWS 16-agent deterministic scoring | Customer's own risk model + thresholds |
| **Approval workflows** | Auto-approve below threshold | SAP workflow, ServiceNow, Jira approval chains |
| **Escalation chains** | Email to admin | PagerDuty, OpsGenie, customer's own chain |
| **Reporting cadence** | Quarterly CSRD cycle | Customer's own schedule (monthly, weekly, event-driven) |
| **Data validation** | DWS schema validation | Customer's own business rules + edge case handling |
| **Notification channels** | Email (SES/Resend) | Slack, Teams, customer webhook, SMS |
| **Audit trail** | DWS sovereignty audit logging | Customer's own SIEM (Splunk, Sentinel, QRadar) |

**How it works:**
1. DWS ships with sensible defaults — every workflow works out of the box
2. Customer configures overrides via `ProcessConfig` — any step, any webhook
3. DWS agents call the customer's endpoint at the right point in the workflow
4. If customer endpoint is down → fall back to DWS default (with warning)
5. Full audit trail regardless of who handles each step

**BYOP + BYOD together:** Customer brings their SAP data (BYOD) AND their SAP approval workflow (BYOP). DWS agents orchestrate both without forcing the customer to change how they work.

---

## 9. Bring Your Own Agents (BYOA) — Industry Agent Landscape

**Design principle: The customer's agents are welcome.** DWS ships 35+ built-in agents. Customers can also bring their own agents — industry-specific tools, vendor agents, or open-source frameworks — and plug them into the DWS orchestration layer. Any agent that implements `AgentConfig` joins the registry.

### 9.1 Industry Agents — What Exists vs. What DWS Provides

#### Construction & Real Estate

| Vendor/Product | Type | What It Does | DWS Equivalent |
|---------------|------|-------------|----------------|
| Autodesk Construction IQ | Enterprise | Risk management, document analysis | `construction`, `mars` |
| Procore Agent Builder | Enterprise (open beta 2026) | Custom workflow agents for specs/RFIs | — (different scope) |
| Buildots | Startup ($60M) | 360° camera vs BIM progress (230% task completion on NCC) | `sitesense` (weather/safety focus) |
| Nplan | Startup ($31M, Bechtel partner) | Probabilistic schedule forecasting | `schedule-genius` |
| OpenSpace | Startup ($102M) | 360° site capture (Vinci saved 5,200 work-hours) | `argus` (satellite-level) |
| Alice Technologies | Startup ($7.5M, Bouygues) | Deep RL schedule optimization | `schedule-genius` |
| PermitFlow | Startup ($54M Series B) | AI-driven permitting, 12M+ data points | — (US-focused) |
| CompScience | Startup | CV-based site safety monitoring | `sitesense` |
| IFCOpenShell | Open source (1.8K stars) | BIM/IFC parsing | — (complementary) |
| SpeckleOS | Open source (1.2K stars) | AEC data interoperability | — (complementary) |

**Gap DWS fills:** No open-source construction COMPLIANCE agent exists. Buildots/OpenSpace do vision, not regulatory compliance. Procore/Autodesk are US-centric. DWS `mars` + `sitesense` + `material-oracle` is the only EU-focused integrated stack.

#### Manufacturing & Industrial

| Vendor/Product | Type | What It Does | DWS Equivalent |
|---------------|------|-------------|----------------|
| SAP Joule | Enterprise (350 AI features, 2,400 skills) | Production Planning Agent (GA Q1 2026), 14 new agents Q4 2025 | — (DWS connects to SAP via BYOD) |
| Siemens Industrial Copilot | Enterprise (100+ companies, Schaeffler, thyssenkrupp) | Engineering/Operations/Design Copilots, AI Agent Marketplace planned | `vulcan` (steel compliance focus) |
| Rockwell FactoryTalk LogixAI | Enterprise | Predictive analytics + AI co-pilot | — (different scope) |
| Microsoft Factory Safety Agent | Enterprise (Copilot Studio preview) | Low-code safety Q&A agent | `sitesense` |
| Sight Machine | Startup ($73M) | Quality, throughput, sustainability analytics | `quality-gate` |
| Augury | Startup ($75M Lightrock) | Predictive maintenance via machine health | — (complementary) |
| Landing AI | Startup (Andrew Ng) | Visual inspection for manufacturing defects | — (complementary) |

**Gap DWS fills:** Manufacturing has big vendors (SAP, Siemens, Rockwell) but NO open-source compliance agents. SAP Joule has 2,400 skills but zero EU ETS/CBAM compliance. DWS industry agents (`vulcan`, `helios`, `prometheus`) fill the regulatory gap.

#### Energy & Utilities

| Vendor/Product | Type | What It Does | DWS Equivalent |
|---------------|------|-------------|----------------|
| Persefoni | Startup ($101M) | Carbon accounting (PCAF-aligned) | `compliance` + `emissions-data-analyst` |
| Watershed | Startup ($100M+) | Enterprise carbon accounting | `compliance` (broader EU scope) |
| Plan A | Startup (€27M, EU) | CSRD/ESRS carbon accounting | `athena` (compliance intelligence) |
| Normative | Startup (Swedish) | Carbon accounting | `emissions-data-analyst` |
| Electricity Maps | Open source (3.5K stars) | Real-time electricity carbon intensity | — (potential data source) |
| PyPSA | Open source (1.2K stars) | Power system analysis | — (complementary) |

**Gap DWS fills:** Persefoni/Watershed are single-tenant SaaS focused on carbon accounting only. DWS provides multi-agent scoring across ETS + CBAM + CSRD + EU AI Act + industry-specific regulations — broader and deeper.

#### Financial Services

| Vendor/Product | Type | What It Does | DWS Equivalent |
|---------------|------|-------------|----------------|
| Bloomberg Terminal AI | Enterprise ($31K/yr) | Financial analytics + NLP | `viability` (open data default) |
| S&P Capital IQ | Enterprise ($12K+/yr) | Financial research, ESG scoring | `compliance` (EU-focused) |
| MSCI ESG Manager | Enterprise | ESG ratings for asset managers | `emissions-data-analyst` |
| OpenBB | Open source (35K+ stars) | Financial terminal, MCP support | — (recommended data layer) |
| QuantLib | Open source (5.5K stars) | Quantitative finance library | — (complementary) |

**Gap DWS fills:** Bloomberg/S&P focus on SEC/FINRA (US regulation). EU regulatory compliance (CSRD/CBAM/ETS/EU AI Act) is underserved by all major financial data providers.

#### Logistics & Supply Chain

| Vendor/Product | Type | What It Does | DWS Equivalent |
|---------------|------|-------------|----------------|
| project44 | Startup ($420M+) | Supply chain visibility, real-time tracking | `logistics` + `hermes` |
| FourKites | Startup ($200M+) | Predictive ETAs, visibility | `logistics` |
| Blue Yonder | Enterprise (Panasonic) | Demand planning, fulfillment optimization | — (different scope) |
| OR-Tools | Open source (11K stars, Google) | Route optimization, scheduling | — (complementary, potential integration) |
| OptaPlanner | Open source (3.5K stars, Red Hat) | Constraint solver for planning | — (complementary) |

**Gap DWS fills:** CBAM-specific cross-border trade compliance is brand new (2026 enforcement). Nobody has production agents for carbon-adjusted trade logistics. DWS `neptune` (maritime) + `logistics` + `hermes` cover this.

#### Agriculture & Food

| Vendor/Product | Type | What It Does | DWS Equivalent |
|---------------|------|-------------|----------------|
| — | — | Almost no AI agents for EU Farm-to-Fork compliance | `ceres` |

**Gap DWS fills:** EU Farm-to-Fork strategy compliance has virtually zero AI agent coverage. DWS `ceres` is first-to-market.

### 9.2 Open-Source Agent Frameworks — Competitive Landscape

| Framework | Stars | Monthly Downloads | Backer | Language | Enterprise Product | License |
|-----------|-------|-------------------|--------|----------|-------------------|---------|
| **LangGraph** | ~25K | 34.5M | LangChain/Sequoia | Python | LangSmith | MIT |
| **CrewAI** | ~45K | 5.2M | $18M Series A | Python | CrewAI Enterprise | MIT |
| **AutoGen** | ~55K | 856K | Microsoft (maintenance mode) | Python | → Agent Framework | MIT |
| **LlamaIndex** | ~38K | 1.5M+ | $35M+ | Python | LlamaCloud | MIT |
| **Semantic Kernel** | ~23K | 2.6M | Microsoft | C#/Python/Java | Azure integration | MIT |
| **OpenAI Agents SDK** | ~19K | 10.3M | OpenAI | Python | — | MIT |
| **Google ADK** | ~18K | 3.3M | Google | Python | Vertex AI | Apache 2.0 |
| **Haystack** | ~18K | 100K+ | deepset ($30M+) | Python | deepset Cloud | Apache 2.0 |
| **Mastra** | ~10K | Growing | Gatsby.js team | **TypeScript** | Vercel/CF deploy | Apache 2.0 |

**Key dynamics (2026):**
- **LangGraph** is the production leader — 400+ companies including Cisco, Uber, LinkedIn, JPMorgan. Stars ≠ production use.
- **CrewAI** dominates prototyping — 60% of Fortune 500 have tried it. Common path: CrewAI (prototype) → LangGraph (production).
- **AutoGen** is in maintenance mode — Microsoft merged it into unified Agent Framework (GA Q1 2026).
- **Mastra** is the only TypeScript-first framework — built by Gatsby.js team. Still early.
- **MCP support** is becoming a framework differentiator. PydanticAI, OpenAI SDK, Google ADK have native MCP.

**Critical observation:** ALL frameworks are horizontal/general-purpose. NONE focus on:
1. **EU industrial compliance** — zero coverage
2. **TypeScript-first with MCP native** — Mastra is closest but has no compliance domain knowledge
3. **Industry-specific agents** — general frameworks require months of customization per industry
4. **Validated data sources** — no framework ships with real, citable emission factors

**Market size:** AI agent market $7.84B (2025) → $52.62B by 2030 (46.3% CAGR). GitHub AI agent repos grew 535% between 2024-2025. $700M+ in seed funding to AI agent startups in 2025 alone.

### 9.3 BYOA Interface — How Customers Plug In Their Own Agents

```typescript
// Customer registers their own agent — zero friction
import { BaseAgent, agentRegistry } from '@dws/agents';

class CustomerSapAgent extends BaseAgent {
  getConfig() {
    return {
      name: 'customer-sap-procurement',
      description: 'Customer SAP procurement compliance check',
      capabilities: ['procurement', 'compliance', 'sap'],
      model: 'customer-hosted',  // customer's own LLM
      tools: [],                 // customer defines their own tools
    };
  }

  async execute(context, input) {
    // Customer's own logic — calls their SAP API
    const sapResult = await fetch(process.env.CUSTOMER_SAP_ENDPOINT, { ... });
    return {
      agentName: 'customer-sap-procurement',
      result: sapResult,
      confidence: 0.85,
      reasoning: 'SAP procurement compliance check via customer API',
      recommendations: [],
      metadata: { source: 'customer-sap' },
    };
  }
}

// Register — now discoverable by all DWS orchestrators
agentRegistry.register(new CustomerSapAgent());
```

**What this enables:**
- Customer's SAP agent participates in DWS workflows alongside built-in agents
- Atlas (chief of staff) can delegate to customer agents
- Customer agents can delegate to DWS agents
- Full audit trail regardless of agent source

---

## 10. Open-Source Strategy — Should DWS Open-Source Agents?

**Recommendation: YES — open-source the agent framework. Keep the compliance knowledge proprietary.**

### 10.1 The Playbook That Works

| Company | Open Source | Enterprise Product | Revenue | Lesson |
|---------|-----------|-------------------|---------|--------|
| Databricks | Apache Spark, MLflow | Databricks Platform | $2.4B ARR ($100B+ valuation) | Open standard created the market; platform captured it |
| Elastic | Elasticsearch | Elastic Cloud | $1.26B/yr | License change to SSPL → AWS forked as OpenSearch |
| MongoDB | MongoDB | Atlas (managed) | $2B+ ARR | SSPL survived because DocumentDB compat was imperfect |
| Grafana Labs | Grafana, Loki (AGPL) | Grafana Cloud | $300M+ ARR ($6B valuation) | Grew faster than Elastic by keeping community trust |
| HashiCorp | Terraform (BSL) | HCP | $616M → acquired by IBM $6.4B | BSL triggered OpenTofu fork. Endgame: acquisition |
| Hugging Face | Transformers, Hub | Enterprise Hub | $200M+ ARR | Platform effect: 2.4M+ models, 730K datasets |
| Redis | Redis (was BSD → SSPL → AGPL) | Redis Cloud | $300M+ ARR | SSPL triggered Valkey fork (Linux Foundation + AWS + Google). CEO admitted SSPL failed. Reversed to AGPL |
| LangChain | LangChain, LangGraph (MIT) | LangSmith | ~$30M ARR | Framework = distribution channel, observability = revenue |
| deepset | Haystack (Apache 2.0) | deepset Cloud | Growing | **Closest DWS analog:** EU-based, Airbus/LEGO/European Commission customers |

**Pattern:** Open the framework → charge for running it at scale. License restrictions that block cloud providers consistently trigger forks and destroy community trust.

### 10.2 Licensing Decision — Two Viable Options

| License | For | Against | Precedent |
|---------|-----|---------|-----------|
| **Apache 2.0** (recommended for maximum adoption) | Maximum adoption, EU public procurement requires OSI-approved, no fork risk, deepset/Haystack model | AWS/Azure could theoretically fork (but won't — DWS is too niche for them) | Databricks, LangChain, Haystack |
| **BSL** (recommended for protection) | Source-available + non-compete, EU auditors can inspect, converts to Apache 2.0 after 4 years | Not OSI-approved, signals "we might restrict later", triggered OpenTofu fork for HashiCorp | HashiCorp, MariaDB, Sentry |

**The honest tradeoff:**
- **Apache 2.0** maximizes adoption and EU procurement compatibility. Cloud strip-mining risk is LOW because DWS compliance knowledge (the valuable part) stays proprietary anyway. This is the Grafana/Databricks/Haystack path.
- **BSL** provides explicit legal protection against SaaS competitors. But BSL projects get 30-50% fewer community contributions (source: CHAOSS metrics comparison).

**Recommendation:** Start with **Apache 2.0** for the framework layer. The compliance knowledge, scoring engine, and validated data are the moat — and they stay proprietary regardless of framework license. Nobody forks your emission factors.

### 10.3 What to Open-Source vs. Keep Proprietary

**Open (Apache 2.0) — the distribution channel:**

| Layer | Why Open |
|-------|----------|
| Agent framework (`BaseAgent`, types, event bus) | Standard adoption, community extensions |
| ERP connectors (SAP, IFS, Dynamics adapters) | Network effect — every connector contributed back improves the platform |
| MCP server + agent discovery | Ecosystem interop with Claude/Anthropic, aligns with AAIF |
| CLI tooling (`dws` command) | Developer experience, bottom-up adoption |
| Basic compliance rule parser | Demonstrates capability without giving away the scoring engine |
| Data connectors (BYOD adapters) | Community builds connectors DWS can't staff |
| Industry agent stubs (interfaces + basic logic) | First-mover for industry standards |

**Proprietary (SaaS) — the moat:**

| Layer | Why Proprietary |
|-------|-----------------|
| Multi-agent orchestration with compliance scoring | Core IP — deterministic scoring, delegation, sovereignty assessment |
| Validated regulatory knowledge bases | Research investment — emission factors with EU ETS citations, ESRS registry, CBAM models |
| Lifetime World Model (EU Regulations + Industry Models) | The "memory" layer — deepest domain understanding |
| Enterprise governance (RBAC, audit trails, Article 12 logging, SIEM) | Enterprise upgrade path from free → paid |
| Report engine with signed reports | Regulated industries need auditable, signed compliance documentation |
| Premium data feeds (Bloomberg B-PIPE, Refinitiv connectors) | High-value integrations |
| Pre-built industrial sector workflows | Domain expertise packaged as product, not code |
| Managed cloud infrastructure + SLA | Revenue — hosting + operations |
| Training & certification program | Revenue + ecosystem lock-in |

**Key insight from deepset/Haystack:** They proved this exact model works for EU industrial AI. Apache 2.0 framework → enterprise platform. Customers: Airbus, LEGO, European Commission, German Federal Ministry. DWS is the compliance-specific version of this playbook.

### 10.4 Revenue Model

| Tier | Price | Includes |
|------|-------|---------|
| **Community** | Free (BSL) | All agents, self-hosted, community support, open data |
| **Professional** | €99/user/month | DWS Cloud (managed), premium data feeds, email support |
| **Enterprise** | €499/user/month | Multi-tenant, SSO/SAML, SLA, dedicated support, custom agents |
| **Sovereign** | Custom | EU-only infra, Article 12 logging, on-premise, audit certification |

### 10.5 npm Package Structure

```
@dws/agents (BSL licensed, TypeScript-first)
├── @dws/agent-core           # BaseAgent, types, event bus, MCP
├── @dws/agent-compliance     # EU compliance scoring (ETS, CBAM, CSRD, AI Act)
├── @dws/agent-sitesense      # Construction site safety
├── @dws/agent-material       # Material carbon (openEPD integration)
├── @dws/agent-emissions      # Emissions data analysis
├── @dws/agent-mcp            # MCP server for agent discovery
├── @dws/data-connectors      # BYOD adapters (Eurostat, EEA, Open-Meteo, etc.)
├── @dws/industry-steel       # Vulcan — steel & metals
├── @dws/industry-energy      # Helios — energy & renewables
├── @dws/industry-maritime    # Neptune — maritime & shipping
├── @dws/industry-agriculture # Ceres — agriculture & fertilizers
├── @dws/industry-hydrogen    # Prometheus — hydrogen & energy transition
├── @dws/industry-construction # Mars — construction & buildings
├── @dws/industry-cement      # Gaia — cement & earth materials
└── @dws/industry-battery     # BESS — battery energy storage
```

### 10.6 Cautionary Tales — What NOT to Do

| Company | What Happened | Lesson for DWS |
|---------|--------------|----------------|
| **Elastic → OpenSearch** | Changed Apache 2.0 to SSPL to block AWS. AWS forked as OpenSearch. Community fractured. | Never change license after community forms |
| **Redis → Valkey** | BSD → SSPL (March 2024). Linux Foundation + AWS + Google + Oracle forked as Valkey. CEO admitted SSPL failed. Reversed to AGPL (May 2025) | Aggressive licensing triggers coordinated forks |
| **HashiCorp → OpenTofu** | MPL 2.0 → BSL (2023). Community forked as OpenTofu. IBM acquired HashiCorp for $6.4B (Feb 2025) | BSL triggers forks; endgame may be acquisition |
| **CrewAI scaling walls** | Teams report hitting limits at 6-12 months, requiring rewrites to LangGraph | Framework simplicity attracts; production needs govern retention |

**DWS mitigation:** Start with clear open/proprietary boundaries from day one. Never open everything and restrict later. The compliance knowledge is the moat — it can't be forked because it's not code, it's regulatory expertise.

### 10.7 Implementation Sequence (Ship First)

1. **Phase 1 (now):** Extract `@dws/agent-core` + 2-3 ERP connectors + CLI as separate open-source repo under Apache 2.0
2. **Phase 2 (3 months):** Add MCP server implementations, basic compliance rule parser, documentation, community examples
3. **Phase 3 (6 months):** Evaluate community traction. If meaningful adoption (1K+ stars), invest in community management (0.5 FTE)
4. **Never:** Open-source the scoring engine, validated knowledge bases, or enterprise governance layer

**Year 1 targets:** 5,000+ GitHub stars | 10,000+ npm weekly downloads | 50+ community contributors | 10-20 enterprise customers (paid)

### 10.8 Why This Works for DWS Specifically

1. **TypeScript-first** — every other framework is Python. Mastra is the only TS competitor but has no compliance domain knowledge.
2. **EU compliance focus** — no competitor has open-source EU compliance agents. First mover wins the standard.
3. **Validated data** — agents use real, citable emission factors (not made-up numbers). Builds instant trust.
4. **Industry specialization** — general frameworks (LangChain, CrewAI) can't compete with domain-specific agents.
5. **MCP native** — aligns with Anthropic/Claude ecosystem + AAIF (Linux Foundation Agentic AI Foundation).
6. **BYOD + BYOP + BYOA** — zero-friction adoption. Customer keeps their data, processes, AND existing agents.
7. **EU sovereign AI tailwinds** — EU Apply AI Strategy (Oct 2025) promotes open-source AI. 61% of Western European CIOs plan to increase reliance on local providers.
8. **deepset/Haystack precedent** — EU-based, Apache 2.0, enterprise platform. Customers: Airbus, LEGO, European Commission. Proof the model works in this exact market.

### 10.9 Enterprise Vendor Agent Platforms (Context)

These are the giants. DWS does NOT compete with them — DWS COMPLEMENTS them via BYOA.

| Vendor | Platform | Revenue/Adoption | DWS Integration Point |
|--------|----------|-----------------|----------------------|
| **Salesforce** | Agentforce 360 | 8,000 customers, $900M revenue in 6 months | BYOA — customer's Salesforce agents feed `customer-sat` |
| **Microsoft** | Copilot Studio + Agent Framework | 160K orgs, 400K+ custom agents | BYOA — customer's Copilot agents join DWS workflows |
| **ServiceNow** | AI Agent Orchestrator | #1 Gartner 2025 | BYOP — customer's ServiceNow workflows |
| **SAP** | Joule + Joule Studio | 350 AI features, 2,400 skills | BYOD — SAP data via ERP connector, BYOA via Joule agents |
| **Siemens** | Industrial Copilot | 100+ companies deployed | BYOA — manufacturing data feeds DWS compliance |
| **Oracle** | Fusion AI | Embedded across subscriptions | BYOD — Oracle ERP data feeds |

**Pricing context:** Salesforce $0.10/action (Flex Credits), Microsoft $200/month per 25K credits. DWS open-source tier: free. DWS Professional: €99/user/month. DWS is 10-50x cheaper for compliance-specific use cases.

### 10.10 Industry Gaps — Where DWS Has No Competition

| Gap | Enforcement Date | Competition | DWS Agent |
|-----|-----------------|-------------|-----------|
| CBAM cross-border carbon compliance | 2026 | Zero open-source agents | `compliance` + `neptune` + `logistics` |
| EU AI Act agent registration | August 2026 | Zero open-source tools | `athena` + `sovereignty-monitor` |
| Construction EU taxonomy compliance | 2025+ | No integrated agent | `mars` + `sitesense` + `material-oracle` |
| Maritime IMO EEXI/CII compliance | 2023+ | Minimal AI coverage | `neptune` |
| Farm-to-Fork sustainability | 2025+ | Virtually zero | `ceres` |
| BESS lifecycle compliance | Emerging | Zero | `bess` |
| Multi-industry deterministic scoring | N/A | No open alternative | All 16+ agents with delegation |

**Window of opportunity:** CSRD/CBAM enforcement 2025-2026. The first open-source EU compliance agent framework to reach 5,000+ GitHub stars becomes the de facto standard. After that, enterprise buyers default to the standard.

---

## 11. Key Open Data APIs — Quick Reference

| API | Base URL | Auth | Format | Rate Limit |
|-----|----------|------|--------|------------|
| Eurostat | ec.europa.eu/eurostat/api/dissemination | None | JSON-stat, SDMX | Generous |
| ECB Data Portal | data.ecb.europa.eu/service | None | SDMX, CSV | Generous |
| Open-Meteo | api.open-meteo.com/v1/forecast | None | JSON | 10,000/day (free) |
| Oil Price API | api.oilpriceapi.com/v1/prices | API key (free tier) | JSON | 100/day free |
| openEPD/EC3 | openepd.buildingtransparency.org | API key (free) | JSON | TBD |
| UN Comtrade | comtradeapi.un.org | API key (free) | JSON, CSV | 100/hour free |
| PRH (Finland) | avoindata.prh.fi/opendata-ytj-api | None | JSON | Generous |
| GLEIF | api.gleif.org/api/v1 | None | JSON-API | Generous |
| World Bank | api.worldbank.org/v2 | None | JSON, XML | Generous |
| OECD | sdmx.oecd.org/public/rest | None | SDMX, JSON | Generous |
| OpenBB | Python SDK (local) | None (local) | Python objects | N/A |
| Climate TRACE | api.climatetrace.org | API key (free) | JSON | TBD |
| Climatiq | api.climatiq.io/data/v1 | API key (free tier) | JSON | 100/month free |
| Copernicus CDS | cds.climate.copernicus.eu | Registration | NetCDF, GRIB | Generous |
| BRIS | openbris.eu/api/v1 | None | JSON | Generous |

---

## 12. Sources

- EEA EU ETS Data: https://www.eea.europa.eu/en/datahub
- Apitalks EU ETS API: https://api.store
- Oil Price API: https://www.oilpriceapi.com/live/eu-carbon-price
- EUETS.INFO: https://www.euets.info/
- Sandbag Carbon Price: https://sandbag.be/carbon-price-viewer/
- ICAP: https://icapcarbonaction.com
- OpenBB: https://github.com/OpenBB-finance/OpenBB
- Bloomberg alternatives analysis: https://www.bluegamma.io/post/bloomberg-terminal-alternatives
- openEPD: https://www.open-epd-forum.org/
- EC3 Tool: https://www.buildingtransparency.org/tools/ec3/
- EPD International API: https://www.environdec.com/all-about-epds/api
- ECO Portal: https://www.eco-platform.org/epd-data.html
- Open-Meteo: https://open-meteo.com/
- OpenWeatherMap: https://openweathermap.org/api
- Visual Crossing: https://www.visualcrossing.com/
- Tomorrow.io: https://www.tomorrow.io/weather-api/
- data.europa.eu: https://data.europa.eu/en
- Eurostat API: https://ec.europa.eu/eurostat/web/user-guides/data-browser/api-data-access/api-introduction
- ECB Data Portal API: https://data.ecb.europa.eu/help/api/overview
- World Bank API: https://api.worldbank.org/v2
- UN Comtrade: https://comtrade.un.org/
- UN Comtrade Python: https://github.com/uncomtrade/comtradeapicall
- Sustainable Finance Daily (free ESG sources): https://sustainablefinancedaily.com/sustainable-finance-insights/esg-data-and-analytics/10-free-esg-data-sources-and-scores/
- GLEIF: https://www.gleif.org/en/lei-data
- PRH Open Data: https://avoindata.prh.fi
- Climate TRACE: https://climatetrace.org/data
- Climatiq: https://www.climatiq.io/
- Copernicus Data Space: https://dataspace.copernicus.eu/
- Copernicus CDS: https://cds.climate.copernicus.eu/
- BRIS: https://openbris.eu/api/v1
- MET Norway: https://api.met.no/
- DWD Open Data: https://www.dwd.de/EN/ourservices/opendata/opendata.html
- Ember: https://ember-energy.org/data/
- FRED: https://fred.stlouisfed.org/
- One Click LCA: https://oneclicklca.com/
- 2050 Materials: https://www.2050materials.com/
