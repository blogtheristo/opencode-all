# Open Data Sources — DWS IQ 6 Platform

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
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

**Version:** 1.0
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

**Customer choice principle:** DWS ships with Open tier built-in. Customers bring their own Premium or Customer data via connectors.

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
| **Copernicus Open Access** | scihub.copernicus.eu | REST | Open | argus |
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

**DWS approach:** We don't replace Bloomberg. We provide:
1. **Open data default** — good enough for 80% of compliance/reporting use cases
2. **Bloomberg connector** — customer plugs in their Bloomberg B-PIPE or Refinitiv feed
3. **Data normalization** — all sources feed into the same agent scoring engine

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

Every agent should support pluggable data sources:

```typescript
interface DataSourceConfig {
  tier: 'open' | 'premium' | 'customer';
  source: string;           // e.g. 'openbb', 'bloomberg', 'eurostat'
  apiKey?: string;           // for premium sources
  endpoint?: string;         // custom endpoint override
  cacheTtl: number;          // seconds (default: 86400 for open, 300 for premium)
  fallback?: DataSourceConfig; // fallback if primary fails
}

// Example: Carbon price data source chain
const carbonPriceConfig: DataSourceConfig = {
  tier: 'open',
  source: 'oilpriceapi',
  cacheTtl: 3600,           // 1 hour cache
  fallback: {
    tier: 'open',
    source: 'sandbag',
    cacheTtl: 86400,         // 24 hour cache (historical only)
  }
};
```

---

## 8. Key Open Data APIs — Quick Reference

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

---

## 9. Sources

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
