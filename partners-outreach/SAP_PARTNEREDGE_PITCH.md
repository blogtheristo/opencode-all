# SAP PartnerEdge Partnership Pitch

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/oneclicklca-partnership-pitch-k7R62 | Date: 24.02.2026 | Changes: Initial creation — SAP Build partner program pitch
- Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Traction claims reconciled to docs/TRACTION_CANONICAL.md — "€84k ARR, 3 customers, 100% retention" replaced with the contracted-pilot statement; no retention rate asserted.

Document Status:

- Created: 24.02.2026
- Last Modified: 24.02.2026
- Language: English
- Publication Status: ACTIVE — INTERNAL/CONFIDENTIAL

***

## Target Company: SAP SE

| Field               | Detail                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **Company**         | SAP SE                                                                                       |
| **HQ**              | Walldorf, Germany                                                                            |
| **CEO**             | Christian Klein                                                                              |
| **Employees**       | 107,000+                                                                                     |
| **Revenue**         | €31.2B (2024)                                                                                |
| **Focus**           | Enterprise ERP, S/4HANA Cloud, Sustainability Control Tower                                  |
| **Partner program** | SAP PartnerEdge — Build, Sell, Service, Run tracks                                           |
| **Sustainability**  | SAP Sustainability Control Tower, Green Ledger, ESRS data points (~80% coverage by end 2025) |

### Key Programs

| Program                                    | Relevance                                                                   |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| **SAP PartnerEdge Build**                  | ISV track for solutions built on/integrated with SAP. Fits DWS IQ.          |
| **SAP Sustainability Partners**            | Ecosystem of partners extending SAP sustainability solutions.               |
| **SAP Sustainability Control Tower**       | SAP's own CSRD/ESRS reporting tool — but needs ERP data mapping automation. |
| **SAP BTP (Business Technology Platform)** | Integration platform for partner solutions.                                 |

### Connection Path

| Route                                | Contact                                  | Notes                                    |
| ------------------------------------ | ---------------------------------------- | ---------------------------------------- |
| **SAP PartnerEdge portal**           | partneredge.sap.com                      | Formal Build partner application         |
| **SAP Sustainability Partners page** | sap.com/products/sustainability/partners | Sustainability-specific partner listing  |
| **SAP Nordic office**                | SAP Finland / SAP Sweden                 | Regional partner managers                |
| **SAP Community**                    | community.sap.com                        | Sustainability Control Tower discussions |

**Recommended approach:** Apply via SAP PartnerEdge Build track → position as sustainability integration partner → target gap between SAP Sustainability Control Tower and ERP data automation.

---

## The Core Thesis: "Automate What SAP's Sustainability Control Tower Can't"

SAP Sustainability Control Tower provides ESRS reporting structure and ~80% data point coverage. But it still requires manual data collection from operational ERP modules (Production Orders, Material Management, Plant Maintenance, Transport Management).

DWS IQ automates that data collection layer — pulling from S/4HANA OData APIs and mapping to CSRD evidence automatically.

```
SAP S/4HANA (ERP Data)                    SAP Sustainability Control Tower
──────────────────────                    ─────────────────────────────────
Production Orders (PP)            ???     ESRS E1 climate data points
Material Documents (MM)     ──── GAP ──→  ESRS E2 pollution metrics
Plant Maintenance (PM)            ???     ESRS S1 workforce data
Transport Management (TM)        ???     ESRS G1 governance data

                    DWS IQ FILLS THIS GAP
                    ─────────────────────
                    Pulls OData from S/4HANA
                    Maps to ESRS data points
                    Feeds Sustainability Control Tower
                    OR generates standalone reports
```

**Why this partnership works:**

1. **Complementary to SAP SCT** — We automate data collection, SAP handles reporting framework
2. **OData endpoints verified** — Our connector uses verifiably real SAP OData paths (API_PRODUCTION_ORDER_2_SRV)
3. **Enterprise gap** — Large SAP customers need automated ERP-to-compliance data mapping
4. **Partner ecosystem fit** — SAP actively recruiting sustainability partners for CSRD deadline push
5. **Revenue model** — SAP customers stay on S/4HANA, add DWS IQ subscription for automation

---

## Pitch: SAP PartnerEdge Build Application

**Subject: Build Partner Application — Automated CSRD Data Collection from S/4HANA**

To the SAP Partner Team,

We're DWS IQ, a Finnish operations compliance platform that automates EU regulatory data collection from SAP S/4HANA. We pull production orders, material documents, and energy data via OData APIs and map them to ESRS disclosure requirements for CSRD/ETS/CBAM reporting.

**The gap we fill:** SAP Sustainability Control Tower provides the reporting framework and ESRS data point structure. But customers still manually collect operational data from ERP modules to populate it. DWS IQ automates that collection layer — pulling directly from S/4HANA and mapping to the data points SCT expects.

**Our SAP connector:**

- Verifiably real OData endpoints (API_PRODUCTION_ORDER_2_SRV, material docs, plant maintenance)
- Basic + sap-client authentication
- Data transformation pipeline for ESRS mapping
- Can feed SAP SCT or generate standalone compliance reports

**What we're asking:**

1. SAP PartnerEdge Build partner status
2. Access to S/4HANA sandbox for integration certification
3. Listing as a sustainability data collection partner

**About us:**

- Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked), plus four smaller landed accounts
- 6 ERP connectors (SAP, IFS, Dynamics, Visma, Monitor, Jeeves)
- Helsinki, Finland — EU-hosted, GDPR compliant

49,000 EU companies need CSRD filing. Most large enterprises run SAP. We help them get the data out automatically.

Risto Anton Paarni
CEO & Founder, Lifetime Oy (DWS IQ 6)
risto@onelifetime.world

---

## Follow-Up Strategy

| Step | Action                                                           | Timing     |
| ---- | ---------------------------------------------------------------- | ---------- |
| 1    | Submit SAP PartnerEdge Build application via partneredge.sap.com | This week  |
| 2    | Register on SAP Sustainability Partners page                     | This week  |
| 3    | Contact SAP Nordic partner manager (Finland/Sweden)              | Week 2     |
| 4    | Prepare S/4HANA integration demo                                 | March 2026 |
| 5    | Target SAP Sapphire 2026 for visibility                          | May 2026   |

---

**Document Version:** 1.0
**Created:** 24.02.2026
**Classification:** INTERNAL / CONFIDENTIAL
