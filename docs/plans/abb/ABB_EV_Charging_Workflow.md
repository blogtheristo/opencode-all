# ABB EV Charging Workflow — Requirements

## VERSION AND AGENT HISTORY

- Version: 1.1 [Latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-materials-audit | Date: 2026-09-27 | Changes: Audit per `ABB_MATERIALS_AUDIT_2026-09-27.md`. Added DWS header. Removed CBAM (E4: EV chargers are not a CBAM good). Näpsä path changed from direct BACnet/IP to gateway, marked unverified (E3). "2-second latency" replaced with measure-and-report. Scope narrowed to distribution-centre metering first, per pack §2.3. Control writes KYA-gated.
- Version: 1.0 [not latest] | Tool: unknown | Agent: unknown | Date: 2026-08-30 | Changes: Initial draft at repo root, commit `d6485bb3b` (never merged to main). Restored verbatim in `de22eca7f`.

---

**Status:** DRAFT — requirements for validation workflow 2.
**Canonical source:** `docs/plans/ABB_KNX_BACNET_VALIDATION_PACK_2026-08-30.md` §1 (workflow 2), §2.3, §9
**Audit:** `docs/plans/abb/ABB_MATERIALS_AUDIT_2026-09-27.md`
**Audit trail:** `git log -- docs/plans/abb/ABB_EV_Charging_Workflow.md`

---

## 1. Overview

This document sets the requirements for EV charging and distribution metering with the ABB Näpsä Smart-EV distribution centre in DWS IQ. It is validation workflow 2 in the pack and the EV half of the exit-gate workflow: "HVAC night-setback + EV peak-shave". The first step is metering; charger control comes after metering passes.

## 2. Objectives

- Meter kWh per distribution panel and, where available, per charger.
- Correlate charging load with building energy use.
- Support peak-demand reduction (peak-shave).
- Produce evidence for EPBD and CSRD reporting.

## 3. Requirements

### 3.1 Telemetry ingestion

- Näpsä Smart-EV distribution centre metering through the iPCMax gateway to MQTT. **The Näpsä interface (Modbus or BACnet) is to be verified in the lab.**
- ICP DAS power meter via Modbus → iPCMax → MQTT/gRPC.
- Grid import tracked through the same metering path.

### 3.2 Energy-state mapping

- Panel load and energy into `EnergyState`; charger data into `ChargerState` once in scope (pack §6).
- Correlation with building energy use and OTel traces (pack §2.3).

### 3.3 Control

- Peak-shave: recommend a charger or panel limit when building load is high.
- Writes only with a KYA-signed intent and an HIC-approved policy.
- Load balancing across chargers is out of scope until metering passes.

### 3.4 Compliance evidence

- EPBD recast, Directive (EU) 2024/1275: building energy data including EV charging load.
- CSRD ESRS E1-5 (energy consumption) and E1-6 (GHG emissions) inputs.
- EU Taxonomy alignment data for energy-related building equipment.
- Article 12 audit trail for every automated recommendation or action.

## 4. Success criteria

- Metered kWh per panel (and per charger where available) ingested and correlated with OTel (pack §2.3).
- Ingest latency measured and reported at p50/p95 (pack §4.3).
- Meter out-of-range readings quarantined with last-good value and flag (pack §8).
- Peak-shave step included in the pack §9 evidence bundle.

## 5. Metrics to measure

- Metering data quality: mapped, dropped, flagged.
- Peak demand before and after peak-shave, against a measured baseline.
- Availability over the lab run.
- Completeness of the evidence bundle.

## 6. Decision rationale

CBAM was removed because it applies to imports of listed goods, not to EV chargers. The Näpsä protocol stays open until the lab confirms it, so that the connector (backlog OT-003) is built against the real interface.
