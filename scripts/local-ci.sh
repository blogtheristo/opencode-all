#!/usr/bin/env bash
# local-ci.sh — Run every CI check locally, write a tamper-evident audit record.
#
# What this replaces on GitHub Actions:
#   - .github/workflows/test.yml                   (vitest + coverage)
#   - .github/workflows/secret-scan-gitleaks.yml   (gitleaks)
#   - .github/workflows/ruff.yml                   (python lint, if any .py changed)
#   - npm-audit portion of dependency_review.yml   (npm audit --audit-level=high)
#
# Usage:
#   bash scripts/local-ci.sh            # run all checks
#   bash scripts/local-ci.sh --quick    # skip slow checks (gitleaks full-history)
#   bash scripts/local-ci.sh --fail-fast
#
# Audit output:
#   .ci-audit/runs/<ISO>_<shortsha>.json   — local mirror (hash-chained)
#   Supabase ci_audit_log                  — legal record (if env vars set)
#
# Exit codes:
#   0  = all checks passed
#   1  = at least one check failed
#   2  = runner/config error (not a check failure)

set -uo pipefail

# ─── INCIDENT HARDENING (2026-08-25 bare-flip): controlled GIT_* hygiene ─────
# Git sets GIT_DIR/GIT_INDEX_FILE/GIT_QUARANTINE_* for hook subprocesses;
# anything inherited here redirects every git call away from the caller's
# worktree (observed: nocommit/detached identity, ENOLOCK, missing configs).
# Scrub deterministically BEFORE resolving the repo root.
for _v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
          GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG_COUNT \
          GIT_CONFIG_KEY_0 GIT_CONFIG_VALUE_0 GIT_QUARANTINE_PATH; do
  unset "$_v"
done

# Resolve to the CALLER's repository top (linked worktree when pushing from
# one), never the main checkout — otherwise the gate tests the wrong tree
# (incident 2026-08-24: PR #1888 push verified a dirty unrelated checkout).
REPO_ROOT="$(git rev-parse --path-format=absolute --show-toplevel 2>/dev/null || true)"
if [ -z "$REPO_ROOT" ]; then
  REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi
cd "$REPO_ROOT"

# ─── Run-environment diagnostics (incident forensics aid) ────────────────────
echo "local-ci env · pwd=$(pwd)"
echo "  show-toplevel=$(git rev-parse --path-format=absolute --show-toplevel 2>&1)"
echo "  git-dir=$(git rev-parse --git-dir 2>&1)"
echo "  branch=$(git rev-parse --abbrev-ref HEAD 2>&1)"
echo "  status: $(git status --short 2>/dev/null | wc -l) dirty entries"
for _v in $(compgen -e | grep '^GIT_' || true); do
  echo "  GIT leak: ${_v}=${!_v}"
done

AUDIT_DIR="$REPO_ROOT/.ci-audit/runs"
mkdir -p "$AUDIT_DIR"

QUICK_MODE=0
FAIL_FAST=0
for arg in "$@"; do
  case "$arg" in
    --quick)     QUICK_MODE=1 ;;
    --fail-fast) FAIL_FAST=1 ;;
    *) ;;
  esac
done

# ─── Platform helpers / prerequisites ──────────────────────────────────────────

has_sha256_tool() {
  command -v sha256sum >/dev/null 2>&1 || command -v shasum >/dev/null 2>&1 || command -v openssl >/dev/null 2>&1
}

sha256_stdin() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 | awk '{print $1}'
  else
    openssl dgst -sha256 | awk '{print $2}'
  fi
}

sha256_text() {
  printf '%s' "$1" | sha256_stdin
}

now_ms() {
  local ms
  ms="$(date +%s%3N 2>/dev/null || true)"
  if [[ "$ms" =~ ^[0-9]+$ ]]; then
    echo "$ms"
    return 0
  fi
  if command -v python3 >/dev/null 2>&1; then
    python3 -c 'import time; print(int(time.time()*1000))'
    return 0
  fi
  if command -v python >/dev/null 2>&1; then
    python -c 'import time; print(int(time.time()*1000))'
    return 0
  fi
  if command -v node >/dev/null 2>&1; then
    node -e "console.log(Date.now())"
    return 0
  fi
  return 1
}

if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq is required (apt-get install jq / brew install jq)" >&2
  exit 2
fi
if ! has_sha256_tool; then
  echo "❌ SHA-256 tool is required (sha256sum, shasum -a 256, or openssl)" >&2
  exit 2
fi
if ! now_ms >/dev/null 2>&1; then
  echo "❌ Unable to get millisecond timestamp (install python3 or node)" >&2
  exit 2
fi

# ─── Identity of this run ─────────────────────────────────────────────────────

TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
TS_FILE="$(date -u +%Y%m%dT%H%M%SZ)"
COMMIT_SHA="$(git rev-parse HEAD 2>/dev/null || echo 'no-commit')"
SHORT_SHA="$(git rev-parse --short=12 HEAD 2>/dev/null || echo 'nocommit')"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'detached')"
RUNNER="${CI_RUNNER_NAME:-$(whoami)@$(hostname -s 2>/dev/null || echo host)}"
RUNNER_KIND="${CI_RUNNER_KIND:-local}"
TRIGGER_KIND="${CI_TRIGGER_KIND:-pre-push}"

OUT_FILE="$AUDIT_DIR/${TS_FILE}_${SHORT_SHA}.json"

# ─── Helpers ──────────────────────────────────────────────────────────────────

checks_json="["
checks_count=0
checks_passed=0
checks_failed=0

append_check() {
  # args: name, pass(true|false), duration_ms, output_sha256, notes
  local name="$1" pass="$2" dur="$3" output_sha="$4" notes="${5:-}"
  [ $checks_count -gt 0 ] && checks_json+=","
  checks_json+="{\"name\":\"$name\",\"pass\":$pass,\"duration_ms\":$dur,\"output_sha256\":\"$output_sha\",\"notes\":\"$notes\"}"
  checks_count=$((checks_count + 1))
  if [ "$pass" = "true" ]; then
    checks_passed=$((checks_passed + 1))
  else
    checks_failed=$((checks_failed + 1))
  fi
}

run_check() {
  # args: name, command...
  local name="$1"; shift
  echo ""
  echo "━━━ $name ━━━"
  local start_ms end_ms dur_ms status output output_sha
  start_ms=$(now_ms)
  output=$("$@" 2>&1)
  status=$?
  end_ms=$(now_ms)
  dur_ms=$((end_ms - start_ms))
  output_sha=$(sha256_text "$output")
  if [ $status -eq 0 ]; then
    echo "  ✅ pass (${dur_ms}ms)"
    append_check "$name" true "$dur_ms" "$output_sha" ""
    return 0
  else
    echo "$output" | tail -30
    echo "  ❌ fail (${dur_ms}ms, exit=$status)"
    append_check "$name" false "$dur_ms" "$output_sha" "exit=$status"
    if [ $FAIL_FAST -eq 1 ]; then
      finalize_and_exit 1
    fi
    return 1
  fi
}

# ─── Finalize: build hash-chained record, write mirror, try Supabase upload ──

finalize_and_exit() {
  local exit_code="$1"
  local run_start_ms=$RUN_START_MS
  local run_end_ms
  run_end_ms=$(now_ms)
  local total_dur=$((run_end_ms - run_start_ms))
  checks_json+="]"

  # Hash-chain: prev = most recent mirror file's this_record_hash (or null)
  local prev_hash
  prev_hash=$(find "$AUDIT_DIR" -maxdepth 1 -type f -name '*.json' 2>/dev/null \
              | sort | tail -n1 | xargs -I{} sh -c 'jq -r .this_record_hash "{}" 2>/dev/null' \
              || echo "")
  [ -z "$prev_hash" ] && prev_hash="null" || prev_hash="\"$prev_hash\""

  local overall_pass
  [ $checks_failed -eq 0 ] && overall_pass=true || overall_pass=false

  # Build record without this_record_hash, then compute the hash over the canonical form
  local record_core
  record_core=$(cat <<JSON
{
  "schema":"ci-audit/v1",
  "ts":"$TS",
  "commit_sha":"$COMMIT_SHA",
  "branch":"$BRANCH",
  "repo":"blogtheristo/dws6",
  "runner":"$RUNNER",
  "runner_kind":"$RUNNER_KIND",
  "trigger_kind":"$TRIGGER_KIND",
  "overall_pass":$overall_pass,
  "checks_total":$checks_count,
  "checks_passed":$checks_passed,
  "checks_failed":$checks_failed,
  "duration_ms":$total_dur,
  "checks":$checks_json,
  "prev_record_hash":$prev_hash
}
JSON
  )

  # Canonical hash: sha256 of sorted-key JSON
  local this_hash
  this_hash=$(printf '%s' "$record_core" | jq -S -c . 2>/dev/null | sha256_stdin)
  if [ -z "$this_hash" ]; then
    echo "❌ failed to hash canonical audit record (jq/SHA tooling problem)" >&2
    exit 2
  fi

  # Assemble final record
  local final
  final=$(printf '%s' "$record_core" | jq -S --arg h "$this_hash" '. + {this_record_hash:$h}')

  echo "$final" > "$OUT_FILE"

  echo ""
  echo "━━━ Audit record ━━━"
  echo "  file: $OUT_FILE"
  echo "  commit: $SHORT_SHA branch: $BRANCH"
  echo "  checks: $checks_passed/$checks_count passed, $checks_failed failed"
  echo "  hash: ${this_hash:0:16}..."

  # Attempt Supabase upload (best-effort, never blocks the hook)
  if [ -n "${SUPABASE_URL:-}" ] && { [ -n "${SUPABASE_SERVICE_KEY:-}" ] || [ -n "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; }; then
    if [ -f "$REPO_ROOT/scripts/ci-audit-upload.ts" ] && command -v npx >/dev/null 2>&1; then
      echo "  → uploading to Supabase ci_audit_log ..."
      if npx --yes tsx "$REPO_ROOT/scripts/ci-audit-upload.ts" "$OUT_FILE" 2>&1 | sed 's/^/    /'; then
        echo "  ✅ Supabase upload ok"
      else
        echo "  ⚠️  Supabase upload failed (local mirror still written)"
      fi
    fi
  else
    echo "  (Supabase env not set — local mirror only; see docs/CI_AUDIT.md to enable)"
  fi

  echo ""
  if [ "$overall_pass" = "true" ]; then
    echo "✅ local CI passed — safe to push"
  else
    echo "❌ local CI FAILED ($checks_failed/$checks_count checks)"
    echo "   Fix the failures above, then retry. Bypass (audited): git push --no-verify"
  fi

  exit "$exit_code"
}

RUN_START_MS=$(now_ms)
trap 'finalize_and_exit 2' INT TERM

# ─── Run checks ───────────────────────────────────────────────────────────────

echo "local-ci · commit=$SHORT_SHA branch=$BRANCH runner=$RUNNER"

# Check 1: Install check (node_modules present + lockfile consistent)
run_check "npm-install-check" bash -c '
  [ -d node_modules ] || npm ci --no-audit --no-fund >/dev/null 2>&1
  [ -d node_modules ]
' || true

# Check 2: Vitest (primary test suite) — SERIALIZED (2026-08-25 incident
# control): concurrent vitest runs sharing one object database corrupted
# shared git state; only one suite may hold the validation lock at a time.
run_check "vitest" bash -c '
  LOCK_DIR="/tmp/dws6-validation.lock"
  WAITED=0
  while ! mkdir "$LOCK_DIR" 2>/dev/null; do
    sleep 1; WAITED=$((WAITED+1))
    [ $WAITED -ge 900 ] && { echo "validation lock timeout"; exit 1; }
  done
  trap "rmdir \"$LOCK_DIR\" 2>/dev/null" EXIT
  npx vitest run --reporter=default
' || true

# Check 3: Gitleaks (secret scan)
if [ $QUICK_MODE -eq 1 ]; then
  # Quick mode: staged diff only
  run_check "gitleaks-staged" bash -c '
    if command -v gitleaks >/dev/null; then
      gitleaks protect --staged --config .gitleaks.toml --no-banner
    else
      echo "gitleaks not installed — install: see .github/workflows/secret-scan-gitleaks.yml"
      exit 2
    fi
  ' || true
else
  run_check "gitleaks-full" bash -c '
    if command -v gitleaks >/dev/null; then
      gitleaks detect --source . --config .gitleaks.toml --no-banner --redact
    else
      echo "gitleaks not installed — install from https://github.com/gitleaks/gitleaks/releases"
      exit 2
    fi
  ' || true
fi

# Check 4: npm audit (root package, high+ only)
run_check "npm-audit-root" bash -c '
  npm audit --audit-level=high --omit=dev
' || true

# Check 5: Ruff (only if Python files changed or exist)
if git ls-files '*.py' 2>/dev/null | head -1 | grep -q .; then
  run_check "ruff-check" bash -c '
    if command -v ruff >/dev/null; then
      ruff check . --output-format=github
    else
      echo "ruff not installed (pip install ruff) — skipping"
      exit 0
    fi
  ' || true
  run_check "ruff-format-check" bash -c '
    if command -v ruff >/dev/null; then
      ruff format . --check
    else
      echo "ruff not installed (pip install ruff) — skipping"
      exit 0
    fi
  ' || true
fi

finalize_and_exit $([ $checks_failed -eq 0 ] && echo 0 || echo 1)
