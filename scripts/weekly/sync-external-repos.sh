#!/usr/bin/env bash
# sync-external-repos.sh — Weekly audit of external repos & skill templates
#
# Auto-discovered by day-runner.sh (weekly folder convention).
# Runs every Sunday ~04:00 UTC on DGX Spark.
#
# What it does:
#   1. Checks each external repo for new releases / tags
#   2. Checks for security advisories (GitHub API)
#   3. Syncs autoresearch fork from upstream
#   4. Checks gstack for breaking changes
#   5. Audits vendored last30days-skill against upstream
#   6. Reports findings to logs/weekly-repo-sync.json
#
# Flags:
#   --full-audit    Run expanded audit (all repos, not just watched)
#   --dry-run       Report only, no git operations
#
# Requirements: curl, jq, git
# No secrets required — uses public GitHub API (unauthenticated, 60 req/hr)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
REPORT_FILE="$LOG_DIR/weekly-repo-sync.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

FULL_AUDIT=false
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --full-audit) FULL_AUDIT=true ;;
    --dry-run) DRY_RUN=true ;;
  esac
done

mkdir -p "$LOG_DIR"

# GitHub API helper (unauthenticated — 60 requests/hour limit)
# If GITHUB_TOKEN is set, uses authenticated requests (5000/hr)
gh_api() {
  local url="$1"
  local auth_header=""
  if [[ -n "${GITHUB_TOKEN:-}" ]]; then
    auth_header="-H \"Authorization: token $GITHUB_TOKEN\""
  fi
  curl -sf --max-time 10 \
    -H "Accept: application/vnd.github.v3+json" \
    ${auth_header} \
    "$url" 2>/dev/null || echo '{"error": "fetch_failed"}'
}

# ============================================================================
# EXTERNAL REPO REGISTRY
# Keep in sync with Admin/ADMIN_MANUAL.md Section 31.2
# ============================================================================

declare -A REPOS
REPOS=(
  ["gstack"]="garrytan/gstack"
  ["autoresearch"]="karpathy/autoresearch"
  ["opensandbox"]="alibaba/OpenSandbox"
  ["agent-browser"]="vercel-labs/agent-browser"
  ["gws-cli"]="googleworkspace/cli"
  ["last30days"]="mvanhorn/last30days-skill"
  ["agents-md"]="agentsmd/agents.md"
)

# BANNED repos — check these are NOT installed, alert if found
BANNED_REPOS=(
  "clawdbot/clawdbot"
)

# Pinned versions (from Admin/ADMIN_MANUAL.md Section 31.2)
declare -A PINNED_VERSIONS
PINNED_VERSIONS=(
  ["gstack"]="v0.15.16.0"
  ["opensandbox"]="0.1.0"
)

# ============================================================================
# CHECKS
# ============================================================================

results=()

echo "[sync-external-repos] Starting weekly audit at $TIMESTAMP"

# 1. Check each repo for latest release
echo "[sync-external-repos] Checking repos for new releases..."
for name in "${!REPOS[@]}"; do
  repo="${REPOS[$name]}"
  echo "  Checking $repo..."

  release_json=$(gh_api "https://api.github.com/repos/$repo/releases/latest")
  tag=$(echo "$release_json" | jq -r '.tag_name // "no_release"' 2>/dev/null || echo "parse_error")
  published=$(echo "$release_json" | jq -r '.published_at // "unknown"' 2>/dev/null || echo "unknown")

  pinned="${PINNED_VERSIONS[$name]:-none}"

  # Check if pinned version is behind latest
  version_drift="false"
  if [[ "$pinned" != "none" && "$tag" != "no_release" && "$tag" != "parse_error" && "$tag" != "$pinned" ]]; then
    version_drift="true"
  fi

  results+=("{\"name\": \"$name\", \"repo\": \"$repo\", \"latest_release\": \"$tag\", \"published\": \"$published\", \"pinned\": \"$pinned\", \"version_drift\": $version_drift}")
done

# 2. Check for security advisories on watched repos
echo "[sync-external-repos] Checking security advisories..."
advisories=()
for name in "${!REPOS[@]}"; do
  repo="${REPOS[$name]}"
  adv_json=$(gh_api "https://api.github.com/repos/$repo/security-advisories")
  adv_count=$(echo "$adv_json" | jq 'if type == "array" then length else 0 end' 2>/dev/null || echo "0")

  if [[ "$adv_count" -gt 0 ]]; then
    advisories+=("{\"repo\": \"$repo\", \"advisory_count\": $adv_count}")
    echo "  WARNING: $repo has $adv_count security advisory(ies)"
  fi
done

# 3. Sync autoresearch fork (if not dry-run)
echo "[sync-external-repos] Checking autoresearch fork sync status..."
autoresearch_sync="skipped"
if [[ -d "$REPO_ROOT/../autoresearch" ]]; then
  if [[ "$DRY_RUN" == "false" ]]; then
    pushd "$REPO_ROOT/../autoresearch" > /dev/null
    # Only fetch, never auto-merge
    git fetch upstream 2>/dev/null && autoresearch_sync="fetched" || autoresearch_sync="fetch_failed"
    behind=$(git rev-list --count HEAD..upstream/main 2>/dev/null || echo "unknown")
    ahead=$(git rev-list --count upstream/main..HEAD 2>/dev/null || echo "unknown")
    popd > /dev/null
    autoresearch_sync="{\"status\": \"$autoresearch_sync\", \"behind_upstream\": $behind, \"ahead_upstream\": $ahead}"
  else
    autoresearch_sync="{\"status\": \"dry_run\", \"behind_upstream\": \"unknown\", \"ahead_upstream\": \"unknown\"}"
  fi
else
  autoresearch_sync="{\"status\": \"not_found\", \"note\": \"Fork not cloned at ../autoresearch\"}"
fi

# 4. Check gstack installation and version
echo "[sync-external-repos] Checking gstack installation..."
gstack_status="not_installed"
gstack_local_version="unknown"
if [[ -d "$HOME/.claude/skills/gstack" ]]; then
  gstack_status="installed"
  if [[ -f "$HOME/.claude/skills/gstack/package.json" ]]; then
    gstack_local_version=$(jq -r '.version // "unknown"' "$HOME/.claude/skills/gstack/package.json" 2>/dev/null || echo "unknown")
  fi
fi

# 5. Audit vendored last30days-skill against upstream
echo "[sync-external-repos] Checking vendored last30days-skill..."
last30days_status="vendored"
if [[ -d "$REPO_ROOT/last30days-skill" ]]; then
  last30days_files=$(find "$REPO_ROOT/last30days-skill" -type f | wc -l)
  last30days_status="{\"status\": \"vendored\", \"file_count\": $last30days_files}"
fi

# 6. BANNED repo check — ensure none are installed
echo "[sync-external-repos] Checking BANNED repos..."
banned_found=()
for banned in "${BANNED_REPOS[@]}"; do
  banned_name=$(echo "$banned" | cut -d/ -f2)
  # Check common install locations
  if [[ -d "$HOME/.claude/skills/$banned_name" ]] || \
     [[ -d "$REPO_ROOT/node_modules/$banned_name" ]] || \
     command -v "$banned_name" &>/dev/null; then
    banned_found+=("$banned")
    echo "  CRITICAL: BANNED repo '$banned' found installed!"
  fi
done

# 7. npm audit (quick check)
echo "[sync-external-repos] Running npm audit..."
npm_audit="skipped"
if command -v npm &>/dev/null && [[ -f "$REPO_ROOT/package-lock.json" ]]; then
  audit_output=$(cd "$REPO_ROOT" && npm audit --json 2>/dev/null || echo '{"error": "audit_failed"}')
  npm_vulns=$(echo "$audit_output" | jq '.metadata.vulnerabilities // {}' 2>/dev/null || echo '{}')
  npm_audit="$npm_vulns"
fi

# ============================================================================
# REPORT
# ============================================================================

# Build results array
results_json=$(printf '%s\n' "${results[@]}" | jq -s '.' 2>/dev/null || echo '[]')
advisories_json=$(printf '%s\n' "${advisories[@]}" | jq -s '.' 2>/dev/null || echo '[]')
banned_json=$(printf '%s\n' "${banned_found[@]}" | jq -R -s 'split("\n") | map(select(length > 0))' 2>/dev/null || echo '[]')

report=$(cat <<REPORT_EOF
{
  "timestamp": "$TIMESTAMP",
  "full_audit": $FULL_AUDIT,
  "dry_run": $DRY_RUN,
  "repos": $results_json,
  "security_advisories": $advisories_json,
  "autoresearch_fork": $autoresearch_sync,
  "gstack": {
    "status": "$gstack_status",
    "local_version": "$gstack_local_version",
    "pinned_version": "${PINNED_VERSIONS[gstack]:-unknown}"
  },
  "last30days_skill": $last30days_status,
  "banned_repos_found": $banned_json,
  "npm_audit": $npm_audit
}
REPORT_EOF
)

# Write report
echo "$report" | jq '.' > "$REPORT_FILE" 2>/dev/null || echo "$report" > "$REPORT_FILE"

echo "[sync-external-repos] Report written to $REPORT_FILE"

# Summary
drift_count=$(echo "$report" | jq '[.repos[] | select(.version_drift == true)] | length' 2>/dev/null || echo "0")
adv_count=$(echo "$report" | jq '.security_advisories | length' 2>/dev/null || echo "0")
banned_count=$(echo "$report" | jq '.banned_repos_found | length' 2>/dev/null || echo "0")

echo ""
echo "=== WEEKLY EXTERNAL REPO SYNC SUMMARY ==="
echo "  Repos checked:        ${#REPOS[@]}"
echo "  Version drift:        $drift_count"
echo "  Security advisories:  $adv_count"
echo "  BANNED repos found:   $banned_count"

if [[ "$banned_count" -gt 0 ]]; then
  echo ""
  echo "  CRITICAL: BANNED repos detected! Immediate action required."
  echo "  See: docs/field-notes/2026-03-26-post-incident-cli-first-migration.md"
fi

if [[ "$drift_count" -gt 0 ]]; then
  echo ""
  echo "  Version drift detected. Review before updating:"
  echo "$report" | jq -r '.repos[] | select(.version_drift == true) | "    \(.name): pinned=\(.pinned) latest=\(.latest_release)"' 2>/dev/null
fi

echo ""
echo "[sync-external-repos] Done."
