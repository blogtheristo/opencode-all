#!/usr/bin/env bash
#
# investor-regulatory-radar-refresh.sh
#
# Weekly regulatory radar — runs /regulatory-radar over the 12 funds in the
# active SAFE pipeline and flags thesis matches. Script Automation Rule
# (CLAUDE.md): placed in scripts/weekly/ so day-runner picks it up.
#
# Anti-goals (CLAUDE.md non-negotiables):
#  - Never use Resend; email transport is Amazon SES (SMTP) only.
#  - Never use noreply@; the named human is risto.paarni@lifetime.fi.
#  - No outbound to investors from this script; flags only.
#
# Spine: labor-anchored pricing · regulation drives demand · MACC + AppExchange
# drive distribution.

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="${ROOT}/logs/investor-cadence"
mkdir -p "${LOG_DIR}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="${LOG_DIR}/regulatory-radar-${STAMP}.log"

{
  echo "[$(date -u +%FT%TZ)] investor-regulatory-radar-refresh begin"

  # Active SAFE pipeline (top 12 funds). Re-rank on each refresh.
  FUNDS=(
    "Apeiron"
    "Ambienta"
    "INKEF"
    "42Cap"
    "ROI_Ventures"
    "StepStone"
    "Plug_and_Play_Paris"
    "SparkMind"
    "CoVentures"
    "Loyal_VC"
    "Sentris"
    "Augmented_Sense"
  )

  if command -v dws >/dev/null 2>&1; then
    for FUND in "${FUNDS[@]}"; do
      echo "[radar] ${FUND}"
      dws regulatory-radar --fund "${FUND}" --horizon 24m \
        --signal-out "${LOG_DIR}/radar-${FUND}-${STAMP}.json" || true
    done
    dws regulatory-radar --aggregate \
      --in "${LOG_DIR}/radar-*-${STAMP}.json" \
      --notify risto.paarni@lifetime.fi --transport ses
  else
    echo "WARN: 'dws' CLI not on PATH; cadence logged but radar not refreshed"
    printf '%s\n' "${FUNDS[@]}"
  fi

  echo "[$(date -u +%FT%TZ)] investor-regulatory-radar-refresh end"
} | tee -a "${LOG}"
