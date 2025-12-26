# Deploy Partners Page to https://onelifetime.world

## Current Status

✅ **Partners page created**: `onelifetime.world/Partners/index.html`  
✅ **Navigation updated**: Homepage dropdown links to `/Partners/`  
⏳ **Needs deployment**: Commit → Push to GitHub → Cloudflare Pages auto-deploys

## Quick Deploy (2 Commands)

### Step 1: Commit and Push

Open PowerShell in the dws6 repo root:

```powershell
cd "D:\Proton\My files\2026\Repos2026\dws6"

# Add all Partners files
git add onelifetime.world/Partners/
git add onelifetime.world/index.html
git add Partners/

# Commit
git commit -m "feat: Add DWS6 Partners & Consortium page with strong legal positioning

- Created comprehensive Partners page at /Partners/
- Updated navigation dropdown to link to Partners page
- Added 5-tier partnership model (Consortium Member, Platinum, Gold, Silver, Membership)
- Included legal positioning, onboarding timeline, and requirements
- Professional design matching site theme"

# Push to GitHub
git push origin main
```

### Step 2: Wait for Auto-Deploy

Cloudflare Pages will automatically:
1. Detect the push to GitHub (webhook trigger)
2. Deploy the static files to https://onelifetime.world
3. **Time**: ~30 seconds to 2 minutes (static HTML, no build needed)

## Verify Deployment

Once deployed, test:

1. **Visit**: https://onelifetime.world/
2. **Hover**: "Solutions" dropdown
3. **Click**: "Partner Consortium"
4. **Opens**: https://onelifetime.world/Partners/

## What Gets Deployed

The Partners page includes:
- ✅ Quick overview comparison table (5 tiers)
- ✅ Consortium Member tier for corporate customers
- ✅ Detailed partnership levels with specific benefits
- ✅ Partner requirements & obligations
- ✅ 6-week onboarding timeline
- ✅ Corporate customer path (8-12 weeks)
- ✅ Legal & governance documentation
- ✅ Contact information
- ✅ Professional design matching site theme

## Cloudflare Pages Settings

**Current setup** (from `next.config.js`):
- **Framework**: Next.js (static export)
- **Build command**: `npm run build` (or `npm ci && npm run build`)
- **Build output**: `out/`
- **Root directory**: `onelifetime.world/`

The Partners page at `onelifetime.world/Partners/index.html` will be included in the build output automatically.

## Troubleshooting

### If Partners page doesn't appear after deploy:

1. **Check Cloudflare Pages build log**:
   - Go to Cloudflare Dashboard → Pages → onelifetime-world
   - Click latest deployment
   - Check build logs for errors

2. **Verify build output includes Partners folder**:
   - Build log should show: `out/Partners/index.html`

3. **Clear Cloudflare cache** (if needed):
   - Cloudflare Dashboard → Caching → Purge Everything

### If navigation still doesn't work:

The navigation is already correct in `onelifetime.world/index.html`:
```html
<a href="/Partners/" ...>Partner Consortium</a>
```

This will work on the live site (https://onelifetime.world) automatically.

## Alternative: Manual Upload (If Git Push Doesn't Work)

If you can't push to GitHub, you can manually upload via Cloudflare Pages:

1. Build locally:
   ```powershell
   cd "D:\Proton\My files\2026\Repos2026\dws6\onelifetime.world"
   npm run build
   ```

2. Upload `out/` folder to Cloudflare Pages:
   - Cloudflare Dashboard → Pages → onelifetime-world
   - Create deployment → Upload assets
   - Drag the `out/` folder

---

## Summary

**To publish the Partners page to https://onelifetime.world:**

```powershell
# In the dws6 repo root:
git add onelifetime.world/Partners/index.html onelifetime.world/index.html Partners/
git commit -m "Add DWS6 Partners & Consortium page"
git push origin main
```

**Wait 2-5 minutes** → Cloudflare auto-deploys → https://onelifetime.world/Partners/ is live!

