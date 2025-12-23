# Cloudflare API Token Setup - Quick Guide

**Last Updated:** January 2026

---

## Do You Need It?

**Cache purge is OPTIONAL** - Your sites will still deploy automatically without it.

- ✅ **With token:** Changes appear globally in ~30 seconds
- ⏳ **Without token:** Changes appear within 4 hours (cache expires naturally)

---

## Quick Setup (5 minutes)

### Step 1: Create Cloudflare API Token

1. Go to: **https://dash.cloudflare.com/profile/api-tokens**
2. Click **"Create Token"**
3. Click **"Use template"** → Select **"Edit zone DNS"**
4. Under **"Zone Resources"**, add both zones:
   - Include → Specific zone → `dws10.com`
   - Include → Specific zone → `onelifetime.world`
5. Under **"Permissions"**, make sure you have:
   - Zone → Zone Settings → Read ✅
   - Zone → Zone → Read ✅
   - Zone → Cache Purge → Edit ✅
6. Click **"Continue to summary"** → **"Create Token"**
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Add to GitHub Secrets

1. Go to: **https://github.com/blogtheristo/dws6/settings/secrets/actions**
2. Click **"New repository secret"**
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: (paste token from Step 1)
5. Click **"Add secret"**

### Step 3: Verify Zone IDs (if not already set)

Check that these secrets exist:
- `CLOUDFLARE_ZONE_ID_DWS10` = `3d1ee683d9436a21b2211002f5a16832`
- `CLOUDFLARE_ZONE_ID_ONELIFETIME` = `409f65ed2f9a97e329acbfe3887a629b`

If missing, add them as new repository secrets.

---

## Test It Works

1. Make a small change to `dws10.com/index.html`
2. Commit and push:
   ```bash
   git add dws10.com/index.html
   git commit -m "Test cache purge"
   git push origin main
   ```
3. Check Actions: https://github.com/blogtheristo/dws6/actions
4. Look for "Purge Cloudflare Cache" workflow
5. Check logs - should see "Purging Cloudflare cache..." messages

---

## Troubleshooting

### Workflow shows "skipping cache purge"
- Token is missing or empty
- This is OK - sites still deploy, just slower cache refresh

### Workflow fails with "401 Unauthorized"
- Token is invalid or expired
- Create a new token and update the secret

### Workflow fails with "403 Forbidden"
- Token doesn't have correct permissions
- Make sure token has "Cache Purge → Edit" permission

---

## Current Status

Your workflow is configured to:
- ✅ Skip cache purge gracefully if token is missing
- ✅ Still deploy sites automatically
- ✅ Work with or without the token

**Bottom line:** Token is optional but recommended for faster updates.

