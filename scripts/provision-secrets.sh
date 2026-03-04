#!/usr/bin/env bash
# provision-secrets.sh — Provision .env and .env.mcp keys to Google Secret Manager
#
# Usage:
#   ./scripts/provision-secrets.sh                      # reads .env + .env.mcp
#   ./scripts/provision-secrets.sh --env .env.production # reads specific file
#   ./scripts/provision-secrets.sh --dry-run             # preview only
#
# Requirements:
#   - gcloud CLI authenticated (gcloud auth login)
#   - Secret Manager API enabled (gcloud services enable secretmanager.googleapis.com)
#
# Secret naming convention:
#   ENV_VAR_NAME → env-var-name  (lowercase, underscores to hyphens)
#   Example: SUPABASE_SERVICE_KEY → supabase-service-key

set -euo pipefail

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}"
REGION="europe-north1"
DRY_RUN=false
ENV_FILES=()

# Service account that needs access to these secrets
SERVICE_ACCOUNTS=(
    "mcp-gateway@${PROJECT_ID}.iam.gserviceaccount.com"
    "sales-agents@${PROJECT_ID}.iam.gserviceaccount.com"
)

# Keys to SKIP (not secrets, just config)
SKIP_KEYS=(
    "NODE_ENV"
    "PORT"
    "CORS_ORIGIN"
    "RATE_LIMIT_WINDOW_MS"
    "RATE_LIMIT_MAX_REQUESTS"
    "FIREHORSE_SCHEDULER_ENABLED"
    "FIREHORSE_DAILY_JOB_TIME"
    "FIREHORSE_FOLLOWUP_JOB_INTERVAL"
    "FIREHORSE_MAX_DAILY_LEADS"
    "ERP_SCHEDULER_ENABLED"
    "ERP_APPROVAL_GATE_ENABLED"
    "ERP_AUTO_APPROVE_LOW_RISK"
    "ERP_APPROVAL_TIMEOUT_MINUTES"
    "ERP_REQUIRE_DUAL_APPROVAL"
    "MONITOR_ERP_ENABLED"
    "IFS_ENABLED"
    "DYNAMICS_365_ENABLED"
    "SAP_ENABLED"
    "VISMA_ENABLED"
    "JEEVES_ENABLED"
    "WORLDFAVOR_ENABLED"
    "POSITION_GREEN_ENABLED"
    "EMAIL_SERVICE"
    "FROM_NAME"
    "LOG_LEVEL"
)

# ---------------------------------------------------------------------------
# Parse args
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dry-run) DRY_RUN=true; shift ;;
        --env) ENV_FILES+=("$2"); shift 2 ;;
        --project) PROJECT_ID="$2"; shift 2 ;;
        *) echo "Unknown arg: $1"; exit 1 ;;
    esac
done

# Default env files
if [[ ${#ENV_FILES[@]} -eq 0 ]]; then
    for f in .env .env.mcp; do
        [[ -f "$f" ]] && ENV_FILES+=("$f")
    done
fi

if [[ ${#ENV_FILES[@]} -eq 0 ]]; then
    echo "ERROR: No .env files found. Provide --env <path>."
    exit 1
fi

echo "=== DWS Secret Manager Provisioning ==="
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Files:    ${ENV_FILES[*]}"
echo "Dry run:  ${DRY_RUN}"
echo ""

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
to_secret_name() {
    # SUPABASE_SERVICE_KEY → supabase-service-key
    echo "$1" | tr '[:upper:]' '[:lower:]' | tr '_' '-'
}

is_skipped() {
    local key="$1"
    for skip in "${SKIP_KEYS[@]}"; do
        [[ "$key" == "$skip" ]] && return 0
    done
    return 1
}

is_placeholder() {
    local val="$1"
    # Skip placeholder/empty values
    [[ -z "$val" ]] && return 0
    [[ "$val" == "your-"* ]] && return 0
    [[ "$val" == "YOUR-"* ]] && return 0
    [[ "$val" == *"-here" ]] && return 0
    [[ "$val" == *"-HERE" ]] && return 0
    return 1
}

# ---------------------------------------------------------------------------
# Process env files
# ---------------------------------------------------------------------------
CREATED=0
UPDATED=0
SKIPPED=0

for envfile in "${ENV_FILES[@]}"; do
    echo "--- Processing: ${envfile} ---"

    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and blank lines
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ "$line" =~ ^[[:space:]]*$ ]] && continue

        # Parse KEY=VALUE
        key="${line%%=*}"
        value="${line#*=}"

        # Strip surrounding quotes from value
        value="${value#\"}"
        value="${value%\"}"
        value="${value#\'}"
        value="${value%\'}"

        # Skip non-secret config keys
        if is_skipped "$key"; then
            echo "  SKIP (config): ${key}"
            ((SKIPPED++))
            continue
        fi

        # Skip placeholders
        if is_placeholder "$value"; then
            echo "  SKIP (placeholder): ${key}"
            ((SKIPPED++))
            continue
        fi

        secret_name=$(to_secret_name "$key")

        if $DRY_RUN; then
            echo "  WOULD CREATE: ${secret_name} ← ${key} (${#value} chars)"
            continue
        fi

        # Check if secret already exists
        if gcloud secrets describe "$secret_name" --project="$PROJECT_ID" &>/dev/null; then
            # Secret exists — add new version
            echo -n "$value" | gcloud secrets versions add "$secret_name" \
                --project="$PROJECT_ID" \
                --data-file=-
            echo "  UPDATED: ${secret_name}"
            ((UPDATED++))
        else
            # Create new secret
            echo -n "$value" | gcloud secrets create "$secret_name" \
                --project="$PROJECT_ID" \
                --data-file=- \
                --replication-policy="automatic"
            echo "  CREATED: ${secret_name}"
            ((CREATED++))

            # Grant access to service accounts
            for sa in "${SERVICE_ACCOUNTS[@]}"; do
                gcloud secrets add-iam-policy-binding "$secret_name" \
                    --project="$PROJECT_ID" \
                    --member="serviceAccount:${sa}" \
                    --role="roles/secretmanager.secretAccessor" \
                    --quiet 2>/dev/null || true
            done
        fi

    done < "$envfile"

    echo ""
done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "=== Summary ==="
echo "Created:  ${CREATED}"
echo "Updated:  ${UPDATED}"
echo "Skipped:  ${SKIPPED}"
echo ""
echo "Secrets are accessible to:"
for sa in "${SERVICE_ACCOUNTS[@]}"; do
    echo "  - ${sa}"
done
echo ""
echo "Verify with: gcloud secrets list --project=${PROJECT_ID}"
