# 25-Industry Coverage Comparison & Gap Analysis

Compares all 25 EU-regulated industries the platform serves against our current
agent coverage and the market's best decarbonization efforts, and identifies
where **we need to offer more**. Backs the build of the universal
`industry-analyst` agent and `src/agents/data/industry-registry.ts`.

---

# VERSION AND AGENT HISTORY

Version: 0.1

Sessions & Modifications:

- Version: 0.1 | Tool: Claude Code | Session: claude/vertical-agent-architecture-f8fqc5 | Date: 12.06.2026 | Changes: Initial 25-industry comparison + gap analysis; built industry-registry.ts and the universal industry-analyst agent to close the 12-industry coverage gap

Session Links & References:

- Claude Code (vertical-agent-architecture-f8fqc5): https://github.com/blogtheristo/dws6/commits/claude/vertical-agent-architecture-f8fqc5

Document Status:

- Created: 12.06.2026
- Last Modified: 12.06.2026
- Language: English
- Languages Available: EN
- Publication Status: Review

Repository Status:

- Location: docs/research/
- Access Level: 🟡 Internal

---

---

## 1. Canonical basis

- **Source of truth:** `/INDUSTRIES.md` → structured mirror
  `dws10.com/config/industries.json` (`industriesServedTotal: 25`,
  `captainHatsTotal: 16`). Industry ids, names, tiers, captain hats, and
  regulations below mirror that file; a unit test asserts non-drift.
- **Domain-knowledge fields** (emission sources, decarbonization levers, market
  benchmark, coverage gap) are well-established sector practice, recorded in the
  registry as advisory inputs — **not** new DWS truth claims.

The 25 industries split as: **8 tier-1** captain industries, **8 tier-2**, **4
tier-3 folded** into tier-1/2 hats, and **5 platform-only** (no dedicated captain
hat). 16 captain hats cluster 20 of them; 5 ride on platform purchase.

## 2. The headline gap

Only **13 of 25** industries have a dedicated specialist agent today. **12 have
none** — they were served, if at all, by the generic `compliance` agent with no
sector-specific regulatory or decarbonization knowledge:

| Gap industry                 | id  | tier  | Why it matters                                                                                                                     |
| ---------------------------- | --- | ----- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Aviation**                 | 5   | **1** | A **tier-1** industry with no agent — ReFuelEU SAF mandates, non-CO2 effects, ETS aviation free-allowance phase-out all unmodelled |
| Waste Management & Recycling | 10  | 2     | WtE enters ETS (2028); biogenic vs fossil CO2 split unhandled                                                                      |
| Pulp, Paper & Printing       | 12  | 2     | Biogenic carbon accounting, recovery-boiler benchmarking                                                                           |
| Petroleum Refining           | 13  | 2     | CWT benchmark allocation, RED III renewable-fuel share                                                                             |
| Food & Beverage Processing   | 14  | 2     | Scope 3 agricultural supply chain, F-gas phase-down                                                                                |
| Glass & Ceramics Production  | 15  | 2     | Furnace-campaign emission modelling, cullet optimisation                                                                           |
| Mining & Quarrying           | 16  | 2     | CRM Act reporting, fugitive methane MRV                                                                                            |
| Manufacturing (cross-sector) | 18  | 3     | ESPR Digital Product Passport, product-level LCA                                                                                   |
| Healthcare                   | 19  | 3     | Anaesthetic-gas accounting, ESRS S1                                                                                                |
| Financial Services           | 20  | 3     | **Financed emissions (PCAF), SFDR PAI** — an entirely different emissions domain                                                   |
| Public Sector                | 21  | 3     | GPP tender scoring, NIS2 dossiers                                                                                                  |
| Data Centres                 | 24  | 3     | EED Annex VII auto-reporting, hourly CFE matching                                                                                  |

The most urgent is **Aviation** — a tier-1 captain industry shipping with zero
dedicated coverage — and **Financial Services**, whose financed-emissions domain
(PCAF/SFDR) is structurally unlike the operational-emissions captain hats and was
not addressed anywhere.

## 3. Full comparison (all 25)

Tier = captain-framework tranche (1/2 first/second, 3 folded/platform-only).
"Agent" = dedicated pantheon specialist (**none** = universal analyst only).

| id  | Industry                       | Tier | Agent      | Primary EU regulations                          | Market best-practice benchmark                                      |
| --- | ------------------------------ | ---- | ---------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Power & Heat Generation        | 1    | helios     | ETS / ETS2, Fit for 55, RED III, CSRD           | RE100 + 24/7 hourly carbon-free energy matching                     |
| 2   | Iron & Steel Production        | 1    | vulcan     | ETS / ETS2, CBAM, Fit for 55, CSRD              | H2 Green Steel / HYBRIT fossil-free DRI                             |
| 3   | Cement & Lime Production       | 1    | gaia       | ETS / ETS2, CBAM, Fit for 55, CSRD              | LEILAC direct separation + calcined-clay cements                    |
| 4   | Chemicals & Petrochemicals     | 1    | juno       | ETS / ETS2, CBAM, RED III, CSRD, ESPR           | Electrically-heated steam cracker (BASF/SABIC/Linde)                |
| 5   | Aviation                       | 1    | **none**   | ETS / ETS2, ReFuelEU Aviation, Fit for 55, CSRD | ReFuelEU SAF blending trajectory (2% 2025 → 70% 2050)               |
| 6   | Maritime Shipping              | 1    | neptune    | ETS / ETS2, FuelEU Maritime, Fit for 55, CSRD   | Green-methanol dual-fuel vessels (Maersk)                           |
| 7   | Road Transport & Logistics     | 1    | hermes     | ETS / ETS2, Fit for 55, CSRD                    | Battery-electric truck depots with megawatt charging                |
| 8   | Construction & Buildings       | 1    | mars       | EPBD, ETS / ETS2, CSRD, ESPR, EU Taxonomy       | Whole-life carbon limits (RICS/LETI) + EPBD zero-emission buildings |
| 9   | Agriculture & Livestock        | 2    | ceres      | ESR, CSRD, Fit for 55                           | SBTi FLAG targets + methane-inhibitor adoption                      |
| 10  | Waste Management & Recycling   | 2    | **none**   | ETS / ETS2, CSRD, Fit for 55                    | CCS-equipped waste-to-energy plants                                 |
| 11  | Aluminium Production           | 2    | talos      | ETS / ETS2, CBAM, Fit for 55, CSRD              | ELYSIS inert-anode zero-process-CO2 smelting                        |
| 12  | Pulp, Paper & Printing         | 2    | **none**   | ETS / ETS2, CSRD, Fit for 55, ESPR              | Fossil-free integrated mills (Nordic)                               |
| 13  | Petroleum Refining             | 2    | **none**   | ETS / ETS2, CBAM, RED III, CSRD                 | Refinery CCS + renewable-hydrogen integration                       |
| 14  | Food & Beverage Processing     | 2    | **none**   | ETS / ETS2, CSRD, Fit for 55                    | SBTi FLAG + industrial heat-pump process heat                       |
| 15  | Glass & Ceramics Production    | 2    | **none**   | ETS / ETS2, CBAM, CSRD, Fit for 55              | All-electric melting furnaces (container glass)                     |
| 16  | Mining & Quarrying             | 2    | **none**   | ETS / ETS2, CSRD, CRM Act                       | Battery-electric haul-truck fleets + on-site renewables             |
| 17  | Real Estate                    | 3    | mars       | EPBD, EU Taxonomy, CSRD, SFDR                   | CRREM 1.5°C decarbonization pathways                                |
| 18  | Manufacturing (cross-sector)   | 3    | **none**   | ESPR, CSRD, EED, ETS / ETS2                     | ESPR Digital Product Passport + ISO 50001 EnMS                      |
| 19  | Healthcare                     | 3    | **none**   | EHDS, MDR, CSRD, GDPR                           | NHS Net Zero (first national health-system target)                  |
| 20  | Financial Services             | 3    | **none**   | SFDR, EU Taxonomy, CRR3, CSRD                   | PCAF Standard + Net-Zero Banking Alliance targets                   |
| 21  | Public Sector                  | 3    | **none**   | GPP, NIS2, CSRD, GDPR                           | EU GPP criteria + climate-neutral cities mission                    |
| 22  | Shipbuilding                   | 3    | neptune    | EU Taxonomy, CSRD, CBAM, ESPR                   | Taxonomy-aligned green vessel design                                |
| 23  | Logistics (multimodal freight) | 3    | logistics  | ETS / ETS2, CSRD, Fit for 55                    | GLEC Framework / ISO 14083 logistics emissions                      |
| 24  | Data Centres                   | 3    | **none**   | EED, CSRD, NIS2, EU Taxonomy                    | Climate Neutral Data Centre Pact + EED Annex VII reporting          |
| 25  | RFNBO / Green H2 & E-Fuels     | 3    | prometheus | RED III, ETS / ETS2, CSRD, CBAM                 | RED III RFNBO certification (additionality + hourly matching)       |

## 4. What we built to offer more

Rather than write 12 more near-identical pantheon files (the anti-pattern called
out in `AI_AGENT_GUIDELINES.md` §11.2 and the CLAUDE.md Skill Codification Rule),
we built **one parameterized agent over a data registry**:

- **`src/agents/data/industry-registry.ts`** — all 25 industries with regulatory
  exposure, emission sources, decarbonization levers (market best efforts),
  best-practice benchmark, current DWS offering, and the explicit coverage gap.
  Canonical fields mirror `industries.json`; a test enforces non-drift.
- **`src/agents/industry-analyst.agent.ts`** — the universal `industry-analyst`
  agent. Resolves any industry by id (1–25) or name/alias, delegates to the
  `compliance` agent for the regulatory base, and synthesizes a sector-specific
  assessment. For the 13 industries with a dedicated specialist it points the
  user to the deeper agent; for the 12 without, it **is** the coverage.

Net effect: every one of the 25 industries now has a first-class agent response
today, with one new file instead of twelve.

## 5. Recommended next steps (deepen, in priority order)

1. **Aviation (tier-1)** — promote to a dedicated specialist: ReFuelEU SAF
   blending schedule, CORSIA/ETS interaction, non-CO2 (contrail) accounting.
2. **Financial Services** — financed-emissions agent (PCAF asset classes, SFDR
   PAI auto-assembly); structurally distinct from operational-emissions hats.
3. **Data Centres** — EED Annex VII auto-reporting + hourly CFE matching (also a
   committed May-2026 industry).
4. Tier-2 process industries (Refining, Glass & Ceramics, Pulp & Paper) where
   CBAM/ETS exposure is high — deepen from the registry profile as demand lands.

Each promotion should reuse the registry profile as its L1 context (§11.1) and
only add the sector-specific deterministic logic (CN codes, benchmark factors)
that justifies a dedicated file — exactly how Vulcan extends the generic shape
for steel.
