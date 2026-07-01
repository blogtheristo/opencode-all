#!/usr/bin/env bash
# Morning Briefing — Local Runner
#
# Runs the CEO Cockpit morning briefing on this machine.
# Called by systemd timer (dws6-morning-briefing.timer) at 06:00 Helsinki, Mon-Sat.
#
# Setup:
#   1. Copy .env.example → .env and fill in SMTP_* + SUPABASE_* values
#   2. Run: ./scripts/run-morning-briefing.sh install   (installs systemd units)
#   3. Test: ./scripts/run-morning-briefing.sh test      (sends immediately)
#
# Code-Version: 1.0
# Introduced-In: PR-morning-brief-feature
# Date: 2026-03-27
# Owner: risto@lifetime.fi

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NODE_BIN="$(which node 2>/dev/null || echo /opt/node22/bin/node)"
NPX_BIN="$(which npx 2>/dev/null || echo /opt/node22/bin/npx)"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/morning-briefing.log"

mkdir -p "$LOG_DIR"

# ---------------------------------------------------------------------------
# Sub-commands
# ---------------------------------------------------------------------------

cmd_send() {
  echo "[$(date -Iseconds)] Starting morning briefing..." >> "$LOG_FILE"
  cd "$PROJECT_DIR"

  # Load .env if present
  if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi

  export SKIP_TIME_CHECK="${SKIP_TIME_CHECK:-false}"

  "$NPX_BIN" tsx scripts/send-morning-briefing.ts >> "$LOG_FILE" 2>&1
  echo "[$(date -Iseconds)] Morning briefing finished (exit $?)" >> "$LOG_FILE"
}

cmd_test() {
  echo "--- Test send (SKIP_TIME_CHECK=true) ---"
  cd "$PROJECT_DIR"

  if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi

  export SKIP_TIME_CHECK=true
  "$NPX_BIN" tsx scripts/send-morning-briefing.ts
}

cmd_install() {
  local service_dir="$HOME/.config/systemd/user"
  mkdir -p "$service_dir"

  # Service unit
  cat > "$service_dir/dws6-morning-briefing.service" <<UNIT
[Unit]
Description=DWS6 CEO Cockpit Morning Briefing
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=$PROJECT_DIR
ExecStart=$SCRIPT_DIR/run-morning-briefing.sh send
Environment=PATH=$HOME/.local/bin:/opt/node22/bin:/usr/local/bin:/usr/bin:/bin
UNIT

  # Timer unit — 06:00 Helsinki, Mon-Sat
  cat > "$service_dir/dws6-morning-briefing.timer" <<UNIT
[Unit]
Description=Morning Briefing Timer (06:00 Helsinki, Mon-Sat)

[Timer]
OnCalendar=Mon..Sat 06:00 Europe/Helsinki
Persistent=true
RandomizedDelaySec=120

[Install]
WantedBy=timers.target
UNIT

  systemctl --user daemon-reload
  systemctl --user enable dws6-morning-briefing.timer
  systemctl --user start dws6-morning-briefing.timer

  echo "Installed and started timer. Status:"
  systemctl --user status dws6-morning-briefing.timer --no-pager || true
  echo ""
  echo "Next fire time:"
  systemctl --user list-timers dws6-morning-briefing.timer --no-pager || true
}

cmd_status() {
  systemctl --user status dws6-morning-briefing.timer --no-pager 2>/dev/null || echo "Timer not installed."
  echo ""
  systemctl --user list-timers dws6-morning-briefing.timer --no-pager 2>/dev/null || true
  echo ""
  echo "Last 20 log lines:"
  tail -20 "$LOG_FILE" 2>/dev/null || echo "(no logs yet)"
}

cmd_uninstall() {
  systemctl --user stop dws6-morning-briefing.timer 2>/dev/null || true
  systemctl --user disable dws6-morning-briefing.timer 2>/dev/null || true
  rm -f "$HOME/.config/systemd/user/dws6-morning-briefing.service"
  rm -f "$HOME/.config/systemd/user/dws6-morning-briefing.timer"
  systemctl --user daemon-reload
  echo "Timer uninstalled."
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

case "${1:-send}" in
  send)      cmd_send ;;
  test)      cmd_test ;;
  install)   cmd_install ;;
  status)    cmd_status ;;
  uninstall) cmd_uninstall ;;
  *)
    echo "Usage: $0 {send|test|install|status|uninstall}"
    echo "  send      — Run the briefing (default, used by systemd)"
    echo "  test      — Send immediately (bypasses time check)"
    echo "  install   — Install systemd user timer (06:00 Helsinki, Mon-Sat)"
    echo "  status    — Show timer status and recent logs"
    echo "  uninstall — Remove systemd timer"
    exit 1
    ;;
esac
