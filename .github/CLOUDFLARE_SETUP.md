# Cloudflare Cache Purge - GitHub Actions Setup

This workflow automatically purges Cloudflare cache whenever you push changes to your sites.

## Setup Instructions

### Step 1: Get Your Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use **"Edit zone DNS"** template, or create custom token with:
   - **Permissions:**
     - Zone → Zone Settings → Read
     - Zone → Zone → Read
     - Zone → Cache Purge → Edit
   - **Zone Resources:**
     - Include → Specific zone → `dws10.com`
     - Include → Specific zone → `onelifetime.world`
4. Click **"Continue to summary"** → **"Create Token"**
5. **Copy the token** (you won't see it again!)

### Step 2: Get Your Zone IDs

1. Go to: https://dash.cloudflare.com
2. Click on `dws10.com` domain
3. Scroll down on the overview page
4. Find **"Zone ID"** in the right sidebar → Copy it
5. Repeat for `onelifetime.world`

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/blogtheristo/dws6
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** and add:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (paste your API token from Step 1)

   **Secret 2:**
   - Name: `CLOUDFLARE_ZONE_ID_DWS10`
   - Value: (paste Zone ID for dws10.com from Step 2)

   **Secret 3:**
   - Name: `CLOUDFLARE_ZONE_ID_ONELIFETIME`
   - Value: (paste Zone ID for onelifetime.world from Step 2)

### Step 4: Test the Workflow

1. Make a small change to any file in `dws10.com/` or `onelifetime.world/`
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test Cloudflare cache purge"
   git push origin main
   ```
3. Go to: https://github.com/blogtheristo/dws6/actions
4. You should see "Purge Cloudflare Cache" workflow running
5. Check the logs to confirm cache was purged

## How It Works

- **Triggers:** Automatically runs when you push changes to:
  - `dws10.com/**` files
  - `onelifetime.world/**` files
  - `landing-pages/**` files
  - `images/**` files

- **Manual Trigger:** You can also manually trigger it:
  - Go to Actions tab → "Purge Cloudflare Cache" → "Run workflow"

## Troubleshooting

**Workflow fails:**
- Check that API token has correct permissions
- Verify Zone IDs are correct
- Check GitHub Actions logs for error messages

**Cache not purging:**
- Verify secrets are set correctly in GitHub
- Check Cloudflare API token hasn't expired
- Wait 30-60 seconds after workflow completes

**Want to purge only specific files?**
Edit the workflow to use `purge_by_urls` instead of `purge_everything`:
```json
{"files":["https://dws10.com/index.html","https://onelifetime.world/index.html"]}
```

