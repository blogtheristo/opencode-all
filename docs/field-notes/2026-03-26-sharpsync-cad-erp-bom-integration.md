# Field Note: SharpSync — CAD-to-ERP BOM Synchronization for Firehorse Automation

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/study-sharpsync-0tChV | Date: 26.03.2026 | Changes: Initial study of SharpSync (sharpsync.net) by CADSharp LLC. Evaluated fit for Firehorse Automation pipeline and DWS ERP connector architecture. Recommendation: integration partner (Option B), not reseller.

Document Status:
  - Created: 26.03.2026
  - Last Modified: 26.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: CONFIDENTIAL — Partner Strategy
  - Document Type: Field Note / Technology Evaluation

Related Documents:
  - src/integrations/erp/types.ts (ERP connector type definitions)
  - src/integrations/erp/base-connector.ts (BaseERPConnector abstract class)
  - Firehorse/DWS_IQ6_INTEGRATION_GUIDE.md (ERP/carbon tracking architecture)
  - Firehorse/PRODUCT_CATALOG.md (Pricing and product strategy)

***

## 1. What Is SharpSync

SharpSync is a **cloud-based BOM (Bill of Materials) synchronization tool** that bridges CAD design systems with ERP/PLM business systems. Built by CADSharp LLC, a company with 10+ years of CAD/PDM custom software development.

- URL: https://sharpsync.net
- Company: CADSharp LLC
- Architecture: Cloud-based, AWS backend, browser dashboard
- Exhibited at: FABTECH 2025 (North America's largest metal forming/fabricating event)
- Business model: SaaS subscription, implementation included in purchase price

### Core Capabilities

- **Bi-directional BOM sync** between CAD and ERP
- **Discrepancy highlighting** — visual diff of engineering vs. business data
- **Custom mapping rules** — configurable field transformations
- **File export** — STEP, DXF, DWG transfer alongside BOM data
- **Browser-based dashboard** — no desktop install required
- **Multi-user management** — role-based access for engineering teams

---

## 2. Supported Systems

### CAD (Primary Data Sources)

| Vendor | Systems |
|--------|---------|
| Dassault Systemes | SolidWorks, SolidWorks PDM |
| PTC | Onshape, Creo, Windchill, Arena |
| Autodesk | Inventor, Fusion 360, AutoCAD |
| Siemens | Solid Edge, NX, Teamcenter |
| Other | CSV import |

### ERP/PLM (Secondary Data Sources)

| System | Bi-directional | Notes |
|--------|---------------|-------|
| Microsoft Dynamics 365 Business Central | Yes | Documented integration page |
| Epicor | Yes | Documented integration page |
| NetSuite | Yes | Documented integration page |
| Odoo | Yes | Open-source ERP |
| IFS | Yes | Listed in service portfolio |
| Acumatica | Yes | Cloud ERP |
| SysPro | Yes | Manufacturing ERP |
| Propel PLM | Yes | Cloud PLM |
| Exact Online | Yes | EU market |
| SAP | Unknown | Not found in public docs — may be custom engagement |
| Infor XA / Syteline | Yes | Listed in service portfolio |

---

## 3. Relationship to DWS ERP Connectors

### Our Current Connector Architecture

`src/integrations/erp/` provides 6 connectors inheriting from `BaseERPConnector`:

| Connector | File | Entity Types |
|-----------|------|-------------|
| SAP S/4HANA | `sap-connector.ts` | Production orders, machine data, OEE, maintenance, costs |
| IFS Cloud | `ifs-connector.ts` | Asset-intensive manufacturing data |
| Dynamics 365 | `dynamics365-connector.ts` | Business Central / F&O operational data |
| Monitor ERP | `monitor-connector.ts` | Nordic SME manufacturing |
| Visma | `visma-connector.ts` | Net/Enterprise operational data |
| Jeeves | `jeeves-connector.ts` | Swedish market manufacturing |

**Supported entity types** (`EntityType` enum): `PRODUCTION_ORDER`, `WORK_ORDER`, `MATERIAL_REQUIREMENT`, `INVENTORY_TRANSACTION`, `MACHINE_DATA`, `OEE_METRICS`, `MAINTENANCE_EVENT`, `QUALITY_INSPECTION`, `COST_TRANSACTION`, `EMPLOYEE_TIME`, `ASSET`, `ESG_METRIC`.

### The Gap

Our connectors sync **operational/manufacturing data** (factory floor → business systems). SharpSync syncs **engineering/design data** (CAD desk → business systems). These are two different data domains that feed the same ERP.

```
ENGINEERING DOMAIN (SharpSync)          OPERATIONS DOMAIN (DWS ERP Connectors)
┌──────────────┐                        ┌──────────────────────┐
│ SolidWorks   │                        │ Factory Floor / IoT  │
│ Onshape      │──► SharpSync ──┐       │ MES / SCADA          │──► DWS Connector ──┐
│ Inventor     │    (BOM sync)  │       │ Maintenance Systems  │    (ops sync)      │
│ Fusion 360   │                │       │ Quality Systems      │                    │
└──────────────┘                │       └──────────────────────┘                    │
                                ▼                                                   ▼
                          ┌──────────────────────────────────────────┐
                          │         ERP SYSTEM                       │
                          │  (Dynamics 365 / SAP / IFS / Monitor)   │
                          │                                          │
                          │  ┌─────────┐  ┌──────────┐  ┌────────┐ │
                          │  │ BOM     │  │ Prod.    │  │ Maint. │ │
                          │  │ Parts   │  │ Orders   │  │ Assets │ │
                          │  │ Revs    │  │ OEE      │  │ Costs  │ │
                          │  └─────────┘  └──────────┘  └────────┘ │
                          └──────────────────┬───────────────────────┘
                                             │
                                             ▼
                          ┌──────────────────────────────────────────┐
                          │  FIREHORSE AUTOMATION                    │
                          │  - Material data → Carbon calc (EN 15978)│
                          │  - Production data → Compliance reports  │
                          │  - Signed reports via DocuSign           │
                          └──────────────────────────────────────────┘
```

**They are complementary, not competing.** Together they close the full loop: Design → Production → Operations → Compliance.

---

## 4. Firehorse Automation Integration Value

SharpSync feeds Firehorse's `erp-sync` workflow template with accurate material data from the engineering phase:

1. **Design phase** — Engineer updates BOM in SolidWorks/Onshape
2. **SharpSync** — Syncs BOM with material specs → ERP (part numbers, quantities, materials)
3. **DWS ERP Connector** — Picks up production orders with those materials via `syncProductionOrders()`
4. **Firehorse Carbon Reporting** — Calculates EN 15978 lifecycle emissions from synced material data
5. **Firehorse Report** — Generates signed compliance reports (CSRD, CBAM, ETS)

### Concrete Benefits

| Benefit | Without SharpSync | With SharpSync |
|---------|-------------------|----------------|
| Material data accuracy | Manual entry / CSV import | Automatic CAD-to-ERP sync |
| Carbon calculation input | Estimates / delayed data | Real material specs from engineering |
| BOM revision tracking | ERP-only (no design context) | Full design-to-production traceability |
| Time to compliance report | Days (waiting for data) | Hours (automated pipeline) |
| Data entry errors | High (manual transcription) | Near-zero (automated sync) |

---

## 5. Delivery Strategy Options

### Option A: Reseller (Sell SharpSync as Part of DWS Offering)

| Pro | Con |
|-----|-----|
| Bundled sale, one vendor for customer | Thin margins on someone else's SaaS |
| SharpSync has $1,000/org referral program | No formal reseller tier found publicly |
| Simple go-to-market | Dependency on CADSharp pricing/roadmap |
| No development cost | No product differentiation |

**Verdict:** Low effort, low control. Suitable only as a short-term referral play.

### Option B: Integration Partner (Recommended)

| Pro | Con |
|-----|-----|
| We sell the orchestration layer | Requires SharpSync API access agreement |
| Both products add value the other can't | Development effort for connector |
| Co-selling relationship, not dependency | Coordination overhead |
| Extends BaseERPConnector architecture | SharpSync API maturity unknown |

**Implementation plan:**

1. Contact CADSharp about API access / webhook events for BOM sync completions
2. Add `BOM_SYNC` and `PART_REVISION` as new `EntityType` values in `src/integrations/erp/types.ts`
3. Create `src/integrations/erp/connectors/sharpsync-connector.ts` extending `BaseERPConnector`
4. Listen for BOM change events → feed material data into Firehorse carbon pipeline
5. Market position: *"DWS IQ 6 + SharpSync = Design-to-Compliance in one flow"*

**Verdict:** Best balance of control, value creation, and partnership. Recommended.

### Option C: Build BOM Sync In-House (Not Recommended)

| Pro | Con |
|-----|-----|
| Full control | CADSharp has 10+ years of CAD API expertise |
| No external dependency | SolidWorks/Inventor API complexity is enormous |
| | Our strength is operations/compliance, not CAD parsing |
| | 6-12 month development minimum |

**Verdict:** Not our core competency. Would divert resources from Firehorse automation and compliance.

---

## 6. ERP Overlap Matrix

Systems where both DWS and SharpSync have connectors (co-selling sweet spots):

| ERP System | DWS Connector | SharpSync Support | Joint Value |
|------------|--------------|-------------------|-------------|
| **Dynamics 365** | Yes (`dynamics365-connector.ts`) | Yes (Business Central) | **Highest** — both operational + engineering sync |
| **IFS Cloud** | Yes (`ifs-connector.ts`) | Yes (listed) | **High** — asset-intensive manufacturing |
| **SAP S/4HANA** | Yes (`sap-connector.ts`) | Unknown (custom?) | **Medium** — need to verify SharpSync SAP support |
| **Monitor ERP** | Yes (`monitor-connector.ts`) | No | DWS-only territory |
| **Visma** | Yes (`visma-connector.ts`) | No | DWS-only territory |
| **Jeeves** | Yes (`jeeves-connector.ts`) | No | DWS-only territory |
| **Epicor** | No | Yes | SharpSync-only — potential DWS expansion |
| **NetSuite** | No | Yes | SharpSync-only — potential DWS expansion |

**Primary co-sell target: Dynamics 365 customers** — both products have mature connectors.

---

## 7. Competitive Landscape

| Competitor | Approach | vs. SharpSync |
|-----------|----------|---------------|
| **OpenBOM** | Cloud BOM management + ERP REST APIs | More PLM-like, heavier; SharpSync is lighter/faster |
| **PLMSync (QBuild)** | PDM/PLM ↔ ERP sync | Desktop-focused, SolidWorks-only; SharpSync is multi-CAD cloud |
| **Elmo Solutions** | NetSuite/Oracle CAD integration | Narrow ERP focus; SharpSync covers more ERPs |
| **Native ERP plugins** | SolidWorks → SAP, etc. | Single-pair; SharpSync is many-to-many |

SharpSync's differentiator: **cloud-native, multi-CAD, multi-ERP, browser-based, modern stack.** Aligns with DWS cloud-first architecture.

---

## 8. Next Steps

| # | Action | Owner | Priority |
|---|--------|-------|----------|
| 1 | Contact CADSharp — explore integration partnership and API access | Risto | HIGH |
| 2 | Request SharpSync API documentation (webhooks, event types, auth) | Risto | HIGH |
| 3 | Evaluate SharpSync sandbox/trial for Dynamics 365 BOM sync testing | Engineering | MEDIUM |
| 4 | Design `sharpsync-connector.ts` extending `BaseERPConnector` | Engineering | MEDIUM |
| 5 | Map SharpSync BOM fields → EN 15978 material input schema | Engineering | MEDIUM |
| 6 | Draft co-marketing positioning for Dynamics 365 manufacturing customers | Business | LOW |

---

## 9. References

- SharpSync product: https://sharpsync.net
- SharpSync about: https://sharpsync.net/about
- SharpSync documentation: https://sharpsync.gitbook.io/sharpsync
- SharpSync referral program: https://sharpsync.net/referral-program
- CADSharp ERP/PLM services: https://www.cadsharp.com/erp-plm-development
- SharpSync GitHub: https://github.com/SharpSync
- Onshape-Dynamics integration: https://sharpsync.net/onshape-dynamics-integration
- Inventor-Epicor integration: https://sharpsync.net/inventor-epicor-integration
- SharpSync at FABTECH 2025: https://www.fabtechexpo.com/exhibitor-directory/new-products/24119/sharpsync
