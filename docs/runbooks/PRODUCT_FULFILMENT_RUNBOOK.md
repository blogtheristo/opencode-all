# Product Fulfilment Runbook — every SKU, exactly once

# VERSION AND AGENT HISTORY

---

Version: 1.35 [Latest]

Sessions & Modifications:

- Version: 1.35 [Latest] | Tool: scripts/truth/generate-fulfilment-runbook.mjs | Changes: Generated from dws10.com/config/products.json + config/truth/product-capability-chapters.json + config/truth/product-delivery-templates.json. Do not edit by hand; run the script. HIC 27.09.2026: "universal paid-order steps and one section per chapter listing each SKU exactly once."

Document Status:

- Language: English
- Publication Status: ACTIVE (internal delivery reference — no public-facing behavior change)

---

## Purpose

This is the operational runbook for fulfilling a paid order for any of the 138 catalogue
products. Every product is payable today via its `checkoutUrl`; this document is how the
Lifetime Oy delivery teams turn a paid order into a delivered product. It never gates or
delays payment — the steps below start **after** a payment has been captured.

## Universal paid-order steps (every SKU)

1. **Order received.** Checkout (`/checkout/?product=<SKU>`) or the manual `contact` route
   produces an order with the buyer's name, email, company and the ordered SKU.
2. **Acknowledge within 1 business day.** The owning team (below, per chapter) confirms
   receipt to the buyer by email, referencing the SKU and its acceptance criteria.
3. **Deliver per the SKU's `fulfilment.deliveryMode`.** Managed human delivery is the
   default and fallback for every chapter — no chapter's commitment depends on unattended
   automation succeeding.
4. **Check against the SKU's `acceptanceKpi`.** Delivery is complete when the required
   outcomes are met; a documented negative result (where applicable) is a valid, reportable
   outcome, not a defect.
5. **Confirm what is excluded.** Each SKU's `exclusions` are shared with the buyer before
   or at acknowledgement so scope is unambiguous.
6. **Record delivery.** Note the outcome against the order so `docs/truth/PRODUCT_FULFILMENT.md`
   and `docs/truth/PRODUCT_READINESS_BACKLOG.md` stay an accurate account of what has and has
   not yet been automated.

## Chapters

### Chapter 1 — SME web and IT services

<a id="chapter-1-sme-web-and-it-services"></a>

- **Owner:** Lifetime Oy — SME Web & IT Services Team

- **Delivery mode:** Managed human delivery: scoped, built and handed over by a named delivery engineer; no unattended automation claimed.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `LIFETIME-IT-TUKI-10H` | IT Support Hour Bank for SMEs — 10 h | /checkout/?product=LIFETIME-IT-TUKI-10H |
| `LIFETIME-WEB-STARTER` | Website Starter — Modern Business Site | /checkout/?product=LIFETIME-WEB-STARTER |
| `LIFETIME-WEBSTORE-MINI` | Small Online Store with Price List | /checkout/?product=LIFETIME-WEBSTORE-MINI |

### Chapter 2 — Consulting, engineering and training

<a id="chapter-2-consulting-engineering-and-training"></a>

- **Owner:** Lifetime Oy — Consulting, Engineering & Training Team

- **Delivery mode:** Managed human delivery: a named consultant or trainer delivers the engagement in person or remotely; no unattended automation claimed.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `ai-agent-engineering` | AI & Agent Engineering — Outcome-Backed Hourly | /checkout/?product=ai-agent-engineering |
| `ai-consultant-day` | Captain Day — One-Day AI Outcome | /checkout/?product=ai-consultant-day |
| `ai-consulting-agentic` | Agentic Software Development for EU Teams | /checkout/?product=ai-consulting-agentic |
| `ai-koulutus-3d` | AI Koulutus 3 Days Programme | /checkout/?product=ai-koulutus-3d |
| `aws-consultancy` | EU-Sovereign AI Engineering & Cloud Consultancy | /checkout/?product=aws-consultancy |
| `business-mentor-30` | Claude Code AI Coaching — 30 Hours | /checkout/?product=business-mentor-30 |
| `claude-code-coaching-3day` | Claude Code Coaching — Lecture + Workshop (3 Days) | /checkout/?product=claude-code-coaching-3day |
| `claude-code-coaching-lecture` | Claude Code Coaching — 1-Day Lecture | /checkout/?product=claude-code-coaching-lecture |
| `claude-code-coaching-project` | Claude Code Coaching — Client Project Work | /checkout/?product=claude-code-coaching-project |
| `claude-code-coaching-workshop` | Claude Code Coaching — 2-Day Workshop | /checkout/?product=claude-code-coaching-workshop |
| `consulting-fit55` | Consulting Fit for 55 Specialist | /checkout/?product=consulting-fit55 |
| `consulting-hourly` | Senior Compliance Specialist — Retainer + Outcomes | /checkout/?product=consulting-hourly |
| `devops-lead` | Assessment | /checkout/?product=devops-lead |
| `firehorse-coach` | EU AI Act Literacy Training | /checkout/?product=firehorse-coach |
| `lean-project` | EU AI Project Accelerator (Fixed Price) | /checkout/?product=lean-project |
| `professional-web-pages` | Kotisivut pk-yritykselle | /checkout/?product=professional-web-pages |
| `sovereignty-cloud-consulting` | Sovereignty Cloud Consulting – European Cloud Migration | /checkout/?product=sovereignty-cloud-consulting |

### Chapter 3 — DWS IQ core, deployment and cloud

<a id="chapter-3-dws-iq-core-deployment-and-cloud"></a>

- **Owner:** Lifetime Oy — DWS IQ Platform Team

- **Delivery mode:** Managed cloud or on-premise provisioning by the platform team; human-verified activation. No unattended automation claimed for first deployment.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `AIS-EU-SOV-OC` | EU-Sovereign AI Migration — Per Workload | /checkout/?product=AIS-EU-SOV-OC |
| `AIS-OUTCOME-PILOT` | Outcome-Priced Applied-AI Pilot (6 weeks) | /checkout/?product=AIS-OUTCOME-PILOT |
| `DWS-CLIMATE-001` | DWS IQ Climate Intelligence | /checkout/?product=DWS-CLIMATE-001 |
| `DWS-EU-PILOT` | DWS IQ — EU Sovereign Pilot | /checkout/?product=DWS-EU-PILOT |
| `DWS-EU-STARTER` | DWS IQ — EU Sovereign Starter | /checkout/?product=DWS-EU-STARTER |
| `DWS-IQ-006` | Lifetime DWS IQ Platform (Version 6) | /checkout/?product=DWS-IQ-006 |
| `DWS-IQ-ESS-SETUP` | DWS IQ Essentials — Setup | /checkout/?product=DWS-IQ-ESS-SETUP |
| `DWS-IQ-FREE-2026` | DWS IQ Free — 1 project, CSRD-ready | /checkout/?product=DWS-IQ-FREE-2026 |
| `DWS-SOVEREIGN-DB-001` | Sovereign Database — EU Data Sovereignty for PostgreSQL | /checkout/?product=DWS-SOVEREIGN-DB-001 |
| `DWS-US-PILOT` | DWS IQ — US Cloud Pilot | /checkout/?product=DWS-US-PILOT |
| `DWS-US-STARTER` | DWS IQ — US Cloud Starter | /checkout/?product=DWS-US-STARTER |
| `LIFETIME-BUNDLE-2026` | Climate Reporting Starter Bundle | /checkout/?product=LIFETIME-BUNDLE-2026 |

### Chapter 4 — Aegis and KYA

<a id="chapter-4-aegis-and-kya"></a>

- **Owner:** Lifetime Oy — Aegis & KYA Team

- **Delivery mode:** Managed on-site or hybrid deployment with human oversight throughout; kill authority and audit logging verified by a named engineer before handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `DWS-AEGIS-001` | DWS IQ 7 Aegis | /checkout/?product=DWS-AEGIS-001 |
| `DWS-AEGIS-IMPL-001` | DWS IQ Aegis Implementation Programme (3 phases) | /checkout/?product=DWS-AEGIS-IMPL-001 |
| `DWS-AEGIS-PILOT-001` | DWS IQ 7 Aegis Pilot (3 months) | /checkout/?product=DWS-AEGIS-PILOT-001 |
| `DWS-AEGIS-SUB-001` | DWS IQ Aegis — Maintenance Subscription | /checkout/?product=DWS-AEGIS-SUB-001 |
| `KYA-JEV-001` | kya-jev — KYA-Gated Typed Decisions (Early Access) | /checkout/?product=KYA-JEV-001 |

### Chapter 5 — Firehorse applications

<a id="chapter-5-firehorse-applications"></a>

- **Owner:** Lifetime Oy — Firehorse Applications Team

- **Delivery mode:** Managed SaaS tenant activation with human-verified configuration; no unattended automation claimed for first activation.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `FH-AUTO-001` | Firehorse Amplify | /checkout/?product=FH-AUTO-001 |
| `FH-CMS-001` | Firehorse Content Management | /checkout/?product=FH-CMS-001 |
| `FH-OMNI-001` | Firehorse Omnichannel Next | /checkout/?product=FH-OMNI-001 |
| `FH-RPT-001` | DWS IQ Report | /checkout/?product=FH-RPT-001 |
| `FH-SIGN-001` | Firehorse Signed Reports | /checkout/?product=FH-SIGN-001 |
| `conversational-agent` | EU-Hosted Conversational Agent | /checkout/?product=conversational-agent |
| `firehorse-data-services` | Firehorse Data Services | /checkout/?product=firehorse-data-services |
| `firehorse-flow` | AI Customer Agent | /checkout/?product=firehorse-flow |
| `omnichannel-multimodal` | Firehorse Omnichannel & Multimodal AI Assistant | /checkout/?product=omnichannel-multimodal |

### Chapter 6 — Sovereign hardware and edge

<a id="chapter-6-sovereign-hardware-and-edge"></a>

- **Owner:** Lifetime Oy — Sovereign Hardware & Edge Team

- **Delivery mode:** Managed hardware fulfilment: procurement, shipping and (where ordered) on-site installation by a named engineer.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `LF-COMPLIANCE-AMBULANCE-001` | DWS IQ Compliance Ambulance — Mobile Office (NVIDIA Thor Edge) | /checkout/?product=LF-COMPLIANCE-AMBULANCE-001 |
| `LF-DGX-SPARK` | DGX Spark — NVIDIA-Branded Sovereign Edge AI | /checkout/?product=LF-DGX-SPARK |
| `LF-IGX-ORIN` | IGX Orin — Industrial / Medical Sovereign Edge AI | /checkout/?product=LF-IGX-ORIN |
| `LF-IPCMAX-CINCOZE-DA1200` | Cincoze DA-1200 — Rugged Expandable Edge Computer | /checkout/?product=LF-IPCMAX-CINCOZE-DA1200 |
| `LF-IPCMAX-IPC409` | iPCMax IPC-409 — Compact Fanless Sensor Gateway | /checkout/?product=LF-IPCMAX-IPC409 |
| `LF-IPCMAX-IPCP68` | iPCMax IPC-P68 — Vision Gateway with PoE | /checkout/?product=LF-IPCMAX-IPCP68 |
| `LF-JETSON-AGX` | Jetson Sensor Concentrator — AGX Orin 64GB + Install & Service | /checkout/?product=LF-JETSON-AGX |
| `LF-JETSON-NANO` | Jetson Sensor Node — Orin Nano Super + Install & Service | /checkout/?product=LF-JETSON-NANO |
| `LF-JETSON-NX` | Jetson Sensor Mid — Orin NX 16 GB + Install & Service | /checkout/?product=LF-JETSON-NX |
| `LF-NVIDIA-INSTALL` | NVIDIA Model Installation + Full Service | /checkout/?product=LF-NVIDIA-INSTALL |
| `LF-SITROOM-001` | Situation Room — Two Sovereign AI Nodes | /checkout/?product=LF-SITROOM-001 |
| `edge-node-gn100` | Control Room — Acer Veriton GN100 | /checkout/?product=edge-node-gn100 |

### Chapter 7 — Kubernetes, DOCA, Gov Ready and NIM

<a id="chapter-7-kubernetes-doca-gov-ready-and-nim"></a>

- **Owner:** Lifetime Oy — Kubernetes, DOCA & NIM Team

- **Delivery mode:** Managed cluster/service provisioning by a named engineer on buyer-supplied or Lifetime-supplied hardware; human-verified before handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `LF-DOCA-ESSENTIAL` | DOCA Microservices — Essential Package | /checkout/?product=LF-DOCA-ESSENTIAL |
| `LF-DOCA-NETWORK-STORAGE` | DOCA Microservices — Networking & Storage Acceleration Package | /checkout/?product=LF-DOCA-NETWORK-STORAGE |
| `LF-DOCA-SECURITY` | DOCA Microservices — Security & Compliance Package | /checkout/?product=LF-DOCA-SECURITY |
| `LF-FIPS-VALIDATION` | FIPS 140-3 Validation Service | /checkout/?product=LF-FIPS-VALIDATION |
| `LF-GOV-AIRGAP-BUNDLE` | Air-Gapped Gov Ready Image Bundle | /checkout/?product=LF-GOV-AIRGAP-BUNDLE |
| `LF-GOV-READY-ANNUAL` | Government Ready Annual Maintenance | /checkout/?product=LF-GOV-READY-ANNUAL |
| `LF-GOV-READY-SETUP` | Government Ready Cluster Setup | /checkout/?product=LF-GOV-READY-SETUP |
| `LF-K8S-T1` | Kubernetes Orchestration — Single-Node k3s (Tier 1) | /checkout/?product=LF-K8S-T1 |
| `LF-K8S-T2` | Kubernetes Orchestration — HA Cluster k3s (Tier 2) | /checkout/?product=LF-K8S-T2 |
| `LF-K8S-T3` | Kubernetes Orchestration — Gov Ready RKE2 (Tier 3) | /checkout/?product=LF-K8S-T3 |
| `LF-K8S-T4` | Kubernetes Orchestration — Full Infra Stack (Tier 4) | /checkout/?product=LF-K8S-T4 |
| `LF-NIM-BIOLOGY` | NIM Microservices — Biology & Genomics Profile | /checkout/?product=LF-NIM-BIOLOGY |
| `LF-NIM-CODE` | NIM Microservices — Code Generation Profile | /checkout/?product=LF-NIM-CODE |
| `LF-NIM-RETRIEVAL` | NIM Microservices — Retrieval & Embedding Profile | /checkout/?product=LF-NIM-RETRIEVAL |
| `LF-NIM-STARTER` | NIM Microservices — Starter Profile | /checkout/?product=LF-NIM-STARTER |

### Chapter 8 — Compliance, safety, materials and emissions agents

<a id="chapter-8-compliance-safety-materials-and-emissions-agents"></a>

- **Owner:** Lifetime Oy — Compliance, Safety & Materials Agents Team

- **Delivery mode:** Managed agent activation: a named engineer configures and activates the ordered agent tier; human review of first output before buyer handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `CMP-OC-ENT` | Outcome — CSRD/CBAM/AI Act gap (Enterprise) | /checkout/?product=CMP-OC-ENT |
| `CMP-OC-STD` | Outcome — CSRD/CBAM/AI Act gap (Standard) | /checkout/?product=CMP-OC-STD |
| `CMP-T0` | Compliance Agent — Pilot (60 days) | /checkout/?product=CMP-T0 |
| `CMP-T1` | Compliance Agent — Starter | /checkout/?product=CMP-T1 |
| `CMP-T2` | Compliance Agent — Pro | /checkout/?product=CMP-T2 |
| `ED-T1` | Emissions Data — Starter | /checkout/?product=ED-T1 |
| `ED-T2` | Emissions Data — Pro | /checkout/?product=ED-T2 |
| `MO-OC-ENT` | Outcome — LCA report (Enterprise) | /checkout/?product=MO-OC-ENT |
| `MO-OC-STD` | Outcome — LCA report (Standard) | /checkout/?product=MO-OC-STD |
| `MO-T0` | Material Oracle — Pilot (60 days, 1 project) | /checkout/?product=MO-T0 |
| `MO-T1` | Material Oracle — Starter | /checkout/?product=MO-T1 |
| `MO-T2` | Material Oracle — Pro | /checkout/?product=MO-T2 |
| `SS-OC-ENT` | Outcome — Site safety assessment (Enterprise) | /checkout/?product=SS-OC-ENT |
| `SS-OC-STD` | Outcome — Site safety assessment (Standard) | /checkout/?product=SS-OC-STD |
| `SS-T0` | SiteSense — Pilot (30 days, 1 site) | /checkout/?product=SS-T0 |
| `SS-T1` | SiteSense — Starter | /checkout/?product=SS-T1 |
| `SS-T2` | SiteSense — Pro | /checkout/?product=SS-T2 |

### Chapter 9 — Operations and assurance agents

<a id="chapter-9-operations-and-assurance-agents"></a>

- **Owner:** Lifetime Oy — Operations & Assurance Agents Team

- **Delivery mode:** Managed agent activation: a named engineer configures and activates the ordered agent; human review of first output before buyer handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `CONSTR-T2` | Construction Agent — Pro (bundle) | /checkout/?product=CONSTR-T2 |
| `LOG-T1` | Logistics — Starter | /checkout/?product=LOG-T1 |
| `LOG-T2` | Logistics — Pro | /checkout/?product=LOG-T2 |
| `QG-T1` | Quality Gate — Starter | /checkout/?product=QG-T1 |
| `QG-T2` | Quality Gate — Pro | /checkout/?product=QG-T2 |
| `SG-T1` | Schedule Genius — Starter | /checkout/?product=SG-T1 |
| `SG-T2` | Schedule Genius — Pro | /checkout/?product=SG-T2 |
| `SOV-T1` | Sovereignty Monitor — Starter | /checkout/?product=SOV-T1 |
| `SOV-T2` | Sovereignty Monitor — Pro | /checkout/?product=SOV-T2 |

### Chapter 10 — Growth, knowledge and viability agents

<a id="chapter-10-growth-knowledge-and-viability-agents"></a>

- **Owner:** Lifetime Oy — Growth, Knowledge & Viability Agents Team

- **Delivery mode:** Managed agent activation: a named engineer configures and activates the ordered agent; human review of first output before buyer handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `CS-T1` | Competitor Surveillance — Starter | /checkout/?product=CS-T1 |
| `CS-T2` | Competitor Surveillance — Pro | /checkout/?product=CS-T2 |
| `CSAT-T1` | Customer Sat — Starter | /checkout/?product=CSAT-T1 |
| `CSAT-T2` | Customer Sat — Pro | /checkout/?product=CSAT-T2 |
| `DW-T1` | Deepwiki Extractor — Starter | /checkout/?product=DW-T1 |
| `DW-T2` | Deepwiki Extractor — Pro | /checkout/?product=DW-T2 |
| `LF-T1` | Lead Feedback — Starter | /checkout/?product=LF-T1 |
| `LF-T2` | Lead Feedback — Pro | /checkout/?product=LF-T2 |
| `SEO-T1` | SEO Audit — Starter | /checkout/?product=SEO-T1 |
| `SEO-T2` | SEO Audit — Pro | /checkout/?product=SEO-T2 |
| `VIA-T1` | Viability — Starter | /checkout/?product=VIA-T1 |
| `VIA-T2` | Viability — Pro | /checkout/?product=VIA-T2 |

### Chapter 11 — Function and channel bundles

<a id="chapter-11-function-and-channel-bundles"></a>

- **Owner:** Lifetime Oy — Function & Channel Bundles Team

- **Delivery mode:** Managed bundle composition: a named engineer activates each required component agent and verifies the bundle's aggregate scope before handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `AC365-T3` | Agentic Commerce 365 Skilled Agents | /checkout/?product=AC365-T3 |
| `CONSTR-T3` | Construction Ops Pod | /checkout/?product=CONSTR-T3 |
| `DWS365-CMP-T3` | DWS 365 Compliance Agents | /checkout/?product=DWS365-CMP-T3 |
| `ESG-T3` | ESG Function-as-a-Service | /checkout/?product=ESG-T3 |
| `FH-SKILL-T3` | Firehorse Skilled Agents | /checkout/?product=FH-SKILL-T3 |
| `GTM-T3` | Go-to-Market Pod | /checkout/?product=GTM-T3 |
| `HSE-T3` | HSE Function-as-a-Service | /checkout/?product=HSE-T3 |
| `SOV-T3` | Sovereignty & Compliance Pack | /checkout/?product=SOV-T3 |
| `WF-T4` | Full Skilled Workforce | /checkout/?product=WF-T4 |

### Chapter 12 — Industry pods

<a id="chapter-12-industry-pods"></a>

- **Owner:** Lifetime Oy — Industry Pods Team

- **Delivery mode:** Managed industry-pod onboarding: a named engineer configures the pod's shared agents against buyer industry data and verifies one witnessed outcome before handover.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `IND-BESS` | BESS — Battery storage industry pod | /checkout/?product=IND-BESS |
| `IND-CERES` | Ceres — Agri / Circular industry pod | /checkout/?product=IND-CERES |
| `IND-GAIA` | Gaia — Cement industry pod | /checkout/?product=IND-GAIA |
| `IND-HELIOS` | Helios — Energy industry pod | /checkout/?product=IND-HELIOS |
| `IND-MARS` | Mars — Construction industry pod | /checkout/?product=IND-MARS |
| `IND-NEPTUN` | Neptune — Maritime industry pod | /checkout/?product=IND-NEPTUN |
| `IND-PROM` | Prometheus — Hydrogen industry pod | /checkout/?product=IND-PROM |
| `IND-TALOS` | Talos — Aluminium industry pod | /checkout/?product=IND-TALOS |
| `IND-VULCAN` | Vulcan — Steel industry pod | /checkout/?product=IND-VULCAN |

### Chapter 13 — Land-and-expand programmes

<a id="chapter-13-land-and-expand-programmes"></a>

- **Owner:** Lifetime Oy — Land-and-Expand Programmes Team

- **Delivery mode:** Managed advisory programme: a named programme lead runs the weekly-gated engagement; human review at every gate before proceeding.

- **Acknowledgement SLA:** 1 business day via https://dws10.com/contact/


| SKU | Product | Checkout |
| --- | --- | --- |
| `LAND-AIL` | AI Literacy Bridge | /checkout/?product=LAND-AIL |
| `LAND-CSRD` | CSRD Reporting Accelerator | /checkout/?product=LAND-CSRD |
| `LAND-EUAI` | EU AI Act Compliance Sprint | /checkout/?product=LAND-EUAI |
| `LAND-GTM` | Go-to-Market Sprint | /checkout/?product=LAND-GTM |
| `LAND-HSE` | Site Safety Bootcamp | /checkout/?product=LAND-HSE |
| `LAND-LCA` | Carbon Reporting Sprint | /checkout/?product=LAND-LCA |
| `LAND-OPS` | Construction Ops Pilot | /checkout/?product=LAND-OPS |
| `LAND-SOV` | Sovereignty & NIS2 Sprint | /checkout/?product=LAND-SOV |
| `LAND-WF` | Full Workforce Onboarding | /checkout/?product=LAND-WF |
