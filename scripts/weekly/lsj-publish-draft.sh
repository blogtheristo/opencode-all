#!/usr/bin/env bash
# lsj-publish-draft.sh — Biweekly Lifetime Scope Monthly draft generator
#
# Auto-discovered by day-runner.sh (weekly folder convention).
# Guard: only executes on EVEN ISO weeks, producing a fortnightly cadence.
# Runs every other Sunday ~04:00 UTC on DGX Spark.
#
# What it does:
#   1. Inventories onelifetime.world/posts/**/*.html published in the last 14 days
#   2. If ≥ 4 new posts exist, generates a draft via the /lsj-publish skill
#      (Claude Code agent invocation) and writes it to drafts/lsj/<yyyy-mm-dd>.md
#   3. Never auto-posts to LinkedIn — the Editor in Chief (Risto) sends manually
#   4. On publish week with < 4 posts, logs a skipped-issue entry and notifies
#
# HARD LIMIT — this script drafts, it never publishes.
#   Per CLAUDE.md Non-Negotiable Rule 13, no blog post is published until the HIC
#   has read its full text and the draft at docs/blog-drafts/<slug>.md reads
#   Status: APPROVED. An unattended cron run has no HIC in the loop by definition,
#   so it must leave the issue as a draft and surface it for review. Running on a
#   schedule is not approval, and "the cron did it" is not an exemption.
#   See docs/BLOG_STANDARD.md §3.3 and .claude/hooks/blog-draft-gate.sh.
#
# Flags:
#   --dry-run       Print what would be drafted, touch no files
#   --force         Run regardless of ISO week parity (useful for manual runs)
#
# Code-Version: 1.0
# Introduced-In: PR-lsj-biweekly-cron
# Branch: claude/salesforce-headless-slack-api-7YDPZ
# Date: 2026-04-19
# Owner: Lifetime Oy
# Related: .claude/commands/lsj-publish.md
#          docs/field-notes/2026-04-19-lifetime-scope-journal-media-layer-strategy.md

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
DRAFT_DIR="$REPO_ROOT/drafts/lsj"
LOG_FILE="$LOG_DIR/lsj-publish-draft.log"
STATE_FILE="$LOG_DIR/lsj-publish-state.json"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
ISO_WEEK="$(date -u +"%V")"
ISO_YEAR="$(date -u +"%G")"
TODAY="$(date -u +"%Y-%m-%d")"

DRY_RUN=false
FORCE=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --force)   FORCE=true ;;
  esac
done

mkdir -p "$LOG_DIR" "$DRAFT_DIR"

log() { printf '[%s] %s\n' "$TIMESTAMP" "$*" | tee -a "$LOG_FILE"; }

# Biweekly guard: run only on EVEN ISO weeks (skip ~half the Sundays).
# Adjust parity here if the first issue lands on an odd week.
WEEK_PARITY=$(( 10#$ISO_WEEK % 2 ))
if [[ "$FORCE" != true && "$WEEK_PARITY" -ne 0 ]]; then
  log "Skipping: ISO week ${ISO_YEAR}-W${ISO_WEEK} is odd (biweekly guard)."
  exit 0
fi

log "Biweekly trigger fired for ISO week ${ISO_YEAR}-W${ISO_WEEK}."

# Count posts published in the last 14 days by reading article:published_time meta.
POSTS_DIR_EN="$REPO_ROOT/onelifetime.world/posts"
CUTOFF="$(date -u -d '14 days ago' +"%Y-%m-%d" 2>/dev/null || gdate -u -d '14 days ago' +"%Y-%m-%d")"

recent_count=0
while IFS= read -r -d '' html; do
  pub="$(grep -oE 'article:published_time" content="[0-9-]+"' "$html" | head -1 | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' || true)"
  [[ -z "$pub" ]] && continue
  if [[ "$pub" > "$CUTOFF" || "$pub" == "$CUTOFF" ]]; then
    recent_count=$((recent_count + 1))
  fi
done < <(find "$POSTS_DIR_EN" -maxdepth 3 -name '*.html' ! -name '_template-*.html' -print0)

log "Found ${recent_count} post(s) published since ${CUTOFF}."

if [[ "$recent_count" -lt 4 ]]; then
  log "Skipping issue: need ≥ 4 posts in the window, have ${recent_count}."
  printf '{"last_run":"%s","status":"skipped","reason":"insufficient_posts","count":%d}\n' \
    "$TIMESTAMP" "$recent_count" > "$STATE_FILE"
  exit 0
fi

DRAFT_FILE="$DRAFT_DIR/${TODAY}-lsj-biweekly-draft.md"

if [[ "$DRY_RUN" == true ]]; then
  log "DRY RUN — would create ${DRAFT_FILE} and invoke /lsj-publish."
  exit 0
fi

# Placeholder for the agent invocation. On DGX Spark, day-runner.sh calls
# `dws run lsj-publish` (DWS CLI agent entrypoint) which executes the skill
# defined in .claude/commands/lsj-publish.md. Until the CLI entrypoint ships,
# we drop a stub that names the candidates and asks Risto to run the skill
# interactively via Claude Code.
{
  printf '# Lifetime Scope Monthly — Biweekly draft trigger\n\n'
  printf 'Trigger date (UTC): %s\n' "$TIMESTAMP"
  printf 'ISO week: %s-W%s\n' "$ISO_YEAR" "$ISO_WEEK"
  printf 'Recent posts (last 14 days): %s\n\n' "$recent_count"
  printf 'Next action — run in Claude Code:\n\n'
  printf '    /lsj-publish %s\n\n' "$(date -u +"%Y-%m")"
  printf 'Skill spec: .claude/commands/lsj-publish.md\n'
  printf 'Strategy:   docs/field-notes/2026-04-19-lifetime-scope-journal-media-layer-strategy.md\n'
} > "$DRAFT_FILE"

printf '{"last_run":"%s","status":"draft_created","file":"%s","count":%d}\n' \
  "$TIMESTAMP" "$DRAFT_FILE" "$recent_count" > "$STATE_FILE"

log "Draft trigger written to ${DRAFT_FILE}."
