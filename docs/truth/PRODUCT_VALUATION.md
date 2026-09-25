# DWS Product Valuation — TAM and value per product

# VERSION AND AGENT HISTORY

---

Version: 1.33 [Latest]

Sessions & Modifications:

- Version: 1.33 [Latest] | Tool: scripts/truth/product-valuation.mjs | Changes: Generated from dws10.com/config/products.json 1.33 and config/truth/product-valuation-model.json (as of 2026-09-25). Do not edit by hand.

Document Status:

- Language: English
- Publication Status: INTERNAL — model estimate, not a market study; segment sizes marked "estimate" must be verified before investor use (DWS_TRUTH_STANDARD.md)
- Canonical row: DWS_TRUTH_STANDARD.md §2 row 45

---

## Result

| Measure | Low | Central | High |
| --- | --- | --- | --- |
| Products: present value (80 public offers) | €321k | €642k | €1.28M |
| Repository as product-development environment: AI-assisted rebuild cost | €1.41M | — | €2.35M |
| Repository: traditional rebuild cost (basic COCOMO, 277 KSLOC, 880 person-months) | — | €7.04M | — |

Sum of product TAMs: €1.43B per year. Year-5 obtainable revenue (SOM): €2.23M. Documented R&D (hours ledger 2018–09/2025): €778k; capitalised on the balance sheet: €594k.

Unpriced offers (price on application, no TAM): none.

## Method

- **TAM** — Bottom-up per product: buyers in the product's segment x fit (share of the segment the product is for) x annual value per buyer. Annual value: recurring price x 12 (monthly) or x 1 (yearly); hourly price x hoursPerYear; one-time price / replacementCycleYears.
- **SOM** — Year-5 obtainable revenue = TAM x the product family's year-5 capture share.
- **Value** — Present value = year-5 revenue x family revenue multiple x family probability of reaching it / (1 + discountRate)^5. Low and high cases halve and double the capture share. Discount rate 30 %: Venture hurdle rate for a pre-revenue software company (common 30-50 % range; lower bound used because two paid pilots exist, docs/TRACTION_CANONICAL.md).
- **Repository** — cost approach. Basic COCOMO (organic): effort = 2.4 × KSLOC^1.05 person-months, at the loaded monthly cost in the model. The AI-assisted range divides that by the model's productivity factor. Documentation, standards and data are not in the KSLOC count, so the figure is a floor for the environment, not a ceiling.

## Segments

| Segment | Buyers | Count | Status | Basis |
| --- | --- | --- | --- | --- |
| FI_SME | Finnish enterprises outside primary production (micro and small dominate) | 290,000 | estimate | Order of magnitude of the Statistics Finland business register; verify the current count before use. |
| EU_CSRD_LARGE | EU companies in CSRD scope after Omnibus I (>1,000 employees and >EUR 450M turnover) | 5,000 | sourced | DWS_TRUTH_STANDARD.md regulatory-scope row 2026-06-29: fewer than 5,000 large companies. |
| EU_INDUSTRIAL | EU manufacturing, energy and process-industry enterprises with 250+ employees | 20,000 | estimate | Order of magnitude of Eurostat structural business statistics; verify. |
| EU_EDGE_SITES | Industrial sites of EU_INDUSTRIAL enterprises that can host edge AI (about 3 sites per enterprise) | 60,000 | estimate | EU_INDUSTRIAL x 3 sites; verify. |
| EU_MIDLARGE | EU enterprises with 250+ employees, all sectors | 50,000 | estimate | Order of magnitude of Eurostat enterprise-size statistics; verify. |
| EU_REGULATED | EU defence, public-sector and critical-infrastructure bodies that need sovereign or air-gapped AI | 3,000 | estimate | Model estimate; verify against NIS2 essential-entity and EDIP participant counts. |

## Families

| Family | Offers | Year-5 capture | Multiple | Probability | TAM / yr | Value (central) |
| --- | --- | --- | --- | --- | --- | --- |
| sme | 3 | 0.30 % | 1x | 0.6 | €10.15M | €5k |
| dwsiq | 15 | 0.20 % | 6x | 0.25 | €221.60M | €179k |
| aegis | 3 | 1.00 % | 6x | 0.2 | €37.49M | €121k |
| firehorse | 9 | 0.10 % | 4x | 0.2 | €106.06M | €23k |
| data | 4 | 0.30 % | 6x | 0.2 | €226.65M | €220k |
| services | 18 | 0.05 % | 1x | 0.5 | €461.02M | €31k |
| hardware | 11 | 0.10 % | 0.5x | 0.4 | €69.04M | €4k |
| infra | 17 | 0.10 % | 3x | 0.25 | €294.51M | €59k |

## Every public offer

| # | ID | Family | Segment | Buyers × fit | Annual value / buyer | TAM / yr | SOM yr 5 | Value low | Value central | Value high |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `LF-ONTOLOGY-25` | data | EU_INDUSTRIAL* | 4,000 | €25k (yearly price) | €100.00M | €300k | €48k | €97k | €194k |
| 2 | `DWS-CLIMATE-001` | dwsiq | EU_CSRD_LARGE | 2,500 | €36k (monthly x 12) | €89.97M | €180k | €36k | €73k | €145k |
| 3 | `LWM-ONT-SOVEREIGN` | data | EU_INDUSTRIAL* | 4,000 | €17k (one-time / 3 y) | €66.65M | €200k | €32k | €65k | €129k |
| 4 | `DWS-AEGIS-001` | aegis | EU_REGULATED* | 900 | €20k (one-time / 3 y) | €18.00M | €180k | €29k | €58k | €116k |
| 5 | `DWS-AEGIS-IMPL-001` | aegis | EU_REGULATED* | 900 | €15k (one-time / 3 y) | €13.50M | €135k | €22k | €44k | €87k |
| 6 | `DWS-EU-PILOT` | dwsiq | EU_CSRD_LARGE | 2,500 | €18k (monthly x 12) | €44.97M | €90k | €18k | €36k | €73k |
| 7 | `LF-ONTOLOGY-PILOT` | data | EU_INDUSTRIAL* | 2,000 | €15k (one-time, yearly purchase) | €30.00M | €90k | €15k | €29k | €58k |
| 8 | `LF-TRAIN-IND` | data | EU_INDUSTRIAL* | 2,000 | €15k (one-time, yearly purchase) | €30.00M | €90k | €15k | €29k | €58k |
| 9 | `DWS-AEGIS-PILOT-001` | aegis | EU_REGULATED* | 900 | €7k (one-time / 3 y) | €6.00M | €60k | €10k | €19k | €39k |
| 10 | `DWS-IQ-SUB-001` | dwsiq | EU_INDUSTRIAL* | 4,000 | €6k (monthly x 12) | €23.95M | €48k | €10k | €19k | €39k |
| 11 | `LF-DOCA-NETWORK-STORAGE` | infra | EU_EDGE_SITES* | 3,000 | €24k (monthly x 12) | €72.00M | €72k | €7k | €15k | €29k |
| 12 | `LF-NIM-BIOLOGY` | infra | EU_EDGE_SITES* | 3,000 | €24k (monthly x 12) | €72.00M | €72k | €7k | €15k | €29k |
| 13 | `DWS-EU-STARTER` | dwsiq | EU_CSRD_LARGE | 2,500 | €6k (monthly x 12) | €14.97M | €30k | €6k | €12k | €24k |
| 14 | `DWS-IQ-ESS-SUB-MANAGED` | dwsiq | EU_INDUSTRIAL* | 4,000 | €3k (monthly x 12) | €11.95M | €24k | €5k | €10k | €19k |
| 15 | `omnichannel-multimodal` | firehorse | EU_MIDLARGE* | 5,000 | €8k (monthly x 12) | €41.94M | €42k | €5k | €9k | €18k |
| 16 | `DWS-US-PILOT` | dwsiq | EU_MIDLARGE* | 1,000 | €10k (monthly x 12) | €9.59M | €19k | €4k | €8k | €15k |
| 17 | `LF-GOV-READY-ANNUAL` | infra | EU_REGULATED* | 900 | €36k (monthly x 12) | €32.40M | €32k | €3k | €7k | €13k |
| 18 | `FH-SUB-001` | firehorse | EU_MIDLARGE* | 5,000 | €6k (monthly x 12) | €29.94M | €30k | €3k | €6k | €13k |
| 19 | `consulting-fit55` | services | EU_MIDLARGE* | 2,500 | €36k (monthly x 12) | €90.00M | €45k | €3k | €6k | €12k |
| 20 | `DWS-IQ-006` | dwsiq | EU_INDUSTRIAL* | 4,000 | €2k (one-time / 3 y) | €6.67M | €13k | €3k | €5k | €11k |
| 21 | `LIFETIME-BUNDLE-2026` | dwsiq | EU_CSRD_LARGE | 2,500 | €2k (one-time / 3 y) | €5.42M | €11k | €2k | €4k | €9k |
| 22 | `consulting-hourly` | services | EU_MIDLARGE* | 2,500 | €25k (hourly x 100 h) | €62.50M | €31k | €2k | €4k | €8k |
| 23 | `KYA-JEV-001` | dwsiq | EU_INDUSTRIAL* | 4,000 | €1k (monthly x 12) | €4.75M | €10k | €2k | €4k | €8k |
| 24 | `LF-DOCA-ESSENTIAL` | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 25 | `LF-NIM-STARTER` | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 26 | `LF-NIM-RETRIEVAL` | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 27 | `LF-NIM-CODE` | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 28 | `ai-agent-engineering` | services | EU_MIDLARGE* | 2,500 | €20k (hourly x 100 h) | €50.00M | €25k | €2k | €3k | €7k |
| 29 | `sovereignty-cloud-consulting` | services | EU_MIDLARGE* | 2,500 | €18k (monthly x 12) | €45.00M | €23k | €2k | €3k | €6k |
| 30 | `DWS-US-STARTER` | dwsiq | EU_MIDLARGE* | 1,000 | €4k (monthly x 12) | €3.59M | €7k | €1k | €3k | €6k |
| 31 | `FH-SIGN-001` | firehorse | EU_MIDLARGE* | 5,000 | €2k (monthly x 12) | €11.94M | €12k | €1k | €3k | €5k |
| 32 | `LF-K8S-T4` | infra | EU_EDGE_SITES* | 3,000 | €4k (one-time / 3 y) | €12.00M | €12k | €1k | €2k | €5k |
| 33 | `LF-DOCA-SECURITY` | infra | EU_REGULATED* | 900 | €12k (monthly x 12) | €10.80M | €11k | €1k | €2k | €4k |
| 34 | `LF-SOV-MODEL-SUB` | infra | EU_EDGE_SITES* | 3,000 | €4k (monthly x 12) | €10.76M | €11k | €1k | €2k | €4k |
| 35 | `LIFETIME-IT-TUKI-10H` | sme | FI_SME* | 29,000 | €150 (one-time / 5 y) | €4.35M | €13k | €1k | €2k | €4k |
| 36 | `ai-koulutus-3d` | services | EU_MIDLARGE* | 5,000 | €6k (one-time, yearly purchase) | €31.25M | €16k | €1k | €2k | €4k |
| 37 | `claude-code-coaching-3day` | services | EU_MIDLARGE* | 5,000 | €6k (one-time, yearly purchase) | €29.50M | €15k | €993 | €2k | €4k |
| 38 | `DWS-IQ-ESS-SUB-SELF` | dwsiq | EU_INDUSTRIAL* | 4,000 | €588 (monthly x 12) | €2.35M | €5k | €950 | €2k | €4k |
| 39 | `LIFETIME-WEB-STARTER` | sme | FI_SME* | 29,000 | €130 (one-time / 5 y) | €3.77M | €11k | €914 | €2k | €4k |
| 40 | `FH-AUTO-001` | firehorse | EU_MIDLARGE* | 5,000 | €2k (one-time / 3 y) | €8.25M | €8k | €889 | €2k | €4k |
| 41 | `AIS-OUTCOME-PILOT` | services | EU_MIDLARGE* | 2,500 | €10k (one-time, yearly purchase) | €24.98M | €12k | €841 | €2k | €3k |
| 42 | `business-mentor-30` | services | EU_MIDLARGE* | 5,000 | €5k (one-time, yearly purchase) | €24.80M | €12k | €835 | €2k | €3k |
| 43 | `claude-code-coaching-workshop` | services | EU_MIDLARGE* | 5,000 | €5k (one-time, yearly purchase) | €22.50M | €11k | €757 | €2k | €3k |
| 44 | `FH-RPT-001` | dwsiq | EU_CSRD_LARGE | 2,500 | €666 (one-time / 3 y) | €1.67M | €3k | €673 | €1k | €3k |
| 45 | `claude-code-coaching-project` | services | EU_MIDLARGE* | 2,500 | €8k (one-time, yearly purchase) | €18.75M | €9k | €631 | €1k | €3k |
| 46 | `conversational-agent` | firehorse | EU_MIDLARGE* | 5,000 | €1k (one-time / 3 y) | €5.83M | €6k | €628 | €1k | €3k |
| 47 | `FH-CMS-001` | firehorse | EU_MIDLARGE* | 5,000 | €1000 (one-time / 3 y) | €5.00M | €5k | €538 | €1k | €2k |
| 48 | `LIFETIME-WEBSTORE-MINI` | sme | FI_SME* | 29,000 | €70 (one-time / 5 y) | €2.03M | €6k | €492 | €984 | €2k |
| 49 | `LF-IGX-ORIN` | hardware | EU_EDGE_SITES* | 6,000 | €3k (one-time / 4 y) | €17.98M | €18k | €484 | €969 | €2k |
| 50 | `LF-SITROOM-001` | hardware | EU_EDGE_SITES* | 6,000 | €3k (one-time / 4 y) | €17.40M | €17k | €469 | €937 | €2k |
| 51 | `LF-K8S-T2` | infra | EU_EDGE_SITES* | 3,000 | €2k (one-time / 3 y) | €4.50M | €5k | €454 | €909 | €2k |
| 52 | `DWS-IQ-ESS-SETUP` | dwsiq | EU_INDUSTRIAL* | 4,000 | €266 (one-time / 3 y) | €1.07M | €2k | €430 | €861 | €2k |
| 53 | `AIS-EU-SOV-OC` | services | EU_MIDLARGE* | 2,500 | €5k (one-time, yearly purchase) | €12.47M | €6k | €420 | €840 | €2k |
| 54 | `lean-project` | services | EU_MIDLARGE* | 2,500 | €5k (one-time, yearly purchase) | €12.40M | €6k | €417 | €835 | €2k |
| 55 | `edge-node-gn100` | hardware | EU_EDGE_SITES* | 6,000 | €2k (one-time / 4 y) | €12.01M | €12k | €324 | €647 | €1k |
| 56 | `claude-code-coaching-lecture` | services | EU_MIDLARGE* | 5,000 | €2k (one-time, yearly purchase) | €9.50M | €5k | €320 | €640 | €1k |
| 57 | `aws-consultancy` | services | EU_MIDLARGE* | 2,500 | €4k (one-time, yearly purchase) | €9.38M | €5k | €316 | €631 | €1k |
| 58 | `DWS-SOVEREIGN-DB-001` | dwsiq | EU_INDUSTRIAL* | 4,000 | €166 (one-time / 3 y) | €665k | €1k | €269 | €538 | €1k |
| 59 | `LF-DGX-SPARK` | hardware | EU_EDGE_SITES* | 6,000 | €2k (one-time / 4 y) | €9.16M | €9k | €247 | €494 | €987 |
| 60 | `LF-K8S-T3` | infra | EU_REGULATED* | 900 | €3k (one-time / 3 y) | €2.25M | €2k | €227 | €454 | €909 |
| 61 | `LF-GOV-READY-SETUP` | infra | EU_REGULATED* | 900 | €3k (one-time / 3 y) | €2.25M | €2k | €227 | €454 | €909 |
| 62 | `devops-lead` | services | EU_MIDLARGE* | 2,500 | €3k (one-time, yearly purchase) | €6.25M | €3k | €210 | €421 | €842 |
| 63 | `ai-consulting-agentic` | services | EU_MIDLARGE* | 2,500 | €3k (one-time, yearly purchase) | €6.25M | €3k | €210 | €421 | €842 |
| 64 | `firehorse-data-services` | firehorse | EU_MIDLARGE* | 5,000 | €300 (one-time / 3 y) | €1.50M | €1k | €161 | €323 | €646 |
| 65 | `LF-K8S-T1` | infra | EU_EDGE_SITES* | 3,000 | €500 (one-time / 3 y) | €1.50M | €2k | €151 | €303 | €606 |
| 66 | `LF-JETSON-AGX` | hardware | EU_EDGE_SITES* | 6,000 | €674 (one-time / 4 y) | €4.04M | €4k | €109 | €218 | €435 |
| 67 | `ai-consultant-day` | services | EU_MIDLARGE* | 2,500 | €1k (one-time, yearly purchase) | €3.00M | €2k | €101 | €202 | €404 |
| 68 | `LF-NVIDIA-INSTALL` | infra | EU_EDGE_SITES* | 3,000 | €332 (one-time / 3 y) | €995k | €995 | €100 | €201 | €402 |
| 69 | `FH-OMNI-001` | firehorse | EU_MIDLARGE* | 5,000 | €166 (one-time / 3 y) | €832k | €832 | €90 | €179 | €358 |
| 70 | `firehorse-flow` | firehorse | EU_MIDLARGE* | 5,000 | €166 (one-time / 3 y) | €832k | €832 | €90 | €179 | €358 |
| 71 | `firehorse-coach` | services | EU_MIDLARGE* | 5,000 | €499 (one-time, yearly purchase) | €2.50M | €1k | €84 | €168 | €336 |
| 72 | `LF-JETSON-NX` | hardware | EU_EDGE_SITES* | 6,000 | €498 (one-time / 4 y) | €2.98M | €3k | €80 | €161 | €322 |
| 73 | `LF-IPCMAX-CINCOZE-DA1200` | hardware | EU_EDGE_SITES* | 6,000 | €463 (one-time / 4 y) | €2.77M | €3k | €75 | €149 | €299 |
| 74 | `LF-FIPS-VALIDATION` | infra | EU_REGULATED* | 900 | €667 (one-time / 3 y) | €600k | €600 | €61 | €121 | €242 |
| 75 | `LF-GOV-AIRGAP-BUNDLE` | infra | EU_REGULATED* | 900 | €500 (one-time / 3 y) | €450k | €450 | €45 | €91 | €182 |
| 76 | `LF-JETSON-NANO` | hardware | EU_EDGE_SITES* | 6,000 | €191 (one-time / 4 y) | €1.15M | €1k | €31 | €62 | €123 |
| 77 | `LF-IPCMAX-IPCP68` | hardware | EU_EDGE_SITES* | 6,000 | €170 (one-time / 4 y) | €1.02M | €1k | €27 | €55 | €110 |
| 78 | `LF-IPCMAX-IPC409` | hardware | EU_EDGE_SITES* | 6,000 | €86 (one-time / 4 y) | €518k | €518 | €14 | €28 | €56 |
| 79 | `DWS-IQ-FREE-2026` | dwsiq | EU_CSRD_LARGE | 2,500 | €12 (monthly x 12) | €30k | €60 | €12 | €24 | €48 |
| 80 | `LF-COMPLIANCE-AMBULANCE-001` | hardware | EU_EDGE_SITES* | 6,000 | €0 (one-time / 4 y) | €2k | €2 | €0 | €0 | €0 |

\* segment size is a model estimate to verify.
