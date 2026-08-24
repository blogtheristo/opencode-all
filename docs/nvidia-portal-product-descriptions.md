# NVIDIA Connect Portal — Product Descriptions

VERSION AND AGENT HISTORY
Version: 1.2
Date: 2026-07-05
Author: Claude Code · Session claude/nvidia-inception-reseller-qk6xqx
Reviewed by: Risto Paarni
Status: Draft — ready for portal submission (v1.2: reseller-rights ask added)
Changes:

- v1.2 (2026-07-05): dws10.com/nvidia-inception/ bumped to v1.1 ("take 2") with a
  formal ask for NVIDIA Partner Network (NPN) reseller authorization covering the
  Acer Veriton GN100 + NIM/Cosmos bundle (Control Room, Situation Room). This is a
  request, not a claim of existing reseller status.
- v1.1 (2026-05-17): Added Product 4 (Control Room), Product 5 (Situation Room),
  Product 6 (NVIDIA Model Installation). All built on NVIDIA end-to-end (CUDA +
  TensorRT-LLM). Cross-linked to dws10.com/products/\* and dws10.com/nvidia-inception/.
  These are the productised hardware SKUs supporting the new NVIDIA Inception
  application on the Sovereign EU Edge AI track.
- v1.0 (2026-03-08): Initial three-product portfolio (DWS IQ 6, LWM, Firehorse V2)
  for NVIDIA Connect portal.

---

## Purpose

These are the product descriptions for Lifetime Oy's NVIDIA Connect ISV portal profile. Three products, each with a clear role in the NVIDIA co-sell story. All descriptions are written for NVIDIA's enterprise audience: OEMs, system integrators, and NVIDIA's own go-to-market team.

---

## Product 1: DWS IQ 6 (Flagship)

**Product Name:** DWS IQ 6 — Industrial Climate Compliance Platform

**Category:** Enterprise Software / AI Platform / Regulatory Compliance

**One-Line Description:**
AI-native compliance orchestration platform that automates EU climate regulations (Fit for 55, ETS, CBAM, CSRD) across 16 industrial verticals — deployed on NVIDIA infrastructure, on-premises or private cloud.

**Full Description:**
DWS IQ 6 is the compliance orchestration layer for EU-regulated industries. It ingests operational data from ERP systems (SAP S/4HANA, IFS Cloud, Microsoft Dynamics 365), IoT sensors, and fleet telemetry, then validates, calculates, and reports against EU regulatory frameworks — automatically.

The platform runs 16 specialist AI agents that handle data validation, emissions calculation, regulatory gap analysis, and audit-ready report generation. Every computation is traceable: every number links back to its source transaction with a full audit trail, satisfying EU AI Act Article 12 transparency requirements.

DWS IQ 6 deploys on NVIDIA Grace Blackwell infrastructure (Acer Veriton GN-100 with GB10 SoC) for on-premises sovereign processing, or on Google Cloud Run with NVIDIA GPUs for private cloud deployments. Zero tokens leave the customer's premises in the on-premises configuration.

**NVIDIA Technologies Used:**

- NVIDIA Grace Blackwell (GB10 SoC) — primary compute for AI orchestration
- NVIDIA Jetson Orin Nano — edge inference for IoT sensor fusion
- CUDA Toolkit — AI agent acceleration
- DGX Ubuntu — operating environment
- TensorRT-LLM — optimized inference for compliance agents

**Target Industries:**
Construction, logistics, manufacturing, steel, cement, chemicals, maritime, aviation, energy, mining, paper & pulp, food processing, waste management, water utilities, telecommunications, real estate

**Deployment Models:**

- On-premises (Acer GN-100, zero cloud dependency)
- Private cloud (Google Cloud Run, EU data residency)
- Hybrid (cloud orchestration + Jetson edge nodes)

**Pricing:** Starting from €4,999 (Standard Deployment) — enterprise pricing on request

**Website:** https://dws10.com/products/dwsiq.html

---

## Product 2: Lifetime World Model (LWM) — Proprietary AI Engine

**Product Name:** Lifetime World Model (LWM) — Industrial Climate Intelligence Engine

**Category:** AI / Machine Learning / Domain-Specific LLM

**One-Line Description:**
Proprietary industrial knowledge base and inference engine that maps 15,000+ EU regulatory documents across 25+ verticals — the intelligence layer underneath DWS IQ 6, running on NVIDIA GPU infrastructure.

**Full Description:**
The Lifetime World Model is the proprietary AI engine that powers DWS IQ 6. It is not a fine-tuned wrapper around a foundation model. It is a structured regulatory intelligence graph that maps every obligation in the EU's Fit for 55 package to specific industries, deadlines, data requirements, and reporting formats.

LWM understands the relationships between regulations. When CBAM changes a carbon pricing formula, LWM knows which CSRD disclosure fields are affected, which ETS sectors see cost changes, and which customer reports need regeneration. This cross-regulatory reasoning is what separates it from generic AI assistants that treat each regulation as an isolated document.

The model runs locally on NVIDIA Grace Blackwell hardware with zero cloud dependency. All inference happens on-premises using TensorRT-LLM for optimized performance. For edge deployments, quantized models run on NVIDIA Jetson Orin Nano with sub-10ms inference latency for real-time sensor data processing.

LWM is continuously trained on proprietary industrial data from deployment sites, creating a compounding data advantage that cannot be replicated by competitors without equivalent field deployments.

**NVIDIA Technologies Used:**

- NVIDIA Grace Blackwell (GB10 SoC) — primary inference compute
- TensorRT-LLM — optimized model serving
- NVIDIA Jetson Orin Nano — edge inference (quantized models, <10ms latency)
- CUDA — model training and fine-tuning acceleration

**Why This Matters to NVIDIA Partners:**
LWM is not a standalone product — it is the intelligence layer that OEMs and system integrators get when they deploy DWS IQ 6 on NVIDIA hardware. It demonstrates that NVIDIA infrastructure can run domain-specific AI that replaces expensive human expertise (regulatory consultants, compliance officers, audit firms), not just generic chatbots.

**Intellectual Property:** Proprietary to Lifetime Oy. Not available as a standalone API. Delivered exclusively as part of DWS IQ 6 deployments on NVIDIA infrastructure.

**Website:** https://dws10.com/lifetime-fleet/nvidia-isv/

---

## Product 3: Firehorse Report V2 — Forensic Compliance Auditing

**Product Name:** Firehorse Report V2 — Forensic AI for Sovereign Compliance Auditing

**Category:** Enterprise Software / AI / Construction Compliance / Digital Twin

**One-Line Description:**
Generates 1,000+ page forensic compliance audits in 75 seconds using NVIDIA Aerial Omniverse, Cosmos, and TensorRT-LLM — replacing 2–4 week manual audits at a fraction of the cost.

**Full Description:**
Firehorse Report V2 is a forensic compliance auditing platform built entirely on the NVIDIA AI stack. It transforms construction site sensor data into audit-ready compliance reports — generating what takes manual audit firms 2–4 weeks in 75 seconds.

The system uses NVIDIA Aerial Omniverse to reconstruct city-scale construction sites from 5G sensor data into verifiable digital twins. NVIDIA Cosmos fills data gaps (sensor downtime, blind spots) with predictive world-states. Llama 3 70B NIM performs forensic pattern recognition across the site timeline, and TensorRT-LLM generates the final 1,000+ page report with embedded charts, photographic evidence, and carbon calculations.

Every reconstruction is verified: VLM-Llama visual grounding cross-checks the digital twin against actual site photographs, ensuring the report reflects reality, not assumptions. The entire pipeline runs on-premises on an Acer GN-100 (NVIDIA GB10 Grace Blackwell SoC), with zero data leaving the customer's network.

**NVIDIA Technologies Used:**

- NVIDIA Aerial Omniverse — city-scale digital twin reconstruction
- NVIDIA Aerial CUDA Accelerated RAN — 5G sensor data capture and processing
- NVIDIA Cosmos — predictive world-state generation for data gap filling
- Llama 3 70B Instruct NIM — forensic pattern recognition
- TensorRT-LLM — high-speed report generation (<75 seconds for 1,000+ pages)
- CV-CUDA — computer vision acceleration for site image processing
- VLM-Llama — visual grounding for digital twin verification
- NVIDIA Jetson Orin Nano — real-time edge sensor fusion at construction sites

**Performance:**

- 75-second forensic compliance audit (vs. 2–4 weeks manual)
- 1,000+ page output with embedded evidence
- 100% on-premises processing (zero cloud dependency)
- Sub-10ms edge control loop (Jetson Orin Nano)

**Target Market:**
European construction firms subject to Fit for 55 compliance audits. Secondary markets: insurance forensics, regulatory authorities, infrastructure operators.

**Pricing:**

- Per-audit: €15,000 per forensic compliance audit
- Annual subscription: €25,000 per site per year (unlimited audits)
- Enterprise license: €250,000 per year (unlimited sites, white-label option)

**Quantified Customer Impact:**

- €150,000 annual savings vs. manual audit firms (€50k × 3 audits/year)
- 95% reduction in audit turnaround time
- Zero data sovereignty risk (fully on-premises)

**Website:** https://dws10.com/products/firehorse-reports.html

---

## Co-Sell Positioning for NVIDIA Go-To-Market

**The pitch to NVIDIA's sales team:**

When an OEM or system integrator deploys NVIDIA hardware into EU-regulated industry, they face a regulatory gap: the hardware works, but the customer can't legally deploy it without EU AI Act Article 12 logging, CSRD compliance reporting, and Fit for 55 emissions tracking.

DWS IQ 6 + LWM + Firehorse Report V2 closes that gap. One integration gives the OEM:

- **Compute certification** (NVIDIA hardware stack)
- **Regulatory certification** (EU compliance layer)
- **Audit-ready evidence** (forensic reporting)

This turns a hardware sale into a hardware + software + compliance deal. Higher ASP for the OEM, stickier deployment for NVIDIA.

**Co-sell triggers:**

- Customer mentions "EU compliance" or "Fit for 55"
- Construction, logistics, or manufacturing vertical
- On-premises or sovereign AI requirement
- Digital twin deployment needing regulatory wrapper

---

## Product 4: Control Room — Sovereign Edge AI Hardware Bundle

**Product Name:** Control Room — Acer Veriton GN100 + NVIDIA Model Install

**Category:** Hardware / Edge AI / Sovereign Infrastructure

**One-Line Description:**
Turnkey sovereign edge AI: 1× Acer Veriton GN100 (NVIDIA GB10 Grace Blackwell) + on-site NVIDIA model installation. €4,994 — operational the day we leave the building.

**Full Description:**
Control Room is the entry SKU for sovereign EU edge AI deployments. One Acer Veriton GN100 (NVIDIA GB10 Grace Blackwell SoC, 20 cores, 120 GiB unified memory) ships pre-imaged with Ubuntu 24.04 LTS, Docker, OpenSandbox isolation, and the CUDA + NVIDIA driver stack. A Lifetime engineer arrives on-site, validates drivers, installs the customer's chosen NVIDIA model bundle (Qwen 2.5 72B QLoRA, Llama 3.1 8B, Whisper-large-v3, BGE-M3, optional YOLOv8-s), tests end-to-end inference, brings the local MCP endpoint online, and signs the install protocol. Front-line operators get a 30-minute drill before we leave.

**NVIDIA Technologies Used:**

- NVIDIA GB10 Grace Blackwell SoC (in the Acer Veriton GN100)
- CUDA Toolkit + NVIDIA drivers
- TensorRT-LLM (production inference kernels)
- NVIDIA-optimised Qwen / Llama / Whisper / BGE-M3 / YOLOv8 model weights (AWQ / GGUF Q4-K-M)
- NVIDIA NIM-style microservices (optional, packaged in Sovereign Model Updates subscription)

**Full Service (Bundled with Every Deployment):**

- Operator training — on-site drill at install + remote refreshers
- 24/7 technical support — named Lifetime contact, SLAs under the subscription
- Warranty servicing — hardware warranty handling, swap-out coordination
- Remote configuration — push model bundle changes, security patches, OS updates over secure tunnel

**Target Buyers:**
VPK (vapaapalokunta) operations rooms · construction site office command · municipal control rooms · regulated SME compliance teams (CSRD / CBAM / Article 12 evidence)

**Pricing:** €4,994 one-time (€3,999 hardware + €995 NVIDIA model install). Recurring: Sovereign Model Updates Subscription €299/mo (LLM updates + 24/7 support + warranty + remote configuration).

**Website:** https://dws10.com/products/edge-node-gn100.html

---

## Product 5: Situation Room — Sovereign Dual-Use Hardware Bundle

**Product Name:** Situation Room — 2× Acer Veriton GN100 Bridged + NVIDIA Model Bundle

**Category:** Hardware / Edge AI / Sovereign Infrastructure / Dual-Use

**One-Line Description:**
Bridged sovereign edge AI: 2× Acer Veriton GN100 with NVIDIA tensor-parallel inference + wider NVIDIA model bundle (vision, acoustic, language, reasoning, voice). €8,993 turnkey — built for dual-use scenarios like VPK drone defense.

**Full Description:**
Situation Room scales Control Room to the bridged pair: two Acer Veriton GN100 nodes (NVIDIA GB10 Grace Blackwell SoC each, 40 cores / 240 GiB unified memory combined) joined into a single inference cluster. Heavy 70B-class models (Qwen 2.5 72B, Llama 3.1 70B) shard across the NVIDIA bridge via TensorRT-LLM tensor parallel; light models (Whisper, BGE, YOLOv8-x, BirdNET-class acoustic, TTS) replicate for failover. A single MCP endpoint serves all clients on the internal network. Article 12 immutable logs replicate across both NVIDIA nodes for inspector handover.

Built and validated for dual-use scenarios — the lead use case is a Finnish volunteer fire brigade (VPK) running drone-defense detection-to-decision out of the kalustohalli, fully sovereign, no cloud round-trip.

**NVIDIA Technologies Used:**

- 2× NVIDIA GB10 Grace Blackwell SoC (bridged pair)
- CUDA + TensorRT-LLM with multi-GPU tensor parallel
- NVIDIA-optimised vision models (YOLOv8-x → YOLOv9/10)
- NVIDIA-optimised acoustic event models (BirdNET-class)
- Whisper-large-v3 (NVIDIA-optimised), TTS (Piper/Coqui on NVIDIA kernels)
- NVIDIA NIM-style microservices packaging (Sovereign Model Updates subscription)

**Full Service (Bundled with Every Deployment):**

- Operator training — on-site drill at install, dual-use scenario rehearsal of customer's choice, runbook handover
- 24/7 technical support — named Lifetime contact, SLAs covered under the subscription
- Warranty servicing — hardware warranty handling on both nodes, swap-out coordination
- Remote configuration — push bundle updates, patches, OS updates over secure tunnel to both NVIDIA nodes

**Target Buyers:**
VPK dual-use / civil defence operators · CER / NIS2-regulated critical infrastructure · municipal situation rooms · defence-adjacent EU SMEs · regulated industries with CSRD + dual-use export-control exposure

**Pricing:** €8,993 one-time (2× €3,999 hardware + €995 NVIDIA model install for the bridged pair). Recurring: Sovereign Model Updates Subscription €299/mo per site.

**Website:** https://dws10.com/products/situation-room.html

---

## Product 6: NVIDIA Model Installation — Per Edge Device

**Product Name:** NVIDIA Model Installation — Per Edge Device

**Category:** Services / Edge AI Deployment

**One-Line Description:**
On-site installation service for the NVIDIA model stack on a single edge device — CUDA, drivers, model bundle of choice, OpenSandbox isolation, MCP endpoint. €995 per device.

**Full Description:**
The standalone install service for customers adding nodes to an existing Lifetime Fleet, customers with NVIDIA-capable hardware they want the DWS IQ sovereign model stack deployed onto, or customers switching bundles on an existing device. The €995 fee covers a Lifetime engineer on-site (within Finland; EU travel quoted separately), CUDA + NVIDIA driver validation, model bundle install (Qwen, Llama, Whisper, BGE, YOLOv8, acoustic, TTS, or custom), OpenSandbox isolation, local MCP endpoint, first inference sanity check, Article 12 logging initialisation, and a signed install protocol.

**NVIDIA Technologies Used:**

- CUDA Toolkit + NVIDIA drivers (validated, locked at known-good revision)
- TensorRT-LLM inference kernels
- NVIDIA-optimised model weights (AWQ / GGUF Q4-K-M)
- NVIDIA NIM-style microservices packaging (optional)

**Pricing:** €995 per edge device. Already included in Control Room and Situation Room.

**Website:** https://dws10.com/products/nvidia-model-install.html

---

## Portal Profile Checklist

- [ ] Upload product descriptions (all six)
- [ ] Add Lifetime Oy company details
- [ ] Upload product screenshots / architecture diagrams
- [ ] Set target industries (construction, logistics, manufacturing, civil defence, VPK / dual-use)
- [ ] Set deployment regions (EU, Nordic)
- [ ] Add contact: risto@lifetime.fi
- [ ] Request co-marketing review from NVIDIA team
- [ ] Link Inception Sovereign EU Edge AI track application to portal profile

---

**Company:** Lifetime Oy
**Contact:** Risto Paarni, CEO — risto@lifetime.fi
**Portal:** https://partners.nvidia.com
**ISV Status:** Approved (2026-03-08)
**Inception Applications:** LWM V1 · Firehorse V2 · Sovereign EU Edge AI v1.1 (in preparation, 2026-07-05 — includes NPN reseller authorization ask)
