#!/usr/bin/env bash
# md-restore-version-delimiters.sh
#
# Purpose: Restore `***` as the thematic-break delimiter around a
# `# VERSION AND AGENT HISTORY` block in markdown files after prettier
# has rewritten it to `---`.
#
# Why this exists:
#   Per DWS_DOCUMENT_STANDARD.md §2.1 (Pandoc Compatibility), the
#   VERSION AND AGENT HISTORY block must be delimited with `***`,
#   not `---`. Prettier's markdown formatter always normalises
#   thematic breaks to `---` (non-configurable upstream), which
#   makes Pandoc misinterpret the history block as YAML front matter.
#
# Behaviour:
#   - Runs as a PostToolUse hook after the prettier formatter.
#   - Reads the file_path from stdin (Claude Code tool_input).
#   - Only operates on `.md` / `.markdown` files.
#   - Only touches the opening `---` immediately before
#     `# VERSION AND AGENT HISTORY` and the matching closing `---`
#     that ends the block — never other horizontal rules.
#   - Idempotent: no-op when the file already uses `***`.
#   - Always exits 0 (never blocks a tool run).
#
# Logs: .claude/hooks/audit/md-delimiter-restore.log

set -euo pipefail

LOG_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}/.claude/hooks/audit"
LOG_FILE="${LOG_DIR}/md-delimiter-restore.log"
mkdir -p "${LOG_DIR}" 2>/dev/null || true

log() {
  printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*" >> "${LOG_FILE}" 2>/dev/null || true
}

# Read tool_input JSON from stdin; extract file_path.
payload="$(cat || true)"
file_path="$(printf '%s' "${payload}" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

if [ -z "${file_path}" ]; then
  exit 0
fi

case "${file_path,,}" in
  *.md|*.markdown) ;;
  *) exit 0 ;;
esac

if [ ! -f "${file_path}" ]; then
  exit 0
fi

# Only act if the file actually contains a VERSION AND AGENT HISTORY block.
if ! grep -qE '^# VERSION AND AGENT HISTORY' "${file_path}"; then
  exit 0
fi

# Find the line number of the VERSION AND AGENT HISTORY heading.
header_line="$(grep -nE '^# VERSION AND AGENT HISTORY' "${file_path}" | head -n1 | cut -d: -f1 || true)"
if [ -z "${header_line}" ]; then
  exit 0
fi

# Locate the nearest `---` or `***` above the header (within 3 lines).
open_line=""
for offset in 1 2 3; do
  candidate=$((header_line - offset))
  [ "${candidate}" -lt 1 ] && break
  line_content="$(sed -n "${candidate}p" "${file_path}")"
  if [ "${line_content}" = "---" ] || [ "${line_content}" = "***" ]; then
    open_line="${candidate}"
    break
  fi
done

# Locate the closing `---` or `***` after the header. The standard block
# ends with "Publication Status:" followed by a blank line and the delimiter.
# We scan up to 40 lines below the header.
close_line=""
end_scan=$((header_line + 40))
for ((i=header_line+1; i<=end_scan; i++)); do
  line_content="$(sed -n "${i}p" "${file_path}" 2>/dev/null || true)"
  if [ "${line_content}" = "---" ] || [ "${line_content}" = "***" ]; then
    close_line="${i}"
    break
  fi
done

changed=0
if [ -n "${open_line}" ]; then
  cur="$(sed -n "${open_line}p" "${file_path}")"
  if [ "${cur}" = "---" ]; then
    sed -i "${open_line}s/^---$/***/" "${file_path}"
    changed=1
  fi
fi
if [ -n "${close_line}" ]; then
  cur="$(sed -n "${close_line}p" "${file_path}")"
  if [ "${cur}" = "---" ]; then
    sed -i "${close_line}s/^---$/***/" "${file_path}"
    changed=1
  fi
fi

if [ "${changed}" -eq 1 ]; then
  log "restored *** delimiters in ${file_path} (open=${open_line:-none} close=${close_line:-none})"
fi

exit 0
