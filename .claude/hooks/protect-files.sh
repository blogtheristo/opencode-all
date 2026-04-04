#!/usr/bin/env bash
# Protect sensitive files from Edit/Write tool calls
# PreToolUse hook — exits 2 to block, 0 to allow
set -euo pipefail

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')
[ -z "$file" ] && exit 0

# Normalize to relative path
file="${file#$PWD/}"

# BLOCK: files that should never be written by AI
protected=(
  ".env*"
  ".git/*"
  "package-lock.json"
  "yarn.lock"
  "*.pem"
  "*.key"
  "*.secret"
  "secrets/*"
  "credentials.json"
  "service-account-*.json"
  "supabase/migrations/*.sql"
)

for pattern in "${protected[@]}"; do
  if echo "$file" | grep -qiE "^${pattern//\*/.*}$"; then
    echo "Blocked: '$file' is protected. Explain why this edit is necessary." >&2
    exit 2
  fi
done

# BLOCK: .md files in public site folders (CLAUDE.md: Never Publish .md to Public Sites)
if echo "$file" | grep -qiE '\.(md|markdown)$'; then
  case "$file" in
    dws10.com/*|dws6.com/*|onelifetime.world/*|landing-pages/*)
      echo "Blocked: .md files cannot be placed in public site folders. Convert to HTML first." >&2
      exit 2 ;;
  esac
fi

# WARN (ask): standard files that need confirmation
case "$file" in
  .claude/settings.local.json|.claude/settings.json)
    printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"Modifying Claude Code settings — confirm this is intentional"}}'
    exit 0 ;;
  CLAUDE.md|DWS_SECURITY_STANDARD.md|DWS_BRAND_STANDARD.md)
    printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"Modifying DWS standard: %s — confirm"}}' "$file"
    exit 0 ;;
esac

exit 0
