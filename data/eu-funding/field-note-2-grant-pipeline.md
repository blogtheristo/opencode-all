# Field Note 2 — EU Grant Pipeline (Lifetime Oy / DWS IQ)

_Source: derived from `all-horizon-open-forthcoming-grants.md` (Field Note 1 — 513 Horizon Europe Open/Forthcoming calls, manually captured 2026-07-18). Cross-matched against the canonical 25-industry taxonomy (`dws10.com/config/industries.json`, `industriesServedTotal: 25`) plus AI/compliance relevance. Reordered by deadline urgency (soonest first)._

_Compiled: 2026-07-18 · 6 grants_

## Pipeline — reordered by deadline

| # | Grant | Identifier | Industry (of 25) | Opens | Deadline | Funding size | Fit |
|---|---|---|---|---|---|---|---|
| 1 | Advanced data platforms to integrate whole life carbon in building information tools, assessments, and certification (Built4People Partnership) | `HORIZON-CL5-2026-09-D4-03` | **#8 Construction & Buildings** | — (Open now) | **15 Sep 2026** ⚠️ soonest | Not captured — different call than #4/#6 below, budget not in original scrape | ★★★★★ Closest conceptual match to DWS IQ itself — a carbon-data platform for buildings |
| 2 | R&I in Support of the Clean Industrial Deal: Decarbonisation of energy intensive industries (IA) (Processes4Planet and Clean Steel partnerships) | `HORIZON-CID-2026-01-01` | **#2 Iron & Steel** (Fit-for-55/ETS core) | — (Open now) | **15 Sep 2026** ⚠️ soonest | Not captured — not in original scrape | ★★★★☆ Literally "decarbonising energy-intensive industry" — core of DWS IQ's compliance-intelligence pitch. 2027 cutoff sibling also exists: `HORIZON-CID-2027-01-01`, deadline 15 Sep 2027 |
| 3 | EIC Accelerator 2026 – Short proposal | `HORIZON-EIC-2026-ACCELERATOR-01` | Platform-wide (SME scale-up, not industry-specific) | 06 Nov 2025 (Open now) | **17 Dec 2026** | Grant up to €2.5M, or blended finance €2.5M grant + ~€0.5–17.5M equity (typical EIC-wide parameters — not scrape-verified for this cutoff) | ★★★★★ Flagship deep-tech SME scale-up; highest funding ceiling; active focus |
| 4 | Energy efficiency and sustainability of AI data processing in Data Centres (IA) | `HORIZON-CL4-2027-04-DATA-09` | **#24 Data Centres** | 17 Nov 2026 | **18 Mar 2027** | **Confirmed:** €39,000,000 call budget · ~€10,000,000 per project · 3 grants expected | ★★★★☆ AI + energy efficiency + a named industry in the 25 — direct R&D funding (not FSTP mechanism) |
| 5 | Apply AI: Challenge-Driven AI Innovation Booster in Apply AI prioritised sectors (RIA) (Partnership in AI, Data and Robotics) | `HORIZON-CL4-2027-04-DIGITAL-EMERGING-04` | Healthcare / Manufacturing / Autonomous driving only — **not** DWS IQ's core sectors | 17 Nov 2026 | **18 Mar 2027** | **Confirmed:** €42,000,000 call budget · ~€14,000,000 per project · 3 grants expected | ★★☆☆☆ Weak fit — sectors don't match; mechanism is an SME competition (FSTP grants of €300K→€2.25M distributed by the consortium), not direct R&D funding to the applicant. Kept in pipeline for completeness, lowest priority. |
| 6 | Large scale operational validation and upscaling of state-of-the-art (Generative) AI tools and models powering a next generation digital energy system | `HORIZON-CL5-2027-02-D3-24` | **#1 Power & Heat Generation** | 03 Dec 2026 | **31 Mar 2027** | **Confirmed:** €20,000,000 call budget · ~€10,000,000 per project · 2 grants expected | ★★★★★ Direct match to DWS IQ's Control Room / climate-intelligence platform |

## Data gaps

Funding size for #1 and #2 was not in the original 513-grant scrape (list view has no budget field) and has not yet been pulled from their topic-details pages — unlike #4, #5, #6, which are confirmed from actual topic pages (2026-07-18). Do not treat #1/#2 amounts as known; confirm before committing prep effort:

- `HORIZON-CL5-2026-09-D4-03` — topic-details URL not yet confirmed (construct from identifier pattern and verify)
- `HORIZON-CID-2026-01-01` — topic-details URL not yet confirmed

## Detail notes carried over from Field Note 1

Full topic descriptions, destinations, TRL, eligibility, and sibling-topic budgets for #4 (`HORIZON-CL4-2027-04-DATA-09`'s call family) and #6 (`HORIZON-CL5-2027-02-D3-24`) are documented in `all-horizon-open-forthcoming-grants.md` under "Notes — HORIZON-CL5-2027-02-D3-24" and "Notes — HORIZON-CL4-2027-04-DIGITAL-EMERGING-04" (same call families, sibling budget tables included there).

## Methodology

Cross-match performed by scanning all 513 items in Field Note 1 (filtered to `Open For Submission` + `Forthcoming`) against:
1. **25-industry keyword sets** derived from `dws10.com/config/industries.json` (`industriesServedTotal: 25`)
2. **AI-relevance terms:** artificial intelligence, generative AI, machine learning, agent-based, agentic, digital twin
3. **Compliance-relevance terms:** compliance, CBAM, CSRD, ETS, emissions, carbon, decarbonisation, climate, sustainability, circular, NIS2, GDPR, EU AI Act

45 grants matched at least one industry + at least one AI/compliance term. The 6 above are the highest-fit subset (strong industry match + genuine AI or core-compliance relevance, excluding false positives like substring collisions on "port"/"building" inside unrelated words).
