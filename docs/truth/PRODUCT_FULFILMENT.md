# DWS Product Fulfilment & Readiness Classification

# VERSION AND AGENT HISTORY

---

Version: 1.33 [Latest]

Sessions & Modifications:

- Version: 1.33 [Latest] | Tool: scripts/truth/product-fulfilment.mjs | Changes: Generated from dws10.com/config/products.json catalogue 1.33 and config/truth/product-capability-chapters.json (chapter map transcribed from docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md). Do not edit by hand; run the script. HIC 27.09.2026: report-only — never gates, hides or blocks a sale.

Document Status:

- Language: English
- Publication Status: ACTIVE (internal — reporting only, no public-facing behavior change)

---

## Purpose

HIC 27.09.2026: "go through ALL 138 product records; keep all current selling surfaces live; make
each product payable/deliverable by adding factual delivery implementation data... never
fabricate external payment links or claims." This report classifies every catalogue product by
shared capability family (the implementation chapter that owns its runtime — never 138
independent stacks), records the legal seller of record, and states the payment/quote route and
capacity/contract-scope evidence status exactly as encoded in the catalogue today. **This report
changes no publication or payment behavior.** It is read by `scripts/validate-product-publication.mjs`
only to print warnings, never to fail the build.

## Summary

| Measure | Count |
| --- | --- |
| Total catalogue products classified | 138 |
| Unmapped (must be 0) | 0 |
| Reconciles (every product mapped to exactly one chapter) | yes |
| Payment route: self-serve checkout (revolutLink present) | 8 |
| Payment route: named contact route | 0 |
| Payment route: product-page quote (page exists, no self-serve link yet) | 0 |
| Payment route: undetermined | 0 |
| Capacity evidence: exempt (§5.11–§5.13) | 68 |
| Capacity evidence: complete | 70 |
| Capacity evidence: gap (backlog) | 0 |
| Contract scope: complete (exclusions + acceptanceKpi) | 138 |
| Contract scope: partial | 0 |
| Contract scope: gap (backlog) | 0 |

## By capability family (implementation chapter)

| Chapter | Products |
| --- | --- |
| Chapter 1 | 3 |
| Chapter 2 | 17 |
| Chapter 3 | 12 |
| Chapter 4 | 5 |
| Chapter 5 | 9 |
| Chapter 6 | 12 |
| Chapter 7 | 15 |
| Chapter 8 | 17 |
| Chapter 9 | 9 |
| Chapter 10 | 12 |
| Chapter 11 | 9 |
| Chapter 12 | 9 |
| Chapter 13 | 9 |

## Every product

| # | ID | Chapter | Owner | Payment route | Capacity | Contract scope | Backlog |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `AC365-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-AC365-T3](./PRODUCT_READINESS_BACKLOG.md#rb-ac365-t3) |
| 2 | `ai-agent-engineering` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-ai-agent-engineering](./PRODUCT_READINESS_BACKLOG.md#rb-ai-agent-engineering) |
| 3 | `ai-consultant-day` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-ai-consultant-day](./PRODUCT_READINESS_BACKLOG.md#rb-ai-consultant-day) |
| 4 | `ai-consulting-agentic` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-ai-consulting-agentic](./PRODUCT_READINESS_BACKLOG.md#rb-ai-consulting-agentic) |
| 5 | `ai-koulutus-3d` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-ai-koulutus-3d](./PRODUCT_READINESS_BACKLOG.md#rb-ai-koulutus-3d) |
| 6 | `AIS-EU-SOV-OC` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-AIS-EU-SOV-OC](./PRODUCT_READINESS_BACKLOG.md#rb-ais-eu-sov-oc) |
| 7 | `AIS-OUTCOME-PILOT` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-AIS-OUTCOME-PILOT](./PRODUCT_READINESS_BACKLOG.md#rb-ais-outcome-pilot) |
| 8 | `aws-consultancy` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-aws-consultancy](./PRODUCT_READINESS_BACKLOG.md#rb-aws-consultancy) |
| 9 | `business-mentor-30` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-business-mentor-30](./PRODUCT_READINESS_BACKLOG.md#rb-business-mentor-30) |
| 10 | `claude-code-coaching-3day` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-claude-code-coaching-3day](./PRODUCT_READINESS_BACKLOG.md#rb-claude-code-coaching-3day) |
| 11 | `claude-code-coaching-lecture` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-claude-code-coaching-lecture](./PRODUCT_READINESS_BACKLOG.md#rb-claude-code-coaching-lecture) |
| 12 | `claude-code-coaching-project` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-claude-code-coaching-project](./PRODUCT_READINESS_BACKLOG.md#rb-claude-code-coaching-project) |
| 13 | `claude-code-coaching-workshop` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-claude-code-coaching-workshop](./PRODUCT_READINESS_BACKLOG.md#rb-claude-code-coaching-workshop) |
| 14 | `CMP-OC-ENT` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-CMP-OC-ENT](./PRODUCT_READINESS_BACKLOG.md#rb-cmp-oc-ent) |
| 15 | `CMP-OC-STD` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-CMP-OC-STD](./PRODUCT_READINESS_BACKLOG.md#rb-cmp-oc-std) |
| 16 | `CMP-T0` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CMP-T0](./PRODUCT_READINESS_BACKLOG.md#rb-cmp-t0) |
| 17 | `CMP-T1` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CMP-T1](./PRODUCT_READINESS_BACKLOG.md#rb-cmp-t1) |
| 18 | `CMP-T2` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CMP-T2](./PRODUCT_READINESS_BACKLOG.md#rb-cmp-t2) |
| 19 | `CONSTR-T2` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CONSTR-T2](./PRODUCT_READINESS_BACKLOG.md#rb-constr-t2) |
| 20 | `CONSTR-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CONSTR-T3](./PRODUCT_READINESS_BACKLOG.md#rb-constr-t3) |
| 21 | `consulting-fit55` | Chapter 2 | Lifetime Oy | self-serve-checkout | exempt | complete | [RB-consulting-fit55](./PRODUCT_READINESS_BACKLOG.md#rb-consulting-fit55) |
| 22 | `consulting-hourly` | Chapter 2 | Lifetime Oy | self-serve-checkout | exempt | complete | [RB-consulting-hourly](./PRODUCT_READINESS_BACKLOG.md#rb-consulting-hourly) |
| 23 | `conversational-agent` | Chapter 5 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-conversational-agent](./PRODUCT_READINESS_BACKLOG.md#rb-conversational-agent) |
| 24 | `CS-T1` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CS-T1](./PRODUCT_READINESS_BACKLOG.md#rb-cs-t1) |
| 25 | `CS-T2` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CS-T2](./PRODUCT_READINESS_BACKLOG.md#rb-cs-t2) |
| 26 | `CSAT-T1` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CSAT-T1](./PRODUCT_READINESS_BACKLOG.md#rb-csat-t1) |
| 27 | `CSAT-T2` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-CSAT-T2](./PRODUCT_READINESS_BACKLOG.md#rb-csat-t2) |
| 28 | `devops-lead` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-devops-lead](./PRODUCT_READINESS_BACKLOG.md#rb-devops-lead) |
| 29 | `DW-T1` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-DW-T1](./PRODUCT_READINESS_BACKLOG.md#rb-dw-t1) |
| 30 | `DW-T2` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-DW-T2](./PRODUCT_READINESS_BACKLOG.md#rb-dw-t2) |
| 31 | `DWS-AEGIS-001` | Chapter 4 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-AEGIS-001](./PRODUCT_READINESS_BACKLOG.md#rb-dws-aegis-001) |
| 32 | `DWS-AEGIS-IMPL-001` | Chapter 4 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-AEGIS-IMPL-001](./PRODUCT_READINESS_BACKLOG.md#rb-dws-aegis-impl-001) |
| 33 | `DWS-AEGIS-PILOT-001` | Chapter 4 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-AEGIS-PILOT-001](./PRODUCT_READINESS_BACKLOG.md#rb-dws-aegis-pilot-001) |
| 34 | `DWS-AEGIS-SUB-001` | Chapter 4 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-AEGIS-SUB-001](./PRODUCT_READINESS_BACKLOG.md#rb-dws-aegis-sub-001) |
| 35 | `DWS-CLIMATE-001` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-CLIMATE-001](./PRODUCT_READINESS_BACKLOG.md#rb-dws-climate-001) |
| 36 | `DWS-EU-PILOT` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-EU-PILOT](./PRODUCT_READINESS_BACKLOG.md#rb-dws-eu-pilot) |
| 37 | `DWS-EU-STARTER` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-EU-STARTER](./PRODUCT_READINESS_BACKLOG.md#rb-dws-eu-starter) |
| 38 | `DWS-IQ-006` | Chapter 3 | Lifetime Oy | self-serve-checkout | complete | complete | [RB-DWS-IQ-006](./PRODUCT_READINESS_BACKLOG.md#rb-dws-iq-006) |
| 39 | `DWS-IQ-ESS-SETUP` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-IQ-ESS-SETUP](./PRODUCT_READINESS_BACKLOG.md#rb-dws-iq-ess-setup) |
| 40 | `DWS-IQ-FREE-2026` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-IQ-FREE-2026](./PRODUCT_READINESS_BACKLOG.md#rb-dws-iq-free-2026) |
| 41 | `DWS-SOVEREIGN-DB-001` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-SOVEREIGN-DB-001](./PRODUCT_READINESS_BACKLOG.md#rb-dws-sovereign-db-001) |
| 42 | `DWS-US-PILOT` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-US-PILOT](./PRODUCT_READINESS_BACKLOG.md#rb-dws-us-pilot) |
| 43 | `DWS-US-STARTER` | Chapter 3 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-DWS-US-STARTER](./PRODUCT_READINESS_BACKLOG.md#rb-dws-us-starter) |
| 44 | `DWS365-CMP-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-DWS365-CMP-T3](./PRODUCT_READINESS_BACKLOG.md#rb-dws365-cmp-t3) |
| 45 | `ED-T1` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-ED-T1](./PRODUCT_READINESS_BACKLOG.md#rb-ed-t1) |
| 46 | `ED-T2` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-ED-T2](./PRODUCT_READINESS_BACKLOG.md#rb-ed-t2) |
| 47 | `edge-node-gn100` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-edge-node-gn100](./PRODUCT_READINESS_BACKLOG.md#rb-edge-node-gn100) |
| 48 | `ESG-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-ESG-T3](./PRODUCT_READINESS_BACKLOG.md#rb-esg-t3) |
| 49 | `FH-AUTO-001` | Chapter 5 | Lifetime Oy | self-serve-checkout | complete | complete | [RB-FH-AUTO-001](./PRODUCT_READINESS_BACKLOG.md#rb-fh-auto-001) |
| 50 | `FH-CMS-001` | Chapter 5 | Lifetime Oy | self-serve-checkout | complete | complete | [RB-FH-CMS-001](./PRODUCT_READINESS_BACKLOG.md#rb-fh-cms-001) |
| 51 | `FH-OMNI-001` | Chapter 5 | Lifetime Oy | self-serve-checkout | complete | complete | [RB-FH-OMNI-001](./PRODUCT_READINESS_BACKLOG.md#rb-fh-omni-001) |
| 52 | `FH-RPT-001` | Chapter 5 | Lifetime Oy | self-serve-checkout | complete | complete | [RB-FH-RPT-001](./PRODUCT_READINESS_BACKLOG.md#rb-fh-rpt-001) |
| 53 | `FH-SIGN-001` | Chapter 5 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-FH-SIGN-001](./PRODUCT_READINESS_BACKLOG.md#rb-fh-sign-001) |
| 54 | `FH-SKILL-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-FH-SKILL-T3](./PRODUCT_READINESS_BACKLOG.md#rb-fh-skill-t3) |
| 55 | `firehorse-coach` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-firehorse-coach](./PRODUCT_READINESS_BACKLOG.md#rb-firehorse-coach) |
| 56 | `firehorse-data-services` | Chapter 5 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-firehorse-data-services](./PRODUCT_READINESS_BACKLOG.md#rb-firehorse-data-services) |
| 57 | `firehorse-flow` | Chapter 5 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-firehorse-flow](./PRODUCT_READINESS_BACKLOG.md#rb-firehorse-flow) |
| 58 | `GTM-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-GTM-T3](./PRODUCT_READINESS_BACKLOG.md#rb-gtm-t3) |
| 59 | `HSE-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-HSE-T3](./PRODUCT_READINESS_BACKLOG.md#rb-hse-t3) |
| 60 | `IND-BESS` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-BESS](./PRODUCT_READINESS_BACKLOG.md#rb-ind-bess) |
| 61 | `IND-CERES` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-CERES](./PRODUCT_READINESS_BACKLOG.md#rb-ind-ceres) |
| 62 | `IND-GAIA` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-GAIA](./PRODUCT_READINESS_BACKLOG.md#rb-ind-gaia) |
| 63 | `IND-HELIOS` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-HELIOS](./PRODUCT_READINESS_BACKLOG.md#rb-ind-helios) |
| 64 | `IND-MARS` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-MARS](./PRODUCT_READINESS_BACKLOG.md#rb-ind-mars) |
| 65 | `IND-NEPTUN` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-NEPTUN](./PRODUCT_READINESS_BACKLOG.md#rb-ind-neptun) |
| 66 | `IND-PROM` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-PROM](./PRODUCT_READINESS_BACKLOG.md#rb-ind-prom) |
| 67 | `IND-TALOS` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-TALOS](./PRODUCT_READINESS_BACKLOG.md#rb-ind-talos) |
| 68 | `IND-VULCAN` | Chapter 12 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-IND-VULCAN](./PRODUCT_READINESS_BACKLOG.md#rb-ind-vulcan) |
| 69 | `KYA-JEV-001` | Chapter 4 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-KYA-JEV-001](./PRODUCT_READINESS_BACKLOG.md#rb-kya-jev-001) |
| 70 | `LAND-AIL` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-AIL](./PRODUCT_READINESS_BACKLOG.md#rb-land-ail) |
| 71 | `LAND-CSRD` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-CSRD](./PRODUCT_READINESS_BACKLOG.md#rb-land-csrd) |
| 72 | `LAND-EUAI` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-EUAI](./PRODUCT_READINESS_BACKLOG.md#rb-land-euai) |
| 73 | `LAND-GTM` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-GTM](./PRODUCT_READINESS_BACKLOG.md#rb-land-gtm) |
| 74 | `LAND-HSE` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-HSE](./PRODUCT_READINESS_BACKLOG.md#rb-land-hse) |
| 75 | `LAND-LCA` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-LCA](./PRODUCT_READINESS_BACKLOG.md#rb-land-lca) |
| 76 | `LAND-OPS` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-OPS](./PRODUCT_READINESS_BACKLOG.md#rb-land-ops) |
| 77 | `LAND-SOV` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-SOV](./PRODUCT_READINESS_BACKLOG.md#rb-land-sov) |
| 78 | `LAND-WF` | Chapter 13 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LAND-WF](./PRODUCT_READINESS_BACKLOG.md#rb-land-wf) |
| 79 | `lean-project` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-lean-project](./PRODUCT_READINESS_BACKLOG.md#rb-lean-project) |
| 80 | `LF-COMPLIANCE-AMBULANCE-001` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-COMPLIANCE-AMBULANCE-001](./PRODUCT_READINESS_BACKLOG.md#rb-lf-compliance-ambulance-001) |
| 81 | `LF-DGX-SPARK` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-DGX-SPARK](./PRODUCT_READINESS_BACKLOG.md#rb-lf-dgx-spark) |
| 82 | `LF-DOCA-ESSENTIAL` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-DOCA-ESSENTIAL](./PRODUCT_READINESS_BACKLOG.md#rb-lf-doca-essential) |
| 83 | `LF-DOCA-NETWORK-STORAGE` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-DOCA-NETWORK-STORAGE](./PRODUCT_READINESS_BACKLOG.md#rb-lf-doca-network-storage) |
| 84 | `LF-DOCA-SECURITY` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-DOCA-SECURITY](./PRODUCT_READINESS_BACKLOG.md#rb-lf-doca-security) |
| 85 | `LF-FIPS-VALIDATION` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-FIPS-VALIDATION](./PRODUCT_READINESS_BACKLOG.md#rb-lf-fips-validation) |
| 86 | `LF-GOV-AIRGAP-BUNDLE` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-GOV-AIRGAP-BUNDLE](./PRODUCT_READINESS_BACKLOG.md#rb-lf-gov-airgap-bundle) |
| 87 | `LF-GOV-READY-ANNUAL` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-GOV-READY-ANNUAL](./PRODUCT_READINESS_BACKLOG.md#rb-lf-gov-ready-annual) |
| 88 | `LF-GOV-READY-SETUP` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-GOV-READY-SETUP](./PRODUCT_READINESS_BACKLOG.md#rb-lf-gov-ready-setup) |
| 89 | `LF-IGX-ORIN` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-IGX-ORIN](./PRODUCT_READINESS_BACKLOG.md#rb-lf-igx-orin) |
| 90 | `LF-IPCMAX-CINCOZE-DA1200` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-IPCMAX-CINCOZE-DA1200](./PRODUCT_READINESS_BACKLOG.md#rb-lf-ipcmax-cincoze-da1200) |
| 91 | `LF-IPCMAX-IPC409` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-IPCMAX-IPC409](./PRODUCT_READINESS_BACKLOG.md#rb-lf-ipcmax-ipc409) |
| 92 | `LF-IPCMAX-IPCP68` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-IPCMAX-IPCP68](./PRODUCT_READINESS_BACKLOG.md#rb-lf-ipcmax-ipcp68) |
| 93 | `LF-JETSON-AGX` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-JETSON-AGX](./PRODUCT_READINESS_BACKLOG.md#rb-lf-jetson-agx) |
| 94 | `LF-JETSON-NANO` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-JETSON-NANO](./PRODUCT_READINESS_BACKLOG.md#rb-lf-jetson-nano) |
| 95 | `LF-JETSON-NX` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-JETSON-NX](./PRODUCT_READINESS_BACKLOG.md#rb-lf-jetson-nx) |
| 96 | `LF-K8S-T1` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-K8S-T1](./PRODUCT_READINESS_BACKLOG.md#rb-lf-k8s-t1) |
| 97 | `LF-K8S-T2` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-K8S-T2](./PRODUCT_READINESS_BACKLOG.md#rb-lf-k8s-t2) |
| 98 | `LF-K8S-T3` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-K8S-T3](./PRODUCT_READINESS_BACKLOG.md#rb-lf-k8s-t3) |
| 99 | `LF-K8S-T4` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-K8S-T4](./PRODUCT_READINESS_BACKLOG.md#rb-lf-k8s-t4) |
| 100 | `LF-NIM-BIOLOGY` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-NIM-BIOLOGY](./PRODUCT_READINESS_BACKLOG.md#rb-lf-nim-biology) |
| 101 | `LF-NIM-CODE` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-NIM-CODE](./PRODUCT_READINESS_BACKLOG.md#rb-lf-nim-code) |
| 102 | `LF-NIM-RETRIEVAL` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-NIM-RETRIEVAL](./PRODUCT_READINESS_BACKLOG.md#rb-lf-nim-retrieval) |
| 103 | `LF-NIM-STARTER` | Chapter 7 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-NIM-STARTER](./PRODUCT_READINESS_BACKLOG.md#rb-lf-nim-starter) |
| 104 | `LF-NVIDIA-INSTALL` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-NVIDIA-INSTALL](./PRODUCT_READINESS_BACKLOG.md#rb-lf-nvidia-install) |
| 105 | `LF-SITROOM-001` | Chapter 6 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-LF-SITROOM-001](./PRODUCT_READINESS_BACKLOG.md#rb-lf-sitroom-001) |
| 106 | `LF-T1` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LF-T1](./PRODUCT_READINESS_BACKLOG.md#rb-lf-t1) |
| 107 | `LF-T2` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LF-T2](./PRODUCT_READINESS_BACKLOG.md#rb-lf-t2) |
| 108 | `LIFETIME-BUNDLE-2026` | Chapter 3 | Lifetime Oy | self-serve-checkout | complete | complete | [RB-LIFETIME-BUNDLE-2026](./PRODUCT_READINESS_BACKLOG.md#rb-lifetime-bundle-2026) |
| 109 | `LIFETIME-IT-TUKI-10H` | Chapter 1 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LIFETIME-IT-TUKI-10H](./PRODUCT_READINESS_BACKLOG.md#rb-lifetime-it-tuki-10h) |
| 110 | `LIFETIME-WEB-STARTER` | Chapter 1 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LIFETIME-WEB-STARTER](./PRODUCT_READINESS_BACKLOG.md#rb-lifetime-web-starter) |
| 111 | `LIFETIME-WEBSTORE-MINI` | Chapter 1 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LIFETIME-WEBSTORE-MINI](./PRODUCT_READINESS_BACKLOG.md#rb-lifetime-webstore-mini) |
| 112 | `LOG-T1` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LOG-T1](./PRODUCT_READINESS_BACKLOG.md#rb-log-t1) |
| 113 | `LOG-T2` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-LOG-T2](./PRODUCT_READINESS_BACKLOG.md#rb-log-t2) |
| 114 | `MO-OC-ENT` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-MO-OC-ENT](./PRODUCT_READINESS_BACKLOG.md#rb-mo-oc-ent) |
| 115 | `MO-OC-STD` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-MO-OC-STD](./PRODUCT_READINESS_BACKLOG.md#rb-mo-oc-std) |
| 116 | `MO-T0` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-MO-T0](./PRODUCT_READINESS_BACKLOG.md#rb-mo-t0) |
| 117 | `MO-T1` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-MO-T1](./PRODUCT_READINESS_BACKLOG.md#rb-mo-t1) |
| 118 | `MO-T2` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-MO-T2](./PRODUCT_READINESS_BACKLOG.md#rb-mo-t2) |
| 119 | `omnichannel-multimodal` | Chapter 5 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-omnichannel-multimodal](./PRODUCT_READINESS_BACKLOG.md#rb-omnichannel-multimodal) |
| 120 | `professional-web-pages` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-professional-web-pages](./PRODUCT_READINESS_BACKLOG.md#rb-professional-web-pages) |
| 121 | `QG-T1` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-QG-T1](./PRODUCT_READINESS_BACKLOG.md#rb-qg-t1) |
| 122 | `QG-T2` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-QG-T2](./PRODUCT_READINESS_BACKLOG.md#rb-qg-t2) |
| 123 | `SEO-T1` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SEO-T1](./PRODUCT_READINESS_BACKLOG.md#rb-seo-t1) |
| 124 | `SEO-T2` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SEO-T2](./PRODUCT_READINESS_BACKLOG.md#rb-seo-t2) |
| 125 | `SG-T1` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SG-T1](./PRODUCT_READINESS_BACKLOG.md#rb-sg-t1) |
| 126 | `SG-T2` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SG-T2](./PRODUCT_READINESS_BACKLOG.md#rb-sg-t2) |
| 127 | `SOV-T1` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SOV-T1](./PRODUCT_READINESS_BACKLOG.md#rb-sov-t1) |
| 128 | `SOV-T2` | Chapter 9 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SOV-T2](./PRODUCT_READINESS_BACKLOG.md#rb-sov-t2) |
| 129 | `SOV-T3` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SOV-T3](./PRODUCT_READINESS_BACKLOG.md#rb-sov-t3) |
| 130 | `sovereignty-cloud-consulting` | Chapter 2 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-sovereignty-cloud-consulting](./PRODUCT_READINESS_BACKLOG.md#rb-sovereignty-cloud-consulting) |
| 131 | `SS-OC-ENT` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-SS-OC-ENT](./PRODUCT_READINESS_BACKLOG.md#rb-ss-oc-ent) |
| 132 | `SS-OC-STD` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | complete | complete | [RB-SS-OC-STD](./PRODUCT_READINESS_BACKLOG.md#rb-ss-oc-std) |
| 133 | `SS-T0` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SS-T0](./PRODUCT_READINESS_BACKLOG.md#rb-ss-t0) |
| 134 | `SS-T1` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SS-T1](./PRODUCT_READINESS_BACKLOG.md#rb-ss-t1) |
| 135 | `SS-T2` | Chapter 8 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-SS-T2](./PRODUCT_READINESS_BACKLOG.md#rb-ss-t2) |
| 136 | `VIA-T1` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-VIA-T1](./PRODUCT_READINESS_BACKLOG.md#rb-via-t1) |
| 137 | `VIA-T2` | Chapter 10 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-VIA-T2](./PRODUCT_READINESS_BACKLOG.md#rb-via-t2) |
| 138 | `WF-T4` | Chapter 11 | Lifetime Oy | self-serve-checkout-fallback | exempt | complete | [RB-WF-T4](./PRODUCT_READINESS_BACKLOG.md#rb-wf-t4) |
