#!/bin/sh
# Bumblebee scan launcher. Invoked by supercronic or manually via
#   docker exec bumblebee-collector /app/run-scan.sh <profile>
# Profile defaults to "project". Streams the NDJSON output into
# scan-and-emit.ts, which converts it to OTel metrics for Aspire.

set -eu

PROFILE="${1:-project}"
HOST_ROOT="${BUMBLEBEE_HOST_ROOT:-/host}"
CATALOG="${BUMBLEBEE_CATALOG:-/app/catalog.json}"

case "$PROFILE" in
  baseline|project|deep) ;;
  *) echo "unknown profile: $PROFILE (expected baseline|project|deep)" >&2; exit 2 ;;
esac

if ! command -v bumblebee >/dev/null 2>&1; then
  echo "bumblebee binary not found on PATH" >&2
  exit 127
fi

echo "[bumblebee] profile=$PROFILE host_root=$HOST_ROOT catalog=$CATALOG sha=$(cat /etc/bumblebee.sha 2>/dev/null || echo unknown)"

# Bumblebee writes NDJSON to stdout. Pipe through the emitter which both
# echoes lines for container logs and ships metrics to Aspire via OTLP.
bumblebee scan \
  --profile "$PROFILE" \
  --catalog "$CATALOG" \
  --format ndjson \
  --root "$HOST_ROOT" \
  | exec node --import tsx /app/scan-and-emit.ts --profile "$PROFILE"
