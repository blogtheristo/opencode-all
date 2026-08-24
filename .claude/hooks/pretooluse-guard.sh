#!/bin/sh
# DWS6 Claude Code Hook: PreToolUse Guardrail
# Reads tool call JSON from stdin, decides: ALLOW (exit 0) or BLOCK (exit 2)
# Philosophy: block dangerous commands, allow everything else. Never prompt.
#
# Code-Version: 2.0
# Date: 2026-04-13
# Branch: claude/fix-partners-stub-issue-A7eFH
# Introduced-In: PR fix-partners-stub-issue-A7eFH
# Owner: Lifetime Oy
#
# Requires: jq or Python (fallback parser)

set -euo pipefail

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_LOG="${HOOK_DIR}/audit.log"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

INPUT="$(cat)"

json_get() {
  key_paths="$1"
  default_value="${2:-}"

  if command -v jq >/dev/null 2>&1; then
    expr=""
    IFS='|' read -r -a keys <<< "$key_paths"
    for k in "${keys[@]}"; do
      [ -n "$expr" ] && expr="$expr // "
      expr="${expr}.${k}"
    done
    printf '%s' "$INPUT" | jq -r "$expr // \"$default_value\"" 2>/dev/null
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    py_bin="python3"
  elif command -v python >/dev/null 2>&1; then
    py_bin="python"
  else
    printf '%s' "$default_value"
    return 0
  fi

  printf '%s' "$INPUT" | "$py_bin" - "$key_paths" "$default_value" <<'PY'
import json
import sys

raw = sys.stdin.read()
key_paths = sys.argv[1].split("|")
default = sys.argv[2]

try:
    data = json.loads(raw) if raw else {}
except Exception:
    print(default)
    raise SystemExit(0)

def get_path(obj, path):
    cur = obj
    for part in path.split("."):
        if not part:
            continue
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return None
    return cur

value = None
for p in key_paths:
    value = get_path(data, p)
    if value is not None:
        break

if value is None:
    print(default)
elif isinstance(value, (dict, list)):
    print(json.dumps(value, separators=(",", ":")))
else:
    print(str(value))
PY
}

TOOL_NAME="$(json_get "tool_name" "")"
COMMAND="$(json_get "tool_input.command" "")"

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

# Extract first token (the actual shell command)
FIRST_TOKEN=$(printf '%s' "$COMMAND" | sed 's/^[[:space:]]*//' | cut -d' ' -f1)

# ── PRE-CHECK: Protected path writes via Bash file-write commands ─────────────
# cp, mv, curl -o, wget -O bypass protect-files.sh entirely.
# Apply the same destination-path rules here before the safe list exits early.
#
# Protected destinations:
#   *artners/index.html  — Partners page (2026-04-13 incident)
#   *_OLD.*              — archived files must not be overwritten
#   .env / .env.*        — secrets
#   supabase/migrations/ — DB migrations

_is_protected_dest() {
  p="$1"
  printf '%s' "$p" | grep -qiE '[Pp]artners/index\.html'   && return 0
  printf '%s' "$p" | grep -qE   '_OLD\.[a-zA-Z0-9]+$'      && return 0
  printf '%s' "$p" | grep -qE   '(^|/)\.env(\.|$|$)'       && return 0
  printf '%s' "$p" | grep -qE   'supabase/migrations/.*\.sql$' && return 0
  return 1
}

# Pipe-to-shell — must run BEFORE the safe list (curl/wget are fast-allowed there)
if printf '%s' "$COMMAND" | grep -qiE '\|[[:space:]]*(sh|bash)(\s|$)'; then
  block "Pipe-to-shell attack"
fi

case "$FIRST_TOKEN" in
  cp|mv)
    # Destination is the last whitespace-delimited token
    DEST=$(printf '%s' "$COMMAND" | awk '{print $NF}')
    if _is_protected_dest "$DEST"; then
      block "$FIRST_TOKEN to protected path blocked: $DEST"
    fi
    ;;
  curl)
    # -o <file> or --output <file>
    DEST=$(printf '%s' "$COMMAND" | grep -oE '\-o[[:space:]]+[^[:space:]]+' | awk '{print $2}' | head -1)
    if [ -n "$DEST" ] && _is_protected_dest "$DEST"; then
      block "curl -o to protected path blocked: $DEST"
    fi
    ;;
  wget)
    # -O <file> or --output-document=<file>
    DEST=$(printf '%s' "$COMMAND" | grep -oE '(\-O[[:space:]]+[^[:space:]]+|--output-document=[^[:space:]]+)' | \
           sed 's/--output-document=//' | awk '{print $NF}' | head -1)
    if [ -n "$DEST" ] && _is_protected_dest "$DEST"; then
      block "wget -O to protected path blocked: $DEST"
    fi
    ;;
esac

# ── SECRET-FILE READ GUARD ───────────────────────────────────────────────────
# The settings.json `deny` list blocks the Read TOOL on .env / *secret* /
# *credentials*, but Bash readers (cat, grep, head, env, printenv, …) bypass it
# entirely and pull secrets straight into model context. Close that half here,
# BEFORE the fast-allow safe list below. Read-safe env templates are allowed.
#
# .env.example / .sample / .template / .dist and *.md are explicitly permitted.
_reads_secret_file() {
  c="$1"
  # Allow read-safe templates first
  printf '%s' "$c" | grep -qiE '\.env\.(example|sample|template|dist)\b' && return 1
  # .env and .env.<anything-else> (.env.local, .env.production, …)
  printf '%s' "$c" | grep -qE '(^|[[:space:]"=/'\''])\.env([[:space:]"'\'']|$)' && return 0
  printf '%s' "$c" | grep -qE '\.env\.[A-Za-z0-9_.-]+' && return 0
  # Key / cert material and credential files
  printf '%s' "$c" | grep -qiE '\.(pem|key|p12|pfx)([^A-Za-z0-9]|$)' && return 0
  printf '%s' "$c" | grep -qiE '(^|[/[:space:]])(id_rsa|id_ed25519|id_dsa)([^A-Za-z0-9]|$)' && return 0
  printf '%s' "$c" | grep -qiE '(secret|credential|service-account)[A-Za-z0-9_.-]*\.(json|ya?ml|txt|env|conf)' && return 0
  return 1
}

case "$FIRST_TOKEN" in
  cat|head|tail|less|more|nl|tac|xxd|od|strings|hexdump|base64|grep|egrep|fgrep|awk|sed|cut|sort|uniq|tr|dd)
    if _reads_secret_file "$COMMAND"; then
      block "Reading a secret file via '$FIRST_TOKEN' is not allowed. Secrets live in env vars; do not pull them into context."
    fi
    ;;
  env|printenv)
    # Bare `env` / `printenv` dump every secret in the environment. The legitimate
    # `VAR=value cmd` form starts with an assignment, not the bare binary, so it is
    # unaffected. `printenv NAME` of a secret-looking var is also blocked.
    if printf '%s' "$COMMAND" | grep -qiE '^(env|printenv)([[:space:]]+(-[a-z0-9]+|[A-Z_]*(KEY|SECRET|TOKEN|PASS|PASSWORD|PASSPHRASE|CREDENTIAL)[A-Z_]*))*[[:space:]]*($|[|>])'; then
      block "Bare environment dump ('$FIRST_TOKEN') is not allowed — it exposes every secret. Reference a specific non-secret var instead."
    fi
    ;;
esac

# ── DENY LIST: destructive patterns ──────────────────────────────────────────
# Scanned against the FULL $COMMAND string (not just $FIRST_TOKEN) so that a
# compound command — `echo hi && sudo rm -rf /`, `ls; git push --force` —
# cannot smuggle a dangerous verb past a safe-looking first token. This must
# run BEFORE the safe-command fast path below, unconditionally.

# Word-boundary command-position match: true if $COMMAND invokes $1 as a
# command (start of string, or after `;`/`&&`/`||`/`|`, with optional
# leading whitespace) — not merely as a substring (so "confirm" doesn't
# match "rm").
_invokes_cmd() {
  printf '%s' "$COMMAND" | grep -qE "(^|[;&|]+)[[:space:]]*$1([[:space:]]|\$)"
}

# rm -rf and rm -fr: block on ALL paths (absolute and relative).
# Exception: /tmp/ paths are safe.
# ALL rm is blocked — no file deletions allowed.
# The only permitted removal method is renaming to _OLD (git mv <file> <file_OLD.ext>).
if _invokes_cmd rm && ! printf '%s' "$COMMAND" | grep -qE '/tmp/'; then
  block "rm is not allowed. Rename to _OLD instead: git mv <file> <file>_OLD.<ext>"
fi

# truncate -s 0 empties files — block on protected paths
if _invokes_cmd truncate; then
  TRUNC_TARGET=$(printf '%s' "$COMMAND" | awk '{print $NF}')
  if _is_protected_dest "$TRUNC_TARGET"; then
    block "truncate of protected path: $TRUNC_TARGET"
  fi
fi

# shred permanently destroys file data — always block
if _invokes_cmd shred; then
  block "shred is a permanent destructive operation. Use git mv with _OLD suffix instead."
fi

# Git destructive operations
if _invokes_cmd git; then
  printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+push[[:space:]]+--force' && block "git push --force"
  printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+push[[:space:]]+-f[[:space:]]' && block "git push -f"
  printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+reset[[:space:]]+--hard' && block "git reset --hard"
  printf '%s' "$COMMAND" | grep -qiE 'git[[:space:]]+clean[[:space:]]+-[a-z]*f' && block "git clean -f"
  printf '%s' "$COMMAND" | grep -qiE '(^|[;&|]+[[:space:]]*)git[[:space:]]+rm[[:space:]]' && block "git rm — use git mv with _OLD suffix"
fi

# SQL destructive operations
if _invokes_cmd psql || _invokes_cmd supabase; then
  printf '%s' "$COMMAND" | grep -qiE 'DROP[[:space:]]+TABLE' && block "DROP TABLE — requires explicit approval"
  printf '%s' "$COMMAND" | grep -qiE 'TRUNCATE[[:space:]]' && block "TRUNCATE detected"
  if printf '%s' "$COMMAND" | grep -qiE 'DELETE[[:space:]]+FROM'; then
    printf '%s' "$COMMAND" | grep -qiE 'DELETE[[:space:]]+FROM[[:space:]]+[^;]*WHERE' || block "DELETE FROM without WHERE"
  fi
fi

# sudo — always block (already scanned the full string, unconditional)
printf '%s' "$COMMAND" | grep -qiE '(^|[;&|]+)[[:space:]]*sudo([[:space:]]|$)' && block "sudo command"

# Ollama model changes
if _invokes_cmd ollama; then
  printf '%s' "$COMMAND" | grep -qiE 'ollama[[:space:]]+(pull|rm|remove|delete)[[:space:]]' && block "Ollama model change — run manually"
fi

# ── SAFE COMMANDS: fast-allow ONLY for simple (non-compound) commands ─────────
# These commands may contain arbitrary string content (commit messages,
# inline scripts) that would false-positive on deny patterns — but only skip
# straight to allow when there is no `;`/`&&`/`||`/`|` chaining a second
# command in behind it. The deny list above already ran unconditionally, so
# a compound command falls through to DEFAULT: ALLOW below instead — still
# permitted if benign, but no longer able to bypass the deny checks.
if ! printf '%s' "$COMMAND" | grep -qE '[;&|]'; then
  case "$FIRST_TOKEN" in
    node|npx|npm|tsx|vitest|jest|prettier|eslint) exit 0 ;;  # JS tooling
    python|python3|pip|pip3|ruff|black|bandit) exit 0 ;;     # Python tooling
    make|cargo|go|rustc) exit 0 ;;                            # Build tools
    ls|pwd|echo|cat|head|tail|wc|file|which|type) exit 0 ;;  # Read-only
    find|grep|rg|diff|tree|du|df|date|env|printenv) exit 0 ;; # Inspect
    mkdir|touch|cp|mv|chmod|tar|zip|unzip) exit 0 ;;          # File ops (safe after pre-check above)
    docker|docker-compose|gh|jq|curl|wget) exit 0 ;;          # Tools
    SKIP_TIME_CHECK=*|CLAUDE_*|NODE_ENV=*) exit 0 ;;          # Env-prefixed
  esac

  # Also allow env-var-prefixed commands (VAR=value command ...)
  if printf '%s' "$COMMAND" | grep -qE '^[A-Z_]+=[^ ]+ (node|npx|npm|tsx|python)'; then
    exit 0
  fi
fi

# ── DEFAULT: ALLOW ────────────────────────────────────────────────────────────
exit 0
