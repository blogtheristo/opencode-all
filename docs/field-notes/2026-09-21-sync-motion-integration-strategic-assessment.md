---
Title: Sync Motion — Technical & Market Value Assessment for DWS IQ Ecosystem
Date: 2026-09-21
Author: Risto Anton Päärni, Founder/CEO DWS IQ
Status: VALUE ASSESSMENT — awaiting HIC decision on whether to pursue
Note: Assessment of potential value IF a partnership is pursued. No contact has been made with the company. Named-contact outreach plan and commercial terms live separately in docs/partnerships/sync-motion-tobias-brida.md.
---

# Sync Motion — DWS IQ Ecosystem Value Assessment

## Executive Summary

**IF DWS IQ partners with Sync Motion**, its PlantWatch + Sync Connect products would directly address the last-mile OT data problem (non-invasive PLC state ingestion across multi-vendor protocols) that currently blocks regulatory-grade evidence chains in industrial settings.

**Potential strategic value:** Would help unlock the regulated manufacturing vertical (pharmaceuticals, automotive, food/beverage under FSMA/FSSC, machinery under MD) by solving the "prove what actually happened in the plant" problem without a PLC/HMI/SCADA retrofit.

**Category fit:** This kind of non-invasive OT connectivity product owns a **data layer** ("what happened, when, on which machine"). DWS IQ owns a **decision layer** ("what it means" + "prove it for compliance"). Clean separation of concerns if the two are combined.

**Potential revenue model:** System integrator resale (DACH + pan-EU) could provide a volume channel; DWS IQ would provide decision-automation on top of the ingested OT data.

---

## Verified Company Facts (Publicly Available)

**Product capabilities:**

- Sync Connect bridges: OPC UA, Siemens S7, Beckhoff ADS, Modbus TCP, EtherNet/IP
- PlantWatch: non-invasive PLC state reading (does not require PLC/HMI/SCADA replacement)
- Deployment: on-premise or air-gap; Linux, Windows, ARM, x86

**Go-to-market:**

- Customer channel: system integrators in DACH + pan-EU
- Sales models: referral, delivery, reseller
- No public numbers on integrator count or customer density (proposed ~40–60 integrators × 5–15 customers used below as a DWS IQ estimate only — unverified)

**Everything else in this assessment is DWS IQ analysis or proposal, not confirmed by the company.**

---

## Technical Architecture Alignment

### OT Data Layer → DWS IQ Mandate Evidence Chain

| Data Source Output                                | DWS IQ Ingestion                              | Use Case                                          | Compliance Frame                |
| ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| **PLC state history** (S7, ADS, OPC UA snapshots) | Mandate Data Lake (Supabase/ClickHouse)       | Production timeline reconstruction                | FSMA §11.3, MD Annex VIII       |
| **Downtime logs** (machine, duration, root cause) | Decision-Context evidence layer               | Regulatory root-cause (what failed, when, impact) | GxP audit trail, 21 CFR Part 11 |
| **EtherNet/IP + Modbus readings**                 | Sensor-to-decision mapping                    | Equipment performance under load (quality impact) | IATF 16949, ISO 50001           |
| **Air-gap deployment logs**                       | Compliance provenance (when/where system ran) | Evidence integrity for disconnected sites         | FDA, TÜV, NotifyBody audits     |

**Key win:** A connectivity/monitoring product handles protocol complexity and managed data collection; DWS IQ owns decision logic and evidence certification. This is a reusable pattern for any non-invasive OT data source, not specific to one vendor.

---

## Market & Revenue Opportunity

### TAM Analysis: European Regulated Manufacturing (DWS IQ Estimate, Not Verified)

**Addressable segments** (DWS IQ market sizing; actual penetration via any specific partner TBD):

1. **Pharmaceuticals (GMP/GDP):** ~2,500 EU sites | Median $50K+ DWS IQ ARR (compliance evidence SaaS)
2. **Automotive (IATF 16949):** ~8,000 Tier-1/2 facilities | Median $30–80K DWS IQ ARR
3. **Food/Beverage (FSMA/FSSC):** ~12,000 manufacturing sites | Median $15–40K DWS IQ ARR
4. **Medical Devices (MD/ISO 13485):** ~3,500 EU facilities | Median $40–100K DWS IQ ARR

**Potential go-to-market via an OT connectivity partner** (DWS IQ analysis, not vendor-confirmed):

- Estimated integrator network: ~40–60 system integrators across DACH + France + Benelux
- Estimated per-integrator base: 5–15 manufacturing customers (each site = $20–80K DWS IQ TAM)
- **Blended TAM estimate per integrator:** ~$300K–$1.2M annually in DWS IQ attach potential

**Verify before use:** Actual integrator count, customer density per integrator, and current adoption rates in these verticals — none of this is confirmed.

**DWS IQ motion:**

- **Product-led:** Downtime/PLC feed → DWS IQ compliance agent automatically generates risk narratives + audit trails
- **Sales-led:** Integrators co-sell DWS IQ as "decision automation for production compliance"

### Potential Revenue Mechanics (IF a Partnership of This Shape Is Approved)

**Tier 1 (Year 1, IF POC succeeds):** Pilot + co-sell agreement with 3–5 integrators → 8–12 DWS IQ seats ($240K–$480K ARR)

**Tier 2 (Year 2, IF network adoption accelerates):** Network effect + referral motion → 15–25 integrators active → 40–80 DWS IQ seats ($1.2M–$3.2M ARR)

These are illustrative sizing scenarios for the category, not commitments from any specific company.

---

## Technical Integration Checklist

### Phase 0: Proof of Concept (4–6 weeks)

- [ ] **Data schema mapping:** OT connector output → Mandate Data Lake (SQL schema + example payloads)
  - Production/downtime events → `production_events` (time, machine_id, event_type, root_cause, impact)
  - OPC UA snapshots → `sensor_readings` (timestamp, tag_name, value, quality)
  - Downtime logs → `downtime_records` (start, end, duration, category, verified_by)
- [ ] **Ingestion adapter:** Kafka consumer or HTTP webhook handler
  - Accepts MQTT/Kafka topics from the OT source
  - Validates against JSON schema (Zod)
  - Writes to Supabase `public.ot_ingest_raw` + ClickHouse `raw.ot_events`
- [ ] **Evidence layer:** Build 3 KYA mandate decision examples
  - "What caused downtime on Line 3 on a given date?" → downtime log + Mandate AI
  - "Prove temperature compliance in a cleaning cycle." → OPC UA readings + KYA narrative
  - "Show me all production runs where a given material supplier was used." → state history tracing
- [ ] **Integrator pilot:** partner with 1 DACH integrator for 1 regulated-manufacturing customer
  - Install the OT connector at the site
  - Feed downtime + OPC UA data to a DWS IQ sandbox
  - Run a live compliance query loop (1 week)
  - Collect customer feedback + integration logs

### Phase 1: Production Integration (6–8 weeks post-POC)

- [ ] **Secure data pipeline:** TLS, encryption at rest, audit logging
- [ ] **Multi-tenant ingestion:** customers + integrators isolated by org_id
- [ ] **Real-time compliance agent:** KYA-driven narratives from live OT data
- [ ] **Audit trail certification:** provenance headers for ingested data (Art. 13 transparency)

---

## Risk & Mitigation

### Technical Risk: Multi-Protocol Data Quality

**Risk:** Data from legacy Modbus/EtherNet/IP sources may be lossy; KYA narratives downstream depend on signal integrity.

**Mitigation:**

- Build a data-quality layer (signal presence check, timestamp continuity, range validation)
- Define an SLA (e.g., "downtime log completeness ≥98%") for compliance narratives to be audit-ready
- Test with real PLC data from a pilot integrator, not a simulator

### Market Risk: Integrator Adoption Velocity

**Risk:** DACH system integrators typically move on 2-year sales cycles.

**Mitigation:**

- Start with 1–2 "fast integrators" already doing OT/IT bridging with digital-native leadership
- Offer a free DWS IQ seat during the POC to lower adoption friction
- Co-invest in integrator training (1-day workshop, certification path)

### Compliance Risk: Evidence Admissibility

**Risk:** A regulatory auditor challenges "can we trust data from a third-party connector?" — especially in pharma (FDA, EMA).

**Mitigation:**

- Require the data-source vendor to provide attestation that its product is non-invasive, read-only, and validated against live PLC state
- DWS IQ adds a provenance layer (Code Evidence Layer, CLAUDE.md Art. 12–14) with tool/model/agent/date
- Build a "compliance certification kit": sample audit response + evidence chain walkthrough
- A pilot customer becomes a reference for regulator Q&A

---

## Your Decision: Pursue This Category or Archive?

This assessment shows **what value a non-invasive OT connectivity partner of this type could bring to DWS IQ**, using one real company (Sync Motion) as the concrete example. It is not a commitment.

**Named-contact outreach plan and commercial terms** for this specific company are in `docs/partnerships/sync-motion-tobias-brida.md`. That file tracks any actual contact and response; this field note stays as a reusable technical/market pattern regardless of what happens with any one company.

**If you decide to pursue outreach**, see the partner note for the three options (warm intro, pre-call positioning, integrator prospecting) and the recommended path.

**If not interested or want to wait**, archive both documents. No commitment, no sunk cost.

---

## Versioning

| Version | Date       | Changes                                                                                                                                                                                                                                     | Author             |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1.2     | 2026-09-21 | Removed all named-individual references per HIC instruction; extracted outreach plan, founder quote, and commercial terms to docs/partnerships/sync-motion-tobias-brida.md. This file is now a generic technical/market pattern assessment. | Risto Anton Päärni |
| 1.1     | 2026-09-21 | Reframed as VALUE ASSESSMENT (conditional language throughout). No contact made. HIC decision gates all outreach.                                                                                                                           | Risto Anton Päärni |
| 1.0     | 2026-09-21 | Initial strategic assessment, technical alignment, market TAM, outreach plan                                                                                                                                                                | Risto Anton Päärni |
