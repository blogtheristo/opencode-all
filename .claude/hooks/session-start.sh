#!/bin/bash
# SessionStart hook — injects context into every Claude Code session
# This runs when a new session begins or after context compaction

set -euo pipefail

# Output is injected into Claude's context as system information
cat <<'CONTEXT'
## Auto-Mode Trust Boundary Active

GREEN zone (full auto): Read, Edit, Write, lint, test, build, git on feature branches, and WEB/STATIC-SITE DEPLOYMENTS. Authoring DB migration FILES (supabase/migrations/*.sql) is GREEN — they are reviewable text artifacts. Web deploys are not gated: dws6.com / dws10.com / onelifetime.world / lifetime.fi auto-publish via Cloudflare Pages on merge to main (blue/green; rollback = promote previous deployment).
YELLOW zone (auto + logged): MCP tools, agent skills, Docker, gh CLI, git push
RED zone (BLOCKED — human required): APPLYING migrations (psql / supabase db push / supabase migration up), outbound email, thesis files, Store sync, secrets

Budget: Check CLAUDE_AUTO_MODE_BUDGET env var (default: no limit)
Audit: All YELLOW actions logged to .claude/hooks/audit/

## Engineering Discipline — The 12 Rules (canonical: CLAUDE.md → "Engineering Discipline")

Every agent operates by these. Full text + DWS bindings in CLAUDE.md.
1 Think before coding (state assumptions, don't guess) · 2 Simplicity first (no speculative abstractions) · 3 Surgical changes (touch only what you must) · 4 Goal-driven (define success, loop until verified) · 5 Model only for judgment calls (not routing/retries/deterministic transforms) · 6 Token budgets per-task 4000 / per-session 30000 · 7 Surface conflicts, don't average them · 8 Read before you write (exports, callers, shared utils) · 9 Tests verify intent, not just behavior · 10 Checkpoint every significant step · 11 Match codebase conventions · 12 Fail loud (surface uncertainty, never hide skipped work)

CONTEXT

# Check if budget env var is set
if [ -n "${CLAUDE_AUTO_MODE_BUDGET:-}" ]; then
  echo "Token budget for this session: $CLAUDE_AUTO_MODE_BUDGET"
fi

# Check MCP server health
if [ -f ".mcp.json" ]; then
  if command -v jq >/dev/null 2>&1; then
    MCP_COUNT=$(jq '.mcpServers | length' .mcp.json 2>/dev/null || echo "0")
  elif command -v python3 >/dev/null 2>&1; then
    MCP_COUNT=$(python3 - <<'PY'
import json
from pathlib import Path

try:
    data = json.loads(Path(".mcp.json").read_text(encoding="utf-8"))
    print(len(data.get("mcpServers", {})))
except Exception:
    print(0)
PY
)
  elif command -v python >/dev/null 2>&1; then
    MCP_COUNT=$(python - <<'PY'
import json
from pathlib import Path

try:
    data = json.loads(Path(".mcp.json").read_text(encoding="utf-8"))
    print(len(data.get("mcpServers", {})))
except Exception:
    print(0)
PY
)
  else
    MCP_COUNT="0"
  fi
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

# Auto-discover and index all skills (Anthropic Skills paradigm)
SKILLS_DIR="skills"
if [ -d "$SKILLS_DIR" ]; then
  echo ""
  echo "## Skills Index (auto-discovered from skills/)"
  echo ""

  # Slash commands (.claude/commands/)
  COMMANDS=$(ls .claude/commands/*.md 2>/dev/null | xargs -I{} basename {} .md | tr '\n' ', ' | sed 's/,$//')
  if [ -n "$COMMANDS" ]; then
    echo "Slash commands: $COMMANDS"
  fi

  # Discipline gates (skills/*/SKILL.md without agent prefix)
  DISCIPLINE_SKILLS=$(ls "$SKILLS_DIR"/design-first/SKILL.md "$SKILLS_DIR"/dual-folder-sync/SKILL.md "$SKILLS_DIR"/verification-gate/SKILL.md 2>/dev/null | xargs -I{} dirname {} | xargs -I{} basename {} | tr '\n' ', ' | sed 's/,$//')
  if [ -n "$DISCIPLINE_SKILLS" ]; then
    echo "Discipline gates: $DISCIPLINE_SKILLS"
  fi

  # Agent skills (all skills/ subdirs except known discipline gates)
  AGENT_SKILLS=$(find "$SKILLS_DIR" -name "SKILL.md" -not -path "*/design-first/*" -not -path "*/dual-folder-sync/*" -not -path "*/verification-gate/*" -not -path "*/last30days-skill/*" 2>/dev/null | xargs -I{} dirname {} | xargs -I{} basename {} | sort | tr '\n' ', ' | sed 's/,$//')
  if [ -n "$AGENT_SKILLS" ]; then
    echo "Agent & report skills: $AGENT_SKILLS"
  fi

  echo ""
  echo "Load any skill: read skills/<name>/SKILL.md for full expertise + input/output contract."
fi

exit 0
