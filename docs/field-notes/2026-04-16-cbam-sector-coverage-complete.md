# Field Note: CBAM Sector Coverage — All 6 Annex I Sectors Complete

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/audit-boardy-roles-neTFn | Date: 16.04.2026 | Changes: Initial field note — CBAM Annex I sector coverage status, agent registry, CN codes, locked decision LD-2026-013

Document Status:

- Created: 16.04.2026
- Last Modified: 16.04.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Field Note / Feature Status

Related Documents:

- docs/LOCKED_DECISIONS.md — LD-2026-013
- src/synthetic-data/cbam-schema.ts — source of truth (CBAM_CN_CODES)
- src/agents/workflow/industry/ — all sector agents

---

## Status

All 6 CBAM Annex I sectors (EU Regulation 2023/956) are covered. One dedicated agent per sector. 66 CN codes total.

| Sector       | Agent      | CN Codes | PR / Branch                      | Status           |
| ------------ | ---------- | -------- | -------------------------------- | ---------------- |
| Steel & Iron | Vulcan     | 42       | PR #996                          | ✅ Merged        |
| Aluminium    | Talos      | 16       | `claude/cbam-alignment-pr-6as8L` | ⏳ Pending merge |
| Cement       | Gaia       | 3        | PR #996                          | ✅ Merged        |
| Fertilizers  | Ceres      | 3        | PR #996                          | ✅ Merged        |
| Hydrogen     | Prometheus | 1        | PR #996                          | ✅ Merged        |
| Electricity  | Helios     | 1        | PR #996                          | ✅ Merged        |

---

## Sector Details

### 1. Steel & Iron — Vulcan

- **Agent:** `src/agents/workflow/industry/vulcan.agent.ts`
- **CN codes: 42** — 7201–7229 (raw/flat/long/stainless/alloy) + 7301–7326 (tubes/pipes/downstream)
- **Groups:** Raw materials, Flat products, Long products, Stainless & alloy, Tubes & pipes, Downstream articles
- **Helper:** `isCBAMSteelAndIron()` — dynamic CN range checker
- **Key:** Blast furnace ~2.0 tCO2e/t vs EAF ~0.5 tCO2e/t. **Zero free allowances from 2026.**

### 2. Aluminium — Talos

- **Agent:** `src/agents/workflow/industry/talos.agent.ts`
- **CN codes: 16** — 7601–7616
- **Groups:** Primary & scrap, Semi-finished, Tubes & fittings, Downstream articles
- **Helper:** `isCBAMAluminium()` — dynamic CN range checker
- **Key:** **Only sector where indirect emissions (grid electricity) are included in CBAM.** Hall-Héroult electrolysis ~15 MWh/t. China coal grid ~16.2 tCO2e/t vs Norway hydro ~2.0 tCO2e/t — largest regional spread of any sector.

### 3. Cement — Gaia

- **Agent:** `src/agents/workflow/industry/gaia.agent.ts`
- **CN codes: 3** — 2507 00, 2523 21, 2523 29
- **Key:** Process emissions from clinker calcination ~0.62 tCO2e/t. Hard-to-abate — CCS is primary decarbonisation lever.

### 4. Fertilizers — Ceres

- **Agent:** `src/agents/workflow/industry/ceres.agent.ts`
- **CN codes: 3** — 2808 00, 3102, 3105
- **Key:** Ammonia/urea/nitrate production. Haber-Bosch process ~1.6 tCO2e/t ammonia.

### 5. Hydrogen — Prometheus

- **Agent:** `src/agents/workflow/industry/prometheus.agent.ts`
- **CN codes: 1** — 2804 10 00
- **Key:** Grey hydrogen ~9.2 tCO2e/t vs green ~0. Transition fuel with massive CBAM exposure for grey imports.

### 6. Electricity — Helios

- **Agent:** `src/agents/workflow/industry/helios.agent.ts`
- **CN codes: 1** — 2716 00 00
- **Key:** Zero free allowances for energy producers. RED III 42.5% renewable target by 2030.

---

## Source of Truth

```
src/synthetic-data/cbam-schema.ts  →  CBAM_CN_CODES
```

Regulation: **EU 2023/956 Annex I** (CBAM Regulation)

Any CN code or emission factor change must be traceable to a EUR-Lex regulation diff before merging. See LD-2026-013 change process.

---

## Action Item

- [ ] Merge `claude/cbam-alignment-pr-6as8L` (Talos / Aluminium) to complete 6/6 sector coverage

---

(c) 2026 Lifetime Oy — Field Note
