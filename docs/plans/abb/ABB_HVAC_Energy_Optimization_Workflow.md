# ABB HVAC Energy Optimisation Workflow — Requirements

## VERSION AND AGENT HISTORY

- Version: 1.1 [Latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-materials-audit | Date: 2026-09-27 | Changes: Audit per `ABB_MATERIALS_AUDIT_2026-09-27.md`. Added DWS header. "15% energy saving target" changed to a hypothesis to measure. "5-second latency" replaced with measure-and-report. EPBD cited as Directive (EU) 2024/1275. free@home path via SAP, interface to verify. Control writes KYA-gated. Tied to the pack's single Fit for 55 workflow (§9).
- Version: 1.0 [not latest] | Tool: unknown | Agent: unknown | Date: 2026-08-30 | Changes: Initial draft at repo root, commit `d6485bb3b` (never merged to main). Restored verbatim in `de22eca7f`.

---

**Status:** DRAFT — requirements for validation workflow 1.
**Canonical source:** `docs/plans/ABB_KNX_BACNET_VALIDATION_PACK_2026-08-30.md` §1 (workflow 1), §9
**Audit:** `docs/plans/abb/ABB_MATERIALS_AUDIT_2026-09-27.md`
**Audit trail:** `git log -- docs/plans/abb/ABB_HVAC_Energy_Optimization_Workflow.md`

---

## 1. Overview

This document sets the requirements for HVAC energy optimisation with ABB devices in DWS IQ. It ingests KNX and BACnet telemetry, maps it to the canonical energy model, and produces Fit for 55 evidence. It is validation workflow 1 in the pack and the HVAC half of the pack's single exit-gate workflow: "HVAC night-setback + EV peak-shave".

## 2. Objectives

- Monitor HVAC energy use per zone.
- Recommend setpoint changes from occupancy, outside temperature and schedule.
- Produce evidence for EPBD and CSRD reporting.
- Keep an EU AI Act Article 12 audit trail for every automated recommendation or action.

## 3. Requirements

### 3.1 Telemetry ingestion

- KNX IP via ABB KNX IP Router: temperature, occupancy, setpoint, weather.
- BACnet/IP from ABB AC/S1.1.1: temperature, setpoint, mode.
- HVAC energy meter: kWh and power.
- Mappings per `ABB_Protocol_Mappings.md`.

### 3.2 Energy-state mapping

- Energy use per HVAC zone into `EnergyState` and `ZoneObservation` (pack §6).
- Historical series kept with `rawRef` lineage for reporting.

### 3.3 Control

- Setpoint recommendations from occupancy, outside temperature and schedule (night-setback first).
- Writes to AC/S1.1.1 or KNX only with a KYA-signed intent and an HIC-approved policy.
- free@home devices reached through the System Access Point; its interface is to be verified before use.

### 3.4 Compliance evidence

- EPBD recast, Directive (EU) 2024/1275: consumption and setpoint history for energy-performance reporting.
- CSRD ESRS E1-5 (energy consumption and mix) and E1-6 (GHG emissions) inputs.
- EU Taxonomy alignment data for real-estate activities.
- Article 12 audit trail: raw frame hash → canonical record → decision → signed output.

## 4. Success criteria

- Two KNX/BACnet device paths ingest end-to-end into the database via DGX Spark (pack §2.1).
- Canonical mapping with no per-site custom driver (pack §2.2).
- Ingest latency and command loop measured and reported at p50/p95 (pack §4.3).
- Safe state holds on every failure in pack §8.
- One evidence bundle for night-setback produced and reviewed by HIC (pack §9).

## 5. Metrics to measure

- Telemetry data quality: share of readings mapped, dropped, flagged.
- Energy change against a measured baseline. **Hypothesis: about 15 % reduction. It is not a target or claim until measured.**
- Availability over the lab run.
- Completeness of the compliance evidence bundle.

## 6. Decision rationale

The first draft stated a 15 % saving and a 5-second latency with no baseline or source. Both are kept only as things to measure, in line with the pack's "characterise, don't promise" rule.
