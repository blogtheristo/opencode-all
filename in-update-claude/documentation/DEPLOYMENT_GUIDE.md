# Deployment Guide - DWS10.com & Onelifetime.World

## Overview

This guide covers deploying both websites from local development to production on Vercel.

---

## Prerequisites

- [x] Node.js 18.17+ installed
- [x] npm or yarn package manager
- [x] Git installed
- [x] GitHub account (blogtheristo)
- [x] All accounts created (see ACCOUNTS_SETUP_GUIDE.md)

---

## Step 1: Initialize Git Repositories

### For DWS10.com

```bash
cd /home/user/dws10-com

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: DWS IQ Platform Next.js website"

# Create repository on GitHub
# Visit: https://github.com/blogtheristo?tab=repositories
# Click "New repository"
# Name: dws10-com
# Description: DWS IQ Platform - Technical Product Website
# Public/Private: Private (recommended for now)
# Don't initialize with README (we already have code)

# Add remote and push
git remote add origin https://github.com/blogtheristo/dws10-com.git
git branch -M main
git push -u origin main
```

### For Onelifetime.World

```bash
cd /home/user/onelifetime-world

git init
git add .
git commit -m "Initial commit: Lifetime Oy corporate website"

# Create repository on GitHub
# Name: onelifetime-world
# Description: Lifetime Oy - Corporate Website & Climate Impact Platform

git remote add origin https://github.com/blogtheristo/onelifetime-world.git
git branch -M main
git push -u origin main
```

---

## Step 2: Install Dependencies

```bash
# DWS10
cd /home/user/dws10-com
npm install

# Onelifetime
cd /home/user/onelifetime-world
npm install
```

---

## Step 3: Setup Environment Variables

### Using the automation script:

```bash
# DWS10
cd /home/user/dws10-com
./scripts/setup-env.sh

# Onelifetime
cd /home/user/onelifetime-world
./scripts/setup-env.sh
```

### Manual method:

```bash
# Copy example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

---

## Step 4: Local Development Testing

```bash
# DWS10 (runs on port 3000)
cd /home/user/dws10-com
npm run dev

# Onelifetime (runs on port 3001)
cd /home/user/onelifetime-world
npm run dev
```

Visit:
- http://localhost:3000 (DWS10)
- http://localhost:3001 (Onelifetime)

---

## Step 5: Upload GitHub Secrets

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Linux: sudo apt install gh
# Windows: winget install GitHub.cli

# Login to GitHub
gh auth login

# Upload secrets for DWS10
cd /home/user/dws10-com
./scripts/upload-secrets.sh

# Upload secrets for Onelifetime
cd /home/user/onelifetime-world
./scripts/upload-secrets.sh
```

Verify at:
- https://github.com/blogtheristo/dws10-com/settings/secrets/actions
- https://github.com/blogtheristo/onelifetime-world/settings/secrets/actions

---

## Step 6: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# DWS10
cd /home/user/dws10-com
vercel

# Follow prompts:
# ? Set up and deploy "~/dws10-com"? [Y/n] y
# ? Which scope? [Your account]
# ? Link to existing project? [N/y] n
# ? What's your project's name? dws10-com
# ? In which directory is your code located? ./
# ? Want to override the settings? [N/y] n

# Deploy to production
vercel --prod
```

```bash
# Onelifetime
cd /home/user/onelifetime-world
vercel
# (same prompts as above, use "onelifetime-world" as project name)

vercel --prod
```

### Option B: Vercel Dashboard (Alternative)

1. Visit: https://vercel.com/new
2. Click "Import Git Repository"
3. Select GitHub account: blogtheristo
4. Import: `blogtheristo/dws10-com`
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
6. Add environment variables from `.env.example`
7. Click "Deploy"
8. Repeat for `blogtheristo/onelifetime-world`

---

## Step 7: Configure Custom Domains

### In Vercel Dashboard:

1. Go to Project Settings → Domains
2. Add domain: `dws10.com`
3. Add domain: `www.dws10.com` (redirect to dws10.com)
4. Vercel will provide DNS records

### In Cloudflare:

1. Go to DNS settings for dws10.com
2. Add CNAME records:
   ```
   Type: CNAME
   Name: @
   Content: cname.vercel-dns.com
   Proxy: Yes (orange cloud)

   Type: CNAME
   Name: www
   Content: cname.vercel-dns.com
   Proxy: Yes
   ```
3. Repeat for onelifetime.world

### Wait for DNS propagation (5-60 minutes)

---

## Step 8: Enable GitHub Actions

GitHub Actions workflows will automatically trigger on:
- Push to `main` branch → Production deployment
- Pull requests → Preview deployments

### First-time setup:

1. Push a commit to trigger workflows:
   ```bash
   git commit --allow-empty -m "Trigger CI/CD pipeline"
   git push origin main
   ```

2. Check Actions tab:
   - https://github.com/blogtheristo/dws10-com/actions
   - https://github.com/blogtheristo/onelifetime-world/actions

3. Workflows included:
   - ✅ CI/CD Pipeline (lint, build, deploy)
   - ✅ CodeQL Security Scan
   - ✅ Dependency Review
   - ✅ Lighthouse Performance (on PRs)

---

## Step 9: Setup Sanity CMS

```bash
# DWS10 CMS
cd /home/user/dws10-com
npm install -g @sanity/cli
sanity init

# Follow prompts:
# ? Select project: Create new project
# ? Project name: dws10-com
# ? Use default dataset? Yes
# ? Output path: ./sanity
# ? Template: Blog

# Start Sanity Studio
cd sanity
npm install
npm run dev
# Studio opens at http://localhost:3333
```

Repeat for onelifetime-world.

### Configure CORS in Sanity:

1. Visit: https://www.sanity.io/manage
2. Select project → API → CORS Origins
3. Add origins:
   - https://dws10.com
   - https://www.dws10.com
   - http://localhost:3000

---

## Step 10: Configure Analytics

### Plausible:

Add script snippet to `src/app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          defer
          data-domain="dws10.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Google Analytics:

Already configured via `NEXT_PUBLIC_GA_ID` environment variable.

---

## Step 11: Setup Email Sending (Resend)

### Verify domains:

1. Visit: https://resend.com/domains
2. Add domain: dws10.com
3. Add DNS records to Cloudflare:
   ```
   TXT record for SPF
   CNAME for DKIM
   TXT for DMARC
   ```
4. Wait for verification (green checkmark)

### Test email:

```typescript
// In your contact form handler
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'hello@dws10.com',
  to: 'risto@lifetime.fi',
  subject: 'Test Email',
  html: '<p>Email works!</p>'
});
```

---

## Step 12: Monitor & Maintain

### Daily:

- Check Sentry for errors: https://sentry.io/
- Monitor Vercel deployments: https://vercel.com/dashboard
- Review analytics: https://plausible.io/

### Weekly:

- Review Lighthouse scores
- Check GitHub Actions success rate
- Update dependencies: `npm update`

### Monthly:

- Review and rotate API keys
- Update content in Sanity CMS
- Audit security with CodeQL results

---

## Rollback Strategy

### If deployment fails:

```bash
# Revert to previous deployment in Vercel
# Dashboard → Deployments → [Previous successful deployment] → Promote to Production

# Or via CLI:
vercel rollback
```

### If code breaks:

```bash
# Revert git commit
git revert HEAD
git push origin main

# Or create hotfix branch
git checkout -b hotfix/critical-bug
# Fix issue
git commit -m "Fix critical bug"
git push origin hotfix/critical-bug
# Create PR and merge
```

---

## Troubleshooting

### Build fails on Vercel:

1. Check build logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Run `npm run build` locally to reproduce
4. Check for missing dependencies

### DNS not resolving:

1. Verify DNS records in Cloudflare
2. Use `dig dws10.com` to check DNS propagation
3. Clear browser cache / use incognito
4. Wait up to 24 hours for full propagation

### GitHub Actions failing:

1. Check Actions logs for error details
2. Verify GitHub secrets are set
3. Ensure `VERCEL_TOKEN` is valid
4. Re-run failed jobs

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] DNS records properly set
- [ ] SSL certificates active (automatic via Vercel)
- [ ] Analytics tracking working
- [ ] Error monitoring (Sentry) active
- [ ] Email sending tested
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] Lighthouse scores > 90
- [ ] SEO meta tags verified
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Contact form tested
- [ ] Social media links working
- [ ] GitHub Actions passing
- [ ] Backup strategy in place

---

## Support

**Vercel Support**: https://vercel.com/support
**Next.js Docs**: https://nextjs.org/docs
**GitHub Actions**: https://docs.github.com/en/actions

**Contact**: risto@lifetime.fi

---

**Last Updated**: 2025-11-16
