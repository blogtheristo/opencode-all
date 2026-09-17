#!/usr/bin/env bash
# edp-dataset-diff.sh — Weekly data.europa.eu (European Data Portal) dataset
# version-diff scan. First concrete piece of the regulatory-radar ingestion
# layer (see docs/lab-notes/2026-07-06-inspire-european-data-portal-geospatial.md
# §Actions item 3 and skills/eu-data/SKILL.md). Script Automation Rule
# (CLAUDE.md): dropped in scripts/weekly/ so day-runner picks it up — no
# config, no GitHub Actions, no remembering.
#
# What it does: for a small watchlist of regulatory-radar-relevant EDP
# datasets, runs `dws eu-data search` (reuses the existing eu-data CLI —
# no new HTTP client) and diffs the result against the previous run's
# cached state. New dataset ids, or a changed `modified` timestamp on a
# known id, are written to a dated report under docs/regulatory-radar/edp-dataset-diffs/.
#
# Fail-loud discipline (matches eu-data's own contract): a query whose
# response isn't mode:"live" (blocked upstream, fixture fallback, error)
# is never treated as a diff signal and never overwrites that query's
# cached state — it's logged and skipped, exactly like cbam-price-fetch.sh
# leaves its cache file untouched on total fetch failure.
#
# Known gap, logged not hidden: the EDP Search API's `modified` field
# presence is unconfirmed (this repo's sandbox network policy blocks
# data.europa.eu — see the lab note's Live Verification Log). If a
# response has no `modified` on any dataset, this script falls back to
# id-presence diffing only and logs a one-line warning rather than
# silently pretending version-based diffing works.
#
# Code-Version: 1.0
# Date: 2026-07-19
# Owner: Lifetime Oy

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
STATE="${ROOT}/config/edp-dataset-state.json"
REPORT_DIR="${ROOT}/docs/regulatory-radar/edp-dataset-diffs"
STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DATE="$(date -u +%Y-%m-%d)"

log() { echo "[EDP-DIFF] $*"; }

# Regulatory-radar-relevant watchlist — matches the lab note's onboarding
# dataset shortlist and its explicit "Testing targets" pick (Eurostat, for
# its high update cadence, as the version-diff exercise dataset).
QUERIES=(
  "verified emissions"
  "E-PRTR industrial emissions"
  "Eurostat energy statistics"
)

if ! command -v dws >/dev/null 2>&1; then
  log "WARN: 'dws' CLI not on PATH (run 'npm link' in cli/) — skipping this run"
  exit 1
fi

mkdir -p "${REPORT_DIR}"
[ -f "${STATE}" ] || echo '{"queries":{}}' > "${STATE}"

DIFFS="[]"
ANY_LIVE=0
NO_MODIFIED_WARNED=0

for QUERY in "${QUERIES[@]}"; do
  RESPONSE="$(dws eu-data search "${QUERY}" --limit 5 --json 2>/dev/null)" || {
    log "WARN: search failed for '${QUERY}' — leaving cached state untouched"
    continue
  }

  MODE="$(echo "${RESPONSE}" | jq -r '.mode // empty')"
  if [ "${MODE}" != "live" ]; then
    log "WARN: '${QUERY}' returned mode='${MODE:-none}' (not live) — leaving cached state untouched"
    continue
  fi

  ANY_LIVE=1

  if [ "${NO_MODIFIED_WARNED}" -eq 0 ]; then
    HAS_MODIFIED="$(echo "${RESPONSE}" | jq -r '[.results[]?.modified] | map(select(. != null)) | length')"
    if [ "${HAS_MODIFIED}" = "0" ]; then
      log "WARN: EDP search response has no 'modified'/'issued' field on any dataset — falling back to id-presence diffing only for this run. Verify the live Search API schema and update parseEdpSearch() in cli/src/cli.ts if the field is named differently."
      NO_MODIFIED_WARNED=1
    fi
  fi

  PREV="$(jq -r --arg q "${QUERY}" '.queries[$q].datasets // {}' "${STATE}")"
  NEW="$(echo "${RESPONSE}" | jq '[.results[] | {(.id): {title, modified}}] | add // {}')"

  QUERY_DIFFS="$(jq -n --argjson prev "${PREV}" --argjson new "${NEW}" '
    [ $new | to_entries[] | . as $e |
      ($prev[$e.key]) as $p |
      if $p == null then
        {id: $e.key, title: $e.value.title, change: "new", modified: $e.value.modified}
      elif ($e.value.modified != null and $p.modified != $e.value.modified) then
        {id: $e.key, title: $e.value.title, change: "modified", from: $p.modified, to: $e.value.modified}
      else empty end
    ]')"

  DIFF_COUNT="$(echo "${QUERY_DIFFS}" | jq 'length')"
  if [ "${DIFF_COUNT}" -gt 0 ]; then
    log "${QUERY}: ${DIFF_COUNT} change(s)"
    DIFFS="$(jq -n --argjson acc "${DIFFS}" --arg q "${QUERY}" --argjson d "${QUERY_DIFFS}" \
      '$acc + [{query: $q, changes: $d}]')"
  else
    log "${QUERY}: no change"
  fi

  jq --arg q "${QUERY}" --argjson datasets "${NEW}" --arg t "${STAMP}" \
    '.queries[$q] = {lastChecked: $t, datasets: $datasets}' \
    "${STATE}" > "${STATE}.tmp"
  mv "${STATE}.tmp" "${STATE}"
done

if [ "${ANY_LIVE}" -eq 0 ]; then
  log "ERROR: all watched queries failed or were non-live — no diff performed this run"
  exit 1
fi

DIFF_TOTAL="$(echo "${DIFFS}" | jq 'length')"
if [ "${DIFF_TOTAL}" -gt 0 ]; then
  REPORT="${REPORT_DIR}/${DATE}.json"
  jq -n --arg scanDate "${STAMP}" --argjson diffs "${DIFFS}" \
    '{scanDate: $scanDate, source: "data.europa.eu Search API", license: "per-dataset (see eu-data provenance)", diffs: $diffs}' \
    > "${REPORT}"
  log "Wrote ${REPORT} (${DIFF_TOTAL} querie(s) with changes)"
else
  log "No dataset-version changes across watchlist — no report written"
fi
