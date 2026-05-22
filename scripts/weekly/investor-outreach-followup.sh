#!/usr/bin/env bash
#
# investor-outreach-followup.sh
#
# Weekly investor cadence — runs /investor-outreach followup, surfaces inbound
# events to Risto, prioritizes by INTRO score. Script Automation Rule
# (CLAUDE.md): placed in scripts/weekly/ so day-runner picks it up; nothing
# depends on a human remembering to run it.
#
# Anti-goals (CLAUDE.md non-negotiables):
#  - Never use Resend; email transport is Amazon SES (SMTP) only.
#  - Never use noreply@ sender; the named human sender is risto.paarni@lifetime.fi.
#  - Never send any INTRO outbound without explicit Risto signoff.
#
# Spine: labor-anchored pricing · regulation drives demand · MACC + AppExchange
# drive distribution.

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="${ROOT}/logs/investor-cadence"
mkdir -p "${LOG_DIR}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="${LOG_DIR}/followup-${STAMP}.log"

{
  echo "[$(date -u +%FT%TZ)] investor-outreach-followup begin"
  echo "Branch: $(git -C "${ROOT}" rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
  echo "HEAD:   $(git -C "${ROOT}" rev-parse --short HEAD 2>/dev/null || echo 'unknown')"

  # The /investor-outreach skill is invoked through Claude Code CLI; this
  # script wraps the invocation so it runs in batch on day-runner. The skill
  # itself surfaces inbound + ranks by INTRO score; it does NOT send anything.
  if command -v dws >/dev/null 2>&1; then
    dws investor-outreach followup --surface-inbound --prioritize-by-score \
      --notify risto.paarni@lifetime.fi --transport ses
  else
    echo "WARN: 'dws' CLI not on PATH; falling back to ls-only summary so the cadence still logs activity"
    ls -1 "${ROOT}/investor-outreach"/INTRO_*.md 2>/dev/null | wc -l \
      | xargs -I{} echo "Active INTRO files: {}"
  fi

  echo "[$(date -u +%FT%TZ)] investor-outreach-followup end"
} | tee -a "${LOG}"
