# 👨‍💼 ADMIN MANUAL: dws6.com Deployment & Management

---
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: Current | Date: 30.12.2025 | Changes: Initial creation - dws6.com deployment documentation
  - Version: 1.1 | Tool: Cursor AI (Claude Opus 4.5) | Session: 2026-01-08 | Date: 08.01.2026 | Changes: Updated hero text to "DWS 6 IQ Platform Administration Portal"; Added Public Cloud Version V1 branding; Documented portal vs login page distinction

Session Links & References:
  - Cursor AI (Current): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_DWS6_COM.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 08.01.2026
  - Language: Finnish & English (bilingual)
  - Languages Available: Suomi, English
  - Publication Status: ✅ ACTIVE

---

**Versio:** 1.1
**Tarkoitus:** Admin-, ylläpito- ja deployment-opas dws6.com-sivustolle
**Kohderyhmä:** DevOps, System Administrators, Web Developers, IT Operations
**Päivitetty:** 08.01.2026

---

## 📑 Sisällysluettelo / Table of Contents

1. [Järjestelmän yleiskatsaus / System Overview](#1-järjestelmän-yleiskatsaus--system-overview)
2. [Cloudflare Pages Setup](#2-cloudflare-pages-setup)
3. [Custom Domain Configuration](#3-custom-domain-configuration)
4. [Deployment Process](#4-deployment-process)
5. [Site Structure & Navigation](#5-site-structure--navigation)
6. [Content Management](#6-content-management)
7. [Supabase Backend Configuration](#7-supabase-backend-configuration)
8. [Troubleshooting](#8-troubleshooting)
9. [Monitoring & Analytics](#9-monitoring--analytics)

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
├── / (index.html)                    # Administration Portal (Public Cloud V1)
├── /login/                           # User Login Portal
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

### Portal Architecture Decision (January 8, 2026) / Portaaliarkkitehtuuripäätös

**Decision ID:** ADR-2026-001  
**Status:** ✅ IMPLEMENTED  
**Date:** January 8, 2026

#### Context / Konteksti

The dws6.com domain serves as the central authentication and administration hub for the DWS IQ 6 ecosystem. A clear distinction was needed between:
1. **Administration Portal** (https://dws6.com) - For system administrators
2. **User Login Portal** (https://dws6.com/login) - For end users

#### Decision / Päätös

| URL | Purpose | Target Audience | Branding |
|-----|---------|-----------------|----------|
| `https://dws6.com` | Administration Portal | System Administrators, DevOps, IT Operations | **DWS 6 IQ Platform Administration Portal** |
| `https://dws6.com/login` | User Login | End Users, Customers, Project Managers | Multi-service login (11 services) |

#### Hero Text Changes / Otsikkotekstin muutokset

**Before (December 2025):**
```
Title: "Welcome to DWS6.com"
Subtitle: "The DWS6 Secure Authentication Service (SAS)"
Badge: "Secure Authentication Service"
```

**After (January 8, 2026):**
```
Title: "DWS 6 IQ Platform Administration Portal"
Subtitle: "Enterprise-Grade Construction Intelligence & ESG Compliance Management"
Badge: "Public Cloud Version V1"
Services: "Secure Access Control · Real-Time Portfolio Analytics · CSRD/Fit for 55 Compliance · AI-Powered Insights"
```

#### Rationale / Perustelut

1. **Clear Role Separation**: Administrators see a professional portal; users are directed to login
2. **Version Branding**: "Public Cloud Version V1" indicates production-ready status
3. **Business Focus**: Hero text emphasizes enterprise value proposition
4. **Compliance Messaging**: CSRD/Fit for 55 compliance prominently featured
5. **Professional Tone**: "Authorized administrators only" establishes access control expectations

#### Implementation / Toteutus

Files modified:
- `dws6.com/index.html` - Production landing page
- `landing-pages/dws6-com/index.html` - Source landing page

#### Related Documents / Liittyvät dokumentit

- `THESIS_CHAPTER_V8_DASHBOARD_EN_v1.md` - Academic documentation
- `THESIS_CHAPTER_V8_DASHBOARD_FI_v1.md` - Finnish academic documentation
- `INVESTOR_MEMO.md` - Investor communications
- `WEEKLY_PROGRESS_REPORT_WEEK2.md` - Week 2 progress report

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

## 7. Supabase Backend Configuration

### 7.1 Project Overview / Projektin Yleiskatsaus

**Supabase Project:** dws6  
**Project ID:** `kpucuwwfhuwurdxyjjtz`  
**Status:** ✅ Active

Supabase provides the backend database and authentication infrastructure for the DWS6 ecosystem.

### 7.2 Architecture / Arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────┐
│                    DWS6 ECOSYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  dws6.com    │    │  V9 Dashboard│    │  V8 Dashboard│  │
│  │  (Frontend)  │    │  (React)     │    │  (Enhanced)  │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                   │                    │           │
│         └───────────────────┴────────────────────┘           │
│                             │                                │
│                             ▼                                │
│                  ┌──────────────────────┐                    │
│                  │   SUPABASE PROJECT   │                    │
│                  │  kpucuwwfhuwurdxyjjtz│                    │
│                  └──────────────────────┘                    │
│                             │                                │
│         ┌───────────────────┼───────────────────┐           │
│         ▼                   ▼                   ▼           │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐     │
│  │ PostgreSQL  │   │ Auth System  │   │   Storage   │     │
│  │  Database   │   │  (RLS)       │   │   (Files)   │     │
│  └─────────────┘   └──────────────┘   └─────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 7.3 Database Schema / Tietokantarakenne

#### Current Migrations / Nykyiset Migraatiot

| # | Migration | Purpose / Tarkoitus |
|---|-----------|---------------------|
| 001 | `mcp_agent_context.sql` | MCP Agent context management / Agenttienhallinta |
| 002 | `firehorse_pilot.sql` | Firehorse pilot program / Pilottiohjelma |
| 003 | `firehorse_linkedin_dm_templates.sql` | LinkedIn DM templates / LinkedIn-viestimallit |
| 004 | `firehorse_porr_templates.sql` | PORR templates / PORR-raportit |
| 005 | `firehorse_linkedin_workflow.sql` | LinkedIn workflow / LinkedIn-työnkulku |
| 006 | `investor_reporting_financial_data.sql` | Investor reporting / Sijoittajaraportointi |

#### Database Tables / Tietokantataulut

**Current Use Cases:**

1. **MCP Hub Integration**
   - Agent state management
   - Context storage
   - Session persistence

2. **Firehorse Operations**
   - Pilot program data
   - Customer tracking
   - LinkedIn automation
   - PORR generation

3. **Investor Relations**
   - Financial metrics
   - Reporting automation
   - Analytics data

### 7.4 Access & Credentials / Pääsy ja Tunnukset

#### Dashboard Access / Hallintapaneeli

**Main Dashboard:**
```
https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
```

**Quick Links / Pikalinkit:**

| Resource | URL |
|----------|-----|
| Database Tables | https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/database/tables |
| SQL Editor | https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/sql/new |
| API Settings | https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/api |
| Logs | https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/logs/explorer |
| Backups | https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/database |

#### API Configuration / API-asetukset

**Project URL:**
```
https://kpucuwwfhuwurdxyjjtz.supabase.co
```

**Environment Variables / Ympäristömuuttujat:**

```bash
# Add to .env.local (NEVER commit to Git!)
SUPABASE_PROJECT_ID=kpucuwwfhuwurdxyjjtz
SUPABASE_URL=https://kpucuwwfhuwurdxyjjtz.supabase.co
SUPABASE_ANON_KEY=[Get from API Settings]
SUPABASE_SERVICE_ROLE_KEY=[Get from API Settings - KEEP SECRET!]
```

**⚠️ Security Warning / Turvallisuusvaroitus:**
- `SUPABASE_ANON_KEY`: Safe for client-side / Turvallinen asiakaspuolella
- `SUPABASE_SERVICE_ROLE_KEY`: Server-side ONLY / VAIN palvelinpuolella

### 7.5 Connection Examples / Yhteysesimerkit

#### JavaScript/TypeScript Client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kpucuwwfhuwurdxyjjtz.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Example query
const { data, error } = await supabase
  .from('your_table')
  .select('*')
  .limit(10)
```

#### Direct PostgreSQL Connection

```bash
# Connection string
postgresql://postgres:[password]@db.kpucuwwfhuwurdxyjjtz.supabase.co:5432/postgres

# Using psql
psql "postgresql://postgres:[password]@db.kpucuwwfhuwurdxyjjtz.supabase.co:5432/postgres"
```

### 7.6 Security Configuration / Turvallisuusasetukset

#### Row Level Security (RLS)

**Check RLS Status:**
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**Enable RLS:**
```sql
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
```

**Create Policy:**
```sql
CREATE POLICY "Users can view their own data"
ON your_table_name
FOR SELECT
USING (auth.uid() = user_id);
```

#### Best Practices / Parhaat Käytännöt

✅ **DO / TEE:**
- ✅ Enable RLS on all tables / Ota RLS käyttöön kaikissa tauluissa
- ✅ Use environment variables / Käytä ympäristömuuttujia
- ✅ Keep service_role key server-side / Pidä service_role-avain palvelimella
- ✅ Regularly review access logs / Tarkista lokit säännöllisesti
- ✅ Enable 2FA on Supabase account / Ota 2FA käyttöön

❌ **DON'T / ÄLÄ:**
- ❌ Commit API keys to Git / Tallenna API-avaimia Gitiin
- ❌ Expose service_role key to clients / Paljasta service_role-avainta asiakkaille
- ❌ Disable RLS without reason / Poista RLS:ää käytöstä ilman syytä
- ❌ Share credentials in plain text / Jaa tunnuksia selkotekstinä

### 7.7 Backup & Recovery / Varmuuskopiointi

#### Automated Backups / Automaattiset Varmuuskopiot

Supabase provides daily automated backups:

1. Go to: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/database
2. Navigate to **Backups** section
3. Download or restore as needed

#### Manual Backup / Manuaalinen Varmuuskopiointi

```bash
# Full database backup
pg_dump "postgresql://postgres:[password]@db.kpucuwwfhuwurdxyjjtz.supabase.co:5432/postgres" > backup_$(date +%Y%m%d).sql

# Specific table backup
pg_dump -t table_name "postgresql://..." > table_backup.sql

# Restore from backup
psql "postgresql://..." < backup_20251230.sql
```

### 7.8 Monitoring / Seuranta

#### Key Metrics / Keskeiset Mittarit

Monitor these metrics in the Supabase dashboard:

| Metric | Location | Alert Threshold |
|--------|----------|-----------------|
| Database Size | Settings > Database | > 80% of plan limit |
| API Requests | Home > Usage | > 90% of plan limit |
| Active Connections | Database > Connections | > 50 connections |
| Query Performance | Logs > Query Performance | > 1000ms |
| Error Rate | Logs > Error Logs | > 1% of requests |

#### Health Check / Terveystarkistus

```bash
# Check if Supabase is accessible
curl https://kpucuwwfhuwurdxyjjtz.supabase.co/rest/v1/

# Expected response:
# {"message":"The server is running"}
```

### 7.9 Project Separation Analysis / Projektien Erottelu

#### Current Setup / Nykyinen Rakenne

**One Project for All:**
- ✅ Single source of truth
- ✅ Shared authentication
- ✅ Easier to manage
- ✅ Lower cost
- ❌ All data in one database
- ❌ Harder to scale independently

#### Recommendation: Single Project / Suositus: Yksi Projekti

**For DWS6, use ONE Supabase project because:**

1. **Shared User Base**
   - Same users across V8, V9, and People dashboards
   - Single authentication system
   - Unified user management

2. **Data Relationships**
   - Projects span multiple dashboards
   - KPIs need to be consistent
   - People data connects to projects

3. **Cost Efficiency**
   - One project = one subscription
   - Shared database resources
   - Simpler billing

4. **Operational Simplicity**
   - One backup strategy
   - One security configuration
   - One monitoring system

#### Database Organization / Tietokannan Organisointi

**Use schemas to separate concerns:**

```sql
-- Create schemas for different modules
CREATE SCHEMA IF NOT EXISTS people;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS kpis;
CREATE SCHEMA IF NOT EXISTS firehorse;
CREATE SCHEMA IF NOT EXISTS mcp;

-- Example table in schema
CREATE TABLE people.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant access
GRANT USAGE ON SCHEMA people TO authenticated;
GRANT SELECT ON people.employees TO authenticated;
```

#### When to Create Separate Projects / Milloin Luoda Erillisiä Projekteja

Consider separate projects ONLY if:

- ✅ **Compliance Requirements**: Different data residency rules
- ✅ **Customer Isolation**: Multi-tenant SaaS with strict isolation
- ✅ **Independent Teams**: Completely separate development teams
- ✅ **Different Environments**: Production vs. Staging (use separate projects)

**For DWS6: NOT needed** - Use schemas instead!

### 7.10 Future Integration Plans / Tulevat Integraatiot

#### Planned Integrations

- [ ] **V9 Dashboard Backend**
  - Real-time KPI updates
  - Project data storage
  - User preferences

- [ ] **V8 Enhanced Backend**
  - Historical data
  - Analytics storage
  - Report generation

- [ ] **People Management**
  - Employee database
  - Role assignments
  - Access control

- [ ] **Authentication System**
  - Single sign-on (SSO)
  - Role-based access control (RBAC)
  - Session management

- [ ] **Real-time Features**
  - WebSocket connections
  - Live dashboard updates
  - Notifications

### 7.11 Troubleshooting / Vianmääritys

#### Common Issues / Yleiset Ongelmat

**Connection Timeout:**
```bash
# Test connection
curl https://kpucuwwfhuwurdxyjjtz.supabase.co/rest/v1/

# Check DNS
nslookup kpucuwwfhuwurdxyjjtz.supabase.co
```

**RLS Blocking Queries:**
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Temporarily disable RLS (dev only!)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;
```

**Migration Errors:**
```bash
# Check migration status
supabase migration list

# Repair migrations
supabase migration repair --status applied
```

### 7.12 Recommended Extensions & Wrappers / Suositellut Laajennukset

#### High Priority / Korkea Prioriteetti

**Stripe Sync Engine** (✅ Recommended)
- Automatically sync Stripe data to Postgres
- Real-time revenue and subscription tracking
- Essential for financial reporting

**Cron** (✅ Recommended)
- Schedule recurring jobs in Postgres
- Daily reports, backups, cleanup tasks
- No external cron service needed

**Database Webhooks** (✅ Recommended)
- Real-time notifications on data changes
- Slack alerts, email notifications
- Dashboard updates

**Queues** (✅ Recommended)
- Background job processing
- Report generation, email sending
- LinkedIn automation (Firehorse)

**See full analysis:** `SUPABASE_WRAPPERS_STRATEGY.md`

### 7.13 Documentation Links / Dokumentaatiolinkit

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
- **CLI Reference:** https://supabase.com/docs/reference/cli
- **Wrappers Strategy:** `SUPABASE_WRAPPERS_STRATEGY.md`

---

## 8. Troubleshooting

### 8.1 Common Deployment Issues / Yleiset Deployment-ongelmat

See the main troubleshooting guide: `DWS6_DEPLOYMENT_TROUBLESHOOTING.md`

**Quick Fixes:**

**Error 522 (Connection Timeout):**
- Verify custom domain is added in Cloudflare Pages project
- Check DNS records point to correct Pages project
- Wait 5-10 minutes for DNS propagation

**Output Directory Not Found:**
- Verify `landing-pages/dws6-com/` exists in repository
- Check GitHub Actions sync workflow has run
- Manually trigger workflow if needed

**Build Failures:**
- Check build logs in Cloudflare Pages dashboard
- Verify `wrangler.toml` configuration
- Ensure all required files are in repository

### 8.2 Supabase Issues / Supabase-ongelmat

**Connection Timeout:**
```bash
# Test connection
curl https://kpucuwwfhuwurdxyjjtz.supabase.co/rest/v1/
```

**RLS Blocking Queries:**
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';
```

**Migration Errors:**
```bash
# Check status
supabase migration list
```

---

## 9. Monitoring & Analytics

### 9.1 Cloudflare Analytics / Cloudflare-analytiikka

Access analytics at: https://dash.cloudflare.com/pages

**Key Metrics / Keskeiset Mittarit:**
- Page views / Sivulataukset
- Unique visitors / Yksilölliset vierailijat
- Bandwidth usage / Kaistankäyttö
- Response times / Vasteajat
- Error rates / Virhetilastot

### 9.2 Performance Monitoring / Suorituskyvyn Seuranta

Monitor these metrics regularly:

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Page Load Time | < 2s | > 3s |
| Time to Interactive | < 3s | > 5s |
| Uptime | 99.9% | < 99% |
| Error Rate | < 0.1% | > 1% |

### 9.3 Checklists / Tarkistuslistat

#### Daily Checklist / Päivittäinen tarkistuslista
- [ ] Site is accessible (https://dws6.com)
- [ ] SSL certificate is valid
- [ ] No 4xx/5xx errors in logs
- [ ] Deployment status is "Success"
- [ ] Supabase health check passes

#### Weekly Checklist / Viikottainen tarkistuslista
- [ ] Review Cloudflare analytics
- [ ] Check performance metrics
- [ ] Review security events
- [ ] Test all major pages
- [ ] Verify backup/rollback capability
- [ ] Check Supabase database size
- [ ] Review API usage metrics

#### Monthly Checklist / Kuukausittainen tarkistuslista
- [ ] Review and optimize assets
- [ ] Update content as needed
- [ ] Check SSL certificate expiry (auto-renewed)
- [ ] Review and update documentation
- [ ] Audit security settings
- [ ] Review Supabase backups
- [ ] Optimize database queries
- [ ] Update dependencies

---

## 📞 Tuki ja Dokumentaatio / Support & Documentation

### Links / Linkit
- **Live Site:** https://dws6.com
- **Cloudflare Dashboard:** https://dash.cloudflare.com/pages
- **Supabase Dashboard:** https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
- **GitHub Repository:** https://github.com/blogtheristo/dws6
- **V9 Documentation:** `/dws6.com/V9_FINAL_COMPLETION.md`

### Related Documentation / Liittyvä dokumentaatio
- **Admin Manual - Authentication:** `ADMIN_MANUAL_AUTHENTICATION.md`
- **Site Quality Standards:** `SITE_QUALITY_STANDARDS.md`
- **AI Agent Guidelines:** `CLAUDE.md` (Karpathy Principles)

---

## 10. AI Agent Operational Guidelines (CLAUDE.md)

### 10.1 Overview / Yleiskatsaus

The `CLAUDE.md` file at repository root contains operational guidelines for AI coding agents (Claude Code, Cursor AI, GitHub Copilot) working on the DWS6 codebase. These guidelines are based on **Andrej Karpathy's principles** for effective AI-human collaboration in agentic coding workflows.

**Location:** `/CLAUDE.md`
**Source:** Karpathy's viral AI coding rant, adapted for DWS6

### 10.2 Core Philosophy / Perusfilosofia

```
"You are the hands; the human is the architect.
Move fast, but never faster than the human can verify.
Your code will be watched—write accordingly."
```

### 10.3 Critical Behaviors / Kriittiset Käyttäytymiset

| # | Behavior | Description |
|---|----------|-------------|
| 1 | **Assumption Surfacing** | State assumptions explicitly before implementing non-trivial code |
| 2 | **Confusion Management** | STOP when confused; ask clarifying questions |
| 3 | **Push Back When Warranted** | Point out problems directly; don't be a yes-machine |
| 4 | **Simplicity Enforcement** | Actively resist overcomplication |
| 5 | **Scope Discipline** | Touch only what you're asked to touch |
| 6 | **Dead Code Hygiene** | Ask before removing unused code |

### 10.4 Required Templates / Vaaditut Mallit

**Before implementation:**
```
ASSUMPTIONS I'M MAKING:
1. [assumption]
2. [assumption]
→ Correct me now or I'll proceed with these.
```

**After modification:**
```
CHANGES MADE:
- [file]: [what changed and why]

THINGS I DIDN'T TOUCH:
- [file]: [intentionally left alone because...]

POTENTIAL CONCERNS:
- [any risks or things to verify]
```

### 10.5 DWS6-Specific Failure Modes / DWS6-kohtaiset Virhetilat

In addition to Karpathy's 12 failure modes, DWS6 adds:

| # | Failure Mode | Prevention |
|---|-------------|------------|
| 13 | Not using DWS document standard | Check `docs/` folder conventions |
| 14 | Deleting files without asking | Always ask for explicit approval |
| 15 | Using new environment without .gitignore/.env check | Verify security setup first |

### 10.6 For Administrators / Ylläpitäjille

**When onboarding new AI tools:**
1. Ensure `CLAUDE.md` is in repository root
2. Verify the tool reads and respects the guidelines
3. Monitor for failure mode patterns
4. Update guidelines as new patterns emerge

**When reviewing AI-generated code:**
- Check that assumptions were surfaced
- Verify scope discipline was maintained
- Confirm no unauthorized deletions
- Validate security requirements met

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

