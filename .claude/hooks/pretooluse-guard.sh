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
printf '%s' "$COMMAND" | grep -qiE 'ollama[[:space:]]+(pull|rm|remove|delete)[[:space:]]' && block "Ollama model change blocked — run manually after review"

# --- DEFAULT: ALLOW anything not in the deny list ---
# The deny list above catches dangerous commands. Everything else flows silently.
# This prevents decision fatigue from constant permission prompts.
exit 0
