# Open Data Sources — DWS IQ 6 Platform

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Added BYOP (Bring Your Own Processes) section, strengthened zero-friction data sovereignty principle, added ProcessConfig interface pattern
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/research-open-data-sources-BMEJ0 | Date: 23.03.2026 | Changes: Initial research — mapped open data sources to DWS products and agents, Bloomberg alternative analysis, customer data input strategy

Session Links & References:
  - Claude Code (claude/research-open-data-sources-BMEJ0): https://github.com/blogtheristo/dws6/commits/claude/research-open-data-sources-BMEJ0

Document Status:
  - Created: 23.03.2026
  - Last Modified: 23.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.1
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
| **Audit trail** | DWS Aiwen logging | Customer's own SIEM (Splunk, Sentinel, QRadar) |

**How it works:**
1. DWS ships with sensible defaults — every workflow works out of the box
2. Customer configures overrides via `ProcessConfig` — any step, any webhook
3. DWS agents call the customer's endpoint at the right point in the workflow
4. If customer endpoint is down → fall back to DWS default (with warning)
5. Full audit trail regardless of who handles each step

**BYOP + BYOD together:** Customer brings their SAP data (BYOD) AND their SAP approval workflow (BYOP). DWS agents orchestrate both without forcing the customer to change how they work.

---

## 9. Key Open Data APIs — Quick Reference

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

## 10. Sources

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
