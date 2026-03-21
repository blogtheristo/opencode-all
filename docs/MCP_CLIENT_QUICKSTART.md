# MCP Client Quickstart

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-dws6-ux-1RWJg | Date: 07.03.2026 | Changes: Initial creation — client quickstart for MCP Hub integration

Document Status:
  - Created: 07.03.2026
  - Last Modified: 07.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Overview

The DWS IQ MCP Hub exposes all 16 AI agents as MCP tools. Any MCP-compatible client (Claude Code, Cursor, VS Code, Codex) can connect and use them.

## Quick Connection

### 1. Claude Code (`.mcp.json`)

Add to your project root `.mcp.json`:

```json
{
  "mcpServers": {
    "dws-iq": {
      "url": "http://localhost:8080/mcp",
      "transport": "streamable-http"
    }
  }
}
```

### 2. Cursor / VS Code

Add to your editor's MCP settings:

```json
{
  "mcp.servers": {
    "dws-iq": {
      "url": "http://localhost:8080/mcp",
      "transport": "streamable-http"
    }
  }
}
```

### 3. Python Client

```python
import httpx

def mcp_call(method: str, params: dict = None) -> dict:
    """Call DWS IQ MCP server."""
    resp = httpx.post("http://localhost:8080/mcp", json={
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {},
    })
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

### 4. DWS CLI

```bash
# List available MCP tools
dws mcp tools

# Call a tool directly
dws mcp call dws_compliance --args '{"input":{"industry":"steel"}}'

# Connection test
dws status
```

## Available Tools

| Tool | Description |
|------|-------------|
| `dws_list_agents` | List all available agents |
| `dws_discover` | Find agents by capability |
| `dws_workflow` | Trigger multi-agent workflow |
| `dws_events` | Get recent event bus events |
| `dws_compliance` | EU compliance assessment |
| `dws_sitesense` | Construction site safety |
| `dws_material_oracle` | Material carbon analysis |
| `dws_emissions_data_analyst` | Emissions data queries |
| `dws_schedule_genius` | Construction scheduling |
| `dws_customer_sat` | Customer satisfaction analysis |
| `dws_viability` | Project viability assessment |
| `dws_competitor_surveillance` | Competitive intelligence |
| `dws_seo_audit` | SEO analysis |
| `dws_lead_feedback` | Lead feedback scoring |
| `dws_quality_gate` | Quality gate assessment |
| `dws_logistics` | Logistics optimization |

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

## Server-Sent Events (Streaming)

Subscribe to real-time agent events:

```bash
curl -N http://localhost:8080/mcp/sse
```

Events include agent executions, workflow progress, and compliance alerts.

## Health Check

```bash
# Via CLI
dws health

# Via HTTP
curl http://localhost:8080/mcp/health
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

| Issue | Fix |
|-------|-----|
| Connection refused | Start backend: `npm run dev` |
| 401 Unauthorized | Set `DWS_API_TOKEN` in `.env` |
| Tool not found | Run `dws mcp tools` to list available tools |
| Timeout | Check if backend is healthy: `dws health` |

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
