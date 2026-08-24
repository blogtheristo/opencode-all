# DWS6.com Deployment Troubleshooting

**Date:** December 30, 2025  
**Status:** 🔴 Not Working  
**Issue:** dws6.com is not accessible

---

## Current Setup

### Repository Structure
- **Source:** `dws6.com/` folder in repository
- **Sync Target:** `landing-pages/dws6-com/` (via GitHub Actions)
- **Deployment:** Cloudflare Pages

### Files Present
✅ 34 HTML files in `dws6.com/` including:
- `index.html` (main landing)
- `login/index.html` (11 service login pages)
- `dashboard/v9/index.html` (latest dashboard)
- `dashboard/firehorse/v8/index.html`
- `demo/mobile-v7/index.html`

---

## Troubleshooting Steps

### 1. Verify Cloudflare Pages Project Exists

**Action:** Check if `dws6` project exists in Cloudflare Pages dashboard

**Expected:**
- Project name: `dws6` or `dws6-com`
- Branch: `main`
- Build directory: `landing-pages/dws6-com`

**How to Check:**
1. Go to: https://dash.cloudflare.com/pages
2. Look for `dws6` or `dws6-com` project
3. Verify deployment status

---

### 2. Check DNS Records

**Action:** Verify DNS records point to Cloudflare Pages

**Expected DNS Records for dws6.com:**
```
Type    Name    Content
CNAME   @       dws6.pages.dev
CNAME   www     dws6.pages.dev
```

**How to Check:**
1. Go to: https://dash.cloudflare.com/
2. Select `dws6.com` domain
3. Go to DNS → Records
4. Verify CNAME records exist

---

### 3. Verify Custom Domain Configuration

**Action:** Check if `dws6.com` is configured as custom domain in Cloudflare Pages

**How to Fix:**
1. Go to Cloudflare Pages dashboard
2. Select `dws6` project
3. Go to "Custom domains"
4. Add `dws6.com` and `www.dws6.com`
5. Wait for DNS propagation (5-10 minutes)

---

### 4. Check Build Configuration

**Current wrangler.toml:**
```toml
name = "dws6-dashboard"
type = "javascript"
account_id = ""  # ❌ EMPTY - needs to be filled
zone_id = ""     # ❌ EMPTY - needs to be filled

[build]
cwd = "dws6.com"
command = "echo 'Build complete'"
```

**Issue:** `account_id` and `zone_id` are empty

**How to Fix:**
1. Get Account ID from Cloudflare dashboard (right sidebar)
2. Get Zone ID from DNS settings page
3. Update `wrangler.toml` with correct values

---

### 5. Alternative: Create New Cloudflare Pages Project

If no project exists, create one:

**Steps:**
1. Go to: https://dash.cloudflare.com/pages
2. Click "Create a project"
3. Connect to GitHub repository: `blogtheristo/dws6`
4. **Build settings:**
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `landing-pages/dws6-com`
   - Root directory: `/`
5. Click "Save and Deploy"
6. Add custom domain: `dws6.com`

---

### 6. Verify GitHub Actions Sync

**Action:** Check if sync workflow is running

**How to Check:**
1. Go to: https://github.com/blogtheristo/dws6/actions
2. Look for "Sync DWS6.com Landing Pages" workflow
3. Verify it runs on push to main
4. Check if `landing-pages/dws6-com/` is being updated

---

## Quick Fixes

### Fix 1: Manual Deployment Test
```bash
# Navigate to dws6.com folder
cd "D:\Proton\My files\2026\Repos2026\dws6\dws6.com"

# Test if index.html opens locally
start index.html
```

### Fix 2: Force Sync Workflow
```bash
# Trigger sync workflow manually
gh workflow run sync-dws6-landing-pages.yml
```

### Fix 3: Update wrangler.toml
```bash
# Get Cloudflare credentials
# Then update wrangler.toml with:
# - account_id
# - zone_id
```

---

## Most Likely Issues

### Issue 1: No Cloudflare Pages Project
**Symptom:** dws6.com shows "This site can't be reached"  
**Fix:** Create new Cloudflare Pages project (see step 5 above)

### Issue 2: DNS Not Configured
**Symptom:** dws6.com shows "DNS_PROBE_FINISHED_NXDOMAIN"  
**Fix:** Add CNAME records pointing to Cloudflare Pages (see step 2 above)

### Issue 3: Custom Domain Not Added
**Symptom:** `dws6.pages.dev` works but `dws6.com` doesn't  
**Fix:** Add custom domain in Cloudflare Pages settings (see step 3 above)

---

## Next Steps

1. ✅ **Check Cloudflare Pages dashboard** - Does `dws6` project exist?
2. ✅ **Verify DNS records** - Are CNAME records configured?
3. ✅ **Check custom domain** - Is `dws6.com` added to Pages project?
4. ✅ **Update wrangler.toml** - Add account_id and zone_id
5. ✅ **Test deployment** - Push a small change and verify it deploys

---

## Success Criteria

✅ `https://dws6.com` loads successfully  
✅ `https://dws6.com/login` shows login page  
✅ `https://dws6.com/dashboard/v9` shows V9 dashboard  
✅ All 11 service login pages accessible  

---

## Contact Information

**Cloudflare Dashboard:** https://dash.cloudflare.com/  
**GitHub Actions:** https://github.com/blogtheristo/dws6/actions  
**Repository:** https://github.com/blogtheristo/dws6  

---

**Last Updated:** December 30, 2025  
**Status:** 🔴 Needs Investigation
