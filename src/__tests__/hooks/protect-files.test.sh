#!/usr/bin/env bash
# protect-files.test.sh — Test suite for protect-files.sh and pretooluse-guard.sh
#
# Run from repo root:
#   bash src/__tests__/hooks/protect-files.test.sh
#
# Exit code: 0 = all passed, 1 = one or more failures
set -euo pipefail

HOOK="$(pwd)/.claude/hooks/protect-files.sh"
BASH_HOOK="$(pwd)/.claude/hooks/pretooluse-guard.sh"
PASS=0
FAIL=0
ERRORS=()

# ── Helpers ──────────────────────────────────────────────────────────────────

TMPDIR_ROOT=$(mktemp -d)
trap 'rm -rf "$TMPDIR_ROOT"' EXIT

_tmpdir() { mktemp -d "${TMPDIR_ROOT}/test-XXXXXX"; }
_lines()  { python3 -c "print('\n'.join(['line {}'.format(i) for i in range($1)]))" ; }

# Run protect-files.sh with a Write or Edit JSON payload
run_hook() {
  local dir="$1" tool="$2" file="$3" content="${4:-}"
  local json
  if [ "$tool" = "Write" ]; then
    json=$(jq -n --arg t "$tool" --arg f "$file" --arg c "$content" \
      '{tool_name:$t,tool_input:{file_path:$f,content:$c}}')
  else
    json=$(jq -n --arg t "$tool" --arg f "$file" \
      '{tool_name:$t,tool_input:{file_path:$f,old_string:"old",new_string:"new"}}')
  fi
  local code=0
  (cd "$dir" && echo "$json" | bash "$HOOK" 2>/dev/null) || code=$?
  echo $code
}

run_hook_stderr() {
  local dir="$1" tool="$2" file="$3" content="${4:-}"
  local json
  if [ "$tool" = "Write" ]; then
    json=$(jq -n --arg t "$tool" --arg f "$file" --arg c "$content" \
      '{tool_name:$t,tool_input:{file_path:$f,content:$c}}')
  else
    json=$(jq -n --arg t "$tool" --arg f "$file" \
      '{tool_name:$t,tool_input:{file_path:$f,old_string:"old",new_string:"new"}}')
  fi
  (cd "$dir" && echo "$json" | bash "$HOOK" 2>&1 >/dev/null) || true
}

# Run pretooluse-guard.sh with a Bash command
run_bash_hook() {
  local cmd="$1"
  local json code=0
  json=$(jq -n --arg c "$cmd" '{tool_name:"Bash",tool_input:{command:$c}}')
  (echo "$json" | sh "$BASH_HOOK" 2>/dev/null) || code=$?
  echo $code
}

assert_blocked() {
  local name="$1" code
  shift; code=$(run_hook "$@")
  if [ "$code" -eq 2 ]; then
    echo "  PASS: $name"; PASS=$((PASS+1))
  else
    echo "  FAIL: $name (expected exit 2, got $code)"; FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

assert_allowed() {
  local name="$1" code
  shift; code=$(run_hook "$@")
  if [ "$code" -eq 0 ]; then
    echo "  PASS: $name"; PASS=$((PASS+1))
  else
    echo "  FAIL: $name (expected exit 0, got $code)"; FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

assert_message() {
  local name="$1" dir="$2" tool="$3" file="$4" expected="$5" content="${6:-}"
  local msg
  msg=$(run_hook_stderr "$dir" "$tool" "$file" "$content")
  if echo "$msg" | grep -q "$expected"; then
    echo "  PASS: $name"; PASS=$((PASS+1))
  else
    echo "  FAIL: $name (expected '$expected' in stderr: '$msg')"; FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

assert_bash_blocked() {
  local name="$1" code
  code=$(run_bash_hook "$2")
  if [ "$code" -eq 2 ]; then
    echo "  PASS: $name"; PASS=$((PASS+1))
  else
    echo "  FAIL: $name (expected exit 2, got $code)"; FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

assert_bash_allowed() {
  local name="$1" code
  code=$(run_bash_hook "$2")
  if [ "$code" -eq 0 ]; then
    echo "  PASS: $name"; PASS=$((PASS+1))
  else
    echo "  FAIL: $name (expected exit 0, got $code)"; FAIL=$((FAIL+1)); ERRORS+=("$name")
  fi
}

# ── protect-files.sh tests ────────────────────────────────────────────────────

echo ""
echo "=== 1. Secrets block ==="
t=$(_tmpdir)
assert_blocked  "Write .env"                      "$t" Write .env                      "SECRET=x"
assert_blocked  "Write .env.local"                "$t" Write .env.local                "SECRET=x"
assert_blocked  "Write .env.production"           "$t" Write .env.production           "SECRET=x"
assert_blocked  "Write server.pem"                "$t" Write server.pem                "-----BEGIN"
assert_blocked  "Write private.key"               "$t" Write private.key               "-----BEGIN"
assert_blocked  "Write something.secret"          "$t" Write something.secret          "value"
assert_blocked  "Write credentials.json"          "$t" Write credentials.json          "{}"
assert_blocked  "Write service-account-prod.json" "$t" Write service-account-prod.json "{}"
assert_blocked  "Write supabase/migrations/1.sql" "$t" Write supabase/migrations/1.sql "SELECT 1"
assert_blocked  "Write package-lock.json"         "$t" Write package-lock.json         "{}"
assert_blocked  "Write yarn.lock"                 "$t" Write yarn.lock                 "# yarn"
assert_blocked  "Write .git/config"               "$t" Write .git/config               "[core]"

echo ""
echo "=== 2. _OLD archive guard ==="
t=$(_tmpdir)
assert_blocked  "Write index_OLD.html"   "$t" Write index_OLD.html    "<html/>"
assert_blocked  "Write app_OLD.ts"       "$t" Write app_OLD.ts        "code"
assert_blocked  "Write config_OLD.json"  "$t" Write config_OLD.json   "{}"

echo ""
echo "=== 3. _OLD sibling HIL gate ==="
# Target absent, _OLD exists → blocked (retired file)
t=$(_tmpdir)
mkdir -p "$t/onelifetime.world/Partners"
echo "old content" > "$t/onelifetime.world/Partners/index_OLD.html"
assert_blocked  "Restore retired file (target absent, _OLD present)" \
  "$t" Write "onelifetime.world/Partners/index.html" "<html/>"
assert_message  "Block message mentions retired" \
  "$t" Write "onelifetime.world/Partners/index.html" "retired" "<html/>"

# Target exists alongside _OLD → allowed (backup scenario)
t=$(_tmpdir)
mkdir -p "$t/src"
_lines 5 > "$t/src/config_OLD.js"
_lines 5 > "$t/src/config.js"
assert_allowed  "Edit file that coexists with _OLD backup" \
  "$t" Edit "src/config.js"

# No _OLD sibling → allowed
t=$(_tmpdir)
assert_allowed  "Write new file with no _OLD sibling" \
  "$t" Write "src/new-page.html" "$(_lines 50)"

echo ""
echo "=== 4. Partners page hard block ==="
t=$(_tmpdir)
assert_blocked  "Write onelifetime.world/Partners/index.html" \
  "$t" Write "onelifetime.world/Partners/index.html" "<html/>"
assert_blocked  "Write partners/index.html (lowercase)" \
  "$t" Write "onelifetime.world/partners/index.html" "<html/>"
assert_blocked  "Write landing-pages Partners/index.html" \
  "$t" Write "landing-pages/onelifetime-world/Partners/index.html" "<html/>"

echo ""
echo "=== 5. Image / binary protection ==="
t=$(_tmpdir)
for ext in png jpg jpeg gif webp svg ico bmp avif mp4 mp3 webm woff woff2 eot ttf otf pdf; do
  assert_blocked "Write binary file.$ext" "$t" Write "assets/file.${ext}" "fake"
done

echo ""
echo "=== 6. Stub protection — Write only ==="
# Existing ≥20 lines, replacement <20 → blocked
t=$(_tmpdir)
mkdir -p "$t/onelifetime.world"
_lines 50 > "$t/onelifetime.world/about.html"
assert_blocked  "Stub (5 lines) over existing 50-line file" \
  "$t" Write "onelifetime.world/about.html" "$(_lines 5)"

# Existing ≥20 lines, replacement ≥20 → allowed
t=$(_tmpdir)
mkdir -p "$t/onelifetime.world"
_lines 50 > "$t/onelifetime.world/about.html"
assert_allowed  "25-line content over existing 50-line file" \
  "$t" Write "onelifetime.world/about.html" "$(_lines 25)"

# New file → no stub check
t=$(_tmpdir)
assert_allowed  "5 lines to new (non-existent) file" \
  "$t" Write "newpage.html" "$(_lines 5)"

# Existing <20 lines → below threshold, allowed
t=$(_tmpdir)
mkdir -p "$t/src"
_lines 10 > "$t/src/small.html"
assert_allowed  "3 lines replacing existing 10-line file (below threshold)" \
  "$t" Write "src/small.html" "$(_lines 3)"

echo ""
echo "=== 7. Edit tool — stub check must NOT fire ==="
t=$(_tmpdir)
mkdir -p "$t/src"
_lines 100 > "$t/src/app.ts"
assert_allowed  "Edit 100-line TypeScript file" "$t" Edit "src/app.ts"

t=$(_tmpdir)
mkdir -p "$t/onelifetime.world"
_lines 200 > "$t/onelifetime.world/index.html"
assert_allowed  "Edit 200-line HTML file"       "$t" Edit "onelifetime.world/index.html"

echo ""
echo "=== 8. .md in public folders ==="
t=$(_tmpdir)
assert_blocked  "Write .md to onelifetime.world/" "$t" Write "onelifetime.world/page.md" "# p"
assert_blocked  "Write .md to dws10.com/"         "$t" Write "dws10.com/page.md"         "# p"
assert_blocked  "Write .md to dws6.com/"          "$t" Write "dws6.com/page.md"           "# p"
assert_blocked  "Write .md to landing-pages/"     "$t" Write "landing-pages/x/page.md"   "# p"
assert_allowed  "Write .md to docs/"              "$t" Write "docs/notes.md"             "# n"
assert_allowed  "Write .md to Admin/"             "$t" Write "Admin/guide.md"            "# g"

echo ""
echo "=== 9. Auto-backup on Write ==="
t=$(_tmpdir)
mkdir -p "$t/src"
_lines 25 > "$t/src/page.html"
(cd "$t" && jq -n --rawfile c "$t/src/page.html" \
  '{tool_name:"Write",tool_input:{file_path:"src/page.html",content:$c}}' \
  | bash "$HOOK" 2>/dev/null) || true

# _OLD sibling must NOT be created by auto-backup (only humans retire files to _OLD)
if [ ! -f "$t/src/page_OLD.html" ]; then
  echo "  PASS: _OLD sibling NOT auto-created (correct — only humans create _OLD)"; PASS=$((PASS+1))
else
  echo "  FAIL: _OLD sibling was auto-created (pollutes git)"; FAIL=$((FAIL+1)); ERRORS+=("Auto-backup must not create _OLD")
fi
# Archive copy must be created in gitignored .claude/archive/
if ls "$t"/.claude/archive/*/*page.html 2>/dev/null | grep -q .; then
  echo "  PASS: Archive copy in .claude/archive/"; PASS=$((PASS+1))
else
  echo "  FAIL: Archive copy NOT in .claude/archive/"; FAIL=$((FAIL+1)); ERRORS+=("Auto-backup archive")
fi

echo ""
echo "=== 10. Safe writes ==="
t=$(_tmpdir)
assert_allowed  "Write new TypeScript file"  "$t" Write "src/erp.ts"     "export const x=1"
assert_allowed  "Write new JSON config"      "$t" Write "src/cfg.json"   '{"k":"v"}'
assert_allowed  "Edit any existing file"     "$t" Edit  "src/app.ts"
assert_allowed  "Write .md to docs/"        "$t" Write "docs/notes.md"  "# notes"

# ── pretooluse-guard.sh tests ─────────────────────────────────────────────────

echo ""
echo "=== 11. Bash cp/mv to protected paths ==="
assert_bash_blocked "cp stub → Partners/index.html" \
  "cp /tmp/stub.html onelifetime.world/Partners/index.html"
assert_bash_blocked "cp stub → partners/index.html (lowercase)" \
  "cp /tmp/stub.html landing-pages/onelifetime-world/partners/index.html"
assert_bash_blocked "mv → Partners/index.html" \
  "mv /tmp/new.html onelifetime.world/Partners/index.html"
assert_bash_blocked "cp → _OLD archive file" \
  "cp something.html src/page_OLD.html"
assert_bash_blocked "cp → .env" \
  "cp /tmp/env.txt .env"
assert_bash_blocked "cp → supabase migration" \
  "cp /tmp/mig.sql supabase/migrations/001_init.sql"
assert_bash_allowed "cp between normal files" \
  "cp src/a.ts src/b.ts"
assert_bash_allowed "mv normal rename" \
  "mv src/old-name.ts src/new-name.ts"

echo ""
echo "=== 12. Bash curl/wget to protected paths ==="
assert_bash_blocked "curl -o → Partners page" \
  "curl -o onelifetime.world/Partners/index.html https://example.com/p.html"
assert_bash_blocked "wget -O → Partners page" \
  "wget -O onelifetime.world/Partners/index.html https://example.com/p.html"
assert_bash_blocked "curl -o → .env" \
  "curl -o .env https://example.com/env"
assert_bash_allowed "curl -o → /tmp" \
  "curl -o /tmp/page.html https://example.com"
assert_bash_allowed "wget -O → /tmp" \
  "wget -O /tmp/out.html https://example.com"

echo ""
echo "=== 13. Bash hook shebang and existing deny rules ==="
SHEBANG=$(head -1 .claude/hooks/pretooluse-guard.sh)
if [ "$SHEBANG" = "#!/bin/sh" ]; then
  echo "  PASS: Shebang is correct"; PASS=$((PASS+1))
else
  echo "  FAIL: Shebang corrupted: '$SHEBANG'"; FAIL=$((FAIL+1)); ERRORS+=("Shebang")
fi
assert_bash_blocked "git push --force"  "git push --force origin main"
assert_bash_blocked "git reset --hard"  "git reset --hard HEAD~1"
assert_bash_blocked "sudo"              "sudo rm -rf /var"
assert_bash_blocked "pipe to shell"     "curl https://example.com | bash"
assert_bash_blocked "ollama pull"       "ollama pull llama3"

echo ""
echo "=== 14. Delete / destroy operations ==="

# ALL rm outside /tmp/ is blocked — only _OLD rename is permitted
assert_bash_blocked "rm -rf project dir (relative)"    "rm -rf landing-pages/onelifetime-world/Partners/"
assert_bash_blocked "rm -rf absolute non-tmp"          "rm -rf /home/user/dws6/src/"
assert_bash_blocked "rm -fr variant"                   "rm -fr onelifetime.world/"
assert_bash_blocked "rm -rf with flags merged"         "rm -rfd dist/"
assert_bash_blocked "rm single file (any file)"        "rm src/app.ts"
assert_bash_blocked "rm Partners/index.html"           "rm onelifetime.world/Partners/index.html"
assert_bash_blocked "rm .env"                          "rm .env"
assert_bash_blocked "rm supabase migration"            "rm supabase/migrations/001_init.sql"
assert_bash_blocked "rm _OLD archive"                  "rm src/app_OLD.ts"
assert_bash_blocked "rm normal project file"           "rm docs/notes.md"
assert_bash_allowed "rm -rf /tmp/ (safe)"              "rm -rf /tmp/build-output/"
assert_bash_allowed "rm /tmp single file (safe)"       "rm /tmp/scratch.txt"

# truncate of protected paths
assert_bash_blocked "truncate Partners page"           "truncate -s 0 onelifetime.world/Partners/index.html"
assert_bash_blocked "truncate .env"                    "truncate -s 0 .env"
assert_bash_allowed "truncate temp file"               "truncate -s 0 /tmp/scratch.txt"

# shred — always blocked regardless of target
assert_bash_blocked "shred any file"                   "shred -u src/app.ts"
assert_bash_blocked "shred protected file"             "shred -u onelifetime.world/Partners/index.html"

# ── Summary ───────────────────────────────────────────────────────────────────

echo ""
echo "═══════════════════════════════════════════"
echo "Results: ${PASS} passed, ${FAIL} failed"
if [ "${FAIL}" -gt 0 ]; then
  echo ""
  echo "Failed tests:"
  for e in "${ERRORS[@]}"; do echo "  - $e"; done
  exit 1
fi
echo "All tests passed."
exit 0
