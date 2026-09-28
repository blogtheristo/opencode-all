#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
# Audit trail: git log -- scripts/aegis-pilot-isolated-rehearsal.sh
#
# Aegis Pilot — end-to-end rehearsal with a REAL severed uplink (Linux only).
#
# The rehearsal run executes inside a fresh network namespace (unshare --net):
# no interfaces, no routes, no DNS. That is the "host-egress-block" rung of the
# isolation ladder — it proves the workload needs no network, not the site's
# network boundary. Customer acceptance uses the method signed in Phase 0.
#
# Usage: scripts/aegis-pilot-isolated-rehearsal.sh [STATE_DIR]
# Exit code: the rehearsal's (0 PASS, 2 NEGATIVE_RESULT, 3 NOT_TAKEN/INVALID).
set -euo pipefail

cd "$(dirname "$0")/.."
STATE_DIR="${1:-$(mktemp -d -t aegis-pilot-XXXXXX)}"
KEY_DIR="$(mktemp -d -t aegis-operator-XXXXXX)"
SCOPE="config/aegis-pilot/reference-scope.json"
CLI=(node --import tsx scripts/aegis-pilot.ts)

command -v unshare >/dev/null || { echo "unshare not available — use a host firewall and 'npm run aegis:pilot -- run' instead" >&2; exit 1; }

echo "== state: $STATE_DIR" >&2
if [ ! -f "$STATE_DIR/site/site.json" ]; then
  "${CLI[@]}" init --state-dir "$STATE_DIR" --site-id reference-site --org-id lifetime-oy >&2
fi
OP_JSON="$("${CLI[@]}" issue-operator --state-dir "$STATE_DIR" --name "Rehearsal operator" --key-out "$KEY_DIR/operator.key")"
OP_CRED="$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).credentialPath)' "$OP_JSON")"

echo "== rehearsal inside an isolated network namespace" >&2
set +e
unshare --net --map-root-user "${CLI[@]}" run \
  --state-dir "$STATE_DIR" --scope "$SCOPE" --kind rehearsal \
  --operator-credential "$OP_CRED" --operator-key "$KEY_DIR/operator.key" \
  --report-dir "$STATE_DIR/reports"
RC=$?
set -e

echo "== uplink restored: reconcile deferred work" >&2
"${CLI[@]}" reconcile --state-dir "$STATE_DIR" --scope "$SCOPE" --report-dir "$STATE_DIR/reports" >&2 || true

echo "== verify ledger and records" >&2
LATEST="$(ls -t "$STATE_DIR"/acceptance/*.json | head -1)"
"${CLI[@]}" verify --state-dir "$STATE_DIR" --record "$LATEST" >&2

rm -rf "$KEY_DIR"
exit "$RC"
