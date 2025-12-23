#!/bin/bash

echo "🔧 Setting up environment variables for DWS10.com..."
echo ""

# Prompt for values
read -p "Vercel Token: " VERCEL_TOKEN
read -p "Resend API Key: " RESEND_API_KEY
read -p "Sanity Project ID: " SANITY_PROJECT_ID
read -p "Sanity API Token: " SANITY_API_TOKEN
read -p "Google Analytics ID (G-XXXXXXXXXX): " GA_ID
read -p "Sentry DSN: " SENTRY_DSN
read -p "Sentry Auth Token: " SENTRY_AUTH_TOKEN

# Create .env.local
cat > .env.local << EOF
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://dws10.com
NEXT_PUBLIC_SITE_NAME="DWS IQ Platform"

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=dws10.com
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
EOF

echo ""
echo "✅ .env.local created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Review .env.local file"
echo "2. Never commit .env.local to git (it's in .gitignore)"
echo "3. Upload secrets to GitHub using: ./scripts/upload-secrets.sh"
echo "4. Add environment variables to Vercel dashboard"
