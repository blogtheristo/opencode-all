# Site Deployment Analysis & Recommendations

**Date:** January 2026  
**Issue:** Duplicate folder structure and workflow review

---

## Current Situation

### Folder Structure (DUPLICATE)

You currently have **two sets of folders** with site content:

1. **Root-level folders** (source files):
   - `dws10.com/` → Contains full marketing site HTML
   - `onelifetime.world/` → Contains community site HTML

2. **Landing-pages folders** (deployment files):
   - `landing-pages/dws10-com/` → Contains simplified landing page HTML
   - `landing-pages/onelifetime-world/` → Contains community site HTML

### Current Workflows

1. **`sync-landing-pages.yml`** ✅ (Partially working)
   - Syncs `dws10.com/index.html` → `landing-pages/dws10-com/index.html`
   - **MISSING:** No sync for `onelifetime.world/` → `landing-pages/onelifetime-world/`
   - Only triggers on `dws10.com/**` changes

2. **`purge-cloudflare-cache.yml`** ⚠️ (May not be needed)
   - Purges Cloudflare cache when files change
   - **Note:** This is **cache purge**, not DNS purge (DNS purge doesn't exist)
   - Cloudflare Pages auto-deploys on git push, so cache purge might be redundant

---

## What Cloudflare Pages Actually Deploys

**Question:** Which folders does Cloudflare Pages deploy from?

**Answer:** You need to check your Cloudflare Pages dashboard:
1. Go to: https://dash.cloudflare.com → Pages
2. Check each site's build configuration:
   - `dws10.com` → What's the "Root directory"?
   - `onelifetime.world` → What's the "Root directory"?

**Most likely scenario:**
- Cloudflare Pages deploys from `landing-pages/dws10-com/` and `landing-pages/onelifetime-world/`
- The root folders (`dws10.com/` and `onelifetime.world/`) are source files that get synced

---

## Recommendations

### Option 1: Keep Two Folders (Current Setup) ✅ RECOMMENDED

**Pros:**
- Separation of source (root) and deployment (landing-pages)
- Can have different content in source vs deployment
- Clear workflow: edit root → sync → deploy

**Cons:**
- More complex
- Need to maintain sync workflow
- Easy to forget to sync

**Action Items:**
1. ✅ Fix sync workflow to include `onelifetime.world`
2. ✅ Keep cache purge workflow (it's useful for immediate updates)
3. ✅ Document which folder to edit

### Option 2: Consolidate to One Folder (Simpler)

**Pros:**
- Simpler structure
- No sync needed
- Less confusion

**Cons:**
- Lose separation of concerns
- Need to update Cloudflare Pages config

**Action Items:**
1. Choose ONE folder structure (recommend `landing-pages/`)
2. Delete root folders OR move everything to root
3. Update Cloudflare Pages build config
4. Remove sync workflow

---

## What Needs to Be Fixed

### 1. Missing Sync for onelifetime.world

The `sync-landing-pages.yml` workflow only syncs `dws10.com`, not `onelifetime.world`.

**Fix:** Add sync step for `onelifetime.world/` → `landing-pages/onelifetime-world/`

### 2. Cache Purge Workflow Clarification

**Important:** The workflow is called "Purge Cloudflare Cache" - this is **NOT DNS purge**. It's cache purge, which is useful because:
- Cloudflare Pages auto-deploys on git push
- But cached content might still show old version
- Cache purge forces immediate refresh

**Recommendation:** Keep it, but rename to clarify it's cache purge, not DNS.

---

## Automatic Site Updates Status

### ✅ What Works:
1. **Git push → Cloudflare Pages auto-deploy** (if configured correctly)
2. **Sync workflow** (for dws10.com only)
3. **Cache purge** (forces immediate refresh)

### ❌ What's Broken:
1. **Sync workflow missing onelifetime.world**
2. **Unclear which folder Cloudflare Pages deploys from**

---

## Next Steps

1. **Check Cloudflare Pages configuration** to see which folders are deployed
2. **Fix sync workflow** to include onelifetime.world
3. **Decide:** Keep two folders or consolidate to one
4. **Document** which folder to edit for each site

---

## Questions to Answer

1. **Which folder does Cloudflare Pages deploy from?**
   - Check: https://dash.cloudflare.com → Pages → [site] → Settings → Builds & deployments

2. **Do you want to keep two folders or consolidate?**
   - Two folders = more control, more complexity
   - One folder = simpler, less control

3. **Do you actually edit files in root folders or landing-pages folders?**
   - This determines which should be the "source of truth"

