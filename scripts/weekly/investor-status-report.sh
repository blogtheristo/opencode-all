#!/usr/bin/env bash
#
# investor-status-report.sh
#
# Biweekly investor status report — runs /investor-outreach status and emails
# the summary to Risto via Amazon SES SMTP. Script Automation Rule
# (CLAUDE.md): placed in scripts/weekly/ so day-runner picks it up; the
# biweekly cadence is enforced inside the script via the WEEK_PARITY check
# (only run on ISO weeks where week-number mod 2 == 0).
#
# Anti-goals (CLAUDE.md non-negotiables):
#  - Email transport: Amazon SES (SMTP) only. Never Resend.
#  - Sender: risto.paarni@lifetime.fi. Never noreply@.
#  - This script is internal (Risto -> Risto). It does NOT send to investors.
#
# Spine: labor-anchored pricing · regulation drives demand · MACC + AppExchange
# drive distribution.

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
LOG_DIR="${ROOT}/logs/investor-cadence"
mkdir -p "${LOG_DIR}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="${LOG_DIR}/status-report-${STAMP}.log"

# Biweekly gating: only run on even ISO weeks. Skip otherwise.
WEEK_NUM="$(date -u +%V)"
if (( 10#${WEEK_NUM} % 2 != 0 )); then
  echo "[$(date -u +%FT%TZ)] investor-status-report: ISO week ${WEEK_NUM} (odd) — skipping (biweekly cadence)" \
    | tee -a "${LOG}"
  exit 0
fi

{
  echo "[$(date -u +%FT%TZ)] investor-status-report begin (ISO week ${WEEK_NUM})"

  if command -v dws >/dev/null 2>&1; then
    dws investor-outreach status \
      --window 14d \
      --transport ses \
      --from risto.paarni@lifetime.fi \
      --to risto.paarni@lifetime.fi \
      --subject "[INVESTOR CADENCE] 2026 Q2 SAFE — biweekly status, ISO week ${WEEK_NUM}"
  else
    echo "WARN: 'dws' CLI not on PATH; cadence logged but no email sent"
  fi

  echo "[$(date -u +%FT%TZ)] investor-status-report end"
} | tee -a "${LOG}"
