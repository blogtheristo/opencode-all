#!/usr/bin/env bash
# Evidence: Tool=Claude Code (cloud) Agent=runner-hardening Date=2026-09-23
# Audit trail: git log -- infrastructure/dgx-spark/gh-runner/gh-runner-jitconfig.sh
#
# gh-runner-jitconfig.sh — ExecStartPre (runs as ROOT via the "+" prefix).
# Mints a single-use just-in-time (JIT) runner config for one job and hands it
# to the unprivileged gh-runner user. The long-lived PAT never leaves root:
# jobs can read the one-time JIT config only, which GitHub invalidates after
# one job.
#
# Code-Version: 2.0.0
# Date: 2026-09-23
# Owner: Lifetime Oy

set -euo pipefail

CONF="/etc/gh-runner/runner.env"   # REPO, RUNNER_LABELS, RUNNER_GROUP_ID (no secrets)
PAT_FILE="/etc/gh-runner/pat"      # fine-grained PAT, root:root 0600
OUT="/run/gh-runner/jitconfig"

# shellcheck source=/dev/null
. "$CONF"
: "${REPO:?REPO missing in $CONF}"
: "${RUNNER_LABELS:?RUNNER_LABELS missing in $CONF}"
RUNNER_GROUP_ID="${RUNNER_GROUP_ID:-1}"

[ -r "$PAT_FILE" ] || { echo "FATAL: $PAT_FILE not readable" >&2; exit 1; }
perm=$(stat -c '%U:%a' "$PAT_FILE")
[ "$perm" = "root:600" ] || { echo "FATAL: $PAT_FILE must be root:600 (is $perm)" >&2; exit 1; }

name="dgx-spark-$(date -u +%Y%m%dT%H%M%SZ)-$$"
labels_json=$(printf '%s' "$RUNNER_LABELS" | jq -R 'split(",")')
body=$(jq -n --arg name "$name" --argjson labels "$labels_json" \
  --argjson gid "$RUNNER_GROUP_ID" \
  '{name: $name, runner_group_id: $gid, labels: $labels, work_folder: "_work"}')

# The Authorization header is passed through a file descriptor so the PAT never
# appears in the process table.
resp=$(curl -fsS -X POST \
  -H @<(printf 'Authorization: Bearer %s\n' "$(cat "$PAT_FILE")") \
  -H 'Accept: application/vnd.github+json' \
  -H 'X-GitHub-Api-Version: 2022-11-28' \
  --data "$body" \
  "https://api.github.com/repos/${REPO}/actions/runners/generate-jitconfig")

jit=$(printf '%s' "$resp" | jq -r '.encoded_jit_config // empty')
[ -n "$jit" ] || { echo "FATAL: no encoded_jit_config in API response" >&2; exit 1; }

umask 077
printf '%s' "$jit" > "$OUT"
chown gh-runner:gh-runner "$OUT"
chmod 0400 "$OUT"
echo "JIT config minted for runner ${name}"
