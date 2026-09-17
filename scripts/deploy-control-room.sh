#!/usr/bin/env bash
# =============================================================================
# deploy-control-room.sh — Deploy DWS Control Room dashboard
# =============================================================================
# Syncs dws6.com/dashboard/control-room/ to its landing-pages/ mirror per the
# CLAUDE.md dual-folder rule, validates the OpenTelemetry GenAI env vars used
# by the backend telemetry service, and runs a content-parity check before
# reporting success.
#
# Aligned with:
#   - OpenTelemetry GenAI Observability (May 2026)
#     https://opentelemetry.io/blog/2026/genai-observability/
#   - docs/field-notes/2026-05-15-opentelemetry-genai-observability-control-room.md
#   - docs/field-notes/2026-05-02-gcp-otel-ingestion-api-launch.md
#   - DWS_ARTICLE_12_LOGGING_STANDARD.md §2–§3
#
# Usage:
#   ./scripts/deploy-control-room.sh             # sync + validate (default)
#   ./scripts/deploy-control-room.sh --check     # validate only, no copy
#   ./scripts/deploy-control-room.sh --status    # print diff vs. mirror
#
# Exit codes:
#   0  success
#   1  missing required env var
#   2  source files missing or unreadable
#   3  sync produced a non-identical mirror (parity failure)
#
# Version: 1.0.0
# License: Proprietary — Lifetime Oy
# =============================================================================

set -euo pipefail

# -----------------------------------------------------------------------------
# Paths (resolved against the repo root, regardless of CWD)
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

SRC_DIR="${REPO_ROOT}/dws6.com/dashboard/control-room"
DST_DIR="${REPO_ROOT}/landing-pages/dws6-com/dashboard/control-room"

# -----------------------------------------------------------------------------
# Logging helpers
# -----------------------------------------------------------------------------
if [ -t 1 ]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; BLUE=''; NC=''
fi

log_info()  { printf '%b[INFO]%b  %s\n'  "${GREEN}" "${NC}" "$*"; }
log_warn()  { printf '%b[WARN]%b  %s\n'  "${YELLOW}" "${NC}" "$*"; }
log_error() { printf '%b[ERROR]%b %s\n'  "${RED}" "${NC}" "$*" >&2; }
log_step()  { printf '%b[STEP]%b  %s\n'  "${BLUE}" "${NC}" "$*"; }

# -----------------------------------------------------------------------------
# OpenTelemetry GenAI env vars required by the backend telemetry service.
# Treated as recommended (warn) unless DWS_CONTROL_ROOM_STRICT=1 (error).
# -----------------------------------------------------------------------------
OTEL_REQUIRED_VARS=(
    OTEL_EXPORTER_OTLP_ENDPOINT
    OTEL_SERVICE_NAME
)
OTEL_RECOMMENDED_VARS=(
    OTEL_RESOURCE_ATTRIBUTES
    OTEL_EXPORTER_OTLP_HEADERS
    GEN_AI_DEFAULT_SYSTEM
)

validate_env() {
    log_step "Validating OpenTelemetry environment"
    local strict="${DWS_CONTROL_ROOM_STRICT:-0}"
    local missing=0

    for var in "${OTEL_REQUIRED_VARS[@]}"; do
        if [ -z "${!var:-}" ]; then
            if [ "${strict}" = "1" ]; then
                log_error "Required env var ${var} is not set"
                missing=$((missing + 1))
            else
                log_warn "Required env var ${var} is not set (strict mode off)"
            fi
        else
            log_info "${var} is set"
        fi
    done

    for var in "${OTEL_RECOMMENDED_VARS[@]}"; do
        if [ -z "${!var:-}" ]; then
            log_warn "Recommended env var ${var} is not set"
        else
            log_info "${var} is set"
        fi
    done

    if [ "${missing}" -gt 0 ]; then
        log_error "Refusing to deploy — set DWS_CONTROL_ROOM_STRICT=0 to bypass"
        exit 1
    fi
}

# -----------------------------------------------------------------------------
# Source validation — refuses to copy a missing or empty index.html.
# -----------------------------------------------------------------------------
validate_source() {
    log_step "Validating control-room source files"
    if [ ! -d "${SRC_DIR}" ]; then
        log_error "Source directory does not exist: ${SRC_DIR}"
        exit 2
    fi
    if [ ! -s "${SRC_DIR}/index.html" ]; then
        log_error "Source index.html missing or empty: ${SRC_DIR}/index.html"
        exit 2
    fi
    log_info "Source OK: ${SRC_DIR}"
}

# -----------------------------------------------------------------------------
# Status — show the current diff between source and mirror without touching it.
# -----------------------------------------------------------------------------
show_status() {
    log_step "Diffing source vs. landing-pages mirror"
    if [ ! -d "${DST_DIR}" ]; then
        log_warn "Mirror directory does not exist yet: ${DST_DIR}"
        return 0
    fi
    if diff -rq "${SRC_DIR}" "${DST_DIR}"; then
        log_info "Source and mirror are identical"
    else
        log_warn "Source and mirror differ — run without --status to sync"
    fi
}

# -----------------------------------------------------------------------------
# Sync source → landing-pages mirror. Uses rsync when available; falls back to
# cp -a so the script works on stripped-down CI runners.
# -----------------------------------------------------------------------------
sync_to_mirror() {
    log_step "Syncing ${SRC_DIR} → ${DST_DIR}"
    mkdir -p "${DST_DIR}"

    if command -v rsync >/dev/null 2>&1; then
        rsync -a --delete "${SRC_DIR}/" "${DST_DIR}/"
    else
        log_warn "rsync not available — falling back to cp -a"
        rm -rf "${DST_DIR}"
        mkdir -p "$(dirname "${DST_DIR}")"
        cp -a "${SRC_DIR}" "${DST_DIR}"
    fi
    log_info "Sync complete"
}

# -----------------------------------------------------------------------------
# Parity check — fail closed if the mirror is not byte-identical after copy.
# -----------------------------------------------------------------------------
verify_parity() {
    log_step "Verifying source/mirror parity"
    if ! diff -rq "${SRC_DIR}" "${DST_DIR}" >/dev/null; then
        log_error "Source and mirror differ after sync (parity failure)"
        diff -rq "${SRC_DIR}" "${DST_DIR}" || true
        exit 3
    fi
    log_info "Parity verified — control room mirror is in lockstep with source"
}

# -----------------------------------------------------------------------------
# Entry point
# -----------------------------------------------------------------------------
main() {
    local mode="${1:-deploy}"
    case "${mode}" in
        --check)
            validate_env
            validate_source
            show_status
            ;;
        --status)
            validate_source
            show_status
            ;;
        deploy|"")
            validate_env
            validate_source
            sync_to_mirror
            verify_parity
            log_info "Control Room deployed. Backend telemetry expects gen_ai.* attributes per OpenTelemetry GenAI conventions."
            ;;
        -h|--help)
            grep -E '^#( |$)' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
            ;;
        *)
            log_error "Unknown mode: ${mode}"
            log_info "Run with --help for usage."
            exit 64
            ;;
    esac
}

main "${1:-deploy}"
