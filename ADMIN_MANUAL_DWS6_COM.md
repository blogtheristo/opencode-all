# 👨‍💼 ADMIN MANUAL: dws6.com Deployment & Management

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: Current | Date: 30.12.2025 | Changes: Initial creation - dws6.com deployment documentation

Session Links & References:
  - Cursor AI (Current): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/ADMIN_MANUAL_DWS6_COM.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: Finnish & English (bilingual)
  - Languages Available: Suomi, English
  - Publication Status: ✅ ACTIVE

---

**Versio:** 1.0
**Tarkoitus:** Admin-, ylläpito- ja deployment-opas dws6.com-sivustolle
**Kohderyhmä:** DevOps, System Administrators, Web Developers, IT Operations
**Päivitetty:** 30.12.2025

---

## 📑 Sisällysluettelo / Table of Contents

1. [Järjestelmän yleiskatsaus / System Overview](#1-järjestelmän-yleiskatsaus--system-overview)
2. [Cloudflare Pages Setup](#2-cloudflare-pages-setup)
3. [Custom Domain Configuration](#3-custom-domain-configuration)
4. [Deployment Process](#4-deployment-process)
5. [Site Structure & Navigation](#5-site-structure--navigation)
6. [Content Management](#6-content-management)
7. [Troubleshooting](#7-troubleshooting)
8. [Monitoring & Analytics](#8-monitoring--analytics)

---

## 1. Järjestelmän Yleiskatsaus / System Overview

### Architecture / Arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────┐
│                    USERS / KÄYTTÄJÄT                         │
│              https://dws6.com (Production)                   │
└────────────┬────────────────────────────────────────────────┘
             │
        ┌────▼─────────────┐
        │  CLOUDFLARE CDN  │
        │  - Global Edge   │
        │  - SSL/TLS       │
        │  - DDoS Protection│
        └────┬─────────────┘
             │
        ┌────▼─────────────────────────────────┐
        │     CLOUDFLARE PAGES                 │
        │  ┌─────────────────────────────────┐ │
        │  │  Project: dws6-dashboard        │ │
        │  │  Branch: main                   │ │
        │  │  Build: Static HTML/CSS/JS      │ │
        │  └─────────────────────────────────┘ │
        │  ┌─────────────────────────────────┐ │
        │  │  Custom Domains                 │ │
        │  │  - dws6.com                     │ │
        │  │  - www.dws6.com (optional)      │ │
        │  └─────────────────────────────────┘ │
        └───┬──────────────────────────────────┘
            │
    ┌───────▼──────┐
    │  GITHUB REPO │
    │  dws6        │
    │  /dws6.com/  │
    └──────────────┘
```

### Components / Komponentit

| Komponentti | Teknologia | Tarkoitus |
|-----------|-----------|-----------|
| Frontend | HTML5/CSS3/JavaScript | Static website |
| Hosting | Cloudflare Pages | Global CDN deployment |
| Domain | dws6.com | Custom domain |
| SSL/TLS | Cloudflare SSL | Automatic HTTPS |
| Repository | GitHub (dws6) | Source control |
| Build | Static | No build process needed |

### Site Structure / Sivuston rakenne

```
dws6.com/
├── / (index.html)                    # Landing page
├── /login/                           # Multi-service login portal
│   └── index.html                    # 11 services
├── /dashboard/
│   ├── /v7/                          # V7 OK Computer Dashboard
│   ├── /v8/                          # V8 Enhanced Dashboard
│   └── /v9/                          # V9 Final Dashboard
├── /lifetime-fleet/                  # Lifetime Fleet showcase
├── /progress-report/                 # Weekly progress reports
├── /csrd/                            # Corporate Sustainability Reporting
└── /assets/                          # Images, CSS, JS

Total: 86 files deployed
```

---

## 2. Cloudflare Pages Setup

### 2.1 Initial Project Creation / Projektin luominen

**Prerequisites / Edellytykset:**
- Cloudflare account
- GitHub repository access (dws6)
- Domain registered (dws6.com)

**Setup Steps / Asennusvaiheet:**

```bash
# 1. Connect GitHub Repository
# Go to: https://dash.cloudflare.com/pages
# Click: "Create a project"
# Select: "Connect to Git"
# Choose: blogtheristo/dws6

# 2. Configure Build Settings
Project name: dws6-dashboard
Production branch: main
Build command: (leave empty - static site)
Build output directory: dws6.com
Root directory: /

# 3. Deploy
# Click: "Save and Deploy"
# Wait: 2-3 minutes for first deployment
# Result: https://dws6-dashboard.pages.dev
```

### 2.2 Project Configuration / Projektin konfiguraatio

```yaml
# Cloudflare Pages Settings
project_name: dws6-dashboard
production_branch: main
preview_branches: []
build_command: ""
build_output: dws6.com
root_directory: /
node_version: null  # Not needed for static site

# Environment Variables (if needed)
# None required for static deployment
```

### 2.3 Automatic Deployments / Automaattiset deploymentit

```
Git Push → GitHub → Cloudflare Pages → Deploy

Timeline:
1. Push to main branch
2. Cloudflare detects change (webhook)
3. Build starts (instant for static)
4. Deploy to edge network (30-60 seconds)
5. Live at https://dws6.com
```

---

## 3. Custom Domain Configuration

### 3.1 Add Custom Domain / Lisää custom domain

**Step-by-Step / Vaihe vaiheelta:**

```bash
# 1. Navigate to Custom Domains
# URL: https://dash.cloudflare.com/pages
# Click: dws6-dashboard project
# Tab: "Custom domains"

# 2. Add dws6.com
# Click: "Set up a custom domain"
# Enter: dws6.com
# Click: "Continue"

# 3. Verify DNS
# Status: "DNS records verified" ✅
# (CNAME already exists: dws6.com → dws6.pages.dev)

# 4. Activate Domain
# Click: "Activate domain"
# Wait: 2-3 minutes for SSL certificate
# Status: "Active" ✅

# 5. Test
curl -I https://dws6.com
# Expected: HTTP/2 200 OK
```

### 3.2 DNS Configuration / DNS-konfiguraatio

**Required DNS Records / Vaaditut DNS-tietueet:**

```
Type: CNAME
Name: @ (or dws6.com)
Target: dws6.pages.dev
Proxy status: Proxied (🧡 orange cloud)
TTL: Auto
```

**Verify DNS / Tarkista DNS:**

```bash
# Check DNS resolution
nslookup dws6.com

# Expected output:
# Non-authoritative answer:
# Name:    dws6.com
# Addresses:  172.67.160.162
#             104.21.65.85

# Check CNAME
dig dws6.com CNAME +short
# Expected: dws6.pages.dev (if not proxied)
```

### 3.3 SSL/TLS Configuration / SSL/TLS-konfiguraatio

**Automatic SSL / Automaattinen SSL:**

```
Cloudflare provides:
✅ Automatic SSL certificate
✅ Universal SSL (Let's Encrypt)
✅ Auto-renewal every 90 days
✅ TLS 1.3 support
✅ HTTP/2 and HTTP/3 (QUIC)

No manual configuration needed!
```

**Verify SSL / Tarkista SSL:**

```bash
# Check SSL certificate
openssl s_client -connect dws6.com:443 -servername dws6.com < /dev/null

# Check SSL grade
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=dws6.com
# Expected: A or A+ rating
```

### 3.4 WWW Subdomain (Optional) / WWW-alidomain

```bash
# Add www.dws6.com
# 1. Go to Custom domains tab
# 2. Click "Set up a custom domain"
# 3. Enter: www.dws6.com
# 4. Click "Continue" → "Activate domain"
# 5. Wait 2-3 minutes

# Result: Both work
# - https://dws6.com
# - https://www.dws6.com
```

---

## 4. Deployment Process

### 4.1 Manual Deployment / Manuaalinen deployment

```bash
# 1. Make changes locally
cd /path/to/dws6/dws6.com
# Edit files...

# 2. Test locally (optional)
python -m http.server 8080
# Visit: http://localhost:8080

# 3. Commit changes
git add .
git commit -m "feat: update dws6.com content"

# 4. Push to GitHub
git push origin main

# 5. Cloudflare auto-deploys
# Check: https://dash.cloudflare.com/pages
# View: Deployment logs
# Wait: 30-60 seconds
# Live: https://dws6.com
```

### 4.2 Deployment Status / Deploymentin tila

```bash
# Check deployment status
# Go to: https://dash.cloudflare.com/pages
# Click: dws6-dashboard
# Tab: "Deployments"

# Status indicators:
✅ Success - Deployment completed
🔄 In Progress - Currently deploying
❌ Failed - Deployment error
⏸️ Canceled - Manually stopped
```

### 4.3 Rollback / Palauta edellinen versio

```bash
# Rollback to previous deployment
# 1. Go to: https://dash.cloudflare.com/pages
# 2. Click: dws6-dashboard
# 3. Tab: "Deployments"
# 4. Find: Previous successful deployment
# 5. Click: "..." → "Rollback to this deployment"
# 6. Confirm: "Rollback"

# Alternative: Git revert
git revert HEAD
git push origin main
# Cloudflare will deploy the reverted version
```

### 4.4 Preview Deployments / Esikatselu-deploymentit

```bash
# Create preview branch
git checkout -b feature/new-page
# Make changes...
git add .
git commit -m "feat: add new page"
git push origin feature/new-page

# Cloudflare creates preview URL:
# https://[branch-name].dws6-dashboard.pages.dev

# Test preview before merging to main
```

---

## 5. Site Structure & Navigation

### 5.1 Page Inventory / Sivuluettelo

| Page | Path | Purpose | Status |
|------|------|---------|--------|
| Landing | `/` | Main landing page | ✅ Live |
| Login Portal | `/login/` | 11 service login | ✅ Live |
| V7 Dashboard | `/dashboard/v7/` | OK Computer Dashboard | ✅ Live |
| V8 Dashboard | `/dashboard/v8/` | Enhanced Dashboard | ✅ Live |
| V9 Dashboard | `/dashboard/v9/` | Final Dashboard | ✅ Live |
| Lifetime Fleet | `/lifetime-fleet/` | Fleet showcase | ✅ Live |
| Progress Report | `/progress-report/` | Weekly reports | ✅ Live |
| CSRD | `/csrd/` | Sustainability reporting | ✅ Live |

### 5.2 Navigation Menu / Navigointivalikko

**Standard Menu Structure:**

```html
<!-- All pages should include this menu -->
<nav class="main-nav">
  <a href="/">Home</a>
  <a href="/login/">Login</a>
  <a href="/dashboard/v9/">Dashboard</a>
  <a href="/lifetime-fleet/">Lifetime Fleet</a>
  <a href="/progress-report/">Progress Report</a>
  <a href="/csrd/">CSRD</a>
</nav>
```

### 5.3 File Organization / Tiedostojen organisointi

```
dws6.com/
├── index.html                        # Landing page
├── login/
│   └── index.html                    # Login portal
├── dashboard/
│   ├── v7/
│   │   └── index.html                # V7 Dashboard
│   ├── v8/
│   │   └── index.html                # V8 Dashboard
│   └── v9/
│       └── index.html                # V9 Dashboard
├── lifetime-fleet/
│   └── index.html                    # Fleet page
├── progress-report/
│   └── index.html                    # Progress reports
├── csrd/
│   └── index.html                    # CSRD page
├── assets/
│   ├── css/
│   │   └── styles.css                # Global styles
│   ├── js/
│   │   └── main.js                   # Global scripts
│   └── images/
│       └── *.png, *.jpg              # Images
└── README.md                         # Documentation
```

---

## 6. Content Management

### 6.1 Adding New Pages / Uusien sivujen lisääminen

```bash
# 1. Create new directory
mkdir -p dws6.com/new-page

# 2. Create index.html
cat > dws6.com/new-page/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page - DWS6</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
    <!-- Add navigation menu -->
    <nav class="main-nav">
        <a href="/">Home</a>
        <a href="/login/">Login</a>
        <a href="/dashboard/v9/">Dashboard</a>
        <a href="/new-page/">New Page</a>
    </nav>
    
    <!-- Page content -->
    <main>
        <h1>New Page</h1>
        <p>Content goes here...</p>
    </main>
</body>
</html>
EOF

# 3. Commit and deploy
git add dws6.com/new-page/
git commit -m "feat: add new page"
git push origin main

# 4. Access at: https://dws6.com/new-page/
```

### 6.2 Updating Existing Pages / Olemassa olevien sivujen päivitys

```bash
# 1. Edit file
nano dws6.com/index.html

# 2. Test locally (optional)
cd dws6.com
python -m http.server 8080

# 3. Commit changes
git add dws6.com/index.html
git commit -m "docs: update landing page content"

# 4. Deploy
git push origin main

# 5. Verify changes
curl https://dws6.com/ | grep "updated content"
```

### 6.3 Asset Management / Resurssien hallinta

```bash
# Add images
cp new-image.png dws6.com/assets/images/
git add dws6.com/assets/images/new-image.png
git commit -m "assets: add new image"
git push origin main

# Add CSS
nano dws6.com/assets/css/styles.css
git add dws6.com/assets/css/styles.css
git commit -m "style: update global styles"
git push origin main

# Add JavaScript
nano dws6.com/assets/js/main.js
git add dws6.com/assets/js/main.js
git commit -m "feat: add new JS functionality"
git push origin main
```

---

## 7. Troubleshooting

### 7.1 Error 522: Connection Timed Out

**Cause:** Custom domain not added to Cloudflare Pages project

**Solution:**
```bash
# 1. Go to Cloudflare Pages
https://dash.cloudflare.com/pages

# 2. Click dws6-dashboard → Custom domains

# 3. Add dws6.com
# Click "Set up a custom domain"
# Enter: dws6.com
# Click "Continue" → "Activate domain"

# 4. Wait 2-3 minutes for SSL activation

# 5. Test
curl -I https://dws6.com
# Expected: HTTP/2 200 OK
```

**Reference:** https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-522/

### 7.2 Deployment Failed / Deployment epäonnistui

```bash
# Check deployment logs
# 1. Go to: https://dash.cloudflare.com/pages
# 2. Click: dws6-dashboard
# 3. Tab: "Deployments"
# 4. Click: Failed deployment
# 5. View: Build logs

# Common issues:
# - Invalid HTML syntax
# - Missing files
# - Incorrect file paths

# Fix and redeploy
git add .
git commit -m "fix: resolve deployment issue"
git push origin main
```

### 7.3 Page Not Found (404)

```bash
# Verify file exists
ls -la dws6.com/path/to/page/index.html

# Check file path in URL
# Correct: https://dws6.com/page/
# Incorrect: https://dws6.com/page (missing trailing slash)

# Verify deployment
# Go to: https://dash.cloudflare.com/pages
# Check: Latest deployment status

# Clear Cloudflare cache
# Go to: https://dash.cloudflare.com
# Select: dws6.com domain
# Caching → Configuration → Purge Everything
```

### 7.4 SSL Certificate Issues

```bash
# Check SSL status
# Go to: https://dash.cloudflare.com/pages
# Click: dws6-dashboard
# Tab: "Custom domains"
# Status should show: "Active" ✅

# If "Initializing SSL certificate":
# Wait 2-3 minutes and refresh

# If stuck:
# 1. Remove custom domain
# 2. Wait 5 minutes
# 3. Re-add custom domain
# 4. Wait for SSL activation
```

### 7.5 DNS Propagation Delay

```bash
# Check DNS propagation
# Visit: https://www.whatsmydns.net/#CNAME/dws6.com

# If not propagated globally:
# - Wait 24-48 hours (max)
# - Usually propagates in 1-2 hours

# Force DNS flush (local)
# Windows:
ipconfig /flushdns

# macOS:
sudo dscacheutil -flushcache

# Linux:
sudo systemd-resolve --flush-caches
```

---

## 8. Monitoring & Analytics

### 8.1 Cloudflare Analytics / Cloudflare-analytiikka

```bash
# View site analytics
# Go to: https://dash.cloudflare.com
# Select: dws6.com domain
# Tab: "Analytics & Logs"

# Metrics available:
# - Total requests
# - Unique visitors
# - Bandwidth usage
# - Cache hit ratio
# - Threats blocked
# - Performance metrics
```

### 8.2 Performance Monitoring / Suorituskyvyn valvonta

```bash
# Lighthouse audit
# Chrome DevTools → Lighthouse → Generate report

# Expected scores:
# - Performance: 90+
# - Accessibility: 90+
# - Best Practices: 90+
# - SEO: 90+

# WebPageTest
# Visit: https://www.webpagetest.org/
# Enter: https://dws6.com
# Run test

# Target metrics:
# - First Contentful Paint: <1.5s
# - Speed Index: <2.5s
# - Time to Interactive: <3.5s
```

### 8.3 Uptime Monitoring / Käytettävyyden valvonta

```bash
# Setup uptime monitoring
# Options:
# 1. UptimeRobot (free): https://uptimerobot.com
# 2. Pingdom: https://www.pingdom.com
# 3. StatusCake: https://www.statuscake.com

# Monitor URLs:
# - https://dws6.com/
# - https://dws6.com/login/
# - https://dws6.com/dashboard/v9/

# Alert channels:
# - Email
# - Slack
# - SMS (optional)
```

### 8.4 Error Tracking / Virheenseuranta

```bash
# Check Cloudflare logs
# Go to: https://dash.cloudflare.com
# Select: dws6.com domain
# Tab: "Analytics & Logs" → "Logs"

# Filter by:
# - Status code (4xx, 5xx)
# - Time range
# - Path

# Export logs (Enterprise plan)
# - Logpush to S3/GCS
# - Real-time log streaming
```

### 8.5 Security Monitoring / Turvallisuuden valvonta

```bash
# Cloudflare Security Center
# Go to: https://dash.cloudflare.com
# Select: dws6.com domain
# Tab: "Security"

# Security features:
# ✅ DDoS protection (automatic)
# ✅ WAF (Web Application Firewall)
# ✅ Bot management
# ✅ Rate limiting
# ✅ SSL/TLS encryption

# Security events:
# - View blocked threats
# - Analyze attack patterns
# - Configure security rules
```

---

## 📋 Tarkistuslistat / Checklists

### Daily Checklist / Päivittäinen tarkistuslista
- [ ] Site is accessible (https://dws6.com)
- [ ] SSL certificate is valid
- [ ] No 4xx/5xx errors in logs
- [ ] Deployment status is "Success"

### Weekly Checklist / Viikottainen tarkistuslista
- [ ] Review Cloudflare analytics
- [ ] Check performance metrics
- [ ] Review security events
- [ ] Test all major pages
- [ ] Verify backup/rollback capability

### Monthly Checklist / Kuukausittainen tarkistuslista
- [ ] Review and optimize assets
- [ ] Update content as needed
- [ ] Check SSL certificate expiry (auto-renewed)
- [ ] Review and update documentation
- [ ] Audit security settings

---

## 📞 Tuki ja Dokumentaatio / Support & Documentation

### Links / Linkit
- **Live Site:** https://dws6.com
- **Cloudflare Dashboard:** https://dash.cloudflare.com/pages
- **GitHub Repository:** https://github.com/blogtheristo/dws6
- **V9 Documentation:** `/dws6.com/V9_FINAL_COMPLETION.md`

### Related Documentation / Liittyvä dokumentaatio
- **Admin Manual - Authentication:** `ADMIN_MANUAL_AUTHENTICATION.md`
- **Site Quality Standards:** `SITE_QUALITY_STANDARDS.md`
- **AI Agent Guidelines:** `AI_AGENT_GUIDELINES.md`

### Contacts / Yhteystiedot
- **Technical Support:** support@dws-iq.com
- **Emergency:** ops@dws-iq.com
- **Cloudflare Support:** https://support.cloudflare.com

---

**Versio:** 1.0  
**Päivitetty:** 30. Joulukuuta 2025  
**Seuraava päivitys:** Q1 2026

---

## Appendix A: Quick Reference Commands

```bash
# Deploy to production
git add .
git commit -m "feat: update content"
git push origin main

# Check DNS
nslookup dws6.com

# Test SSL
curl -I https://dws6.com

# Local testing
cd dws6.com && python -m http.server 8080

# View deployment logs
# https://dash.cloudflare.com/pages → dws6-dashboard → Deployments

# Purge Cloudflare cache
# https://dash.cloudflare.com → dws6.com → Caching → Purge Everything
```

## Appendix B: File Paths Reference

```
Production URLs:
https://dws6.com/                      → dws6.com/index.html
https://dws6.com/login/                → dws6.com/login/index.html
https://dws6.com/dashboard/v9/         → dws6.com/dashboard/v9/index.html
https://dws6.com/lifetime-fleet/       → dws6.com/lifetime-fleet/index.html
https://dws6.com/progress-report/      → dws6.com/progress-report/index.html
https://dws6.com/csrd/                 → dws6.com/csrd/index.html

Assets:
https://dws6.com/assets/css/styles.css → dws6.com/assets/css/styles.css
https://dws6.com/assets/js/main.js     → dws6.com/assets/js/main.js
https://dws6.com/assets/images/*.png   → dws6.com/assets/images/*.png
```

## Appendix C: Cloudflare Pages Limits

```
Free Plan:
- Builds: 500/month
- Bandwidth: Unlimited
- Requests: Unlimited
- Custom domains: 100
- Concurrent builds: 1
- Build time: 20 minutes max

Pro Plan ($20/month):
- Builds: 5,000/month
- Concurrent builds: 5
- Build time: 30 minutes max
- All other features unlimited
```

