# How to Purge Cloudflare Cache

## Quick Steps

### Method 1: Purge Everything (Recommended for immediate updates)

1. **Go to Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com
   - Log in with your Cloudflare account

2. **Select Your Domain**
   - Click on `dws10.com` or `onelifetime.world` from the domain list

3. **Navigate to Caching**
   - Left sidebar → Click **"Caching"**
   - Then click **"Configuration"**

4. **Purge Cache**
   - Scroll down to **"Purge Cache"** section
   - Click **"Purge Everything"** button
   - Confirm the action

**Time to take effect:** Usually instant, but can take up to 30 seconds globally

---

### Method 2: Purge Specific Files (More Targeted)

1. **Same steps 1-3 as above**

2. **Custom Purge**
   - Under "Purge Cache", select **"Custom purge"** tab
   - Enter URLs (one per line):
     ```
     https://dws10.com/*
     https://onelifetime.world/*
     https://dws10.com/images/*
     https://onelifetime.world/images/*
     ```
   - Click **"Purge"**

---

### Method 3: Using Cloudflare API (Advanced)

If you have API tokens set up, you can purge via command line:

```bash
# Get your Zone ID from Cloudflare dashboard (domain overview page)
# Get API token from: https://dash.cloudflare.com/profile/api-tokens

curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

---

## When to Purge

Purge cache when:
- ✅ You've updated HTML/CSS/JS files
- ✅ You've added new images or media
- ✅ Content changes aren't appearing
- ✅ After deploying new features

**Note:** Cloudflare Browser Cache TTL is set to 4 hours, so changes may take up to 4 hours to appear naturally. Purging forces immediate updates.

---

## Verify Cache is Purged

After purging:
1. Open your site in an incognito/private browser window
2. Or use hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
3. Check that new images/video appear

---

## Troubleshooting

**If images still don't appear:**
- Check image paths are correct in HTML
- Verify images are committed and pushed to GitHub
- Wait 1-2 minutes after purge (propagation time)
- Clear your browser cache: `Ctrl+Shift+Delete`

**If video doesn't load:**
- Check YouTube embed URL is correct
- Verify iframe code is properly formatted
- Check browser console for errors (F12)

