# ABB Integration Validation Plan

## VERSION AND AGENT HISTORY

- Version: 1.2 [Latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-interfaces | Date: 2026-09-27 | Changes: free@home SAP interface confirmed from vendor docs: local REST + WebSocket API (SysAP firmware ≥ 2.6.0, basic auth, enabled under free@home Settings → Local API); no native MQTT. Näpsä confirmed from vendor docs: Näpsä Smart-EV ulkomittauskeskus (outdoor metering centre) with EV3 energy meter, MID, Modbus RTU (RS485); not BACnet. Sources: free@home: ABB Developer Portal (developer.eu.mybuildings.abb.com/fah_local); Näpsä: ABB product page (new.abb.com/low-voltage/fi/…/napsa-smart-ev-ulkomittauskeskus).
- Version: 1.1 [not latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-materials-audit | Date: 2026-09-27 | Changes: Audit per `ABB_MATERIALS_AUDIT_2026-09-27.md`. Added DWS header. Removed CBAM (E4). Replaced invented targets (>95 % accuracy, 99.5 % uptime, <5 s, 100 % success) with measure-and-report. Team roles mapped to actual owners (HIC + agents). Six-week timeline marked as estimate. Deliverables tied to the pack's HIC sign-off checklist.
- Version: 1.0 [not latest] | Tool: unknown | Agent: unknown | Date: 2026-08-30 | Changes: Initial draft at repo root, commit `d6485bb3b` (never merged to main). Restored verbatim in `de22eca7f`.

---

**Status:** DRAFT — execution plan for the canonical pack. Lab capture not started.
**Canonical source:** `docs/plans/ABB_KNX_BACNET_VALIDATION_PACK_2026-08-30.md` §2, §4, §11
**Audit:** `docs/plans/abb/ABB_MATERIALS_AUDIT_2026-09-27.md`
**Audit trail:** `git log -- docs/plans/abb/ABB_Integration_Validation_Plan.md`

---

## 1. Overview

This plan sets out how to validate ABB Electrification / Asennustuotteet devices with DWS IQ. There are two proof points: HVAC energy optimisation and EV charging metering. The exit gate is one Fit for 55 workflow with a reviewed evidence bundle (pack §9). Until that gate passes, no "ABB integration" claim is made.

## 2. Scope

- HVAC energy optimisation — `ABB_HVAC_Energy_Optimization_Workflow.md`
- EV charging metering — `ABB_EV_Charging_Workflow.md`
- KNX and BACnet telemetry ingestion — `ABB_Protocol_Mappings.md`
- Devices — `ABB_Supported_Devices.md`
- DGX Spark edge processing (K3s T1 or T2)
- Evidence capture on every hop

## 3. Phases

### Phase 1 — Lab setup

- Procure the minimum set: AC/S1.1.1, KNX IP Router, one Saga and one Tacteo, free@home SAP, Näpsä Smart-EV ulkomittauskeskus, ICP DAS meter.
- Set up the iPCMax gateway and DGX Spark ingest.
- Record firmware of every device.
- Enable the free@home SysAP Local API (firmware ≥ 2.6.0) and read the Näpsä EV3 meter Modbus register map. Interfaces confirmed from vendor docs 27.09.2026; lab confirms values.

### Phase 2 — HVAC

- KNX and BACnet ingest, mapped per `ABB_Protocol_Mappings.md`.
- Energy-state mapping into the canonical model.
- Night-setback recommendation, with writes KYA-gated.
- Measure latency (p50/p95) and data quality.

### Phase 3 — EV metering

- Näpsä and ICP DAS metering via the gateway.
- Correlate with building load and OTel.
- Peak-shave recommendation, with writes KYA-gated.
- Measure latency and data quality.

### Phase 4 — Combined workflow and failure tests

- Run night-setback plus peak-shave as one workflow.
- Command authority test (pack §4.2).
- Failure tests: every row in pack §8.
- Produce the evidence bundle (pack §9).

## 4. What gets validated

| Area                | How                                                              | Pack reference |
| ------------------- | ---------------------------------------------------------------- | -------------- |
| Telemetry ingestion | Each address/object mapped, dropped or flagged                   | §4.1           |
| Energy-state model  | Records in `ZoneObservation` / `EnergyState` / `ChargerState`    | §6             |
| Command authority   | Write without grant rejected; with grant read back               | §4.2           |
| Timing              | Measured p50/p95, reported, not promised                         | §4.3           |
| Failure handling    | Safe state + operator signal + audit event                       | §4.4, §8       |
| Evidence            | Raw hash → canonical → decision → signed output                  | §4.5, §9       |
| Compliance data     | EPBD 2024/1275, CSRD ESRS E1-5/E1-6, EU Taxonomy, AI Act Art. 12 | §9             |

## 5. Deliverables (= pack sign-off checklist)

- Supported devices pinned to lab firmware
- Protocol mapping sheet as CSV/YAML
- Latency p50/p95 measured
- Failure modes demonstrated with audit events
- One Fit for 55 evidence bundle, reviewed by HIC
- Security boundaries (pack §7) acknowledged by owner
- Backlog OT-003 updated with firmware and latency numbers

## 6. Owners

| Role                  | Owner                                                          |
| --------------------- | -------------------------------------------------------------- |
| Decision and sign-off | HIC — Risto Anton Päärni                                       |
| Device setup in lab   | HIC or partner installer (Asennustuotteet channel) — to decide |
| Ingest, mapping, edge | Platform Team agents on DGX Spark                              |
| Evidence and audit    | Agents; HIC reviews the bundle                                 |

## 7. Timeline

Estimate only; starts when devices arrive.

| Phase           | Estimate    |
| --------------- | ----------- |
| 1 — Lab setup   | 1 week      |
| 2 — HVAC        | 2 weeks     |
| 3 — EV metering | 2 weeks     |
| 4 — Combined    | 1 week      |
| **Total**       | **6 weeks** |

## 8. Decision rationale

The first draft had a five-person team and SLA-style targets with no basis. This version keeps the phase structure and the six-week estimate, maps roles to real owners, and uses the pack's sign-off checklist as the definition of done.
