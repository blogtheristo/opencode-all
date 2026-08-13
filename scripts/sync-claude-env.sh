#!/usr/bin/env bash
#
# Apply, back up, or restore the per-environment Claude Code local settings.
# Linux counterpart of scripts/Sync-ClaudeEnv.ps1 - use this on the Chromebook,
# on DGX Spark, and inside ephemeral cloud containers.
#
# .claude/settings.local.json is git-ignored, which is itself the risk: on a
# fresh clone the file does not exist and the configuration is gone. Recovery
# has two layers:
#
#   1. DURABLE - .claude/env/<profile>.json is committed, so `apply` rebuilds
#                the file from git on any machine.
#   2. LOCAL   - every `apply` first copies the existing file into
#                .claude/env/.backups/ (git-ignored); `restore` puts it back.
#
# Usage:
#   ./scripts/sync-claude-env.sh                 # detect and apply
#   ./scripts/sync-claude-env.sh apply dgx-spark # force a profile
#   ./scripts/sync-claude-env.sh list
#   ./scripts/sync-claude-env.sh backup
#   ./scripts/sync-claude-env.sh restore
#
# Override detection with DWS_CLAUDE_PROFILE=<profile>.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_DIR="${REPO_ROOT}/.claude/env"
BACKUP_DIR="${ENV_DIR}/.backups"
TARGET="${REPO_ROOT}/.claude/settings.local.json"

ACTION="${1:-apply}"
PROFILE="${2:-}"

detect_profile() {
  if [ -n "${DWS_CLAUDE_PROFILE:-}" ]; then
    echo "${DWS_CLAUDE_PROFILE}"
    return
  fi

  # Ephemeral cloud containers first - they also look like plain Linux.
  if [ -n "${CODESPACES:-}" ] || [ -n "${GITHUB_ACTIONS:-}" ] || [ -n "${CLAUDE_CODE_CLOUD:-}" ]; then
    echo "mobile"
    return
  fi

  local host
  host="$(hostname | tr '[:upper:]' '[:lower:]')"
  case "${host}" in
    *spark*|*dgx*) echo "dgx-spark"; return ;;
  esac

  if [ -f /etc/apt/sources.list.d/cros.list ] || [ -n "${SOMMELIER_VERSION:-}" ]; then
    echo "chromebook"
    return
  fi

  echo "ERROR: could not detect the environment. Pass a profile explicitly," >&2
  echo "       e.g. ./scripts/sync-claude-env.sh apply chromebook" >&2
  exit 1
}

backup_current() {
  [ -f "${TARGET}" ] || return 0
  mkdir -p "${BACKUP_DIR}"
  local dest="${BACKUP_DIR}/settings.local.$(date +%Y%m%d-%H%M%S).json"
  cp "${TARGET}" "${dest}"
  echo "Backed up current settings to ${dest}"
}

newest_backup() {
  [ -d "${BACKUP_DIR}" ] || return 1
  ls -1t "${BACKUP_DIR}"/*.json 2>/dev/null | head -n 1
}

case "${ACTION}" in
  list)
    echo "Available profiles (committed, so they survive a fresh clone):"
    for f in "${ENV_DIR}"/*.json; do
      echo "  $(basename "${f}" .json)"
    done
    echo
    echo "Local backups (git-ignored, newest first):"
    if [ -d "${BACKUP_DIR}" ] && ls "${BACKUP_DIR}"/*.json >/dev/null 2>&1; then
      ls -1t "${BACKUP_DIR}"/*.json | while read -r f; do echo "  $(basename "${f}")"; done
    else
      echo "  (none yet)"
    fi
    exit 0
    ;;

  backup)
    backup_current
    exit 0
    ;;

  restore)
    if ! src="$(newest_backup)" || [ -z "${src}" ]; then
      echo "No backups found. Recover from git instead:" >&2
      echo "  ./scripts/sync-claude-env.sh apply" >&2
      exit 1
    fi
    cp "${src}" "${TARGET}"
    echo "Restored settings.local.json from $(basename "${src}")"
    exit 0
    ;;

  apply) ;;
  *)
    echo "Unknown action '${ACTION}'. Use: apply | backup | restore | list" >&2
    exit 1
    ;;
esac

[ -n "${PROFILE}" ] || PROFILE="$(detect_profile)"

SOURCE="${ENV_DIR}/${PROFILE}.json"
if [ ! -f "${SOURCE}" ]; then
  echo "ERROR: unknown profile '${PROFILE}' (expected ${SOURCE})" >&2
  exit 1
fi

# Fail before touching anything if the profile is not valid JSON.
if command -v python3 >/dev/null 2>&1; then
  python3 -c "import json,sys; json.load(open(sys.argv[1]))" "${SOURCE}"
fi

backup_current
cp "${SOURCE}" "${TARGET}"
echo "Applied profile '${PROFILE}' to .claude/settings.local.json"
echo "Restart Claude Code for the change to take effect."