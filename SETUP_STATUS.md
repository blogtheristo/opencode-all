# DWS6 Setup Status

## Current Status: 🔄 Deployment (Artifact Registry Migration)

### ✅ Completed
- [x] GitHub repository configured
- [x] `GROQ_API_KEY` GitHub secret configured
- [x] `GCP_SA_KEY` GitHub secret configured
- [x] Deployment workflow created (`.github/workflows/deploy-pilot.yml`)
- [x] Application code ready (`AgentFoundry/services/groq-router-mvp/`)
- [x] Google Cloud Project created (`dws-iq-pilot`)
- [x] GCP APIs enabled (including Artifact Registry)
- [x] Service account created (`github-actions-deployer`)
- [x] **Migrated to Artifact Registry (`dws-containers`)**

### ⚠️ Pending Verification
- [ ] Billing enabled (required for Cloud Run) - **Verify in GCP Console**
- [ ] Deployment Success (Green check in GitHub Actions)

---

## Next Steps (After Deployment)

1. **Get Service URL:**
   Check GitHub Actions logs or run:
   ```bash
   gcloud run services list --region europe-north1
   ```

2. **Test Health Endpoint:**
   ```bash
   curl https://<YOUR-SERVICE-URL>/health
   ```

3. **Run Agent Tests:**
   ```bash
   # Update API_URL in scripts/test_agents.sh first
   ./scripts/test_agents.sh
   ```

---

## Troubleshooting Deployment

If deployment fails again:
1. **Check Billing:** Cloud Run requires an active billing account.
2. **Check APIs:** Ensure `artifactregistry.googleapis.com` is enabled.
3. **Check Permissions:** Ensure `github-actions-deployer` has `Artifact Registry Writer` or `Storage Admin` roles.

---

## Quick Start: Set Up Google Cloud

**Follow the step-by-step guide:** [`GCP_SETUP_GUIDE.md`](./GCP_SETUP_GUIDE.md)

### Minimum Steps Required:

1. **Create GCP Project** (5 minutes)
   ```bash
   gcloud projects create dws-iq-pilot --name="DWS IQ Pilot"
   gcloud config set project dws-iq-pilot
   ```

2. **Enable Billing** (2 minutes)
   - Go to [Google Cloud Console](https://console.cloud.google.com/billing)
   - Link billing account (free $300 credit available)

3. **Enable APIs** (2 minutes)
   ```bash
   gcloud services enable \
     run.googleapis.com \
     artifactregistry.googleapis.com \
     cloudbuild.googleapis.com \
     secretmanager.googleapis.com
   ```

4. **Create Service Account** (5 minutes)
   ```bash
   gcloud iam service-accounts create github-actions-deployer \
     --display-name="GitHub Actions Deployer"
   
   # Grant roles (see GCP_SETUP_GUIDE.md for full list)
   gcloud projects add-iam-policy-binding dws-iq-pilot \
     --member="serviceAccount:github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   ```

5. **Create and Download Key** (2 minutes)
   ```bash
   gcloud iam service-accounts keys create github-actions-key.json \
     --iam-account=github-actions-deployer@dws-iq-pilot.iam.gserviceaccount.com
   ```

6. **Add GitHub Secret** (2 minutes)
   - Go to: https://github.com/blogtheristo/dws6/settings/secrets/actions
   - Add secret: `GCP_SA_KEY` = contents of `github-actions-key.json`

**Total Time:** ~20 minutes

---

## After Setup

Once GCP is configured:

1. **Test Deployment:**
   - Push any change to `main` branch
   - GitHub Actions will automatically deploy
   - Check Actions tab for status

2. **Verify Service:**
   ```bash
   gcloud run services list --region europe-north1
   curl https://your-service-url.run.app/health
   ```

---

## Documentation

- **Full Setup Guide:** [`GCP_SETUP_GUIDE.md`](./GCP_SETUP_GUIDE.md)
- **Implementation Details:** [`GROQ_API_KEY_IMPLEMENTATION.md`](./GROQ_API_KEY_IMPLEMENTATION.md)
- **Pilot Plan:** [`GOOGLE_CLOUD_PILOT_PLAN.md`](./GOOGLE_CLOUD_PILOT_PLAN.md)

---

## Need Help?

If you encounter issues during setup:
1. Check `GCP_SETUP_GUIDE.md` troubleshooting section
2. Review GitHub Actions workflow logs
3. Verify all prerequisites are met
