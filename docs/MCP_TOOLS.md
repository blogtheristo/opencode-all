# MCP Tools Reference — DWS IQ 6

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-27
- Author: Claude Code
- Introduced-In: PR-912

## Overview

DWS IQ 6 exposes all agents and platform capabilities as MCP (Model Context Protocol) tools. External ADEs (Claude Code, Cursor, VS Code, Codex) can interact with the agent system via JSON-RPC 2.0 over HTTP.

**Endpoint:** `POST /mcp`
**Protocol:** MCP Streamable HTTP Transport (2025 spec)

## Meta-Tools

| Tool | Description |
|------|-------------|
| `dws_list_agents` | List all available agents with capabilities and models |
| `dws_discover` | Find agents by capability tag (e.g., "compliance", "carbon") |
| `dws_workflow` | Trigger multi-agent workflow (compliance-assessment, construction-full, seo-pipeline) |
| `dws_events` | Get recent events from the event bus |

## Memory Tools

| Tool | Description |
|------|-------------|
| `dws_memory_store` | Store a fact, preference, or knowledge as persistent memory |
| `dws_memory_recall` | Search memories using hybrid vector + text matching |
| `dws_memory_forget` | Soft-delete a memory (audit-compliant) |
| `dws_memory_profile` | Get aggregated profile from stored memories |
| `dws_extract_facts` | Extract structured facts from text using LLM |

## Agent Tools

Every registered agent is automatically exposed as an MCP tool with the prefix `dws_`.

### Core Agents

| Tool | Agent | Description |
|------|-------|-------------|
| `dws_sitesense` | SiteSense | Construction site safety assessment (EN 13001 crane warnings, 0-100 score) |
| `dws_schedule-genius` | ScheduleGenius | Project schedule optimization and critical path analysis |
| `dws_material-oracle` | MaterialOracle | Embodied carbon calculation per EN 15978 lifecycle assessment |
| `dws_customer-sat` | CustomerSat | Customer health scoring and NPS analysis |
| `dws_viability` | Viability | Financial ROI analysis with Monte Carlo simulation |

### Extraction & Research Agents

| Tool | Agent | Description |
|------|-------|-------------|
| `dws_deepwiki-extractor` | DeepWikiExtractor | GitHub code analysis for extraction planning |
| `dws_emissions-data-analyst` | EmissionsDataAnalyst | Emissions data analysis with EU regulatory context |
| `dws_compliance-researcher` | ComplianceResearcher | EU climate regulation research |
| `dws_sales-outreach` | SalesOutreach | B2B personalized outreach generation |

### Orchestration Agents

| Tool | Agent | Description |
|------|-------|-------------|
| `dws_construction` | Construction | Construction project compliance orchestration |
| `dws_logistics` | Logistics | Fleet compliance and route optimization |
| `dws_compliance` | Compliance | EU regulatory compliance (CSRD, CBAM, ETS, AI Act) |
| `dws_quality-gate` | QualityGate | Deployment readiness scoring |

### SEO Pipeline Agents

| Tool | Agent | Description |
|------|-------|-------------|
| `dws_keyword-intent` | KeywordIntent | Keyword intent classification |
| `dws_competitor-surveillance` | CompetitorSurveillance | Competitive intelligence monitoring |
| `dws_content-brief` | ContentBrief | SEO content brief generation |
| `dws_seo-audit` | SeoAudit | Technical SEO audit |
| `dws_lead-feedback` | LeadFeedback | Lead quality feedback analysis |

### Workflow Orchestrators (Pantheon)

| Tool | Agent | Role |
|------|-------|------|
| `dws_atlas` | Atlas | Chief of Staff — synthesis and routing |
| `dws_athena` | Athena | Compliance Intelligence — EU regulatory |
| `dws_hephaestus` | Hephaestus | Field and Site Intelligence — construction |
| `dws_iris` | Iris | Research and Market Intelligence |
| `dws_hermes` | Hermes | Logistics and Operations |
| `dws_apollo` | Apollo | Content and Outreach |

### Industry Specialists

| Tool | Agent | Industry |
|------|-------|----------|
| `dws_vulcan` | Vulcan | Steel and Metals |
| `dws_helios` | Helios | Energy and Renewables |
| `dws_neptune` | Neptune | Maritime and Shipping |
| `dws_ceres` | Ceres | Agriculture and Fertilizers |
| `dws_prometheus` | Prometheus | Hydrogen and Energy Transition |
| `dws_mars` | Mars | Construction and Buildings |
| `dws_gaia` | Gaia | Cement and Earth Materials |
| `dws_bess` | BESS | Battery Energy Storage (Q-System) |

### Specialized Agents

| Tool | Agent | Description |
|------|-------|-------------|
| `dws_argus` | Argus | SAR satellite image classification (20-industry detection) |
| `dws_sovereignty-monitor` | SovereigntyMonitor | EU data sovereignty scoring |
| `dws_designer` | Designer | Design-to-code bridge (Figma-to-code) |

## REST API Endpoints

The agents are also accessible via REST API:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents |
| `GET` | `/api/agents/:name` | Get agent details |
| `POST` | `/api/agents/:name/execute` | Execute agent (full context) |
| `POST` | `/api/agents/:name/run` | Execute agent (simplified, dashboard) |
| `POST` | `/api/agents/:name/chat` | Conversational agent interface |
| `GET` | `/api/agents/discover/:capability` | Find agents by capability |
| `GET` | `/api/agents/workflows` | List available workflows |
| `POST` | `/api/agents/workflow/:name` | Trigger multi-agent workflow |
| `GET` | `/api/agents/events` | Get event bus events |

All REST endpoints are also available under `/api/v1/agents/` for dashboard compatibility.

## Authentication

- **MCP endpoint:** Bearer token or API key in `Authorization` header
- **REST endpoints:** JWT from Supabase Auth

## Example: Execute Agent via MCP

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "dws_compliance",
    "arguments": {
      "industry": "steel",
      "regulations": "CSRD, CBAM, ETS",
      "annualEmissions": 50000
    }
  }
}
```

## Example: Execute Agent via REST

```bash
curl -X POST http://localhost:8080/api/v1/agents/compliance/run \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"input": {"industry": "steel", "regulations": "CSRD, CBAM, ETS"}}'
```

## Available Workflows

| Workflow | Steps | Description |
|----------|-------|-------------|
| `compliance-assessment` | Compliance + Athena + QualityGate | Full EU regulatory compliance assessment |
| `construction-full` | SiteSense + Construction + MaterialOracle | Complete construction project analysis |
| `seo-pipeline` | KeywordIntent + CompetitorSurveillance + ContentBrief + SeoAudit | Full SEO optimization pipeline |
