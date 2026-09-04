# Multi-Vendor Hardware Partner Evaluation

## Boardy Review Framework Applied to All Vendors

**Boardy's Core Criteria:**
1. **Hardware availability** (lead times, stock in Finland/EU)
2. **Aegis edge deployment fit** (fanless, rugged, multi-LAN, TPM/secure boot, Linux)
3. **Sensor/networking breadth** (I/O variety, industrial protocols, PoE, switches)
4. **Own product differentiation** (manufacturer vs. distributor, co-design capability)
5. **Lifecycle/security/regulated-industry evidence** (5-7 yr availability, certifications, warranty, RMA, field support)

**Boardy's Caution:** "Currently looks more like a multi-brand distributor/integrator than a hardware manufacturer. Before treating them as a partner, verify 5 things: 5-7 year availability, secure boot/TPM and Linux support, exact CE/EMC/industrial certifications, warranty/RMA and Finnish field support, and whether they will co-design and support a reference BOM rather than simply resell boxes."

**Boardy's Recommendation:** "Approach initially as a qualified hardware supplier plus pilot co-delivery candidate, not as an exclusive strategic partner. Small Aegis edge-reference pilot: one fanless IPC, one industrial switch, two sensor/remote-I/O paths. Prove installation, data capture, offline operation, signed updates, replacement handling, documented BOM."

---

## Vendor 1: iPCMax / Serdex Solutions Oy (Ulvila, Finland)

| Criterion | Score | Evidence |
|-----------|-------|----------|
| **Hardware availability** | 8/10 | Local Finnish stock (1-2 week delivery). Catalogue: IPC-409, IPC-P68, Cincoze DA-1200, ICP DAS power meters, industrial switches. |
| **Aegis edge fit** | 7/10 | Fanless, rugged, multi-LAN (2.5GbE), PoE+, DIN-rail, 9-36V DC. IPC-P68 has 4× PoE+ for cameras. |
| **Sensor/networking breadth** | 8/10 | Modbus RTU/TCP, MQTT, OPC UA, CAN, analogue, RTD, strain-gauge, relay. Industrial Ethernet switches (managed, fibre/SFP, PoE). |
| **Own product differentiation** | 4/10 | **Distributor/integrator** of Axiomtek, Advantech, Cincoze, ICP DAS. Not a manufacturer. Co-design capability unproven. |
| **Lifecycle/security/regulated support** | 3/10 | No published 5-7 yr availability commitments. Secure boot/TPM? Linux support? CE/EMC certs? Warranty/RMA process? Finnish field support? All need verification. |

**Boardy Verdict:** Qualified hardware supplier + pilot co-delivery candidate. **Not exclusive strategic partner yet.**

**Pilot Proposal:** 1× IPC-P68 (vision gateway) + 1× managed industrial switch + 2× ICP DAS remote I/O paths (Modbus + analogue). Test: install, offline operation, signed updates, RMA, documented BOM.

---

## Vendor 2: Beckhoff Automation (Germany, Finnish representation)

| Criterion | Score | Evidence |
|-----------|-------|----------|
| **Hardware availability** | 7/10 | German manufacturing, EU stock. Lead times 4-8 weeks typically. Finnish representation exists. |
| **Aegis edge fit** | 9/10 | **Manufacturer** of C6030/CX5300 IPCs, TwinCAT 3 real-time kernel, EtherCAT/XFC sub-100µs, MX-System IP67. Fanless, rugged, multi-core Intel, secure boot capable, full Linux/Yocto support. |
| **Sensor/networking breadth** | 9/10 | EtherCAT G/G10 (1/10 Gbit), XFC fast sampling, vast I/O terminal range (IP20/IP67), motion/servo drives, vision, safety. Native OPC UA (TF6100), TwinCAT IoT (MQTT/gRPC). |
| **Own product differentiation** | 10/10 | **Full manufacturer** — silicon-to-software stack. Deep co-design capability. Reference architectures published. |
| **Lifecycle/security/regulated support** | 8/10 | 10+ year product lifecycles typical. CE/EMC/UL certified. Secure boot, TPM 2.0, signed firmware. Industrial-grade warranties. German engineering documentation. |

**Boardy Verdict:** **Strategic technology partner** for deterministic real-time control layer. High differentiation, deep integration capability. Pilot should validate TwinCAT 3 → DGX Spark OPC UA/MQTT pipeline.

**Pilot Proposal:** 1× CX5300 (TwinCAT 3) + EtherCAT I/O terminals (analogue + encoder) + EtherCAT G switch. Test: sub-100µs sampling → OPC UA PubSub → NIM inference on DGX Spark → TwinCAT actuation.

---

## Vendor 3: Siemens (Germany, strong Finnish presence)

| Criterion | Score | Evidence |
|-----------|-------|----------|
| **Hardware availability** | 8/10 | Large Finnish presence (Siemens Oy). Local stock for common S7-1500, ET 200SP, IPCs. Industrial Edge Platform available. |
| **Aegis edge fit** | 8/10 | SIMATIC S7-1500 (PLC), SIMATIC IPC (industrial PCs), ET 200 I/O (PROFINET/IP67). Industrial Edge runtime for containers. PROFIsafe for safety. |
| **Sensor/networking breadth** | 8/10 | PROFINET, PROFIsafe, OPC UA (TIA Portal), S7 connector, MQTT. Wide I/O range. Managed industrial switches (SCALANCE). |
| **Own product differentiation** | 9/10 | **Full manufacturer** — PLC, HMI, IPC, drives, switches, software (TIA Portal, Industrial Edge). Deep ecosystem. |
| **Lifecycle/security/regulated support** | 9/10 | 10-15 year lifecycles. Extensive certifications (CE, UL, ATEX, IEC 61508 SIL). Secure boot, TPM. Global warranty/RMA. Finnish support org. |

**Boardy Verdict:** **Strategic partner for heavy industrial / safety-critical** deployments. PROFINET/PROFIsafe + OPC UA integration to DGX Spark is well-trodden path. Higher cost, but regulatory credibility.

**Pilot Proposal:** 1× S7-1500 + ET 200SP I/O + SCALANCE switch + Industrial Edge app. Test: PROFINET I/O → OPC UA → NIM inference → PROFIsafe actuation.

---

## Vendor 4: ABB / Asennustuotteet.fi (Finland - KNX/Building Automation)

| Criterion | Score | Evidence |
|-----------|-------|----------|
| **Hardware availability** | 9/10 | **Asennustuotteet.fi is Finnish distributor** with local stock. ABB manufactured. Saga/Tacteo/Tenton panels, free@home, KNX IP routers, Näpsä EV panels. |
| **Aegis edge fit** | 6/10 | Focus: **building automation** (KNX, BACnet, free@home), not rugged industrial edge. AC/S1.1.1 KNX heating/cooling controllers, weather stations, touch panels. Limited fanless DIN-rail IPCs. |
| **Sensor/networking breadth** | 7/10 | KNX IP, BACnet/IP, free@home System Access Point (MQTT), weather stations, presence sensors, EV distribution (Näpsä). Strong in commercial building / facility mgmt. |
| **Own product differentiation** | 7/10 | ABB manufactures; Asennustuotteet distributes in Finland. Building automation specialist. Co-design for building-level BOMs possible. |
| **Lifecycle/security/regulated support** | 6/10 | KNX/BACnet standards. 10+ yr lifecycles for installed base. Building-sector certifications (not industrial SIL). Finnish support via Asennustuotteet. |

**Boardy Verdict:** **Niche partner for building/facility layer** — smart buildings, HVAC optimization, EV charging sites, facility energy management. Not for heavy industrial machine control. Good for Situation Room facility monitoring.

**Pilot Proposal:** 1× ABB AC/S1.1.1 KNX controller + free@home SAP + weather station + Näpsä EV panel. Test: KNX IP → MQTT → DGX Spark NIM (energy optimization) → KNX actuation.

---

## Comparative Summary Matrix

| Criterion | **iPCMax** | **Beckhoff** | **Siemens** | **ABB/Asennustuotteet** |
|-----------|------------|--------------|-------------|-------------------------|
| **Role in Architecture** | Field Gateway / Sensor Aggregation | Real-Time Machine Control | Heavy Plant / Safety PLC | Building Automation / Facility |
| **Manufacturer vs Distributor** | Distributor/Integrator | **Manufacturer** | **Manufacturer** | Manufacturer (via FI distributor) |
| **Hardware Availability (FI)** | 8/10 (Local stock) | 7/10 (4-8 wk) | 8/10 (Local stock) | 9/10 (Local stock) |
| **Aegis Edge Fit** | 7/10 | **9/10** | 8/10 | 6/10 |
| **Sensor/Networking Breadth** | 8/10 | **9/10** | 8/10 | 7/10 (Building-focused) |
| **Own Product Differentiation** | 4/10 | **10/10** | 9/10 | 7/10 |
| **Lifecycle/Security/Regulated** | 3/10 | 8/10 | **9/10** | 6/10 |
| **Boardy Recommendation** | Pilot Supplier | **Strategic Tech Partner** | **Strategic Industrial Partner** | **Niche Facility Partner** |

---

## Recommended Multi-Vendor Pilot Program

### Phase 1: Reference Architecture Validation (Weeks 1-8)

| Pilot | Vendors | Objective | Success Criteria |
|-------|---------|-----------|------------------|
| **Pilot A: Machine Vision Cell** | Beckhoff + iPCMax | CX5300 (TwinCAT 3) → EtherCAT cameras → IPC-P68 (PoE) → DGX Spark NIM (YOLOv8) → TwinCAT actuation | <100µs sampling → <50ms inference → closed-loop control |
| **Pilot B: Heavy Process Safety** | Siemens + iPCMax | S7-1500 + ET 200SP (PROFIsafe) → SCALANCE → iPCMax gateway → DGX Spark (anomaly) → PROFIsafe trip | SIL-compliant path, <200ms detect-to-trip |
| **Pilot C: Facility Energy** | ABB/Asennustuotteet + iPCMax | KNX sensors + free@home → MQTT → iPCMax IPC-409 → DGX Spark (energy NIM) → KNX/BACnet HVAC | 15% energy reduction, offline capable |
| **Pilot D: Multi-Vendor Normalization** | All 4 | Themis OT Normalizer ingests Siemens OPC UA, Beckhoff EtherCAT, ABB KNX/MQTT, iPCMax Modbus → unified CloudEvents → single workflow | All 4 vendors normalized, single dashboard |

### Phase 2: Aegis Edge Reference BOM (Weeks 9-16)

| BOM Tier | Components | Vendors | Use Case |
|----------|------------|---------|----------|
| **Tier 1: Sensor Gateway** | IPC-409 + industrial switch | iPCMax | Remote sites, Modbus/MQTT aggregation |
| **Tier 2: Vision Gateway** | IPC-P68 (4× PoE) + managed switch | iPCMax | Camera ingestion, RTSP → DGX Spark |
| **Tier 3: Real-Time Control** | CX5300 + EtherCAT I/O + XFC | Beckhoff | Sub-100µs loops, motion, vibration |
| **Tier 4: Safety PLC** | S7-1500 + ET 200SP PROFIsafe | Siemens | SIL-rated, heavy plant, PROFINET |
| **Tier 5: Facility Layer** | KNX/BACnet controllers + free@home | ABB/Asennustuotteet | HVAC, EV, weather, occupancy |

### Phase 3: Partner Agreements (Weeks 12-20)

| Vendor | Agreement Type | Key Terms |
|--------|----------------|-----------|
| **Beckhoff** | Strategic Technology Partner | Joint reference architecture, co-marketing, prioritized support, 5-yr BOM commitment |
| **Siemens** | Industrial Partner | PROFINET/OPC UA integration, Industrial Edge co-development, Finnish support SLA |
| **ABB/Asennustuotteet** | Building Automation Partner | KNX/BACnet/MQTT integration, facility reference sites, Finnish stock commitment |
| **iPCMax/Serdex** | Qualified Supplier + Pilot Co-delivery | Local stock SLA, 5-yr availability on selected SKUs, RMA process, signed BOM support |

---

## Verification Checklist (Per Boardy's 5 Points)

| Verification Item | iPCMax | Beckhoff | Siemens | ABB/Asennustuotteet |
|-------------------|--------|----------|---------|---------------------|
| **5-7 yr availability commitment** | ❌ Need | ✅ Standard | ✅ Standard | ✅ Standard (installed base) |
| **Secure boot / TPM / Linux support** | ❓ Need verification | ✅ Yes | ✅ Yes | ❓ Building-grade only |
| **CE/EMC/Industrial certifications** | ❓ Need per SKU | ✅ Full | ✅ Full (incl. SIL) | ✅ Building sector |
| **Warranty/RMA + Finnish field support** | ❓ Need SLA | ✅ German + FI rep | ✅ Siemens Oy local | ✅ Asennustuotteet FI |
| **Co-design reference BOM (not just resell)** | ❓ Pilot to prove | ✅ Deep capability | ✅ Deep capability | ✅ Building BOMs |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-30 | Four-vendor strategy (not single partner) | No single vendor covers full OT spectrum; multi-vendor normalization is Themis's job |
| 2026-08-30 | iPCMax as qualified supplier + pilot co-delivery | Boardy caution: distributor model, unproven lifecycle/security; pilot proves capability |
| 2026-08-30 | Beckhoff as strategic tech partner for real-time layer | Manufacturer, deterministic EtherCAT/XFC, deep TwinCAT 3 integration |
| 2026-08-30 | Siemens as strategic industrial partner for safety/PROFINET | Manufacturer, SIL-rated, Finnish presence, Industrial Edge platform |
| 2026-08-30 | ABB/Asennustuotteet as niche facility partner | Building automation (KNX/BACnet), Finnish stock, not industrial rugged |
| 2026-08-30 | Themis OT Normalizer = unification layer | Single CloudEvents schema absorbs vendor protocol differences |

---

## Next Actions

1. **Week 1-2**: Send pilot proposals to all 4 vendors (reference this doc)
2. **Week 2-3**: Schedule technical kickoffs (Beckhoff + Siemens priority)
3. **Week 3-4**: iPCMax pilot scope agreement (sign NDA, define BOM)
4. **Week 4-6**: ABB facility pilot scope (lower priority, parallel)
5. **Week 8**: Pilot A+B+C results → go/no-go for Phase 2 BOM
6. **Week 12**: Partner agreement drafts based on pilot outcomes

---

**Document Status:** DRAFT
**Version:** 1.0
**Date:** 2026-08-30
**Owner:** Platform Team
**Boardy Review:** Applied to all vendors per framework above