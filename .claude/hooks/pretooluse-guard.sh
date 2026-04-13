seems tr#!/bin/sh
# DWS6 Claude Code Hook: PreToolUse Guardrail
# Reads tool call JSON from stdin, decides: ALLOW (exit 0) or BLOCK (exit 2)
# Philosophy: block dangerous commands, allow everything else. Never prompt.
#
# Requires: jq

set -e

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_LOG="${HOOK_DIR}/audit.log"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
COMMAND="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"

if [ "$TOOL_NAME" != "Bash" ] || [ -z "$COMMAND" ]; then
  exit 0
fi

log_decision() {
  printf '%s | %s | %s | %.200s\n' "$TIMESTAMP" "$1" "$2" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
}

block() {
  log_decision "BLOCK" "$1"
  printf 'BLOCKED: %s\n' "$1" >&2
  exit 2
}

# --- SAFE COMMANDS: allow immediately, skip all deny checks ---
# These commands may contain arbitrary string content (commit messages,
# inline scripts) that would false-positive on deny patterns.
# Extract the actual shell command (first token before space/pipe/&&)
FIRST_TOKEN=$(printf '%s' "$COMMAND" | sed 's/^[[:space:]]*//' | cut -d' ' -f1)

case "$FIRST_TOKEN" in
  node|npx|npm|tsx|vitest|jest|prettier|eslint) exit 0 ;;  # JS tooling
  python|python3|pip|pip3|ruff|black|bandit) exit 0 ;;     # Python tooling
  make|cargo|go|rustc) exit 0 ;;                            # Build tools
  ls|pwd|echo|cat|head|tail|wc|file|which|type) exit 0 ;;  # Read-only
  find|grep|rg|diff|tree|du|df|date|env|printenv) exit 0 ;; # Inspect
  mkdir|touch|cp|mv|chmod|tar|zip|unzip) exit 0 ;;          # File ops
  docker|docker-compose|gh|jq|curl|wget) exit 0 ;;          # Tools
  SKIP_TIME_CHECK=*|CLAUDE_*|NODE_ENV=*) exit 0 ;;          # Env-prefixed
esac

# Also allow env-var-prefixed commands (VAR=value command ...)
if printf '%s' "$COMMAND" | grep -qE '^[A-Z_]+=[^ ]+ (node|npx|npm|tsx|python)'; then
  exit 0
fi

# --- DENY LIST: destructive patterns (exit 2) ---
# Only reached for shell commands (git, rm, psql, etc.)

# rm with force/recursive on broad paths
printf '%s' "$COMMAND" | grep -qiE '^rm[[:space:]]+-[a-z]*r[a-z]*f[[:space:]]+/' && block "rm -rf on broad path"
printf '%s' "$COMMAND" | grep -qiE '^rm[[:space:]]+-[a-z]*f[a-z]*r[[:space:]]+/' && block "rm -fr on broad path"

# Git destructive operations — only check commands starting with git
case "$FIRST_TOKEN" in
  git)
    printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+push[[:space:]]+--force' && block "git push --force"
    printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+push[[:space:]]+-f[[:space:]]' && block "git push -f"
    printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+reset[[:space:]]+--hard' && block "git reset --hard"
    printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+clean[[:space:]]+-[a-z]*f' && block "git clean -f"
    printf '%s' "$COMMAND" | grep -qiE '^git[[:space:]]+rm[[:space:]]' && block "git rm — use git mv with _OLD suffix"
    ;;
esac

# SQL destructive operations — only check actual SQL commands
case "$FIRST_TOKEN" in
  psql|supabase)
    printf '%s' "$COMMAND" | grep -qiE 'DROP[[:space:]]+TABLE' && block "DROP TABLE — requires explicit approval"
    printf '%s' "$COMMAND" | grep -qiE 'TRUNCATE[[:space:]]' && block "TRUNCATE detected"
    if printf '%s' "$COMMAND" | grep -qiE 'DELETE[[:space:]]+FROM'; then
      printf '%s' "$COMMAND" | grep -qiE 'DELETE[[:space:]]+FROM[[:space:]]+[^;]*WHERE' || block "DELETE FROM without WHERE"
    fi
    ;;
esac

# sudo — always block regardless of context
printf '%s' "$COMMAND" | grep -qiE '^sudo[[:space:]]' && block "sudo command"

# Pipe-to-shell — only when curl/wget is the actual command
case "$FIRST_TOKEN" in
  curl|wget)
    printf '%s' "$COMMAND" | grep -qiE '\|[[:space:]]*(sh|bash)' && block "Pipe-to-shell attack"
    ;;
esac

# Ollama model changes
case "$FIRST_TOKEN" in
  ollama)
    printf '%s' "$COMMAND" | grep -qiE 'ollama[[:space:]]+(pull|rm|remove|delete)[[:space:]]' && block "Ollama model change — run manually"
    ;;
esac

# --- DEFAULT: ALLOW ---
exit 0
