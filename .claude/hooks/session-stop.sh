#!/bin/bash
# Stop hook — runs before Claude Code ends a session
# Enforces governance checklist before session completion

# Fail-open by design: this hook must NEVER trap a session because of its own
# error. It keeps -u/pipefail to surface bugs early, but deliberately drops -e
# so a single failing command (e.g. git in a non-repo, a transient error) does
# not abort mid-run. We default to ALLOWING the stop and only ever exit 2 on a
# positive, certain block decision (Check 6).
set -uo pipefail

# Run from the repo root so every git/ls path resolves regardless of Claude's
# working directory. A wrong cwd previously risked a false "no field note"
# block (the ls would find nothing). If this is not a git repo or git is
# unavailable, we cannot assess anything — allow the stop and leave.
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [ -z "${REPO_ROOT:-}" ] || ! cd "$REPO_ROOT" 2>/dev/null; then
  echo "Session exit checklist: not a git repo (or git unavailable) — skipping."
  exit 0
fi

ERRORS=0
WARNINGS=""

# Read the Stop-hook JSON payload (Claude Code passes it on stdin). We only
# need stop_hook_active — the CIRCUIT BREAKER that guarantees we never block
# twice in a row (the infinite-loop the old advisory-only design avoided; now
# handled explicitly so a hard block at Stop is safe).
STOP_HOOK_ACTIVE="false"
if [ ! -t 0 ]; then
  HOOK_INPUT=$(cat 2>/dev/null || true)
  if printf '%s' "$HOOK_INPUT" | grep -qE '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
    STOP_HOOK_ACTIVE="true"
  fi
fi

# Check 1: Uncommitted changes
DIRTY=$(git status --porcelain 2>/dev/null)
if [ -n "$DIRTY" ]; then
  WARNINGS="${WARNINGS}\n- UNCOMMITTED CHANGES: $(echo "$DIRTY" | wc -l | tr -d ' ') files not committed"
  ERRORS=$((ERRORS + 1))
fi

# Check 2: Dual folder sync (if Store/landing-pages were modified)
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD 2>/dev/null || git diff --name-only HEAD 2>/dev/null || echo "")

# Union of last-commit + uncommitted working-tree paths — the session's real
# footprint, used only by the learning-outcome check (Check 6). Kept separate
# so the existing advisory checks (2-5) behave exactly as before.
SESSION_FILES=$( { git diff --name-only HEAD~1 HEAD 2>/dev/null || true; git status --porcelain 2>/dev/null | sed 's/^...//' || true; } | sort -u || true)

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
PUBLIC_MD=$(echo "$CHANGED_FILES" | grep -E "^(landing-pages/|dws6\.com/|dws10\.com/|onelifetime\.world/).*\.md$" || true)
if [ -n "$PUBLIC_MD" ]; then
  WARNINGS="${WARNINGS}\n- MD IN PUBLIC FOLDER: .md files found in public site folders: $PUBLIC_MD"
  ERRORS=$((ERRORS + 1))
fi

# Check 5: Standards update reminder (if src/ was modified)
if echo "$CHANGED_FILES" | grep -q "^src/"; then
  STANDARDS_MODIFIED=$(echo "$CHANGED_FILES" | grep -c "STANDARD\|COMPLIANCE\|BRAND" || true)
  if [ "$STANDARDS_MODIFIED" -eq 0 ]; then
    WARNINGS="${WARNINGS}\n- STANDARDS REMINDER: Source code was modified but no standards files were updated. Check if DWS standards need updating."
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check 6: HIC Learning Outcome (DWS_LEARNING_STANDARD.md — EU AI Act Art. 14)
# BLOCKING, but block-once and heavily escape-hatched. Fires only on a clearly
# SUBSTANTIVE session that produced no learning capture and did not opt out.
# Every "bad classifier" case has a handler so a trivial session is NEVER
# trapped:
#   H0  stop_hook_active=true  -> circuit breaker, never block twice (no loop)
#   H1  DWS_SKIP_LEARNING_OUTCOME set -> explicit human opt-out
#   H2  [skip-learning]/[trivial]/[no-learn] in the last commit message
#   H3  a field note OR Learn/ HTML dated today exists (incl. an 'N/A — reason'
#       note, the standard's own exemption)
#   H4  conservative classifier — only code / a *STANDARD*.md / a new agent /
#       a whitepaper counts; dep/lock/config/env-only diffs are treated trivial
# TODAY is overridable via DWS_LEARNING_TODAY purely as a test seam.
LEARNING_BLOCK=0
LEARNING_MSG=""
TODAY="${DWS_LEARNING_TODAY:-$(date +%F)}"

if [ "$STOP_HOOK_ACTIVE" != "true" ] \
   && [ -z "${DWS_SKIP_LEARNING_OUTCOME:-}" ] \
   && ! git log -1 --pretty=%B 2>/dev/null | grep -qiE '\[(skip-learning|trivial|no-learn)\]'; then

  # H4 — conservative "substantive" classifier.
  SUBSTANTIVE=$(echo "$SESSION_FILES" | grep -iE '(^|/)src/|\.(ts|tsx|js|mjs|cjs|py|sh)$|STANDARD.*\.md$|(^|/)CLAUDE\.md$|(^|/)AGENTS\.md$|whitepaper|(^|/)src/agents/' || true)
  # Strip dependency/lock/config-only noise so a pure dep bump is not "substantive".
  NON_TRIVIAL=$(echo "$SUBSTANTIVE" | grep -vE 'package(-lock)?\.json$|\.lock$|requirements.*\.txt$|\.env|(^|/)\.gitignore$' || true)

  if [ -n "$NON_TRIVIAL" ]; then
    # H3 — did the session capture a learning outcome TODAY?
    HAS_FIELD_NOTE=$(ls docs/field-notes/${TODAY}-*.md 2>/dev/null | head -1 || true)
    HAS_LEARN_HTML=$(ls Learn/${TODAY}-*.html 2>/dev/null | head -1 || true)
    if [ -z "$HAS_FIELD_NOTE" ] && [ -z "$HAS_LEARN_HTML" ]; then
      LEARNING_BLOCK=1
      LEARNING_MSG="HIC LEARNING OUTCOME MISSING — blocking session exit (DWS_LEARNING_STANDARD.md; EU AI Act Art. 14 human oversight).

This session made substantive changes but left no field note or Learn/ HTML dated ${TODAY}, so the HIC has no human-readable capture of what changed. Produce the minimum, then stop again:
  1. docs/field-notes/${TODAY}-<topic>.md   — what happened / the insight / next steps
  2. Learn/${TODAY}-<topic>.html            — render it (scripts/render-doc.sh)
  3. update the KB (/kb), export a copy to Drive, and ask the HIC one decision-shaped question.

FALSE POSITIVE? If this session is genuinely trivial, clear it with ANY ONE (all are honored):
  - add a line 'N/A — <reason>' inside a docs/field-notes/${TODAY}-*.md note (the standard's own exemption), or
  - re-run with DWS_SKIP_LEARNING_OUTCOME=1 set, or
  - add [skip-learning] to the last commit message.

Substantive files that triggered this:
$(echo "$NON_TRIVIAL" | sed 's/^/  - /')"
    fi
  fi
fi

# Output results — hard block (Check 6) takes precedence but is loop-safe.
if [ "$LEARNING_BLOCK" -eq 1 ]; then
  {
    echo "$LEARNING_MSG"
    if [ $ERRORS -gt 0 ]; then
      echo ""
      echo "Also flagged (advisory, not blocking):"
      echo -e "$WARNINGS"
    fi
  } >&2
  # Exit 2 blocks the stop and feeds this message back to Claude. The
  # stop_hook_active circuit breaker (H0) guarantees the next stop is not
  # re-blocked, so there is no infinite loop even if the artifacts are not made.
  exit 2
fi

# Advisory checklist — never blocks (Checks 1-5).
if [ $ERRORS -gt 0 ]; then
  echo "SESSION EXIT CHECKLIST — $ERRORS issue(s) found:"
  echo -e "$WARNINGS"
  echo ""
  echo "Review these items in your next session."
  exit 0
fi

echo "Session exit checklist: all clear."
exit 0
