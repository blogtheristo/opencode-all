#!/bin/bash
# SessionStart hook — injects context into every Claude Code session
# This runs when a new session begins or after context compaction

set -euo pipefail

# Output is injected into Claude's context as system information
cat <<'CONTEXT'
## Auto-Mode Trust Boundary Active

GREEN zone (full auto): Read, Edit, Write, lint, test, build, git on feature branches
YELLOW zone (auto + logged): MCP tools, agent skills, Docker, gh CLI, git push
RED zone (BLOCKED — human required): DB migrations, deploys, emails, thesis files, Store sync, standards updates, secrets

Budget: Check CLAUDE_AUTO_MODE_BUDGET env var (default: no limit)
Audit: All YELLOW actions logged to .claude/hooks/audit/

CONTEXT

# Check if budget env var is set
if [ -n "${CLAUDE_AUTO_MODE_BUDGET:-}" ]; then
  echo "Token budget for this session: $CLAUDE_AUTO_MODE_BUDGET"
fi

# Check MCP server health
if [ -f ".mcp.json" ]; then
  MCP_COUNT=$(cat .mcp.json | jq '.mcpServers | length' 2>/dev/null || echo "0")
  echo "MCP servers configured: $MCP_COUNT"
fi

# Check for uncommitted changes from previous session
DIRTY=$(git status --porcelain 2>/dev/null | head -5)
if [ -n "$DIRTY" ]; then
  echo ""
  echo "WARNING: Uncommitted changes detected from previous session:"
  echo "$DIRTY"
  echo "Consider committing or stashing before proceeding."
fi

# Check current branch
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "Current branch: $BRANCH"

# Warn if on main
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "WARNING: On main branch. Create a feature branch before making changes."
fi

exit 0
