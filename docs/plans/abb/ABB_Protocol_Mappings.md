# ABB KNX / BACnet Protocol Mappings — DWS IQ Integration

## VERSION AND AGENT HISTORY

- Version: 1.2 [Latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-interfaces | Date: 2026-09-27 | Changes: free@home SAP interface confirmed from vendor docs: local REST + WebSocket API (SysAP firmware ≥ 2.6.0, basic auth, enabled under free@home Settings → Local API); no native MQTT. Näpsä confirmed from vendor docs: Näpsä Smart-EV ulkomittauskeskus (outdoor metering centre) with EV3 energy meter, MID, Modbus RTU (RS485); not BACnet. Added §3.3 free@home row. Sources: free@home: ABB Developer Portal (developer.eu.mybuildings.abb.com/fah_local); Näpsä: ABB product page (new.abb.com/low-voltage/fi/…/napsa-smart-ev-ulkomittauskeskus).
- Version: 1.1 [not latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-materials-audit | Date: 2026-09-27 | Changes: Audit per `ABB_MATERIALS_AUDIT_2026-09-27.md`. Added DWS header. Corrected KNX datapoint types (E1). BACnet setpoint moved from Analog Input to Analog Value (E2). Näpsä moved off direct BACnet/IP to gateway path, marked unverified (E3). Removed "switch to backup protocol" (E6). Replaced invented latency/reliability targets with measure-and-report (pack §4.3). DWS mapping names aligned to pack canonical points.
- Version: 1.0 [not latest] | Tool: unknown | Agent: unknown | Date: 2026-08-30 | Changes: Initial draft at repo root, commit `d6485bb3b` (never merged to main). Restored verbatim in `de22eca7f`.

---

**Status:** DRAFT — template. Every row is to be confirmed against lab capture and the device's product database (ETS) before use.
**Canonical source:** `docs/plans/ABB_KNX_BACNET_VALIDATION_PACK_2026-08-30.md` §4.1, §5, §6
**Audit:** `docs/plans/abb/ABB_MATERIALS_AUDIT_2026-09-27.md`
**Audit trail:** `git log -- docs/plans/abb/ABB_Protocol_Mappings.md`

---

## 1. Overview

This document maps ABB device data to the DWS canonical model for the HVAC and EV workflows. Names on the DWS side follow pack §4.1 and §6 (`ZoneObservation`, `EnergyState`, `ChargerState`). The actual group addresses and object instances come from the site's ETS project and lab capture, not from this document.

## 2. KNX mappings

KNX datapoint types (DPT) below are the standard types for each measurement. Confirm them against the device's ETS product entry.

### 2.1 HVAC sensors

| Device              | Measurement         | KNX DPT                       | DWS canonical point        | Unit |
| ------------------- | ------------------- | ----------------------------- | -------------------------- | ---- |
| KNX temperature     | Room temperature    | 9.001 (2-byte float)          | `HVAC.zone.temperature`    | °C   |
| KNX presence sensor | Occupancy           | 1.018 (occupied/not occupied) | `HVAC.zone.occupancy`      | bool |
| KNX weather station | Outside temperature | 9.001                         | `Weather.site.temperature` | °C   |
| KNX weather station | Brightness          | 9.004                         | `Weather.site.lux`         | lx   |
| KNX weather station | Wind speed          | 9.005                         | `Weather.site.wind_speed`  | m/s  |

### 2.2 HVAC control

| Device              | Measurement / command | KNX DPT            | DWS canonical point        | Unit |
| ------------------- | --------------------- | ------------------ | -------------------------- | ---- |
| Saga / Tacteo       | Setpoint              | 9.001              | `HVAC.controller.setpoint` | °C   |
| KNX HVAC controller | HVAC mode             | 20.102 (HVAC mode) | `HVAC.controller.mode`     | enum |
| KNX HVAC controller | On/off                | 1.001 (switch)     | `HVAC.controller.enabled`  | bool |

### 2.3 Data format

- Temperature at the DPT's own resolution (DPT 9 is a 2-byte float; 0.01 °C step before precision loss).
- Every reading carries a timestamp and a `rawRef` hash of the raw telegram (pack §6).
- Invalid values are quarantined and flagged, not dropped silently.

## 3. BACnet/IP mappings

### 3.1 HVAC (ABB AC/S1.1.1)

| Point              | BACnet object           | Property      | DWS canonical point        | Unit | Access                     |
| ------------------ | ----------------------- | ------------- | -------------------------- | ---- | -------------------------- |
| Room temperature   | Analog Input (AI)       | Present_Value | `HVAC.zone.temperature`    | °C   | Read                       |
| Setpoint           | Analog Value (AV)       | Present_Value | `HVAC.controller.setpoint` | °C   | Read; write only KYA-gated |
| HVAC mode          | Multi-state Value (MSV) | Present_Value | `HVAC.controller.mode`     | enum | Read                       |
| Heating/cooling on | Binary Value (BV)       | Present_Value | `HVAC.controller.enabled`  | bool | Read                       |

Object instance numbers come from the AC/S1.1.1 BACnet configuration in lab capture.

### 3.2 Energy and EV (via gateway)

| Device                      | Path to DWS                        | DWS canonical record | Fields                       | Status                                     |
| --------------------------- | ---------------------------------- | -------------------- | ---------------------------- | ------------------------------------------ |
| Näpsä Smart-EV EV3 meter    | Modbus RTU (RS485) → iPCMax → MQTT | `EnergyState`        | `kWh`, `power_W`             | Interface confirmed; register map from lab |
| ICP DAS power meter         | Modbus → iPCMax → MQTT/gRPC        | `EnergyState`        | `kWh`, `power_W`             | Per iPCMax pack                            |
| HVAC energy meter           | To choose at lab setup             | `EnergyState`        | `kWh`, `power_W`             | Not chosen                                 |
| Charger (if in scope later) | To verify                          | `ChargerState`       | `state`, `kW`, `kWh_session` | Out of scope                               |

### 3.3 free@home (via System Access Point)

| Source          | Interface                                     | Path to DWS                   | Notes                                                                 |
| --------------- | --------------------------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| free@home SysAP | Local REST + WebSocket API (firmware ≥ 2.6.0) | DWS bridge → MQTT → canonical | Basic auth; test calls at `http://<SysAP-IP>/swagger`; no native MQTT |

### 3.4 Data format

- Standard units: °C, kW, kWh, W.
- Timestamps on every measurement; BACnet status flags carried as data-quality indicators.

## 4. Integration layer

### 4.1 Telemetry ingestion

- Protocol translation at the iPCMax gateway or ingest service.
- Each address or object gets a verdict: mapped, dropped or flagged (pack §4.1).
- Timestamps normalised to UTC.

### 4.2 Control commands

- Read-only by default.
- A write needs a KYA-signed intent (TC-2+) and an HIC-approved policy. Test: a write without a grant is rejected and logged; a write with a grant is forwarded and read back (pack §4.2).
- Every command produces an audit event.

### 4.3 Error handling

| Error                     | Handling                                 | Safe state                        | Operator signal     |
| ------------------------- | ---------------------------------------- | --------------------------------- | ------------------- |
| Communication timeout     | Retry with exponential backoff, bounded  | Hold last setpoint; no new writes | Alert               |
| Out-of-range / bad format | Quarantine reading, use last-good + flag | No write based on bad value       | Data-quality flag   |
| Device unreachable        | Mark source offline                      | No writes to that device          | Alert               |
| Unauthorised command      | Reject                                   | Unchanged                         | Alert + audit event |

Full failure catalogue: pack §8.

## 5. Performance

Facility energy is not motion control. The validation **measures and reports**; it does not promise numbers (pack §4.3).

- Ingest latency: sensor → gateway → DGX Spark → database, p50 and p95.
- Command loop: intent → actuation → sensor readback.
- Availability and data-quality rates over the lab run.

Numbers go into the validation report and OT-003 after lab capture.

## 6. Validation requirements

- End-to-end test of each mapping row in the lab.
- Latency measured as above.
- Error handling demonstrated per §4.3.
- Command authority tested per §4.2.
- Evidence captured on every hop (pack §4.5).

## 7. Decision rationale

The first draft used boolean KNX types for temperatures and a read-only BACnet object for a writable setpoint; a connector built from it would not work. This version uses standard types and marks every unverified path, so the lab capture fills blanks instead of correcting errors.
