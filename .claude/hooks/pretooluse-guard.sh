#!/bin/sh
# DWS6 Claude Code Hook: PreToolUse Guardrail for auto-enable-mode
# Reads tool call JSON from stdin, decides: ALLOW (exit 0), BLOCK (exit 2), or ASK (JSON stdout)
#
# Requires: jq
# See: CLAUDE.md "Security Coding Rules" and "Never Delete Files"

set -e

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_LOG="${HOOK_DIR}/audit.log"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Read JSON from stdin
INPUT="$(cat)"

# Extract tool name and command
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
COMMAND="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"

# Only process Bash tool calls
if [ "$TOOL_NAME" != "Bash" ] || [ -z "$COMMAND" ]; then
  exit 0
fi

# --- Helper functions ---

log_decision() {
  decision="$1"
  reason="$2"
  printf '%s | %s | %s | %s\n' "$TIMESTAMP" "$decision" "$reason" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
}

block() {
  reason="$1"
  log_decision "BLOCK" "$reason"
  printf 'BLOCKED: %s\n' "$reason" >&2
  exit 2
}

allow() {
  reason="$1"
  log_decision "ALLOW" "$reason"
  exit 0
}

ask_user() {
  reason="$1"
  log_decision "ASK" "$reason"
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"%s"}}' "$reason"
  exit 0
}

# --- DENY LIST: destructive patterns (exit 2) ---

# rm with force/recursive on broad paths
case "$COMMAND" in
  *'rm -rf '/*|*'rm -rf /'*|*'rm -r /'*|*'rm -f /'*)
    block "rm with force/recursive on root or broad path" ;;
esac
# Catch rm -rf with various flag orderings
printf '%s' "$COMMAND" | grep -qiE 'rm[[:space:]]+-[a-z]*r[a-z]*f[[:space:]]+/' && block "rm -rf on broad path"
printf '%s' "$COMMAND" | grep -qiE 'rm[[:space:]]+-[a-z]*f[a-z]*r[[:space:]]+/' && block "rm -fr on broad path"

# SQL destructive operations
printf '%s' "$COMMAND" | grep -qiE 'DROP[[:space:]]+TABLE' && block "DROP TABLE detected — requires explicit approval"
printf '%s' "$COMMAND" | grep -qiE 'TRUNCATE[[:space:]]' && block "TRUNCATE detected"
# DELETE FROM without WHERE
if printf '%s' "$COMMAND" | grep -qiE 'DELETE[[:space:]]+FROM'; then
  printf '%s' "$COMMAND" | grep -qiE 'DELETE[[:space:]]+FROM[[:space:]]+[^;]*WHERE' || block "DELETE FROM without WHERE clause"
fi

# Git destructive operations
printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+push[[:space:]]+--force' && block "git push --force"
printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+push[[:space:]]+-f[[:space:]]' && block "git push -f"
printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+reset[[:space:]]+--hard' && block "git reset --hard"
printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+clean[[:space:]]+-[a-z]*f' && block "git clean -f"

# Reading sensitive files (any read command, not just cat)
READ_CMDS='(cat|less|more|head|tail|bat|view|nano|vi|vim|code|open|xdg-open)'
printf '%s' "$COMMAND" | grep -qiE "${READ_CMDS}[[:space:]]+[^|]*\.env([[:space:]]|$)" && block "Reading .env file"
printf '%s' "$COMMAND" | grep -qiE "${READ_CMDS}[[:space:]]+[^|]*\.env\." && block "Reading .env.* file"
printf '%s' "$COMMAND" | grep -qiE "${READ_CMDS}[[:space:]]+[^|]*\.(key|pem|secret)([[:space:]]|$)" && block "Reading sensitive key/cert/secret file"
printf '%s' "$COMMAND" | grep -qiE "${READ_CMDS}[[:space:]]+[^|]*credentials\.json" && block "Reading credentials.json"
printf '%s' "$COMMAND" | grep -qiE "${READ_CMDS}[[:space:]]+[^|]*service-account-[^[:space:]]*\.json" && block "Reading service account JSON"
# Also catch source/dot-sourcing .env files
printf '%s' "$COMMAND" | grep -qiE '(source|\.)[[:space:]]+[^|]*\.env' && block "Sourcing .env file"

# Pipe-to-shell attacks
printf '%s' "$COMMAND" | grep -qiE 'curl[[:space:]].*\|[[:space:]]*(sh|bash)' && block "Pipe-to-shell: curl | sh/bash"
printf '%s' "$COMMAND" | grep -qiE 'wget[[:space:]].*\|[[:space:]]*(sh|bash)' && block "Pipe-to-shell: wget | sh/bash"

# sudo
printf '%s' "$COMMAND" | grep -qiE '^sudo[[:space:]]' && block "sudo command"
printf '%s' "$COMMAND" | grep -qiE '[;&|][[:space:]]*sudo[[:space:]]' && block "sudo command in chain"

# exec() with string interpolation (in JS/TS code being written)
printf '%s' "$COMMAND" | grep -qiE 'exec\([[:space:]]*[`"'"'"'].*\$' && block "exec() with string interpolation — use execFile() with argument arrays"

# git rm — Never Delete Files rule (CLAUDE.md: always rename to _OLD)
# Only match git rm as a command, not inside commit messages or strings
printf '%s' "$COMMAND" | grep -qiE '^git[[:space:]]+rm[[:space:]]' && block "git rm — use git mv to rename with _OLD suffix instead"
printf '%s' "$COMMAND" | grep -qiE '[;&|][[:space:]]*git[[:space:]]+rm[[:space:]]' && block "git rm — use git mv to rename with _OLD suffix instead"

# Ollama models — require human approval (CLAUDE.md: strategic decisions)
printf '%s' "$COMMAND" | grep -qiE 'ollama[[:space:]]+(pull|rm|remove|delete)[[:space:]]' && ask_user "Ollama model change requires human approval"

# --- ALLOW LIST: safe patterns (exit 0) ---

# npm/npx/node tooling
case "$COMMAND" in
  'npm run '*|'npm install'*|'npm test'*|'npm audit'*|'npx '*) allow "npm/npx command" ;;
  'node '*|'tsx '*|'vitest '*) allow "Node.js tooling" ;;
esac

# Safe git commands
case "$COMMAND" in
  'git status'*|'git diff'*|'git log'*|'git add '*|'git commit '*) allow "Safe git command" ;;
  'git branch'*|'git checkout'*|'git fetch'*|'git pull'*|'git stash'*) allow "Safe git command" ;;
  'git push '*|'git push') allow "git push (non-force)" ;;
  'git mv '*) allow "git mv" ;;
  'git remote'*|'git show'*|'git rev-parse'*|'git merge'*) allow "Safe git command" ;;
esac

# Read-only commands
case "$COMMAND" in
  'ls'*|'pwd'*|'echo '*|'cat '*|'head '*|'tail '*|'wc '*) allow "Read-only command" ;;
  'find '*|'grep '*|'rg '*|'which '*|'type '*|'file '*) allow "Read-only command" ;;
  'diff '*|'tree '*|'du '*|'df '*) allow "Read-only command" ;;
esac

# Build/test commands
case "$COMMAND" in
  'make'*|'cargo '*|'python '*|'pip '*) allow "Build/test command" ;;
  'docker '*|'docker-compose '*) allow "Docker command" ;;
  'gh '*) allow "GitHub CLI" ;;
  'chmod '*|'mkdir '*|'cp '*|'mv '*) allow "File operation" ;;
esac

# --- DEFAULT: ASK for anything not matched ---

ask_user "Command not in allow/deny list: review needed"
