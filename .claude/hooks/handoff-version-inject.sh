#!/bin/bash
# Inject VERSION AND AGENT HISTORY into new handoff files
# Runs: pre-commit (via .claude/hooks/)
# Purpose: Catch new .claude/handoffs/*.md files and ensure they have versioning

set -e

HANDOFF_DIR="./.claude/handoffs"
TODAY=$(date +%Y-%m-%d)

# Find all staged .md files in handoffs/ that are new (status A) or modified (M)
HANDOFF_FILES=$(git diff --cached --name-only --diff-filter=AM -- "${HANDOFF_DIR}/*.md" 2>/dev/null || true)

if [ -z "$HANDOFF_FILES" ]; then
  exit 0
fi

for file in $HANDOFF_FILES; do
  # Skip template file
  if [[ "$file" == *"_template.md" ]]; then
    continue
  fi

  # Check if file has VERSION AND AGENT HISTORY section
  if ! grep -q "## Version & Agent History" "$file" 2>/dev/null; then
    echo "[handoff-version-inject] Adding VERSION AND AGENT HISTORY to $file"

    # Extract branch name from filepath for context
    BRANCH_NAME=$(basename "$file" .md)

    # Determine agent based on environment (heuristic)
    AGENT="Agent"
    if [ -n "$OPENCODE_ENV" ]; then
      AGENT="OpenCode"
    elif [ -n "$CURSOR_ENV" ]; then
      AGENT="Cursor"
    elif grep -q "claude-code" "$(pwd)/.env" 2>/dev/null; then
      AGENT="Claude Code"
    fi

    # Insert VERSION AND AGENT HISTORY section after first header+metadata block
    # This is a simple insertion — requires manual review if complex layouts
    cat > /tmp/version_block_$$.md << EOF
## Version & Agent History

| Version | Date       | Changes                    | Agent     |
| ------- | ---------- | -------------------------- | --------- |
| [Latest] 1.0 | $TODAY | Initial handoff            | $AGENT    |

***

EOF

    # Find where to insert: after the first block of metadata/headers, before the first content section
    # Conservative: insert after the first "***" or after metadata, whichever comes first
    if grep -q "^\\*\\*\\*$" "$file"; then
      # Already has a section divider; insert after it if no VERSION block
      true  # Already checked above, skip
    else
      # Insert after title and initial metadata block
      # Find the line number of the first "##" that's not "## Version"
      INSERT_LINE=$(grep -n "^## " "$file" | head -1 | cut -d: -f1)
      if [ -z "$INSERT_LINE" ]; then
        # No section headers yet, insert at end of metadata (line 4 typically)
        INSERT_LINE=4
      fi

      # Insert the version block
      sed -i "${INSERT_LINE}i\\" "$file"
      sed -i "${INSERT_LINE}r /tmp/version_block_$$.md" "$file"

      # Stage the modified file
      git add "$file"
    fi

    rm -f /tmp/version_block_$$.md
  fi
done

exit 0
