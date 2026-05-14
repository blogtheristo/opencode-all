# NVIDIA Connect Portal — Product Descriptions

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-03-08
Author: Claude Code (Opus 4.6)
Reviewed by: Risto Paarni
Status: Draft — ready for portal submission
Changes: Initial three-product portfolio for NVIDIA Connect portal

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
Proprietary industrial knowledge base and inference engine that maps 15,000+ EU regulatory documents across 16 verticals — the intelligence layer underneath DWS IQ 6, running on NVIDIA GPU infrastructure.

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

## Portal Profile Checklist

- [ ] Upload product descriptions (all three)
- [ ] Add Lifetime Oy company details
- [ ] Upload product screenshots / architecture diagrams
- [ ] Set target industries (construction, logistics, manufacturing)
- [ ] Set deployment regions (EU, Nordic)
- [ ] Add contact: risto@lifetime.fi
- [ ] Request co-marketing review from NVIDIA team

---

**Company:** Lifetime Oy
**Contact:** Risto Paarni, CEO — risto@lifetime.fi
**Portal:** https://partners.nvidia.com
**ISV Status:** Approved (2026-03-08)
