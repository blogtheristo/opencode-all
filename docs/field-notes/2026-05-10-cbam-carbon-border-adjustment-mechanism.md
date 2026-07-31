# Field Note: CBAM — Carbon Border Adjustment Mechanism

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/add-cbam-resource-8YWjB | Date: 10.05.2026 | Changes: Initial field note. Triggered by SAP CBAM resource reference. Documents the full CBAM regulatory framework (EU 2023/956 + 2023/1773), maps it to the DWS IQ 6 implementation in cbam-calculator.ts and emission-factors.ts, identifies gaps, and provides competitive context versus SAP Sustainability Control Tower. Source URL returned HTTP 403; note is grounded in EUR-Lex primary sources and existing DWS codebase.
- Version: 1.1 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/add-cbam-resource-8YWjB | Date: 10.05.2026 | Changes: Updated gaps §6 and actions §10 to mark certificate price automation (gap 1) and EORI validation (gap 5) as RESOLVED in PR-1265. Both fixes shipped in same session.

Document Status:

- Created: 10.05.2026
- Last Modified: 10.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Regulatory Reference

Related Documents:

- src/compliance/cbam-calculator.ts
- src/compliance/emission-factors.ts
- src/__tests__/cbam-calculator.test.ts
- src/synthetic-data/cbam-schema.ts
- docs/energy-industry-eu-2026.md
- docs/DWS7_HYDROGEN_SELVITYS.md

***

- **Date:** 10.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** SAP published a CBAM explainer resource (sap.com/resources/cbam-carbon-border-adjustment-mechanism). The URL returned HTTP 403 in this session. This note reconstructs the subject from EUR-Lex primary law and maps it to the DWS IQ 6 implementation. The goal is a single reference document for every agent or engineer who touches CBAM logic.

## Ontology Tags

- **Geography:** European Union > All Member States (import side) > Third Countries (supply side)
- **Sector:** Cross-sector — Cement, Steel, Aluminium, Fertilizers, Electricity, Hydrogen
- **Entities:** European Commission, EU Customs, Authorized CBAM Declarants, Third Country Operators (TCOs), Lifetime Oy, DWS IQ 6
- **Standards:** Regulation (EU) 2023/956 (CBAM Regulation), Implementing Regulation 2023/1773 (Reporting), EU ETS Phase 4 (linked), ESRS E1 (CSRD — embedded in reporting)
- **Temporal Context:** 2026-Q2 — we are in the definitive phase (financial obligations active since Jan 1 2026)
- **Confidence:** High — grounded in EUR-Lex text and DWS codebase implementing same regulations

---

## 1. What CBAM Is

The Carbon Border Adjustment Mechanism (CBAM) is the EU's mechanism to prevent **carbon leakage** — the risk that EU climate policy drives production to countries with weaker or no carbon pricing, thereby moving emissions rather than reducing them.

CBAM works by requiring importers of carbon-intensive goods into the EU to purchase **CBAM certificates** whose price mirrors the EU ETS (Emissions Trading System) carbon price. The result: goods manufactured in a third country with no carbon cost face the same effective carbon price as goods produced inside the EU under ETS.

Legal basis: **Regulation (EU) 2023/956** of the European Parliament and of the Council, entered into force 17 October 2023.

Implementing detail: **Implementing Regulation (EU) 2023/1773** — defines reporting methodology, calculation rules, default emission factors, and the CBAM Transitional Registry.

---

## 2. Sectors in Scope

CBAM covers six sectors under Annex I of Regulation 2023/956. These map directly to the DWS IQ 6 implementation in `cbam-calculator.ts:72`:

| Sector           | CN codes (goods)             | DWS Default Factor  | Notes                                     |
| ---------------- | ---------------------------- | ------------------- | ----------------------------------------- |
| **Cement**       | 2523, 6810                   | 0.680 tCO2e/t       | Clinker most carbon-intensive sub-product |
| **Iron & Steel** | 7206–7229, 7301–7326         | 1.852–2.143 tCO2e/t | Hot-rolled heavier than cold-rolled       |
| **Aluminium**    | 7601–7616                    | 6.700 tCO2e/t       | Includes indirect (electricity) emissions |
| **Fertilizers**  | 2808, 2814, 2834, 3102, 3105 | 1.295–3.100 tCO2e/t | Urea and ammonium nitrate                 |
| **Electricity**  | 2716                         | 0.450 tCO2e/MWh     | EU grid average default                   |
| **Hydrogen**     | 2804                         | 9.200 tCO2e/t H₂    | Grey hydrogen assumption at default       |

**Lime** is not in CBAM Annex I but is flagged for strategic review under the CRMA. DWS tracks it as `CBAM-LIME-PROXY` using the ETS benchmark as a provisional factor (`emission-factors.ts:93`).

---

## 3. Timeline

| Period                   | Phase                      | Obligations                                                                                                                             |
| ------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Oct 1 2023 – Dec 31 2025 | **Transitional**           | Quarterly reporting of embedded emissions. No certificate purchase. No financial obligation. Data collection only.                      |
| Jan 1 2026 →             | **Definitive**             | Full financial obligation. Importers must be authorized. Certificates must be purchased and surrendered. Annual declaration due May 31. |
| 2026–2034                | **Phase-in alongside ETS** | Free allocations for CBAM sectors under EU ETS phase out progressively. By 2034: zero free allocations for CBAM goods.                  |

**Current status (May 2026):** We are in the definitive phase. Importers who failed to register as authorized CBAM declarants before January 1, 2026 were barred from importing covered goods. The first annual CBAM declaration (for 2026 imports) will be due **31 May 2027**.

---

## 4. Core Mechanics

### 4.1 Authorized CBAM Declarant

Only an **authorized CBAM declarant** registered in the CBAM Registry (operated by the European Commission) may import CBAM-covered goods. Authorization requires:

- EU establishment (or legal representative if non-EU)
- EORI number
- No serious infringement of customs or tax rules
- Financial guarantee (for larger importers)

### 4.2 Embedded Emissions

The number of CBAM certificates required is based on **embedded emissions** — the GHG emissions released during the production of the imported good. Two calculation paths:

1. **Supplier-specific (actual):** Third Country Operator (TCO) provides verified installation-level emission data. Lower obligation possible if supplier is cleaner than the default.
2. **CBAM default:** Commission-published default factors (from Implementing Regulation 2023/1773). Conservative (high) by design — intended as a penalty for non-disclosure.

The DWS calculator in `cbam-calculator.ts:163` implements both paths, preferring supplier-specific when `supplierSpecificFactor` is provided.

For aluminium and electricity, CBAM covers both **direct** (combustion, process) and **indirect** (electricity used in production) emissions. This is the main reason aluminium's default factor (6.700) is so much higher than its ETS benchmark (1.514) — the ETS benchmark captures only direct emissions.

### 4.3 Certificate Mechanics

CBAM certificates are not EU ETS allowances — they are a separate instrument:

- Purchased from national competent authorities
- Price set weekly at the **average EU ETS auction price** for the preceding week
- Importers must hold sufficient certificates on December 31 each year
- Annual surrender: by May 31, certificates covering previous-year imports are surrendered and cancelled
- Up to one-third of certificates can be re-sold back to the competent authority (but not traded peer-to-peer)

The DWS implementation no longer relies solely on a fixed `CBAM_CERTIFICATE_PRICE_EUR = 65` reference value. It now fetches current EU ETS pricing via `ember-carbon-price.ts`, uses async wrappers in the CBAM calculator flow, and persists the latest retrieved price to `cbam-price.json` as a file-backed cache.

In practice, this means certificate pricing is refreshed from a live source and can fall back to the cached `cbam-price.json` value when needed, which reduces the certificate-price staleness gap noted in earlier versions of this field note.

### 4.4 Carbon Price Credits

If the exporting country has its own carbon pricing system, the importer can claim a credit to reduce CBAM obligation. The credit equals the carbon cost actually paid in the country of origin, per Article 9 of Regulation 2023/956.

Recognized systems (implemented in `cbam-calculator.ts:88–98`):

| Country                          | System                       | Effective Price (EUR/tCO2e, 2024 estimate) |
| -------------------------------- | ---------------------------- | ------------------------------------------ |
| UK                               | UK ETS                       | 45                                         |
| Switzerland                      | Swiss ETS (linked to EU ETS) | 50                                         |
| Norway / Iceland / Liechtenstein | EEA — mirrors EU ETS         | 65                                         |
| Canada                           | Federal carbon price         | 40                                         |
| South Korea                      | Korean ETS                   | 15                                         |
| New Zealand                      | NZ ETS                       | 30                                         |

China, India, Turkey, and most major exporters to the EU have **no recognized system** — importers from these countries receive no credit and pay full CBAM.

---

## 5. What SAP Offers (Competitive Context)

SAP Sustainability Control Tower (SCT) is the ERP-integrated compliance tool SAP markets against CBAM. From our energy sector research (`docs/energy-industry-eu-2026.md`):

> **SAP Sustainability Control Tower** — Good CSRD, limited ETS/CBAM. Enterprise pricing. DWS deploys in 30 days vs 12 months.

SAP's CBAM positioning is essentially: "if your supply chain data is already in SAP, we can generate the CBAM report." The value proposition is data integration with existing SAP ERP (S/4HANA), not regulatory depth.

**SAP limitations for CBAM:**

- Requires pre-existing SAP ERP investment (>€500K+ typical enterprise implementation)
- Limited calculation depth — primarily a reporting layer, not a calculator
- Does not model the supplier-specific vs default factor tradeoff
- No origin country carbon credit logic
- No cross-regulation scoring (ETS + CBAM + CSRD unified)
- 12-month deployment timeline vs DWS 30-day deployment

**DWS IQ 6 advantages:**

- Full CBAM calculator with supplier-specific and default paths (cbam-calculator.ts)
- Origin country carbon credit logic for 8 jurisdictions
- Definitive vs transitional phase detection automatic
- Combined ETS + CBAM + CSRD + RED III scoring in one API call
- No ERP dependency — operates on import data directly
- API-first, agent-callable — can be embedded in any procurement workflow

---

## 6. DWS IQ 6 Implementation Status

### What Exists

| Component                     | File                                         | Status        |
| ----------------------------- | -------------------------------------------- | ------------- |
| CBAM calculator (full)        | `src/compliance/cbam-calculator.ts`          | ✅ Production |
| CBAM default emission factors | `src/compliance/emission-factors.ts`         | ✅ Production |
| CBAM schema (synthetic data)  | `src/synthetic-data/cbam-schema.ts`          | ✅ Production |
| CBAM calculator tests         | `src/__tests__/cbam-calculator.test.ts`      | ✅ Production |
| CBAM in ComplianceAgent       | `src/agents/compliance.agent.ts`             | ✅ Active     |
| CBAM in EmissionsDataAnalyst  | `src/agents/emissions-data-analyst.agent.ts` | ✅ Active     |

### Known Gaps

**1. Certificate price staleness.** ~~`CBAM_CERTIFICATE_PRICE_EUR = 65` hardcoded.~~ ✅ **RESOLVED (2026-05-10, PR-1265)** — `ember-carbon-price.ts` now serves a 4-tier cascade (in-memory → `config/cbam-price.json` → EMBER API → Sandbag → EUR 65 static). `scripts/daily/cbam-price-fetch.sh` writes the file daily. `calculateCBAMAsync()` fetches live price on every call.

**2. Default factor staleness.** Emission-factors.ts comment warns: "Last verified: 2026-03-24 | Stale after: 180 days." This means factors should be re-verified by **2026-09-21**. The Commission may issue amendments. A reminder should be registered in the quarterly gate script.

**3. No CBAM Registry integration.** The CBAM Transitional Registry (and eventually the CBAM Registry) has an API for authorized declarants to submit reports and track TCO data. DWS does not yet integrate with this. Currently the calculator produces the data; the importer must submit manually. This is the biggest functionality gap vs. SAP (which has Commission portal connectors).

**4. Indirect emissions for electricity imports.** The CBAM electricity factor (0.450 tCO2e/MWh) is the EU-wide grid average default. For electricity imports from specific third countries, the CBAM implementing regulation allows use of country-specific grid emission factors. This is not yet implemented — the calculator applies the EU average regardless of origin country for electricity.

**5. No EORI number validation.** ~~`eoriNumber?: string` unvalidated.~~ ✅ **RESOLVED (2026-05-10, PR-1265)** — `validateEORI()` exported from `cbam-calculator.ts`. Regex `[A-Z]{2}[0-9A-Z]{1,15}` per EU Customs Regulation 952/2013. `calculateCBAMAsync()` runs validation and attaches `eoriWarning` to the result when EORI is absent or malformed (WARN, not ERROR — does not block calculation).

---

## 7. Regulatory Watch — What's Coming

### CBAM 2.0 / Omnibus Simplification (2026)

As of May 2026, the EU Omnibus package is under legislative review. For CBAM, the package proposes:

- **Threshold exemption:** Importers with cumulative CBAM imports below a de minimis threshold (discussions around €150 or €1,000 consignment value, or 50 tonne annual total) would be exempt from full declarant registration. This would relieve SME importers significantly.
- **Simplified reporting** for small declarants
- **Delayed deadlines** for certain sectors under review

DWS should monitor EUR-Lex for the adopted Omnibus text. If the de minimis threshold is enacted, the `estimateCBAMCost()` function in `cbam-calculator.ts:238` should incorporate a threshold check before triggering full declaration logic.

### Sectors Under Review for Annex I Expansion

The Commission is reviewing inclusion of:

- **Organic chemicals** (polymers, plastics feedstocks)
- **Refined petroleum products**
- **Further steel downstream products** (pipes, tubes, structural shapes)
- **Lime** (relevant to DWS given existing `CBAM-LIME-PROXY` flag)

Any expansion triggers new default factor tables and calculator updates. The `regulatory-radar` skill should flag Commission consultation documents on these sectors.

---

## 8. Data Sourcing for CBAM Compliance — DWS Standard

Per the Validated Mock Data Rule in CLAUDE.md, all CBAM-related data in DWS IQ 6 must cite authoritative sources:

| Data Type                    | Authoritative Source                          | DWS Reference                                           |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| Default emission factors     | Implementing Regulation 2023/1773, Annex III  | `emission-factors.ts` — `cbam-default` methodology      |
| ETS benchmark factors        | Implementing Regulation 2021/447              | `emission-factors.ts` — `ets-benchmark` methodology     |
| Certificate price            | Weekly ETS auction average (ICE/ECX, ECB SDW) | `CBAM_CERTIFICATE_PRICE_EUR` — update quarterly         |
| Origin country carbon prices | Commission Decision per Art. 9(1)             | `COUNTRIES_WITH_CARBON_PRICING` in `cbam-calculator.ts` |
| Sector scope (CN codes)      | Regulation 2023/956 Annex I                   | `CBAM_COVERED_SECTORS` in `cbam-calculator.ts`          |
| EORI format                  | EU Customs Regulation 952/2013                | Validation gap — see §6                                 |

---

## 9. Key Numbers to Know

| Metric                            | Value            | Source                                             |
| --------------------------------- | ---------------- | -------------------------------------------------- |
| CBAM certificate price (2024 avg) | €65/tCO2e        | EU ETS 2024 annual average                         |
| Aluminium default factor          | 6.700 tCO2e/t    | CBAM Implementing Reg. 2023/1773 (direct+indirect) |
| Steel (hot-rolled) default        | 1.852 tCO2e/t    | CBAM Implementing Reg. 2023/1773                   |
| Hydrogen default                  | 9.200 tCO2e/t H₂ | CBAM Implementing Reg. 2023/1773                   |
| Cement default                    | 0.680 tCO2e/t    | CBAM Implementing Reg. 2023/1773                   |
| Electricity default (EU avg)      | 0.450 tCO2e/MWh  | CBAM Implementing Reg. 2023/1773                   |
| First annual declaration deadline | 31 May 2027      | Regulation 2023/956 Art. 6                         |
| ETS free allocation phase-out     | Complete by 2034 | Regulation 2023/956 Art. 35                        |
| Definitive phase start            | 1 January 2026   | Regulation 2023/956 Art. 36                        |

---

## 10. Three Actions for DWS IQ 6

Ordered by urgency:

1. ~~**This month — Certificate price automation.**~~ ✅ **DONE (PR-1265)** — `scripts/daily/cbam-price-fetch.sh` writes `config/cbam-price.json` daily. `ember-carbon-price.ts` serves a 4-tier cascade. `calculateCBAMAsync()` uses live price on every call.

2. ~~**This quarter — EORI validation.**~~ ✅ **DONE (PR-1265)** — `validateEORI()` exported from `cbam-calculator.ts`. Format check per EU Customs Regulation 952/2013. `calculateCBAMAsync()` attaches `eoriWarning` to results with missing or malformed EORI. 9 test cases added.

3. **2026-H2 — Commission Registry connector.** Build an adapter to the CBAM Transitional Registry API (when the Commission publishes its machine-readable interface). This turns DWS from a calculator into a submission system — the step that makes CBAM handling fully automated and closes the gap versus SAP.
