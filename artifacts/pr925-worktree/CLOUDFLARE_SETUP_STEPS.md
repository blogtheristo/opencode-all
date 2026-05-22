# DWS6.com Cloudflare Pages Deployment Guide

## Quick Summary

dws6.com will deploy using the **same workflow as dws10.com and onelifetime.world**:

```
Edit dws6.com/ folder → Commit → GitHub Action syncs to landing-pages/dws6-com/ → Cloudflare Pages deploys → Done
```

---

## Step 1: Create landing-pages Directory Structure

Run this command to create the directory:

```bash
cd D:\Proton\My files\2026\Repos2026\dws6
mkdir -p landing-pages/dws6-com
```

This is where Cloudflare Pages will deploy from (auto-synced by GitHub Action).

---

## Step 2: Go to Cloudflare Dashboard

**URL:** https://dash.cloudflare.com/

### What to do there:

1. **Left sidebar** → Click **Pages**
2. Click **Create a project** or **Connect to Git**
3. Select **GitHub** → Authorize if needed
4. Choose repository: **blogtheristo/dws6**
5. Click **Begin setup**

---

## Step 3: Configure Build Settings

**On the "Configure your deployment" page:**

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | (leave empty) |
| **Build output directory** | `landing-pages/dws6-com` |
| **Node version** | 18 |

**Environment Variables** (optional for now):
```
SUPABASE_URL=https://kpucuwwfhuwurdxyjjtz.supabase.co
SUPABASE_ANON_KEY=sb_publishable_mZtEHU2k4WolHxePGF6g3w_tdkMCWRh
```

Click **Deploy** and wait ~2-3 minutes for initial build.

---

## Step 4: Add dws6.com Domain to Cloudflare

**After Pages project is deployed:**

1. In Cloudflare Dashboard → **Pages** → Your dws6 project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `dws6.com`
5. Click **Continue**

Cloudflare will provide DNS instructions.

---

## Step 5: Configure DNS Records

**In your domain registrar (where you bought dws6.com):**

Add CNAME record:

```
Type:  CNAME
Name:  dws6.com (or @ depending on registrar)
Value: <your-cloudflare-pages-deployment>.pages.dev
TTL:   Auto
```

Or if dws6.com is already on Cloudflare:

1. Go to **dws6.com** → **DNS** settings in Cloudflare
2. Add/Update CNAME record pointing to Cloudflare Pages
3. Set to **Proxied** (orange cloud)

**Wait 5-60 minutes for DNS propagation.**

---

## Step 6: Add GitHub Secrets for Cache Purge (Optional)

For automatic cache purging when you deploy:

1. Go to: https://github.com/blogtheristo/dws6/settings/secrets/actions
2. Click **New repository secret**
3. Add these secrets:

| Secret Name | Value |
|------------|-------|
| `CLOUDFLARE_ZONE_ID` | Your dws6.com Zone ID (from Cloudflare) |
| `CLOUDFLARE_API_TOKEN` | Your Cloudflare API token (create in https://dash.cloudflare.com/profile/api-tokens) |

To find Zone ID:
- Cloudflare Dashboard → Your domain → Copy "Zone ID" from right sidebar

To create API token:
- Cloudflare Dashboard → Profile → API Tokens → Create Token
- Template: "Edit Cloudflare Workers"
- Add permission: "Cache Purge"

---

## Step 7: Test the Deployment Workflow

1. **Make a test edit** in `dws6.com/dashboard/v9/index.html` (add a comment or change a color)
2. **Commit and push:**
   ```bash
   git add dws6.com/
   git commit -m "test: test deployment workflow"
   git push origin main
   ```

3. **Watch the magic happen:**
   - Go to: https://github.com/blogtheristo/dws6/actions
   - You'll see **"Sync Landing Pages"** workflow running
   - Wait for it to complete (usually <1 minute)
   - Cloudflare Pages will auto-deploy immediately after

4. **Verify at:** https://dws6.com/dashboard/v9/

---

## How It Works After Deployment

**Every time you edit and push:**

```
1. Edit file in dws6.com/ folder
   ↓
2. git add . && git commit && git push
   ↓
3. GitHub Action "sync-landing-pages.yml" triggers
   ↓
4. Files sync from dws6.com/ → landing-pages/dws6-com/
   ↓
5. Cloudflare Pages detects changes in landing-pages/dws6-com/
   ↓
6. Auto-deploys (no manual build needed, static files)
   ↓
7. Cache purge runs (optional, with secrets)
   ↓
8. Changes live on dws6.com in ~30 seconds
```

---

## Login Flow After Deployment

User flow on dws6.com:

```
1. User visits: https://dws6.com/login/dws-iq-mobile/
   ↓
2. Supabase Auth (Google OAuth or Email/Password)
   ↓
3. Authenticated
   ↓
4. Redirects to: https://dws6.com/dashboard/v9/
   ↓
5. V9 Dashboard displays with:
   - Hamburger menu (top-right) ✅
   - Firehorse Inputs (Reports, Automation, CMS) ✅
   - Connected Systems (SAP PM, Portfolio, ABB, 27 Edge Nodes) ✅
   - Portfolio metrics ✅
   - Active projects counter ✅
   ↓
6. User can click hamburger menu to navigate or logout
```

---

## Troubleshooting

### Domain shows "404 Not Found"
- **Issue:** DNS not propagated yet
- **Fix:** Wait 24-48 hours, then hard refresh (Ctrl+Shift+R)

### Cloudflare Pages shows "No builds"
- **Issue:** Build directory wrong
- **Fix:** Make sure it's set to `landing-pages/dws6-com`

### Changes not appearing
- **Issue:** GitHub Action didn't run
- **Fix:** Check Actions tab → see if workflow has errors

### Supabase auth not working
- **Issue:** CORS or redirect URLs incorrect
- **Fix:** Check Supabase project settings → Auth → URLs

---

## What's Deployed

✅ All 11 login endpoints
✅ All 11 dashboards  
✅ V9 Dashboard with hamburger menu
✅ Firehorse integration display
✅ Shared libraries (Supabase client, auth handler)
✅ All assets (NCC logo, icons)

---

## Support

- **Cloudflare Issues:** https://support.cloudflare.com/
- **GitHub Actions:** https://docs.github.com/en/actions
- **DNS Propagation:** Use https://www.whatsmydns.net/ to check
