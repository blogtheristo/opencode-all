---
VERSION AND AGENT HISTORY
Document: BESS Compliance API — Qantic Q-System Integration
Version: 1.0
Created: 2026-03-19
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: DRAFT
---

# BESS Compliance API — Qantic Q-System Integration

## Overview

The BESS Compliance API calculates EU regulatory compliance costs for Battery Energy Storage Systems. Designed as the integration surface between Qantic's Q-System (revenue modelling) and DWS IQ 6 (compliance engine).

**Q-System dispatch schedules in → EUR compliance cost breakdown out.**

## Authentication

```
Authorization: Bearer <api-key>
```

API keys with `bess:read` scope required. Contact risto@lifetime.fi for access.

## Endpoints

### POST /api/v1/agents/bess/execute

Full compliance analysis from Q-System dispatch data.

**Request:**

```json
{
  "dispatch": [
    {
      "timestamp": "2026-01-15T01:00:00Z",
      "chargedMwh": 40,
      "dischargedMwh": 0,
      "market": "idle",
      "gridEmissionFactor": 385
    },
    {
      "timestamp": "2026-01-15T17:00:00Z",
      "chargedMwh": 0,
      "dischargedMwh": 36.05,
      "market": "day-ahead",
      "gridEmissionFactor": 385
    }
  ],
  "battery": {
    "powerMw": 50,
    "energyMwh": 200,
    "roundtripEfficiency": 0.9025,
    "annualDegradationRate": 0.02,
    "installationYear": 2024,
    "capitalCostEur": 40000000,
    "usefulLifeYears": 15,
    "country": "DE"
  },
  "year": 2026,
  "carbonPriceEur": 65,
  "colocatedEtsCovered": false
}
```

**Response:**

```json
{
  "agentName": "bess",
  "result": {
    "totalCostEur": 21705.50,
    "scope2ChargingCostEur": 5005.00,
    "roundtripLossCostEur": 487.99,
    "etsColocatedCostEur": 0,
    "csrdReportingCostEur": 12000,
    "taxonomyCertificationCostEur": 4200,
    "emissions": {
      "scope2TotalTonnes": 77.00,
      "roundtripLossTonnes": 7.51,
      "avoidedEmissionsTonnes": 69.40,
      "netEmissionsTonnes": 15.11,
      "weightedGridFactor": 385
    },
    "lifecycle": {
      "currentCapacityPct": 96.04,
      "remainingLifeYears": 13,
      "impairmentEur": 0,
      "replacementYear": 2039,
      "annualDepreciationEur": 2666666.67
    },
    "taxonomy": {
      "substantialContribution": false,
      "avoidedEmissionsEvidence": 69.40,
      "dnshAssessment": "...",
      "activityCode": "4.10"
    },
    "etsMarketHours": {
      "totalHours": 24,
      "etsCoveredHours": 5,
      "etsCoveredPct": 20.83
    },
    "carbonPriceEur": 65,
    "year": 2026
  },
  "confidence": 0.6,
  "reasoning": "..."
}
```

### Quick Estimate (No Dispatch Data)

For pre-sales / indicative pricing before full Q-System integration.

**Request:**

```json
{
  "quickEstimate": {
    "energyMwh": 200,
    "country": "DE",
    "roundtripEfficiency": 0.9025
  }
}
```

**Response:**

```json
{
  "result": {
    "estimatedAnnualCostEur": 21825.50,
    "scope2Tonnes": 85.47,
    "breakdown": "Carbon: €5555.50 + CSRD: €12000 + Taxonomy: €4200"
  },
  "confidence": 0.6
}
```

## CLI Usage

```bash
# Full dispatch analysis
dws run bess --input '{"dispatch": [...], "battery": {...}, "year": 2026}'

# Quick estimate
dws run bess --input '{"quickEstimate": {"energyMwh": 200, "country": "DE"}}'

# Discover BESS capabilities
dws discover bess
```

## Data Types

### DispatchEntry

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| timestamp | string (ISO 8601) | Yes | Hour timestamp |
| chargedMwh | number | Yes | MWh charged from grid |
| dischargedMwh | number | Yes | MWh discharged to market |
| market | string | Yes | Revenue market: fcr, afrr, mfrr, day-ahead, intraday, idle |
| gridEmissionFactor | number | Yes | gCO2/kWh for this hour (source: ENTSO-E) |

### BatterySpec

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| powerMw | number | Yes | Nameplate power (MW) |
| energyMwh | number | Yes | Nameplate energy (MWh) |
| roundtripEfficiency | number | Yes | 0-1 (Qantic default: 0.9025) |
| annualDegradationRate | number | Yes | 0-1 (typical: 0.02 = 2%/year) |
| installationYear | number | Yes | Year of commissioning |
| capitalCostEur | number | Yes | Total CAPEX (EUR) |
| usefulLifeYears | number | Yes | Expected operational life |
| country | string | Yes | ISO 3166-1 alpha-2 country code |

## Supported Countries (Grid Emission Factors)

| Country | gCO2/kWh | Source |
|---------|----------|--------|
| FI | 68 | Finnish Energy Authority 2024 |
| SE | 36 | Swedish Energy Agency 2024 |
| NO | 19 | NVE 2024 |
| DK | 130 | Energinet 2024 |
| DE | 385 | UBA 2024 |
| FR | 55 | RTE 2024 |
| PL | 650 | URE 2024 |
| EU | 230 | EEA average 2024 (fallback) |

Full list: 18 EU countries + EU average default.

## Compliance Regulations Covered

| Regulation | BESS Application |
|------------|-----------------|
| CSRD/ESRS E1-5 | Energy consumption & mix (charging patterns) |
| CSRD/ESRS E1-6 | Scope 2 GHG emissions (grid charging) |
| EU ETS Phase 4 | Co-located generation allowance costs |
| EU Taxonomy 4.10 | Electricity storage substantial contribution |
| EPBD recast 2027 | Behind-the-meter building-level reporting |

## Pricing

API usage-based: per asset modelled per year. Contact risto@lifetime.fi for pricing.

## Contact

- Technical: risto@lifetime.fi
- Partnership: risto@lifetime.fi
- Qantic integration: support@qantic.com
