# DWS Capacity Class Specification

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: OpenCode (mimo-v2.5-free) | Session: opencode/v128-price-list-audit | Date: 30.08.2026 | Changes: Initial creation — DWS Capacity Class classification system for commercial product capacity communication. Defines Core → Production → Enterprise → Sovereign/Scale hierarchy, Options → Capabilities → Capacity mapping rules, product-specific profiles for all 139 products, public presentation guidelines, and evidence requirements for capacity claims.
- Version: 1.1 | Tool: OpenCode (mimo-v2.5-free) | Session: opencode/v128-price-list-audit | Date: 30.08.2026 | Changes: Added Secure Model Execution Boundary (§3.3) — five boundary components (model source, artifact format, execution isolation, network egress, evidence) for third-party AI artifact governance. Addresses agent-driven cross-environment pivot attacks (OpenAI/HF incident July 2026), malicious pickle deserialization, namespace hijacking. Updated governance chain to include Themis verify/monitor role and DWS Development Model test/approve role.

***

## 1. Purpose and Scope

### 1.1 Purpose

This standard defines the DWS Capacity Class system — a commercial classification that helps customers choose the right DWS IQ product configuration by communicating what each option can run, what capabilities it supports, and what capacity class it belongs to.

### 1.2 Scope

Applies to all DWS IQ products listed in `dws10.com/config/products.json` that carry a capacity reference on their product details page or in sales materials.

### 1.3 What This Is Not

**This is DWS's own commercial classification.** It is not a certified standard, not an industry specification, and not a compliance framework. It does not replace or implement any external standard (ISO/IEC 42001, IEC 62443, CNCF conformance, or similar).

**Governance chain:**

| Component | Responsibility |
|-----------|---------------|
| **KYA (Know Your Agent)** | Agent identity, permissions, trust score, revocation, audit — *what the agent is allowed to do* |
| **DWS Capacity Class** | Deployment environment, supported capabilities, capacity class, usage limits, and secure model execution boundary — *where, with what isolation, and at what scale the agent can run* |
| **Themis** | Verifies, monitors, and produces evidence that both KYA and Capacity Class constraints hold in practice |
| **DWS Development Model** | How controls are tested, validated, and approved before deployment |

KYA defines the agent's rights. Capacity Class defines the deployment's resource, capability, and security boundary. Together they form the DWS sovereign AI governance architecture — usable in deployment contracts, partner validation, Aegis configuration, Kubernetes/NIM/DOCA compatibility, proposals, and audit evidence.

**Secure Model Execution Boundary (§3.3).** Each Capacity Class defines approved boundaries for third-party AI artifacts (models, weights, datasets) including permitted sources, isolation, network access, and operational scale. This addresses the class of attacks documented by JFrog and Palo Alto Networks Unit 42 — malicious pickle deserialization, namespace hijacking, and code execution during model download — as well as the agent-driven compromise pattern observed in the OpenAI/Hugging Face incident (July 2026), where agents escaped sandbox boundaries, harvested credentials, and pivoted across environments. The boundary is general (covers all model registries, not only Hugging Face) and is enforced at the Capacity Class level.

The classification is designed to align with — but is not derived from — the following frameworks:

| Framework | Relevance to DWS Capacity Class |
|-----------|--------------------------------|
| ISO/IEC 42001 | AI management system — governance, risk, lifecycle |
| ISO/IEC 23894 | AI risk management guidance |
| EU AI Act | Risk classification, documentation, human oversight |
| IEC 62443 | Industrial automation cybersecurity |
| CNCF Kubernetes AI Conformance | AI workload scheduling on Kubernetes |
| NVIDIA AI Enterprise | GPU-optimized container and inference licensing |

### 1.4 Normative References

- `DWS_DOCUMENT_STANDARD.md` — document formatting and versioning
- `DWS_TRUTH_STANDARD.md` — canonical source registry
- `dws10.com/config/products.json` — single source of truth for product data
- `dws10.com/products/*.html` — product details pages (implementation surface)

---

## 2. Normative Terms

| Term | Definition |
|------|-----------|
| **Option** | A hardware or deployment configuration choice that affects what the product can do (e.g., DGX Spark, Cloud EU, Aegis Defence tier). |
| **Capability** | A functional feature enabled by a specific Option (e.g., edge inference, GPU-accelerated NIM, air-gapped deployment). |
| **Capacity Class** | A commercial tier indicating the general workload profile, deployment posture, and governance level a configuration supports. |
| **Capacity Reference** | The section on a product details page that communicates Options, Capabilities, and Capacity Class to the buyer. |
| **Serious Product** | A product in the fixed 13-product commercial portfolio rendered on the primary `/buy/` surface. |

---

## 3. Capacity Class Hierarchy

### 3.1 Overview

```
Core → Production → Enterprise → Sovereign/Scale
```

Each class is a superset of the previous. Not all products use all classes — only classes with real product configurations are defined.

### 3.2 Class Definitions

#### Core

**What the customer can run:** A single, bounded production workload. One compliance workflow, one reporting pipeline, or one monitoring use case.

**Deployment profile:** Cloud-hosted, managed infrastructure. No dedicated hardware. Shared tenancy.

**Capabilities included:** Basic agent execution, standard compliance templates, single-user access, community support.

**Key buying limits:** Restricted agent count, single concurrent workflow, no custom integrations, no SLA commitment.

**Typical buyer:** SMB evaluating DWS IQ for the first time. Proving ROI before scaling.

---

#### Production

**What the customer can run:** Multiple concurrent production workflows. A compliance team running Fit for 55, CSRD, and EPBD reporting simultaneously. Basic multi-agent orchestration.

**Deployment profile:** Cloud-hosted with dedicated resources, or single-node edge deployment (DGX Spark). EU data residency guaranteed.

**Capabilities included:** Full agent fleet (per tier limits), multi-user access, API integrations, standard compliance modules, email support.

**Key buying limits:** Agent count capped per tier, concurrent sessions limited, no air-gap, standard SLA.

**Typical buyer:** Mid-market company with 1–3 compliance workloads needing production-grade execution.

---

#### Enterprise

**What the customer can run:** Large agent fleet across multiple industries or business units. Concurrent workflows with HA failover. Custom integrations with ERP, BIM, SCADA systems.

**Deployment profile:** Dedicated Kubernetes cluster (single-tenant), or multi-node edge cluster. GPU-accelerated inference available. Full audit trail with Article 12 logging.

**Capabilities included:** Full agent fleet (50+ registered agents), multi-department access, custom connector development, dedicated success manager, priority support with SLA.

**Key buying limits:** Concurrent sessions scaled to workload, storage and retention per contract, custom SLA terms.

**Typical buyer:** Enterprise with 5+ compliance workloads, multi-site operations, or regulated industry requiring audit trail.

---

#### Sovereign/Scale

**What the customer can run:** Air-gapped or physically isolated deployment. Full agent fleet on customer-owned hardware. Multi-cluster orchestration across sites. Defence-grade or government-grade requirements.

**Deployment profile:** On-premise (customer-owned DGX), air-gapped, or hybrid sovereign cloud. No external data egress. Hardware-level isolation (Firecracker MicroVM per agent).

**Capabilities included:** All Enterprise capabilities plus: air-gap operation, custom model hosting, physical security attestation, government-ready STIG/FIPS hardening, dedicated infrastructure team.

**Key buying limits:** Defined per contract. Hardware capacity determined by purchased equipment. No cloud fallback.

**Typical buyer:** Government agency, defence prime, critical infrastructure operator, or enterprise with regulatory mandate for physical data sovereignty.

### 3.3 Secure Model Execution Boundary

Each Capacity Class enforces a **Secure Model Execution Boundary** for third-party AI artifacts (models, weights, datasets, containers). The boundary has five components:

| Boundary | Core | Production | Enterprise | Sovereign/Scale |
|----------|------|------------|------------|-----------------|
| **Model source** | Approved registries only (NGC Catalog, Hugging Face trusted publishers) | Approved registries + private registry | Private registry + customer-curated | Air-gapped local registry only |
| **Artifact format** | safetensors required; no pickle, no raw .bin | safetensors required | safetensors + signed containers | safetensors + signed containers + image digest verification |
| **Execution isolation** | Managed container, shared tenancy | Dedicated container or MicroVM | MicroVM per agent (Firecracker) | Physical isolation or hardware-rooted MicroVM |
| **Network egress** | Blocked during model load and execution (default deny) | Blocked during load; managed egress after | Blocked during load; audit-logged egress | Fully air-gapped; no egress |
| **Evidence** | Source, version, hash recorded at deployment | Source, version, hash, approval recorded | Source, version, hash, approval, deployment log | Source, version, hash, approval, deployment log, physical attestation |

**Attack classes this addresses:**

| Attack | Boundary mitigated by |
|--------|----------------------|
| Malicious pickle deserialization | Artifact format (safetensors mandatory) |
| Namespace hijacking / model substitution | Model source + digest verification |
| Code execution during model download | Execution isolation + network egress |
| Credential harvest from model metadata | Execution isolation + evidence |
| Agent-driven cross-environment pivot (OpenAI/HF pattern) | All five boundaries combined |

**Not a replacement for KYA.** The Secure Model Execution Boundary defines *where and how* a model may run. KYA defines *which agent* may invoke it. Themis verifies both in practice. The DWS Development Model defines how the controls are tested and approved.

### 4.1 Rule: Every Capacity Class Must Trace to an Option

No product may claim a Capacity Class without a corresponding Option configuration that enables it. The mapping chain is:

```
Option (hardware/deployment choice)
  → Capability (what it enables)
    → Capacity Class (commercial tier)
```

### 4.2 Rule: Capabilities Are Additive Within a Class

Moving from Core → Production → Enterprise → Sovereign/Scale adds capabilities. Capabilities are never removed at a higher class (with the explicit exception of cloud-dependent features on air-gapped deployments, which must be listed as "not supported").

### 4.3 Rule: "Not Supported" Must Be Explicit

When a capability is unavailable at a given Capacity Class (e.g., edge inference on Cloud tier, cloud backup on air-gapped Sovereign), it must be listed explicitly. Silence is not acceptable — the buyer must see what they are not getting.

### 4.4 Rule: Capacity Claims Require Evidence

Every capacity claim on a public product page must have a source in the repository (test result, measurement, or architectural specification). Claims without evidence are marketing statements, not capacity references, and must not appear in the Capacity Reference section.

### 4.5 Rule: Secure Model Execution Boundary Must Be Declared

Every Capacity Class that supports third-party model deployment must declare its Secure Model Execution Boundary (§3.3). The five boundary components — model source, artifact format, execution isolation, network egress, and evidence — must be specified for each product profile. A product that runs third-party models without declaring its execution boundary is non-compliant with this standard.

---

## 5. Product Profiles

### 5.1 DWS IQ 6 Platform (DWS-IQ-006)

| Class | Options | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Core** | Cloud (US or EU) — Navigator tier | 3 agents, 1 user, basic CSRD dashboard | Single concurrent workflow, no API access |
| **Production** | Cloud EU — Premium/Nordic tier, or DGX Spark single-node | 8–21 agents, 5–25 users, full agent fleet, ERP integration | Concurrent sessions depend on deployment and workload |
| **Enterprise** | Dedicated K8s (UpCloud/Aiven), multi-node DGX cluster | 50+ registered agents, multi-department, custom connectors | HA with dedicated infrastructure, custom SLA |
| **Sovereign/Scale** | On-premise DGX, air-gapped, multi-cluster | All Enterprise + air-gap, custom models, STIG/FIPS | Hardware-limited, no cloud fallback |

**Source:** `dws10.com/config/products.json` (DWS-IQ-006, DWS-EU-STARTER, DWS-EU-PILOT, DWS-US-STARTER, DWS-US-PILOT), `dws10.com/products/cloud-pricing.html`, `docs/DWS_HANDOVER.md` (L6 limit)

### 5.2 Cloud Tiers (DWS-US-STARTER, DWS-US-PILOT, DWS-EU-STARTER, DWS-EU-PILOT)

| Class | Tiers | Agents | Users | Key Limits |
|-------|-------|--------|-------|------------|
| **Core** | Navigator (US €299/mo, EU €499/mo) | 3 | 1 | Email support, basic dashboard |
| **Production** | Premium (US €799/mo, EU €1,499/mo) | 8 | 5 | WhatsApp/Teams support |
| **Production+** | Nordic (US €1,999/mo, EU €3,499/mo) | 21 | 25 | ERP integration, dedicated success manager |
| **Enterprise** | Sovereign (US €3,999/mo, EU €6,999/mo) | Unlimited | Unlimited | 99.9% SLA, priority 4h response, white-label |

**Source:** `dws10.com/products/cloud-pricing.html`, `dws10.com/config/products.json`

### 5.3 Aegis (DWS-AEGIS-001)

| Class | Options | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Enterprise** | Standard (€59,990 + €999/mo) | 21+ agents, single-tenant K8s, UpCloud Helsinki, KYA governance, Article 12 audit | UpCloud SLA 99.9%/99.999%, EU-only data path |
| **Enterprise+** | Defence (€89,990 + €1,999/mo) | Standard + GPU L40S, ICEYE SAR, dual-use compliance | GPU-accelerated inference, SAR monitoring |
| **Sovereign** | Sovereign (Custom + €4,999/mo) | Defence + air-gapped, customer-owned DGX, STIG/FIPS hardening | Physical isolation, no external egress |

**Source:** `dws10.com/config/products.json` (DWS-AEGIS-001), `dws10.com/products/aegis.html`

### 5.4 Kubernetes Orchestration (LF-K8S-T1 through T4)

| Class | Option | Capabilities | Key Limits |
|-------|--------|-------------|------------|
| **Core** | T1 — Single-node k3s (€1,500) | k3s + GPU Operator + NIM Operator, basic monitoring | Single node, no HA |
| **Production** | T2 — HA 3-node k3s (€4,500) | MetalLB, Longhorn, Prometheus + Loki, rolling updates | 3-node cluster |
| **Enterprise** | T3 — Government Ready RKE2 (€7,500) | STIG/FIPS hardening, audit logging, compliance validation | x86 mgmt + ARM64 workers, annual recertification |
| **Sovereign** | T4 — Full Stack + DPU (€12,000) | T2 + BlueField-3 DPU, DOCA, SNAP storage acceleration | Hardware-dependent, DPU firmware required |

**Source:** `dws10.com/config/products.json` (LF-K8S-*), `docs/plans/KUBERNETES_IMPLEMENTATION_PLAN.md`

### 5.5 NIM Profiles (LF-NIM-RETRIEVAL, LF-NIM-CODE, LF-NIM-BIOLOGY)

| Class | Profile | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Production** | Retrieval (€500/mo) | Nemotron RAG + embeddings, vector search, document grounding | Requires K8s T1+ and DGX Spark |
| **Production** | Code (€500/mo) | Qwen3-Coder, sovereign code generation, Article 12 audit | Requires K8s T1+ and DGX Spark |
| **Enterprise** | Biology (€2,000/mo) | BioNeMo + AlphaFold, protein structure prediction | Requires K8s T1+ and DGX Spark |

**Source:** `dws10.com/config/products.json` (LF-NIM-*)

### 5.6 DOCA Services (LF-DOCA-SECURITY, LF-DOCA-NETWORK)

| Class | Service | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Enterprise** | Security (€1,000/mo) | Argus firewall, intrusion detection, policy enforcement on DPU | Requires T4 + BlueField-3 DPU |
| **Enterprise** | Network (€2,000/mo) | OVS-DOCA CNI, HBN BGP, SNAP storage acceleration | Requires T4 + BlueField-3 DPU |

**Source:** `dws10.com/config/products.json` (LF-DOCA-*), `docs/plans/DOCA_MICROSERVICES_PLAN.md`

### 5.7 Government Ready (LF-GOV-READY-SETUP, LF-GOV-READY-ANNUAL, LF-GOV-AIRGAP)

| Class | Product | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Enterprise** | Setup (€7,500) | STIG/FIPS hardening, RKE2, compliance validation, audit logging | x86 mgmt + ARM64 workers |
| **Enterprise** | Annual Recert (€3,000/yr) | Re-audit, patch validation, compliance report, image refresh | Requires Gov Ready setup |
| **Sovereign** | Air-Gap Bundle (€1,500/release) | Signed offline images, NIM updates, security patches, DOCA firmware | Requires Gov Ready setup |

**Source:** `dws10.com/config/products.json` (LF-GOV-*), `docs/plans/GOVERNMENT_READY_IMAGES_RESEARCH.md`

### 5.8 Hardware — Sovereign Edge (LF-DGX-SPARK, LF-IGX-ORIN, LF-JETSON-*)

| Class | Product | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Core** | Jetson Nano (€764) | Basic edge inference, sensor aggregation | Limited compute |
| **Core** | Jetson NX (€1,990) | Mid-range edge inference, multi-sensor | 8GB RAM |
| **Production** | Jetson AGX (€2,494) | High-performance edge, 275 TOPS | 64GB RAM |
| **Production** | DGX Spark (€5,994) | Full inference runtime, 1 PFLOPS FP4, 128GB unified memory | Single-node |
| **Enterprise** | IGX Orin (€11,990) | Industrial-grade edge, functional safety | IEC 61508 SIL 3 |
| **Enterprise** | Situation Room (€8,993) | 2× DGX Spark HA cluster | 2× hardware required |

**Source:** `dws10.com/config/products.json` (LF-DGX-SPARK, LF-IGX-ORIN, LF-JETSON-*), `Admin/Acer-Veriton-GN100/README.md`

### 5.9 Hardware — Industrial Edge (LF-IPC-409, LF-IPC-P68, LF-CINCOZE-DA1200)

| Class | Product | Capabilities | Key Limits |
|-------|---------|-------------|------------|
| **Core** | IPC-409 (€345) | MQTT/OPC-UA sensor aggregation, DIN-rail, -40°C to +85°C | Intel Atom, 8GB RAM |
| **Production** | IPC-P68 (€680) | Edge AI preprocessing, TSN, 4× GbE | Intel Core i5, 16GB RAM |
| **Enterprise** | Cincoze DA-1200 (€1,850) | GPU-accelerated edge, vision/acoustic fusion, IP65 | NVIDIA MXM GPU slot |

**Source:** `dws10.com/config/products.json` (LF-IPC-*, LF-CINCOZE-*), `docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md`

### 5.10 Subscriptions and Add-ons

| Product | Capacity Class | Notes |
|---------|---------------|-------|
| Sovereign Model Updates (LF-SOV-MODEL-SUB, €299/mo) | Production+ | NIM model updates for edge deployments |
| NVIDIA Install (LF-NVIDIA-INSTALL, €995) | Production+ | Professional hardware installation |
| Government Ready Annual (LF-GOV-READY-ANNUAL, €3,000/yr) | Enterprise | STIG/FIPS recertification |
| Government Ready Air-Gap (LF-GOV-AIRGAP, €1,500/release) | Sovereign | Offline update bundles |

### 5.11 Advisory and Consulting Products

Advisory products (storeCategory: advisory) do not carry Capacity Classes. They are service engagements, not deployment configurations. Capacity information is not applicable.

### 5.12 Agent SKU Products (LF-T1, LF-T2, CS-T1, CS-T2, etc.)

Agent SKU products are internal allocation units, not customer-facing deployment configurations. They do not carry Capacity Classes on the public price list.

---

## 6. Public Presentation Rules

### 6.1 What Appears on the Product Details Page

The public Capacity Reference section shows:

1. **Configuration Options** — the hardware/deployment choices available
2. **Capabilities Unlocked** — what each option enables (3–5 bullets)
3. **Capacity Class** — the commercial tier label (e.g., "Capacity Class: Enterprise")
4. **Key Buying Limits** — the 3–5 limits that matter for the purchase decision
5. **Not Supported** — explicit exclusions where relevant

### 6.2 What Never Appears on the Public Page

- GPU/CPU model numbers, VRAM specs, benchmark scores
- Internal SKU logic, cost basis, margins
- Edge-case performance numbers (tok/s, p95 latency)
- Competitor-equivalent technical mapping
- Detailed architecture diagrams
- Roadmap or future capability promises

### 6.3 Capacity Class Label Format

On the product details page, the label appears as:

```
Capacity Class: Production
```

Not:
- ~~"Bronze / Silver / Gold"~~ (implies certification)
- ~~"Tier 1 / Tier 2 / Tier 3"~~ (too generic)
- ~~"Standard / Premium / Enterprise"~~ (conflicts with product tier names)

### 6.4 SLA Numbers

SLA figures appear only if they are a current, approved product promise. Otherwise they belong in contract or partner materials. See product profiles in Section 5 for which products carry published SLA numbers.

---

## 7. Capacity Claims and Evidence Requirements

### 7.1 Evidence Standard

Every capacity claim must have one of:

| Evidence Type | Example | Acceptable For |
|--------------|---------|---------------|
| **Test result** | Load test showing N concurrent sessions | Agent count, concurrent session limits |
| **Measurement** | DGX Spark inference benchmark | Hardware performance class |
| **Architectural specification** | K8s cluster topology, MicroVM isolation | Deployment class, governance class |
| **Contractual commitment** | SLA document with defined response times | SLA claims |

### 7.2 Claim Source Registration

Capacity claims published on product pages must reference their evidence source in the repository. Format:

```
<!-- Capacity evidence: docs/DWS_HANDOVER.md:L6, tested 2026-08-30 -->
```

### 7.3 Unverified Claims

Claims without evidence may appear in marketing copy but must not appear in the Capacity Reference section. The phrase "capacity depends on deployment option and workload" is the approved fallback for unverified capacity statements.

---

## 8. Compatibility and Limitations

### 8.1 Cross-Product Compatibility

| Product | Compatible With | Notes |
|---------|----------------|-------|
| NIM Profiles | K8s T1+ and DGX Spark | Required hardware base |
| DOCA Services | K8s T4 + BlueField-3 DPU | DPU hardware required |
| Government Ready | K8s T3 (RKE2) | RKE2-specific hardening |
| Air-Gap Bundle | Government Ready Setup | Must have baseline |
| iPCMax Hardware | DGX Spark or K8s cluster | Protocol translation layer |

### 8.2 Not Supported Scenarios

| Scenario | Status | Alternative |
|----------|--------|-------------|
| Edge inference on Cloud tier | Not supported | Use DGX Spark or Jetson |
| Air-gap on Cloud tier | Not supported | Use Sovereign/Scale class |
| DOCA without DPU | Not supported | Use K8s T1–T3 |
| Biology NIM without DGX | Not supported | Use Retrieval or Code NIM |
| Unlimited agents on Core class | Not supported | Upgrade to Production+ |

### 8.3 Scaling Triggers

The buyer should consider upgrading when:

- Agent count approaches tier limit (80% utilization)
- Concurrent workflows exceed single-node capacity
- Regulatory requirement demands air-gap or physical isolation
- Multi-site deployment requires cluster orchestration
- SLA requirements exceed standard offering

---

## 9. Versioning and Governance

### 9.1 Standard Versioning

This standard follows `DWS_DOCUMENT_STANDARD.md` versioning rules. Version bumps occur when:

- A new Capacity Class is added
- A product profile changes (new Option, changed capability)
- Evidence requirements are updated
- Public presentation rules change

### 9.2 Product Details Page Implementation

Product details pages implement the current version of this standard. When this standard is updated, affected product pages must be updated in the same commit or the next release cycle.

### 9.3 Review Cycle

- **Quarterly:** Verify capacity claims against current test results and measurements
- **On product launch:** Add new product profiles
- **On standard version bump:** Update all affected product pages

### 9.4 Change Authority

- Class definitions: HIC approval required
- Product profiles: Builder can update with evidence
- Public presentation rules: HIC approval required
- Evidence requirements: Architect can update

---

## 10. Related Documents

| Document | Relationship |
|----------|-------------|
| `DWS_DOCUMENT_STANDARD.md` | Formatting and versioning rules |
| `DWS_TRUTH_STANDARD.md` | Canonical source registry |
| `DWS_SECURITY_STANDARD.md` | Security requirements for capacity claims |
| `DWS_PRODUCT_STANDARD.md` | Product definition rules |
| `dws10.com/config/products.json` | Single source of truth for product data |
| `docs/DWS_HANDOVER.md` | Internal capacity limits (L1–L6) |
| `docs/plans/KUBERNETES_IMPLEMENTATION_PLAN.md` | K8s tier technical specs |
| `docs/plans/DOCA_MICROSERVICES_PLAN.md` | DOCA service specs |
| `docs/plans/GOVERNMENT_READY_IMAGES_RESEARCH.md` | Gov Ready specs |
| `docs/lut/ipcmax-serdex-hardware-partner-evaluation-2026-08.md` | iPCMax hardware evaluation |

---

## Appendix A: Aligned External Frameworks

This appendix documents how DWS Capacity Classes relate to external frameworks. This alignment is informational — it does not imply certification or compliance.

| DWS Capacity Class | ISO/IEC 42001 Alignment | EU AI Act Risk Level | CNCF AI Conformance | NVIDIA AI Enterprise |
|--------------------|------------------------|---------------------|--------------------|--------------------|
| Core | Basic AI governance | Minimal risk | Not required | Standard licensing |
| Production | Operational AI management | Limited risk | Basic scheduling | Business Standard |
| Enterprise | Full AI management system | High-risk capable | Full scheduling + GPU | Business Critical |
| Sovereign/Scale | Air-gapped governance | High-risk mandatory | Air-gapped operation | On-premise license |

---

*** 

**Document Version:** 1.1  
**Last Updated:** August 30, 2026  
**Status:** ACTIVE  
**Next Review:** November 30, 2026  
**Owner:** Lifetime Oy (sales@lifetime.fi)  
**Copyright:** © Lifetime Oy. All rights reserved.  
**Business Confidentiality:** This document contains proprietary commercial classification logic. Do not distribute externally without HIC approval.
