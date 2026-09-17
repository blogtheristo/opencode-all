#!/usr/bin/env bash
# mgd-game-recheck-quarterly-gate.sh
#
# Recipe step 8 (SCHEDULE) of the dominant-game recipe
# (docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md §4 step 8):
# "Re-check the game quarterly. Dominant games shift ... Fold into the existing
#  /retro -> /learn loop: is MGD still the metric the buyer is compelled to
#  maximize, or has enforcement/regulation moved the game again?"
#
# Runs DAILY under scripts/daily/ (DGX Spark day-runner auto-discovers — see
# scripts/daily/README.md: "Drop any file here and it runs. No remembering.").
# Acts ONLY on the first day of each calendar quarter (Jan 1 / Apr 1 / Jul 1 /
# Oct 1); any other day it exits quietly. No human-memory dependency
# (CLAUDE.md Script Automation Rule).
#
# On a quarter-start day it PRODUCES the data (the /retro -> /learn loop
# EVALUATES it):
#   1. Runs scripts/compute-mgd.mjs for the current + prior quarter (trend).
#      Fail-loud aware: if MGD cannot be computed (schema gap, exit 2) it
#      records the named gap — never a proxy (Rule 12).
#   2. Sets a boolean flag: did any deprecated anti-game phrase appear in agent
#      outputs since last check (scripts/lint-truth-claims.mjs over
#      $MGD_AGENT_OUTPUTS_DIR)? If no corpus is configured it records
#      "not-scanned" rather than a false "clean" (Rule 12).
#   3. Writes a dated artifact to docs/retros/ ending with the standing
#      question "Is MGD still the dominant game?" — docs/retros/ is a /learn
#      gather source (see .claude/commands/learn.md).
#   4. Commits to the current feature branch (refuses main/master).
#
# Config (env): SUPABASE_URL + SUPABASE_SERVICE_KEY (live agent_executions table,
#   preferred) OR MGD_LOGS (offline agent_executions export JSON file/dir);
#   MGD_AGENT_OUTPUTS_DIR (dir of agent-produced .md/.txt/.html to lint).
# Idempotent: if this quarter's artifact already exists, exits without change.

set -uo pipefail

REPO_ROOT="${REPO_ROOT:-$(git -C "$(dirname "$0")/../.." rev-parse --show-toplevel 2>/dev/null || echo "$(cd "$(dirname "$0")/../.." && pwd)")}"
cd "${REPO_ROOT}"

MONTH="$(date -u +%m)"
DAY="$(date -u +%d)"
YEAR="$(date -u +%Y)"
TODAY="$(date -u +%Y-%m-%d)"

# Quarter-start gate: only act on Jan 1 / Apr 1 / Jul 1 / Oct 1.
if [ "${DAY}" != "01" ]; then exit 0; fi
case "${MONTH}" in
  01) Q=1; CUR_FROM="${YEAR}-01-01"; CUR_TO="${YEAR}-03-31"; PY=$((YEAR-1)); PRIOR_FROM="${PY}-10-01"; PRIOR_TO="${PY}-12-31"; PLABEL="Q4 ${PY}" ;;
  04) Q=2; CUR_FROM="${YEAR}-04-01"; CUR_TO="${YEAR}-06-30"; PRIOR_FROM="${YEAR}-01-01"; PRIOR_TO="${YEAR}-03-31"; PLABEL="Q1 ${YEAR}" ;;
  07) Q=3; CUR_FROM="${YEAR}-07-01"; CUR_TO="${YEAR}-09-30"; PRIOR_FROM="${YEAR}-04-01"; PRIOR_TO="${YEAR}-06-30"; PLABEL="Q2 ${YEAR}" ;;
  10) Q=4; CUR_FROM="${YEAR}-10-01"; CUR_TO="${YEAR}-12-31"; PRIOR_FROM="${YEAR}-07-01"; PRIOR_TO="${YEAR}-09-30"; PLABEL="Q3 ${YEAR}" ;;
  *) exit 0 ;;
esac

QLABEL="Q${Q} ${YEAR}"
ARTIFACT="docs/retros/${YEAR}-Q${Q}-mgd-game-recheck.md"

if [ -f "${ARTIFACT}" ]; then
  echo "[mgd-recheck] ${ARTIFACT} already exists — nothing to do."
  exit 0
fi

MGD_LOGS="${MGD_LOGS:-}"
MGD_AGENT_OUTPUTS_DIR="${MGD_AGENT_OUTPUTS_DIR:-}"

# Data source: agent outcomes live in the Supabase agent_executions table, not
# git. Prefer the live table when credentials are present; else an offline
# --logs export; else record "unavailable" (never a proxy).
MGD_SOURCE=""
if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_SERVICE_KEY:-}" ]; then
  MGD_SOURCE="--supabase"
elif [ -n "${MGD_LOGS}" ] && [ -e "${MGD_LOGS}" ]; then
  MGD_SOURCE="--logs ${MGD_LOGS}"
fi

# --- 1. Compute MGD for current + prior quarter (fail-loud aware) ------------
run_mgd() { # $1=from $2=to  -> prints "GAP" / "NOLOGS" / "ERR" or the count
  if [ -z "${MGD_SOURCE}" ]; then echo "NOLOGS"; return; fi
  local out rc
  out="$(node scripts/compute-mgd.mjs ${MGD_SOURCE} --from "${1}T00:00:00.000Z" --to "${2}T23:59:59.999Z" 2>/dev/null)"
  rc=$?
  if [ "${rc}" = "2" ]; then echo "GAP"; return; fi
  if [ "${rc}" != "0" ]; then echo "ERR"; return; fi
  node -e "process.stdout.write(String(JSON.parse(require('fs').readFileSync(0,'utf8')).totals.governedDecisions))" <<<"${out}"
}

CUR_MGD="$(run_mgd "${CUR_FROM}" "${CUR_TO}")"
PRIOR_MGD="$(run_mgd "${PRIOR_FROM}" "${PRIOR_TO}")"

# Trend (deterministic; only when both are integers)
TREND="n/a"
if [[ "${CUR_MGD}" =~ ^[0-9]+$ && "${PRIOR_MGD}" =~ ^[0-9]+$ ]]; then
  if   [ "${CUR_MGD}" -gt "${PRIOR_MGD}" ]; then TREND="up (▲ $((CUR_MGD-PRIOR_MGD)))";
  elif [ "${CUR_MGD}" -lt "${PRIOR_MGD}" ]; then TREND="down (▼ $((PRIOR_MGD-CUR_MGD)))";
  else TREND="flat (▬)"; fi
fi

MGD_LINE="${CUR_MGD}"
case "${CUR_MGD}" in
  GAP)    MGD_LINE="SCHEMA GAP — not computed (see migration 075; no proxy per Rule 12)";;
  NOLOGS) MGD_LINE="source unavailable — set SUPABASE_URL+SUPABASE_SERVICE_KEY (live) or MGD_LOGS (export)";;
  ERR)    MGD_LINE="compute-mgd error — investigate";;
esac

# --- 2. Anti-game phrase flag over agent outputs ----------------------------
ANTIGAME_FLAG="not-scanned"
if [ -n "${MGD_AGENT_OUTPUTS_DIR}" ] && [ -e "${MGD_AGENT_OUTPUTS_DIR}" ]; then
  if node scripts/lint-truth-claims.mjs "${MGD_AGENT_OUTPUTS_DIR}" --json >/tmp/mgd-lint.json 2>/dev/null; then
    ANTIGAME_FLAG="false"   # exit 0 = no deprecated phrases
  else
    ANTIGAME_FLAG="true"    # exit 1 = a deprecated anti-game phrase appeared
  fi
fi

# --- 3. Write the /retro -> /learn check item -------------------------------
mkdir -p docs/retros
cat > "${ARTIFACT}" <<EOF
# Quarterly Game Re-check — ${QLABEL}

> Auto-produced by \`scripts/daily/mgd-game-recheck-quarterly-gate.sh\` on ${TODAY}
> (dominant-game recipe step 8). The **/retro -> /learn** loop evaluates this;
> the script only produces the data.

## Standing question

**Is MGD still the dominant game?** — i.e. is Monthly Governed Decisions still the
metric the buyer is compelled to maximize (CBAM/CSRD/EU AI Act enforcement), or has
regulation/enforcement moved the game again? (field-note §4 step 8, §3.)

## This quarter's data

| Signal                                   | Value                          |
| ---------------------------------------- | ------------------------------ |
| MGD — ${QLABEL} (current)                | ${MGD_LINE}                    |
| MGD — ${PLABEL} (prior)                  | ${PRIOR_MGD}                   |
| Trend                                    | ${TREND}                       |
| CRC (Customer-Retained Capital)          | not derivable from logs — join 4P asset inventory (\`/mgd-report\`) |
| Deprecated anti-game phrase in agent outputs since last check? | ${ANTIGAME_FLAG} |

## For /retro -> /learn to evaluate

- If MGD is **down or flat** while enforcement intensified → diagnose which decision
  classes stopped flowing through the governed outcome layer.
- If the anti-game flag is **true** → a deprecated phrasing (agent/skill/workflow count,
  or benchmark/token/pilot framing as a success claim) resurfaced; run \`/truth-check\`
  and correct the copy (\`dws10.com/config/metrics-northstar.json\`).
- If the buyer's compulsory metric has shifted → propose the new dominant game and
  re-register §2 row 29 (never silently swap the north-star, field-note §5 step 5).

Canonical: \`DWS_TRUTH_STANDARD.md\` §2 row 29 · \`docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md\`.
EOF

echo "[mgd-recheck] wrote ${ARTIFACT}"

# --- 4. Commit to the current feature branch (never main) -------------------
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [ "${BRANCH}" = "main" ] || [ "${BRANCH}" = "master" ]; then
  echo "[mgd-recheck] On ${BRANCH}; refusing to auto-commit. Artifact left for manual PR."
  exit 0
fi

git add "${ARTIFACT}"
if git diff --cached --quiet; then echo "[mgd-recheck] no changes."; exit 0; fi
git commit -m "retro: quarterly MGD game re-check — ${QLABEL}

Auto-produced by scripts/daily/mgd-game-recheck-quarterly-gate.sh
(dominant-game recipe step 8). Feeds the /retro -> /learn loop with the
standing question 'is MGD still the dominant game?', current/prior MGD,
trend, and the anti-game-phrase flag." || true
git push -u origin "${BRANCH}" || { echo "[mgd-recheck] push failed; retry manually."; exit 1; }
echo "[mgd-recheck] done."
