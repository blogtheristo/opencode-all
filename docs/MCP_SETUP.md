# MCP Configuration for Context-Aware Code Reviews

> **Environment-specific file:** `.mcp.json` is not committed (listed in `.gitignore`). This guide documents the recommended configuration for Claude Code and OpenCode.

## Overview

MCP (Model Context Protocol) servers provide contextual data during code review:

- **GitHub MCP** — PR history, issue context, code search
- **Supabase MCP** — Database schema, migrations, advisors
- **dws-agents-local** — Agent orchestration and control
- **dws-gateway-local** — Cloud Run gateway for remote operations

## Configuration Template

**File:** `.mcp.json` (not committed; create locally)

```json
{
  "mcpServers": {
    "dws-agents-local": {
      "type": "http",
      "url": "http://localhost:3001/mcp",
      "description": "Local agent control plane for orchestrated code review"
    },
    "dws-gateway-local": {
      "type": "stdio",
      "command": "python",
      "args": ["mcp-servers/cloud-run-gateway/server.py", "--transport", "stdio"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      },
      "description": "Cloud Run gateway for remote operations"
    },
    "github": {
      "type": "builtin",
      "description": "GitHub API context for PR review",
      "tools": [
        "github_create_issue",
        "github_get_file",
        "github_get_repo",
        "github_list_issues",
        "github_list_prs",
        "github_list_repos",
        "github_search_code"
      ]
    },
    "supabase": {
      "type": "builtin",
      "description": "Supabase schema validation for migrations",
      "tools": [
        "apply_migration",
        "execute_sql",
        "generate_typescript_types",
        "get_advisors",
        "get_project",
        "list_tables",
        "list_migrations",
        "query_logs",
        "search_docs"
      ]
    }
  }
}
```

## Environment Variables Required

```bash
# Supabase gateway access
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_KEY=[service_role_key]

# GitHub MCP (automatic via OAuth, no manual token needed)
# Configure in Claude Code settings: Settings → MCP → GitHub → Connect
```

## Use Cases

### 1. Migration Review (Supabase context)

When reviewing `supabase/migrations/*.sql`, the MCP will:

- List existing tables and schema
- Run advisors to detect security issues (RLS, grants)
- Check migration order and dependencies
- Validate SQL syntax against live project

**Example:** `/code-review` on a migration file auto-loads schema context.

### 2. API Endpoint Review (GitHub + Supabase context)

When reviewing API route changes:

- GitHub MCP shows related PRs and issues
- Supabase MCP validates RLS policies match database
- Detects breaking changes to existing endpoints

### 3. PR Context Review

When reviewing code on a branch:

- GitHub MCP loads PR description, related issues, review history
- Provides diff context and commit messages
- Identifies related open PRs that may conflict

## Activation

**Claude Code CLI:**

```bash
# Start a session with MCP context enabled
cd /home/admin100/dws6
claude
```

**Settings:** MCP servers auto-activate via `.mcp.json` when present.

**OpenCode:** MCP servers are configured in `opencode.json` and sync with `.mcp.json` per the runtime policy in CLAUDE.md.

## Troubleshooting

**GitHub MCP not connecting:**

- Run `/settings` → "MCP" → "GitHub" → "Connect" to authenticate
- GitHub OAuth token is cached locally; no manual token needed

**Supabase MCP failing:**

- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in environment
- Check dws-gateway-local is running: `curl http://localhost:3000/health`
- Test with: `supabase status` (local CLI)

**Agent orchestration not responding:**

- Verify `dws-agents-local` is running on port 3001
- Check `.claude/hooks/audit.log` for startup errors

## Related

- `.mcp.json` — Live configuration (environment-specific, not committed)
- `.claude/settings.json` — Claude Code settings with MCP comment
- `CLAUDE.md` → "Runtime Policy" — OpenCode/Claude Code MCP alignment
- `docs/GITHUB_MCP_TOOLS.md` — GitHub MCP tool reference

---

**Last updated:** 2026-09-02
