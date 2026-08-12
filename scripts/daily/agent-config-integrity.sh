#!/usr/bin/env bash
# agent-config-integrity.sh — Daily guard against the "Mini" Shai-Hulud
# persistence pattern (npm/PyPI malware that hooks itself into Claude Code
# and VS Code config so it re-executes after the infected package is removed).
#
# Auto-discovered by scripts/day-runner.sh (daily folder convention).
#
# What it checks (per file, on this branch only):
#   1. Drift — current contents vs. `git show HEAD:<path>`. Any difference is
#      reported. Operators must baseline-bump in a normal commit.
#   2. Untracked sibling — if `.claude/settings.json` (the path the malware
#      writes to, distinct from the gitignored-but-whitelisted
#      settings.local.json) is present, that's a red flag.
#   3. Inline IOC patterns — hook/task commands containing:
#        - http:// or https:// URLs
#        - curl / wget / Invoke-WebRequest piped to a shell
#        - base64-decode-and-exec (`base64 -d|sh`, `-EncodedCommand`,
#          `[Convert]::FromBase64String`)
#        - inline interpreter eval flags pointed at suspicious code
#          (`node -e`, `python -c`, `perl -e`, `ruby -e`) where the inline
#          string is not the repo's own prettier/eslint shim
#
# Exit codes:
#   0 — clean
#   1 — drift or IOC detected (manifests in logs and stderr)
#   2 — required tools missing
#
# Tracked config paths (allow-list — anything outside this is unmonitored):
TRACKED_PATHS=(
  ".claude/settings.local.json"
  ".vscode/tasks.json"
  ".vscode/settings.json"
)

# Suspicious sibling paths (must NOT exist on a clean tree):
SUSPECT_PATHS=(
  ".claude/settings.json"
)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

LOG_DIR="$REPO_ROOT/logs/agent-config-integrity"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE_TAG=$(date -u +"%Y-%m-%d")
REPORT_FILE="$LOG_DIR/${DATE_TAG}.json"

# Tool checks
for tool in git jq grep; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "[agent-config-integrity] ERROR: '$tool' required but not installed" >&2
    exit 2
  fi
done

findings=()
exit_code=0

record_finding() {
  local kind="$1" path="$2" detail="$3"
  findings+=("$(jq -nc \
    --arg kind "$kind" \
    --arg path "$path" \
    --arg detail "$detail" \
    '{kind:$kind, path:$path, detail:$detail}')")
  echo "[FINDING] $kind  $path  — $detail" >&2
  exit_code=1
}

# ---------------------------------------------------------------------------
# Pattern list — keep deliberately narrow to avoid false positives.
# Each regex is matched against the raw file contents (PCRE via grep -P).
# Patterns are deliberately broad about WHAT they match, narrow about WHERE
# (only fired inside the tracked config files which have a tiny surface).
# ---------------------------------------------------------------------------
# Patterns that should never appear inside the tracked editor/agent configs:
declare -a IOC_PATTERNS=(
  # Direct URLs in any value
  'https?://[^"[:space:]]+'
  # Pipe-to-shell of network fetchers
  'curl[^"]*\|[^"]*(sh|bash|zsh|pwsh|powershell)\b'
  'wget[^"]*\|[^"]*(sh|bash|zsh|pwsh|powershell)\b'
  'Invoke-WebRequest[^"]*\|'
  'Invoke-RestMethod[^"]*\|'
  # Base64 decode-and-exec
  'base64[[:space:]]+-d'
  '-EncodedCommand'
  '\[Convert\]::FromBase64String'
  'atob\('
  # Inline interpreter eval flags (the prettier/eslint hooks in this repo
  # call binaries directly — they never use -e/-c/-p for inline code, so
  # any occurrence is anomalous)
  '\bnode[[:space:]]+-e\b'
  '\bnode[[:space:]]+-p\b'
  '\bpython[0-9.]*[[:space:]]+-c[[:space:]]+["'\''-]'
  '\bperl[[:space:]]+-e\b'
  '\bruby[[:space:]]+-e\b'
  # Common implant homes
  '/tmp/[a-zA-Z0-9._-]+\.(sh|js|py|ps1)'
  '~/\.cache/.*\.(sh|js|py)'
)

# ---------------------------------------------------------------------------
# 1. Drift check vs. git HEAD
# ---------------------------------------------------------------------------
for path in "${TRACKED_PATHS[@]}"; do
  if [[ ! -f "$path" ]]; then
    record_finding "missing_tracked_file" "$path" "tracked config file is absent from working tree"
    continue
  fi

  # Compare current file with HEAD version (path is tracked, so this exists).
  # Use --quiet --exit-code so we get a single bit answer.
  if ! git diff --quiet --exit-code -- "$path" 2>/dev/null; then
    # Compute a short summary of what changed
    diff_summary=$(git diff --stat -- "$path" 2>/dev/null | tail -1 | tr -s ' ')
    record_finding "drift_vs_head" "$path" "differs from committed version: ${diff_summary:-changes detected}"
  fi
done

# ---------------------------------------------------------------------------
# 2. Suspect sibling paths that must not exist
# ---------------------------------------------------------------------------
for path in "${SUSPECT_PATHS[@]}"; do
  if [[ -e "$path" ]]; then
    record_finding "unexpected_file" "$path" "this path is a known Mini Shai-Hulud persistence target; investigate"
  fi
done

# ---------------------------------------------------------------------------
# 3. Inline IOC pattern scan — only over the actual execution surface
# ---------------------------------------------------------------------------
# We must NOT scan the entire file: `.claude/settings.local.json` contains a
# `permissions.allow` list whose entries describe what Bash patterns are
# allowed, not what runs. Scanning those produces false positives. Instead,
# extract just the strings that get executed:
#   - .claude/settings.local.json  →  .hooks[].hooks[].command  (per event)
#   - .vscode/tasks.json           →  .tasks[].command + .tasks[].args[]
#   - .vscode/settings.json        →  terminal.integrated.profiles.*.path
#                                     terminal.integrated.profiles.*.args[]
# ---------------------------------------------------------------------------
extract_exec_strings() {
  local file="$1"
  case "$file" in
    .claude/settings.local.json)
      jq -r '
        .hooks // {}
        | to_entries[]
        | .value[]
        | (.hooks // [])[]
        | .command // empty
      ' "$file" 2>/dev/null
      ;;
    .vscode/tasks.json)
      jq -r '
        (.tasks // [])[]
        | (.command // empty),
          ((.args // [])[] | tostring)
      ' "$file" 2>/dev/null
      ;;
    .vscode/settings.json)
      jq -r '
        ."terminal.integrated.profiles.windows" // {}
        | to_entries[]
        | .value
        | (.path // empty),
          ((.args // [])[] | tostring)
      ' "$file" 2>/dev/null
      ;;
  esac
}

for path in "${TRACKED_PATHS[@]}"; do
  [[ -f "$path" ]] || continue

  exec_strings=$(extract_exec_strings "$path")
  [[ -z "$exec_strings" ]] && continue

  # Iterate one logical command per line through every pattern.
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    for pattern in "${IOC_PATTERNS[@]}"; do
      if echo "$line" | grep -qP -- "$pattern" 2>/dev/null; then
        # Truncate for readability in logs (the full line is in $line; the
        # pattern that matched plus a 120-char excerpt is enough to triage).
        excerpt=$(echo "$line" | head -c 160)
        record_finding "ioc_match" "$path" "pattern=${pattern}  cmd=${excerpt}"
      fi
    done
  done <<<"$exec_strings"
done

# ---------------------------------------------------------------------------
# Write report
# ---------------------------------------------------------------------------
findings_json=$(printf '%s\n' "${findings[@]:-}" | jq -s '. // []' 2>/dev/null || echo '[]')

branch_name=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
commit_sha=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

cat > "$REPORT_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "branch": "$branch_name",
  "commit": "$commit_sha",
  "tracked_paths": $(printf '%s\n' "${TRACKED_PATHS[@]}" | jq -R . | jq -s .),
  "suspect_paths": $(printf '%s\n' "${SUSPECT_PATHS[@]}" | jq -R . | jq -s .),
  "findings_count": ${#findings[@]},
  "findings": $findings_json,
  "exit_code": $exit_code
}
EOF

# ---------------------------------------------------------------------------
# Console summary
# ---------------------------------------------------------------------------
echo ""
echo "================================================"
echo " Agent / Editor Config Integrity — $DATE_TAG"
echo "================================================"
echo "  Branch:     $branch_name ($commit_sha)"
echo "  Tracked:    ${#TRACKED_PATHS[@]} files"
echo "  Findings:   ${#findings[@]}"
echo "  Report:     $REPORT_FILE"
if [[ $exit_code -eq 0 ]]; then
  echo "  Status:     CLEAN"
else
  echo "  Status:     ALERT — review findings in stderr above and in report"
fi
echo "================================================"

exit $exit_code
