#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
# Audit trail: git log -- scripts/aegis-pilot-isolated-rehearsal.sh
#
# Aegis Pilot — end-to-end rehearsal with a REAL severed uplink (Linux only).
#
# The rehearsal run executes inside a fresh network namespace (unshare --net):
# no interfaces, no routes, no DNS. That is the "host-egress-block" rung of the
# isolation ladder — it proves the workload needs no network, not the site's
# network boundary. Customer acceptance uses the method signed in Phase 0.
#
# With OpenShell containment (C4) the steps and the stop-test agent run in
# OpenShell sandboxes. The gateway stays on the host; the namespace gets exactly
# one way out: a Unix-socket bridge to that gateway, and nothing else.
#
# Usage: scripts/aegis-pilot-isolated-rehearsal.sh [STATE_DIR] [run options…]
#   e.g. … --containment openshell --image aegis-pilot-node:22
#   or   AEGIS_CONTAINMENT=openshell AEGIS_IMAGE=… AEGIS_OPENSHELL_CLI=… …
#   Extra run options are forwarded to 'aegis-pilot run'.
# Exit code: the rehearsal's (0 PASS, 2 NEGATIVE_RESULT, 3 NOT_TAKEN/INVALID).
set -euo pipefail

cd "$(dirname "$0")/.."
STATE_DIR=""
if [ $# -gt 0 ] && [ "${1#--}" = "$1" ]; then STATE_DIR="$1"; shift; fi
STATE_DIR="${STATE_DIR:-$(mktemp -d -t aegis-pilot-XXXXXX)}"
EXTRA_ARGS=("$@")
KEY_DIR="$(mktemp -d -t aegis-operator-XXXXXX)"
SCOPE="config/aegis-pilot/reference-scope.json"
CLI=(node --import tsx scripts/aegis-pilot.ts)

# OpenShell mode: requested by the forwarded run options or by AEGIS_CONTAINMENT.
OPENSHELL=0
OPENSHELL_IN_ARGS=0
for ((i = 0; i < ${#EXTRA_ARGS[@]}; i++)); do
  if [ "${EXTRA_ARGS[$i]}" = "--containment" ] && [ "${EXTRA_ARGS[$((i + 1))]:-}" = "openshell" ]; then OPENSHELL_IN_ARGS=1; fi
  if [ "${EXTRA_ARGS[$i]}" = "--containment=openshell" ]; then OPENSHELL_IN_ARGS=1; fi
done
if [ "$OPENSHELL_IN_ARGS" = 1 ] || [ "${AEGIS_CONTAINMENT:-worker}" = "openshell" ]; then OPENSHELL=1; fi

command -v unshare >/dev/null || { echo "unshare not available — use a host firewall and 'npm run aegis:pilot -- run' instead" >&2; exit 1; }

echo "== state: $STATE_DIR" >&2
if [ ! -f "$STATE_DIR/site/site.json" ]; then
  "${CLI[@]}" init --state-dir "$STATE_DIR" --site-id reference-site --org-id lifetime-oy >&2
fi
OP_JSON="$("${CLI[@]}" issue-operator --state-dir "$STATE_DIR" --name "Rehearsal operator" --key-out "$KEY_DIR/operator.key")"
OP_CRED="$(node -e 'process.stdout.write(JSON.parse(process.argv[1]).credentialPath)' "$OP_JSON")"

echo "== rehearsal inside an isolated network namespace" >&2
set +e
RUN_ARGS=(run --state-dir "$STATE_DIR" --scope "$SCOPE" --kind rehearsal
  --operator-credential "$OP_CRED" --operator-key "$KEY_DIR/operator.key"
  --report-dir "$STATE_DIR/reports")
if [ "$OPENSHELL" = 1 ]; then
  # C4: steps and the stop-test agent run in OpenShell sandboxes. The gateway
  # stays on the host; the namespace reaches it through one Unix-socket bridge
  # and nothing else (scripts/aegis-pilot-gateway-bridge.mjs).
  GW_PORT="${AEGIS_OPENSHELL_PORT:-17670}"
  SOCK="$STATE_DIR/gateway-bridge.sock"
  node scripts/aegis-pilot-gateway-bridge.mjs host "$SOCK" "$GW_PORT" </dev/null >/dev/null 2>&1 &
  BRIDGE_PID=$!
  trap 'kill "$BRIDGE_PID" 2>/dev/null || true' EXIT
  sleep 0.3
  if [ "$OPENSHELL_IN_ARGS" = 0 ]; then
    RUN_ARGS+=(--containment openshell --image "${AEGIS_IMAGE:-aegis-pilot-node:22}"
      --openshell-cli "${AEGIS_OPENSHELL_CLI:-openshell}")
  fi
  RUN_ARGS+=("${EXTRA_ARGS[@]}")
  # The container's own HTTP(S) proxy lives in the host namespace and cannot be
  # reached from inside this one; the probe fails closed on a refused proxy, so
  # the variables are removed for the namespaced run (a customer site keeps its
  # proxy variables, and the probe must show them unreachable).
  env -u HTTPS_PROXY -u https_proxy -u HTTP_PROXY -u http_proxy -u ALL_PROXY -u all_proxy \
    OPENSHELL_GATEWAY_ENDPOINT="http://127.0.0.1:$GW_PORT" \
    unshare --net --map-root-user sh -c '
      sock="$1"; port="$2"; shift 2
      python3 scripts/aegis-pilot-netns-lo-up.py || exit 3
      node scripts/aegis-pilot-gateway-bridge.mjs ns "$sock" "$port" </dev/null >/dev/null 2>&1 &
      bridge=$!
      sleep 0.3
      "$@"; rc=$?
      kill "$bridge" 2>/dev/null
      exit "$rc"' sh "$SOCK" "$GW_PORT" "${CLI[@]}" "${RUN_ARGS[@]}"
  RC=$?
else
  RUN_ARGS+=("${EXTRA_ARGS[@]}")
  unshare --net --map-root-user "${CLI[@]}" "${RUN_ARGS[@]}"
  RC=$?
fi
set -e

echo "== uplink restored: reconcile deferred work" >&2
"${CLI[@]}" reconcile --state-dir "$STATE_DIR" --scope "$SCOPE" --report-dir "$STATE_DIR/reports" >&2 || true

echo "== verify ledger and records" >&2
LATEST="$(ls -t "$STATE_DIR"/acceptance/*.json | head -1)"
"${CLI[@]}" verify --state-dir "$STATE_DIR" --record "$LATEST" >&2

rm -rf "$KEY_DIR"
exit "$RC"
