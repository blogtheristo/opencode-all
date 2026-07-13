#!/usr/bin/env bash
# security-policy-review-quarterly-gate.sh
#
# Runs DAILY under scripts/daily/ (DGX Spark day-runner auto-discovers).
# Acts only on the first day of each calendar quarter (Jan 1, Apr 1, Jul 1, Oct 1),
# i.e. every 3 months — the cadence the board set for the information-security
# management review (johdon katselmus, NIS2 Art. 20 §6).
#
# What it does on a quarter-start day:
#   1. Derives the quarter stamp (e.g. "2026-Q3").
#   2. Opens a GitHub issue that is the quarterly management-review reminder,
#      with a checklist that drives the actual audit work:
#        - Re-run the PiTuKri self-assessment (Admin/PITUKRI_AUDIT_REPORT.md).
#        - Review Lifetime Oy:n tietoturvapolitiikka LINE BY LINE via the
#          /dialog skill (HIC-confirmed) on
#          Admin/LIFETIME_OY_HALLITUKSEN_POYTAKIRJA_TIETOTURVAPOLITIIKKA.md (LIITE 1).
#        - Record the board management-review minutes (§6) and set the next review date.
#        - Verify NIS2 Art. 20(2) management + staff training completion is logged.
#
# What it does NOT do: it does NOT edit the policy autonomously. Policy changes
# are made through /dialog (line-by-line, human agrees each "muutos;") and the
# board records them — both require a human in the loop, per CLAUDE.md discipline
# rules 1 & 12. This gate only schedules and tracks the work; it never rewrites it.
#
# Any other day: exits quietly.
# Idempotent: if an issue for the current quarter already exists, it does nothing.

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-$(git -C "$(dirname "$0")/../.." rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$(dirname "$0")/../.." && pwd)")}"
cd "${REPO_ROOT}"

MONTH="$(date -u +%m)"
DAY="$(date -u +%d)"
YEAR="$(date -u +%Y)"

# Quarter-start gate: only act on Jan 1 / Apr 1 / Jul 1 / Oct 1.
if [ "${DAY}" != "01" ]; then
  exit 0
fi
case "${MONTH}" in
  01) Q=1 ;;
  04) Q=2 ;;
  07) Q=3 ;;
  10) Q=4 ;;
  *) exit 0 ;;
esac

QSTAMP="${YEAR}-Q${Q}"
TITLE="Tietoturvapolitiikan kvartaalikatselmus (johdon katselmus) — ${QSTAMP}"

if ! command -v gh >/dev/null 2>&1; then
  echo "[sec-policy-gate] gh CLI not available; cannot open review issue for ${QSTAMP}." >&2
  echo "[sec-policy-gate] Run the review manually: /dialog on the policy + PiTuKri re-audit." >&2
  exit 1
fi

# Idempotency: skip if an open OR closed issue already exists for this quarter.
EXISTING="$(gh issue list --state all --search "${TITLE} in:title" --json number --jq '.[0].number' 2>/dev/null || true)"
if [ -n "${EXISTING}" ]; then
  echo "[sec-policy-gate] Issue #${EXISTING} already exists for ${QSTAMP}, nothing to do."
  exit 0
fi

echo "[sec-policy-gate] Opening quarterly security-policy review issue for ${QSTAMP}."

BODY="$(cat <<EOF
**Kvartaalikatselmus — Lifetime Oy:n tietoturvapolitiikka (${QSTAMP})**

Tämä on NIS2-direktiivin 20 artiklan mukainen **johdon katselmus**, joka toistuu 3 kk välein.
Hallituksen pöytäkirja (§ 6) velvoittaa katselmoimaan politiikan ja sen mittarit vähintään
vuosittain sekä aina merkittävän poikkeaman jälkeen; tämä gate ajaa kevyemmän kvartaalikierron.

Aja katselmus tässä järjestyksessä ja rastita:

- [ ] **1. Auditointi** — aja PiTuKri-itsearviointi uudelleen ja päivitä \`Admin/PITUKRI_AUDIT_REPORT.md\`. Kirjaa muuttuneet kontrollien tilat (erityisesti TJ-01/TJ-02, HT, JP).
- [ ] **2. Politiikan katselmointi \`/dialog\`-skillillä** — aja \`/dialog\` tiedostoon \`Admin/LIFETIME_OY_HALLITUKSEN_POYTAKIRJA_TIETOTURVAPOLITIIKKA.md\` (LIITE 1). Hyväksy jokainen "muutos;" erikseen (HIC). Älä muuta politiikkaa autonomisesti.
- [ ] **3. Johdon katselmuksen kirjaus** — kirjaa katselmuksen tulokset uuteen hallituksen pöytäkirjaan (§ johdon katselmus) ja aseta seuraava katselmuspäivä.
- [ ] **4. Koulutus (NIS2 Art. 20(2))** — varmista, että johdon ja henkilöstön tietoturvakoulutus on suoritettu ja kirjattu (\`docs/SECURITY_TRAINING_PROGRAM_SKELETON.md\`).
- [ ] **5. Versiointi** — nosta politiikan versio, jos sisältö muuttui; päivitä pöytäkirjan liite ja Related Documents -viittaukset.

Seuraava kvartaalikatselmus avautuu automaattisesti seuraavan vuosineljänneksen ensimmäisenä päivänä.

_Avattu automaattisesti: scripts/daily/security-policy-review-quarterly-gate.sh_
EOF
)"

gh issue create \
  --title "${TITLE}" \
  --body "${BODY}" \
  --label "security,compliance,quarterly-review" 2>/dev/null \
  || gh issue create --title "${TITLE}" --body "${BODY}"

echo "[sec-policy-gate] Done. Quarterly review issue opened for ${QSTAMP}."
