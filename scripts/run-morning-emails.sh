#!/usr/bin/env bash
# Morning Brief V2 — Unified Local Runner (DGX Spark)
#
# Sends Morning Brief V2 (one combined email) + Friday/Monday extras.
# DGX Spark owns the autonomous business process layer; GitHub Actions for CI/CD only.
# Trigger: systemd timer at 03:00 UTC, or on machine startup.
#
# Usage:
#   ./scripts/run-morning-emails.sh              # Run all morning emails
#   ./scripts/run-morning-emails.sh test          # Send all immediately
#   ./scripts/run-morning-emails.sh install       # Install systemd timer + startup
#   ./scripts/run-morning-emails.sh status        # Show status and recent logs
#   ./scripts/run-morning-emails.sh uninstall     # Remove systemd units
#
# Code-Version: 1.0
# Introduced-In: PR-morning-brief-feature
# Date: 2026-03-27
# Owner: risto@lifetime.fi

set -uo pipefail  # no -e: individual scripts may fail without blocking the rest

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
NPX_BIN="$(which npx 2>/dev/null || echo /opt/node22/bin/npx)"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/morning-emails.log"
LOCK_FILE="$LOG_DIR/.morning-emails-today"

mkdir -p "$LOG_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

# ---------------------------------------------------------------------------
# Lock file: prevent double-send on same day
# ---------------------------------------------------------------------------

already_sent_today() {
  [ -f "$LOCK_FILE" ] && [ "$(cat "$LOCK_FILE")" = "$(date +%Y-%m-%d)" ]
}

mark_sent_today() {
  date +%Y-%m-%d > "$LOCK_FILE"
}

# ---------------------------------------------------------------------------
# Day-of-week helpers
# ---------------------------------------------------------------------------

DOW=$(date +%u)  # 1=Mon ... 7=Sun
IS_MON_SAT=$(( DOW >= 1 && DOW <= 6 ? 1 : 0 ))
IS_WEEKDAY=$(( DOW >= 1 && DOW <= 5 ? 1 : 0 ))
IS_FRIDAY=$(( DOW == 5 ? 1 : 0 ))
IS_MONDAY=$(( DOW == 1 ? 1 : 0 ))

# ---------------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------------

run_script() {
  local name="$1"; shift
  log "--- $name ---"
  cd "$PROJECT_DIR"
  if [ -f .env ]; then set -a; source .env; set +a; fi
  export SKIP_TIME_CHECK=true
  "$NPX_BIN" tsx "$@" >> "$LOG_FILE" 2>&1 && log "$name OK" || log "$name FAILED (exit $?)"
}

send_all() {
  log "========== MORNING EMAILS START =========="
  log "Day: $(date '+%a %Y-%m-%d %H:%M') | MonSat=$IS_MON_SAT Weekday=$IS_WEEKDAY Fri=$IS_FRIDAY Mon=$IS_MONDAY"

  # --- Morning Brief V2 (Mon-Sat) ---
  # Replaces 5 separate emails with ONE combined brief:
  #   - CEO Cockpit (was: send-morning-briefing.ts)
  #   - Outreach Digest (was: send-outreach-digest.ts)
  #   - Captain Briefing (was: send-captain-briefing.ts)
  #   - Regulation Digest (was: send-regulation-digest.ts)
  #   - Social Digest (was: send-social-digest.ts)
  # Old scripts kept in scripts/ but NO LONGER CALLED here.
  # flow-orchestrator-digest.ts also replaced (moved out of scripts/daily/).
  [ "$IS_MON_SAT" -eq 1 ] && run_script "Morning Brief V2" scripts/send-morning-brief-v2.ts

  # --- Standalone emails (not replaced by V2) ---

  # Weekly Campaign Newsletter (Friday only, different audience: subscribers)
  [ "$IS_FRIDAY" -eq 1 ] && run_script "Campaign Newsletter" scripts/send-campaign-newsletter.ts

  # Weekly Report (Monday only)
  [ "$IS_MONDAY" -eq 1 ] && run_script "Weekly Report" scripts/send-weekly-report-email.ts

  log "========== MORNING EMAILS DONE =========="
}

# ---------------------------------------------------------------------------
# Sub-commands
# ---------------------------------------------------------------------------

cmd_send() {
  if already_sent_today; then
    log "Already sent today. Skipping. Use 'test' to force."
    return 0
  fi
  send_all
  mark_sent_today
}

cmd_test() {
  send_all
}

cmd_force() {
  # Bypass lock AND time guard. Useful when the daily run was stale or skipped.
  rm -f "$LOCK_FILE"
  export BRIEF_FORCE=1
  export SKIP_TIME_CHECK=true
  send_all
  mark_sent_today
}

cmd_preview() {
  # Generate HTML preview only — no email sent. Default path: logs/morning-brief-preview.html
  cd "$PROJECT_DIR"
  if [ -f .env ]; then set -a; source .env; set +a; fi
  export SKIP_TIME_CHECK=true
  export BRIEF_PREVIEW=1
  "$NPX_BIN" tsx scripts/send-morning-brief-v2.ts --preview "$@"
  local preview_path="${BRIEF_HTML_OUT:-logs/morning-brief-preview.html}"
  echo ""
  echo "Preview written. Open it locally:"
  echo "  xdg-open $PROJECT_DIR/$preview_path   # Linux"
  echo "  start    $PROJECT_DIR/$preview_path   # Windows PowerShell"
  echo "  open     $PROJECT_DIR/$preview_path   # macOS"
}

cmd_install() {
  local service_dir="$HOME/.config/systemd/user"
  mkdir -p "$service_dir"

  cat > "$service_dir/dws6-morning-emails.service" <<UNIT
[Unit]
Description=DWS6 Morning Emails (all digests)
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=$PROJECT_DIR
ExecStart=$SCRIPT_DIR/run-morning-emails.sh send
Environment=PATH=$HOME/.local/bin:/opt/node22/bin:/usr/local/bin:/usr/bin:/bin

[Install]
WantedBy=default.target
UNIT

  cat > "$service_dir/dws6-morning-emails.timer" <<UNIT
[Unit]
Description=Morning Brief V2 Timer (03:00 UTC daily — DGX Spark owns business process layer)

[Timer]
OnCalendar=*-*-* 03:00 UTC
Persistent=true
RandomizedDelaySec=60

[Install]
WantedBy=timers.target
UNIT

  systemctl --user daemon-reload
  systemctl --user enable dws6-morning-emails.service  # starts on login too
  systemctl --user enable dws6-morning-emails.timer
  systemctl --user start dws6-morning-emails.timer

  # Remove old single-briefing timer if present
  systemctl --user stop dws6-morning-briefing.timer 2>/dev/null || true
  systemctl --user disable dws6-morning-briefing.timer 2>/dev/null || true

  echo "Installed:"
  echo "  - Timer: 03:00 UTC daily (DGX Spark business process layer)"
  echo "  - Service: also runs on login (Persistent=true catches missed runs)"
  systemctl --user list-timers dws6-morning-emails.timer --no-pager 2>/dev/null || true
}

cmd_status() {
  systemctl --user status dws6-morning-emails.timer --no-pager 2>/dev/null || echo "Timer not installed."
  echo ""
  systemctl --user list-timers dws6-morning-emails.timer --no-pager 2>/dev/null || true
  echo ""
  echo "Lock file:"
  [ -f "$LOCK_FILE" ] && echo "  Last sent: $(cat "$LOCK_FILE")" || echo "  (none)"
  echo ""
  echo "Last 30 log lines:"
  tail -30 "$LOG_FILE" 2>/dev/null || echo "(no logs yet)"
}

cmd_uninstall() {
  systemctl --user stop dws6-morning-emails.timer 2>/dev/null || true
  systemctl --user disable dws6-morning-emails.timer 2>/dev/null || true
  systemctl --user disable dws6-morning-emails.service 2>/dev/null || true
  rm -f "$HOME/.config/systemd/user/dws6-morning-emails.service"
  rm -f "$HOME/.config/systemd/user/dws6-morning-emails.timer"
  systemctl --user daemon-reload
  echo "Morning emails timer uninstalled."
}

case "${1:-send}" in
  send)      cmd_send ;;
  test)      cmd_test ;;
  force)     shift; cmd_force "$@" ;;
  preview)   shift; cmd_preview "$@" ;;
  install)   cmd_install ;;
  status)    cmd_status ;;
  uninstall) cmd_uninstall ;;
  *)
    echo "Usage: $0 {send|test|force|preview|install|status|uninstall}"
    echo "  send      — Run all morning emails (default, skips if already sent today)"
    echo "  test      — Send all immediately (no lock check)"
    echo "  force     — Clear today's lock and re-send immediately (use after a stale brief)"
    echo "  preview   — Build HTML to logs/morning-brief-preview.html, NO email sent"
    echo "  install   — Install systemd timer (05:00 Helsinki) + login trigger"
    echo "  status    — Show timer status and recent logs"
    echo "  uninstall — Remove systemd units"
    exit 1
    ;;
esac
