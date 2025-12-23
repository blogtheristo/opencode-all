# Account Setup Guide for DWS10.com & Onelifetime.World

**Contact Email**: risto.paarni2024@lifetime.fi
**Preferred Auth**: Google Login (Sign in with Google)

---

## Quick Start Checklist

- [ ] 1. Domain & DNS (Cloudflare)
- [ ] 2. Hosting (Vercel)
- [ ] 3. Email (Google Workspace)
- [ ] 4. CMS (Sanity.io)
- [ ] 5. Analytics (Plausible + Google Analytics)
- [ ] 6. Email Service (Resend)
- [ ] 7. Monitoring (Sentry)
- [ ] 8. Password Manager (1Password)

---

## 1. Domain Registration & DNS

### Cloudflare (Recommended - Free Tier Available)

**Why**: Free SSL, DDoS protection, CDN, DNS management

**Signup**:
1. Visit: https://dash.cloudflare.com/sign-up
2. Click "Sign up with Google"
3. Use: risto.paarni2024@lifetime.fi
4. Account type: Free (upgrade to Pro $20/mo later if needed)

**After Signup**:
1. Add domains: dws10.com, onelifetime.world
2. Update nameservers at your registrar (if already registered)
3. Enable "Always Use HTTPS"
4. Enable "Auto Minify" (HTML, CSS, JS)
5. Set SSL/TLS encryption mode to "Full (strict)"

**DNS Records to Add**:
```
# For dws10.com
Type: CNAME, Name: @, Content: cname.vercel-dns.com, Proxy: Yes
Type: CNAME, Name: www, Content: cname.vercel-dns.com, Proxy: Yes

# For onelifetime.world
Type: CNAME, Name: @, Content: cname.vercel-dns.com, Proxy: Yes
Type: CNAME, Name: www, Content: cname.vercel-dns.com, Proxy: Yes

# Email (Google Workspace)
Type: MX, Name: @, Content: 1 aspmx.l.google.com
Type: MX, Name: @, Content: 5 alt1.aspmx.l.google.com
Type: MX, Name: @, Content: 5 alt2.aspmx.l.google.com
```

---

## 2. Hosting - Vercel (Primary)

**Why**: Best Next.js deployment, automatic previews, edge functions

**Signup**:
1. Visit: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize: github.com/blogtheristo account
4. Plan: Hobby (Free) initially, upgrade to Pro ($20/mo per project) for production

**Setup Steps**:
1. Import repository: `blogtheristo/dws10-com`
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
2. Import repository: `blogtheristo/onelifetime-world`
   - Same settings as above
3. Add environment variables (for each project):
   ```
   NEXT_PUBLIC_SITE_URL=https://dws10.com (or onelifetime.world)
   NEXT_PUBLIC_SITE_NAME=DWS IQ Platform (or Lifetime Oy)
   RESEND_API_KEY=(will add later)
   NEXT_PUBLIC_SANITY_PROJECT_ID=(will add later)
   ```
4. Add custom domains:
   - dws10.com → dws10-com project
   - onelifetime.world → onelifetime-world project
5. Get Vercel token for CI/CD:
   - Settings → Tokens → Create Token
   - Name: "GitHub Actions CI/CD"
   - Scope: Full Account
   - Copy token → Add to GitHub Secrets as `VERCEL_TOKEN`

---

## 3. Email - Google Workspace

**Why**: Professional email, calendar, 30GB storage per user

**Signup**:
1. Visit: https://workspace.google.com/
2. Click "Get Started"
3. Business name: Lifetime Oy
4. Number of employees: Just you (1-9)
5. Country: Finland
6. Email: risto.paarni2024@lifetime.fi (for recovery)
7. Domain: dws10.com (setup first), then add onelifetime.world
8. Plan: Business Starter ($6/user/month)

**Setup Emails**:
- risto@lifetime.fi (Primary)
- hello@dws10.com
- info@onelifetime.world
- support@dws10.com

**DNS Configuration** (via Cloudflare):
Google will provide MX records and verification TXT records during setup.

---

## 4. CMS - Sanity.io

**Why**: Headless CMS, great developer experience, free tier generous

**Signup**:
1. Visit: https://www.sanity.io/get-started
2. Click "Sign in with Google"
3. Use: risto.paarni2024@lifetime.fi
4. Plan: Free (upgrade to Growth $99/mo when needed)

**Create Projects**:

### Project 1: DWS10
```bash
npm create sanity@latest
# Project name: dws10-com
# Dataset: production
# Template: Blog (later customize)
```

### Project 2: Onelifetime
```bash
npm create sanity@latest
# Project name: onelifetime-world
# Dataset: production
# Template: Clean project with no predefined schemas
```

**After Setup**:
1. Get Project IDs from https://www.sanity.io/manage
2. Add to Vercel environment variables:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `SANITY_API_TOKEN` (create in Sanity dashboard)
3. Configure CORS in Sanity:
   - Add: https://dws10.com
   - Add: https://onelifetime.world
   - Add: http://localhost:3000 (dev)

---

## 5. Analytics

### 5A. Plausible Analytics (Privacy-Focused)

**Why**: GDPR-compliant, no cookie banner needed, lightweight

**Signup**:
1. Visit: https://plausible.io/register
2. Use: risto.paarni2024@lifetime.fi
3. Plan: $9/month (50K pageviews)

**Add Sites**:
1. Site 1: dws10.com
2. Site 2: onelifetime.world

**Integration**:
Add script to Next.js `layout.tsx`:
```tsx
<Script
  defer
  data-domain="dws10.com"
  src="https://plausible.io/js/script.js"
/>
```

### 5B. Google Analytics 4

**Signup**:
1. Visit: https://analytics.google.com/
2. Sign in with Google: risto.paarni2024@lifetime.fi
3. Create Account: "Lifetime Oy"
4. Create Properties:
   - Property 1: DWS IQ Platform
   - Property 2: Lifetime Oy Corporate

**Get Measurement IDs**:
- Copy GA4 Measurement ID (format: G-XXXXXXXXXX)
- Add to Vercel env: `NEXT_PUBLIC_GA_ID`

---

## 6. Transactional Email - Resend

**Why**: Modern email API, generous free tier, great DX

**Signup**:
1. Visit: https://resend.com/signup
2. Click "Continue with Google"
3. Use: risto.paarni2024@lifetime.fi
4. Plan: Free (3,000 emails/month)

**Setup Domains**:
1. Add domain: dws10.com
2. Add domain: onelifetime.world
3. Add DNS records (SPF, DKIM, DMARC) to Cloudflare
4. Verify domains

**Create API Keys**:
1. Go to: API Keys → Create API Key
2. Name: "DWS10 Production"
3. Permission: Sending access
4. Copy API key → Add to Vercel as `RESEND_API_KEY`
5. Repeat for onelifetime.world

---

## 7. Error Monitoring - Sentry

**Why**: Real-time error tracking, performance monitoring

**Signup**:
1. Visit: https://sentry.io/signup/
2. Click "Sign up with Google"
3. Use: risto.paarni2024@lifetime.fi
4. Plan: Developer (Free - 5K errors/month)

**Create Projects**:
1. Platform: Next.js
2. Project 1: dws10-com
3. Project 2: onelifetime-world

**Integration**:
```bash
npx @sentry/wizard@latest -i nextjs
```

**Environment Variables**:
- `NEXT_PUBLIC_SENTRY_DSN` (from Sentry dashboard)
- `SENTRY_AUTH_TOKEN` (create in Sentry → Settings → Auth Tokens)

---

## 8. Password Manager - 1Password

**Why**: Secure credential storage, team sharing

**Signup**:
1. Visit: https://1password.com/sign-up/
2. Plan: Teams Starter Kit ($19.95/month for 10 users)
3. Email: risto.paarni2024@lifetime.fi

**Setup Vaults**:
- Vault 1: "DWS10 Credentials"
- Vault 2: "Onelifetime Credentials"
- Vault 3: "Shared Infrastructure" (Cloudflare, Vercel, etc.)

**Store Credentials**:
- All API keys from above services
- Google Workspace passwords
- Vercel tokens
- GitHub PATs

---

## 9. Marketing - ConvertKit (Email Marketing)

**Signup**:
1. Visit: https://convertkit.com/
2. Sign up with: risto.paarni2024@lifetime.fi
3. Plan: Free (0-1,000 subscribers), then $25/mo

**Setup**:
- Configure sender email: hello@dws10.com
- Create welcome sequences
- Add signup forms to both sites

---

## 10. Design - Figma

**Signup**:
1. Visit: https://www.figma.com/signup
2. Click "Continue with Google"
3. Use: risto.paarni2024@lifetime.fi
4. Plan: Free (3 files), upgrade to Professional $12/mo when needed

---

## 11. GitHub Secrets Configuration

Add these secrets to **both** repositories on GitHub:

### For dws10-com repository:
```
Settings → Secrets and variables → Actions → New repository secret
```

**Required Secrets**:
- `VERCEL_TOKEN`: (from Vercel settings)
- `NEXT_PUBLIC_SITE_URL`: https://dws10.com
- `RESEND_API_KEY`: (from Resend)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: (from Sanity)
- `SANITY_API_TOKEN`: (from Sanity)
- `NEXT_PUBLIC_GA_ID`: (from Google Analytics)
- `NEXT_PUBLIC_SENTRY_DSN`: (from Sentry)
- `SENTRY_AUTH_TOKEN`: (from Sentry)

### For onelifetime-world repository:
(Same secrets as above, but with onelifetime.world URL)

---

## Automation Scripts

### Script 1: Environment Variables Setup

Create file: `scripts/setup-env.sh`

```bash
#!/bin/bash

echo "🔧 Setting up environment variables..."

# Prompt for values
read -p "Vercel Token: " VERCEL_TOKEN
read -p "Resend API Key: " RESEND_API_KEY
read -p "Sanity Project ID: " SANITY_PROJECT_ID
read -p "Sanity API Token: " SANITY_API_TOKEN
read -p "Google Analytics ID: " GA_ID
read -p "Sentry DSN: " SENTRY_DSN

# Create .env.local
cat > .env.local << EOF
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://dws10.com
NEXT_PUBLIC_SITE_NAME="DWS IQ Platform"

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=dws10.com
NEXT_PUBLIC_GA_ID=$GA_ID

# Email Service
RESEND_API_KEY=$RESEND_API_KEY

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=$SANITY_PROJECT_ID
SANITY_API_TOKEN=$SANITY_API_TOKEN

# Sentry
NEXT_PUBLIC_SENTRY_DSN=$SENTRY_DSN
EOF

echo "✅ .env.local created successfully!"
```

### Script 2: GitHub Secrets Uploader

Create file: `scripts/upload-secrets.sh`

```bash
#!/bin/bash

# Requires: gh CLI installed (brew install gh)

REPO="blogtheristo/dws10-com"

echo "🔐 Uploading secrets to GitHub..."

# Load from .env.local
source .env.local

# Upload secrets using gh CLI
gh secret set VERCEL_TOKEN --repo $REPO
gh secret set NEXT_PUBLIC_SITE_URL --body "$NEXT_PUBLIC_SITE_URL" --repo $REPO
gh secret set RESEND_API_KEY --body "$RESEND_API_KEY" --repo $REPO
gh secret set NEXT_PUBLIC_SANITY_PROJECT_ID --body "$NEXT_PUBLIC_SANITY_PROJECT_ID" --repo $REPO
gh secret set SANITY_API_TOKEN --body "$SANITY_API_TOKEN" --repo $REPO
gh secret set NEXT_PUBLIC_GA_ID --body "$NEXT_PUBLIC_GA_ID" --repo $REPO
gh secret set NEXT_PUBLIC_SENTRY_DSN --body "$NEXT_PUBLIC_SENTRY_DSN" --repo $REPO

echo "✅ Secrets uploaded successfully!"
```

---

## Timeline & Priority

### Week 1 (Immediate)
1. ✅ Cloudflare (DNS)
2. ✅ Vercel (Hosting)
3. ✅ Google Workspace (Email)
4. ✅ 1Password (Credentials)

### Week 2
5. ✅ Sanity.io (CMS)
6. ✅ Resend (Transactional email)
7. ✅ Plausible (Analytics)
8. ✅ Sentry (Monitoring)

### Week 3+
9. ConvertKit (Marketing emails)
10. Figma (Design assets)
11. Additional services as needed

---

## Support Contacts

**Vercel Support**: https://vercel.com/support
**Cloudflare Support**: https://dash.cloudflare.com/support
**Google Workspace Support**: https://support.google.com/a/

---

## Notes

- All services should use **risto.paarni2024@lifetime.fi** as primary account email
- Always prefer "Sign in with Google" when available
- Store all credentials in 1Password immediately
- Enable 2FA on all accounts that support it
- Use Google Authenticator or 1Password for 2FA codes

---

**Last Updated**: 2025-11-16
**Maintained by**: Risto Anton Päärni
