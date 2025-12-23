#!/bin/bash

echo "🔧 Setting up environment variables for Onelifetime.World..."
echo ""

# Prompt for values
read -p "Vercel Token: " VERCEL_TOKEN
read -p "Resend API Key: " RESEND_API_KEY
read -p "Sanity Project ID: " SANITY_PROJECT_ID
read -p "Sanity API Token: " SANITY_API_TOKEN
read -p "Google Analytics ID (G-XXXXXXXXXX): " GA_ID
read -p "Sentry DSN: " SENTRY_DSN
read -p "Sentry Auth Token: " SENTRY_AUTH_TOKEN
read -p "Investor Portal Password: " INVESTOR_PASSWORD

# Create .env.local
cat > .env.local << EOF
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://onelifetime.world
NEXT_PUBLIC_SITE_NAME="Lifetime Oy"

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=onelifetime.world
NEXT_PUBLIC_GA_ID=$GA_ID

# Email Service (Resend)
RESEND_API_KEY=$RESEND_API_KEY

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=$SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=$SANITY_API_TOKEN

# Sentry
NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN
SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

# Investor Portal
INVESTOR_PORTAL_PASSWORD=$INVESTOR_PASSWORD
EOF

echo ""
echo "✅ .env.local created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Review .env.local file"
echo "2. Never commit .env.local to git (it's in .gitignore)"
echo "3. Upload secrets to GitHub using: ./scripts/upload-secrets.sh"
echo "4. Add environment variables to Vercel dashboard"
