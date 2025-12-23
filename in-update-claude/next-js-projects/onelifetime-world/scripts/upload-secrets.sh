#!/bin/bash

# Requires: gh CLI installed (brew install gh / apt install gh)
# Login first: gh auth login

REPO="blogtheristo/onelifetime-world"

echo "🔐 Uploading secrets to GitHub repository: $REPO"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local not found!"
    echo "Run ./scripts/setup-env.sh first"
    exit 1
fi

# Load from .env.local
export $(cat .env.local | grep -v '^#' | xargs)

# Upload secrets using gh CLI
echo "Uploading NEXT_PUBLIC_SITE_URL..."
echo "$NEXT_PUBLIC_SITE_URL" | gh secret set NEXT_PUBLIC_SITE_URL --repo $REPO

echo "Uploading RESEND_API_KEY..."
echo "$RESEND_API_KEY" | gh secret set RESEND_API_KEY --repo $REPO

echo "Uploading NEXT_PUBLIC_SANITY_PROJECT_ID..."
echo "$NEXT_PUBLIC_SANITY_PROJECT_ID" | gh secret set NEXT_PUBLIC_SANITY_PROJECT_ID --repo $REPO

echo "Uploading SANITY_API_TOKEN..."
echo "$SANITY_API_TOKEN" | gh secret set SANITY_API_TOKEN --repo $REPO

echo "Uploading NEXT_PUBLIC_GA_ID..."
echo "$NEXT_PUBLIC_GA_ID" | gh secret set NEXT_PUBLIC_GA_ID --repo $REPO

echo "Uploading NEXT_PUBLIC_SENTRY_DSN..."
echo "$NEXT_PUBLIC_SENTRY_DSN" | gh secret set NEXT_PUBLIC_SENTRY_DSN --repo $REPO

echo "Uploading SENTRY_AUTH_TOKEN..."
echo "$SENTRY_AUTH_TOKEN" | gh secret set SENTRY_AUTH_TOKEN --repo $REPO

echo "Uploading INVESTOR_PORTAL_PASSWORD..."
echo "$INVESTOR_PORTAL_PASSWORD" | gh secret set INVESTOR_PORTAL_PASSWORD --repo $REPO

echo "Uploading VERCEL_TOKEN (manual input required)..."
read -sp "Enter Vercel Token: " VERCEL_TOKEN
echo ""
echo "$VERCEL_TOKEN" | gh secret set VERCEL_TOKEN --repo $REPO

echo ""
echo "✅ All secrets uploaded successfully to $REPO!"
echo ""
echo "📝 Next steps:"
echo "1. Verify secrets in GitHub: https://github.com/$REPO/settings/secrets/actions"
echo "2. Trigger a workflow run to test the secrets"
