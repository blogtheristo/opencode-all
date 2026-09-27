#!/usr/bin/env bash
# Evidence: Tool=Claude Code (cloud) Agent=runner-hardening Date=2026-09-23
# Audit trail: git log -- infrastructure/dgx-spark/setup-github-runner.sh
# ============================================================================
# DGX Spark — Hardened, Ephemeral GitHub Actions Runner Setup (v2)
#
# Replaces the v1 runner (setup-github-runner_OLD.sh), which ran PR jobs as
# admin100 with access to ~/dws6/.env, SSH keys, Docker and sudo.
#
# v2 model:
#   - Dedicated system user `gh-runner`: no sudo, no docker group, no login.
#   - Ephemeral: one job per JIT registration, all state wiped between jobs.
#   - Long-lived PAT stays root-only (/etc/gh-runner/pat); jobs never see it.
#   - Runner binaries root-owned and read-only to jobs.
#   - systemd sandbox: read-only host, /home + /root hidden, no Docker socket,
#     no new privileges, namespaces/syscalls restricted, CPU/RAM capped.
#
# Why: CVE-2026-80521 and earlier 2026 kernel escapes. See
#   docs/field-notes/2026-09-23-preloop-gha-to-dgx-evaluation.md §5a.
# Limits: this does NOT fix the kernel. A kernel exploit from a job still
#   reaches root. Patch the kernel as soon as Ubuntu ships the fix.
#
# Prerequisite (HIC, once): fine-grained PAT scoped to blogtheristo/dws6 only,
#   permission "Administration: Read and write". Store it:
#     sudo install -d -m 0700 /etc/gh-runner
#     sudo sh -c 'umask 077; cat > /etc/gh-runner/pat'   # paste, Ctrl-D
#
# Usage (on DGX Spark):
#   sudo bash infrastructure/dgx-spark/setup-github-runner.sh
#
# Rollback:
#   sudo systemctl disable --now github-runner runner-health
#   mv /home/admin100/actions-runner_OLD /home/admin100/actions-runner
#   sudo -u admin100 bash infrastructure/dgx-spark/setup-github-runner_OLD.sh
#
# Code-Version: 2.0.0
# Date: 2026-09-23
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

RUNNER_VERSION="${RUNNER_VERSION:-2.325.0}"
REPO="blogtheristo/dws6"
LABELS="self-hosted,arm64,dgx-spark,ubuntu-24.04"
RUNNER_GROUP_ID=1
RUN_USER="gh-runner"
BASE="/srv/gh-runner"
RUNNER_DIR="${BASE}/runner"
LIB_DIR="/usr/local/lib/gh-runner"
CONF_DIR="/etc/gh-runner"
PAT_FILE="${CONF_DIR}/pat"
OLD_USER="admin100"
OLD_DIR="/home/${OLD_USER}/actions-runner"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="${SCRIPT_DIR}/gh-runner"

G='\033[0;32m'; Y='\033[1;33m'; R='\033[0;31m'; N='\033[0m'
log()  { echo -e "${G}[RUNNER]${N} $*"; }
warn() { echo -e "${Y}[RUNNER]${N} $*"; }
die()  { echo -e "${R}[RUNNER] FATAL:${N} $*" >&2; exit 1; }

gh_api() { # method path  — PAT passed via fd, never on the command line
  curl -fsS -X "$1" \
    -H @<(printf 'Authorization: Bearer %s\n' "$(cat "$PAT_FILE")") \
    -H 'Accept: application/vnd.github+json' \
    -H 'X-GitHub-Api-Version: 2022-11-28' \
    "https://api.github.com/$2"
}

# --- 1. Preflight ------------------------------------------------------------
[ "$(id -u)" -eq 0 ] || die "run as root: sudo bash $0"
[ "$(uname -m)" = "aarch64" ] || die "expected aarch64 (DGX Spark), got $(uname -m)"
[ -f "$PAT_FILE" ] || die "missing $PAT_FILE (see Prerequisite in header)"
[ "$(stat -c '%U:%a' "$PAT_FILE")" = "root:600" ] || die "$PAT_FILE must be root:600"
for f in gh-runner-jitconfig.sh gh-runner-start.sh gh-runner-cleanup.sh \
         github-runner.service runner-health.service; do
  [ -f "${SRC}/$f" ] || die "missing ${SRC}/$f"
done

log "Installing host tools jobs rely on (jq, git, curl, netcat)..."
apt-get install -y --no-install-recommends jq git curl ncat >/dev/null

log "Checking PAT scope..."
gh_api GET "repos/${REPO}/actions/runners" >/dev/null \
  || die "PAT cannot list runners on ${REPO} (needs Administration: Read and write)"

log "Kernel: $(uname -r) — the sandbox does not replace a kernel patch."

# --- 2. Dedicated user -------------------------------------------------------
if ! id "$RUN_USER" &>/dev/null; then
  log "Creating system user ${RUN_USER}..."
  useradd --system --home-dir "${BASE}/home" --no-create-home \
    --shell /usr/sbin/nologin "$RUN_USER"
fi
for grp in sudo adm docker lxd admin100; do
  if id -nG "$RUN_USER" | tr ' ' '\n' | grep -qx "$grp"; then
    die "${RUN_USER} is in group '${grp}' — remove it: gpasswd -d ${RUN_USER} ${grp}"
  fi
done

# --- 3. Runner binaries (checksum-verified, root-owned) ----------------------
TARBALL="actions-runner-linux-arm64-${RUNNER_VERSION}.tar.gz"
log "Fetching checksum for runner v${RUNNER_VERSION}..."
expected=$(curl -fsS "https://api.github.com/repos/actions/runner/releases/tags/v${RUNNER_VERSION}" \
  | jq -r '.body' \
  | sed -n 's/.*<!-- BEGIN SHA linux-arm64 -->\([0-9a-f]\{64\}\)<!-- END SHA linux-arm64 -->.*/\1/p' \
  | head -1)
[ -n "$expected" ] || die "could not read linux-arm64 SHA256 from release notes"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
curl -fsSL "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/${TARBALL}" \
  -o "${tmp}/${TARBALL}"
echo "${expected}  ${tmp}/${TARBALL}" | sha256sum -c --quiet - || die "SHA256 mismatch"

log "Installing runner into ${RUNNER_DIR} (root-owned, read-only to jobs)..."
rm -rf "$RUNNER_DIR"
install -d -o root -g root -m 0755 "$BASE" "$RUNNER_DIR"
tar xzf "${tmp}/${TARBALL}" -C "$RUNNER_DIR"
( cd "$RUNNER_DIR" && env -i PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    HOME="${BASE}/home" ./env.sh >/dev/null )
chown -R root:root "$RUNNER_DIR"
chmod -R go-w "$RUNNER_DIR"
install -d -o "$RUN_USER" -g "$RUN_USER" -m 0700 \
  "${RUNNER_DIR}/_work" "${RUNNER_DIR}/_diag" "${BASE}/home"

# --- 4. Config + helpers -----------------------------------------------------
install -d -o root -g root -m 0700 "$CONF_DIR"
cat > "${CONF_DIR}/runner.env" <<EOF
REPO=${REPO}
RUNNER_LABELS=${LABELS}
RUNNER_GROUP_ID=${RUNNER_GROUP_ID}
EOF
chmod 0600 "${CONF_DIR}/runner.env"

install -d -o root -g root -m 0755 "$LIB_DIR"
install -o root -g root -m 0755 "${SRC}/gh-runner-jitconfig.sh" "${SRC}/gh-runner-start.sh" \
  "${SRC}/gh-runner-cleanup.sh" "${SCRIPT_DIR}/runner-health.sh" "$LIB_DIR/"

# --- 5. Retire the v1 runner (admin100) --------------------------------------
if [ -d "$OLD_DIR" ]; then
  log "Retiring v1 runner in ${OLD_DIR}..."
  systemctl --user -M "${OLD_USER}@" disable --now github-runner.service runner-health.service 2>/dev/null \
    || warn "could not stop v1 user services (already stopped?)"
  if [ -f "${OLD_DIR}/.runner" ]; then
    rm_token=$(gh_api POST "repos/${REPO}/actions/runners/remove-token" | jq -r '.token')
    ( cd "$OLD_DIR" && sudo -u "$OLD_USER" ./config.sh remove --token "$rm_token" ) \
      || warn "v1 deregistration failed — remove runner 'dgx-spark' in GitHub Settings → Actions → Runners"
  fi
  mv "$OLD_DIR" "${OLD_DIR}_OLD"
  log "v1 runner kept for rollback at ${OLD_DIR}_OLD"
fi

# --- 6. systemd --------------------------------------------------------------
install -o root -g root -m 0644 "${SRC}/github-runner.service" "${SRC}/runner-health.service" \
  /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now runner-health.service
systemctl enable --now github-runner.service

sleep 5
systemctl status github-runner.service --no-pager || true
log ""
log "=== Hardened runner installed ==="
log "Labels:  ${LABELS} (workflows unchanged)"
log "Status:  systemctl status github-runner runner-health"
log "Logs:    journalctl -u github-runner -f"
log "Audit:   systemd-analyze security github-runner.service"
log "Verify:  re-run one PR check per workflow on [self-hosted, dgx-spark]"
