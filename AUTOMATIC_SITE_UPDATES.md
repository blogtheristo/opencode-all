# Automatic Site Updates - How It Works

**Last Updated:** January 2026

---

## ✅ Setup Complete

Your sites automatically update when you edit files in the root folders. Here's how:

---

## Workflow Overview

```
You edit files in root folders
    ↓
Sync workflow copies to landing-pages/
    ↓
Cloudflare Pages auto-deploys
    ↓
Cache purge forces immediate refresh
    ↓
Sites updated globally in ~30 seconds
```

---

## Folder Structure

### Root Folders (Edit Here) ✏️
- `dws10.com/` - Source files for dws10.com
- `onelifetime.world/` - Source files for onelifetime.world

### Landing Pages Folders (Auto-Synced) 🔄
- `landing-pages/dws10-com/` - Deployment files (auto-synced)
- `landing-pages/onelifetime-world/` - Deployment files (auto-synced)

**Important:** Cloudflare Pages deploys from `landing-pages/` folders.

---

## How to Update Sites

### Step 1: Edit Files in Root Folders
Edit any files in:
- `dws10.com/` (for dws10.com site)
- `onelifetime.world/` (for onelifetime.world site)

### Step 2: Commit and Push
```bash
git add dws10.com/ onelifetime.world/
git commit -m "Update site content"
git push origin main
```

### Step 3: Automatic Updates Happen
1. **Sync Workflow** runs automatically
   - Copies all files from root → landing-pages
   - Commits changes with `[skip ci]` to prevent loops

2. **Cloudflare Pages** auto-deploys
   - Detects changes in `landing-pages/`
   - Builds and deploys automatically

3. **Cache Purge** runs automatically
   - Forces immediate cache refresh
   - Changes visible globally in ~30 seconds

---

## What Gets Synced

The sync workflow copies **all files** from root folders to landing-pages:
- `index.html` ✅
- CSS files ✅
- Images ✅
- Any other files you add ✅

---

## Workflows

### 1. Sync Landing Pages (`sync-landing-pages.yml`)
**Triggers when:**
- Files change in `dws10.com/**`
- Files change in `onelifetime.world/**`
- Logo images change (`DWS_IQ2026.png`, `Firehorse2026.png`)

**What it does:**
- Copies all files from root folders to landing-pages folders
- Commits changes automatically
- Skips if last commit was auto-sync (prevents loops)

### 2. Purge Cloudflare Cache (`purge-cloudflare-cache.yml`)
**Triggers when:**
- Files change in root folders
- Files change in landing-pages folders
- Images change

**What it does:**
- Purges Cloudflare cache for both sites
- Forces immediate refresh globally

---

## Testing the Workflow

1. Make a small change to `dws10.com/index.html`
2. Commit and push:
   ```bash
   git add dws10.com/index.html
   git commit -m "Test automatic sync"
   git push origin main
   ```
3. Check GitHub Actions:
   - Go to: https://github.com/blogtheristo/dws6/actions
   - You should see "Sync Landing Pages" workflow running
   - Then "Purge Cloudflare Cache" workflow running
4. Check your site:
   - Visit https://dws10.com
   - Changes should appear within 30-60 seconds

---

## Troubleshooting

### Changes not appearing?
1. Check GitHub Actions logs:
   - https://github.com/blogtheristo/dws6/actions
   - Look for errors in sync workflow

2. Verify Cloudflare Pages deployment:
   - Go to: https://dash.cloudflare.com → Pages
   - Check deployment status for each site

3. Check Cloudflare Pages build config:
   - Root directory should be `landing-pages/dws10-com/` (or `onelifetime-world/`)
   - Build command: (empty or `echo "No build needed"`)
   - Output directory: `/` (or `.`)

### Sync workflow not running?
- Make sure you're pushing to `main` branch
- Check that files are actually in `dws10.com/` or `onelifetime.world/`
- Verify workflow file exists: `.github/workflows/sync-landing-pages.yml`

### Cache purge failing?
- Check GitHub secrets are set:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ZONE_ID_DWS10`
  - `CLOUDFLARE_ZONE_ID_ONELIFETIME`
- See: `CLOUDFLARE_SECRETS.md` for setup instructions

---

## Summary

✅ **Edit files in root folders** (`dws10.com/`, `onelifetime.world/`)  
✅ **Commit and push**  
✅ **Sites update automatically**  
✅ **No manual steps needed**

The workflow handles everything automatically!

