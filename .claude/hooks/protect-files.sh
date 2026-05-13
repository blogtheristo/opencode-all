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

file=$(jq -r '.tool_input.file_path // .tool_input.path // ""')
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
  # supabase/migrations/*.sql intentionally NOT blocked here.
  # Per CLAUDE.md "Auto-Mode Trust Boundary": authoring a migration FILE is
  # GREEN (reviewable text artifact in PR); APPLYING it via
  # `psql` / `supabase db push` / `supabase migration up` is the RED action,
  # blocked on the Bash side by .claude/hooks/sql-safety-guard.sh.
  package-lock.json|yarn.lock)
    echo "Blocked: lockfiles are auto-generated." >&2; exit 2 ;;
esac

# BLOCK: .md files in public site folders (CLAUDE.md rule)
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
