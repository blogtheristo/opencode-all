#!/usr/bin/env bash
# protect-files.sh — PreToolUse hook for Edit and Write tools
# exit 2 = block, exit 0 = allow
#
# Code-Version: 2.0
# Date: 2026-04-13
# Branch: claude/fix-partners-stub-issue-A7eFH
# Introduced-In: PR fix-partners-stub-issue-A7eFH
# Owner: Lifetime Oy
set -euo pipefail

# ── Read stdin once (jq can only consume it once) ────────────────────────────
INPUT=$(cat)

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

tool=$(json_get "tool_name" "")
file=$(json_get "tool_input.file_path|tool_input.path" "")
[ -z "$file" ] && exit 0

# Normalize to relative path
file="${file#$PWD/}"

# ── Helpers ──────────────────────────────────────────────────────────────────
# Build the _OLD sibling path for a given file path.
# Handles files with extension (foo.html → foo_OLD.html),
# multi-dot names (foo.min.js → foo.min_OLD.js),
# and no extension (Makefile → Makefile_OLD).
_old_sibling() {
  local f="$1"
  local d b name ext
  d=$(dirname "$f")
  b=$(basename "$f")
  if [[ "$b" == *.* ]]; then
    name="${b%.*}"
    ext="${b##*.}"
    echo "${d}/${name}_OLD.${ext}"
  else
    echo "${d}/${b}_OLD"
  fi
}

# ── 1. SECRETS — never written by AI ─────────────────────────────────────────
case "$file" in
  .env|.env.*)
    echo "Blocked: $file is a secrets file." >&2; exit 2 ;;
  .git/*)
    echo "Blocked: cannot write to .git internals." >&2; exit 2 ;;
  *.pem|*.key|*.secret)
    echo "Blocked: $file is a sensitive key/cert." >&2; exit 2 ;;
  credentials.json|service-account-*.json)
    echo "Blocked: $file contains credentials." >&2; exit 2 ;;
  supabase/migrations/*.sql)
    echo "Blocked: DB migrations require human authoring." >&2; exit 2 ;;
  package-lock.json|yarn.lock)
    echo "Blocked: lockfiles are auto-generated." >&2; exit 2 ;;
esac

# ── 2. _OLD ARCHIVE GUARD — archives are read-only ───────────────────────────
case "$file" in
  *_OLD.*)
    echo "Blocked: $file is an archived _OLD file. Do not overwrite archives." >&2; exit 2 ;;
esac

# ── 3. _OLD SIBLING — HIL gate for retired files ─────────────────────────────
# If foo_OLD.ext exists AND foo.ext does NOT exist, the file was intentionally
# retired. Block the restoration and tell Claude to ask the human first.
# (If both exist, the _OLD is just a backup — allow normal edits.)
old_sib=$(_old_sibling "$file")
if [ -f "$old_sib" ] && [ ! -f "$file" ]; then
  echo "Blocked: ${old_sib} exists and ${file} does not — file was retired. Ask the human before restoring." >&2
  exit 2
fi

# ── 4. PARTNERS PAGE — case-collision guard ───────────────────────────────────
# Root cause of 2026-04-13 incident: Windows case-insensitivity mapped
# partners/index.html (12-line stub) onto Partners/index.html (799 lines).
case "$file" in
  *artners/index.html)
    echo "Blocked: Partners page is protected. Must not be overwritten." >&2; exit 2 ;;
esac

# ── 5. IMAGE / BINARY — AI must never overwrite binary assets ────────────────
if echo "$file" | grep -qiE '\.(png|jpg|jpeg|gif|webp|svg|ico|bmp|avif|mp4|mp3|webm|woff|woff2|eot|ttf|otf|pdf)$'; then
  echo "Blocked: $file is a binary/image file and cannot be overwritten by AI." >&2
  exit 2
fi

# ── 6. STUB PROTECTION — Write tool only ─────────────────────────────────────
# Edit is a partial string replacement — it never supplies a full content field.
# Only Write (full file replacement) is checked here.
# Rule: existing file ≥20 lines AND replacement content <20 lines → stub suspect.
if [ "$tool" = "Write" ] && [ -f "$file" ]; then
  linecount=$(wc -l < "$file" 2>/dev/null || echo 0)
  if [ "$linecount" -ge 20 ]; then
    new_content=$(json_get "tool_input.content" "")
    newlines=$(printf '%s' "$new_content" | wc -l 2>/dev/null || echo 999)
    if [ "$newlines" -lt 20 ]; then
      echo "Blocked: refusing to replace ${linecount}-line file with ${newlines}-line stub." >&2
      exit 2
    fi
  fi
fi

# ── 7. .md IN PUBLIC FOLDERS ─────────────────────────────────────────────────
if echo "$file" | grep -qiE '\.(md|markdown)$'; then
  case "$file" in
    dws10.com/*|dws6.com/*|onelifetime.world/*|landing-pages/*)
      echo "Blocked: .md files cannot go in public site folders. Convert to HTML." >&2
      exit 2 ;;
  esac
fi

# ── 8. AUTO-BACKUP — Write only, existing files ──────────────────────────────
# Before any Write overwrites an existing file, save the old version to
# .claude/archive/ (gitignored). This gives a local recovery point without
# polluting git with _OLD files.
#
# NOTE: _OLD siblings are NOT created here. Per DWS convention, _OLD siblings
# are only created by a human explicitly retiring a file. Auto-backup writes
# only to the gitignored archive — never to the working tree.
if [ "$tool" = "Write" ] && [ -f "$file" ]; then
  archive_dir=".claude/archive/$(date -u +%Y-%m-%d)"
  mkdir -p "$archive_dir"
  # Flatten path separators so archive filenames are portable
  flat="${file//\//_}"
  ts=$(date -u +%H%M%S)
  cp "$file" "${archive_dir}/${ts}_${flat}" 2>/dev/null || true
fi

# Everything else: allow
exit 0
