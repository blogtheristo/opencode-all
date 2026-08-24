#!/bin/bash
# Stop hook — runs before Claude Code ends a session
# Enforces governance checklist before session completion

set -euo pipefail

ERRORS=0
WARNINGS=""

# Check 1: Uncommitted changes
DIRTY=$(git status --porcelain 2>/dev/null)
if [ -n "$DIRTY" ]; then
  WARNINGS="${WARNINGS}\n- UNCOMMITTED CHANGES: $(echo "$DIRTY" | wc -l | tr -d ' ') files not committed"
  ERRORS=$((ERRORS + 1))
fi

# Check 2: Dual folder sync (if Store/landing-pages were modified)
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD 2>/dev/null || echo "")

# Check dws10.com <-> landing-pages sync
if echo "$CHANGED_FILES" | grep -q "^dws10.com/"; then
  if ! echo "$CHANGED_FILES" | grep -q "^landing-pages/dws10-com/"; then
    WARNINGS="${WARNINGS}\n- DUAL FOLDER DESYNC: dws10.com/ was modified but landing-pages/dws10-com/ was not updated"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check dws6.com <-> landing-pages sync
if echo "$CHANGED_FILES" | grep -q "^dws6.com/"; then
  if ! echo "$CHANGED_FILES" | grep -q "^landing-pages/dws6-com/"; then
    # Only warn if it's a landing page file, not dashboard code
    if echo "$CHANGED_FILES" | grep -q "^dws6.com/index\|^dws6.com/buy\|^dws6.com/config"; then
      WARNINGS="${WARNINGS}\n- DUAL FOLDER DESYNC: dws6.com/ landing page modified but landing-pages/dws6-com/ not updated"
      ERRORS=$((ERRORS + 1))
    fi
  fi
fi

# Check onelifetime.world <-> landing-pages sync
if echo "$CHANGED_FILES" | grep -q "^onelifetime\.world/"; then
  if ! echo "$CHANGED_FILES" | grep -q "^landing-pages/onelifetime-world/"; then
    WARNINGS="${WARNINGS}\n- DUAL FOLDER DESYNC: onelifetime.world/ was modified but landing-pages/onelifetime-world/ was not updated"
    ERRORS=$((ERRORS + 1))
  fi
fi
# Check 3: Thesis file consistency (if any thesis file was modified)
if echo "$CHANGED_FILES" | grep -q "V3Thesis_EN\|V3Thesis_FI\|PHD_FIREHORSE_EN\|PHD_FIREHORSE_FI"; then
  # Count how many thesis files were changed
  THESIS_COUNT=$(echo "$CHANGED_FILES" | grep -c "V3Thesis_EN\|V3Thesis_FI\|PHD_FIREHORSE_EN\|PHD_FIREHORSE_FI" || true)
  if [ "$THESIS_COUNT" -lt 4 ]; then
    WARNINGS="${WARNINGS}\n- THESIS RULE VIOLATION: Only $THESIS_COUNT/4 thesis files were modified. All 4 must be updated together."
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check 4: .md files in public site folders
PUBLIC_MD=$(echo "$CHANGED_FILES" | grep -E "^(landing-pages/|dws10\.com/|dws6\.com/|onelifetime\.world/).*\.md$" || true)
if [ -n "$PUBLIC_MD" ]; then
  WARNINGS="${WARNINGS}\n- MD IN PUBLIC FOLDER: .md files found in public site folders: $PUBLIC_MD"
  ERRORS=$((ERRORS + 1))
fi

# Check 5: Standards update reminder (if src/ was modified)
if echo "$CHANGED_FILES" | grep -q "^src/"; then
  STANDARDS_MODIFIED=$(echo "$CHANGED_FILES" | grep -c "STANDARD\|COMPLIANCE\|BRAND" || true)
  if [ "$STANDARDS_MODIFIED" -eq 0 ]; then
    WARNINGS="${WARNINGS}\n- STANDARDS REMINDER: Source code was modified but no standards files were updated. Check if DWS standards need updating."
  fi
fi

# Output results
if [ $ERRORS -gt 0 ]; then
  echo "SESSION EXIT CHECKLIST — $ERRORS issue(s) found:"
  echo -e "$WARNINGS"
  echo ""
  echo "Resolve these before ending the session, or acknowledge them explicitly."
  # Exit 2 to block session end and show warnings to Claude
  exit 2
fi

echo "Session exit checklist: all clear."
exit 0
