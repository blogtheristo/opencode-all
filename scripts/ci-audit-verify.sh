#!/usr/bin/env bash
# ci-audit-verify.sh — Verify the CI audit log chain and HEAD coverage.
#
# What it checks:
#   1. Every .ci-audit/runs/*.json file is valid JSON with schema ci-audit/v1
#   2. Each record's this_record_hash matches SHA-256 of the canonical body
#   3. prev_record_hash of record N = this_record_hash of record N-1 (sorted by ts)
#   4. HEAD commit has at least one audit record (coverage)
#   5. The most recent record for HEAD has overall_pass = true (gate)
#
# Exit codes:
#   0  = chain intact AND HEAD covered AND overall_pass
#   1  = verification failed (tampering, gap, or failed check)
#   2  = infrastructure error (jq missing, no runs dir)
#
# Usage:
#   bash scripts/ci-audit-verify.sh                      # verify against HEAD
#   bash scripts/ci-audit-verify.sh --commit <sha>       # verify against specific commit
#   bash scripts/ci-audit-verify.sh --chain-only         # skip HEAD coverage check
#   bash scripts/ci-audit-verify.sh --allow-failure      # baseline-rollout mode:
#                                                          warn (do not fail) on
#                                                          chain break, missing
#                                                          HEAD record, or
#                                                          overall_pass=false
#
# Used by:
#   - .github/workflows/ci-audit-verify.yml (3-second gate on every PR/push)
#   - Developers verifying integrity locally

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

AUDIT_DIR="$REPO_ROOT/.ci-audit/runs"

TARGET_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo '')"
CHAIN_ONLY=0
ALLOW_FAILURE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --commit)        TARGET_COMMIT="$2"; shift 2 ;;
    --chain-only)    CHAIN_ONLY=1; shift ;;
    --allow-failure) ALLOW_FAILURE=1; shift ;;
    *) shift ;;
  esac
done

if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq is required (apt-get install jq / brew install jq)" >&2
  exit 2
fi

sha256_stdin() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 | awk '{print $1}'
  elif command -v openssl >/dev/null 2>&1; then
    openssl dgst -sha256 | awk '{print $2}'
  else
    return 1
  fi
}

if ! printf '' | sha256_stdin >/dev/null 2>&1; then
  echo "❌ SHA-256 tool is required (sha256sum, shasum -a 256, or openssl)" >&2
  exit 2
fi

if [ ! -d "$AUDIT_DIR" ]; then
  echo "❌ no audit runs dir at $AUDIT_DIR" >&2
  echo "   run bash scripts/local-ci.sh first" >&2
  exit 2
fi

mapfile -t FILES < <(find "$AUDIT_DIR" -maxdepth 1 -type f -name '*.json' | sort)

if [ ${#FILES[@]} -eq 0 ]; then
  echo "❌ no audit records found in $AUDIT_DIR" >&2
  exit 1
fi

echo "verifying ${#FILES[@]} audit record(s) ..."

# ─── Step 1+2+3: Schema, hash integrity, chain linkage ────────────────────────

prev_hash=""
errors=0
for f in "${FILES[@]}"; do
  if ! jq -e . "$f" >/dev/null 2>&1; then
    echo "❌ $(basename "$f"): not valid JSON" >&2
    errors=$((errors + 1))
    continue
  fi

  schema=$(jq -r '.schema // empty' "$f")
  if [ "$schema" != "ci-audit/v1" ]; then
    echo "❌ $(basename "$f"): unknown schema '$schema'" >&2
    errors=$((errors + 1))
    continue
  fi

  # Recompute canonical hash (everything except this_record_hash)
  expected=$(jq -S 'del(.this_record_hash)' "$f" | jq -S -c . | sha256_stdin)
  actual=$(jq -r '.this_record_hash' "$f")

  if [ "$expected" != "$actual" ]; then
    echo "❌ $(basename "$f"): this_record_hash tampered (expected ${expected:0:16}..., got ${actual:0:16}...)" >&2
    errors=$((errors + 1))
    continue
  fi

  # Chain link: this record's prev_record_hash should equal previous file's this_record_hash
  linked=$(jq -r '.prev_record_hash // "null"' "$f")
  if [ -z "$prev_hash" ]; then
    # First record — prev may be null or any value (we allow both for backfill)
    :
  else
    if [ "$linked" != "$prev_hash" ]; then
      echo "❌ $(basename "$f"): chain broken (prev_record_hash=${linked:0:16}... expected ${prev_hash:0:16}...)" >&2
      errors=$((errors + 1))
    fi
  fi

  prev_hash="$actual"
done

if [ $errors -gt 0 ]; then
  echo ""
  if [ $ALLOW_FAILURE -eq 1 ]; then
    echo "⚠️  chain verification failed ($errors issue(s)), but --allow-failure set"
    echo "   (baseline rollout — re-run without --allow-failure for the strict check)"
  else
    echo "❌ chain verification FAILED ($errors issue(s))"
    exit 1
  fi
else
  echo "✅ chain intact across ${#FILES[@]} record(s)"
fi

if [ $CHAIN_ONLY -eq 1 ]; then
  exit 0
fi

# ─── Step 4+5: HEAD coverage + overall_pass gate ──────────────────────────────

if [ -z "$TARGET_COMMIT" ]; then
  echo "⚠️  no target commit — skipping coverage check"
  exit 0
fi

# Find records matching target commit
matching=()
for f in "${FILES[@]}"; do
  sha=$(jq -r '.commit_sha' "$f")
  if [ "$sha" = "$TARGET_COMMIT" ]; then
    matching+=("$f")
  fi
done

if [ ${#matching[@]} -eq 0 ]; then
  if [ $ALLOW_FAILURE -eq 1 ]; then
    echo "⚠️  no audit record for commit $(echo "$TARGET_COMMIT" | cut -c1-12), but --allow-failure set"
    echo "   chain integrity is intact; strict HEAD coverage can be re-enabled after baseline rollout."
    exit 0
  fi
  echo "❌ no audit record for commit $(echo "$TARGET_COMMIT" | cut -c1-12)"
  echo "   run bash scripts/local-ci.sh and commit the resulting .ci-audit/runs/ file"
  exit 1
fi

# Latest record for this commit = last in sorted order (filenames are ISO timestamps)
latest="${matching[${#matching[@]} - 1]}"
pass=$(jq -r '.overall_pass' "$latest")

echo "✅ HEAD $(echo "$TARGET_COMMIT" | cut -c1-12) has ${#matching[@]} record(s) — latest: $(basename "$latest")"

if [ "$pass" = "true" ]; then
  echo "✅ overall_pass=true"
  exit 0
fi

if [ $ALLOW_FAILURE -eq 1 ]; then
  echo "⚠️  overall_pass=false but --allow-failure set"
  exit 0
fi

echo "❌ overall_pass=false for HEAD — the latest local-ci run failed"
jq -r '.checks[] | select(.pass == false) | "   ✗ \(.name) (\(.notes))"' "$latest"
exit 1
