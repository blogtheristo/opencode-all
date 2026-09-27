#!/bin/bash
# Cursor branch field-note auto-generator
# Invoked from session-start.sh when a cursor branch is detected
# Creates a field-note template following Session Learning Outcome Rule (CLAUDE.md Art. 14)

set -euo pipefail

BRANCH="${1:-}"
if [ -z "$BRANCH" ]; then
  echo "Usage: cursor-branch-created.sh <branch-name>"
  exit 2
fi

# Only process cursor branches (pattern: claude/cursor-*)
if [[ ! "$BRANCH" =~ ^claude/cursor- ]]; then
  exit 0
fi

# Extract date and branch identifier for field note naming
# Branch format: claude/cursor-<description>-<id>
# Field note format: YYYY-MM-DD-<description>.md
TODAY=$(date +%Y-%m-%d)
BRANCH_DESC=$(echo "$BRANCH" | sed 's/^claude\/cursor-//;s/-[a-z0-9]*$//')
FIELD_NOTE_PATH="docs/field-notes/${TODAY}-cursor-${BRANCH_DESC}.md"

# If field note already exists, don't overwrite
if [ -f "$FIELD_NOTE_PATH" ]; then
  exit 0
fi

# Generate field-note template with Session Learning Outcome Rule checklist
cat > "$FIELD_NOTE_PATH" << 'EOF'
# <<TITLE>>

**Started:** <<DATE>>
**Branch:** <<BRANCH>>
**Status:** IN_PROGRESS — awaiting session completion

## What Changed

<!-- Describe the work done in this session: code changes, artifacts, fixes, findings, discoveries -->

## Session Learning Outcome Rule — Compliance Checklist

Per CLAUDE.md §Session Learning Outcome Rule (EU AI Act Art. 14), all substantive sessions require:

- [ ] **Step 1:** Update KB — Add entries to `kb/raw/{articles,signals,repos,images}/`
- [ ] **Step 2:** Write field note — This document (started; now complete it)
- [ ] **Step 3:** Render HTML to Learn/ — Run `scripts/render-doc.sh` on updated docs
- [ ] **Step 4:** Export to Drive — Push to repo, Drive mirrors from source-of-truth
- [ ] **Step 5:** HIC decision — Ask one real decision question (list below)
- [ ] **Step 6:** Calendar commitments — Schedule all dated obligations

## HIC Decision Needed

<!-- What decision does HIC need to make? -->
<!-- List as numbered items or checkbox questions that require explicit approval/direction -->

## Dated Commitments

<!-- If this session creates any dated obligations (3-month validity, follow-up dates, etc.), schedule them:
- [ ] Calendar entry created for: <<DATE>> — <<DESCRIPTION>>
- [ ] Deadline: <<DATE>>
-->

## KB Updates

<!-- List what was added to kb/raw/ and why -->
<!-- Example:
- Added `kb/raw/signals/PR-2038-ted-construction-leads.md` (PR scope, impact, compliance notes)
- Added `kb/raw/articles/PR-2027-product-i18n-5lang.md` (localization architecture)
-->

## Notes

<!-- Additional context, blockers, follow-ups, or cross-references -->
EOF

# Replace template placeholders with actual values
sed -i "s|<<DATE>>|$(date +%Y-%m-%d)|g" "$FIELD_NOTE_PATH"
sed -i "s|<<BRANCH>>|\`$BRANCH\`|g" "$FIELD_NOTE_PATH"
sed -i "s|<<TITLE>>|Cursor Session: $BRANCH_DESC|g" "$FIELD_NOTE_PATH"

echo "[cursor-branch-created] Created field-note template: $FIELD_NOTE_PATH"
exit 0
EOF
chmod +x /home/user/dws6/.claude/hooks/cursor-branch-created.sh
