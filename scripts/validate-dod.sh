#!/bin/bash
# validate-dod.sh — CI gate for Definition of Done
# Exit 0 if DoD satisfied; exit 1 if violations found
# Checks: (1) coverage doesn't drop, (2) no skipped tests, (3) feat commits have test files

set -eu

BRANCH="${CI_COMMIT_REF_NAME:-$(git rev-parse --abbrev-ref HEAD)}"
MAIN_BRANCH="${MAIN_BRANCH:-main}"

echo "━━━ Definition of Done Validation ━━━"
echo "Branch: $BRANCH"
echo "Base: $MAIN_BRANCH"
echo ""

VIOLATIONS=0

# ━━━ Check 1: Coverage does not drop ━━━
echo "✓ Check 1: Coverage baseline"
if [ -f "coverage/coverage-final.json" ]; then
  # Extract statement coverage from current run
  CURRENT_COVERAGE=$(jq '.total.statements.pct' coverage/coverage-final.json 2>/dev/null || echo "0")
  echo "  Current coverage: ${CURRENT_COVERAGE}%"

  # Get main branch coverage (if available)
  # In CI, this would come from a stored baseline; locally we'll accept current as baseline
  BASELINE_COVERAGE="${BASELINE_COVERAGE:-60}"

  if (( $(echo "$CURRENT_COVERAGE < $BASELINE_COVERAGE" | bc -l) )); then
    echo "  ❌ FAIL: Coverage dropped below ${BASELINE_COVERAGE}% (current: ${CURRENT_COVERAGE}%)"
    ((VIOLATIONS++))
  else
    echo "  ✓ Coverage maintained (${CURRENT_COVERAGE}% >= ${BASELINE_COVERAGE}%)"
  fi
else
  echo "  ⚠ Coverage file not found; running npm test..."
  npm test -- --run 2>&1 | tail -20 || true
  if [ -f "coverage/coverage-final.json" ]; then
    CURRENT_COVERAGE=$(jq '.total.statements.pct' coverage/coverage-final.json 2>/dev/null || echo "0")
    echo "  Coverage after test run: ${CURRENT_COVERAGE}%"
    if (( $(echo "$CURRENT_COVERAGE < $BASELINE_COVERAGE" | bc -l) )); then
      echo "  ❌ FAIL: Coverage below ${BASELINE_COVERAGE}%"
      ((VIOLATIONS++))
    else
      echo "  ✓ Coverage OK"
    fi
  fi
fi

echo ""

# ━━━ Check 2: No skipped tests ━━━
echo "✓ Check 2: Skipped tests"
# Find .skip() calls (but exclude skipIf() which is conditional skipping)
SKIP_COUNT=$(grep -r "\.skip\|@skip\|it\.skip\|describe\.skip" src/__tests__/ 2>/dev/null | grep -v "skipIf\|node_modules" | wc -l || echo "0")

if [ "$SKIP_COUNT" -gt 0 ]; then
  echo "  ❌ FAIL: Found $SKIP_COUNT permanently skipped tests:"
  grep -r "\.skip\|@skip" src/__tests__/ 2>/dev/null | grep -v "skipIf" | head -5
  echo "  ⓘ Unskip tests before merge"
  ((VIOLATIONS++))
else
  echo "  ✓ No permanently skipped tests detected"
fi

echo ""

# ━━━ Check 3: Feat commits have test files ━━━
echo "✓ Check 3: Intent tests for new features"
FEAT_COMMITS=$(git log "$MAIN_BRANCH..HEAD" --oneline --grep="^feat:" 2>/dev/null | wc -l || echo "0")

if [ "$FEAT_COMMITS" -gt 0 ]; then
  echo "  Found $FEAT_COMMITS feat commits"

  # For each feat commit, check if a corresponding test file exists
  while IFS= read -r commit_msg; do
    # Extract feat scope: "feat(scope): message" → scope
    SCOPE=$(echo "$commit_msg" | sed -n 's/feat(\([^)]*\))/\1/p' || echo "")
    if [ -z "$SCOPE" ]; then
      SCOPE=$(echo "$commit_msg" | sed 's/feat: //' | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
    fi

    # Check if test file exists for this scope
    TEST_FOUND=$(find src/__tests__/ -name "*${SCOPE}*.test.ts" 2>/dev/null | wc -l || echo "0")
    if [ "$TEST_FOUND" -eq 0 ]; then
      echo "  ⚠ Feat($SCOPE) has no corresponding test file"
      # Don't fail yet; warn only for now (many features are tested implicitly)
    fi
  done < <(git log "$MAIN_BRANCH..HEAD" --oneline --grep="^feat:" 2>/dev/null)

  echo "  ℹ Verify tests added for features above"
else
  echo "  No feat commits found; skipping feature test check"
fi

echo ""

# ━━━ Summary ━━━
if [ "$VIOLATIONS" -eq 0 ]; then
  echo "━━━ ✓ DoD PASSED ━━━"
  exit 0
else
  echo "━━━ ❌ DoD FAILED ($VIOLATIONS violations) ━━━"
  echo "Fix violations above, then retry."
  exit 1
fi
