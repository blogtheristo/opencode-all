# MCP Client Quickstart

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/update-dws-mcp-hub-oVklG | Date: 12.05.2026 | Changes: Added Google-managed MCP as fourth profile (Cloud IAM auth, GCP-native services); pointed at MCP_CONFIGURATION.md §4 and mcp.google-managed.example.json
- Version: 1.1 | Tool: GitHub Copilot CLI (GPT-5.4) | Session: current | Date: 18.04.2026 | Changes: Updated quickstart to reflect Win11 developer MCP, DGX hub orchestration, and remote/mobile MCP split
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-dws6-ux-1RWJg | Date: 07.03.2026 | Changes: Initial creation — client quickstart for MCP Hub integration

Document Status:

- Created: 07.03.2026
- Last Modified: 12.05.2026
- Language: English
- Publication Status: ACTIVE

---

## Overview

DWS MCP is split by use case:

1. **Win11 developer MCP** — local backend + local Python gateway, no Docker
2. **DGX hub** — orchestration and scheduled automation
3. **Remote/mobile MCP** — hosted HTTP endpoints when local processes are not available
4. **Google-managed MCP** — Google Cloud first-party servers for GCP-native services (Cloud Run, BigQuery, GCS, Maps Grounding Lite, Drive/Gmail/Calendar, …); authenticate via Cloud IAM, not a DWS bearer token. See `docs/MCP_CONFIGURATION.md` section 4 and `mcp.google-managed.example.json`.

Supabase is shared across the split: local dev needs it, and DGX orchestration needs it too. Google-managed MCP does **not** host Supabase — Supabase stays on the DWS path.

## Quick Connection

### 1. Claude Code (`.mcp.json`)

For Win11 developer work, use local MCP entries:

```json
{
  "mcpServers": {
    "dws-agents-local": {
      "type": "http",
      "url": "http://localhost:3001/mcp"
    },
    "dws-gateway-local": {
      "type": "stdio",
      "command": "python",
      "args": ["mcp-servers/cloud-run-gateway/server.py", "--transport", "stdio"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      }
    }
  }
}
```

### 2. Cursor / VS Code

If you need remote/mobile access instead, use hosted URLs in your editor's MCP settings:

```json
{
  "mcp.servers": {
    "dws-gateway": {
      "type": "http",
      "url": "${MCP_GATEWAY_URL}"
    },
    "dws-agents": {
      "type": "http",
      "url": "${DWS_MCP_AGENT_URL}"
    }
  }
}
```

### 3. Environment split

#### Win11 developer

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GITHUB_TOKEN` (optional, only needed for GitHub tool calls from local gateway)

#### DGX hub

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `DATABASE_URL`
- `MCP_HUB_URL` or `MCP_HUB_HEALTH_URL`

#### Remote/mobile

- `MCP_GATEWAY_URL`
- `MCP_GATEWAY_API_KEY`
- `DWS_MCP_AGENT_URL`
- `DWS_API_TOKEN`

### 4. Python Client

```python
import httpx

def mcp_call(method: str, params: dict = None) -> dict:
    """Call DWS IQ MCP server."""
    resp = httpx.post("https://your-dws-agent-endpoint/mcp", json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {},
    }, headers={"Authorization": "Bearer YOUR_DWS_API_TOKEN"})
    return resp.json().get("result", {})

# List all available tools
tools = mcp_call("tools/list")
for tool in tools.get("tools", []):
    print(f"  {tool['name']}: {tool['description'][:60]}")

# Run compliance check
result = mcp_call("tools/call", {
    "name": "dws_compliance",
    "arguments": {
        "input": {
            "industry": "steel",
            "regulations": ["ets", "cbam", "csrd"],
        }
    }
})
print(result)
```

### 5. DWS CLI

```bash
# List available MCP tools
dws mcp tools

# Call a tool directly
dws mcp call dws_compliance --args '{"input":{"industry":"steel"}}'

# Connection test
dws status
```

## Available Tools

| Tool                          | Description                    |
| ----------------------------- | ------------------------------ |
| `dws_list_agents`             | List all available agents      |
| `dws_discover`                | Find agents by capability      |
| `dws_workflow`                | Trigger multi-agent workflow   |
| `dws_events`                  | Get recent event bus events    |
| `dws_compliance`              | EU compliance assessment       |
| `dws_sitesense`               | Construction site safety       |
| `dws_material_oracle`         | Material carbon analysis       |
| `dws_emissions_data_analyst`  | Emissions data queries         |
| `dws_schedule_genius`         | Construction scheduling        |
| `dws_customer_sat`            | Customer satisfaction analysis |
| `dws_viability`               | Project viability assessment   |
| `dws_competitor_surveillance` | Competitive intelligence       |
| `dws_seo_audit`               | SEO analysis                   |
| `dws_lead_feedback`           | Lead feedback scoring          |
| `dws_quality_gate`            | Quality gate assessment        |
| `dws_logistics`               | Logistics optimization         |

## Workflows

Multi-agent pipelines that chain agents:

```bash
# Compliance assessment: emissions → compliance → viability
dws workflow compliance-assessment --input '{"industry":"steel","annualEmissions":50000}'

# Full construction: sitesense + material + schedule → construction
dws workflow construction-full --input '{"temperature":28,"humidity":75,"windSpeed":15,"workerCount":50}'

# SEO pipeline: keywords → competitors → content brief
dws workflow seo-pipeline --input '{"domain":"example.com","targetKeywords":["eu compliance"]}'
```

## Local Development

For Win11 backend development, start the Express app and use the local agent endpoint:

```json
{
  "mcpServers": {
    "dws-agents-local": {
      "type": "http",
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

```bash
npm run dev
```

For DGX orchestration, use `.env.mcp` and the DGX day-runner / hub processes rather than local Win11 Docker containers.

## Server-Sent Events (Streaming)

Subscribe to real-time agent events:

```bash
curl -N http://localhost:3001/mcp/sse
```

Events include agent executions, workflow progress, and compliance alerts.

## Health Check

```bash
# Via CLI
dws health

# Via HTTP
curl http://localhost:3001/mcp/health
```

Response:

```json
{
  "status": "ok",
  "server": "dws-iq-agent-server",
  "version": "7.0.0",
  "agents": 16,
  "protocol": "MCP 2024-11-05"
}
```

## Troubleshooting

| Issue              | Fix                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Connection refused | Confirm the configured MCP URL is reachable or start `npm run dev` for local agent testing |
| 401 Unauthorized   | Set `MCP_GATEWAY_API_KEY` or `DWS_API_TOKEN` to a valid bearer token                       |
| Tool not found     | Run `dws mcp tools` to list available tools                                                |
| Timeout            | Check if backend is healthy: `dws health`                                                  |

## Architecture

```
Client (Claude Code / Cursor / CLI)
    ↓ JSON-RPC 2.0
MCP Agent Server (Express router at /mcp)
    ↓
Agent Registry → BaseAgent → Groq/Claude LLM
    ↓
Supabase (results, logging)
```

The MCP server auto-discovers agents from the registry. Every agent registered in `src/agents/` automatically becomes an MCP tool — no manual registration needed.
