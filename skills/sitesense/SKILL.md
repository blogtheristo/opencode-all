---
name: sitesense
description: "Construction site safety assessment scoring 0–100. EN 13001 crane warnings, weather risk, worker safety metrics."
argument-hint: "location or siteId, date, activity type"
allowed-tools: [Bash, WebSearch, WebFetch]
---

# SiteSense — Construction Site Safety Skill

**Domain:** Industrial construction safety | EU standards compliance
**Agent:** `src/agents/sitesense.agent.ts`
**CLI:** `dws run sitesense --input '{"siteId":"S1","metrics":{...}}'`

## What This Skill Knows

20+ years of EU construction safety standards, packaged as deterministic scoring:

- **EN 13001** (crane safety) — wind speed thresholds for crane operation
- **ISO 45001** — occupational health and safety management
- **EU Construction Products Regulation** — site condition requirements
- **Finnish construction safety regulations** (VNa 205/2009)

## Safety Scoring Logic

### Temperature thresholds (°C)

| Range    | Status                           |
| -------- | -------------------------------- |
| < -15    | CRITICAL — Stop work             |
| -15 to 0 | WARNING — Cold weather protocols |
| 0 to 10  | CAUTION — Monitor workers        |
| 10 to 30 | OPTIMAL                          |
| 30 to 35 | CAUTION — Heat stress risk       |
| 35 to 40 | WARNING — High heat stress risk  |
| ≥ 40     | CRITICAL — Stop work             |

### Wind speed thresholds (m/s) — EN 13001

| Speed      | Crane status                     |
| ---------- | -------------------------------- |
| ≤ 9        | Safe — normal operations         |
| 9–14       | Caution — reduce load            |
| > 14 to 20 | STOP — cease crane operations    |
| > 20       | Emergency — secure all equipment |

### Score formula

`score = base(100) − temperature_penalty − wind_penalty − incident_penalty − humidity_penalty`

Score bands: 90–100 EXCELLENT | 70–89 GOOD | 50–69 FAIR | 30–49 POOR | 0–29 CRITICAL

## Input / Output Contract

**Input:**

```json
{
  "siteId": "string",
  "metrics": {
    "temperature": number,
    "humidity": number,
    "windSpeed": number,
    "workers": number,
    "incidents": number
  }
}
```

**Output:**

```json
{
  "safetyScore": 0-100,
  "weatherRisk": {
    "level": "low|medium|high|critical",
    "factors": ["string"]
  },
  "workerCapacity": 0-100,
  "incidentRate": number,
  "conditions": ["string"],
  "recommendations": ["string"]
}
```

## When to Use

- Before daily work starts on a construction site
- When weather conditions change during operations
- For crane lift planning and approval
- CSRD S1 worker safety reporting data collection
- EU AI Act Article 9 risk management documentation

## Latent vs Deterministic

| Step                                                                     | Where                               | Kind          |
| ------------------------------------------------------------------------ | ----------------------------------- | ------------- |
| `score = 100 − temp_pen − wind_pen − incident_pen − humidity_pen`        | `src/agents/sitesense.agent.ts`     | Deterministic |
| EN 13001 wind threshold lookup (≤9 / 9–14 / >14–20 / >20 m/s)            | Agent code (fixed table)            | Deterministic |
| Temperature band classification (CRITICAL / WARNING / CAUTION / OPTIMAL) | Agent code (fixed table)            | Deterministic |
| Worker capacity adjustment given conditions                              | LLM judgment over scored conditions | Latent        |
| "Stop work" recommendation phrasing                                      | LLM                                 | Latent        |
| Cause attribution for incidents in narrative                             | LLM                                 | Latent        |

Rule: the safety score is a formula, not an opinion. The LLM never picks the number. The LLM judges what to _do_ about the number.

## Standards References

- EN 13001-1:2015 — Crane safety: General principles and requirements
- ISO 45001:2018 — Occupational health and safety management systems
- VNa 205/2009 — Finnish Government Decree on construction work safety
- CSRD ESRS S1 — Own workforce: health and safety disclosures
