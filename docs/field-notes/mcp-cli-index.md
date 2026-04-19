# MCP CLI Index

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot CLI (GPT-5.4) | Session: current | Date: 18.04.2026 | Changes: Initial creation — indexed current MCP and CLI surfaces, separated Win11 developer MCP, DGX hub orchestration, remote/mobile gateway, and refreshed external package guidance

Session Links & References:
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/mcp-cli-index.md

Document Status:
  - Created: 18.04.2026
  - Last Modified: 18.04.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Date

18.04.2026

## Author

GitHub Copilot CLI (GPT-5.4)

## Location

DWS6 repository — MCP, CLI, and admin documentation surfaces

## Context

The repository had drift between Win11 developer MCP, DGX-hosted orchestration, remote/mobile MCP guidance, and old external package examples. This note records the current index so future updates have one stable reference point.

## Ontology Tags

MCP, CLI, DGX, Win11, Supabase, Tooling, Documentation, Admin

## The Story

Several documents mixed together different layers of the tooling stack:

- Win11 developer-local MCP
- DGX Spark hub/orchestration
- remote/mobile hosted MCP
- external CLIs and third-party MCP packages

That made old package names and outdated install examples linger even after the deployment/security model changed.

## The Insight

The correct model is a **split index**, not a single default:

| Surface | Current status | Where it belongs | Current package / entry |
|---------|----------------|------------------|-------------------------|
| DWS CLI | Primary repo CLI | Win11, DGX, servers | `cli/` in-repo |
| GitHub MCP in Claude Code | Built in | Claude Code sessions | No external package in `.mcp.json` |
| DWS Agent MCP | Local dev or hosted backend | Win11 local backend / hosted backend | `src/mcp/agent-server.ts` |
| DWS Gateway Local | Developer helper MCP | Win11 only | `mcp-servers/cloud-run-gateway/server.py` |
| DWS Hub | Orchestration layer | DGX Spark | `.env.mcp` / `env.mcp.example` |
| Supabase external MCP | Optional standalone MCP | Win11, DGX, external clients | `@supabase/mcp-server-supabase` |
| Redis external MCP | Optional cache/session MCP | DGX / specialist debugging | `@upstash/redis-mcp` |
| Google Workspace CLI | External CLI add-on | Win11 / operator workstation | `@googleworkspace/cli` |
| Agent Browser | External browser CLI | Win11 / QA | `agent-browser` |
| gstack | External skills/workflow system | Claude Code workstation | `garrytan/gstack` |

## Admin Documentation Links

- Main admin manual: `Admin/ADMIN_MANUAL.md`
- MCP configuration guide: `docs/MCP_CONFIGURATION.md`
- MCP client quickstart: `docs/MCP_CLIENT_QUICKSTART.md`
- Cloud Run gateway reference: `mcp-servers/cloud-run-gateway/README.md`
- Document index: `docs/Document-index.md`

## Next Steps

1. When package names drift, update this file first, then sync the detailed setup docs.
2. Keep Win11 documentation free of Docker-first MCP assumptions.
3. Keep DGX-specific hub/orchestration guidance in DGX/admin runbooks and `.env.mcp` docs.
4. Treat GitHub MCP in Claude Code as built-in unless a non-Claude client explicitly needs a separate integration.
