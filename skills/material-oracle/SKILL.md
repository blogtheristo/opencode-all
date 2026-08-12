---
name: material-oracle
description: "Embodied carbon per EN 15978 (stages A1–D). kgCO2e per material, lower-carbon alternatives, EC3 EPD database integration."
argument-hint: "list of materials with quantities and units"
allowed-tools: [Bash, WebSearch, WebFetch]
---

# Material Oracle — Embodied Carbon Expertise Skill

**Domain:** Construction material lifecycle carbon assessment
**Agent:** `src/agents/material-oracle.agent.ts`
**CLI:** `dws run material-oracle --input '{"materials":[{"name":"concrete","quantity":100,"unit":"m3"}]}'`
**Integration:** EC3 (Environmental Product Declarations database)

## What This Skill Knows

EN 15978 lifecycle assessment methodology applied to construction materials, using ICE Database v3 emission factors and EC3 EPD data.

### Lifecycle Stages (EN 15978)

| Stage | Name                      | What it covers                         |
| ----- | ------------------------- | -------------------------------------- |
| A1    | Raw material extraction   | Mining, quarrying, forestry            |
| A2    | Transport to factory      | Raw material logistics                 |
| A3    | Manufacturing             | Production energy, process emissions   |
| A4    | Transport to site         | Delivery logistics                     |
| A5    | Construction/installation | On-site energy, waste                  |
| B1–B7 | Use stage                 | Maintenance, repair, energy in use     |
| C1–C4 | End of life               | Demolition, transport, waste, disposal |
| D     | Beyond system boundary    | Reuse, recovery, recycling credits     |

**Mandatory for CBAM:** A1–A3 (product stage) carbon intensity required for Annex I goods.

### Emission Factors (ICE Database v3 + EPD averages)

| Material                  | Unit | A1–A3 kgCO2e    | Source  |
| ------------------------- | ---- | --------------- | ------- |
| Concrete (general)        | m3   | 300             | ICE v3  |
| Structural steel          | kg   | 1.55            | ICE v3  |
| Aluminium (primary)       | kg   | 11.46           | ICE v3  |
| Timber (softwood)         | m3   | −490 (biogenic) | ICE v3  |
| Glass                     | kg   | 0.91            | ICE v3  |
| Copper                    | kg   | 3.81            | ICE v3  |
| Brick                     | kg   | 0.24            | ICE v3  |
| Cement                    | kg   | 0.83            | ICE v3  |
| Insulation (mineral wool) | kg   | 1.28            | EPD avg |

### Lower-Carbon Alternatives Logic

The agent compares materials against low-carbon substitutes:

- Concrete → low-carbon concrete (≤ 200 kgCO2e/m3 with GGBS/fly ash)
- Steel → recycled steel (0.53 kgCO2e/kg vs 1.55 primary)
- Aluminium → recycled aluminium (0.69 kgCO2e/kg vs 11.46 primary)

## Input / Output Contract

**Input:**

```json
{
  "materials": [
    {
      "name": "string",
      "quantity": number,
      "unit": "kg|m3|m2|m|pcs",
      "supplier": "string (optional)"
    }
  ]
}
```

**Output:**

```json
{
  "totalEmbodiedCarbon": number,
  "unit": "kgCO2e",
  "breakdown": [
    {
      "material": "string",
      "stage": "A1-A3|A4|A5|B|C|D",
      "kgCO2e": number,
      "factor": number,
      "source": "ICE v3|EC3 EPD|EPD avg"
    }
  ],
  "alternatives": [
    {
      "current": "string",
      "alternative": "string",
      "savingKgCO2e": number,
      "savingPercent": number
    }
  ]
}
```

## When to Use

- Pre-design material selection for low-carbon procurement
- CBAM carbon intensity calculation for Annex I imports
- CSRD E1 (climate) embodied carbon disclosure
- EN 15978 compliant LCA for building certification (LEED, BREEAM, DGNB)
- Whole-life carbon budget planning

## Latent vs Deterministic

| Step                                                   | Where                                       | Kind          |
| ------------------------------------------------------ | ------------------------------------------- | ------------- |
| Emission factor lookup per material                    | ICE v3 / EC3 / EPD tables                   | Deterministic |
| `kgCO2e = factor × quantity` arithmetic                | `src/agents/material-oracle.agent.ts`       | Deterministic |
| Stage allocation per EN 15978 (A1–A3, A4, A5, B, C, D) | Agent code (fixed mapping)                  | Deterministic |
| Material name disambiguation (free-text → catalog)     | LLM                                         | Latent        |
| Lower-carbon alternative ranking by cost/saving        | LLM (proposes), arithmetic confirms savings | Latent        |
| Recommendation narrative                               | LLM                                         | Latent        |

Rule: do not ask the LLM to compute kgCO2e. Use the factor table and the agent's arithmetic. The LLM's job is to name the material correctly and to judge which alternative is realistic for the project.

## Standards References

- EN 15978:2011 — Sustainability of construction works: assessment of environmental performance
- EN 15804:2012+A2:2019 — EPD core rules for construction products
- ICE Database v3.0 — Inventory of Carbon and Energy (University of Bath)
- EC3 (Carbon Calculator for Construction) — EPD database, Building Transparency
- EU Reg. 2023/956 — CBAM: embedded carbon in Annex I goods
- ISO 14040/14044 — LCA principles and requirements
