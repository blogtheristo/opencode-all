***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Extracted from AGENTS.md §17 as part of agents-md-slim refactoring

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

# Compliance Scoring Engine Architecture

Extracted from AGENTS.md §17. MVP Feature 2.

---

The Compliance Scoring Engine is the core product logic — deterministic, testable, no LLM dependency for scoring. The existing `ComplianceAgent` (`src/agents/compliance.agent.ts`) now delegates real calculations to the scoring engine.

## Architecture

```
ComplianceAgent (orchestration layer)
  ├── scoring-engine.ts (deterministic scoring)
  │   ├── scoreCsrdReadiness()  — ESRS data point coverage
  │   ├── scoreEtsExposure()    — emissions threshold analysis
  │   └── scoreCbamRisk()       — import value risk assessment
  ├── esrs-registry.ts (82 ESRS disclosures, E1-E5/S1-S4/G1)
  ├── report-generator.ts (structured JSON for auditors)
  └── LLM (gap analysis enhancement — optional)
```

## Scoring Formula

```
CSRD Score = (mandatory data points provided / total mandatory) × 80
           + transition plan bonus (10)
           + emissions monitoring bonus (10)

ETS Score  = 100 - penalties for:
           - No emissions monitoring (-40 if above threshold)
           - No transition plan (-20)
           - No GHG data E1-6 (-25)

CBAM Score = 100 - penalties for:
           - No supply chain DD (-40 if above €150K imports)
           - No supplier data G1-2 (-20)
           - No pollution data E2-4 (-15)

Overall    = CSRD × 0.50 + ETS × 0.25 + CBAM × 0.25
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/compliance/assess` | Run compliance assessment, returns scored report |
| GET | `/api/v1/compliance/registry` | Get ESRS disclosure registry (filterable) |

## Database Schema

| Table | Purpose |
|-------|---------|
| `compliance_profiles` | Organization compliance profile (industry, emissions, imports) |
| `esrs_data_points` | Individual ESRS disclosure data (82 possible per profile) |
| `compliance_assessments` | Assessment results with scores and gaps |

All tables have RLS policies scoped to `organization_id`.

## Middleware Stack (Required Order)

1. `correlationId` → trace ID
2. `validate({ body: AssessmentSchema })` → Zod validation
3. Route handler → calls `scoreCompliance()` + `generateReport()`
4. `errorHandler` → catches and formats errors
