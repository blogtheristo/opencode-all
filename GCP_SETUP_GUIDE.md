# Google Cloud Platform Setup Guide

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Google Cloud account (sign up at https://cloud.google.com)
- [ ] GitHub repository with `GROQ_API_KEY` secret configured
- [ ] Domain `dws6.com` (for api.dws6.com subdomain)
- [ ] Basic familiarity with command line

---

## Step 1: Create Google Cloud Project

### Option A: Using Google Cloud Console (Web UI)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Enter:
   - **Project Name:** `DWS IQ Pilot`
   - **Project ID:** `dws-iq-pilot` (or your preferred ID)
4. Click "Create"
5. Wait for project creation (30-60 seconds)

### Option B: Using gcloud CLI

```bash
# Install Google Cloud SDK if not installed
# Windows: https://cloud.google.com/sdk/docs/install
# Mac: brew install google-cloud-sdk
# Linux: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create project
gcloud projects create dws-iq-pilot --name="DWS IQ Pilot"

# Set as default project
gcloud config set project dws-iq-pilot
```

---

## Step 2: Enable Billing (Required for Cloud Run)

**Note:** Cloud Run requires billing to be enabled, but you can use the free tier ($300 credit for new accounts).

1. Go to [Billing](https://console.cloud.google.com/billing)
2. Click "Link a billing account"
3. Create new billing account or link existing one
4. Link to project `dws-iq-pilot`

**Free Tier:** New Google Cloud accounts get $300 free credit valid for 90 days.

---

## Step 3: Enable Required APIs

### Using Console:
1. Go to [APIs & Services](https://console.cloud.google.com/apis/library)
2. Enable each of these APIs:
   - **Cloud Run API** (`run.googleapis.com`)
   - **Container Registry API** (`containerregistry.googleapis.com`)
   - **Cloud Build API** (`cloudbuild.googleapis.com`)
   - **Secret Manager API** (`secretmanager.googleapis.com`)

### Using gcloud CLI:
```bash
gcloud services enable \
  run.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled
```

---

## Step 4: Create Service Account for GitHub Actions

This allows GitHub Actions to deploy to Cloud Run.

### Using Console:
1. Go to [IAM & Admin → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Enter:
   - **Name:** `github-actions-deployer`
   - **Description:** `Service account for GitHub Actions deployments`
4. Click "Create and Continue"
5. Grant roles:
   - `Cloud Run Admin` (to deploy services)
   - `Service Account User` (to use service accounts)
   - `Secret Manager Secret Accessor` (to read secrets)
   - `Storage Admin` (to push Docker images)
6. Click "Done"

### Create and Download Key:
1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON"
5. Download the key file
6. **IMPORTANT:** Save this file securely - you'll need it for GitHub Secrets

### Using gcloud CLI:
```bash
# Create service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=dws-iq-pilot

# Grant required roles
gcloud projects add-iam-policy-binding dws-iq-pilot \
  --member="serviceAccount:github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding dws-iq-pilot \
  --member="serviceAccount:github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

gcloud projects add-iam-policy-binding dws-iq-pilot \
  --member="serviceAccount:github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding dws-iq-pilot \
  --member="serviceAccount:github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Create and download key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com

# The key file will be saved as github-actions-key.json
```

---

## Step 5: Configure GitHub Secrets

Go to your GitHub repository: `https://github.com/blogtheristo/dws6`

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these secrets:

### Required Secrets:

| Secret Name | Value | How to Get |
|------------|-------|------------|
| `GROQ_API_KEY` | Your Groq API key (starts with `gsk_`) | Get from https://console.groq.com/keys |
| `GCP_SA_KEY` | Contents of the JSON key file from Step 4 | Open `github-actions-key.json` and copy entire contents |

**To add GCP_SA_KEY:**
1. Open the downloaded `github-actions-key.json` file
2. Copy the entire JSON content (all of it)
3. Paste into GitHub secret `GCP_SA_KEY`

**Example GCP_SA_KEY format:**
```json
{
  "type": "service_account",
  "project_id": "dws-iq-pilot",
  "private_key_id": "...",
  ...
}
```

---

## Step 6: Verify Setup

### Check GitHub Secrets:
- [ ] `GROQ_API_KEY` is set
- [ ] `GCP_SA_KEY` is set

### Check GCP:
```bash
# Verify project is set
gcloud config get-value project
# Should output: dws-iq-pilot

# Verify APIs are enabled
gcloud services list --enabled | grep -E "run|containerregistry|cloudbuild|secretmanager"

# Verify service account exists
gcloud iam service-accounts list | grep github-actions-deployer
```

---

## Step 7: Test Deployment (Optional)

Once everything is set up, you can test the deployment:

### Option A: Using GitHub Actions
1. Push any change to `main` branch that modifies `AgentFoundry/services/groq-router-mvp/`
2. Go to **Actions** tab in GitHub
3. Watch the "Deploy DWS6 Pilot to Cloud Run" workflow run
4. Check for any errors

### Option B: Manual Deployment (Local)
```bash
# Make scripts executable (Linux/Mac)
chmod +x scripts/setup_gcp.sh
chmod +x scripts/deploy.sh

# Run setup script
./scripts/setup_gcp.sh

# Deploy service
./scripts/deploy.sh
```

---

## Troubleshooting

### Issue: "Permission denied" errors
**Solution:** Check service account has correct roles:
```bash
gcloud projects get-iam-policy dws-iq-pilot \
  --flatten="bindings[].members" \
  --filter="bindings.members:github-actions-deployer*"
```

### Issue: "API not enabled" errors
**Solution:** Enable the missing API:
```bash
gcloud services enable <api-name>
```

### Issue: "Billing not enabled"
**Solution:** Enable billing in Google Cloud Console:
1. Go to [Billing](https://console.cloud.google.com/billing)
2. Link billing account to project

### Issue: "Secret not found" in GitHub Actions
**Solution:** 
1. Verify secret name is exactly `GROQ_API_KEY` (case-sensitive)
2. Verify secret is set in repository settings
3. Check workflow file uses `${{ secrets.GROQ_API_KEY }}`

### Issue: "Service account key invalid"
**Solution:**
1. Regenerate service account key
2. Update `GCP_SA_KEY` secret in GitHub
3. Ensure entire JSON content is copied (no truncation)

---

## Next Steps After Setup

Once GCP is configured:

1. ✅ **Deploy via GitHub Actions:**
   - Push changes to trigger automatic deployment
   - Monitor workflow in Actions tab

2. ✅ **Verify Deployment:**
   ```bash
   # Get service URL
   gcloud run services describe groq-agent-router-mvp \
     --region europe-north1 \
     --format 'value(status.url)'
   
   # Test health endpoint
   curl https://your-service-url.run.app/health
   ```

3. ✅ **Set up Custom Domain (Optional):**
   ```bash
   gcloud run domain-mappings create \
     --service groq-agent-router-mvp \
     --domain api.dws6.com \
     --region europe-north1
   ```

---

## Cost Estimate

**Free Tier (First 90 days):**
- Cloud Run: 2 million requests/month free
- Secret Manager: Free tier included
- Container Registry: 0.5 GB storage free
- **Total: €0/month**

**After Free Tier:**
- Cloud Run: ~€5-10/month (for pilot usage)
- Secret Manager: €0.06 per secret version
- Container Registry: €0.026 per GB/month
- **Estimated: €5-15/month**

---

## Quick Reference

**Project ID:** `dws-iq-pilot`  
**Region:** `europe-north1` (Finland)  
**Service Name:** `groq-agent-router-mvp`  
**Port:** `8083`  
**GitHub Workflow:** `.github/workflows/deploy-pilot.yml`

**Useful Commands:**
```bash
# Set project
gcloud config set project dws-iq-pilot

# List services
gcloud run services list --region europe-north1

# View logs
gcloud run services logs read groq-agent-router-mvp --region europe-north1

# Delete service (if needed)
gcloud run services delete groq-agent-router-mvp --region europe-north1
```

---

## Support

If you encounter issues:
1. Check [Google Cloud Documentation](https://cloud.google.com/docs)
2. Review workflow logs in GitHub Actions
3. Check GCP logs: `gcloud run services logs read`
4. Verify all prerequisites are met

