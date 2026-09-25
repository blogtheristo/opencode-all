# DWS Product Registry — every catalogue ID

# VERSION AND AGENT HISTORY

---

Version: 1.33 [Latest]

Sessions & Modifications:

- Version: 1.33 [Latest] | Tool: scripts/truth/product-registry.mjs | Changes: Generated from dws10.com/config/products.json catalogue 1.33. Do not edit by hand; run the script.

Document Status:

- Language: English
- Publication Status: ACTIVE
- Canonical row: DWS_TRUTH_STANDARD.md §2 row 42

---

## Summary

| Measure | Count |
| --- | --- |
| All catalogue IDs (products + subscription-only + discontinued) | 155 |
| — records in `products` | 137 |
| — subscription-only records | 16 |
| — discontinued records | 2 |
| **On the public price list** | **80** |
| — public products (non-BLUE, non-archived) | 71 |
| — active subscriptions | 9 |
| — price-list group SME | 3 |
| — price-list group DWS IQ | 18 |
| — price-list group Firehorse | 9 |
| — price-list group Data | 2 |
| — price-list group Services | 20 |
| — price-list group Hardware | 28 |
| — price-list group Other | 0 |
| Not on the price list: BLUE (internal / pilot) | 65 |
| Not on the price list: archived | 8 |
| Not on the price list: discontinued | 2 |
| Reconciles (on list + BLUE + archived + discontinued = all; public = expected 71) | yes |

TAM / yr is a model estimate per public offer (`config/truth/product-valuation-model.json`); method, segments and value per offer: `docs/truth/PRODUCT_VALUATION.md` (TRUTH row 45).

## Every ID

| # | ID | Name | Price | Status | Class | Group | On price list | TAM / yr (model) | Why not |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `ai-agent-engineering` | AI & Agent Engineering — Outcome-Backed Hourly | €200 | public | — | Services | yes | €50.00M |  |
| 2 | `ai-consultant-day` | Captain Day — One-Day AI Outcome | €1,200 | public | — | Services | yes | €3.00M |  |
| 3 | `ai-consulting-agentic` | Agentic Software Development for EU Teams | €2,500 | public | — | Services | yes | €6.25M |  |
| 4 | `ai-koulutus-3d` | AI Koulutus 3 Days Programme | €6,250 | public | — | Services | yes | €31.25M |  |
| 5 | `AIS-EU-SOV-OC` | EU-Sovereign AI Migration — Per Workload | €4,990 | public | — | Services | yes | €12.47M |  |
| 6 | `AIS-OUTCOME-PILOT` | Outcome-Priced Applied-AI Pilot (6 weeks) | €9,990 | public | — | Services | yes | €24.98M |  |
| 7 | `aws-consultancy` | EU-Sovereign AI Engineering & Cloud Consultancy | €3,750 | public | serious | Services | yes | €9.38M |  |
| 8 | `business-mentor-30` | Claude Code AI Coaching — 30 Hours | €4,960 | public | — | Services | yes | €24.80M |  |
| 9 | `claude-code-coaching-3day` | Claude Code Coaching — Lecture + Workshop (3 Days) | €5,900 | public | — | Services | yes | €29.50M |  |
| 10 | `claude-code-coaching-lecture` | Claude Code Coaching — 1-Day Lecture | €1,900 | public | — | Services | yes | €9.50M |  |
| 11 | `claude-code-coaching-project` | Claude Code Coaching — Client Project Work | €7,500 | public | — | Services | yes | €18.75M |  |
| 12 | `claude-code-coaching-workshop` | Claude Code Coaching — 2-Day Workshop | €4,500 | public | — | Services | yes | €22.50M |  |
| 13 | `consulting-fit55` | Consulting Fit for 55 Specialist | €3,000 | public | — | Services | yes | €90.00M |  |
| 14 | `consulting-hourly` | Senior Compliance Specialist — Retainer + Outcomes | €250 | public | — | Services | yes | €62.50M |  |
| 15 | `conversational-agent` | EU-Hosted Conversational Agent | €3,500 | public | — | Firehorse | yes | €5.83M |  |
| 16 | `devops-lead` | Assessment | €2,500 | public | — | Services | yes | €6.25M |  |
| 17 | `DWS-AEGIS-001` | DWS IQ Aegis | €59,990 | public | serious | DWS IQ | yes | €18.00M |  |
| 18 | `DWS-AEGIS-IMPL-001` | DWS IQ Aegis Implementation Programme (3 phases) | €45,000 | public | — | DWS IQ | yes | €13.50M |  |
| 19 | `DWS-AEGIS-PILOT-001` | DWS IQ Aegis Pilot (3 months) | €19,990 | public | serious | DWS IQ | yes | €6.00M |  |
| 20 | `DWS-CLIMATE-001` | DWS IQ Climate Intelligence | €2,999 | public | serious | DWS IQ | yes | €89.97M |  |
| 21 | `DWS-EU-PILOT` | DWS IQ — EU Sovereign Pilot | €1,499 | public | serious | DWS IQ | yes | €44.97M |  |
| 22 | `DWS-EU-STARTER` | DWS IQ — EU Sovereign Starter | €499 | public | serious | DWS IQ | yes | €14.97M |  |
| 23 | `DWS-IQ-006` | Lifetime DWS IQ Platform (Version 6) | €4,999 | public | — | DWS IQ | yes | €6.67M |  |
| 24 | `DWS-IQ-ESS-SETUP` | DWS IQ Essentials — Setup | €799 | public | — | DWS IQ | yes | €1.07M |  |
| 25 | `DWS-IQ-FREE-2026` | DWS IQ Free — 1 project, CSRD-ready | €1 | public | — | DWS IQ | yes | €0.03M |  |
| 26 | `DWS-SOVEREIGN-DB-001` | Sovereign Database — EU Data Sovereignty for PostgreSQL | €499 | public | serious | DWS IQ | yes | €0.67M |  |
| 27 | `DWS-US-PILOT` | DWS IQ — US Cloud Pilot | €799 | public | — | DWS IQ | yes | €9.59M |  |
| 28 | `DWS-US-STARTER` | DWS IQ — US Cloud Starter | €299 | public | — | DWS IQ | yes | €3.59M |  |
| 29 | `edge-node-gn100` | Control Room — Acer Veriton GN100 | €8,008 | public | serious | Hardware | yes | €12.01M |  |
| 30 | `FH-AUTO-001` | Firehorse Amplify | €4,950 | public | — | Firehorse | yes | €8.25M |  |
| 31 | `FH-CMS-001` | Firehorse Content Management | €2,999 | public | — | Firehorse | yes | €5.00M |  |
| 32 | `FH-OMNI-001` | Firehorse Omnichannel Next | €499 | public | — | Firehorse | yes | €0.83M |  |
| 33 | `FH-RPT-001` | DWS IQ Report | €1,999 | public | — | DWS IQ | yes | €1.67M |  |
| 34 | `FH-SIGN-001` | Firehorse Signed Reports | €199 | public | — | Firehorse | yes | €11.94M |  |
| 35 | `firehorse-coach` | EU AI Act Literacy Training | €499 | public | — | Services | yes | €2.50M |  |
| 36 | `firehorse-data-services` | Firehorse Data Services | €899 | public | — | Firehorse | yes | €1.50M |  |
| 37 | `firehorse-flow` | AI Customer Agent | €499 | public | — | Firehorse | yes | €0.83M |  |
| 38 | `KYA-JEV-001` | kya-jev — KYA-Gated Typed Decisions (Early Access) | €99 | public | — | DWS IQ | yes | €4.75M |  |
| 39 | `lean-project` | EU AI Project Accelerator (Fixed Price) | €4,960 | public | — | Services | yes | €12.40M |  |
| 40 | `LF-COMPLIANCE-AMBULANCE-001` | DWS IQ Compliance Ambulance — Mobile Office (NVIDIA Thor Edge) | €1 | public | — | Hardware | yes | €0.00M |  |
| 41 | `LF-DGX-SPARK` | DGX Spark — NVIDIA-Branded Sovereign Edge AI | €6,109 | public | serious | Hardware | yes | €9.16M |  |
| 42 | `LF-DOCA-ESSENTIAL` | DOCA Microservices — Essential Package | €500 | public | — | Hardware | yes | €18.00M |  |
| 43 | `LF-DOCA-NETWORK-STORAGE` | DOCA Microservices — Networking & Storage Acceleration Package | €2,000 | public | — | Hardware | yes | €72.00M |  |
| 44 | `LF-DOCA-SECURITY` | DOCA Microservices — Security & Compliance Package | €1,000 | public | — | Hardware | yes | €10.80M |  |
| 45 | `LF-FIPS-VALIDATION` | FIPS 140-3 Validation Service | €2,000 | public | — | Hardware | yes | €0.60M |  |
| 46 | `LF-GOV-AIRGAP-BUNDLE` | Air-Gapped Gov Ready Image Bundle | €1,500 | public | — | Hardware | yes | €0.45M |  |
| 47 | `LF-GOV-READY-ANNUAL` | Government Ready Annual Maintenance | €3,000 | public | — | Hardware | yes | €32.40M |  |
| 48 | `LF-GOV-READY-SETUP` | Government Ready Cluster Setup | €7,500 | public | — | Hardware | yes | €2.25M |  |
| 49 | `LF-IGX-ORIN` | IGX Orin — Industrial / Medical Sovereign Edge AI | €11,990 | public | serious | Hardware | yes | €17.98M |  |
| 50 | `LF-IPCMAX-CINCOZE-DA1200` | Cincoze DA-1200 — Rugged Expandable Edge Computer | €1,850 | public | — | Hardware | yes | €2.77M |  |
| 51 | `LF-IPCMAX-IPC409` | iPCMax IPC-409 — Compact Fanless Sensor Gateway | €345 | public | — | Hardware | yes | €0.52M |  |
| 52 | `LF-IPCMAX-IPCP68` | iPCMax IPC-P68 — Vision Gateway with PoE | €680 | public | — | Hardware | yes | €1.02M |  |
| 53 | `LF-JETSON-AGX` | Jetson Sensor Concentrator — AGX Orin 64GB + Install & Service | €2,694 | public | — | Hardware | yes | €4.04M |  |
| 54 | `LF-JETSON-NANO` | Jetson Sensor Node — Orin Nano Super + Install & Service | €764 | public | — | Hardware | yes | €1.15M |  |
| 55 | `LF-JETSON-NX` | Jetson Sensor Mid — Orin NX 16 GB + Install & Service | €1,990 | public | — | Hardware | yes | €2.98M |  |
| 56 | `LF-K8S-T1` | Kubernetes Orchestration — Single-Node k3s (Tier 1) | €1,500 | public | — | Hardware | yes | €1.50M |  |
| 57 | `LF-K8S-T2` | Kubernetes Orchestration — HA Cluster k3s (Tier 2) | €4,500 | public | — | Hardware | yes | €4.50M |  |
| 58 | `LF-K8S-T3` | Kubernetes Orchestration — Gov Ready RKE2 (Tier 3) | €7,500 | public | — | Hardware | yes | €2.25M |  |
| 59 | `LF-K8S-T4` | Kubernetes Orchestration — Full Infra Stack (Tier 4) | €12,000 | public | — | Hardware | yes | €12.00M |  |
| 60 | `LF-NIM-BIOLOGY` | NIM Microservices — Biology & Genomics Profile | €2,000 | public | — | Hardware | yes | €72.00M |  |
| 61 | `LF-NIM-CODE` | NIM Microservices — Code Generation Profile | €500 | public | — | Hardware | yes | €18.00M |  |
| 62 | `LF-NIM-RETRIEVAL` | NIM Microservices — Retrieval & Embedding Profile | €500 | public | — | Hardware | yes | €18.00M |  |
| 63 | `LF-NIM-STARTER` | NIM Microservices — Starter Profile | €500 | public | — | Hardware | yes | €18.00M |  |
| 64 | `LF-NVIDIA-INSTALL` | NVIDIA Model Installation + Full Service | €995 | public | serious | Hardware | yes | €0.99M |  |
| 65 | `LF-SITROOM-001` | Situation Room — Two Sovereign AI Nodes | €11,598 | public | serious | Hardware | yes | €17.40M |  |
| 66 | `LIFETIME-BUNDLE-2026` | Climate Reporting Starter Bundle | €6,500 | public | serious | DWS IQ | yes | €5.42M |  |
| 67 | `LIFETIME-IT-TUKI-10H` | IT Support Hour Bank for SMEs — 10 h | €750 | public | sme-campaign | SME | yes | €4.35M |  |
| 68 | `LIFETIME-WEB-STARTER` | Website Starter — Modern Business Site | €650 | public | sme-campaign | SME | yes | €3.77M |  |
| 69 | `LIFETIME-WEBSTORE-MINI` | Small Online Store with Price List | €350 | public | sme-campaign | SME | yes | €2.03M |  |
| 70 | `omnichannel-multimodal` | Firehorse Omnichannel & Multimodal AI Assistant | €699 | public | — | Firehorse | yes | €41.94M |  |
| 71 | `sovereignty-cloud-consulting` | Sovereignty Cloud Consulting – European Cloud Migration | €1,500 | public | — | Services | yes | €45.00M |  |
| 72 | `DWS-IQ-ESS-SUB-MANAGED` | DWS IQ Essentials — Managed | €249 | subscription | subscription | DWS IQ | yes | €11.95M |  |
| 73 | `DWS-IQ-ESS-SUB-SELF` | DWS IQ Essentials — Self-Hosted | €49 | subscription | subscription | DWS IQ | yes | €2.35M |  |
| 74 | `DWS-IQ-SUB-001` | DWS IQ Monthly Subscription | €499 | subscription | subscription | DWS IQ | yes | €23.95M |  |
| 75 | `FH-SUB-001` | Firehorse Monthly Subscription | €499 | subscription | subscription | Firehorse | yes | €29.94M |  |
| 76 | `LF-ONTOLOGY-25` | European Industry Ontology, 25 industries | €25,000 | subscription | independent | Data | yes | €100.00M |  |
| 77 | `LF-ONTOLOGY-PILOT` | Independent Ontology Pilot, one site | €15,000 | subscription | subscription | Services | yes | €30.00M |  |
| 78 | `LF-SOV-MODEL-SUB` | Sovereign Model Updates Subscription | €299 | subscription | subscription | Hardware | yes | €10.76M |  |
| 79 | `LF-TRAIN-IND` | Ontology Implementation and Organisation (site configuration) | €15,000 | subscription | subscription | Services | yes | €30.00M |  |
| 80 | `LWM-ONT-SOVEREIGN` | European Industry Ontology — Sovereign on-prem pack | €49,990 | subscription | independent | Data | yes | €66.65M |  |
| 81 | `AC365-T3` | Agentic Commerce 365 Skilled Agents | €6,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 82 | `CMP-OC-ENT` | Outcome — CSRD/CBAM/AI Act gap (Enterprise) | €2,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 83 | `CMP-OC-STD` | Outcome — CSRD/CBAM/AI Act gap (Standard) | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 84 | `CMP-T0` | Compliance Agent — Pilot (60 days) | €1 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 85 | `CMP-T1` | Compliance Agent — Starter | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 86 | `CMP-T2` | Compliance Agent — Pro | €2,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 87 | `CONSTR-T2` | Construction Agent — Pro (bundle) | €3,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 88 | `CONSTR-T3` | Construction Ops Pod | €8,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 89 | `CS-T1` | Competitor Surveillance — Starter | €899 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 90 | `CS-T2` | Competitor Surveillance — Pro | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 91 | `CSAT-T1` | Customer Sat — Starter | €599 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 92 | `CSAT-T2` | Customer Sat — Pro | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 93 | `DW-T1` | Deepwiki Extractor — Starter | €599 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 94 | `DW-T2` | Deepwiki Extractor — Pro | €799 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 95 | `DWS365-CMP-T3` | DWS 365 Compliance Agents | €5,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 96 | `ED-T1` | Emissions Data — Starter | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 97 | `ED-T2` | Emissions Data — Pro | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 98 | `ESG-T3` | ESG Function-as-a-Service | €6,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 99 | `FH-SKILL-T3` | Firehorse Skilled Agents | €5,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 100 | `GTM-T3` | Go-to-Market Pod | €3,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 101 | `HSE-T3` | HSE Function-as-a-Service | €4,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 102 | `IND-BESS` | BESS — Battery storage industry pod | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 103 | `IND-CERES` | Ceres — Agri / Circular industry pod | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 104 | `IND-GAIA` | Gaia — Cement industry pod | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 105 | `IND-HELIOS` | Helios — Energy industry pod | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 106 | `IND-MARS` | Mars — Construction industry pod | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 107 | `IND-NEPTUN` | Neptune — Maritime industry pod | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 108 | `IND-PROM` | Prometheus — Hydrogen industry pod | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 109 | `IND-TALOS` | Talos — Aluminium industry pod | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 110 | `IND-VULCAN` | Vulcan — Steel industry pod | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 111 | `LAND-AIL` | AI Literacy Bridge | €34,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 112 | `LAND-CSRD` | CSRD Reporting Accelerator | €89,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 113 | `LAND-EUAI` | EU AI Act Compliance Sprint | €39,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 114 | `LAND-GTM` | Go-to-Market Sprint | €49,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 115 | `LAND-HSE` | Site Safety Bootcamp | €29,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 116 | `LAND-LCA` | Carbon Reporting Sprint | €49,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 117 | `LAND-OPS` | Construction Ops Pilot | €109,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 118 | `LAND-SOV` | Sovereignty & NIS2 Sprint | €69,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 119 | `LAND-WF` | Full Workforce Onboarding | €249,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 120 | `LF-T1` | Lead Feedback — Starter | €599 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 121 | `LF-T2` | Lead Feedback — Pro | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 122 | `LOG-T1` | Logistics — Starter | €1,299 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 123 | `LOG-T2` | Logistics — Pro | €1,799 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 124 | `MO-OC-ENT` | Outcome — LCA report (Enterprise) | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 125 | `MO-OC-STD` | Outcome — LCA report (Standard) | €499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 126 | `MO-T0` | Material Oracle — Pilot (60 days, 1 project) | €1 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 127 | `MO-T1` | Material Oracle — Starter | €1,299 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 128 | `MO-T2` | Material Oracle — Pro | €1,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 129 | `QG-T1` | Quality Gate — Starter | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 130 | `QG-T2` | Quality Gate — Pro | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 131 | `SEO-T1` | SEO Audit — Starter | €599 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 132 | `SEO-T2` | SEO Audit — Pro | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 133 | `SG-T1` | Schedule Genius — Starter | €1,299 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 134 | `SG-T2` | Schedule Genius — Pro | €1,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 135 | `SOV-T1` | Sovereignty Monitor — Starter | €1,299 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 136 | `SOV-T2` | Sovereignty Monitor — Pro | €1,999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 137 | `SOV-T3` | Sovereignty & Compliance Pack | €5,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 138 | `SS-OC-ENT` | Outcome — Site safety assessment (Enterprise) | €99 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 139 | `SS-OC-STD` | Outcome — Site safety assessment (Standard) | €49 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 140 | `SS-T0` | SiteSense — Pilot (30 days, 1 site) | €1 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 141 | `SS-T1` | SiteSense — Starter | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 142 | `SS-T2` | SiteSense — Pro | €2,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 143 | `VIA-T1` | Viability — Starter | €999 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 144 | `VIA-T2` | Viability — Pro | €1,499 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 145 | `WF-T4` | Full Skilled Workforce | €19,990 | blue | — | — | no | — | BLUE: internal or pilot record, needs internal sign-off before quoting |
| 146 | `LF-CINCOZE-DA1200` | Cincoze DA-1200 — GPU-Accelerated Edge Controller | €1,850 | archived | — | — | no | — | archived subscription record |
| 147 | `LF-DOCA-NETWORK` | DOCA Network + Storage Services — OVS-DOCA + HBN + SNAP | €2,000 | archived | — | — | no | — | archived subscription record |
| 148 | `LF-GOV-AIRGAP` | Government Ready — Air-Gap Bundle (per release) | €1,500 | archived | — | — | no | — | archived subscription record |
| 149 | `LF-IPC-409` | iPCMax IPC-409 — Fanless DIN-Rail Gateway | €345 | archived | — | — | no | — | archived subscription record |
| 150 | `LF-IPC-P68` | iPCMax IPC-P68 — Rugged Edge Controller | €680 | archived | — | — | no | — | archived subscription record |
| 151 | `LWM-ONT-IND` | LWM Industry Ontology — Single Vertical | €2,990 | archived | — | — | no | — | archived subscription record |
| 152 | `LWM-ONT-SUITE` | LWM Ontology Suite — All 25 Industries | €14,990 | archived | — | — | no | — | archived subscription record |
| 153 | `professional-web-pages` | Kotisivut pk-yritykselle | €750 | archived | — | — | no | — | archived; superseded by LIFETIME-WEB-STARTER |
| 154 | `LAND-THEMIS` | Themis Coordinator Workshop | €29,990 | discontinued | — | — | no | — | discontinued |
| 155 | `TH-T2` | Themis Coordinator — Pro | €2,499 | discontinued | — | — | no | — | discontinued |
