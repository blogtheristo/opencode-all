# DWS6.com Cloudflare Deployment Guide

## Overview
Deploy V9 Dashboard on dws6.com using Cloudflare Pages (free hosting with custom domain).

## Prerequisites
- Cloudflare account (free tier available)
- GitHub account with dws6 repository access
- Domain dws6.com or ability to use Cloudflare nameservers

## Deployment Steps

### Step 1: Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Pages** → **Connect to Git**
3. Authorize GitHub and select **blogtheristo/dws6** repository
4. Select branch: **main** (or **feature/firehorse-investor-outreach-platform** for testing)

### Step 2: Configure Build Settings

**Build Command:** (Leave empty - static files only)
```
echo "Static site"
```

**Build Output Directory:** 
```
dws6.com
```

**Environment Variables:**
```
SUPABASE_URL=https://kpucuwwfhuwurdxyjjtz.supabase.co
SUPABASE_ANON_KEY=sb_publishable_mZtEHU2k4WolHxePGF6g3w_tdkMCWRh
```

### Step 3: Connect Domain to Cloudflare

1. In Cloudflare Dashboard, go to **Domains**
2. Add **dws6.com** domain
3. Update your domain registrar's nameservers to Cloudflare's:
   - ns1.cloudflare.com
   - ns2.cloudflare.com

### Step 4: Configure DNS Records

Add DNS records in Cloudflare:
```
Type: CNAME
Name: dws6.com
Content: dws6-dashboard.pages.dev
TTL: Auto
Proxy: Proxied (orange cloud)
```

### Step 5: Enable Cloudflare Features

**Security:**
- Enable **Always Use HTTPS** ✅
- Set minimum TLS version to 1.2

**Performance:**
- Enable **Automatic HTTPS Rewrites** ✅
- Enable **Brotli Compression** ✅
- Enable **Minify** (CSS, JavaScript, HTML) ✅

**Rules:**
- Create Page Rule for `dws6.com/*`:
  - Cache Level: Cache Everything
  - Browser Cache TTL: 1 month

## Project Structure

```
dws6.com/
├── login/               # All 11 login endpoints
│   ├── dws-iq-mobile/
│   ├── store/
│   ├── dws-iq/
│   ├── onelifetime/
│   ├── lifetime-model/
│   ├── enterprise/
│   ├── enterprise-model/
│   ├── backoffice/
│   ├── api/
│   ├── mcp-hub/
│   └── watsonx/
├── dashboard/           # All 11 dashboards
│   ├── dws-iq-mobile/
│   ├── store/
│   ├── dws-iq/
│   ├── v9/             # ← Main V9 Dashboard
│   ├── v8-enhanced/    # ← Backup V8 Dashboard
│   └── ... (other dashboards)
├── shared/              # Shared libraries
│   ├── config/
│   ├── js/
│   └── css/
└── demo/                # Public demo pages
    └── mobile-v7/
```

## Login Flow

```
User visits: https://dws6.com/login/dws-iq-mobile/
        ↓
Supabase Auth (Google OAuth or Email/Password)
        ↓
User authenticated
        ↓
Redirects to: https://dws6.com/dashboard/v9/
        ↓
V9 Dashboard displays with:
  - Hamburger menu (top-right)
  - Firehorse Inputs display
  - Connected Systems display
  - Portfolio metrics
  - Active projects counter
        ↓
Hamburger menu allows navigation to other dashboards or logout
        ↓
Logout redirects to: https://dws10.com/buy
```

## V9 Dashboard Features

✅ **Header**
- NCC logo (construction company branding)
- "DWS 6 IQ" title
- "V9 Dashboard with Supabase" subtitle

✅ **Hamburger Menu Button** (Top-right, blue circle)
- Opens sidebar with navigation options
- Shows all 11 dashboards
- Includes logout button

✅ **Integration Display (Under Title)**
- **Firehorse Inputs** (Green box)
  - Firehorse Reports
  - Firehorse Automation
  - Firehorse CMS

- **Connected Systems & Infrastructure** (Blue box)
  - SAP PM
  - Portfolio
  - ABB Robotics
  - Site Edge Nodes: 27 pcs

✅ **Portfolio Cards**
- Portfolio SPI
- Portfolio CPI
- Active Projects (dynamic counter)
- Budget at Risk

✅ **Bottom Navigation**
- Dashboard
- Refresh
- Export
- Logout

## Testing Locally Before Deployment

```bash
# Start local server
cd dws6.com
python -m http.server 8000

# Visit in browser
http://localhost:8000/dashboard/v9/
```

## Environment Variables Required

```env
# Supabase Configuration
SUPABASE_URL=https://kpucuwwfhuwurdxyjjtz.supabase.co
SUPABASE_ANON_KEY=sb_publishable_mZtEHU2k4WolHxePGF6g3w_tdkMCWRh

# Google OAuth (optional - configured in Supabase)
GOOGLE_CLIENT_ID=530554078738-5mh2rgdf5ra7om02p4vnmsakb8797b4q.apps.googleusercontent.com
```

## Deployment Status

- **Repository**: https://github.com/blogtheristo/dws6
- **Branch**: feature/firehorse-investor-outreach-platform
- **PR**: #72
- **Status**: Ready for Cloudflare Pages deployment
- **Cost**: FREE (Cloudflare Pages + dws6.com domain)

## Next Steps

1. ✅ Code is committed and pushed to GitHub
2. ⏳ Connect repository to Cloudflare Pages
3. ⏳ Configure dws6.com domain
4. ⏳ Set environment variables in Cloudflare
5. ⏳ Test login flow with Supabase
6. ⏳ Merge PR to main branch
7. ⏳ Go live!

## Support

- **Supabase Issues**: Check Auth settings at https://app.supabase.com/project/kpucuwwfhuwurdxyjjtz/auth/providers
- **DNS Issues**: Allow 24-48 hours for propagation
- **Cloudflare Support**: https://support.cloudflare.com/
