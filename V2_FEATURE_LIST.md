# DWS IQ 6 - V2 Feature List (Fit for 55 compliance gaps)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: compliance-check-derived | Date: 05.03.2026 | Changes: Initial V2 feature list from Fit for 55 compliance gap analysis; all items checked in for V1

Document Status:
  - Created: 05.03.2026
  - Last Modified: 05.03.2026
  - Source: /compliance-check output (construction, Fit for 55, medium scale)
  - Status: ACTIVE

***

**Document Owner:** Risto Anton Päärni  
**Purpose:** Track Fit for 55–aligned features identified as V1 gaps; these are checked in for V1 and form the V2 backlog.

---

## V2 Readiness Summary (from V1 compliance check)

| # | Feature area | Priority | Checked in for V1 | Target |
|---|--------------|----------|-------------------|--------|
| 1 | Carbon reporting & baseline | Critical | ✅ | Scope 1–2 first, then Scope 3 |
| 2 | Operational emissions monitoring | Critical | ✅ | Metering, sensors, auditable data |
| 3 | Reduction plan & trajectories | Major | ✅ | Yearly targets to 2030, measures, accountability |
| 4 | Supply chain due diligence | Major | ✅ | Supplier ESG/carbon, embodied carbon traceability |
| 5 | AI system logging / Article 12 readiness | Emerging | ✅ | Decision logs, model versions, inputs/outputs |

**Urgency:** Medium–High for medium-scale construction.  
**Source:** DWS compliance agent gap analysis (construction, Fit for 55, no current measures).

---

## 1. Carbon reporting & baseline — ✅ Checked in for V1

**Priority:** Critical gap

### Why it matters
No structured GHG inventory (Scopes 1–3) means you cannot demonstrate progress toward the 55% reduction target.

### Missing (now on V2 backlog)
- [ ] Standardised methodology (e.g. GHG Protocol)
- [ ] Yearly baseline
- [ ] Project-level breakdown (sites, equipment, materials)

### V2 deliverables
- GHG inventory framework (Scope 1–2 first)
- Baseline year and annual reconciliation
- Project/site/asset-level breakdown in DWS

---

## 2. Operational emissions monitoring — ✅ Checked in for V1

**Priority:** Critical gap

### Why it matters
Without metering/sensor data (fuel, electricity, machinery hours, transport) you cannot:
- Track actual reductions
- Optimise equipment/energy use
- Provide auditable data to regulators or counterparties

### Missing (now on V2 backlog)
- [ ] Fuel and electricity metering integration
- [ ] Machinery hours / utilisation data
- [ ] Transport and logistics emission data
- [ ] Auditable data pipeline and storage

### V2 deliverables
- Data connectors for meters, sensors, fleet
- Operational emissions dashboard and export for auditors

---

## 3. Reduction plan & trajectories — ✅ Checked in for V1

**Priority:** Major gap

### Why it matters
Fit for 55 expects a credible pathway, not just reporting.

### Missing (now on V2 backlog)
- [ ] Reduction targets per year to 2030
- [ ] Portfolio of measures (electrification, fuel switching, process optimisation, material substitution)
- [ ] Investment plan and accountability (owner, timeline)

### V2 deliverables
- Reduction trajectory builder (year-on-year targets)
- Measures library and linkage to projects
- Investment and accountability tracking in DWS

---

## 4. Supply chain due diligence — ✅ Checked in for V1

**Priority:** Major gap

### Why it matters
Construction is heavily exposed to upstream carbon (cement, steel, glass, insulation, aggregates). With no supplier ESG/carbon data you have:
- No way to select lower-carbon alternatives
- No traceability for embodied carbon in purchases
- Higher risk under tightening CBAM/ETS scope on materials

### Missing (now on V2 backlog)
- [ ] Top suppliers by spend/carbon identified
- [ ] Emission factors or EPDs requested and stored
- [ ] Embodied carbon in procurement and specs

### V2 deliverables
- Supplier carbon/ESG data model and UI
- EPD and emission factor repository
- Procurement and spec integration for embodied carbon

---

## 5. AI system logging / Article 12-style readiness — ✅ Checked in for V1

**Priority:** Emerging (important)

### Why it matters
If you use AI for scheduling, risk scoring, routing, or compliance decisions, you need decision logs, model versions, inputs and outputs stored and retrievable. Currently flagged as not ready if any AI is in the loop.

### Missing (now on V2 backlog)
- [ ] Decision logs (inputs, outputs, model version, timestamp)
- [ ] Retrievable and exportable for regulators
- [ ] Alignment with EU AI Act Article 12 expectations

### V2 deliverables
- Article 12–style logging for DWS AI agents and tools
- Log storage, retention and export API/UI

---

## Urgency and recommended next moves

**Urgency:** Medium–High for a medium-scale construction operation; the longer you wait, the steeper the reduction curve gets toward 2030.

### Immediate (0–3 months)
- [ ] Stand up **carbon reporting** (Scope 1–2 first) and **basic operational monitoring** (fuel, electricity, major machinery).
- [ ] Identify **top 10 suppliers** by spend/carbon and start requesting emission factors or EPDs.

### Short term (3–12 months)
- [ ] Define a **Fit for 55–aligned reduction plan** with yearly targets.
- [ ] For any AI in use, implement **logging of inputs/outputs/decisions** for EU AI Act Article 12 readiness.

### Then
- Once the backend issue (`unsupported API version "agents"`) is resolved, re-run the official DWS compliance agent for a machine-scored, repeatable result and track improvements over time.

---

## Relationship to V1 and compliance agent

- **V1:** These five areas were identified as **gaps** in the Fit for 55 compliance check (construction, medium scale, no current measures). They are **checked in for V1** in the sense that they are acknowledged, scoped and added to the product backlog.
- **V2:** This document is the **V2 feature list**; the items above are the backlog for the next release.
- **Compliance agent:** When the DWS compliance API version is fixed, re-running the compliance agent will provide a numeric score and updated gap list; this feature list should be updated from that output as needed.

---

**Document Version:** 1.0  
**Created:** 05.03.2026  
**Last Updated:** 05.03.2026  
**Status:** ACTIVE — V2 backlog from V1 compliance gap analysis
