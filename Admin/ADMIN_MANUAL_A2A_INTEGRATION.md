# Admin Manual: A2A Agent Integration

**Version:** 1.0
**Date:** February 2026
**Scope:** DWS IQ Platform v6 — A2A Protocol integration for industrial partner agents

---

## 1. Overview

DWS IQ Platform supports the **Google A2A (Agent-to-Agent) Protocol** v0.3.0, enabling external AI agents from industrial partners to connect and use DWS IQ's compliance calculation, Firehorse reporting, and carbon calculator services.

### What A2A Is

A2A is an open protocol (Apache 2.0, Linux Foundation) that enables autonomous AI agents from different organizations to communicate. Unlike MCP (which connects agents to tools), A2A connects agents to agents — enabling reasoning, multi-turn conversations, and autonomous task completion.

### DWS IQ's Role

DWS IQ acts as an **A2A Server** — it publishes an Agent Card describing its capabilities and accepts Tasks from partner agents (A2A Clients).

---

## 2. Architecture

### 2.1 Component Diagram

```
Partner Agents (External)           DWS IQ Platform (Internal)
┌─────────────────────┐            ┌──────────────────────────────┐
│  Partner Agent       │   A2A     │  A2A Server Endpoint         │
│  (ADK / LangGraph /  │──────────→│  https://api.dws10.com/a2a  │
│   CrewAI / custom)   │  JSON-RPC │                              │
│                      │←──────────│  Skills:                     │
│  Reads Agent Card:   │  Artifacts│  ├─ compliance-calculation   │
│  /.well-known/       │           │  ├─ firehorse-report         │
│  agent.json          │           │  └─ carbon-calculator        │
└─────────────────────┘            │                              │
                                   │  MCP Tools (Internal):       │
                                   │  ├─ Supabase DB              │
                                   │  ├─ ERP Connectors           │
                                   │  ├─ Carbon Engine            │
                                   │  ├─ World Model (LLM)        │
                                   │  └─ Firehorse Engine         │
                                   └──────────────────────────────┘
```

### 2.2 Protocol Stack

| Layer | Technology |
|-------|-----------|
| Discovery | Agent Card at `/.well-known/agent.json` |
| Transport | JSON-RPC (primary), gRPC (planned), REST (fallback) |
| Auth | OAuth 2.0, API key |
| Encryption | TLS 1.3 |
| Data Residency | EU only (europe-north1, Finland) |

---

## 3. Agent Card

### 3.1 Location

```
https://api.dws10.com/.well-known/agent.json
```

### 3.2 Structure

```json
{
  "name": "DWS IQ Climate Compliance Agent",
  "description": "EU climate compliance calculation, ESG reporting, and carbon footprint services.",
  "url": "https://api.dws10.com/a2a",
  "version": "6.0",
  "capabilities": {
    "streaming": true,
    "pushNotifications": false
  },
  "skills": [
    {
      "id": "compliance-calculation",
      "name": "Climate Compliance Calculation",
      "description": "Calculate Fit for 55, CSRD, ETS, and CBAM compliance scores from emissions data"
    },
    {
      "id": "firehorse-report",
      "name": "Firehorse Report Generation",
      "description": "Generate audit-ready ESG and climate compliance reports (PDF/Excel)"
    },
    {
      "id": "carbon-calculator",
      "name": "Carbon Footprint Calculator",
      "description": "Calculate Scope 1/2/3 carbon emissions for organizations"
    }
  ],
  "authentication": {
    "schemes": ["oauth2", "apiKey"]
  },
  "provider": {
    "organization": "Lifetime Oy",
    "url": "https://dws10.com"
  }
}
```

### 3.3 Updating the Agent Card

When adding new skills or changing capabilities, update:
1. `src/a2a/agent-card.json` — source file
2. Redeploy to Google Cloud Run
3. Validate with A2A Inspector: `a2a-inspector validate https://api.dws10.com/.well-known/agent.json`

---

## 4. Skills Reference

### 4.1 compliance-calculation

**Purpose:** Calculate EU regulatory compliance scores from emissions data.

**Input (Message Parts):**
```json
{
  "parts": [{
    "type": "data",
    "data": {
      "scope1_tco2e": 1250.5,
      "scope2_tco2e": 890.3,
      "scope3_tco2e": 3420.1,
      "industry": "manufacturing",
      "country": "FI",
      "year": 2025,
      "quarter": "Q4"
    }
  }]
}
```

**Output (Artifact):**
```json
{
  "parts": [{
    "type": "data",
    "data": {
      "fit_for_55_score": 72,
      "csrd_compliance": "partial",
      "ets_sector": "industrial",
      "ets_allowances_needed": 1250,
      "cbam_applicable": false,
      "recommendations": ["Reduce Scope 1 by 15% to meet 2030 targets"]
    }
  }]
}
```

### 4.2 firehorse-report

**Purpose:** Generate audit-ready compliance reports.

**Input:** Same as compliance-calculation, plus `report_type` ("annual", "quarterly", "csrd", "fit55")

**Output:** Artifact with file Part (PDF or Excel binary)

### 4.3 carbon-calculator

**Purpose:** Calculate Scope 1/2/3 carbon footprint.

**Input:** Organization data (energy usage, fleet data, supply chain, waste)

**Output:** Structured breakdown by scope with total tCO2e

---

## 5. Task Lifecycle

```
1. Partner agent creates Task    → status: submitted
2. DWS IQ agent picks up Task   → status: working
3a. DWS IQ completes            → status: completed (+ Artifacts)
3b. DWS IQ needs more info      → status: input-required
3c. DWS IQ fails                → status: failed
4. If input-required:
   Partner agent sends Message   → status: working (again)
   → Back to step 3
```

### 5.1 Monitoring Tasks

Tasks are logged in Supabase table `a2a_tasks`:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Task ID |
| `skill_id` | text | Which skill was requested |
| `status` | text | Current lifecycle state |
| `client_agent` | text | Partner agent identifier |
| `created_at` | timestamp | When task was created |
| `completed_at` | timestamp | When task completed |
| `input_data` | jsonb | Input message parts |
| `output_artifacts` | jsonb | Output artifacts |
| `error` | text | Error message if failed |

### 5.2 EU AI Act Article 12 Logging

All A2A Tasks are automatically logged per EU AI Act Article 12 requirements:
- Task creation, state transitions, and completion
- Agent reasoning chain (from DWS IQ's internal processing)
- Input data provenance and output artifact lineage
- Stored in `aiven_audit_log` table with 7-year retention

---

## 6. Authentication & Security

### 6.1 API Key Authentication

Partners receive an API key during onboarding:
```
X-API-Key: dws_a2a_partner_xxxxxxxxxxxxx
```

### 6.2 OAuth 2.0

For automated agent workflows, partners configure OAuth 2.0:
- Authorization endpoint: `https://api.dws10.com/oauth/authorize`
- Token endpoint: `https://api.dws10.com/oauth/token`
- Scopes: `compliance:read`, `reports:generate`, `calculator:use`

### 6.3 Rate Limits

| Plan | Tasks/hour | Concurrent Tasks |
|------|-----------|-----------------|
| Free (trial) | 10 | 1 |
| Professional | 100 | 5 |
| Enterprise | Unlimited | 50 |

---

## 7. Partner Onboarding

### 7.1 Steps

1. Partner contacts `a2a@lifetime.fi` (or clicks "Bring Your Own Agent" on industry page)
2. DWS IQ team issues API key and provides documentation
3. Partner installs A2A Python SDK: `pip install a2a-sdk`
4. Partner fetches Agent Card: `GET https://api.dws10.com/.well-known/agent.json`
5. Partner creates first test Task
6. Validate with A2A Inspector
7. Move to production

### 7.2 Supported Agent Frameworks

Partners can use any A2A-compatible agent framework:
- Google Agent Development Kit (ADK)
- LangGraph
- CrewAI
- BeeAI
- Custom implementations using `a2a-sdk`

---

## 8. Operational Procedures

### 8.1 Deploying A2A Server Updates

```bash
# Build and deploy to Cloud Run
cd src/a2a/
docker build -t a2a-server .
gcloud run deploy dws-a2a-server \
  --image a2a-server \
  --region europe-north1 \
  --platform managed
```

### 8.2 Validating After Deployment

```bash
# Install inspector
pip install a2a-inspector

# Validate agent card
a2a-inspector validate https://api.dws10.com/.well-known/agent.json

# Test a sample task
python3 tests/a2a_smoke_test.py
```

### 8.3 Monitoring

- **Supabase Dashboard:** Check `a2a_tasks` table for task status
- **Cloud Run Logs:** `gcloud logging read "resource.type=cloud_run_revision" --limit 50`
- **Alerts:** Set up Cloud Monitoring alerts for error rate > 5% or latency > 10s

---

## 9. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|---------|
| Agent Card returns 404 | Missing `/.well-known/agent.json` route | Check Cloud Run service routing |
| Task stuck in `working` | Processing timeout | Check MCP tool connections (Supabase, ERP) |
| Authentication failed | Invalid API key | Verify key in `a2a_api_keys` table |
| Artifact missing | Firehorse engine error | Check Firehorse logs in Cloud Run |
| Rate limit exceeded | Too many tasks | Upgrade partner plan or increase limits |

---

## 10. References

- [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/)
- [A2A Python SDK](https://github.com/a2aproject/a2a-python) — `pip install a2a-sdk`
- [A2A Inspector](https://github.com/a2aproject/a2a-inspector) — Validation tool
- [A2A Samples](https://github.com/a2aproject/a2a-samples) — Reference implementations
- [DWS Brand Standard v2.0](../DWS_BRAND_STANDARD.md) — Section 12: A2A Integration
- [Master Thesis EN](../docs/MASTER_THESIS_A2A_MULTI_AGENT_EN.md)
- [Master Thesis FI](../docs/MASTER_THESIS_A2A_MULTI_AGENT_FI.md)
