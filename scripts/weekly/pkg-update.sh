#!/usr/bin/env bash
# pkg-update.sh — Weekly public package version check and safe update.
#
# Scans all package.json workspaces and Python requirements across the repo,
# applies safe semver-compatible npm updates (within ^ / ~ ranges), reports
# Python outdated packages for manual review, highlights connector and cloud
# SDK version changes (Supabase, AWS SDK v3, GCP, Stripe, OpenTelemetry),
# flags Admin docs / ontology files that may need a manual review, and checks
# platform tooling versions: .NET Aspire Dashboard container, Aiven MCP package,
# and Google Cloud SDK (gcloud CLI + setup-gcloud GHA action).
#
# Auto-discovered by infrastructure/dgx-spark/day-runner.sh (weekly folder).
# Runs every Monday 05:00 UTC on DGX Spark.
# Creates a GitHub issue with the full update report.
# Commits package-lock changes when npm update applies patches.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

DATE="$(date -u +%Y-%m-%d)"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
LOG_DIR="$REPO_ROOT/logs/pkg-update"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/$DATE.log"

echo "[pkg-update] Starting at $TIMESTAMP" | tee -a "$LOG"

# ─── npm workspace list ───────────────────────────────────────────────────────
# Canonical set of independent package.json roots (no node_modules, no _OLD,
# no landing-pages mirrors, no artifact snapshots, no .claude worktrees).
WORKSPACES=(
  "."
  "cli"
  "dws6.com/dashboard/firehorse/v10-react"
  "dws6.com/tools/content-pipeline"
  "Firehorse/mobile-app"
  "infrastructure/dgx-spark/bumblebee"
  "lambda/ses-inbound-parser"
  "mcp-hub-ts"
  "mcp-servers/cloud-run-gateway-ts"
  "mobile-dashboard"
  "src/cloudflare"
)

# ─── Connector / cloud SDK patterns to highlight in the report ────────────────
CONNECTOR_PATTERNS=(
  "@supabase/"
  "@aws-sdk/"
  "google-cloud"
  "google-auth"
  "@opentelemetry/"
  "stripe"
  "@upstash/"
  "nodemailer"
  "playwright"
  "axios"
  "jsonwebtoken"
)

REPORT="$(mktemp)"
trap 'rm -f "$REPORT"' EXIT

{
  echo "# Weekly Package Update Report — $DATE"
  echo
  echo "**Triggered by:** dgx-spark cron (Monday 05:00 UTC)"
  echo "**Script:** \`scripts/weekly/pkg-update.sh\`"
  echo
} > "$REPORT"

CHANGED_WORKSPACES=()
CONNECTOR_HITS=()

# ─── npm workspace scan ───────────────────────────────────────────────────────
{
  echo "## npm Packages"
  echo
} >> "$REPORT"

for WS in "${WORKSPACES[@]}"; do
  PKG_JSON="$REPO_ROOT/$WS/package.json"
  [ -f "$PKG_JSON" ] || continue

  echo "[pkg-update] Scanning npm: $WS" | tee -a "$LOG"

  OUTDATED_JSON="$LOG_DIR/${DATE}-$(echo "$WS" | tr '/' '_')-outdated.json"

  # npm outdated exits non-zero when packages are outdated — use || true
  (cd "$REPO_ROOT/$WS" && npm outdated --json 2>/dev/null || true) > "$OUTDATED_JSON"

  # Count outdated packages via node
  OUTDATED_COUNT=0
  if [ -s "$OUTDATED_JSON" ] && command -v node >/dev/null 2>&1; then
    OUTDATED_COUNT=$(node -e "
      try {
        const d = JSON.parse(require('fs').readFileSync('$OUTDATED_JSON', 'utf8'));
        console.log(Object.keys(d).length);
      } catch(e) { console.log(0); }
    " 2>/dev/null || echo 0)
  fi

  if [ "$OUTDATED_COUNT" -gt 0 ]; then
    {
      echo "### \`$WS\` — $OUTDATED_COUNT outdated"
      echo
      echo '```'
      (cd "$REPO_ROOT/$WS" && npm outdated 2>/dev/null || true)
      echo '```'
      echo
    } >> "$REPORT"

    # Flag connector / SDK hits in this workspace
    for PAT in "${CONNECTOR_PATTERNS[@]}"; do
      if command -v node >/dev/null 2>&1 && node -e "
        try {
          const d = JSON.parse(require('fs').readFileSync('$OUTDATED_JSON', 'utf8'));
          process.exit(Object.keys(d).some(k => k.includes('$PAT')) ? 0 : 1);
        } catch(e) { process.exit(1); }
      " 2>/dev/null; then
        CONNECTOR_HITS+=("$WS → $PAT")
      fi
    done

    # Apply safe semver update (respects ^ / ~ in package.json — no major bumps)
    echo "[pkg-update] Applying npm update in $WS" | tee -a "$LOG"
    (cd "$REPO_ROOT/$WS" && npm update --save 2>&1 | tail -5 || true) | tee -a "$LOG"
    CHANGED_WORKSPACES+=("$WS")
  else
    echo "### \`$WS\` — all up to date" >> "$REPORT"
    echo >> "$REPORT"
  fi
done

# ─── Python requirements scan ────────────────────────────────────────────────
{
  echo "---"
  echo "## Python Packages"
  echo
  echo "> Python packages are **reported only** — not auto-updated."
  echo "> Apply security-tool upgrades (pip-audit, safety, bandit) via:"
  echo "> \`pip install --upgrade pip-audit safety bandit\`"
  echo
} >> "$REPORT"

PY_REQS=(
  "requirements.txt"
  "mcp-servers/cloud-run-gateway/requirements.txt"
)

for REQ in "${PY_REQS[@]}"; do
  REQ_PATH="$REPO_ROOT/$REQ"
  [ -f "$REQ_PATH" ] || continue

  echo "[pkg-update] Scanning Python: $REQ" | tee -a "$LOG"

  PY_OUTDATED=""
  if command -v pip >/dev/null 2>&1; then
    PY_OUTDATED=$(pip list --outdated --format=columns 2>/dev/null | tail -n +3 || true)
  fi

  {
    echo "### \`$REQ\`"
    echo
  } >> "$REPORT"

  if [ -n "$PY_OUTDATED" ]; then
    {
      echo '```'
      echo "Package                 Version   Latest"
      echo "----------------------- --------- ------"
      echo "$PY_OUTDATED"
      echo '```'
      echo
    } >> "$REPORT"

    # Flag GCP SDK hits
    if echo "$PY_OUTDATED" | grep -qi "google-cloud"; then
      CONNECTOR_HITS+=("$REQ → google-cloud-* (Python)")
    fi
  else
    echo "All packages up to date (or pip unavailable in this environment)." >> "$REPORT"
    echo >> "$REPORT"
  fi
done

# ─── Connector / cloud SDK summary ───────────────────────────────────────────
{
  echo "---"
  echo "## Connector & Cloud SDK Highlights"
  echo
} >> "$REPORT"

if [ ${#CONNECTOR_HITS[@]} -eq 0 ]; then
  echo "No outdated connector or cloud SDK packages found this week." >> "$REPORT"
else
  {
    echo "These connector / cloud SDK packages were outdated. Safe updates applied within semver range."
    echo "Review the npm tables above for any \`wanted ≠ latest\` major-version gaps requiring manual action."
    echo
    for HIT in "${CONNECTOR_HITS[@]}"; do
      echo "- $HIT"
    done
    echo
    echo "### Breaking-change watchlist"
    echo
    echo "| Package | Common breaking-change pattern | Action |"
    echo "|---------|-------------------------------|--------|"
    echo "| \`@supabase/supabase-js\` | Auth API changes (v2→v3) | Test sign-in flows |"
    echo "| \`@aws-sdk/client-*\` | v3 modular command shape | Check Lambda handler |"
    echo "| \`stripe\` | Webhook signature, event types | Test checkout flow |"
    echo "| \`@opentelemetry/*\` | Exporter / span API | Check OTEL pipeline |"
    echo "| \`playwright\` | Browser binary path | Re-run \`npx playwright install\` |"
    echo "| \`jsonwebtoken\` | Algorithm defaults | Verify RS256 config |"
  } >> "$REPORT"
fi
echo >> "$REPORT"

# ─── Admin docs version reference scan ───────────────────────────────────────
{
  echo "---"
  echo "## Admin Documentation — Version Reference Scan"
  echo
} >> "$REPORT"

ADMIN_MANUAL="$REPO_ROOT/Admin/ADMIN_MANUAL.md"
if [ -f "$ADMIN_MANUAL" ]; then
  VERSION_REFS=$(grep -nE '(@[0-9]+\.[0-9]+|v[0-9]+\.[0-9]+\.[0-9]+|"[0-9]+\.[0-9]+\.[0-9]+")' \
    "$ADMIN_MANUAL" 2>/dev/null | head -20 || true)

  if [ -n "$VERSION_REFS" ]; then
    {
      echo "Version strings found in \`Admin/ADMIN_MANUAL.md\` — verify these match updated packages:"
      echo
      echo '```'
      echo "$VERSION_REFS"
      echo '```'
      echo
    } >> "$REPORT"
  else
    echo "No hardcoded version strings detected in ADMIN_MANUAL.md — OK." >> "$REPORT"
    echo >> "$REPORT"
  fi
else
  echo "\`Admin/ADMIN_MANUAL.md\` not found at expected path — skipping." >> "$REPORT"
  echo >> "$REPORT"
fi

# ─── Ontology files — technology reference scan ───────────────────────────────
{
  echo "---"
  echo "## Ontology Files — Technology Reference Scan"
  echo
} >> "$REPORT"

ONTOLOGY_FILES=(
  "scripts/parse-ontology.ts"
  "onelifetime.world/posts/dws-ontology-standard-v1.html"
)

ONT_AFFECTED=0
for ONT in "${ONTOLOGY_FILES[@]}"; do
  ONT_PATH="$REPO_ROOT/$ONT"
  [ -f "$ONT_PATH" ] || continue

  ONT_HITS=$(grep -inE \
    '(supabase|aws-sdk|google-cloud|stripe|playwright|opentelemetry|@upstash|nodemailer|axios)' \
    "$ONT_PATH" 2>/dev/null | head -10 || true)

  if [ -n "$ONT_HITS" ]; then
    ONT_AFFECTED=$((ONT_AFFECTED + 1))
    {
      echo "### \`$ONT\` — technology references detected"
      echo
      echo '```'
      echo "$ONT_HITS"
      echo '```'
      echo
      echo "> If any referenced packages received breaking updates this week, verify the ontology content is still accurate."
      echo
    } >> "$REPORT"
  else
    echo "### \`$ONT\` — no tracked package references" >> "$REPORT"
    echo >> "$REPORT"
  fi
done

if [ "$ONT_AFFECTED" -eq 0 ]; then
  echo "No ontology files reference packages updated this week — no action needed." >> "$REPORT"
  echo >> "$REPORT"
fi

# ─── User surfaces summary ───────────────────────────────────────────────────
{
  echo "---"
  echo "## User Surfaces Affected"
  echo
  echo "| Surface | Package root | Connector SDKs |"
  echo "|---------|-------------|----------------|"
  echo "| Backend API | \`.\` | supabase, stripe, jwt, nodemailer, otel |"
  echo "| DWS CLI | \`cli/\` | — |"
  echo "| Firehorse dashboard | \`dws6.com/dashboard/firehorse/v10-react/\` | supabase |"
  echo "| Mobile app | \`Firehorse/mobile-app/\` | supabase |"
  echo "| Mobile dashboard | \`mobile-dashboard/\` | — |"
  echo "| Content pipeline | \`dws6.com/tools/content-pipeline/\` | — |"
  echo "| Lambda (SES inbound) | \`lambda/ses-inbound-parser/\` | aws-sdk/s3, aws-sdk/secrets |"
  echo "| MCP hub | \`mcp-hub-ts/\` | supabase |"
  echo "| Cloud Run gateway | \`mcp-servers/cloud-run-gateway-ts/\` | supabase |"
  echo "| DGX Bumblebee | \`infrastructure/dgx-spark/bumblebee/\` | — |"
  echo "| Cloudflare Worker | \`src/cloudflare/\` | — |"
  echo "| GCP gateway (Python) | \`mcp-servers/cloud-run-gateway/\` | google-cloud-secret-manager |"
  echo
} >> "$REPORT"

# ─── .NET Aspire Dashboard container version check ───────────────────────────
# Aspire Dashboard runs on DGX Spark as the OTLP/metrics UI for Bumblebee.
# Current image: mcr.microsoft.com/dotnet/aspire-dashboard
# Version is pinned in infrastructure/dgx-spark/docker-compose.yml
{
  echo "---"
  echo "## .NET Aspire Dashboard"
  echo
} >> "$REPORT"

ASPIRE_COMPOSE="$REPO_ROOT/infrastructure/dgx-spark/docker-compose.yml"
ASPIRE_PINNED=""
ASPIRE_LATEST=""

if [ -f "$ASPIRE_COMPOSE" ]; then
  ASPIRE_PINNED=$(grep -oE 'aspire-dashboard:[0-9]+\.[0-9]+(\.[0-9]+)?' "$ASPIRE_COMPOSE" | head -1 | cut -d: -f2 || true)
fi

# Query MCR for latest tag (requires curl + jq or python)
if command -v curl >/dev/null 2>&1 && command -v python3 >/dev/null 2>&1; then
  ASPIRE_LATEST=$(curl -sf \
    "https://mcr.microsoft.com/v2/dotnet/aspire-dashboard/tags/list" 2>/dev/null \
    | python3 -c "
import sys, json
data = json.load(sys.stdin)
tags = [t for t in data.get('tags', []) if t[0].isdigit() and 'preview' not in t and 'rc' not in t]
tags.sort(key=lambda t: [int(x) for x in t.split('.')], reverse=True)
print(tags[0] if tags else '')
" 2>/dev/null || true)
fi

{
  echo "| | Version |"
  echo "|---|---|"
  echo "| Pinned in docker-compose.yml | \`${ASPIRE_PINNED:-unknown}\` |"
  echo "| Latest stable on MCR | \`${ASPIRE_LATEST:-could not fetch}\` |"
  echo
} >> "$REPORT"

if [ -n "$ASPIRE_PINNED" ] && [ -n "$ASPIRE_LATEST" ] && [ "$ASPIRE_PINNED" != "$ASPIRE_LATEST" ]; then
  {
    echo "> **Action:** Update \`aspire-dashboard:$ASPIRE_PINNED\` → \`$ASPIRE_LATEST\` in"
    echo "> \`infrastructure/dgx-spark/docker-compose.yml\`, then \`docker compose pull && docker compose up -d\`."
    echo
  } >> "$REPORT"
else
  echo "Aspire Dashboard is current — no update needed." >> "$REPORT"
  echo >> "$REPORT"
fi

# ─── Aiven MCP package version check ─────────────────────────────────────────
# mcp-aiven is installed globally on DGX Spark: npm install -g mcp-aiven
# Config: mcp-hub/config/aiven-mcp.json
{
  echo "---"
  echo "## Aiven MCP Package (\`mcp-aiven\`)"
  echo
} >> "$REPORT"

AIVEN_INSTALLED=$(npm list -g --depth=0 --json 2>/dev/null \
  | node -e "
    try {
      const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
      const v = (d.dependencies || {})['mcp-aiven'];
      console.log(v ? v.version : '');
    } catch(e) { console.log(''); }
  " 2>/dev/null || true)

AIVEN_LATEST=$(npm view mcp-aiven version 2>/dev/null || true)

{
  echo "| | Version |"
  echo "|---|---|"
  echo "| Installed (global) | \`${AIVEN_INSTALLED:-not installed}\` |"
  echo "| Latest on npm | \`${AIVEN_LATEST:-could not fetch}\` |"
  echo
} >> "$REPORT"

if [ -n "$AIVEN_INSTALLED" ] && [ -n "$AIVEN_LATEST" ] && [ "$AIVEN_INSTALLED" != "$AIVEN_LATEST" ]; then
  echo "[pkg-update] Updating mcp-aiven $AIVEN_INSTALLED → $AIVEN_LATEST ..." | tee -a "$LOG"
  npm install -g "mcp-aiven@$AIVEN_LATEST" 2>&1 | tail -3 | tee -a "$LOG" || true
  {
    echo "> Auto-updated global \`mcp-aiven\` to $AIVEN_LATEST."
    echo "> Verify with \`mcp-aiven --help\` on DGX Spark."
    echo
  } >> "$REPORT"
else
  echo "\`mcp-aiven\` is current — no update needed." >> "$REPORT"
  echo >> "$REPORT"
fi

# ─── Google Cloud SDK (gcloud) version check ─────────────────────────────────
# gcloud CLI is used for Cloud Run deployments and Docker registry auth.
# GHA action: google-github-actions/setup-gcloud@v1 (pinned in deploy workflows)
{
  echo "---"
  echo "## Google Cloud SDK (\`gcloud\`)"
  echo
} >> "$REPORT"

GCLOUD_LOCAL=""
if command -v gcloud >/dev/null 2>&1; then
  GCLOUD_LOCAL=$(gcloud version 2>/dev/null | grep "Google Cloud SDK" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)
fi

# Latest gcloud version from release notes JSON
GCLOUD_LATEST=$(curl -sf \
  "https://dl.google.com/dl/cloudsdk/channels/rapid/components-2.json" 2>/dev/null \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
v = data.get('version', {})
print(v if isinstance(v, str) else '')
" 2>/dev/null || true)

# GHA action pin scan
GHA_GCLOUD_PIN=$(grep -rh "setup-gcloud@" .github/workflows/ 2>/dev/null \
  | grep -oE 'setup-gcloud@[^"'\'' ]+' | sort -u | tr '\n' ' ' || true)

{
  echo "| | Version |"
  echo "|---|---|"
  echo "| gcloud CLI on this machine | \`${GCLOUD_LOCAL:-not installed / not in PATH}\` |"
  echo "| Latest gcloud release | \`${GCLOUD_LATEST:-could not fetch}\` |"
  echo "| GHA action pins | \`${GHA_GCLOUD_PIN:-none found}\` |"
  echo
} >> "$REPORT"

if [ -n "$GCLOUD_LOCAL" ] && [ -n "$GCLOUD_LATEST" ] && [ "$GCLOUD_LOCAL" != "$GCLOUD_LATEST" ]; then
  {
    echo "> **Action:** Run \`gcloud components update\` on DGX Spark and any dev machines."
    echo "> On DGX (CMD syntax): \`gcloud components update --quiet\`"
    echo
  } >> "$REPORT"
fi

# Check if GHA workflows still use v1 (latest is v2)
if echo "$GHA_GCLOUD_PIN" | grep -q "setup-gcloud@v1"; then
  {
    echo "> **GHA action is pinned to \`v1\`** — consider bumping to \`v2\` in \`.github/workflows/deploy-cloudrun.yml\`"
    echo "> and \`deploy-staging.yml\`. v2 drops the deprecated \`project_id\` input and adds Workload Identity."
    echo
  } >> "$REPORT"
fi

# ─── Commit package changes if any ───────────────────────────────────────────
if [ ${#CHANGED_WORKSPACES[@]} -gt 0 ]; then
  echo "[pkg-update] Committing npm update changes ..." | tee -a "$LOG"

  # Stage only package files — never stage .env, secrets, or unrelated files
  git add -- package.json package-lock.json 2>/dev/null || true
  for WS in "${CHANGED_WORKSPACES[@]}"; do
    [ "$WS" = "." ] && continue
    git add -- "$WS/package.json" "$WS/package-lock.json" 2>/dev/null || true
  done

  WS_LIST=$(IFS=', '; echo "${CHANGED_WORKSPACES[*]}")
  git diff --cached --quiet || git commit \
    --author "DGX Cron <2239436+blogtheristo@users.noreply.github.com>" \
    -m "chore: weekly npm update $DATE

Workspaces: $WS_LIST
Applied semver-compatible patches via npm update --save.
Major version upgrades require manual review (see GitHub issue)." \
    2>&1 | tee -a "$LOG" || true
else
  echo "[pkg-update] No npm changes to commit." | tee -a "$LOG"
fi

# ─── GitHub issue ─────────────────────────────────────────────────────────────
ISSUE_FILE="$LOG_DIR/$DATE-issue.md"
{
  cat "$REPORT"
  echo
  echo "---"
  echo "*Auto-generated by \`scripts/weekly/pkg-update.sh\` on DGX Spark · Monday 05:00 UTC*"
} > "$ISSUE_FILE"

CHANGED_COUNT="${#CHANGED_WORKSPACES[@]}"
CONNECTOR_COUNT="${#CONNECTOR_HITS[@]}"
ISSUE_TITLE="pkg-update $DATE — ${CHANGED_COUNT} workspace(s) updated, ${CONNECTOR_COUNT} SDK hit(s)"

if command -v gh >/dev/null 2>&1; then
  gh issue create \
    --title "$ISSUE_TITLE" \
    --body-file "$ISSUE_FILE" \
    --label "dependencies,automated" \
    2>&1 | tee -a "$LOG" \
    || echo "[pkg-update] gh issue create failed; report saved to $ISSUE_FILE"
else
  echo "[pkg-update] gh CLI not available; report saved to $ISSUE_FILE"
fi

echo "[pkg-update] Done at $(date -u +"%Y-%m-%dT%H:%M:%SZ")" | tee -a "$LOG"
