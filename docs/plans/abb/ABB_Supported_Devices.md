# ABB Supported Devices — DWS IQ Integration Validation

## VERSION AND AGENT HISTORY

- Version: 1.2 [Latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-interfaces | Date: 2026-09-27 | Changes: free@home SAP interface confirmed from vendor docs: local REST + WebSocket API (SysAP firmware ≥ 2.6.0, basic auth, enabled under free@home Settings → Local API); no native MQTT. Näpsä confirmed from vendor docs: Näpsä Smart-EV ulkomittauskeskus (outdoor metering centre) with EV3 energy meter, MID, Modbus RTU (RS485); not BACnet. Sources: free@home: ABB Developer Portal (developer.eu.mybuildings.abb.com/fah_local); Näpsä: ABB product page (new.abb.com/low-voltage/fi/…/napsa-smart-ev-ulkomittauskeskus).
- Version: 1.1 [not latest] | Tool: Claude Code | Model: anthropic/claude-opus-5-5 | Agent: abb-materials-audit | Date: 2026-09-27 | Changes: Audit per `ABB_MATERIALS_AUDIT_2026-09-27.md`. Added DWS header. Aligned with canonical validation pack §3. free@home SAP no longer listed as KNX/IP (E5). Näpsä protocol marked unverified (E3). Status changed from "Validation" to "Candidate — not tested". Kept KNX weather station as candidate (dropped in pack).
- Version: 1.0 [not latest] | Tool: unknown | Agent: unknown | Date: 2026-08-30 | Changes: Initial draft at repo root, commit `d6485bb3b` (never merged to main). Restored verbatim in `de22eca7f`.

---

**Status:** DRAFT — companion to the canonical pack. Where this file and the pack differ, the pack wins.
**Canonical source:** `docs/plans/ABB_KNX_BACNET_VALIDATION_PACK_2026-08-30.md` §3
**Audit:** `docs/plans/abb/ABB_MATERIALS_AUDIT_2026-09-27.md`
**Audit trail:** `git log -- docs/plans/abb/ABB_Supported_Devices.md`

---

## 1. Overview

This document lists the ABB devices that are **candidates** for the first DWS IQ validation, covering two workflows: HVAC energy optimisation and EV charging. No device on this list has been tested. A device counts as supported only after it passes the pack's §4 tests and its firmware is pinned from lab capture.

## 2. HVAC devices

### 2.1 KNX devices

- Saga / Tacteo sensor/actuator — one Saga and one Tacteo variant only (presence, temperature, setpoint UI)
- KNX presence sensor
- KNX temperature sensor
- KNX weather station — candidate; not in pack §3, add via backlog OT-003 if needed

### 2.2 KNX ↔ BACnet/IP and IP gateways

- ABB AC/S1.1.1 — KNX / BACnet/IP heating-cooling controller
- ABB KNX IP Router — KNX IP gateway
- HVAC energy meter — make and interface to be chosen at lab setup

## 3. EV charging devices

- Näpsä Smart-EV ulkomittauskeskus (outdoor metering centre) — metering via built-in EV3 energy meter (three-phase 65 A, MID, Modbus RTU over RS485)
- ICP DAS power meter via iPCMax gateway (IPC-409 / Cincoze DA-1200) — meter bridge per iPCMax pack

Individual Näpsä charger status and charging sessions are **out of scope** until the metering path passes. Charging limits are set in ABB's mobile app; a machine interface for them is not documented.

## 4. Gateway devices

- ABB free@home System Access Point (Wireless SAP 3.0) — gateway into the free@home system. Local REST + WebSocket API (firmware ≥ 2.6.0, basic auth, enable "Local API" in free@home settings). No native MQTT — DWS runs its own bridge.

## 5. Protocol support matrix

| Device                     | Interface to DWS                               | Status                  | Notes                                 |
| -------------------------- | ---------------------------------------------- | ----------------------- | ------------------------------------- |
| Saga / Tacteo              | KNX TP → KNX IP Router                         | Candidate — not tested  | Presence, temperature, setpoint       |
| KNX presence / temperature | KNX TP → KNX IP Router                         | Candidate — not tested  | Occupancy detection, room temperature |
| KNX weather station        | KNX TP → KNX IP Router                         | Candidate — not in pack | Outside temperature for night-setback |
| ABB AC/S1.1.1              | BACnet/IP (UDP 47808)                          | Candidate — not tested  | HVAC control; firmware to pin in lab  |
| free@home SAP              | Local REST + WebSocket API → DWS bridge → MQTT | Candidate — not tested  | free@home is its own system, not KNX  |
| Näpsä Smart-EV metering    | EV3 meter Modbus RTU (RS485) → iPCMax → MQTT   | Candidate — not tested  | Distribution metering                 |
| ICP DAS power meter        | Modbus → iPCMax → MQTT/gRPC                    | Candidate — not tested  | As per iPCMax pack                    |

## 6. Integration requirements

### 6.1 Telemetry ingestion

- Collect data from every listed device into the canonical model (pack §6).
- Translate protocols at the gateway or ingest layer; no custom driver per site.
- Record each address or object as mapped, dropped or flagged, with a reason.

### 6.2 Control

- Read-only by default.
- Writes (setpoints, charger limits) need a KYA-signed intent and an HIC-approved policy (pack §4.2).
- On failure, devices hold their last safe state (pack §8).
- Every write produces an audit event.

## 7. Validation status

- Lab capture not started (pack §11.1).
- Nothing in this document supports an "integrated" or "supported" claim yet.
- Firmware, protocol and interface are to be filled in from lab capture.

## 8. Decision rationale

The pack's device table is the narrowest testable set. This file adds only the weather station and the explicit "not tested" status, so readers do not take the list as a support claim.
