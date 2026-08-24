#!/usr/bin/env bash
# validate-auto-mode-config.sh — Validate Claude Code auto-enable-mode configuration
# Checks .claude/settings.json for valid structure and security rules.

set -euo pipefail

SETTINGS=".claude/settings.json"
PASS=0
FAIL=0
WARN=0

pass() { PASS=$((PASS + 1)); echo "  PASS: $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  FAIL: $1"; }
warn() { WARN=$((WARN + 1)); echo "  WARN: $1"; }

echo "=== Claude Code Auto-Mode Config Validation ==="
echo ""

# 1. Check .claude/settings.json exists and is valid JSON
echo "[1/4] Settings file"
if [ ! -f "$SETTINGS" ]; then
  fail "$SETTINGS does not exist"
else
  pass "$SETTINGS exists"
  if node -e "JSON.parse(require('fs').readFileSync('$SETTINGS','utf8'))" 2>/dev/null; then
    pass "$SETTINGS is valid JSON"
  elif python3 -c "import json; json.load(open('$SETTINGS'))" 2>/dev/null; then
    pass "$SETTINGS is valid JSON (python3)"
  else
    fail "$SETTINGS is not valid JSON"
  fi
fi

# 2. Check permissions.allow and permissions.deny are arrays
echo ""
echo "[2/4] Permission structure"
if [ -f "$SETTINGS" ]; then
  ALLOW_IS_ARRAY=$(node -e "
    const s = JSON.parse(require('fs').readFileSync('$SETTINGS','utf8'));
    console.log(Array.isArray(s?.permissions?.allow) ? 'yes' : 'no');
  " 2>/dev/null || echo "error")

  DENY_IS_ARRAY=$(node -e "
    const s = JSON.parse(require('fs').readFileSync('$SETTINGS','utf8'));
    console.log(Array.isArray(s?.permissions?.deny) ? 'yes' : 'no');
  " 2>/dev/null || echo "error")

  if [ "$ALLOW_IS_ARRAY" = "yes" ]; then
    pass "permissions.allow is an array"
  else
    fail "permissions.allow is missing or not an array"
  fi

  if [ "$DENY_IS_ARRAY" = "yes" ]; then
    pass "permissions.deny is an array"
  else
    fail "permissions.deny is missing or not an array"
  fi
else
  fail "Skipped — settings file missing"
fi

# 3. Verify no .env or secret patterns in allow list
echo ""
echo "[3/4] Secret pattern safety"
if [ -f "$SETTINGS" ]; then
  DANGEROUS_ALLOWS=$(node -e "
    const s = JSON.parse(require('fs').readFileSync('$SETTINGS','utf8'));
    const allow = s?.permissions?.allow || [];
    const bad = allow.filter(p =>
      /\.env/.test(p) ||
      /\.key/.test(p) ||
      /\.pem/.test(p) ||
      /\.secret/.test(p) ||
      /credentials\.json/.test(p) ||
      /service-account/.test(p) ||
      /secrets\//.test(p)
    );
    if (bad.length > 0) { console.log(bad.join(', ')); } else { console.log('clean'); }
  " 2>/dev/null || echo "error")

  if [ "$DANGEROUS_ALLOWS" = "clean" ]; then
    pass "No .env or secret patterns in allow list"
  elif [ "$DANGEROUS_ALLOWS" = "error" ]; then
    fail "Could not parse allow list"
  else
    fail "Dangerous patterns in allow list: $DANGEROUS_ALLOWS"
  fi
else
  fail "Skipped — settings file missing"
fi

# 4. Verify hooks directory exists
echo ""
echo "[4/4] Hooks registration"
if [ -d ".claude/hooks" ]; then
  HOOK_COUNT=$(find .claude/hooks -type f 2>/dev/null | wc -l)
  if [ "$HOOK_COUNT" -gt 0 ]; then
    pass "Hooks directory exists with $HOOK_COUNT hook file(s)"
  else
    warn "Hooks directory exists but is empty"
  fi
elif [ -d ".githooks" ]; then
  pass "Git hooks directory (.githooks/) exists"
else
  warn "No hooks directory found (.claude/hooks/ or .githooks/)"
fi

# Summary
echo ""
echo "=== Summary ==="
echo "  Passed: $PASS"
echo "  Failed: $FAIL"
echo "  Warnings: $WARN"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "RESULT: FAIL — fix the issues above"
  exit 1
else
  echo "RESULT: PASS"
  exit 0
fi
