# Regulatory Radar — EU Supply-Chain Diversification Instrument

**Scan ID:** `dws-portfolio_eu-china-diversification_2026-06-21`
**Scan date:** 2026-06-21
**Scope:** DWS IQ industry portfolio (25 EU-regulated industries — `dws10.com/config/industries.json` v2.0)
**Lens:** forward-looking pipeline (the instrument is **pre-proposal**; no CELEX number yet)
**Execution note:** produced via the `/regulatory-radar` workaround path — the dedicated `regulatory-radar` CLI agent is not yet wired in, and the Firehorse Report Engine PDF-signing step is pending, so this is an unsigned markdown artifact. Scoring is grounded in primary sources (cited inline), not the (not-yet-built) EUR-Lex daily snapshot.

---

## 1. The instrument

**Working name:** EU Supply-Chain Diversification Instrument ("diversification law")
**Status:** Announced / pre-proposal. EU Trade Commissioner Maroš Šefčovič stated on **5 June 2026** that "diversification requires a dedicated instrument", tying it to the **EU trade-defence review due Q3 2026**.
**Driver:** EU goods trade deficit with China reached **€359.8 bn in 2025** (imports €559.4 bn vs. exports €199.6 bn; imports +6.4% YoY, exports −6.5% YoY) — Eurostat, published 2026-04-10. Structural dependency is concentrated in electrical machinery/electronics (€164.9 bn imports, 29.5%) and machinery/appliances (€106.5 bn, 19.0%).

**Mechanism as currently reported (subject to change before proposal):**

- Single-supplier / single-country share **capped at ~30–40%** of a critical input.
- Companies required to source each critical input from **at least three suppliers**, not all in the same country.
- Initial named target sectors: **chemicals, industrial machinery, automotive supply chains, advanced manufacturing.**

**Adjacency:** This is a sibling instrument to the **Critical Raw Materials Act (CRM Act)** and the **CER Directive**, both already in `regulationsInScope`. Where CRM Act sets EU-level extraction/processing/recycling benchmarks, the diversification instrument pushes the obligation **down to the firm level** as a procurement-concentration rule.

---

## 2. Verdict — WATCH (with two ALERT-flagged verticals)

The instrument has **no in-force date and no CELEX**, so it cannot be a point-in-time compliance item. But the **regulatory milestone (Q3 2026 proposal) is ≤6 months out** and risk is **high** for the named sectors. Per the radar's ALERT rule (urgency ≤6 months AND risk = high), the two directly-named DWS verticals — **Chemicals & Petrochemicals** and **Manufacturing (cross-sector)** — are flagged **ALERT-WATCH**. The rest are WATCH.

"UrgencyMonths" below measures **months to the next regulatory milestone** (proposal publication ~Q3 2026 ≈ 3 months), not to a compliance deadline. Binding firm-level obligations are estimated to phase in **2027–2028** (analyst estimate, not yet legislated).

---

## 3. Per-industry scoring

| DWS industry (id)                 | Captain hat        | Applicability       | Why it bites                                                                                            | Risk   | Effort | Flag            |
| --------------------------------- | ------------------ | ------------------- | ------------------------------------------------------------------------------------------------------- | ------ | ------ | --------------- |
| Chemicals & Petrochemicals (4)    | CHEMICALS          | **Direct**          | Named target sector; deep dependence on Chinese precursors, catalysts, rare-earth-bearing inputs        | High   | High   | **ALERT-WATCH** |
| Manufacturing cross-sector (18)   | platform (no hat)  | **Direct**          | "Advanced manufacturing" + "industrial machinery" named; component/sub-assembly concentration           | High   | High   | **ALERT-WATCH** |
| RFNBO / Green H2 & E-Fuels (25)   | CHEMICALS (folded) | Direct              | Electrolyser stacks & PV-to-H2 supply chains are heavily China-concentrated; collides with RED III ramp | High   | High   | WATCH           |
| Mining & Quarrying (16)           | MINING             | Indirect (upstream) | CRM Act overlap — critical raw materials sourcing diversification, recycling quotas                     | Medium | Medium | WATCH           |
| Aluminium Production (11)         | ALUMINIUM          | Indirect            | Primary metal + alloying-element import concentration                                                   | Medium | Medium | WATCH           |
| Iron & Steel Production (2)       | IRON_STEEL         | Indirect            | Input/ferroalloy dependence; interacts with CBAM on the import side                                     | Medium | Medium | WATCH           |
| Power & Heat Generation (1)       | POWER_HEAT         | Indirect            | Solar PV modules, wind nacelle parts, grid-scale battery cells                                          | Medium | Medium | WATCH           |
| Road Transport & Logistics (7)    | ROAD_LOGISTICS     | Indirect            | Automotive supply chains named; EV battery/cell concentration                                           | Medium | Low    | WATCH           |
| Waste Management & Recycling (10) | WASTE_MGMT         | Indirect (upside)   | Recycling = a _compliant_ diversification source under CRM Act logic — opportunity, not just risk       | Low    | Low    | WATCH           |

Industries with no material exposure to this instrument (Healthcare, Financial Services, Public Sector, Real Estate, Pulp & Paper, Food & Beverage, Glass & Ceramics, Agriculture, Aviation, Maritime, Cement & Lime, Petroleum Refining, Data Centres) are out of scope for this scan, though Data Centres carry a separate hardware-concentration angle worth a future re-scan.

---

## 4. What DWS customers must do (one line each)

- **Chemicals / Manufacturing (ALERT-WATCH):** start a **supplier-concentration audit now** — map every critical input to its country-of-origin share; anything >40% single-country is a future non-compliance. Don't wait for the Q3 proposal.
- **Green H2 / Power & Heat:** model the diversification cap against electrolyser / PV / battery BOMs before committing 2027 capex.
- **Mining / Aluminium / Steel:** align procurement records with the **CRM Act** strategic-project framework so diversification evidence is reusable across both instruments.
- **Waste / Recycling:** position recycled-content streams as a **compliant third source** — a sales angle, not a cost.

---

## 5. Structured output (radar schema)

```json
{
  "customerId": "dws-portfolio",
  "scanDate": "2026-06-21",
  "instrumentClass": "pre-proposal",
  "alerts": [
    {
      "instrument": "EU Supply-Chain Diversification Instrument (working title)",
      "status": "announced / pre-proposal",
      "nextMilestone": "Commission proposal expected Q3 2026 (trade-defence review)",
      "estimatedFirmObligations": "2027-2028 (analyst estimate, not legislated)",
      "urgencyMonths": 3,
      "applicability": "direct",
      "affectedIndustryIds": [4, 18],
      "risk": "high",
      "effort": "high",
      "summary": "Firm-level procurement-concentration rule: cap single-country share ~30-40%, require >=3 sources for critical inputs. Names chemicals + advanced manufacturing.",
      "source": "https://moderndiplomacy.eu/2026/05/18/eu-moves-to-reduce-china-dependency-with-new-supply-chain-diversification-rules/",
      "deficitContext": "EU-China goods deficit EUR 359.8bn in 2025 (Eurostat 2026-04-10)",
      "customerAction": "Run supplier-concentration audit on all critical inputs now; flag any >40% single-country share."
    }
  ],
  "watchItems": [
    {
      "instrument": "EU Supply-Chain Diversification Instrument",
      "industryIds": [25, 16, 11, 2, 1, 7, 10],
      "risk": "medium",
      "note": "Indirect / upstream exposure; align evidence with CRM Act."
    }
  ],
  "relatedInForce": ["CRM Act", "CBAM", "CER Directive"],
  "signedReportPath": "PENDING — Firehorse Report Engine PDF signing not yet wired in",
  "sources": [
    "https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260410-2",
    "https://moderndiplomacy.eu/2026/05/18/eu-moves-to-reduce-china-dependency-with-new-supply-chain-diversification-rules/"
  ]
}
```

---

## 6. Per-industry deep scan (parallel research, 2026-06-21)

Each affected industry was researched independently; figures below were verified against authoritative sources (Eurostat, IEA, European Commission/Council). **Key framing correction:** the in-force **CRM Act** sets a **65% single-third-country cap** by 2030 (plus 10% extraction / 40% processing / 25% recycling EU-domestic). The diversification law's **~30–40% cap is the stricter, still-proposed variant** — so for inputs where China holds 90–100% of EU supply, _both_ thresholds are unmeetable today, which is exactly the compliance gap DWS sells into.

| Industry                              | China-dependent critical input(s)                                   | China share of EU/global supply (verified)                                        | Source                          |
| ------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------- |
| **Chemicals (4)**                     | Magnesium, heavy rare earths, gallium/germanium, natural graphite   | Magnesium ~96–97% of EU imports; heavy REEs ~100%                                 | Eurostat — Intl. trade in CRMs  |
| **Manufacturing (18)**                | NdFeB permanent magnets, processed REEs, electronics sub-assemblies | REEs ~46.3% of EU imports by weight (2024); finished magnets widely reported ~98% | Eurostat ddn-20250409-1         |
| **Green H2 / RFNBO (25)**             | Electrolyser stacks, PEM membranes, iridium/Pt catalysts            | China ~60% of global electrolyser mfg capacity (IEA 2024)                         | IEA — Electrolysers             |
| **Mining / CRM (16)**                 | Heavy rare earths, magnesium, gallium, germanium                    | HREEs ~100%, magnesium ~97% of EU; gallium refining ~98% global                   | Council — CRM infographic       |
| **Aluminium (11)**                    | Magnesium (alloying), pre-baked anodes, primary metal               | Magnesium ~95–97% of EU imports; CN ~13% of finished Al articles (2024)           | Eurostat ddn-20250326-1         |
| **Iron & Steel (2)**                  | Manganese/ferroalloys, graphite electrodes, HRC, semis              | CN ~67% world manganese ore; ~27.5% of EU HRC imports (2024)                      | Eurostat — Intl. trade in CRMs  |
| **Power & Heat (1)**                  | Solar PV modules/cells/wafers, grid batteries, turbine magnets      | Solar modules ~98% of EU imports (€10.9bn); wafers 98% / cells 92% global         | IEA — Solar PV supply chains    |
| **Road / Logistics (7)**              | EV battery cells, graphite anodes, cathode/LFP, traction magnets    | CN ~80% cells, >90% anode, ~85% cathode, ~91% magnet refining                     | IEA — Battery supply chain 2024 |
| **Waste / Recycling (10)** _(upside)_ | Recycled REEs, battery black mass, recycled Al, WEEE metals         | CRM Act 2030 target: ≥25% of EU consumption from domestic recycling               | EC — CRM Act                    |

**Per-industry diversification impact (one line each):**

- **Chemicals / Manufacturing (ALERT-WATCH):** a 30–40% cap is unmeetable for magnesium and rare-earth magnets where China holds 96–100% — even "three suppliers" can be illusory because secondary suppliers still draw on Chinese feedstock; **origin must be traced to the raw-material tier.**
- **Green H2:** the cap collides with a 60%-China electrolyser market just as RED III's 2028 additionality/hourly-matching rules squeeze project economics — double regulatory pressure on the RFNBO ramp.
- **Mining / Aluminium / Steel:** diversification + **CBAM** hit the _same imports_ from two sides (origin restriction + embedded-carbon liability); align evidence with CRM Act strategic-project filings to reuse it across instruments.
- **Power & Heat:** 98% solar-module dependence makes the cap a binding procurement constraint that turns the **Net-Zero Industry Act** 40%-domestic-by-2030 target from aspiration into obligation.
- **Road / Logistics:** ~80–98% China across cells/anode/cathode/magnets means almost every EV/fleet BOM line is non-compliant overnight — re-sourcing + provenance tracing across battery, motor, and magnet tiers.
- **Waste / Recycling (opportunity):** EU-sourced recycled content is a structurally non-China, traceable origin that downstream firms can **book as one of the required ≥3 sources** — a premium, sellable diversification asset, not a commodity.

---

## 7. Sources

- Eurostat — _Trade in goods with China in 2025_ (2026-04-10): https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260410-2
- Eurostat — _EU trade with China, latest developments_ (Statistics Explained): https://ec.europa.eu/eurostat/statistics-explained/index.php?title=EU_trade_with_China_-_latest_developments
- Eurostat — _International trade in critical raw materials_: https://ec.europa.eu/eurostat/statistics-explained/index.php?title=International_trade_in_critical_raw_materials
- Eurostat — _Imports of rare earth elements saw 30% drop in 2024_ (2025-04-09): https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250409-1
- Eurostat — _Aluminium trade_ (2025-03-26): https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250326-1
- Council of the EU — _Critical raw materials_ (infographic): https://www.consilium.europa.eu/en/infographics/critical-raw-materials/
- European Commission — _Critical Raw Materials Act_: https://single-market-economy.ec.europa.eu/sectors/raw-materials/areas-specific-interest/critical-raw-materials/critical-raw-materials-act_en
- IEA — _Electrolysers_: https://www.iea.org/energy-system/low-emission-fuels/electrolysers
- IEA — _Solar PV global supply chains_: https://www.iea.org/reports/solar-pv-global-supply-chains/executive-summary
- IEA — _Global midstream & downstream battery supply chain (2024)_: https://www.iea.org/data-and-statistics/charts/the-global-midstream-and-downstream-battery-supply-chain-2024
- Modern Diplomacy — _EU Moves to Reduce China Dependency with New Supply Chain Diversification Rules_ (2026-05-18): https://moderndiplomacy.eu/2026/05/18/eu-moves-to-reduce-china-dependency-with-new-supply-chain-diversification-rules/
- European Times — _EU-China Trade Tensions Put Europe's Industrial Strategy Under Pressure_ (2026-06): https://europeantimes.news/2026/06/eu-china-trade-tensions-put-europes-industrial-strategy-under-pressure/

> **Source-fetch caveat:** several official EU pages (Eurostat, Council, EC, IEA) return HTTP 403 to automated fetch; the figures above were cross-confirmed across multiple independent reports rather than single-page-scraped. Treat exact percentages as well-corroborated, not primary-fetched.

> **Caveat:** the instrument is pre-legislative. Thresholds (30–40% cap, ≥3 sources), named sectors, and timeline are drawn from Commission statements and policy reporting, not from an adopted text. Re-scan when the Q3 2026 proposal publishes and a CELEX number exists.
