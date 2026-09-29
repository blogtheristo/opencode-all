# Outokumpu — public IT/OT landscape (for the Aegis pilot scoping)

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/festive-cerf-87wf67 | Date: 28.09.2026 | Changes: HIC "find what hardware Outokumpu uses". Public web search only; page fetches were blocked by the sandbox egress proxy, so every claim rests on search snippets. Verify before quoting to the customer.

Document Status:

- Created: 28.09.2026
- Classification: INTERNAL — public sources only, organisations only
- Status: DESK RESEARCH — unverified at page level

---

## 1. Process automation (Level 1–2)

| Fact                                                                                          | Source (date)                                                                                                                                                                                     | Confidence     |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Primetals Level 2 on Tornio continuous casters CCM1/CCM2 (2019–2020)                          | [Primetals](https://www.primetals.com/press-media/news/primetals-technologies-achieves-successful-remote-commissioning-of-process-automation-of-continuous-caster-for-outokumpu-in-tornio) (2020) | Confirmed      |
| Primetals: Tornio AOD converter 1 modernisation incl. automation                              | primetals.com (2018, >5 y)                                                                                                                                                                        | Confirmed, old |
| Primetals Mold Expert Fiber on Tornio slab casters; DRAP cycloconverter drive                 | [Primetals magazine](https://magazine.primetals.com/2023/03/23/outokumpu-to-modernize-its-cycloconverter-with-primetals-technologies/) (2023)                                                     | Confirmed      |
| Metso (now Valmet) automation + electrification, Tornio ferrochrome plant → Valmet DCS likely | [mining.com](https://www.mining.com/metso-supplies-automation-and-process-electrification-to-outokumpus-new-ferrochrome-plant-in-tornio-finland/17/) (2011)                                       | Confirmed, old |
| Valmet furnace imaging cameras, Tornio ferrochrome                                            | [Valmet](https://www.valmet.com/media/news/press-releases/2019/valmet-delivers-boiler-diagnostics-systems-to-outokumpus-tornio-plant-in-finland/) (2019)                                          | Confirmed      |
| Calvert (US): Primetals Level 2 meltshop/casting as a 7-year subscription                     | primetals.com (~2025)                                                                                                                                                                             | Confirmed      |
| Avesta Steckel mill: SMS group                                                                | [SMS group](https://www.sms-group.com/br/plants/all-plants/steckel-mill/outokumpu-stainless-avesta-sweden/)                                                                                       | Confirmed      |

## 2. Quality / MES

| Fact                                                                                                       | Source (date)                                                                                                        | Confidence     |
| ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------- |
| ABB surface inspection, 5 systems at Tornio lines                                                          | [AIST](https://www.aist.org/abb-to-supply-5th-surface-inspection-system-for-outokumpu%E2%80%99s-tornio-works) (2009) | Confirmed, old |
| Nortal AI/ML surface inspection (ASIS) live at Tornio from 10.2024; Nortal is Global Data Platform partner | [Nortal](https://nortal.com/insights/ai-in-action-surface-defect-detection-in-outokumpu-stainless-steel) (~2024)     | Confirmed      |
| MES vendor, process historian                                                                              | —                                                                                                                    | **Gap**        |

## 3. Enterprise IT

| Fact                                                                                                                            | Source (date)                                                                                                                                                             | Confidence |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| SAP S/4HANA transformation (Accenture; Sogeti testing)                                                                          | [Sogeti](https://www.sogeti.fi/client-story/navigating-complexity-outokumpus-testing-journey-in-a-large-scale-transformation/) (~2022)                                    | Likely     |
| Tietoevry Tech Services: 5-year renewal — critical infrastructure, SAP platform, Azure public cloud for global production sites | [Tietoevry](https://www.tietoevry.com/en/newsroom/all-news-and-releases/press-releases/2025/04/tietoevry-tech-services-and-outokumpu-renews-their-partnership/) (04.2025) | Confirmed  |
| Azure + Databricks/Delta Lake lakehouse                                                                                         | job ad (~2026)                                                                                                                                                            | Likely     |

## 4. AI, edge, networks

| Fact                                                                                           | Source (date)                                                                                                             | Confidence |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Microsoft partnership (2019): Azure-based Outokumpu Digital Platform; Tornio = incubation site | [Outokumpu](https://www.outokumpu.com/en/news/2019/outokumpu-moves-forward-with-digital-manufacturing) (2019, 2021)       | Confirmed  |
| Solita: ML platform + governance, digital innovation hub                                       | [Solita](https://www.solita.fi/work/outokumpu-digital-innovation-hub-drives-ai-solutions-in-sustainable-stainless-steel/) | Confirmed  |
| Microsoft Intelligent Data Platform for sustainability/emissions data                          | [Microsoft](https://www.microsoft.com/en/customers/story/24140-outokumpu-intelligent-data-platform) (~2023)               | Confirmed  |
| On-prem GPU/AI compute, private 5G, OT security vendors                                        | —                                                                                                                         | **Gap**    |

## 5. Tornio control rooms

Nothing public. Nearest: Pinja simulation models for melt shop and hot mill ([Pinja](https://pinja.com/success-stories/outokumpu-tornio)) — weak.

## What this means for the Aegis pilot

1. **Outokumpu is cloud-first on Azure** (Microsoft, Tietoevry, Nortal, Solita). Aegis is a governed on-prem complement at Tornio, not a replacement. The Aegis "cloud optional" design fits: Hybrid is the likely deployment-mode recommendation.
2. **Gatekeepers beyond the buyer:** Tietoevry (runs infrastructure) and Nortal (data platform) will be asked about any box on site. Name them in Phase 0.
3. **Plug-in point:** a compact edge appliance in the DMZ, read-only — never Level 1 or Level 2 (Primetals Level 2 is a vendor subscription at Calvert, likely similar at Tornio). Data taps: document store for the IP-disclosure workflow; Level 2 databases, surface-inspection images or historian via OPC UA only if the control-room alternative is chosen.
4. **Questions for the first call:** which historian, which MES, who owns OT security, and whether Tietoevry's contract allows a customer-owned appliance on site.
