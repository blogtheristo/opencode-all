#!/bin/bash
# SessionStart hook — injects context into every Claude Code session
# This runs when a new session begins or after context compaction

set -euo pipefail

# Output is injected into Claude's context as system information
cat <<'CONTEXT'
## Auto-Mode Trust Boundary Active

GREEN zone (full auto): Read, Edit, Write, lint, test, build, git on feature branches, and WEB/STATIC-SITE DEPLOYMENTS. Authoring DB migration FILES (supabase/migrations/*.sql) is GREEN — they are reviewable text artifacts. Web deploys are not gated: dws6.com / dws10.com / onelifetime.world / lifetime.fi auto-publish via Cloudflare Pages on merge to main (blue/green; rollback = promote previous deployment). ADDITIVE thesis content is GREEN on BOTH theses (HIC decision 01.08.2026): PhD market-signal sections in PHD_FIREHORSE_EN/FI (§14.x + Key Contribution) and master's implementation sections in V3Thesis_EN/FI, each with the lockstep version bump per §1.4. Scope split still applies — implementation evidence to the master's, market signals and scientific framing to the PhD (CLAUDE.md "Thesis Content Scope Rule"). The Thesis Rule's four-file lockstep is unchanged.
YELLOW zone (auto + logged): MCP tools, agent skills, Docker, gh CLI, git push
RED zone (BLOCKED — human required): APPLYING migrations (psql / supabase db push / supabase migration up), outbound email, STRUCTURAL thesis edits on any of the four files (TOC/chapter restructure, renumbering existing sections, rewriting or deleting existing VERSION AND AGENT HISTORY entries, removing existing content), Store sync, secrets

BLOG POSTS ARE RED — Non-Negotiable Rule 13 (ABSOLUTE)
No blog entry publishes until the HIC has read its full text and approved it. Any language, any site, translations, LSJ issues, cron-drafted posts. Run /blog-draft: write the whole text to docs/blog-drafts/<slug>.md, show the HIC ONE fenced code block, then STOP AND ASK in that turn. Publish only after an explicit approval about that post sets Status: APPROVED. Enforced by .claude/hooks/blog-draft-gate.sh — but the rule binds even where the hook does not reach (generators, cron, unloaded hooks). A bypass is not permission. Rules: docs/BLOG_STANDARD.md §3.3.

Budget: Check CLAUDE_AUTO_MODE_BUDGET env var (default: no limit)
Audit: All YELLOW actions logged to .claude/hooks/audit/

## Engineering Discipline — The 12 Rules (canonical: CLAUDE.md → "Engineering Discipline")

Every agent operates by these. Full text + DWS bindings in CLAUDE.md.
1 Think before coding (state assumptions, don't guess) · 2 Simplicity first (no speculative abstractions) · 3 Surgical changes (touch only what you must) · 4 Goal-driven (define success, loop until verified) · 5 Model only for judgment calls (not routing/retries/deterministic transforms) · 6 Token budgets per-task 4000 / per-session 30000 · 7 Surface conflicts, don't average them · 8 Read before you write (exports, callers, shared utils) · 9 Tests verify intent, not just behavior · 10 Checkpoint every significant step · 11 Match codebase conventions · 12 Fail loud (surface uncertainty, never hide skipped work)

CONTEXT

# Install the repo-local git hooks path (.githooks/pre-push runs gitleaks +
# npm-audit + vitest locally per docs/CI_AUDIT.md's local-first CI model).
# Previously only scripts/setup-git-hooks.ps1 did this (Windows-only), so
# fresh clones / cloud sessions silently skipped local CI on every push.
if [ -d ".githooks" ] && [ "$(git config --get core.hooksPath 2>/dev/null || true)" != ".githooks" ]; then
  git config core.hooksPath ".githooks"
  echo "[session-start] Installed core.hooksPath=.githooks (local CI: gitleaks, npm-audit, vitest on push)"
fi

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
DIRTY=$(git status --porcelain 2>/dev/null | sed -n '1,5p')
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

# Surface this branch's handoff file (git-committed memory that survives
# ephemeral cloud containers). Per-branch under .claude/handoffs/<branch>.md
# so concurrent branches never clobber or misread each other's state — see
# .claude/HANDOFF.md for the protocol. Cap output so a bloated file can't
# flood context.
BRANCH_HANDOFF_FILE=".claude/handoffs/${BRANCH}.md"
if [ "$BRANCH" != "unknown" ] && [ -f "$BRANCH_HANDOFF_FILE" ]; then
  echo ""
  echo "## Session Handoff (from $BRANCH_HANDOFF_FILE — update it at checkpoints and before ending the session)"
  echo ""
  head -60 "$BRANCH_HANDOFF_FILE"
elif [ "$BRANCH" != "unknown" ]; then
  echo ""
  echo "## Session Handoff: no file yet at .claude/handoffs/${BRANCH}.md"
  echo "This looks like a fresh branch. Create this file at your first checkpoint"
  echo "(see .claude/HANDOFF.md for the protocol). Recent cross-branch history:"
  echo ""
  awk '
    /^## HANDOFF HISTORY/ { found=1; next }
    found && count < 8 { print; count++ }
  ' ".claude/HANDOFF.md" 2>/dev/null
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

# Check for OpenCode upstream updates (non-blocking)
if command -v node >/dev/null 2>&1; then
  node .claude/hooks/opencode-check.js 2>/dev/null || true
fi

exit 0
