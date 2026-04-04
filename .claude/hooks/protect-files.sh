#!/usr/bin/env bash
# Protect sensitive files from Edit/Write tool calls
# PreToolUse hook — exits 2 to block, 0 to allow
# Philosophy: block the dangerous stuff silently, allow everything else
set -euo pipefail

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')
[ -z "$file" ] && exit 0

# Normalize to relative path
file="${file#$PWD/}"

# BLOCK: files that should never be written by AI
case "$file" in
  .env|.env.*) echo "Blocked: $file is a secrets file." >&2; exit 2 ;;
  .git/*) echo "Blocked: cannot write to .git internals." >&2; exit 2 ;;
  *.pem|*.key|*.secret) echo "Blocked: $file is a sensitive key/cert." >&2; exit 2 ;;
  credentials.json|service-account-*.json) echo "Blocked: $file contains credentials." >&2; exit 2 ;;
  supabase/migrations/*.sql) echo "Blocked: DB migrations require human authoring." >&2; exit 2 ;;
  package-lock.json|yarn.lock) echo "Blocked: lockfiles are auto-generated." >&2; exit 2 ;;
esac

# BLOCK: .md files in public site folders (CLAUDE.md rule)
if echo "$file" | grep -qiE '\.(md|markdown)$'; then
  case "$file" in
    dws10.com/*|dws6.com/*|onelifetime.world/*|landing-pages/*)
      echo "Blocked: .md files cannot go in public site folders. Convert to HTML." >&2
      exit 2 ;;
  esac
fi

# Everything else: allow silently
exit 0
