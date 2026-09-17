# ABB Electrification / Asennustuotteet — Narrow Validation Pack (HVAC + EV)

**Version:** 0.1 — Reference architecture validation scope (not a broad integration claim)  
**Date:** 2026-08-30  
**Owner:** Platform Team — Lifetime Oy  
**Branch:** `claude/ipcmax-arch-audit-30aug` (infra7 operationalization)  
**Status:** DRAFT — For HIC review before any partner-facing claim  
**Companion docs:** `docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md` · `docs/plans/KUBERNETES_IMPLEMENTATION_PLAN.md` · `docs/plans/CONNECTOR_UPGRADE_BACKLOG.md` (OT-003) · `Admin/KUBERNETES_OPERATIONS_MANUAL.md`

---

## 0. Position in the multi-vendor reference architecture

```
Industrial OT                          Building OT
[Siemens S7/ET200 · PROFINET]   [Beckhoff TwinCAT/EtherCAT · XFC]   [ABB KNX / free@home / BACnet]   [iPCMax / Serdex gateways]
        │                                   │                                   │                              │
        └──────────────┬────────────────────┘                                   └───────────────┬──────────────┘
                       │ PROFINET / EtherCAT                                                   │ KNX IP / BACnet/IP / Modbus / MQTT
                       ▼                                                                       ▼
                         2. Dual Edge OT tier  (Siemens/Beckhoff/ABB controllers + iPCMax aggregation)
                                              │
                                              │ TSN / OPC UA PubSub / MQTT-over-TLS / gRPC
                                              ▼
                         3. Central Edge AI (NVIDIA DGX Spark — K3s T1/T2, NGC operators 26.3.3/3.1.2/26.4.1/26.4.0)
                                              │
                        4. Enterprise governance (Aspire OTel · Version Compatibility Matrix · EU AI Act Art. 12 audit)
```

**Narrative:** Siemens + Beckhoff cover the factory floor, iPCMax/Serdex covers rugged edge aggregation, **ABB adds buildings, HVAC, distribution and EV charging**. The common **OPC UA, MQTT and BACnet/IP** boundary is the intended interoperability layer — kept as **enterprise/reference architecture** on dws10.com. **Essentials** exposes only the narrow operational-runtime connector needed for the first SME workflow, not the full surface.

**Language guardrail:** Do not claim "seamless" vendor integration until each boundary has passed §4 tests (telemetry mapping, command authority, timing, failure handling, evidence capture).

---

## 1. Scope — deliberately narrow and testable

**First proof points only:**

| # | Workflow | ABB surface under test | Why first |
|---|----------|------------------------|-----------|
| 1 | **HVAC energy optimisation** (facility energy management wedge) | ABB AC/S1.1.1 KNX BACnet/IP heating-cooling controller + Saga/Tacteo sensor/actuator via KNX IP Router + free@home System Access Point (SAP) MQTT bridge | Direct Fit for 55 evidence (EPBD + CSRD ESRS E1-5/E1-6); largest controllable load |
| 2 | **EV charging & distribution** | ABB Näpsä Smart-EV distribution centre + ICP DAS / iPCMax power-meter aggregation via Modbus → MQTT → DGX Spark | Concrete metered-load workflow; ties to PUE/energy metering already in iPCMax tier |

Out of scope for this pack: full Saga/Tacteo catalogue, free@home Matter extension, MISTRAL/ZX800 ancillaries, broad low-voltage catalogue.

---

## 2. Validation objectives (partner validation pack, not marketing)

Each objective produces a **measured artifact**, not prose:

| Objective | Artifact | Pass criterion |
|-----------|----------|----------------|
| 2.1 KNX/BACnet telemetry ingestion | Supported-devices table (§3) + protocol-mapping sheet (§5) | Two device paths ingesting end-to-end to Supabase via DGX Spark |
| 2.2 HVAC & energy-state mapping | Mapping spec (§6) | Telemetry → canonical DWS energy model (kWh, COP, setpoint, mode) without custom driver per site |
| 2.3 Näpsä EV + distribution-panel data | Metering dataset (§6) | Metered kWh per charger + panel, correlated to OTel |
| 2.4 DGX Spark edge processing | K3s T1 or T2 deployment note + operator versions | Ingest → NIM/OTel → audit logged on GB10 (1 PFLOPS FP4, 128 GB) |
| 2.5 Command authority & safe failure | Authority matrix + failure-modes table (§7, §8) | No actuator write without KYA + human-in-command gate; safe-state on timeout/partition |
| 2.6 Evidence capture across every boundary | Fit for 55 workflow evidence bundle (§9) | One demonstrable workflow with lineage: raw frame → normalized → scored → signed output |

---

## 3. Supported devices (this pack — expand only after pass)

| Device | Role | Datasource | Firmware / variant to pin |
|--------|------|------------|---------------------------|
| ABB AC/S1.1.1 | KNX → BACnet/IP heating-cooling controller | KNX bus + BACnet/IP | Record exact FW seen in lab |
| KNX IP Router (ABB) | KNX IP gateway | KNX IP | |
| Saga / Tacteo sensor/actuator (minimal set) | Presence + temperature + setpoint UI | KNX | One Tacteo + one Saga variant only |
| free@home System Access Point | MQTT bridge | free@home → MQTT | Wireless SAP 3.0 |
| Näpsä Smart-EV distribution centre | Distribution + metering | Modbus/BACnet → via iPCMax gateway → MQTT | |
| ICP DAS power meter (via iPCMax IPC-409/Cincoze DA-1200) | Meter bridge | Modbus → MQTT/gRPC | As per iPCMax pack |

Anything not in this table is **explicitly unsupported** in this validation — add via backlog (CONNECTOR_UPGRADE_BACKLOG OT-003 wave).

---

## 4. Test plan (four boundaries)

### 4.1 Telemetry mapping
- KNX group-address → DWS canonical point (e.g. `HVAC.zone.temperature`, `HVAC.zone.occupancy`, `HVAC.controller.setpoint`)
- BACnet objects (AI/AV/BV for AC/S1.1.1) → same canonical model
- free@home MQTT topic → canonical
- Verdict recorded per address/object: mapped / dropped / flagged (with reason).

### 4.2 Command authority
- Read-only by default; writes require signed intent (KYA TC-2+) + HIC-approved policy.
- Test: attempted setpoint write without grant → rejected + audit event; with grant → forwarded → BACnet/KNX write confirmed → readback within window.

### 4.3 Timing
- Facility-energy loop is **not motion control** — characterize, don't promise:
  - Ingest latency: sensor → iPCMax → DGX Spark → DB (p50/p95).
  - Command loop: setpoint intent → actuation → sensor readback.
  - Report numbers; do not claim sub-100 µs — that's Beckhoff XFC on a different boundary.

### 4.4 Failure handling
- Partitions (KNX bus, IP LAN, DGX Spark pod kill), meter offline, SAP unreachable, bad value (out-of-range temp).
- Expected safe states (§8) + operator-visible error + audit event.

### 4.5 Evidence capture
- Aspire OpenTelemetry trace covers every hop (§9); EU AI Act Art. 12 lineage + KYA signature for any automated decision.

---

## 5. Protocol mappings (reference — pin after lab capture)

| Hop | Protocol | Transport | Security | Direction |
|-----|----------|-----------|----------|-----------|
| KNX device → IP Router / SAP | KNX TP / RF | KNX IP | KNX Secure where available | N → router |
| Router/SAP → iPCMax gateway | KNX IP / free@home MQTT | TCP/IP | TLS + PSK where applicable | → gateway |
| iPCMax → DGX Spark | MQTT-over-TLS / OPC UA PubSub / gRPC | TSN-capable L2 | mTLS + KYA | → cluster |
| AC/S1.1.1 → DGX Spark | BACnet/IP | UDP 47808 / TCP | BBMD + ACL | → cluster |
| DGX Spark → Supabase/Aspire | HTTPS / OTel | TCP/IP | mTLS / JWT | → governance |

Final mapping sheet (CSV/YAML) is a pack artifact; this table is the template.

---

## 6. HVAC & energy-state model (canonical)

```
ZoneObservation { zoneId, ts, temperature_C, occupancy, setpoint_C, mode, source, rawRef }
EnergyState    { panelId|zoneId, ts, kWh, power_W, source: "Näpsä"|"ICP DAS"|"AC/S1.1.1", rawRef }
ChargerState   { chargerId, ts, state, kW, kWh_session, panelRef, rawRef }
```

All records retain `rawRef` → raw frame/payload hash for lineage. Derived Fit for 55 facts (EPBD, ESRS E1) reference these states, not raw telemetry.

---

## 7. Security & responsibility boundaries

| Boundary | DWS IQ responsibility | Partner / customer responsibility |
|----------|----------------------|-----------------------------------|
| KNX RF/TP + KNX Secure keys | Consume + log; never exfiltrate keys | Key provisioning, physical bus security |
| free@home SAP → MQTT | TLS termination, KYA-gated writes | SAP firmware, MQTT ACL on SAP |
| BACnet/IP (AC/S1.1.1) | BBMD ACL, read/write gating, audit | BACnet device hardening, network segmentation |
| iPCMax gateway (IPC-409/P68/DA-1200, ICP DAS) | Protocol translation, buffering, mTLS to DGX | Gateway OS/Secure Boot (§1.1 in iPCMax eval), power, thermal |
| DGX Spark cluster (K3s + GPU/NIM/Network/DPU operators) | Operator lifecycle, attestation, audit log | Physical, NVAIE subscription, power/UPS |
| Evidence & governance | OTel, Art. 12 audit, signed output | Retention policy, HIC sign-off |

---

## 8. Failure modes (initial catalog — extend with lab findings)

| Failure | Detection | Safe state | Operator signal | Evidence |
|---------|-----------|------------|-----------------|----------|
| KNX bus loss | Heartbeat timeout | Hold last setpoint; no new writes | Dashboard degraded + alert | OTel span error + audit |
| IP partition (gateway↔DGX) | MQTT LWT / health probe | Buffer on gateway (bounded); drop oldest with mark | Degraded ingest | Gap annotation |
| AC/S1.1.1 unreachable | BACnet timeout | No HVAC write; retain | Alert | Timeout event |
| SAP offline | MQTT disconnect | No free@home writes | Alert | Disconnect event |
| Näpsä meter out-of-range | Validation rule | Quarantine reading; use last-good + flag | Data-quality flag | Quarantine + lineage |
| DGX pod eviction | K8s readiness | Queue on gateway; replay on recovery | Cluster alert | Pod event |

---

## 9. Demonstrated Fit for 55 workflow (one — required for pack sign-off)

**Workflow:** *Facility energy management — HVAC night-setback + EV peak-shave, with EPBD/CSRD evidence.*

1. **Observe (DGX Spark NIM/OTel):** Night-window occupancy + outside-temp + panel load → recommend setpoint + charger throttle.
2. **Act (KYA-gated):** Signed setpoint to AC/S1.1.1 + charger limit via Näpsä/gateway — only after HIC policy allows.
3. **Evidence bundle produced:**
   - Raw frames (hash) → canonical ZoneObservation/EnergyState/ChargerState
   - OTel trace ID + KYA-signed decision record
   - EPBD/CSRD-aligned export (consumption, intensity, setpoint history) with lineage links
   - Failure/gap annotations if any

This single workflow, with artifacts, is the validation exit gate. No broader "ABB integration completed" claim without it.

---

## 10. Essentials vs. Enterprise

| Surface | Shown where | Rationale |
|---------|------------|-----------|
| Enterprise/reference | dws10.com architecture section + this pack | Full Siemens/Beckhoff/ABB/iPCMax + DGX Spark picture; awaits per-boundary validation |
| Essentials | DWS IQ Essentials — single narrow connector (HVAC **or** EV, not both, for first SME) | Minimal operational-runtime dependency; validates value before breadth |

---

## 11. Roadmap (this pack)

| Step | Owner | Deliverable | Gate |
|------|-------|-------------|------|
| 11.1 | Platform Team | Lab capture: two ABB device paths end-to-end (HVAC + EV meter) | §2.1–2.4 green |
| 11.2 | Platform Team | §7/§8 signed off + §9 evidence bundle reviewed by HIC | HIC approval |
| 11.3 | Platform Team | CONNECTOR_UPGRADE_BACKLOG OT-003 updated with pinned FW + latency numbers | Doc PR |
| 11.4 | Docs | dws10.com architecture note updated as "reference — validation in progress" (no "seamlessly") | Diff review |

---

## 12. Out of scope

- Catalog-scale ABB/Asennustuotteet coverage, Matter extension, broad low-voltage/porvoo-factory topics.
- Hardcoded price claims — pricing via `dws10.com/config/products.json` per source-of-truth rule.

---

**Sign-off checklist for HIC (applies to this pack, not the whole ABB surface):**

- [ ] Supported devices (§3) pinned to FW seen in lab
- [ ] Protocol mappings (§5) filed as CSV/YAML artifact
- [ ] Latency p50/p95 measured (§4.3)
- [ ] Failure modes (§8) demonstrated + audit events captured
- [ ] One Fit for 55 workflow bundle (§9) produced and reviewable
- [ ] Security boundaries (§7) acknowledged by owner
