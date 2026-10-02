# DWS Product Valuation — TAM and value per product

# VERSION AND AGENT HISTORY

---

Version: 1.35 [Latest]

Sessions & Modifications:

- Version: 1.35 [Latest] | Tool: scripts/truth/product-valuation.mjs | Changes: Generated from dws10.com/config/products.json 1.35 and config/truth/product-valuation-model.json (as of 2026-09-25). Do not edit by hand.

Document Status:

- Language: English
- Publication Status: INTERNAL — model estimate, not a market study; segment sizes marked "estimate" must be verified before investor use (DWS_TRUTH_STANDARD.md)
- Canonical row: DWS_TRUTH_STANDARD.md §2 row 45

---

## Result

| Measure | Low | Central | High |
| --- | --- | --- | --- |
| Published products: present value (81 offers) | €339k | €677k | €1.35M |
| Unpublished products: present value (65 BLUE offers, probability × 0.5) | €70k | €139k | €279k |
| **All products** (146 offers) | €408k | €817k | €1.63M |
| Repository as product-development environment: AI-assisted rebuild cost | €1.41M | — | €2.35M |
| Repository: traditional rebuild cost (basic COCOMO, 277 KSLOC, 880 person-months) | — | €7.04M | — |

Sum of product TAMs: €2.54B per year. Year-5 obtainable revenue (SOM): €3.44M. Documented R&D (hours ledger 2018–09/2025): €778k; capitalised on the balance sheet: €594k.

Unpublished products are valued at 0.5 × their family probability: Unpublished offers (BLUE internal or pilot records, and planned products) are part of the valuation (HIC 25.09.2026: "Myös julkaisemattomat tuotteet ovat osa valuation"). They are not on sale yet, so their family probability is halved and they are reported as a separate subtotal. Planned products without a price have no TAM until the HIC prices them.

Unpriced or planned (no TAM yet): firehorse-mobile.

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
| aegis | 4 | 1.00 % | 6x | 0.2 | €48.28M | €156k |
| firehorse | 9 | 0.10 % | 4x | 0.2 | €106.06M | €23k |
| data | 4 | 0.30 % | 6x | 0.2 | €226.65M | €220k |
| services | 18 | 0.05 % | 1x | 0.5 | €461.02M | €31k |
| hardware | 11 | 0.10 % | 0.5x | 0.4 | €78.52M | €4k |
| infra | 17 | 0.10 % | 3x | 0.25 | €294.51M | €59k |
| agents365 | 56 | 0.10 % | 6x | 0.2 | €727.14M | €118k |
| land | 9 | 0.10 % | 1.5x | 0.3 | €362.45M | €22k |

## Every offer (published and unpublished)

| # | ID | Published | Family | Segment | Buyers × fit | Annual value / buyer | TAM / yr | SOM yr 5 | Value low | Value central | Value high |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `LF-ONTOLOGY-25` | yes | data | EU_INDUSTRIAL* | 4,000 | €25k (yearly price) | €100.00M | €300k | €48k | €97k | €194k |
| 2 | `DWS-CLIMATE-001` | yes | dwsiq | EU_CSRD_LARGE | 2,500 | €36k (monthly x 12) | €89.97M | €180k | €36k | €73k | €145k |
| 3 | `LWM-ONT-SOVEREIGN` | yes | data | EU_INDUSTRIAL* | 4,000 | €17k (one-time / 3 y) | €66.65M | €200k | €32k | €65k | €129k |
| 4 | `DWS-AEGIS-001` | yes | aegis | EU_REGULATED* | 900 | €20k (one-time / 3 y) | €18.00M | €180k | €29k | €58k | €116k |
| 5 | `DWS-AEGIS-IMPL-001` | yes | aegis | EU_REGULATED* | 900 | €15k (one-time / 3 y) | €13.50M | €135k | €22k | €44k | €87k |
| 6 | `DWS-EU-PILOT` | yes | dwsiq | EU_CSRD_LARGE | 2,500 | €18k (monthly x 12) | €44.97M | €90k | €18k | €36k | €73k |
| 7 | `DWS-AEGIS-SUB-001` | yes | aegis | EU_REGULATED* | 900 | €12k (monthly x 12) | €10.79M | €108k | €17k | €35k | €70k |
| 8 | `LF-ONTOLOGY-PILOT` | yes | data | EU_INDUSTRIAL* | 2,000 | €15k (one-time, yearly purchase) | €30.00M | €90k | €15k | €29k | €58k |
| 9 | `LF-TRAIN-IND` | yes | data | EU_INDUSTRIAL* | 2,000 | €15k (one-time, yearly purchase) | €30.00M | €90k | €15k | €29k | €58k |
| 10 | `DWS-AEGIS-PILOT-001` | yes | aegis | EU_REGULATED* | 900 | €7k (one-time / 3 y) | €6.00M | €60k | €10k | €19k | €39k |
| 11 | `WF-T4` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €240k (monthly x 12) | €119.94M | €120k | €10k | €19k | €39k |
| 12 | `DWS-IQ-SUB-001` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €6k (monthly x 12) | €23.95M | €48k | €10k | €19k | €39k |
| 13 | `LF-DOCA-NETWORK-STORAGE` | yes | infra | EU_EDGE_SITES* | 3,000 | €24k (monthly x 12) | €72.00M | €72k | €7k | €15k | €29k |
| 14 | `LF-NIM-BIOLOGY` | yes | infra | EU_EDGE_SITES* | 3,000 | €24k (monthly x 12) | €72.00M | €72k | €7k | €15k | €29k |
| 15 | `DWS-EU-STARTER` | yes | dwsiq | EU_CSRD_LARGE | 2,500 | €6k (monthly x 12) | €14.97M | €30k | €6k | €12k | €24k |
| 16 | `DWS-IQ-ESS-SUB-MANAGED` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €3k (monthly x 12) | €11.95M | €24k | €5k | €10k | €19k |
| 17 | `omnichannel-multimodal` | yes | firehorse | EU_MIDLARGE* | 5,000 | €8k (monthly x 12) | €41.94M | €42k | €5k | €9k | €18k |
| 18 | `CONSTR-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €102k (monthly x 12) | €50.99M | €51k | €4k | €8k | €16k |
| 19 | `DWS-US-PILOT` | yes | dwsiq | EU_MIDLARGE* | 1,000 | €10k (monthly x 12) | €9.59M | €19k | €4k | €8k | €15k |
| 20 | `LAND-WF` | no (BLUE) | land | EU_MIDLARGE* | 500 | €250k (one-time, yearly purchase) | €125.00M | €125k | €4k | €8k | €15k |
| 21 | `ESG-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €84k (monthly x 12) | €41.99M | €42k | €3k | €7k | €14k |
| 22 | `LF-GOV-READY-ANNUAL` | yes | infra | EU_REGULATED* | 900 | €36k (monthly x 12) | €32.40M | €32k | €3k | €7k | €13k |
| 23 | `FH-SUB-001` | yes | firehorse | EU_MIDLARGE* | 5,000 | €6k (monthly x 12) | €29.94M | €30k | €3k | €6k | €13k |
| 24 | `AC365-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €78k (monthly x 12) | €38.99M | €39k | €3k | €6k | €13k |
| 25 | `consulting-fit55` | yes | services | EU_MIDLARGE* | 2,500 | €36k (monthly x 12) | €90.00M | €45k | €3k | €6k | €12k |
| 26 | `DWS365-CMP-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €72k (monthly x 12) | €35.99M | €36k | €3k | €6k | €12k |
| 27 | `DWS-IQ-006` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €2k (one-time / 3 y) | €6.67M | €13k | €3k | €5k | €11k |
| 28 | `SOV-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €66k (monthly x 12) | €32.99M | €33k | €3k | €5k | €11k |
| 29 | `FH-SKILL-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €66k (monthly x 12) | €32.99M | €33k | €3k | €5k | €11k |
| 30 | `HSE-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €60k (monthly x 12) | €29.99M | €30k | €2k | €5k | €10k |
| 31 | `LIFETIME-BUNDLE-2026` | yes | dwsiq | EU_CSRD_LARGE | 2,500 | €2k (one-time / 3 y) | €5.42M | €11k | €2k | €4k | €9k |
| 32 | `consulting-hourly` | yes | services | EU_MIDLARGE* | 2,500 | €25k (hourly x 100 h) | €62.50M | €31k | €2k | €4k | €8k |
| 33 | `CONSTR-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €48k (monthly x 12) | €23.99M | €24k | €2k | €4k | €8k |
| 34 | `GTM-T3` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €48k (monthly x 12) | €23.99M | €24k | €2k | €4k | €8k |
| 35 | `KYA-JEV-001` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €1k (monthly x 12) | €4.75M | €10k | €2k | €4k | €8k |
| 36 | `LF-DOCA-ESSENTIAL` | yes | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 37 | `LF-NIM-STARTER` | yes | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 38 | `LF-NIM-RETRIEVAL` | yes | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 39 | `LF-NIM-CODE` | yes | infra | EU_EDGE_SITES* | 3,000 | €6k (monthly x 12) | €18.00M | €18k | €2k | €4k | €7k |
| 40 | `ai-agent-engineering` | yes | services | EU_MIDLARGE* | 2,500 | €20k (hourly x 100 h) | €50.00M | €25k | €2k | €3k | €7k |
| 41 | `LAND-OPS` | no (BLUE) | land | EU_MIDLARGE* | 500 | €110k (one-time, yearly purchase) | €54.99M | €55k | €2k | €3k | €7k |
| 42 | `sovereignty-cloud-consulting` | yes | services | EU_MIDLARGE* | 2,500 | €18k (monthly x 12) | €45.00M | €23k | €2k | €3k | €6k |
| 43 | `CMP-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €36k (monthly x 12) | €17.99M | €18k | €1k | €3k | €6k |
| 44 | `DWS-US-STARTER` | yes | dwsiq | EU_MIDLARGE* | 1,000 | €4k (monthly x 12) | €3.59M | €7k | €1k | €3k | €6k |
| 45 | `LAND-CSRD` | no (BLUE) | land | EU_MIDLARGE* | 500 | €90k (one-time, yearly purchase) | €44.99M | €45k | €1k | €3k | €5k |
| 46 | `FH-SIGN-001` | yes | firehorse | EU_MIDLARGE* | 5,000 | €2k (monthly x 12) | €11.94M | €12k | €1k | €3k | €5k |
| 47 | `LF-K8S-T4` | yes | infra | EU_EDGE_SITES* | 3,000 | €4k (one-time / 3 y) | €12.00M | €12k | €1k | €2k | €5k |
| 48 | `SS-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €30k (monthly x 12) | €14.99M | €15k | €1k | €2k | €5k |
| 49 | `LF-DOCA-SECURITY` | yes | infra | EU_REGULATED* | 900 | €12k (monthly x 12) | €10.80M | €11k | €1k | €2k | €4k |
| 50 | `LF-SOV-MODEL-SUB` | yes | infra | EU_EDGE_SITES* | 3,000 | €4k (monthly x 12) | €10.76M | €11k | €1k | €2k | €4k |
| 51 | `LAND-SOV` | no (BLUE) | land | EU_MIDLARGE* | 500 | €70k (one-time, yearly purchase) | €34.99M | €35k | €1k | €2k | €4k |
| 52 | `LIFETIME-IT-TUKI-10H` | yes | sme | FI_SME* | 29,000 | €150 (one-time / 5 y) | €4.35M | €13k | €1k | €2k | €4k |
| 53 | `ai-koulutus-3d` | yes | services | EU_MIDLARGE* | 5,000 | €6k (one-time, yearly purchase) | €31.25M | €16k | €1k | €2k | €4k |
| 54 | `claude-code-coaching-3day` | yes | services | EU_MIDLARGE* | 5,000 | €6k (one-time, yearly purchase) | €29.50M | €15k | €993 | €2k | €4k |
| 55 | `MO-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €24k (monthly x 12) | €11.99M | €12k | €969 | €2k | €4k |
| 56 | `SG-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €24k (monthly x 12) | €11.99M | €12k | €969 | €2k | €4k |
| 57 | `SOV-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €24k (monthly x 12) | €11.99M | €12k | €969 | €2k | €4k |
| 58 | `DWS-IQ-ESS-SUB-SELF` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €588 (monthly x 12) | €2.35M | €5k | €950 | €2k | €4k |
| 59 | `LIFETIME-WEB-STARTER` | yes | sme | FI_SME* | 29,000 | €130 (one-time / 5 y) | €3.77M | €11k | €914 | €2k | €4k |
| 60 | `FH-AUTO-001` | yes | firehorse | EU_MIDLARGE* | 5,000 | €2k (one-time / 3 y) | €8.25M | €8k | €889 | €2k | €4k |
| 61 | `LOG-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €22k (monthly x 12) | €10.79M | €11k | €872 | €2k | €3k |
| 62 | `AIS-OUTCOME-PILOT` | yes | services | EU_MIDLARGE* | 2,500 | €10k (one-time, yearly purchase) | €24.98M | €12k | €841 | €2k | €3k |
| 63 | `business-mentor-30` | yes | services | EU_MIDLARGE* | 5,000 | €5k (one-time, yearly purchase) | €24.80M | €12k | €835 | €2k | €3k |
| 64 | `claude-code-coaching-workshop` | yes | services | EU_MIDLARGE* | 5,000 | €5k (one-time, yearly purchase) | €22.50M | €11k | €757 | €2k | €3k |
| 65 | `LAND-LCA` | no (BLUE) | land | EU_MIDLARGE* | 500 | €50k (one-time, yearly purchase) | €25.00M | €25k | €757 | €2k | €3k |
| 66 | `LAND-GTM` | no (BLUE) | land | EU_MIDLARGE* | 500 | €50k (one-time, yearly purchase) | €25.00M | €25k | €757 | €2k | €3k |
| 67 | `CMP-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 68 | `SS-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 69 | `ED-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 70 | `QG-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 71 | `CS-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 72 | `VIA-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 73 | `IND-VULCAN` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 74 | `IND-TALOS` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 75 | `IND-GAIA` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 76 | `IND-PROM` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 77 | `IND-BESS` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €18k (monthly x 12) | €8.99M | €9k | €727 | €1k | €3k |
| 78 | `FH-RPT-001` | yes | dwsiq | EU_CSRD_LARGE | 2,500 | €666 (one-time / 3 y) | €1.67M | €3k | €673 | €1k | €3k |
| 79 | `LF-SITROOM-001` | yes | hardware | EU_EDGE_SITES* | 6,000 | €4k (one-time / 4 y) | €24.02M | €24k | €647 | €1k | €3k |
| 80 | `claude-code-coaching-project` | yes | services | EU_MIDLARGE* | 2,500 | €8k (one-time, yearly purchase) | €18.75M | €9k | €631 | €1k | €3k |
| 81 | `MO-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €16k (monthly x 12) | €7.79M | €8k | €630 | €1k | €3k |
| 82 | `SG-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €16k (monthly x 12) | €7.79M | €8k | €630 | €1k | €3k |
| 83 | `LOG-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €16k (monthly x 12) | €7.79M | €8k | €630 | €1k | €3k |
| 84 | `SOV-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €16k (monthly x 12) | €7.79M | €8k | €630 | €1k | €3k |
| 85 | `conversational-agent` | yes | firehorse | EU_MIDLARGE* | 5,000 | €1k (one-time / 3 y) | €5.83M | €6k | €628 | €1k | €3k |
| 86 | `LAND-EUAI` | no (BLUE) | land | EU_MIDLARGE* | 500 | €40k (one-time, yearly purchase) | €20.00M | €20k | €606 | €1k | €2k |
| 87 | `FH-CMS-001` | yes | firehorse | EU_MIDLARGE* | 5,000 | €1000 (one-time / 3 y) | €5.00M | €5k | €538 | €1k | €2k |
| 88 | `LAND-AIL` | no (BLUE) | land | EU_MIDLARGE* | 500 | €35k (one-time, yearly purchase) | €17.50M | €17k | €530 | €1k | €2k |
| 89 | `LIFETIME-WEBSTORE-MINI` | yes | sme | FI_SME* | 29,000 | €70 (one-time / 5 y) | €2.03M | €6k | €492 | €984 | €2k |
| 90 | `LF-IGX-ORIN` | yes | hardware | EU_EDGE_SITES* | 6,000 | €3k (one-time / 4 y) | €17.98M | €18k | €484 | €969 | €2k |
| 91 | `ED-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 92 | `QG-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 93 | `CSAT-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 94 | `LF-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 95 | `SEO-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 96 | `VIA-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 97 | `IND-MARS` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 98 | `IND-HELIOS` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 99 | `IND-CERES` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 100 | `IND-NEPTUN` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12k (monthly x 12) | €5.99M | €6k | €484 | €969 | €2k |
| 101 | `LF-K8S-T2` | yes | infra | EU_EDGE_SITES* | 3,000 | €2k (one-time / 3 y) | €4.50M | €5k | €454 | €909 | €2k |
| 102 | `LAND-HSE` | no (BLUE) | land | EU_MIDLARGE* | 500 | €30k (one-time, yearly purchase) | €14.99M | €15k | €454 | €909 | €2k |
| 103 | `CS-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €11k (monthly x 12) | €5.39M | €5k | €436 | €872 | €2k |
| 104 | `DWS-IQ-ESS-SETUP` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €266 (one-time / 3 y) | €1.07M | €2k | €430 | €861 | €2k |
| 105 | `AIS-EU-SOV-OC` | yes | services | EU_MIDLARGE* | 2,500 | €5k (one-time, yearly purchase) | €12.47M | €6k | €420 | €840 | €2k |
| 106 | `lean-project` | yes | services | EU_MIDLARGE* | 2,500 | €5k (one-time, yearly purchase) | €12.40M | €6k | €417 | €835 | €2k |
| 107 | `DW-T2` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €10k (monthly x 12) | €4.79M | €5k | €387 | €775 | €2k |
| 108 | `edge-node-gn100` | yes | hardware | EU_EDGE_SITES* | 6,000 | €2k (one-time / 4 y) | €12.01M | €12k | €324 | €647 | €1k |
| 109 | `LF-DGX-SPARK` | yes | hardware | EU_EDGE_SITES* | 6,000 | €2k (one-time / 4 y) | €12.01M | €12k | €324 | €647 | €1k |
| 110 | `claude-code-coaching-lecture` | yes | services | EU_MIDLARGE* | 5,000 | €2k (one-time, yearly purchase) | €9.50M | €5k | €320 | €640 | €1k |
| 111 | `aws-consultancy` | yes | services | EU_MIDLARGE* | 2,500 | €4k (one-time, yearly purchase) | €9.38M | €5k | €316 | €631 | €1k |
| 112 | `CSAT-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €7k (monthly x 12) | €3.59M | €4k | €290 | €581 | €1k |
| 113 | `LF-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €7k (monthly x 12) | €3.59M | €4k | €290 | €581 | €1k |
| 114 | `SEO-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €7k (monthly x 12) | €3.59M | €4k | €290 | €581 | €1k |
| 115 | `DW-T1` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €7k (monthly x 12) | €3.59M | €4k | €290 | €581 | €1k |
| 116 | `DWS-SOVEREIGN-DB-001` | yes | dwsiq | EU_INDUSTRIAL* | 4,000 | €166 (one-time / 3 y) | €665k | €1k | €269 | €538 | €1k |
| 117 | `LF-K8S-T3` | yes | infra | EU_REGULATED* | 900 | €3k (one-time / 3 y) | €2.25M | €2k | €227 | €454 | €909 |
| 118 | `LF-GOV-READY-SETUP` | yes | infra | EU_REGULATED* | 900 | €3k (one-time / 3 y) | €2.25M | €2k | €227 | €454 | €909 |
| 119 | `devops-lead` | yes | services | EU_MIDLARGE* | 2,500 | €3k (one-time, yearly purchase) | €6.25M | €3k | €210 | €421 | €842 |
| 120 | `ai-consulting-agentic` | yes | services | EU_MIDLARGE* | 2,500 | €3k (one-time, yearly purchase) | €6.25M | €3k | €210 | €421 | €842 |
| 121 | `firehorse-data-services` | yes | firehorse | EU_MIDLARGE* | 5,000 | €300 (one-time / 3 y) | €1.50M | €1k | €161 | €323 | €646 |
| 122 | `LF-K8S-T1` | yes | infra | EU_EDGE_SITES* | 3,000 | €500 (one-time / 3 y) | €1.50M | €2k | €151 | €303 | €606 |
| 123 | `LF-JETSON-AGX` | yes | hardware | EU_EDGE_SITES* | 6,000 | €674 (one-time / 4 y) | €4.04M | €4k | €109 | €218 | €435 |
| 124 | `ai-consultant-day` | yes | services | EU_MIDLARGE* | 2,500 | €1k (one-time, yearly purchase) | €3.00M | €2k | €101 | €202 | €404 |
| 125 | `LF-NVIDIA-INSTALL` | yes | infra | EU_EDGE_SITES* | 3,000 | €332 (one-time / 3 y) | €995k | €995 | €100 | €201 | €402 |
| 126 | `FH-OMNI-001` | yes | firehorse | EU_MIDLARGE* | 5,000 | €166 (one-time / 3 y) | €832k | €832 | €90 | €179 | €358 |
| 127 | `firehorse-flow` | yes | firehorse | EU_MIDLARGE* | 5,000 | €166 (one-time / 3 y) | €832k | €832 | €90 | €179 | €358 |
| 128 | `firehorse-coach` | yes | services | EU_MIDLARGE* | 5,000 | €499 (one-time, yearly purchase) | €2.50M | €1k | €84 | €168 | €336 |
| 129 | `LF-JETSON-NX` | yes | hardware | EU_EDGE_SITES* | 6,000 | €498 (one-time / 4 y) | €2.98M | €3k | €80 | €161 | €322 |
| 130 | `LF-IPCMAX-CINCOZE-DA1200` | yes | hardware | EU_EDGE_SITES* | 6,000 | €463 (one-time / 4 y) | €2.77M | €3k | €75 | €149 | €299 |
| 131 | `LF-FIPS-VALIDATION` | yes | infra | EU_REGULATED* | 900 | €667 (one-time / 3 y) | €600k | €600 | €61 | €121 | €242 |
| 132 | `LF-GOV-AIRGAP-BUNDLE` | yes | infra | EU_REGULATED* | 900 | €500 (one-time / 3 y) | €450k | €450 | €45 | €91 | €182 |
| 133 | `CMP-OC-ENT` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €833 (one-time / 3 y) | €417k | €417 | €34 | €67 | €135 |
| 134 | `LF-JETSON-NANO` | yes | hardware | EU_EDGE_SITES* | 6,000 | €191 (one-time / 4 y) | €1.15M | €1k | €31 | €62 | €123 |
| 135 | `LF-IPCMAX-IPCP68` | yes | hardware | EU_EDGE_SITES* | 6,000 | €170 (one-time / 4 y) | €1.02M | €1k | €27 | €55 | €110 |
| 136 | `LF-IPCMAX-IPC409` | yes | hardware | EU_EDGE_SITES* | 6,000 | €86 (one-time / 4 y) | €518k | €518 | €14 | €28 | €56 |
| 137 | `CMP-OC-STD` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €333 (one-time / 3 y) | €167k | €167 | €13 | €27 | €54 |
| 138 | `MO-OC-ENT` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €333 (one-time / 3 y) | €167k | €167 | €13 | €27 | €54 |
| 139 | `DWS-IQ-FREE-2026` | yes | dwsiq | EU_CSRD_LARGE | 2,500 | €12 (monthly x 12) | €30k | €60 | €12 | €24 | €48 |
| 140 | `MO-OC-STD` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €166 (one-time / 3 y) | €83k | €83 | €7 | €13 | €27 |
| 141 | `SS-OC-ENT` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €33 (one-time / 3 y) | €17k | €17 | €1 | €3 | €5 |
| 142 | `SS-OC-STD` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €16 (one-time / 3 y) | €8k | €8 | €1 | €1 | €3 |
| 143 | `CMP-T0` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12 (monthly x 12) | €6k | €6 | €0 | €1 | €2 |
| 144 | `SS-T0` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12 (monthly x 12) | €6k | €6 | €0 | €1 | €2 |
| 145 | `MO-T0` | no (BLUE) | agents365 | EU_MIDLARGE* | 500 | €12 (monthly x 12) | €6k | €6 | €0 | €1 | €2 |
| 146 | `LF-COMPLIANCE-AMBULANCE-001` | yes | hardware | EU_EDGE_SITES* | 6,000 | €0 (one-time / 4 y) | €2k | €2 | €0 | €0 | €0 |

\* segment size is a model estimate to verify.
