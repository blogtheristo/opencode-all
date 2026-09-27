---
Status: PENDING_REVIEW
Date: 2026-09-21
Author: Claude Code (session standby)
Topic: Product readiness/maturity assessment (subjective, not measured PMF)
---

# Tuotteiden valmiusarvio 1-5 tähteä (134 kpl)

## Menetelmä ja rajaus (lue ennen taulukkoa)

**Tämä EI ole mitattu product-market fit.** Repositoryssä ei ole per-tuote myynti-, asiakas- tai konversiodataa (ei kytkettyä CRM:ää, ei tilaustaulua, ei LOI-rekisteriä `products.json`:n rinnalla). Alla oleva tähtiluokitus on **Claude Coden subjektiivinen valmiusarvio** kunkin tuotteen kaupallisesta esitystavasta `dws10.com/config/products.json`-tiedostossa, laskettuna läpinäkyvillä proxy-signaaleilla:

- **+1** `featured: true` (nostettu esille kaupassa)
- **+1** oikea checkout-linkki olemassa (Revolut- tai PayPal-plan ID)
- **+1** sijoitettu `buyPage`-sivulle (näkyy ostopolussa)
- **+0.5** ydinkategoria (`platform` tai `advisory`, ei lisäosa/laite/digitaalinen)
- **+0.5** versio > 1.0 (iteroitu vähintään kerran)
- **+0.5** kuvaus > 300 merkkiä (määrittely kypsempi)
- Discontinued-tuotteet katetaan tähteen 1

**Tulkinta:** korkea tähtiluokitus = tuote on esitetty valmiimmin/kaupallisemmin *kaupan konfiguraatiossa*. Se ei todista, että markkina on ostanut tuotetta — todellinen PMF vaatii asiakastodisteen (maksavat asiakkaat, uusinta-aste, referenssit), jota ei tässä ole. Käytä tätä backlogina: mitkä tuotteet tarvitsevat ensin oikean asiakastodisteen ennen kuin niitä kutsutaan PMF-validoiduiksi.

**Jakauma:** ★★★★★ 10 kpl · ★★★★ 23 kpl · ★★★ 38 kpl · ★★ 63 kpl · ★ 0 kpl (yhteensä 134)

| ID | Nimi | Kategoria | Tyyppi | Hinta (EUR) | Tähdet | Perusteet |
|---|---|---|---|---|---|---|
| claude-code-coaching-3day | Claude Code Coaching — Lecture + Workshop (3 Days) | advisory | one-time | 5900 | ★★★★★ (5) | featured, sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| consulting-fit55 | Consulting Fit for 55 Specialist | advisory | monthly | 3000 | ★★★★★ (5) | featured, checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria |
| firehorse-coach | EU AI Act Literacy Training | advisory | one-time | 499 | ★★★★★ (5) | featured, sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| AIS-EU-SOV-OC | EU-Sovereign AI Migration — Per Workload | advisory | metered | 4990 | ★★★★★ (5) | featured, sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| AIS-OUTCOME-PILOT | Outcome-Priced Applied-AI Pilot (6 weeks) | advisory | one-time | 9990 | ★★★★★ (5) | featured, sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| consulting-hourly | Senior Compliance Specialist — Retainer + Outcomes | advisory | hourly | 250 | ★★★★★ (5) | checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| edge-node-gn100 | Control Room — Acer Veriton GN100 | hardware | one-time | 8008 | ★★★★★ (5) | featured, sijoitettu buy-pagelle, versio 2.0, kuvaus kypsä/yksityiskohtainen |
| LIFETIME-BUNDLE-2026 | Climate Reporting Starter Bundle | platform | one-time | 6500 | ★★★★★ (5) | featured, checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria |
| DWS-AEGIS-001 | DWS IQ Aegis | platform | one-time | 59990 | ★★★★★ (5) | featured, sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| DWS-IQ-006 | Lifetime DWS IQ Platform (Version 6) | platform | one-time | 4999 | ★★★★★ (5) | featured, checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria, versio 6, kuvaus kypsä/yksityiskohtainen |
| LAND-CSRD | CSRD Reporting Accelerator | advisory | bundle | 89990 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, ydinkategoria |
| LAND-EUAI | EU AI Act Compliance Sprint | advisory | bundle | 39990 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, ydinkategoria |
| lean-project | EU AI Project Accelerator (Fixed Price) | advisory | one-time | 4960 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| LAND-SOV | Sovereignty & NIS2 Sprint | advisory | bundle | 69990 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, ydinkategoria |
| ai-consulting-agentic | Agentic Software Development for EU Teams | ai-cloud | one-time | 2500 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| DWS-EU-PILOT | DWS IQ — EU Sovereign Pilot | ai-cloud | monthly | 1499 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle |
| DWS-EU-STARTER | DWS IQ — EU Sovereign Starter | ai-cloud | monthly | 499 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle |
| sovereignty-cloud-consulting | Sovereignty Cloud Consulting – European Cloud Migration | ai-cloud | monthly | 1500 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle |
| LF-COMPLIANCE-AMBULANCE-001 | DWS IQ Compliance Ambulance — Mobile Office (NVIDIA Thor Edge) | hardware | one-time | 1 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| LF-SITROOM-001 | Situation Room — Two Sovereign AI Nodes | hardware | one-time | 11598 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle |
| DWS-AEGIS-IMPL-001 | DWS IQ Aegis Implementation Programme (3 phases) | platform | one-time | 45000 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| DWS-AEGIS-PILOT-001 | DWS IQ Aegis Pilot (3 months) | platform | one-time | 19990 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| DWS-CLIMATE-001 | DWS IQ Climate Intelligence | platform | monthly | 2999 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, ydinkategoria |
| DWS-IQ-FREE-2026 | DWS IQ Free — 1 project, CSRD-ready | platform | subscription | 1 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, ydinkategoria |
| FH-RPT-001 | DWS IQ Report | platform | one-time | 1999 | ★★★★☆ (4) | checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria |
| FH-AUTO-001 | Firehorse Amplify | platform | one-time | 4950 | ★★★★☆ (4) | checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria |
| FH-CMS-001 | Firehorse Content Management | platform | one-time | 2999 | ★★★★☆ (4) | checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria |
| FH-OMNI-001 | Firehorse Omnichannel Next | platform | one-time | 499 | ★★★★☆ (4) | checkout-linkki olemassa, sijoitettu buy-pagelle, ydinkategoria |
| LF-GOV-READY-SETUP | Government Ready Cluster Setup | platform | one-time | 7500 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| LF-K8S-T4 | Kubernetes Orchestration — Full Infra Stack (Tier 4) | platform | one-time | 12000 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| LF-K8S-T3 | Kubernetes Orchestration — Gov Ready RKE2 (Tier 3) | platform | one-time | 7500 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| LF-K8S-T2 | Kubernetes Orchestration — HA Cluster k3s (Tier 2) | platform | one-time | 4500 | ★★★★☆ (4) | sijoitettu buy-pagelle, ydinkategoria, kuvaus kypsä/yksityiskohtainen |
| DWS-SOVEREIGN-DB-001 | Sovereign Database — EU Data Sovereignty for PostgreSQL | platform | one-time | 499 | ★★★★☆ (4) | featured, sijoitettu buy-pagelle, ydinkategoria |
| FH-SIGN-001 | Firehorse Signed Reports | add-on | subscription | 199 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| KYA-JEV-001 | kya-jev — KYA-Gated Typed Decisions (Early Access) | add-on | subscription | 99 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| ai-koulutus-3d | AI Koulutus 3 Days Programme | advisory | one-time | 6250 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| business-mentor-30 | Claude Code AI Coaching — 30 Hours | advisory | one-time | 4960 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| claude-code-coaching-lecture | Claude Code Coaching — 1-Day Lecture | advisory | one-time | 1900 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| claude-code-coaching-workshop | Claude Code Coaching — 2-Day Workshop | advisory | one-time | 4500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| claude-code-coaching-project | Claude Code Coaching — Client Project Work | advisory | one-time | 7500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| omnichannel-multimodal | Firehorse Omnichannel & Multimodal AI Assistant | advisory | monthly | 699 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| professional-web-pages | Kotisivut pk-yritykselle | advisory | package | 750 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| ai-agent-engineering | AI & Agent Engineering — Outcome-Backed Hourly | ai-cloud | hourly | 200 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| devops-lead | Assessment | ai-cloud | one-time | 2500 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| ai-consultant-day | Captain Day — One-Day AI Outcome | ai-cloud | one-time | 1200 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| DWS-US-PILOT | DWS IQ — US Cloud Pilot | ai-cloud | monthly | 799 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| DWS-US-STARTER | DWS IQ — US Cloud Starter | ai-cloud | monthly | 299 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| conversational-agent | EU-Hosted Conversational Agent | ai-cloud | one-time | 3500 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| aws-consultancy | EU-Sovereign AI Engineering & Cloud Consultancy | ai-cloud | one-time | 3750 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| firehorse-flow | AI Customer Agent | digital | one-time | 499 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| firehorse-data-services | Firehorse Data Services | digital | one-time | 899 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| LF-IPCMAX-CINCOZE-DA1200 | Cincoze DA-1200 — Rugged Expandable Edge Computer | hardware | one-time | 1850 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| LF-DGX-SPARK | DGX Spark — NVIDIA-Branded Sovereign Edge AI | hardware | one-time | 6109 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| LF-IGX-ORIN | IGX Orin — Industrial / Medical Sovereign Edge AI | hardware | one-time | 11990 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| LF-JETSON-AGX | Jetson Sensor Concentrator — AGX Orin 64GB + Install & Service | hardware | one-time | 2694 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| LF-JETSON-NX | Jetson Sensor Mid — Orin NX 16 GB + Install & Service | hardware | one-time | 1990 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| LF-JETSON-NANO | Jetson Sensor Node — Orin Nano Super + Install & Service | hardware | one-time | 764 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| LF-NVIDIA-INSTALL | NVIDIA Model Installation + Full Service | hardware | one-time | 995 | ★★★☆☆ (3) | sijoitettu buy-pagelle, kuvaus kypsä/yksityiskohtainen |
| LF-IPCMAX-IPC409 | iPCMax IPC-409 — Compact Fanless Sensor Gateway | hardware | one-time | 345 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| LF-IPCMAX-IPCP68 | iPCMax IPC-P68 — Vision Gateway with PoE | hardware | one-time | 680 | ★★★☆☆ (3) | sijoitettu buy-pagelle |
| LF-GOV-AIRGAP-BUNDLE | Air-Gapped Gov Ready Image Bundle | platform | one-time | 1500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-DOCA-ESSENTIAL | DOCA Microservices — Essential Package | platform | subscription | 500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-DOCA-NETWORK-STORAGE | DOCA Microservices — Networking & Storage Acceleration Package | platform | subscription | 2000 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-DOCA-SECURITY | DOCA Microservices — Security & Compliance Package | platform | subscription | 1000 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-FIPS-VALIDATION | FIPS 140-3 Validation Service | platform | one-time | 2000 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-GOV-READY-ANNUAL | Government Ready Annual Maintenance | platform | subscription | 3000 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-K8S-T1 | Kubernetes Orchestration — Single-Node k3s (Tier 1) | platform | one-time | 1500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-NIM-BIOLOGY | NIM Microservices — Biology & Genomics Profile | platform | subscription | 2000 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-NIM-CODE | NIM Microservices — Code Generation Profile | platform | subscription | 500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-NIM-RETRIEVAL | NIM Microservices — Retrieval & Embedding Profile | platform | subscription | 500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LF-NIM-STARTER | NIM Microservices — Starter Profile | platform | subscription | 500 | ★★★☆☆ (3) | sijoitettu buy-pagelle, ydinkategoria |
| LAND-AIL | AI Literacy Bridge | advisory | bundle | 34990 | ★★☆☆☆ (2) | ydinkategoria |
| LAND-LCA | Carbon Reporting Sprint | advisory | bundle | 49990 | ★★☆☆☆ (2) | ydinkategoria |
| LAND-OPS | Construction Ops Pilot | advisory | bundle | 109990 | ★★☆☆☆ (2) | ydinkategoria |
| LAND-WF | Full Workforce Onboarding | advisory | bundle | 249990 | ★★☆☆☆ (2) | ydinkategoria |
| LAND-GTM | Go-to-Market Sprint | advisory | bundle | 49990 | ★★☆☆☆ (2) | ydinkategoria |
| LAND-HSE | Site Safety Bootcamp | advisory | bundle | 29990 | ★★☆☆☆ (2) | ydinkategoria |
| AC365-T3 | Agentic Commerce 365 Skilled Agents | platform | subscription | 6499 | ★★☆☆☆ (2) | ydinkategoria |
| IND-BESS | BESS — Battery storage industry pod | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| IND-CERES | Ceres — Agri / Circular industry pod | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| CS-T2 | Competitor Surveillance — Pro | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| CS-T1 | Competitor Surveillance — Starter | platform | subscription | 899 | ★★☆☆☆ (2) | ydinkategoria |
| CMP-T0 | Compliance Agent — Pilot (60 days) | platform | subscription | 1 | ★★☆☆☆ (2) | ydinkategoria |
| CMP-T2 | Compliance Agent — Pro | platform | subscription | 2999 | ★★☆☆☆ (2) | ydinkategoria |
| CMP-T1 | Compliance Agent — Starter | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| CONSTR-T2 | Construction Agent — Pro (bundle) | platform | subscription | 3999 | ★★☆☆☆ (2) | ydinkategoria |
| CONSTR-T3 | Construction Ops Pod | platform | subscription | 8499 | ★★☆☆☆ (2) | ydinkategoria |
| CSAT-T2 | Customer Sat — Pro | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| CSAT-T1 | Customer Sat — Starter | platform | subscription | 599 | ★★☆☆☆ (2) | ydinkategoria |
| DWS365-CMP-T3 | DWS 365 Compliance Agents | platform | subscription | 5999 | ★★☆☆☆ (2) | ydinkategoria |
| DWS-IQ-ESS-SETUP | DWS IQ Essentials — Setup | platform | one-time | 799 | ★★☆☆☆ (2) | ydinkategoria |
| DW-T2 | Deepwiki Extractor — Pro | platform | subscription | 799 | ★★☆☆☆ (2) | ydinkategoria |
| DW-T1 | Deepwiki Extractor — Starter | platform | subscription | 599 | ★★☆☆☆ (2) | ydinkategoria |
| ESG-T3 | ESG Function-as-a-Service | platform | subscription | 6999 | ★★☆☆☆ (2) | ydinkategoria |
| ED-T2 | Emissions Data — Pro | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| ED-T1 | Emissions Data — Starter | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| FH-SKILL-T3 | Firehorse Skilled Agents | platform | subscription | 5499 | ★★☆☆☆ (2) | ydinkategoria |
| WF-T4 | Full Skilled Workforce | platform | subscription | 19990 | ★★☆☆☆ (2) | ydinkategoria |
| IND-GAIA | Gaia — Cement industry pod | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| GTM-T3 | Go-to-Market Pod | platform | subscription | 3999 | ★★☆☆☆ (2) | ydinkategoria |
| HSE-T3 | HSE Function-as-a-Service | platform | subscription | 4999 | ★★☆☆☆ (2) | ydinkategoria |
| IND-HELIOS | Helios — Energy industry pod | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| LF-T2 | Lead Feedback — Pro | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| LF-T1 | Lead Feedback — Starter | platform | subscription | 599 | ★★☆☆☆ (2) | ydinkategoria |
| LOG-T2 | Logistics — Pro | platform | subscription | 1799 | ★★☆☆☆ (2) | ydinkategoria |
| LOG-T1 | Logistics — Starter | platform | subscription | 1299 | ★★☆☆☆ (2) | ydinkategoria |
| IND-MARS | Mars — Construction industry pod | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| MO-T0 | Material Oracle — Pilot (60 days, 1 project) | platform | subscription | 1 | ★★☆☆☆ (2) | ydinkategoria |
| MO-T2 | Material Oracle — Pro | platform | subscription | 1999 | ★★☆☆☆ (2) | ydinkategoria |
| MO-T1 | Material Oracle — Starter | platform | subscription | 1299 | ★★☆☆☆ (2) | ydinkategoria |
| IND-NEPTUN | Neptune — Maritime industry pod | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| CMP-OC-ENT | Outcome — CSRD/CBAM/AI Act gap (Enterprise) | platform | metered | 2499 | ★★☆☆☆ (2) | ydinkategoria |
| CMP-OC-STD | Outcome — CSRD/CBAM/AI Act gap (Standard) | platform | metered | 999 | ★★☆☆☆ (2) | ydinkategoria |
| MO-OC-ENT | Outcome — LCA report (Enterprise) | platform | metered | 999 | ★★☆☆☆ (2) | ydinkategoria |
| MO-OC-STD | Outcome — LCA report (Standard) | platform | metered | 499 | ★★☆☆☆ (2) | ydinkategoria |
| SS-OC-ENT | Outcome — Site safety assessment (Enterprise) | platform | metered | 99 | ★★☆☆☆ (2) | ydinkategoria |
| SS-OC-STD | Outcome — Site safety assessment (Standard) | platform | metered | 49 | ★★☆☆☆ (2) | ydinkategoria |
| IND-PROM | Prometheus — Hydrogen industry pod | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| QG-T2 | Quality Gate — Pro | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| QG-T1 | Quality Gate — Starter | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| SEO-T2 | SEO Audit — Pro | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| SEO-T1 | SEO Audit — Starter | platform | subscription | 599 | ★★☆☆☆ (2) | ydinkategoria |
| SG-T2 | Schedule Genius — Pro | platform | subscription | 1999 | ★★☆☆☆ (2) | ydinkategoria |
| SG-T1 | Schedule Genius — Starter | platform | subscription | 1299 | ★★☆☆☆ (2) | ydinkategoria |
| SS-T0 | SiteSense — Pilot (30 days, 1 site) | platform | subscription | 1 | ★★☆☆☆ (2) | ydinkategoria |
| SS-T2 | SiteSense — Pro | platform | subscription | 2499 | ★★☆☆☆ (2) | ydinkategoria |
| SS-T1 | SiteSense — Starter | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| SOV-T3 | Sovereignty & Compliance Pack | platform | subscription | 5499 | ★★☆☆☆ (2) | ydinkategoria |
| SOV-T2 | Sovereignty Monitor — Pro | platform | subscription | 1999 | ★★☆☆☆ (2) | ydinkategoria |
| SOV-T1 | Sovereignty Monitor — Starter | platform | subscription | 1299 | ★★☆☆☆ (2) | ydinkategoria |
| IND-TALOS | Talos — Aluminium industry pod | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| VIA-T2 | Viability — Pro | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |
| VIA-T1 | Viability — Starter | platform | subscription | 999 | ★★☆☆☆ (2) | ydinkategoria |
| IND-VULCAN | Vulcan — Steel industry pod | platform | subscription | 1499 | ★★☆☆☆ (2) | ydinkategoria |

## HIC-päätöskysymys

Halutaanko tälle listalle todellinen PMF-mittari (esim. per-tuote kiinnostuneiden/demojen/LOI:iden määrä Supabase-tauluun), jotta ★-arvio voidaan myöhemmin korvata mitatulla PMF-pisteellä eikä proxy-arviolla?

## N/A-kohdat (Rule 12, Fail Loud)

- KB-päivitys: N/A — odottaa HIC-päätöstä mittaustavasta.
- Kalenterimerkintä: N/A — ei päivättyä sitoumusta.
