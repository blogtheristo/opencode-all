---
title: "DWS IQ Aegis"
price: "59990.00"
currency: "EUR"
sku: "DWS-AEGIS-001"
availability: "preorder"
condition: "new"
google_product_category: "Software > Business & Productivity Software"
image_link: "https://dws10.com/static/images/firehorse-aegis-head.png"
brand: "DWS IQ"
storeCategory: "platform"
type: "one-time"
priceNote: "From €59,990 onboarding + integration, plus €999/mo subscription. 3 tiers: Standard, Defence, Sovereign."
mpn: "DWS-AEGIS-2026"
---

# DWS IQ Aegis

**Sovereign Industrial Intelligence Platform for Dual-Use Manufacturing** — part of the DWS IQ Industrial Intelligence suite

## Product Overview

DWS IQ Aegis is the dual-use factory and critical-manufacturing layer of DWS IQ Industrial Intelligence — a standalone sovereign AI platform covering all 21 EU-regulated industries (including dual-use critical raw materials) for government agencies, military industry enterprises, and the dual-use manufacturing base that supplies Europe's defence sector. It optimizes and secures physical production facilities, not the tactical frontline. It packages sovereignty monitoring, orbital intelligence, agent governance, and EU AI Act compliance into a hardened platform — available exclusively on European cloud or enterprise private cloud.

Named after Athena's shield — Aegis provides protection through intelligence, not just walls.

**Why Aegis exists:** Defence and dual-use supply chains face the same EU compliance obligations as civilian ones (CSRD, CBAM, NIS2, CER Directive, CRM Act) — plus export control, data sovereignty, and dual-use regulation. No platform serves this intersection across all 21 industries with cross-vertical signal propagation. Aegis does.

## Architecture — Two Layers, One Governed Loop

Aegis is a **two-layer** product. The layers solve different problems and are deliberately not served by one model.

| Layer | What it does | How it is served | Status |
| ----- | ------------ | ---------------- | ------ |
| **Physical** — perception → action | Sees the facility and acts on it in real time: scene understanding, intent prediction, machine-vision oversight feeding the Control Room / Situation Room | An **adopted open, on-device world model** (NVIDIA Cosmos 3 Edge class) running on customer-sited edge hardware — not a model DWS pretrains | **Planned** — target 2026 Q4, gated on the on-device evaluation. Not shipped today. |
| **Compliance evidence** — reasoning → record | Turns operations into a court-defensible record: Article 12 logging, reasoning lineage, export-control and climate-compliance assessment | A **separate LLM tier** (open models, EU-served) — a different optimisation problem from real-time perception | **Live** — Article12Logger, ComplianceAgent, SovereigntyMonitor |

**What binds them is the KYA loop** — agent identity, MicroVM isolation, kill authority, private evals and the Article 12 evidence chain. That loop is the part of Aegis that is built on the customer's own operations and cannot be bought off the shelf. The models and the boxes underneath are **components**: adoptable, replaceable, and deliberately not where the defensibility sits. DWS sells the governed outcome layer, not the infrastructure beneath it.

## Agents Included

| Agent              | Capability                                                           | Domain                                |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------- |
| ArgusAgent         | AI orbital target labeling via SAR satellite data                    | Intelligence, supply chain visibility |
| SovereigntyMonitor | CLOUD Act exposure detection, EU data residency verification         | Data sovereignty                      |
| Article12Logger    | EU AI Act audit trails for all AI decisions                          | Regulatory compliance                 |
| KYA Engine         | Know Your Agent — identity verification, isolation, kill authority   | Agent governance                      |
| ComplianceAgent    | Dual-use export control + EU climate compliance                      | Regulatory                            |
| CrossVerticalIntel | Supply chain signal propagation across 21 industries                 | Intelligence                          |
| GaiaAgent          | Cement, lime & earth materials — dual-use critical raw material risk | Industry                              |
| VulcanAgent        | Steel & metals — ETS Phase 4, CBAM carbon declarations               | Industry                              |
| SiteSenseAgent     | Defence construction site safety & logistics                         | Field operations                      |

## Core Capabilities

### Orbital Intelligence (Argus)

- SAR satellite data ingestion and AI labeling (compatible with providers such as ICEYE)
- All-weather, day/night industrial target detection
- 20 DWS industry classifications from orbit
- Change detection alerts for infrastructure monitoring
- Pipeline: AOI → SAR Catalog API → AI labeling → KYA governance → Article 12 audit trail

### Sovereignty Assessment

- CLOUD Act exposure scoring (US vs. EU-sovereign providers)
- Four sovereignty tiers: Sovereign / Compliant / Partial / Exposed
- NIS2 alignment verification
- EU AI Act compliance checks
- Data residency audit trail

### Agent Governance (KYA — Know Your Agent)

- Agent identity verification (Shufti partnership)
- Firecracker MicroVM sandbox isolation
- Kill authority — revoke any agent in real-time
- Forensic observability — full decision audit trail
- Multi-agent control room for fleet oversight

### EU AI Act Article 12 Logging

- Every AI decision logged with risk classification
- Reasoning lineage preservation
- Audit-ready documentation for regulators
- Aiwen environment (EU-only AI compliance layer)

## Target Market

- **Primary:** Government agencies (EU member states, defence ministries)
- **Secondary:** Military industry enterprises (defence contractors, shipyards, aerospace)
- **Tertiary:** Dual-use manufacturing supply chains (steel, chemicals, electronics, critical infrastructure)
- **Geography:** EU only — platform available exclusively on European cloud or enterprise private cloud
- **Industries:** All 21 EU-regulated industries under dual-use scope (including lime/critical raw materials)

### DEFINE / Defence Tech Hub Alignment

DWS IQ Aegis is designed for the Finnish Defence Tech Hub ecosystem:

- **NATO DIANA Accelerator** (VTT-operated, Espoo) — eligible programme
- **Defence Tech Hub members:** ICEYE, IQM, Kuva Space, Varjo, Elfys (60+ companies)
- **Research partners:** VTT, Aalto University
- **Application areas:** Defence supply chain compliance, sovereign AI, edge AI, site safety

## Competitive Positioning

> **Market signal (2026-06-23):** The U.S. Army established its NGC2 (Next Generation Command & Control) common data layer baseline — Palantir **Foundry** as the cloud data layer and Anduril **Lattice** as the tactical data layer. This validates the sovereign data-layer thesis at national scale; Europe has no equivalent baseline, and adopting the U.S. stack means inheriting CLOUD Act exposure and an EU AI Act compliance gap. Aegis is the EU-sovereign answer.

> **Political signal — European preference (2026-07-23):** President Macron, after coordinating with Commission President von der Leyen, set "**eurooppalainen etusija / European preference**" as a top-level EU priority — alongside a stronger defence-Europe *with its industrial base* and more public+private investment in AI, space, quantum, energy, and semiconductors. This is the procurement lever that converts Aegis's sovereignty from a *feature* into a *buying rule*: the same "buy European" logic that led Poland to fund a European constellation (IRIS², €656M RRF, signed Warsaw 21.07.2026) instead of contracting foreign capacity applies directly to the sovereign AI/compliance layer that runs over it. See `docs/field-notes/2026-07-23-warsaw-iris2-signing-aegis-connection.md`.

| Competitor                                               | Core capability (acknowledged)                                                     | The sovereign differentiator                                                                                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Palantir AIP / Foundry (U.S. Army NGC2 cloud data layer) | Best-in-class data integration and operational analytics, with real EU operations. | US corporate parent → CLOUD Act reach regardless of EU hosting location. Aegis is 100% EU-owned and outside extraterritorial data requests.      |
| Anduril Lattice (U.S. Army NGC2 tactical data layer)     | Excellent tactical hardware and perimeter-defence orchestration.                   | US-centric and hardware-led. Aegis is software-native for EU-regulated dual-use supply-chain compliance, with KYA governance + Article 12 audit. |
| C3.ai                                                    | Strong predictive analytics and enterprise dashboarding.                           | Runs as an overlay on commercial US hyperscalers. Aegis executes deterministic multi-agent reasoning inside an isolated sovereign EU enclave.    |
| Big 4 consulting                                         | Deep regulatory advisory capability.                                               | Advisory only. Aegis ships autonomous agents + orbital intelligence as the product, not a report.                                                |

**Our edge:** EU-sovereign by design (Finnish hosting), agent governance (KYA — no other platform has this), SAR orbital intelligence (designed for integration with providers such as ICEYE), EU AI Act native (Article 12 built-in), dual compliance (defence + climate in one platform) — and now aligned with the EU's stated **European-preference** procurement direction, which turns that sovereignty into a buying requirement rather than a differentiator to argue for.

## Scope Principle

**We are the Agent Outcome Factory.** DWS IQ Aegis deploys AI agents — industry-specific autonomous AI agents — that deliver sovereign, auditable outcomes. Not dashboards or manual reports. Defence supply chains get continuous compliance, orbital intelligence alerts, and agent governance as automated deliverables. Every AI agent action is Article 12 logged and KYA governed.

## Distribution Strategy

**Priority channels — all connected ERPs:**

1. **IFS Cloud Marketplace** — IFS serves Nordic defence/industrial (Saab, BAE Systems Nordic)
2. **SAP Store** — Defence supply chain S/4HANA integration
3. **Microsoft AppSource** — Dynamics 365 for defence contractors
4. **Visma** — Nordic government and public sector
5. **Monitor ERP** — Swedish defence manufacturing
6. **Jeeves** — Nordic defence supply chain
7. **DEFINE/Defence Tech Hub** — Programme participation and ecosystem sales
8. **Direct** — Enterprise sales to defence contractors
9. **Government procurement** — Finnish Defence Forces, EU agencies

## Technical Requirements

- **Deployment:** Single-tenant Kubernetes (Helm chart) on UpCloud UKS, Helsinki DC (fi-hel1 / fi-hel2). Enterprise private cloud option available.
- **Infrastructure:** UpCloud Managed Kubernetes — Finnish-owned, Tesi-backed, ISO 27001, CISPE member, zero CLOUD Act exposure
- **Database:** UpCloud Managed PostgreSQL + pgvector (HA, automated backups, Helsinki DC)
- **Cache:** UpCloud Managed Valkey/Redis
- **GPU:** NVIDIA L40S nodes available for local LLM inference
- **SLA:** 99.9% application-availability target / 99.999% underlying infrastructure (UpCloud)
- **Isolation:** Firecracker MicroVM per agent, no shared tenancy
- **Compliance:** EU AI Act Article 12, NIS2, GDPR, CER Directive, EU CRM Act, dual-use export control (Reg. 2021/821)
- **Hardware (per tier — DWS does not resell hardware at any tier):**
  - _Standard_ — software-only. Runs on EU cloud (UpCloud, Helsinki). No hardware.
  - _Defence_ — software-only. Adds NVIDIA L40S **GPU nodes in the EU cloud cluster**; still nothing shipped to site.
  - _Sovereign_ — air-gapped / on-premises. The physical layer is designed to run on **customer-sited edge hardware** (DGX Spark / Jetson class). Hardware is procured by the customer or a partner and scoped per engagement (the tier is custom-priced); DWS supplies the platform and the governance layer, not the box.
- **Certifications roadmap:** ISO 27001 (Lifetime Oy — targeting Q3 2026), SOC 2 Type II (targeting Q4 2026). Underlying UpCloud infrastructure is already ISO 27001 certified.
- **Availability:** September 2026

## Pricing

| Tier                | Onboarding + Integration | Monthly   | Included                                                                                                        |
| ------------------- | ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------- |
| **Aegis Standard**  | €59,990                  | €999/mo   | Skilled-agent fleet, 21 industries, dedicated K8s cluster, Article 12 logging, KYA governance, standard support |
| **Aegis Defence**   | €89,990                  | €1,999/mo | Standard + NVIDIA L40S GPU, ArgusAgent SAR, priority support (4h SLA), EDIP compliance reporting                |
| **Aegis Sovereign** | Custom                   | €4,999/mo | Defence + air-gapped / on-premises option, security clearance support, dedicated engineering team, custom SLA   |

Aegis is a standalone product — not part of the Captain investor programme. DWS does not resell hardware at any tier: Standard and Defence are software-only (Defence adds EU-cloud L40S GPU nodes), while Sovereign deploys on-premises onto customer-sited edge hardware scoped per engagement. See the per-tier hardware note under Technical Requirements.

## Strategic Partnerships

| Partner | Integration                                      | Status                           |
| ------- | ------------------------------------------------ | -------------------------------- |
| ICEYE   | SAR satellite data compatibility for Argus agent | Target integration (Espoo-based) |
| Shufti  | Agent identity verification for KYA              | Partnership pending              |
| NVIDIA  | Jetson Orin Nano edge deployment                 | ISV Partner (confirmed)          |
| VTT     | Research collaboration, DIANA programme          | Ecosystem partner                |

## K8s AI Inference Roadmap

> Source: KubeCon + CloudNativeCon Europe 2026 (Amsterdam). See `docs/field-notes/2026-03-30-kubecon-eu-2026-k8s-ai-inference.md`.

| #   | Item                       | DWS7 PR | Target  | Description                                                                                                                                           |
| --- | -------------------------- | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Inference autoscaling      | 137A    | Q3 2026 | HPA + KEDA policies for Aegis agents. Scale 0→N in <30s based on inference queue depth. Defence bursty workloads (crisis response, satellite passes). |
| 2   | Multi-model GPU sharing    | 137B    | Q3 2026 | MIG on L40S nodes — multiple agents per GPU with isolated VRAM. Target: per-customer GPU cost <€200/mo (from €376/mo).                                |
| 3   | Model versioning CRDs      | 137C    | Q4 2026 | K8s Custom Resource Definitions for blue/green model deployments. Rollback <60s. Article 12 audit continuity on model changes.                        |
| 4   | Edge-cloud inference split | 137D    | Q1 2027 | Jetson Orin Nano (field/classified) + UpCloud K8s (cloud/cross-vertical). Routing by classification level and sovereignty constraints. **Reference sovereign backhaul: IRIS² secure connectivity** — the EU-owned transport leg between field/classified edge and the Helsinki sovereign cloud, avoiding commercial hyperscaler transit (see `docs/field-notes/2026-07-23-warsaw-iris2-signing-aegis-connection.md`, path B). |
