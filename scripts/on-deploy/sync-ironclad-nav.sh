#!/usr/bin/env bash
# sync-ironclad-nav.sh — Ironclad Nav + Footer sync
#
# Single source of truth: dws10.com/shared-assets/
# Syncs ironclad-nav.js and ironclad-footer.js to:
#   - lifetime.fi (root + landing-pages mirror)
#   - onelifetime.world (root + landing-pages mirror)
#
# Auto-runs after every git pull with new commits (on-deploy convention).
# DGX Spark primary; GitHub Actions .github/workflows/sync-ironclad.yml is failover.
#
# DWS Brand Standard — Ironclad Sync Rule (added 2026-04-28):
#   dws10.com is the single source of truth for ironclad-nav.js and ironclad-footer.js.
#   Never edit these files in lifetime.fi or onelifetime.world directly.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC_NAV="$REPO_ROOT/dws10.com/shared-assets/nav/ironclad-nav.js"
SRC_FOOTER="$REPO_ROOT/dws10.com/shared-assets/footer/ironclad-footer.js"
LOG="$REPO_ROOT/logs/sync-ironclad-nav.log"

mkdir -p "$(dirname "$LOG")"

log() {
  local ts
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "[$ts] $*" | tee -a "$LOG"
}

sync_file() {
  local src="$1"
  local dst="$2"
  local label="$3"

  if [ ! -f "$src" ]; then
    log "ERROR: source not found: $src"
    return 1
  fi

  mkdir -p "$(dirname "$dst")"

  if [ -f "$dst" ] && cmp -s "$src" "$dst"; then
    log "SKIP $label — already up to date"
    return 0
  fi

  cp "$src" "$dst"
  log "SYNC $label — $dst"
}

log "=== Ironclad nav+footer sync starting ==="
log "Source nav:    $SRC_NAV"
log "Source footer: $SRC_FOOTER"

# ── lifetime.fi ──────────────────────────────────────────────────────────────
sync_file "$SRC_NAV" \
  "$REPO_ROOT/lifetime.fi/shared-assets/nav/ironclad-nav.js" \
  "lifetime.fi/nav"

sync_file "$SRC_NAV" \
  "$REPO_ROOT/landing-pages/lifetime-fi/shared-assets/nav/ironclad-nav.js" \
  "landing-pages/lifetime-fi/nav"

sync_file "$SRC_FOOTER" \
  "$REPO_ROOT/lifetime.fi/shared-assets/footer/ironclad-footer.js" \
  "lifetime.fi/footer"

sync_file "$SRC_FOOTER" \
  "$REPO_ROOT/landing-pages/lifetime-fi/shared-assets/footer/ironclad-footer.js" \
  "landing-pages/lifetime-fi/footer"

# ── onelifetime.world ─────────────────────────────────────────────────────────
sync_file "$SRC_NAV" \
  "$REPO_ROOT/onelifetime.world/shared-assets/nav/ironclad-nav.js" \
  "onelifetime.world/nav"

sync_file "$SRC_NAV" \
  "$REPO_ROOT/landing-pages/onelifetime-world/shared-assets/nav/ironclad-nav.js" \
  "landing-pages/onelifetime-world/nav"

sync_file "$SRC_FOOTER" \
  "$REPO_ROOT/onelifetime.world/shared-assets/footer/ironclad-footer.js" \
  "onelifetime.world/footer"

sync_file "$SRC_FOOTER" \
  "$REPO_ROOT/landing-pages/onelifetime-world/shared-assets/footer/ironclad-footer.js" \
  "landing-pages/onelifetime-world/footer"

log "=== Sync complete ==="
