#!/bin/bash
# DWS6 Claude Code Hook: Pre-Bash Safety Validator
# Triggered by PreToolUse for Bash commands
# Receives tool call JSON via stdin
#
# PURPOSE: Warn about destructive shell patterns before execution
# RULE: Does not block — outputs warning to stderr only (non-zero exit blocks)
# See: CLAUDE.md "Never Delete Files — Always Move (CRITICAL)"

TOOL_JSON=$(cat)

# Extract command from JSON (requires node, which is always available in dws6)
COMMAND=$(echo "$TOOL_JSON" | node -e "
let d='';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  try {
    const parsed = JSON.parse(d);
    console.log(parsed.command || parsed.input || '');
  } catch { console.log(''); }
}" 2>/dev/null)

# Destructive patterns from CLAUDE.md security rules
DESTRUCTIVE_PATTERNS=(
  'rm\s+-[a-z]*r[a-z]*\s+/'          # rm -rf on root paths
  'git\s+clean\s+-fd'                  # git clean (removes untracked)
  'git\s+reset\s+--hard'              # hard reset (discards changes)
  'git\s+push\s+--force\s+.*main'    # force push to main
  'git\s+push\s+-f\s+.*main'         # force push to main (short form)
  'DROP\s+TABLE'                       # SQL table drop
  'truncate\s+/'                       # truncate at root
)

for pattern in "${DESTRUCTIVE_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiE "$pattern"; then
    echo "[DWS6-HOOK] WARNING: Potentially destructive command detected." >&2
    echo "[DWS6-HOOK] Command: $COMMAND" >&2
    echo "[DWS6-HOOK] CLAUDE.md rule: Never delete files — use git mv instead." >&2
    echo "[DWS6-HOOK] If intentional, the user must explicitly confirm." >&2
    # Return 0 to warn-only, return 2 to block
    exit 0
  fi
done

exit 0
