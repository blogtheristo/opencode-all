# DWS Agents Local (MCP Server) — Quick Start

**dws-agents-local** is an MCP (Model Context Protocol) server that exposes all DWS IQ agents as tools, enabling Claude Code and other ADEs to interact with the agent system.

## Start the Server

### Development Mode (Auto-reload)

```bash
./scripts/start-dws-agents-local.sh
# or
npm run dev
```

**Output:**

```
📦 DWS Agents Local (MCP Server)
   Mounting at: http://localhost:3001/mcp
   Agent discovery: GET /mcp/tools
   Workflow execution: POST /mcp with agent request

🔄 Starting dev mode (watch mode)...
```

The server will watch for changes and automatically restart.

### Production Mode

```bash
./scripts/start-dws-agents-local.sh prod
# or
npm run build && NODE_ENV=production node dist/app.js
```

## Test the Server

### Health Check

```bash
curl http://localhost:3001/health
# Response: { "status": "ok" }
```

### Discover Available Agents

```bash
curl http://localhost:3001/mcp/tools
# Response: List of all registered agents as MCP tools
```

### Execute an Agent

The MCP server exposes agents as tools named `dws_{agent-name}`:

```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "tools/call",
    "params": {
      "name": "dws_compliance",
      "arguments": {
        "input": "Your compliance assessment prompt here"
      }
    }
  }'
```

## Use in Claude Code

Once the server is running, MCP automatically connects to it via `.mcp.json`:

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

### Agents Available

All agents from `src/agents/` are exposed as MCP tools:

- `dws_compliance` — Compliance assessments
- `dws_construction` — Build/deployment orchestration
- `dws_sitesense` — Site analysis
- `dws_auditor` — Code audits
- `dws_argus` — Monitoring
- And 30+ more (see `src/agents/AGENT_ROSTER.json`)

### Example: Use Compliance Agent in Claude Code

```typescript
// In a Claude Code session
const result = await callMcpTool("dws_compliance", {
  input: "Assess data handling in src/routes/payment.ts",
  riskLevel: "high",
});

console.log(result.findings);
```

Or via `/code-review` with agent context:

```bash
/code-review src/routes/payment.ts --agent compliance
```

## Available Tools

Meta-tools (agents about agents):

| Tool              | Purpose                                                                                |
| ----------------- | -------------------------------------------------------------------------------------- |
| `dws_list_agents` | Discover all agents (name, description, autonomy)                                      |
| `dws_discover`    | Find agents by capability (e.g., "payment", "security")                                |
| `dws_workflow`    | Trigger multi-agent workflows (compliance-assessment, construction-full, seo-pipeline) |

## Troubleshooting

### Server Not Starting

**Error:** `EADDRINUSE: address already in use :::3001`

Solution: Kill the existing process and restart:

```bash
lsof -i :3001 | grep node | awk '{print $2}' | xargs kill -9
npm run dev
```

### MCP Connection Fails

**Error:** `Failed to connect to http://localhost:3001/mcp`

Verify:

1. Server is running: `curl http://localhost:3001/health`
2. `.mcp.json` has correct URL (should be `http://localhost:3001/mcp`)
3. No firewall blocking localhost:3001

### Agent Not Found

**Error:** `Agent "compliance" not found in registry`

Check available agents:

```bash
curl http://localhost:3001/mcp/tools | jq '.[] | .name'
# or
npm run agents:list  # if available
```

## Integration Points

### From Claude Code

1. **Direct MCP call:** Agents available as MCP tools
2. **Via `/code-review`:** Pass `--agent <name>` flag
3. **Workflow trigger:** Use `dws_workflow` tool for orchestration

### From OpenCode

MCP servers auto-sync from `.mcp.json` per runtime policy in CLAUDE.md.

OpenCode can call agents the same way Claude Code does — no additional configuration needed.

## Agent Safety & Autonomy

Each agent has an autonomy tier (see `src/agents/autonomy.ts`):

- **Tier 0 (Observer)** — Read-only, reporting only
- **Tier 1 (Triage)** — Can create issues, logs
- **Tier 2 (Executor)** — Can run limited commands
- **Tier 3 (Admin)** — Full system access (requires approval)

MCP enforces these tiers via tool-color safety gates in `src/mcp/security/tool-colors.ts`.

## Related

- `.mcp.json` — MCP configuration (environment-specific)
- `src/mcp/agent-server.ts` — MCP server implementation
- `src/agents/` — Agent registry and implementations
- `docs/MCP_SETUP.md` — Full MCP setup guide
- `CLAUDE.md` → "Runtime Policy" — OpenCode/Claude Code sync rules

---

**Status:** ✅ Ready to use

**Last updated:** 2026-09-02
