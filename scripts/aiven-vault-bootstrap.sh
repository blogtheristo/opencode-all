#!/usr/bin/env bash
# aiven-vault-bootstrap.sh — one-shot Aiven vault provisioning for DWS IQ 6
#
# Prereqs:
#   - AIVEN_TOKEN exported (https://console.aiven.io/profile/auth)
#   - avn CLI installed (pip install --user aiven-client)
#   - A .env file in repo root with the secrets to push (EXA_API_KEY, etc.)
#
# Idempotent — re-running is safe.
#
# Usage:
#   export AIVEN_TOKEN=avnadmin_...
#   bash scripts/aiven-vault-bootstrap.sh

set -euo pipefail

SERVICE_NAME="${AIVEN_SERVICE_NAME:-dws-vault}"
PROJECT="${AIVEN_PROJECT:-dws-iq}"
CLOUD="${AIVEN_CLOUD:-google-europe-north1}"  # Finland — EU-sovereign
PLAN="${AIVEN_PLAN:-startup-4}"               # adjust to your tier

if [[ -z "${AIVEN_TOKEN:-}" ]]; then
  echo "ERROR: AIVEN_TOKEN not set. Get one at https://console.aiven.io/profile/auth" >&2
  exit 1
fi

echo "==> 1. Authenticate avn CLI"
avn user login --token "$AIVEN_TOKEN" 2>/dev/null || true

echo "==> 2. Ensure project exists ($PROJECT)"
avn project list | grep -q "^$PROJECT" || avn project create "$PROJECT" --bf-name "Lifetime Oy" --country-code FI

echo "==> 3. Create PostgreSQL vault service ($SERVICE_NAME) if missing"
if ! avn service get "$SERVICE_NAME" --project "$PROJECT" >/dev/null 2>&1; then
  avn service create "$SERVICE_NAME" \
    --project "$PROJECT" \
    --service-type pg \
    --cloud "$CLOUD" \
    --plan "$PLAN"
  echo "    Waiting for service to come online..."
  avn service wait "$SERVICE_NAME" --project "$PROJECT"
else
  echo "    Service already exists — skipping create."
fi

echo "==> 4. Fetch connection URI"
URI=$(avn service get "$SERVICE_NAME" --project "$PROJECT" --format '{service_uri}')
echo "    AIVEN_DATABASE_URL=$URI"

echo "==> 5. Generate AIVEN_VAULT_KEY if not already set"
if [[ -z "${AIVEN_VAULT_KEY:-}" ]]; then
  VAULT_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
  echo "    Generated new AIVEN_VAULT_KEY (store this in 1Password / sealed-secret):"
  echo "    AIVEN_VAULT_KEY=$VAULT_KEY"
else
  VAULT_KEY="$AIVEN_VAULT_KEY"
  echo "    Using existing AIVEN_VAULT_KEY from env."
fi

echo ""
echo "==> 6. Append to .env (manual review — does NOT overwrite)"
cat <<EOF

# Copy these into your .env (do NOT commit):
VAULT_PROVIDER=aiven
AIVEN_DATABASE_URL=$URI
AIVEN_VAULT_KEY=$VAULT_KEY

EOF

echo "==> 7. Next steps:"
echo "    a) Put EXA_API_KEY=exa_xxx (and any other secrets) into .env"
echo "    b) Run: npx tsx scripts/provision-secrets-aiven.ts --dry-run"
echo "    c) When happy: npx tsx scripts/provision-secrets-aiven.ts"
echo "    d) Restart backend — secret-loader will populate process.env from Aiven on boot."
echo ""
echo "Done."
