#!/usr/bin/env bash
# serve-learn.sh — Serve the Learn/ index as a small static site on the DGX Spark.
#
# Internal only (LAN / on-host) — NOT a public URL. Serves the Learn/ directory
# over plain HTTP using the Python stdlib server; index.html redirects to
# start.html (the auto-generated index built by scripts/weekly/coach-learn-curate.sh).
#
# Run on the DGX Spark:
#   ssh dgx-spark
#   cd /path/to/dws6 && scripts/serve-learn.sh
# then browse to  http://<dgx-host-or-ip>:8080/  on the internal network.
#
# Run in the background (survives logout):
#   nohup scripts/serve-learn.sh >/var/log/serve-learn.log 2>&1 &
# or install as a service — see the systemd snippet at the bottom of this file.
#
# Env:
#   LEARN_DIR   directory to serve   (default: <repo>/Learn)
#   HOST        bind address         (default: 0.0.0.0 — reachable on the DGX LAN)
#   PORT        bind port            (default: 8080)
#
# Set HOST=127.0.0.1 for localhost-only (reachable only via SSH tunnel).

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
LEARN_DIR="${LEARN_DIR:-$REPO_ROOT/Learn}"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-8080}"

if ! command -v python3 >/dev/null 2>&1; then
  echo "error: python3 not found on PATH" >&2
  exit 1
fi
if [ ! -f "$LEARN_DIR/start.html" ]; then
  echo "error: $LEARN_DIR/start.html missing — run scripts/weekly/coach-learn-curate.sh first" >&2
  exit 1
fi

echo "[serve-learn] serving $LEARN_DIR on http://$HOST:$PORT/  (index → start.html)"
echo "[serve-learn] internal only — stop with Ctrl-C"
exec python3 -m http.server "$PORT" --bind "$HOST" --directory "$LEARN_DIR"

# ── Optional: run as a systemd service on the DGX ────────────────────────────
# Create /etc/systemd/system/serve-learn.service with:
#
#   [Unit]
#   Description=DWS Learn static index
#   After=network.target
#
#   [Service]
#   Environment=PORT=8080
#   WorkingDirectory=/home/admin100/dws6
#   ExecStart=/home/admin100/dws6/scripts/serve-learn.sh
#   Restart=on-failure
#   User=admin100
#
#   [Install]
#   WantedBy=multi-user.target
#
# Then:  sudo systemctl enable --now serve-learn
